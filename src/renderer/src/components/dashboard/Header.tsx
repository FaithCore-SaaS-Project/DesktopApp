import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  Search,
  Bell,
  Mail,
  Wifi,
  WifiOff,
  LogOut,
  ChevronDown
} from "lucide-react";

export default function Header() {
  const { user, logout, isOnline, toggleNetworkStatus, currentTenant } = useApp();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <div className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      <div className="flex items-center gap-5">
        <button className="text-gray-650 hover:text-gray-900 transition-colors p-1.5 hover:bg-gray-100 rounded-lg">
          <Menu size={24} />
        </button>
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search members, receipts, letters..."
            className="w-[450px] rounded-xl border border-gray-200 pl-12 pr-4 py-3 outline-none text-sm text-gray-700 bg-gray-50 focus:bg-white focus:border-[#5B3DF5] focus:ring-1 focus:ring-[#5B3DF5] transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Network Connection Toggle */}
        <button
          onClick={toggleNetworkStatus}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-300 shadow-sm
            ${
              isOnline
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/20'
                : 'bg-rose-500/15 border-rose-500/30 text-rose-600 hover:bg-rose-500/20'
            }`}
          title="Toggle network status (Simulate Online/Offline)"
        >
          {isOnline ? (
            <>
              <Wifi size={14} className="animate-pulse" />
              <span className="hidden sm:inline">Cloud Synced</span>
            </>
          ) : (
            <>
              <WifiOff size={14} />
              <span className="hidden sm:inline">Offline Mode (SQLite)</span>
            </>
          )}
        </button>

        {/* Notifications and Mail */}
        <div className="flex items-center gap-4 text-gray-500">
          <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-gray-900">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>
          <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-gray-900">
            <Mail size={20} />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white"></span>
          </button>
        </div>

        {/* Vertical Divider */}
        <div className="h-6 w-px bg-gray-200" />

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 p-1 hover:bg-gray-55 rounded-xl transition-all outline-none"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
              alt="Avatar"
              className="h-11 w-11 rounded-full object-cover border border-gray-200"
            />
            <div className="text-left hidden md:block">
              <h4 className="font-semibold text-gray-800 leading-tight">
                {user?.username || 'Admin'}
              </h4>
              <p className="text-xs text-gray-500 font-medium">
                {currentTenant?.name || 'Super Admin'}
              </p>
            </div>
            <ChevronDown size={16} className="text-gray-400 hidden md:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-150 rounded-xl shadow-lg py-2 z-30 animate-fade-in">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-xs text-gray-400">Signed in as</p>
                <p className="text-sm font-bold text-gray-850 truncate">{user?.username || 'Admin'}</p>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-650 hover:bg-red-50 hover:text-red-700 transition-colors text-left"
              >
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
