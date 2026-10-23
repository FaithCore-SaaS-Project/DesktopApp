import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import api from '../lib/axios';
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
  const [stats, setStats] = useState({
    total_members: 0,
    total_families: 0,
    monthly_income: 0,
    monthly_expense: 0
  });
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);

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

    // Fetch live dashboard stats from the SaaS Backend
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/stats');
        setStats(response.data.stats);
        setDashboardData(response.data);
      } catch (error) {
        console.error("Failed to load dashboard stats", error?.message || 'Error occurred');
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, [currentTenant?.id]);

  return (
    <div className="p-6 lg:p-8 bg-slate-50/70 min-h-full select-none">
      {/* Welcome Banner */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-200/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Welcome back, {user?.username || 'Pastor John Silva'}
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/50">
              Pastor View
            </span>
          </div>
          <p className="text-slate-500 mt-1 text-xs font-medium">
            Here is your daily operational summary for <span className="font-semibold text-slate-700">{currentTenant?.name || 'Beracah Christian Ministry'}</span>.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200/80 px-3 py-1.5 rounded-lg shadow-sm self-start md:self-auto select-none">
          <CalendarDays size={14} className="text-slate-400" />
          <span>{currentDateString || 'Tuesday, October 6, 2026'}</span>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="mb-8">
        <StatsCards 
          totalMembers={stats.total_members}
          families={stats.total_families}
          monthlyIncome={stats.monthly_income}
          monthlyExpense={stats.monthly_expense}
        />
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
          <RecentMembers members={dashboardData?.recent_members?.map((m: any) => ({
            name: `${m.first_name} ${m.last_name}`,
            age: m.dob ? `${new Date().getFullYear() - new Date(m.dob).getFullYear()} Years` : 'N/A',
            gender: m.gender ? m.gender.charAt(0).toUpperCase() + m.gender.slice(1) : 'N/A',
            date: new Date(m.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
          }))} />
        </div>
        <div>
          <RecentReceipts receipts={dashboardData?.recent_donations?.map((d: any) => ({
            number: `RCP-${new Date(d.income_date).getFullYear()}-${d.id}`,
            member: d.description || d.category?.name || 'General Donation',
            amount: `Rs. ${Number(d.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            date: new Date(d.income_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
          }))} />
        </div>
        <div>
          <UpcomingEvents events={dashboardData?.upcoming_events?.map((e: any) => {
            const dateObj = new Date(e.event_date);
            return {
              day: dateObj.getDate().toString().padStart(2, '0'),
              month: dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
              title: e.title,
              time: e.time || 'TBA',
              location: e.location || 'Church Campus'
            };
          })} />
        </div>
      </div>
    </div>
  );
}
