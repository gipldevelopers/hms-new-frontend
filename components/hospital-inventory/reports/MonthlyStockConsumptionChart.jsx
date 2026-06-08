"use client";

import React from "react";

const CHART_DATA = [
  // Week 1
  { week: "Week 1", bars: [
    { bottom: 45, top: 30 },
    { bottom: 55, top: 25 }
  ]},
  // Week 2
  { week: "Week 2", bars: [
    { bottom: 35, top: 40 },
    { bottom: 50, top: 35 }
  ]},
  // Week 3
  { week: "Week 3", bars: [
    { bottom: 48, top: 32 },
    { bottom: 52, top: 28 }
  ]},
  // Week 4
  { week: "Week 4", bars: [
    { bottom: 42, top: 33 },
    { bottom: 54, top: 26 }
  ]}
];

export function MonthlyStockConsumptionChart() {
  return (
    <div className="bg-white dark:bg-[#1e293b] p-6 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] shadow-none flex flex-col h-full">
      {/* Header Info */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[15px] font-extrabold text-slate-800 dark:text-white">
          Monthly Stock Consumption
        </h2>
        
        <div className="flex items-center gap-5">
          {/* Legend */}
          <div className="flex items-center gap-4 text-[11px] font-bold text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2E37A4]"></span>
              <span>Consumption</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></span>
              <span>Projected</span>
            </div>
          </div>

          {/* Selector */}
          <select className="h-8 px-2 rounded-[4px] border border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#0f172a] text-[11px] font-bold text-slate-650 dark:text-slate-350 focus:outline-none">
            <option>Monthly</option>
            <option>Weekly</option>
          </select>
        </div>
      </div>

      {/* Chart Visual Elements */}
      <div className="flex-1 flex flex-col justify-end min-h-[220px] px-2">
        {/* Bars Container */}
        <div className="grid grid-cols-4 gap-8 items-end h-[180px]">
          {CHART_DATA.map((w, wIdx) => (
            <div key={wIdx} className="flex justify-center gap-3 h-full items-end">
              {w.bars.map((bar, bIdx) => (
                <div key={bIdx} className="w-[36px] flex flex-col justify-end h-full group cursor-pointer">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 relative">
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-slate-950 text-white text-[9px] px-1.5 py-0.5 rounded font-black whitespace-nowrap z-10 shadow-md">
                      C: {bar.bottom} | P: {bar.top}
                    </div>
                  </div>
                  {/* Top Bar (Projected) */}
                  <div 
                    style={{ height: `${bar.top}%` }} 
                    className="w-full bg-[#10b981] hover:bg-[#0d9468] rounded-t-[3px] transition-colors"
                  />
                  {/* Bottom Bar (Consumption) */}
                  <div 
                    style={{ height: `${bar.bottom}%` }} 
                    className="w-full bg-[#2E37A4] hover:bg-[#232a7d] transition-colors"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Labels Row */}
        <div className="grid grid-cols-4 gap-8 border-t border-[#e2e8f0] dark:border-[#334155] pt-3 mt-1.5">
          {CHART_DATA.map((w, idx) => (
            <div key={idx} className="text-center text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              {w.week}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MonthlyStockConsumptionChart;
