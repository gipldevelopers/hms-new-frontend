"use client";

import React from "react";
import { 
  Users, 
  UserCheck, 
  Bed, 
  AlertCircle,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { cn } from "@/lib/utils";

function Sparkline({ data, color, type = "line" }) {
  if (type === "bar") {
    return (
      <div className="flex items-end gap-0.5 h-8">
        {data.map((v, i) => (
          <div 
            key={i} 
            className={cn("w-1.5 rounded-t-[1px]", color)} 
            style={{ height: `${v}%` }} 
          />
        ))}
      </div>
    );
  }

  const points = data.map((v, i) => `${(i / (data.length - 1)) * 50},${20 - (v / 100) * 20}`).join(" ");
  return (
    <svg width="50" height="20" className="overflow-visible">
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        className={color}
      />
    </svg>
  );
}

function StatCard({ title, value, icon: Icon, trend, trendValue, chartData, chartType, iconBg, iconColor }) {
  return (
    <div className="bg-white dark:bg-[#101935] p-5 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 flex flex-col justify-between shadow-none transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className={cn("w-10 h-10 rounded-[5px] flex items-center justify-center", iconBg, iconColor)}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex flex-col items-end">
          <div className={cn(
            "flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] text-[10px] font-bold mb-1",
            trend === "up" ? "bg-emerald-50 text-emerald-500" : "bg-rose-50 text-rose-500"
          )}>
            {trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trendValue}
          </div>
          <p className="text-[10px] text-[#A0AEC0] font-medium uppercase-none">In last 7 days</p>
        </div>
      </div>
      
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-medium text-[#5E6C84] dark:text-slate-400 uppercase-none">{title}</p>
          <p className="text-[24px] font-bold text-[#1A1C23] dark:text-white leading-none">{value}</p>
        </div>
        <div className="pb-1">
          <Sparkline 
            data={chartData} 
            color={trend === "up" ? "text-emerald-500 bg-emerald-500" : "text-rose-500 bg-rose-500"} 
            type={chartType} 
          />
        </div>
      </div>
    </div>
  );
}

export default function DoctorStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <StatCard 
        title="Total Patients" 
        value="150" 
        icon={Users} 
        trend="up" 
        trendValue="+95%" 
        chartData={[20, 50, 30, 80, 40, 90, 70]} 
        chartType="bar"
        iconBg="bg-blue-50 dark:bg-blue-500/10"
        iconColor="text-blue-500"
      />
      <StatCard 
        title="OPD Visits" 
        value="50" 
        icon={UserCheck} 
        trend="up" 
        trendValue="+25%" 
        chartData={[30, 40, 35, 50, 45, 60, 55]} 
        chartType="line"
        iconBg="bg-rose-50 dark:bg-rose-500/10"
        iconColor="text-rose-500"
      />
      <StatCard 
        title="IPD Admission" 
        value="35" 
        icon={Bed} 
        trend="down" 
        trendValue="-15%" 
        chartData={[80, 70, 90, 60, 85, 50, 75]} 
        chartType="bar"
        iconBg="bg-indigo-50 dark:bg-indigo-500/10"
        iconColor="text-indigo-500"
      />
      <StatCard 
        title="Emergency" 
        value="21" 
        icon={AlertCircle} 
        trend="up" 
        trendValue="+25%" 
        chartData={[40, 50, 45, 65, 55, 75, 70]} 
        chartType="line"
        iconBg="bg-emerald-50 dark:bg-emerald-500/10"
        iconColor="text-emerald-500"
      />
    </div>
  );
}
