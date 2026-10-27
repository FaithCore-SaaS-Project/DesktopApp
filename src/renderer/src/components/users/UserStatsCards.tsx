import React from 'react';
import { Users, UserCheck, UserMinus, ShieldCheck, CalendarPlus } from 'lucide-react';

interface UserStatsCardsProps {
  users: any[];
}

export default function UserStatsCards({ users = [] }: UserStatsCardsProps) {
  const activeCount = users.filter(u => u.status).length;
  const inactiveCount = users.length - activeCount;
  const superAdminCount = users.filter(u => u.roles?.some((r: any) => r.name === 'Super Admin')).length;
  
  const stats = [
    { 
      icon: Users, 
      title: "Total Users", 
      value: users.length.toString(), 
      sub: "All Accounts", 
      color: "text-[#5B3DF5]", 
      bg: "bg-[#5B3DF5]/10",
      badgeStyle: "bg-indigo-50 text-[#5B3DF5] border border-indigo-150/60"
    },
    { 
      icon: UserCheck, 
      title: "Active Users", 
      value: activeCount.toString(), 
      sub: users.length > 0 ? `${Math.round((activeCount / users.length) * 100)}% Active` : '0% Active', 
      color: "text-emerald-600", 
      bg: "bg-emerald-50",
      badgeStyle: "bg-emerald-50 text-emerald-700 border border-emerald-150/60"
    },
    { 
      icon: UserMinus, 
      title: "Inactive Users", 
      value: inactiveCount.toString(), 
      sub: users.length > 0 ? `${Math.round((inactiveCount / users.length) * 100)}% Inactive` : '0% Inactive', 
      color: "text-amber-600", 
      bg: "bg-amber-50",
      badgeStyle: "bg-amber-50 text-amber-700 border border-amber-150/60"
    },
    { 
      icon: ShieldCheck, 
      title: "Super Admins", 
      value: superAdminCount.toString(), 
      sub: "Full Access", 
      color: "text-blue-600", 
      bg: "bg-blue-50",
      badgeStyle: "bg-blue-50 text-blue-700 border border-blue-150/60"
    },
    { 
      icon: CalendarPlus, 
      title: "New This Month", 
      value: "0", 
      sub: "Joined Recent", 
      color: "text-cyan-600", 
      bg: "bg-cyan-50",
      badgeStyle: "bg-cyan-50 text-cyan-700 border border-cyan-150/60"
    }
  ];

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
                {item.sub}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
