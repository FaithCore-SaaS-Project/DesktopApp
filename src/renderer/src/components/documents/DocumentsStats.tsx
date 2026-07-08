import React from 'react';
import { FileText, Upload, Star, Folder, Download } from 'lucide-react';

const stats = [
  {
    title: 'Total Documents',
    value: '328',
    subtitle: 'All time uploads',
    icon: FileText,
    themeColor: 'indigo',
    iconColor: 'text-indigo-600',
    iconBg: 'bg-indigo-50 border-indigo-100/50',
    borderHover: 'hover:border-indigo-200/60',
  },
  {
    title: 'Uploaded Documents',
    value: '276',
    subtitle: '84.1% of total storage',
    icon: Upload,
    themeColor: 'emerald',
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50 border-emerald-100/50',
    borderHover: 'hover:border-emerald-200/60',
  },
  {
    title: 'Important Documents',
    value: '52',
    subtitle: '15.9% starred items',
    icon: Star,
    themeColor: 'violet',
    iconColor: 'text-violet-600',
    iconBg: 'bg-violet-50 border-violet-100/50',
    borderHover: 'hover:border-violet-200/60',
  },
  {
    title: 'Categories',
    value: '12',
    subtitle: 'Active file folders',
    icon: Folder,
    themeColor: 'amber',
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-50 border-amber-100/50',
    borderHover: 'hover:border-amber-200/60',
  },
  {
    title: 'Total Downloads',
    value: '1,248',
    subtitle: 'Downloaded this year',
    icon: Download,
    themeColor: 'cyan',
    iconColor: 'text-cyan-600',
    iconBg: 'bg-cyan-50 border-cyan-100/50',
    borderHover: 'hover:border-cyan-200/60',
  },
];

export default function DocumentsStats() {
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
