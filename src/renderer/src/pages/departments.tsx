import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronDown, X, Building2 } from 'lucide-react';
import api from '../lib/axios';
import { useApp } from '../context/AppContext';

import DepartmentsStats from '../components/departments/DepartmentsStats';
import DepartmentsFilters from '../components/departments/DepartmentsFilters';
import DepartmentsTable from '../components/departments/DepartmentsTable';
import DepartmentDetails from '../components/departments/DepartmentDetails';

// No dummy data in production

const parseDescription = (desc: string | null) => {
  if (!desc) return { category: 'Ministry', description: '' };
  const match = desc.match(/^\[(.*?)\]\s*(.*)$/);
  if (match) {
    return { category: match[1], description: match[2] };
  }
  return { category: 'Ministry', description: desc };
};

export default function DepartmentsPage() {
  const { user } = useApp();
  const [departments, setDepartments] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Ministry');
  const [formLeaderId, setFormLeaderId] = useState('');
  const [formDescription, setFormDescription] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      // Fetch departments from Backend
      const deptRes = await api.get('/departments');
      const deptData = deptRes.data.data ?? deptRes.data;
      
      // Fetch members from Backend to populate leader list
      const membersRes = await api.get('/members');
      const membersData = membersRes.data.data ?? membersRes.data;
      setMembers(Array.isArray(membersData) ? membersData : []);

      if (Array.isArray(deptData)) {
        const formatted = deptData.map((d: any) => {
          const parsed = parseDescription(d.description);
          return {
            id: d.id,
            name: d.department_name,
            category: parsed.category,
            leader: d.leader ? `${d.leader.first_name} ${d.leader.last_name}` : 'No Leader',
            leader_id: d.leader_id,
            members: d.members?.length || 0,
            description: parsed.description,
            created_at: d.created_at ? new Date(d.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : new Date().toLocaleDateString(),
            status: 'Active',
            iconLetter: d.department_name.charAt(0),
            iconBg: 'bg-[#5B3DF5]',
            categoryColor: 'text-[#5B3DF5]'
          };
        });
        setDepartments(formatted);
        if (formatted.length > 0) {
          setSelectedDepartment(formatted[0]);
        } else {
          setSelectedDepartment(null);
        }
      }
    } catch (err: any) {
      console.error('Failed to load departments from backend', err?.message || 'Error occurred');
      setDepartments([]);
      setSelectedDepartment(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAddModal = () => {
    setEditingDepartment(null);
    setFormName('');
    setFormCategory('Ministry');
    setFormLeaderId('');
    setFormDescription('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (dept: any) => {
    setEditingDepartment(dept);
    setFormName(dept.name);
    setFormCategory(dept.category);
    setFormLeaderId(dept.leader_id || '');
    setFormDescription(dept.description || '');
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const fullDescription = `[${formCategory}] ${formDescription.trim()}`;

    try {
      const payload = {
        department_name: formName.trim(),
        leader_id: formLeaderId ? parseInt(formLeaderId) : null,
        description: fullDescription
      };

      if (editingDepartment && typeof editingDepartment.id === 'number') {
        await api.put(`/departments/${editingDepartment.id}`, payload);
      } else if (editingDepartment) {
        throw new Error('Local item edit');
      } else {
        await api.post('/departments', payload);
      }
      await loadData();
      setIsModalOpen(false);
    } catch (err: any) {
      alert('Failed to save department. ' + (err?.response?.data?.message || err?.message));
    }
  };

  const handleDeleteDepartment = async (id: number | string) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;

    const deptId = typeof id === 'number' ? id : parseInt(id as string, 10);
    try {
      if (deptId) {
        await api.delete(`/departments/${deptId}`);
        await loadData();
      }
    } catch (err: any) {
      alert('Failed to delete department. ' + (err?.message || 'Error occurred'));
    }
  };

  return (
    <div className="space-y-0 pb-10 p-8 bg-gradient-to-br from-slate-50 via-slate-50/50 to-indigo-50/30 min-h-screen">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Departments</h1>
          <nav className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mt-1.5">
            <Link href="/dashboard" passHref legacyBehavior>
              <a className="hover:text-[#5B3DF5] transition-colors">Dashboard</a>
            </Link>
            <ChevronRight size={12} />
            <span className="text-slate-600">Departments</span>
            <ChevronRight size={12} />
            <span className="text-[#5B3DF5]">All Departments</span>
          </nav>
        </div>
        
        <button
          type="button"
          onClick={handleOpenAddModal}
          className="bg-[#5B3DF5] hover:bg-[#4a30db] text-white px-5 py-2.5 rounded-2xl text-sm font-bold shadow-lg shadow-[#5B3DF5]/20 active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2 border border-[#5B3DF5]"
        >
          <span className="text-lg leading-none mb-0.5">+</span> Add New Department
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6">
        <DepartmentsStats departments={departments} />
      </div>
      
      {/* Filters */}
      <div className="mb-6">
        <DepartmentsFilters />
      </div>

      {/* Main Layout Grid */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <DepartmentsTable 
            departments={departments} 
            selectedDepartment={selectedDepartment}
            onSelect={setSelectedDepartment}
            onEdit={handleOpenEditModal}
            onDelete={handleDeleteDepartment}
          />
        </div>
        <div className="w-full lg:w-[320px] shrink-0">
          <DepartmentDetails 
            department={selectedDepartment} 
            onClose={() => setSelectedDepartment(null)}
            onDelete={handleDeleteDepartment}
          />
        </div>
      </div>

      {/* Add New Department Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="my-auto bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 animate-scale-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-50 bg-slate-50/30">
              <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
                <Building2 size={16} className="text-[#5B3DF5]" />
                {editingDepartment ? 'Edit Department Details' : 'Add New Department'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X size={15} className="text-slate-500" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveModal} className="p-6 space-y-4">
              {/* Department Name */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">Department Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Media Ministry"
                  className="w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-xs font-semibold text-slate-700 outline-none focus:border-[#5B3DF5] transition-all bg-white"
                />
              </div>

              {/* Grid for Category and Leader */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 py-2.5 px-3 bg-white text-xs font-bold text-slate-700 outline-none focus:border-[#5B3DF5] transition-all cursor-pointer"
                  >
                    {['Ministry', 'Education', 'Administration', 'Care & Support', 'Others'].map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">Department Leader</label>
                  <select
                    value={formLeaderId}
                    onChange={(e) => setFormLeaderId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 py-2.5 px-3 bg-white text-xs font-bold text-slate-700 outline-none focus:border-[#5B3DF5] transition-all cursor-pointer"
                  >
                    <option value="">No Leader</option>
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>{m.first_name} {m.last_name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">Description</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe the department's purpose..."
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-xs font-semibold text-slate-700 outline-none focus:border-[#5B3DF5] transition-all bg-white resize-none"
                />
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-50 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-600 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!formName.trim()}
                  className="flex-1 bg-[#5B3DF5] hover:bg-[#4a30db] text-white py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50 shadow-md shadow-[#5B3DF5]/15"
                >
                  {editingDepartment ? 'Save Changes' : 'Add Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
