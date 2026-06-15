import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Users,
  Calendar
} from 'lucide-react';

interface ReportStatsProps {
  incomeAmount: number;
  expensesAmount: number;
  surplusAmount: number;
  membersCount: number;
  eventsCount: number;
}

export default function ReportStats({
  incomeAmount,
  expensesAmount,
  surplusAmount,
  membersCount,
  eventsCount
}: ReportStatsProps) {
  const stats = [
    {
      title: "Total Income (This Year)",
      value: `Rs. ${incomeAmount.toLocaleString()}`,
      subtext: "↑ 18.6% vs last year",
      subtextColor: "text-green-600",
      valueColor: "text-green-600",
      icon: TrendingUp,
      color: "bg-purple-600 shadow-purple-100",
      iconColor: "text-white",
    },
    {
      title: "Total Expenses (This Year)",
      value: `Rs. ${expensesAmount.toLocaleString()}`,
      subtext: "↑ 12.4% vs last year",
      subtextColor: "text-green-600",
      valueColor: "text-red-500",
      icon: TrendingDown,
      color: "bg-orange-500 shadow-orange-100",
      iconColor: "text-white",
    },
    {
      title: "Net Surplus (This Year)",
      value: `Rs. ${surplusAmount.toLocaleString()}`,
      subtext: "↑ 26.3% vs last year",
      subtextColor: "text-green-600",
      valueColor: "text-green-600",
      icon: Wallet,
      color: "bg-blue-500 shadow-blue-100",
      iconColor: "text-white",
    },
    {
      title: "Total Members",
      value: membersCount.toLocaleString(),
      subtext: "↑ 5.2% vs last year",
      subtextColor: "text-green-600",
      valueColor: "text-gray-900",
      icon: Users,
      color: "bg-cyan-500 shadow-cyan-100",
      iconColor: "text-white",
    },
    {
      title: "Total Events",
      value: eventsCount.toString(),
      subtext: "↑ 14.3% vs last month",
      subtextColor: "text-green-600",
      valueColor: "text-gray-900",
      icon: Calendar,
      color: "bg-purple-500 shadow-purple-100",
      iconColor: "text-white",
    },
  ];

  return (
    <div className="mb-8 grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-5">
      {stats.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className="rounded-3xl border border-gray-150 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden"
          >
            <div className="flex flex-col h-full justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.color} ${item.iconColor} shadow-lg transition-transform duration-300 group-hover:scale-105`}
                >
                  <Icon size={22} />
                </div>
                <div>
                  <h2 className={`text-xl font-black ${item.valueColor} leading-tight`}>
                    {item.value}
                  </h2>
                  <p className="text-gray-400 text-[10px] font-bold mt-0.5 leading-none">
                    {item.title}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                <span className={`text-[10px] font-bold ${item.subtextColor}`}>
                  {item.subtext}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
