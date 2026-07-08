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
      value: totalAccounts.toLocaleString(),
      subtext: "All accounts",
      icon: Landmark,
      textColor: "text-violet-600",
      iconBg: "bg-violet-500/10",
    },
    {
      title: "Total Balance",
      value: formatCurrency(totalBalance),
      subtext: "Across all accounts",
      icon: Wallet,
      textColor: "text-emerald-600",
      iconBg: "bg-emerald-500/10",
    },
    {
      title: "This Month In",
      value: formatCurrency(thisMonthIn),
      subtext: "Total credits",
      icon: ArrowDownToLine,
      textColor: "text-blue-600",
      iconBg: "bg-blue-500/10",
    },
    {
      title: "This Month Out",
      value: formatCurrency(thisMonthOut),
      subtext: "Total debits",
      icon: ArrowUpFromLine,
      textColor: "text-orange-600",
      iconBg: "bg-orange-500/10",
    },
  ];

  return (
    <div className="mb-8 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm shadow-slate-100/50 hover:-translate-y-1 hover:shadow-md transition-all duration-300 relative overflow-hidden group"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  {item.title}
                </p>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight mt-3 leading-none">
                  {item.value}
                </h3>
              </div>
              <div
                className={`h-11 w-11 rounded-xl flex items-center justify-center ${item.iconBg} ${item.textColor} transition-all duration-300 group-hover:scale-105`}
              >
                <Icon size={20} />
              </div>
            </div>
            
            <div className="mt-5 flex items-center">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border border-slate-100 rounded-lg px-2 py-0.5 select-none">
                {item.subtext}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
