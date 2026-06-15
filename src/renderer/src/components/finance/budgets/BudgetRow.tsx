import React from 'react';
import {
  Pencil,
  Trash2,
  FolderKanban,
  Wrench,
  Globe,
  Music,
  Users,
  DollarSign,
  Zap,
  BookOpen,
  HelpCircle
} from 'lucide-react';
import { BudgetMock } from '../../../services/mockData';

interface BudgetRowProps {
  item: BudgetMock;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

export const getBudgetIconInfo = (name: string, type: string) => {
  const clean = name.toLowerCase();
  if (clean.includes('operation') || clean.includes('admin')) {
    return { icon: FolderKanban, bg: 'bg-indigo-500', color: '#6366f1' };
  }
  if (clean.includes('building') || clean.includes('maintenance')) {
    return { icon: Wrench, bg: 'bg-emerald-500', color: '#10b981' };
  }
  if (clean.includes('outreach') || clean.includes('program')) {
    return { icon: Globe, bg: 'bg-amber-500', color: '#f59e0b' };
  }
  if (clean.includes('worship') || clean.includes('music')) {
    return { icon: Music, bg: 'bg-blue-500', color: '#3b82f6' };
  }
  if (clean.includes('youth')) {
    return { icon: Users, bg: 'bg-violet-500', color: '#8b5cf6' };
  }
  if (clean.includes('salary') || clean.includes('staff')) {
    return { icon: DollarSign, bg: 'bg-red-500', color: '#ef4444' };
  }
  if (clean.includes('utilit')) {
    return { icon: Zap, bg: 'bg-sky-500', color: '#0ea5e9' };
  }
  if (clean.includes('educat') || clean.includes('school') || clean.includes('train')) {
    return { icon: BookOpen, bg: 'bg-yellow-500', color: '#eab308' };
  }
  
  if (type === 'Capital') {
    return { icon: Wrench, bg: 'bg-teal-500', color: '#14b8a6' };
  }
  if (type === 'Ministry') {
    return { icon: Globe, bg: 'bg-pink-500', color: '#ec4899' };
  }
  return { icon: HelpCircle, bg: 'bg-slate-400', color: '#94a3b8' };
};

export default function BudgetRow({
  item,
  isSelected,
  onSelect,
  onEdit,
  onDelete
}: BudgetRowProps) {
  const { icon: Icon, bg: iconBg, color: progressColor } = getBudgetIconInfo(item.name, item.type);

  const formatCurrency = (val: number) => {
    return val.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
        return dateObj.toLocaleDateString('en-GB', options); // e.g. "01 Jan 2025"
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const progress = item.budgetAmount > 0 
    ? Math.min(100, Math.round((item.spentAmount / item.budgetAmount) * 100))
    : 0;

  return (
    <tr
      onClick={onSelect}
      className={`hover:bg-gray-55/45 border-t border-gray-100 group transition-colors cursor-pointer select-none ${
        isSelected ? 'bg-indigo-50/35 group-hover:bg-indigo-50/50' : ''
      }`}
    >
      {/* Budget Name & Icon */}
      <td className="p-4 pl-6 font-bold text-gray-900 group-hover:text-[#5B3DF5] transition-colors flex items-center gap-3">
        <div className={`h-8 w-8 rounded-full ${iconBg} text-white flex items-center justify-center font-bold shrink-0`}>
          <Icon size={14} />
        </div>
        <div>
          <div className="font-bold text-xs">{item.name}</div>
          <div className="text-[10px] text-gray-400 font-semibold">{item.description}</div>
        </div>
      </td>

      {/* Type */}
      <td className="p-4">
        <span
          className={`px-3 py-1 rounded-full text-[10px] font-bold ${
            item.type === 'Operating'
              ? 'bg-purple-100 text-purple-700'
              : item.type === 'Capital'
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-orange-100 text-orange-700'
          }`}
        >
          {item.type}
        </span>
      </td>

      {/* Period */}
      <td className="p-4 text-gray-500 text-[10px] leading-relaxed font-semibold">
        <div>{formatDate(item.periodStart)}</div>
        <div className="text-gray-400 font-medium">{formatDate(item.periodEnd)}</div>
      </td>

      {/* Budget */}
      <td className="p-4 text-gray-805 text-xs font-bold">
        {formatCurrency(item.budgetAmount)}
      </td>

      {/* Spent */}
      <td className="p-4 text-gray-805 text-xs font-bold">
        {formatCurrency(item.spentAmount)}
      </td>

      {/* Progress */}
      <td className="p-4">
        <div className="flex items-center gap-2.5">
          <div className="w-20 bg-gray-150 rounded-full h-1.5 overflow-hidden shrink-0">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                backgroundColor: progressColor
              }}
            />
          </div>
          <span className="text-[10px] font-bold text-gray-650">{progress}%</span>
        </div>
      </td>

      {/* Status */}
      <td className="p-4">
        <span
          className={`rounded-xl px-2.5 py-1 text-[10px] font-bold border ${
            item.status === 'Completed'
              ? 'bg-green-50 text-green-700 border-green-150'
              : 'bg-blue-50 text-blue-700 border-blue-150'
          }`}
        >
          {item.status}
        </span>
      </td>

      {/* Actions */}
      <td className="p-4 pr-6 text-center" onClick={(e) => e.stopPropagation()}>
        <div className="flex gap-2 justify-center">
          <button
            onClick={onEdit}
            className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50 text-gray-500 hover:text-[#5B3DF5] transition-colors cursor-pointer"
            title="Edit Budget"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={onDelete}
            className="rounded-lg border border-gray-200 p-2 hover:bg-red-50 text-gray-500 hover:text-red-650 transition-colors cursor-pointer"
            title="Delete Budget"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}

