import React from 'react';
import {
  Users,
  Home,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

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
      value: totalMembers.toLocaleString(),
      growth: "Active Roster",
      color: "bg-purple-500",
      textColor: "text-purple-600",
      iconBg: "bg-purple-50",
    },
    {
      icon: Home,
      title: "Families",
      value: families.toLocaleString(),
      growth: "Registered Units",
      color: "bg-cyan-500",
      textColor: "text-cyan-600",
      iconBg: "bg-cyan-50",
    },
    {
      icon: TrendingUp,
      title: "Monthly Income",
      value: `$${monthlyIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      growth: "This Month",
      color: "bg-emerald-500",
      textColor: "text-emerald-600",
      iconBg: "bg-emerald-50",
    },
    {
      icon: TrendingDown,
      title: "Monthly Expense",
      value: `$${monthlyExpense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      growth: "This Month",
      color: "bg-orange-500",
      textColor: "text-orange-600",
      iconBg: "bg-orange-50",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-3xl p-6 border border-gray-150 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group"
          >
            <div className="flex items-center gap-5">
              <div
                className={`h-16 w-16 rounded-2xl flex items-center justify-center text-white ${card.color} shadow-lg shadow-gray-100 transition-transform duration-300 group-hover:scale-105`}
              >
                <Icon size={28} />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900 tracking-tight leading-none mb-1.5">
                  {card.value}
                </h3>
                <p className="text-gray-500 text-sm font-medium">
                  {card.title}
                </p>
                <p className="text-slate-500 text-xs font-semibold mt-1">
                  {card.growth}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
