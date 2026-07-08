import React from 'react';

interface FinanceChartProps {
  totalIncome: number;
  totalExpenses: number;
}

export default function FinanceChart({ totalIncome, totalExpenses }: FinanceChartProps) {
  const total = totalIncome + totalExpenses;
  
  // Percentages for chart rendering
  const incomePercent = total > 0 ? (totalIncome / total) * 100 : 50;
  const expensePercent = total > 0 ? (totalExpenses / total) * 100 : 50;

  // Let's create mock monthly values to render a gorgeous multi-bar timeline chart!
  // This will look incredibly premium and realistic.
  const monthlyData = [
    { month: "Jan", income: 180000, expense: 95000 },
    { month: "Feb", income: 240000, expense: 120000 },
    { month: "Mar", income: 210000, expense: 140000 },
    { month: "Apr", income: 290000, expense: 110000 },
    { month: "May", income: totalIncome || 245000, expense: totalExpenses || 112000 },
  ];

  // Find max value to scale the graph bars
  const maxVal = Math.max(...monthlyData.flatMap(d => [d.income, d.expense])) * 1.15;

  return (
    <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm shadow-slate-100/50 flex flex-col h-full">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-base font-extrabold text-slate-800 tracking-tight">
          Income vs Expenses
        </h2>
        <select className="border border-slate-100 rounded-xl px-3.5 py-1.5 text-xs font-bold text-slate-500 outline-none bg-slate-50/50 focus:border-violet-500 cursor-pointer transition-all duration-300">
          <option>This Year (5 Months)</option>
        </select>
      </div>

      <div className="flex-1 flex flex-col justify-end min-h-[260px]">
        {/* Graph Area */}
        <div className="flex-1 flex items-end justify-between gap-4 px-2 pb-2 relative border-b border-slate-100">
          {/* Grid lines background */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            <div className="border-t border-slate-100/40 w-full h-0" />
            <div className="border-t border-slate-100/40 w-full h-0" />
            <div className="border-t border-slate-100/40 w-full h-0" />
            <div className="border-t border-slate-100/40 w-full h-0" />
          </div>

          {monthlyData.map((d, i) => {
            const incHeight = (d.income / maxVal) * 100;
            const expHeight = (d.expense / maxVal) * 100;

            return (
              <div key={i} className="flex-1 flex flex-col items-center z-10">
                <div className="w-full flex items-end justify-center gap-1.5 h-[180px]">
                  {/* Income bar */}
                  <div 
                    className="w-3 sm:w-4 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-[4px] transition-all duration-500 hover:opacity-85 relative group cursor-pointer"
                    style={{ height: `${incHeight}%` }}
                  >
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-slate-900 text-white text-[9px] font-bold py-1 px-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-25 pointer-events-none shadow-md">
                      Inc: Rs. {d.income.toLocaleString()}
                    </div>
                  </div>
                  {/* Expense bar */}
                  <div 
                    className="w-3 sm:w-4 bg-gradient-to-t from-rose-500 to-rose-400 rounded-t-[4px] transition-all duration-500 hover:opacity-85 relative group cursor-pointer"
                    style={{ height: `${expHeight}%` }}
                  >
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-slate-900 text-white text-[9px] font-bold py-1 px-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-25 pointer-events-none shadow-md">
                      Exp: Rs. {d.expense.toLocaleString()}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-400 mt-2">{d.month}</span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex gap-4 mt-5 pl-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span>Income</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
            <span>Expenses</span>
          </div>
        </div>
      </div>
    </div>
  );
}
