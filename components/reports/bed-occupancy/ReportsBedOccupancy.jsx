"use client";

import React from "react";
import { Printer, FileDown } from "lucide-react";
import { ReportsBedOccupancyStats } from "./ReportsBedOccupancyStats";
import { ReportsPerformanceMetrics } from "./ReportsPerformanceMetrics";
import { ReportsBedWardOverview } from "./ReportsBedWardOverview";
import { ReportsBedOccupancyAlerts } from "./ReportsBedOccupancyAlerts";
import { ReportsBedAllocations } from "./ReportsBedAllocations";

export default function ReportsBedOccupancy() {
  return (
    <div className="p-6 bg-[#F8F9FC] dark:bg-[#0A0F1D] min-h-screen space-y-[20px] font-sans transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-[20px]">
        <div>
          <h1 className="text-[20px] font-bold text-[#101935] dark:text-white leading-tight tracking-tight">
            Bed Occupancy Analytics
          </h1>

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

      {/* Row 1: Key Capacity Stat Cards */}
      <ReportsBedOccupancyStats />

      {/* Row 2: Performance Metrics & Bed Ward Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[20px]">
        <div className="lg:col-span-8">
          <ReportsPerformanceMetrics />
        </div>
        <div className="lg:col-span-4">
          <ReportsBedWardOverview />
        </div>
      </div>

      {/* Row 3: Bed Occupancy Alerts & Actions */}
      <ReportsBedOccupancyAlerts />

      {/* Row 4: Recent Bed Allocations Table */}
      <ReportsBedAllocations />
    </div>
  );
}
