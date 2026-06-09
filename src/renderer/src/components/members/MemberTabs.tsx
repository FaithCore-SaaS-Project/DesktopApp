import React from 'react';

interface MemberTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function MemberTabs({ activeTab, setActiveTab }: MemberTabsProps) {
  const tabs = [
    "Profile",
    "Family",
    "Ministry",
    "Documents",
    "Finance",
    "Attendance",
    "Notes",
    "Activity",
  ];

  return (
    <div className="bg-white rounded-t-3xl border border-gray-150 border-b-0 px-8 overflow-x-auto scrollbar-none">
      <div className="flex gap-8 min-w-max">
        {tabs.map((tab, index) => {
          const isActive = tab === activeTab;
          return (
            <button
              key={index}
              onClick={() => setActiveTab(tab)}
              className={`py-5 border-b-2 text-sm font-bold transition-all duration-200 focus:outline-none ${
                isActive
                  ? "border-[#5B3DF5] text-[#5B3DF5] scale-[1.02]"
                  : "border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-200"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>
    </div>
  );
}
