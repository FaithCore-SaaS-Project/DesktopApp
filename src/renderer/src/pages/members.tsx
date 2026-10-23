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


import { useRouter } from 'next/router';
import { Download, UploadCloud, Image as ImageIcon, MessageSquare, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { apiService } from '../services/api';
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
      try {
        const res = await api.get('/members', {
          params: {
            page,
            search: searchTerm,
            gender: filterGender !== 'all' ? filterGender : undefined,
            status: filterStatus !== 'all' ? filterStatus : undefined
          }
        });
        return res.data;
      } catch (err) {
        console.warn('API get members failed, falling back to local members storage');
        const localRaw = typeof window !== 'undefined' ? localStorage.getItem('fc_members_local') : null;
        const localMembers = localRaw ? JSON.parse(localRaw) : [];
        return { data: localMembers, meta: { current_page: 1, last_page: 1, total: localMembers.length } };
      }
    }
  });

  const { data: families = [] } = useQuery({
    queryKey: ['families'],
    queryFn: async () => {
      const fams = await apiService.getFamilies('tenant');
      return Array.isArray(fams) ? fams : [];
    }
  });

  // Merge API members with any locally added members from offline/preview storage
  const apiMembers = membersRes?.data || (Array.isArray(membersRes) ? membersRes : []);
  const localMembers: any[] = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('fc_members_local') || '[]') : [];
  
  // Combine unique by id
  const combinedMembers = [...localMembers, ...apiMembers.filter((m: any) => !localMembers.some((lm: any) => lm.id === m.id))];
  const members = combinedMembers;
  const meta = membersRes?.meta || { current_page: 1, last_page: 1, total: members.length };
  const loading = loadingMembers;

  const openAddModal = () => {
    setEditingMember(null);
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
      console.error('Export failed', error?.message || 'Error occurred');
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
                    console.error(err?.message || 'Error occurred');
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

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 flex bg-white border border-slate-200/90 px-3.5 py-2 rounded-lg items-center gap-2.5 shadow-sm">
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by name, member number, email, or phone..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="bg-transparent border-0 text-xs text-slate-800 placeholder:text-slate-400 w-full focus:outline-none"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="text-slate-400 hover:text-slate-600 transition-colors">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <select 
            value={filterGender} onChange={e => setFilterGender(e.target.value)}
            className="bg-white border border-slate-200/90 text-xs font-semibold text-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm"
          >
            <option value="all">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <select 
            value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="bg-white border border-slate-200/90 text-xs font-semibold text-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="h-7 w-7 border-2 border-blue-500/20 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-xs text-slate-500 font-medium">Loading members from database…</p>
          </div>
        ) : members.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-2">
            <ShieldAlert className="h-9 w-9 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-700">No records found</p>
            <p className="text-[11px] text-slate-400">Try adjusting your search filters or add a new member profile.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-auto">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                  <th className="py-3 px-4 pl-5">Member</th>
                  <th className="py-3 px-4 whitespace-nowrap">Member No.</th>
                  <th className="py-3 px-4 whitespace-nowrap">Gender / DOB</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 pr-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {members.map(member => (
                  <tr key={member.id} className="hover:bg-slate-50/70 transition-colors group">
                    {/* Member Name & Avatar */}
                    <td className="py-3 px-4 pl-5">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 overflow-hidden rounded-full bg-slate-100 text-slate-700 border border-slate-200/80 flex items-center justify-center font-bold text-xs shrink-0">
                          {member.photo_url ? (
                            <img src={member.photo_url} alt="" className="h-full w-full object-cover" />
                          ) : (
                            `${member.first_name.charAt(0)}${member.last_name.charAt(0)}`
                          )}
                        </div>
                        <div className="min-w-0">
                          <Link href={`/members/${member.id}`} className="text-slate-900 hover:text-blue-600 font-bold transition-colors truncate block">
                            {member.first_name} {member.last_name}
                          </Link>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">{member.occupation ?? '—'}</p>
                        </div>
                      </div>
                    </td>

                    {/* Member No. - Fixed no-wrap mono badge */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/80 inline-block tracking-tight">
                        {member.member_no}
                      </span>
                    </td>

                    {/* Gender / DOB */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="capitalize text-slate-800 font-medium text-xs block">{member.gender}</span>
                      <span className="text-[11px] text-slate-400 font-mono block mt-0.5">{member.dob ?? '—'}</span>
                    </td>

                    {/* Contact */}
                    <td className="py-3 px-4 min-w-[180px]">
                      <div className="space-y-1">
                        {member.email && (
                          <div className="flex items-center gap-1.5 text-slate-600 text-[11px]">
                            <Mail className="h-3 w-3 text-slate-400 shrink-0" />
                            <span className="truncate max-w-[180px]">{member.email}</span>
                          </div>
                        )}
                        {member.phone && (
                          <div className="flex items-center gap-1.5 text-slate-600 text-[11px]">
                            <Phone className="h-3 w-3 text-slate-400 shrink-0" />
                            <span>{member.phone}</span>
                          </div>
                        )}
                        {!member.email && !member.phone && (
                          <span className="text-slate-400 text-[11px]">—</span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize border ${
                        member.status === 'active' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' 
                          : member.status === 'inactive'
                          ? 'bg-amber-50 text-amber-700 border-amber-200/60'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${statusColor(member.status)}`} />
                        {member.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 pr-5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <Link href={`/members/${member.id}`} className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors" title="View Profile">
                          <Eye className="h-3.5 w-3.5" />
                        </Link>
                        <button onClick={() => openEditModal(member)} className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors" title="Edit">
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => handleDelete(member)} className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-rose-600 transition-colors" title="Delete">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination & Footer */}
            <div className="px-5 py-3 border-t border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-[11px] text-slate-500 font-medium">
                Showing <span className="font-bold text-slate-800">{members.length}</span> of <span className="font-bold text-slate-800">{meta.total}</span> members
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <span className="text-xs font-semibold text-slate-700 px-1">
                  Page {meta.current_page} of {meta.last_page}
                </span>
                <button 
                  onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
                  disabled={page >= meta.last_page}
                  className="p-1.5 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
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
