import api from '../lib/axios';

const SETTINGS_STORAGE_KEY = 'fc_finance_settings';

export const settingsService = {
  getSettings: async (): Promise<Record<string, string>> => {
    try {
      const response = await api.get('/settings');
      if (response.data && Object.keys(response.data).length > 0) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(response.data));
        }
        return response.data;
      }
    } catch (err) {
      console.warn('API getSettings failed, using cached settings', err?.message);
    }

    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(SETTINGS_STORAGE_KEY);
        if (cached) return JSON.parse(cached);
      } catch (e) {
        // ignore parse error
      }
    }
    return {
      finance_currency: 'LKR',
      finance_date_format: 'DD MMM YYYY',
      finance_fiscal_year_start: 'January',
      finance_year_display: '2025'
    };
  },

  getFinanceOverview: async (): Promise<any> => {
    try {
      const response = await api.get('/settings/finance-overview');
      if (response.data?.data) return response.data.data;
    } catch (err) {
      console.warn('Failed to fetch finance overview', err?.message);
    }

    let savedCurrency = 'LKR';
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(SETTINGS_STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.finance_currency) savedCurrency = parsed.finance_currency;
        }
      } catch (e) {}
    }

    return {
      currency: savedCurrency,
      financial_year_range: '01 Jan - 31 Dec',
      fiscal_year_start: 'January',
      active_bank_accounts: 3,
      active_payment_methods: 3
    };
  },

  updateSettings: async (settings: Record<string, string>): Promise<void> => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    }
    try {
      await api.post('/settings', settings);
    } catch (err) {
      console.warn('API updateSettings failed, saved to local cache', err?.message);
    }
  }
};

