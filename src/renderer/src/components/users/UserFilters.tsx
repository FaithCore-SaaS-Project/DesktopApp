import React from 'react';
import { Search, Filter, RefreshCcw, ChevronDown } from 'lucide-react';

export default function UserFilters() {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="relative flex-1">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, email or username..."
          className="w-full h-[52px] bg-white border border-gray-200 rounded-xl pl-10 pr-4 text-[13px] font-semibold text-gray-700 outline-none hover:border-gray-300 focus:border-[#5B3DF5] shadow-sm transition-colors placeholder:text-gray-400"
        />
      </div>
      
      <div className="relative w-40">
        <select className="w-full h-[52px] appearance-none bg-white border border-gray-200 rounded-xl pl-4 pr-10 text-[13px] font-bold text-gray-700 outline-none hover:border-gray-300 focus:border-[#5B3DF5] shadow-sm transition-colors cursor-pointer">
          <option>All Roles</option>
        </select>
        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>
      
      <div className="relative w-40">
        <select className="w-full h-[52px] appearance-none bg-white border border-gray-200 rounded-xl pl-4 pr-10 text-[13px] font-bold text-gray-700 outline-none hover:border-gray-300 focus:border-[#5B3DF5] shadow-sm transition-colors cursor-pointer">
          <option>All Status</option>
        </select>
        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>
      
      <div className="relative w-48">
        <select className="w-full h-[52px] appearance-none bg-white border border-gray-200 rounded-xl pl-4 pr-10 text-[13px] font-bold text-gray-700 outline-none hover:border-gray-300 focus:border-[#5B3DF5] shadow-sm transition-colors cursor-pointer">
          <option>All Departments</option>
        </select>
        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>
      
      <button className="h-[52px] px-5 bg-white border border-gray-200 rounded-xl flex items-center gap-2 text-[13px] font-bold text-gray-700 hover:bg-gray-50 shadow-sm transition-colors cursor-pointer shrink-0">
        <Filter size={16} className="text-gray-400" />
        Filters
      </button>
      
      <button className="w-[52px] h-[52px] bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 shadow-sm transition-colors cursor-pointer shrink-0">
        <RefreshCcw size={16} />
      </button>
    </div>
  );
}
