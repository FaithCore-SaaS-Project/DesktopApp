import React from 'react';
import { Users, UserCheck, Shield, Crown, KeyRound } from 'lucide-react';

const stats = [
  {
    title: 'Total Users',
    value: '86',
    subtitle: 'All Accounts',
    icon: Users,
    color: 'text-[#5B3DF5]',
    bg: 'bg-[#5B3DF5]/10',
    badgeStyle: 'bg-indigo-50 text-[#5B3DF5] border border-indigo-150/60'
  },
  {
    title: 'Active Users',
    value: '74',
    subtitle: '86.0% Active',
    icon: UserCheck,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    badgeStyle: 'bg-emerald-50 text-emerald-700 border border-emerald-150/60'
  },
  {
    title: 'Inactive Users',
    value: '12',
    subtitle: '14.0% Inactive',
    icon: Shield,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    badgeStyle: 'bg-amber-50 text-amber-700 border border-amber-150/60'
  },
  {
    title: 'Total Roles',
    value: '8',
    subtitle: 'All Roles',
    icon: Crown,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    badgeStyle: 'bg-purple-50 text-purple-700 border border-purple-150/60'
  },
  {
    title: 'Super Admins',
    value: '2',
    subtitle: 'Full Access',
    icon: KeyRound,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    badgeStyle: 'bg-blue-50 text-blue-700 border border-blue-150/60'
  },
];

export default function UsersStats() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3.5 mb-6">
      {stats.map((item, index) => {
        const Icon = item.icon;
        return (
          <div 
            key={index} 
            className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all duration-200 flex flex-col justify-between min-w-0 group"
          >
            {/* Top Row: Title + Icon Badge */}
            <div className="flex items-center justify-between gap-1.5 mb-2.5">
              <span 
                className="text-[11px] font-bold text-gray-500 uppercase tracking-wider truncate"
                title={item.title}
              >
                {item.title}
              </span>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${item.bg} ${item.color} shadow-xs transition-transform duration-200 group-hover:scale-105`}>
                <Icon size={16} strokeWidth={2.2} />
              </div>
            </div>

            {/* Middle Row: Large Bold Value */}
            <div className="my-1.5">
              <h4 className="text-2xl sm:text-[26px] font-black text-gray-900 leading-none tracking-tight">
                {item.value}
              </h4>
            </div>

            {/* Bottom Row: Status Badge */}
            <div className="pt-2 border-t border-gray-100 flex items-center">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-tight truncate ${item.badgeStyle}`}>
                {item.subtitle}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
