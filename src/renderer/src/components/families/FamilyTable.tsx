import React from 'react';
import { Eye, Pencil, Trash2, Users } from "lucide-react";

interface Family {
  id: string;
  name: string;
  members: number;
  district: string;
  joined: string;
  status: 'Active' | 'Inactive';
  cellGroup: string;
  hasAddress: boolean;
  hasPhone: boolean;
}

interface FamilyTableProps {
  families: Family[];
  onViewClick: (family: Family) => void;
  onEditClick: (family: Family) => void;
  onDeleteClick: (id: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalFamiliesCount: number;
  pageSize: number;
}

export default function FamilyTable({
  families,
  onViewClick,
  onEditClick,
  onDeleteClick,
  currentPage,
  totalPages,
  onPageChange,
  totalFamiliesCount,
  pageSize
}: FamilyTableProps) {
  
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalFamiliesCount);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
      case 'Inactive':
        return 'bg-amber-50 text-amber-700 border border-amber-100';
      default:
        return 'bg-slate-50 text-slate-650 border border-slate-100';
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-150 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
            <tr>
              <th className="py-3 px-4 pl-5">Family Name</th>
              <th className="py-3 px-4 whitespace-nowrap">Members</th>
              <th className="py-3 px-4 whitespace-nowrap">District / Location</th>
              <th className="py-3 px-4 whitespace-nowrap">Joined Date</th>
              <th className="py-3 px-4 whitespace-nowrap">Status</th>
              <th className="py-3 px-4 pr-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-600">
            {families.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-slate-400">
                  <Users className="h-9 w-9 text-slate-300 mx-auto mb-2" />
                  <p className="font-bold text-xs text-slate-700">No family profiles match your criteria.</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Try loosening your search or create a new family.</p>
                </td>
              </tr>
            ) : (
              families.map((family) => (
                <tr
                  key={family.id}
                  className="hover:bg-slate-50/70 transition-colors group"
                >
                  <td className="py-3 px-4 pl-5 font-bold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer whitespace-nowrap" onClick={() => onViewClick(family)}>
                    {family.name}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                      <Users size={14} className="text-slate-400" />
                      <span>{family.members}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{family.district}</td>
                  <td className="py-3 px-4 text-slate-400 whitespace-nowrap font-mono text-[11px]">{family.joined}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold border ${getStatusStyle(family.status)}`}>
                      {family.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 pr-5 text-right whitespace-nowrap">
                    <div className="inline-flex justify-end gap-1">
                      <button 
                        onClick={() => onViewClick(family)}
                        className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50 text-gray-500 hover:text-[#5B3DF5] transition-colors cursor-pointer"
                        title="View Household"
                      >
                        <Eye size={15} />
                      </button>
                      <button 
                        onClick={() => onEditClick(family)}
                        className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                        title="Edit Details"
                      >
                        <Pencil size={15} />
                      </button>
                      <button 
                        onClick={() => onDeleteClick(family.id)}
                        className="rounded-lg border border-gray-200 p-2 hover:bg-red-50 text-gray-500 hover:text-red-650 transition-colors cursor-pointer"
                        title="Delete Profile"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination panel */}
      {totalFamiliesCount > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 p-5 gap-4 bg-white">
          <p className="text-xs text-gray-450 font-bold">
            Showing {startIndex} - {endIndex} of {totalFamiliesCount} families
          </p>
          {totalPages > 1 && (
            <div className="flex gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                const isActive = page === currentPage;
                return (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`h-9 w-9 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#5B3DF5] text-white border-[#5B3DF5] shadow-sm shadow-[#5B3DF5]/20"
                        : "border-gray-200 text-gray-550 hover:bg-gray-50 hover:text-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
