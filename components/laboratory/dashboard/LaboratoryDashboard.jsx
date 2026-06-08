"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { OverviewCards } from "./OverviewCards";
import { LiveOrderQueue } from "./LiveOrderQueue";
import { QuickLinks } from "./QuickLinks";
import { TestsByCategory } from "./TestsByCategory";
import { ActionNeeded } from "./ActionNeeded";
import { TechnicianWorkload } from "./TechnicianWorkload";
import CreatePurchaseRequest from "./CreatePurchaseRequest";

export function LaboratoryDashboard() {
  const router = useRouter();
  const [showPurchaseRequest, setShowPurchaseRequest] = useState(false);

  if (showPurchaseRequest) {
    return <CreatePurchaseRequest onBack={() => setShowPurchaseRequest(false)} />;
  }

  return (
    <div className="p-5 bg-background text-foreground min-h-screen space-y-[20px] font-sans transition-colors duration-300">
      <div className="flex justify-between items-center">
        <h1 className="text-[20px] font-bold text-foreground leading-tight tracking-tight">
          Today's Overview
        </h1>
        <button
          type="button"
          onClick={() => setShowPurchaseRequest(true)}
          className="flex items-center gap-1.5 h-10 px-4 rounded-[5px] bg-[#2E37A4] hover:bg-[#232a7d] text-[13px] font-bold text-white transition-all cursor-pointer shadow-none"
        >
          <span className="text-[16px] font-medium leading-none">+</span> Create New Purchase Request
        </button>
      </div>

      {/* Stats Overview */}
      <OverviewCards />

      {/* Main Grid - Upper Row (Live Order Queue, Quick Links, Action Needed) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[20px] items-stretch">
        {/* Left Column - Queue & Quick Links */}
        <div className="lg:col-span-8 flex flex-col gap-[20px] w-full">
          <LiveOrderQueue />
          <QuickLinks />
        </div>

        {/* Right Column - Alerts */}
        <div className="lg:col-span-4 flex w-full">
          <ActionNeeded />
        </div>
      </div>

      {/* Main Grid - Lower Row (Tests by Category, Technician Workload) - 50% each */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[20px] items-stretch">
        {/* Left Column - Tests by Category */}
        <div className="lg:col-span-6 flex w-full">
          <TestsByCategory />
        </div>

        {/* Right Column - Technician Workload */}
        <div className="lg:col-span-6 flex w-full">
          <TechnicianWorkload />
        </div>
      </div>
    </div>
  );
}
