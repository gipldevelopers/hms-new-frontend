"use client";

import React from "react";
import { 
  Users, 
  MoreVertical,
  ChevronRight,
  Clock,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";

const schedule = [
  { 
    id: 1, 
    time: "09:30 AM", 
    title: "Hip Replacement Surgery", 
    desc: "OR Room 4 • Patient: John Doe", 
    attendees: ["https://i.pravatar.cc/150?u=1", "https://i.pravatar.cc/150?u=2"], 
    extraAttendees: 2,
    color: "bg-[#2D3A8C]" 
  },
  { 
    id: 2, 
    time: "11:15 AM", 
    title: "Pediatric Ward Rounds", 
    desc: "Level 3 • Team B", 
    tag: "RECURRING", 
    color: "bg-blue-400" 
  },
  { 
    id: 3, 
    time: "02:00 PM", 
    title: "Inter-Departmental Meeting", 
    desc: "Conference Hall A • Budgeting", 
    tag: "AGENDA", 
    color: "bg-orange-400" 
  },
];

export default function TodaySchedule() {
  return (
    <div className="bg-white dark:bg-[#101935] p-5 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 shadow-none">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[14px] font-bold text-[#1A1C23] dark:text-white uppercase-none">Today's Medical Schedule</h3>
      </div>
      
      <div className="space-y-6 relative before:absolute before:left-[110px] before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-100 dark:before:bg-white/5">
        {schedule.map((item) => (
          <div key={item.id} className="flex gap-10 items-start group relative">
            <div className="w-[80px] shrink-0 text-right">
              <p className="text-[12px] font-bold text-[#1A1C23] dark:text-white">{item.time.split(' ')[0]}</p>
              <p className="text-[9px] font-bold text-[#5E6C84] dark:text-slate-500">{item.time.split(' ')[1]}</p>
            </div>
            
            <div className={cn("absolute left-[108px] top-1.5 w-[5px] h-10 rounded-full", item.color)} />
            
            <div className="flex-1 min-w-0 flex justify-between items-center pr-2">
              <div className="space-y-1">
                <h4 className="text-[13px] font-bold text-[#1A1C23] dark:text-white group-hover:text-primary transition-colors truncate">
                  {item.title}
                </h4>
                <p className="text-[11px] text-[#5E6C84] dark:text-slate-500 font-medium truncate">
                  {item.desc}
                </p>
              </div>
              
              <div className="flex items-center gap-4 shrink-0 ml-4">
                {item.attendees && (
                  <div className="flex -space-x-2">
                    {item.attendees.map((url, i) => (
                      <div key={i} className="w-7 h-7 rounded-full border-2 border-white dark:border-[#101935] overflow-hidden">
                        <img src={url} alt="avatar" className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {item.extraAttendees && (
                      <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-white/10 border-2 border-white dark:border-[#101935] flex items-center justify-center text-[10px] font-bold text-[#5E6C84] dark:text-slate-400">
                        +{item.extraAttendees}
                      </div>
                    )}
                  </div>
                )}
                {item.tag && (
                  <span className={cn(
                    "px-2 py-0.5 rounded-[4px] text-[9px] font-bold",
                    item.tag === "RECURRING" ? "bg-blue-50 text-blue-500" : "bg-gray-100 text-gray-500"
                  )}>
                    {item.tag}
                  </span>
                )}
                <button className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-all">
                  {item.id === 3 ? <FileText className="w-3.5 h-3.5 text-[#A0AEC0]" /> : <MoreVertical className="w-4 h-4 text-[#A0AEC0]" />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
