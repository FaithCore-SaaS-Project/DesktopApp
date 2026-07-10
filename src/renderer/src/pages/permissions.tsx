import React from 'react';
import Link from 'next/link';
import { ChevronRight, Lock } from 'lucide-react';

import PermissionsStatsCards from '../components/permissions/PermissionsStatsCards';
import PermissionsFilters from '../components/permissions/PermissionsFilters';
import PermissionsTable from '../components/permissions/PermissionsTable';
import PermissionsByModuleCard from '../components/permissions/PermissionsByModuleCard';
import PermissionTypesCard from '../components/permissions/PermissionTypesCard';
import PermissionQuickActions from '../components/permissions/PermissionQuickActions';
import NeedHelpPermissionCard from '../components/permissions/NeedHelpPermissionCard';

export default function PermissionsPage() {
  return (
    <div className="space-y-0 pb-10 p-8 bg-gradient-to-br from-slate-50 via-slate-50/50 to-indigo-50/30 min-h-screen">
      {/* Page Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Permissions</h1>
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 font-bold mt-2">
            <Link href="/dashboard" className="hover:text-[#5B3DF5] transition-colors">Dashboard</Link>
            <ChevronRight size={12} />
            <Link href="/users" className="hover:text-[#5B3DF5] transition-colors">Users & Roles</Link>
            <ChevronRight size={12} />
            <span className="text-gray-655 font-bold">Permissions</span>
          </nav>
        </div>
        <div>
          <button className="h-11 px-6 bg-[#5B3DF5] hover:bg-[#4a30db] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#5B3DF5]/15 active:scale-[0.98] flex items-center gap-2 cursor-pointer">
            <Lock size={14} />
            Manage Permissions
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex gap-6">
        <div className="flex-1 min-w-0 space-y-6">
          <PermissionsStatsCards />
          <PermissionsFilters />
          <PermissionsTable />
        </div>
        
        <div className="w-[320px] shrink-0 space-y-6">
          <PermissionsByModuleCard />
          <PermissionTypesCard />
          <PermissionQuickActions />
          <NeedHelpPermissionCard />
        </div>
      </div>
      
    </div>
  );
}
