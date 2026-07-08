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
    <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight leading-none">
          Finance Overview
        </h1>
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 mt-3 pl-1">
          <Link href="/dashboard" passHref legacyBehavior>
            <a className="hover:text-slate-600 transition-colors">Dashboard</a>
          </Link>
          <ChevronRight size={12} className="text-slate-300" />
          <span className="text-slate-600 font-bold">Finance</span>
        </div>
      </div>
      
      <div className="flex items-center gap-3 self-start md:self-auto">
        <button 
          className="flex items-center gap-2 rounded-2xl border border-slate-150 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-600 transition-all shadow-sm shadow-slate-100/30 cursor-pointer"
        >
          <Calendar size={14} className="text-slate-400" />
          <span>{dateRangeText}</span>
        </button>
        <button
          onClick={onAddTransactionClick}
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-violet-500/15 transition-all cursor-pointer active:scale-[0.98]"
        >
          <Plus size={15} />
          Add Transaction
        </button>
      </div>
    </div>
  );
}
