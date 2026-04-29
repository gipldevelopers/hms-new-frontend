"use client";

import React from "react";
import { 
  AlertCircle, 
  Clock,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const alerts = [
  { id: 1, type: "CRITICAL", room: "Bed 104", patient: "Ram Kumar", detail: "SpO2 82%", time: "3 min ago", color: "rose" },
  { id: 2, type: "OVERDUE", room: "Bed 108", patient: "Priya Shah", detail: "Insulin due 45 min ago", time: "45m overdue", color: "amber" },
  { id: 3, type: "OVERDUE", room: "Bed 112", patient: "Anil Mehta", detail: "Repositioning overdue 1hr", time: "1h overdue", color: "amber" },
];

export default function LiveAlerts() {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-[14px] font-bold text-[#1A1C23] dark:text-white uppercase-none">Live Alerts</h3>
        <button className="text-[11px] font-bold text-[#2D3A8C] dark:text-primary hover:underline uppercase-none">VIEW ALL (5)</button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {alerts.map((alert) => (
          <div 
            key={alert.id}
            className={cn(
              "flex items-center gap-2 p-1.5 rounded-full border transition-all cursor-pointer hover:opacity-90",
              alert.color === "rose" && "bg-[#FDF2F2] border-[#FBD5D5] dark:bg-rose-500/5 dark:border-rose-500/10",
              alert.color === "amber" && "bg-[#FEF9EC] border-[#FCE8B2] dark:bg-amber-500/5 dark:border-amber-500/10",
            )}
          >
            <div className="w-7 h-7 rounded-full bg-white dark:bg-[#101935] flex items-center justify-center shrink-0 shadow-sm">
              {alert.type === "CRITICAL" ? <AlertCircle className="w-3.5 h-3.5 text-[#F04438]" /> : <Clock className="w-3.5 h-3.5 text-[#F79009]" />}
            </div>
            
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className={cn(
                "text-[9px] font-bold shrink-0",
                alert.color === "rose" && "text-[#D92D20]",
                alert.color === "amber" && "text-[#B54708]",
              )}>
                {alert.type}
              </span>
              <div className="w-[1px] h-3 bg-[#E7E8EB] dark:bg-white/10 shrink-0" />
              <div className="flex items-center gap-1.5 flex-1 truncate">
                <p className="text-[11px] font-bold text-[#1A1C23] dark:text-white whitespace-nowrap">{alert.room}</p>
                <p className="text-[11px] text-[#5E6C84] dark:text-slate-400 font-medium whitespace-nowrap">{alert.patient}</p>
                <p className="text-[11px] font-bold text-[#1A1C23] dark:text-white truncate">{alert.detail}</p>
              </div>
              <div className="px-2 py-1 bg-white dark:bg-[#101935] rounded-full text-[9px] font-bold text-[#5E6C84] dark:text-slate-400 border border-[#E7E8EB] dark:border-white/10 shrink-0 uppercase-none">
                {alert.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
