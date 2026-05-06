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
        <h3 className="text-[14px] font-bold text-foreground uppercase tracking-wider">Live Alerts</h3>
        <button className="text-[11px] font-bold text-primary hover:underline">VIEW ALL (5)</button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {alerts.map((alert) => (
          <div 
            key={alert.id}
            className={cn(
              "flex items-center gap-3 p-2 rounded-lg border transition-all cursor-pointer hover:bg-muted/50",
              alert.color === "rose" && "bg-destructive/10 border-destructive/20",
              alert.color === "amber" && "bg-amber-500/10 border-amber-500/20",
            )}
          >
            <div className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center shrink-0 shadow-none">
              {alert.type === "CRITICAL" ? <AlertCircle className="w-4 h-4 text-destructive" /> : <Clock className="w-4 h-4 text-amber-500" />}
            </div>
            
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className={cn(
                "text-[10px] font-bold shrink-0 tracking-wider",
                alert.color === "rose" && "text-destructive",
                alert.color === "amber" && "text-amber-600 dark:text-amber-400",
              )}>
                {alert.type}
              </span>
              <div className="w-[1px] h-3.5 bg-border shrink-0" />
              <div className="flex items-center gap-2 flex-1 truncate">
                <p className="text-[12px] font-bold text-foreground whitespace-nowrap">{alert.room}</p>
                <p className="text-[11px] text-muted-foreground font-medium whitespace-nowrap">{alert.patient}</p>
                <p className="text-[12px] font-bold text-foreground truncate">{alert.detail}</p>
              </div>
              <div className="px-2.5 py-1 bg-card rounded-lg text-[10px] font-bold text-muted-foreground border border-border shrink-0">
                {alert.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
