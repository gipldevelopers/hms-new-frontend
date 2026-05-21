"use client";
import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export function TopBillingCategories() {
  const items = [
    { rank: 1, name: "OPD Consultations", qty: 420, trend: "up" },
    { rank: 2, name: "Diagnostic & Lab Scans", qty: 310, trend: "up" },
    { rank: 3, name: "Inpatient Room Charges", qty: 240, trend: "down" },
    { rank: 4, name: "Pharmacy Billing Share", qty: 185, trend: "up" },
    { rank: 5, name: "ICU Special Services", qty: 95, trend: "stable" },
  ];

  return (
    <div className="bg-white dark:bg-[#1e293b] p-6 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[16px] font-bold text-[#1e293b] dark:text-white">Top Billing Departments</h2>
        <select className="text-[12px] font-bold border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] px-2 py-1 bg-transparent text-foreground">
          <option>Today</option>
          <option>This Week</option>
        </select>
      </div>

      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-[13px] font-bold text-[#64748b] dark:text-[#94a3b8] w-4">{item.rank}.</span>
              <span className="text-[13px] font-bold text-[#1e293b] dark:text-white">{item.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[13px] font-bold text-[#1e293b] dark:text-white">{item.qty}</span>
              {item.trend === "up" && <TrendingUp size={14} className="text-[#22c55e]" />}
              {item.trend === "down" && <TrendingDown size={14} className="text-[#ef4444]" />}
              {item.trend === "stable" && <Minus size={14} className="text-[#64748b]" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
