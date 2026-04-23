"use client";

import React from "react";
import { Users, Bed, Activity, IndianRupee, TrendingUp, TrendingDown } from "lucide-react";

const stats = [
  {
    title: "TOTAL PATIENTS",
    value: "1,248",
    change: "+12%",
    trend: "up",
    period: "vs last month",
    icon: Users,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    title: "BED OCCUPANCY",
    value: "78%",
    change: "High",
    trend: "up",
    period: "in last 7 days",
    icon: Bed,
    iconBg: "bg-green-50",
    iconColor: "text-green-500",
    badgeBg: "bg-orange-100",
    badgeText: "text-orange-600",
  },
  {
    title: "EMERGENCY LOAD",
    value: "34",
    change: "+25%",
    trend: "up",
    period: "in last 7 days",
    icon: Activity,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-500",
  },
  {
    title: "TODAY&apos;S REVENUE",
    value: "₹4,82,500",
    change: "+15%",
    trend: "up",
    period: "vs last 7 days",
    icon: IndianRupee,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
    trendIcon: true,
  },
];

export function StatCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[20px]">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white dark:bg-[#1E293B] p-5 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 flex flex-col justify-between"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                {stat.title}
              </p>
              <h3 className="text-2xl font-bold text-[#1e293b] dark:text-white">
                {stat.value}
              </h3>
            </div>
            <div className={`p-2 rounded-[5px] ${stat.iconBg} dark:bg-opacity-10`}>
              <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-[3px] flex items-center gap-1 ${
                stat.badgeBg || (stat.trend === "up" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600")
              }`}
            >
              {stat.change}
            </span>
            <span className="text-[10px] text-gray-400 font-medium">
              {stat.period}
            </span>
            {stat.trendIcon && (
               <TrendingUp className="w-3 h-3 text-orange-500 ml-auto" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
