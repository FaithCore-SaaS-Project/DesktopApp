import React from 'react';
import { BankAccountMock } from '../../../services/mockData';

interface AccountSummaryProps {
  accounts: BankAccountMock[];
}

const BANK_COLORS = [
  '#5B3DF5', // Hatton National Bank (purple/indigo)
  '#3B82F6', // Commercial Bank (blue)
  '#10B981', // People's Bank (emerald green)
  '#F59E0B', // BOC (yellow/amber)
  '#EC4899', // Nations Trust Bank (pink)
  '#8B5CF6', // Fallbacks
  '#F43F5E',
  '#06B6D4',
];

export default function AccountSummary({ accounts }: AccountSummaryProps) {
  // Only use active accounts for summary calculations
  const activeAccounts = accounts.filter(a => a.status === 'Active');
  
  const totalBalance = activeAccounts.reduce((sum, a) => sum + a.balance, 0);

  const formatCurrency = (val: number) => {
    return `Rs. ${val.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // SVG Doughnut math
  const radius = 50;
  const strokeWidth = 16;
  const circumference = 2 * Math.PI * radius; // ~314.16
  
  let accumulatedPct = 0;
  
  const portfolio = activeAccounts.map((acc, idx) => {
    const pct = totalBalance > 0 ? (acc.balance / totalBalance) * 100 : 0;
    const color = BANK_COLORS[idx % BANK_COLORS.length];
    
    // Circle offset math
    const strokeOffset = circumference - (pct / 100) * circumference;
    const rotation = (accumulatedPct / 100) * 360 - 90; // Rotate to start at top
    accumulatedPct += pct;
    
    return {
      id: acc.id,
      name: `${acc.bankName} - ${acc.accountName}`,
      amount: acc.balance,
      pct,
      color,
      strokeOffset,
      rotation,
    };
  });

  return (
    <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm select-none">
      <h2 className="text-lg font-bold text-gray-900 mb-6">
        Account Summary
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Doughnut Chart */}
        <div className="lg:col-span-5 flex justify-center py-4 relative">
          <div className="relative h-64 w-64 flex items-center justify-center">
            {/* SVG circle container */}
            <svg width="240" height="240" viewBox="0 0 120 120" className="transform -scale-x-100">
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="transparent"
                stroke="#f3f4f6"
                strokeWidth={strokeWidth}
              />
              {portfolio.map((slice) => (
                <circle
                  key={slice.id}
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={slice.strokeOffset}
                  transform={`rotate(${slice.rotation} 60 60)`}
                  strokeLinecap={slice.pct > 0.5 ? "round" : "butt"}
                  className="transition-all duration-500 ease-out"
                />
              ))}
            </svg>
            
            {/* Inner text block */}
            <div className="absolute text-center select-none pointer-events-none">
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                Total Portfolio
              </p>
              <h3 className="text-lg font-black text-gray-900 mt-0.5">
                {formatCurrency(totalBalance)}
              </h3>
            </div>
          </div>
        </div>

        {/* Portfolio Details List */}
        <div className="lg:col-span-7 space-y-3.5">
          {portfolio.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between text-xs border-b border-gray-50 pb-2.5 last:pb-0 last:border-0"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Dot */}
                <div
                  className="h-3 w-3 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-semibold text-gray-700 truncate max-w-[220px]">
                  {item.name}
                </span>
              </div>
              
              <div className="flex items-center gap-5 shrink-0 text-right">
                <span className="font-bold text-gray-800">
                  {formatCurrency(item.amount)}
                </span>
                <span className="font-bold text-gray-400 w-12">
                  {item.pct.toFixed(2)}%
                </span>
              </div>
            </div>
          ))}

          {portfolio.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-6">
              No active bank accounts to display portfolio metrics.
            </p>
          )}

          <hr className="border-gray-100 my-3" />
          
          <div className="flex justify-between font-bold text-sm text-gray-850 pt-1">
            <span>Total Portfolio Balance</span>
            <span>{formatCurrency(totalBalance)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
