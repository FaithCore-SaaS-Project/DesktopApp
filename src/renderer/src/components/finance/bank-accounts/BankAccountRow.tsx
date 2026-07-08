import React from 'react';
import {
  Pencil,
  MoreVertical,
  Landmark,
  Globe,
  Coins,
  Award,
  Activity
} from 'lucide-react';
import { BankAccountMock } from '../../../services/mockData';

interface BankAccountRowProps {
  item: BankAccountMock;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: (e: React.MouseEvent) => void;
  onToggleStatus: (e: React.MouseEvent) => void;
}

// Map bank names to beautiful icon layouts mimicking bank logos
export const getBankLogoInfo = (bankName: string) => {
  const clean = bankName.toLowerCase();
  if (clean.includes('hatton') || clean.includes('hnb')) {
    return { icon: Landmark, bg: 'bg-[#0A2540]', text: 'text-white' };
  }
  if (clean.includes('commercial')) {
    return { icon: Globe, bg: 'bg-blue-600', text: 'text-white' };
  }
  if (clean.includes('people')) {
    return { icon: Coins, bg: 'bg-emerald-600', text: 'text-white' };
  }
  if (clean.includes('ceylon') || clean.includes('boc')) {
    return { icon: Award, bg: 'bg-amber-500', text: 'text-amber-950' };
  }
  if (clean.includes('nations') || clean.includes('ntb')) {
    return { icon: Activity, bg: 'bg-indigo-600', text: 'text-yellow-300' };
  }
  return { icon: Landmark, bg: 'bg-slate-500', text: 'text-white' };
};

export default function BankAccountRow({
  item,
  isSelected,
  onSelect,
  onEdit,
  onToggleStatus
}: BankAccountRowProps) {
  const { icon: Icon, bg: logoBg, text: logoText } = getBankLogoInfo(item.bankName);

  const formatCurrency = (val: number) => {
    return `Rs. ${val.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <tr
      onClick={onSelect}
      className={`hover:bg-slate-50/50 border-t border-slate-100 group transition-colors cursor-pointer select-none ${
        isSelected ? 'bg-violet-50/40 hover:bg-violet-50/60' : ''
      }`}
    >
      {/* Bank Name with custom styled logo */}
      <td className="p-4 pl-6 font-bold text-slate-800 group-hover:text-violet-600 transition-colors flex items-center gap-3">
        <div className={`h-8 w-8 rounded-full ${logoBg} ${logoText} flex items-center justify-center font-bold shrink-0 shadow-sm`}>
          <Icon size={14} />
        </div>
        <span className="text-xs">{item.bankName}</span>
      </td>

      {/* Account Name */}
      <td className="p-4 text-slate-600 text-xs font-semibold">{item.accountName}</td>

      {/* Account Number */}
      <td className="p-4 text-slate-400 text-xs font-semibold font-mono">{item.accountNumber}</td>

      {/* Account Type */}
      <td className="p-4">
        <span
          className={`rounded-xl px-2.5 py-1 text-[10px] font-bold border ${
            item.accountType === 'Current'
              ? 'bg-purple-50 text-purple-600 border-purple-100'
              : 'bg-blue-50 text-blue-600 border-blue-100'
          }`}
        >
          {item.accountType}
        </span>
      </td>

      {/* Balance */}
      <td className="p-4 font-extrabold text-emerald-600 text-xs">
        {formatCurrency(item.balance)}
      </td>

      {/* Status */}
      <td className="p-4">
        <span
          className={`rounded-xl px-2.5 py-1 text-[10px] font-bold border ${
            item.status === 'Active'
              ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
              : 'bg-slate-50 text-slate-455 text-slate-400 border-slate-200'
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
            className="rounded-lg border border-slate-150 p-2 hover:bg-slate-50 text-slate-400 hover:text-violet-600 transition-colors cursor-pointer bg-white"
            title="Edit Account"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={onToggleStatus}
            className="rounded-lg border border-slate-150 p-2 hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer bg-white"
            title="Toggle Status"
          >
            <MoreVertical size={13} />
          </button>
        </div>
      </td>
    </tr>
  );
}
