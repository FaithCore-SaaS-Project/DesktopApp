import api from '../lib/axios';
import { MemberMock } from './mockData';
import { isElectron } from './api'; // Import isElectron from api.ts to keep it simple

export const memberService = {
  getMembers: async (tenantId: string): Promise<MemberMock[]> => {
    try {
      const res = await api.get('/members');
      const data = res.data.data || res.data;
      if (!Array.isArray(data)) return [];
      
      const mapped = data.map((m: any) => ({
        id: m.id.toString(),
        memberNo: m.member_no,
        firstName: m.first_name,
        lastName: m.last_name,
        phone: m.phone || '',
        email: m.email || '',
        gender: m.gender || 'male',
        dob: m.dob || '',
        address: m.address || '',
        baptismDate: m.baptism_date,
        membershipDate: m.membership_date,
        occupation: m.occupation || '',
        status: m.status == 1 || m.status === 'active' || m.status === true,
        tenantId: m.church_id ? m.church_id.toString() : tenantId,
        photoUrl: m.photo_url,
        familyId: m.family_id ? m.family_id.toString() : undefined,
        nic: m.nic || '',
        addressType: m.address_type || 'permanent',
        permanentAddress: m.permanent_address || '',
        postalAddress: m.postal_address || '',
        isBaptized: m.is_baptized === true || m.is_baptized == 1,
        baptismChurch: m.baptism_church || '',
        baptismPartnerName: m.baptism_partner_name || '',
        baptismCertificate: m.baptism_certificate || '',
        baptismCertificateUrl: m.baptism_certificate_url || null,
        maritalStatus: m.marital_status || 'single',
        marriageDate: m.marriage_date || '',
        marriageCertificate: m.marriage_certificate || '',
        marriageCertificateUrl: m.marriage_certificate_url || null,
        birthCertificate: m.birth_certificate || '',
        birthCertificateUrl: m.birth_certificate_url || null,
      }));

      if (isElectron()) {
        try {
          for (const m of mapped) {
            await window.electronAPI.saveMember({
              id: m.id,
              name: `${m.firstName} ${m.lastName}`,
              email: m.email,
              phone: m.phone,
              role: m.occupation,
              joinedDate: m.membershipDate,
              status: m.status ? 'active' : 'inactive',
              tenantId: tenantId,
              syncStatus: 'synced'
            });
          }
        } catch (e) {
          console.error('Failed to sync to local SQLite cache:', e);
        }
      }

      return mapped;
    } catch (err) {
      console.warn('Failed to load members from backend, trying local cache...', err);
      if (isElectron()) {
        try {
          const localData = await window.electronAPI.getMembers(tenantId);
          return localData.map((m: any) => ({
            id: m.id,
            memberNo: 'MEM-LOCAL-' + m.id,
            firstName: m.name.split(' ')[0] || '',
            lastName: m.name.split(' ').slice(1).join(' ') || '',
            phone: m.phone || '',
            email: m.email || '',
            gender: 'male',
            dob: '',
            address: '',
            baptismDate: '',
            membershipDate: m.joinedDate || '',
            occupation: m.role || '',
            status: m.status === 'active',
            tenantId: m.tenantId,
            nic: '',
            addressType: 'permanent',
            permanentAddress: '',
            postalAddress: '',
            isBaptized: false,
            maritalStatus: 'single',
          }));
        } catch (e) {
          console.error('Failed to load from local SQLite:', e);
        }
      }
      return [];
    }
  },

  getFamilies: async (tenantId: string): Promise<any[]> => {
    try {
      const res = await api.get('/families');
      return res.data.data || res.data;
    } catch (err) {
      console.error('Error fetching families:', err);
      return [];
    }
  },

  importMembers: async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/members/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  saveMember: async (member: MemberMock): Promise<any> => {
    let payload: any;
    let headers = {};
    const hasFiles = !!(member.photoFile || member.baptismCertFile || member.marriageCertFile || member.birthCertFile);

    if (hasFiles) {
      payload = new FormData();
      payload.append('first_name', member.firstName);
      payload.append('last_name', member.lastName);
      payload.append('phone', member.phone);
      payload.append('email', member.email);
      payload.append('gender', member.gender);
      if (member.dob) payload.append('dob', member.dob);
      if (member.address) payload.append('address', member.address);
      if (member.nic) payload.append('nic', member.nic);
      if (member.addressType) payload.append('address_type', member.addressType);
      if (member.permanentAddress) payload.append('permanent_address', member.permanentAddress);
      if (member.postalAddress) payload.append('postal_address', member.postalAddress);
      payload.append('is_baptized', member.isBaptized ? '1' : '0');
      if (member.baptismChurch) payload.append('baptism_church', member.baptismChurch);
      if (member.baptismPartnerName) payload.append('baptism_partner_name', member.baptismPartnerName);
      if (member.baptismDate) payload.append('baptism_date', member.baptismDate);
      if (member.membershipDate) payload.append('membership_date', member.membershipDate);
      if (member.occupation) payload.append('occupation', member.occupation);
      if (member.maritalStatus) payload.append('marital_status', member.maritalStatus);
      if (member.marriageDate) payload.append('marriage_date', member.marriageDate);
      payload.append('status', member.status ? 'active' : 'inactive');
      if (member.familyId) payload.append('family_id', member.familyId);

      if (member.photoFile) payload.append('photo', member.photoFile);
      if (member.baptismCertFile) payload.append('baptism_certificate', member.baptismCertFile);
      if (member.marriageCertFile) payload.append('marriage_certificate', member.marriageCertFile);
      if (member.birthCertFile) payload.append('birth_certificate', member.birthCertFile);

      headers = { 'Content-Type': 'multipart/form-data' };
      
      if (!member.id.startsWith('MEM-')) {
        payload.append('_method', 'PUT');
      }
    } else {
      payload = {
        first_name: member.firstName,
        last_name: member.lastName,
        phone: member.phone,
        email: member.email,
        gender: member.gender,
        dob: member.dob,
        address: member.address,
        nic: member.nic,
        address_type: member.addressType,
        permanent_address: member.permanentAddress,
        postal_address: member.postalAddress,
        is_baptized: member.isBaptized ? 1 : 0,
        baptism_church: member.baptismChurch,
        baptism_partner_name: member.baptismPartnerName,
        baptism_date: member.baptismDate,
        membership_date: member.membershipDate,
        occupation: member.occupation,
        marital_status: member.maritalStatus,
        marriage_date: member.marriageDate,
        status: member.status ? 'active' : 'inactive',
        family_id: member.familyId
      };
    }

    try {
      let res;
      if (member.id.startsWith('MEM-')) {
        res = await api.post('/members', payload, { headers });
      } else {
        const endpoint = `/members/${member.id}`;
        const method = hasFiles ? 'post' : 'put';
        res = await api[method](endpoint, payload, { headers });
      }

      if (isElectron()) {
        try {
          const syncedMember = res.data?.data || res.data || member;
          await window.electronAPI.saveMember({
            id: (syncedMember.id || member.id).toString(),
            name: `${member.firstName} ${member.lastName}`,
            email: member.email,
            phone: member.phone,
            role: member.occupation,
            joinedDate: member.membershipDate,
            status: member.status ? 'active' : 'inactive',
            tenantId: member.tenantId || localStorage.getItem('tenantId') || '',
            syncStatus: 'synced'
          });
        } catch (e) {
          console.error('Failed to update local cache after successful save:', e);
        }
      }
      return res.data;
    } catch (err) {
      console.warn('Failed to save member to backend, trying local fallback...', err);
      if (isElectron()) {
        try {
          await window.electronAPI.saveMember({
            id: member.id,
            name: `${member.firstName} ${member.lastName}`,
            email: member.email,
            phone: member.phone,
            role: member.occupation,
            joinedDate: member.membershipDate,
            status: member.status ? 'active' : 'inactive',
            tenantId: member.tenantId || localStorage.getItem('tenantId') || '',
            syncStatus: 'pending'
          });
          return { success: true, message: 'Saved offline locally. Will sync when online.' };
        } catch (e) {
          console.error('Failed to save to offline database:', e);
        }
      }
      throw err;
    }
  },

  deleteMember: async (id: string): Promise<void> => {
    try {
      await api.delete(`/members/${id}`);
      if (isElectron()) {
        try {
          await window.electronAPI.deleteMember(id);
        } catch (e) {
          console.error('Failed to delete member from local SQLite:', e);
        }
      }
    } catch (err) {
      console.warn('Failed to delete from backend, applying to local SQLite...', err);
      if (isElectron()) {
        try {
          await window.electronAPI.deleteMember(id);
        } catch (e) {
          console.error('Failed to delete from local database:', e);
        }
        return;
      }
      throw err;
    }
  }
};
