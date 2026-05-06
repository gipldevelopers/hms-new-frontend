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
    <div className="bg-card p-5 rounded-lg border border-border shadow-none h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[16px] font-bold text-foreground uppercase tracking-wider">Ward Snapshot</h3>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-bold text-muted-foreground tracking-wider">STABLE</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-destructive" />
              <span className="text-[10px] font-bold text-muted-foreground tracking-wider">CRITICAL</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-[10px] font-bold text-muted-foreground tracking-wider">OBSERVATION</span>
           </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 flex-1">
        {beds.map((bed, idx) => (
          <div 
            key={idx}
            className={cn(
              "p-5 rounded-lg min-h-[120px] transition-all cursor-pointer border",
              bed.status === "VACANT" && "bg-transparent border-dashed border-border flex flex-col items-center justify-center hover:border-muted-foreground hover:bg-muted/30",
              bed.color === "emerald" && "bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/40",
              bed.color === "blue" && "bg-blue-500/10 border-blue-500/20 hover:border-blue-500/40",
              bed.color === "rose" && "bg-destructive/10 border-destructive/20 hover:border-destructive/40",
              bed.color === "orange" && "bg-orange-500/10 border-orange-500/20 hover:border-orange-500/40"
            )}
          >
            {bed.status !== "VACANT" && (
               <>
                 <div className="flex justify-between items-start mb-2">
                    <span className={cn(
                      "text-[12px] font-bold",
                      bed.color === "rose" ? "text-destructive" : bed.color === "orange" ? "text-orange-600 dark:text-orange-400" : bed.color === "emerald" ? "text-emerald-600 dark:text-emerald-400" : "text-blue-600 dark:text-blue-400"
                    )}>{bed.id}</span>
                    <div className={cn("w-2.5 h-2.5 rounded-full shadow-sm", 
                      bed.color === "emerald" && "bg-emerald-500",
                      bed.color === "rose" && "bg-destructive",
                      bed.color === "blue" && "bg-blue-500",
                      bed.color === "orange" && "bg-orange-500"
                    )} />
                 </div>
                 <p className="text-[14px] font-bold text-foreground leading-tight">{bed.name}</p>
                 <p className={cn(
                   "text-[11px] font-medium mt-1.5 truncate",
                   bed.color === "rose" ? "text-destructive font-bold" : bed.color === "orange" ? "text-orange-600 dark:text-orange-400 font-bold" : "text-muted-foreground"
                 )}>
                   {bed.sub || bed.status}
                 </p>
               </>
            )}
            {bed.status === "VACANT" && (
               <div className="flex flex-col items-center gap-2 opacity-60">
                 <p className="text-[10px] font-bold text-muted-foreground tracking-wider">{bed.id}</p>
                 <div className="w-8 h-8 rounded-full border-[1.5px] border-muted-foreground border-dashed flex items-center justify-center text-muted-foreground">
                    <span className="text-[18px] font-light leading-none">+</span>
                 </div>
                 <p className="text-[10px] font-bold text-muted-foreground tracking-wider">VACANT</p>
               </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
