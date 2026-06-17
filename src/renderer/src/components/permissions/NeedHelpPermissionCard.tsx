import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function NeedHelpPermissionCard() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <h3 className="text-sm font-black text-gray-900 mb-2">Need Help?</h3>
      <p className="text-gray-500 text-[10px] font-semibold leading-relaxed mb-5">
        Learn more about permissions and how to manage access in the Help Center.
      </p>
      <button className="w-full h-10 border border-gray-200 rounded-xl flex items-center justify-center gap-2 text-[11px] font-bold text-[#5B3DF5] hover:bg-gray-50 shadow-sm transition-colors cursor-pointer">
        <span>Visit Help Center</span>
        <ArrowRight size={14} />
      </button>
    </div>
  );
}
