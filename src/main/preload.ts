import { contextBridge, ipcRenderer } from 'electron';

export interface FCDesktopAPI {
  getPlatform: () => string;
  sendNotification: (title: string, body: string) => void;
  onTenantChanged: (callback: (tenantId: string) => void) => void;
  
  // Database Operations
  getMembers: (tenantId: string) => Promise<any[]>;
  saveMember: (member: any) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  
  getFinanceRecords: (tenantId: string) => Promise<any[]>;
  saveFinanceRecord: (record: any) => Promise<void>;
  deleteFinanceRecord: (id: string) => Promise<void>;
  
  // Hardware and Native APIs
  printToPDF: (options: { htmlContent: string; fileName: string }) => Promise<{ success: boolean; filePath?: string; error?: string }>;
  getPrinters: () => Promise<any[]>;
  printDirect: (options: { htmlContent: string; printerName?: string }) => Promise<{ success: boolean; error?: string }>;
}

const desktopAPI: FCDesktopAPI = {
  getPlatform: () => process.platform,

  sendNotification: (title: string, body: string) => {
    ipcRenderer.send('desktop-notification', { title, body });
  },

  onTenantChanged: (callback) => {
    ipcRenderer.on('tenant-update', (_, tenantId) => callback(tenantId));
  },

  // Database IPC Invocation
  getMembers: (tenantId) => ipcRenderer.invoke('db:get-members', tenantId),
  saveMember: (member) => ipcRenderer.invoke('db:save-member', member),
  deleteMember: (id) => ipcRenderer.invoke('db:delete-member', id),

  getFinanceRecords: (tenantId) => ipcRenderer.invoke('db:get-finance-records', tenantId),
  saveFinanceRecord: (record) => ipcRenderer.invoke('db:save-finance-record', record),
  deleteFinanceRecord: (id) => ipcRenderer.invoke('db:delete-finance-record', id),

  // Printing & PDF Export IPC Invocation
  printToPDF: (options) => ipcRenderer.invoke('print:to-pdf', options),
  getPrinters: () => ipcRenderer.invoke('print:get-printers'),
  printDirect: (options) => ipcRenderer.invoke('print:direct', options),
};

contextBridge.exposeInMainWorld('electronAPI', desktopAPI);
