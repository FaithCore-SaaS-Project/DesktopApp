import React from 'react';
import { FileText, Mail, Printer, DollarSign } from "lucide-react";
import { ReceiptMock } from '../../../services/mockData';

interface ReceiptStatsProps {
  receipts: ReceiptMock[];
}

export default function ReceiptStats({ receipts }: ReceiptStatsProps) {
  // Let's calculate the stats based on the receipts list or fall back to the seed values
  // Seed values from screenshot:
  // Total Receipts: 1,248 (we can calculate from mock or use total 1248 as base and add new ones)
  // Emailed Receipts: 1,102 (or calculate ratio)
  // Printed Receipts: 146
  // Total Amount: Rs. 2,450,000.00

  const totalReceipts = receipts.length;
  const totalEmailed = receipts.filter(r => r.status === 'Emailed').length;
  const totalPrinted = receipts.filter(r => r.status === 'Printed').length;
  const totalAmount = receipts.reduce((sum, r) => sum + r.amount, 0);

  const emailedPercentage = totalReceipts > 0 ? ((totalEmailed / totalReceipts) * 100).toFixed(1) : "0.0";
  const printedPercentage = totalReceipts > 0 ? ((totalPrinted / totalReceipts) * 100).toFixed(1) : "0.0";

  const formatLKR = (val: number | string) => {
    return "Rs. " + Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const stats = [
    {
      title: "Total Receipts",
      value: totalReceipts.toLocaleString(),
      icon: FileText,
      iconColor: "text-purple-600 bg-purple-100/80 border-purple-200/50",
      subtext: (
        <span className="text-emerald-600 font-bold">
          {totalReceipts > 0 ? "+1" : "0"} this month
        </span>
      )
    },
    {
      title: "Emailed Receipts",
      value: totalEmailed.toLocaleString(),
      icon: Mail,
      iconColor: "text-emerald-600 bg-emerald-100/80 border-emerald-200/50",
      subtext: (
        <span className="text-emerald-600 font-bold">
          {emailedPercentage}% of total
        </span>
      )
    },
    {
      title: "Printed Receipts",
      value: totalPrinted.toLocaleString(),
      icon: Printer,
      iconColor: "text-blue-600 bg-blue-100/80 border-blue-200/50",
      subtext: (
        <span className="text-blue-600 font-bold">
          {printedPercentage}% of total
        </span>
      )
    },
    {
      title: "Total Amount",
      value: formatLKR(totalAmount),
      icon: DollarSign,
      iconColor: "text-amber-600 bg-amber-100/80 border-amber-200/50",
      subtext: (
        <span className="text-gray-400 font-semibold">
          This month
        </span>
      )
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {stats.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider truncate">
                {item.title}
              </span>
              <div
                className={`h-8 w-8 rounded-lg flex items-center justify-center border ${item.iconColor} shrink-0 transition-transform duration-200 group-hover:scale-110`}
              >
                <Icon size={16} strokeWidth={2.2} />
              </div>
            </div>

            <div className="mt-3">
              <h3 className="text-base sm:text-lg xl:text-xl font-bold text-slate-800 tracking-tight whitespace-nowrap leading-none" title={item.value}>
                {item.value}
              </h3>
            </div>

            <div className="mt-4 pt-2.5 border-t border-slate-100/80 flex items-center justify-between">
              <span className="text-[10px] font-semibold text-slate-400">
                {item.subtext}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Updated live</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
