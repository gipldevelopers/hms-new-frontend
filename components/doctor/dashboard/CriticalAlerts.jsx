"use client";

import React from "react";
import { 
  AlertCircle, 
  Clock, 
  FlaskConical, 
  Bell,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const alerts = [
  { 
    id: 1, 
    type: "critical", 
    title: "Critical Patient Alert", 
    desc: "Room 302: SpO2 levels dropping below 85%.", 
    action: "ACKNOWLEDGE",
    icon: AlertCircle,
    color: "rose"
  },
  { 
    id: 2, 
    type: "pending", 
    title: "Lab Result Pending", 
    desc: "MRI Results for Patient #8823 are now ready for review.", 
    action: "VIEW RESULTS",
    icon: FlaskConical,
    color: "amber"
  },
  { 
    id: 3, 
    type: "arrival", 
    title: "Emergency Arrival", 
    desc: "Ambulance #14 arriving in 4 minutes with trauma case.", 
    action: null,
    icon: AlertCircle,
    color: "blue"
  },
  { 
    id: 4, 
    type: "reminder", 
    title: "Follow-up Reminder", 
    desc: "Send discharge summaries for Ward 2C patients.", 
    action: null,
    icon: Bell,
    color: "indigo"
  },
];

export default function CriticalAlerts() {
  return (
    <div className="bg-white dark:bg-[#101935] p-5 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 shadow-none h-full">
      <h3 className="text-[14px] font-bold text-[#1A1C23] dark:text-white mb-5 uppercase-none">Critical Alert</h3>
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div 
            key={alert.id}
            className={cn(
              "p-4 rounded-[5px] border flex gap-4 transition-all",
              alert.color === "rose" && "bg-rose-50 border-rose-100 dark:bg-rose-500/5 dark:border-rose-500/10",
              alert.color === "amber" && "bg-amber-50 border-amber-100 dark:bg-amber-500/5 dark:border-amber-500/10",
              alert.color === "blue" && "bg-blue-50 border-blue-100 dark:bg-blue-500/5 dark:border-blue-500/10",
              alert.color === "indigo" && "bg-indigo-50 border-indigo-100 dark:bg-indigo-500/5 dark:border-indigo-500/10",
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
              alert.color === "rose" && "text-rose-500",
              alert.color === "amber" && "text-amber-500",
              alert.color === "blue" && "text-blue-500",
              alert.color === "indigo" && "text-indigo-500",
            )}>
              <alert.icon className="w-4 h-4" />
            </div>
            
            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-center">
                <p className={cn(
                  "text-[12px] font-bold",
                  alert.color === "rose" && "text-rose-600",
                  alert.color === "amber" && "text-amber-600",
                  alert.color === "blue" && "text-blue-600",
                  alert.color === "indigo" && "text-indigo-600",
                )}>
                  {alert.title}
                </p>
              </div>
              <p className="text-[11px] text-[#5E6C84] dark:text-slate-400 font-medium leading-relaxed">
                {alert.desc}
              </p>
              {alert.action && (
                <button className={cn(
                  "text-[10px] font-bold mt-2 hover:underline tracking-tight uppercase-none",
                  alert.color === "rose" && "text-rose-600",
                  alert.color === "amber" && "text-amber-600",
                )}>
                  {alert.action}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
