import React from 'react';
import {
  Wallet,
  HandCoins,
  Gift,
  CircleDollarSign,
  MoreHorizontal,
  TrendingUp
} from "lucide-react";
import { formatCurrency } from '../../../lib/format';

interface IncomeStatsProps {
  totalIncome: number;
  tithes: number;
  offerings: number;
  donations: number;
  others: number;
}

export default function IncomeStats({
  totalIncome,
  tithes,
  offerings,
  donations,
  others
}: IncomeStatsProps) {
  const calculatePct = (val: number) => {
    if (totalIncome === 0) return "0%";
    return Math.round((val / totalIncome) * 100) + "% of total";
  };

  const stats = [
    {
      title: "Total Income",
      value: formatCurrency(totalIncome),
      subtext: "+18.6% from last month",
      isTrend: true,
      icon: Wallet,
      color: "text-emerald-600 bg-emerald-50 border border-emerald-100/50"
    },
    {
      title: "Tithes",
      value: formatCurrency(tithes),
      subtext: calculatePct(tithes),
      isTrend: false,
      icon: HandCoins,
      color: "text-teal-600 bg-teal-50 border border-teal-100/50"
    },
    {
      title: "Offerings",
      value: formatCurrency(offerings),
      subtext: calculatePct(offerings),
      isTrend: false,
      icon: Gift,
      color: "text-blue-600 bg-blue-50 border border-blue-100/50"
    },
    {
      title: "Donations",
      value: formatCurrency(donations),
      subtext: calculatePct(donations),
      isTrend: false,
      icon: CircleDollarSign,
      color: "text-amber-600 bg-amber-50 border border-amber-100/50"
    },
    {
      title: "Other Income",
      value: formatCurrency(others),
      subtext: calculatePct(others),
      isTrend: false,
      icon: MoreHorizontal,
      color: "text-purple-600 bg-purple-50 border border-purple-100/50"
    }
  ];

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
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
                  <TrendingUp size={13} className="text-emerald-500 shrink-0" />
                  <span className="text-[10px] font-bold text-emerald-600 truncate">
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
