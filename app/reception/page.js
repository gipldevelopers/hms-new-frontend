"use client";

import React from "react";
import ReceptionStats from "@/components/reception/dashboard/ReceptionStats";
import ReceptionQuickLinks from "@/components/reception/dashboard/ReceptionQuickLinks";
import RevenueOverview from "@/components/reception/dashboard/RevenueOverview";
import LiveTokenQueue from "@/components/reception/dashboard/LiveTokenQueue";
import ActionNeeded from "@/components/reception/dashboard/ActionNeeded";
import TodayAppointments from "@/components/reception/dashboard/TodayAppointments";
import BedOccupancy from "@/components/reception/dashboard/BedOccupancy";

export default function ReceptionDashboard() {
  return (
    <div className="p-4 md:p-5 bg-background min-h-screen flex flex-col gap-5 md:gap-6 transition-colors duration-300 font-sans pb-20">
      
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h1 className="text-[20px] font-bold text-foreground tracking-tight leading-none">
          Today's Overview
        </h1>
      </div>

      {/* Stats Row (Full Width) */}
      <ReceptionStats />

      {/* Primary Grid Row: Quick Links, Queue, Revenue, Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 items-stretch">
        
        {/* Left Column (Quick Links + Live Queue) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <ReceptionQuickLinks />
          <LiveTokenQueue />
        </div>

        {/* Right Column (Revenue + Action Needed) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <RevenueOverview />
          <ActionNeeded />
        </div>
      </div>

      {/* Today's Appointments (Full Width) */}
      <TodayAppointments />

      {/* Bed Occupancy (Full Width) */}
      <BedOccupancy />

    </div>
  );
}
