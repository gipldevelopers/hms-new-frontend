"use client";

import React, { useState, useEffect } from "react";
import ReportsStatCard from "./ReportsStatCard";
import MonthlyStockConsumptionChart from "./MonthlyStockConsumptionChart";
import TopUsageDepts from "./TopUsageDepts";
import ReportsTable from "./ReportsTable";
import ResourceAllocation from "./ResourceAllocation";
import { CalendarCheck, UserPlus, Activity, FileText } from "lucide-react";
import { API_URL } from "@/lib/api";

export function ReportsDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authtoken");
        const userStr = localStorage.getItem("user");
        if (!token || !userStr) {
          setLoading(false);
          return;
        }
        const user = JSON.parse(userStr);
        const branchId = user.branchId;

        const res = await fetch(`${API_URL}/inventory-reports/stats?branchId=${branchId}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch reports statistics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReportsData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <span className="text-[14px] font-bold text-slate-400">Loading reports & analytics...</span>
      </div>
    );
  }

  const stats = data?.stats || {
    totalInventoryValue: "₹0",
    totalItemsTracked: "0",
    newStockReceived: "0",
    lowStockAlerts: "0"
  };

  return (
    <div id="printable-reports-area" className="flex-1 p-6 bg-slate-50/50 dark:bg-slate-900/20 max-w-[1600px] mx-auto min-h-screen space-y-[20px] font-sans transition-colors duration-300">
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          /* Force browser to print background colors and styling */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          /* Hide sidebar, header, overlay, and buttons */
          aside,
          header,
          .no-print,
          button,
          .fixed.inset-y-0.left-0 {
            display: none !important;
          }

          /* Reset height and overflow restrictions only on the core layout wrappers */
          html, body, #__next {
            height: auto !important;
            min-height: auto !important;
            overflow: visible !important;
            background: white !important;
            color: black !important;
          }

          /* Reset height and overflow constraints on specific layout ancestors */
          .flex.h-screen.w-full,
          .flex.flex-col.flex-1.min-w-0.h-full,
          main.flex-1,
          .w-full.min-h-full {
            height: auto !important;
            min-height: auto !important;
            overflow: visible !important;
            position: static !important;
            background: transparent !important;
          }

          /* Force container to match printable boundaries */
          #printable-reports-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            color: #000000 !important;
            box-shadow: none !important;
            border: none !important;
          }

          /* Preserve grid layout inside the report area */
          #printable-reports-area .grid {
            display: grid !important;
            gap: 16px !important;
          }

          /* Keep stats cards on one row in landscape */
          #printable-reports-area > div.grid-cols-1.md\\:grid-cols-4 {
            grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
          }

          /* Keep charts and allocations in their grid positions */
          #printable-reports-area > div.lg\\:grid-cols-3 {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          }

          #printable-reports-area .lg\\:col-span-2 {
            grid-column: span 2 / span 2 !important;
          }

          #printable-reports-area .lg\\:col-span-1 {
            grid-column: span 1 / span 1 !important;
          }

          /* Ensure custom chart bar container has fixed height during printing */
          #printable-reports-area .h-\\[180px\\] {
            height: 180px !important;
          }

          /* Ensure progress ring parent maintains layout bounds */
          #printable-reports-area .w-32 {
            width: 8rem !important;
          }
          #printable-reports-area .h-32 {
            height: 8rem !important;
          }

          /* Prevent cards and table rows from splitting awkwardly */
          #printable-reports-area .grid > div,
          #printable-reports-area table,
          #printable-reports-area tr {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          /* Force white background and black text on all text tags */
          #printable-reports-area h1,
          #printable-reports-area h2,
          #printable-reports-area h3,
          #printable-reports-area p,
          #printable-reports-area span,
          #printable-reports-area td,
          #printable-reports-area th {
            color: #000000 !important;
          }

          @page {
            size: A4 landscape;
            margin: 10mm;
          }
        }
      `}} />

      {/* Top Header Row */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-[22px] font-bold text-slate-800 dark:text-white leading-none tracking-tight mt-2">
            Reports & Analytics
          </h1>
        </div>
 
        {/* Action Buttons */}
        <div className="flex items-center gap-3 no-print">
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
            onClick={() => window.print()}
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
          value={stats.totalInventoryValue}
          change="+18% from last month"
          isPositive={true}
          isDollarText={true}
          iconBg="bg-[#E6FBF4] dark:bg-emerald-950/20"
          iconColor="text-[#10B981]"
        />

        {/* Total Items Tracked */}
        <ReportsStatCard
          title="Total Items Tracked"
          value={stats.totalItemsTracked}
          change="+5% from last month"
          isPositive={true}
          icon={CalendarCheck}
          iconBg="bg-[#EEF2FF] dark:bg-indigo-950/20"
          iconColor="text-[#6366F1]"
        />

        {/* New Stock Received */}
        <ReportsStatCard
          title="New Stock Received"
          value={stats.newStockReceived}
          change="+12% from last month"
          isPositive={true}
          icon={UserPlus}
          iconBg="bg-[#F5F3FF] dark:bg-violet-950/20"
          iconColor="text-[#8B5CF6]"
        />

        {/* Low Stock Alerts */}
        <ReportsStatCard
          title="Low Stock Alerts"
          value={String(stats.lowStockAlerts)}
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
          <MonthlyStockConsumptionChart data={data?.chartData} />
        </div>
        <div className="lg:col-span-1 flex flex-col h-full">
          <TopUsageDepts data={data?.deptsData} />
        </div>
      </div>

      {/* Bottom Row (Low Stock Alert List & Resource Allocation) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2 flex flex-col h-full">
          <ReportsTable alerts={data?.alerts} lowStockCount={stats.lowStockAlerts} />
        </div>
        <div className="lg:col-span-1 flex flex-col h-full">
          <ResourceAllocation data={data?.allocationData} />
        </div>
      </div>
    </div>
  );
}

export default ReportsDashboard;
