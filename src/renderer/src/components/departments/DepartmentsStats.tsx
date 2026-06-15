import React from 'react';
import { Building2, Users, UserCog, CalendarDays } from 'lucide-react';

const stats = [
  {
    title: 'Total Departments',
    value: '18',
    subtitle: 'All departments',
    icon: Building2,
    iconBg: 'bg-[#5B3DF5]',
  },
  {
    title: 'Active Departments',
    value: '16',
    subtitle: '88.9% of total',
    subtitleColor: 'text-green-500',
    icon: Users,
    iconBg: 'bg-green-500',
  },
  {
    title: 'Total Members',
    value: '742',
    subtitle: 'Across all departments',
    subtitleColor: 'text-blue-500',
    icon: Users,
    iconBg: 'bg-orange-500',
  },
  {
    title: 'Department Leaders',
    value: '27',
    subtitle: 'Assigned leaders',
    icon: UserCog,
    iconBg: 'bg-blue-600',
  },
  {
    title: 'Total Activities',
    value: '86',
    subtitle: 'This year',
    icon: CalendarDays,
    iconBg: 'bg-cyan-500',
  },
];

export default function DepartmentsStats() {
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
