import React from 'react';
import { ShieldCheck, Lock, Users, MonitorSmartphone } from 'lucide-react';

const cards = [
  { icon: ShieldCheck, title: "Security Status", value: "Good", sub: "All security measures are active.", iconColor: "text-[#5B3DF5]", bgColor: "bg-[#5B3DF5]/10", valColor: "text-green-600" },
  { icon: Lock, title: "Two-Factor Auth", value: "Enabled", sub: "2FA is required for all users.", iconColor: "text-blue-600", bgColor: "bg-blue-50", valColor: "text-green-600" },
  { icon: Users, title: "Active Sessions", value: "18", sub: "Across all users", iconColor: "text-green-600", bgColor: "bg-green-50", valColor: "text-gray-900" },
  { icon: MonitorSmartphone, title: "Trusted Devices", value: "24", sub: "Devices remembered", iconColor: "text-orange-500", bgColor: "bg-orange-50", valColor: "text-gray-900" }
];

export default function SecurityOverview() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
      <h2 className="text-lg font-black text-gray-900 mb-1">Security Overview</h2>
      <p className="text-gray-500 text-xs font-semibold mb-6">Monitor your system security status and key information.</p>
      
      <div className="grid grid-cols-4 gap-4">
        {cards.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow flex items-start gap-4">
              <div className={`w-10 h-10 rounded-full ${item.bgColor} flex items-center justify-center shrink-0`}>
                <Icon size={20} className={item.iconColor} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-500 mb-1">{item.title}</p>
                <h3 className={`text-sm font-black ${item.valColor}`}>{item.value}</h3>
                <p className="text-[10px] font-semibold text-gray-400 mt-1">{item.sub}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
