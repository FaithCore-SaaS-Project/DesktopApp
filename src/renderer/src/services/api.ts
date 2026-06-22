import { mockMembers, mockFinanceRecords, mockReceipts, mockCategories, mockBankAccounts, mockBudgets, mockLetters, mockCertificates, mockEvents, mockSavedReports, MemberMock, FinanceMock, ReceiptMock, CategoryMock, BankAccountMock, BudgetMock, LetterMock, CertificateMock, EventMock, SavedReportMock } from './mockData';
import api from '../lib/axios';

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
    const res = await api.get('/events');
    return res.data.map((e: any) => ({
      id: e.id,
      name: e.name,
      subtitle: e.subtitle || undefined,
      type: e.type,
      date: e.date,
      time: e.time,
      location: e.location,
      attendees: e.attendees,
      maxCapacity: e.maxCapacity,
      status: e.status,
      organizer: e.organizer,
      description: e.description || undefined,
      tenantId: e.tenantId,
      createdOn: e.createdOn
    }));
  },

  saveEvent: async (evt: EventMock): Promise<void> => {
    const payload = {
      name: evt.name,
      subtitle: evt.subtitle,
      type: evt.type,
      date: evt.date,
      time: evt.time,
      location: evt.location,
      attendees: evt.attendees,
      maxCapacity: evt.maxCapacity,
      status: evt.status,
      organizer: evt.organizer,
      description: evt.description,
      createdOn: evt.createdOn
    };

    if (evt.id.startsWith('EVT-2025-')) {
      await api.post('/events', payload);
    } else {
      await api.put(`/events/${evt.id}`, payload);
    }
  },

  deleteEvent: async (id: string): Promise<void> => {
    await api.delete(`/events/${id}`);
  },

  registerForEvent: async (eventId: string, memberId: string, status: string = 'registered'): Promise<any> => {
    const res = await api.post('/events/register', {
      event_id: eventId,
      member_id: memberId,
      status: status
    });
    return res.data;
  },

  // --- Certificates API ---
  getCertificates: async (tenantId: string): Promise<CertificateMock[]> => {
    const res = await api.get('/certificates');
    return res.data.map((c: any) => ({
      id: c.id,
      name: c.name,
      type: c.type,
      recipient: c.recipient,
      recipientEmail: c.recipientEmail || '',
      recipientPhone: c.recipientPhone || '',
      issuedDate: c.issuedDate,
      issuedBy: c.issuedBy,
      status: c.status,
      tenantId: c.tenantId,
      createdOn: c.createdOn
    }));
  },

  saveCertificate: async (cert: CertificateMock): Promise<void> => {
    const payload = {
      name: cert.name,
      type: cert.type,
      recipient: cert.recipient,
      recipientEmail: cert.recipientEmail,
      recipientPhone: cert.recipientPhone,
      issuedDate: cert.issuedDate,
      issuedBy: cert.issuedBy,
      status: cert.status,
    };
    if (cert.id.startsWith('CERT-')) {
      await api.post('/certificates', payload);
    } else {
      await api.put(`/certificates/${cert.id}`, payload);
    }
  },

  deleteCertificate: async (id: string): Promise<void> => {
    await api.delete(`/certificates/${id}`);
  },

  downloadCertificatePdf: async (id: string, fileName: string): Promise<void> => {
    const res = await api.get(`/certificates/${id}/pdf`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  // --- Letters API ---
  getLetters: async (tenantId: string): Promise<LetterMock[]> => {
    const res = await api.get('/letters');
    return res.data.map((l: any) => ({
      id: l.id,
      title: l.title,
      type: l.type,
      recipient: l.recipient,
      recipientEmail: l.recipientEmail || '',
      recipientPhone: l.recipientPhone || '',
      date: l.date,
      status: l.status,
      sentBy: l.sentBy,
      content: l.content,
      tenantId: l.tenantId,
      createdOn: l.createdOn
    }));
  },

  saveLetter: async (letter: LetterMock): Promise<void> => {
    const payload = {
      title: letter.title,
      type: letter.type,
      recipient: letter.recipient,
      recipientEmail: letter.recipientEmail,
      recipientPhone: letter.recipientPhone,
      date: letter.date,
      status: letter.status,
      sentBy: letter.sentBy,
      content: letter.content,
    };
    if (letter.id.startsWith('LTR-')) {
      await api.post('/letters', payload);
    } else {
      await api.put(`/letters/${letter.id}`, payload);
    }
  },

  deleteLetter: async (id: string): Promise<void> => {
    await api.delete(`/letters/${id}`);
  },

  downloadLetterPdf: async (id: string, fileName: string): Promise<void> => {
    const res = await api.get(`/letters/${id}/pdf`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  // --- Budgets API ---
  getBudgets: async (tenantId: string): Promise<BudgetMock[]> => {
    const res = await api.get('/budgets');
    return res.data.map((b: any) => ({
      id: b.id.toString(),
      name: b.name,
      type: b.type,
      budgetAmount: parseFloat(b.budget_amount),
      spentAmount: parseFloat(b.spent_amount),
      periodStart: b.period_start,
      periodEnd: b.period_end,
      status: b.status,
      description: b.description || '',
      tenantId: b.church_id.toString(),
      createdOn: b.created_on || b.created_at?.split('T')[0] || ''
    }));
  },

  saveBudget: async (budget: BudgetMock): Promise<void> => {
    const payload = {
      name: budget.name,
      type: budget.type,
      budget_amount: budget.budgetAmount,
      spent_amount: budget.spentAmount,
      period_start: budget.periodStart,
      period_end: budget.periodEnd,
      status: budget.status,
      description: budget.description,
      created_on: budget.createdOn
    };
    if (budget.id.startsWith('bud-')) {
      await api.post('/budgets', payload);
    } else {
      await api.put(`/budgets/${budget.id}`, payload);
    }
  },

  deleteBudget: async (id: string): Promise<void> => {
    await api.delete(`/budgets/${id}`);
  },

  // --- Bank Accounts API ---
  getBankAccounts: async (tenantId: string): Promise<BankAccountMock[]> => {
    const res = await api.get('/bank-accounts');
    return res.data.map((a: any) => ({
      id: a.id.toString(),
      bankName: a.bank_name,
      accountName: a.account_name,
      accountNumber: a.account_number,
      accountType: a.account_type,
      balance: parseFloat(a.balance),
      status: a.status,
      branch: a.branch || '',
      currency: a.currency || 'LKR',
      ledgerBalance: parseFloat(a.ledger_balance),
      lastStatementDate: a.last_statement_date,
      createdOn: a.created_on || a.created_at?.split('T')[0] || '',
      createdBy: a.created_by || '',
      tenantId: a.church_id.toString()
    }));
  },

  saveBankAccount: async (account: BankAccountMock): Promise<void> => {
    const payload = {
      bank_name: account.bankName,
      account_name: account.accountName,
      account_number: account.accountNumber,
      account_type: account.accountType,
      balance: account.balance,
      ledger_balance: account.ledgerBalance,
      status: account.status,
      branch: account.branch,
      currency: account.currency,
      last_statement_date: account.lastStatementDate,
      created_on: account.createdOn,
      created_by: account.createdBy
    };
    if (account.id.startsWith('bank-')) {
      await api.post('/bank-accounts', payload);
    } else {
      await api.put(`/bank-accounts/${account.id}`, payload);
    }
  },

  deleteBankAccount: async (id: string): Promise<void> => {
    await api.delete(`/bank-accounts/${id}`);
  },

  // --- Categories API ---
  getCategories: async (tenantId: string): Promise<CategoryMock[]> => {
    const res = await api.get('/finance-categories');
    return res.data.map((c: any) => ({
      id: c.id.toString(),
      name: c.name,
      type: c.type,
      description: c.description || '',
      status: c.status,
      createdOn: c.created_on || c.created_at?.split('T')[0] || '',
      createdBy: c.created_by || '',
      tenantId: c.church_id.toString()
    }));
  },

  saveCategory: async (category: CategoryMock): Promise<void> => {
    const payload = {
      name: category.name,
      type: category.type,
      description: category.description,
      status: category.status,
      created_on: category.createdOn,
      created_by: category.createdBy
    };
    if (category.id.startsWith('cat-')) {
      await api.post('/finance-categories', payload);
    } else {
      await api.put(`/finance-categories/${category.id}`, payload);
    }
  },

  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/finance-categories/${id}`);
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
    const res = await api.get('/finance/records');
    return res.data.map((r: any) => ({
      id: r.id,
      type: r.type,
      category: r.category,
      amount: parseFloat(r.amount),
      date: r.date,
      description: r.description || '',
      tenantId: r.tenantId,
      method: r.method,
      receipt: r.receipt || ''
    }));
  },

  saveFinanceRecord: async (record: FinanceMock): Promise<void> => {
    const payload = {
      category: record.category,
      amount: record.amount,
      description: record.description,
      method: record.method || (record.type === 'income' ? 'Cash' : 'Bank Transfer'),
      receipt: record.receipt
    };

    if (record.type === 'income') {
      if (record.id.startsWith('fin-')) {
        await api.post('/income', {
          ...payload,
          income_date: record.date
        });
      } else {
        const cleanId = record.id.replace('income-', '');
        await api.put(`/income/${cleanId}`, {
          ...payload,
          income_date: record.date
        });
      }
    } else {
      if (record.id.startsWith('fin-')) {
        await api.post('/expenses', {
          ...payload,
          expense_date: record.date
        });
      } else {
        const cleanId = record.id.replace('expense-', '');
        await api.put(`/expenses/${cleanId}`, {
          ...payload,
          expense_date: record.date
        });
      }
    }
  },

  deleteFinanceRecord: async (id: string): Promise<void> => {
    await api.delete(`/finance/records/${id}`);
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
