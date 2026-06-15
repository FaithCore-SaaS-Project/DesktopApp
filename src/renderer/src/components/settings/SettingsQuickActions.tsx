import React from 'react';
import { Settings, Mail, CreditCard, Trash2, ClipboardList, Activity } from 'lucide-react';

const actions = [
  { title: 'Update System Settings', icon: <Settings size={14} /> },
  { title: 'Manage Email Templates', icon: <Mail size={14} /> },
  { title: 'Configure Payment Methods', icon: <CreditCard size={14} /> },
  { title: 'Clear System Cache', icon: <Trash2 size={14} /> },
  { title: 'View Audit Logs', icon: <ClipboardList size={14} /> },
  { title: 'System Status', icon: <Activity size={14} /> }
];

export default function SettingsQuickActions() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 mt-6 shadow-sm">
      <h3 className="text-sm font-black text-gray-900 mb-4">Quick Actions</h3>
      <div className="space-y-2">
        {actions.map((item, index) => (
          <button
            key={index}
            className="w-full flex items-center gap-3 py-2.5 px-4 border border-gray-100 rounded-xl text-xs font-bold text-gray-600 hover:text-[#5B3DF5] hover:bg-gray-50 transition-colors shadow-sm"
          >
            <span className="text-[#5B3DF5]">{item.icon}</span>
            {item.title}
          </button>
        ))}
      </div>
    </div>
  );
}
