import React from 'react';
import {
  Pencil,
  Trash2,
  HeartHandshake,
  Gift,
  Heart,
  Calendar,
  Home,
  Sparkles,
  Zap,
  DollarSign,
  Wrench,
  Printer,
  Globe,
  Users,
  BookOpen,
  HelpCircle,
  FileText
} from 'lucide-react';
import { CategoryMock } from '../../../services/mockData';
import { getCategoryIconInfo } from './CategoryRow'; // We can define it locally too to avoid import cycles.

interface CategoryRowProps {
  item: CategoryMock;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

export const getCategoryIconInfoLocal = (name: string, type: 'Income' | 'Expense') => {
  const clean = name.toLowerCase();
  
  if (clean.includes('tithe')) {
    return { icon: HeartHandshake, bg: 'bg-emerald-500', text: 'text-emerald-500' };
  }
  if (clean.includes('offering')) {
    return { icon: Gift, bg: 'bg-blue-500', text: 'text-blue-500' };
  }
  if (clean.includes('donation')) {
    return { icon: Heart, bg: 'bg-purple-500', text: 'text-purple-500' };
  }
  if (clean.includes('event')) {
    return { icon: Calendar, bg: 'bg-amber-500', text: 'text-amber-500' };
  }
  if (clean.includes('rent') || clean.includes('hall')) {
    return { icon: Home, bg: 'bg-cyan-500', text: 'text-cyan-500' };
  }
  if (clean.includes('ministry') || clean.includes('church')) {
    return { icon: Sparkles, bg: 'bg-rose-500', text: 'text-rose-500' };
  }
  if (clean.includes('utility') || clean.includes('utilities')) {
    return { icon: Zap, bg: 'bg-orange-500', text: 'text-orange-500' };
  }
  if (clean.includes('salary') || clean.includes('salaries') || clean.includes('allowance')) {
    return { icon: DollarSign, bg: 'bg-indigo-500', text: 'text-indigo-500' };
  }
  if (clean.includes('maintenance') || clean.includes('repair')) {
    return { icon: Wrench, bg: 'bg-red-500', text: 'text-red-500' };
  }
  if (clean.includes('office') || clean.includes('stationery')) {
    return { icon: Printer, bg: 'bg-slate-500', text: 'text-slate-500' };
  }
  if (clean.includes('mission') || clean.includes('missions')) {
    return { icon: Globe, bg: 'bg-teal-500', text: 'text-teal-500' };
  }
  if (clean.includes('school') || clean.includes('youth') || clean.includes('kids') || clean.includes('child')) {
    return { icon: Users, bg: 'bg-pink-500', text: 'text-pink-500' };
  }
  if (clean.includes('book') || clean.includes('library') || clean.includes('media')) {
    return { icon: BookOpen, bg: 'bg-violet-500', text: 'text-violet-500' };
  }
  if (clean.includes('charity') || clean.includes('benevolence') || clean.includes('help')) {
    return { icon: Heart, bg: 'bg-rose-600', text: 'text-rose-600' };
  }
  if (clean.includes('bank') || clean.includes('charge') || clean.includes('fee')) {
    return { icon: FileText, bg: 'bg-amber-600', text: 'text-amber-600' };
  }

  // Fallbacks depending on type
  if (type === 'Income') {
    return { icon: HelpCircle, bg: 'bg-emerald-400', text: 'text-emerald-400' };
  } else {
    return { icon: HelpCircle, bg: 'bg-rose-400', text: 'text-rose-400' };
  }
};

export default function CategoryRow({ item, isSelected, onSelect, onEdit, onDelete }: CategoryRowProps) {
  const { icon: Icon, bg: iconBg, text: iconText } = getCategoryIconInfoLocal(item.name, item.type);

  // Format date helper: "2025-02-10" -> "10 Feb 2025"
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
        return dateObj.toLocaleDateString('en-GB', options); // e.g. "10 Feb 2025"
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  return (
    <tr
      onClick={onSelect}
      className={`hover:bg-gray-55/45 border-t border-gray-100 group transition-colors cursor-pointer select-none ${
        isSelected ? 'bg-indigo-50/35 group-hover:bg-indigo-50/50' : ''
      }`}
    >
      {/* Category Name & Icon */}
      <td className="p-4 pl-6 font-bold text-gray-900 group-hover:text-[#5B3DF5] transition-colors flex items-center gap-3">
        <div className={`h-8 w-8 rounded-full ${iconBg} text-white flex items-center justify-center`}>
          <Icon size={15} />
        </div>
        <span>{item.name}</span>
      </td>

      {/* Type */}
      <td className="p-4">
        <span
          className={`rounded-xl px-2.5 py-1 text-xs font-bold border ${
            item.type === 'Income'
              ? 'bg-green-50 text-green-700 border-green-150'
              : 'bg-red-50 text-red-700 border-red-150'
          }`}
        >
          {item.type}
        </span>
      </td>

      {/* Description */}
      <td className="p-4 text-gray-550 text-xs font-semibold truncate max-w-[200px]" title={item.description}>
        {item.description}
      </td>

      {/* Status */}
      <td className="p-4">
        <span
          className={`rounded-xl px-2.5 py-1 text-xs font-bold border ${
            item.status === 'Active'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
              : 'bg-slate-50 text-slate-500 border-slate-200'
          }`}
        >
          {item.status}
        </span>
      </td>

      {/* Created Date */}
      <td className="p-4 text-gray-500 text-xs font-bold">
        {formatDate(item.createdOn)}
      </td>

      {/* Action Buttons */}
      <td className="p-4 pr-6 text-center" onClick={(e) => e.stopPropagation()}>
        <div className="flex gap-2 justify-center">
          <button
            onClick={onEdit}
            className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50 text-gray-500 hover:text-[#5B3DF5] transition-colors cursor-pointer"
            title="Edit Category"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={onDelete}
            className="rounded-lg border border-gray-200 p-2 hover:bg-red-50 text-gray-500 hover:text-red-650 transition-colors cursor-pointer"
            title="Delete Category"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}
export { getCategoryIconInfoLocal as getCategoryIconInfo };
