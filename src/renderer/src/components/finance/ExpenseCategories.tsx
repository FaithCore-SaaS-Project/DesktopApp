import React from 'react';
import { FinanceMock } from '../../services/mockData';
import { Church, Zap, Users, Wrench, MoreHorizontal } from 'lucide-react';

interface ExpenseCategoriesProps {
  transactions: FinanceMock[];
}

export default function ExpenseCategories({ transactions }: ExpenseCategoriesProps) {
  // Base seeds matching client's screenshot
  const seeds: Record<string, number> = {
    Ministry: 450000,
    Utilities: 230000,
    Salary: 210000,
    Maintenance: 130000,
    Others: 100000,
  };

  // Add db transactions
  const dbExpenses = transactions.filter(t => t.type === 'expense');
  
  dbExpenses.forEach(t => {
    let cat = 'Others';
    const cleanCat = t.category.toLowerCase();
    if (cleanCat === 'ministry') cat = 'Ministry';
    else if (cleanCat === 'utilities') cat = 'Utilities';
    else if (cleanCat === 'salary' || cleanCat === 'salaries') cat = 'Salary';
    else if (cleanCat === 'maintenance') cat = 'Maintenance';
    
    seeds[cat] = (seeds[cat] || 0) + t.amount;
  });

  const totalExpenseSum = Object.values(seeds).reduce((sum, val) => sum + val, 0);

  const categoriesConfig: Record<string, { label: string; icon: React.ComponentType<any>; color: string; bg: string; bar: string }> = {
    Ministry: { label: "Ministry", icon: Church, color: "text-[#5B3DF5]", bg: "bg-indigo-50", bar: "bg-[#5B3DF5]" },
    Utilities: { label: "Utilities", icon: Zap, color: "text-[#F59E0B]", bg: "bg-amber-50", bar: "bg-[#F59E0B]" },
    Salary: { label: "Salaries", icon: Users, color: "text-[#14B8A6]", bg: "bg-teal-50", bar: "bg-[#14B8A6]" },
    Maintenance: { label: "Maintenance", icon: Wrench, color: "text-[#3B82F6]", bg: "bg-blue-50", bar: "bg-[#3B82F6]" },
    Others: { label: "Others", icon: MoreHorizontal, color: "text-[#6B7280]", bg: "bg-slate-100", bar: "bg-[#6B7280]" },
  };

  const categories = Object.entries(seeds).map(([key, amount]) => {
    const config = categoriesConfig[key] || categoriesConfig.Others;
    const percent = totalExpenseSum > 0 ? (amount / totalExpenseSum) * 100 : 0;
    return {
      key,
      amount,
      percent,
      ...config,
    };
  }).sort((a, b) => b.amount - a.amount); // Sort by highest expense

  const formatLKR = (val: number) => {
    return "Rs. " + val.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col h-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Top Expense Categories
          </h2>
          <p className="text-xs text-gray-400 mt-0.5 font-medium">Categorized outflow of resources</p>
        </div>
        <select className="rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-xs font-semibold text-gray-600 outline-none focus:border-[#5B3DF5] cursor-pointer">
          <option>This Month</option>
        </select>
      </div>

      <div className="space-y-6 flex-1">
        {categories.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="flex gap-4 items-start">
              {/* Category Icon Container */}
              <div className={`h-11 w-11 rounded-full flex items-center justify-center shrink-0 ${item.bg} ${item.color}`}>
                <Icon size={20} />
              </div>

              {/* Progress and Data details */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-semibold text-gray-700">{item.label}</span>
                  <span className="text-sm font-bold text-gray-900">{formatLKR(item.amount)}</span>
                </div>
                
                {/* Progress bar */}
                <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${item.bar}`}
                    style={{
                      width: `${item.percent}%`,
                    }}
                  />
                </div>
                
                {/* Percentage label */}
                <div className="mt-1 text-right text-xs font-bold text-gray-400">
                  {Math.round(item.percent)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button className="mt-8 w-full text-center border border-gray-200 hover:border-gray-300 py-3 rounded-xl text-[#5B3DF5] font-semibold text-sm transition-colors hover:bg-gray-50 cursor-pointer">
        View All Expenses
      </button>
    </div>
  );
}
