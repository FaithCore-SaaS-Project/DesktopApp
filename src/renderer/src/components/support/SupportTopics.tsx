import React from 'react';
import { BookOpen, MessageSquare, Clock3, Download } from 'lucide-react';

const topics = [
  { icon: BookOpen, title: "Knowledge Base", desc: "Browse articles and guides to find answers to common questions.", linkText: "Browse Articles", color: "text-[#5B3DF5]" },
  { icon: MessageSquare, title: "Submit a Ticket", desc: "Can't find what you need? Submit a ticket and our team will assist.", linkText: "Submit Ticket", color: "text-green-500" },
  { icon: Clock3, title: "Track Tickets", desc: "View the status of your existing support tickets and responses.", linkText: "View Tickets", color: "text-orange-500" },
  { icon: Download, title: "Downloads", desc: "Access user guides, release notes and other helpful resources.", linkText: "View Downloads", color: "text-blue-500" }
];

export default function SupportTopics() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
      <h2 className="text-lg font-black text-gray-900 mb-1">How can we help you today?</h2>
      <p className="text-gray-500 text-xs font-semibold mb-6">Choose a topic below to get started.</p>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {topics.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow flex flex-col group cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-4 group-hover:bg-white border border-transparent group-hover:border-gray-100 transition-colors">
                <Icon size={20} className={item.color} />
              </div>
              <h3 className="text-[13px] font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-[10px] font-semibold text-gray-500 mb-6 flex-1 leading-relaxed">{item.desc}</p>
              <button className="text-[#5B3DF5] text-[11px] font-bold flex items-center gap-1 group-hover:text-[#4a30db] transition-colors mt-auto text-left w-fit">
                {item.linkText} <span className="font-sans">→</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
