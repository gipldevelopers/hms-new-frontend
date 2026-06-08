"use client";

import React from "react";

export function ConsumptionPeakHours() {
  return (
    <div className="bg-white dark:bg-[#1e293b] p-6 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] shadow-none flex flex-col justify-between">
      <div>
        <h2 className="text-[15px] font-extrabold text-slate-800 dark:text-white">
          Consumption Peak Hours
        </h2>
        <p className="text-[12px] text-slate-450 dark:text-slate-500 mt-1">
          Hourly usage distribution during procedures.
        </p>
      </div>

      {/* Elegant Custom SVG Bar Chart */}
      <div className="mt-8 flex flex-col justify-end h-[160px] w-full">
        <div className="flex items-end justify-between h-[120px] px-2">
          
          {/* 08:00 */}
          <div className="flex flex-col items-center flex-1 group">
            <div className="w-full max-w-[40px] bg-[#2E37A4]/15 group-hover:bg-[#2E37A4]/25 transition-all duration-200 rounded-[3px] h-[30px]" />
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-2">08:00</span>
          </div>

          {/* 10:00 */}
          <div className="flex flex-col items-center flex-1 group">
            <div className="w-full max-w-[40px] bg-[#2E37A4]/15 group-hover:bg-[#2E37A4]/25 transition-all duration-200 rounded-[3px] h-[55px]" />
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-2">10:00</span>
          </div>

          {/* 12:00 (Peak Active) */}
          <div className="flex flex-col items-center flex-1 group">
            <div className="w-full max-w-[40px] bg-[#2E37A4] transition-all duration-200 rounded-[3px] h-[100px]" />
            <span className="text-[10px] font-bold text-[#2E37A4] dark:text-[#5c64c7] mt-2 font-black">12:00</span>
          </div>

          {/* 14:00 */}
          <div className="flex flex-col items-center flex-1 group">
            <div className="w-full max-w-[40px] bg-[#2E37A4]/15 group-hover:bg-[#2E37A4]/25 transition-all duration-200 rounded-[3px] h-[85px]" />
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-2">14:00</span>
          </div>

          {/* 16:00 */}
          <div className="flex flex-col items-center flex-1 group">
            <div className="w-full max-w-[40px] bg-[#2E37A4]/15 group-hover:bg-[#2E37A4]/25 transition-all duration-200 rounded-[3px] h-[65px]" />
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-2">16:00</span>
          </div>

          {/* 18:00 */}
          <div className="flex flex-col items-center flex-1 group">
            <div className="w-full max-w-[40px] bg-[#2E37A4]/15 group-hover:bg-[#2E37A4]/25 transition-all duration-200 rounded-[3px] h-[40px]" />
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-2">18:00</span>
          </div>

          {/* 20:00 */}
          <div className="flex flex-col items-center flex-1 group">
            <div className="w-full max-w-[40px] bg-[#2E37A4]/15 group-hover:bg-[#2E37A4]/25 transition-all duration-200 rounded-[3px] h-[20px]" />
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-2">20:00</span>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ConsumptionPeakHours;
