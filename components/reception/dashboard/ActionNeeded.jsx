"use client";

import React from "react";
import { Clock, ShieldAlert, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

const actions = [
  { 
    icon: Clock, 
    title: "Dr. Sarah Smith Delayed", 
    desc: "Cardiology OPD is running 30 mins behind schedule.", 
    color: "text-sky-600 bg-sky-50 dark:bg-sky-500/10" 
  },
  { 
    icon: ShieldAlert, 
    title: "Emergency Alert", 
    desc: "Trauma case arriving in 5 mins. Prep Room 1.", 
    color: "text-rose-600 bg-rose-50 dark:bg-rose-500/10" 
  },
  { 
    icon: Wallet, 
    title: "Payment Pending", 
    desc: "3 patients checked out without completing pharmacy payment.", 
    color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10" 
  },
];

export default function ActionNeeded() {
  return (
    <div className="bg-card border border-border rounded-lg shadow-none flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-5 md:px-6 py-4 border-b border-border/60 shrink-0">
        <h2 className="text-[15px] font-bold text-foreground">Action Needed</h2>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 overflow-y-auto no-scrollbar">
        <div className="flex flex-col gap-8 pb-8">
          {actions.map((action, i) => (
            <div key={i} className="flex gap-4 group cursor-pointer">
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", action.color)}>
                <action.icon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-[13px] font-bold text-foreground group-hover:text-primary transition-colors">{action.title}</p>
                <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">
                  {action.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
