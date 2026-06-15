import React, { useState } from 'react';
import { Star, FileText, ChevronRight, User, Calendar, BookOpen, Receipt } from 'lucide-react';

interface ReportSidebarProps {
  onSelectReportPreset: (name: string) => void;
}

export default function ReportSidebar({ onSelectReportPreset }: ReportSidebarProps) {
  // Popular reports state (for highlighting favorites)
  const [favorites, setFavorites] = useState<Record<string, boolean>>({
    "Income Statement": true
  });

  const toggleFavorite = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const popularReports = [
    {
      name: "Income Statement",
      desc: "Detailed income report",
      icon: Receipt,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      name: "Expense Statement",
      desc: "Detailed expense report",
      icon: FileText,
      color: "text-orange-600 bg-orange-50",
    },
    {
      name: "Profit & Loss Statement",
      desc: "P&L for selected period",
      icon: BookOpen,
      color: "text-blue-600 bg-blue-50",
    },
    {
      name: "Member List",
      desc: "Complete member directory",
      icon: User,
      color: "text-cyan-600 bg-cyan-50",
    },
    {
      name: "Event Attendance",
      desc: "Event attendance summary",
      icon: Calendar,
      color: "text-purple-650 bg-purple-50",
    },
  ];

  const recentActivities = [
    {
      name: "Income Statement - May 2025",
      user: "Pastor John",
      time: "Today, 09:15 AM",
      icon: Receipt,
      color: "text-emerald-600 bg-emerald-50"
    },
    {
      name: "Expense Report - May 2025",
      user: "Pastor John",
      time: "Today, 09:10 AM",
      icon: FileText,
      color: "text-orange-600 bg-orange-50"
    },
    {
      name: "Member List - All Members",
      user: "Sarah Johnson",
      time: "Yesterday, 04:30 PM",
      icon: User,
      color: "text-cyan-600 bg-cyan-50"
    },
    {
      name: "Event Attendance - May 2025",
      user: "Sarah Johnson",
      time: "Yesterday, 04:25 PM",
      icon: Calendar,
      color: "text-purple-605 bg-purple-50"
    }
  ];

  return (
    <div className="space-y-6">
      {/* 1. Popular Reports Card */}
      <div className="bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-gray-100 bg-white">
          <h3 className="font-extrabold text-gray-900 text-sm">
            Popular Reports
          </h3>
        </div>
        <div className="divide-y divide-gray-55/70">
          {popularReports.map((item, index) => {
            const Icon = item.icon;
            const isFav = favorites[item.name] || false;
            return (
              <div
                key={index}
                onClick={() => onSelectReportPreset(item.name)}
                className="flex items-center justify-between p-4 hover:bg-gray-55/45 cursor-pointer transition-colors group select-none"
              >
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${item.color}`}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-805 block group-hover:text-[#5B3DF5] transition-colors">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">
                      {item.desc}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => toggleFavorite(item.name, e)}
                  className="p-1 hover:bg-gray-100 rounded-lg text-gray-300 hover:text-amber-500 transition-colors"
                >
                  <Star
                    size={14}
                    className={isFav ? "text-amber-500 fill-amber-500" : ""}
                  />
                </button>
              </div>
            );
          })}
        </div>
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 text-center">
          <button
            type="button"
            className="text-xs font-bold text-[#5B3DF5] hover:text-[#4a30db]"
          >
            View All Reports →
          </button>
        </div>
      </div>

      {/* 2. Recent Report Activity Card */}
      <div className="bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-gray-100 bg-white">
          <h3 className="font-extrabold text-gray-900 text-sm">
            Recent Report Activity
          </h3>
        </div>
        <div className="divide-y divide-gray-55/70">
          {recentActivities.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="p-4 hover:bg-gray-55/45 transition-colors select-none"
              >
                <div className="flex items-start gap-3">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center mt-0.5 ${item.color}`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-gray-850 block truncate">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">
                      Generated by {item.user}
                    </span>
                    <span className="text-[9px] text-gray-440 font-bold block mt-1.5 text-right">
                      {item.time}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 text-center">
          <button
            type="button"
            className="text-xs font-bold text-[#5B3DF5] hover:text-[#4a30db]"
          >
            View All Activity →
          </button>
        </div>
      </div>
    </div>
  );
}
