import React from 'react';
import { Cloud, ChevronDown, Info } from 'lucide-react';

export default function BackupStorage() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
      <h2 className="text-lg font-black text-gray-900 mb-1">Backup Storage</h2>
      <p className="text-gray-500 text-xs font-semibold mb-6">Manage where your backups are stored and how long they are retained.</p>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-xs font-bold text-gray-900 mb-3">Storage Location</h4>
          <div className="flex items-center justify-between border border-gray-200 rounded-xl p-4">
            <div className="flex gap-3 items-center">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <Cloud size={20} className="text-[#5B3DF5]" />
              </div>
              <div>
                <h5 className="text-[13px] font-bold text-gray-900">Amazon S3 (AWS)</h5>
                <p className="text-[10px] font-semibold text-gray-500 mt-0.5">Region: us-east-1</p>
              </div>
            </div>
            <button className="border border-gray-200 text-[#5B3DF5] px-3 py-1.5 rounded-lg text-[11px] font-bold hover:bg-gray-50 transition-colors shadow-sm cursor-pointer">
              Change Location
            </button>
          </div>
        </div>
        
        <div>
          <h4 className="text-xs font-bold text-gray-900 mb-3">Retention Policy</h4>
          <div className="flex items-center gap-3">
            <label className="text-[11px] font-bold text-gray-900 whitespace-nowrap">Keep backups for</label>
            <div className="relative flex-1">
              <select className="w-full appearance-none bg-white border border-gray-200 rounded-xl py-2 pl-3 pr-8 text-xs font-semibold text-gray-700 outline-none hover:border-gray-300 focus:border-[#5B3DF5] cursor-pointer shadow-sm">
                <option>90 days</option>
                <option>60 days</option>
                <option>30 days</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[10px] font-semibold text-gray-500">
              Backups older than 90 days will be automatically deleted.
            </span>
          </div>
        </div>
      </div>
      
      <div className="bg-[#5B3DF5]/5 border border-[#5B3DF5]/10 rounded-xl p-4 mt-6 flex gap-3">
        <Info size={16} className="text-[#5B3DF5] shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold text-gray-900 mb-0.5">Important</h4>
          <p className="text-[11px] font-semibold text-gray-600">
            Regular backups ensure your data is safe and can be restored in case of unexpected events.
          </p>
        </div>
      </div>
    </div>
  );
}
