import api from '../lib/axios';

export const adminService = {
  getUsers: async (): Promise<any[]> => {
    try {
      const res = await api.get('/users');
      return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      console.error('Failed to get users', err);
      return [];
    }
  },

  saveUser: async (user: any): Promise<any> => {
    const payload = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone || null,
      role: user.role,
      status: user.status === 'Active' || user.status === true || user.status === 1,
    } as any;
    if (user.password) {
      payload.password = user.password;
    }
    if (user.id) {
      const res = await api.put(`/users/${user.id}`, payload);
      return res.data;
    } else {
      const res = await api.post('/users', payload);
      return res.data;
    }
  },

  deleteUser: async (id: any): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  getRoles: async (): Promise<any[]> => {
    try {
      const res = await api.get('/roles');
      return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      console.error('Failed to get roles', err);
      return [];
    }
  },

  saveRole: async (role: any): Promise<any> => {
    const payload = {
      name: role.name,
      permissions: role.permissions || [],
    };
    if (role.id) {
      const res = await api.put(`/roles/${role.id}`, payload);
      return res.data;
    } else {
      const res = await api.post('/roles', payload);
      return res.data;
    }
  },

  deleteRole: async (id: any): Promise<void> => {
    await api.delete(`/roles/${id}`);
  },

  getPermissions: async (): Promise<any[]> => {
    try {
      const res = await api.get('/permissions');
      return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      console.error('Failed to get permissions', err);
      return [];
    }
  },

  savePermission: async (perm: any): Promise<any> => {
    const payload = { name: perm.name };
    if (perm.id) {
      const res = await api.put(`/permissions/${perm.id}`, payload);
      return res.data;
    } else {
      const res = await api.post('/permissions', payload);
      return res.data;
    }
  },

  deletePermission: async (id: any): Promise<void> => {
    await api.delete(`/permissions/${id}`);
  }
};
