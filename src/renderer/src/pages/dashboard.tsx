import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/api';
import { MemberMock, FinanceMock } from '../services/mockData';
import { Users, TrendingUp, TrendingDown, Wallet, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { currentTenant, isOnline } = useApp();
  const [members, setMembers] = useState<MemberMock[]>([]);
  const [finance, setFinance] = useState<FinanceMock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentTenant) return;
    
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const mems = await apiService.getMembers(currentTenant.id);
        const fins = await apiService.getFinanceRecords(currentTenant.id);
        setMembers(mems);
        setFinance(fins);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [currentTenant, isOnline]); // Reload when tenant or online status changes

  // Calculations
  const totalMembersCount = members.length;
  const activeMembers = members.filter(m => m.status === 'Active').length;
  
  const incomeRecords = finance.filter(f => f.type === 'income');
  const expenseRecords = finance.filter(f => f.type === 'expense');

  const totalIncome = incomeRecords.reduce((sum, r) => sum + r.amount, 0);
  const totalExpense = expenseRecords.reduce((sum, r) => sum + r.amount, 0);
  const netBalance = totalIncome - totalExpense;

  // Recent financial records
  const recentTransactions = finance.slice(0, 4);
  const recentMembers = members.slice(0, 4);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-10 w-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          <p className="text-slate-400 text-xs font-semibold tracking-wide">Syncing metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Welcome Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Workspace Overview
          </h1>
          <p className="text-sm text-slate-500">
            Real-time operations for <span className="font-semibold text-slate-400">{currentTenant?.name}</span>
          </p>
        </div>
        
        {/* Sync Indicator */}
        <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-900 border border-slate-800/80 px-3 py-1.5 rounded-xl">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isOnline ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isOnline ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
          </span>
          <span>{isOnline ? 'Database is Live (Auto-Sync)' : 'Database is Local (WAL SQLite Mode)'}</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Members */}
        <div className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-2xl flex items-center justify-between shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-500/10 transition-colors" />
          <div className="space-y-2">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Members</span>
            <h3 className="text-3xl font-extrabold text-white">{totalMembersCount}</h3>
            <p className="text-xs text-slate-400">
              <span className="text-emerald-400 font-semibold">{activeMembers}</span> active members
            </p>
          </div>
          <div className="p-3.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl shadow-inner">
            <Users className="h-6 w-6" />
          </div>
        </div>

        {/* Card 2: Income */}
        <div className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-2xl flex items-center justify-between shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />
          <div className="space-y-2">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Gross Income</span>
            <h3 className="text-3xl font-extrabold text-emerald-400">${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            <p className="text-xs text-slate-400 flex items-center">
              <ArrowUpRight className="h-3 w-3 text-emerald-400 mr-0.5" />
              <span>Tithes & offerings</span>
            </p>
          </div>
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>

        {/* Card 3: Expense */}
        <div className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-2xl flex items-center justify-between shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-rose-500/10 transition-colors" />
          <div className="space-y-2">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Expenditures</span>
            <h3 className="text-3xl font-extrabold text-rose-400">${totalExpense.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            <p className="text-xs text-slate-400 flex items-center">
              <ArrowDownRight className="h-3 w-3 text-rose-400 mr-0.5" />
              <span>Operational costs</span>
            </p>
          </div>
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl">
            <TrendingDown className="h-6 w-6" />
          </div>
        </div>

        {/* Card 4: Balance */}
        <div className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-2xl flex items-center justify-between shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/10 transition-colors" />
          <div className="space-y-2">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Net Balance</span>
            <h3 className={`text-3xl font-extrabold ${netBalance >= 0 ? 'text-cyan-400' : 'text-rose-400'}`}>
              ${netBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <p className="text-xs text-slate-400">
              Local account standing
            </p>
          </div>
          <div className="p-3.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl">
            <Wallet className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Main Sections: Chart and Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Income Distribution SVG Chart */}
        <div className="lg:col-span-2 bg-slate-900/30 border border-slate-800/60 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">Financial Breakdown</h2>
              <p className="text-xs text-slate-500">Distribution of tithes vs expenses</p>
            </div>
            <span className="text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-lg font-bold">
              Current Period
            </span>
          </div>

          {/* Premium custom SVG representation graph */}
          <div className="h-60 w-full flex items-end justify-around pb-2 px-4 relative">
            <div className="absolute inset-x-0 top-1/4 border-b border-slate-800/40 border-dashed" />
            <div className="absolute inset-x-0 top-2/4 border-b border-slate-800/40 border-dashed" />
            <div className="absolute inset-x-0 top-3/4 border-b border-slate-800/40 border-dashed" />
            
            {/* SVG Bars */}
            <div className="flex flex-col items-center space-y-2 z-10 w-24">
              <div className="w-12 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-lg transition-all duration-500 hover:brightness-110 shadow-lg shadow-emerald-500/10" style={{ height: `${totalIncome > 0 ? 160 : 20}px` }}></div>
              <span className="text-xs text-slate-400 font-bold">Income</span>
            </div>

            <div className="flex flex-col items-center space-y-2 z-10 w-24">
              <div className="w-12 bg-gradient-to-t from-rose-600 to-rose-400 rounded-t-lg transition-all duration-500 hover:brightness-110 shadow-lg shadow-rose-500/10" style={{ height: `${totalIncome > 0 ? (totalExpense / totalIncome) * 160 : 20}px` }}></div>
              <span className="text-xs text-slate-400 font-bold">Expenses</span>
            </div>

            <div className="flex flex-col items-center space-y-2 z-10 w-24">
              <div className="w-12 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-lg transition-all duration-500 hover:brightness-110 shadow-lg shadow-cyan-500/10" style={{ height: `${totalIncome > 0 ? (netBalance / totalIncome) * 160 : 20}px` }}></div>
              <span className="text-xs text-slate-400 font-bold">Net Margin</span>
            </div>
          </div>
        </div>

        {/* Recent Added Members List */}
        <div className="bg-slate-900/30 border border-slate-800/60 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-white">Recent Additions</h2>
                <p className="text-xs text-slate-500">Newly registered profiles</p>
              </div>
              <Link href="/members" className="text-xs text-indigo-400 hover:underline">
                View all
              </Link>
            </div>

            {/* List */}
            <div className="space-y-4">
              {recentMembers.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">No members registered yet.</p>
              ) : (
                recentMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-slate-950/40 border border-slate-850 rounded-xl hover:bg-slate-900/20 transition-all">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 flex items-center justify-center text-xs font-bold font-mono">
                        {member.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-300">{member.name}</span>
                        <span className="text-[10px] text-slate-500">{member.role}</span>
                      </div>
                    </div>
                    <span className="text-[10px] bg-slate-800 border border-slate-700/60 px-2 py-0.5 rounded text-slate-400">
                      {member.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Financial ledger transaction list */}
      <div className="bg-slate-900/30 border border-slate-800/60 p-6 rounded-2xl shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-white">Recent Transactions</h2>
            <p className="text-xs text-slate-500">Latest income and expense entries</p>
          </div>
          <Link href="/finance" className="text-xs text-indigo-400 hover:underline">
            Manage Ledger
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="pb-3 pl-3">Date</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Description</th>
                <th className="pb-3 text-right pr-3">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-xs">
              {recentTransactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-slate-500">No recent transactions.</td>
                </tr>
              ) : (
                recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-900/10 transition-colors">
                    <td className="py-3 pl-3 text-slate-400 flex items-center space-x-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-500" />
                      <span>{tx.date}</span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        tx.type === 'income' 
                          ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                          : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                      }`}>
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-3 text-slate-300 font-medium">{tx.description}</td>
                    <td className={`py-3 text-right pr-3 font-extrabold ${tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
