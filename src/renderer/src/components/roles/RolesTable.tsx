import React from 'react';
import { Pencil, MoreHorizontal, Crown, ShieldCheck, Users, Calendar, DollarSign, Heart, Eye } from 'lucide-react';

const roles = [
  { role: "Super Admin", icon: Crown, color: "text-[#5B3DF5]", bg: "bg-[#5B3DF5]/10", type: "System", users: 2, status: "Active", permissions: "all", description: "Full access to all features and settings." },
  { role: "Administrator", icon: ShieldCheck, color: "text-blue-600", bg: "bg-blue-50", type: "System", users: 3, status: "Active", permissions: 87, description: "Manage system settings, users and all modules." },
  { role: "Ministry Leader", icon: Users, color: "text-teal-600", bg: "bg-teal-50", type: "Custom", users: 6, status: "Active", permissions: 42, description: "Manage ministry activities, members and teams." },
  { role: "Event Manager", icon: Calendar, color: "text-red-500", bg: "bg-red-50", type: "Custom", users: 4, status: "Active", permissions: 28, description: "Manage events and registrations." },
  { role: "Finance Manager", icon: DollarSign, color: "text-green-500", bg: "bg-green-50", type: "Custom", users: 2, status: "Active", permissions: 36, description: "Manage finances, budgets and reports." },
  { role: "Member Services", icon: Heart, color: "text-pink-500", bg: "bg-pink-50", type: "Custom", users: 5, status: "Active", permissions: 31, description: "Manage member services and communications." },
  { role: "Department User", icon: Users, color: "text-[#5B3DF5]", bg: "bg-[#5B3DF5]/10", type: "Custom", users: 60, status: "Active", permissions: 15, description: "Access limited to assigned department functions." },
  { role: "Viewer", icon: Eye, color: "text-orange-500", bg: "bg-orange-50", type: "System", users: 4, status: "Active", permissions: 6, description: "View only access to assigned data." }
];

export default function RolesTable() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col">
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-sm font-black text-gray-900">All Roles</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-[13px] text-left">
          <thead className="bg-gray-50/50 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Role Name</th>
              <th className="px-6 py-4 text-center">Type</th>
              <th className="px-6 py-4 text-center">Users</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Permissions</th>
              <th className="px-6 py-4 w-[30%]">Description</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700 font-semibold">
            {roles.map((item, index) => {
              const Icon = item.icon;
              return (
                <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${item.bg}`}>
                        <Icon size={14} className={item.color} />
                      </div>
                      <span className="text-[12px] font-bold text-gray-900">{item.role}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                      item.type === 'System' ? 'bg-[#5B3DF5]/10 text-[#5B3DF5]' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-[12px] font-black text-gray-900">
                    {item.users}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {item.status === 'Active' ? (
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-green-50 text-green-600">Active</span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-red-50 text-red-600">Inactive</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-[12px] font-bold text-gray-900">
                    {item.permissions}
                  </td>
                  <td className="px-6 py-4 text-[11px] font-bold text-gray-500 leading-snug">
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
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-gray-100">
        <p className="text-[11px] font-bold text-gray-500">Showing 1 to 8 of 8 roles</p>
      </div>
    </div>
  );
}
