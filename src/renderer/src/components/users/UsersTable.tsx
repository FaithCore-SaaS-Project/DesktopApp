import React from 'react';
import { Pencil, MoreHorizontal } from 'lucide-react';
import CategoriesPagination from '../finance/categories/CategoriesPagination';

const users = [
  { name: 'Pastor John', email: 'pastor.john@kingdomconnect.com', role: 'Super Admin', roleColor: 'bg-purple-100 text-purple-700', department: 'Administration', status: 'Active', login: 'Today, 09:15 AM', img: 'https://ui-avatars.com/api/?name=Pastor+John&background=random' },
  { name: 'Sarah Johnson', email: 'sarah.johnson@kingdomconnect.com', role: 'Administrator', roleColor: 'bg-blue-100 text-blue-700', department: 'Education', status: 'Active', login: 'Today, 08:42 AM', img: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=random' },
  { name: 'Michael Peters', email: 'michael.peters@kingdomconnect.com', role: 'Ministry Leader', roleColor: 'bg-teal-100 text-teal-700', department: 'Outreach Ministry', status: 'Active', login: 'Yesterday, 07:30 PM', img: 'https://ui-avatars.com/api/?name=Michael+Peters&background=random' },
  { name: 'Emily Davis', email: 'emily.davis@kingdomconnect.com', role: 'Event Manager', roleColor: 'bg-orange-100 text-orange-700', department: 'Events Department', status: 'Active', login: 'Yesterday, 06:10 PM', img: 'https://ui-avatars.com/api/?name=Emily+Davis&background=random' },
  { name: 'Daniel Wilson', email: 'daniel.wilson@kingdomconnect.com', role: 'Finance Manager', roleColor: 'bg-green-100 text-green-700', department: 'Finance Department', status: 'Active', login: 'Yesterday, 04:25 PM', img: 'https://ui-avatars.com/api/?name=Daniel+Wilson&background=random' },
  { name: 'Lisa Anderson', email: 'lisa.anderson@kingdomconnect.com', role: 'Member Services', roleColor: 'bg-purple-100 text-purple-700', department: 'Care & Support', status: 'Active', login: 'Today, 07:50 AM', img: 'https://ui-avatars.com/api/?name=Lisa+Anderson&background=random' },
  { name: 'Robert Miller', email: 'robert.miller@kingdomconnect.com', role: 'Department User', roleColor: 'bg-blue-100 text-blue-700', department: 'Administration', status: 'Inactive', login: '3 days ago', img: 'https://ui-avatars.com/api/?name=Robert+Miller&background=random' },
  { name: 'Olivia Martinez', email: 'olivia.martinez@kingdomconnect.com', role: 'Event Manager', roleColor: 'bg-orange-100 text-orange-700', department: 'Events Department', status: 'Active', login: 'Today, 10:05 AM', img: 'https://ui-avatars.com/api/?name=Olivia+Martinez&background=random' }
];

export default function UsersTable() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-black text-gray-900">All Users</h2>
      </div>
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Last Login</th>
              <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((user, index) => (
              <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <img src={user.img} alt={user.name} className="w-8 h-8 rounded-full object-cover bg-gray-100" />
                    <div>
                      <h3 className="text-xs font-bold text-gray-900">{user.name}</h3>
                      <p className="text-[10px] font-semibold text-gray-400">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${user.roleColor}`}>{user.role}</span>
                </td>
                <td className="px-5 py-4 text-xs font-semibold text-gray-600">{user.department}</td>
                <td className="px-5 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-xs font-semibold text-gray-600">{user.login}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors border border-gray-200 rounded hover:bg-gray-50">
                      <Pencil size={14} />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors border border-gray-200 rounded hover:bg-gray-50">
                      <MoreHorizontal size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <CategoriesPagination
        currentPage={1}
        totalPages={11}
        totalCategoriesCount={86}
        pageSize={8}
        onPageChange={() => {}}
        itemName="users"
      />
    </div>
  );
}
