import React from 'react';
import { Key, Webhook, ClipboardList, Plus } from 'lucide-react';

const actions = [
  { icon: Key, title: "Manage API Keys" },
  { icon: Webhook, title: "Manage Webhooks" },
  { icon: ClipboardList, title: "View Integration Logs" },
  { icon: Plus, title: "Request an Integration" },
];

export default function IntegrationQuickActions() {
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
              <span className="text-[#5B3DF5]"><Icon size={14} /></span>
              {item.title}
            </button>
          );
        })}
      </div>
    </div>
  );
}
