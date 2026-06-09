import React from 'react';

interface IncomeCategoryChartProps {
  total: number;
  tithes: number;
  offerings: number;
  donations: number;
  thanksgiving: number;
  others: number;
}

export default function IncomeCategoryChart({
  total,
  tithes,
  offerings,
  donations,
  thanksgiving,
  others
}: IncomeCategoryChartProps) {
  
  const tithePct = total > 0 ? Math.round((tithes / total) * 100) : 45;
  const offeringPct = total > 0 ? Math.round((offerings / total) * 100) : 25;
  const donationPct = total > 0 ? Math.round((donations / total) * 100) : 15;
  const thanksPct = total > 0 ? Math.round((thanksgiving / total) * 100) : 5;
  const otherPct = Math.max(0, 100 - tithePct - offeringPct - donationPct - thanksPct);

  const data = [
    { label: "Tithes", pct: tithePct, value: tithes, color: "stroke-[#10B981] bg-[#10B981]" },
    { label: "Offerings", pct: offeringPct, value: offerings, color: "stroke-[#3B82F6] bg-[#3B82F6]" },
    { label: "Donations", pct: donationPct, value: donations, color: "stroke-[#F59E0B] bg-[#F59E0B]" },
    { label: "Thanksgiving", pct: thanksPct, value: thanksgiving, color: "stroke-[#8B5CF6] bg-[#8B5CF6]" },
    { label: "Others", pct: otherPct, value: others, color: "stroke-[#6B7280] bg-[#6B7280]" },
  ];

  // cumulative offsets for dash offset calculation
  const offsetTithe = 100;
  const offsetOffering = 100 - tithePct;
  const offsetDonation = 100 - tithePct - offeringPct;
  const offsetThanks = 100 - tithePct - offeringPct - donationPct;
  const offsetOther = 100 - tithePct - offeringPct - donationPct - thanksPct;

  const formatLKR = (val: number) => {
    return "Rs. " + val.toLocaleString('en-LK', { maximumFractionDigits: 0 });
  };

  return (
    <div className="rounded-2xl border border-gray-150 bg-white p-6 shadow-sm flex flex-col h-full">
      <h2 className="mb-6 text-lg font-bold text-gray-800">
        Income by Category
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
            {/* Tithes segment */}
            <circle
              cx="21"
              cy="21"
              r="15.91549430918954"
              fill="transparent"
              className={data[0].color}
              strokeWidth="4.5"
              strokeDasharray={`${tithePct} ${100 - tithePct}`}
              strokeDashoffset={offsetTithe}
            />
            {/* Offerings segment */}
            <circle
              cx="21"
              cy="21"
              r="15.91549430918954"
              fill="transparent"
              className={data[1].color}
              strokeWidth="4.5"
              strokeDasharray={`${offeringPct} ${100 - offeringPct}`}
              strokeDashoffset={offsetOffering}
            />
            {/* Donations segment */}
            <circle
              cx="21"
              cy="21"
              r="15.91549430918954"
              fill="transparent"
              className={data[2].color}
              strokeWidth="4.5"
              strokeDasharray={`${donationPct} ${100 - donationPct}`}
              strokeDashoffset={offsetDonation}
            />
            {/* Thanksgiving segment */}
            <circle
              cx="21"
              cy="21"
              r="15.91549430918954"
              fill="transparent"
              className={data[3].color}
              strokeWidth="4.5"
              strokeDasharray={`${thanksPct} ${100 - thanksPct}`}
              strokeDashoffset={offsetThanks}
            />
            {/* Others segment */}
            {otherPct > 0 && (
              <circle
                cx="21"
                cy="21"
                r="15.91549430918954"
                fill="transparent"
                className={data[4].color}
                strokeWidth="4.5"
                strokeDasharray={`${otherPct} ${100 - otherPct}`}
                strokeDashoffset={offsetOther}
              />
            )}
          </svg>
          {/* Inner overlay text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center leading-none text-center p-3">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Total</span>
            <span className="text-sm font-black text-gray-900 mt-2 truncate w-full animate-fade-in" title={formatLKR(total)}>
              {formatLKR(total)}
            </span>
          </div>
        </div>

        {/* Legend list below */}
        <div className="mt-8 w-full space-y-3">
          {data.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-xs font-semibold text-gray-500">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                <span>{item.label}</span>
              </div>
              <span className="text-gray-900 font-extrabold">{item.pct}% ({formatLKR(item.value)})</span>
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
