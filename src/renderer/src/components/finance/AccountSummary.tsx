import React from 'react';

interface AccountSummaryProps {
  mainAccountBalance?: number;
  missionAccountBalance?: number;
  buildingFundBalance?: number;
}

export default function AccountSummary({
  mainAccountBalance = 1850000,
  missionAccountBalance = 320000,
  buildingFundBalance = 750000
}: AccountSummaryProps) {
  
  const formatLKR = (val: number) => {
    return "Rs. " + val.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const accounts = [
    {
      name: "Main Account (Operating)",
      amount: mainAccountBalance
    },
    {
      name: "Mission & Outreach Account",
      amount: missionAccountBalance
    },
    {
      name: "Building & Sanctuary Fund",
      amount: buildingFundBalance
    },
  ];

  const totalBalance = mainAccountBalance + missionAccountBalance + buildingFundBalance;

  return (
    <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm shadow-slate-100/50 flex flex-col h-full">
      <h2 className="mb-6 text-base font-extrabold text-slate-800 tracking-tight">
        Account Summary
      </h2>
      <div className="space-y-4 flex-1">
        {accounts.map((acc, i) => (
          <div
            key={i}
            className="flex justify-between items-center text-xs border-b border-slate-50 pb-3 last:pb-0 last:border-0"
          >
            <div>
              <h4 className="font-bold text-slate-600">
                {acc.name}
              </h4>
            </div>
            <span className="font-extrabold text-emerald-600">
              {formatLKR(acc.amount)}
            </span>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-3.5 border-t border-slate-100 flex justify-between items-center text-xs font-bold text-slate-700 bg-slate-50/60 p-4 rounded-2xl">
        <span>Total Portfolio Balance</span>
        <span className="text-sm font-black text-slate-800">{formatLKR(totalBalance)}</span>
      </div>
    </div>
  );
}
