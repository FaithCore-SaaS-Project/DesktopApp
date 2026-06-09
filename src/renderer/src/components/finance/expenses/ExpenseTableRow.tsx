import React from 'react';
import { MoreVertical } from 'lucide-react';
import { FinanceMock } from '../../../services/mockData';

interface ExpenseTableRowProps {
  transaction: FinanceMock;
  onDeleteClick: (id: string) => void;
  onViewClick?: (transaction: FinanceMock) => void;
}

export default function ExpenseTableRow({
  transaction,
  onDeleteClick,
  onViewClick
}: ExpenseTableRowProps) {
  
  const formatLKR = (val: number) => {
    return val.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getCategoryBadge = (cat: string) => {
    const clean = cat.toLowerCase();
    if (clean === 'salary' || clean === 'salaries') return 'bg-yellow-50 text-yellow-700 border-yellow-150';
    if (clean === 'utilities') return 'bg-orange-50 text-orange-700 border-orange-150';
    if (clean === 'maintenance') return 'bg-purple-50 text-purple-700 border-purple-150';
    if (clean === 'ministry') return 'bg-blue-50 text-blue-700 border-blue-150';
    if (clean === 'office') return 'bg-teal-50 text-teal-700 border-teal-150';
    return 'bg-gray-50 text-gray-700 border-gray-150';
  };

  const getMethodStyle = (method?: string) => {
    if (!method) return 'text-gray-550';
    if (method.toLowerCase() === 'cash') return 'text-emerald-600 bg-emerald-50 border-emerald-100/50';
    return 'text-blue-600 bg-blue-50 border-blue-100/50';
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-55/30 transition-colors">
      <td className="py-4 pl-4 text-xs font-semibold text-gray-600">
        {transaction.date}
      </td>
      <td className="py-4 text-xs font-mono font-bold text-gray-700">
        {transaction.receipt || 'EXP-2025-0000'}
      </td>
      <td className="py-4 text-xs font-bold text-gray-850">
        {transaction.description}
      </td>
      <td className="py-4">
        <span className={`rounded-xl px-2.5 py-1 text-[10px] font-bold border uppercase tracking-wider ${getCategoryBadge(transaction.category)}`}>
          {transaction.category}
        </span>
      </td>
      <td className="py-4 text-sm font-black text-rose-600">
        Rs. {formatLKR(transaction.amount)}
      </td>
      <td className="py-4">
        <span className={`rounded-xl px-2 py-0.5 text-[9px] font-extrabold border uppercase tracking-wider ${getMethodStyle(transaction.method)}`}>
          {transaction.method || 'Bank Transfer'}
        </span>
      </td>
      <td className="py-4 pr-4 text-right">
        <div className="flex justify-end gap-1.5">
          <button 
            type="button"
            onClick={() => onViewClick?.(transaction)}
            className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50 text-gray-400 hover:text-gray-800 transition-colors cursor-pointer"
            title="Details"
          >
            <MoreVertical size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}
