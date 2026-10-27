import React from 'react';
import {
  Users,
  Home,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { formatCurrency, formatNumber } from '../../lib/format';

interface StatsCardsProps {
  totalMembers?: number;
  families?: number;
  monthlyIncome?: number;
  monthlyExpense?: number;
}

export default function StatsCards({
  totalMembers = 0,
  families = 0,
  monthlyIncome = 0,
  monthlyExpense = 0
}: StatsCardsProps) {
  const cards = [
    {
      icon: Users,
      title: "Total Members",
      value: formatNumber(totalMembers),
      badge: "Active Roster",
      badgeColor: "text-blue-700 bg-blue-50 border-blue-200/60",
      iconColor: "text-blue-600 bg-blue-50",
    },
    {
      icon: Home,
      title: "Registered Families",
      value: formatNumber(families),
      badge: "Family Units",
      badgeColor: "text-violet-700 bg-violet-50 border-violet-200/60",
      iconColor: "text-violet-600 bg-violet-50",
    },
    {
      icon: TrendingUp,
      title: "Monthly Income",
      value: formatCurrency(monthlyIncome),
      badge: "This Month",
      badgeColor: "text-emerald-700 bg-emerald-50 border-emerald-200/60",
      iconColor: "text-emerald-600 bg-emerald-50",
      trendIcon: ArrowUpRight,
      trendColor: "text-emerald-600",
    },
    {
      icon: TrendingDown,
      title: "Monthly Expense",
      value: formatCurrency(monthlyExpense),
      badge: "This Month",
      badgeColor: "text-slate-700 bg-slate-50 border-slate-200/60",
      iconColor: "text-rose-600 bg-rose-50",
      trendIcon: ArrowDownRight,
      trendColor: "text-rose-500",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const TrendIcon = card.trendIcon;
        return (
          <div
            key={index}
            className="bg-white rounded-lg p-4 border border-slate-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:border-slate-300 transition-all duration-150 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                {card.title}
              </span>
              <div
                className={`h-7 w-7 rounded-md flex items-center justify-center ${card.iconColor} shrink-0`}
              >
                <Icon size={15} strokeWidth={2} />
              </div>
            </div>

            <div className="mt-3">
              <div className="flex items-baseline gap-1.5">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-none" title={card.value}>
                  {card.value}
                </h3>
                {TrendIcon && (
                  <TrendIcon size={14} className={`${card.trendColor} shrink-0`} />
                )}
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border ${card.badgeColor}`}>
                {card.badge}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Updated live</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
