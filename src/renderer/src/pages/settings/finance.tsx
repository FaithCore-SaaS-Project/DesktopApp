import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Save } from 'lucide-react';

import FinanceSystemOverview from '../../components/settings/finance/FinanceSystemOverview';
import FinanceQuickActions from '../../components/settings/finance/FinanceQuickActions';
import FinanceGeneralSettings from '../../components/settings/finance/FinanceGeneralSettings';
import RoundingPrecisionCard from '../../components/settings/finance/RoundingPrecisionCard';
import SettingsHelpCard from '../../components/settings/SettingsHelpCard';

import { apiService } from '../../services/api';

export default function FinanceSettingsPage() {
  const [activeTab, setActiveTab] = useState('General');
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  
  const tabs = [
    'General', 'Payment Methods', 'Tax & Compliance', 'Categories', 
    'Budgets', 'Bank Accounts', 'Receipts', 'Advanced'
  ];

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await apiService.getSettings();
      setSettings(data || {});
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await apiService.updateSettings(settings);
      alert('Settings saved successfully!');
    } catch (err) {
      alert('Error saving settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-0 pb-10 p-8 bg-gradient-to-br from-slate-50 via-slate-50/50 to-indigo-50/30 min-h-screen">
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Finance Settings</h1>
          <nav className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold mt-2">
            <Link href="/dashboard" className="hover:text-[#5B3DF5] transition-colors">Dashboard</Link>
            <ChevronRight size={10} />
            <Link href="/settings" className="hover:text-[#5B3DF5] transition-colors">Settings</Link>
            <ChevronRight size={10} />
            <span className="text-[#5B3DF5]">Finance</span>
          </nav>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 rounded-xl bg-[#5B3DF5] hover:bg-[#4d32d6] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-[#5B3DF5]/15 transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50"
        >
          <Save size={16} />
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-gray-100 mb-6 overflow-x-auto pb-1">
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
        <div className="lg:col-span-8 xl:col-span-9">
          {activeTab === 'General' ? (
            <>
              <FinanceGeneralSettings settings={settings} updateSetting={updateSetting} />
              <RoundingPrecisionCard />
            </>
          ) : (
            <div className="flex items-center justify-center h-64 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-gray-400 font-bold text-xs">{activeTab} settings coming soon...</p>
            </div>
          )}
        </div>
        
        <div className="lg:col-span-4 xl:col-span-3">
          <FinanceSystemOverview />
          <FinanceQuickActions />
          <SettingsHelpCard />
        </div>
      </div>
    </div>
  );
}
