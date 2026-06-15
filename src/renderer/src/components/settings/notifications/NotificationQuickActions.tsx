import React from 'react';
import { Mail, MessageSquare, ClipboardList, Send } from 'lucide-react';

const actions = [
  { icon: <Mail size={14} />, title: "Manage Email Templates" },
  { icon: <MessageSquare size={14} />, title: "Manage SMS Templates" },
  { icon: <ClipboardList size={14} />, title: "Notification Logs" },
  { icon: <Mail size={14} />, title: "Test Email Notification" },
  { icon: <Send size={14} />, title: "Test SMS Notification" }
];

export default function NotificationQuickActions() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 mt-6 shadow-sm">
      <h3 className="text-sm font-black text-gray-900 mb-4">Quick Actions</h3>
      <div className="space-y-2">
        {actions.map((item, index) => (
          <button
            key={index}
            className="w-full flex items-center gap-3 py-2.5 px-4 border border-gray-100 rounded-xl text-xs font-bold text-gray-600 hover:text-[#5B3DF5] hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
          >
            <span className="text-[#5B3DF5]">{item.icon}</span>
            {item.title}
          </button>
        ))}
      </div>
    </div>
  );
}
