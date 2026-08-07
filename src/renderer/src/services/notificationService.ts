import api from '../lib/axios';

export const notificationService = {
  getNotifications: async (): Promise<any> => {
    try {
      const response = await api.get('/notifications');
      return response.data;
    } catch (err) {
      console.error('Failed to fetch notifications', err?.message || 'Error occurred');
      return { unread: [], all: [] };
    }
  },

  markNotificationRead: async (id: string): Promise<void> => {
    try {
      await api.post(`/notifications/${id}/read`);
    } catch (err) {
      console.error('Failed to mark notification as read', err?.message || 'Error occurred');
    }
  },

  sendNotification: async (payload: { subject: string, message: string, channels: string[], member_ids: string[] }): Promise<any> => {
    const res = await api.post('/notifications/send', payload);
    return res.data;
  }
};
