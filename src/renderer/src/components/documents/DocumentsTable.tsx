import React from 'react';
import { Download, MoreHorizontal } from 'lucide-react';
import CategoriesPagination from '../finance/categories/CategoriesPagination';

const documents = [
  { name: 'Church Constitution.pdf', category: 'Legal', type: 'PDF', uploader: 'Pastor John', date: '24 May 2025', size: '1.2 MB', status: 'Public', iconBg: 'bg-red-100', iconText: 'text-red-500', iconLetter: 'P' },
  { name: 'Membership Application Form.docx', category: 'Forms', type: 'DOCX', uploader: 'Sarah Johnson', date: '23 May 2025', size: '245 KB', status: 'Public', iconBg: 'bg-blue-100', iconText: 'text-blue-500', iconLetter: 'W' },
  { name: '2025 Budget Plan.xlsx', category: 'Finance', type: 'XLSX', uploader: 'Pastor John', date: '22 May 2025', size: '512 KB', status: 'Public', iconBg: 'bg-green-100', iconText: 'text-green-500', iconLetter: 'X' },
  { name: 'Baptism Guidelines.pdf', category: 'Ministry', type: 'PDF', uploader: 'Michael Peters', date: '20 May 2025', size: '890 KB', status: 'Public', iconBg: 'bg-red-100', iconText: 'text-red-500', iconLetter: 'P' },
  { name: 'New Member Orientation.pptx', category: 'Training', type: 'PPTX', uploader: 'Sarah Johnson', date: '19 May 2025', size: '3.4 MB', status: 'Private', iconBg: 'bg-orange-100', iconText: 'text-orange-500', iconLetter: 'P' },
  { name: 'Event Planning Checklist.pdf', category: 'Events', type: 'PDF', uploader: 'Emily Davis', date: '18 May 2025', size: '678 KB', status: 'Public', iconBg: 'bg-red-100', iconText: 'text-red-500', iconLetter: 'P' },
  { name: 'Volunteer Agreement Form.docx', category: 'Forms', type: 'DOCX', uploader: 'Sarah Johnson', date: '17 May 2025', size: '310 KB', status: 'Public', iconBg: 'bg-blue-100', iconText: 'text-blue-500', iconLetter: 'W' },
  { name: 'Tithe Summary - April 2025.xlsx', category: 'Finance', type: 'XLSX', uploader: 'Pastor John', date: '16 May 2025', size: '420 KB', status: 'Private', iconBg: 'bg-green-100', iconText: 'text-green-500', iconLetter: 'X' },
  { name: 'Child Protection Policy.pdf', category: 'Policy', type: 'PDF', uploader: 'Michael Peters', date: '15 May 2025', size: '1.1 MB', status: 'Public', iconBg: 'bg-red-100', iconText: 'text-red-500', iconLetter: 'P' },
  { name: 'Mission Trip Presentation.pptx', category: 'Ministry', type: 'PPTX', uploader: 'Daniel Wilson', date: '14 May 2025', size: '2.3 MB', status: 'Public', iconBg: 'bg-orange-100', iconText: 'text-orange-500', iconLetter: 'P' }
];

const categoryColors: Record<string, string> = {
  Legal: 'text-red-600',
  Forms: 'text-blue-600',
  Finance: 'text-green-600',
  Ministry: 'text-purple-600',
  Training: 'text-orange-600',
  Events: 'text-pink-600',
  Policy: 'text-gray-600',
};

export default function DocumentsTable() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-gray-100">
        <h2 className="text-lg font-black text-gray-900">All Documents</h2>
      </div>
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Document Name</th>
              <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">File Type</th>
              <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Uploaded By</th>
              <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Uploaded Date</th>
              <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Size</th>
              <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {documents.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded flex items-center justify-center font-bold text-xs ${item.iconBg} ${item.iconText}`}>
                      {item.iconLetter}
                    </div>
                    <span className="text-xs font-bold text-gray-900">{item.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className={`text-[11px] font-bold ${categoryColors[item.category] || 'text-gray-600'}`}>{item.category}</span>
                </td>
                <td className="px-5 py-4 text-xs font-semibold text-gray-600">{item.type}</td>
                <td className="px-5 py-4 text-xs font-semibold text-gray-600">{item.uploader}</td>
                <td className="px-5 py-4 text-xs font-semibold text-gray-600">{item.date}</td>
                <td className="px-5 py-4 text-xs font-semibold text-gray-600">{item.size}</td>
                <td className="px-5 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${item.status === 'Public' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors">
                      <Download size={14} />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors border border-gray-200 rounded hover:bg-gray-50">
                      <MoreHorizontal size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <CategoriesPagination
        currentPage={1}
        totalPages={33}
        totalCategoriesCount={328}
        pageSize={10}
        onPageChange={() => {}}
        itemName="documents"
      />
    </div>
  );
}
