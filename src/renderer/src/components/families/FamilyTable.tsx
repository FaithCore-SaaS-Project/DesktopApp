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
          <thead className="bg-gray-50/70 text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-150">
            <tr>
              <th className="p-4 pl-6">Family Name</th>
              <th className="p-4">Members</th>
              <th className="p-4">District / Location</th>
              <th className="p-4">Joined Date</th>
              <th className="p-4">Status</th>
              <th className="p-4 pr-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm font-medium text-gray-600">
            {families.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-gray-400">
                  <Users className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                  <p className="font-semibold text-sm">No family profiles match your criteria.</p>
                  <p className="text-xs text-gray-400">Try loosening your search or create a new family.</p>
                </td>
              </tr>
            ) : (
              families.map((family) => (
                <tr
                  key={family.id}
                  className="hover:bg-gray-55/40 transition-colors border-t border-gray-100 group"
                >
                  <td className="p-4 pl-6 font-bold text-gray-900 group-hover:text-[#5B3DF5] transition-colors cursor-pointer" onClick={() => onViewClick(family)}>
                    {family.name}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-gray-750 font-bold">
                      <Users size={16} className="text-gray-400" />
                      <span>{family.members}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{family.district}</td>
                  <td className="p-4 text-gray-500">{family.joined}</td>
                  <td className="p-4">
                    <span className={`rounded-xl px-2.5 py-1 text-xs font-bold border ${getStatusStyle(family.status)}`}>
                      {family.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-center">
                    <div className="flex justify-center gap-2">
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
