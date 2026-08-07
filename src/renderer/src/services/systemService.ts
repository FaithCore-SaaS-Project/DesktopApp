import api from '../lib/axios';
import { isElectron } from './api';

export const systemService = {
  // --- Printing & PDF Services ---
  printToPDF: async (htmlContent: string, fileName: string): Promise<{ success: boolean; filePath?: string; error?: string }> => {
    if (isElectron()) {
      return window.electronAPI.printToPDF({ htmlContent, fileName });
    } else {
      console.log('PDF export simulated for HTML:', htmlContent);
      window.print();
      return { success: true, filePath: 'SimulatedBrowserPrint' };
    }
  },

  getPrinters: async (): Promise<any[]> => {
    if (isElectron()) {
      return window.electronAPI.getPrinters();
    } else {
      return [
        { name: 'System Default Printer', isDefault: true, status: 0 },
        { name: 'Office DeskJet 4500', isDefault: false, status: 0 },
        { name: 'PDF Virtual Printer', isDefault: false, status: 0 }
      ];
    }
  },

  printDirect: async (htmlContent: string, printerName?: string): Promise<{ success: boolean; error?: string }> => {
    if (isElectron()) {
      return window.electronAPI.printDirect({ htmlContent, printerName });
    } else {
      console.log(`Direct print on ${printerName || 'default printer'} simulated:`, htmlContent);
      window.print();
      return { success: true };
    }
  },

  syncPendingRecords: async (tenantId: string): Promise<{ membersSynced: number; financeSynced: number }> => {
    if (!isElectron()) return { membersSynced: 0, financeSynced: 0 };
    let membersSynced = 0;
    let financeSynced = 0;

    try {
      // 1. Sync pending members
      const localMembers = await window.electronAPI.getMembers(tenantId);
      const pendingMembers = localMembers.filter((m: any) => m.syncStatus === 'pending');

      for (const m of pendingMembers) {
        const nameParts = m.name.trim().split(' ');
        const firstName = nameParts[0] || 'Unknown';
        const lastName = nameParts.slice(1).join(' ') || 'Member';

        await api.post('/members', {
          first_name: firstName,
          last_name: lastName,
          phone: m.phone || '',
          email: m.email || '',
          gender: 'male',
          status: m.status === 'active' ? 'active' : 'inactive',
          membership_date: m.joinedDate || new Date().toISOString().split('T')[0],
          occupation: m.role || '',
          is_baptized: 0,
          marital_status: 'single'
        });

        await window.electronAPI.saveMember({ ...m, syncStatus: 'synced' });
        membersSynced++;
      }

      // 2. Sync pending finance records
      const localFinance = await window.electronAPI.getFinanceRecords(tenantId);
      const pendingFinance = localFinance.filter((f: any) => f.syncStatus === 'pending');

      for (const f of pendingFinance) {
        const endpoint = f.type === 'income' ? '/income' : '/expenses';
        const dateKey = f.type === 'income' ? 'income_date' : 'expense_date';
        
        await api.post(endpoint, {
          category: f.category,
          amount: parseFloat(f.amount),
          description: f.description || '',
          method: f.method || (f.type === 'income' ? 'Cash' : 'Bank Transfer'),
          receipt: f.receipt || '',
          [dateKey]: f.date
        });

        await window.electronAPI.saveFinanceRecord({ ...f, syncStatus: 'synced' });
        financeSynced++;
      }
    } catch (e) {
      console.error('Failed to sync offline records:', e?.message || 'Error occurred');
    }

    return { membersSynced, financeSynced };
  }
};
