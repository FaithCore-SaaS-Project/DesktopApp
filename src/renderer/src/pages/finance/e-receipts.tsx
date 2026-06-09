import React from 'react';
import { Receipt, Sparkles } from 'lucide-react';

export default function FinanceEReceiptsPage() {
  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-[75vh] text-center select-none">
      <div className="h-16 w-16 bg-[#5B3DF5]/10 rounded-2xl flex items-center justify-center text-[#5B3DF5] mb-4 border border-[#5B3DF5]/20">
        <Receipt size={32} />
      </div>
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">E-Receipts Registry</h1>
      <p className="text-gray-550 text-sm font-medium max-w-md leading-relaxed">
        Issue, track, and validate digital church receipts with automatic QR codes for tithes and general donations.
      </p>
      <div className="mt-8 flex items-center gap-2 text-xs font-bold text-gray-400 bg-gray-100/60 px-4 py-2 rounded-xl">
        <Sparkles size={14} className="text-[#5B3DF5]" />
        <span>Awaiting client-provided source code for E-Receipts screen</span>
      </div>
    </div>
  );
}
