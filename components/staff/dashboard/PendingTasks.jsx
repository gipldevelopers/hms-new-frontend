"use client";

import React, { useState } from "react";
import { 
  Check,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const tasks = [
  { id: 1, patient: "Bed 104", action: "Repositioning", note: "Prevent pressure sores - 2 hour cycle.", status: "Overdue", time: "" },
  { id: 2, patient: "Bed 107", action: "Wound Dressing", note: "Clean post-op site and apply fresh sterile gauze.", status: "Scheduled", time: "10:30 AM" },
];

export default function PendingTasks() {
  const [activeTab, setActiveTab] = React.useState("Personal");

  return (
    <div className="bg-white dark:bg-[#101935] p-5 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 shadow-none h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[16px] font-bold text-[#1A1C23] dark:text-white uppercase-none">Pending Tasks</h3>
        <div className="flex bg-[#F4F5F7] dark:bg-white/5 p-1 rounded-full shrink-0">
          {["Ward", "Personal"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-3 py-1 rounded-full text-[9px] font-bold transition-all uppercase-none",
                activeTab === tab 
                  ? "bg-[#2D3A8C] text-white shadow-none" 
                  : "text-[#A0AEC0] hover:text-[#2D3A8C]"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-6 flex-1 overflow-y-auto no-scrollbar">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-start gap-3 group cursor-pointer">
            <div className="w-4 h-4 rounded-[3px] border-[1.5px] border-[#E7E8EB] dark:border-white/20 mt-0.5 flex items-center justify-center group-hover:border-[#2D3A8C] transition-colors shrink-0">
               <div className="w-2 h-2 bg-[#2D3A8C] rounded-[1px] opacity-0 group-hover:opacity-10" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2 mb-1">
                <p className="text-[12px] font-bold text-[#1A1C23] dark:text-white truncate">
                  {task.patient} - {task.action}
                </p>
                <span className={cn(
                  "px-1.5 py-0.5 rounded-[2px] text-[8px] font-bold shrink-0 uppercase-none",
                  task.status === "Overdue" 
                    ? "bg-[#FEF2F2] text-[#EF4444]" 
                    : "bg-[#F3F4FF] text-[#2D3A8C]"
                )}>
                  {task.status === "Overdue" ? "OVERDUE" : task.time}
                </span>
              </div>
              <p className="text-[10px] text-[#A0AEC0] font-medium leading-tight line-clamp-1">
                {task.note}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
