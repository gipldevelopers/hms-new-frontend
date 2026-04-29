"use client";

import React from "react";
import { cn } from "@/lib/utils";

export default function WardOverview() {
  return (
    <div className="bg-white dark:bg-[#101935] p-5 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 shadow-none h-full">
      <h3 className="text-[14px] font-bold text-[#1A1C23] dark:text-white mb-6 uppercase-none">Bed & Ward Overview</h3>
      
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex-1 min-w-[100px] p-3 rounded-[5px] border border-[#E7E8EB] dark:border-white/10">
          <p className="text-[10px] font-bold text-[#5E6C84] dark:text-slate-500 uppercase-none mb-1">Total Beds</p>
          <p className="text-[20px] font-bold text-[#1A1C23] dark:text-white leading-none">450</p>
        </div>
        <div className="flex-1 min-w-[100px] p-3 rounded-[5px] bg-emerald-50/30 dark:bg-emerald-500/5 border border-emerald-100/50 dark:border-emerald-500/10">
          <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase-none mb-1">Occupied</p>
          <p className="text-[20px] font-bold text-emerald-600 dark:text-emerald-400 leading-none">327</p>
        </div>
        <div className="flex-1 min-w-[100px] p-3 rounded-[5px] bg-blue-50/30 dark:bg-blue-500/5 border border-blue-100/50 dark:border-blue-500/10">
          <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase-none mb-1">Available</p>
          <p className="text-[20px] font-bold text-blue-600 dark:text-blue-400 leading-none">123</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-[12px] font-bold text-[#1A1C23] dark:text-white">ICU Occupancy</p>
            <p className="text-[11px] font-bold text-[#5E6C84] dark:text-slate-400">38/45 (84.4%)</p>
          </div>
          <div className="h-1.5 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
             <div className="h-full bg-rose-500 rounded-full w-[84.4%] transition-all duration-500" />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-[12px] font-bold text-[#1A1C23] dark:text-white">General Ward</p>
            <p className="text-[11px] font-bold text-[#5E6C84] dark:text-slate-400">289/405 (71.4%)</p>
          </div>
          <div className="h-1.5 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
             <div className="h-full bg-emerald-500 rounded-full w-[71.4%] transition-all duration-500" />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-[12px] font-bold text-[#1A1C23] dark:text-white">Overall Occupancy</p>
            <p className="text-[11px] font-bold text-[#5E6C84] dark:text-slate-400">72.7%</p>
          </div>
          <div className="h-1.5 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
             <div className="h-full bg-blue-500 rounded-full w-[72.7%] transition-all duration-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
