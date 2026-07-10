import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

interface UsersTableProps {
  users: any[];
  onEdit: (user: any) => void;
  onDelete: (id: any) => void;
}

const roleColor: Record<string, string> = {
  "Super Admin": "bg-[#5B3DF5]/10 text-[#5B3DF5]",
  "Church Administrator": "bg-blue-100 text-blue-700",
  "Pastor": "bg-purple-100 text-purple-700",
  "Treasurer": "bg-emerald-100 text-emerald-700",
  "Department Leader": "bg-indigo-100 text-indigo-700",
  "Member": "bg-gray-100 text-gray-700",
};

export default function UsersTable({ users, onEdit, onDelete }: UsersTableProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col">
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-sm font-black text-gray-900">All Registered Users</h2>
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
          {users.length} Total
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-[13px] text-left">
          <thead className="bg-gray-50/50 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4">Joined Date</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700 font-semibold">
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-400 italic">
                  No users found in this church. Click "Add New User" to register one.
                </td>
              </tr>
            ) : (
              users.map((user, index) => {
                const name = `${user.first_name} ${user.last_name}`;
                const roleName = user.roles?.[0]?.name || 'Member';
                const statusActive = !!user.status;
                const joinedDate = user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A';

                return (
                  <tr key={user.id || index} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex gap-3 items-center">
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`}
                          alt={name}
                          className="w-9 h-9 rounded-full shadow-sm"
                        />
                        <div>
                          <h3 className="text-[12px] font-bold text-gray-900 leading-tight">{name}</h3>
                          <p className="text-[10px] font-semibold text-gray-500 mt-0.5">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${roleColor[roleName] || 'bg-gray-100 text-gray-700'}`}>
                        {roleName}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-[11px] font-bold">
                      {user.phone || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {statusActive ? (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-green-50 text-green-600">Active</span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-red-50 text-red-600">Inactive</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[11px] font-bold text-gray-500">
                      {joinedDate}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => onEdit(user)}
                          className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:text-[#5B3DF5] hover:border-[#5B3DF5]/30 hover:bg-[#5B3DF5]/5 transition-colors shadow-sm cursor-pointer"
                          title="Edit User"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => onDelete(user.id)}
                          className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors shadow-sm cursor-pointer"
                          title="Delete User"
                        >
                          <Trash2 size={13} />
                        </button>
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
        <p className="text-[11px] font-bold text-gray-500">Showing {users.length} users</p>
      </div>
    </div>
  );
}
