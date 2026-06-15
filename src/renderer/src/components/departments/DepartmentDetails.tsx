import React from 'react';
import { Music, Users, Calendar, Pencil, XCircle, X } from 'lucide-react';

export default function DepartmentDetails() {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm relative">
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={16} />
        </button>
        
        <div className="flex justify-center mb-4 mt-2">
          <div className="w-16 h-16 bg-[#5B3DF5] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#5B3DF5]/20">
            <Music size={28} />
          </div>
        </div>
        
        <h2 className="text-center text-lg font-black text-gray-900 mb-2">Worship Ministry</h2>
        
        <div className="flex justify-center mb-6">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
            Active
          </span>
        </div>
        
        <div className="space-y-4 text-xs">
          <div className="flex justify-between items-start">
            <span className="font-semibold text-gray-500 w-1/3">Category</span>
            <span className="font-semibold text-gray-400 w-4 text-center">:</span>
            <span className="font-bold text-gray-900 w-2/3">Ministry</span>
          </div>
          <div className="flex justify-between items-start">
            <span className="font-semibold text-gray-500 w-1/3">Department Leader</span>
            <span className="font-semibold text-gray-400 w-4 text-center">:</span>
            <span className="font-bold text-gray-900 w-2/3">Daniel Wilson</span>
          </div>
          <div className="flex justify-between items-start">
            <span className="font-semibold text-gray-500 w-1/3">Members</span>
            <span className="font-semibold text-gray-400 w-4 text-center">:</span>
            <span className="font-bold text-gray-900 w-2/3">65</span>
          </div>
          <div className="flex justify-between items-start">
            <span className="font-semibold text-gray-500 w-1/3">Description</span>
            <span className="font-semibold text-gray-400 w-4 text-center">:</span>
            <span className="font-bold text-gray-900 w-2/3 leading-relaxed">Responsible for leading worship services and musical ministries.</span>
          </div>
          <div className="flex justify-between items-start">
            <span className="font-semibold text-gray-500 w-1/3">Created Date</span>
            <span className="font-semibold text-gray-400 w-4 text-center">:</span>
            <span className="font-bold text-gray-900 w-2/3">10 Jan 2024</span>
          </div>
          <div className="flex justify-between items-start">
            <span className="font-semibold text-gray-500 w-1/3">Status</span>
            <span className="font-semibold text-gray-400 w-4 text-center">:</span>
            <span className="font-bold text-gray-900 w-2/3">Active</span>
          </div>
        </div>

        <div className="mt-8 mb-4">
          <h3 className="text-xs font-black text-gray-900">Quick Actions</h3>
        </div>
        
        <div className="space-y-2">
          <button className="w-full border border-gray-200 rounded-xl py-2.5 flex items-center justify-center gap-2 text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-[#5B3DF5] transition-colors shadow-sm">
            <Users size={14} className="text-[#5B3DF5]" />
            View Department Members
          </button>
          <button className="w-full border border-gray-200 rounded-xl py-2.5 flex items-center justify-center gap-2 text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-[#5B3DF5] transition-colors shadow-sm">
            <Calendar size={14} className="text-[#5B3DF5]" />
            View Department Activities
          </button>
          <button className="w-full border border-gray-200 rounded-xl py-2.5 flex items-center justify-center gap-2 text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-[#5B3DF5] transition-colors shadow-sm">
            <Pencil size={14} className="text-[#5B3DF5]" />
            Edit Department
          </button>
          <button className="w-full border border-red-200 bg-red-50/30 rounded-xl py-2.5 flex items-center justify-center gap-2 text-xs font-bold text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors shadow-sm mt-4">
            <XCircle size={14} />
            Deactivate Department
          </button>
        </div>
      </div>
    </div>
  );
}
