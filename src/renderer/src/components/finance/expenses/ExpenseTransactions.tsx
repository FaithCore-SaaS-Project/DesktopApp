import React from 'react';
import { Download, Printer, MoreHorizontal, Receipt } from 'lucide-react';
import { FinanceMock } from '../../../services/mockData';
import ExpenseTableRow from './ExpenseTableRow';
import Pagination from '../Pagination';

interface ExpenseTransactionsProps {
  transactions: FinanceMock[];
  onDeleteClick: (id: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalTransactionsCount: number;
  pageSize: number;
  onViewClick?: (transaction: FinanceMock) => void;
}

export default function ExpenseTransactions({
  transactions,
  onDeleteClick,
  currentPage,
  totalPages,
  onPageChange,
  totalTransactionsCount,
  pageSize,
  onViewClick
}: ExpenseTransactionsProps) {
  
  const startIndex = totalTransactionsCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalTransactionsCount);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col h-full">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Recent Expense Transactions
          </h2>
          <p className="text-xs text-gray-400 mt-0.5 font-medium">History of outflows and costs incurred</p>
        </div>
        <div className="flex gap-2 self-start sm:self-auto">
          <button 
            type="button"
            onClick={() => alert("Exporting transactions as CSV...")}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-55 px-4 py-2 text-xs font-bold text-gray-750 transition-colors shadow-sm cursor-pointer"
          >
            <Download size={14} />
            <span>Export</span>
          </button>
          <button 
            type="button"
            onClick={() => alert("Opening print settings...")}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-55 px-4 py-2 text-xs font-bold text-gray-750 transition-colors shadow-sm cursor-pointer"
          >
            <Printer size={14} />
            <span>Print</span>
          </button>
          <button 
            type="button"
            className="rounded-xl border border-gray-200 bg-white hover:bg-gray-55 p-2 text-gray-400 hover:text-gray-700 transition-colors shadow-sm cursor-pointer"
          >
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-150 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <th className="pb-4 pl-2">Date</th>
              <th className="pb-4">Reference No.</th>
              <th className="pb-4">Payee / Description</th>
              <th className="pb-4">Category</th>
              <th className="pb-4">Amount (Rs.)</th>
              <th className="pb-4">Payment Method</th>
              <th className="pb-4 pr-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm font-medium text-gray-600">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center text-gray-400">
                  <Receipt className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                  <p className="font-semibold text-sm">No expense records found.</p>
                  <p className="text-xs text-gray-400">Add an expense transaction to view records.</p>
                </td>
              </tr>
            ) : (
              transactions.map((txn) => (
                <ExpenseTableRow
                  key={txn.id}
                  transaction={txn}
                  onDeleteClick={onDeleteClick}
                  onViewClick={onViewClick}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination panel */}
      {totalTransactionsCount > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 pt-6 gap-4">
          <p className="text-sm text-gray-500 font-medium">
            Showing {startIndex} to {endIndex} of {totalTransactionsCount} expense records
          </p>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
