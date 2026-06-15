import React from 'react';
import { ShieldCheck, ChevronRight } from 'lucide-react';

export default function SecurityRecommendations() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
      <h2 className="text-lg font-black text-gray-900 mb-1">Security Recommendations</h2>
      <p className="text-gray-500 text-xs font-semibold mb-6">Follow these recommendations to keep your system secure.</p>
      
      <div className="border border-gray-100 rounded-xl p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors group">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
            <ShieldCheck size={20} className="text-green-600" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900 mb-0.5">Two-factor authentication is enabled</h4>
            <p className="text-[10px] font-semibold text-gray-500">Great! 2FA adds an extra layer of security to user accounts.</p>
          </div>
        </div>
        <ChevronRight size={16} className="text-gray-400 group-hover:text-[#5B3DF5] transition-colors" />
      </div>
    </div>
  );
}
