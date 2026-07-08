import React from 'react';
import { Upload, FolderPlus, Tags, Trash2, FileText, FileSpreadsheet, Presentation, FileCode } from 'lucide-react';

const getRecentFileIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.endsWith('.pdf')) {
    return { icon: FileText, colors: 'bg-rose-50 text-rose-600 border-rose-100/50' };
  }
  if (n.endsWith('.docx') || n.endsWith('.doc')) {
    return { icon: FileText, colors: 'bg-blue-50 text-blue-600 border-blue-100/50' };
  }
  if (n.endsWith('.xlsx') || n.endsWith('.xls')) {
    return { icon: FileSpreadsheet, colors: 'bg-emerald-50 text-emerald-600 border-emerald-100/50' };
  }
  if (n.endsWith('.pptx') || n.endsWith('.ppt')) {
    return { icon: Presentation, colors: 'bg-amber-50 text-amber-600 border-amber-100/50' };
  }
  return { icon: FileCode, colors: 'bg-slate-50 text-slate-600 border-slate-100/50' };
};

// Calculate size dynamically from documents
const parseSizeToMB = (sizeStr: string): number => {
  const match = sizeStr.match(/^([\d.]+)\s*(MB|KB|GB|B)$/i);
  if (!match) return 0;
  const value = parseFloat(match[1]);
  const unit = match[2].toUpperCase();
  if (unit === 'GB') return value * 1024;
  if (unit === 'KB') return value / 1024;
  if (unit === 'B') return value / (1024 * 1024);
  return value; // MB
};

interface DocumentsSidebarProps {
  documents: any[];
  onUploadClick: () => void;
}

export default function DocumentsSidebar({ documents, onUploadClick }: DocumentsSidebarProps) {
  // Storage logic: Base 6.4 GB + dynamic size from uploaded docs
  const totalUploadedMB = documents.reduce((acc, doc) => acc + parseSizeToMB(doc.size), 0);
  const totalUploadedGB = totalUploadedMB / 1024;
  const usedGB = Math.min(9.9, 6.4 + totalUploadedGB);
  const availableGB = Math.max(0.1, 10 - usedGB);
  const usedPercentage = Math.min(100, Math.round((usedGB / 10) * 100));

  // Dynamic Category counts
  const categoryCounts: Record<string, number> = {
    Legal: 24,
    Forms: 72,
    Finance: 38,
    Ministry: 56,
    Events: 41,
    Policy: 12,
    Others: 97,
  };

  // Add dynamic documents into category counts
  documents.forEach((doc) => {
    const cat = doc.category || 'Others';
    if (categoryCounts[cat] !== undefined) {
      categoryCounts[cat]++;
    } else {
      categoryCounts.Others++;
    }
  });

  const categories = [
    { name: 'Legal Documents', count: categoryCounts.Legal, color: 'text-rose-500', bg: 'bg-rose-50' },
    { name: 'Finance', count: categoryCounts.Finance, color: 'text-blue-500', bg: 'bg-blue-50' },
    { name: 'Ministry', count: categoryCounts.Ministry, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { name: 'Forms', count: categoryCounts.Forms, color: 'text-amber-500', bg: 'bg-amber-50' },
    { name: 'Events', count: categoryCounts.Events, color: 'text-pink-500', bg: 'bg-pink-50' },
    { name: 'Others', count: categoryCounts.Others, color: 'text-slate-500', bg: 'bg-slate-50' }
  ];

  // Latest 3 uploads
  const recentUploads = documents.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Storage Overview */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-5">Storage Overview</h3>
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 shrink-0">
            {/* Donut SVG */}
            <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
              <path
                className="text-slate-100"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#5B3DF5]"
                strokeWidth="3.5"
                strokeDasharray={`${usedPercentage}, 100`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-black text-[#5B3DF5]">{usedPercentage}%</span>
              <span className="text-[8px] font-bold text-slate-400">of 10 GB used</span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#5B3DF5]" />
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Used</p>
                <p className="text-xs font-black text-slate-800">{usedGB.toFixed(2)} GB</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-slate-200" />
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Available</p>
                <p className="text-xs font-black text-slate-800">{availableGB.toFixed(2)} GB</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-4">Quick Actions</h3>
        <div className="space-y-1">
          <button
            onClick={onUploadClick}
            className="w-full flex items-center gap-3 py-2.5 px-3 text-xs font-bold text-slate-600 hover:text-[#5B3DF5] hover:bg-slate-50 border-l-2 border-transparent hover:border-[#5B3DF5] rounded-r-xl transition-all text-left cursor-pointer active:translate-x-0.5"
          >
            <Upload size={14} className="text-slate-500" />
            Upload Document
          </button>
          <button className="w-full flex items-center gap-3 py-2.5 px-3 text-xs font-bold text-slate-600 hover:text-[#5B3DF5] hover:bg-slate-50 border-l-2 border-transparent hover:border-[#5B3DF5] rounded-r-xl transition-all text-left cursor-pointer active:translate-x-0.5">
            <FolderPlus size={14} className="text-slate-500" />
            Create New Folder
          </button>
          <button className="w-full flex items-center gap-3 py-2.5 px-3 text-xs font-bold text-slate-600 hover:text-[#5B3DF5] hover:bg-slate-50 border-l-2 border-transparent hover:border-[#5B3DF5] rounded-r-xl transition-all text-left cursor-pointer active:translate-x-0.5">
            <Tags size={14} className="text-slate-500" />
            Manage Categories
          </button>
          <button className="w-full flex items-center gap-3 py-2.5 px-3 text-xs font-bold text-slate-600 hover:text-red-500 hover:bg-red-50/50 border-l-2 border-transparent hover:border-red-500 rounded-r-xl transition-all text-left cursor-pointer active:translate-x-0.5">
            <Trash2 size={14} className="text-slate-500 hover:text-red-500" />
            Recycle Bin
          </button>
        </div>
      </div>

      {/* Document Categories */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Categories</h3>
          <button className="text-[10px] font-bold text-[#5B3DF5] hover:underline cursor-pointer">View All</button>
        </div>
        <div className="space-y-3.5">
          {categories.map((cat, i) => (
            <div key={i} className="flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-2.5">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center border border-slate-100/50 ${cat.bg} group-hover:scale-105 transition-transform`}>
                  <FolderPlus size={12} className={cat.color} />
                </div>
                <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{cat.name}</span>
              </div>
              <span className="text-[9px] font-black bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full group-hover:bg-[#5B3DF5] group-hover:text-white transition-all">
                {cat.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Uploads */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Recent Uploads</h3>
          <button className="text-[10px] font-bold text-[#5B3DF5] hover:underline cursor-pointer">View All</button>
        </div>
        <div className="space-y-4">
          {recentUploads.map((item, i) => {
            const iconInfo = getRecentFileIcon(item.name);
            const FileIcon = iconInfo.icon;
            return (
              <div key={i} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-2 overflow-hidden pr-2">
                  <div className={`w-7 h-7 shrink-0 rounded-lg flex items-center justify-center border font-bold text-[10px] ${iconInfo.colors} shadow-sm transition-transform group-hover:scale-105`}>
                    <FileIcon size={12} />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 truncate group-hover:text-[#5B3DF5] transition-colors">{item.name}</span>
                </div>
                <span className="text-[9px] font-semibold text-slate-400 shrink-0">{item.date}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
