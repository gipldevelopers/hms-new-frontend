"use client";
import React from "react";
import { OverviewCards } from "./OverviewCards";
import { QuickLinks } from "./QuickLinks";
import { RecentInvoices } from "./RecentInvoices";
import { BillingRevenue } from "./BillingRevenue";
import { TopBillingCategories } from "./TopBillingCategories";
import { ActionNeeded } from "./ActionNeeded";

export function FinanceDashboard() {
  return (
    <div className="p-4 sm:p-6 bg-[#F8F9FC] dark:bg-[#0A0F1D] min-h-screen space-y-[20px] font-sans transition-colors duration-300">
      <div className="flex justify-between items-center">
        <h1 className="text-[20px] font-bold text-[#1e293b] dark:text-white leading-tight tracking-tight">
          Today's Overview
        </h1>
      </div>

      {/* Top Row: Overview Cards */}
      <OverviewCards />

      {/* Main Grid: Left (Quick Links + Recent Invoices) | Right (Revenue + Categories + Alerts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[20px]">
        {/* Left Column (Col 8) */}
        <div className="lg:col-span-8 flex flex-col gap-[20px]">
          <QuickLinks />
          <RecentInvoices />
        </div>

        {/* Right Column (Col 4) */}
        <div className="lg:col-span-4 flex flex-col gap-[20px]">
          <BillingRevenue />
          <TopBillingCategories />
          <ActionNeeded />
        </div>
      </div>
    </div>
  );
}
