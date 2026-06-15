import { mockMembers, mockFinanceRecords, mockReceipts, mockCategories, mockBankAccounts, mockBudgets, mockLetters, mockCertificates, mockEvents, mockSavedReports, MemberMock, FinanceMock, ReceiptMock, CategoryMock, BankAccountMock, BudgetMock, LetterMock, CertificateMock, EventMock, SavedReportMock } from './mockData';

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
  if (!localStorage.getItem('fc_categories')) {
    localStorage.setItem('fc_categories', JSON.stringify(mockCategories));
  }
  if (!localStorage.getItem('fc_bank_accounts')) {
    localStorage.setItem('fc_bank_accounts', JSON.stringify(mockBankAccounts));
  }
  if (!localStorage.getItem('fc_budgets')) {
    localStorage.setItem('fc_budgets', JSON.stringify(mockBudgets));
  }
  if (!localStorage.getItem('fc_letters')) {
    localStorage.setItem('fc_letters', JSON.stringify(mockLetters));
  }
  if (!localStorage.getItem('fc_certificates')) {
    localStorage.setItem('fc_certificates', JSON.stringify(mockCertificates));
  }
  if (!localStorage.getItem('fc_events')) {
    localStorage.setItem('fc_events', JSON.stringify(mockEvents));
  }
  if (!localStorage.getItem('fc_saved_reports')) {
    localStorage.setItem('fc_saved_reports', JSON.stringify(mockSavedReports));
  }
};

initializeLocalStorage();

