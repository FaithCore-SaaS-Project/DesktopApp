import React, { useState } from 'react';
import { FinanceMock } from '../../services/mockData';
import TransactionTableRow from './TransactionTableRow';
import Pagination from './Pagination';
import { Receipt, X, Info, Calendar, DollarSign, Wallet, FileText, CheckCircle } from 'lucide-react';

interface RecentTransactionsProps {
  transactions: FinanceMock[];
  onDeleteClick: (id: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalTransactionsCount: number;
  pageSize: number;
}

export default function RecentTransactions({
  transactions,
  onDeleteClick,
  currentPage,
  totalPages,
  onPageChange,
  totalTransactionsCount,
  pageSize
}: RecentTransactionsProps) {
  
  const [selectedTxn, setSelectedTxn] = useState<FinanceMock | null>(null);

  const startIndex = totalTransactionsCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalTransactionsCount);

  const handleViewDetails = (txn: FinanceMock) => {
    setSelectedTxn(txn);
  };

  const handleDownloadReceipt = (txn: FinanceMock) => {
    // Simulate invoice download by displaying a print dialog or triggering PDF service
    alert(`Downloading receipt ${txn.receipt || 'RCP-MOCK'} for ${txn.description}...`);
  };

  const formatLKR = (val: number) => {
    return "Rs. " + val.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col h-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Recent Transactions
          </h2>
          <p className="text-xs text-gray-400 mt-0.5 font-medium">List of latest financial movements</p>
        </div>
        <button className="text-[#5B3DF5] font-semibold text-sm hover:underline cursor-pointer">
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
                  <p className="text-xs text-gray-405">Create a transaction to populate the records.</p>
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
          <p className="text-sm text-gray-500 font-medium">
            Showing {startIndex} to {endIndex} of {totalTransactionsCount} transactions
          </p>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}

      {/* View Details Interactive Modal */}
      {selectedTxn && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
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
                  <div className="flex items-center gap-2 text-gray-450 font-semibold text-xs">
                    <Calendar size={14} />
                    <span>Billing Date</span>
                  </div>
                  <span className="font-bold text-gray-700">{selectedTxn.date}</span>
                </div>

                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <div className="flex items-center gap-2 text-gray-450 font-semibold text-xs">
                    <Wallet size={14} />
                    <span>Payment Method</span>
                  </div>
                  <span className="font-bold text-gray-700">{selectedTxn.method || 'Cash'}</span>
                </div>

                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <div className="flex items-center gap-2 text-gray-450 font-semibold text-xs">
                    <FileText size={14} />
                    <span>Receipt/Ref No.</span>
                  </div>
                  <span className="font-mono font-bold text-gray-800">{selectedTxn.receipt || 'RCP-N/A'}</span>
                </div>

                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <div className="flex items-center gap-2 text-gray-450 font-semibold text-xs">
                    <CheckCircle size={14} />
                    <span>Status</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600">Verified & Approved</span>
                </div>

                <div className="pt-2">
                  <span className="text-gray-400 font-bold text-xs block mb-1">MEMO / DESCRIPTION</span>
                  <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-3 text-xs text-gray-650 leading-relaxed font-semibold">
                    {selectedTxn.description}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setSelectedTxn(null)}
                  className="px-4 py-2 text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-650 rounded-xl transition-all cursor-pointer"
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
