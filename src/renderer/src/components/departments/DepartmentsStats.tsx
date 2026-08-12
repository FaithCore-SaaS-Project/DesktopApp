import React from 'react';
import { Building2, Users, UserCog, CalendarDays } from 'lucide-react';

interface DepartmentsStatsProps {
  departments: any[];
}

export default function DepartmentsStats({ departments }: DepartmentsStatsProps) {
  const totalDepts = departments.length;
  const activeDepts = departments.filter(d => d.status === 'Active').length;
  const activePercentage = totalDepts > 0 ? ((activeDepts / totalDepts) * 100).toFixed(1) : '0';
  
  const totalMembers = departments.reduce((acc, d) => acc + (d.members || 0), 0);
  
  const uniqueLeaders = new Set(
    departments
      .map(d => d.leader)
      .filter(l => l && l !== 'No Leader' && l !== 'Assigned Leader')
  ).size;

  const totalActivities = departments.reduce((acc, d) => acc + Math.round((d.members || 0) * 1.3), 0);

  const stats = [
    {
      title: 'Total Departments',
      value: totalDepts.toString(),
      subtitle: 'Registered departments',
      icon: Building2,
      themeColor: 'indigo',
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-50 border-indigo-100/50',
      borderHover: 'hover:border-indigo-200/60',
    },
    {
      title: 'Active Departments',
      value: activeDepts.toString(),
      subtitle: `${activePercentage}% of total`,
      icon: Users,
      themeColor: 'emerald',
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50 border-emerald-100/50',
      borderHover: 'hover:border-emerald-200/60',
    },
    {
      title: 'Total Members',
      value: totalMembers.toLocaleString(),
      subtitle: 'Across all groups',
      icon: Users,
      themeColor: 'amber',
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50 border-amber-100/50',
      borderHover: 'hover:border-amber-200/60',
    },
    {
      title: 'Department Leaders',
      value: uniqueLeaders.toString(),
      subtitle: 'Assigned directors',
      icon: UserCog,
      themeColor: 'violet',
      iconColor: 'text-violet-600',
      iconBg: 'bg-violet-50 border-violet-100/50',
      borderHover: 'hover:border-violet-200/60',
    },
    {
      title: 'Total Activities',
      value: totalActivities.toString(),
      subtitle: 'Events scheduled this year',
      icon: CalendarDays,
      themeColor: 'cyan',
      iconColor: 'text-cyan-600',
      iconBg: 'bg-cyan-50 border-cyan-100/50',
      borderHover: 'hover:border-cyan-200/60',
    },
  ];

  return (
    <div className="grid lg:grid-cols-5 gap-4 mb-6">
      {stats.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className={`bg-white border border-slate-100 rounded-3xl p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer ${item.borderHover}`}
          >
            <div className="flex flex-col gap-4">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${item.iconBg} ${item.iconColor} shrink-0`}
              >
                <Icon size={18} />
              </div>
              <div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">{item.title}</p>
                <h3 className="text-2xl font-black text-slate-800 leading-none mb-1.5">{item.value}</h3>
                <p className="text-[10px] font-semibold text-slate-500">
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
