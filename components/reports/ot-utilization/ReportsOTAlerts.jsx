"use client";

import React from "react";
import { XCircle, AlertTriangle, Activity, Grid, Clock } from "lucide-react";

export function ReportsOTAlerts() {
  return (
    <div className="space-y-[20px] font-sans">
      {/* Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
        {/* Cancellation Rate Card */}
        <div className="bg-[#FFF5F5] dark:bg-red-950/10 border border-[#FEE2E2] dark:border-red-950/30 p-5 rounded-lg flex flex-col justify-between min-h-[105px] relative shadow-none">
          <div className="flex justify-between items-start w-full">
            <div className="flex flex-col gap-0.5">
              <span className="text-[#EF4444] dark:text-red-400 text-[10px] uppercase font-black tracking-wider">
                Cancellation Rate
              </span>
              <h4 className="text-[28px] font-black text-[#EF4444] dark:text-red-400 mt-1 leading-none">
                4.5%
              </h4>
            </div>
            <XCircle className="text-[#EF4444] dark:text-red-400 w-5 h-5 shrink-0" />
          </div>
          <div className="text-[11px] text-[#EF4444] dark:text-red-400/80 font-bold mt-2">
            Cancelled Today:2  |  Patient No-show:1
          </div>
        </div>

        {/* Emergency Usage Card */}
        <div className="bg-[#FFF5F5] dark:bg-red-950/10 border border-[#FEE2E2] dark:border-red-950/30 p-5 rounded-lg flex flex-col justify-between min-h-[105px] relative shadow-none">
          <div className="flex justify-between items-start w-full">
            <div className="flex flex-col gap-0.5">
              <span className="text-[#EF4444] dark:text-red-400 text-[10px] uppercase font-black tracking-wider">
                Emergency Usage
              </span>
              <h4 className="text-[28px] font-black text-[#EF4444] dark:text-red-400 mt-1 leading-none flex items-baseline gap-1">
                8 <span className="text-[12px] font-black">Cases</span>
              </h4>
            </div>
            <AlertTriangle className="text-[#EF4444] dark:text-red-400 w-5 h-5 shrink-0" />
          </div>
          <div className="text-[11px] text-[#EF4444] dark:text-red-400/80 font-bold mt-2">
            Emerg. Occupancy:100%  |  Schedule Insertations:3
          </div>
        </div>
      </div>

      {/* Live Alerts Section */}
      <div className="space-y-3">
        <h3 className="text-[15px] font-bold text-[#1E293B] dark:text-white">
          Live Alerts
        </h3>

        <div className="flex flex-row flex-nowrap gap-3 items-center w-full overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Active Surgeries */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#FFF1F1] dark:bg-red-950/20 border border-[#FEE2E2] dark:border-red-950/40 text-[12px] font-bold text-[#EF4444] dark:text-red-300 pr-2 whitespace-nowrap">
            <div className="w-5 h-5 rounded-full bg-white dark:bg-red-900/50 flex items-center justify-center text-[#10B981] shrink-0 shadow-sm border border-gray-50/50">
              <Activity className="w-3 h-3 stroke-[2.5]" />
            </div>
            <span>Active Surgeries</span>
            <div className="px-2 py-0.5 rounded-[4px] bg-white dark:bg-red-900/80 text-gray-400 dark:text-red-200 text-[10px] font-black flex items-center justify-center shrink-0 border border-gray-100 ml-1.5">
              9
            </div>
          </div>

          {/* OT Rooms in use */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#FFFBEB] dark:bg-amber-950/20 border border-[#FEF3C7] dark:border-amber-950/40 text-[12px] font-bold text-[#1E293B] dark:text-amber-300 pr-2 whitespace-nowrap">
            <div className="w-5 h-5 rounded-full bg-white dark:bg-amber-900/50 flex items-center justify-center text-[#4F46E5] shrink-0 shadow-sm border border-gray-50/50">
              <Grid className="w-3 h-3 stroke-[2.5]" />
            </div>
            <span>OT Rooms in use</span>
            <div className="px-2 py-0.5 rounded-[4px] bg-white dark:bg-amber-900/80 text-gray-400 dark:text-amber-200 text-[10px] font-black flex items-center justify-center shrink-0 border border-gray-100 ml-1.5">
              87 %
            </div>
          </div>

          {/* Delayed Surgeries */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#EBFDF9] dark:bg-emerald-950/20 border border-[#CCFBEE] dark:border-emerald-950/40 text-[12px] font-bold text-[#1E293B] dark:text-emerald-300 pr-2 whitespace-nowrap">
            <div className="w-5 h-5 rounded-full bg-white dark:bg-emerald-900/50 flex items-center justify-center text-[#F59E0B] shrink-0 shadow-sm border border-gray-50/50">
              <Clock className="w-3 h-3 stroke-[2.5]" />
            </div>
            <span>Delayed Surgeries</span>
            <div className="px-2 py-0.5 rounded-[4px] bg-white dark:bg-emerald-900/80 text-gray-400 dark:text-emerald-200 text-[10px] font-black flex items-center justify-center shrink-0 border border-gray-100 ml-1.5">
              142
            </div>
          </div>

          {/* Emergency Requests */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#EFF6FF] dark:bg-blue-950/20 border border-[#DBEAFE] dark:border-blue-950/40 text-[12px] font-bold text-[#1E293B] dark:text-blue-300 pr-2 whitespace-nowrap">
            <div className="w-5 h-5 rounded-full bg-white dark:bg-blue-900/50 flex items-center justify-center text-[#EF4444] shrink-0 shadow-sm border border-gray-50/50">
              <AlertTriangle className="w-3 h-3 stroke-[2.5]" />
            </div>
            <span>Emergency Requests</span>
            <div className="px-2 py-0.5 rounded-[4px] bg-white dark:bg-blue-900/80 text-gray-400 dark:text-blue-200 text-[10px] font-black flex items-center justify-center shrink-0 border border-gray-100 ml-1.5">
              2
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
