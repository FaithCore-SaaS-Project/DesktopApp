import React from 'react';
import { FinanceMock } from '../../../services/mockData';

interface ExpenseOverviewChartProps {
  transactions: FinanceMock[];
}

export default function ExpenseOverviewChart({ transactions }: ExpenseOverviewChartProps) {
  // Aggregate expenses for specific intervals (matching May dates: 1st, 8th, 15th, 22nd, 31st)
  // Base seeds for mock visualization
  const points = [
    { label: "1 May", value: 120000 },
    { label: "8 May", value: 180000 },
    { label: "15 May", value: 150000 },
    { label: "22 May", value: 380000 },
    { label: "31 May", value: 290000 },
  ];

  // Add db transactions dynamically based on date range
  const dbExpenses = transactions.filter(t => t.type === 'expense');
  dbExpenses.forEach(t => {
    const day = new Date(t.date).getDate();
    if (day <= 7) points[0].value += t.amount;
    else if (day <= 14) points[1].value += t.amount;
    else if (day <= 21) points[2].value += t.amount;
    else if (day <= 28) points[3].value += t.amount;
    else points[4].value += t.amount;
  });

  const maxVal = Math.max(...points.map(p => p.value), 400000) * 1.25;

  // Chart coordinates mapping (Width: 400, Height: 150, padding-left: 50, padding-bottom: 25)
  const chartWidth = 330;
  const chartHeight = 100;
  const paddingLeft = 50;
  const paddingTop = 15;

  const getCoordinates = () => {
    return points.map((p, idx) => {
      const x = paddingLeft + (idx * (chartWidth / (points.length - 1)));
      const y = paddingTop + chartHeight - (p.value / maxVal) * chartHeight;
      return { x, y };
    });
  };

  const coords = getCoordinates();
  
  // Construct paths
  const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');
  const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${paddingTop + chartHeight} L ${coords[0].x} ${paddingTop + chartHeight} Z`;

  const formatShortLKR = (val: number) => {
    if (val >= 100000) return (val / 1000000).toFixed(1) + 'M';
    if (val >= 1000) return (val / 1000).toFixed(0) + 'K';
    return val.toString();
  };

  return (
    <div className="rounded-2xl border border-gray-150 bg-white p-6 shadow-sm flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-800">
          Monthly Expense Overview
        </h2>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-500">
          <span className="h-2 w-2 rounded-full bg-rose-500" />
          <span>Expenses (Rs.)</span>
        </div>
      </div>

      <div className="h-56 w-full relative">
        <svg width="100%" height="100%" viewBox="0 0 400 150" className="overflow-visible">
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = paddingTop + ratio * chartHeight;
            const gridVal = maxVal * (1 - ratio);
            return (
              <g key={idx}>
                <line 
                  x1={paddingLeft} 
                  y1={y} 
                  x2={paddingLeft + chartWidth} 
                  y2={y} 
                  stroke="#f1f5f9" 
                  strokeWidth="1" 
                />
                <text 
                  x={paddingLeft - 8} 
                  y={y + 3} 
                  textAnchor="end" 
                  className="fill-gray-400 text-[9px] font-bold"
                >
                  {formatShortLKR(gridVal)}
                </text>
              </g>
            );
          })}

          {/* Area under the line */}
          <path d={areaPath} fill="url(#areaGrad)" />

          {/* Trend line */}
          <path d={linePath} fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />

          {/* Dots on points */}
          {coords.map((c, idx) => (
            <circle 
              key={idx}
              cx={c.x}
              cy={c.y}
              r="4.5"
              fill="#ffffff"
              stroke="#ef4444"
              strokeWidth="2"
              className="hover:scale-125 transition-transform cursor-pointer"
            >
              <title>{`Rs. ${points[idx].value.toLocaleString()}`}</title>
            </circle>
          ))}

          {/* X-axis labels */}
          {points.map((p, idx) => {
            const x = paddingLeft + (idx * (chartWidth / (points.length - 1)));
            return (
              <text 
                key={idx}
                x={x} 
                y={paddingTop + chartHeight + 16} 
                textAnchor="middle" 
                className="fill-gray-400 text-[10px] font-bold"
              >
                {p.label}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
