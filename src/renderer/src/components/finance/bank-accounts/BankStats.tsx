import React from 'react';
import {
  Landmark,
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine
} from 'lucide-react';
import { BankAccountMock, FinanceMock } from '../../../services/mockData';

interface BankStatsProps {
  accounts: BankAccountMock[];
  financeRecords: FinanceMock[];
}

export default function BankStats({ accounts, financeRecords }: BankStatsProps) {
  const totalAccounts = accounts.length;
  
  // Total Balance of active accounts
  const totalBalance = accounts
    .filter(a => a.status === 'Active')
    .reduce((sum, a) => sum + a.balance, 0);

  // Compute this month's dynamic finance logs
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const thisMonthRecords = financeRecords.filter(r => {
    if (!r.date) return false;
    const dateObj = new Date(r.date);
    return dateObj.getMonth() === currentMonth && dateObj.getFullYear() === currentYear;
  });

  const dbIn = thisMonthRecords
    .filter(r => r.type === 'income')
    .reduce((sum, r) => sum + r.amount, 0);

  const dbOut = thisMonthRecords
    .filter(r => r.type === 'expense')
    .reduce((sum, r) => sum + r.amount, 0);

  // Fallbacks combined with seed bases
  const thisMonthIn = 1200000.00 + dbIn;
  const thisMonthOut = 850000.00 + dbOut;

  const formatCurrency = (val: number) => {
    return `Rs. ${val.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const stats = [
    {
      title: "Total Bank Accounts",
      value: totalAccounts.toString(),
      subtext: "All accounts",
      icon: Landmark,
      color: "bg-[#5B3DF5] shadow-[#5B3DF5]/15",
      iconColor: "text-white",
      subtextColor: "text-gray-450 font-bold",
    },
    {
      title: "Total Balance",
      value: formatCurrency(totalBalance),
      subtext: "Across all accounts",
      icon: Wallet,
      color: "bg-emerald-500 shadow-emerald-150",
      iconColor: "text-white",
      subtextColor: "text-gray-450 font-bold",
    },
    {
      title: "This Month In",
      value: formatCurrency(thisMonthIn),
      subtext: "Total credits",
      icon: ArrowDownToLine,
      color: "bg-blue-500 shadow-blue-150",
      iconColor: "text-white",
      subtextColor: "text-gray-450 font-bold",
    },
    {
      title: "This Month Out",
      value: formatCurrency(thisMonthOut),
      subtext: "Total debits",
      icon: ArrowUpFromLine,
      color: "bg-orange-500 shadow-orange-150",
      iconColor: "text-white",
      subtextColor: "text-gray-450 font-bold",
    },
  ];

  return (
    <div className="mb-8 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className="rounded-3xl border border-gray-150 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden"
          >
            <div className="flex flex-col h-full justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.color} ${item.iconColor} shadow-lg transition-transform duration-300 group-hover:scale-105`}
                >
                  <Icon size={22} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 leading-tight">
                    {item.value}
                  </h2>
                  <p className="text-gray-400 text-xs font-bold mt-0.5 leading-none">
                    {item.title}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                <span className={`text-xs font-bold ${item.subtextColor}`}>
                  {item.subtext}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
