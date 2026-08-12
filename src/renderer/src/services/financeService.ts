import api from '../lib/axios';
import { FinanceMock, CategoryMock, BankAccountMock, BudgetMock, ReceiptMock } from './mockData';
import { isElectron } from './api';

export const financeService = {
  getFinanceRecords: async (tenantId: string): Promise<FinanceMock[]> => {
    try {
      const res = await api.get('/finance/records');
      if (res.status === 403) {
        console.warn('Access to finance records is unauthorized (403)');
        return [];
      }
      const data = res.data.data || res.data;
      if (!Array.isArray(data)) return [];
      
      const mapped = data.map((r: any) => ({
        id: r.id.toString(),
        type: r.type,
        category: r.category,
        amount: parseFloat(r.amount),
        date: r.date,
        description: r.description || '',
        tenantId: r.church_id ? r.church_id.toString() : tenantId,
        method: r.method,
        receipt: r.receipt || ''
      }));

      if (isElectron()) {
        try {
          for (const r of mapped) {
            await window.electronAPI.saveFinanceRecord({
              id: r.id,
              type: r.type,
              category: r.category,
              amount: r.amount,
              date: r.date,
              description: r.description,
              tenantId: tenantId,
              method: r.method || 'Cash',
              receipt: r.receipt || '',
              syncStatus: 'synced'
            });
          }
        } catch (e) {
          console.error('Failed to sync finance record to local SQLite cache:', e?.message || 'Error occurred');
        }
      }

      return mapped;
    } catch (err) {
      console.warn('Failed to load finance records from backend, trying local cache...', err);
      if (isElectron()) {
        try {
          const localData = await window.electronAPI.getFinanceRecords(tenantId);
          return localData.map((r: any) => ({
            id: r.id,
            type: r.type,
            category: r.category,
            amount: r.amount,
            date: r.date,
            description: r.description || '',
            tenantId: r.tenantId,
            method: r.method || 'Cash',
            receipt: r.receipt || ''
          }));
        } catch (e) {
          console.error('Failed to load finance records from local SQLite:', e?.message || 'Error occurred');
        }
      }
      return [];
    }
  },

  saveFinanceRecord: async (record: FinanceMock): Promise<void> => {
    const payload = {
      category: record.category,
      amount: record.amount,
      description: record.description,
      method: record.method || (record.type === 'income' ? 'Cash' : 'Bank Transfer'),
      receipt: record.receipt
    };

    try {
      if (record.type === 'income') {
        if (record.id.startsWith('fin-')) {
          await api.post('/income', { ...payload, income_date: record.date });
        } else {
          const cleanId = record.id.replace('income-', '');
          await api.put(`/income/${cleanId}`, { ...payload, income_date: record.date });
        }
      } else {
        if (record.id.startsWith('fin-')) {
          await api.post('/expenses', { ...payload, expense_date: record.date });
        } else {
          const cleanId = record.id.replace('expense-', '');
          await api.put(`/expenses/${cleanId}`, { ...payload, expense_date: record.date });
        }
      }

      if (isElectron()) {
        try {
          await window.electronAPI.saveFinanceRecord({
            id: record.id,
            type: record.type,
            category: record.category,
            amount: record.amount,
            date: record.date,
            description: record.description,
            tenantId: record.tenantId || localStorage.getItem('tenantId') || '',
            method: record.method || 'Cash',
            receipt: record.receipt || '',
            syncStatus: 'synced'
          });
        } catch (e) {
          console.error('Failed to update local finance cache:', e?.message || 'Error occurred');
        }
      }
    } catch (err) {
      console.warn('Failed to save finance record to backend, trying local fallback...', err);
      if (isElectron()) {
        try {
          await window.electronAPI.saveFinanceRecord({
            id: record.id,
            type: record.type,
            category: record.category,
            amount: record.amount,
            date: record.date,
            description: record.description,
            tenantId: record.tenantId || localStorage.getItem('tenantId') || '',
            method: record.method || 'Cash',
            receipt: record.receipt || '',
            syncStatus: 'pending'
          });
          return;
        } catch (e) {
          console.error('Failed to save finance record to local SQLite offline:', e?.message || 'Error occurred');
        }
      }
      throw err;
    }
  },

  deleteFinanceRecord: async (id: string): Promise<void> => {
    try {
      await api.delete(`/finance/records/${id}`);
      if (isElectron()) {
        try {
          await window.electronAPI.deleteFinanceRecord(id);
        } catch (e) {
          console.error('Failed to delete finance record from local SQLite:', e?.message || 'Error occurred');
        }
      }
    } catch (err) {
      console.warn('Failed to delete from backend, applying to local SQLite...', err);
      if (isElectron()) {
        try {
          await window.electronAPI.deleteFinanceRecord(id);
        } catch (e) {
          console.error('Failed to delete finance record from local database:', e?.message || 'Error occurred');
        }
        return;
      }
      throw err;
    }
  },

  getBankAccounts: async (tenantId: string): Promise<BankAccountMock[]> => {
    try {
      const res = await api.get('/bank-accounts');
      if (res.status === 403) return [];
      const data = res.data.data || res.data;
      if (!Array.isArray(data)) return [];
      return data.map((a: any) => ({
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
    } catch (err) {
      console.error('Failed to load bank accounts from backend', err?.message || 'Error occurred');
      return [];
    }
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

  getCategories: async (tenantId: string): Promise<CategoryMock[]> => {
    try {
      const res = await api.get('/finance-categories');
      const data = res.data.data || res.data;
      if (!Array.isArray(data)) return [];
      return data.map((c: any) => ({
        id: c.id.toString(),
        name: c.name,
        type: c.type,
        description: c.description || '',
        status: c.status,
        createdOn: c.created_on || c.created_at?.split('T')[0] || '',
        createdBy: c.created_by || '',
        tenantId: c.church_id.toString()
      }));
    } catch (err) {
      console.error('Failed to load categories from backend', err?.message || 'Error occurred');
      return [];
    }
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

  getBudgets: async (tenantId: string): Promise<BudgetMock[]> => {
    try {
      const res = await api.get('/budgets');
      if (res.status === 403) return [];
      const data = res.data.data || res.data;
      if (!Array.isArray(data)) return [];
      return data.map((b: any) => ({
        id: b.id.toString(),
        name: b.name,
        type: b.type,
        budgetAmount: parseFloat(b.budget_amount),
        spentAmount: parseFloat(b.spent_amount) || 0,
        periodStart: b.period_start,
        periodEnd: b.period_end,
        status: b.status,
        description: b.description || '',
        createdOn: b.created_on || b.created_at?.split('T')[0] || '',
        tenantId: b.church_id.toString()
      }));
    } catch (err) {
      console.error('Failed to load budgets from backend', err?.message || 'Error occurred');
      return [];
    }
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

  getReceipts: async (tenantId: string): Promise<ReceiptMock[]> => {
    try {
      const res = await api.get('/receipts');
      if (res.status === 403) return [];
      const data = res.data.data || res.data;
      if (!Array.isArray(data)) return [];
      
      return data.map((r: any) => ({
        id: r.id.toString(),
        receiptNo: r.receipt_no,
        date: r.receipt_date,
        memberName: r.member_name,
        memberEmail: r.member_email || '',
        memberPhone: r.member_phone || '',
        category: r.category,
        amount: parseFloat(r.amount),
        method: r.method,
        status: r.status,
        receivedBy: r.received_by,
        description: r.description || '',
        tenantId: r.church_id.toString()
      }));
    } catch (err) {
      console.error('Failed to load receipts from backend', err?.message || 'Error occurred');
      return [];
    }
  },

  saveReceipt: async (receipt: ReceiptMock): Promise<void> => {
    const payload = {
      receipt_no: receipt.receiptNo,
      receipt_date: receipt.date,
      member_name: receipt.memberName,
      member_email: receipt.memberEmail,
      member_phone: receipt.memberPhone,
      category: receipt.category,
      amount: receipt.amount,
      method: receipt.method,
      status: receipt.status,
      received_by: receipt.receivedBy,
      description: receipt.description
    };
    
    if (receipt.id.startsWith('rcp-')) {
      await api.post('/receipts', payload);
    } else {
      await api.put(`/receipts/${receipt.id}`, payload);
    }
  },
  
  deleteReceipt: async (id: string): Promise<void> => {
    await api.delete(`/receipts/${id}`);
  }
};
