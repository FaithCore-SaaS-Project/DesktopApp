import React from 'react';
import { Pencil, Trash2, User } from 'lucide-react';
import CategoriesPagination from '../finance/categories/CategoriesPagination';

const categoryColors: Record<string, string> = {
  Ministry: 'text-violet-600 bg-violet-50 border-violet-100/50',
  Education: 'text-emerald-600 bg-emerald-50 border-emerald-100/50',
  Administration: 'text-blue-600 bg-blue-50 border-blue-100/50',
  'Care & Support': 'text-cyan-600 bg-cyan-50 border-cyan-100/50',
};

interface DepartmentsTableProps {
  departments: any[];
  selectedDepartment: any | null;
  onSelect: (dept: any) => void;
  onDelete: (id: number | string) => void;
}

export default function DepartmentsTable({
  departments,
  selectedDepartment,
  onSelect,
  onDelete,
}: DepartmentsTableProps) {
  return (
    <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
        <h2 className="text-base font-black text-slate-800">All Departments</h2>
        <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
          Total {departments.length} items
        </span>
      </div>
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Department Name</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Department Leader</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Members</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {departments.map((item, index) => {
              const isSelected = selectedDepartment && selectedDepartment.id === item.id;
              const catClass = categoryColors[item.category] || 'text-slate-600 bg-slate-50 border-slate-100/50';

              return (
                <tr
                  key={item.id || index}
                  onClick={() => onSelect(item)}
                  className={`hover:bg-slate-50/70 transition-all duration-150 group cursor-pointer ${
                    isSelected ? 'bg-indigo-50/40 border-l-4 border-[#5B3DF5]' : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs text-white bg-[#5B3DF5] shadow-sm shrink-0 transition-transform group-hover:scale-105`}>
                        {item.iconLetter || '♪'}
                      </div>
                      <span className={`text-xs font-bold ${isSelected ? 'text-[#5B3DF5]' : 'text-slate-800'} group-hover:text-[#5B3DF5] transition-colors`}>
                        {item.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black border uppercase tracking-wider ${catClass}`}>
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-600">{item.leader}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-xs font-bold text-slate-500">
                      {item.members} <User size={13} className="text-slate-400" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-100/50">
                      {item.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer active:scale-95 shadow-sm shadow-slate-100 bg-white">
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer border border-slate-100 active:scale-95 shadow-sm shadow-slate-100 bg-white"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-slate-100 bg-slate-50/20">
        <CategoriesPagination
          currentPage={1}
          totalPages={Math.max(1, Math.ceil(departments.length / 10))}
          totalCategoriesCount={departments.length}
          pageSize={10}
          onPageChange={() => {}}
          itemName="departments"
        />
      </div>
    </div>
  );
}
