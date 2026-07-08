import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, UserPlus } from 'lucide-react';

import UsersStats from '../components/users/UsersStats';
import UsersFilters from '../components/users/UsersFilters';
import UsersTable from '../components/users/UsersTable';
import UsersSidebar from '../components/users/UsersSidebar';

export default function UsersRolesPage() {
  const [activeTab, setActiveTab] = useState('Users');

  return (
    <div className="space-y-0 pb-10 p-8 bg-gradient-to-br from-slate-50 via-slate-50/50 to-indigo-50/30 min-h-screen">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Users & Roles</h1>
        <div className="flex items-center gap-3">
          <button className="bg-white border border-[#5B3DF5] text-[#5B3DF5] hover:bg-[#5B3DF5]/5 px-4 py-2 rounded-2xl text-sm font-bold transition-all cursor-pointer flex items-center gap-2">
            <UserPlus size={16} />
            Invite User
          </button>
          
          <div className="flex bg-[#5B3DF5] rounded-2xl shadow-lg shadow-[#5B3DF5]/20 overflow-hidden text-white font-bold text-sm cursor-pointer active:scale-[0.98] transition-all">
            <button
              type="button"
              className="flex items-center gap-2 px-5 py-2.5 hover:bg-[#4a30db] transition-colors"
            >
              <span className="text-lg leading-none mb-0.5">+</span> Add New User
            </button>
            <button className="px-3 border-l border-white/20 hover:bg-[#4a30db] transition-colors flex items-center justify-center">
              <ChevronDown size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-gray-100 mb-6">
        {['Users', 'Roles', 'Permissions'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === tab
                ? 'border-[#5B3DF5] text-[#5B3DF5]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Users' && (
        <>
          <div className="mb-6">
            <UsersStats />
          </div>
          <div className="mb-6">
            <UsersFilters />
          </div>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 min-w-0">
              <UsersTable />
            </div>
            <div className="w-full lg:w-[320px] shrink-0">
              <UsersSidebar />
            </div>
          </div>
        </>
      )}
      
      {activeTab !== 'Users' && (
        <div className="flex items-center justify-center h-64 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 font-bold">{activeTab} coming soon...</p>
        </div>
      )}
    </div>
  );
}
