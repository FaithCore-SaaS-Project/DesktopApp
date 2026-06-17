import React from 'react';
import Link from 'next/link';
import { ChevronRight, Upload, Plus, ChevronDown } from 'lucide-react';

import UserStatsCards from '../components/users/UserStatsCards';
import UserFilters from '../components/users/UserFilters';
import UsersTable from '../components/users/UsersTable';
import UsersByRoleCard from '../components/users/UsersByRoleCard';
import UsersByDepartmentCard from '../components/users/UsersByDepartmentCard';
import UserQuickActions from '../components/users/UserQuickActions';

export default function UsersPage() {
  return (
    <div className="space-y-0 pb-10">
      {/* Page Header */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Users</h1>
          <nav className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold mt-2">
            <Link href="/dashboard" className="hover:text-[#5B3DF5] transition-colors">Dashboard</Link>
            <ChevronRight size={10} />
            <span className="text-gray-600">Users</span>
          </nav>
        </div>
        <div className="flex gap-3">
          <button className="h-10 px-4 bg-white border border-gray-200 rounded-xl flex items-center gap-2 text-[12px] font-bold text-[#5B3DF5] hover:bg-gray-50 shadow-sm transition-colors cursor-pointer">
            <Upload size={14} />
            Import Users
          </button>
          <div className="flex items-center">
            <button className="h-10 pl-4 pr-3 bg-[#5B3DF5] hover:bg-[#4a30db] text-white rounded-l-xl text-[12px] font-bold transition-colors shadow-sm flex items-center gap-2 cursor-pointer border-r border-[#4a30db]/50">
              <Plus size={14} />
              Add New User
            </button>
            <button className="h-10 px-2 bg-[#5B3DF5] hover:bg-[#4a30db] text-white rounded-r-xl transition-colors shadow-sm cursor-pointer flex items-center justify-center">
              <ChevronDown size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex gap-6">
        <div className="flex-1 min-w-0">
          <UserStatsCards />
          <UserFilters />
          <UsersTable />
        </div>
        
        <div className="w-[320px] shrink-0">
          <UsersByRoleCard />
          <UsersByDepartmentCard />
          <UserQuickActions />
        </div>
      </div>
      
    </div>
  );
}
