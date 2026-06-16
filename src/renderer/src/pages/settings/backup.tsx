import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import BackupOverview from '../../components/settings/backup/BackupOverview';
import BackupSchedule from '../../components/settings/backup/BackupSchedule';
import BackupStorage from '../../components/settings/backup/BackupStorage';
import BackupHealth from '../../components/settings/backup/BackupHealth';
import BackupQuickActions from '../../components/settings/backup/BackupQuickActions';
import SettingsHelpCard from '../../components/settings/SettingsHelpCard';

export default function BackupSettingsPage() {
  const [activeTab, setActiveTab] = useState('Overview');
  
  const tabs = ['Overview', 'Backup History', 'Restore', 'Schedule', 'Storage'];

  return (
    <div className="space-y-0 pb-10">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Backup Settings</h1>
        <nav className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold mt-2">
          <Link href="/dashboard" className="hover:text-[#5B3DF5] transition-colors">Dashboard</Link>
          <ChevronRight size={10} />
          <Link href="/settings" className="hover:text-[#5B3DF5] transition-colors">Settings</Link>
          <ChevronRight size={10} />
          <span className="text-[#5B3DF5]">Backup</span>
        </nav>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-gray-100 mb-6 overflow-x-auto pb-1 custom-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 text-[11px] font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === tab
                ? 'border-[#5B3DF5] text-[#5B3DF5]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 xl:col-span-8 2xl:col-span-9">
          {activeTab === 'Overview' ? (
            <>
              <BackupOverview />
              <BackupSchedule />
              <BackupStorage />
            </>
          ) : (
            <div className="flex items-center justify-center h-64 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-gray-400 font-bold text-xs">{activeTab} settings coming soon...</p>
            </div>
          )}
        </div>
        
        <div className="lg:col-span-4 xl:col-span-4 2xl:col-span-3">
          <BackupHealth />
          <BackupQuickActions />
          <SettingsHelpCard />
        </div>
      </div>
    </div>
  );
}
