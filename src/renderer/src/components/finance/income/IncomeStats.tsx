import React from 'react';
import {
  Wallet,
  HandCoins,
  Gift,
  CircleDollarSign,
  MoreHorizontal,
  TrendingUp
} from "lucide-react";

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
  
  const formatLKR = (val: number) => {
    return "Rs. " + val.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const calculatePct = (val: number) => {
    if (totalIncome === 0) return "0%";
    return Math.round((val / totalIncome) * 100) + "% of total income";
  };

  const stats = [
    {
      title: "Total Income",
      value: formatLKR(totalIncome),
      subtext: "+18.6% from last month",
      isTrend: true,
      icon: Wallet,
      color: "text-emerald-600 bg-emerald-50 border border-emerald-100/50"
    },
    {
      title: "Tithes",
      value: formatLKR(tithes),
      subtext: calculatePct(tithes),
      isTrend: false,
      icon: HandCoins,
      color: "text-teal-600 bg-teal-50 border border-teal-100/50"
    },
    {
      title: "Offerings",
      value: formatLKR(offerings),
      subtext: calculatePct(offerings),
      isTrend: false,
      icon: Gift,
      color: "text-blue-600 bg-blue-50 border border-blue-100/50"
    },
    {
      title: "Donations",
      value: formatLKR(donations),
      subtext: calculatePct(donations),
      isTrend: false,
      icon: CircleDollarSign,
      color: "text-amber-600 bg-amber-50 border border-amber-100/50"
    },
    {
      title: "Other Income",
      value: formatLKR(others),
      subtext: calculatePct(others),
      isTrend: false,
      icon: MoreHorizontal,
      color: "text-purple-600 bg-purple-50 border border-purple-100/50"
    }
  ];

  return (
    <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
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
                  <TrendingUp size={14} className="text-emerald-500" />
                  <span className="text-[10px] font-extrabold text-emerald-600">
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
