import React from 'react';
import { Upload, RotateCcw, History, Download, Settings } from 'lucide-react';

const actions = [
  { icon: Upload, title: "Create Manual Backup", color: "text-[#5B3DF5]" },
  { icon: RotateCcw, title: "Restore from Backup", color: "text-[#5B3DF5]" },
  { icon: History, title: "View Backup History", color: "text-[#5B3DF5]" },
  { icon: Download, title: "Download Backup", color: "text-[#5B3DF5]" },
  { icon: Settings, title: "Backup Settings", color: "text-[#5B3DF5]" }
];

export default function BackupQuickActions() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
      <h3 className="text-sm font-black text-gray-900 mb-4">Quick Actions</h3>
      <div className="space-y-2">
        {actions.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              className="w-full flex items-center gap-3 py-2.5 px-4 border border-gray-100 rounded-xl text-xs font-bold text-gray-600 hover:text-[#5B3DF5] hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
            >
              <span className={item.color}><Icon size={14} /></span>
              {item.title}
            </button>
          );
        })}
      </div>
    </div>
  );
}
