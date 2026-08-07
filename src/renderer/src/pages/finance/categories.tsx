import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Plus, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/api';
import { CategoryMock, FinanceMock } from '../../services/mockData';

import CategoriesStats from '../../components/finance/categories/CategoriesStats';
import CategoriesFilters from '../../components/finance/categories/CategoriesFilters';
import CategoriesTable from '../../components/finance/categories/CategoriesTable';
import CategoryDetails from '../../components/finance/categories/CategoryDetails';
import CategoriesPagination from '../../components/finance/categories/CategoriesPagination';

export default function FinanceCategoriesPage() {
  const { currentTenant } = useApp();
  const [categories, setCategories] = useState<CategoryMock[]>([]);
  const [financeRecords, setFinanceRecords] = useState<FinanceMock[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Selection State
  const [selectedCategory, setSelectedCategory] = useState<CategoryMock | null>(null);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Add/Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editId, setEditId] = useState('');
  
  // Form Fields
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState<'Income' | 'Expense'>('Income');
  const [formDesc, setFormDesc] = useState('');
  const [formStatus, setFormStatus] = useState<'Active' | 'Inactive'>('Active');

  const loadData = async () => {
    if (!currentTenant) return;
    setLoading(true);
    try {
      const cats = await apiService.getCategories(currentTenant.id);
      const fin = await apiService.getFinanceRecords(currentTenant.id);
      setCategories(cats);
      setFinanceRecords(fin);
      
      // Auto-select first category if none is selected
      if (cats.length > 0) {
        setSelectedCategory(cats[0]);
      } else {
        setSelectedCategory(null);
      }
    } catch (err) {
      console.error('Error loading categories data:', err?.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentTenant]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  // Filter categories
  const filteredCategories = categories.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'all' || c.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Sort by category name alphabetically
  const sortedCategories = [...filteredCategories].sort((a, b) => a.name.localeCompare(b.name));

  // Paginated Categories
  const totalPages = Math.max(1, Math.ceil(sortedCategories.length / pageSize));
  const paginatedCategories = sortedCategories.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Keep selection synchronized with filtered list
  useEffect(() => {
    if (paginatedCategories.length > 0) {
      // If currently selected category is not in the filtered page, select the first visible item
      const isStillVisible = paginatedCategories.some(c => c.id === selectedCategory?.id);
      if (!isStillVisible) {
        setSelectedCategory(paginatedCategories[0]);
      }
    } else {
      setSelectedCategory(null);
    }
  }, [searchTerm, typeFilter, statusFilter, currentPage, categories]);

  const handleOpenAddModal = () => {
    setModalMode('add');
    setEditId('');
    setFormName('');
    setFormType('Income');
    setFormDesc('');
    setFormStatus('Active');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: CategoryMock) => {
    setModalMode('edit');
    setEditId(cat.id);
    setFormName(cat.name);
    setFormType(cat.type);
    setFormDesc(cat.description);
    setFormStatus(cat.status);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = async (cat: CategoryMock) => {
    if (!currentTenant) return;
    if (confirm(`Are you sure you want to delete the category "${cat.name}"? This action cannot be undone.`)) {
      try {
        await apiService.deleteCategory(cat.id);
        
        // Refresh local categories
        const updatedCats = categories.filter(c => c.id !== cat.id);
        setCategories(updatedCats);

        // Adjust selected category
        if (selectedCategory?.id === cat.id) {
          setSelectedCategory(updatedCats.length > 0 ? updatedCats[0] : null);
        }

        // Adjust pagination page if page became empty
        const remainingFiltered = filteredCategories.filter(c => c.id !== cat.id);
        const maxPages = Math.ceil(remainingFiltered.length / pageSize);
        if (currentPage > maxPages && maxPages > 0) {
          setCurrentPage(maxPages);
        }
      } catch (err) {
        console.error('Error deleting category:', err?.message || 'Error occurred');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant) return;

    if (!formName.trim()) {
      alert('Please enter a category name');
      return;
    }

    if (!formDesc.trim()) {
      alert('Please enter a description');
      return;
    }

    // Check duplicate category name (case-insensitive)
    const isDuplicate = categories.some(
      c => c.name.toLowerCase() === formName.trim().toLowerCase() && c.id !== editId
    );

    if (isDuplicate) {
      alert(`A category with the name "${formName.trim()}" already exists.`);
      return;
    }

    const categoryData: CategoryMock = {
      id: modalMode === 'add' ? `cat-${Date.now()}` : editId,
      name: formName.trim(),
      type: formType,
      description: formDesc.trim(),
      status: formStatus,
      createdOn: modalMode === 'add' ? new Date().toISOString().split('T')[0] : categories.find(c => c.id === editId)?.createdOn || new Date().toISOString().split('T')[0],
      createdBy: 'Pastor John', // Default user
      tenantId: currentTenant.id
    };

    try {
      await apiService.saveCategory(categoryData);
      
      // Refresh list
      const cats = await apiService.getCategories(currentTenant.id);
      setCategories(cats);
      
      // Close modal
      setIsModalOpen(false);
      
      // Select the newly added or edited category
      const targetCat = cats.find(c => c.id === categoryData.id);
      if (targetCat) {
        setSelectedCategory(targetCat);
      }
    } catch (err) {
      console.error('Error saving category:', err?.message || 'Error occurred');
    }
  };

  return (
    <div className="p-8 bg-[#f5f6fa] min-h-full select-none animate-fade-in relative">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-none">
            Categories
          </h1>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 mt-3 pl-1">
            <Link href="/dashboard" className="hover:text-gray-600">Dashboard</Link>
            <ChevronRight size={12} />
            <Link href="/finance" className="hover:text-gray-600">Finance</Link>
            <ChevronRight size={12} />
            <span className="text-gray-650 font-bold">Categories</span>
          </div>
        </div>
        
        <button
          type="button"
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 rounded-xl bg-[#5B3DF5] hover:bg-[#4d32d6] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-[#5B3DF5]/15 transition-all cursor-pointer active:scale-[0.98]"
        >
          <Plus size={16} />
          Add New Category
        </button>
      </div>

      {/* Stats Cards */}
      <CategoriesStats categories={categories} />

      {/* Filters Panel */}
      <CategoriesFilters
        searchTerm={searchTerm}
        onSearchChange={(val) => { setSearchTerm(val); setCurrentPage(1); }}
        typeFilter={typeFilter}
        onTypeFilterChange={(val) => { setTypeFilter(val); setCurrentPage(1); }}
        statusFilter={statusFilter}
        onStatusFilterChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}
        onResetFilters={handleResetFilters}
      />

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-start">
        {/* Table Column */}
        <div className="lg:col-span-8 space-y-0 bg-white rounded-3xl border border-gray-150 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-40 flex flex-col items-center justify-center">
              <div className="h-8 w-8 border-4 border-indigo-500/20 border-t-[#5B3DF5] rounded-full animate-spin"></div>
              <p className="text-xs text-gray-500 font-semibold mt-3">Loading categories...</p>
            </div>
          ) : (
            <>
              <CategoriesTable
                categories={paginatedCategories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                onEditCategory={handleOpenEditModal}
                onDeleteCategory={handleDeleteCategory}
              />
              <CategoriesPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                pageSize={pageSize}
                totalCategoriesCount={sortedCategories.length}
              />
            </>
          )}
        </div>

        {/* Details Column */}
        <div className="lg:col-span-4">
          <CategoryDetails
            category={selectedCategory}
            financeRecords={financeRecords}
            onEdit={() => selectedCategory && handleOpenEditModal(selectedCategory)}
            onDelete={() => selectedCategory && handleDeleteCategory(selectedCategory)}
          />
        </div>
      </div>

      {/* Add / Edit Category Dialog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-2xl animate-scale-in">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-extrabold text-gray-900">
                {modalMode === 'add' ? 'Add New Category' : 'Edit Category'}
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
              {/* Category Name */}
              <div className="space-y-1.5">
                <label htmlFor="cat-name" className="text-xs font-bold text-gray-400 uppercase">
                  Category Name
                </label>
                <input
                  id="cat-name"
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Building Fund"
                  className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-850 focus:outline-none"
                />
              </div>

              {/* Type and Status */}
              <div className="grid grid-cols-2 gap-4">
                {/* Type */}
                <div className="space-y-1.5">
                  <label htmlFor="cat-type" className="text-xs font-bold text-gray-400 uppercase">
                    Allocation Type
                  </label>
                  <select
                    id="cat-type"
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as 'Income' | 'Expense')}
                    className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-3 py-2.5 text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
                  >
                    <option value="Income">Income</option>
                    <option value="Expense">Expense</option>
                  </select>
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <label htmlFor="cat-status" className="text-xs font-bold text-gray-400 uppercase">
                    Status
                  </label>
                  <select
                    id="cat-status"
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as 'Active' | 'Inactive')}
                    className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-3 py-2.5 text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label htmlFor="cat-desc" className="text-xs font-bold text-gray-400 uppercase">
                  Description / Memo
                </label>
                <textarea
                  id="cat-desc"
                  required
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Describe what this category allocates..."
                  className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-850 focus:outline-none resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-[#5B3DF5] hover:bg-[#4d32d6] text-white text-xs font-bold shadow-md shadow-[#5B3DF5]/10 transition-all cursor-pointer"
                >
                  {modalMode === 'add' ? 'Create Category' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
