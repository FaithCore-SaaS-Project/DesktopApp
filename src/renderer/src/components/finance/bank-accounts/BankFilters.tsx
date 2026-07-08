import React from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';

interface BankFiltersProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  typeFilter: string;
  onTypeFilterChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  onResetFilters: () => void;
}

export default function BankFilters({
  searchTerm,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  statusFilter,
  onStatusFilterChange,
  onResetFilters
}: BankFiltersProps) {
  return (
    <div className="mb-6 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm shadow-slate-100/40">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-center">
        {/* Search */}
        <div className="relative lg:col-span-4 group">
          <Search
            size={14}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search bank accounts..."
            className="w-full rounded-xl border border-slate-100 py-2.5 pl-11 pr-4 text-xs font-semibold text-slate-700 bg-slate-50/50 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 transition-all duration-300 placeholder:text-slate-400"
          />
        </div>

        {/* Account Types */}
        <div className="relative lg:col-span-3">
          <select
            value={typeFilter}
            onChange={(e) => onTypeFilterChange(e.target.value)}
            className="w-full rounded-xl border border-slate-100 py-2.5 px-3.5 pr-8 text-xs font-bold text-slate-500 outline-none bg-slate-50/50 focus:border-violet-500 cursor-pointer appearance-none transition-all duration-300"
          >
            <option value="all">All Account Types</option>
            <option value="Current">Current</option>
            <option value="Savings">Savings</option>
          </select>
          <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        {/* Status */}
        <div className="relative lg:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="w-full rounded-xl border border-slate-100 py-2.5 px-3.5 pr-8 text-xs font-bold text-slate-500 outline-none bg-slate-50/50 focus:border-violet-500 cursor-pointer appearance-none transition-all duration-300"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        {/* Clear Button */}
        <div className="lg:col-span-2">
          <button
            type="button"
            onClick={onResetFilters}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-150 bg-white hover:bg-slate-50 text-xs font-bold text-slate-600 transition-all py-2.5 cursor-pointer shadow-sm active:scale-[0.98]"
          >
            <Filter size={14} className="text-slate-400" />
            <span>Clear Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
}
