import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Plus, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/api';
import { BudgetMock } from '../../services/mockData';

import BudgetStats from '../../components/finance/budgets/BudgetStats';
import BudgetFilters from '../../components/finance/budgets/BudgetFilters';
import BudgetsTable from '../../components/finance/budgets/BudgetsTable';
import BudgetSidebar from '../../components/finance/budgets/BudgetSidebar';
import CategoriesPagination from '../../components/finance/categories/CategoriesPagination'; // Reusing standard pagination!

export default function FinanceBudgetsPage() {
  const { currentTenant } = useApp();
  const [budgets, setBudgets] = useState<BudgetMock[]>([]);
  const [loading, setLoading] = useState(true);

  // Selection
  const [selectedBudget, setSelectedBudget] = useState<BudgetMock | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('2025');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8; // Renders 8 rows to support page 1 (8 rows) & page 2 (4 rows) of 12 budgets

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editId, setEditId] = useState('');

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState<'Operating' | 'Capital' | 'Ministry'>('Operating');
  const [formBudgetAmount, setFormBudgetAmount] = useState('');
  const [formSpentAmount, setFormSpentAmount] = useState('');
  const [formPeriodStart, setFormPeriodStart] = useState('2025-01-01');
  const [formPeriodEnd, setFormPeriodEnd] = useState('2025-12-31');
  const [formStatus, setFormStatus] = useState<'In Progress' | 'Completed'>('In Progress');
  const [formDesc, setFormDesc] = useState('');

  const loadData = async () => {
    if (!currentTenant) return;
    setLoading(true);
    try {
      const budgetList = await apiService.getBudgets(currentTenant.id);
      setBudgets(budgetList);

      if (budgetList.length > 0) {
        setSelectedBudget(budgetList[0]);
      } else {
        setSelectedBudget(null);
      }
    } catch (err) {
      console.error('Error loading budgets data:', err?.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentTenant]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setYearFilter('2025');
    setTypeFilter('all');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  // Filter budgets
  const filteredBudgets = budgets.filter(b => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.description && b.description.toLowerCase().includes(searchTerm.toLowerCase()));

    // Year filter (based on periodStart prefix)
    const matchesYear = b.periodStart.startsWith(yearFilter);
    const matchesType = typeFilter === 'all' || b.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;

    return matchesSearch && matchesYear && matchesType && matchesStatus;
  });

  // Sort by date created or ID
  const sortedBudgets = [...filteredBudgets].sort((a, b) => a.createdOn.localeCompare(b.createdOn));

  // Paginated Budgets
  const totalPages = Math.max(1, Math.ceil(sortedBudgets.length / pageSize));
  const paginatedBudgets = sortedBudgets.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Sync selection details
  useEffect(() => {
    if (paginatedBudgets.length > 0) {
      const isStillVisible = paginatedBudgets.some(b => b.id === selectedBudget?.id);
      if (!isStillVisible) {
        setSelectedBudget(paginatedBudgets[0]);
      }
    } else {
      setSelectedBudget(null);
    }
  }, [searchTerm, yearFilter, typeFilter, statusFilter, currentPage, budgets]);

  const handleOpenAddModal = () => {
    setModalMode('add');
    setEditId('');
    setFormName('');
    setFormType('Operating');
    setFormBudgetAmount('');
    setFormSpentAmount('0');
    setFormPeriodStart(`${yearFilter}-01-01`);
    setFormPeriodEnd(`${yearFilter}-12-31`);
    setFormStatus('In Progress');
    setFormDesc('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (b: BudgetMock) => {
    setModalMode('edit');
    setEditId(b.id);
    setFormName(b.name);
    setFormType(b.type);
    setFormBudgetAmount(b.budgetAmount.toString());
    setFormSpentAmount(b.spentAmount.toString());
    setFormPeriodStart(b.periodStart);
    setFormPeriodEnd(b.periodEnd);
    setFormStatus(b.status);
    setFormDesc(b.description || '');
    setIsModalOpen(true);
  };

  const handleDeleteBudget = async (b: BudgetMock) => {
    if (!currentTenant) return;
    if (confirm(`Are you sure you want to delete the budget: "${b.name}"?`)) {
      try {
        await apiService.deleteBudget(b.id);
        const list = await apiService.getBudgets(currentTenant.id);
        setBudgets(list);

        if (selectedBudget?.id === b.id) {
          setSelectedBudget(list.length > 0 ? list[0] : null);
        }

        const remainingFiltered = filteredBudgets.filter(item => item.id !== b.id);
        const maxPages = Math.ceil(remainingFiltered.length / pageSize);
        if (currentPage > maxPages && maxPages > 0) {
          setCurrentPage(maxPages);
        }
      } catch (err) {
        console.error('Error deleting budget:', err?.message || 'Error occurred');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant) return;

    if (!formName.trim()) {
      alert('Please enter a budget name.');
      return;
    }

    const budgetVal = parseFloat(formBudgetAmount);
    const spentVal = parseFloat(formSpentAmount);

    if (isNaN(budgetVal) || budgetVal < 0 || isNaN(spentVal) || spentVal < 0) {
      alert('Please enter valid positive numbers for budget and spent amounts.');
      return;
    }

    const isDuplicate = budgets.some(
      b => b.name.toLowerCase() === formName.trim().toLowerCase() && b.id !== editId
    );
    if (isDuplicate) {
      alert(`A budget with the name "${formName.trim()}" already exists.`);
      return;
    }

    const originalBudget = budgets.find(b => b.id === editId);

    const budgetData: BudgetMock = {
      id: modalMode === 'add' ? `bud-${Date.now()}` : editId,
      name: formName.trim(),
      type: formType,
      budgetAmount: budgetVal,
      spentAmount: spentVal,
      periodStart: formPeriodStart,
      periodEnd: formPeriodEnd,
      status: formStatus,
      description: formDesc.trim() || undefined,
      tenantId: currentTenant.id,
      createdOn: originalBudget?.createdOn || new Date().toISOString().split('T')[0]
    };

    try {
      await apiService.saveBudget(budgetData);
      const list = await apiService.getBudgets(currentTenant.id);
      setBudgets(list);
      setIsModalOpen(false);

      const target = list.find(item => item.id === budgetData.id);
      if (target) {
        setSelectedBudget(target);
      }
    } catch (err) {
      console.error('Error saving budget:', err?.message || 'Error occurred');
    }
  };

  return (
    <div className="p-8 bg-[#f5f6fa] min-h-full select-none animate-fade-in relative">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-none">
            Budgets
          </h1>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 mt-3 pl-1">
            <Link href="/dashboard" className="hover:text-gray-600">Dashboard</Link>
            <ChevronRight size={12} />
            <Link href="/finance" className="hover:text-gray-600">Finance</Link>
            <ChevronRight size={12} />
            <span className="text-gray-650 font-bold">Budgets</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 rounded-xl bg-[#5B3DF5] hover:bg-[#4d32d6] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-[#5B3DF5]/15 transition-all cursor-pointer active:scale-[0.98]"
        >
          <Plus size={16} />
          Create New Budget
        </button>
      </div>

      {/* Stats Cards */}
      <BudgetStats budgets={budgets} />

      {/* Filters Panel */}
      <BudgetFilters
        searchTerm={searchTerm}
        onSearchChange={(val) => { setSearchTerm(val); setCurrentPage(1); }}
        yearFilter={yearFilter}
        onYearFilterChange={(val) => { setYearFilter(val); setCurrentPage(1); }}
        typeFilter={typeFilter}
        onTypeFilterChange={(val) => { setTypeFilter(val); setCurrentPage(1); }}
        statusFilter={statusFilter}
        onStatusFilterChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}
        onResetFilters={handleResetFilters}
      />

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-start">
        {/* Table & Pagination */}
        <div className="lg:col-span-9 bg-white rounded-3xl border border-gray-150 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-40 flex flex-col items-center justify-center">
              <div className="h-8 w-8 border-4 border-indigo-500/20 border-t-[#5B3DF5] rounded-full animate-spin"></div>
              <p className="text-xs text-gray-500 font-semibold mt-3">Loading budgets...</p>
            </div>
          ) : (
            <>
              <BudgetsTable
                budgets={paginatedBudgets}
                selectedBudget={selectedBudget}
                onSelectBudget={setSelectedBudget}
                onEditBudget={handleOpenEditModal}
                onDeleteBudget={handleDeleteBudget}
              />
              <CategoriesPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                pageSize={pageSize}
                totalCategoriesCount={sortedBudgets.length}
                itemName="budgets"
              />
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-3">
          <BudgetSidebar budgets={filteredBudgets} />
        </div>
      </div>

      {/* Add / Edit Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-2xl animate-scale-in">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-extrabold text-gray-900">
                {modalMode === 'add' ? 'Create New Budget' : 'Edit Budget'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded-xl transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label htmlFor="bud-name" className="text-xs font-bold text-gray-400 uppercase">
                  Budget Name
                </label>
                <input
                  id="bud-name"
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Outreach Programs"
                  className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-850 focus:outline-none"
                />
              </div>

              {/* Type and Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="bud-type" className="text-xs font-bold text-gray-400 uppercase">
                    Budget Type
                  </label>
                  <select
                    id="bud-type"
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-3 py-2.5 text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
                  >
                    <option value="Operating">Operating</option>
                    <option value="Capital">Capital</option>
                    <option value="Ministry">Ministry</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="bud-status" className="text-xs font-bold text-gray-400 uppercase">
                    Status
                  </label>
                  <select
                    id="bud-status"
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-3 py-2.5 text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Budgeted and Spent */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="bud-amount" className="text-xs font-bold text-gray-400 uppercase">
                    Budgeted (LKR)
                  </label>
                  <input
                    id="bud-amount"
                    type="number"
                    required
                    value={formBudgetAmount}
                    onChange={(e) => setFormBudgetAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-855 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="bud-spent" className="text-xs font-bold text-gray-400 uppercase">
                    Spent (LKR)
                  </label>
                  <input
                    id="bud-spent"
                    type="number"
                    required
                    value={formSpentAmount}
                    onChange={(e) => setFormSpentAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-855 focus:outline-none"
                  />
                </div>
              </div>

              {/* Start and End Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="bud-start" className="text-xs font-bold text-gray-400 uppercase">
                    Start Date
                  </label>
                  <input
                    id="bud-start"
                    type="date"
                    required
                    value={formPeriodStart}
                    onChange={(e) => setFormPeriodStart(e.target.value)}
                    className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-850 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="bud-end" className="text-xs font-bold text-gray-400 uppercase">
                    End Date
                  </label>
                  <input
                    id="bud-end"
                    type="date"
                    required
                    value={formPeriodEnd}
                    onChange={(e) => setFormPeriodEnd(e.target.value)}
                    className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-850 focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label htmlFor="bud-desc" className="text-xs font-bold text-gray-400 uppercase">
                  Description / Memo
                </label>
                <textarea
                  id="bud-desc"
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Memo description..."
                  className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-850 focus:outline-none resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-550 hover:text-gray-800 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-[#5B3DF5] hover:bg-[#4d32d6] text-white text-xs font-bold shadow-md shadow-[#5B3DF5]/10 transition-all cursor-pointer"
                >
                  {modalMode === 'add' ? 'Create Budget' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
