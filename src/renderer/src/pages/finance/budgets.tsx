import React from 'react';
import { CalendarDays, Sparkles } from 'lucide-react';

export default function FinanceBudgetsPage() {
  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-[75vh] text-center select-none">
      <div className="h-16 w-16 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-600 mb-4 border border-purple-500/20">
        <CalendarDays size={32} />
      </div>
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Budgets Planner & Forecasts</h1>
      <p className="text-gray-550 text-sm font-medium max-w-md leading-relaxed">
        Establish annual church operational budgets, set category spending alerts, and analyze monthly fiscal variances.
      </p>
      <div className="mt-8 flex items-center gap-2 text-xs font-bold text-gray-400 bg-gray-100/60 px-4 py-2 rounded-xl">
        <Sparkles size={14} className="text-purple-500" />
        <span>Awaiting client-provided source code for Budgets screen</span>
      </div>
    </div>
  );
}
