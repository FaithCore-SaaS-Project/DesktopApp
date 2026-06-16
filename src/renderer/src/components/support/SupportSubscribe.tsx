import React from 'react';

export default function SupportSubscribe() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
      <h3 className="text-sm font-black text-gray-900 mb-2">Stay Updated</h3>
      <p className="text-gray-500 text-[10px] font-semibold mb-4 leading-relaxed">
        Subscribe to get product updates, tips and helpful resources.
      </p>
      
      <div className="flex gap-2">
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border border-gray-200 rounded-xl py-2 px-3 text-xs font-semibold text-gray-900 outline-none focus:border-[#5B3DF5] shadow-sm"
        />
        <button className="bg-[#5B3DF5] hover:bg-[#4a30db] text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-sm shrink-0 cursor-pointer">
          Subscribe
        </button>
      </div>
    </div>
  );
}
