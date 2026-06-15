import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { apiService } from '../../services/api';

export default function ReportCharts() {
  const [periodPreset, setPeriodPreset] = useState('Monthly');

  // --- 1. SVG Donut Calculations for Income ---
  // Data sums up to exactly 100%
  const incomeData = [
    { label: "Tithes", pct: 42.4, value: 1750000, color: "stroke-[#10B981] bg-[#10B981]" },
    { label: "Offerings", pct: 30.3, value: 1250000, color: "stroke-[#3B82F6] bg-[#3B82F6]" },
    { label: "Donations", pct: 16.4, value: 675000, color: "stroke-[#F59E0B] bg-[#F59E0B]" },
    { label: "Events", pct: 7.3, value: 300000, color: "stroke-[#8B5CF6] bg-[#8B5CF6]" },
    { label: "Other Income", pct: 3.6, value: 150750, color: "stroke-[#EC4899] bg-[#EC4899]" },
  ];

  let currentIncOffset = 100;
  const incomeSegments = incomeData.map(item => {
    const segment = {
      ...item,
      dashArray: `${item.pct} ${100 - item.pct}`,
      offset: currentIncOffset
    };
    currentIncOffset -= item.pct;
    return segment;
  });

  // --- 2. SVG Donut Calculations for Expenses ---
  // Data sums up to exactly 100%
  const expenseData = [
    { label: "Ministry", pct: 39.1, value: 950000, color: "stroke-[#EF4444] bg-[#EF4444]" },
    { label: "Administration", pct: 26.7, value: 650000, color: "stroke-[#F97316] bg-[#F97316]" },
    { label: "Facilities", pct: 16.5, value: 400000, color: "stroke-[#06B6D4] bg-[#06B6D4]" },
    { label: "Events", pct: 10.3, value: 250000, color: "stroke-[#8B5CF6] bg-[#8B5CF6]" },
    { label: "Other Expenses", pct: 7.4, value: 180750, color: "stroke-[#6B7280] bg-[#6B7280]" },
  ];

  let currentExpOffset = 100;
  const expenseSegments = expenseData.map(item => {
    const segment = {
      ...item,
      dashArray: `${item.pct} ${100 - item.pct}`,
      offset: currentExpOffset
    };
    currentExpOffset -= item.pct;
    return segment;
  });

  // --- 3. Trend Data & SVG Path Coordinates ---
  // Monthly values representing Dec 2024 to May 2025
  const trendData = [
    { month: "Dec 2024", income: 320000, expense: 200000, x: 25, incY: 130, expY: 150 },
    { month: "Jan 2025", income: 410000, expense: 250000, x: 115, incY: 98, expY: 135 },
    { month: "Feb 2025", income: 430000, expense: 270000, x: 205, incY: 92, expY: 128 },
    { month: "Mar 2025", income: 520000, expense: 310000, x: 295, incY: 65, expY: 110 },
    { month: "Apr 2025", income: 480000, expense: 290000, x: 385, incY: 78, expY: 118 },
    { month: "May 2025", income: 450000, expense: 270000, x: 475, incY: 88, expY: 125 }
  ];

  // SVG dimensions for trend chart: viewBox="0 0 500 180"
  const incomePath = "M 25 130 Q 70 100 115 98 T 205 92 T 295 65 T 385 78 T 475 88";
  const expensePath = "M 25 150 Q 70 140 115 135 T 205 128 T 295 110 T 385 118 T 475 125";

  const incomeFillPath = `${incomePath} L 475 180 L 25 180 Z`;
  const expenseFillPath = `${expensePath} L 475 180 L 25 180 Z`;

  // Period table data
  const summaryPeriods = [
    { period: "This Month (May 2025)", income: 650250, expense: 380450, surplus: 269800, pct: "41.5%" },
    { period: "This Quarter (Q2 2025)", income: 1895500, expense: 1120300, surplus: 775200, pct: "40.9%" },
    { period: "This Year (2025)", income: 4125750, expense: 2430750, surplus: 1695000, pct: "41.1%" },
    { period: "Last Year (2024)", income: 3480000, expense: 2210000, surplus: 1270000, pct: "36.5%" }
  ];

  // Export summary period table
  const handleExportTable = async () => {
    let html = `
      <html>
        <head>
          <style>
            body { font-family: sans-serif; padding: 30px; }
            h1 { text-align: center; color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f5f6fa; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>Summary by Period</h1>
          <table>
            <thead>
              <tr>
                <th>Period</th>
                <th>Income (Rs.)</th>
                <th>Expenses (Rs.)</th>
                <th>Net Surplus (Rs.)</th>
                <th>Surplus %</th>
              </tr>
            </thead>
            <tbody>
    `;

    summaryPeriods.forEach(p => {
      html += `
        <tr>
          <td>${p.period}</td>
          <td>${p.income.toLocaleString()}</td>
          <td>${p.expense.toLocaleString()}</td>
          <td>${p.surplus.toLocaleString()}</td>
          <td style="color: green; font-weight: bold;">${p.pct}</td>
        </tr>
      `;
    });

    html += `
            </tbody>
          </table>
        </body>
      </html>
    `;

    try {
      const res = await apiService.printToPDF(html, 'summary-by-period.pdf');
      if (res.success) {
        alert('Period Summary successfully exported to PDF!');
      } else {
        alert(`Export failed: ${res.error}`);
      }
    } catch (err) {
      console.error(err);
      alert('Error exporting Period Summary.');
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Line Chart: Income vs Expenses Trend */}
      <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-extrabold text-gray-900 text-lg">
            Income vs Expenses Trend
          </h2>
          <div className="relative">
            <select
              value={periodPreset}
              onChange={(e) => setPeriodPreset(e.target.value)}
              className="rounded-xl border border-gray-200 px-3 py-1.5 pr-8 text-xs font-bold text-gray-650 outline-none cursor-pointer bg-white appearance-none"
            >
              <option value="Monthly">Monthly</option>
              <option value="Weekly">Weekly</option>
            </select>
          </div>
        </div>

        {/* Dynamic SVG Chart */}
        <div className="h-72 rounded-2xl bg-[#FCFDFF] border border-gray-100 p-4 relative flex flex-col justify-between overflow-hidden">
          {/* Chart Legend */}
          <div className="flex items-center justify-end gap-4 text-[10px] font-bold text-gray-400 absolute top-4 right-4 z-10 uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#10B981]" />
              <span>Income</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#EF4444]" />
              <span>Expenses</span>
            </div>
          </div>

          <div className="relative flex-1 w-full mt-6">
            {/* Y Axis Guides */}
            <div className="absolute inset-0 flex flex-col justify-between text-[10px] font-bold text-gray-400 pointer-events-none select-none">
              <div className="w-full flex items-center justify-between border-b border-gray-100/60 pb-1">
                <span>Rs. 600K</span>
              </div>
              <div className="w-full flex items-center justify-between border-b border-gray-100/60 pb-1">
                <span>Rs. 450K</span>
              </div>
              <div className="w-full flex items-center justify-between border-b border-gray-100/60 pb-1">
                <span>Rs. 300K</span>
              </div>
              <div className="w-full flex items-center justify-between border-b border-gray-100/60 pb-1">
                <span>Rs. 150K</span>
              </div>
              <div className="w-full flex items-center justify-between">
                <span>Rs. 0</span>
              </div>
            </div>

            {/* SVG Vectors */}
            <svg className="w-full h-full absolute inset-0" viewBox="0 0 500 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id="inc-trend-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="exp-trend-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#EF4444" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Vertical dotted guides */}
              <line x1="115" y1="0" x2="115" y2="180" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="205" y1="0" x2="205" y2="180" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="295" y1="0" x2="295" y2="180" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="385" y1="0" x2="385" y2="180" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />

              {/* Expense Curve Area */}
              <path d={expenseFillPath} fill="url(#exp-trend-grad)" />
              <path d={expensePath} fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />

              {/* Income Curve Area */}
              <path d={incomeFillPath} fill="url(#inc-trend-grad)" />
              <path d={incomePath} fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />

              {/* Data Node Dots */}
              {trendData.map((d, idx) => (
                <g key={idx} className="group cursor-pointer">
                  {/* Income point */}
                  <circle cx={d.x} cy={d.incY} r="4.5" fill="#FFFFFF" stroke="#10B981" strokeWidth="2.5" className="transition-all hover:r-6" />
                  {/* Expense point */}
                  <circle cx={d.x} cy={d.expY} r="4.5" fill="#FFFFFF" stroke="#EF4444" strokeWidth="2.5" className="transition-all hover:r-6" />
                </g>
              ))}
            </svg>
          </div>

          {/* X Axis labels */}
          <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 mt-2 px-3 border-t border-gray-100 pt-1.5 select-none">
            {trendData.map((d, idx) => (
              <span key={idx}>{d.month}</span>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Pie/Donut Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 2A: Income By Category */}
        <div className="bg-white border border-gray-150 rounded-3xl p-5 shadow-sm">
          <h3 className="font-extrabold text-gray-900 text-sm mb-4">
            Income By Category (This Year)
          </h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 min-h-[220px]">
            {/* SVG Donut */}
            <div className="relative h-36 w-36 flex-shrink-0">
              <svg width="100%" height="100%" viewBox="0 0 42 42" className="transform -rotate-90">
                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f8fafc" strokeWidth="4.2" />
                {incomeSegments.map((seg, idx) => (
                  <circle
                    key={idx}
                    cx="21"
                    cy="21"
                    r="15.915"
                    fill="transparent"
                    className={seg.color}
                    strokeWidth="4.2"
                    strokeDasharray={seg.dashArray}
                    strokeDashoffset={seg.offset}
                  />
                ))}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center leading-none text-center">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Surplus</span>
                <span className="text-lg font-black text-gray-950 mt-1">41.1%</span>
              </div>
            </div>

            {/* Legends */}
            <div className="space-y-2.5 flex-1 w-full text-xs font-semibold">
              {incomeData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
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

        {/* Card 2B: Expenses By Category */}
        <div className="bg-white border border-gray-150 rounded-3xl p-5 shadow-sm">
          <h3 className="font-extrabold text-gray-900 text-sm mb-4">
            Expenses By Category (This Year)
          </h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 min-h-[220px]">
            {/* SVG Donut */}
            <div className="relative h-36 w-36 flex-shrink-0">
              <svg width="100%" height="100%" viewBox="0 0 42 42" className="transform -rotate-90">
                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f8fafc" strokeWidth="4.2" />
                {expenseSegments.map((seg, idx) => (
                  <circle
                    key={idx}
                    cx="21"
                    cy="21"
                    r="15.915"
                    fill="transparent"
                    className={seg.color}
                    strokeWidth="4.2"
                    strokeDasharray={seg.dashArray}
                    strokeDashoffset={seg.offset}
                  />
                ))}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center leading-none text-center">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Expenses</span>
                <span className="text-lg font-black text-gray-950 mt-1">2.4M</span>
              </div>
            </div>

            {/* Legends */}
            <div className="space-y-2.5 flex-1 w-full text-xs font-semibold">
              {expenseData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
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
      </div>

      {/* 3. Summary Period Table */}
      <div className="bg-white border border-gray-150 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between pl-6 bg-white">
          <h3 className="font-extrabold text-gray-900 text-sm">
            Summary By Period
          </h3>
          <button
            type="button"
            onClick={handleExportTable}
            className="p-2 border border-gray-200 hover:bg-gray-50 text-gray-400 hover:text-gray-700 rounded-xl cursor-pointer shadow-sm transition-all"
            title="Export Summary"
          >
            <Download size={14} />
          </button>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-150 text-gray-400 text-[10px] font-bold uppercase tracking-wider bg-gray-50/70">
              <th className="text-left p-4 pl-6 font-bold">Period</th>
              <th className="text-right p-4 font-bold">Income (Rs.)</th>
              <th className="text-right p-4 font-bold">Expenses (Rs.)</th>
              <th className="text-right p-4 font-bold">Net Surplus (Rs.)</th>
              <th className="text-center p-4 pr-6 font-bold">Surplus %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-xs font-bold text-gray-650">
            {summaryPeriods.map((p, idx) => (
              <tr key={idx} className="hover:bg-gray-55/45 border-t border-gray-100 group transition-colors select-none">
                <td className="p-4 pl-6 text-gray-900">{p.period}</td>
                <td className="p-4 text-right">{p.income.toLocaleString()}</td>
                <td className="p-4 text-right">{p.expense.toLocaleString()}</td>
                <td className="p-4 text-right text-gray-900">{p.surplus.toLocaleString()}</td>
                <td className="p-4 pr-6 text-center text-green-600 font-extrabold">{p.pct}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
