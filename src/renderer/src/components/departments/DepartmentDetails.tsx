import React from 'react';
import { Music, Users, Calendar, Pencil, XCircle, X, Building2 } from 'lucide-react';

interface DepartmentDetailsProps {
  department: any | null;
  onClose: () => void;
  onDelete: (id: number | string) => void;
}

export default function DepartmentDetails({ department, onClose, onDelete }: DepartmentDetailsProps) {
  if (!department) {
    return (
      <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm flex flex-col items-center justify-center text-center h-full min-h-[350px]">
        <div className="w-14 h-14 bg-indigo-50 border border-indigo-100/50 rounded-2xl flex items-center justify-center text-indigo-500 mb-4 animate-pulse">
          <Building2 size={24} />
        </div>
        <h3 className="text-sm font-black text-slate-800 mb-1">Select a Department</h3>
        <p className="text-[11px] text-slate-400 font-semibold max-w-[200px] leading-relaxed">
          Click on any department in the table to view its detailed profiles and quick actions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer h-7 w-7 rounded-full hover:bg-slate-50 flex items-center justify-center transition-colors"
        >
          <X size={15} />
        </button>
        
        <div className="flex justify-center mb-4 mt-2">
          <div className="w-14 h-14 bg-[#5B3DF5] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#5B3DF5]/20 shrink-0">
            <Music size={24} />
          </div>
        </div>
        
        <h2 className="text-center text-base font-black text-slate-800 mb-2">{department.name}</h2>
        
        <div className="flex justify-center mb-6">
          <span className="px-3 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-100/50">
            {department.status || 'Active'}
          </span>
        </div>
        
        <div className="space-y-4 text-xs">
          <div className="flex justify-between items-start">
            <span className="font-semibold text-slate-400 w-1/3">Category</span>
            <span className="font-semibold text-slate-300 w-4 text-center">:</span>
            <span className="font-bold text-slate-700 w-2/3">{department.category}</span>
          </div>
          <div className="flex justify-between items-start">
            <span className="font-semibold text-slate-400 w-1/3">Leader</span>
            <span className="font-semibold text-slate-300 w-4 text-center">:</span>
            <span className="font-bold text-slate-700 w-2/3">{department.leader}</span>
          </div>
          <div className="flex justify-between items-start">
            <span className="font-semibold text-slate-400 w-1/3">Members</span>
            <span className="font-semibold text-slate-300 w-4 text-center">:</span>
            <span className="font-bold text-slate-700 w-2/3 flex items-center gap-1">
              {department.members} <Users size={12} className="text-slate-400" />
            </span>
          </div>
          <div className="flex justify-between items-start">
            <span className="font-semibold text-slate-400 w-1/3">Description</span>
            <span className="font-semibold text-slate-300 w-4 text-center">:</span>
            <span className="font-bold text-slate-600 w-2/3 leading-relaxed">
              {department.description || 'No description provided.'}
            </span>
          </div>
          <div className="flex justify-between items-start">
            <span className="font-semibold text-slate-400 w-1/3">Created Date</span>
            <span className="font-semibold text-slate-300 w-4 text-center">:</span>
            <span className="font-bold text-slate-500 w-2/3">{department.created_at || '10 Jan 2024'}</span>
          </div>
        </div>

        <div className="mt-8 mb-4 border-t border-slate-50 pt-6">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full border border-slate-100 rounded-xl py-2.5 flex items-center justify-center gap-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-[#5B3DF5] transition-all shadow-sm shadow-slate-100/50 cursor-pointer active:scale-98">
              <Users size={13} className="text-[#5B3DF5]" />
              View Department Members
            </button>
            <button className="w-full border border-slate-100 rounded-xl py-2.5 flex items-center justify-center gap-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-[#5B3DF5] transition-all shadow-sm shadow-slate-100/50 cursor-pointer active:scale-98">
              <Calendar size={13} className="text-[#5B3DF5]" />
              View Department Activities
            </button>
            <button className="w-full border border-slate-100 rounded-xl py-2.5 flex items-center justify-center gap-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-[#5B3DF5] transition-all shadow-sm shadow-slate-100/50 cursor-pointer active:scale-98">
              <Pencil size={13} className="text-[#5B3DF5]" />
              Edit Department
            </button>
            <button
              onClick={() => onDelete(department.id)}
              className="w-full border border-red-100 bg-red-50/20 rounded-xl py-2.5 flex items-center justify-center gap-2 text-xs font-bold text-red-600 hover:bg-red-50 hover:border-red-200 transition-all shadow-sm shadow-red-50/10 cursor-pointer active:scale-98"
            >
              <XCircle size={13} />
              Delete Department
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
