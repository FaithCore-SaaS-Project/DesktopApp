import React from 'react';
import {
  Wallet,
  Receipt,
  Calculator,
  FolderOpen,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { formatCurrency, formatNumber } from '../../../lib/format';

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
  const stats = [
    {
      title: "Total Expenses",
      value: formatCurrency(totalExpenses),
      subtext: "+7.3% from last month",
      isTrend: true,
      trendType: 'up-bad', // Up in expenses is usually negative
      icon: Wallet,
      color: "text-rose-600 bg-rose-50 border border-rose-100/50"
    },
    {
      title: "Total Transactions",
      value: formatNumber(totalTransactionsCount),
      subtext: "+14 from last month",
      isTrend: true,
      trendType: 'up-good',
      icon: Receipt,
      color: "text-blue-600 bg-blue-50 border border-blue-100/50"
    },
    {
      title: "Avg Expense / Day",
      value: formatCurrency(avgExpensePerDay),
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
    <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
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
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.color} transition-transform duration-200 group-hover:scale-110`}
              >
                <Icon size={16} strokeWidth={2.2} />
              </div>
            </div>

            <div className="mt-3">
              <h3
                className="text-base sm:text-lg xl:text-xl font-bold text-slate-800 tracking-tight whitespace-nowrap leading-none"
                title={item.value}
              >
                {item.value}
              </h3>
            </div>
            
            {/* Meta trends or ratios */}
            <div className="mt-4 pt-2.5 border-t border-slate-100/80 flex items-center gap-1.5">
              {item.isTrend ? (
                <>
                  {item.trendType === 'up-bad' ? (
                    <TrendingDown size={13} className="text-rose-500 shrink-0" />
                  ) : (
                    <TrendingUp size={13} className="text-emerald-500 shrink-0" />
                  )}
                  <span className={`text-[10px] font-bold truncate ${
                    item.trendType === 'up-bad' ? 'text-rose-600' : 'text-emerald-600'
                  }`}>
                    {item.subtext}
                  </span>
                </>
              ) : (
                <span className="text-[10px] font-semibold text-slate-400 truncate">
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
