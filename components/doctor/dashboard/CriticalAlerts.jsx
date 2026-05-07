"use client";

import React from "react";
import { ShieldAlert, FlaskConical, Ambulance, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

const alerts = [
  { 
    type: "Critical", 
    title: "Critical Patient Alert", 
    desc: "Room 302: SpO2 levels dropping below 85%.", 
    status: "ACKNOWLEDGE", 
    icon: ShieldAlert,
    color: "bg-rose-50 dark:bg-rose-500/10 text-rose-600 border-none" 
  },
  { 
    type: "Pending", 
    title: "Lab Result Pending", 
    desc: "MRI Results for Patient #8823 are now ready for review.", 
    status: "VIEW RESULTS", 
    icon: FlaskConical,
    color: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 border-none" 
  },
  { 
    type: "Emergency", 
    title: "Emergency Arrival", 
    desc: "Ambulance #14 arriving in 4 minutes with trauma case.", 
    icon: Ambulance,
    color: "bg-sky-50 dark:bg-sky-500/10 text-sky-600 border-none" 
  },
  { 
    type: "Reminder", 
    title: "Follow-up Reminder", 
    desc: "Send discharge summaries for Ward 2C patients.", 
    icon: Bell,
    color: "bg-slate-50 dark:bg-slate-500/10 text-slate-600 border-none" 
  },
  { 
    type: "Critical", 
    title: "Critical Patient Alert", 
    desc: "Room 302: SpO2 levels dropping below 85%.", 
    status: "ACKNOWLEDGE", 
    icon: ShieldAlert,
    color: "bg-rose-50 dark:bg-rose-500/10 text-rose-600 border-none" 
  },
];

export default function CriticalAlerts({ className }) {
  return (
    <div className={cn("bg-card border border-border rounded-lg shadow-none flex flex-col overflow-hidden", className)}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-border/60 flex justify-between items-center shrink-0">
        <h2 className="text-[15px] font-bold text-[#1e293b] dark:text-foreground">Critical Alert</h2>
        <button className="text-[12px] font-bold text-primary hover:underline underline-offset-4">
          View all
        </button>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 overflow-y-auto no-scrollbar">
        <div className="space-y-4 pb-4"> {/* Added pb-4 to prevent cut-off */}
          {alerts.map((alert, i) => (
            <div key={i} className={cn("p-5 rounded-[12px] flex gap-4 transition-all", alert.color)}>
              <div className="shrink-0">
                <alert.icon className="w-6 h-6" />
              </div>
              <div className="space-y-2 flex-1 min-w-0">
                <p className="text-[13px] font-bold leading-tight">{alert.title}</p>
                <p className="text-[11px] font-medium opacity-80 leading-relaxed">
                  {alert.desc}
                </p>
                {alert.status && (
                  <button className="block text-[11px] font-bold tracking-wider uppercase hover:opacity-70 transition-all mt-1">
                    {alert.status}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
