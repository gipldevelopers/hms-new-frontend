"use client";

import React from "react";
import { cn } from "@/lib/utils";

const DEPTS_DATA = [
  {
    name: "Emergency Dept.",
    subtitle: "Consumables High",
    percentage: 42,
    avatar: "ER",
    bg: "bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400"
  },
  {
    name: "Cardiology",
    subtitle: "Devices Stable",
    percentage: 28,
    avatar: "CR",
    bg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400"
  },
  {
    name: "Pediatrics",
    subtitle: "Vaccines Focus",
    percentage: 15,
    avatar: "PD",
    bg: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400"
  },
  {
    name: "Orthopedics",
    subtitle: "Implants Medium",
    percentage: 10,
    avatar: "OR",
    bg: "bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400"
  },
  {
    name: "General",
    subtitle: "Misc Goods",
    percentage: 5,
    avatar: "GN",
    bg: "bg-slate-100 text-slate-600 dark:bg-slate-800/40 dark:text-slate-400"
  }
];

export function TopUsageDepts() {
  return (
    <div className="bg-white dark:bg-[#1e293b] p-6 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] shadow-none flex flex-col h-full">
      <h2 className="text-[15px] font-extrabold text-slate-800 dark:text-white mb-5">
        Top Usage Depts
      </h2>

      <div className="space-y-4 flex-1 flex flex-col justify-between">
        {DEPTS_DATA.map((dept, idx) => (
          <div key={idx} className="flex justify-between items-center gap-3">
            {/* Avatar & Info */}
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center font-bold text-[12px] shrink-0",
                dept.bg
              )}>
                {dept.avatar}
              </div>
              <div>
                <h4 className="text-[13px] font-extrabold text-slate-800 dark:text-white leading-tight">
                  {dept.name}
                </h4>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 font-medium">
                  {dept.subtitle}
                </p>
              </div>
            </div>

            {/* Percentage */}
            <span className="text-[14px] font-black text-slate-700 dark:text-slate-200">
              {dept.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopUsageDepts;
