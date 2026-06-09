import React from 'react';
import { Eye, Download, Trash2 } from 'lucide-react';
import { FinanceMock } from '../../services/mockData';

interface TransactionTableRowProps {
  transaction: FinanceMock;
  onDeleteClick: (id: string) => void;
  onViewClick?: (transaction: FinanceMock) => void;
  onDownloadClick?: (transaction: FinanceMock) => void;
}

export default function TransactionTableRow({
  transaction,
  onDeleteClick,
  onViewClick,
  onDownloadClick
}: TransactionTableRowProps) {

  const formatLKR = (val: number) => {
    return "Rs. " + val.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const isIncome = transaction.type.toLowerCase() === 'income';

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
      <td className="py-4 pl-4 text-xs font-semibold text-gray-600">
        {transaction.date}
      </td>
      <td className="py-4">
        <span
          className={`rounded-xl px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
            isIncome
              ? "bg-green-50 text-green-700 border border-green-150"
              : "bg-red-50 text-red-700 border border-red-150"
          }`}
        >
          {isIncome ? 'Income' : 'Expense'}
        </span>
      </td>
      <td className="py-4 text-xs font-bold text-gray-700">
        {transaction.category}
      </td>
      <td className="py-4 text-xs text-gray-600 max-w-[200px] truncate" title={transaction.description}>
        {transaction.description}
      </td>
      <td className={`py-4 text-sm font-extrabold ${isIncome ? 'text-emerald-600' : 'text-rose-600'}`}>
        {formatLKR(transaction.amount)}
      </td>
      <td className="py-4 text-xs text-gray-500 font-semibold">
        {transaction.method || 'Cash'}
      </td>
      <td className="py-4 text-xs text-gray-500 font-mono">
        {transaction.receipt || 'N/A'}
      </td>
      <td className="py-4 pr-4">
        <div className="flex items-center gap-1.5 justify-end">
          <button
            type="button"
            onClick={() => onViewClick?.(transaction)}
            className="rounded-lg border border-gray-200 p-2 hover:bg-indigo-50 hover:border-indigo-200 text-gray-400 hover:text-[#5B3DF5] transition-colors cursor-pointer"
            title="View Details"
          >
            <Eye size={14} />
          </button>
          <button
            type="button"
            onClick={() => onDownloadClick?.(transaction)}
            className="rounded-lg border border-gray-200 p-2 hover:bg-indigo-50 hover:border-indigo-200 text-gray-400 hover:text-[#5B3DF5] transition-colors cursor-pointer"
            title="Download Receipt"
          >
            <Download size={14} />
          </button>
          <button
            type="button"
            onClick={() => onDeleteClick(transaction.id)}
            className="rounded-lg border border-gray-200 p-2 hover:bg-rose-50 hover:border-rose-200 text-gray-450 hover:text-rose-600 transition-colors cursor-pointer"
            title="Delete Record"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}
