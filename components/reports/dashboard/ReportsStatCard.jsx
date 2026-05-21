import React from "react";
import { cn } from "@/lib/utils";

export function ReportsStatCard({ title, value, trend, isUp, color, icon: Icon, trendSuffix = "vs yesterday" }) {
  const colorMap = {
    purple: {
      bg: "bg-[#F0F2FF]",
      iconBg: "bg-[#EBE9FF]",
      icon: "text-[#5C67FF]",
      text: "text-[#5C67FF]",
    },
    green: {
      bg: "bg-[#E7F9ED]",
      iconBg: "bg-[#DCFCE7]",
      icon: "text-[#2ECC71]",
      text: "text-[#2ECC71]",
    },
    orange: {
      bg: "bg-[#FFF7ED]",
      iconBg: "bg-[#FFEDD5]",
      icon: "text-[#F97316]",
      text: "text-[#F97316]",
    },
    red: {
      bg: "bg-[#FFF1F1]",
      iconBg: "bg-[#FEE2E2]",
      icon: "text-[#FF5C5C]",
      text: "text-[#FF5C5C]",
    },
    blue: {
      bg: "bg-[#EFF6FF]",
      iconBg: "bg-[#DBEAFE]",
      icon: "text-[#3B82F6]",
      text: "text-[#3B82F6]",
    },
    indigo: {
      bg: "bg-card",
      iconBg: "bg-[#EFF2FC] dark:bg-indigo-950/40",
      icon: "text-[#3F51B5] dark:text-[#818CF8]",
      text: "text-[#3F51B5] dark:text-[#818CF8]",
    },
  };

  const style = colorMap[color] || colorMap.purple;

  return (
    <div className="bg-card p-5 rounded-lg border border-border flex flex-col justify-between md:h-[134px] min-h-[134px] h-auto transition-all w-full shadow-none hover:border-gray-300 dark:hover:border-white/20">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <p className="text-[13px] font-medium text-gray-400 dark:text-slate-500">
            {title}
          </p>
          <h2 className="text-[24px] mt-[4px] font-bold text-[#1e293b] dark:text-white tracking-tight leading-none">
            {value}
          </h2>
        </div>
        <div className={cn("w-10 h-10 rounded-[6px] flex items-center justify-center", style.iconBg)}>
          <Icon className={cn("w-5 h-5", style.icon)} />
        </div>
      </div>

      <div className="flex items-center gap-1.5 mt-2">
        <span className={cn("text-[14px] font-bold", isUp ? "text-[#2ECC71]" : "text-[#FF5C5C]")}>
          {isUp ? `+${trend}` : trend}
        </span>
        <span className="text-[14px] text-gray-400 dark:text-slate-500">
          {trendSuffix}
        </span>
      </div>
    </div>
  );
}
