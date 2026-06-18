"use client";

import React from "react";
import { Bed, Activity, Ambulance, BadgeIndianRupee, Clock, ShieldAlert, RotateCcw, HeartPulse } from "lucide-react";

function ReportsBedOccupancyCard({ title, value, trend, trendSuffix, isUp, icon: Icon }) {
  return (
    <div className="bg-card p-5 rounded-lg border border-border flex flex-col justify-between md:h-[134px] min-h-[134px] h-auto transition-all w-full shadow-none hover:border-gray-300 dark:hover:border-white/20">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <p className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
            {title}
          </p>
          <h2 className="text-[24px] mt-[4px] font-bold text-[#1e293b] dark:text-white tracking-tight leading-none">
            {value}
          </h2>
        </div>
        <div className="w-10 h-10 rounded-[6px] flex items-center justify-center bg-[#EFF2FC] dark:bg-indigo-950/40 shrink-0">
          <Icon className="w-5 h-5 text-[#3F51B5] dark:text-[#818CF8]" />
        </div>
      </div>

      <div className="flex items-center gap-1.5 mt-2">
        <span className={isUp ? "text-[#2ECC71] text-[14px] font-bold" : "text-[#FF5C5C] text-[14px] font-bold"}>
          {trend}
        </span>
        <span className="text-[14px] text-gray-400 dark:text-slate-500">
          {trendSuffix}
        </span>
      </div>
    </div>
  );
}

export function ReportsBedOccupancyStats({ stats }) {
  const cards = [
    { title: "TOTAL BEDS", value: stats?.totalBeds ?? "0", trend: "+12%", trendSuffix: "vs yesterday", isUp: true, icon: Bed },
    { title: "OCCUPIED BEDS", value: stats?.occupiedBeds ?? "0", trend: "+5%", trendSuffix: "vs yesterday", isUp: true, icon: Activity },
    { title: "AVAILABLE BEDS", value: stats?.availableBeds ?? "0", trend: "-2", trendSuffix: "vs avg", isUp: false, icon: Ambulance },
    { title: "ICU OCCUPANCY", value: `${stats?.icuOccupancyPct ?? 0}%`, trend: "+2%", trendSuffix: "vs yesterday", isUp: true, icon: BadgeIndianRupee },
    { title: "ISOLATION", value: `${stats?.isolationPct ?? 0}%`, trend: "+1.5d", trendSuffix: "vs yesterday", isUp: true, icon: Clock },
    { title: "EXPECTED DISCHARGES", value: stats?.expectedDischarges ?? "0", trend: "+5%", trendSuffix: "vs yesterday", isUp: true, icon: ShieldAlert },
    { title: "AVG STAY DURATION", value: stats?.avgStayDuration ?? "4.2d", trend: "-2%", trendSuffix: "vs avg", isUp: false, icon: RotateCcw },
    { title: "TURNOVER RATE", value: stats?.turnoverRate ?? "85 pts/day", trend: "+2", trendSuffix: "vs yesterday", isUp: true, icon: HeartPulse },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
      {cards.map((card, i) => (
        <ReportsBedOccupancyCard key={i} {...card} />
      ))}
    </div>
  );
}

