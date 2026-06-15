import React from 'react';
import { Calendar, Filter, ChevronDown, Download } from 'lucide-react';

interface ReportFiltersProps {
  datePreset: string;
  onDatePresetChange: (val: string) => void;
  reportType: string;
  onReportTypeChange: (val: string) => void;
  category: string;
  onCategoryChange: (val: string) => void;
  onExport: () => void;
  onResetFilters: () => void;
}

export default function ReportFilters({
  datePreset,
  onDatePresetChange,
  reportType,
  onReportTypeChange,
  category,
  onCategoryChange,
  onExport,
  onResetFilters
}: ReportFiltersProps) {
  return (
    <div className="mb-6 rounded-3xl border border-gray-150 bg-white p-5 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-center">
        {/* Date Preset */}
        <div className="relative lg:col-span-3">
          <Calendar
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <select
            value={datePreset}
            onChange={(e) => onDatePresetChange(e.target.value)}
            className="w-full rounded-xl border border-gray-250 py-2.5 pl-9 pr-8 text-xs font-bold text-gray-650 outline-none focus:border-[#5B3DF5] transition-all bg-white cursor-pointer appearance-none"
          >
            <option value="month">01 May 2025 - 31 May 2025</option>
            <option value="quarter">01 Apr 2025 - 30 Jun 2025</option>
            <option value="year">01 Jan 2025 - 31 Dec 2025</option>
            <option value="last-year">01 Jan 2024 - 31 Dec 2024</option>
          </select>
          <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* Report Type */}
        <div className="relative lg:col-span-3">
          <select
            value={reportType}
            onChange={(e) => onReportTypeChange(e.target.value)}
            className="w-full rounded-xl border border-gray-250 py-2.5 px-3.5 pr-8 text-xs font-bold text-gray-650 outline-none focus:border-[#5B3DF5] transition-all bg-white cursor-pointer appearance-none"
          >
            <option value="all">All Report Types</option>
            <option value="Financial">Financial Reports</option>
            <option value="Membership">Membership Reports</option>
            <option value="Giving">Giving & Donations Reports</option>
            <option value="Events">Event Reports</option>
          </select>
          <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* Category */}
        <div className="relative lg:col-span-3">
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full rounded-xl border border-gray-250 py-2.5 px-3.5 pr-8 text-xs font-bold text-gray-650 outline-none focus:border-[#5B3DF5] transition-all bg-white cursor-pointer appearance-none"
          >
            <option value="all">All Categories</option>
            <option value="Tithes">Tithes</option>
            <option value="Offerings">Offerings</option>
            <option value="Donations">Donations & Giving</option>
            <option value="Ministry">Ministry Expenses</option>
            <option value="Administration">Administration</option>
            <option value="Facilities">Facilities & Assets</option>
          </select>
          <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* Filters Action Button */}
        <div className="lg:col-span-1.5 md:col-span-1">
          <button
            type="button"
            onClick={onResetFilters}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-55 text-xs font-bold text-gray-600 transition-colors py-2.5 cursor-pointer shadow-sm active:scale-[0.98]"
          >
            <Filter size={14} className="text-gray-400" />
            Reset
          </button>
        </div>

        {/* Export All Reports */}
        <div className="lg:col-span-1.5 md:col-span-1">
          <button
            type="button"
            onClick={onExport}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gray-50 border border-gray-250 hover:bg-gray-100 text-xs font-bold text-gray-750 transition-colors py-2.5 cursor-pointer shadow-sm active:scale-[0.98]"
          >
            <Download size={14} className="text-gray-400" />
            Export
          </button>
        </div>
      </div>
    </div>
  );
}
