"use client";

import React from "react";
import { Printer, FileDown } from "lucide-react";
import { ReportsStatGrid } from "./ReportsStatGrid";
import { ReportsRevenueTrend } from "./ReportsRevenueTrend";
import { ReportsBedWardOverview } from "./ReportsBedWardOverview";
import { ReportsAlertsActivity } from "./ReportsAlertsActivity";
import { ReportsRunningBills } from "./ReportsRunningBills";

export default function ReportsDashboard() {
  return (
    <div className="p-6 bg-[#F8F9FC] dark:bg-[#0A0F1D] min-h-screen space-y-[20px] font-sans transition-colors duration-300">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-[20px]">
        <h1 className="text-[20px] font-bold text-[#101935] dark:text-white leading-tight tracking-tight">
          Today's Overview
        </h1>
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

      {/* Row 1: Key Statistics Cards */}
      <ReportsStatGrid />

      {/* Row 2: Revenue Trend & Bed/Ward Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[20px]">
        <div className="lg:col-span-8">
          <ReportsRevenueTrend />
        </div>
        <div className="lg:col-span-4">
          <ReportsBedWardOverview />
        </div>
      </div>

      {/* Row 3: Alerts and Recent Activity */}
      <ReportsAlertsActivity />

      {/* Row 4: Patients with Running Bills */}
      <ReportsRunningBills />
    </div>
  );
}
