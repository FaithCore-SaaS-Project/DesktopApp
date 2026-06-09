import React from 'react';

interface MonthlyOverviewProps {
  income?: string;
  expenses?: string;
  balance?: string;
}

export default function MonthlyOverview({
  income = "Rs. 2,450,000",
  expenses = "Rs. 1,120,000",
  balance = "Rs. 1,330,000"
}: MonthlyOverviewProps) {
  return (
    <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
          Monthly Overview
        </h2>
        <select className="border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 outline-none focus:border-[#5B3DF5] cursor-pointer">
          <option>This Month</option>
          <option>Last Month</option>
          <option>This Year</option>
        </select>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="flex flex-col justify-center">
          <div className="mb-6">
            <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider">
              Income
            </p>
            <h3 className="text-3xl font-extrabold text-green-600 mt-1">
              {income}
            </h3>
          </div>
          <div className="mb-6">
            <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider">
              Expenses
            </p>
            <h3 className="text-3xl font-extrabold text-red-500 mt-1">
              {expenses}
            </h3>
          </div>
          <div>
            <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider">
              Net Balance
            </p>
            <h3 className="text-4xl font-black text-gray-950 mt-1">
              {balance}
            </h3>
          </div>
        </div>

        {/* Premium SVG Line Chart Container */}
        <div className="lg:col-span-2">
          <div className="h-[280px] rounded-2xl bg-[#FCFDFF] border border-gray-100 p-4 relative flex flex-col justify-between overflow-hidden">
            {/* Chart Legend */}
            <div className="flex items-center justify-end gap-4 text-xs font-semibold text-gray-500 absolute top-4 right-4 z-10">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                <span>Income</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-400" />
                <span>Expenses</span>
              </div>
            </div>

            {/* Grid & SVG Chart */}
            <div className="relative flex-1 w-full mt-6">
              {/* Y Axis Guides */}
              <div className="absolute inset-0 flex flex-col justify-between text-[10px] font-bold text-gray-400 pointer-events-none select-none">
                <div className="w-full flex items-center justify-between border-b border-gray-100/60 pb-1">
                  <span>3M</span>
                </div>
                <div className="w-full flex items-center justify-between border-b border-gray-100/60 pb-1">
                  <span>2M</span>
                </div>
                <div className="w-full flex items-center justify-between border-b border-gray-100/60 pb-1">
                  <span>1M</span>
                </div>
                <div className="w-full flex items-center justify-between">
                  <span>0</span>
                </div>
              </div>

              {/* Vector Lines */}
              <svg className="w-full h-full absolute inset-0" viewBox="0 0 500 180" preserveAspectRatio="none">
                <defs>
                  {/* Gradients */}
                  <linearGradient id="income-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="expense-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EF4444" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#EF4444" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid vertical lines */}
                <line x1="125" y1="0" x2="125" y2="180" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="250" y1="0" x2="250" y2="180" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="375" y1="0" x2="375" y2="180" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />

                {/* Expense Fill Area */}
                <path
                  d="M 0 140 Q 60 120 120 125 T 240 100 T 360 115 T 500 95 L 500 180 L 0 180 Z"
                  fill="url(#expense-grad)"
                />
                {/* Expense Line */}
                <path
                  d="M 0 140 Q 60 120 120 125 T 240 100 T 360 115 T 500 95"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Income Fill Area */}
                <path
                  d="M 0 100 Q 65 75 125 85 T 250 65 T 375 75 T 500 50 L 500 180 L 0 180 Z"
                  fill="url(#income-grad)"
                />
                {/* Income Line */}
                <path
                  d="M 0 100 Q 65 75 125 85 T 250 65 T 375 75 T 500 50"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* X Axis labels */}
            <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 mt-2 px-1 border-t border-gray-100 pt-1 select-none">
              <span>1 May</span>
              <span>8 May</span>
              <span>15 May</span>
              <span>22 May</span>
              <span>31 May</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
