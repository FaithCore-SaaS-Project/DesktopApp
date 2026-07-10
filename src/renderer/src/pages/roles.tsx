import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Plus, Loader2, X } from 'lucide-react';

import RolesStatsCards from '../components/roles/RolesStatsCards';
import RolesFilters from '../components/roles/RolesFilters';
import RolesTable from '../components/roles/RolesTable';
import RolesOverviewCard from '../components/roles/RolesOverviewCard';
import RoleStatusCard from '../components/roles/RoleStatusCard';
import RoleQuickActions from '../components/roles/RoleQuickActions';
import NeedHelpCard from '../components/roles/NeedHelpCard';
import { apiService } from '../services/api';

export default function RolesPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<any | null>(null);
  const [name, setName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [serverError, setServerError] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const rList = await apiService.getRoles();
      setRoles(rList);

      const pList = await apiService.getPermissions();
      setPermissions(pList);
    } catch (err) {
      console.error('Failed to load roles page data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingRole(null);
    setName('');
    setSelectedPermissions([]);
    setErrors({});
    setServerError('');
    setIsModalOpen(true);
  };

  const openEditModal = (role: any) => {
    setEditingRole(role);
    setName(role.name);
    setSelectedPermissions(role.permissions || []);
    setErrors({});
    setServerError('');
    setIsModalOpen(true);
  };

  const handleTogglePermission = (permKey: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permKey)
        ? prev.filter(k => k !== permKey)
        : [...prev, permKey]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    setServerError('');

    try {
      await apiService.saveRole({
        id: editingRole ? editingRole.id : undefined,
        name,
        permissions: selectedPermissions,
      });
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      console.error('Failed to save role:', err);
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
    if (!confirm('Are you sure you want to delete this role?')) return;
    try {
      await apiService.deleteRole(id);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete role.');
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
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Roles</h1>
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 font-bold mt-2">
            <Link href="/dashboard" className="hover:text-[#5B3DF5] transition-colors">Dashboard</Link>
            <ChevronRight size={12} />
            <Link href="/users" className="hover:text-[#5B3DF5] transition-colors">Users & Roles</Link>
            <ChevronRight size={12} />
            <span className="text-gray-655 font-bold">Roles</span>
          </nav>
        </div>
        <div className="flex items-center">
          <button
            onClick={openAddModal}
            className="h-11 px-6 bg-[#5B3DF5] hover:bg-[#4a30db] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#5B3DF5]/15 active:scale-[0.98] flex items-center gap-2 cursor-pointer"
          >
            <Plus size={14} />
            Add New Role
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex gap-6">
        <div className="flex-1 min-w-0 space-y-6">
          <RolesStatsCards />
          <RolesFilters />
          {loading ? (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-12 flex justify-center items-center">
              <Loader2 className="h-8 w-8 text-[#5B3DF5] animate-spin" />
            </div>
          ) : (
            <RolesTable roles={roles} onEdit={openEditModal} onDelete={handleDelete} />
          )}
        </div>
        
        <div className="w-[320px] shrink-0 space-y-6">
          <RolesOverviewCard />
          <RoleStatusCard />
          <RoleQuickActions />
          <NeedHelpCard />
        </div>
      </div>

      {/* Add/Edit Role Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-gray-100 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h3 className="font-extrabold text-sm text-gray-900">{editingRole ? 'Edit Security Role' : 'Create Custom Role'}</h3>
                <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Assign granular functional privileges.</p>
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
                <label className="text-xs font-bold text-gray-500">Role Name *</label>
                <input
                  name="name" type="text" required value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Finance Assistant"
                  className={`w-full bg-gray-50 border ${fieldErr('name') ? 'border-red-400' : 'border-gray-200'} focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs text-gray-800 font-semibold focus:outline-none`}
                />
                {fieldErr('name') && <p className="text-red-500 text-[10px] font-semibold">{fieldErr('name')}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 block mb-1">Set Permissions Privileges *</label>
                <div className="max-h-[250px] overflow-y-auto border border-gray-100 rounded-2xl p-4 bg-gray-50/50 grid grid-cols-2 gap-3">
                  {permissions.map((p) => {
                    const isChecked = selectedPermissions.includes(p.key);
                    return (
                      <label key={p.id} className="flex items-start gap-2.5 p-2 bg-white rounded-xl border border-gray-150 hover:border-[#5B3DF5] hover:bg-white cursor-pointer transition-all">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleTogglePermission(p.key)}
                          className="mt-0.5 w-4 h-4 text-[#5B3DF5] focus:ring-[#5B3DF5]/30 rounded border-gray-300"
                        />
                        <div className="flex-1">
                          <p className="text-[11px] font-bold text-gray-800 leading-tight">{p.name}</p>
                          <p className="text-[9px] font-semibold text-gray-400 mt-0.5 uppercase">{p.module}</p>
                        </div>
                      </label>
                    );
                  })}
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
                  {editingRole ? 'Save Changes' : 'Create Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
