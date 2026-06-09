import React from 'react';
import {
  Wallet,
  Receipt,
  Calculator,
  FolderOpen,
  TrendingUp,
  TrendingDown
} from "lucide-react";

interface ExpenseStatsProps {
  totalExpenses: number;
  totalTransactionsCount: number;
  avgExpensePerDay: number;
  topCategoryName: string;
  topCategoryPct: number;
}

export default function ExpenseStats({
  totalExpenses,
  totalTransactionsCount,
  avgExpensePerDay,
  topCategoryName,
  topCategoryPct
}: ExpenseStatsProps) {
  
  const formatLKR = (val: number) => {
    return "Rs. " + val.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const stats = [
    {
      title: "Total Expenses",
      value: formatLKR(totalExpenses),
      subtext: "+7.3% from last month",
      isTrend: true,
      trendType: 'up-bad', // Up in expenses is usually negative
      icon: Wallet,
      color: "text-rose-600 bg-rose-50 border border-rose-100/50"
    },
    {
      title: "Total Transactions",
      value: totalTransactionsCount.toString(),
      subtext: "+14 from last month",
      isTrend: true,
      trendType: 'up-good',
      icon: Receipt,
      color: "text-blue-600 bg-blue-50 border border-blue-100/50"
    },
    {
      title: "Avg Expense / Day",
      value: formatLKR(avgExpensePerDay),
      subtext: "This month",
      isTrend: false,
      icon: Calculator,
      color: "text-purple-600 bg-purple-50 border border-purple-100/50"
    },
    {
      title: "Top Category",
      value: topCategoryName,
      subtext: `${topCategoryPct}% of total expenses`,
      isTrend: false,
      icon: FolderOpen,
      color: "text-amber-650 bg-amber-50 border border-amber-100/50"
    },
  ];

  return (
    <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className="rounded-3xl border border-gray-150 bg-white p-6 shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${item.color}`}
              >
                <Icon size={22} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider truncate">
                  {item.title}
                </p>
                <h3 className="mt-1 text-lg font-black text-gray-800 tracking-tight leading-none truncate">
                  {item.value}
                </h3>
              </div>
            </div>
            
            {/* Meta trends or ratios */}
            <div className="mt-4 pt-3 border-t border-gray-50 flex items-center gap-1">
              {item.isTrend ? (
                <>
                  {item.trendType === 'up-bad' ? (
                    <TrendingUp size={14} className="text-rose-500" />
                  ) : (
                    <TrendingUp size={14} className="text-emerald-500" />
                  )}
                  <span className={`text-[10px] font-extrabold ${
                    item.trendType === 'up-bad' ? 'text-rose-600' : 'text-emerald-600'
                  }`}>
                    {item.subtext}
                  </span>
                </>
              ) : (
                <span className="text-[10px] font-bold text-gray-400">
                  {item.subtext}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
