import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import DepartmentsStats from '../components/departments/DepartmentsStats';
import DepartmentsFilters from '../components/departments/DepartmentsFilters';
import DepartmentsTable from '../components/departments/DepartmentsTable';
import DepartmentDetails from '../components/departments/DepartmentDetails';

export default function DepartmentsPage() {
  return (
    <div className="space-y-0 pb-10">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Departments</h1>
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold mt-1.5">
            <Link href="/dashboard" className="hover:text-[#5B3DF5] transition-colors">Dashboard</Link>
            <ChevronRight size={12} />
            <span className="text-gray-600">Departments</span>
            <ChevronRight size={12} />
            <span className="text-[#5B3DF5]">All Departments</span>
          </nav>
        </div>
        
        <button
          type="button"
          className="bg-[#5B3DF5] hover:bg-[#4a30db] text-white px-5 py-2.5 rounded-2xl text-sm font-bold shadow-lg shadow-[#5B3DF5]/20 active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2"
        >
          <span className="text-lg leading-none mb-0.5">+</span> Add New Department
        </button>
      </div>

      {/* Stats */}
      <DepartmentsStats />
      
      {/* Filters */}
      <DepartmentsFilters />

      {/* Main Grid */}
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-9 h-full">
          <DepartmentsTable />
        </div>
        <div className="lg:col-span-3">
          <DepartmentDetails />
        </div>
      </div>
    </div>
  );
}
