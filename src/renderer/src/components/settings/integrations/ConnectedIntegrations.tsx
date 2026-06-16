import React from 'react';
import { MoreVertical } from 'lucide-react';

const integrations = [
  { name: "QuickBooks Online", time: "Today, 09:15 AM", color: "bg-green-500", text: "qb" },
  { name: "SendGrid", time: "Today, 08:40 AM", color: "bg-blue-400", text: "S" },
  { name: "Google Calendar", time: "Today, 07:30 AM", color: "bg-white border border-gray-200", text: "31" },
  { name: "Stripe", time: "Today, 06:22 AM", color: "bg-indigo-600", text: "S" },
];

export default function ConnectedIntegrations() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-black text-gray-900">Connected Integrations</h3>
        <button className="text-[#5B3DF5] text-xs font-bold hover:text-[#4a30db] transition-colors cursor-pointer">View All</button>
      </div>
      
      <div className="space-y-0">
        {integrations.map((item, index) => (
          <div key={index} className="flex justify-between items-start py-4 border-b border-gray-50 last:border-0 last:pb-0">
            <div className="flex gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-[10px] shrink-0 mt-0.5 shadow-sm ${item.color}`}>
                {item.name === "Google Calendar" ? <span className="text-gray-800">{item.text}</span> : item.text}
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900 leading-none">{item.name}</h4>
                <div className="flex items-center gap-1.5 mt-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  <span className="text-green-600 text-[10px] font-bold">Connected</span>
                </div>
                <p className="text-[9px] font-semibold text-gray-400 mt-1">Last sync: {item.time}</p>
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
              <MoreVertical size={14} />
            </button>
          </div>
        ))}
      </div>
      
      <button className="text-[#5B3DF5] text-xs font-bold mt-5 flex items-center gap-1 hover:text-[#4a30db] transition-colors cursor-pointer">
        View all connected integrations <span className="font-sans">→</span>
      </button>
    </div>
  );
}
