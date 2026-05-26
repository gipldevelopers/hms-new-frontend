"use client";

import React from "react";
import { PieChart, Activity, Clock, RefreshCcw } from "lucide-react";

export function ReportsOTStats() {
  const stats = [
    {
      title: "OT Utilization Rate",
      value: "84%",
      trend: "+95%",
      trendLabel: "in last 7 Days",
      icon: PieChart,
      iconBg: "bg-[#EEF2FF] text-[#4F46E5] dark:bg-indigo-950/40 dark:text-indigo-400",
      type: "bars",
      bars: [12, 28, 12, 45, 32],
      barColor: "bg-[#2E3A8C] dark:bg-[#818CF8]"
    },
    {
      title: "Surgeries Today",
      value: "42",
      trend: "+25%",
      trendLabel: "in last 7 Days",
      icon: Activity,
      iconBg: "bg-[#FDF2F2] text-[#EF4444] dark:bg-red-950/40 dark:text-red-400",
      type: "wave",
      waveId: "gradSurgeries",
      strokeColor: "#F43F5E",
      fillColor: "rgba(244, 63, 94, 0.05)",
      path: "M0,35 C15,35 25,25 35,28 C45,30 55,10 65,22 C75,32 85,5 100,5"
    },
    {
      title: "Avg. Duration",
      value: "2h 18m",
      trend: "-15%",
      trendLabel: "in last 7 Days",
      icon: Clock,
      iconBg: "bg-[#E0F2FE] text-[#0284C7] dark:bg-sky-950/40 dark:text-sky-400",
      type: "bars",
      bars: [35, 12, 20, 15, 28, 24],
      barColor: "bg-[#0EA5E9] dark:bg-[#38BDF8]"
    },
    {
      title: "Turnover Time",
      value: "42m",
      subscript: "Avg",
      trend: "+25%",
      trendLabel: "in last 7 Days",
      icon: RefreshCcw,
      iconBg: "bg-[#ECFDF5] text-[#10B981] dark:bg-emerald-950/40 dark:text-[#10B981]",
      type: "wave",
      waveId: "gradTurnover",
      strokeColor: "#10B981",
      fillColor: "rgba(16, 185, 129, 0.05)",
      path: "M0,28 C20,38 40,25 60,20 C80,15 90,5 100,5"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px] font-sans">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="bg-card border border-border p-5 rounded-lg flex flex-col justify-between h-[135px] shadow-none hover:border-gray-300 dark:hover:border-white/20 transition-all overflow-hidden"
          >
            {/* Top row: Circular icon on the left, trend info on the right */}
            <div className="flex justify-between items-start w-full shrink-0">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${stat.iconBg}`}>
                <Icon className="w-4.5 h-4.5" />
              </div>
              <div className="flex flex-col items-end">
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-[4px] leading-none ${
                  stat.trend.startsWith("+")
                    ? "bg-[#ECFDF5] text-[#10B981] dark:bg-emerald-950/30 dark:text-emerald-400"
                    : "bg-[#FDF2F2] text-[#EF4444] dark:bg-red-950/30 dark:text-red-400"
                }`}>
                  {stat.trend}
                </span>
                <span className="text-[9px] text-gray-400 dark:text-slate-500 font-bold mt-1">
                  {stat.trendLabel}
                </span>
              </div>
            </div>

            {/* Bottom row: Title and value on the left, sparkline on the right */}
            <div className="flex justify-between items-end w-full mt-auto">
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] font-extrabold text-gray-400 dark:text-slate-500 uppercase tracking-wider leading-none">
                  {stat.title}
                </span>
                <div className="flex items-baseline gap-1 mt-1 leading-none">
                  <span className="text-[24px] font-extrabold text-[#101935] dark:text-white leading-none">
                    {stat.value}
                  </span>
                  {stat.subscript && (
                    <span className="text-[9px] font-bold text-gray-400 dark:text-slate-500 ml-0.5">
                      {stat.subscript}
                    </span>
                  )}
                </div>
              </div>

              {/* Sparkline Graph */}
              <div className="shrink-0 pl-3">
                {stat.type === "bars" ? (
                  <div className="flex items-end gap-1 h-[40px]">
                    {stat.bars.map((barHeight, i) => (
                      <div
                        key={i}
                        className={`w-1.5 rounded-t-[1.5px] ${stat.barColor}`}
                        style={{ height: `${barHeight}px` }}
                      ></div>
                    ))}
                  </div>
                ) : (
                  <div className="w-[75px] h-[40px] flex items-end">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40">
                      <path
                        d={stat.path}
                        stroke={stat.strokeColor}
                        strokeWidth={2}
                        fill="none"
                      />
                      <path
                        d={`${stat.path} L100,40 L0,40 Z`}
                        fill={stat.fillColor}
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
