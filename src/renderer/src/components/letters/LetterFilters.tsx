import React from 'react';
import { Search, Filter, ChevronDown, Calendar } from 'lucide-react';

interface LetterFiltersProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  dateFilter: string;
  onDateFilterChange: (val: string) => void;
  typeFilter: string;
  onTypeFilterChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  onResetFilters: () => void;
}

export default function LetterFilters({
  searchTerm,
  onSearchChange,
  dateFilter,
  onDateFilterChange,
  typeFilter,
  onTypeFilterChange,
  statusFilter,
  onStatusFilterChange,
  onResetFilters
}: LetterFiltersProps) {
  return (
    <div className="mb-6 rounded-3xl border border-gray-150 bg-white p-5 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-center">
        {/* Search */}
        <div className="relative lg:col-span-4">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by letter name, type, or recipient..."
            className="w-full rounded-xl border border-gray-250 py-2.5 pl-11 pr-4 text-xs font-semibold text-gray-700 placeholder-gray-400 focus:bg-white outline-none focus:border-[#5B3DF5] transition-all bg-gray-50/30"
          />
        </div>

        {/* Date Filter */}
        <div className="relative lg:col-span-2">
          <Calendar
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => onDateFilterChange(e.target.value)}
            className="w-full rounded-xl border border-gray-250 py-2.5 pl-9 pr-3 text-xs font-bold text-gray-650 outline-none focus:border-[#5B3DF5] transition-all bg-white cursor-pointer"
          />
        </div>

        {/* Type dropdown */}
        <div className="relative lg:col-span-2">
          <select
            value={typeFilter}
            onChange={(e) => onTypeFilterChange(e.target.value)}
            className="w-full rounded-xl border border-gray-250 py-2.5 px-3.5 pr-8 text-xs font-bold text-gray-650 outline-none focus:border-[#5B3DF5] transition-all bg-white cursor-pointer appearance-none animate-fade-in"
          >
            <option value="all">All Letter Types</option>
            <option value="Confirmation">Confirmation</option>
            <option value="Approval">Approval</option>
            <option value="Appreciation">Appreciation</option>
            <option value="Invitation">Invitation</option>
            <option value="Condolence">Condolence</option>
            <option value="Appointment">Appointment</option>
            <option value="Notice">General Notice</option>
          </select>
          <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* Status dropdown */}
        <div className="relative lg:col-span-2">
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="w-full rounded-xl border border-gray-250 py-2.5 px-3.5 pr-8 text-xs font-bold text-gray-650 outline-none focus:border-[#5B3DF5] transition-all bg-white cursor-pointer appearance-none animate-fade-in"
          >
            <option value="all">All Status</option>
            <option value="Sent">Sent</option>
            <option value="Draft">Draft</option>
            <option value="Archived">Archived</option>
          </select>
          <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* Clear Button */}
        <div className="lg:col-span-2">
          <button
            type="button"
            onClick={onResetFilters}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-55 text-xs font-bold text-gray-600 transition-colors py-2.5 cursor-pointer shadow-sm active:scale-[0.98]"
          >
            <Filter size={16} className="text-gray-400" />
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
}
