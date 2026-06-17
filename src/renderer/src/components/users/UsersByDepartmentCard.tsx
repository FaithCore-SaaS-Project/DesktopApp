import React from 'react';

const departments = [
  { name: "Administration", count: 12, width: "80%", color: "bg-blue-500" },
  { name: "Education", count: 10, width: "70%", color: "bg-cyan-500" },
  { name: "Outreach Ministry", count: 8, width: "60%", color: "bg-[#5B3DF5]" },
  { name: "Events Department", count: 7, width: "55%", color: "bg-orange-500" },
  { name: "Finance Department", count: 6, width: "50%", color: "bg-green-500" },
  { name: "Others", count: 43, width: "95%", color: "bg-gray-400" }
];

export default function UsersByDepartmentCard() {
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
