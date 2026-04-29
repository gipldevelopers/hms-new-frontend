"use client";

import React from "react";
import { 
  Bed, 
  UserCheck, 
  UserPlus, 
  RefreshCw, 
  AlertCircle 
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function BedStats({ stats }) {
  const displayStats = [
    { label: "Total beds", value: stats?.total || 0, icon: Bed, color: "indigo" },
    { label: "Occupied", value: stats?.occupied || 0, icon: UserCheck, color: "rose" },
    { label: "Vacant", value: stats?.vacant || 0, icon: UserPlus, color: "blue" },
    { label: "Cleaning", value: stats?.cleaning || 0, icon: RefreshCw, color: "emerald" },
    { label: "Critical", value: stats?.critical || 0, icon: AlertCircle, color: "sky" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
      {displayStats.map((stat, idx) => (
        <div 
          key={idx} 
          className="bg-white dark:bg-[#101935] p-5 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 flex items-center justify-between group transition-all"
        >
          <div className="space-y-1">
            <p className="text-[12px] font-medium text-[#5E6C84] dark:text-slate-400 uppercase-none leading-none">
              {stat.label}
            </p>
            <p className="text-[28px] font-bold text-[#1A1C23] dark:text-white leading-none">
              {stat.value}
            </p>
          </div>
          <div className={cn(
            "w-10 h-10 rounded-[5px] flex items-center justify-center transition-colors",
            stat.color === "indigo" && "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
            stat.color === "rose" && "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
            stat.color === "blue" && "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
            stat.color === "emerald" && "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
            stat.color === "sky" && "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400",
          )}>
            <stat.icon className="w-5 h-5" />
          </div>
        </div>
      ))}
    </div>
  );
}
