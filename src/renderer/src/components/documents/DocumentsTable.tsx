import React from 'react';
import { Download, Trash2, FileText, FileSpreadsheet, Presentation, FileCode } from 'lucide-react';
import CategoriesPagination from '../finance/categories/CategoriesPagination';

const categoryColors: Record<string, { bg: string, text: string }> = {
  Legal: { bg: 'bg-rose-50 border-rose-100/50', text: 'text-rose-600' },
  Forms: { bg: 'bg-sky-50 border-sky-100/50', text: 'text-sky-600' },
  Finance: { bg: 'bg-emerald-50 border-emerald-100/50', text: 'text-emerald-600' },
  Ministry: { bg: 'bg-violet-50 border-violet-100/50', text: 'text-violet-600' },
  Training: { bg: 'bg-amber-50 border-amber-100/50', text: 'text-amber-600' },
  Events: { bg: 'bg-pink-50 border-pink-100/50', text: 'text-pink-600' },
  Policy: { bg: 'bg-slate-100 border-slate-200/50', text: 'text-slate-600' },
};

const getFileTypeIcon = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes('pdf')) {
    return {
      icon: FileText,
      colors: 'bg-rose-50 text-rose-600 border-rose-100/50',
    };
  }
  if (t.includes('doc') || t.includes('docx')) {
    return {
      icon: FileText,
      colors: 'bg-blue-50 text-blue-600 border-blue-100/50',
    };
  }
  if (t.includes('xls') || t.includes('xlsx') || t.includes('csv')) {
    return {
      icon: FileSpreadsheet,
      colors: 'bg-emerald-50 text-emerald-600 border-emerald-100/50',
    };
  }
  if (t.includes('ppt') || t.includes('pptx')) {
    return {
      icon: Presentation,
      colors: 'bg-amber-50 text-amber-600 border-amber-100/50',
    };
  }
  return {
    icon: FileCode,
    colors: 'bg-slate-50 text-slate-600 border-slate-100/50',
  };
};

interface DocumentsTableProps {
  documents: any[];
  onDelete: (name: string) => void;
}

export default function DocumentsTable({ documents, onDelete }: DocumentsTableProps) {
  return (
    <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
        <h2 className="text-base font-black text-slate-800">All Documents</h2>
        <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
          Total {documents.length} items
        </span>
      </div>
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Document Name</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">File Type</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Uploaded By</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Uploaded Date</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Size</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {documents.map((item, index) => {
              const fileTypeInfo = getFileTypeIcon(item.type);
              const FileIcon = fileTypeInfo.icon;
              const catColors = categoryColors[item.category] || { bg: 'bg-slate-50 border-slate-100', text: 'text-slate-600' };

              return (
                <tr
                  key={index}
                  className="hover:bg-slate-50/70 transition-all duration-150 group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center border font-bold text-xs ${fileTypeInfo.colors} shadow-sm shrink-0 transition-transform group-hover:scale-105`}>
                        <FileIcon size={14} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-800 group-hover:text-[#5B3DF5] transition-colors">
                          {item.name}
                        </span>
                        <span className="text-[9px] text-slate-400 font-semibold md:hidden">
                          {item.size} • {item.type}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${catColors.bg} ${catColors.text}`}>
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-500">{item.type}</td>
                  <td className="px-6 py-4 text-xs font-semibold text-slate-600">{item.uploader}</td>
                  <td className="px-6 py-4 text-xs font-semibold text-slate-400">{item.date}</td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-700">{item.size}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${item.status === 'Public' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100/50' : 'bg-blue-50 text-blue-700 border border-blue-100/50'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer active:scale-95 shadow-sm shadow-slate-100">
                        <Download size={13} />
                      </button>
                      <button
                        onClick={() => onDelete(item.name)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer border border-slate-100 active:scale-95 shadow-sm shadow-slate-100 bg-white"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-slate-100 bg-slate-50/20">
        <CategoriesPagination
          currentPage={1}
          totalPages={Math.max(1, Math.ceil(documents.length / 10))}
          totalCategoriesCount={documents.length}
          pageSize={10}
          onPageChange={() => {}}
          itemName="documents"
        />
      </div>
    </div>
  );
}
