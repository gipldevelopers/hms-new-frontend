"use client";

import React from "react";

export function ReportsBedWardOverview() {
  return (
    <div className="bg-card rounded-lg border border-border flex flex-col font-sans transition-all overflow-hidden shadow-none hover:border-gray-300 dark:hover:border-white/20 md:h-[350px] h-auto p-5 justify-between">
      <div>
        <h3 className="text-[16px] font-bold text-[#1e293b] dark:text-white leading-none">
          Bed & Ward Overview
        </h3>
      </div>

      {/* Summary Boxes */}
      <div className="grid grid-cols-3 gap-3 my-10">
        {/* Total Beds */}
        <div className="p-3 bg-[#F4F6F9] dark:bg-[#1E293B]/40 rounded-lg flex flex-col">
          <span className="text-[11px] font-semibold text-gray-400 dark:text-slate-400">
            Total Beds
          </span>
          <h4 className="text-[20px] font-bold text-[#1e293b] dark:text-white mt-1">
            450
          </h4>
        </div>

        {/* Occupied */}
        <div className="p-3 bg-[#EBFBF8] dark:bg-teal-950/20 rounded-lg flex flex-col">
          <span className="text-[11px] font-semibold text-[#0F766E] dark:text-teal-400">
            Occupied
          </span>
          <h4 className="text-[20px] font-bold text-[#0F766E] dark:text-teal-400 mt-1">
            327
          </h4>
        </div>

        {/* Available */}
        <div className="p-3 bg-[#ECFDF5] dark:bg-emerald-950/20 rounded-lg flex flex-col">
          <span className="text-[11px] font-semibold text-[#047857] dark:text-emerald-400">
            Available
          </span>
          <h4 className="text-[20px] font-bold text-[#047857] dark:text-emerald-400 mt-1">
            123
          </h4>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="space-y-4 flex-1 flex flex-col justify-end">
        {/* ICU Occupancy */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[12px] font-semibold text-gray-600 dark:text-slate-300">
            <span>ICU Occupancy</span>
            <span className="font-bold text-gray-500 dark:text-slate-400">
              38/45 (84.4%)
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#EF4444] rounded-full"
              style={{ width: "84.4%" }}
            ></div>
          </div>
        </div>

        {/* General Ward */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[12px] font-semibold text-gray-600 dark:text-slate-300">
            <span>General Ward</span>
            <span className="font-bold text-gray-500 dark:text-slate-400">
              289/405 (71.4%)
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0D9488] rounded-full"
              style={{ width: "71.4%" }}
            ></div>
          </div>
        </div>

        {/* Overall Occupancy */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[12px] font-semibold text-gray-600 dark:text-slate-300">
            <span>Overall Occupancy</span>
            <span className="font-bold text-gray-500 dark:text-slate-400">
              72.7%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#3B82F6] rounded-full"
              style={{ width: "72.7%" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
