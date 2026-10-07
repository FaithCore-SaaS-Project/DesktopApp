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
      textColor: "text-violet-600",
      iconBg: "bg-violet-500/10",
    },
    {
      icon: Home,
      title: "Families",
      value: families.toLocaleString(),
      growth: "Registered Units",
      textColor: "text-cyan-600",
      iconBg: "bg-cyan-500/10",
    },
    {
      icon: TrendingUp,
      title: "Monthly Income",
      value: `Rs. ${monthlyIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      growth: "This Month",
      textColor: "text-emerald-600",
      iconBg: "bg-emerald-500/10",
    },
    {
      icon: TrendingDown,
      title: "Monthly Expense",
      value: `Rs. ${monthlyExpense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      growth: "This Month",
      textColor: "text-orange-600",
      iconBg: "bg-orange-500/10",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm shadow-slate-100/50 hover:-translate-y-1 hover:shadow-md transition-all duration-300 relative overflow-hidden group"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  {card.title}
                </p>
                <h3 className="text-2xl font-bold text-slate-800 tracking-tight mt-2 leading-none truncate max-w-[140px] xl:max-w-[180px]" title={card.value}>
                  {card.value}
                </h3>
              </div>
              <div
                className={`h-11 w-11 rounded-xl flex items-center justify-center ${card.iconBg} ${card.textColor} transition-all duration-300 group-hover:scale-105`}
              >
                <Icon size={20} />
              </div>
            </div>
            
            <div className="mt-5 flex items-center">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border border-slate-100 rounded-lg px-2 py-0.5 select-none">
                {card.growth}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
