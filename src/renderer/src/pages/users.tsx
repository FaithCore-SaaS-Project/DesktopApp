import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Plus, Loader2, X } from 'lucide-react';

import UserStatsCards from '../components/users/UserStatsCards';
import UserFilters from '../components/users/UserFilters';
import UsersTable from '../components/users/UsersTable';
import UsersByRoleCard from '../components/users/UsersByRoleCard';
import UsersByDepartmentCard from '../components/users/UsersByDepartmentCard';
import UserQuickActions from '../components/users/UserQuickActions';
import { apiService } from '../services/api';

const emptyForm = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  password: '',
  role: 'Member',
  status: 'Active' as 'Active' | 'Inactive',
};

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [serverError, setServerError] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const uList = await apiService.getUsers();
      setUsers(uList);
      
      const rList = await apiService.getRoles();
      setRoles(rList);
    } catch (err) {
      console.error('Failed to load users page data:', err?.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingUser(null);
    setForm(emptyForm);
    setErrors({});
    setServerError('');
    setIsModalOpen(true);
  };

  const openEditModal = (user: any) => {
    setEditingUser(user);
    setForm({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone || '',
      password: '', // blank password for editing unless they change it
      role: user.roles?.[0]?.name || 'Member',
      status: user.status ? 'Active' : 'Inactive',
    });
    setErrors({});
    setServerError('');
    setIsModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    setServerError('');

    try {
      await apiService.saveUser({
        id: editingUser ? editingUser.id : undefined,
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone,
        password: form.password || undefined,
        role: form.role,
        status: form.status === 'Active',
      });
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      console.error('Failed to save user:', err?.message || 'Error occurred');
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setServerError(err.response?.data?.message || 'Something went wrong. Please check your inputs.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: any) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await apiService.deleteUser(id);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete user.');
    }
  };

  const fieldErr = (field: string) => {
    return errors[field]?.[0] || '';
  };

  return (
    <div className="space-y-0 pb-10 p-8 bg-gradient-to-br from-slate-50 via-slate-50/50 to-indigo-50/30 min-h-screen">
      {/* Page Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Users</h1>
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 font-bold mt-2">
            <Link href="/dashboard" className="hover:text-[#5B3DF5] transition-colors">Dashboard</Link>
            <ChevronRight size={12} />
            <span className="text-gray-655 font-bold">Users</span>
          </nav>
        </div>
        <div className="flex gap-3">
          <button
            onClick={openAddModal}
            className="h-11 px-6 bg-[#5B3DF5] hover:bg-[#4a30db] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#5B3DF5]/15 active:scale-[0.98] flex items-center gap-2 cursor-pointer"
          >
            <Plus size={14} />
            Add New User
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0 space-y-6">
          <UserStatsCards />
          <UserFilters />
          {loading ? (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-12 flex justify-center items-center">
              <Loader2 className="h-8 w-8 text-[#5B3DF5] animate-spin" />
            </div>
          ) : (
            <UsersTable users={users} onEdit={openEditModal} onDelete={handleDelete} />
          )}
        </div>
        
        <div className="w-full lg:w-[320px] shrink-0 space-y-6">
          <UsersByRoleCard />
          <UsersByDepartmentCard />
          <UserQuickActions />
        </div>
      </div>

      {/* Add/Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl border border-gray-100 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h3 className="font-extrabold text-sm text-gray-900">{editingUser ? 'Edit User Details' : 'Register New User'}</h3>
                <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Enter credential and permission settings.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors cursor-pointer border border-gray-200 bg-white">
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {serverError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold">
                  {serverError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">First Name *</label>
                  <input
                    name="first_name" type="text" required value={form.first_name} onChange={handleChange}
                    className={`w-full bg-gray-50 border ${fieldErr('first_name') ? 'border-red-400' : 'border-gray-200'} focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs text-gray-800 font-semibold focus:outline-none`}
                  />
                  {fieldErr('first_name') && <p className="text-red-500 text-[10px] font-semibold">{fieldErr('first_name')}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">Last Name *</label>
                  <input
                    name="last_name" type="text" required value={form.last_name} onChange={handleChange}
                    className={`w-full bg-gray-50 border ${fieldErr('last_name') ? 'border-red-400' : 'border-gray-200'} focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs text-gray-800 font-semibold focus:outline-none`}
                  />
                  {fieldErr('last_name') && <p className="text-red-500 text-[10px] font-semibold">{fieldErr('last_name')}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">Email Address *</label>
                <input
                  name="email" type="email" required value={form.email} onChange={handleChange}
                  className={`w-full bg-gray-50 border ${fieldErr('email') ? 'border-red-400' : 'border-gray-200'} focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs text-gray-800 font-semibold focus:outline-none`}
                />
                {fieldErr('email') && <p className="text-red-500 text-[10px] font-semibold">{fieldErr('email')}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">Phone Number</label>
                <input
                  name="phone" type="text" value={form.phone} onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs text-gray-800 font-semibold focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">{editingUser ? 'Password (Leave blank to keep current)' : 'Password *'}</label>
                <input
                  name="password" type="password" required={!editingUser} value={form.password} onChange={handleChange}
                  className={`w-full bg-gray-50 border ${fieldErr('password') ? 'border-red-400' : 'border-gray-200'} focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs text-gray-800 font-semibold focus:outline-none`}
                />
                {fieldErr('password') && <p className="text-red-500 text-[10px] font-semibold">{fieldErr('password')}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">Role Profile *</label>
                  <select
                    name="role" value={form.role} onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[#5B3DF5] rounded-xl px-3 py-2.5 text-xs text-gray-800 font-bold focus:outline-none cursor-pointer"
                  >
                    {roles.map(r => (
                      <option key={r.id} value={r.name}>{r.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">Account Status *</label>
                  <select
                    name="status" value={form.status} onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[#5B3DF5] rounded-xl px-3 py-2.5 text-xs text-gray-800 font-bold focus:outline-none cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-gray-200 bg-white hover:bg-gray-50 px-5 py-2.5 text-xs font-bold text-gray-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-[#5B3DF5] hover:bg-[#4d32d6] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-[#5B3DF5]/15 transition-all cursor-pointer active:scale-[0.98] flex items-center gap-2"
                >
                  {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  {editingUser ? 'Save Changes' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
