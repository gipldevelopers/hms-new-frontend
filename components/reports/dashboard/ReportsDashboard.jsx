"use client";

import React, { useState, useEffect } from "react";
import { Printer, FileDown } from "lucide-react";
import { ReportsStatGrid } from "./ReportsStatGrid";
import { ReportsRevenueTrend } from "./ReportsRevenueTrend";
import { ReportsBedWardOverview } from "./ReportsBedWardOverview";
import { ReportsAlertsActivity } from "./ReportsAlertsActivity";
import { ReportsRunningBills } from "./ReportsRunningBills";
import { API_URL } from "@/lib/api";

function getAuthHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("authtoken") : "";
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export default function ReportsDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`${API_URL}/reports/dashboard`, {
          headers: getAuthHeaders(),
        });
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, message: ${text}`);
        }
        const result = await response.json();
        setData(result?.data);
      } catch (error) {
        console.error("Error fetching reports dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-[#F8F9FC] dark:bg-[#0A0F1D] min-h-screen flex justify-center items-center font-sans">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
      <ReportsStatGrid stats={data?.stats} />

      {/* Row 2: Revenue Trend & Bed/Ward Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[20px]">
        <div className="lg:col-span-8">
          <ReportsRevenueTrend />
        </div>
        <div className="lg:col-span-4">
          <ReportsBedWardOverview wardOverview={data?.wardOverview} />
        </div>
      </div>

      {/* Row 3: Alerts and Recent Activity */}
      <ReportsAlertsActivity alerts={data?.alerts} recentActivity={data?.recentActivity} actionsNeeded={[]} />

      {/* Row 4: Patients with Running Bills */}
      <ReportsRunningBills bills={data?.runningBills} />
    </div>
  );
}
