import React from 'react';
import { Search, Filter, Download, Plus, ChevronDown } from "lucide-react";

interface FamilyFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  cellGroupFilter: string;
  onCellGroupFilterChange: (value: string) => void;
  onAddFamilyClick: () => void;
  onExportClick?: () => void;
  statusOptions: string[];
  cellGroupOptions: string[];
}

export default function FamilyFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  cellGroupFilter,
  onCellGroupFilterChange,
  onAddFamilyClick,
  onExportClick,
  statusOptions,
  cellGroupOptions
}: FamilyFiltersProps) {
  return (
    <>
      {/* Top action row */}
      <div className="mb-5 flex justify-end gap-3">
        <button 
          onClick={onExportClick}
          className="rounded-xl border border-gray-200 bg-white hover:bg-gray-50 px-4 py-2.5 text-gray-550 transition-colors shadow-sm flex items-center justify-center cursor-pointer"
          title="Export CSV / Excel"
        >
          <Download size={16} />
        </button>
        <button 
          className="rounded-xl border border-gray-200 bg-white hover:bg-gray-50 px-4 py-2.5 text-xs font-bold text-gray-650 transition-colors shadow-sm cursor-pointer"
        >
          More
        </button>
        <button 
          onClick={onAddFamilyClick}
          className="flex items-center gap-2 rounded-xl bg-[#5B3DF5] hover:bg-[#4d32d6] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-[#5B3DF5]/15 transition-all cursor-pointer active:scale-[0.98]"
        >
          <Plus size={16} />
          Add Family
        </button>
      </div>

      {/* Filter panel */}
      <div className="mb-6 rounded-3xl border border-gray-150 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {/* Search bar */}
          <div className="relative md:col-span-2 lg:col-span-2">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search families by name, location..."
              className="w-full rounded-xl border border-gray-250 py-2.5 pl-11 pr-4 text-xs font-medium text-gray-700 outline-none focus:border-[#5B3DF5] transition-all bg-gray-50/30 focus:bg-white"
            />
          </div>

          {/* Status selector */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="w-full rounded-xl border border-gray-250 py-2.5 px-3 text-xs font-bold text-gray-650 outline-none focus:border-[#5B3DF5] transition-all bg-white cursor-pointer appearance-none"
            >
              <option value="all">All Statuses</option>
              {statusOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Cell group selector */}
          <div className="relative">
            <select
              value={cellGroupFilter}
              onChange={(e) => onCellGroupFilterChange(e.target.value)}
              className="w-full rounded-xl border border-gray-250 py-2.5 px-3 text-xs font-bold text-gray-650 outline-none focus:border-[#5B3DF5] transition-all bg-white cursor-pointer appearance-none"
            >
              <option value="all">All Cell Groups</option>
              {cellGroupOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Filter action button */}
          <button 
            onClick={() => {
              onSearchChange('');
              onStatusFilterChange('all');
              onCellGroupFilterChange('all');
            }}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-gray-600 transition-colors py-2.5 cursor-pointer shadow-sm active:scale-[0.98]"
          >
            <Filter size={16} className="text-gray-400" />
            Clear Filters
          </button>
        </div>
      </div>
    </>
  );
}
