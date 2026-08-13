import api from '../lib/axios';

export const settingsService = {
  getSettings: async (): Promise<Record<string, string>> => {
    try {
      const response = await api.get('/settings');
      return response.data;
    } catch (err) {
      console.error('Failed to fetch settings', err?.message || 'Error occurred');
      return {};
    }
  },

  getFinanceOverview: async (): Promise<any> => {
    try {
      const response = await api.get('/settings/finance-overview');
      return response.data.data;
    } catch (err) {
      console.error('Failed to fetch finance overview', err?.message || 'Error occurred');
      return null;
    }
  },

  updateSettings: async (settings: Record<string, string>): Promise<void> => {
    await api.post('/settings', settings);
  }
};
