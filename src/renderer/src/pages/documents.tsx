import React from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronDown } from 'lucide-react';

import DocumentsStats from '../components/documents/DocumentsStats';
import DocumentsFilters from '../components/documents/DocumentsFilters';
import DocumentsTable from '../components/documents/DocumentsTable';
import DocumentsSidebar from '../components/documents/DocumentsSidebar';

export default function DocumentsPage() {
  return (
    <div className="space-y-0 pb-10">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Documents</h1>
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold mt-1.5">
            <Link href="/dashboard" className="hover:text-[#5B3DF5] transition-colors">Dashboard</Link>
            <ChevronRight size={12} />
            <span className="text-gray-600">Documents</span>
            <ChevronRight size={12} />
            <span className="text-[#5B3DF5]">All Documents</span>
          </nav>
        </div>
        
        <div className="flex bg-[#5B3DF5] rounded-2xl shadow-lg shadow-[#5B3DF5]/20 overflow-hidden text-white font-bold text-sm cursor-pointer active:scale-[0.98] transition-all">
          <button
            type="button"
            className="flex items-center gap-2 px-5 py-2.5 hover:bg-[#4a30db] transition-colors"
          >
            <span className="text-lg leading-none mb-0.5">+</span> Upload Document
          </button>
          <button className="px-3 border-l border-white/20 hover:bg-[#4a30db] transition-colors flex items-center justify-center">
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <DocumentsStats />
      
      {/* Filters */}
      <DocumentsFilters />

      {/* Main Grid */}
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-9 h-full">
          <DocumentsTable />
        </div>
        <div className="lg:col-span-3">
          <DocumentsSidebar />
        </div>
      </div>
    </div>
  );
}
