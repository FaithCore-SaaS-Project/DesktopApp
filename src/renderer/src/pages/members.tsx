import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/api';
import { MemberMock } from '../services/mockData';
import { UserPlus, Search, Edit3, Trash2, Mail, Phone, UserCheck, ShieldAlert } from 'lucide-react';

export default function MembersPage() {
  const { currentTenant, isOnline } = useApp();
  const [members, setMembers] = useState<MemberMock[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<MemberMock | null>(null);
  
  // Form input fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'Pastor' | 'Elder' | 'Deacon' | 'Member' | 'Volunteer' | 'Visitor'>('Member');
  const [status, setStatus] = useState<'Active' | 'Inactive' | 'Archived'>('Active');

  const loadMembers = async () => {
    if (!currentTenant) return;
    setLoading(true);
    try {
      const data = await apiService.getMembers(currentTenant.id);
      setMembers(data);
    } catch (err) {
      console.error('Error loading members:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, [currentTenant, isOnline]);

  const handleOpenAddModal = () => {
    setEditingMember(null);
    setName('');
    setEmail('');
    setPhone('');
    setRole('Member');
    setStatus('Active');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (member: MemberMock) => {
    setEditingMember(member);
    setName(member.name);
    setEmail(member.email);
    setPhone(member.phone);
    setRole(member.role);
    setStatus(member.status);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant) return;

    const newMember: MemberMock = {
      id: editingMember ? editingMember.id : `mem-${Date.now()}`,
      name,
      email,
      phone,
      role,
      joinedDate: editingMember ? editingMember.joinedDate : new Date().toISOString().split('T')[0],
      status,
      tenantId: currentTenant.id,
    };

    try {
      await apiService.saveMember(newMember);
      setIsModalOpen(false);
      loadMembers();
    } catch (err) {
      console.error('Error saving member:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this member profile? This will store changes locally.')) {
      try {
        await apiService.deleteMember(id);
        loadMembers();
      } catch (err) {
        console.error('Error deleting member:', err);
      }
    }
  };

  // Filter members list based on search bar text
  const filteredMembers = members.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Members Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">Manage profiles, ordination roles, and contact logs.</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/25 active:scale-[0.98] transition-all flex items-center space-x-2 w-full sm:w-auto justify-center"
        >
          <UserPlus className="h-4 w-4" />
          <span>Add Member Profile</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex bg-slate-900/40 border border-slate-800/60 p-4 rounded-xl items-center space-x-3">
        <Search className="h-4 w-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search by name, email, or telephone number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent border-0 focus:ring-0 text-xs text-slate-200 placeholder:text-slate-655 w-full focus:outline-none"
        />
      </div>

      {/* Directory Table */}
      <div className="bg-slate-900/30 border border-slate-800/60 rounded-2xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="py-20 flex items-center justify-center">
            <div className="h-8 w-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="py-20 text-center text-slate-500 space-y-2">
            <ShieldAlert className="h-10 w-10 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold">No records found</p>
            <p className="text-xs text-slate-600">Try adjusting your search criteria or register a new user profile.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <th className="p-4 pl-6">Name & Status</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Contact Details</th>
                  <th className="p-4">Registration Date</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-xs font-medium">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-900/10 transition-colors group">
                    <td className="p-4 pl-6 flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 flex items-center justify-center font-bold">
                        {member.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-slate-200 font-bold text-sm">{member.name}</span>
                        <span className="flex items-center space-x-1.5 mt-0.5">
                          <span className={`inline-block h-1.5 w-1.5 rounded-full ${
                            member.status === 'Active' ? 'bg-emerald-500' : member.status === 'Inactive' ? 'bg-amber-500' : 'bg-slate-600'
                          }`} />
                          <span className="text-[10px] text-slate-500">{member.status}</span>
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-800 text-indigo-300 border border-slate-700/60">
                        {member.role}
                      </span>
                    </td>
                    <td className="p-4 space-y-1">
                      {member.email && (
                        <div className="flex items-center space-x-1.5 text-slate-400">
                          <Mail className="h-3.5 w-3.5 text-slate-600" />
                          <span>{member.email}</span>
                        </div>
                      )}
                      {member.phone && (
                        <div className="flex items-center space-x-1.5 text-slate-400">
                          <Phone className="h-3.5 w-3.5 text-slate-600" />
                          <span>{member.phone}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-slate-400">{member.joinedDate}</td>
                    <td className="p-4 pr-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(member)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-slate-400 hover:text-white transition-colors"
                        title="Edit Profile"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500/80 hover:text-red-400 transition-colors"
                        title="Delete Profile"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CRUD Form Dialog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl animate-scale-in">
            <div className="p-6 border-b border-slate-850">
              <h2 className="text-lg font-bold text-white">
                {editingMember ? 'Update Member Profile' : 'Register New Member'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">All changes are stored locally before cloud synchronization.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label htmlFor="form-name" className="text-xs font-bold text-slate-400">Full Name</label>
                <input
                  id="form-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none placeholder:text-slate-700"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label htmlFor="form-email" className="text-xs font-bold text-slate-400">Email Address</label>
                <input
                  id="form-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. john@example.com"
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none placeholder:text-slate-700"
                />
              </div>

              {/* Telephone */}
              <div className="space-y-1.5">
                <label htmlFor="form-phone" className="text-xs font-bold text-slate-400">Telephone Number</label>
                <input
                  id="form-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +1 (555) 012-3456"
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none placeholder:text-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Ordination Role */}
                <div className="space-y-1.5">
                  <label htmlFor="form-role" className="text-xs font-bold text-slate-400">Ordination/Role</label>
                  <select
                    id="form-role"
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none cursor-pointer"
                  >
                    <option value="Pastor">Pastor</option>
                    <option value="Elder">Elder</option>
                    <option value="Deacon">Deacon</option>
                    <option value="Member">Member</option>
                    <option value="Volunteer">Volunteer</option>
                    <option value="Visitor">Visitor</option>
                  </select>
                </div>

                {/* Account Status */}
                <div className="space-y-1.5">
                  <label htmlFor="form-status" className="text-xs font-bold text-slate-400">Standing Status</label>
                  <select
                    id="form-status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-850">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-slate-400 hover:text-white text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/10 transition-all"
                >
                  {editingMember ? 'Save Changes' : 'Register Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
