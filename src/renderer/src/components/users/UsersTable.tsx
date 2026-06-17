import React from 'react';
import { Pencil, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

const users = [
  { name: "Pastor John", email: "pastor.john@kingdomconnect.com", role: "Super Admin", department: "Administration", status: "Active", lastLogin: "Today, 09:15 AM", joinedDate: "15 Jan 2023", avatar: "/avatar.jpg" },
  { name: "Sarah Johnson", email: "sarah.johnson@kingdomconnect.com", role: "Administrator", department: "Education", status: "Active", lastLogin: "Today, 08:42 AM", joinedDate: "22 Feb 2023", avatar: "/avatar2.jpg" },
  { name: "Michael Peters", email: "michael.peters@kingdomconnect.com", role: "Ministry Leader", department: "Outreach Ministry", status: "Active", lastLogin: "Yesterday, 07:30 PM", joinedDate: "10 Mar 2023", avatar: "/avatar3.jpg" },
  { name: "Emily Davis", email: "emily.davis@kingdomconnect.com", role: "Event Manager", department: "Events Department", status: "Active", lastLogin: "Yesterday, 06:10 PM", joinedDate: "18 Apr 2023", avatar: "/avatar4.jpg" },
  { name: "Daniel Wilson", email: "daniel.wilson@kingdomconnect.com", role: "Finance Manager", department: "Finance Department", status: "Active", lastLogin: "Yesterday, 04:25 PM", joinedDate: "05 May 2023", avatar: "/avatar5.jpg" },
  { name: "Lisa Anderson", email: "lisa.anderson@kingdomconnect.com", role: "Member Services", department: "Care & Support", status: "Active", lastLogin: "Today, 07:50 AM", joinedDate: "12 Jun 2023", avatar: "/avatar6.jpg" },
  { name: "Robert Miller", email: "robert.miller@kingdomconnect.com", role: "Department User", department: "Administration", status: "Inactive", lastLogin: "3 days ago", joinedDate: "25 Jul 2023", initials: "RM", bg: "bg-purple-600" },
  { name: "Olivia Martinez", email: "olivia.martinez@kingdomconnect.com", role: "Event Manager", department: "Events Department", status: "Active", lastLogin: "Today, 10:05 AM", joinedDate: "08 Aug 2023", avatar: "/avatar7.jpg" }
];

const roleColor = {
  "Super Admin": "bg-[#5B3DF5]/10 text-[#5B3DF5]",
  "Administrator": "bg-blue-100 text-blue-700",
  "Ministry Leader": "bg-green-100 text-green-700",
  "Event Manager": "bg-orange-100 text-orange-700",
  "Finance Manager": "bg-emerald-100 text-emerald-700",
  "Member Services": "bg-pink-100 text-pink-700",
  "Department User": "bg-indigo-100 text-indigo-700"
};

export default function UsersTable() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col">
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-sm font-black text-gray-900">All Users</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-[13px] text-left">
          <thead className="bg-gray-50/50 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Last Login</th>
              <th className="px-6 py-4">Joined Date</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700 font-semibold">
            {users.map((user, index) => (
              <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex gap-3 items-center">
                    {user.initials ? (
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm ${user.bg}`}>
                        {user.initials}
                      </div>
                    ) : (
                      <img src={`https://ui-avatars.com/api/?name=${user.name.replace(' ', '+')}&background=random`} alt={user.name} className="w-9 h-9 rounded-full shadow-sm" />
                    )}
                    <div>
                      <h3 className="text-[12px] font-bold text-gray-900 leading-tight">{user.name}</h3>
                      <p className="text-[10px] font-semibold text-gray-500 mt-0.5">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${roleColor[user.role as keyof typeof roleColor]}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-[11px] font-bold">{user.department}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.status === 'Active' ? (
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-green-50 text-green-600">Active</span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-red-50 text-red-600">Inactive</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-[11px] font-bold text-gray-700">{user.lastLogin}</td>
                <td className="px-6 py-4 whitespace-nowrap text-[11px] font-bold text-gray-500">{user.joinedDate}</td>
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
        <p className="text-[11px] font-bold text-gray-500">Showing 1 to 8 of 86 users</p>
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
            11
          </button>
          <button className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors cursor-pointer shadow-sm">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
