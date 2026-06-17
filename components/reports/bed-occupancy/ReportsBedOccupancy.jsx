"use client";

import React, { useState, useEffect } from "react";
import { Printer, FileDown, Loader2, RefreshCw } from "lucide-react";
import { ReportsBedOccupancyStats } from "./ReportsBedOccupancyStats";
import { ReportsPerformanceMetrics } from "./ReportsPerformanceMetrics";
import { ReportsBedWardOverview } from "./ReportsBedWardOverview";
import { ReportsBedOccupancyAlerts } from "./ReportsBedOccupancyAlerts";
import { ReportsBedAllocations } from "./ReportsBedAllocations";

export default function ReportsBedOccupancy() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("authtoken");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wards/occupancy-analytics`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch analytics: ${response.statusText}`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error("Error fetching bed occupancy data:", err);
      setError(err.message || "Failed to load bed occupancy analytics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-[#F8F9FC] dark:bg-[#0A0F1D] font-sans">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-[14px] font-semibold text-gray-500 dark:text-slate-400">
            Analyzing live bed occupancy data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] bg-[#F8F9FC] dark:bg-[#0A0F1D] p-6 font-sans">
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 p-6 rounded-xl max-w-md w-full text-center">
          <h2 className="text-[16px] font-bold text-red-700 dark:text-red-400 mb-2">
            Failed to Load Analytics
          </h2>
          <p className="text-[13px] text-red-600/80 dark:text-red-400/80 mb-5">
            {error}
          </p>
          <button 
            onClick={fetchAnalytics} 
            className="flex items-center justify-center gap-2 mx-auto px-5 py-2.5 bg-primary hover:bg-primary/95 text-white rounded-lg text-[13px] font-semibold transition-all shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Connection</span>
          </button>
        </div>
      </div>
    );
  }

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
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 border border-[#E7E8EB] dark:border-white/10 rounded-lg text-[13px] font-semibold text-[#1e293b] dark:text-slate-300 bg-white dark:bg-[#101935] hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
          >
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
      <ReportsBedOccupancyStats stats={data?.stats} />

      {/* Row 2: Performance Metrics & Bed Ward Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[20px]">
        <div className="lg:col-span-8">
          <ReportsPerformanceMetrics metrics={data?.metrics} />
        </div>
        <div className="lg:col-span-4">
          <ReportsBedWardOverview wardOverview={data?.wardOverview} />
        </div>
      </div>

      {/* Row 3: Bed Occupancy Alerts & Actions */}
      <ReportsBedOccupancyAlerts 
        alerts={data?.alerts} 
        actions={data?.actions} 
        activity={data?.activity} 
      />

      {/* Row 4: Recent Bed Allocations Table */}
      <ReportsBedAllocations allocations={data?.liveBedStatus} />
    </div>
  );
}

