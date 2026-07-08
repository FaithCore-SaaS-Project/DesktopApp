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
    <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm shadow-slate-100/50">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
          Monthly Overview
        </h2>
        <select className="border border-slate-100 rounded-xl px-3.5 py-1.5 text-xs font-bold text-slate-500 outline-none bg-slate-50/50 focus:border-violet-500 cursor-pointer transition-all duration-300">
          <option>This Month</option>
          <option>Last Month</option>
          <option>This Year</option>
        </select>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="flex flex-col justify-center pl-2">
          <div className="mb-6">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              Income
            </p>
            <h3 className="text-3xl font-extrabold text-emerald-600 tracking-tight mt-1">
              {income}
            </h3>
          </div>
          <div className="mb-6">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              Expenses
            </p>
            <h3 className="text-3xl font-extrabold text-rose-500 tracking-tight mt-1">
              {expenses}
            </h3>
          </div>
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              Net Balance
            </p>
            <h3 className="text-3xl font-black text-slate-800 tracking-tight mt-1">
              {balance}
            </h3>
          </div>
        </div>

        {/* Premium SVG Line Chart Container */}
        <div className="lg:col-span-2">
          <div className="h-[280px] rounded-2xl bg-slate-50/40 border border-slate-100/70 p-4 relative flex flex-col justify-between overflow-hidden shadow-inner">
            {/* Chart Legend */}
            <div className="flex items-center justify-end gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider absolute top-4 right-4 z-10">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Income</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-400" />
                <span>Expenses</span>
              </div>
            </div>

            {/* Grid & SVG Chart */}
            <div className="relative flex-1 w-full mt-6">
              {/* Y Axis Guides */}
              <div className="absolute inset-0 flex flex-col justify-between text-[9px] font-bold text-slate-400/80 pointer-events-none select-none">
                <div className="w-full flex items-center justify-between border-b border-slate-100/60 pb-1">
                  <span>3M</span>
                </div>
                <div className="w-full flex items-center justify-between border-b border-slate-100/60 pb-1">
                  <span>2M</span>
                </div>
                <div className="w-full flex items-center justify-between border-b border-slate-100/60 pb-1">
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
