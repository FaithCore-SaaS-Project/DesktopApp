import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChevronRight, Save } from 'lucide-react';

import FinanceSystemOverview from '../../components/settings/finance/FinanceSystemOverview';
import FinanceQuickActions from '../../components/settings/finance/FinanceQuickActions';
import FinanceGeneralSettings from '../../components/settings/finance/FinanceGeneralSettings';
import RoundingPrecisionCard from '../../components/settings/finance/RoundingPrecisionCard';
import SettingsHelpCard from '../../components/settings/SettingsHelpCard';

import { settingsService } from '../../services/settingsService';

export default function FinanceSettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('General');
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [originalSettings, setOriginalSettings] = useState<Record<string, string>>({});
  const [overviewStats, setOverviewStats] = useState<any>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const tabs = [
    'General', 'Payment Methods', 'Tax & Compliance', 'Categories', 
    'Budgets', 'Bank Accounts', 'Receipts', 'Advanced'
  ];

  useEffect(() => {
    const fetchData = async () => {
      const [data, stats] = await Promise.all([
        settingsService.getSettings(),
        settingsService.getFinanceOverview()
      ]);
      setSettings(data || {});
      setOriginalSettings(data || {});
      setOverviewStats(stats);
      setHasChanges(false);
    };
    fetchData();
  }, []);

  // Handle route change warning
  useEffect(() => {
    const handleRouteChangeStart = () => {
      if (hasChanges && !window.confirm('You have unsaved changes. Are you sure you want to leave without saving?')) {
        router.events.emit('routeChangeError');
        throw 'Route canceled';
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasChanges, router.events]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await settingsService.updateSettings(settings);
      setOriginalSettings(settings);
      setHasChanges(false);
      
      // Refresh stats in case settings affect them
      const stats = await settingsService.getFinanceOverview();
      setOverviewStats(stats);
      
      alert('Settings saved successfully!');
    } catch (err) {
      alert('Error saving settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (key: string, value: string) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value };
      setHasChanges(JSON.stringify(next) !== JSON.stringify(originalSettings));
      return next;
    });
  };

  const handleTabClick = (tab: string) => {
    if (hasChanges) {
      if (window.confirm('You have unsaved changes. Do you want to discard them and switch tabs?')) {
        setSettings(originalSettings);
        setHasChanges(false);
        setActiveTab(tab);
      }
    } else {
      setActiveTab(tab);
    }
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
            onClick={() => handleTabClick(tab)}
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
              <RoundingPrecisionCard settings={settings} updateSetting={updateSetting} />
            </>
          ) : (
            <div className="flex items-center justify-center h-64 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-gray-400 font-bold text-xs">{activeTab} settings coming soon...</p>
            </div>
          )}
        </div>
        
        <div className="lg:col-span-4 xl:col-span-3">
          <FinanceSystemOverview stats={overviewStats} />
          <FinanceQuickActions />
          <SettingsHelpCard />
        </div>
      </div>
    </div>
  );
}
