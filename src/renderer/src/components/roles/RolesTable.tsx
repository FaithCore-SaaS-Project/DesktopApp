import React from 'react';
import { Pencil, Trash2, Shield } from 'lucide-react';

interface RolesTableProps {
  roles: any[];
  onEdit: (role: any) => void;
  onDelete: (id: any) => void;
}

export default function RolesTable({ roles, onEdit, onDelete }: RolesTableProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col">
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-sm font-black text-gray-900">All Security Roles</h2>
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
          {roles.length} Total
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-[13px] text-left">
          <thead className="bg-gray-50/50 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Role Name</th>
              <th className="px-6 py-4 text-center">Type</th>
              <th className="px-6 py-4 text-center">Active Users</th>
              <th className="px-6 py-4 text-center">Permissions Count</th>
              <th className="px-6 py-4 w-[40%]">Description</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700 font-semibold">
            {roles.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-400 italic">
                  No roles found. Click "Add New Role" to create one.
                </td>
              </tr>
            ) : (
              roles.map((item, index) => {
                const isSystemRole = ['Super Admin', 'Church Administrator', 'Pastor', 'Treasurer', 'Department Leader', 'Member'].includes(item.name);
                return (
                  <tr key={item.id || index} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isSystemRole ? 'bg-indigo-50' : 'bg-blue-50'}`}>
                          <Shield size={14} className={isSystemRole ? 'text-indigo-650' : 'text-blue-600'} />
                        </div>
                        <span className="text-[12px] font-bold text-gray-900">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                        isSystemRole ? 'bg-[#5B3DF5]/10 text-[#5B3DF5]' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {isSystemRole ? 'System' : 'Custom'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-[12px] font-black text-gray-900">
                      {item.users_count ?? 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-[12px] font-bold text-gray-950">
                      {item.permissions?.length ?? 0}
                    </td>
                    <td className="px-6 py-4 text-[11px] font-bold text-gray-500 leading-snug">
                      {item.description || `Custom role with ${item.permissions?.length ?? 0} permission(s).`}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => onEdit(item)}
                          className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:text-[#5B3DF5] hover:border-[#5B3DF5]/30 hover:bg-[#5B3DF5]/5 transition-colors shadow-sm cursor-pointer"
                          title="Edit Role & Permissions"
                        >
                          <Pencil size={13} />
                        </button>
                        {!isSystemRole && (
                          <button
                            onClick={() => onDelete(item.id)}
                            className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors shadow-sm cursor-pointer"
                            title="Delete Role"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-gray-100">
        <p className="text-[11px] font-bold text-gray-500">Showing {roles.length} roles</p>
      </div>
    </div>
  );
}
