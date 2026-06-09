import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/api';
import StatsCards from '../components/dashboard/StatsCards';
import MonthlyOverview from '../components/dashboard/MonthlyOverview';
import QuickActions from '../components/dashboard/QuickActions';
import RecentMembers from '../components/dashboard/RecentMembers';
import RecentReceipts from '../components/dashboard/RecentReceipts';
import UpcomingEvents from '../components/dashboard/UpcomingEvents';
import { CalendarDays } from 'lucide-react';

export default function DashboardPage() {
  const { user, currentTenant } = useApp();
  const [currentDateString, setCurrentDateString] = useState('');

  useEffect(() => {
    // Format date nicely on client side
    const date = new Date();
    const formatted = date.toLocaleDateString('en-LK', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    setCurrentDateString(formatted);
  }, []);

  return (
    <div className="p-8 bg-[#f5f6fa] min-h-full animate-fade-in select-none">
      {/* Welcome Banner */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Welcome back, {user?.username || 'Admin'}! 👋
          </h1>
          <p className="text-gray-500 mt-2 text-sm font-semibold">
            Here's what's happening at {currentTenant?.name || 'your church'} today.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-white border border-gray-150 px-4 py-2.5 rounded-xl shadow-sm self-start md:self-auto select-none">
          <CalendarDays size={16} className="text-[#5B3DF5]" />
          <span>{currentDateString || 'Saturday, 24 May 2025'}</span>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="mb-8">
        <StatsCards />
      </div>

      {/* Middle Section: Overview & Actions */}
      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <MonthlyOverview />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>

      {/* Bottom Section: Members, Receipts, Events */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div>
          <RecentMembers />
        </div>
        <div>
          <RecentReceipts />
        </div>
        <div>
          <UpcomingEvents />
        </div>
      </div>
    </div>
  );
}
