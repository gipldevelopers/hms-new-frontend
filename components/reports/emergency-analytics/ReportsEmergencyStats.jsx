"use client";

import React from "react";
import { Users, Activity, AlertCircle, UserCheck, Timer, HeartOff, Syringe, Stethoscope } from "lucide-react";

function ReportsEmergencyCard({ title, value, trend, trendSuffix, isUp, headerColor, icon: Icon }) {
  return (
    <div className="bg-card p-5 rounded-lg border border-border flex flex-col justify-between md:h-[134px] min-h-[134px] h-auto transition-all w-full shadow-none hover:border-gray-300 dark:hover:border-white/20">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <p className={`text-[11px] font-extrabold uppercase tracking-wider ${headerColor || "text-gray-400 dark:text-slate-500"}`}>
            {title}
          </p>
          <h2 className="text-[24px] mt-[4px] font-bold text-[#1e293b] dark:text-white tracking-tight leading-none">
            {value}
          </h2>
        </div>
        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#EEF2FF] dark:bg-indigo-950/40 shrink-0">
          <Icon className="w-5 h-5 text-[#4F46E5] dark:text-[#818CF8]" />
        </div>
      </div>

      <div className="flex items-center gap-1.5 mt-2">
        <span className={isUp ? "text-[#2ECC71] text-[14px] font-bold" : "text-[#FF5C5C] text-[14px] font-bold"}>
          {trend}
        </span>
        <span className="text-[14px] text-gray-400 dark:text-slate-500">
          {trendSuffix}
        </span>
      </div>
    </div>
  );
}

export function ReportsEmergencyStats({ stats = {} }) {
  const cards = [
    {
      title: "TOTAL PATIENTS",
      value: stats.totalPatients !== undefined ? stats.totalPatients : "142",
      trend: "+12%",
      trendSuffix: "vs yesterday",
      isUp: true,
      icon: Users,
    },
    {
      title: "P1 CRITICAL",
      value: stats.p1Critical !== undefined ? stats.p1Critical : "18",
      trend: "+5%",
      trendSuffix: "vs yesterday",
      isUp: true,
      headerColor: "text-[#EF4444] dark:text-red-400",
      icon: Activity,
    },
    {
      title: "P2 URGENT",
      value: stats.p2Urgent !== undefined ? stats.p2Urgent : "46",
      trend: "-2",
      trendSuffix: "vs avg",
      isUp: false,
      headerColor: "text-[#F59E0B] dark:text-amber-400",
      icon: AlertCircle,
    },
    {
      title: "P3 NON-URGENT",
      value: stats.p3NonUrgent !== undefined ? stats.p3NonUrgent : "78",
      trend: "+2%",
      trendSuffix: "vs yesterday",
      isUp: true,
      headerColor: "text-[#10B981] dark:text-emerald-400",
      icon: UserCheck,
    },
    {
      title: "RESPONSE TIME",
      value: stats.responseTime || "41m wait",
      trend: "+1.5d",
      trendSuffix: "vs yesterday",
      isUp: true,
      icon: Timer,
    },
    {
      title: "MORTALITY TODAY",
      value: stats.mortalityToday !== undefined ? stats.mortalityToday : "2",
      trend: "+5%",
      trendSuffix: "vs yesterday",
      isUp: true,
      icon: HeartOff,
    },
    {
      title: "ACTIVE NURSES",
      value: stats.activeNurses !== undefined ? stats.activeNurses : "25",
      trend: "-2%",
      trendSuffix: "vs avg",
      isUp: false,
      icon: Syringe,
    },
    {
      title: "ACTIVE DOCTORS",
      value: stats.activeDoctors !== undefined ? stats.activeDoctors : "21",
      trend: "+2",
      trendSuffix: "vs yesterday",
      isUp: true,
      icon: Stethoscope,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
      {cards.map((card, i) => (
        <ReportsEmergencyCard key={i} {...card} />
      ))}
    </div>
  );
}
