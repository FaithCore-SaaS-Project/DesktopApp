import { app, BrowserWindow, ipcMain, dialog, Notification } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { initDatabase, dbOperations } from './database';
import { initAutoUpdater } from './autoUpdater';
import serve from 'electron-serve';

// Resolve the renderer's static export directory.
// In a packaged app, asarUnpack extracts it to app.asar.unpacked/ for direct file access.
const rendererDir = app.isPackaged
  ? path.join(process.resourcesPath, 'app.asar.unpacked', 'src', 'renderer', 'out')
  : path.join(__dirname, '..', '..', 'src', 'renderer', 'out');

const loadURL = serve({ directory: rendererDir });

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  const isDev = !app.isPackaged && process.env.NODE_ENV !== 'production';

  mainWindow = new BrowserWindow({
    width: 1366,
    height: 850,
    minWidth: 1000,
    minHeight: 700,
    show: false, // Wait for ready-to-show to prevent screen flash
    backgroundColor: '#020617', // Slate 950
    titleBarStyle: 'default',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  // Enable seamless loading animation (show window only when content is rendered)
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
    if (isDev) {
      mainWindow?.webContents.openDevTools();
    }
  });

  if (isDev) {
    // Development Environment: Load Next.js dev server
    mainWindow.loadURL('http://localhost:3080');
  } else {
    // Production Environment: Load via electron-serve to fix Next.js routing
    loadURL(mainWindow).catch((err: any) => {
      console.error('[Main] Failed to load via electron-serve:', err);
    });
  }

  // Handle window closing
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Initialize SQLite database
  try {
    initDatabase();
    console.log('[Main] SQLite Database initialized successfully.');
  } catch (err) {
    console.error('[Main] Failed to initialize SQLite database:', err);
  }

  // Initialize Auto Updater
  try {
    initAutoUpdater(mainWindow);
  } catch (err) {
    console.error('[Main] Failed to initialize Auto Updater:', err);
  }
}

// Ensure hardware acceleration is initialized before app launches
app.whenReady().then(() => {
  setupIPCHandlers();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Terminate application when all windows are closed on Windows/Linux
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

function setupIPCHandlers() {
  // --- Notification Channel ---
  ipcMain.on('desktop-notification', (_, { title, body }) => {
    if (Notification.isSupported()) {
      new Notification({ title, body }).show();
    }
  });

  // --- SQLite Database IPC Handlers ---
  ipcMain.handle('db:get-members', async (_, tenantId: string) => {
    try {
      await initDatabase();
      return dbOperations.getMembers(tenantId);
    } catch (err) {
      console.error('[IPC db:get-members] Error:', err);
      throw err;
    }
  });

  ipcMain.handle('db:save-member', async (_, member: any) => {
    try {
      await initDatabase();
      dbOperations.saveMember(member);
      return { success: true };
    } catch (err) {
      console.error('[IPC db:save-member] Error:', err);
      throw err;
    }
  });

  ipcMain.handle('db:delete-member', async (_, id: string) => {
    try {
      await initDatabase();
      dbOperations.deleteMember(id);
      return { success: true };
    } catch (err) {
      console.error('[IPC db:delete-member] Error:', err);
      throw err;
    }
  });

  ipcMain.handle('db:get-finance-records', async (_, tenantId: string) => {
    try {
      await initDatabase();
      return dbOperations.getFinanceRecords(tenantId);
    } catch (err) {
      console.error('[IPC db:get-finance-records] Error:', err);
      throw err;
    }
  });

  ipcMain.handle('db:save-finance-record', async (_, record: any) => {
    try {
      await initDatabase();
      dbOperations.saveFinanceRecord(record);
      return { success: true };
    } catch (err) {
      console.error('[IPC db:save-finance-record] Error:', err);
      throw err;
    }
  });

  ipcMain.handle('db:delete-finance-record', async (_, id: string) => {
    try {
      await initDatabase();
      dbOperations.deleteFinanceRecord(id);
      return { success: true };
    } catch (err) {
      console.error('[IPC db:delete-finance-record] Error:', err);
      throw err;
    }
  });

  // --- Printing and PDF generation IPC Handlers ---
  ipcMain.handle('print:to-pdf', async (event, { htmlContent, fileName }) => {
    try {
      // Choose folder to save PDF
      const { filePath, canceled } = await dialog.showSaveDialog({
        title: 'Save PDF Document',
        defaultPath: path.join(app.getPath('documents'), fileName),
        filters: [{ name: 'Adobe PDF Documents', extensions: ['pdf'] }]
      });

      if (canceled || !filePath) {
        return { success: false, error: 'User canceled PDF saving' };
      }

      // Create a hidden printer-window to render HTML and export to PDF
      const pdfWindow = new BrowserWindow({
        show: false,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          sandbox: true,
        }
      });

      // Injecting custom CSS to make PDF look beautiful (print media rules)
      const styledHtml = `
        <html>
          <head>
            <meta charset="utf-8">
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @media print {
                body {
                  margin: 0;
                  padding: 1.5in;
                  color: #000;
                  background: #fff;
                  -webkit-print-color-adjust: exact;
                }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body class="bg-white text-black font-sans leading-normal">
            ${htmlContent}
          </body>
        </html>
      `;

      await pdfWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(styledHtml));
      
      // Wait for rendering styles/fonts
      await new Promise(resolve => setTimeout(resolve, 500));

      const data = await pdfWindow.webContents.printToPDF({
        printBackground: true,
        margins: {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0
        },
        pageSize: 'A4',
        landscape: false,
      });

      fs.writeFileSync(filePath, data);
      pdfWindow.destroy();

      return { success: true, filePath };
    } catch (err: any) {
      console.error('[IPC print:to-pdf] Error:', err);
      return { success: false, error: err.message || 'Failed to print PDF' };
    }
  });

  ipcMain.handle('print:get-printers', async () => {
    if (!mainWindow) return [];
    try {
      return await mainWindow.webContents.getPrintersAsync();
    } catch (err) {
      console.error('[IPC print:get-printers] Error:', err);
      return [];
    }
  });

  ipcMain.handle('print:direct', async (_, { htmlContent, printerName }) => {
    try {
      const printWindow = new BrowserWindow({
        show: false,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          sandbox: true,
        }
      });

      const styledHtml = `
        <html>
          <head>
            <meta charset="utf-8">
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @media print {
                body { margin: 0; color: #000; background: #fff; }
              }
            </style>
          </head>
          <body class="bg-white text-black font-sans p-6">
            ${htmlContent}
          </body>
        </html>
      `;

      await printWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(styledHtml));
      
      // Wait for rendering
      await new Promise(resolve => setTimeout(resolve, 500));

      await new Promise<void>((resolve, reject) => {
        printWindow.webContents.print(
          {
            silent: !!printerName,
            printBackground: true,
            deviceName: printerName || undefined,
          },
          (success, failureReason) => {
            printWindow.destroy();
            if (success) {
              resolve();
            } else {
              reject(new Error(failureReason || 'Direct printing failed'));
            }
          }
        );
      });

      return { success: true };
    } catch (err: any) {
      console.error('[IPC print:direct] Error:', err);
      return { success: false, error: err.message || 'Direct printing failed' };
    }
  });
}
