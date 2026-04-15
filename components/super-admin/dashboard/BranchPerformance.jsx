import React from "react";
import { cn } from "@/lib/utils";

function PerformanceRow({ name, beds, revenue, progress, bg }) {
  return (
    <div className={cn("p-4 rounded-[5px] space-y-3 transition-all", bg, "dark:bg-[#1e293b]/50 dark:border dark:border-white/5")}>
      {/* Top Section: Title and Revenue */}
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-[14px] font-bold text-[#0F172A] dark:text-white leading-tight">
            {name}
          </h4>
          <p className="text-[12px] text-[#94A3B8] dark:text-slate-500 font-medium mt-1">{beds}</p>
        </div>
        <span className="text-[14px] font-bold text-[#0F172A] dark:text-white tracking-tight">
          {revenue}
        </span>
      </div>

      {/* Middle Section: Stats */}
      <div className="flex items-center gap-2 text-[12px] text-[#64748B] dark:text-slate-400 font-medium">
        <span>
          Occupancy:{" "}
          <span className="text-[#1E293B] dark:text-slate-200 font-semibold">{progress}%</span>
        </span>
        <span className="text-[#CBD5E1] dark:text-slate-700 mx-1">•</span>
        <span>
          Patients: <span className="text-[#1E293B] dark:text-slate-200 font-semibold">1245</span>
        </span>
      </div>

      {/* Bottom Section: Progress Bar */}
      <div className="w-full bg-white dark:bg-slate-900 h-[6px] rounded-[5px] overflow-hidden">
        <div
          className="bg-[#3F449E] dark:bg-blue-600 h-full rounded-[5px] transition-all duration-700"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}

export function BranchPerformance() {
  return (
    <div className="bg-white dark:bg-[#101935] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 flex flex-col h-full font-sans transition-all">
      {/* Card Header */}
      <div className="px-6 py-4 border-b border-[#E7E8EB] dark:border-white/10">
        <h3 className="text-[16px] font-bold text-[#0F172A] dark:text-white">
          Branch Performance
        </h3>
      </div>

      {/* Rows Container */}
      <div className="p-5 space-y-3">
        <PerformanceRow
          name="SG Highway"
          beds="450 beds"
          revenue="₹85 L"
          progress={75}
          bg="bg-[#F8FAFC]" // Light Gray
        />
        <PerformanceRow
          name="Krishna Shalby"
          beds="450 beds"
          revenue="₹52 L"
          progress={75}
          bg="bg-[#FFF5F5]" // Light Red/Pink
        />
        <PerformanceRow
          name="Shalby Jaipur"
          beds="450 beds"
          revenue="₹1.08 Cr"
          progress={75}
          bg="bg-[#F0F9FF]" // Light Blue
        />
        <PerformanceRow
          name="Shalby Ahemedabad"
          beds="450 beds"
          revenue="₹1.08 Cr"
          progress={75}
          bg="bg-[#F5F3FF]" // Light Purple
        />
      </div>
    </div>
  );
}
