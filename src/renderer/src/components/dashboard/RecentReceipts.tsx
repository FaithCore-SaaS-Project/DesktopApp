import React from 'react';
import Link from 'next/link';
import { FileText } from "lucide-react";

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
  return (
    <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-sm flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Recent E-Receipts
          </h2>
          <Link href="/finance" className="text-[#5B3DF5] hover:text-[#4529d8] font-bold text-sm transition-colors">
            View All
          </Link>
        </div>
        <div className="space-y-4">
          {receipts.map((receipt, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-gray-50 transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-gray-500">
                  <FileText size={22} className="text-[#5B3DF5]" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 leading-snug">
                    {receipt.number}
                  </h4>
                  <p className="text-xs text-gray-400 font-semibold mt-0.5">
                    {receipt.member}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <h4 className="font-black text-green-600 leading-snug">
                  {receipt.amount}
                </h4>
                <p className="text-[10px] text-gray-400 font-bold mt-0.5">
                  {receipt.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
