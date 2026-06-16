import React from 'react';
import { Database, CheckCircle, HardDrive, Cloud } from 'lucide-react';

const stats = [
  { icon: Database, title: "Last Backup", value: "31 May 2025, 02:30 AM", sub: "(2 hours ago)", color: "text-[#5B3DF5]", bg: "bg-[#5B3DF5]/10", valColor: "text-gray-900" },
  { icon: CheckCircle, title: "Backup Status", value: "Successful", sub: "All data is secure", color: "text-green-600", bg: "bg-green-50", valColor: "text-green-600" },
  { icon: HardDrive, title: "Total Backups", value: "28", sub: "Including manual & auto", color: "text-blue-500", bg: "bg-blue-50", valColor: "text-gray-900" },
  { icon: Cloud, title: "Storage Used", value: "12.45 GB", sub: "of 100 GB (12.45%)", color: "text-orange-500", bg: "bg-orange-50", valColor: "text-gray-900" }
];

export default function BackupOverview() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
      <h2 className="text-lg font-black text-gray-900 mb-1">Backup Overview</h2>
      <p className="text-gray-500 text-xs font-semibold mb-6">Protect your church data by keeping regular backups.</p>
      
      <div className="grid grid-cols-4 gap-4 divide-x divide-gray-100">
        {stats.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className={`flex items-center gap-3 ${index === 0 ? '' : 'pl-4'}`}>
              <div className={`w-10 h-10 rounded-full ${item.bg} flex items-center justify-center shrink-0`}>
                <Icon size={18} className={item.color} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-500 mb-0.5">{item.title}</p>
                <h4 className={`text-sm font-black ${item.valColor} leading-none mb-1`}>{item.value}</h4>
                <p className="text-[9px] font-semibold text-gray-400">{item.sub}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
