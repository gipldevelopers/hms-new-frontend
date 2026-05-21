"use client";
import React from "react";
import { FileText, TestTube, CheckCircle, Activity } from "lucide-react";

const StatCard = ({ title, value, trendText, trendColor, icon: Icon, iconBgColor, iconColor }) => (
  <div className="bg-card text-card-foreground py-3.5 px-4 rounded-lg border border-border flex flex-col justify-between w-full transition-colors duration-300">
    <div className="flex justify-between items-start">
      <span className="text-[12px] text-muted-foreground font-semibold leading-none">{title}</span>
      <div className={`p-1.5 rounded-[4px] ${iconBgColor} flex items-center justify-center shrink-0`}>
        <Icon size={15} className={iconColor} />
      </div>
    </div>
    <div className="mt-2.5">
      <h3 className="text-[20px] font-bold text-foreground leading-none tracking-tight">{value}</h3>
      <p className={`text-[10px] font-bold mt-1.5 ${trendColor} leading-none`}>{trendText}</p>
    </div>
  </div>
);

export function OverviewCards() {
  const stats = [
    {
      title: "Today's Orders",
      value: "842",
      trendText: "+12% vs yesterday",
      trendColor: "text-emerald-500 dark:text-emerald-400",
      icon: FileText,
      iconBgColor: "bg-indigo-50 dark:bg-indigo-950/40",
      iconColor: "text-indigo-600 dark:text-indigo-400"
    },
    {
      title: "Pending Samples",
      value: "156",
      trendText: "+5% vs yesterday",
      trendColor: "text-emerald-500 dark:text-emerald-400",
      icon: TestTube,
      iconBgColor: "bg-emerald-50 dark:bg-emerald-950/40",
      iconColor: "text-emerald-600 dark:text-emerald-400"
    },
    {
      title: "Results Ready",
      value: "612",
      trendText: "-2 vs avg",
      trendColor: "text-orange-500 dark:text-orange-400",
      icon: CheckCircle,
      iconBgColor: "bg-amber-50 dark:bg-amber-950/40",
      iconColor: "text-amber-600 dark:text-amber-400"
    },
    {
      title: "Critical Alerts",
      value: "4",
      trendText: "+2 vs yesterday",
      trendColor: "text-rose-500 dark:text-rose-400",
      icon: Activity,
      iconBgColor: "bg-rose-50 dark:bg-rose-950/40",
      iconColor: "text-rose-600 dark:text-rose-400"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-[20px]">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
