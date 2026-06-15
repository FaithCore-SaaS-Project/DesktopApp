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
      className={`hover:bg-gray-55/45 border-t border-gray-100 group transition-colors cursor-pointer select-none ${
        isSelected ? 'bg-indigo-50/35 group-hover:bg-indigo-50/50' : ''
      }`}
    >
      {/* Bank Name with custom styled logo */}
      <td className="p-4 pl-6 font-bold text-gray-900 group-hover:text-[#5B3DF5] transition-colors flex items-center gap-3">
        <div className={`h-8 w-8 rounded-full ${logoBg} ${logoText} flex items-center justify-center font-bold shrink-0 shadow-sm`}>
          <Icon size={14} />
        </div>
        <span>{item.bankName}</span>
      </td>

      {/* Account Name */}
      <td className="p-4 text-gray-750 text-xs font-semibold">{item.accountName}</td>

      {/* Account Number */}
      <td className="p-4 text-gray-500 text-xs font-semibold font-mono">{item.accountNumber}</td>

      {/* Account Type */}
      <td className="p-4">
        <span
          className={`rounded-xl px-2.5 py-1 text-xs font-bold border ${
            item.accountType === 'Current'
              ? 'bg-purple-50 text-purple-750 border-purple-150'
              : 'bg-blue-55 text-blue-750 border-blue-150'
          }`}
        >
          {item.accountType}
        </span>
      </td>

      {/* Balance */}
      <td className="p-4 font-black text-emerald-600 text-xs">
        {formatCurrency(item.balance)}
      </td>

      {/* Status */}
      <td className="p-4">
        <span
          className={`rounded-xl px-2.5 py-1 text-xs font-bold border ${
            item.status === 'Active'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
              : 'bg-slate-55 text-slate-500 border-slate-200'
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
            title="Edit Account"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={onToggleStatus}
            className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
            title="Toggle Status"
          >
            <MoreVertical size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}
