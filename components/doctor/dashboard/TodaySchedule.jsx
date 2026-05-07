"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { FileText } from "lucide-react";

const schedule = [
  { 
    time: "09:30", 
    period: "AM", 
    title: "Hip Replacement Surgery", 
    subtitle: "OR Room 4 • Patient: John Doe", 
    color: "bg-violet-600", 
    avatars: [
      "https://i.pravatar.cc/150?u=1",
      "https://i.pravatar.cc/150?u=2",
      "+2"
    ] 
  },
  { 
    time: "11:15", 
    period: "AM", 
    title: "Pediatric Ward Rounds", 
    subtitle: "Level 3 • Team B", 
    color: "bg-sky-500", 
    tag: "RECURRING" 
  },
  { 
    time: "02:00", 
    period: "PM", 
    title: "Inter-Departmental Meeting", 
    subtitle: "Conference Hall A • Budgeting", 
    color: "bg-amber-500", 
    tag: "AGENDA",
    icon: FileText
  },
];

export default function TodaySchedule({ className }) {
  return (
    <div className={cn("bg-card border border-border rounded-lg shadow-none overflow-hidden flex flex-col", className)}>
      {/* Header */}
      <div className="px-5 md:px-6 py-4 border-b border-border/60 flex justify-between items-center shrink-0">
        <h2 className="text-[15px] font-bold text-[#1e293b] dark:text-foreground">Today's Medical Schedule</h2>
        <button className="h-8 px-3 border border-border rounded-lg text-[11px] font-bold text-[#64748b] hover:bg-muted transition-all">
          View all
        </button>
      </div>
      
      {/* List Content */}
      <div className="p-5 md:p-8 flex-1 flex flex-col justify-around min-h-[300px]">
        <div className="space-y-6 md:space-y-10">
          {schedule.map((item, i) => (
            <div key={i} className="flex items-center gap-4 md:gap-6">
              {/* Time Section */}
              <div className="flex flex-col items-center min-w-[45px] md:min-w-[50px]">
                <span className="text-[13px] md:text-[14px] font-bold text-[#1e293b] dark:text-foreground leading-none">{item.time}</span>
                <span className="text-[9px] md:text-[10px] font-bold text-[#94a3b8] mt-1 uppercase">{item.period}</span>
              </div>

              {/* Status Bar */}
              <div className={cn("w-[2px] md:w-[3px] h-8 md:h-10 rounded-full shrink-0", item.color)} />

              {/* Info Section */}
              <div className="flex-1 min-w-0">
                <p className="text-[12px] md:text-[13px] font-bold text-[#1e293b] dark:text-foreground leading-tight truncate">{item.title}</p>
                <p className="text-[10px] md:text-[11px] font-medium text-[#64748b] mt-0.5 truncate">{item.subtitle}</p>
              </div>

              {/* Action/Meta Section - Hidden on very small mobile if too crowded, or styled carefully */}
              <div className="flex items-center shrink-0">
                {item.avatars ? (
                  <div className="flex items-center -space-x-1.5 md:-space-x-2">
                    {item.avatars.map((av, j) => (
                      <div key={j} className="w-7 h-7 md:w-8 md:h-8 rounded-full border-2 border-white dark:border-card overflow-hidden bg-muted flex items-center justify-center">
                        {av.startsWith('http') ? (
                          <img src={av} alt="team" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[9px] md:text-[10px] font-bold text-[#64748b]">{av}</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : item.tag === "RECURRING" ? (
                  <span className="px-2 md:px-3 py-1 md:py-1.5 rounded-lg bg-[#f0f9ff] text-[#0ea5e9] text-[9px] md:text-[10px] font-bold tracking-wider uppercase">
                    {item.tag}
                  </span>
                ) : item.tag === "AGENDA" ? (
                  <div className="flex items-center gap-1 md:gap-1.5 text-[#94a3b8]">
                    {item.icon && <item.icon className="w-3 md:w-3.5 h-3 md:h-3.5" />}
                    <span className="text-[9px] md:text-[10px] font-bold tracking-wider uppercase">{item.tag}</span>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
