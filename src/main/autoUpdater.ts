import { autoUpdater } from 'electron-updater';
import { dialog, BrowserWindow } from 'electron';

// Configure updater logging
autoUpdater.logger = console;

export function initAutoUpdater(mainWindow: BrowserWindow): void {
  // Check for updates every 2 hours
  setInterval(() => {
    autoUpdater.checkForUpdatesAndNotify();
  }, 1000 * 60 * 60 * 2);

  // Initial check on startup after window is shown
  mainWindow.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify().catch((err) => {
      console.error('[AutoUpdater] Error checking for updates on startup:', err);
    });
  });

  autoUpdater.on('checking-for-update', () => {
    console.log('[AutoUpdater] Checking for update...');
  });

  autoUpdater.on('update-available', (info) => {
    console.log('[AutoUpdater] Update available:', info.version);
    mainWindow.webContents.send('updater:available', info.version);
  });

  autoUpdater.on('update-not-available', (info) => {
    console.log('[AutoUpdater] Update not available:', info.version);
  });

  autoUpdater.on('error', (err) => {
    console.error('[AutoUpdater] Error in auto-updater:', err);
  });

  autoUpdater.on('download-progress', (progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    console.log('[AutoUpdater]', log_message);
    mainWindow.webContents.send('updater:progress', progressObj.percent);
  });

  autoUpdater.on('update-downloaded', (info) => {
    console.log('[AutoUpdater] Update downloaded:', info.version);
    
    // Ask user to restart and install update
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Update Ready',
      message: `A new version (${info.version}) has been downloaded. Restart the application to apply the update?`,
      buttons: ['Restart Now', 'Later']
    }).then((result) => {
      if (result.response === 0) {
        autoUpdater.quitAndInstall();
      }
    });
  });
}
