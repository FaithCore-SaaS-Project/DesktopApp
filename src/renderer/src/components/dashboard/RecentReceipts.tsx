import React from 'react';
import Link from 'next/link';
import { FileText, ChevronRight } from 'lucide-react';

interface Receipt {
  number: string;
  member: string;
  amount: string;
  date: string;
}

interface RecentReceiptsProps {
  receipts?: Receipt[];
}

const defaultReceipts: Receipt[] = [
  {
    number: "RCP-2025-1058",
    member: "Saman Perera",
    amount: "Rs. 25,000",
    date: "24 May 2025",
  },
  {
    number: "RCP-2025-1057",
    member: "Kumara Family",
    amount: "Rs. 15,000",
    date: "24 May 2025",
  },
  {
    number: "RCP-2025-1056",
    member: "Nadeesha Fernando",
    amount: "Rs. 10,000",
    date: "23 May 2025",
  },
  {
    number: "RCP-2025-1055",
    member: "Isuru Jayasinghe",
    amount: "Rs. 20,000",
    date: "23 May 2025",
  },
];

export default function RecentReceipts({ receipts = defaultReceipts }: RecentReceiptsProps) {
  const hasReceipts = receipts && receipts.length > 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between min-h-[360px] h-full">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Recent Transactions
            </h2>
            <p className="text-[11px] text-slate-400 font-medium">Latest tithes & donations</p>
          </div>
          <Link href="/finance" passHref legacyBehavior>
            <a className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
              View all <ChevronRight size={13} />
            </a>
          </Link>
        </div>

        {!hasReceipts ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="h-10 w-10 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center mb-2.5 border border-slate-200/60">
              <FileText size={18} />
            </div>
            <p className="text-xs font-semibold text-slate-700">No recent transactions</p>
            <p className="text-[11px] text-slate-400 max-w-[200px] mt-0.5 font-medium leading-relaxed">
              Donations will be recorded here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {receipts.slice(0, 4).map((receipt, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2.5 hover:bg-slate-50/80 px-1 rounded-lg transition-colors gap-2"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100/80 flex items-center justify-center shrink-0">
                    <FileText size={15} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-mono font-bold text-slate-800 text-xs leading-tight whitespace-nowrap truncate">
                      {receipt.number}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                      {receipt.member}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-emerald-600 text-xs block whitespace-nowrap">
                    {receipt.amount}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap block mt-0.5">
                    {receipt.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
