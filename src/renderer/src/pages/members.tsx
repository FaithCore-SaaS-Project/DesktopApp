import React, { useState, useEffect } from 'react';
import api from '../lib/axios';
import { UserPlus, Search, Edit3, Trash2, Mail, Phone, ShieldAlert, Eye, X, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

// Matches the Laravel Member model + Resource
interface Member {
  id: number;
  member_no: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  gender: 'male' | 'female';
  dob: string | null;
  address: string | null;
  occupation: string | null;
  status: 'active' | 'inactive' | 'archived';
  membership_date: string | null;
  created_at: string;
}

const ROLES = ['Super Admin', 'Administrator', 'Pastor', 'Treasurer', 'Department Leader', 'Member'] as const;
const STATUS_OPTIONS = ['active', 'inactive', 'archived'] as const;
const statusColor = (s: string) =>
  s === 'active' ? 'bg-emerald-500' : s === 'inactive' ? 'bg-amber-500' : 'bg-slate-600';

const emptyForm = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  gender: 'male' as 'male' | 'female',
  dob: '',
  address: '',
  occupation: '',
  status: 'active' as 'active' | 'inactive' | 'archived',
};

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [serverError, setServerError] = useState('');

  const loadMembers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/members');
      // Laravel paginate returns { data: [...] }
      setMembers(res.data.data ?? res.data);
    } catch (err) {
      console.error('Failed to load members:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadMembers(); }, []);

  const openAddModal = () => {
    setEditingMember(null);
    setForm(emptyForm);
    setErrors({});
    setServerError('');
    setIsModalOpen(true);
  };

  const openEditModal = (m: Member) => {
    setEditingMember(m);
    setForm({
      first_name: m.first_name,
      last_name: m.last_name,
      email: m.email ?? '',
      phone: m.phone ?? '',
      gender: m.gender,
      dob: m.dob ?? '',
      address: m.address ?? '',
      occupation: m.occupation ?? '',
      status: m.status,
    });
    setErrors({});
    setServerError('');
    setIsModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    setServerError('');

    const payload = {
      ...form,
      dob: form.dob || null,
      address: form.address || null,
      occupation: form.occupation || null,
      email: form.email || null,
      phone: form.phone || null,
    };

    try {
      if (editingMember) {
        await api.put(`/members/${editingMember.id}`, payload);
      } else {
        await api.post('/members', payload);
      }
      setIsModalOpen(false);
      loadMembers();
    } catch (err: any) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors ?? {});
      } else {
        setServerError(err.response?.data?.message ?? 'An unexpected error occurred.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (m: Member) => {
    if (!confirm(`Are you sure you want to permanently delete ${m.first_name} ${m.last_name}? This cannot be undone.`)) return;
    try {
      await api.delete(`/members/${m.id}`);
      setMembers(prev => prev.filter(x => x.id !== m.id));
    } catch (err: any) {
      alert(err.response?.data?.message ?? 'Failed to delete member.');
    }
  };

  const filteredMembers = members.filter(m => {
    const full = `${m.first_name} ${m.last_name}`.toLowerCase();
    const t = searchTerm.toLowerCase();
    return full.includes(t) || (m.email ?? '').toLowerCase().includes(t) || (m.phone ?? '').includes(t);
  });

  const fieldErr = (field: string) => errors[field]?.[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Members Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">Manage profiles, roles, and contact information — all synced to the live database.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/25 active:scale-[0.98] transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <UserPlus className="h-4 w-4" />
          <span>Add Member</span>
        </button>
      </div>

      {/* Search */}
      <div className="flex bg-slate-900/40 border border-slate-800/60 p-4 rounded-xl items-center gap-3">
        <Search className="h-4 w-4 text-slate-500 shrink-0" />
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="bg-transparent border-0 focus:ring-0 text-xs text-slate-200 placeholder:text-slate-600 w-full focus:outline-none"
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm('')} className="text-slate-500 hover:text-white transition-colors">
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-slate-900/30 border border-slate-800/60 rounded-2xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
            <p className="text-xs text-slate-500 font-medium">Loading members from database…</p>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="py-20 text-center text-slate-500 space-y-2">
            <ShieldAlert className="h-10 w-10 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold">No records found</p>
            <p className="text-xs text-slate-600">Try adjusting your search or add a new member profile.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <th className="p-4 pl-6">Member</th>
                  <th className="p-4">Member No.</th>
                  <th className="p-4">Gender / DOB</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-xs font-medium">
                {filteredMembers.map(member => (
                  <tr key={member.id} className="hover:bg-slate-900/20 transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/15 flex items-center justify-center font-black text-sm shrink-0">
                          {member.first_name.charAt(0)}{member.last_name.charAt(0)}
                        </div>
                        <div>
                          <Link href={`/members/${member.id}`} className="text-slate-200 hover:text-indigo-400 font-bold transition-colors">
                            {member.first_name} {member.last_name}
                          </Link>
                          <p className="text-[10px] text-slate-600 mt-0.5">{member.occupation ?? '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-slate-800 text-indigo-300 border border-slate-700/60 tracking-wider">
                        {member.member_no}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">
                      <p className="capitalize">{member.gender}</p>
                      <p className="text-[10px] text-slate-600 mt-0.5">{member.dob ?? '—'}</p>
                    </td>
                    <td className="p-4 space-y-1">
                      {member.email && (
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Mail className="h-3 w-3 text-slate-600 shrink-0" />
                          <span>{member.email}</span>
                        </div>
                      )}
                      {member.phone && (
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Phone className="h-3 w-3 text-slate-600 shrink-0" />
                          <span>{member.phone}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`flex items-center gap-1.5 text-[10px] font-bold capitalize text-slate-300`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${statusColor(member.status)}`} />
                        {member.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right space-x-1.5">
                      <Link href={`/members/${member.id}`} className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors inline-flex" title="View Profile">
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                      <button onClick={() => openEditModal(member)} className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors" title="Edit">
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => handleDelete(member)} className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500/80 hover:text-red-400 transition-colors" title="Delete">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-6 py-3 border-t border-slate-800/40 text-xs text-slate-600 font-medium">
              Showing {filteredMembers.length} of {members.length} member{members.length !== 1 ? 's' : ''}
            </div>
          </div>
        )}
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">
                  {editingMember ? 'Update Member Profile' : 'Register New Member'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {editingMember ? 'Changes are saved directly to the live database.' : 'A unique Member Number will be auto-generated.'}
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-white transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Server-level error */}
              {serverError && (
                <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold flex items-center gap-2.5">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{serverError}</span>
                </div>
              )}

              {/* First Name / Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400">First Name <span className="text-red-500">*</span></label>
                  <input
                    name="first_name" type="text" required value={form.first_name} onChange={handleChange}
                    placeholder="e.g. John"
                    className={`w-full bg-slate-950/60 border ${fieldErr('first_name') ? 'border-red-500' : 'border-slate-800'} focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none placeholder:text-slate-700`}
                  />
                  {fieldErr('first_name') && <p className="text-red-400 text-[10px] font-semibold">{fieldErr('first_name')}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400">Last Name <span className="text-red-500">*</span></label>
                  <input
                    name="last_name" type="text" required value={form.last_name} onChange={handleChange}
                    placeholder="e.g. Perera"
                    className={`w-full bg-slate-950/60 border ${fieldErr('last_name') ? 'border-red-500' : 'border-slate-800'} focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none placeholder:text-slate-700`}
                  />
                  {fieldErr('last_name') && <p className="text-red-400 text-[10px] font-semibold">{fieldErr('last_name')}</p>}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400">Email Address</label>
                <input
                  name="email" type="email" value={form.email} onChange={handleChange}
                  placeholder="e.g. john@example.com"
                  className={`w-full bg-slate-950/60 border ${fieldErr('email') ? 'border-red-500' : 'border-slate-800'} focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none placeholder:text-slate-700`}
                />
                {fieldErr('email') && <p className="text-red-400 text-[10px] font-semibold">{fieldErr('email')}</p>}
              </div>

              {/* Phone / Gender */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400">Phone Number</label>
                  <input
                    name="phone" type="tel" value={form.phone} onChange={handleChange}
                    placeholder="e.g. +94 71 234 5678"
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none placeholder:text-slate-700"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400">Gender <span className="text-red-500">*</span></label>
                  <select
                    name="gender" value={form.gender} onChange={handleChange}
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none cursor-pointer"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              {/* DOB / Occupation */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400">Date of Birth</label>
                  <input
                    name="dob" type="date" value={form.dob} onChange={handleChange}
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-slate-400 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400">Standing Status</label>
                  <select
                    name="status" value={form.status} onChange={handleChange}
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none cursor-pointer"
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Occupation */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400">Occupation</label>
                <input
                  name="occupation" type="text" value={form.occupation} onChange={handleChange}
                  placeholder="e.g. Software Engineer"
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none placeholder:text-slate-700"
                />
              </div>

              {/* Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400">Address</label>
                <textarea
                  name="address" value={form.address} onChange={handleChange}
                  rows={2}
                  placeholder="Street, City, Country"
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none placeholder:text-slate-700 resize-none"
                />
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button" onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit" disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/10 transition-all disabled:opacity-60 flex items-center gap-2"
                >
                  {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  {editingMember ? 'Save Changes' : 'Register Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
