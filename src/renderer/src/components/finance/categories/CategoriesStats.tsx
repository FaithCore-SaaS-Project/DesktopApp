import React from 'react';
import {
  Grid2X2,
  TrendingUp,
  TrendingDown,
  CheckCircle
} from 'lucide-react';
import { CategoryMock } from '../../../services/mockData';

interface CategoriesStatsProps {
  categories: CategoryMock[];
}

export default function CategoriesStats({ categories }: CategoriesStatsProps) {
  const totalCount = categories.length;
  const incomeCount = categories.filter(c => c.type === 'Income').length;
  const expenseCount = categories.filter(c => c.type === 'Expense').length;
  const activeCount = categories.filter(c => c.status === 'Active').length;

  const incomePct = totalCount > 0 ? ((incomeCount / totalCount) * 100).toFixed(1) : '0';
  const expensePct = totalCount > 0 ? ((expenseCount / totalCount) * 100).toFixed(1) : '0';
  const activePct = totalCount > 0 ? ((activeCount / totalCount) * 100).toFixed(1) : '0';

  // Calculate new categories created this month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthCount = categories.filter(c => {
    if (!c.createdOn) return false;
    const date = new Date(c.createdOn);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  }).length;

  const stats = [
    {
      title: "Total Categories",
      value: totalCount.toString(),
      subtext: `+${thisMonthCount} this month`,
      subtextColor: "text-green-600",
      icon: Grid2X2,
      color: "bg-[#5B3DF5] shadow-[#5B3DF5]/15",
      iconColor: "text-white",
    },
    {
      title: "Income Categories",
      value: incomeCount.toString(),
      subtext: `${incomePct}% of total`,
      subtextColor: "text-green-600",
      icon: TrendingUp,
      color: "bg-emerald-500 shadow-emerald-150",
      iconColor: "text-white",
    },
    {
      title: "Expense Categories",
      value: expenseCount.toString(),
      subtext: `${expensePct}% of total`,
      subtextColor: "text-indigo-600",
      icon: TrendingDown,
      color: "bg-indigo-500 shadow-indigo-150",
      iconColor: "text-white",
    },
    {
      title: "Active Categories",
      value: activeCount.toString(),
      subtext: `${activePct}% of total`,
      subtextColor: "text-green-600",
      icon: CheckCircle,
      color: "bg-amber-500 shadow-amber-150",
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
