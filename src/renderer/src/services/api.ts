import { mockMembers, mockFinanceRecords, mockReceipts, MemberMock, FinanceMock, ReceiptMock } from './mockData';

// Helper to check if running inside Electron
export const isElectron = (): boolean => {
  return typeof window !== 'undefined' && window.electronAPI !== undefined;
};

// Seeding localStorage for browser fallback if not populated
const initializeLocalStorage = () => {
  if (typeof window === 'undefined') return;
  if (!localStorage.getItem('fc_members')) {
    localStorage.setItem('fc_members', JSON.stringify(mockMembers));
  }
  if (!localStorage.getItem('fc_finance')) {
    localStorage.setItem('fc_finance', JSON.stringify(mockFinanceRecords));
  }
  if (!localStorage.getItem('fc_receipts')) {
    localStorage.setItem('fc_receipts', JSON.stringify(mockReceipts));
  }
};

initializeLocalStorage();

export const apiService = {
  // --- E-Receipts API ---
  getReceipts: async (tenantId: string): Promise<ReceiptMock[]> => {
    const receipts = JSON.parse(localStorage.getItem('fc_receipts') || '[]');
    return receipts.filter((r: ReceiptMock) => r.tenantId === tenantId);
  },

  saveReceipt: async (receipt: ReceiptMock): Promise<void> => {
    const receipts = JSON.parse(localStorage.getItem('fc_receipts') || '[]');
    const index = receipts.findIndex((r: ReceiptMock) => r.id === receipt.id);
    if (index >= 0) {
      receipts[index] = receipt;
    } else {
      receipts.push(receipt);
    }
    localStorage.setItem('fc_receipts', JSON.stringify(receipts));
  },

  // --- Members API ---
  getMembers: async (tenantId: string): Promise<MemberMock[]> => {
    if (isElectron()) {
      return window.electronAPI.getMembers(tenantId);
    } else {
      const members = JSON.parse(localStorage.getItem('fc_members') || '[]');
      return members.filter((m: MemberMock) => m.tenantId === tenantId);
    }
  },

  saveMember: async (member: MemberMock): Promise<void> => {
    if (isElectron()) {
      return window.electronAPI.saveMember(member);
    } else {
      const members = JSON.parse(localStorage.getItem('fc_members') || '[]');
      const index = members.findIndex((m: MemberMock) => m.id === member.id);
      if (index >= 0) {
        members[index] = member;
      } else {
        members.push(member);
      }
      localStorage.setItem('fc_members', JSON.stringify(members));
    }
  },

  deleteMember: async (id: string): Promise<void> => {
    if (isElectron()) {
      return window.electronAPI.deleteMember(id);
    } else {
      const members = JSON.parse(localStorage.getItem('fc_members') || '[]');
      const filtered = members.filter((m: MemberMock) => m.id !== id);
      localStorage.setItem('fc_members', JSON.stringify(filtered));
    }
  },

  // --- Finance API ---
  getFinanceRecords: async (tenantId: string): Promise<FinanceMock[]> => {
    if (isElectron()) {
      return window.electronAPI.getFinanceRecords(tenantId);
    } else {
      const records = JSON.parse(localStorage.getItem('fc_finance') || '[]');
      return records.filter((r: FinanceMock) => r.tenantId === tenantId);
    }
  },

  saveFinanceRecord: async (record: FinanceMock): Promise<void> => {
    if (isElectron()) {
      return window.electronAPI.saveFinanceRecord(record);
    } else {
      const records = JSON.parse(localStorage.getItem('fc_finance') || '[]');
      const index = records.findIndex((r: FinanceMock) => r.id === record.id);
      if (index >= 0) {
        records[index] = record;
      } else {
        records.push(record);
      }
      localStorage.setItem('fc_finance', JSON.stringify(records));
    }
  },

  deleteFinanceRecord: async (id: string): Promise<void> => {
    if (isElectron()) {
      return window.electronAPI.deleteFinanceRecord(id);
    } else {
      const records = JSON.parse(localStorage.getItem('fc_finance') || '[]');
      const filtered = records.filter((r: FinanceMock) => r.id !== id);
      localStorage.setItem('fc_finance', JSON.stringify(filtered));
    }
  },

  // --- Printing & PDF Services ---
  printToPDF: async (htmlContent: string, fileName: string): Promise<{ success: boolean; filePath?: string; error?: string }> => {
    if (isElectron()) {
      return window.electronAPI.printToPDF({ htmlContent, fileName });
    } else {
      // Browser Mock print
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
  }
};
