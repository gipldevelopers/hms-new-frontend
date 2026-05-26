"use client";

import React from "react";
import { AlertTriangle, FileText, TrendingUp } from "lucide-react";

export function ReportsFinancialAlerts() {
  return (
    <div className="space-y-3 font-sans">
      <h3 className="text-[15px] font-bold text-[#1E293B] dark:text-white">
        Live Alerts
      </h3>
      
      <div className="flex flex-row flex-nowrap gap-3 items-center w-full overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Pill 1: Emergency Revenue */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#FFF1F1] dark:bg-red-950/20 border border-[#FEE2E2] dark:border-red-950/40 text-[12px] font-bold text-[#EF4444] dark:text-red-300 pr-2 whitespace-nowrap">
          <div className="w-5 h-5 rounded-full bg-white dark:bg-red-900/50 flex items-center justify-center text-[#EF4444] shrink-0 shadow-sm border border-gray-50/50">
            <AlertTriangle className="w-3 h-3 stroke-[2.5]" />
          </div>
          <span>Emergency revenue increased 18% this week.</span>
        </div>

        {/* Pill 2: Insurance Claims */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#FFFBEB] dark:bg-amber-950/20 border border-[#FEF3C7] dark:border-amber-950/40 text-[12px] font-bold text-[#1E293B] dark:text-amber-300 pr-2 whitespace-nowrap">
          <div className="w-5 h-5 rounded-full bg-white dark:bg-amber-900/50 flex items-center justify-center text-[#F59E0B] shrink-0 shadow-sm border border-gray-50/50">
            <FileText className="w-3 h-3 stroke-[2.5]" />
          </div>
          <span>Insurance claims delaying cash flow by 4 days.</span>
        </div>

        {/* Pill 3: Orthopedic Dept */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#EBFDF9] dark:bg-emerald-950/20 border border-[#CCFBEE] dark:border-emerald-950/40 text-[12px] font-bold text-[#1E293B] dark:text-emerald-300 pr-2 whitespace-nowrap">
          <div className="w-5 h-5 rounded-full bg-white dark:bg-emerald-900/50 flex items-center justify-center text-[#10B981] shrink-0 shadow-sm border border-gray-50/50">
            <TrendingUp className="w-3 h-3 stroke-[2.5]" />
          </div>
          <span>Orthopedic dept showing highest profitability.</span>
        </div>

        {/* Pill 4: Orthopedic Dept (Duplicate) */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#EBFDF9] dark:bg-emerald-950/20 border border-[#CCFBEE] dark:border-emerald-950/40 text-[12px] font-bold text-[#1E293B] dark:text-emerald-300 pr-2 whitespace-nowrap">
          <div className="w-5 h-5 rounded-full bg-white dark:bg-emerald-900/50 flex items-center justify-center text-[#10B981] shrink-0 shadow-sm border border-gray-50/50">
            <TrendingUp className="w-3 h-3 stroke-[2.5]" />
          </div>
          <span>Orthopedic dept showing highest profitability.</span>
        </div>

        {/* Pill 5: Orthopedic Dept (Duplicate) */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#EBFDF9] dark:bg-emerald-950/20 border border-[#CCFBEE] dark:border-emerald-950/40 text-[12px] font-bold text-[#1E293B] dark:text-emerald-300 pr-2 whitespace-nowrap">
          <div className="w-5 h-5 rounded-full bg-white dark:bg-emerald-900/50 flex items-center justify-center text-[#10B981] shrink-0 shadow-sm border border-gray-50/50">
            <TrendingUp className="w-3 h-3 stroke-[2.5]" />
          </div>
          <span>Orthopedic dept showing highest profitability.</span>
        </div>
      </div>
    </div>
  );
}
