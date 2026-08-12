import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '../lib/axios';
import { Home, ChevronRight, X, AlertCircle, Sparkles } from 'lucide-react';
import FamilyStats from '../components/families/FamilyStats';
import FamilyFilters from '../components/families/FamilyFilters';
import FamilyTable from '../components/families/FamilyTable';

interface Family {
  id: string;
  name: string;
  members: number;
  district: string;
  joined: string;
  status: 'Active' | 'Inactive';
  cellGroup: string;
  hasAddress: boolean;
  hasPhone: boolean;
}

interface Member {
  id: string;
  name: string;
}

export default function FamiliesPage() {
  const [families, setFamilies] = useState<Family[]>([]);
  const [availableMembers, setAvailableMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cellGroupFilter, setCellGroupFilter] = useState('all');
  const [viewFilterType, setViewFilterType] = useState<'all' | 'no-address' | 'no-phone'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFamily, setEditingFamily] = useState<Family | null>(null);
  const [viewingFamily, setViewingFamily] = useState<any | null>(null);

  // Form inputs
  const [familyName, setFamilyName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [district, setDistrict] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [cellGroup, setCellGroup] = useState('Kandy Cell Group 2');

  const fetchFamilies = async () => {
    try {
      const res = await api.get('/families');
      setFamilies(res.data.data);
    } catch (err) {
      console.error('Error fetching families:', err);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await api.get('/members');
      // Extract members for dropdown (can filter out those already in a family if preferred)
      const mapped = res.data.data.map((m: any) => ({
        id: m.id,
        name: `${m.first_name} ${m.last_name}`,
      }));
      setAvailableMembers(mapped);
    } catch (err) {
      console.error('Error fetching members:', err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchFamilies();
      await fetchMembers();
      setLoading(false);
    };
    loadData();
  }, []);

  const handleOpenAddModal = () => {
    setEditingFamily(null);
    setFamilyName('');
    setSelectedMembers([]);
    setDistrict('');
    setStatus('Active');
    setCellGroup('Kandy Cell Group 2');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (family: Family) => {
    setEditingFamily(family);
    setFamilyName(family.name);
    setSelectedMembers([]); // In a complete app, we would fetch existing members of the family
    setDistrict(family.district);
    setStatus(family.status);
    setCellGroup(family.cellGroup);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingFamily(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!familyName.trim()) return;

    try {
      const payload = {
        family_name: familyName,
        district,
        address: district,
        status,
        cell_group: cellGroup,
        member_ids: selectedMembers
      };

      if (editingFamily) {
        await api.put(`/families/${editingFamily.id}`, payload);
      } else {
        await api.post('/families', payload);
      }
      
      await fetchFamilies();
      handleCloseModal();
    } catch (err) {
      console.error('Error saving family:', err);
      alert('Failed to save family profile.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this family profile?')) {
      try {
        await api.delete(`/families/${id}`);
        await fetchFamilies();
        
        // Adjust page if we deleted the last item of a page
        const newTotal = families.length - 1;
        const newMaxPages = Math.ceil(newTotal / pageSize);
        if (currentPage > newMaxPages && newMaxPages > 0) {
          setCurrentPage(newMaxPages);
        }
      } catch (err) {
        console.error('Error deleting family:', err);
        alert('Failed to delete family profile.');
      }
    }
  };

  const handleViewFamily = async (fam: Family) => {
    try {
      const res = await api.get(`/families/${fam.id}`);
      setViewingFamily(res.data.data);
    } catch (err) {
      console.error('Error viewing family:', err);
      alert('Failed to load household details.');
    }
  };

  const handleStatsFilter = (type: 'all' | 'no-address' | 'no-phone') => {
    setViewFilterType(type);
    setCurrentPage(1);
  };

  const handleExport = () => {
    alert("Exporting families database as CSV report...");
  };

  // Compute lists of status and cell group options for filter selectors
  const statusOptions = Array.from(new Set(families.map(f => f.status)));
  const cellGroupOptions = Array.from(new Set(families.map(f => f.cellGroup))).filter(Boolean);

  // Filter computation
  const filteredFamilies = families.filter(f => {
    // Search filter
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          f.district.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || f.status === statusFilter;

    // Cell Group filter
    const matchesCellGroup = cellGroupFilter === 'all' || f.cellGroup === cellGroupFilter;

    // Stats View filter
    let matchesStatsView = true;
    if (viewFilterType === 'no-address') {
      matchesStatsView = !f.hasAddress;
    } else if (viewFilterType === 'no-phone') {
      matchesStatsView = !f.hasPhone;
    }

    return matchesSearch && matchesStatus && matchesCellGroup && matchesStatsView;
  });

  // Pagination slice
  const totalPages = Math.ceil(filteredFamilies.length / pageSize);
  const paginatedFamilies = filteredFamilies.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Compute stats totals
  const totalFamiliesCount = families.length;
  const totalMembersCount = families.reduce((sum, f) => sum + f.members, 0);
  const newFamiliesCount = families.filter(f => f.joined.includes('May 2023') || f.joined.includes('2026') || f.joined.includes('Jun')).length;
  const withoutAddressCount = families.filter(f => !f.hasAddress).length;
  const withoutPhoneCount = families.filter(f => !f.hasPhone).length;

  return (
    <div className="p-8 bg-[#f5f6fa] min-h-full select-none animate-fade-in relative">
      {/* Header and Breadcrumbs */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-none">
            Families Directory
          </h1>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 mt-3 pl-1">
            <Link href="/dashboard" className="hover:text-gray-600">Dashboard</Link>
            <ChevronRight size={12} />
            <span className="text-gray-650 font-bold">Families</span>
          </div>
        </div>
        {viewFilterType !== 'all' && (
          <div className="bg-indigo-50 border border-indigo-100 px-4 py-2.5 rounded-2xl flex items-center gap-2.5 text-xs font-bold text-[#5B3DF5]">
            <Sparkles size={16} />
            <span>Viewing {viewFilterType === 'no-address' ? 'Families without Address' : 'Families without Phone'}</span>
            <button 
              onClick={() => setViewFilterType('all')}
              className="p-0.5 hover:bg-indigo-100 rounded-lg text-[#5B3DF5]"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Stats Section */}
      <FamilyStats
        totalFamilies={totalFamiliesCount}
        totalMembers={totalMembersCount}
        newFamilies={newFamiliesCount}
        withoutAddress={withoutAddressCount}
        withoutPhone={withoutPhoneCount}
        onViewFilter={handleStatsFilter}
      />

      {/* Filter Options Section */}
      <FamilyFilters
        searchTerm={searchTerm}
        onSearchChange={(val) => { setSearchTerm(val); setCurrentPage(1); }}
        statusFilter={statusFilter}
        onStatusFilterChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}
        cellGroupFilter={cellGroupFilter}
        onCellGroupFilterChange={(val) => { setCellGroupFilter(val); setCurrentPage(1); }}
        onAddFamilyClick={handleOpenAddModal}
        onExportClick={handleExport}
        statusOptions={statusOptions}
        cellGroupOptions={cellGroupOptions}
      />

      {/* Family Data Table */}
      <FamilyTable
        families={paginatedFamilies}
        onViewClick={handleViewFamily}
        onEditClick={handleOpenEditModal}
        onDeleteClick={handleDelete}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalFamiliesCount={filteredFamilies.length}
        pageSize={pageSize}
      />

      {/* dialog modal for adding/editing family */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="my-auto w-full max-w-md bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-2xl animate-scale-in">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-extrabold text-gray-900">
                {editingFamily ? 'Update Family Profile' : 'Register New Family'}
              </h2>
              <button 
                onClick={handleCloseModal}
                className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded-xl transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Family Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase">Family Name</label>
                <input
                  type="text"
                  required
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  placeholder="e.g. Perera Family"
                  className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none"
                />
              </div>

              {/* Members Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase">Household Members</label>
                <div className="w-full bg-gray-50/50 border border-gray-250 rounded-xl px-4 py-2.5 max-h-40 overflow-y-auto">
                  {availableMembers.length === 0 ? (
                    <p className="text-xs text-gray-500 italic">No available members to assign.</p>
                  ) : (
                    availableMembers.map(member => (
                      <label key={member.id} className="flex items-center gap-2 mb-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedMembers.includes(member.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedMembers([...selectedMembers, member.id]);
                            } else {
                              setSelectedMembers(selectedMembers.filter(id => id !== member.id));
                            }
                          }}
                          className="w-4 h-4 text-[#5B3DF5] rounded border-gray-300 focus:ring-[#5B3DF5]"
                        />
                        <span className="text-sm font-semibold text-gray-800">{member.name}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase">District / Primary Location</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="e.g. Kandy, Colombo (leave blank if unknown)"
                  className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Status */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase">Standing Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-3 py-2.5 text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                {/* Cell Group */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase">Cell Fellowship Group</label>
                  <select
                    value={cellGroup}
                    onChange={(e) => setCellGroup(e.target.value)}
                    className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-3 py-2.5 text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
                  >
                    <option value="Kandy Cell Group 1">Kandy Cell Group 1</option>
                    <option value="Kandy Cell Group 2">Kandy Cell Group 2</option>
                    <option value="Colombo Cell Group A">Colombo Cell Group A</option>
                    <option value="Gampaha Fellowship">Gampaha Fellowship</option>
                    <option value="Southern Cells">Southern Cells</option>
                    <option value="East Coast Fellowship">East Coast Fellowship</option>
                    <option value="Negombo Outreach">Negombo Outreach</option>
                  </select>
                </div>
              </div>

              {/* Form buttons */}
              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-[#5B3DF5] hover:bg-[#4d32d6] text-white text-xs font-bold shadow-md shadow-[#5B3DF5]/10 transition-all"
                >
                  {editingFamily ? 'Save Changes' : 'Register Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* dialog modal for viewing family details */}
      {viewingFamily && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="my-auto w-full max-w-md bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-2xl animate-scale-in">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-extrabold text-gray-900">
                Household Details
              </h2>
              <button 
                onClick={() => setViewingFamily(null)}
                className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded-xl transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="text-center">
                <div className="h-16 w-16 bg-[#5B3DF5]/10 rounded-2xl flex items-center justify-center text-[#5B3DF5] mx-auto mb-3">
                  <Sparkles size={28} />
                </div>
                <h3 className="text-2xl font-black text-gray-900">{viewingFamily.name}</h3>
                <p className="text-xs text-gray-400 font-bold mt-1 font-mono">ID: {viewingFamily.id.toUpperCase()}</p>
              </div>

              <div className="space-y-3.5 border-t border-b border-gray-100 py-4 text-xs font-bold">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 uppercase">Members Count</span>
                  <span className="text-gray-800 text-sm font-extrabold">{viewingFamily.members} members</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 uppercase">Standing Status</span>
                  <span className={`px-2 py-0.5 rounded-lg border text-[10px] ${
                    viewingFamily.status === 'Active' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-amber-50 border-amber-100 text-amber-700'
                  }`}>
                    {viewingFamily.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 uppercase">District</span>
                  <span className="text-gray-800 text-sm font-semibold">{viewingFamily.district || 'Not Provided'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 uppercase">Joined Fellowship</span>
                  <span className="text-gray-800 text-sm font-semibold">{viewingFamily.joined}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 uppercase">Cell Group</span>
                  <span className="text-gray-800 text-sm font-semibold">{viewingFamily.cellGroup}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase">Household Members</h4>
                <div className="space-y-1.5">
                  {viewingFamily.household_members?.map((m: any, index: number) => (
                    <p key={m.id} className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                      <span className={`h-1.5 w-1.5 rounded-full ${index === 0 ? 'bg-[#5B3DF5]' : 'bg-slate-350'}`} />
                      {m.name} {index === 0 ? '(Head)' : ''}
                    </p>
                  ))}
                  {(!viewingFamily.household_members || viewingFamily.household_members.length === 0) && (
                    <p className="text-xs text-gray-400 italic">No members assigned.</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setViewingFamily(null)}
                  className="w-full py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-650 text-xs font-bold transition-all cursor-pointer text-center"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
