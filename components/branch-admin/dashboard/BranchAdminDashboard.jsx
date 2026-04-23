"use client";

import React from "react";
import { StatCards } from "./StatCards";
import { RevenueGrowth } from "./RevenueGrowth";
import { AdmissionsDischarges } from "./AdmissionsDischarges";
import { LiveBedStatus } from "./LiveBedStatus";
import { DoctorStatus } from "./DoctorStatus";
import { RevenueTrend } from "./RevenueTrend";
import { QuickLinks } from "./QuickLinks";
import { PatientActivity } from "./PatientActivity";
import { OTSchedule } from "./OTSchedule";
import { RecentActivity } from "./RecentActivity";

export default function BranchAdminDashboard() {
  return (
    <div className="p-6 bg-[#F8F9FC] dark:bg-[#0A0F1D] min-h-screen space-y-[20px] font-sans">
      <div className="flex justify-between items-center mb-[20px]">
        <h1 className="text-[20px] font-bold text-[#1e293b] dark:text-white">
          Branch Admin Dashboard
        </h1>
      </div>
      {/* Top Stats */}
      <StatCards />

      {/* Row 2: Revenue Growth & Admissions vs Discharges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[20px]">
        <div className="lg:col-span-7">
          <RevenueGrowth />
        </div>
        <div className="lg:col-span-5">
          <AdmissionsDischarges />
        </div>
      </div>

      {/* Row 3: Live Bed Status & Doctor Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[20px]">
        <div className="lg:col-span-7">
          <LiveBedStatus />
        </div>
        <div className="lg:col-span-5">
          <DoctorStatus />
        </div>
      </div>

      {/* Row 4: Revenue Trend */}
      <div className="grid grid-cols-1">
        <RevenueTrend />
      </div>

      {/* Row 5: Quick Links */}
      <div className="grid grid-cols-1">
        <QuickLinks />
      </div>

      {/* Row 6: Today's Patient Activity */}
      <div className="grid grid-cols-1">
        <PatientActivity />
      </div>

      {/* Row 7: OT Schedule & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[20px]">
        <div className="lg:col-span-7">
          <OTSchedule />
        </div>
        <div className="lg:col-span-5">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
