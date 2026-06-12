import React from 'react';
import { Search, Filter, X } from "lucide-react";

interface ReceiptFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedMethod: string;
  onMethodChange: (method: string) => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
  onClearFilters: () => void;
  categories: string[];
  methods: string[];
}

export default function ReceiptFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedMethod,
  onMethodChange,
  selectedDate,
  onDateChange,
  onClearFilters,
  categories,
  methods
}: ReceiptFiltersProps) {
  const isFiltered = searchQuery !== "" || selectedCategory !== "All Categories" || selectedMethod !== "All Payment Methods" || selectedDate !== "";

  return (
    <div className="bg-white border border-gray-150 rounded-3xl p-4 mt-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
        {/* Search */}
        <div className="relative">
          <Search
            size={16}
            className="absolute left-4.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by receipt no., name, or email..."
            className="w-full bg-gray-50/50 border border-gray-200 focus:border-[#5B3DF5] rounded-xl py-2.5 pl-11 pr-4 text-xs font-semibold text-gray-700 focus:outline-none transition-all placeholder:text-gray-400"
          />
        </div>

        {/* Date Filter */}
        <div className="relative">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full bg-gray-50/50 border border-gray-200 focus:border-[#5B3DF5] rounded-xl py-2.5 px-4 text-xs font-semibold text-gray-650 focus:outline-none transition-all cursor-pointer"
          />
        </div>

        {/* Categories */}
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full bg-gray-50/50 border border-gray-200 focus:border-[#5B3DF5] rounded-xl py-2.5 px-4 text-xs font-bold text-gray-700 focus:outline-none transition-all cursor-pointer"
        >
          <option value="All Categories">All Categories</option>
          {categories.map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Payment Methods */}
        <select
          value={selectedMethod}
          onChange={(e) => onMethodChange(e.target.value)}
          className="w-full bg-gray-50/50 border border-gray-200 focus:border-[#5B3DF5] rounded-xl py-2.5 px-4 text-xs font-bold text-gray-700 focus:outline-none transition-all cursor-pointer"
        >
          <option value="All Payment Methods">All Payment Methods</option>
          {methods.map((m, i) => (
            <option key={i} value={m}>{m}</option>
          ))}
        </select>

        {/* Action Button */}
        <div className="flex gap-2">
          <button
            type="button"
            className="flex-1 border border-gray-200 bg-white hover:bg-gray-50 py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-gray-700 shadow-sm transition-colors cursor-pointer"
          >
            <Filter size={14} className="text-gray-400" />
            Filters
          </button>
          {isFiltered && (
            <button
              onClick={onClearFilters}
              title="Clear Filters"
              className="px-3 border border-rose-200 hover:border-rose-300 bg-rose-50/30 hover:bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
