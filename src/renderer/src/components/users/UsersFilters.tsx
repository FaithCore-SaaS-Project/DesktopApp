import React from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';

export default function UsersFilters() {
  return (
    <div className="flex flex-col lg:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, email or username..."
          className="w-full bg-white border border-gray-100 rounded-2xl py-3 pl-11 pr-4 text-xs font-semibold text-gray-700 outline-none focus:border-[#5B3DF5] transition-all shadow-sm"
        />
      </div>

      <div className="flex flex-wrap lg:flex-nowrap gap-3">
        <div className="relative">
          <select className="appearance-none bg-white border border-gray-100 rounded-2xl py-3 pl-4 pr-10 text-xs font-semibold text-gray-700 outline-none hover:border-gray-200 cursor-pointer shadow-sm min-w-[140px]">
            <option>All Roles</option>
          </select>
          <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select className="appearance-none bg-white border border-gray-100 rounded-2xl py-3 pl-4 pr-10 text-xs font-semibold text-gray-700 outline-none hover:border-gray-200 cursor-pointer shadow-sm min-w-[140px]">
            <option>All Status</option>
          </select>
          <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        
        <div className="relative">
          <select className="appearance-none bg-white border border-gray-100 rounded-2xl py-3 pl-4 pr-10 text-xs font-semibold text-gray-700 outline-none hover:border-gray-200 cursor-pointer shadow-sm min-w-[140px]">
            <option>All Departments</option>
          </select>
          <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        <button className="bg-white border border-gray-100 rounded-2xl py-3 px-5 flex items-center justify-center gap-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
          <Filter size={14} />
          Filters
        </button>
      </div>
    </div>
  );
}
