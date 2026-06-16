import React, { useState } from 'react';
import { ChevronDown, Info } from 'lucide-react';

export default function BackupSchedule() {
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-black text-gray-900 mb-1">Backup Schedule</h2>
          <p className="text-gray-500 text-xs font-semibold">Configure automatic backups to keep your data safe.</p>
        </div>
        <button className="border border-gray-200 text-[#5B3DF5] px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors shadow-sm cursor-pointer flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
          Edit Schedule
        </button>
      </div>
      
      <div className="flex items-center gap-4 mb-8">
        <button
          type="button"
          onClick={() => setEnabled(!enabled)}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            enabled ? 'bg-[#5B3DF5]' : 'bg-gray-200'
          }`}
        >
          <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${enabled ? 'translate-x-4' : 'translate-x-0'}`} />
        </button>
        <div>
          <h4 className="text-xs font-bold text-gray-900">Enable Automated Backups</h4>
          <p className="text-[10px] font-semibold text-gray-500 mt-0.5">Automatically backup your data as per the schedule.</p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="text-[11px] font-bold text-gray-900 mb-1.5 block">Backup Frequency</label>
          <div className="relative">
            <select className="w-full appearance-none bg-white border border-gray-200 rounded-xl py-2.5 pl-3 pr-10 text-xs font-semibold text-gray-700 outline-none hover:border-gray-300 focus:border-[#5B3DF5] cursor-pointer shadow-sm disabled:bg-gray-50 disabled:text-gray-400" disabled={!enabled}>
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
        
        <div>
          <label className="text-[11px] font-bold text-gray-900 mb-1.5 block">Backup Time</label>
          <div className="relative">
            <select className="w-full appearance-none bg-white border border-gray-200 rounded-xl py-2.5 pl-3 pr-10 text-xs font-semibold text-gray-700 outline-none hover:border-gray-300 focus:border-[#5B3DF5] cursor-pointer shadow-sm disabled:bg-gray-50 disabled:text-gray-400" disabled={!enabled}>
              <option>02:30 AM</option>
              <option>03:00 AM</option>
              <option>04:00 AM</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 mt-5">
        <Info size={14} className="text-[#5B3DF5]" />
        <span className="text-[11px] font-semibold text-gray-500">
          Automated backups will be created daily at 02:30 AM server time.
        </span>
      </div>
    </div>
  );
}
