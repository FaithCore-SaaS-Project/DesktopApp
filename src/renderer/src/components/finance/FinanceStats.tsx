import React from 'react';
import { TrendingUp, TrendingDown, Wallet, Receipt } from "lucide-react";
import { formatCurrency, formatNumber } from '../../lib/format';

interface FinanceStatsProps {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  transactionCount: number;
}

export default function FinanceStats({
  totalIncome,
  totalExpenses,
  netBalance,
  transactionCount
}: FinanceStatsProps) {
  const stats = [
    {
      title: "Total Income",
      value: formatCurrency(totalIncome),
      textColor: "text-emerald-600",
      iconBg: "bg-emerald-500/10",
      icon: TrendingUp,
    },
    {
      title: "Total Expenses",
      value: formatCurrency(totalExpenses),
      textColor: "text-rose-600",
      iconBg: "bg-rose-500/10",
      icon: TrendingDown,
    },
    {
      title: "Net Balance",
      value: formatCurrency(netBalance),
      textColor: "text-blue-600",
      iconBg: "bg-blue-500/10",
      icon: Wallet,
    },
    {
      title: "Transactions Logged",
      value: formatNumber(transactionCount),
      textColor: "text-violet-600",
      iconBg: "bg-violet-500/10",
      icon: Receipt,
    },
  ];

  return (
    <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((item, i) => {
        const Icon = item.icon;
        return (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider truncate">
                {item.title}
              </span>
              <div
                className={`h-8 w-8 rounded-lg flex items-center justify-center ${item.iconBg} ${item.textColor} shrink-0 transition-transform duration-200 group-hover:scale-110`}
              >
                <Icon size={16} strokeWidth={2.2} />
              </div>
            </div>

            <div className="mt-3">
              <h3
                className="text-lg xl:text-xl font-bold text-slate-800 tracking-tight whitespace-nowrap leading-none"
                title={item.value}
              >
                {item.value}
              </h3>
            </div>
            
            <div className="mt-4 pt-2.5 border-t border-slate-100/80 flex items-center justify-between">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-50 border border-slate-200/60 rounded px-1.5 py-0.5 select-none">
                Overview Status
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Updated live</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
