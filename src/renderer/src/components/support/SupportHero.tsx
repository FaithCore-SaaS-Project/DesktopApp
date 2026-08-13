import React from 'react';
import { Headphones, ExternalLink } from 'lucide-react';

export default function SupportHero() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-8 mb-6 shadow-sm overflow-hidden relative">
      <div className="grid md:grid-cols-2 gap-10 items-center relative z-10">
        <div>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-[#5B3DF5]/10 flex items-center justify-center shrink-0 border border-[#5B3DF5]/20 shadow-sm">
              <Headphones size={28} className="text-[#5B3DF5]" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">We're here to help!</h1>
              <p className="text-xs font-semibold text-gray-500 mt-2 max-w-md leading-relaxed">
                Our support team is ready to assist you with any questions or issues you may have with FaithCore.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 mt-8">
            <button className="bg-[#5B3DF5] hover:bg-[#4a30db] text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-2 cursor-pointer">
              <Headphones size={14} />
              Contact Support
            </button>
            <button className="border border-gray-200 text-gray-700 px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2 cursor-pointer">
              View Help Center
              <ExternalLink size={14} />
            </button>
          </div>
        </div>
        
        <div className="hidden md:flex justify-end pr-8">
          <div className="w-64 h-48 bg-[#5B3DF5]/5 rounded-2xl border border-[#5B3DF5]/10 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
             <div className="absolute top-8 left-8 w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
               <div className="w-6 h-6 bg-blue-100 rounded-full"></div>
             </div>
             <div className="absolute bottom-8 right-8 w-16 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center px-2 gap-1.5">
               <div className="w-full h-1 bg-gray-100 rounded-full"></div>
               <div className="w-2/3 h-1 bg-gray-100 rounded-full"></div>
             </div>
             <div className="w-32 h-32 bg-[#5B3DF5]/10 rounded-full flex items-center justify-center">
               <Headphones size={48} className="text-[#5B3DF5]/40" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
