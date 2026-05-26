"use client";

import React from "react";
import { Printer, FileDown } from "lucide-react";
import { ReportsFinancialTopCards } from "./ReportsFinancialTopCards";
import { ReportsFinancialStats } from "./ReportsFinancialStats";
import { ReportsFinancialAlerts } from "./ReportsFinancialAlerts";
import { ReportsFinancialChartsGrid } from "./ReportsFinancialChartsGrid";
import { ReportsFinancialDeptExpenses } from "./ReportsFinancialDeptExpenses";
import { ReportsFinancialTransactions } from "./ReportsFinancialTransactions";

export default function ReportsFinancialInsights() {
  return (
    <div className="p-4 md:p-6 bg-[#F8F9FC] dark:bg-[#0A0F1D] min-h-screen space-y-[20px] font-sans transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-[16px]">
        <div className="flex flex-col gap-1">
          <h1 className="text-[20px] font-bold text-[#1E293B] dark:text-white leading-tight tracking-tight">
            Financial Insights
          </h1>
          <p className="text-[13px] text-gray-400 dark:text-slate-500 font-medium">
            Hospital revenue analytics & financial performance monitoring
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#E7E8EB] dark:border-white/10 rounded-lg text-[13px] font-semibold text-[#1E293B] dark:text-slate-300 bg-white dark:bg-[#101935] hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg text-[13px] font-semibold text-white transition-all shadow-sm">
            <FileDown className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Row 1: Simple Top Indicator Cards */}
      <ReportsFinancialTopCards />

      {/* Row 2: Stats cards with sparklines */}
      <ReportsFinancialStats />

      {/* Row 3: Horizontal scrollable Live Alerts pills */}
      <ReportsFinancialAlerts />

      {/* Row 4: Revenue Trend stacked bar chart & Payment Mode / Insurance status cards */}
      <ReportsFinancialChartsGrid />

      {/* Row 5: Department revenue comparison & Cost analytics cost segment */}
      <ReportsFinancialDeptExpenses />

      {/* Row 6: Financial Transaction Registry */}
      <ReportsFinancialTransactions />
    </div>
  );
}
