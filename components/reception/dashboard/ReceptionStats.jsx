"use client";

import React from "react";
import { UserPlus, Calendar, Users, Siren } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  { 
    label: "Today Registrations", 
    value: "142", 
    change: "+12%", 
    trend: "up", 
    icon: UserPlus, 
    color: "text-sky-600", 
    bg: "bg-sky-50 dark:bg-sky-500/10", 
    border: "border-sky-100 dark:border-sky-500/20" 
  },
  { 
    label: "OPD Appointments", 
    value: "284", 
    change: "+5%", 
    trend: "up", 
    icon: Calendar, 
    color: "text-emerald-600", 
    bg: "bg-emerald-50 dark:bg-emerald-500/10", 
    border: "border-emerald-100 dark:border-emerald-500/20" 
  },
  { 
    label: "Waiting Patients", 
    value: "36", 
    change: "-2", 
    trend: "down", 
    trendText: "vs avg", 
    icon: Users, 
    color: "text-amber-600", 
    bg: "bg-amber-50 dark:bg-amber-500/10", 
    border: "border-amber-100 dark:border-amber-500/20" 
  },
  { 
    label: "Emergency Patients", 
    value: "8", 
    change: "+2", 
    trend: "up", 
    icon: Siren, 
    color: "text-rose-600", 
    bg: "bg-rose-50 dark:bg-rose-500/10", 
    border: "border-rose-100 dark:border-rose-500/20" 
  },
];

export default function ReceptionStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
      {stats.map((stat, i) => (
        <div key={i} className="bg-card border border-border rounded-lg p-4 md:p-5 flex flex-col justify-between shadow-none relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-1">
              <p className="text-[12px] md:text-[13px] font-medium text-muted-foreground">{stat.label}</p>
              <p className="text-[24px] md:text-[28px] font-bold text-foreground leading-none tracking-tight">{stat.value}</p>
            </div>
            <div className={cn("w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center border", stat.bg, stat.border)}>
              <stat.icon className={cn("w-5 h-5 md:w-6 md:h-6", stat.color)} />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-auto">
            <span className={cn(
              "text-[11px] font-bold",
              stat.trend === "up" ? "text-emerald-600" : "text-rose-600"
            )}>
              {stat.change}
            </span>
            <span className="text-[10px] md:text-[11px] font-medium text-muted-foreground">
              {stat.trendText || "vs yesterday"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
