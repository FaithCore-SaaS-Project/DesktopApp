import React from 'react';
import { Pencil, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

const permissions = [
  { name: "View Members", key: "members.view", module: "Members", type: "System", roles: 8, status: "Active", description: "Allows viewing member details and lists." },
  { name: "Create Members", key: "members.create", module: "Members", type: "System", roles: 5, status: "Active", description: "Allows creating new member records." },
  { name: "Edit Members", key: "members.edit", module: "Members", type: "System", roles: 5, status: "Active", description: "Allows editing existing member information." },
  { name: "Delete Members", key: "members.delete", module: "Members", type: "System", roles: 2, status: "Inactive", description: "Allows deleting member records." },
  { name: "View Family Details", key: "families.view", module: "Families", type: "System", roles: 8, status: "Active", description: "Allows viewing family details and members." },
  { name: "Manage Donations", key: "donations.manage", module: "Finance", type: "Module", roles: 4, status: "Active", description: "Allows adding and managing donations." },
  { name: "View Reports", key: "reports.view", module: "Reports", type: "Module", roles: 6, status: "Active", description: "Allows viewing reports and analytics." },
  { name: "Manage Events", key: "events.manage", module: "Events", type: "Module", roles: 4, status: "Active", description: "Allows creating and managing events." },
  { name: "Manage Users", key: "users.manage", module: "Users & Roles", type: "System", roles: 3, status: "Active", description: "Allows managing users and their roles." },
  { name: "Manage Settings", key: "settings.manage", module: "Settings", type: "System", roles: 2, status: "Active", description: "Allows accessing and modifying system settings." }
];

export default function PermissionsTable() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col mb-6">
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-sm font-black text-gray-900">All Permissions</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-[13px] text-left">
          <thead className="bg-gray-50/50 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 w-12">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#5B3DF5] focus:ring-[#5B3DF5]/30 cursor-pointer" />
              </th>
              <th className="px-4 py-4">Permission Name</th>
              <th className="px-4 py-4 text-center">Module</th>
              <th className="px-4 py-4 text-center">Type</th>
              <th className="px-4 py-4 text-center">Roles</th>
              <th className="px-4 py-4 text-center">Status</th>
              <th className="px-4 py-4 w-[28%]">Description</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700 font-semibold">
            {permissions.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#5B3DF5] focus:ring-[#5B3DF5]/30 cursor-pointer" />
                </td>
                <td className="px-4 py-4">
                  <h3 className="text-[12px] font-bold text-gray-900 leading-tight">{item.name}</h3>
                  <p className="text-[10px] text-gray-500 mt-0.5 font-medium">{item.key}</p>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center">
                  <span className="text-[11px] font-bold text-[#5B3DF5]">{item.module}</span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                    item.type === 'System' ? 'bg-[#5B3DF5]/10 text-[#5B3DF5]' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {item.type}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center text-[12px] font-black text-gray-900">
                  {item.roles}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center">
                  {item.status === 'Active' ? (
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-green-50 text-green-600">Active</span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-red-50 text-red-600">Inactive</span>
                  )}
                </td>
                <td className="px-4 py-4 text-[11px] font-bold text-gray-500 leading-snug">
                  {item.description}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:text-[#5B3DF5] hover:border-[#5B3DF5]/30 hover:bg-[#5B3DF5]/5 transition-colors shadow-sm cursor-pointer">
                      <Pencil size={14} />
                    </button>
                    <button className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors shadow-sm cursor-pointer">
                      <MoreHorizontal size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between mt-auto">
        <p className="text-[11px] font-bold text-gray-500">Showing 1 to 10 of 186 permissions</p>
        <div className="flex gap-1.5">
          <button className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors cursor-pointer shadow-sm">
            <ChevronLeft size={14} />
          </button>
          <button className="w-8 h-8 bg-[#5B3DF5] rounded-lg flex items-center justify-center text-white text-[11px] font-bold shadow-sm shadow-[#5B3DF5]/30 cursor-pointer">
            1
          </button>
          <button className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 text-[11px] font-bold hover:bg-gray-50 transition-colors cursor-pointer shadow-sm">
            2
          </button>
          <button className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 text-[11px] font-bold hover:bg-gray-50 transition-colors cursor-pointer shadow-sm">
            3
          </button>
          <button className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 text-[11px] font-bold hover:bg-gray-50 transition-colors cursor-pointer shadow-sm">
            4
          </button>
          <button className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 text-[11px] font-bold hover:bg-gray-50 transition-colors cursor-pointer shadow-sm">
            5
          </button>
          <div className="w-8 h-8 flex items-center justify-center text-gray-400 text-[11px] font-bold">
            ...
          </div>
          <button className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 text-[11px] font-bold hover:bg-gray-50 transition-colors cursor-pointer shadow-sm">
            19
          </button>
          <button className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors cursor-pointer shadow-sm">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
