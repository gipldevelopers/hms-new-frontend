"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const ALERTS_DATA = [
  {
    name: "Amoxicillin 500mg",
    department: "Pharmacy",
    status: "CRITICAL",
    unitsLeft: 12,
  },
  {
    name: "Surgical Gloves (M)",
    department: "Surgical Unit",
    status: "REORDER SOON",
    unitsLeft: 45,
  },
  {
    name: "Oxygen Adult Mask",
    department: "Respiratory",
    status: "CRITICAL",
    unitsLeft: 5,
  },
  {
    name: "Saline IV 500ml",
    department: "General Ward",
    status: "ORDERED",
    unitsLeft: 200,
  }
];

export function ReportsTable({ alerts = [], lowStockCount = 0 }) {
  const router = useRouter();
  const displayAlerts = alerts.length > 0 ? alerts : ALERTS_DATA;
  const countText = lowStockCount > 0 ? `${lowStockCount} Items Critical` : "15 Items Critical";

  return (
    <div className="bg-white dark:bg-[#1e293b] py-6 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] shadow-none flex flex-col h-full">
      {/* Header section */}
      <div className="flex justify-between items-center mb-5 px-6">
        <div className="flex items-center gap-2.5">
          <h2 className="text-[15px] font-extrabold text-slate-800 dark:text-white">
            Low Stock Alert List
          </h2>
          <span className="px-2 py-0.5 rounded-[4px] bg-red-55 text-red-600 dark:bg-red-950/20 dark:text-red-400 text-[10px] font-black uppercase tracking-wider">
            {countText}
          </span>
        </div>
        <button
          type="button"
          onClick={() => router.push("/hospital-inventory/stock/stock-inventory")}
          className="text-[12px] font-extrabold text-[#2E37A4] hover:underline cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Table Element wrapper */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full border-collapse text-left text-[12.5px]">
          <thead>
            <tr className="bg-[#F8F9FC] dark:bg-[#101935] border-t border-b border-[#e2e8f0] dark:border-[#334155]">
              <th className="pl-6 pr-4 py-3.5 text-[10px] font-bold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider">Item Name</th>
              <th className="px-4 py-3.5 text-[10px] font-bold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider">Department</th>
              <th className="px-4 py-3.5 text-[10px] font-bold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider">Status</th>
              <th className="pl-4 pr-6 py-3.5 text-[10px] font-bold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider text-right">Units Left</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e2e8f0] dark:divide-[#334155]">
            {displayAlerts.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-all">
                <td className="pl-6 pr-4 py-4 font-bold text-slate-800 dark:text-white">
                  {item.name}
                </td>
                <td className="px-4 py-4 text-slate-500 dark:text-slate-400 font-medium">
                  {item.department}
                </td>
                <td className="px-4 py-4">
                  <span className={cn(
                    "px-2 py-0.5 rounded-[4px] text-[9.5px] font-black uppercase tracking-wide",
                    item.status === "CRITICAL"
                      ? "bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400"
                      : item.status === "REORDER SOON"
                      ? "bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400"
                      : "bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400"
                  )}>
                    {item.status}
                  </span>
                </td>
                <td className={cn(
                  "pl-4 pr-6 py-4 text-right font-extrabold text-[13px]",
                  item.status === "CRITICAL"
                    ? "text-red-500"
                    : item.status === "REORDER SOON"
                    ? "text-amber-500"
                    : "text-blue-500"
                )}>
                  {item.unitsLeft}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReportsTable;
