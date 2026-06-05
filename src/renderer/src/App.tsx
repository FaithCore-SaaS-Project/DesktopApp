import React from 'react';
import { useApp } from './context/AppContext';
import { LayoutDashboard, Users, CircleDollarSign, FileCheck, LogOut, Wifi, WifiOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { currentTenant, tenants, switchTenant, user, logout, isOnline, toggleNetworkStatus } = useApp();
  const router = useRouter();

  // If user is not logged in, render children directly (e.g. login screen)
  if (!user) {
    return <div className="min-h-screen bg-slate-950 text-slate-100">{children}</div>;
  }

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Members Directory', icon: Users, path: '/members' },
    { name: 'Finance Tracking', icon: CircleDollarSign, path: '/finance' },
    { name: 'Certificates & Receipts', icon: FileCheck, path: '/certificates' },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900/60 border-r border-slate-800/80 flex flex-col justify-between backdrop-blur-xl">
        <div>
          {/* Logo Brand Header */}
          <div className="p-6 border-b border-slate-800/80 flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-extrabold text-white text-lg shadow-lg shadow-indigo-500/20">
              FC
            </div>
            <div>
              <h1 className="text-sm font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">FC Church Suite</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Desktop Client</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = router.pathname === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <div
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer group ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 transition-transform duration-200 group-hover:scale-110 ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Footer Session Info */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-300">{user.username}</span>
              <span className="text-[10px] text-slate-500">{user.role}</span>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-md hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Panel Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-slate-900/40 border-b border-slate-800/60 flex items-center justify-between px-8 backdrop-blur-md z-10">
          <div className="flex items-center space-x-6">
            {/* Tenant Select Switcher */}
            <div className="flex items-center space-x-2">
              <label htmlFor="tenant-select" className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Church:</label>
              <select
                id="tenant-select"
                value={currentTenant?.id || ''}
                onChange={(e) => switchTenant(e.target.value)}
                className="bg-slate-800 border border-slate-700/60 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
              >
                {tenants.map((tenant) => (
                  <option key={tenant.id} value={tenant.id}>
                    {tenant.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Network Connection Simulator Toggle */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleNetworkStatus}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-300 shadow-sm ${
                isOnline
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
              }`}
              title="Click to toggle simulated online/offline state"
            >
              {isOnline ? (
                <>
                  <Wifi className="h-3.5 w-3.5 animate-pulse" />
                  <span>Cloud Synced</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3.5 w-3.5" />
                  <span>Offline (SQLite Enabled)</span>
                </>
              )}
            </button>
            
            {/* Version Badge */}
            <span className="text-[10px] text-slate-500 font-mono bg-slate-800 border border-slate-700/50 px-2 py-1 rounded">
              v1.0.0
            </span>
          </div>
        </header>

        {/* Dynamic Route Children Panel */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-950">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
