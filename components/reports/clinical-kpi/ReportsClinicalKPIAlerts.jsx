"use client";

import React from "react";
import { Heart, ShieldCheck, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

export function ReportsClinicalKPIAlerts() {
  return (
    <div className="space-y-[20px] font-sans">
      {/* Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
        {/* Recovery Rate Card */}
        <div className="bg-[#E6F9F0] dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 p-5 rounded-lg flex flex-col shadow-none hover:border-emerald-300 dark:hover:border-emerald-800 transition-all h-[145px]">
          <div className="flex justify-between items-start w-full">
            <div className="flex flex-col gap-0.5">
              <span className="text-[#10B981] dark:text-emerald-400 text-[10px] uppercase font-bold tracking-wider">
                Recovery Rate
              </span>
              <h4 className="text-[28px] font-extrabold text-[#065F46] dark:text-emerald-300 mt-1.5 leading-none">
                94.5%
              </h4>
            </div>
            <Heart className="text-[#10B981] dark:text-emerald-400 w-5 h-5 shrink-0" />
          </div>
          <div className="pt-2 mt-auto h-[32px] flex items-center justify-between text-[11px] text-[#047857] dark:text-emerald-400/80 font-extrabold">
            <span>Avg Recovery Time</span>
            <span className="text-[#065F46] dark:text-emerald-300 font-black">62 Days</span>
          </div>
        </div>

        {/* Compliance Score Card */}
        <div className="bg-[#EEF2FF] dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/60 p-5 rounded-lg flex flex-col shadow-none hover:border-indigo-300 dark:hover:border-indigo-800 transition-all h-[145px]">
          <div className="flex justify-between items-start w-full">
            <div className="flex flex-col gap-0.5">
              <span className="text-[#4F46E5] dark:text-indigo-400 text-[10px] uppercase font-bold tracking-wider">
                Compliance Score
              </span>
              <h4 className="text-[28px] font-extrabold text-[#3730A3] dark:text-indigo-300 mt-1.5 leading-none">
                98.2%
              </h4>
            </div>
            <ShieldCheck className="text-[#4F46E5] dark:text-indigo-400 w-5 h-5 shrink-0" />
          </div>
          <div className="pt-2 mt-auto h-[32px] flex items-center justify-between text-[11px] text-[#4338CA] dark:text-indigo-400/80 font-extrabold">
            <span>Pending Issues</span>
            <span className="text-[#3730A3] dark:text-indigo-300 font-black">3</span>
          </div>
        </div>
      </div>

      {/* Live Alerts Section */}
      <div className="space-y-3">
        <h3 className="text-[15px] font-bold text-[#1e293b] dark:text-white">
          Live Alerts
        </h3>

        <div className="flex flex-row flex-nowrap gap-3 items-center w-full overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Alert 1 */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#FFF1F1] dark:bg-red-950/20 border border-[#FEE2E2] dark:border-red-950/40 text-[12px] font-bold text-[#EF4444] dark:text-red-300 pr-2 whitespace-nowrap">
            <div className="w-5 h-5 rounded-full bg-white dark:bg-red-900/50 flex items-center justify-center text-[#EF4444] shrink-0 shadow-sm border border-gray-50/50">
              <TrendingUp className="w-3 h-3 stroke-[2.5]" />
            </div>
            <span>Orthopedic LOS increased by 12%</span>
          </div>

          {/* Alert 2 */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#FFFBEB] dark:bg-amber-950/20 border border-[#FEF3C7] dark:border-amber-950/40 text-[12px] font-bold text-[#1E293B] dark:text-amber-300 pr-2 whitespace-nowrap">
            <div className="w-5 h-5 rounded-full bg-white dark:bg-amber-900/50 flex items-center justify-center text-[#F59E0B] shrink-0 shadow-sm border border-gray-50/50">
              <AlertTriangle className="w-3 h-3 stroke-[2.5]" />
            </div>
            <span>ICU discharge delays impacting ward</span>
          </div>

          {/* Alert 3 */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#EBFDF9] dark:bg-emerald-950/20 border border-[#CCFBEE] dark:border-emerald-950/40 text-[12px] font-bold text-[#1E293B] dark:text-emerald-300 pr-2 whitespace-nowrap">
            <div className="w-5 h-5 rounded-full bg-white dark:bg-emerald-900/50 flex items-center justify-center text-[#10B981] shrink-0 shadow-sm border border-gray-50/50">
              <TrendingDown className="w-3 h-3 stroke-[2.5]" />
            </div>
            <span>Neurology LOS improving steadily</span>
            <div className="px-2 py-0.5 rounded-[4px] bg-white dark:bg-emerald-900/80 text-gray-400 dark:text-emerald-200 text-[10px] font-black flex items-center justify-center shrink-0 border border-gray-100 ml-1.5">
              -0.5d
            </div>
          </div>

          {/* Alert 4 */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#EFF6FF] dark:bg-blue-950/20 border border-[#DBEAFE] dark:border-blue-950/40 text-[12px] font-bold text-[#1E293B] dark:text-blue-300 pr-2 whitespace-nowrap">
            <div className="w-5 h-5 rounded-full bg-white dark:bg-blue-900/50 flex items-center justify-center text-[#3B82F6] shrink-0 shadow-sm border border-gray-50/50">
              <TrendingDown className="w-3 h-3 stroke-[2.5]" />
            </div>
            <span>Neurology LOS improving steadily</span>
            <div className="px-2 py-0.5 rounded-[4px] bg-white dark:bg-blue-900/80 text-gray-400 dark:text-blue-200 text-[10px] font-black flex items-center justify-center shrink-0 border border-gray-100 ml-1.5">
              8
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
