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
      color: "bg-emerald-500 shadow-emerald-150",
      textColor: "text-emerald-500",
      icon: TrendingUp,
    },
    {
      title: "Total Expenses",
      value: formatLKR(totalExpenses),
      color: "bg-rose-500 shadow-rose-150",
      textColor: "text-rose-500",
      icon: TrendingDown,
    },
    {
      title: "Net Balance",
      value: formatLKR(netBalance),
      color: "bg-blue-500 shadow-blue-150",
      textColor: "text-blue-500",
      icon: Wallet,
    },
    {
      title: "Transactions Logged",
      value: transactionCount.toString(),
      color: "bg-purple-500 shadow-purple-150",
      textColor: "text-purple-500",
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
            className="rounded-3xl border border-gray-150 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 group"
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white ${item.color} shadow-lg transition-transform duration-300 group-hover:scale-105`}
              >
                <Icon size={22} />
              </div>
              <div>
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                  {item.title}
                </h3>
                <h2 className="mt-1.5 text-2xl font-black text-gray-900 leading-tight">
                  {item.value}
                </h2>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
