"use client";

import React from "react";
import { Printer, FileDown, AlertTriangle, Home, ClipboardList, Ambulance, Bed } from "lucide-react";
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
      <div className="space-y-2.5 mb-[20px]">
        <h3 className="text-[14px] font-bold text-[#101935] dark:text-white leading-none">
          Live Alerts
        </h3>
        <div className="flex flex-wrap gap-3">
          {/* Chip 1 */}
          <div className="bg-[#FADBD8] dark:bg-red-950/40 px-3.5 py-1.5 rounded-full flex items-center justify-between gap-4 text-[12px] font-extrabold text-[#E02424] min-w-[190px] shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shrink-0">
                <AlertTriangle className="w-3.5 h-3.5 text-[#E02424]" />
              </div>
              <span>CRITICAL Alerts</span>
            </div>
            <span className="bg-white dark:bg-slate-800 text-gray-500 dark:text-slate-400 px-2 py-0.5 rounded-full text-[10px] font-black shadow-sm">7</span>
          </div>

          {/* Chip 2 */}
          <div className="bg-[#F5ECE1] dark:bg-amber-950/30 px-3.5 py-1.5 rounded-full flex items-center justify-between gap-4 text-[12px] font-extrabold text-[#374151] dark:text-slate-200 min-w-[190px] shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shrink-0">
                <Home className="w-3.5 h-3.5 text-gray-500" />
              </div>
              <span>ER Capacity</span>
            </div>
            <span className="bg-white dark:bg-slate-800 text-gray-500 dark:text-slate-400 px-2.5 py-0.5 rounded-full text-[10px] font-black shadow-sm">87 %</span>
          </div>

          {/* Chip 3 */}
          <div className="bg-[#D2EBE9] dark:bg-teal-950/40 px-3.5 py-1.5 rounded-full flex items-center justify-between gap-4 text-[12px] font-extrabold text-[#374151] dark:text-slate-200 min-w-[190px] shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shrink-0">
                <ClipboardList className="w-3.5 h-3.5 text-gray-500" />
              </div>
              <span>Active Cases</span>
            </div>
            <span className="bg-white dark:bg-slate-800 text-gray-500 dark:text-slate-400 px-2.5 py-0.5 rounded-full text-[10px] font-black shadow-sm">142</span>
          </div>

          {/* Chip 4 */}
          <div className="bg-[#D8E6F8] dark:bg-blue-950/40 px-3.5 py-1.5 rounded-full flex items-center justify-between gap-4 text-[12px] font-extrabold text-[#374151] dark:text-slate-200 min-w-[190px] shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shrink-0">
                <Ambulance className="w-3.5 h-3.5 text-gray-500" />
              </div>
              <span>Ambulance</span>
            </div>
            <span className="bg-white dark:bg-slate-800 text-gray-500 dark:text-slate-400 px-2.5 py-0.5 rounded-full text-[10px] font-black shadow-sm">8</span>
          </div>

          {/* Chip 5 */}
          <div className="bg-[#F5ECE1] dark:bg-amber-950/30 px-3.5 py-1.5 rounded-full flex items-center justify-between gap-4 text-[12px] font-extrabold text-[#374151] dark:text-slate-200 min-w-[240px] shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shrink-0">
                <Bed className="w-3.5 h-3.5 text-gray-500" />
              </div>
              <span>Available Beds</span>
            </div>
            <span className="bg-white dark:bg-slate-800 text-gray-500 dark:text-slate-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm">
              ER:02 | ICU:<span className="text-[#E02424] font-black">02</span>
            </span>
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
