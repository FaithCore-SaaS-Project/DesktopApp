import React from 'react';
import { Plus, ShieldCheck, ClipboardList, FileText } from 'lucide-react';

const actions = [
  { icon: Plus, title: "Create New Permission", color: "text-[#5B3DF5]" },
  { icon: ShieldCheck, title: "Assign Permissions to Role", color: "text-[#5B3DF5]" },
  { icon: ClipboardList, title: "Permission Audit Log", color: "text-[#5B3DF5]" },
  { icon: FileText, title: "Permission Reports", color: "text-[#5B3DF5]" }
];

export default function PermissionQuickActions() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
      <h3 className="text-sm font-black text-gray-900 mb-4">Quick Actions</h3>
      <div className="space-y-2.5">
        {actions.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              className="w-full flex items-center gap-3 h-10 px-4 bg-white border border-gray-100 rounded-xl text-[12px] font-bold text-gray-700 hover:text-[#5B3DF5] hover:border-[#5B3DF5]/30 hover:bg-[#5B3DF5]/5 transition-colors shadow-sm cursor-pointer"
            >
              <Icon size={14} className={item.color} />
              <span>{item.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
