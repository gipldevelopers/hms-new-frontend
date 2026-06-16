"use client";

import React from "react";

export function ConsumptionPeakHours({ records = [] }) {
  // Initialize counts for each hour slot
  const counts = {
    "08:00": 0,
    "10:00": 0,
    "12:00": 0,
    "14:00": 0,
    "16:00": 0,
    "18:00": 0,
    "20:00": 0
  };

  // Group records into hourly slots based on their creation timestamps
  records.forEach(r => {
    const dateObj = r.createdAt ? new Date(r.createdAt) : new Date();
    const hour = dateObj.getHours();

    if (hour >= 7 && hour < 10) counts["08:00"] += 1;
    else if (hour >= 10 && hour < 12) counts["10:00"] += 1;
    else if (hour >= 12 && hour < 14) counts["12:00"] += 1;
    else if (hour >= 14 && hour < 16) counts["14:00"] += 1;
    else if (hour >= 16 && hour < 18) counts["16:00"] += 1;
    else if (hour >= 18 && hour < 20) counts["18:00"] += 1;
    else if (hour >= 20 || hour < 7) counts["20:00"] += 1;
  });

  const maxCount = Math.max(...Object.values(counts));

  // Fallback heights if no records exist yet (maintaining mockup look)
  const fallbacks = {
    "08:00": 30,
    "10:00": 55,
    "12:00": 100,
    "14:00": 85,
    "16:00": 65,
    "18:00": 40,
    "20:00": 20
  };

  const getBarHeight = (slot) => {
    if (maxCount === 0) {
      return `${fallbacks[slot]}px`;
    }
    const count = counts[slot];
    const pct = (count / maxCount) * 100;
    // Map to a responsive height value between 15px and 110px
    const height = Math.max(15, Math.round((pct / 100) * 110));
    return `${height}px`;
  };

  // Find the peak slot dynamically
  const peakSlot = maxCount === 0 
    ? "12:00" 
    : Object.keys(counts).reduce((a, b) => counts[a] >= counts[b] ? a : b);

  return (
    <div className="bg-white dark:bg-[#1e293b] p-6 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] shadow-none flex flex-col justify-between h-full min-h-[220px]">
      <div>
        <h2 className="text-[15px] font-extrabold text-slate-800 dark:text-white">
          Consumption Peak Hours
        </h2>
        <p className="text-[12px] text-slate-400 dark:text-slate-500 mt-1">
          Hourly usage distribution during active procedures.
        </p>
      </div>

      {/* Dynamic Visual Bar Chart */}
      <div className="mt-8 flex flex-col justify-end h-[140px] w-full">
        <div className="flex items-end justify-between h-[120px] px-2 gap-2">
          {Object.keys(counts).map((slot) => {
            const isPeak = slot === peakSlot;
            const logCount = counts[slot];

            return (
              <div key={slot} className="flex flex-col items-center flex-1 group relative">
                {/* Micro-tooltip above the bar */}
                <div className="absolute bottom-[calc(100%+8px)] bg-slate-800 dark:bg-slate-900 text-white text-[9px] px-2 py-1 rounded-[3px] opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none font-bold whitespace-nowrap z-10 shadow-md transform translate-y-1 group-hover:translate-y-0">
                  {logCount} {logCount === 1 ? "log entry" : "log entries"}
                </div>

                {/* Animated bar */}
                <div
                  className={`w-full max-w-[36px] transition-all duration-500 rounded-[3px] cursor-pointer ${
                    isPeak
                      ? "bg-[#2E37A4] shadow-sm shadow-[#2E37A4]/25"
                      : "bg-[#2E37A4]/15 group-hover:bg-[#2E37A4]/35"
                  }`}
                  style={{ height: getBarHeight(slot) }}
                />

                {/* Label */}
                <span
                  className={`text-[10px] mt-2 font-bold transition-colors duration-250 ${
                    isPeak
                      ? "text-[#2E37A4] dark:text-[#5c64c7] font-black"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                >
                  {slot}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ConsumptionPeakHours;
