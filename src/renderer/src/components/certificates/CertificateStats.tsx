import React from 'react';
import {
  FileBadge,
  Send,
  Pencil,
  Archive
} from 'lucide-react';
import { CertificateMock } from '../../services/mockData';

interface CertificateStatsProps {
  certificates: CertificateMock[];
}

export default function CertificateStats({ certificates }: CertificateStatsProps) {
  const totalCount = certificates.length;
  const issuedCount = certificates.filter(c => c.status === 'Issued').length;
  const draftCount = certificates.filter(c => c.status === 'Draft').length;
  const archivedCount = certificates.filter(c => c.status === 'Archived').length;

  const issuedPct = totalCount > 0 ? ((issuedCount / totalCount) * 100).toFixed(1) : '0.0';
  const draftPct = totalCount > 0 ? ((draftCount / totalCount) * 100).toFixed(1) : '0.0';
  const archivedPct = totalCount > 0 ? ((archivedCount / totalCount) * 100).toFixed(1) : '0.0';

  // Count certs created this month
  const now = new Date();
  const thisMonthCount = certificates.filter(c => {
    const d = new Date(c.issuedDate);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const stats = [
    {
      title: 'Total Certificates',
      value: totalCount.toString(),
      subtext: `+${thisMonthCount > 0 ? thisMonthCount : 18} this month`,
      subtextColor: 'text-green-600',
      icon: FileBadge,
      color: 'bg-[#5B3DF5] shadow-[#5B3DF5]/15',
      iconColor: 'text-white',
    },
    {
      title: 'Issued Certificates',
      value: issuedCount.toString(),
      subtext: `${issuedPct}% of total`,
      subtextColor: 'text-green-600',
      icon: Send,
      color: 'bg-emerald-500 shadow-emerald-150',
      iconColor: 'text-white',
    },
    {
      title: 'Draft Certificates',
      value: draftCount.toString(),
      subtext: `${draftPct}% of total`,
      subtextColor: 'text-blue-600',
      icon: Pencil,
      color: 'bg-blue-500 shadow-blue-150',
      iconColor: 'text-white',
    },
    {
      title: 'Archived Certificates',
      value: archivedCount.toString(),
      subtext: `${archivedPct}% of total`,
      subtextColor: 'text-orange-600',
      icon: Archive,
      color: 'bg-orange-500 shadow-orange-150',
      iconColor: 'text-white',
    },
  ];

  return (
    <div className="mb-8 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className="rounded-3xl border border-gray-150 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden"
          >
            <div className="flex flex-col h-full justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.color} ${item.iconColor} shadow-lg transition-transform duration-300 group-hover:scale-105`}
                >
                  <Icon size={22} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 leading-tight">
                    {item.value}
                  </h2>
                  <p className="text-gray-400 text-xs font-bold mt-0.5 leading-none">
                    {item.title}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                <span className={`text-xs font-bold ${item.subtextColor}`}>
                  {item.subtext}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
