import React from 'react';

interface ActivityItem {
  date: string;
  activity: string;
  details: string;
  by: string;
}

interface RecentActivitiesProps {
  memberId: string;
  memberName: string;
}

export default function RecentActivities({ memberId, memberName }: RecentActivitiesProps) {
  // Mock activity records linked to this member
  const activities: ActivityItem[] = [
    {
      date: "24 May 2025",
      activity: "E-Receipt Issued",
      details: `RCP-2025-${memberId.replace('mem-', '10')}`,
      by: "Admin User"
    },
    {
      date: "12 Mar 2025",
      activity: "Certificate Generated",
      details: "Holy Baptism Certificate",
      by: "Pastor Thomas J. Miller"
    },
    {
      date: "15 Jan 2025",
      activity: "Profile Registered",
      details: "Registered to New York Grace Community",
      by: "System Admin"
    }
  ];

  return (
    <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-sm mt-6">
      <h2 className="text-xl font-extrabold text-gray-900 mb-6">
        Recent Activities
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-400">
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Activity</th>
              <th className="py-3 px-4">Details</th>
              <th className="py-3 px-4">Performed By</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm font-medium text-gray-600">
            {activities.map((act, index) => (
              <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-4 text-gray-900 font-semibold">{act.date}</td>
                <td className="py-4 px-4">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                    act.activity.includes('Receipt') 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      : act.activity.includes('Certificate')
                      ? 'bg-amber-50 text-amber-700 border border-amber-100'
                      : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                  }`}>
                    {act.activity}
                  </span>
                </td>
                <td className="py-4 px-4 font-mono text-xs">{act.details}</td>
                <td className="py-4 px-4 text-gray-500">{act.by}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
