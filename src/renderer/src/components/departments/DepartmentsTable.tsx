import React from 'react';
import { Pencil, MoreHorizontal, User } from 'lucide-react';
import CategoriesPagination from '../finance/categories/CategoriesPagination';

const departments = [
  { name: 'Worship Ministry', category: 'Ministry', leader: 'Daniel Wilson', members: 65, iconLetter: '♪', iconBg: 'bg-[#5B3DF5]', categoryColor: 'text-[#5B3DF5]' },
  { name: 'Sunday School', category: 'Education', leader: 'Sarah Johnson', members: 48, iconLetter: '📖', iconBg: 'bg-green-500', categoryColor: 'text-green-500' },
  { name: 'Outreach Ministry', category: 'Ministry', leader: 'Michael Peters', members: 72, iconLetter: '🎤', iconBg: 'bg-orange-500', categoryColor: 'text-[#5B3DF5]' },
  { name: 'Youth Ministry', category: 'Ministry', leader: 'Emily Davis', members: 84, iconLetter: '♥', iconBg: 'bg-red-500', categoryColor: 'text-[#5B3DF5]' },
  { name: 'Children\'s Ministry', category: 'Ministry', leader: 'Lisa Anderson', members: 61, iconLetter: '👥', iconBg: 'bg-blue-500', categoryColor: 'text-[#5B3DF5]' },
  { name: 'Care & Support', category: 'Ministry', leader: 'James Thompson', members: 38, iconLetter: '♡', iconBg: 'bg-cyan-500', categoryColor: 'text-[#5B3DF5]' },
  { name: 'Finance Department', category: 'Administration', leader: 'Robert Miller', members: 12, iconLetter: '$', iconBg: 'bg-yellow-500', categoryColor: 'text-blue-500' },
  { name: 'Communications', category: 'Administration', leader: 'Olivia Martinez', members: 15, iconLetter: '📢', iconBg: 'bg-purple-500', categoryColor: 'text-blue-500' },
  { name: 'Events Department', category: 'Administration', leader: 'David Brown', members: 18, iconLetter: '📅', iconBg: 'bg-pink-500', categoryColor: 'text-blue-500' },
  { name: 'Administration', category: 'Administration', leader: 'Pastor John', members: 8, iconLetter: '📋', iconBg: 'bg-green-500', categoryColor: 'text-blue-500' },
];

export default function DepartmentsTable() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-gray-100">
        <h2 className="text-lg font-black text-gray-900">All Departments</h2>
      </div>
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Department Name</th>
              <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Department Leader</th>
              <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Members</th>
              <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {departments.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white ${item.iconBg}`}>
                      {item.iconLetter}
                    </div>
                    <span className="text-xs font-bold text-gray-900">{item.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-50 ${item.categoryColor}`}>{item.category}</span>
                </td>
                <td className="px-5 py-4 text-xs font-semibold text-gray-600">{item.leader}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                    {item.members} <User size={12} className="text-gray-400" />
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
                    Active
                  </span>
                </td>
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
        totalPages={2}
        totalCategoriesCount={18}
        pageSize={10}
        onPageChange={() => {}}
        itemName="departments"
      />
    </div>
  );
}
