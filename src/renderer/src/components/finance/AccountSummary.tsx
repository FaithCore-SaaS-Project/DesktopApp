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
    <div className="rounded-3xl border border-gray-150 bg-white p-6 shadow-sm flex flex-col h-full">
      <h2 className="mb-6 text-lg font-extrabold text-gray-900">
        Account Summary
      </h2>
      <div className="space-y-4 flex-1">
        {accounts.map((acc, i) => (
          <div
            key={i}
            className="flex justify-between items-center text-sm border-b border-gray-50 pb-3 last:pb-0 last:border-0"
          >
            <div>
              <h4 className="font-semibold text-gray-750">
                {acc.name}
              </h4>
            </div>
            <span className="font-extrabold text-emerald-600">
              {formatLKR(acc.amount)}
            </span>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center text-sm font-bold text-gray-900 bg-gray-50/50 p-4 rounded-2xl">
        <span>Total Portfolio Balance</span>
        <span className="text-base font-black text-gray-950">{formatLKR(totalBalance)}</span>
      </div>
    </div>
  );
}
