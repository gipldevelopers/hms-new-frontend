"use client";

import React from "react";
import { cn } from "@/lib/utils";

import { TrendingUp, TrendingDown } from "lucide-react";

export function ReportsStatCard({ title, value, change, isPositive, iconBg, iconColor, icon: Icon, isDollarText }) {
  return (
    <div className="bg-white dark:bg-[#1E293B] p-5 rounded-[6px] border border-[#E7E8EB] dark:border-white/10 shadow-none flex justify-between items-start">
      <div className="space-y-2">
        <p className="text-[12.5px] font-medium text-slate-500 dark:text-slate-400">
          {title}
        </p>
        <h3 className="text-[26px] font-extrabold text-slate-800 dark:text-white leading-none">
          {value}
        </h3>
        <div className={cn(
          "text-[11.5px] font-bold flex items-center gap-1 pt-1",
          isPositive ? "text-[#10B981]" : "text-[#EF4444]"
        )}>
          {isPositive ? (
            <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 stroke-[2.5]" />
          )}
          <span>{change}</span>
        </div>
      </div>

      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
        iconBg,
        iconColor
      )}>
        {isDollarText ? (
          <span className="font-extrabold text-[15px]">$</span>
        ) : (
          <Icon className="w-4 h-4 stroke-[2.5]" />
        )}
      </div>
    </div>
  );
}

export default ReportsStatCard;
