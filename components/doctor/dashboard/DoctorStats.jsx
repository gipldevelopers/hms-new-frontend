"use client";

import React from "react";
import { User, Stethoscope, Building2, Siren } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  { label: "Total Patients", value: "150", change: "+95%", trend: "up", icon: User, color: "text-sky-500", bg: "bg-sky-50 dark:bg-sky-500/10", border: "border-sky-100 dark:border-sky-500/20" },
  { label: "OPD Visits", value: "50", change: "+25%", trend: "up", icon: Stethoscope, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-500/10", border: "border-rose-100 dark:border-rose-500/20" },
  { label: "IPD Admission", value: "35", change: "-15%", trend: "down", icon: Building2, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10", border: "border-blue-100 dark:border-blue-500/20" },
  { label: "Emergency", value: "21", change: "+25%", trend: "up", icon: Siren, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10", border: "border-emerald-100 dark:border-emerald-500/20" },
];

export default function DoctorStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
      {stats.map((stat, i) => (
        <div key={i} className="bg-card border border-border rounded-lg p-5 flex flex-col justify-between shadow-none relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center border", stat.bg, stat.border)}>
              <stat.icon className={cn("w-5 h-5", stat.color)} />
            </div>
            <div className="text-right">
              <span className={cn(
                "text-[11px] font-bold px-2 py-0.5 rounded-lg",
                stat.trend === "up" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10" : "bg-red-50 text-red-600 dark:bg-red-500/10"
              )}>
                {stat.change}
              </span>
              <p className="text-[10px] font-medium text-muted-foreground mt-1 whitespace-nowrap">in last 7 Days</p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[13px] font-medium text-muted-foreground">{stat.label}</p>
            <p className="text-[28px] font-bold text-foreground leading-none">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
