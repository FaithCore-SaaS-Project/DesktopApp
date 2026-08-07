import api from '../lib/axios';
import { LetterMock } from './mockData';

export const letterService = {
  getLetters: async (tenantId: string): Promise<LetterMock[]> => {
    try {
      const res = await api.get('/letters');
      const data = res.data.data || res.data;
      if (!Array.isArray(data)) return [];
      return data.map((l: any) => ({
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
    } catch (err) {
      console.error('Failed to load letters from backend', err?.message || 'Error occurred');
      return [];
    }
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
  }
};
