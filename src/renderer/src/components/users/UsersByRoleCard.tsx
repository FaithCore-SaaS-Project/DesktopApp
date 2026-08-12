import React from 'react';
import { Crown, ShieldCheck, Users, Calendar, DollarSign, Heart, Eye } from 'lucide-react';

interface UsersByRoleCardProps {
  users: any[];
}

export default function UsersByRoleCard({ users = [] }: UsersByRoleCardProps) {
  const roleCounts: Record<string, number> = {};
  users.forEach(u => {
    const rName = u.roles?.[0]?.name || 'Member';
    roleCounts[rName] = (roleCounts[rName] || 0) + 1;
  });

  const roles = Object.keys(roleCounts).map(name => ({
    name,
    count: roleCounts[name],
    icon: Users,
    color: "text-blue-500"
  })).sort((a, b) => b.count - a.count);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-sm font-black text-gray-900">Users by Role</h3>
        <button className="text-[#5B3DF5] text-[11px] font-bold hover:text-[#4a30db] transition-colors cursor-pointer">View All</button>
      </div>
      <div className="space-y-4">
        {roles.map((role, index) => {
          const Icon = role.icon;
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center bg-gray-50 border border-gray-100 shrink-0`}>
                  <Icon size={12} className={role.color} />
                </div>
                <span className="text-[12px] font-bold text-gray-700">{role.name}</span>
              </div>
              <span className="text-[12px] font-black text-gray-900">{role.count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
