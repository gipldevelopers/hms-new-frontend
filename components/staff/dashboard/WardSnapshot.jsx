"use client";

import React from "react";
import { cn } from "@/lib/utils";

const beds = [
  { id: "B-101", name: "M. Thompson", status: "STABLE", sub: "Post-Op Day 2", color: "emerald" },
  { id: "B-102", name: "Sarah J.", status: "STABLE", sub: "Stable", color: "emerald" },
  { id: "B-103", name: "Kevin Dale", status: "CRITICAL", sub: "Respiratory Dist.", color: "rose" },
  { id: "B-104", name: "Emma Wilson", status: "STABLE", sub: "Routine Obs", color: "blue" },
  { id: "B-105", name: "Robert Chen", status: "STABLE", sub: "Stable", color: "emerald" },
  { id: "B-106", name: "VACANT", status: "VACANT", sub: "", color: "gray" },
  { id: "B-107", name: "Linda Gray", status: "STABLE", sub: "Recovery", color: "emerald" },
  { id: "B-108", name: "James P.", status: "OBSERVATION", sub: "Med. Overdue", color: "orange" },
  { id: "B-109", name: "Oscar Meyer", status: "STABLE", sub: "Stable", color: "emerald" },
  { id: "B-110", name: "Alice Wood", status: "STABLE", sub: "Scheduled Lab", color: "blue" },
];

export default function WardSnapshot() {
  return (
    <div className="bg-white dark:bg-[#101935] p-5 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 shadow-none h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[16px] font-bold text-[#1A1C23] dark:text-white uppercase-none">Ward Snapshot</h3>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#14B8A6]" />
              <span className="text-[9px] font-bold text-[#A0AEC0] uppercase-none">STABLE</span>
           </div>
           <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#EF4444]" />
              <span className="text-[9px] font-bold text-[#A0AEC0] uppercase-none">CRITICAL</span>
           </div>
           <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#3B82F6]" />
              <span className="text-[9px] font-bold text-[#A0AEC0] uppercase-none">OBSERVATION</span>
           </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 flex-1">
        {beds.map((bed, idx) => (
          <div 
            key={idx}
            className={cn(
              "p-5 rounded-[5px] min-h-[120px] transition-all cursor-pointer border border-transparent",
              bed.status === "VACANT" && "bg-white dark:bg-white/5 border-[1.5px] border-dashed border-[#E7E8EB] dark:border-white/20 flex flex-col items-center justify-center hover:border-gray-400",
              bed.color === "emerald" && "bg-[#F3F4FF] dark:bg-indigo-500/5 hover:border-[#14B8A6]",
              bed.color === "blue" && "bg-[#F3F4FF] dark:bg-blue-500/5 hover:border-[#3B82F6]",
              bed.color === "rose" && "bg-[#FEF2F2] dark:bg-rose-500/5 hover:border-[#EF4444]",
              bed.color === "orange" && "bg-[#FFF7ED] dark:bg-orange-500/5 hover:border-[#F97316]"
            )}
          >
            {bed.status !== "VACANT" && (
               <>
                 <div className="flex justify-between items-start mb-2">
                    <span className={cn(
                      "text-[11px] font-bold",
                      bed.color === "rose" ? "text-[#D92D20]" : bed.color === "orange" ? "text-[#C2410C]" : "text-[#2D3A8C]"
                    )}>{bed.id}</span>
                    <div className={cn("w-2 h-2 rounded-full", 
                      bed.color === "emerald" && "bg-[#14B8A6]",
                      bed.color === "rose" && "bg-[#EF4444]",
                      bed.color === "blue" && "bg-[#3B82F6]",
                      bed.color === "orange" && "bg-[#F97316]"
                    )} />
                 </div>
                 <p className="text-[13px] font-bold text-[#1A1C23] dark:text-white leading-tight">{bed.name}</p>
                 <p className={cn(
                   "text-[10px] font-medium mt-1.5 truncate",
                   bed.color === "rose" ? "text-[#EF4444] font-bold" : bed.color === "orange" ? "text-[#F97316] font-bold" : "text-[#A0AEC0]"
                 )}>
                   {bed.sub || bed.status}
                 </p>
               </>
            )}
            {bed.status === "VACANT" && (
               <div className="flex flex-col items-center gap-1.5">
                 <p className="text-[9px] font-bold text-[#A0AEC0]">{bed.id}</p>
                 <div className="w-7 h-7 rounded-full border border-[#E7E8EB] dark:border-white/20 flex items-center justify-center text-[#A0AEC0]">
                    <span className="text-[16px] leading-none">+</span>
                 </div>
                 <p className="text-[9px] font-bold text-[#A0AEC0]">VACANT</p>
               </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
