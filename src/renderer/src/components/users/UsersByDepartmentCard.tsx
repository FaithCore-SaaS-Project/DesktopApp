import React from 'react';

interface UsersByDepartmentCardProps {
  users: any[];
}

export default function UsersByDepartmentCard({ users = [] }: UsersByDepartmentCardProps) {
  const departments = [
    { name: "System Users", count: users.length, width: "100%", color: "bg-[#5B3DF5]" }
  ];

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-sm font-black text-gray-900">Users by Department</h3>
        <button className="text-[#5B3DF5] text-[11px] font-bold hover:text-[#4a30db] transition-colors cursor-pointer">View All</button>
      </div>
      <div className="space-y-4">
        {departments.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[11px] font-bold text-gray-700">{item.name}</span>
              <span className="text-[11px] font-black text-gray-900">{item.count}</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full ${item.color} rounded-full`} style={{ width: item.width }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
