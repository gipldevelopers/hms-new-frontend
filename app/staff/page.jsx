"use client";

import React from "react";
import StaffStats from "@/components/staff/dashboard/StaffStats";
import LiveAlerts from "@/components/staff/dashboard/LiveAlerts";
import WardSnapshot from "@/components/staff/dashboard/WardSnapshot";
import MedicationsList from "@/components/staff/dashboard/MedicationsList";
import AdmissionDischarge from "@/components/staff/dashboard/AdmissionDischarge";
import StaffQuickLinks from "@/components/staff/dashboard/StaffQuickLinks";
import PendingTasks from "@/components/staff/dashboard/PendingTasks";

export default function StaffDashboard() {
  return (
    <div className="p-4 sm:p-5 bg-[#F8F9FA] dark:bg-[#0B1121] min-h-screen flex flex-col space-y-6 transition-colors duration-300 font-sans pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h1 className="text-[20px] font-bold text-[#1A1C23] dark:text-white tracking-tight leading-none">
          Staff Dashboard
        </h1>
      </div>

      {/* Stats Section */}
      <StaffStats />

      {/* Live Alerts Section */}
      <LiveAlerts />

      {/* Main Grid Section (Ward Snapshot & Medications) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
        {/* Ward Snapshot (Stacks on mobile, 2 cols on tablet, 3/4 on lg) */}
        <div className="md:col-span-2 lg:col-span-3">
          <WardSnapshot />
        </div>

        {/* Medications Due (Stacks on mobile, 2 cols on tablet, 1/4 on lg) */}
        <div className="md:col-span-2 lg:col-span-1">
          <MedicationsList />
        </div>
      </div>

      {/* Admission & Discharge Section (Full Width) */}
      <div className="w-full">
        <AdmissionDischarge />
      </div>

      {/* Bottom Section: Quick Links & Pending Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
        {/* Quick Links (Stacks on mobile, 2 cols on tablet, 3/4 on lg) */}
        <div className="md:col-span-2 lg:col-span-3">
          <StaffQuickLinks />
        </div>
        
        {/* Pending Tasks (Stacks on mobile, 2 cols on tablet, 1/4 on lg) */}
        <div className="md:col-span-2 lg:col-span-1">
          <PendingTasks />
        </div>
      </div>

    </div>
  );
}
