"use client";

import React from "react";

export function ResourceAllocation({ data = null }) {
  const allocatedPercent = data?.allocatedPercent ?? 100;
  const categories = data?.categories || [
    { name: "Consumption", percentage: 75, colorClass: "bg-violet-500", dotClass: "bg-violet-500" },
    { name: "Reserves", percentage: 25, colorClass: "bg-teal-400", dotClass: "bg-teal-400" },
    { name: "Other", percentage: 12, colorClass: "bg-slate-400", dotClass: "bg-slate-400" }
  ];

  const strokeOffset = 2 * Math.PI * 52 * (1 - (allocatedPercent / 100));

  return (
    <div className="bg-white dark:bg-[#1e293b] p-6 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] shadow-none flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-[15px] font-extrabold text-slate-800 dark:text-white">
          Resource Allocation
        </h2>
        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
          Live Tracking
        </span>
      </div>

      {/* Progress Ring Visual */}
      <div className="flex-1 flex flex-col justify-center items-center py-2">
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* SVG Circular Ring */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="52"
              className="stroke-slate-100 dark:stroke-slate-800"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="64"
              cy="64"
              r="52"
              className="stroke-teal-400"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 52}
              strokeDashoffset={strokeOffset}
              strokeLinecap="round"
            />
          </svg>
          {/* Inner Text */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-[20px] font-black text-slate-800 dark:text-white leading-none">
              {allocatedPercent}%
            </span>
            <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
              Allocated
            </span>
          </div>
        </div>
      </div>

      {/* Detail Categories */}
      <div className="mt-4 space-y-3.5">
        {categories.map((cat, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between text-[11px] font-extrabold text-slate-700 dark:text-slate-350">
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${cat.dotClass}`}></span>
                <span>{cat.name}</span>
              </div>
              <span>{cat.percentage}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div style={{ width: `${cat.percentage}%` }} className={`h-full ${cat.colorClass} rounded-full`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResourceAllocation;
