import api from '../lib/axios';

export const supportService = {
  getArticles: async (): Promise<any[]> => {
    try {
      const response = await api.get('/support/articles');
      return response.data;
    } catch (err) {
      console.error('Failed to fetch articles', err);
      return [];
    }
  },

  getStatus: async (): Promise<any> => {
    try {
      const response = await api.get('/support/status');
      return response.data;
    } catch (err) {
      console.error('Failed to fetch system status', err);
      return null;
    }
  },

  subscribe: async (email: string): Promise<boolean> => {
    try {
      await api.post('/support/subscribe', { email });
      return true;
    } catch (err) {
      console.error('Failed to subscribe', err);
      return false;
    }
  }
};
