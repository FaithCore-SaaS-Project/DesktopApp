import React from 'react';
import { ArrowRight, FileSpreadsheet } from 'lucide-react';
import Link from 'next/link';

interface BudgetProgressProps {
  spent: number;
  budget?: number;
}

export default function BudgetProgress({
  spent,
  budget = 1500000
}: BudgetProgressProps) {
  
  const percent = budget > 0 ? Math.min(100, Math.round((spent / budget) * 1000) / 10) : 0;

  const formatLKR = (val: number) => {
    return "Rs. " + val.toLocaleString('en-LK', { maximumFractionDigits: 0 });
  };

  return (
    <div className="mt-6 rounded-2xl border border-gray-150 bg-white p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-[#5B3DF5]/10 flex items-center justify-center text-[#5B3DF5] shrink-0">
            <FileSpreadsheet size={22} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-sm">
              Budget vs Actual (This Month)
            </h3>
            <p className="text-xs font-bold text-gray-400 mt-0.5">
              Spent {formatLKR(spent)} of {formatLKR(budget)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 justify-between sm:justify-end">
          <div className="text-xl font-black text-[#5B3DF5]">
            {percent}%
          </div>
          <Link href="/finance/budgets" passHref legacyBehavior>
            <a className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-55 px-4 py-2.5 text-xs font-bold text-gray-700 transition-colors shadow-sm cursor-pointer group">
              <span>View Budget</span>
              <ArrowRight size={14} className="text-gray-400 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </Link>
        </div>
      </div>
      
      {/* Progress Track */}
      <div className="mt-5 h-3 overflow-hidden rounded-full bg-gray-100 border border-gray-50">
        <div 
          className="h-full rounded-full bg-[#5B3DF5] transition-all duration-500 shadow-sm"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
