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

  updateSettings: async (settings: Record<string, string>): Promise<void> => {
    await api.post('/settings', settings);
  }
};
