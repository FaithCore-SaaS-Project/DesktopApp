import React from 'react';
import { ArrowRight, Headphones } from 'lucide-react';

export default function SettingsHelpCard() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 mt-6 shadow-sm">
      <h3 className="text-sm font-black text-gray-900 mb-3">Need Help?</h3>
      <p className="text-gray-500 text-xs font-semibold leading-relaxed mb-5">
        Visit our Help Center for guides and articles or contact our support team.
      </p>
      <div className="space-y-3">
        <button className="w-full py-2.5 px-4 border border-gray-200 text-gray-700 rounded-xl flex items-center justify-center gap-2 text-xs font-bold hover:bg-gray-50 transition-colors shadow-sm cursor-pointer">
          Visit Help Center
          <ArrowRight size={14} />
        </button>
        <button className="w-full py-2.5 px-4 bg-white text-[#5B3DF5] hover:text-[#4a30db] rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-colors cursor-pointer border border-[#5B3DF5]/20 hover:bg-[#5B3DF5]/5">
          <Headphones size={14} />
          Contact Support
        </button>
      </div>
    </div>
  );
}
