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
  nic: '',
  address_type: 'permanent', // permanent, postal, both
  permanent_address: '',
  postal_address: '',
  is_baptized: false,
  baptism_church: '',
  baptism_partner_name: '',
  baptism_date: '',
  marital_status: 'single', // single, married
  marriage_date: '',
import { useRouter } from 'next/router';
import { Download, UploadCloud, Image as ImageIcon, MessageSquare, FileText, ChevronLeft, ChevronRight, ShieldAlert } from 'lucide-react';
import { api, apiService } from '../services/api';
import SendNotificationModal from '../components/settings/notifications/SendNotificationModal';
import MemberFormModal from '../components/members/MemberFormModal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function MembersPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any | null>(null);

  const { data: membersRes, isLoading: loadingMembers, refetch: loadMembers } = useQuery({
    queryKey: ['members', page, searchTerm, filterGender, filterStatus],
    queryFn: async () => {
      const res = await api.get('/members', {
        params: {
          page,
          search: searchTerm,
          gender: filterGender !== 'all' ? filterGender : undefined,
          status: filterStatus !== 'all' ? filterStatus : undefined
        }
      });
      return res.data;
    }
  });

  const { data: families = [] } = useQuery({
    queryKey: ['families'],
    queryFn: async () => {
      const fams = await apiService.getFamilies('tenant');
      return Array.isArray(fams) ? fams : [];
    }
  });

  const members = membersRes?.data || (Array.isArray(membersRes) ? membersRes : []);
  const meta = membersRes?.meta || { current_page: 1, last_page: 1, total: members.length };
  const loading = loadingMembers;

  const openAddModal = () => {
    setEditingMember(null);
    setForm(emptyForm);
    setPhotoFile(null);
    setBaptismCertFile(null);
    setMarriageCertFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (member: Member) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleDelete = async (m: Member) => {
    if (!confirm(`Are you sure you want to permanently delete ${m.first_name} ${m.last_name}? This cannot be undone.`)) return;
    try {
      await api.delete(`/members/${m.id}`);
      queryClient.invalidateQueries({ queryKey: ['members'] });
    } catch (err: any) {
      alert(err.response?.data?.message ?? 'Failed to delete member.');
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await api.get('/members/export', {
        responseType: 'blob',
        params: {
          search: searchTerm,
          gender: filterGender !== 'all' ? filterGender : undefined,
          status: filterStatus !== 'all' ? filterStatus : undefined
        }
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'members_export.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Export failed', error);
      alert('Failed to export members. Please try again.');
    }
  };

  return (
    <div className="p-8 bg-[#f5f6fa] min-h-full select-none animate-fade-in relative space-y-6">
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
                    await apiService.importMembers(e.target.files[0]);
                    alert('Members imported successfully!');
                    queryClient.invalidateQueries({ queryKey: ['members'] });
                  } catch (err) {
                    alert('Failed to import members.');
                    console.error(err);
                  }
                }
                e.target.value = '';
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

      <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="h-8 w-8 border-4 border-indigo-500/20 border-t-[#5B3DF5] rounded-full animate-spin"></div>
            <p className="text-xs text-gray-500 font-semibold">Loading members from database…</p>
          </div>
        ) : members.length === 0 ? (
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
                {members.map(member => (
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
            <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/50">
              <div className="text-xs text-gray-500 font-medium">
                Showing <span className="font-bold text-gray-900">{members.length}</span> records on this page 
                (Total: <span className="font-bold text-gray-900">{meta.total}</span>)
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="text-xs font-bold text-gray-700 px-2">
                  Page {meta.current_page} of {meta.last_page}
                </div>
                <button 
                  onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
                  disabled={page === meta.last_page}
                  className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <MemberFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingMember={editingMember}
        families={families}
        onSuccess={() => {
            setIsModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ['members'] });
        }}
      />

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
