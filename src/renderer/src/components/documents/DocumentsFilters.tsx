import React from 'react';
import { Search, Filter, ChevronDown, Calendar } from 'lucide-react';

export default function DocumentsFilters() {
  return (
    <div className="flex flex-col lg:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by document name, category or uploader..."
          className="w-full bg-white border border-slate-100 rounded-2xl py-3 pl-11 pr-4 text-xs font-semibold text-slate-700 outline-none focus:border-[#5B3DF5] focus:bg-white transition-all shadow-sm shadow-slate-100/50"
        />
      </div>

      <div className="flex flex-wrap lg:flex-nowrap gap-3">
        {/* Date Filter */}
        <div className="relative">
          <Calendar size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="01 May 2025 - 31 May 2025"
            readOnly
            className="w-full bg-white border border-slate-100 rounded-2xl py-3 pl-10 pr-10 text-xs font-semibold text-slate-700 outline-none hover:border-slate-200 cursor-pointer shadow-sm shadow-slate-100/50 min-w-[210px]"
          />
          <ChevronDown size={13} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        {/* Categories */}
        <div className="relative">
          <select className="appearance-none bg-white border border-slate-100 rounded-2xl py-3 pl-4 pr-10 text-xs font-semibold text-slate-700 outline-none hover:border-slate-200 cursor-pointer shadow-sm shadow-slate-100/50 min-w-[140px]">
            <option>All Categories</option>
          </select>
          <ChevronDown size={13} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        {/* File Types */}
        <div className="relative">
          <select className="appearance-none bg-white border border-slate-100 rounded-2xl py-3 pl-4 pr-10 text-xs font-semibold text-slate-700 outline-none hover:border-slate-200 cursor-pointer shadow-sm shadow-slate-100/50 min-w-[140px]">
            <option>All File Types</option>
          </select>
          <ChevronDown size={13} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        {/* Status */}
        <div className="relative">
          <select className="appearance-none bg-white border border-slate-100 rounded-2xl py-3 pl-4 pr-10 text-xs font-semibold text-slate-700 outline-none hover:border-slate-200 cursor-pointer shadow-sm shadow-slate-100/50 min-w-[120px]">
            <option>All Status</option>
          </select>
          <ChevronDown size={13} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        {/* Filters Button */}
        <button className="bg-white border border-slate-100 rounded-2xl py-3 px-5 flex items-center justify-center gap-2 text-xs font-bold text-slate-700 hover:border-slate-200 transition-colors shadow-sm shadow-slate-100/50 cursor-pointer hover:bg-slate-50/50 active:scale-[0.98]">
          <Filter size={13} className="text-slate-500" />
          Filters
        </button>
      </div>
    </div>
  );
}
