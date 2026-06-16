import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function SystemStatus() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
      <h3 className="text-sm font-black text-gray-900 mb-4">System Status</h3>
      <div className="flex gap-3 items-start">
        <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold text-green-600 mb-1">All Systems Operational</h4>
          <p className="text-[10px] font-semibold text-gray-500 mb-2">All services are running normally.</p>
          <p className="text-[9px] font-bold text-gray-400">Last checked: Today, 09:15 AM</p>
        </div>
      </div>
      <button className="text-[#5B3DF5] text-[11px] font-bold mt-4 flex items-center gap-1 hover:text-[#4a30db] transition-colors cursor-pointer">
        View Status Page <span className="font-sans">→</span>
      </button>
    </div>
  );
}