export const apiService = {
  // --- Reports API ---
  getSavedReports: async (tenantId: string): Promise<SavedReportMock[]> => {
    const rpts = JSON.parse(localStorage.getItem('fc_saved_reports') || '[]');
    return rpts.filter((r: SavedReportMock) => r.tenantId === tenantId);
  },

  saveSavedReport: async (report: SavedReportMock): Promise<void> => {
    const rpts = JSON.parse(localStorage.getItem('fc_saved_reports') || '[]');
    const index = rpts.findIndex((r: SavedReportMock) => r.id === report.id);
    if (index >= 0) {
      rpts[index] = report;
    } else {
      rpts.push(report);
    }
    localStorage.setItem('fc_saved_reports', JSON.stringify(rpts));
  },

  // --- Events API ---
  getEvents: async (tenantId: string): Promise<EventMock[]> => {
    const evts = JSON.parse(localStorage.getItem('fc_events') || '[]');
    return evts.filter((e: EventMock) => e.tenantId === tenantId);
  },

  saveEvent: async (evt: EventMock): Promise<void> => {
    const evts = JSON.parse(localStorage.getItem('fc_events') || '[]');
    const index = evts.findIndex((e: EventMock) => e.id === evt.id);
    if (index >= 0) {
      evts[index] = evt;
    } else {
      evts.push(evt);
    }
    localStorage.setItem('fc_events', JSON.stringify(evts));
  },

  deleteEvent: async (id: string): Promise<void> => {
    const evts = JSON.parse(localStorage.getItem('fc_events') || '[]');
    const filtered = evts.filter((e: EventMock) => e.id !== id);
    localStorage.setItem('fc_events', JSON.stringify(filtered));
  },

  // --- Certificates API ---
  getCertificates: async (tenantId: string): Promise<CertificateMock[]> => {
    const certs = JSON.parse(localStorage.getItem('fc_certificates') || '[]');
    return certs.filter((c: CertificateMock) => c.tenantId === tenantId);
  },

  saveCertificate: async (cert: CertificateMock): Promise<void> => {
    const certs = JSON.parse(localStorage.getItem('fc_certificates') || '[]');
    const index = certs.findIndex((c: CertificateMock) => c.id === cert.id);
    if (index >= 0) {
      certs[index] = cert;
    } else {
      certs.push(cert);
    }
    localStorage.setItem('fc_certificates', JSON.stringify(certs));
  },

  deleteCertificate: async (id: string): Promise<void> => {
    const certs = JSON.parse(localStorage.getItem('fc_certificates') || '[]');
    const filtered = certs.filter((c: CertificateMock) => c.id !== id);
    localStorage.setItem('fc_certificates', JSON.stringify(filtered));
  },

  // --- Letters API ---
  getLetters: async (tenantId: string): Promise<LetterMock[]> => {
    const letters = JSON.parse(localStorage.getItem('fc_letters') || '[]');
    return letters.filter((l: LetterMock) => l.tenantId === tenantId);
  },

  saveLetter: async (letter: LetterMock): Promise<void> => {
    const letters = JSON.parse(localStorage.getItem('fc_letters') || '[]');
    const index = letters.findIndex((l: LetterMock) => l.id === letter.id);
    if (index >= 0) {
      letters[index] = letter;
    } else {
      letters.push(letter);
    }
    localStorage.setItem('fc_letters', JSON.stringify(letters));
  },

  deleteLetter: async (id: string): Promise<void> => {
    const letters = JSON.parse(localStorage.getItem('fc_letters') || '[]');
    const filtered = letters.filter((l: LetterMock) => l.id !== id);
    localStorage.setItem('fc_letters', JSON.stringify(filtered));
  },

  // --- Budgets API ---
  getBudgets: async (tenantId: string): Promise<BudgetMock[]> => {
    const budgets = JSON.parse(localStorage.getItem('fc_budgets') || '[]');
    return budgets.filter((b: BudgetMock) => b.tenantId === tenantId);
  },

  saveBudget: async (budget: BudgetMock): Promise<void> => {
    const budgets = JSON.parse(localStorage.getItem('fc_budgets') || '[]');
    const index = budgets.findIndex((b: BudgetMock) => b.id === budget.id);
    if (index >= 0) {
      budgets[index] = budget;
    } else {
      budgets.push(budget);
    }
    localStorage.setItem('fc_budgets', JSON.stringify(budgets));
  },

  deleteBudget: async (id: string): Promise<void> => {
    const budgets = JSON.parse(localStorage.getItem('fc_budgets') || '[]');
    const filtered = budgets.filter((b: BudgetMock) => b.id !== id);
    localStorage.setItem('fc_budgets', JSON.stringify(filtered));
  },

  // --- Bank Accounts API ---
  getBankAccounts: async (tenantId: string): Promise<BankAccountMock[]> => {
    const accounts = JSON.parse(localStorage.getItem('fc_bank_accounts') || '[]');
    return accounts.filter((a: BankAccountMock) => a.tenantId === tenantId);
  },

  saveBankAccount: async (account: BankAccountMock): Promise<void> => {
    const accounts = JSON.parse(localStorage.getItem('fc_bank_accounts') || '[]');
    const index = accounts.findIndex((a: BankAccountMock) => a.id === account.id);
    if (index >= 0) {
      accounts[index] = account;
    } else {
      accounts.push(account);
    }
    localStorage.setItem('fc_bank_accounts', JSON.stringify(accounts));
  },

  deleteBankAccount: async (id: string): Promise<void> => {
    const accounts = JSON.parse(localStorage.getItem('fc_bank_accounts') || '[]');
    const filtered = accounts.filter((a: BankAccountMock) => a.id !== id);
    localStorage.setItem('fc_bank_accounts', JSON.stringify(filtered));
  },

  // --- Categories API ---
  getCategories: async (tenantId: string): Promise<CategoryMock[]> => {
    const categories = JSON.parse(localStorage.getItem('fc_categories') || '[]');
    return categories.filter((c: CategoryMock) => c.tenantId === tenantId);
  },

  saveCategory: async (category: CategoryMock): Promise<void> => {
    const categories = JSON.parse(localStorage.getItem('fc_categories') || '[]');
    const index = categories.findIndex((c: CategoryMock) => c.id === category.id);
    if (index >= 0) {
      categories[index] = category;
    } else {
      categories.push(category);
    }
    localStorage.setItem('fc_categories', JSON.stringify(categories));
  },

  deleteCategory: async (id: string): Promise<void> => {
    const categories = JSON.parse(localStorage.getItem('fc_categories') || '[]');
    const filtered = categories.filter((c: CategoryMock) => c.id !== id);
    localStorage.setItem('fc_categories', JSON.stringify(filtered));
  },

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
