"use client";

import React from "react";
import { AlertCircle, Ambulance, AlertTriangle } from "lucide-react";

export function ReportsEmergencyOperationalOverview() {
  const alerts = [
    {
      title: "ICU Capacity >90%",
      desc: "2 beds remaining. Diversion protocol suggested.",
    },
    {
      title: "ICU Capacity 80-90%",
      desc: "5 beds remaining. Monitor closely.",
    },
    {
      title: "ICU Capacity 70-80%",
      desc: "10 beds remaining. Normal operations.",
    },
    {
      title: "ICU Capacity <70%",
      desc: "15 beds remaining. Optimal conditions.",
    },
  ];

  const incoming = [
    {
      id: "A1",
      title: "Cardiac Arrest",
      prio: "P1 Critical",
      eta: "ETA 4m",
      isBlueEta: true,
      isBlueCircle: true,
    },
    {
      id: "A6",
      title: "Trauma Level 2",
      prio: "P2 Urgent",
      eta: "ETA 12m",
      isBlueEta: false,
      isBlueCircle: false,
    },
    {
      id: "A3",
      title: "Stroke",
      prio: "P1 Critical",
      eta: "ETA 5m",
      isBlueEta: true,
      isBlueCircle: true,
    },
    {
      id: "A4",
      title: "Severe Allergic Reaction",
      prio: "P1 Critical",
      eta: "ETA 6m",
      isBlueEta: false,
      isBlueCircle: true,
    },
    {
      id: "A5",
      title: "Fractured Limb",
      prio: "P3 Non-Urgent",
      eta: "ETA 20m",
      isBlueEta: true,
      isBlueCircle: true,
    },
    {
      id: "A2",
      title: "Chest Pain",
      prio: "P2 Urgent",
      eta: "ETA 8m",
      isBlueEta: false,
      isBlueCircle: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-[20px] font-sans">
      {/* Column 1: Bed & Ward Overview */}
      <div className="bg-card rounded-lg border border-border flex flex-col min-h-[350px] h-full shadow-none hover:border-gray-300 dark:hover:border-white/20">
        <div className="p-6 border-b border-border flex items-center shrink-0">
          <h3 className="text-[16px] font-bold text-[#1e293b] dark:text-white">
            Bed & Ward Overview
          </h3>
        </div>

        <div className="p-5 flex flex-col justify-between flex-1">
          {/* Summary Boxes */}
          <div className="grid grid-cols-3 gap-3 w-full mt-5">
            {/* Total Beds */}
            <div className="p-2.5 bg-[#F4F6F9] dark:bg-[#1E293B]/40 rounded-lg flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 leading-none">
                Total Beds
              </span>
              <h4 className="text-[18px] font-bold text-[#1e293b] dark:text-white mt-1.5 leading-none">
                450
              </h4>
            </div>

            {/* Occupied */}
            <div className="p-2.5 bg-[#EBFBF8] dark:bg-[#0F766E]/10 rounded-lg flex flex-col">
              <span className="text-[10px] font-bold text-[#0F766E] dark:text-teal-400 leading-none">
                Occupied
              </span>
              <h4 className="text-[18px] font-bold text-[#0F766E] dark:text-teal-400 mt-1.5 leading-none">
                327
              </h4>
            </div>

            {/* Available */}
            <div className="p-2.5 bg-[#ECFDF5] dark:bg-[#047857]/10 rounded-lg flex flex-col">
              <span className="text-[10px] font-bold text-[#047857] dark:text-emerald-400 leading-none">
                Available
              </span>
              <h4 className="text-[18px] font-bold text-[#047857] dark:text-emerald-400 mt-1.5 leading-none">
                123
              </h4>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="space-y-3 mt-4 w-full mb-10">
            {/* ICU Occupancy */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[12px] font-semibold text-gray-600 dark:text-slate-300">
                <span>ICU Occupancy</span>
                <span className="font-bold text-gray-500 dark:text-slate-400">
                  38/45 (84.4%)
                </span>
              </div>
              <div className="w-full h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#EF4444] rounded-full"
                  style={{ width: "84.4%" }}
                ></div>
              </div>
            </div>

            {/* General Ward */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[12px] font-semibold text-gray-600 dark:text-slate-300">
                <span>General Ward</span>
                <span className="font-bold text-gray-500 dark:text-slate-400">
                  289/405 (71.4%)
                </span>
              </div>
              <div className="w-full h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0D9488] rounded-full"
                  style={{ width: "71.4%" }}
                ></div>
              </div>
            </div>

            {/* Overall Occupancy */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[12px] font-semibold text-gray-600 dark:text-slate-300">
                <span>Overall Occupancy</span>
                <span className="font-bold text-gray-500 dark:text-slate-400">
                  72.7%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#3B82F6] rounded-full"
                  style={{ width: "72.7%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Column 2: Critical Alert */}
      <div className="bg-card rounded-lg border border-border flex flex-col shadow-none hover:border-gray-300 dark:hover:border-white/20 min-h-[350px] h-full">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h3 className="text-[16px] font-bold text-[#1e293b] dark:text-white">
            Critical Alert
          </h3>
          <button className="px-3 py-1 border border-border dark:border-white/5 rounded-lg text-[11px] font-semibold text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
            View all
          </button>
        </div>

        <div className="p-6 flex flex-col justify-start gap-2.5">
          {alerts.map((alert, i) => (
            <div
              key={i}
              className="p-2.5 bg-[#FFF5F5] dark:bg-red-950/20 rounded-lg flex items-center gap-3.5"
            >
              <svg
                className="w-5 h-10 text-[#EF4444] shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2l10 10-10 10L2 12z" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2.5" />
              </svg>
              <div className="flex flex-col gap-0.5">
                <span className="text-[14px] font-bold text-gray-800 dark:text-slate-200 leading-none">
                  {alert.title}
                </span>
                <p className="text-[11px] text-gray-400 dark:text-slate-500 font-medium leading-none mt-1.5">
                  {alert.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Column 3: Incoming */}
      <div className="bg-card rounded-lg border border-border flex flex-col shadow-none hover:border-gray-300 dark:hover:border-white/20 min-h-[350px] h-full">
        <div className="p-6 border-b border-border flex items-center gap-2 shrink-0">
          <Ambulance className="w-5 h-5 text-[#3F51B5] dark:text-[#818CF8]" />
          <h3 className="text-[16px] font-bold text-[#1e293b] dark:text-white">
            Incoming
          </h3>
        </div>

        <div className="p-4 flex flex-col justify-start gap-2">
          {incoming.map((caseItem, i) => (
            <div
              key={i}
              className="flex justify-between items-center py-2 border-b last:border-0 border-gray-100 dark:border-white/5"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${caseItem.isBlueCircle
                    ? "bg-[#EEF2FF] text-[#4F46E5] dark:bg-indigo-950 dark:text-indigo-300"
                    : "bg-[#F8FAFC] text-gray-500 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                >
                  {caseItem.id}
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-gray-800 dark:text-slate-200 leading-none">
                    {caseItem.title}
                  </span>
                  <span className="text-[9px] text-gray-400 dark:text-slate-500 font-semibold mt-1 leading-none">
                    {caseItem.prio}
                  </span>
                </div>
              </div>

              <span
                className={`text-[8.5px] font-extrabold px-1.5 py-0.5 rounded-full shrink-0 ${caseItem.isBlueEta
                  ? "bg-[#0A2540] text-white"
                  : "bg-[#F1F5F9] text-gray-600 dark:bg-slate-800 dark:text-slate-400"
                  }`}
              >
                {caseItem.eta}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
