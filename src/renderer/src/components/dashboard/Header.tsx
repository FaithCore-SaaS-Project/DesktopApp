import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/api';
import { notificationService } from '../../services/notificationService';
import {
  Menu,
  Search,
  Bell,
  Mail,
  Wifi,
  WifiOff,
  LogOut,
  ChevronDown,
  RefreshCw
} from "lucide-react";

export default function Header() {
  const { user, logout, isOnline, toggleNetworkStatus, currentTenant, toggleSidebar } = useApp();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any>({ unread: [], all: [] });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    if (isOnline) {
      const data = await notificationService.getNotifications();
      if (data && data.unread) {
        setNotifications(data);
      }
    }
  };

  const handleMarkAsRead = async (id: string) => {
    await notificationService.markNotificationRead(id);
    fetchNotifications();
  };

  const unreadCount = notifications?.unread?.length || 0;

  return (
    <div className="bg-white border-b border-slate-200/80 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      <div className="flex items-center gap-3 sm:gap-4 flex-1">
        <button 
          onClick={toggleSidebar}
          className="text-slate-600 hover:text-slate-900 transition-colors p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer flex items-center justify-center shrink-0"
          title="Toggle Sidebar"
          aria-label="Toggle Sidebar"
        >
          <Menu size={18} />
        </button>
        <div className="relative group flex-1 max-w-[240px] sm:max-w-[320px] lg:max-w-[400px]">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
            size={15}
          />
          <input
            type="text"
            placeholder="Search members, transactions, letters..."
            className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-1.5 outline-none text-xs text-slate-800 bg-slate-50/70 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-400 placeholder:font-normal"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-6 shrink-0">
        {/* Network Connection Toggle */}
        <button
          onClick={toggleNetworkStatus}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold border transition-all duration-300 shadow-sm select-none active:scale-[0.98]
            ${
              isOnline
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 hover:bg-emerald-500/15'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-600 hover:bg-rose-500/15'
            }`}
          title="Toggle network status (Simulate Online/Offline)"
        >
          {isOnline ? (
            <>
              <Wifi size={13} className="animate-pulse text-emerald-500" />
              <span className="hidden sm:inline">Cloud Synced</span>
            </>
          ) : (
            <>
              <WifiOff size={13} className="text-rose-500" />
              <span className="hidden sm:inline">Offline Mode (SQLite)</span>
            </>
          )}
        </button>

        {/* Sync Button */}
        {isOnline && currentTenant?.id && (
          <button
            onClick={async () => {
              setIsSyncing(true);
              try {
                const { membersSynced, financeSynced } = await apiService.syncPendingRecords(currentTenant.id);
                if (membersSynced > 0 || financeSynced > 0) {
                  if (typeof window !== 'undefined' && window.electronAPI) {
                    window.electronAPI.sendNotification(
                      'Cloud Sync Complete',
                      `Successfully uploaded ${membersSynced} member(s) and ${financeSynced} financial record(s).`
                    );
                  } else {
                    alert(`Sync Complete: Uploaded ${membersSynced} member(s) and ${financeSynced} financial record(s).`);
                  }
                } else {
                  if (typeof window !== 'undefined' && window.electronAPI) {
                    window.electronAPI.sendNotification(
                      'Cloud Sync Complete',
                      'Your local database is already up to date.'
                    );
                  } else {
                    alert('Sync Complete: Local database is up to date.');
                  }
                }
              } catch (e) {
                console.error(e?.message || 'Error occurred');
                alert('Sync failed. Please check your network connection.');
              } finally {
                setIsSyncing(false);
              }
            }}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold border border-violet-200 bg-violet-50 text-violet-600 hover:bg-violet-100 disabled:opacity-50 transition-all select-none active:scale-[0.98]"
            title="Upload pending offline records to cloud"
          >
            <RefreshCw size={13} className={isSyncing ? "animate-spin" : ""} />
            <span>{isSyncing ? "Syncing..." : "Sync Cloud"}</span>
          </button>
        )}

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-500 hover:text-slate-800 outline-none"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 flex items-center justify-center rounded-full bg-red-500 ring-2 ring-white text-[9px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-100 rounded-2xl shadow-xl z-30 animate-fade-in overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <p className="text-xs font-bold text-slate-700">Notifications</p>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-semibold text-violet-600 bg-violet-100 px-2 py-0.5 rounded-full">{unreadCount} New</span>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto">
                {unreadCount > 0 ? (
                  notifications.unread.map((notif: any) => (
                    <div key={notif.id} className="px-4 py-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors" onClick={() => handleMarkAsRead(notif.id)}>
                      <p className="text-xs font-bold text-slate-800">{notif.data?.subject || notif.subject || 'New Notification'}</p>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{notif.data?.message || notif.message}</p>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center">
                    <p className="text-xs text-slate-400 font-medium">No new notifications</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Vertical Divider */}
        <div className="h-6 w-px bg-slate-100" />

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1.5 hover:bg-slate-100 rounded-lg transition-colors outline-none cursor-pointer"
          >
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-sm shrink-0">
              {currentTenant?.name?.charAt(0) || user?.username?.charAt(0) || 'P'}
            </div>
            <div className="text-left hidden sm:block max-w-[120px] md:max-w-[160px]">
              <h4 className="font-semibold text-slate-800 text-xs leading-tight truncate">
                {user?.username || 'Pastor John Silva'}
              </h4>
              <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                {currentTenant?.name || 'Beracah Christian Ministry'}
              </p>
            </div>
            <ChevronDown size={14} className="text-slate-400 shrink-0" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50 animate-fade-in">
              <div className="px-3.5 py-2.5 border-b border-slate-100">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Signed in as</span>
                <p className="text-xs font-bold text-slate-900 truncate mt-0.5">{user?.username || 'Pastor John Silva'}</p>
                <div className="mt-2 pt-2 border-t border-slate-100">
                  <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider block">Church Activation ID</span>
                  <span className="inline-block mt-0.5 px-1.5 py-0.5 bg-blue-50 text-blue-700 font-mono text-[11px] font-bold rounded border border-blue-200/60">
                    {typeof window !== 'undefined' ? localStorage.getItem('activationCode') || 'FC-123456' : 'FC-123456'}
                  </span>
                </div>
              </div>
              <div className="p-1">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-left"
                >
                  <LogOut size={14} />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
