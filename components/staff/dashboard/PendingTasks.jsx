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
    <div className="bg-card p-5 rounded-lg border border-border shadow-none h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[16px] font-bold text-foreground uppercase tracking-wider">Pending Tasks</h3>
        <div className="flex bg-muted p-1 rounded-full shrink-0">
          {["Ward", "Personal"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-3 py-1 rounded-full text-[10px] font-bold transition-all tracking-wider",
                activeTab === tab 
                  ? "bg-primary text-primary-foreground shadow-none" 
                  : "text-muted-foreground hover:text-primary"
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
            <div className="w-5 h-5 rounded-[4px] border-[1.5px] border-border mt-0.5 flex items-center justify-center group-hover:border-primary transition-colors shrink-0">
               <div className="w-2.5 h-2.5 bg-primary rounded-[2px] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2 mb-1">
                <p className="text-[13px] font-bold text-foreground truncate">
                  {task.patient} - {task.action}
                </p>
                <span className={cn(
                  "px-2 py-0.5 rounded-[4px] text-[9px] font-bold shrink-0 tracking-wider",
                  task.status === "Overdue" 
                    ? "bg-destructive/10 text-destructive" 
                    : "bg-primary/10 text-primary"
                )}>
                  {task.status === "Overdue" ? "OVERDUE" : task.time}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground font-medium leading-tight line-clamp-1">
                {task.note}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
