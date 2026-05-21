"use client";

import React from "react";
import { Users } from "lucide-react";

export function ReportsPerformanceMetrics() {
  const metrics = [
    {
      name: "ICU",
      trend: "+0.25%",
      available: 3,
      total: 40,
      occupied: 37,
      pct: 92.5,
    },
    {
      name: "Emergency",
      trend: "+0.25%",
      available: 4,
      total: 30,
      occupied: 26,
      pct: 86.7,
    },
    {
      name: "NICU",
      trend: "+0.25%",
      available: 5,
      total: 10,
      occupied: 15,
      pct: 75.0,
    },
    {
      name: "Isolation",
      trend: "+0.25%",
      available: 3,
      total: 15,
      occupied: 12,
      pct: 80.0,
    },
    {
      name: "General ward",
      trend: "+0.25%",
      available: 75,
      total: 254,
      occupied: 170,
      pct: 69.4,
    },
    {
      name: "Private Rooms",
      trend: "+0.25%",
      available: 18,
      total: 100,
      occupied: 82,
      pct: 82.0,
    },
  ];

  return (
    <div className="w-full bg-card rounded-lg border border-border flex flex-col font-sans transition-all overflow-hidden shadow-none hover:border-gray-300 dark:hover:border-white/20 p-5 md:h-[350px] h-auto justify-between">
      <div className="border-b border-border pb-3 mb-3">
        <h3 className="text-[16px] font-bold text-[#1e293b] dark:text-white leading-none">
          Performance Metrics
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
        {metrics.map((metric, i) => (
          <div
            key={i}
            className="bg-white dark:bg-[#1E293B]/20 rounded-lg border border-border/80 dark:border-white/5 p-3 flex flex-col justify-between"
          >
            {/* Header: Name and Trend */}
            <div className="flex justify-between items-center">
              <span className="text-[14px] font-bold text-[#1e293b] dark:text-white">
                {metric.name}
              </span>
              <span className="text-[11px] font-bold text-[#2ECC71]">
                {metric.trend}
              </span>
            </div>

            {/* Subtitle: Available */}
            <span className="text-[10px] text-gray-400 dark:text-slate-500 font-semibold mt-0.5">
              Available
            </span>

            {/* Ratios & Occupied */}
            <div className="flex justify-between items-end mt-1.5 mb-2">
              <div className="text-[11px] text-gray-400 font-semibold">
                <span className="text-[16px] font-extrabold text-[#1e293b] dark:text-white">
                  {metric.available}
                </span>
                /{metric.total}
              </div>
              <div className="flex items-center gap-1 text-[14px] font-bold text-[#1e293b] dark:text-white">
                <Users className="w-4 h-4 text-gray-400" />
                <span>{metric.occupied}</span>
              </div>
            </div>

            {/* Thick Progress Line */}
            <div className="w-full h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#5C67FF] rounded-full"
                style={{ width: `${metric.pct}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
