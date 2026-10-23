import React from 'react';
import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';

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
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            Financial Performance
          </h2>
          <p className="text-xs text-slate-500 font-medium">Income vs Expenditure breakdown</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-3 text-xs font-medium text-slate-500 mr-2">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Income
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              Expenses
            </span>
          </div>
          <select className="border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-600 outline-none bg-slate-50 hover:bg-white focus:border-blue-500 transition-colors cursor-pointer">
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Quarter</option>
            <option>This Year</option>
          </select>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-12 gap-6 pt-5">
        {/* Metric summary */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          <div className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/60">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
              <span>Total Income</span>
              <span className="text-emerald-600 font-semibold flex items-center text-[11px]">
                <ArrowUpRight size={14} /> +12.4%
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {income}
            </h3>
          </div>

          <div className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/60">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
              <span>Total Expenses</span>
              <span className="text-rose-500 font-semibold flex items-center text-[11px]">
                <ArrowDownRight size={14} /> -4.1%
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {expenses}
            </h3>
          </div>

          <div className="p-3.5 rounded-lg border border-blue-100 bg-blue-50/40">
            <div className="flex items-center justify-between text-xs text-blue-700 font-medium mb-1">
              <span className="flex items-center gap-1.5">
                <Wallet size={13} /> Net Reserve
              </span>
              <span className="text-[11px] font-semibold text-blue-600 bg-blue-100/60 px-1.5 py-0.5 rounded">
                Healthy
              </span>
            </div>
            <h3 className="text-xl font-bold text-blue-950 tracking-tight">
              {balance}
            </h3>
          </div>
        </div>

        {/* Crisp vector chart */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          <div className="h-[210px] w-full relative flex flex-col justify-between pt-2">
            {/* Horizontal guide lines */}
            <div className="absolute inset-0 flex flex-col justify-between text-[10px] font-medium text-slate-400 pointer-events-none select-none">
              <div className="w-full flex items-center justify-between border-b border-dashed border-slate-200/80 pb-0.5">
                <span>3.0M</span>
              </div>
              <div className="w-full flex items-center justify-between border-b border-dashed border-slate-200/80 pb-0.5">
                <span>2.0M</span>
              </div>
              <div className="w-full flex items-center justify-between border-b border-dashed border-slate-200/80 pb-0.5">
                <span>1.0M</span>
              </div>
              <div className="w-full flex items-center justify-between border-b border-slate-200/80">
                <span>0.0</span>
              </div>
            </div>

            {/* SVG Wave lines */}
            <div className="relative flex-1 w-full mt-2">
              <svg className="w-full h-full" viewBox="0 0 500 160" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="income-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="expense-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Vertical markers */}
                <line x1="125" y1="0" x2="125" y2="160" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="250" y1="0" x2="250" y2="160" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="375" y1="0" x2="375" y2="160" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />

                {/* Expense area */}
                <path
                  d="M 0 120 C 80 115, 140 100, 220 110 C 300 120, 380 90, 500 95 L 500 160 L 0 160 Z"
                  fill="url(#expense-fill)"
                />
                <path
                  d="M 0 120 C 80 115, 140 100, 220 110 C 300 120, 380 90, 500 95"
                  fill="none"
                  stroke="#F43F5E"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Income area */}
                <path
                  d="M 0 90 C 70 70, 150 75, 230 55 C 310 35, 400 50, 500 35 L 500 160 L 0 160 Z"
                  fill="url(#income-fill)"
                />
                <path
                  d="M 0 90 C 70 70, 150 75, 230 55 C 310 35, 400 50, 500 35"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Interactive Points */}
                <circle cx="230" cy="55" r="4" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="500" cy="35" r="4" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="220" cy="110" r="3.5" fill="#F43F5E" stroke="#FFFFFF" strokeWidth="2" />
              </svg>
            </div>

            {/* X-axis time series labels */}
            <div className="flex justify-between items-center text-[11px] font-medium text-slate-400 mt-2 pt-1.5 select-none">
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4</span>
              <span>Current</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
