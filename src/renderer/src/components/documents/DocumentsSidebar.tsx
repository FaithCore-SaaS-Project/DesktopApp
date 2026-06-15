import React from 'react';
import { Upload, FolderPlus, Tags, Trash2 } from 'lucide-react';

export default function DocumentsSidebar() {
  return (
    <div className="space-y-6">
      {/* Storage Overview */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <h3 className="text-xs font-black text-gray-900 mb-5">Storage Overview</h3>
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 shrink-0">
            {/* Simple CSS Donut */}
            <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
              <path
                className="text-gray-100"
                strokeWidth="4"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#5B3DF5]"
                strokeWidth="4"
                strokeDasharray="64, 100"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-black text-[#5B3DF5]">64%</span>
              <span className="text-[8px] font-bold text-gray-400">of 10 GB used</span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#5B3DF5]" />
              <div>
                <p className="text-[10px] font-bold text-gray-500">Used</p>
                <p className="text-xs font-black text-gray-900">6.4 GB</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-200" />
              <div>
                <p className="text-[10px] font-bold text-gray-500">Available</p>
                <p className="text-xs font-black text-gray-900">3.6 GB</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <h3 className="text-xs font-black text-gray-900 mb-4">Quick Actions</h3>
        <div className="space-y-1">
          <button className="w-full flex items-center gap-3 py-2 px-2 text-xs font-semibold text-gray-600 hover:text-[#5B3DF5] hover:bg-gray-50 rounded-lg transition-colors text-left">
            <Upload size={14} />
            Upload Document
          </button>
          <button className="w-full flex items-center gap-3 py-2 px-2 text-xs font-semibold text-gray-600 hover:text-[#5B3DF5] hover:bg-gray-50 rounded-lg transition-colors text-left">
            <FolderPlus size={14} />
            Create New Folder
          </button>
          <button className="w-full flex items-center gap-3 py-2 px-2 text-xs font-semibold text-gray-600 hover:text-[#5B3DF5] hover:bg-gray-50 rounded-lg transition-colors text-left">
            <Tags size={14} />
            Manage Categories
          </button>
          <button className="w-full flex items-center gap-3 py-2 px-2 text-xs font-semibold text-gray-600 hover:text-[#5B3DF5] hover:bg-gray-50 rounded-lg transition-colors text-left">
            <Trash2 size={14} />
            Recycle Bin
          </button>
        </div>
      </div>

      {/* Document Categories */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-black text-gray-900">Document Categories</h3>
          <button className="text-[10px] font-bold text-[#5B3DF5] hover:underline cursor-pointer">View All</button>
        </div>
        <div className="space-y-3">
          {[
            { name: 'Legal Documents', count: 24, color: 'text-orange-500' },
            { name: 'Finance', count: 38, color: 'text-blue-500' },
            { name: 'Ministry', count: 56, color: 'text-green-500' },
            { name: 'Forms', count: 72, color: 'text-yellow-500' },
            { name: 'Events', count: 41, color: 'text-pink-500' },
            { name: 'Others', count: 97, color: 'text-gray-500' }
          ].map((cat, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderPlus size={14} className={cat.color} />
                <span className="text-xs font-semibold text-gray-600">{cat.name}</span>
              </div>
              <span className="text-[10px] font-bold text-[#5B3DF5]">{cat.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Uploads */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-black text-gray-900">Recent Uploads</h3>
          <button className="text-[10px] font-bold text-[#5B3DF5] hover:underline cursor-pointer">View All</button>
        </div>
        <div className="space-y-4">
          {[
            { name: 'Church Constitution.pdf', date: '24 May 2025', iconBg: 'bg-red-100', iconText: 'text-red-500', iconLetter: 'P' },
            { name: 'Membership Application Form.docx', date: '23 May 2025', iconBg: 'bg-blue-100', iconText: 'text-blue-500', iconLetter: 'W' },
            { name: '2025 Budget Plan.xlsx', date: '22 May 2025', iconBg: 'bg-green-100', iconText: 'text-green-500', iconLetter: 'X' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden pr-2">
                <div className={`w-6 h-6 shrink-0 rounded flex items-center justify-center font-bold text-[10px] ${item.iconBg} ${item.iconText}`}>
                  {item.iconLetter}
                </div>
                <span className="text-[11px] font-bold text-gray-900 truncate">{item.name}</span>
              </div>
              <span className="text-[9px] font-semibold text-gray-400 shrink-0">{item.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
