"use client";

import React from "react";
import { ChevronDown } from "lucide-react";

// Modular Analytics Component
import AnalyticsStats from "@/components/super-admin/analytics/AnalyticsStats";
import KeyMetrics from "@/components/super-admin/analytics/KeyMetrics";
import RevenueTrend from "@/components/super-admin/analytics/RevenueTrend";
import OccupancyRates from "@/components/super-admin/analytics/OccupancyRates";
import PatientAppointments from "@/components/super-admin/analytics/PatientAppointments";
import BranchRevenue from "@/components/super-admin/analytics/BranchRevenue";
import DepartmentDistribution from "@/components/super-admin/analytics/DepartmentDistribution";
import PerformanceMetrics from "@/components/super-admin/analytics/PerformanceMetrics";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AnalyticsPage() {
  return (
    <div className="p-4 sm:p-6 bg-[#F8F9FC] dark:bg-[#0A0F1D] min-h-screen space-y-[20px] font-sans transition-colors duration-300">
      
      {/* Analytics Header - Responsive Registry */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-[20px]">
        <div>
          <h1 className="text-[20px] font-bold text-[#1e293b] dark:text-white">Analytics Dashboard</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <button className="flex-1 sm:flex-none flex items-center justify-center sm:justify-start h-[40px] px-4 rounded-[5px] bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 text-[12px] font-bold text-[#64748B] dark:text-white transition-all outline-none focus:ring-2 focus:ring-primary/20">
                Last Month <ChevronDown className="w-4 h-4 ml-2 text-gray-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px] bg-white dark:bg-[#101935] border-[#E7E8EB] dark:border-white/10 p-1">
              <DropdownMenuItem className="text-[12px] font-medium cursor-pointer rounded-[5px]">Last week</DropdownMenuItem>
              <DropdownMenuItem className="text-[12px] font-medium cursor-pointer rounded-[5px]">Last Month</DropdownMenuItem>
              <DropdownMenuItem className="text-[12px] font-medium cursor-pointer rounded-[5px]">Last 6 Months</DropdownMenuItem>
              <DropdownMenuItem className="text-[12px] font-medium cursor-pointer rounded-[5px]">Last Year</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <button className="flex-1 sm:flex-none flex items-center justify-center sm:justify-start h-[40px] px-4 rounded-[5px] bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 text-[12px] font-bold text-[#64748B] dark:text-white transition-all outline-none focus:ring-2 focus:ring-primary/20">
                Export Report 
                <ChevronDown className="w-4 h-4 ml-2 text-gray-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px] bg-white dark:bg-[#101935] border-[#E7E8EB] dark:border-white/10 p-1">
              <DropdownMenuItem className="text-[12px] font-medium cursor-pointer rounded-[5px]">Export as PDF</DropdownMenuItem>
              <DropdownMenuItem className="text-[12px] font-medium cursor-pointer rounded-[5px]">Export as Excel</DropdownMenuItem>
              <DropdownMenuItem className="text-[12px] font-medium cursor-pointer rounded-[5px]">Export as CSV</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Row 1: Primary Statistics (StatGrid Slot) */}
      <AnalyticsStats />

      {/* Row 2 & 3: Revenue & Occupancy (8/4 split with Nested Content) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[20px]">
        <div className="lg:col-span-8 flex flex-col gap-[20px]">
          <KeyMetrics /> {/* KeyMetrics on Top */}
          <RevenueTrend /> {/* RevenueTrend on Bottom */}
        </div>
        <div className="lg:col-span-4">
          <OccupancyRates />
        </div>
      </div>

      {/* Row 4: Primary Clinical & Distribution Matrix (Dual Column) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[20px]">
        <PatientAppointments /> {/* Swapped: Was on bottom left */}
        <BranchRevenue />       {/* Swapped: Was on bottom right */}
      </div>

      {/* Row 5: Detailed Analysis & Efficiency (Dual Column) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[20px]">
        <DepartmentDistribution /> {/* Swapped: Was on top left */}
        <PerformanceMetrics />      {/* Swapped: Was on top right */}
      </div>
    </div>
  );
}
