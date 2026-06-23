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
  family_id: number | null;
  photo_url: string | null;
  created_at: string;
}

interface Family {
  id: number;
  family_name: string;
}

const ROLES = ['Super Admin', 'Administrator', 'Pastor', 'Treasurer', 'Department Leader', 'Member'] as const;
const STATUS_OPTIONS = ['active', 'inactive', 'archived'] as const;
const statusColor = (s: string) =>
  s === 'active' ? 'bg-emerald-500' : s === 'inactive' ? 'bg-amber-500' : 'bg-gray-400';

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
  family_id: '' as string | number,
};

import { useRouter } from 'next/router';
import { Download, UploadCloud, Image as ImageIcon, MessageSquare } from 'lucide-react';
import { apiService } from '../services/api';
import SendNotificationModal from '../components/settings/notifications/SendNotificationModal';

export default function MembersPage() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [families, setFamilies] = useState<Family[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [serverError, setServerError] = useState('');

  const loadMembers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/members');
      setMembers(res.data.data ?? res.data);
      const fams = await apiService.getFamilies('tenant');
      setFamilies(fams);
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
    setPhotoFile(null);
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
      family_id: m.family_id ?? '',
    });
    setPhotoFile(null);
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

    try {
      const saved = await apiService.saveMember({
        id: editingMember ? editingMember.id.toString() : `MEM-${Date.now()}`,
        firstName: form.first_name,
        lastName: form.last_name,
        email: form.email,
        phone: form.phone,
        gender: form.gender,
        dob: form.dob,
        address: form.address,
        occupation: form.occupation,
        status: form.status,
        familyId: form.family_id ? form.family_id.toString() : undefined,
        tenantId: 'tenant',
        photoFile: photoFile || undefined
      });
      
      setIsModalOpen(false);
      if (!editingMember && saved && saved.data && saved.data.id) {
        // Flow Requirement: Redirect to Member Profile after Add Member -> Save
        router.push(`/members/${saved.data.id}`);
      } else {
        loadMembers();
      }
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
    const matchSearch = full.includes(t) || (m.email ?? '').toLowerCase().includes(t) || (m.phone ?? '').includes(t);
    const matchGender = filterGender === 'all' || m.gender === filterGender;
    const matchStatus = filterStatus === 'all' || m.status === filterStatus;
    return matchSearch && matchGender && matchStatus;
  });

  const handleExportCSV = () => {
    const headers = ['Member No', 'First Name', 'Last Name', 'Email', 'Phone', 'Gender', 'Status', 'Occupation', 'Date of Birth'];
    const csvContent = [
      headers.join(','),
      ...filteredMembers.map(m => 
        [m.member_no, m.first_name, m.last_name, m.email || '', m.phone || '', m.gender, m.status, m.occupation || '', m.dob || ''].join(',')
      )
    ].join('\\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'members_export.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const fieldErr = (field: string) => errors[field]?.[0];

  return (
    <div className="p-8 bg-[#f5f6fa] min-h-full select-none animate-fade-in relative space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-none">
            Members Directory
          </h1>
          <p className="text-xs text-gray-500 mt-2 font-medium">Manage profiles, roles, and contact information — all synced to the live database.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <label className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 justify-center cursor-pointer">
            <UploadCloud className="h-4 w-4 text-gray-500" />
            <span>Import CSV</span>
            <input 
              type="file" 
              accept=".csv,.xlsx,.xls" 
              className="hidden" 
              onChange={async (e) => {
                if (e.target.files && e.target.files[0]) {
                  try {
                    setLoading(true);
                    await apiService.importMembers(e.target.files[0]);
                    alert('Members imported successfully!');
                    loadMembers();
                  } catch (err) {
                    alert('Failed to import members.');
                    console.error(err);
                  } finally {
                    setLoading(false);
                  }
                }
                e.target.value = ''; // Reset input
              }} 
            />
          </label>
          <button
            onClick={() => setIsSendModalOpen(true)}
            className="bg-white border border-gray-200 hover:bg-gray-50 text-[#5B3DF5] px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 justify-center"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Send Message</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 justify-center"
          >
            <Download className="h-4 w-4 text-gray-500" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={openAddModal}
            className="bg-[#5B3DF5] hover:bg-[#4d32d6] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-[#5B3DF5]/15 active:scale-[0.98] transition-all flex items-center gap-2 justify-center"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 flex bg-white border border-gray-200 p-4 rounded-xl items-center gap-3 shadow-sm">
          <Search className="h-4 w-4 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="bg-transparent border-0 focus:ring-0 text-sm text-gray-800 placeholder:text-gray-400 w-full focus:outline-none"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex gap-3">
          <select 
            value={filterGender} onChange={e => setFilterGender(e.target.value)}
            className="bg-white border border-gray-200 text-sm font-bold text-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-[#5B3DF5] cursor-pointer shadow-sm"
          >
            <option value="all">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <select 
            value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="bg-white border border-gray-200 text-sm font-bold text-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-[#5B3DF5] cursor-pointer shadow-sm"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="h-8 w-8 border-4 border-indigo-500/20 border-t-[#5B3DF5] rounded-full animate-spin"></div>
            <p className="text-xs text-gray-500 font-semibold">Loading members from database…</p>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="py-20 text-center text-gray-400 space-y-2">
            <ShieldAlert className="h-10 w-10 text-gray-300 mx-auto" />
            <p className="text-sm font-semibold text-gray-600">No records found</p>
            <p className="text-xs">Try adjusting your search or add a new member profile.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                  <th className="p-4 pl-6">Member</th>
                  <th className="p-4">Member No.</th>
                  <th className="p-4">Gender / DOB</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs font-medium">
                {filteredMembers.map(member => (
                  <tr key={member.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 overflow-hidden rounded-xl bg-indigo-50 text-[#5B3DF5] border border-indigo-100 flex items-center justify-center font-black text-sm shrink-0">
                          {member.photo_url ? (
                            <img src={member.photo_url} alt="" className="h-full w-full object-cover" />
                          ) : (
                            `${member.first_name.charAt(0)}${member.last_name.charAt(0)}`
                          )}
                        </div>
                        <div>
                          <Link href={`/members/${member.id}`} className="text-gray-900 hover:text-[#5B3DF5] font-bold transition-colors">
                            {member.first_name} {member.last_name}
                          </Link>
                          <p className="text-[10px] text-gray-500 mt-0.5">{member.occupation ?? '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-gray-100 text-gray-700 border border-gray-200 tracking-wider">
                        {member.member_no}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500">
                      <p className="capitalize text-gray-700">{member.gender}</p>
                      <p className="text-[10px] mt-0.5">{member.dob ?? '—'}</p>
                    </td>
                    <td className="p-4 space-y-1">
                      {member.email && (
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Mail className="h-3 w-3 text-gray-400 shrink-0" />
                          <span>{member.email}</span>
                        </div>
                      )}
                      {member.phone && (
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Phone className="h-3 w-3 text-gray-400 shrink-0" />
                          <span>{member.phone}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`flex items-center gap-1.5 text-[10px] font-bold capitalize text-gray-700`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${statusColor(member.status)}`} />
                        {member.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right space-x-1.5">
                      <Link href={`/members/${member.id}`} className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-[#5B3DF5] transition-colors inline-flex" title="View Profile">
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                      <button onClick={() => openEditModal(member)} className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-[#5B3DF5] transition-colors" title="Edit">
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => handleDelete(member)} className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-500 transition-colors" title="Delete">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-6 py-3 border-t border-gray-100 text-xs text-gray-500 font-medium bg-gray-50/50">
              Showing {filteredMembers.length} of {members.length} member{members.length !== 1 ? 's' : ''}
            </div>
          </div>
        )}
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-2xl animate-scale-in">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h2 className="text-lg font-extrabold text-gray-900">
                  {editingMember ? 'Update Member Profile' : 'Register New Member'}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {editingMember ? 'Changes are saved directly to the live database.' : 'A unique Member Number will be auto-generated.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-gray-200 text-gray-400 hover:text-gray-900 rounded-xl transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Server-level error */}
              {serverError && (
                <div className="p-3.5 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-semibold flex items-center gap-2.5">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{serverError}</span>
                </div>
              )}

              {/* Photo Upload & Family Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">Profile Photo</label>
                  <label className="flex items-center gap-3 border border-dashed border-gray-300 hover:border-[#5B3DF5] hover:bg-gray-50/50 rounded-xl px-4 py-2 cursor-pointer transition-colors group">
                    <div className="h-8 w-8 rounded-lg bg-gray-100 group-hover:bg-indigo-50 flex items-center justify-center text-gray-400 group-hover:text-[#5B3DF5]">
                      {photoFile ? <ImageIcon className="h-4 w-4" /> : <UploadCloud className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-[10px] font-bold text-gray-700 truncate">{photoFile ? photoFile.name : 'Upload Photo'}</p>
                      <p className="text-[9px] text-gray-400">JPG, PNG (Max 5MB)</p>
                    </div>
                    <input
                      type="file" accept="image/*" className="hidden"
                      onChange={(e) => setPhotoFile(e.target.files ? e.target.files[0] : null)}
                    />
                  </label>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">Assign to Family</label>
                  <select
                    name="family_id" value={form.family_id} onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[#5B3DF5] rounded-xl px-3 py-3 text-xs text-gray-800 font-bold focus:outline-none cursor-pointer"
                  >
                    <option value="">-- No Family (Individual) --</option>
                    {families.map(f => (
                      <option key={f.id} value={f.id}>{f.family_name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* First Name / Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">First Name <span className="text-red-500">*</span></label>
                  <input
                    name="first_name" type="text" required value={form.first_name} onChange={handleChange}
                    placeholder="e.g. John"
                    className={`w-full bg-gray-50 border ${fieldErr('first_name') ? 'border-red-400' : 'border-gray-200'} focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs text-gray-800 font-semibold focus:outline-none placeholder:text-gray-400`}
                  />
                  {fieldErr('first_name') && <p className="text-red-500 text-[10px] font-semibold">{fieldErr('first_name')}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">Last Name <span className="text-red-500">*</span></label>
                  <input
                    name="last_name" type="text" required value={form.last_name} onChange={handleChange}
                    placeholder="e.g. Perera"
                    className={`w-full bg-gray-50 border ${fieldErr('last_name') ? 'border-red-400' : 'border-gray-200'} focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs text-gray-800 font-semibold focus:outline-none placeholder:text-gray-400`}
                  />
                  {fieldErr('last_name') && <p className="text-red-500 text-[10px] font-semibold">{fieldErr('last_name')}</p>}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">Email Address</label>
                <input
                  name="email" type="email" value={form.email} onChange={handleChange}
                  placeholder="e.g. john@example.com"
                  className={`w-full bg-gray-50 border ${fieldErr('email') ? 'border-red-400' : 'border-gray-200'} focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs text-gray-800 font-semibold focus:outline-none placeholder:text-gray-400`}
                />
                {fieldErr('email') && <p className="text-red-500 text-[10px] font-semibold">{fieldErr('email')}</p>}
              </div>

              {/* Phone / Gender */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">Phone Number</label>
                  <input
                    name="phone" type="tel" value={form.phone} onChange={handleChange}
                    placeholder="e.g. +94 71 234 5678"
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs text-gray-800 font-semibold focus:outline-none placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">Gender <span className="text-red-500">*</span></label>
                  <select
                    name="gender" value={form.gender} onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[#5B3DF5] rounded-xl px-3 py-2.5 text-xs text-gray-800 font-bold focus:outline-none cursor-pointer"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              {/* DOB / Occupation */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">Date of Birth</label>
                  <input
                    name="dob" type="date" value={form.dob} onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs text-gray-800 font-semibold focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">Standing Status</label>
                  <select
                    name="status" value={form.status} onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[#5B3DF5] rounded-xl px-3 py-2.5 text-xs text-gray-800 font-bold focus:outline-none cursor-pointer"
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Occupation */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">Occupation</label>
                <input
                  name="occupation" type="text" value={form.occupation} onChange={handleChange}
                  placeholder="e.g. Software Engineer"
                  className="w-full bg-gray-50 border border-gray-200 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs text-gray-800 font-semibold focus:outline-none placeholder:text-gray-400"
                />
              </div>

              {/* Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">Address</label>
                <textarea
                  name="address" value={form.address} onChange={handleChange}
                  rows={2}
                  placeholder="Street, City, Country"
                  className="w-full bg-gray-50 border border-gray-200 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs text-gray-800 font-semibold focus:outline-none placeholder:text-gray-400 resize-none"
                />
              </div>

              {/* Form Buttons */}
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
                  {editingMember ? 'Save Changes' : 'Register Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isSendModalOpen && (
        <SendNotificationModal 
          members={members.map(m => ({
            id: m.id.toString(),
            memberNo: m.member_no,
            firstName: m.first_name,
            lastName: m.last_name,
            phone: m.phone || '',
            email: m.email || '',
            gender: m.gender,
            dob: m.dob || '',
            address: m.address || '',
            status: m.status === 'active',
            tenantId: 'tenant',
          }))}
          onClose={() => setIsSendModalOpen(false)}
          onSuccess={() => setIsSendModalOpen(false)}
        />
      )}
    </div>
  );
}
