"use client";

import React from "react";
import { Printer, FileDown } from "lucide-react";
import { ReportsOTStats } from "./ReportsOTStats";
import { ReportsOTAlerts } from "./ReportsOTAlerts";
import { ReportsOTScheduleBoard } from "./ReportsOTScheduleBoard";
import { ReportsOTSurgeryTable } from "./ReportsOTSurgeryTable";

export default function ReportsOTUtilization() {
  return (
    <div className="p-4 md:p-6 bg-[#F8F9FC] dark:bg-[#0A0F1D] min-h-screen space-y-[20px] font-sans transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-[16px]">
        <div className="flex flex-col gap-1">
          <h1 className="text-[20px] font-bold text-[#1e293b] dark:text-white leading-tight tracking-tight">
            OT Utilization
          </h1>
          <p className="text-[13px] text-gray-400 dark:text-slate-500 font-medium">
            Hospital quality metrics & clinical performance monitoring
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
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

      {/* Row 1: Key Metrics Stats */}
      <ReportsOTStats />

      {/* Row 2: Cancellation/Emergency cards & Live Alerts pills */}
      <ReportsOTAlerts />

      {/* Row 3: Schedule Board & Room Status & Efficiency score */}
      <ReportsOTScheduleBoard />

      {/* Row 4: Surgery Operation Table */}
      <ReportsOTSurgeryTable />
    </div>
  );
}
