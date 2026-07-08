import React from 'react';
import Link from 'next/link';
import { FileText } from 'lucide-react';

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
    <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm shadow-slate-100/50 flex flex-col justify-between min-h-[380px] h-full">
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
            Recent E-Receipts
          </h2>
          <Link href="/finance" passHref legacyBehavior>
            <a className="text-xs font-bold text-violet-500 hover:text-violet-600 transition-colors">
              View All
            </a>
          </Link>
        </div>

        {!hasReceipts ? (
          <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-3 border border-emerald-100/30">
              <FileText size={20} />
            </div>
            <p className="text-xs font-bold text-slate-600">No recent receipts</p>
            <p className="text-[10px] text-slate-400 max-w-[190px] mt-1 font-medium leading-relaxed">
              Donations and finance receipts will be listed here once recorded.
            </p>
          </div>
        ) : (
          <div className="space-y-3.5 flex-1">
            {receipts.slice(0, 4).map((receipt, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50/50 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-450 shrink-0">
                    <FileText size={18} className="text-violet-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-700 text-xs leading-snug">
                      {receipt.number}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                      {receipt.member}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <h4 className="font-extrabold text-emerald-600 text-xs leading-snug">
                    {receipt.amount}
                  </h4>
                  <p className="text-[9px] text-slate-400 font-bold mt-0.5">
                    {receipt.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
