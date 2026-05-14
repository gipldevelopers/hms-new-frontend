"use client";
import React from "react";
import { OverviewCards } from "./OverviewCards";
import { QuickLinks } from "./QuickLinks";
import { LiveTokenQueue } from "./LiveTokenQueue";
import { DispensingRevenue } from "./DispensingRevenue";
import { TopFastMovingItems } from "./TopFastMovingItems";
import { ActionNeeded } from "./ActionNeeded";

export function PharmacyDashboard() {
  return (
    <div className="p-4 sm:p-6 bg-[#F8F9FC] dark:bg-[#0A0F1D] min-h-screen space-y-[20px] font-sans transition-colors duration-300">
      <div className="flex justify-between items-center">
        <h1 className="text-[20px] font-bold text-[#1e293b] dark:text-white leading-tight tracking-tight">
          Today's Overview
        </h1>
      </div>

      {/* Top Row: Overview Cards */}
      <OverviewCards />

      {/* Main Grid: Left (Quick Links + Token Queue) | Right (Revenue + Items + Alerts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[20px]">
        {/* Left Column (Col 8) */}
        <div className="lg:col-span-8 flex flex-col gap-[20px]">
          <QuickLinks />
          <LiveTokenQueue />
        </div>

        {/* Right Column (Col 4) */}
        <div className="lg:col-span-4 flex flex-col gap-[20px]">
          <DispensingRevenue />
          <TopFastMovingItems />
          <ActionNeeded />
        </div>
      </div>
    </div>
  );
}
