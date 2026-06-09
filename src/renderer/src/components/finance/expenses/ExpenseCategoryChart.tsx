import React from 'react';

interface ExpenseCategoryChartProps {
  total: number;
  ministry: number;
  utilities: number;
  salaries: number;
  maintenance: number;
  office: number;
  others: number;
}

export default function ExpenseCategoryChart({
  total,
  ministry,
  utilities,
  salaries,
  maintenance,
  office,
  others
}: ExpenseCategoryChartProps) {
  
  const ministryPct = total > 0 ? Math.round((ministry / total) * 100) : 32;
  const utilitiesPct = total > 0 ? Math.round((utilities / total) * 100) : 18;
  const salariesPct = total > 0 ? Math.round((salaries / total) * 100) : 17;
  const maintenancePct = total > 0 ? Math.round((maintenance / total) * 100) : 12;
  const officePct = total > 0 ? Math.round((office / total) * 100) : 8;
  const othersPct = Math.max(0, 100 - ministryPct - utilitiesPct - salariesPct - maintenancePct - officePct);

  const data = [
    { label: "Ministry", pct: ministryPct, value: ministry, color: "stroke-[#3B82F6] bg-[#3B82F6]" },
    { label: "Utilities", pct: utilitiesPct, value: utilities, color: "stroke-[#60A5FA] bg-[#60A5FA]" },
    { label: "Salaries", pct: salariesPct, value: salaries, color: "stroke-[#FBBF24] bg-[#FBBF24]" },
    { label: "Maintenance", pct: maintenancePct, value: maintenance, color: "stroke-[#A78BFA] bg-[#A78BFA]" },
    { label: "Office", pct: officePct, value: office, color: "stroke-[#2DD4BF] bg-[#2DD4BF]" },
    { label: "Others", pct: othersPct, value: others, color: "stroke-[#9CA3AF] bg-[#9CA3AF]" },
  ];

  // cumulative offsets for dash offset calculation
  const offsetMinistry = 100;
  const offsetUtilities = 100 - ministryPct;
  const offsetSalaries = 100 - ministryPct - utilitiesPct;
  const offsetMaintenance = 100 - ministryPct - utilitiesPct - salariesPct;
  const offsetOffice = 100 - ministryPct - utilitiesPct - salariesPct - maintenancePct;
  const offsetOthers = 100 - ministryPct - utilitiesPct - salariesPct - maintenancePct - officePct;

  const formatLKR = (val: number) => {
    return "Rs. " + val.toLocaleString('en-LK', { maximumFractionDigits: 0 });
  };

  return (
    <div className="rounded-2xl border border-gray-150 bg-white p-6 shadow-sm flex flex-col h-full">
      <h2 className="mb-6 text-lg font-bold text-gray-800">
        Expenses by Category
      </h2>

      <div className="flex-1 flex flex-col items-center justify-center min-h-[260px]">
        {/* SVG Donut */}
        <div className="relative h-44 w-44">
          <svg width="100%" height="100%" viewBox="0 0 42 42" className="transform -rotate-90">
            <circle
              cx="21"
              cy="21"
              r="15.91549430918954"
              fill="transparent"
              stroke="#f1f5f9"
              strokeWidth="4.5"
            />
            {/* Ministry */}
            <circle
              cx="21"
              cy="21"
              r="15.91549430918954"
              fill="transparent"
              className={data[0].color}
              strokeWidth="4.5"
              strokeDasharray={`${ministryPct} ${100 - ministryPct}`}
              strokeDashoffset={offsetMinistry}
            />
            {/* Utilities */}
            <circle
              cx="21"
              cy="21"
              r="15.91549430918954"
              fill="transparent"
              className={data[1].color}
              strokeWidth="4.5"
              strokeDasharray={`${utilitiesPct} ${100 - utilitiesPct}`}
              strokeDashoffset={offsetUtilities}
            />
            {/* Salaries */}
            <circle
              cx="21"
              cy="21"
              r="15.91549430918954"
              fill="transparent"
              className={data[2].color}
              strokeWidth="4.5"
              strokeDasharray={`${salariesPct} ${100 - salariesPct}`}
              strokeDashoffset={offsetSalaries}
            />
            {/* Maintenance */}
            <circle
              cx="21"
              cy="21"
              r="15.91549430918954"
              fill="transparent"
              className={data[3].color}
              strokeWidth="4.5"
              strokeDasharray={`${maintenancePct} ${100 - maintenancePct}`}
              strokeDashoffset={offsetMaintenance}
            />
            {/* Office */}
            <circle
              cx="21"
              cy="21"
              r="15.91549430918954"
              fill="transparent"
              className={data[4].color}
              strokeWidth="4.5"
              strokeDasharray={`${officePct} ${100 - officePct}`}
              strokeDashoffset={offsetOffice}
            />
            {/* Others */}
            {othersPct > 0 && (
              <circle
                cx="21"
                cy="21"
                r="15.91549430918954"
                fill="transparent"
                className={data[5].color}
                strokeWidth="4.5"
                strokeDasharray={`${othersPct} ${100 - othersPct}`}
                strokeDashoffset={offsetOthers}
              />
            )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center leading-none text-center p-3">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Total</span>
            <span className="text-sm font-black text-gray-900 mt-2 truncate w-full" title={formatLKR(total)}>
              {formatLKR(total)}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 w-full grid grid-cols-2 gap-x-4 gap-y-2">
          {data.map((item, idx) => (
            <div key={idx} className="flex flex-col text-[11px] font-semibold text-gray-500">
              <div className="flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${item.color}`} />
                <span className="truncate">{item.label}</span>
              </div>
              <span className="text-gray-900 font-extrabold pl-3.5 mt-0.5">{item.pct}% ({formatLKR(item.value)})</span>
            </div>
          ))}
        </div>
      </div>

      <button 
        type="button"
        className="mt-6 w-full text-center border border-gray-150 hover:border-gray-250 py-3 rounded-xl text-gray-500 hover:text-gray-700 font-semibold text-xs transition-colors hover:bg-gray-55 cursor-pointer"
      >
        View Full Report
      </button>
    </div>
  );
}
