import React from 'react';
import { Calendar, Plus, ChevronRight } from "lucide-react";
import Link from 'next/link';

interface FinanceHeaderProps {
  onAddTransactionClick: () => void;
  dateRangeText?: string;
}

export default function FinanceHeader({
  onAddTransactionClick,
  dateRangeText = "01 May 2025 - 31 May 2025"
}: FinanceHeaderProps) {
  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-none">
          Finance
        </h1>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 mt-3 pl-1">
          <Link href="/dashboard" className="hover:text-gray-600">Dashboard</Link>
          <ChevronRight size={12} />
          <span className="text-gray-650 font-bold">Finance</span>
        </div>
      </div>
      
      <div className="flex items-center gap-3 self-start md:self-auto">
        <button 
          className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 px-4 py-2.5 text-xs font-bold text-gray-700 transition-colors shadow-sm cursor-pointer"
        >
          <Calendar size={15} className="text-gray-400" />
          <span>{dateRangeText}</span>
        </button>
        <button
          onClick={onAddTransactionClick}
          className="flex items-center gap-2 rounded-xl bg-[#5B3DF5] hover:bg-[#4d32d6] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-[#5B3DF5]/15 transition-all cursor-pointer active:scale-[0.98]"
        >
          <Plus size={16} />
          Add Transaction
        </button>
      </div>
    </div>
  );
}
