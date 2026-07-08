import React from 'react';
import { BankAccountMock } from '../../../services/mockData';

interface AccountSummaryProps {
  accounts: BankAccountMock[];
}

const BANK_COLORS = [
  '#8B5CF6', // Indigo/Violet
  '#3B82F6', // Blue
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#6366F1', // Indigo Accent
  '#06B6D4', // Cyan
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
    <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm shadow-slate-100/50 select-none">
      <h2 className="text-base font-extrabold text-slate-800 tracking-tight mb-6">
        Portfolio Allocation
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Doughnut Chart */}
        <div className="lg:col-span-5 flex justify-center py-4 relative">
          <div className="relative h-60 w-60 flex items-center justify-center">
            {/* SVG circle container */}
            <svg width="220" height="220" viewBox="0 0 120 120" className="transform -scale-x-100">
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="transparent"
                stroke="#f8fafc"
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
              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">
                Total Portfolio
              </p>
              <h3 className="text-sm font-black text-slate-800 mt-1">
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
              className="flex items-center justify-between text-xs border-b border-slate-50 pb-2.5 last:pb-0 last:border-0"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Dot */}
                <div
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-bold text-slate-600 truncate max-w-[200px]">
                  {item.name}
                </span>
              </div>
              
              <div className="flex items-center gap-4 shrink-0 text-right">
                <span className="font-bold text-slate-700">
                  {formatCurrency(item.amount)}
                </span>
                <span className="font-bold text-slate-400 w-12 text-[10px]">
                  {item.pct.toFixed(2)}%
                </span>
              </div>
            </div>
          ))}

          {portfolio.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-6">
              No active bank accounts to display portfolio metrics.
            </p>
          )}

          <hr className="border-slate-100 my-3" />
          
          <div className="flex justify-between font-bold text-xs text-slate-700 pt-1 select-none">
            <span>Total Portfolio Balance</span>
            <span className="font-extrabold text-slate-800">{formatCurrency(totalBalance)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
