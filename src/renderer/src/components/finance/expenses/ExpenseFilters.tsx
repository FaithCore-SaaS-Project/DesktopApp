import React from 'react';
import { Search, Filter } from 'lucide-react';

interface ExpenseFiltersProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (val: string) => void;
  paymentMethodFilter: string;
  onPaymentMethodFilterChange: (val: string) => void;
  departmentFilter: string;
  onDepartmentFilterChange: (val: string) => void;
  categories: string[];
  methods: string[];
}

export default function ExpenseFilters({
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  paymentMethodFilter,
  onPaymentMethodFilterChange,
  departmentFilter,
  onDepartmentFilterChange,
  categories,
  methods
}: ExpenseFiltersProps) {
  
  const departments = ["Administration", "Youth Ministry", "Worship & Music", "Outreach", "Missions", "Facilities"];

  return (
    <div className="mt-6 rounded-2xl border border-gray-150 bg-white p-5 shadow-sm">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-12 items-center">
        {/* Search */}
        <div className="relative lg:col-span-4">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by description, payee, or reference..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3 pl-11 pr-4 text-xs font-semibold text-gray-700 placeholder-gray-400 outline-none focus:bg-white focus:border-[#5B3DF5] transition-all"
          />
        </div>

        {/* Categories Selector */}
        <div className="lg:col-span-2">
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-3 text-xs font-semibold text-gray-600 outline-none focus:border-[#5B3DF5] cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Payment Methods Selector */}
        <div className="lg:col-span-2">
          <select
            value={paymentMethodFilter}
            onChange={(e) => onPaymentMethodFilterChange(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-3 text-xs font-semibold text-gray-600 outline-none focus:border-[#5B3DF5] cursor-pointer"
          >
            <option value="all">All Methods</option>
            {methods.map((method, idx) => (
              <option key={idx} value={method}>{method}</option>
            ))}
          </select>
        </div>

        {/* Department Selector */}
        <div className="lg:col-span-2">
          <select
            value={departmentFilter}
            onChange={(e) => onDepartmentFilterChange(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-3 text-xs font-semibold text-gray-600 outline-none focus:border-[#5B3DF5] cursor-pointer"
          >
            <option value="all">All Departments</option>
            {departments.map((dept, idx) => (
              <option key={idx} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        {/* Filter Toggle Button */}
        <div className="lg:col-span-2">
          <button 
            type="button"
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-55 py-3 text-xs font-bold text-gray-750 transition-colors shadow-sm cursor-pointer"
          >
            <Filter size={15} className="text-gray-400" />
            <span>Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
}
