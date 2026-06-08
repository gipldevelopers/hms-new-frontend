"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import StaffStats from "@/components/staff/dashboard/StaffStats";
import LiveAlerts from "@/components/staff/dashboard/LiveAlerts";
import WardSnapshot from "@/components/staff/dashboard/WardSnapshot";
import MedicationsList from "@/components/staff/dashboard/MedicationsList";
import AdmissionDischarge from "@/components/staff/dashboard/AdmissionDischarge";
import StaffQuickLinks from "@/components/staff/dashboard/StaffQuickLinks";
import PendingTasks from "@/components/staff/dashboard/PendingTasks";
import CreatePurchaseRequest from "@/components/staff/dashboard/CreatePurchaseRequest";

export default function StaffDashboard() {
  const router = useRouter();
  const [showPurchaseRequest, setShowPurchaseRequest] = useState(false);

  if (showPurchaseRequest) {
    return <CreatePurchaseRequest onBack={() => setShowPurchaseRequest(false)} />;
  }

  return (
    <div className="p-4 sm:p-5 bg-background min-h-screen flex flex-col space-y-6 transition-colors duration-300 font-sans pb-20">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h1 className="text-[20px] font-bold text-foreground tracking-tight leading-none">
          Staff Dashboard
        </h1>
        <button
          type="button"
          onClick={() => setShowPurchaseRequest(true)}
          className="flex items-center gap-1.5 h-10 px-4 rounded-[5px] bg-[#2E37A4] hover:bg-[#232a7d] text-[13px] font-bold text-white transition-all cursor-pointer shadow-none"
        >
          <span className="text-[16px] font-medium leading-none">+</span> Create New Purchase Request
        </button>
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
