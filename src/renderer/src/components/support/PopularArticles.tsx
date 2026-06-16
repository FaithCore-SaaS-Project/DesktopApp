import React from 'react';
import { FileText } from 'lucide-react';

const articles = [
  "Getting Started with Kingdom Connect",
  "How to Add a New Member",
  "Managing Donations and Payments",
  "Setting Up Email Notifications",
  "Running Reports"
];

export default function PopularArticles() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
      <h3 className="text-sm font-black text-gray-900 mb-4">Popular Articles</h3>
      <div className="space-y-3">
        {articles.map((item, index) => (
          <div key={index} className="flex items-start gap-2.5 group cursor-pointer">
            <FileText size={14} className="text-[#5B3DF5] shrink-0 mt-0.5 opacity-70 group-hover:opacity-100 transition-opacity" />
            <p className="text-[11px] font-bold text-gray-600 group-hover:text-[#5B3DF5] transition-colors leading-snug">
              {item}
            </p>
          </div>
        ))}
      </div>
      <button className="text-[#5B3DF5] text-[11px] font-bold mt-5 flex items-center gap-1 hover:text-[#4a30db] transition-colors cursor-pointer">
        View all articles <span className="font-sans">→</span>
      </button>
    </div>
  );
}
