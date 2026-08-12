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

  const formatLKR = (val: number) => {
    return "Rs. " + val.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
      {stats.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-3xl border border-gray-150 p-6 shadow-sm flex items-center justify-between"
          >
            <div className="flex gap-4 items-center">
              <div
                className={`h-14 w-14 rounded-2xl flex items-center justify-center border ${item.iconColor}`}
              >
                <Icon size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {item.title}
                </p>
                <h3 className="text-2xl font-black text-gray-900 mt-1">
                  {item.value}
                </h3>
                <p className="text-xs mt-1.5">
                  {item.subtext}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
