"use client";

import React from "react";
import { Printer, FileDown } from "lucide-react";
import { ReportsClinicalKPIStats } from "./ReportsClinicalKPIStats";
import { ReportsClinicalKPIOverview } from "./ReportsClinicalKPIOverview";
import { ReportsClinicalKPIList } from "./ReportsClinicalKPIList";

export default function ReportsClinicalKPI() {
  return (
    <div className="p-6 bg-[#F8F9FC] dark:bg-[#0A0F1D] min-h-screen space-y-[20px] font-sans transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-[16px]">
        <div className="flex flex-col gap-1">
          <h1 className="text-[20px] font-bold text-[#1e293b] dark:text-white leading-tight tracking-tight">
            Clinical KPI Dashboard
          </h1>
          <p className="text-[13px] text-gray-400 dark:text-slate-500 font-medium">
            Hospital quality metrics & clinical performance monitoring
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

      {/* Row 1: Key Metrics Grid */}
      <ReportsClinicalKPIStats />

      {/* Row 2: Quality Indicators & Compliance Columns */}
      <ReportsClinicalKPIOverview />

      {/* Row 3: Live Clinical Quality Audit Registry */}
      <ReportsClinicalKPIList />
    </div>
  );
}
