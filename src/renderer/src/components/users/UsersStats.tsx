import React from 'react';
import { Users, UserCheck, Shield, Crown, KeyRound } from 'lucide-react';

const stats = [
  {
    title: 'Total Users',
    value: '86',
    subtitle: 'All users',
    icon: Users,
    iconBg: 'bg-[#5B3DF5]',
  },
  {
    title: 'Active Users',
    value: '74',
    subtitle: '86.0% of total',
    subtitleColor: 'text-green-500',
    icon: UserCheck,
    iconBg: 'bg-green-500',
  },
  {
    title: 'Inactive Users',
    value: '12',
    subtitle: '14.0% of total',
    subtitleColor: 'text-blue-500',
    icon: Shield,
    iconBg: 'bg-blue-600',
  },
  {
    title: 'Total Roles',
    value: '8',
    subtitle: 'All roles',
    icon: Crown,
    iconBg: 'bg-amber-500',
  },
  {
    title: 'Super Admins',
    value: '2',
    subtitle: 'Full access',
    icon: KeyRound,
    iconBg: 'bg-teal-500',
  },
];

export default function UsersStats() {
  return (
    <div className="grid lg:grid-cols-5 gap-4 mb-6">
      {stats.map((item, index) => {
        const Icon = item.icon;
        return (
          <div key={index} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex gap-4">
              <div
                className={`${item.iconBg} w-12 h-12 rounded-full flex items-center justify-center text-white shrink-0`}
              >
                <Icon size={20} />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-gray-500 text-xs font-semibold mb-1">{item.title}</p>
                <h3 className="text-2xl font-black text-gray-900 leading-none mb-1">{item.value}</h3>
                <p className={`text-[10px] font-bold ${item.subtitleColor || 'text-gray-400'}`}>
                  {item.subtitle}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
