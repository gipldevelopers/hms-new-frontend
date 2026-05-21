"use client";
import React from "react";

export function BillingRevenue() {
  return (
    <div className="bg-white dark:bg-[#1e293b] p-6 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155]">
      <h2 className="text-[16px] font-bold text-[#1e293b] dark:text-white mb-6">Collections & Revenue</h2>
      
      <div className="space-y-6">
        <div>
          <p className="text-[13px] font-medium text-[#64748b] dark:text-[#94a3b8] mb-1">Collected Today</p>
          <h3 className="text-[24px] sm:text-[32px] font-bold text-[#1e293b] dark:text-white leading-tight">₹1,24,500</h3>
        </div>

        <div className="space-y-2 pt-2">
          <div className="flex justify-between items-end">
            <p className="text-[12px] font-bold text-[#64748b] dark:text-[#94a3b8]">Pending Payments</p>
            <span className="text-[12px] font-bold text-[#ef4444]">₹24,500</span>
          </div>
          <div className="h-2 w-full bg-[#f1f5f9] dark:bg-[#334155] rounded-full overflow-hidden">
            <div className="h-full bg-[#ef4444] rounded-full" style={{ width: '16.5%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
