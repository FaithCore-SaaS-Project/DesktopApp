import React from 'react';

export default function PermissionTypesCard() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
      <h3 className="text-sm font-black text-gray-900 mb-6">Permission Types</h3>
      <div className="flex items-center gap-6">
        <div className="relative w-28 h-28 shrink-0">
          <div
            className="w-full h-full rounded-full"
            style={{
              background: "conic-gradient(#5B3DF5 0% 54.8%, #3B82F6 54.8% 93.5%, #D1D5DB 93.5% 100%)",
            }}
          />
          <div className="absolute inset-[12px] bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
            <h2 className="text-2xl font-black text-gray-900 leading-none">186</h2>
            <p className="text-[9px] font-bold text-gray-500 mt-0.5">Total</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-start gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#5B3DF5] mt-0.5 shadow-sm" />
            <div>
              <h4 className="text-[11px] font-bold text-gray-900 leading-none mb-1">System</h4>
              <p className="text-[10px] font-semibold text-gray-500 leading-none">102 (54.8%)</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-0.5 shadow-sm" />
            <div>
              <h4 className="text-[11px] font-bold text-gray-900 leading-none mb-1">Module</h4>
              <p className="text-[10px] font-semibold text-gray-500 leading-none">72 (38.7%)</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-gray-300 mt-0.5 shadow-sm" />
            <div>
              <h4 className="text-[11px] font-bold text-gray-900 leading-none mb-1">Other</h4>
              <p className="text-[10px] font-semibold text-gray-500 leading-none">12 (6.5%)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
