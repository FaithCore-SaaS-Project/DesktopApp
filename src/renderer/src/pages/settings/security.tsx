import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import SecurityOverview from '../../components/settings/security/SecurityOverview';
import GeneralSecuritySettings from '../../components/settings/security/GeneralSecuritySettings';
import SecurityRecommendations from '../../components/settings/security/SecurityRecommendations';
import SecuritySummary from '../../components/settings/security/SecuritySummary';
import SecurityQuickActions from '../../components/settings/security/SecurityQuickActions';
import SettingsHelpCard from '../../components/settings/SettingsHelpCard';

export default function SecuritySettingsPage() {
  const [activeTab, setActiveTab] = useState('General');
  
  const tabs = [
    'General', 'Password Policy', 'Two-Factor Authentication', 
    'Session Management', 'Login History', 'Trusted Devices', 'Advanced'
  ];

  return (
    <div className="space-y-0 pb-10 p-8 bg-gradient-to-br from-slate-50 via-slate-50/50 to-indigo-50/30 min-h-screen">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Security Settings</h1>
        <nav className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold mt-2">
          <Link href="/dashboard" className="hover:text-[#5B3DF5] transition-colors">Dashboard</Link>
          <ChevronRight size={10} />
          <Link href="/settings" className="hover:text-[#5B3DF5] transition-colors">Settings</Link>
          <ChevronRight size={10} />
          <span className="text-[#5B3DF5]">Security</span>
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
          {activeTab === 'General' ? (
            <>
              <SecurityOverview />
              <GeneralSecuritySettings />
              <SecurityRecommendations />
            </>
          ) : (
            <div className="flex items-center justify-center h-64 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-gray-400 font-bold text-xs">{activeTab} settings coming soon...</p>
            </div>
          )}
        </div>
        
        <div className="lg:col-span-4 xl:col-span-4 2xl:col-span-3">
          <SecuritySummary />
          <SecurityQuickActions />
          <SettingsHelpCard />
        </div>
      </div>
    </div>
  );
}
