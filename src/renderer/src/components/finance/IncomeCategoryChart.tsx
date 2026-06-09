import React from 'react';

interface IncomeCategoryChartProps {
  titheAmount?: number;
  offeringAmount?: number;
  buildingAmount?: number;
  otherAmount?: number;
}

export default function IncomeCategoryChart({
  titheAmount = 1470000,
  offeringAmount = 612500,
  buildingAmount = 367500,
  otherAmount = 0
}: IncomeCategoryChartProps) {
  
  const total = titheAmount + offeringAmount + buildingAmount + otherAmount;

  // Compute percentages
  const tithePct = total > 0 ? Math.round((titheAmount / total) * 100) : 60;
  const offeringPct = total > 0 ? Math.round((offeringAmount / total) * 105) - Math.round((offeringAmount / total) * 100) > 0 ? Math.round((offeringAmount / total) * 100) : 25 : 25;
  const buildingPct = total > 0 ? Math.round((buildingAmount / total) * 100) : 15;
  
  // Clean totals for final list
  const data = [
    { label: "Tithes", pct: tithePct, value: titheAmount, color: "stroke-[#5B3DF5] bg-[#5B3DF5]" },
    { label: "Offerings", pct: offeringPct, value: offeringAmount, color: "stroke-emerald-500 bg-emerald-500" },
    { label: "Building Fund", pct: buildingPct, value: buildingAmount, color: "stroke-amber-500 bg-amber-500" },
  ];

  // SVG donut segments offsets:
  // Circumference = 100.
  // segment 1: dasharray="tithePct 100-tithePct" offset="100"
  // segment 2: dasharray="offeringPct 100-offeringPct" offset="100 - tithePct"
  // segment 3: dasharray="buildingPct 100-buildingPct" offset="100 - tithePct - offeringPct"
  const offset1 = 100;
  const offset2 = 100 - tithePct;
  const offset3 = 100 - tithePct - offeringPct;

  return (
    <div className="rounded-3xl border border-gray-150 bg-white p-6 shadow-sm flex flex-col h-full">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-extrabold text-gray-900">
          Income by Category
        </h2>
        <select className="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-650 outline-none cursor-pointer bg-white">
          <option>This Month</option>
        </select>
      </div>

      <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-6 min-h-[260px]">
        {/* SVG Donut */}
        <div className="relative h-44 w-44">
          <svg width="100%" height="100%" viewBox="0 0 42 42" className="transform -rotate-90">
            {/* Background ring */}
            <circle
              cx="21"
              cy="21"
              r="15.91549430918954"
              fill="transparent"
              stroke="#f8fafc"
              strokeWidth="4.2"
            />
            {/* Segment 1: Tithes */}
            <circle
              cx="21"
              cy="21"
              r="15.91549430918954"
              fill="transparent"
              className={data[0].color}
              strokeWidth="4.2"
              strokeDasharray={`${tithePct} ${100 - tithePct}`}
              strokeDashoffset={offset1}
            />
            {/* Segment 2: Offerings */}
            <circle
              cx="21"
              cy="21"
              r="15.91549430918954"
              fill="transparent"
              className={data[1].color}
              strokeWidth="4.2"
              strokeDasharray={`${offeringPct} ${100 - offeringPct}`}
              strokeDashoffset={offset2}
            />
            {/* Segment 3: Building Fund */}
            <circle
              cx="21"
              cy="21"
              r="15.91549430918954"
              fill="transparent"
              className={data[2].color}
              strokeWidth="4.2"
              strokeDasharray={`${buildingPct} ${100 - buildingPct}`}
              strokeDashoffset={offset3}
            />
          </svg>
          {/* Inner Text overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center leading-none text-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Giving</span>
            <span className="text-xl font-black text-gray-900 mt-1.5">100%</span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-3 flex-1 w-full sm:w-auto">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center gap-2 text-gray-500">
                <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                <span>{item.label}</span>
              </div>
              <span className="text-gray-950 font-bold">{item.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
