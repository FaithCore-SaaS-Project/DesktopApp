import React from 'react';
import Link from 'next/link';
import { ChevronRight, Plus, ChevronDown } from 'lucide-react';

import RolesStatsCards from '../components/roles/RolesStatsCards';
import RolesFilters from '../components/roles/RolesFilters';
import RolesTable from '../components/roles/RolesTable';
import RolesOverviewCard from '../components/roles/RolesOverviewCard';
import RoleStatusCard from '../components/roles/RoleStatusCard';
import RoleQuickActions from '../components/roles/RoleQuickActions';
import NeedHelpCard from '../components/roles/NeedHelpCard';

export default function RolesPage() {
  return (
    <div className="space-y-0 pb-10 p-8 bg-gradient-to-br from-slate-50 via-slate-50/50 to-indigo-50/30 min-h-screen">
      {/* Page Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Roles</h1>
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 font-bold mt-2">
            <Link href="/dashboard" className="hover:text-[#5B3DF5] transition-colors">Dashboard</Link>
            <ChevronRight size={12} />
            <Link href="/users" className="hover:text-[#5B3DF5] transition-colors">Users & Roles</Link>
            <ChevronRight size={12} />
            <span className="text-gray-655 font-bold">Roles</span>
          </nav>
        </div>
        <div className="flex items-center">
          <button className="h-11 pl-5 pr-4 bg-[#5B3DF5] hover:bg-[#4a30db] text-white rounded-l-xl text-xs font-bold transition-all shadow-md shadow-[#5B3DF5]/15 active:scale-[0.98] flex items-center gap-2 cursor-pointer border-r border-[#4a30db]/50">
            <Plus size={14} />
            Add New Role
          </button>
          <button className="h-11 px-3 bg-[#5B3DF5] hover:bg-[#4a30db] text-white rounded-r-xl transition-all shadow-md shadow-[#5B3DF5]/15 cursor-pointer flex items-center justify-center">
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex gap-6">
        <div className="flex-1 min-w-0 space-y-6">
          <RolesStatsCards />
          <RolesFilters />
          <RolesTable />
        </div>
        
        <div className="w-[320px] shrink-0 space-y-6">
          <RolesOverviewCard />
          <RoleStatusCard />
          <RoleQuickActions />
          <NeedHelpCard />
        </div>
      </div>
      
    </div>
  );
}
