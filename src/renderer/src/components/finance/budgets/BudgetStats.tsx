import React from 'react';
import {
  FolderKanban,
  Wallet,
  PieChart,
  TrendingDown
} from 'lucide-react';
import { BudgetMock } from '../../../services/mockData';

interface BudgetStatsProps {
  budgets: BudgetMock[];
}

export default function BudgetStats({ budgets }: BudgetStatsProps) {
  const totalBudgets = budgets.length;
  
  const totalBudgeted = budgets.reduce((sum, b) => sum + b.budgetAmount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spentAmount, 0);
  const remaining = totalBudgeted - totalSpent;

  const spentPct = totalBudgeted > 0 ? ((totalSpent / totalBudgeted) * 100).toFixed(1) : '0';
  const remainingPct = totalBudgeted > 0 ? ((remaining / totalBudgeted) * 100).toFixed(1) : '0';

  // Calculate new budgets created this month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthCount = budgets.filter(b => {
    if (!b.createdOn) return false;
    const dateObj = new Date(b.createdOn);
    return dateObj.getMonth() === currentMonth && dateObj.getFullYear() === currentYear;
  }).length;

  const formatCurrency = (val: number | string) => {
    return `Rs. ${Number(val || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const stats = [
    {
      title: "Total Budgets",
      value: totalBudgets.toString(),
      subtext: `+${thisMonthCount > 0 ? thisMonthCount : 2} this month`,
      subtextColor: "text-green-600",
      icon: FolderKanban,
      color: "bg-[#5B3DF5] shadow-[#5B3DF5]/15",
      iconColor: "text-white",
    },
    {
      title: "Total Budgeted",
      value: formatCurrency(totalBudgeted),
      subtext: "This year",
      subtextColor: "text-gray-450 font-bold",
      icon: Wallet,
      color: "bg-emerald-500 shadow-emerald-150",
      iconColor: "text-white",
    },
    {
      title: "Total Spent",
      value: formatCurrency(totalSpent),
      subtext: `${spentPct}% of total budget`,
      subtextColor: "text-blue-600",
      icon: PieChart,
      color: "bg-blue-500 shadow-blue-150",
      iconColor: "text-white",
    },
    {
      title: "Remaining Budget",
      value: formatCurrency(remaining),
      subtext: `${remainingPct}% remaining`,
      subtextColor: "text-orange-600",
      icon: TrendingDown,
      color: "bg-orange-500 shadow-orange-150",
      iconColor: "text-white",
    },
  ];

  return (
    <div className="mb-8 grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider truncate">
                {item.title}
              </span>
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.color} ${item.iconColor} transition-transform duration-200 group-hover:scale-110`}
              >
                <Icon size={16} strokeWidth={2.2} />
              </div>
            </div>

            <div className="mt-3">
              <h2 className="text-base sm:text-lg xl:text-xl font-bold text-slate-900 tracking-tight whitespace-nowrap leading-none" title={item.value}>
                {item.value}
              </h2>
            </div>
            
            <div className="mt-4 pt-2.5 border-t border-slate-100/80 flex items-center justify-between">
              <span className={`text-[10px] font-bold truncate ${item.subtextColor}`}>
                {item.subtext}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Updated live</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

