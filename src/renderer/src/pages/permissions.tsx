import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Lock, Loader2, X } from 'lucide-react';

import PermissionsStatsCards from '../components/permissions/PermissionsStatsCards';
import PermissionsFilters from '../components/permissions/PermissionsFilters';
import PermissionsTable from '../components/permissions/PermissionsTable';
import PermissionsByModuleCard from '../components/permissions/PermissionsByModuleCard';
import PermissionTypesCard from '../components/permissions/PermissionTypesCard';
import PermissionQuickActions from '../components/permissions/PermissionQuickActions';
import NeedHelpPermissionCard from '../components/permissions/NeedHelpPermissionCard';
import { apiService } from '../services/api';

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<any | null>(null);
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [serverError, setServerError] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const pList = await apiService.getPermissions();
      setPermissions(pList);
    } catch (err) {
      console.error('Failed to load permissions page data:', err?.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingPermission(null);
    setName('');
    setErrors({});
    setServerError('');
    setIsModalOpen(true);
  };

  const openEditModal = (perm: any) => {
    setEditingPermission(perm);
    setName(perm.name);
    setErrors({});
    setServerError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    setServerError('');

    try {
      await apiService.savePermission({
        id: editingPermission ? editingPermission.id : undefined,
        name,
      });
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      console.error('Failed to save permission:', err?.message || 'Error occurred');
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
    if (!confirm('Are you sure you want to delete this permission?')) return;
    try {
      await apiService.deletePermission(id);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete permission.');
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
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Permissions</h1>
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 font-bold mt-2">
            <Link href="/dashboard" className="hover:text-[#5B3DF5] transition-colors">Dashboard</Link>
            <ChevronRight size={12} />
            <Link href="/users" className="hover:text-[#5B3DF5] transition-colors">Users & Roles</Link>
            <ChevronRight size={12} />
            <span className="text-gray-655 font-bold">Permissions</span>
          </nav>
        </div>
        <div>
          <button
            onClick={openAddModal}
            className="h-11 px-6 bg-[#5B3DF5] hover:bg-[#4a30db] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#5B3DF5]/15 active:scale-[0.98] flex items-center gap-2 cursor-pointer"
          >
            <Lock size={14} />
            Manage Permissions
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex gap-6">
        <div className="flex-1 min-w-0 space-y-6">
          <PermissionsStatsCards />
          <PermissionsFilters />
          {loading ? (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-12 flex justify-center items-center">
              <Loader2 className="h-8 w-8 text-[#5B3DF5] animate-spin" />
            </div>
          ) : (
            <PermissionsTable permissions={permissions} onEdit={openEditModal} onDelete={handleDelete} />
          )}
        </div>
        
        <div className="w-[320px] shrink-0 space-y-6">
          <PermissionsByModuleCard />
          <PermissionTypesCard />
          <PermissionQuickActions />
          <NeedHelpPermissionCard />
        </div>
      </div>

      {/* Add/Edit Permission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl border border-gray-100 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h3 className="font-extrabold text-sm text-gray-900">{editingPermission ? 'Edit Permission' : 'Add Custom Permission'}</h3>
                <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Register new privilege keys.</p>
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

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">Permission Name *</label>
                <input
                  name="name" type="text" required value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. view_giving_history"
                  className={`w-full bg-gray-50 border ${fieldErr('name') ? 'border-red-400' : 'border-gray-200'} focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs text-gray-800 font-semibold focus:outline-none`}
                />
                {fieldErr('name') && <p className="text-red-500 text-[10px] font-semibold">{fieldErr('name')}</p>}
                <p className="text-[9px] text-gray-400 font-semibold mt-1">This will automatically resolve to snake_case key (e.g. "view_reports").</p>
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
                  {editingPermission ? 'Save Changes' : 'Create Permission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
