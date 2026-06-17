import React from 'react';
import { Users, DollarSign, Calendar, BarChart3, ShieldCheck, FolderOpen, Settings, LayoutGrid } from 'lucide-react';

const modules = [
  { name: "Members", count: 45, width: "100%", icon: Users, color: "text-purple-600", bg: "bg-[#5B3DF5]" },
  { name: "Finance", count: 33, width: "74%", icon: DollarSign, color: "text-green-600", bg: "bg-teal-500" },
  { name: "Events", count: 22, width: "49%", icon: Calendar, color: "text-red-500", bg: "bg-orange-500" },
  { name: "Reports", count: 18, width: "40%", icon: BarChart3, color: "text-blue-500", bg: "bg-green-500" },
  { name: "Users & Roles", count: 16, width: "36%", icon: ShieldCheck, color: "text-[#5B3DF5]", bg: "bg-blue-600" },
  { name: "Documents", count: 12, width: "27%", icon: FolderOpen, color: "text-cyan-500", bg: "bg-blue-400" },
  { name: "Settings", count: 11, width: "24%", icon: Settings, color: "text-slate-500", bg: "bg-blue-300" },
  { name: "Others", count: 12, width: "27%", icon: LayoutGrid, color: "text-gray-400", bg: "bg-indigo-300" }
];

export default function PermissionsByModuleCard() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-sm font-black text-gray-900">Permissions by Module</h3>
        <button className="text-[#5B3DF5] text-[11px] font-bold hover:text-[#4a30db] transition-colors cursor-pointer">View All</button>
      </div>
      <div className="space-y-4">
        {modules.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index}>
              <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center bg-gray-50 border border-gray-100`}>
                    <Icon size={10} className={item.color} />
                  </div>
                  <span className="text-[11px] font-bold text-gray-700">{item.name}</span>
                </div>
                <span className="text-[11px] font-black text-[#5B3DF5]">{item.count}</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden ml-7">
                <div className={`h-full ${item.bg} rounded-full`} style={{ width: item.width }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
