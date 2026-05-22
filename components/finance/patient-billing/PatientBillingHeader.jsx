"use client";

import React from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function PatientBillingHeader({ activeTab, setActiveTab, onGenerateBill }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-[20px] font-bold text-[#1e293b] dark:text-white tracking-tight font-inter">Patient Billing</h1>

        <button
          onClick={onGenerateBill}
          className="h-9 px-4 py-5 flex items-center justify-center gap-1.5 bg-[#2E37A4] dark:bg-primary rounded-[5px] text-[13px] font-medium text-white hover:bg-[#2E37A4]/90 transition-all font-inter"
        >
          <Plus className="w-4 h-4" />
          Generate Bills
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center border border-border rounded-lg w-fit bg-muted/30">
        <button
          onClick={() => setActiveTab("ipd")}
          className={cn(
            "px-3 sm:px-6 py-2 text-[14px] sm:text-[16px] font-regular transition-all rounded-lg font-inter",
            activeTab === "ipd"
              ? "bg-[#2E37A4] text-white"
              : "text-[#2E37A4] hover:bg-muted dark:hover:bg-white/5"
          )}
        >
          IPD Running Bills
        </button>
        <button
          onClick={() => setActiveTab("opd")}
          className={cn(
            "px-3 sm:px-6 py-2 text-[14px] sm:text-[16px] font-regular transition-all rounded-lg font-inter",
            activeTab === "opd"
              ? "bg-[#2E37A4] text-white"
              : "text-[#2E37A4] hover:bg-muted dark:hover:bg-white/5"
          )}
        >
          OPD Billing
        </button>
      </div>
    </div>
  );
}
