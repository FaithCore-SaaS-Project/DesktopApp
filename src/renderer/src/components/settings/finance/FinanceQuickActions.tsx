import React from 'react';
import { FolderTree, Wallet, Landmark, CreditCard, BarChart3 } from 'lucide-react';

const actions = [
  { title: "Manage Categories", icon: <FolderTree size={14} /> },
  { title: "Manage Budgets", icon: <Wallet size={14} /> },
  { title: "Manage Bank Accounts", icon: <Landmark size={14} /> },
  { title: "Manage Payment Methods", icon: <CreditCard size={14} /> },
  { title: "View Chart of Accounts", icon: <BarChart3 size={14} /> }
];

export default function FinanceQuickActions() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 mt-6 shadow-sm">
      <h3 className="text-sm font-black text-gray-900 mb-4">Quick Actions</h3>
      <div className="space-y-2">
        {actions.map((item, index) => (
          <button
            key={index}
            className="w-full flex items-center gap-3 py-2.5 px-4 border border-gray-100 rounded-xl text-xs font-bold text-gray-600 hover:text-[#5B3DF5] hover:bg-gray-50 transition-colors shadow-sm"
          >
            <span className="text-[#5B3DF5]">{item.icon}</span>
            {item.title}
          </button>
        ))}
      </div>
    </div>
  );
}
