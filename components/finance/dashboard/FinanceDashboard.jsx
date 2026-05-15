"use client";

import React from "react";
import { FinanceStatGrid } from "./FinanceStatGrid";
import { FinanceQuickLinks } from "./FinanceQuickLinks";
import { PendingPayments } from "./PendingPayments";
import { FinanceRevenueTrend } from "./FinanceRevenueTrend";
import { FinanceActionNeeded } from "./FinanceActionNeeded";
import { PatientsWithRunningBills } from "./PatientsWithRunningBills";

export default function FinanceDashboard() {
  return (
    <div className="p-6 bg-[#F8F9FC] dark:bg-[#0A0F1D] min-h-screen space-y-[20px] font-sans transition-colors duration-300">
      <div className="flex justify-between items-center mb-[20px]">
        <h1 className="text-[20px] font-bold text-[#1e293b] dark:text-white leading-tight tracking-tight">
          Today's Overview
        </h1>
      </div>

      <FinanceStatGrid />
      {/* Finance Specific Row: Quick Links & Pending Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[20px]">
        <div className="lg:col-span-8">
          <FinanceQuickLinks />
        </div>
        <div className="lg:col-span-4">
          <PendingPayments />
        </div>
      </div>

      {/* Row 3: Revenue Trend & Action Needed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[20px]">
        <div className="lg:col-span-8">
          <FinanceRevenueTrend />
        </div>
        <div className="lg:col-span-4">
          <FinanceActionNeeded />
        </div>
      </div>

      {/* Row 4: Patients with Running Bills */}
      <PatientsWithRunningBills />
    </div>
  );
}
