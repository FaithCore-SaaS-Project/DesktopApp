import React from 'react';
import {
  ChevronRight,
  TrendingUp,
  Users,
  Heart,
  Calendar,
  Activity,
  PieChart,
  Briefcase,
  FileText,
  Star
} from 'lucide-react';

interface ReportCategoriesProps {
  activeCategory: string;
  onCategorySelect: (cat: string) => void;
  onManageSaved: () => void;
}

export default function ReportCategories({
  activeCategory,
  onCategorySelect,
  onManageSaved
}: ReportCategoriesProps) {
  const categories = [
    {
      name: "Financial Reports",
      subtext: "Income, Expenses, Profit & Loss",
      icon: TrendingUp,
      color: "text-purple-600 bg-purple-50",
    },
    {
      name: "Membership Reports",
      subtext: "Members, Families, Attendance",
      icon: Users,
      color: "text-blue-600 bg-blue-50",
    },
    {
      name: "Giving & Donations Reports",
      subtext: "Donations, Offerings, Pledges",
      icon: Heart,
      color: "text-rose-500 bg-rose-50",
    },
    {
      name: "Event Reports",
      subtext: "Events, Registrations, Attendance",
      icon: Calendar,
      color: "text-indigo-600 bg-indigo-50",
    },
    {
      name: "Ministry Reports",
      subtext: "Ministries, Groups, Activities",
      icon: Activity,
      color: "text-teal-600 bg-teal-50",
    },
    {
      name: "Budget Reports",
      subtext: "Budgets, Variance, Performance",
      icon: PieChart,
      color: "text-amber-600 bg-amber-50",
    },
    {
      name: "Bank & Account Reports",
      subtext: "Accounts, Transactions, Balances",
      icon: Briefcase,
      color: "text-cyan-600 bg-cyan-50",
    },
    {
      name: "Custom Reports",
      subtext: "Saved & custom generated reports",
      icon: FileText,
      color: "text-gray-600 bg-gray-50",
    },
  ];

  return (
    <div className="bg-white border border-gray-150 rounded-3xl shadow-sm overflow-hidden flex flex-col justify-between h-full">
      <div>
        <div className="p-5 border-b border-gray-100 bg-white">
          <h2 className="font-extrabold text-gray-900 text-lg">
            Report Categories
          </h2>
        </div>
        <div className="divide-y divide-gray-50">
          {categories.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeCategory === item.name;
            return (
              <div
                key={index}
                onClick={() => onCategorySelect(item.name)}
                className={`flex justify-between items-center p-4 border-l-4 transition-all duration-200 cursor-pointer select-none ${
                  isActive
                    ? "bg-indigo-50/20 border-l-[#5B3DF5] hover:bg-indigo-50/35"
                    : "border-l-transparent hover:bg-gray-55/45"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${item.color}`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <span className={`text-xs font-bold text-gray-805 block ${isActive ? "text-[#5B3DF5]" : ""}`}>
                      {item.name}
                    </span>
                    <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">
                      {item.subtext}
                    </span>
                  </div>
                </div>
                <ChevronRight size={14} className="text-gray-400" />
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <button
          type="button"
          onClick={onManageSaved}
          className="w-full flex items-center justify-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 py-2.5 rounded-2xl transition-all shadow-sm cursor-pointer active:scale-[0.98]"
        >
          <Star size={14} className="text-amber-500 fill-amber-500" />
          Manage Saved Reports
        </button>
      </div>
    </div>
  );
}
