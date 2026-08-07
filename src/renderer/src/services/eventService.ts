import api from '../lib/axios';
import { EventMock } from './mockData';

export const eventService = {
  getEvents: async (tenantId: string): Promise<EventMock[]> => {
    try {
      const res = await api.get('/events');
      const data = res.data.data || res.data;
      if (!Array.isArray(data)) return [];
      return data.map((e: any) => ({
        id: e.id,
        name: e.name,
        subtitle: e.subtitle || undefined,
        type: e.type,
        date: e.date,
        time: e.time,
        location: e.location,
        attendees: e.attendees,
        maxCapacity: e.maxCapacity,
        status: e.status,
        organizer: e.organizer,
        description: e.description || undefined,
        tenantId: e.tenantId,
        createdOn: e.createdOn
      }));
    } catch (err) {
      console.error('Failed to load events from backend', err?.message || 'Error occurred');
      return [];
    }
  },

  saveEvent: async (evt: EventMock): Promise<void> => {
    const payload = {
      name: evt.name,
      subtitle: evt.subtitle,
      type: evt.type,
      date: evt.date,
      time: evt.time,
      location: evt.location,
      attendees: evt.attendees,
      maxCapacity: evt.maxCapacity,
      status: evt.status,
      organizer: evt.organizer,
      description: evt.description,
      createdOn: evt.createdOn
    };

    if (evt.id.startsWith('EVT-2025-')) {
      await api.post('/events', payload);
    } else {
      await api.put(`/events/${evt.id}`, payload);
    }
  },

  deleteEvent: async (id: string): Promise<void> => {
    await api.delete(`/events/${id}`);
  },

  registerForEvent: async (eventId: string, memberId: string, status: string = 'registered'): Promise<any> => {
    const res = await api.post('/events/register', {
      event_id: eventId,
      member_id: memberId,
      status: status
    });
    return res.data;
  },

  getEventAttendance: async (eventId: string): Promise<any[]> => {
    const res = await api.get(`/events/${eventId}/attendance`);
    return res.data;
  },

  markEventAttendance: async (eventId: string, memberId: string, status: string, notes?: string): Promise<any> => {
    const res = await api.post(`/events/${eventId}/attendance`, {
      member_id: memberId,
      status: status,
      notes: notes
    });
    return res.data;
  }
};
