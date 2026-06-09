import React from 'react';
import { Users, UserPlus, Home, Phone, MapPin } from "lucide-react";

interface FamilyStatsProps {
  totalFamilies: number;
  totalMembers: number;
  newFamilies: number;
  withoutAddress: number;
  withoutPhone: number;
  onViewFilter?: (type: 'all' | 'no-address' | 'no-phone') => void;
}

export default function FamilyStats({
  totalFamilies,
  totalMembers,
  newFamilies,
  withoutAddress,
  withoutPhone,
  onViewFilter
}: FamilyStatsProps) {
  
  const statsList = [
    {
      title: "Total Families",
      value: totalFamilies.toString(),
      growth: "+12 this month",
      icon: Users,
      color: "bg-purple-500 shadow-purple-150",
      isAction: false,
      filterType: 'all' as const
    },
    {
      title: "New Families",
      value: newFamilies.toString(),
      growth: "+7 this month",
      icon: UserPlus,
      color: "bg-emerald-500 shadow-emerald-150",
      isAction: false,
      filterType: 'all' as const
    },
    {
      title: "Total Members",
      value: totalMembers.toString(),
      growth: "+18 this month",
      icon: Home,
      color: "bg-indigo-500 shadow-indigo-150",
      isAction: false,
      filterType: 'all' as const
    },
    {
      title: "Without Address",
      value: withoutAddress.toString(),
      growth: "View List",
      icon: MapPin,
      color: "bg-amber-500 shadow-amber-150",
      isAction: true,
      filterType: 'no-address' as const
    },
    {
      title: "Without Phone",
      value: withoutPhone.toString(),
      growth: "View List",
      icon: Phone,
      color: "bg-rose-500 shadow-rose-150",
      isAction: true,
      filterType: 'no-phone' as const
    },
  ];

  return (
    <div className="mb-8 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
      {statsList.map((item, i) => {
        const Icon = item.icon;
        return (
          <div
            key={i}
            className="rounded-3xl border border-gray-150 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden"
          >
            <div className="flex flex-col h-full justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white ${item.color} shadow-lg transition-transform duration-300 group-hover:scale-105`}
                >
                  <Icon size={22} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 leading-tight">
                    {item.value}
                  </h2>
                  <p className="text-gray-400 text-xs font-bold mt-0.5 leading-none">
                    {item.title}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                {item.isAction && onViewFilter ? (
                  <button 
                    onClick={() => onViewFilter(item.filterType)}
                    className="text-xs font-extrabold text-[#5B3DF5] hover:underline transition-all cursor-pointer"
                  >
                    {item.growth} →
                  </button>
                ) : (
                  <span className="text-emerald-500 text-xs font-semibold">
                    {item.growth}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
