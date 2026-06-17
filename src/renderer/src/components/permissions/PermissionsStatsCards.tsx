import React from 'react';
import { Shield, ShieldCheck, Grid, Users, Clock } from 'lucide-react';

const stats = [
  { icon: Shield, title: "Total Permissions", value: "186", sub: "All permissions", color: "text-[#5B3DF5]", bg: "bg-[#5B3DF5]/10" },
  { icon: ShieldCheck, title: "System Permissions", value: "102", sub: "54.8% of total", color: "text-green-600", bg: "bg-green-50", subColor: "text-green-600" },
  { icon: Grid, title: "Module Permissions", value: "72", sub: "38.7% of total", color: "text-orange-500", bg: "bg-orange-50", subColor: "text-orange-500" },
  { icon: Users, title: "Role Assignments", value: "68", sub: "Across 8 roles", color: "text-blue-600", bg: "bg-blue-50", subColor: "text-blue-600" },
  { icon: Clock, title: "Last Updated", value: "Today, 09:15 AM", sub: "By Super Admin", color: "text-teal-600", bg: "bg-teal-50" }
];

export default function PermissionsStatsCards() {
  return (
    <div className="grid grid-cols-5 gap-4 mb-6">
      {stats.map((item, index) => {
        const Icon = item.icon;
        return (
          <div key={index} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm h-[110px] flex gap-3">
            <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 shadow-sm ${item.bg}`}>
              <Icon size={18} className={item.color} />
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <p className="text-[11px] font-bold text-gray-500 mb-0.5 leading-none truncate">{item.title}</p>
              <h4 className="text-[20px] font-black text-gray-900 leading-tight mb-1 truncate">{item.value}</h4>
              <p className={`text-[9px] font-bold truncate ${item.subColor || 'text-gray-400'}`}>{item.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
