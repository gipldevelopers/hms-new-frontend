"use client";

import React from "react";
import { AdminHeader } from "@/components/super-admin/dashboard/AdminHeader";
import { StatGrid } from "@/components/super-admin/dashboard/StatGrid";
import { RevenueTrend } from "@/components/super-admin/dashboard/RevenueTrend";
import { BranchPerformance } from "@/components/super-admin/dashboard/BranchPerformance";
import { QuickLinks } from "@/components/super-admin/dashboard/QuickLinks";
import { BranchDistribution } from "@/components/super-admin/dashboard/BranchDistribution";
import { SystemAlerts } from "@/components/super-admin/dashboard/SystemAlerts";
import { RecentActivity } from "@/components/super-admin/dashboard/RecentActivity";
import { UserGrowth } from "@/components/super-admin/dashboard/UserGrowth";
import { OccupancyByBranch } from "@/components/super-admin/dashboard/OccupancyByBranch";
import { RecentUsers } from "@/components/super-admin/dashboard/RecentUsers";

export default function AdminDashboard() {
  return (
    <div className="p-6 bg-[#F8F9FC] dark:bg-[#0A0F1D] min-h-screen space-y-[20px] font-sans transition-colors duration-300">
      <AdminHeader />
      
      <StatGrid />

      {/* Main Grid: Revenue & Branch Performance Alignment */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[20px]">
        <div className="lg:col-span-8 flex flex-col gap-[20px]">
          <RevenueTrend />
          <QuickLinks />
        </div>
        <div className="lg:col-span-4">
          <BranchPerformance />
        </div>
      </div>

      {/* Distribution, Alerts & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[20px]">
        <BranchDistribution />
        <SystemAlerts />
        <RecentActivity />
      </div>

      {/* Growth & Occupancy Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[20px]">
        <UserGrowth />
        <OccupancyByBranch />
      </div>

      {/* Recent Users Table */}
      <RecentUsers />
    </div>
  );
}