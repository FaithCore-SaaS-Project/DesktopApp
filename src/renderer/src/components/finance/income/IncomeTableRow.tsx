import React from 'react';
import { MoreVertical } from 'lucide-react';
import { FinanceMock } from '../../../services/mockData';

interface IncomeTableRowProps {
  transaction: FinanceMock;
  onDeleteClick: (id: string) => void;
  onViewClick?: (transaction: FinanceMock) => void;
}

export default function IncomeTableRow({
  transaction,
  onDeleteClick,
  onViewClick
}: IncomeTableRowProps) {
  
  const formatLKR = (val: number | string) => {
    return Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getCategoryBadge = (cat: string) => {
    const clean = cat.toLowerCase();
    if (clean === 'tithe' || clean === 'tithes') return 'bg-green-50 text-green-700 border-green-150';
    if (clean === 'offering' || clean === 'offerings') return 'bg-blue-50 text-blue-700 border-blue-150';
    if (clean === 'donation' || clean === 'donations' || clean === 'building fund') return 'bg-amber-50 text-amber-700 border-amber-150';
    if (clean === 'thanksgiving') return 'bg-purple-50 text-purple-700 border-purple-150';
    return 'bg-gray-50 text-gray-700 border-gray-150';
  };

  const getMethodStyle = (method?: string) => {
    if (!method) return 'text-gray-550';
    if (method.toLowerCase() === 'cash') return 'text-emerald-600 bg-emerald-50 border-emerald-100/50';
    return 'text-blue-600 bg-blue-50 border-blue-100/50';
  };

  // Helper to resolve sender names from descriptions for mockup consistency
  const getSenderName = () => {
    if (transaction.description.includes('-')) {
      return transaction.description.split('-')[1].trim();
    }
    if (transaction.category === 'Tithes') return 'Saman Perera';
    if (transaction.category === 'Offerings') return 'Kumara Family';
    if (transaction.category === 'Donations') return 'Nadeesha Fernando';
    return 'Isuru Jayasinghe';
  };

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
      <td className="py-3 px-3 text-xs font-medium text-slate-500 whitespace-nowrap">
        {transaction.date}
      </td>
      <td className="py-3 px-3 text-xs font-mono font-bold text-slate-700 whitespace-nowrap">
        <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200/80 inline-block">
          {transaction.receipt || 'RCP-2025-1000'}
        </span>
      </td>
      <td className="py-3 px-3 text-xs font-bold text-slate-900 whitespace-nowrap">
        {getSenderName()}
      </td>
      <td className="py-3 px-3 whitespace-nowrap">
        <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold border uppercase tracking-wider ${getCategoryBadge(transaction.category)}`}>
          {transaction.category}
        </span>
      </td>
      <td className="py-3 px-3 text-xs text-slate-500 max-w-[200px] truncate" title={transaction.description}>
        {transaction.description}
      </td>
      <td className="py-3 px-3 text-xs font-bold text-emerald-600 whitespace-nowrap">
        Rs. {formatLKR(transaction.amount)}
      </td>
      <td className="py-3 px-3 whitespace-nowrap">
        <span className={`rounded-md px-2 py-0.5 text-[9px] font-bold border uppercase tracking-wider ${getMethodStyle(transaction.method)}`}>
          {transaction.method || 'Cash'}
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
