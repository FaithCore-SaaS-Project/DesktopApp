import api from '../lib/axios';
import { SavedReportMock } from './mockData';

export const reportService = {
  getSavedReports: async (tenantId: string): Promise<SavedReportMock[]> => {
    try {
      const response = await api.get('/reports/saved');
      return response.data;
    } catch (err) {
      console.error('Failed to fetch saved reports', err);
      return [];
    }
  },

  saveSavedReport: async (report: SavedReportMock): Promise<void> => {
    await api.post('/reports/saved', {
      name: report.name,
      type: report.type,
      category: report.category,
      dateRange: report.dateRange
    });
  }
};
