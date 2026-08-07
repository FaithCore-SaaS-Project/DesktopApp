import api from '../lib/axios';
import { CertificateMock } from './mockData';

export const certificateService = {
  getCertificates: async (tenantId: string): Promise<CertificateMock[]> => {
    try {
      const res = await api.get('/certificates');
      const data = res.data.data || res.data;
      if (!Array.isArray(data)) return [];
      return data.map((c: any) => ({
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
    } catch (err) {
      console.error('Failed to load certificates from backend', err?.message || 'Error occurred');
      return [];
    }
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
  }
};
