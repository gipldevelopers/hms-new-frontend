"use client";

import React from "react";
import ReportsStatCard from "./ReportsStatCard";
import MonthlyStockConsumptionChart from "./MonthlyStockConsumptionChart";
import TopUsageDepts from "./TopUsageDepts";
import ReportsTable from "./ReportsTable";
import ResourceAllocation from "./ResourceAllocation";
import { CalendarCheck, UserPlus, Activity, FileText } from "lucide-react";

export function ReportsDashboard() {
  return (
    <div className="flex-1 p-6 bg-slate-50/50 dark:bg-slate-900/20 max-w-[1600px] mx-auto min-h-screen space-y-[20px] font-sans transition-colors duration-300">
      {/* Top Header Row */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-[22px] font-bold text-slate-800 dark:text-white leading-none tracking-tight mt-2">
            Reports & Analytics
          </h1>

        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Print Button */}
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 h-10 px-4 rounded-[4px] border border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1e293b] text-[12px] font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2m-2-4v6H8v-6" />
            </svg>
            Print
          </button>

          {/* Export PDF Button */}
          <button
            type="button"
            className="flex items-center gap-2 h-10 px-4 rounded-[4px] bg-[#2E37A4] hover:bg-[#232a7d] text-[12px] font-bold text-white transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Grid for Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Inventory Value */}
        <ReportsStatCard
          title="Total Inventory Value"
          value="₹124,500"
          change="+18% from last month"
          isPositive={true}
          isDollarText={true}
          iconBg="bg-[#E6FBF4] dark:bg-emerald-950/20"
          iconColor="text-[#10B981]"
        />

        {/* Total Items Tracked */}
        <ReportsStatCard
          title="Total Items Tracked"
          value="3,842"
          change="+5% from last month"
          isPositive={true}
          icon={CalendarCheck}
          iconBg="bg-[#EEF2FF] dark:bg-indigo-950/20"
          iconColor="text-[#6366F1]"
        />

        {/* New Stock Recieved */}
        <ReportsStatCard
          title="New Stock Recieved"
          value="1,248"
          change="+12% from last month"
          isPositive={true}
          icon={UserPlus}
          iconBg="bg-[#F5F3FF] dark:bg-violet-950/20"
          iconColor="text-[#8B5CF6]"
        />

        {/* Low Stock Alerts */}
        <ReportsStatCard
          title="Low Stock Alerts"
          value="156"
          change="-2% from last month"
          isPositive={false}
          icon={Activity}
          iconBg="bg-[#FFF1F2] dark:bg-rose-950/20"
          iconColor="text-[#F43F5E]"
        />
      </div>

      {/* Middle Row (Monthly Consumption & Top Usage Depts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2 flex flex-col h-full">
          <MonthlyStockConsumptionChart />
        </div>
        <div className="lg:col-span-1 flex flex-col h-full">
          <TopUsageDepts />
        </div>
      </div>

      {/* Bottom Row (Low Stock Alert List & Resource Allocation) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2 flex flex-col h-full">
          <ReportsTable />
        </div>
        <div className="lg:col-span-1 flex flex-col h-full">
          <ResourceAllocation />
        </div>
      </div>
    </div>
  );
}

export default ReportsDashboard;
