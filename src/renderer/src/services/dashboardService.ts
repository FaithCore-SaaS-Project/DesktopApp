import api from '../lib/axios';

export const dashboardService = {
  getDashboardStats: async (): Promise<any> => {
    try {
      const response = await api.get('/dashboard/stats');
      return response.data;
    } catch (err) {
      console.error('Failed to fetch dashboard stats', err);
      return null;
    }
  }
};
