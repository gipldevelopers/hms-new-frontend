import React from "react";
import { cn } from "@/lib/utils";

const OccupancyRow = ({ name, beds, progress, bg }) => (
  <div className={cn("p-4 rounded-[5px] space-y-3 transition-all", bg, "dark:bg-[#1e293b]/50 dark:border dark:border-white/5")}>
    <div className="flex justify-between items-start">
      <div>
        <h4 className="text-[14px] font-bold text-[#0F172A] dark:text-white leading-tight">{name}</h4>
        <p className="text-[12px] text-[#94A3B8] dark:text-slate-500 font-medium mt-1 tracking-tight">{beds} beds total</p>
      </div>
      <span className="text-[14px] font-bold text-[#0F172A] dark:text-white tracking-tight">
        {Math.round((progress * beds) / 100)} Active
      </span>
    </div>

    <div className="flex items-center gap-2 text-[12px] text-[#64748B] dark:text-slate-400 font-medium italic">
      <span>Occupancy: <span className="text-[#1E293B] dark:text-slate-200 font-bold">{progress}%</span></span>
      <span className="text-[#CBD5E1] dark:text-slate-700 mx-1">•</span>
      <span>Trends: <span className="text-emerald-500 font-bold">Stable</span></span>
    </div>

    <div className="w-full bg-white dark:bg-slate-900 h-[6px] rounded-[5px] overflow-hidden shadow-inner">
      <div
        className="bg-[#3F449E] dark:bg-blue-600 h-full rounded-[5px] transition-all duration-1000"
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
);

export default function OccupancyRates() {
  return (
    <div className="bg-white dark:bg-[#101935] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 flex flex-col h-full font-sans transition-all">
      <div className="px-6 py-4 border-b border-[#E7E8EB] dark:border-white/10 bg-slate-50/50 dark:bg-white/5">
        <h3 className="text-[16px] font-bold text-[#0F172A] dark:text-white">
          Occupancy By Branch
        </h3>
      </div>

      <div className="p-5 space-y-3 overflow-y-auto custom-scrollbar">
        <OccupancyRow name="Krishna Shalby" beds={450} progress={85} bg="bg-[#F8FAFC]" />
        <OccupancyRow name="Shalby Ahmedabad" beds={450} progress={82} bg="bg-[#FFF5F5]" />
        <OccupancyRow name="Shalby Jaipur" beds={450} progress={78} bg="bg-[#F0F9FF]" />
        <OccupancyRow name="Shalby Pune" beds={450} progress={92} bg="bg-[#F5F3FF]" />
      </div>
    </div>
  );
}
