import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/api';
import { FinanceMock } from '../../services/mockData';
import { X, Info } from 'lucide-react';

import IncomeHeader from '../../components/finance/income/IncomeHeader';
import IncomeStats from '../../components/finance/income/IncomeStats';
import IncomeFilters from '../../components/finance/income/IncomeFilters';
import IncomeCategoryChart from '../../components/finance/income/IncomeCategoryChart';
import IncomeTransactions from '../../components/finance/income/IncomeTransactions';

export default function FinanceIncomePage() {
  const { currentTenant, isOnline } = useApp();
  const [records, setRecords] = useState<FinanceMock[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Renders 10 rows matching screenshot

  // Add Income Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [category, setCategory] = useState<'Tithes' | 'Offerings' | 'Donations' | 'Thanksgiving' | 'Other Income'>('Tithes');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [method, setMethod] = useState<'Cash' | 'Bank Transfer'>('Cash');
  const [receipt, setReceipt] = useState('');

  const loadIncomeRecords = async () => {
    if (!currentTenant) return;
    setLoading(true);
    try {
      const data = await apiService.getFinanceRecords(currentTenant.id);
      // Filter for income only
      const incomeOnly = data.filter(r => r.type === 'income');
      setRecords(incomeOnly);
    } catch (err) {
      console.error('Error loading income records:', err?.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncomeRecords();
  }, [currentTenant, isOnline]);

  const handleOpenAddModal = () => {
    setCategory('Tithes');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setDescription('');
    setMethod('Cash');
    setReceipt(`RCP-2025-${Math.floor(1000 + Math.random() * 9000)}`);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant) return;

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const newRecord: FinanceMock = {
      id: `fin-${Date.now()}`,
      type: 'income',
      category,
      amount: parsedAmount,
      date,
      description,
      tenantId: currentTenant.id,
      method,
      receipt
    };

    try {
      await apiService.saveFinanceRecord(newRecord);
      setIsModalOpen(false);
      loadIncomeRecords();
      setCurrentPage(1); // Reset to page 1
    } catch (err) {
      console.error('Error saving income transaction:', err?.message || 'Error occurred');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this income transaction?')) {
      try {
        await apiService.deleteFinanceRecord(id);
        loadIncomeRecords();
        
        // Adjust page index if page shrank
        const updatedTotal = filteredRecords.length - 1;
        const maxPages = Math.ceil(updatedTotal / pageSize);
        if (currentPage > maxPages && maxPages > 0) {
          setCurrentPage(maxPages);
        }
      } catch (err) {
        console.error('Error deleting income record:', err?.message || 'Error occurred');
      }
    }
  };

  // DB Accumulations (Live Data Only)
  let totalTithes = 0;
  let totalOfferings = 0;
  let totalDonations = 0;
  let totalThanksgiving = 0;
  let totalOthers = 0;

  records.forEach(r => {
    const cleanCat = r.category.toLowerCase();
    if (cleanCat === 'tithe' || cleanCat === 'tithes') {
      totalTithes += r.amount;
    } else if (cleanCat === 'offering' || cleanCat === 'offerings') {
      totalOfferings += r.amount;
    } else if (cleanCat === 'donation' || cleanCat === 'donations' || cleanCat === 'building fund') {
      totalDonations += r.amount;
    } else if (cleanCat === 'thanksgiving') {
      totalThanksgiving += r.amount;
    } else {
      totalOthers += r.amount;
    }
  });

  const totalIncome = totalTithes + totalOfferings + totalDonations + totalThanksgiving + totalOthers;
  const totalOthersAndThanksCombined = totalThanksgiving + totalOthers; // Grouped "Other Income" on stats cards

  // Retrieve unique categories and methods from records for filter selectors
  const uniqueCategories = Array.from(new Set(records.map(r => r.category))).filter(Boolean);
  const uniqueMethods = Array.from(new Set(records.map(r => r.method))).filter(Boolean) as string[];

  // Apply filters in real time
  const filteredRecords = records.filter(r => {
    // Search
    const matchesSearch = 
      r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.receipt && r.receipt.toLowerCase().includes(searchTerm.toLowerCase()));

    // Category
    const matchesCategory = 
      categoryFilter === 'all' || 
      r.category.toLowerCase() === categoryFilter.toLowerCase();

    // Payment Method
    const matchesMethod = 
      paymentMethodFilter === 'all' || 
      (r.method && r.method.toLowerCase() === paymentMethodFilter.toLowerCase());

    // Sub-type Filter
    let matchesType = true;
    if (typeFilter === 'Tithe') {
      matchesType = r.category.toLowerCase().includes('tithe');
    } else if (typeFilter === 'Offering') {
      matchesType = r.category.toLowerCase().includes('offering');
    } else if (typeFilter === 'Donation') {
      matchesType = r.category.toLowerCase().includes('donation') || r.category.toLowerCase().includes('building');
    }

    return matchesSearch && matchesCategory && matchesMethod && matchesType;
  });

  // Sort descending by date
  const sortedRecords = [...filteredRecords].sort((a, b) => b.date.localeCompare(a.date));

  // Pagination slice
  const paginatedRecords = sortedRecords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const totalPages = Math.max(1, Math.ceil(sortedRecords.length / pageSize));

  return (
    <div className="p-8 bg-[#f5f6fa] min-h-full select-none animate-fade-in relative">
      <IncomeHeader onAddIncomeClick={handleOpenAddModal} />

      {/* Stats Cards Row */}
      <IncomeStats 
        totalIncome={totalIncome}
        tithes={totalTithes}
        offerings={totalOfferings}
        donations={totalDonations}
        others={totalOthersAndThanksCombined}
      />

      {/* Real-time Filters Panel */}
      <IncomeFilters 
        searchTerm={searchTerm}
        onSearchChange={(val) => { setSearchTerm(val); setCurrentPage(1); }}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={(val) => { setCategoryFilter(val); setCurrentPage(1); }}
        paymentMethodFilter={paymentMethodFilter}
        onPaymentMethodFilterChange={(val) => { setPaymentMethodFilter(val); setCurrentPage(1); }}
        typeFilter={typeFilter}
        onTypeFilterChange={(val) => { setTypeFilter(val); setCurrentPage(1); }}
        categories={uniqueCategories}
        methods={uniqueMethods}
      />

      {/* Middle Layout Grid: Chart (left) and Table (right) */}
      <div className="mt-6 grid gap-6 grid-cols-1 lg:grid-cols-12 items-start">
        <div className="lg:col-span-4">
          <IncomeCategoryChart 
            total={totalIncome}
            tithes={totalTithes}
            offerings={totalOfferings}
            donations={totalDonations}
            thanksgiving={totalThanksgiving}
            others={totalOthers}
          />
        </div>
        <div className="lg:col-span-8">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-150 shadow-sm">
              <div className="h-8 w-8 border-4 border-indigo-500/20 border-t-[#5B3DF5] rounded-full animate-spin"></div>
              <p className="text-xs text-gray-500 font-semibold mt-3">Loading transactions...</p>
            </div>
          ) : (
            <IncomeTransactions 
              transactions={paginatedRecords}
              onDeleteClick={handleDelete}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalTransactionsCount={sortedRecords.length}
              pageSize={pageSize}
            />
          )}
        </div>
      </div>

      {/* Post Income modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-2xl animate-scale-in">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-extrabold text-gray-900">Post Income Transaction</h2>
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded-xl transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Category */}
              <div className="space-y-1.5">
                <label htmlFor="income-category" className="text-xs font-bold text-gray-400 uppercase">Allocation Category</label>
                <select
                  id="income-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-3 py-2.5 text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
                >
                  <option value="Tithes">Tithes</option>
                  <option value="Offerings">Offerings</option>
                  <option value="Donations">Donations</option>
                  <option value="Thanksgiving">Thanksgiving</option>
                  <option value="Other Income">Other Income</option>
                </select>
              </div>

              {/* Amount and Receipt */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="income-amount" className="text-xs font-bold text-gray-400 uppercase">Amount (Rs.)</label>
                  <input
                    id="income-amount"
                    type="number"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="income-receipt" className="text-xs font-bold text-gray-400 uppercase">Receipt No.</label>
                  <input
                    id="income-receipt"
                    type="text"
                    required
                    value={receipt}
                    onChange={(e) => setReceipt(e.target.value)}
                    className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none"
                  />
                </div>
              </div>

              {/* Date and Payment Method */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="income-date" className="text-xs font-bold text-gray-400 uppercase">Billing Date</label>
                  <input
                    id="income-date"
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="income-method" className="text-xs font-bold text-gray-400 uppercase">Payment Method</label>
                  <select
                    id="income-method"
                    value={method}
                    onChange={(e) => setMethod(e.target.value as any)}
                    className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-3 py-2.5 text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label htmlFor="income-desc" className="text-xs font-bold text-gray-400 uppercase">Description / Memo</label>
                <input
                  id="income-desc"
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Sunday Tithes - Batch A"
                  className="w-full bg-gray-50/50 border border-gray-250 focus:border-[#5B3DF5] rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-505 hover:text-gray-800 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-[#5B3DF5] hover:bg-[#4d32d6] text-white text-xs font-bold shadow-md shadow-[#5B3DF5]/10 transition-all cursor-pointer"
                >
                  Post Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
