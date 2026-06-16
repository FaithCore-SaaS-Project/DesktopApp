import React from 'react';
import { Info } from 'lucide-react';

export default function CustomIntegrationCard() {
  return (
    <div className="bg-[#5B3DF5]/5 border border-[#5B3DF5]/10 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
      <div className="flex gap-4 items-start">
        <div className="w-8 h-8 rounded-full bg-[#5B3DF5] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm shadow-[#5B3DF5]/30">
          <Info size={16} />
        </div>
        <div>
          <h3 className="text-sm font-black text-gray-900 mb-1">Need a custom integration?</h3>
          <p className="text-[11px] font-semibold text-gray-500">
            We can help you build a custom integration tailored to your ministry's needs.
          </p>
        </div>
      </div>
      <button className="bg-white border border-gray-200 px-5 py-2.5 rounded-xl text-xs font-bold text-[#5B3DF5] hover:bg-gray-50 transition-colors cursor-pointer shrink-0 shadow-sm flex items-center gap-1">
        Contact Support <span className="font-sans">→</span>
      </button>
    </div>
  );
}
