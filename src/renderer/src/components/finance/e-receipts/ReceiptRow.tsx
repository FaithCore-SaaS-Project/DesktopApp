import React from 'react';
import { Eye, MoreHorizontal, Banknote, Landmark, CreditCard, Globe, Mail, Printer } from "lucide-react";
import { ReceiptMock } from '../../../services/mockData';

interface ReceiptRowProps {
  item: ReceiptMock;
  isSelected: boolean;
  onSelect: () => void;
  onViewDetails?: (item: ReceiptMock) => void;
}

export default function ReceiptRow({
  item,
  isSelected,
  onSelect,
  onViewDetails
}: ReceiptRowProps) {
  
  const formatDate = (dateStr: string) => {
    // Input is '2025-05-24' -> output is '24 May 2025'
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const formatLKR = (val: number) => {
    return val.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Category Colors mapping
  const getCategoryStyle = (cat: string) => {
    const norm = cat.toLowerCase();
    if (norm.includes('tithe')) {
      return "bg-emerald-50 text-emerald-700 border-emerald-150";
    } else if (norm.includes('offering')) {
      return "bg-indigo-50 text-indigo-700 border-indigo-150";
    } else if (norm.includes('donation')) {
      return "bg-amber-50 text-amber-700 border-amber-150";
    } else if (norm.includes('thanksgiving')) {
      return "bg-purple-50 text-purple-700 border-purple-150";
    } else if (norm.includes('event')) {
      return "bg-sky-50 text-sky-700 border-sky-150";
    } else {
      return "bg-gray-50 text-gray-700 border-gray-150";
    }
  };

  // Payment Method Icon & Color mapping
  const renderMethod = (method: string) => {
    const norm = method.toLowerCase();
    let Icon = Banknote;
    let color = "text-emerald-600 bg-emerald-50";

    if (norm.includes('bank') || norm.includes('transfer')) {
      Icon = Landmark;
      color = "text-indigo-600 bg-indigo-50";
    } else if (norm.includes('card')) {
      Icon = CreditCard;
      color = "text-amber-600 bg-amber-50";
    } else if (norm.includes('online')) {
      Icon = Globe;
      color = "text-blue-600 bg-blue-50";
    }

    return (
      <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-650">
        <span className={`p-1 rounded-md ${color}`}>
          <Icon size={12} />
        </span>
        {method}
      </span>
    );
  };

  // Status badge helper
  const renderStatus = (status: 'Emailed' | 'Printed') => {
    if (status === 'Emailed') {
      return (
        <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-150 text-emerald-700 px-2.5 py-0.5 rounded-lg text-[10px] font-bold">
          <Mail size={10} className="text-emerald-500" />
          Emailed
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 bg-purple-50 border border-purple-150 text-purple-700 px-2.5 py-0.5 rounded-lg text-[10px] font-bold">
          <Printer size={10} className="text-purple-500" />
          Printed
        </span>
      );
    }
  };

  return (
    <tr 
      onClick={onSelect}
      className={`border-b border-gray-100 hover:bg-gray-50/50 transition-all cursor-pointer ${
        isSelected ? 'bg-indigo-50/30' : ''
      }`}
    >
      <td className="p-4 text-xs font-bold text-gray-600 font-mono">
        {item.receiptNo}
      </td>
      <td className="text-xs font-semibold text-gray-600">
        {formatDate(item.date)}
      </td>
      <td>
        <div className="py-2.5">
          <h4 className="font-bold text-gray-800 leading-snug text-xs">
            {item.memberName}
          </h4>
          <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
            {item.memberEmail}
          </p>
        </div>
      </td>
      <td>
        <span className={`border px-2 py-0.5 rounded-lg text-[10px] font-bold ${getCategoryStyle(item.category)}`}>
          {item.category}
        </span>
      </td>
      <td className="font-extrabold text-emerald-600 text-xs">
        {formatLKR(item.amount)}
      </td>
      <td>
        {renderMethod(item.method)}
      </td>
      <td>
        {renderStatus(item.status)}
      </td>
      <td onClick={(e) => e.stopPropagation()}>
        <div className="flex gap-1.5 justify-end pr-4">
          <button 
            onClick={() => onViewDetails?.(item)}
            className="rounded-lg border border-gray-200 p-2 hover:bg-indigo-50 hover:border-indigo-200 text-gray-400 hover:text-[#5B3DF5] transition-colors cursor-pointer"
            title="View Receipt"
          >
            <Eye size={14} />
          </button>
          <button className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer">
            <MoreHorizontal size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}
