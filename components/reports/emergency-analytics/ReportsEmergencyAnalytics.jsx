"use client";

import React from "react";
import { Printer, FileDown, AlertTriangle, Building2, ClipboardList, Ambulance, Bed } from "lucide-react";
import { ReportsEmergencyStats } from "./ReportsEmergencyStats";
import { ReportsEmergencyList } from "./ReportsEmergencyList";
import { ReportsEmergencyOperationalOverview } from "./ReportsEmergencyOperationalOverview";

export default function ReportsEmergencyAnalytics() {
  return (
    <div className="p-6 bg-[#F8F9FC] dark:bg-[#0A0F1D] min-h-screen space-y-[20px] font-sans transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-[16px]">
        <div className="flex flex-col gap-1">
          <h1 className="text-[20px] font-bold text-[#101935] dark:text-white leading-tight tracking-tight">
            Emergency Analytics
          </h1>
          <p className="text-[13px] text-gray-400 dark:text-slate-500 font-medium">
            Live emergency operations & critical care monitoring
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#E7E8EB] dark:border-white/10 rounded-lg text-[13px] font-semibold text-[#1e293b] dark:text-slate-300 bg-white dark:bg-[#101935] hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg text-[13px] font-semibold text-white transition-all shadow-sm">
            <FileDown className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Live Alerts Panel */}
      <div className="space-y-3 mb-[20px]">
        <h3 className="text-[14px] font-bold text-[#101935] dark:text-white leading-none">
          Live Alerts
        </h3>
        <div className="flex flex-row flex-nowrap gap-3 items-center w-full overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Chip 1 */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#FFF1F1] dark:bg-red-950/20 border border-[#FEE2E2] dark:border-red-950/40 text-[12px] font-bold text-[#EF4444] dark:text-red-300 pr-2 whitespace-nowrap">
            <div className="w-5 h-5 rounded-full bg-white dark:bg-red-900/50 flex items-center justify-center text-[#EF4444] shrink-0 shadow-sm border border-gray-50/50">
              <AlertTriangle className="w-3 h-3 stroke-[2.5]" />
            </div>
            <span>CRITICAL Alerts</span>
            <div className="px-2 py-0.5 rounded-[4px] bg-white dark:bg-red-900/80 text-gray-400 dark:text-red-205 text-[10px] font-black flex items-center justify-center shrink-0 border border-gray-100 ml-1.5">
              7
            </div>
          </div>

          {/* Chip 2 */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#FFFBEB] dark:bg-amber-950/20 border border-[#FEF3C7] dark:border-amber-950/40 text-[12px] font-bold text-[#1E293B] dark:text-amber-300 pr-2 whitespace-nowrap">
            <div className="w-5 h-5 rounded-full bg-white dark:bg-amber-900/50 flex items-center justify-center text-[#F59E0B] shrink-0 shadow-sm border border-gray-50/50">
              <Building2 className="w-3 h-3 stroke-[2.5]" />
            </div>
            <span>ER Capacity</span>
            <div className="px-2 py-0.5 rounded-[4px] bg-white dark:bg-amber-900/80 text-gray-400 dark:text-amber-205 text-[10px] font-black flex items-center justify-center shrink-0 border border-gray-100 ml-1.5">
              87%
            </div>
          </div>

          {/* Chip 3 */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#EBFDF9] dark:bg-emerald-950/20 border border-[#CCFBEE] dark:border-emerald-950/40 text-[12px] font-bold text-[#1E293B] dark:text-emerald-300 pr-2 whitespace-nowrap">
            <div className="w-5 h-5 rounded-full bg-white dark:bg-emerald-900/50 flex items-center justify-center text-[#10B981] shrink-0 shadow-sm border border-gray-50/50">
              <ClipboardList className="w-3 h-3 stroke-[2.5]" />
            </div>
            <span>Active Cases</span>
            <div className="px-2 py-0.5 rounded-[4px] bg-white dark:bg-emerald-900/80 text-gray-400 dark:text-emerald-205 text-[10px] font-black flex items-center justify-center shrink-0 border border-gray-100 ml-1.5">
              142
            </div>
          </div>

          {/* Chip 4 */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#EFF6FF] dark:bg-blue-950/20 border border-[#DBEAFE] dark:border-blue-950/40 text-[12px] font-bold text-[#1E293B] dark:text-blue-300 pr-2 whitespace-nowrap">
            <div className="w-5 h-5 rounded-full bg-white dark:bg-blue-900/50 flex items-center justify-center text-[#3B82F6] shrink-0 shadow-sm border border-gray-50/50">
              <Ambulance className="w-3 h-3 stroke-[2.5]" />
            </div>
            <span>Ambulance</span>
            <div className="px-2 py-0.5 rounded-[4px] bg-white dark:bg-blue-900/80 text-gray-400 dark:text-blue-205 text-[10px] font-black flex items-center justify-center shrink-0 border border-gray-100 ml-1.5">
              8
            </div>
          </div>

          {/* Chip 5 */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#F5ECE1] dark:bg-amber-950/30 border border-[#E5D5C5] dark:border-amber-950/40 text-[12px] font-bold text-[#374151] dark:text-slate-200 pr-2 whitespace-nowrap">
            <div className="w-5 h-5 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-gray-500 shrink-0 shadow-sm border border-gray-50/50">
              <Bed className="w-3 h-3 stroke-[2.5]" />
            </div>
            <span>Available Beds</span>
            <div className="px-2 py-0.5 rounded-[4px] bg-white dark:bg-slate-800 text-gray-500 dark:text-slate-400 text-[10px] font-bold flex items-center justify-center shrink-0 border border-gray-100 ml-1.5">
              ER:02 | ICU:02
            </div>
          </div>
        </div>
      </div>

      {/* Row 1: Key Capacity Stat Cards */}
      <ReportsEmergencyStats />

      {/* Row 2: Emergency Operational Overview (Bed & Ward Overview & Live Triage operation Board) */}
      <ReportsEmergencyOperationalOverview />

      {/* Row 3: Live Emergency Patients Table */}
      <ReportsEmergencyList />
    </div>
  );
}
