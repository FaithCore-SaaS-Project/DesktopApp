import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

interface PermissionsTableProps {
  permissions: any[];
  onEdit: (perm: any) => void;
  onDelete: (id: any) => void;
}

export default function PermissionsTable({ permissions, onEdit, onDelete }: PermissionsTableProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col mb-6">
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-sm font-black text-gray-900">All Security Permissions</h2>
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
          {permissions.length} Total
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-[13px] text-left">
          <thead className="bg-gray-50/50 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Permission Name</th>
              <th className="px-6 py-4 text-center">Module</th>
              <th className="px-6 py-4 text-center">Type</th>
              <th className="px-6 py-4 text-center">Assigned Roles</th>
              <th className="px-6 py-4 w-[40%]">Description</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700 font-semibold">
            {permissions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-400 italic">
                  No permissions registered. Click "Manage Permissions" to add one.
                </td>
              </tr>
            ) : (
              permissions.map((item, index) => {
                const isSystemPermission = ['view_members', 'create_members', 'edit_members', 'delete_members', 'view_finance', 'create_expenses', 'create_income', 'view_documents', 'manage_settings', 'view_events', 'create_events', 'edit_events', 'delete_events', 'view_reports', 'manage_users', 'manage_subscription'].includes(item.key);
                return (
                  <tr key={item.id || index} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <h3 className="text-[12px] font-bold text-gray-900 leading-tight">{item.name}</h3>
                        <p className="text-[10px] text-gray-500 mt-0.5 font-medium">{item.key}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-[11px] font-bold text-[#5B3DF5]">{item.module}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                        isSystemPermission ? 'bg-[#5B3DF5]/10 text-[#5B3DF5]' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {isSystemPermission ? 'System' : 'Custom'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-[12px] font-black text-gray-900">
                      {item.roles ?? 0}
                    </td>
                    <td className="px-6 py-4 text-[11px] font-bold text-gray-500 leading-snug">
                      {item.description || `Grants custom privilege for ${item.key}.`}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => onEdit(item)}
                          className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:text-[#5B3DF5] hover:border-[#5B3DF5]/30 hover:bg-[#5B3DF5]/5 transition-colors shadow-sm cursor-pointer"
                          title="Edit Permission"
                        >
                          <Pencil size={13} />
                        </button>
                        {!isSystemPermission && (
                          <button
                            onClick={() => onDelete(item.id)}
                            className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors shadow-sm cursor-pointer"
                            title="Delete Permission"
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
        <p className="text-[11px] font-bold text-gray-500">Showing {permissions.length} permissions</p>
      </div>
    </div>
  );
}
