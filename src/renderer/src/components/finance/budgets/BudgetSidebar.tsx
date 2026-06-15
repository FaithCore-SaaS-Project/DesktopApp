import React from 'react';
import { BudgetMock } from '../../../services/mockData';
import { getBudgetIconInfo } from './BudgetRow';

interface BudgetSidebarProps {
  budgets: BudgetMock[];
}

export default function BudgetSidebar({ budgets }: BudgetSidebarProps) {
  const activeBudgets = budgets.filter(b => b.budgetAmount > 0);
  const totalBudgeted = budgets.reduce((sum, b) => sum + b.budgetAmount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spentAmount, 0);
  const remaining = totalBudgeted - totalSpent;
  
  const overallProgress = totalBudgeted > 0 
    ? Math.min(100, Math.round((totalSpent / totalBudgeted) * 100))
    : 0;

  const formatCurrency = (val: number) => {
    return `Rs. ${val.toLocaleString('en-US', {
      maximumFractionDigits: 0,
    })}`;
  };

  // SVG Doughnut Math
  const radius = 40;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius; // ~251.32
  let accumulatedPct = 0;

  const chartSlices = activeBudgets.map(b => {
    const pct = totalBudgeted > 0 ? (b.budgetAmount / totalBudgeted) * 100 : 0;
    const { color } = getBudgetIconInfo(b.name, b.type);
    
    const strokeOffset = circumference - (pct / 100) * circumference;
    const rotation = (accumulatedPct / 100) * 360 - 90;
    accumulatedPct += pct;

    return {
      id: b.id,
      name: b.name,
      pct,
      color,
      strokeOffset,
      rotation,
      amount: b.budgetAmount
    };
  });

  return (
    <div className="space-y-6 select-none">
      {/* Budget Overview Card */}
      <div className="bg-white border border-gray-150 rounded-3xl p-5 shadow-sm">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
          Budget Overview (This Year)
        </h3>
        
        {totalBudgeted > 0 ? (
          <div className="flex flex-col items-center">
            {/* SVG Doughnut */}
            <div className="relative h-44 w-44 flex items-center justify-center mb-6">
              <svg width="160" height="160" viewBox="0 0 100 100" className="transform -scale-x-100">
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke="#f3f4f6"
                  strokeWidth={strokeWidth}
                />
                {chartSlices.map((slice) => (
                  <circle
                    key={slice.id}
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="transparent"
                    stroke={slice.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={slice.strokeOffset}
                    transform={`rotate(${slice.rotation} 50 50)`}
                    strokeLinecap={slice.pct > 1 ? "round" : "butt"}
                    className="transition-all duration-500 ease-out"
                  />
                ))}
              </svg>
              
              <div className="absolute text-center select-none pointer-events-none">
                <p className="text-gray-400 text-[8px] font-bold uppercase tracking-wider">
                  Total Budget
                </p>
                <h4 className="text-xs font-black text-gray-905 mt-0.5 leading-none">
                  {formatCurrency(totalBudgeted)}
                </h4>
              </div>
            </div>

            {/* Legends list */}
            <div className="w-full space-y-2 text-[10px] font-semibold text-gray-500">
              {chartSlices.slice(0, 8).map(slice => (
                <div key={slice.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: slice.color }} />
                    <span className="truncate max-w-[120px]" title={slice.name}>{slice.name}</span>
                  </div>
                  <span className="font-bold text-gray-700">
                    {slice.pct.toFixed(1)}% ({formatCurrency(slice.amount)})
                  </span>
                </div>
              ))}
              {chartSlices.length > 8 && (
                <div className="text-center text-[9px] font-bold text-gray-450 mt-1">
                  + {chartSlices.length - 8} other categories
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-xs text-gray-400 text-center py-10">No budgeted metrics to map.</p>
        )}
      </div>

      {/* Budget Summary Card */}
      <div className="bg-white border border-gray-150 rounded-3xl p-5 shadow-sm">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-5">
          Budget Summary
        </h3>
        
        <div className="space-y-4 text-xs font-semibold text-gray-500">
          <div className="flex justify-between items-center py-0.5">
            <span>Total Budgeted</span>
            <span className="text-gray-800">{formatCurrency(totalBudgeted)}</span>
          </div>
          <div className="flex justify-between items-center py-0.5">
            <span>Total Spent</span>
            <span className="text-gray-850">{formatCurrency(totalSpent)}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-100 font-bold">
            <span className="text-gray-700">Remaining</span>
            <span className="text-green-600 font-extrabold text-sm">{formatCurrency(remaining)}</span>
          </div>
        </div>

        {/* Master Progress meter */}
        <div className="mt-6 pt-3 border-t border-gray-100">
          <div className="flex justify-between items-center text-xs font-bold mb-1.5">
            <span className="text-gray-700">Overall Progress</span>
            <span className="text-[#5B3DF5]">{overallProgress}%</span>
          </div>
          <div className="w-full h-3 bg-gray-150 rounded-full overflow-hidden">
            <div
              className="bg-[#5B3DF5] h-full rounded-full transition-all duration-550"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="bg-white border border-gray-150 rounded-3xl p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Recent Activities
          </h3>
          <button type="button" className="text-[10px] font-bold text-[#5B3DF5] hover:underline cursor-pointer">
            View All
          </button>
        </div>
        <ul className="space-y-4 text-xs font-semibold text-gray-500">
          <li className="flex items-start gap-2.5">
            <div className="h-1.5 w-1.5 rounded-full bg-[#5B3DF5] mt-1.5 shrink-0" />
            <div>
              <p className="text-gray-800 leading-tight">Ministry Operations budget updated</p>
              <span className="text-[9px] text-gray-400 font-semibold mt-0.5 inline-block">2 hours ago</span>
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
            <div>
              <p className="text-gray-800 leading-tight">Building Maintenance budget created</p>
              <span className="text-[9px] text-gray-400 font-semibold mt-0.5 inline-block">1 day ago</span>
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
            <div>
              <p className="text-gray-800 leading-tight">Outreach Programs budget updated</p>
              <span className="text-[9px] text-gray-400 font-semibold mt-0.5 inline-block">3 days ago</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
