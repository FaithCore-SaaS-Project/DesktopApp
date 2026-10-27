import React, { useState } from 'react';
import Link from 'next/link';
import { FinanceMock } from '../../services/mockData';
import TransactionTableRow from './TransactionTableRow';
import Pagination from './Pagination';
import { 
  Receipt, 
  X, 
  Info, 
  Calendar, 
  Wallet, 
  FileText, 
  CheckCircle,
  Search,
  ExternalLink
} from 'lucide-react';

interface RecentTransactionsProps {
  transactions: FinanceMock[];
  allTransactions?: FinanceMock[];
  onDeleteClick: (id: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalTransactionsCount: number;
  pageSize: number;
  onPageSizeChange?: (size: number) => void;
}

export default function RecentTransactions({
  transactions,
  allTransactions,
  onDeleteClick,
  currentPage,
  totalPages,
  onPageChange,
  totalTransactionsCount,
  pageSize,
  onPageSizeChange
}: RecentTransactionsProps) {
  const [selectedTxn, setSelectedTxn] = useState<FinanceMock | null>(null);

  // All Transactions Modal States
  const [isAllModalOpen, setIsAllModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [modalPage, setModalPage] = useState(1);
  const modalPageSize = 8;

  const recordsPool = allTransactions && allTransactions.length > 0 ? allTransactions : transactions;

  const startIndex = totalTransactionsCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalTransactionsCount);

  const handleViewDetails = (txn: FinanceMock) => {
    setSelectedTxn(txn);
  };

  const handleDownloadReceipt = (txn: FinanceMock) => {
    // Simulate invoice download by displaying a print dialog or triggering PDF service
    alert(`Downloading receipt ${txn.receipt || 'RCP-MOCK'} for ${txn.description}...`);
  };

  const formatLKR = (val: number | string) => {
    return "Rs. " + Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Filter for the All Transactions Modal
  const filteredAllTransactions = recordsPool.filter((txn) => {
    if (typeFilter !== 'all' && txn.type.toLowerCase() !== typeFilter) {
      return false;
    }
    if (categoryFilter !== 'all' && txn.category.toLowerCase() !== categoryFilter.toLowerCase()) {
      return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchDesc = txn.description?.toLowerCase().includes(q);
      const matchCat = txn.category?.toLowerCase().includes(q);
      const matchReceipt = txn.receipt?.toLowerCase().includes(q);
      const matchMethod = txn.method?.toLowerCase().includes(q);
      const matchAmount = String(txn.amount).includes(q);
      const matchDate = txn.date?.includes(q);
      return matchDesc || matchCat || matchReceipt || matchMethod || matchAmount || matchDate;
    }
    return true;
  });

  const modalTotalPages = Math.max(1, Math.ceil(filteredAllTransactions.length / modalPageSize));
  const paginatedModalTxns = filteredAllTransactions.slice(
    (modalPage - 1) * modalPageSize,
    modalPage * modalPageSize
  );
  const modalStartIndex = filteredAllTransactions.length === 0 ? 0 : (modalPage - 1) * modalPageSize + 1;
  const modalEndIndex = Math.min(modalPage * modalPageSize, filteredAllTransactions.length);

  const incomeCount = recordsPool.filter(t => t.type.toLowerCase() === 'income').length;
  const expenseCount = recordsPool.filter(t => t.type.toLowerCase() === 'expense').length;

  // Unique categories for filter dropdown
  const uniqueCategories = Array.from(new Set(recordsPool.map(t => t.category))).filter(Boolean);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col h-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Recent Transactions
          </h2>
          <p className="text-xs text-gray-400 mt-0.5 font-medium">List of latest financial movements</p>
        </div>
        <button 
          type="button"
          onClick={() => {
            setIsAllModalOpen(true);
            setSearchTerm('');
            setTypeFilter('all');
            setCategoryFilter('all');
            setModalPage(1);
          }}
          className="text-[#5B3DF5] hover:text-[#472cd9] font-semibold text-sm hover:underline cursor-pointer transition-colors"
        >
          View All
        </button>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-150 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <th className="pb-4 pl-2">Date</th>
              <th className="pb-4">Type</th>
              <th className="pb-4">Category</th>
              <th className="pb-4">Description</th>
              <th className="pb-4">Amount</th>
              <th className="pb-4">Method</th>
              <th className="pb-4">Receipt</th>
              <th className="pb-4 pr-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm font-medium text-gray-600">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center text-gray-400">
                  <Receipt className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                  <p className="font-semibold text-sm">No ledger entries posted.</p>
                  <p className="text-xs text-gray-400">Create a transaction to populate the records.</p>
                </td>
              </tr>
            ) : (
              transactions.map((txn) => (
                <TransactionTableRow
                  key={txn.id}
                  transaction={txn}
                  onDeleteClick={onDeleteClick}
                  onViewClick={handleViewDetails}
                  onDownloadClick={handleDownloadReceipt}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalTransactionsCount > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 pt-6 gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm text-gray-500 font-medium">
              Showing {startIndex} to {endIndex} of {totalTransactionsCount} transactions
            </p>
            {onPageSizeChange && (
              <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold sm:pl-3 sm:border-l border-gray-200">
                <span>Show:</span>
                {[5, 10, 20].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      onPageSizeChange(size);
                      onPageChange(1);
                    }}
                    className={`px-2 py-0.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      pageSize === size
                        ? 'bg-[#5B3DF5] text-white shadow-sm'
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}

      {/* All Transactions Full Ledger Modal */}
      {isAllModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="w-full max-w-5xl bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] animate-scale-in">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50/80 to-indigo-50/30">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-[#5B3DF5]/10 text-[#5B3DF5] flex items-center justify-center font-bold">
                  <Receipt size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-extrabold text-gray-900">
                      All Transactions Ledger
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#5B3DF5]/10 text-[#5B3DF5]">
                      {recordsPool.length} Records
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">
                    Complete list of church financial income and expenditures
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAllModalOpen(false)}
                className="p-2 hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded-xl transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="p-4 sm:p-5 border-b border-gray-100 bg-white space-y-3">
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setModalPage(1);
                    }}
                    placeholder="Search by description, category, method, receipt..."
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 hover:bg-gray-100/60 focus:bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 outline-none focus:border-[#5B3DF5] transition-all"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchTerm('');
                        setModalPage(1);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Category Filter Dropdown */}
                {uniqueCategories.length > 0 && (
                  <select
                    value={categoryFilter}
                    onChange={(e) => {
                      setCategoryFilter(e.target.value);
                      setModalPage(1);
                    }}
                    className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 outline-none focus:border-[#5B3DF5] cursor-pointer"
                  >
                    <option value="all">All Categories</option>
                    {uniqueCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Type Filter Pills & Quick Links */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setTypeFilter('all');
                      setModalPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      typeFilter === 'all'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    All ({recordsPool.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTypeFilter('income');
                      setModalPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      typeFilter === 'income'
                        ? 'bg-white text-emerald-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    Income ({incomeCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTypeFilter('expense');
                      setModalPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      typeFilter === 'expense'
                        ? 'bg-white text-rose-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    Expenses ({expenseCount})
                  </button>
                </div>

                {/* Submodule quick links */}
                <div className="flex items-center gap-2">
                  <Link href="/finance/income" passHref legacyBehavior>
                    <a className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 hover:border-gray-300 bg-white text-xs font-semibold text-gray-600 hover:text-[#5B3DF5] transition-colors">
                      Income Ledger <ExternalLink size={12} />
                    </a>
                  </Link>
                  <Link href="/finance/expenses" passHref legacyBehavior>
                    <a className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 hover:border-gray-300 bg-white text-xs font-semibold text-gray-600 hover:text-[#5B3DF5] transition-colors">
                      Expenses Ledger <ExternalLink size={12} />
                    </a>
                  </Link>
                  <Link href="/finance/e-receipts" passHref legacyBehavior>
                    <a className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 hover:border-gray-300 bg-white text-xs font-semibold text-gray-600 hover:text-[#5B3DF5] transition-colors">
                      E-Receipts <ExternalLink size={12} />
                    </a>
                  </Link>
                </div>
              </div>
            </div>

            {/* Modal Table Content */}
            <div className="flex-1 overflow-x-auto overflow-y-auto p-4 sm:p-6 min-h-[280px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-150 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    <th className="pb-4 pl-2">Date</th>
                    <th className="pb-4">Type</th>
                    <th className="pb-4">Category</th>
                    <th className="pb-4">Description</th>
                    <th className="pb-4">Amount</th>
                    <th className="pb-4">Method</th>
                    <th className="pb-4">Receipt</th>
                    <th className="pb-4 pr-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm font-medium text-gray-600">
                  {paginatedModalTxns.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-16 text-center text-gray-400">
                        <Receipt className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                        <p className="font-semibold text-sm">No transactions match your search filter.</p>
                        <p className="text-xs text-gray-400 mt-1">Try clearing or adjusting search keywords or filters.</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedModalTxns.map((txn) => (
                      <TransactionTableRow
                        key={txn.id}
                        transaction={txn}
                        onDeleteClick={(id) => {
                          onDeleteClick(id);
                        }}
                        onViewClick={handleViewDetails}
                        onDownloadClick={handleDownloadReceipt}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-gray-150 bg-gray-50/70 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs font-semibold text-gray-500">
                Showing {modalStartIndex} to {modalEndIndex} of {filteredAllTransactions.length} records
              </p>

              <div className="flex items-center gap-3">
                <Pagination
                  currentPage={modalPage}
                  totalPages={modalTotalPages}
                  onPageChange={setModalPage}
                />
                <button
                  type="button"
                  onClick={() => setIsAllModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-xl transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Details Interactive Modal */}
      {selectedTxn && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-2xl animate-scale-in">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-2">
                <Info className="text-[#5B3DF5]" size={20} />
                <h2 className="text-lg font-extrabold text-gray-900">Transaction Details</h2>
              </div>
              <button 
                onClick={() => setSelectedTxn(null)}
                className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded-xl transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm">
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col items-center justify-center text-center">
                <span className={`text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full ${
                  selectedTxn.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {selectedTxn.type === 'income' ? 'Income / Debit' : 'Expense / Credit'}
                </span>
                <h3 className={`text-2xl font-black mt-3 ${
                  selectedTxn.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {selectedTxn.type === 'income' ? '+' : '-'}{formatLKR(selectedTxn.amount)}
                </h3>
                <p className="text-xs text-gray-400 mt-1 font-semibold">{selectedTxn.category}</p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <div className="flex items-center gap-2 text-gray-400 font-semibold text-xs">
                    <Calendar size={14} />
                    <span>Billing Date</span>
                  </div>
                  <span className="font-bold text-gray-700">{selectedTxn.date}</span>
                </div>

                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <div className="flex items-center gap-2 text-gray-400 font-semibold text-xs">
                    <Wallet size={14} />
                    <span>Payment Method</span>
                  </div>
                  <span className="font-bold text-gray-700">{selectedTxn.method || 'Cash'}</span>
                </div>

                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <div className="flex items-center gap-2 text-gray-400 font-semibold text-xs">
                    <FileText size={14} />
                    <span>Receipt/Ref No.</span>
                  </div>
                  <span className="font-mono font-bold text-gray-800">{selectedTxn.receipt || 'RCP-N/A'}</span>
                </div>

                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <div className="flex items-center gap-2 text-gray-400 font-semibold text-xs">
                    <CheckCircle size={14} />
                    <span>Status</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600">Verified & Approved</span>
                </div>

                <div className="pt-2">
                  <span className="text-gray-400 font-bold text-xs block mb-1">MEMO / DESCRIPTION</span>
                  <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-3 text-xs text-gray-600 leading-relaxed font-semibold">
                    {selectedTxn.description}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setSelectedTxn(null)}
                  className="px-4 py-2 text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-all cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleDownloadReceipt(selectedTxn);
                    setSelectedTxn(null);
                  }}
                  className="px-4 py-2 text-xs font-bold bg-[#5B3DF5] hover:bg-[#4d32d6] text-white rounded-xl shadow-md shadow-[#5B3DF5]/10 transition-all cursor-pointer"
                >
                  Download E-Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
