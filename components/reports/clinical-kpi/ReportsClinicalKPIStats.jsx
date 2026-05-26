"use client";

import React from "react";
import { Clock, RotateCcw, AlertTriangle, Activity, TrendingUp } from "lucide-react";

export function ReportsClinicalKPIStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[20px] font-sans">
      {/* Card 1: Average LOS */}
      <div className="bg-card rounded-lg border border-border p-5 flex flex-col shadow-none hover:border-gray-300 dark:hover:border-white/20 transition-all h-[185px]">
        <div className="flex justify-between items-center w-full">
          <div className="w-9 h-9 bg-[#EFF2FC] dark:bg-indigo-950/40 rounded-full flex items-center justify-center text-[#3F51B5] dark:text-[#818CF8] shrink-0">
            <Clock className="w-4.5 h-4.5" />
          </div>
          <span className="px-2 py-1 rounded-full text-[10px] font-extrabold bg-[#EEF2FF] text-[#4F46E5] dark:bg-indigo-950/40 dark:text-indigo-300 flex items-center gap-0.5 shrink-0">
            <span>+5.2%</span>
            <TrendingUp className="w-3 h-3" />
          </span>
        </div>

        <div className="flex flex-col mt-4">
          <span className="text-[12px] font-bold text-gray-400 dark:text-slate-500">
            Average LOS
          </span>
          <h4 className="text-[24px] font-extrabold text-[#1e293b] dark:text-white leading-none mt-1.5">
            4.5 <span className="text-[12px] text-gray-400 dark:text-slate-500 font-bold ml-0.5">Days</span>
          </h4>
        </div>

        <div className="pt-2 mt-auto h-[32px] flex items-center justify-between text-[11px] font-extrabold">
          <span className="text-gray-400 dark:text-slate-500">Long Stays Pts</span>
          <span className="text-[#1e293b] dark:text-white text-[13px] font-black">18</span>
        </div>
      </div>

      {/* Card 2: Readmission Rate */}
      <div className="bg-card rounded-lg border border-border p-5 flex flex-col shadow-none hover:border-gray-300 dark:hover:border-white/20 transition-all h-[185px]">
        <div className="flex justify-between items-center w-full">
          <div className="w-9 h-9 bg-[#E7F9ED] dark:bg-green-950/20 rounded-full flex items-center justify-center text-[#2ECC71] shrink-0">
            <RotateCcw className="w-4.5 h-4.5" />
          </div>
          <span className="px-2 py-1 rounded-full text-[10px] font-extrabold bg-[#EEF2FF] text-[#4F46E5] dark:bg-indigo-950/40 dark:text-indigo-300 flex items-center gap-0.5 shrink-0">
            <span>+12.4%</span>
            <TrendingUp className="w-3 h-3" />
          </span>
        </div>

        <div className="flex flex-col mt-4">
          <span className="text-[12px] font-bold text-gray-400 dark:text-slate-500">
            Readmission Rate
          </span>
          <h4 className="text-[24px] font-extrabold text-[#1e293b] dark:text-white leading-none mt-1.5">
            6.2% <span className="text-[10px] text-gray-400 dark:text-slate-500 font-bold ml-0.5">(7 days Rate)</span>
          </h4>
        </div>

        <div className="border-t border-border pt-3 mt-auto grid grid-cols-2 gap-2 h-[32px]">
          <div className="flex flex-col justify-between">
            <span className="text-[9px] font-extrabold text-gray-400 dark:text-slate-500 uppercase tracking-wider leading-none">
              30 days rate
            </span>
            <span className="text-[#1e293b] dark:text-white text-[12px] font-black leading-none mt-1">
              11.8%
            </span>
          </div>
          <div className="flex flex-col justify-between border-l border-border pl-3">
            <span className="text-[9px] font-extrabold text-gray-400 dark:text-slate-500 uppercase tracking-wider leading-none">
              high risk cases
            </span>
            <span className="text-[#1e293b] dark:text-white text-[12px] font-black leading-none">
              14
            </span>
          </div>
        </div>
      </div>

      {/* Card 3: Infection Rate */}
      <div className="bg-card rounded-lg border border-border p-5 flex flex-col shadow-none hover:border-gray-300 dark:hover:border-white/20 transition-all h-[185px]">
        <div className="flex justify-between items-center w-full">
          <div className="w-9 h-9 bg-[#FFF1F1] dark:bg-red-950/20 rounded-full flex items-center justify-center text-[#FF5C5C] shrink-0">
            <AlertTriangle className="w-4.5 h-4.5" />
          </div>
          <span className="px-2 py-1 rounded-full text-[10px] font-extrabold bg-[#EEF2FF] text-[#4F46E5] dark:bg-indigo-950/40 dark:text-indigo-300 flex items-center gap-0.5 shrink-0">
            <span>+8.1%</span>
            <TrendingUp className="w-3 h-3" />
          </span>
        </div>

        <div className="flex flex-col mt-4">
          <span className="text-[12px] font-bold text-gray-400 dark:text-slate-500">
            Infection Rate
          </span>
          <h4 className="text-[24px] font-extrabold text-[#1e293b] dark:text-white leading-none mt-1.5">
            2.1% <span className="text-[10px] text-gray-400 dark:text-slate-500 font-bold ml-0.5">Overall</span>
          </h4>
        </div>

        <div className="border-t border-border pt-3 mt-auto grid grid-cols-2 gap-2 h-[32px]">
          <div className="flex flex-col justify-between">
            <span className="text-[9px] font-extrabold text-gray-400 dark:text-slate-500 uppercase tracking-wider leading-none">
              overdue
            </span>
            <span className="text-[#1e293b] dark:text-white text-[12px] font-black leading-none mt-1">
              3
            </span>
          </div>
          <div className="flex flex-col justify-between border-l border-border pl-3">
            <span className="text-[9px] font-extrabold text-gray-400 dark:text-slate-500 uppercase tracking-wider leading-none">
              completed
            </span>
            <span className="text-[#1e293b] dark:text-white text-[12px] font-black leading-none">
              24
            </span>
          </div>
        </div>
      </div>

      {/* Card 4: Mortality Rate */}
      <div className="bg-card rounded-lg border border-border p-5 flex flex-col shadow-none hover:border-gray-300 dark:hover:border-white/20 transition-all h-[185px]">
        <div className="flex justify-between items-center w-full">
          <div className="w-9 h-9 bg-[#EFF2FC] dark:bg-indigo-950/40 rounded-full flex items-center justify-center text-[#3F51B5] dark:text-[#818CF8] shrink-0">
            <Activity className="w-4.5 h-4.5" />
          </div>
          <span className="px-2 py-1 rounded-full text-[10px] font-extrabold bg-[#EEF2FF] text-[#4F46E5] dark:bg-indigo-950/40 dark:text-indigo-300 flex items-center gap-0.5 shrink-0">
            <span>+18.2%</span>
            <TrendingUp className="w-3 h-3" />
          </span>
        </div>

        <div className="flex flex-col mt-4">
          <span className="text-[12px] font-bold text-gray-400 dark:text-slate-500">
            Mortality Rate
          </span>
          <h4 className="text-[24px] font-extrabold text-[#1e293b] dark:text-white leading-none mt-1.5">
            1.4%
          </h4>
        </div>

        <div className="border-t border-border pt-3 mt-auto grid grid-cols-2 gap-2 h-[32px]">
          <div className="flex flex-col justify-between">
            <span className="text-[9px] font-extrabold text-gray-400 dark:text-slate-500 uppercase tracking-wider leading-none">
              surgical
            </span>
            <span className="text-[#1e293b] dark:text-white text-[12px] font-black leading-none mt-1">
              0.8%
            </span>
          </div>
          <div className="flex flex-col justify-between border-l border-border pl-3">
            <span className="text-[9px] font-extrabold text-gray-400 dark:text-slate-500 uppercase tracking-wider leading-none">
              icu
            </span>
            <span className="text-[#1e293b] dark:text-white text-[12px] font-black leading-none">
              5.2%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
