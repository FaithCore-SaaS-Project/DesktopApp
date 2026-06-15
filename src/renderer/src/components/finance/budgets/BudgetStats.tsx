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

  const formatCurrency = (val: number) => {
    return `Rs. ${val.toLocaleString('en-US', {
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
    <div className="mb-8 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className="rounded-3xl border border-gray-150 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden"
          >
            <div className="flex flex-col h-full justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.color} ${item.iconColor} shadow-lg transition-transform duration-300 group-hover:scale-105`}
                >
                  <Icon size={22} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 leading-tight">
                    {item.value}
                  </h2>
                  <p className="text-gray-400 text-xs font-bold mt-0.5 leading-none">
                    {item.title}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                <span className={`text-xs font-bold ${item.subtextColor}`}>
                  {item.subtext}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

