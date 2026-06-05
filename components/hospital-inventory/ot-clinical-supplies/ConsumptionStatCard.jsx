"use client";

import React from "react";

// Custom Bar Chart Square Icon to match mockup exactly
const BarChartSquareIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Outer Rounded Box */}
    <rect x="3" y="3" width="18" height="18" rx="2" />
    {/* Y-axis */}
    <line x1="7" y1="7" x2="7" y2="17" />
    {/* X-axis */}
    <line x1="7" y1="17" x2="17" y2="17" />
    {/* Bar 1 (Medium - Left) */}
    <line x1="10" y1="17" x2="10" y2="13" />
    {/* Bar 2 (Short - Middle) */}
    <line x1="13" y1="17" x2="13" y2="14.5" />
    {/* Bar 3 (Tallest - Right) */}
    <line x1="16" y1="17" x2="16" y2="8" />
  </svg>
);

export function ConsumptionStatCard({ totalConsumptionValue, budgetUtilization }) {
  return (
    <div className="bg-[#2E37A4] text-white p-6 rounded-[5px] relative overflow-hidden shadow-none flex flex-col justify-between min-h-[220px] h-full">
      {/* Active Shift Badge */}
      <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm border border-white/20 px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase">
        Active Shift
      </div>

      <div className="space-y-2 mt-4">
        {/* Icon */}
        <div className="mb-4">
          <BarChartSquareIcon className="w-7 h-7 text-white" />
        </div>
        <p className="text-[12px] font-bold text-white/70 uppercase tracking-wide">
          Today's Consumption Value
        </p>
        <h3 className="text-[32px] font-black tracking-tight leading-none">
          ₹{totalConsumptionValue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h3>
      </div>

      <div className="space-y-2 mt-6">
        <div className="flex justify-between text-[11px] font-bold text-white/80">
          <span>Daily Budget Utilization</span>
          <span>{budgetUtilization}%</span>
        </div>
        <div className="w-full bg-white/15 h-2 rounded-full overflow-hidden">
          <div
            className="bg-white h-full rounded-full transition-all duration-550"
            style={{ width: `${budgetUtilization}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default ConsumptionStatCard;
