import React from 'react';
import { FileText, Upload, Star, Folder, Download } from 'lucide-react';

const stats = [
  {
    title: 'Total Documents',
    value: '328',
    subtitle: 'All time',
    icon: FileText,
    iconBg: 'bg-[#5B3DF5]',
  },
  {
    title: 'Uploaded Documents',
    value: '276',
    subtitle: '84.1% of total',
    subtitleColor: 'text-green-500',
    icon: Upload,
    iconBg: 'bg-green-500',
  },
  {
    title: 'Important Documents',
    value: '52',
    subtitle: '15.9% of total',
    subtitleColor: 'text-[#5B3DF5]',
    icon: Star,
    iconBg: 'bg-blue-600',
  },
  {
    title: 'Categories',
    value: '12',
    subtitle: 'All categories',
    icon: Folder,
    iconBg: 'bg-amber-500',
  },
  {
    title: 'Total Downloads',
    value: '1,248',
    subtitle: 'This year',
    icon: Download,
    iconBg: 'bg-cyan-500',
  },
];

export default function DocumentsStats() {
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
