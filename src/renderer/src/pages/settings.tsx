import React from 'react';
import Link from 'next/link';
import { ChevronRight, Settings, DollarSign, Bell, Shield, Users, Building2, FolderOpen, Puzzle, Database, ClipboardList, Wrench } from 'lucide-react';

import SettingsCard from '../components/settings/SettingsCard';
import SystemOverviewCard from '../components/settings/SystemOverviewCard';
import SettingsQuickActions from '../components/settings/SettingsQuickActions';
import SettingsHelpCard from '../components/settings/SettingsHelpCard';

export default function SettingsPage() {
  const systemSettings = [
    { title: 'Church Profile', color: 'bg-indigo-600', icon: <Building2 size={24} />, description: 'Update basic info, services, ministries, and social media.', href: '/settings/church-profile' },
    { title: 'General', color: 'bg-purple-600', icon: <Settings size={24} />, description: 'Manage system details, site information, date & time, language and other preferences.' },
    { title: 'Finance', color: 'bg-green-500', icon: <DollarSign size={24} />, description: 'Configure currency, financial year, payment methods and tax settings and more.' },
    { title: 'Notifications', color: 'bg-orange-500', icon: <Bell size={24} />, description: 'Manage email, SMS and in-app notifications and alert preferences.' },
    { title: 'Security', color: 'bg-blue-600', icon: <Shield size={24} />, description: 'Configure password policies, 2FA, session management and security settings.' },
  ];

  const administration = [
    { title: 'Users & Roles', color: 'bg-purple-600', icon: <Users size={24} />, description: 'Manage users, roles and permissions across the system.', href: '/users' },
    { title: 'Departments', color: 'bg-green-600', icon: <Building2 size={24} />, description: 'Manage departments and their leaders and settings.', href: '/departments' },
    { title: 'Documents', color: 'bg-amber-500', icon: <FolderOpen size={24} />, description: 'Configure document categories, storage limits and file settings.', href: '/documents' },
    { title: 'Integrations', color: 'bg-blue-600', icon: <Puzzle size={24} />, description: 'Manage third-party integrations and API connections.' },
  ];

  const systemManagement = [
    { title: 'Backup & Restore', color: 'bg-purple-600', icon: <Database size={24} />, description: 'Create backups and restore your system data when needed.' },
    { title: 'Audit Logs', color: 'bg-green-600', icon: <ClipboardList size={24} />, description: 'View system activity logs and track important changes.' },
    { title: 'System Maintenance', color: 'bg-orange-500', icon: <Wrench size={24} />, description: 'Clear cache, update system and perform maintenance tasks.' },
  ];

  return (
    <div className="space-y-0 pb-10 p-8 bg-gradient-to-br from-slate-50 via-slate-50/50 to-indigo-50/30 min-h-screen">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Settings</h1>
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold mt-2">
          <Link href="/dashboard" className="hover:text-[#5B3DF5] transition-colors">Dashboard</Link>
          <ChevronRight size={12} />
          <span className="text-[#5B3DF5]">Settings</span>
        </nav>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 xl:col-span-9">
          
          {/* System Settings */}
          <section>
            <h2 className="text-lg font-black text-gray-900">System Settings</h2>
            <p className="text-gray-500 text-xs font-semibold mt-1">Configure general system preferences and defaults.</p>
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
              {systemSettings.map((item, index) => (
                <SettingsCard key={index} {...item} />
              ))}
            </div>
          </section>

          <hr className="my-10 border-gray-100" />

          {/* Administration */}
          <section>
            <h2 className="text-lg font-black text-gray-900">Administration</h2>
            <p className="text-gray-500 text-xs font-semibold mt-1">Manage system data and administrative tasks.</p>
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
              {administration.map((item, index) => (
                <SettingsCard key={index} {...item} />
              ))}
            </div>
          </section>

          <hr className="my-10 border-gray-100" />

          {/* System Management */}
          <section>
            <h2 className="text-lg font-black text-gray-900">System Management</h2>
            <p className="text-gray-500 text-xs font-semibold mt-1">Tools for maintaining and optimizing your system.</p>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
              {systemManagement.map((item, index) => (
                <SettingsCard key={index} {...item} />
              ))}
            </div>
          </section>
          
        </div>
        
        <div className="lg:col-span-4 xl:col-span-3">
          <SystemOverviewCard />
          <SettingsQuickActions />
          <SettingsHelpCard />
        </div>
      </div>
    </div>
  );
}
