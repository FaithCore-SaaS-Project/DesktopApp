import React from 'react';

const statuses = [
  { label: "Active", count: 7, color: "bg-green-500" },
  { label: "Inactive", count: 1, color: "bg-gray-400" },
  { label: "Archived", count: 0, color: "bg-red-500" },
];

export default function RoleStatusCard() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
      <h3 className="text-sm font-black text-gray-900 mb-5">Role Status</h3>
      <div className="space-y-4">
        {statuses.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full shadow-sm ${item.color}`} />
              <span className="text-[12px] font-bold text-gray-700">{item.label}</span>
            </div>
            <span className="text-[12px] font-black text-gray-900">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
