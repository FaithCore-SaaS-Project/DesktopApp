import React from 'react';
import { TrendingUp, TrendingDown, Wallet, Receipt } from "lucide-react";

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
  
  const formatLKR = (val: number) => {
    return "Rs. " + val.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const stats = [
    {
      title: "Total Income",
      value: formatLKR(totalIncome),
      textColor: "text-emerald-600",
      iconBg: "bg-emerald-500/10",
      icon: TrendingUp,
    },
    {
      title: "Total Expenses",
      value: formatLKR(totalExpenses),
      textColor: "text-rose-600",
      iconBg: "bg-rose-500/10",
      icon: TrendingDown,
    },
    {
      title: "Net Balance",
      value: formatLKR(netBalance),
      textColor: "text-blue-600",
      iconBg: "bg-blue-500/10",
      icon: Wallet,
    },
    {
      title: "Transactions Logged",
      value: transactionCount.toLocaleString(),
      textColor: "text-violet-600",
      iconBg: "bg-violet-500/10",
      icon: Receipt,
    },
  ];

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((item, i) => {
        const Icon = item.icon;
        return (
          <div
            key={i}
            className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm shadow-slate-100/50 hover:-translate-y-1 hover:shadow-md transition-all duration-300 relative overflow-hidden group"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  {item.title}
                </p>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight mt-3 leading-none">
                  {item.value}
                </h3>
              </div>
              <div
                className={`h-11 w-11 rounded-xl flex items-center justify-center ${item.iconBg} ${item.textColor} transition-all duration-300 group-hover:scale-105`}
              >
                <Icon size={20} />
              </div>
            </div>
            
            <div className="mt-5 flex items-center">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border border-slate-100 rounded-lg px-2 py-0.5 select-none">
                Overview Status
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
