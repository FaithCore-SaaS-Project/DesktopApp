import React from 'react';
import { Users, UserCheck, UserMinus, ShieldCheck, CalendarPlus } from 'lucide-react';

const stats = [
  { icon: Users, title: "Total Users", value: "86", sub: "All users", color: "text-[#5B3DF5]", bg: "bg-[#5B3DF5]/10" },
  { icon: UserCheck, title: "Active Users", value: "74", sub: "86.0% of total", color: "text-green-600", bg: "bg-green-50", subColor: "text-green-600" },
  { icon: UserMinus, title: "Inactive Users", value: "12", sub: "14.0% of total", color: "text-orange-500", bg: "bg-orange-50", subColor: "text-orange-500" },
  { icon: ShieldCheck, title: "Super Admins", value: "2", sub: "Full system access", color: "text-blue-600", bg: "bg-blue-50", subColor: "text-blue-600" },
  { icon: CalendarPlus, title: "New This Month", value: "5", sub: "Joined in May 2025", color: "text-cyan-500", bg: "bg-cyan-50", subColor: "text-cyan-500" }
];

export default function UserStatsCards() {
  return (
    <div className="grid grid-cols-5 gap-4 mb-6">
      {stats.map((item, index) => {
        const Icon = item.icon;
        return (
          <div key={index} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm h-[110px] flex gap-3">
            <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 shadow-sm ${item.bg}`}>
              <Icon size={18} className={item.color} />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-[11px] font-bold text-gray-500 mb-0.5 leading-none">{item.title}</p>
              <h4 className="text-[22px] font-black text-gray-900 leading-tight mb-1">{item.value}</h4>
              <p className={`text-[9px] font-bold ${item.subColor || 'text-gray-400'}`}>{item.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
