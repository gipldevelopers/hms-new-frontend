"use client";

import React from "react";

export function StockHealthStatus() {
  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 p-5 flex flex-col justify-between h-full">
      {/* Title matching exact mockup text */}
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-[14px] font-extrabold text-slate-800 dark:text-white uppercase tracking-wider leading-none">
          PENDING SOURCING & SETTLE APPROVALS
        </h3>
      </div>

      {/* Radial Health Gauge */}
      <div className="flex flex-col items-center py-4 relative mb-2">
        <div className="relative w-36 h-36 flex items-center justify-center">
          {/* SVG circle track */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="72"
              cy="72"
              r="60"
              stroke="#F3F4F6"
              strokeWidth="10"
              fill="transparent"
              className="dark:stroke-slate-800"
            />
            <circle
              cx="72"
              cy="72"
              r="60"
              stroke="#EF4444"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray="376.8"
              strokeDashoffset="59.5"
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-[25px] font-black text-red-500 leading-none">
              84.2%
            </span>
            <span className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase mt-1">
              HEALTHY
            </span>
          </div>
        </div>
      </div>

      {/* Stock Breakdown Status */}
      <div className="space-y-4 pt-5 border-t border-slate-100 dark:border-slate-800/60">
        <h4 className="text-[12px] font-extrabold text-slate-500 dark:text-slate-400 tracking-wider uppercase mb-3">
          INSURANCE & TPA STATUS
        </h4>

        {/* Healthy Stocks */}
        <div>
          <div className="flex justify-between items-center text-[11px] font-bold text-slate-700 dark:text-slate-400 mb-1.5">
            <span>Healthy Stocks</span>
            <span className="text-[#10B981]">68%</span>
          </div>
          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-[#10B981] rounded-full" style={{ width: "68%" }}></div>
          </div>
        </div>

        {/* Low Warning */}
        <div>
          <div className="flex justify-between items-center text-[11px] font-bold text-slate-700 dark:text-slate-400 mb-1.5">
            <span>Low Warning</span>
            <span className="text-[#F59E0B]">24%</span>
          </div>
          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-[#F59E0B] rounded-full" style={{ width: "24%" }}></div>
          </div>
        </div>

        {/* Critical/Zero */}
        <div>
          <div className="flex justify-between items-center text-[11px] font-bold text-slate-700 dark:text-slate-400 mb-1.5">
            <span>Critical/Zero</span>
            <span className="text-[#EF4444]">8%</span>
          </div>
          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-[#EF4444] rounded-full" style={{ width: "8%" }}></div>
          </div>
        </div>

        {/* Expired Batches */}
        <div>
          <div className="flex justify-between items-center text-[11px] font-bold text-slate-700 dark:text-slate-400 mb-1.5">
            <span>Expired Batches</span>
            <span className="text-[#EF4444]">8%</span>
          </div>
          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-[#EF4444] rounded-full" style={{ width: "8%" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StockHealthStatus;
