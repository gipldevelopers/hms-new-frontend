"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

const data = [
  { day: "Monday", value: 45 },
  { day: "Tuesday", value: 58 },
  { day: "Wednesday", value: 42 },
  { day: "Thursday", value: 72 },
  { day: "Friday", value: 25 },
  { day: "Saturday", value: 45 },
];

export default function PatientFlowChart() {
  return (
    <div className="bg-white dark:bg-[#101935] p-5 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 shadow-none h-full flex flex-col">
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-[14px] font-bold text-[#1A1C23] dark:text-white uppercase-none">Patient Flow Analytics</h3>
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 text-[11px] font-bold text-[#5E6C84] dark:text-slate-400 hover:bg-gray-50 transition-all">
          Monthly
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>
      
      <div className="flex-1 flex items-end justify-between px-2 pb-2 relative min-h-[150px]">
        {/* Y-Axis markers */}
        <div className="absolute left-0 right-0 h-full flex flex-col justify-between pointer-events-none">
           {[80, 60, 40, 20, 0].map(v => (
             <div key={v} className="flex items-center gap-3 w-full">
                <span className="text-[10px] text-[#A0AEC0] font-bold w-4">{v}</span>
                <div className="flex-1 h-[1px] bg-gray-50 dark:bg-white/5" />
             </div>
           ))}
        </div>

        {/* Bars */}
        <div className="flex-1 flex items-end justify-around h-full pt-4 z-10">
          {data.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-4 group">
              <div 
                className="w-10 sm:w-12 bg-indigo-600/90 rounded-t-[4px] transition-all duration-500 hover:bg-indigo-500 cursor-pointer relative"
                style={{ height: `${(item.value / 80) * 100}%` }}
              >
                 <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1A1C23] text-white text-[10px] px-2 py-1 rounded-[4px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                    {item.value} Patients
                 </div>
              </div>
              <span className="text-[10px] font-bold text-[#A0AEC0] uppercase-none">{item.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
