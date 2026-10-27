import React from 'react';
import { Users, UserPlus, Home, Phone, MapPin, ArrowUpRight, ChevronRight } from "lucide-react";

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
      subLabel: "All Households",
      icon: Users,
      color: "text-[#5B3DF5]",
      bg: "bg-[#5B3DF5]/10",
      borderHover: "hover:border-[#5B3DF5]/40",
      badgeStyle: "bg-emerald-50 text-emerald-700 border border-emerald-150/60",
      isAction: false,
      filterType: 'all' as const
    },
    {
      title: "New Families",
      value: newFamilies.toString(),
      growth: "+7 this month",
      subLabel: "Recent Additions",
      icon: UserPlus,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      borderHover: "hover:border-emerald-300",
      badgeStyle: "bg-emerald-50 text-emerald-700 border border-emerald-150/60",
      isAction: false,
      filterType: 'all' as const
    },
    {
      title: "Total Members",
      value: totalMembers.toString(),
      growth: "+18 this month",
      subLabel: "All Individuals",
      icon: Home,
      color: "text-blue-600",
      bg: "bg-blue-50",
      borderHover: "hover:border-blue-300",
      badgeStyle: "bg-blue-50 text-blue-700 border border-blue-150/60",
      isAction: false,
      filterType: 'all' as const
    },
    {
      title: "Without Address",
      value: withoutAddress.toString(),
      growth: "View List",
      subLabel: withoutAddress > 0 ? "Needs Address" : "All Updated",
      icon: MapPin,
      color: "text-amber-600",
      bg: "bg-amber-50",
      borderHover: "hover:border-amber-300",
      badgeStyle: withoutAddress > 0 ? "bg-amber-50 text-amber-700 border border-amber-150/60" : "bg-slate-50 text-slate-500 border border-slate-200/60",
      isAction: true,
      filterType: 'no-address' as const
    },
    {
      title: "Without Phone",
      value: withoutPhone.toString(),
      growth: "View List",
      subLabel: withoutPhone > 0 ? "Needs Contact" : "All Updated",
      icon: Phone,
      color: "text-rose-600",
      bg: "bg-rose-50",
      borderHover: "hover:border-rose-300",
      badgeStyle: withoutPhone > 0 ? "bg-rose-50 text-rose-700 border border-rose-150/60" : "bg-slate-50 text-slate-500 border border-slate-200/60",
      isAction: true,
      filterType: 'no-phone' as const
    },
  ];

  return (
    <div className="mb-8 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3.5 sm:gap-4">
      {statsList.map((item, i) => {
        const Icon = item.icon;
        return (
          <div
            key={i}
            onClick={() => item.isAction && onViewFilter ? onViewFilter(item.filterType) : undefined}
            className={`rounded-2xl border border-gray-200/90 bg-white p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group min-w-0 relative ${
              item.isAction ? 'cursor-pointer hover:-translate-y-0.5 ' + item.borderHover : 'hover:border-gray-300'
            }`}
          >
            {/* Top Row: Title + Icon Badge */}
            <div className="flex items-center justify-between gap-1.5 mb-2.5">
              <span 
                className="text-[11px] font-bold text-gray-500 uppercase tracking-wider truncate"
                title={item.title}
              >
                {item.title}
              </span>
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${item.bg} ${item.color} shadow-xs transition-transform duration-200 group-hover:scale-105`}
              >
                <Icon size={16} strokeWidth={2.2} />
              </div>
            </div>

            {/* Middle Row: Large Bold Value */}
            <div className="my-1.5">
              <h2 className="text-2xl sm:text-[28px] font-black text-gray-900 leading-none tracking-tight">
                {item.value}
              </h2>
            </div>

            {/* Bottom Row: Badge / Action Link */}
            <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between min-w-0">
              {item.isAction ? (
                <>
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold truncate ${item.badgeStyle}`}>
                    {item.subLabel}
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-xs font-bold text-[#5B3DF5] group-hover:text-[#4526d1] transition-colors ml-1 shrink-0">
                    View List <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </>
              ) : (
                <>
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold truncate ${item.badgeStyle}`}>
                    <ArrowUpRight size={11} strokeWidth={2.5} className="shrink-0" />
                    {item.growth}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium truncate ml-1 shrink-0 hidden sm:inline">
                    Updated live
                  </span>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
