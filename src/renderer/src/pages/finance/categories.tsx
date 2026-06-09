import React from 'react';
import { Layers, Sparkles } from 'lucide-react';

export default function FinanceCategoriesPage() {
  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-[75vh] text-center select-none">
      <div className="h-16 w-16 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-600 mb-4 border border-amber-500/20">
        <Layers size={32} />
      </div>
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Financial Allocation Categories</h1>
      <p className="text-gray-500 text-sm font-medium max-w-md leading-relaxed">
        Manage chart of accounts, budget tags, income groups (Tithes, Offerings, Support), and expense allocations.
      </p>
      <div className="mt-8 flex items-center gap-2 text-xs font-bold text-gray-400 bg-gray-100/60 px-4 py-2 rounded-xl">
        <Sparkles size={14} className="text-amber-500" />
        <span>Awaiting client-provided source code for Categories screen</span>
      </div>
    </div>
  );
}
