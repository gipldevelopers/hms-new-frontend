"use client";

import React from "react";
import { ChevronLeft, Plus, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function ItemDetailView({ item, onBack, onAddItem }) {
  if (!item) return null;

  return (
    <div className="space-y-[20px] font-sans transition-colors duration-300">

      {/* Header matching finance/patient-billing/ipd-details/T-01 layout exactly */}
      <div className="-mt-4 sm:-mt-6 -mx-4 sm:-mx-6 bg-white dark:bg-[#101935] border-b border-[#E7E8EB] dark:border-white/10 px-[20px] py-[16px]">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-[16px]">
          <div className="flex items-center gap-[12px]">
            <button
              onClick={onBack}
              className="flex items-center justify-center w-[36px] h-[36px] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-[#F8F9FC] dark:hover:bg-white/5 transition bg-white dark:bg-[#101935] cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[18px] font-bold text-slate-800 dark:text-white leading-none">
                  {item.name}
                </h1>
                <span className={cn(
                  "px-2 py-0.5 rounded-[5px] text-[10px] font-bold uppercase border leading-none",
                  item.status === "In Stock" && "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border-emerald-200/50 dark:border-emerald-900/30",
                  item.status === "LOW" && "bg-[#FFF7E6] text-[#D48806] border-[#FFE7BA] dark:bg-amber-950/20 dark:text-amber-500 dark:border-amber-900/30",
                  item.status === "Out of Stock" && "bg-rose-50 dark:bg-rose-950/20 text-rose-600 border-rose-200/50 dark:border-rose-900/30"
                )}>
                  {item.status}
                </span>
              </div>
              <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-[4px]">
                Hospital Inventory &gt; Lab Reagents &gt; {item.name}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-[12px]">
            <button
              onClick={onAddItem}
              className="h-[38px] px-[16px] rounded-[5px] bg-[#2E37A4] text-[13px] font-semibold text-white hover:bg-[#2E37A4]/90 transition flex items-center justify-center gap-[6px] cursor-pointer border border-[#2E37A4]"
            >
              <Plus className="h-4 w-4" /> Add Item
            </button>
          </div>
        </div>
      </div>

      {/* Main Body Split Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* Left Column (Stock Status & Info) */}
        <div className="md:col-span-1 space-y-4">

          {/* Current Stock Card */}
          <div className="bg-white dark:bg-[#1e293b] p-5 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] flex flex-col items-center justify-center text-center">
            <span className="text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider">Current Stock</span>
            <div className="mt-3 flex items-baseline justify-center gap-1">
              <span className="text-[42px] font-bold text-[#1e293b] dark:text-white leading-none">
                {parseFloat(item.qty) || 0}
              </span>
              <span className="text-[15px] font-bold text-[#64748b] dark:text-[#94a3b8]">
                {item.qty.includes("Boxes") ? "Boxes" : item.qty.includes("Bottles") ? "Bottles" : "Units"}
              </span>
            </div>
            <div className={cn(
              "w-full mt-5 py-2 px-3 rounded-[5px] text-[11px] font-bold flex items-center justify-center gap-1.5 border",
              (item.status === "In Stock" || item.status === "LOW") && "bg-[#E2FBE9] border-[#B7F4C7] text-[#0F8A5F]",
              item.status === "Out of Stock" && "bg-[#FFF1F0] border-[#FFCCC7] text-[#F5222D]"
            )}>
              {(item.status === "In Stock" || item.status === "LOW") && (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="20 6 9 17 4 12" /></svg>
                  Stock level is optimal
                </>
              )}
              {item.status === "Out of Stock" && (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
                  Out of stock emergency
                </>
              )}
            </div>
          </div>

          {/* Item Information Card */}
          <div className="bg-white dark:bg-[#1e293b] p-5 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] space-y-4">
            <h4 className="text-[15px] font-bold text-[#1e293b] dark:text-white">Item Information</h4>

            <div className="space-y-0.5">
              <div className="text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider">Supplier</div>
              <div className="text-[13px] font-bold text-[#1e293b] dark:text-white">{item.supplier || "Global Pharma"}</div>
            </div>

            <div className="space-y-0.5">
              <div className="text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider">Expiry Date</div>
              <div className="text-[13px] font-bold text-[#1e293b] dark:text-white">{item.expiry || "N/A"}</div>
            </div>

            <div className="space-y-0.5">
              <div className="text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider">Minimum Threshold</div>
              <div className="text-[13px] font-bold text-[#1e293b] dark:text-white">
                {item.minThreshold || "5"} {item.qty.includes("Boxes") ? "Boxes" : item.qty.includes("Bottles") ? "Bottles" : "Units"}
              </div>
            </div>

            <div className="space-y-0.5">
              <div className="text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider">Internal Notes</div>
              <div className="text-[12px] font-medium text-slate-600 dark:text-slate-300 leading-normal">
                {item.notes || "Store in a cool, dry place. Ensure caps are tightly sealed after usage."}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (Stock History) */}
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-[#1e293b] rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] flex flex-col h-full overflow-hidden">
            <div className="px-[20px] py-[16px] border-b border-[#e2e8f0] dark:border-[#334155] flex justify-between items-center bg-white dark:bg-[#1e293b]">
              <h4 className="text-[15px] font-bold text-[#1e293b] dark:text-white">Stock History</h4>
              <button
                onClick={() => toast.success("Stock history exported successfully!")}
                className="text-[12px] font-bold text-[#2E37A4] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Export History
              </button>
            </div>

            <div className="overflow-x-auto flex-1 bg-white dark:bg-[#1e293b]">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-[#F8F9FC] dark:bg-[#101935]">
                    <th className="px-[20px] py-[12px] text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] border-b border-[#e2e8f0] dark:border-[#334155] uppercase tracking-wider">Date & Time</th>
                    <th className="px-[20px] py-[12px] text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] border-b border-[#e2e8f0] dark:border-[#334155] uppercase tracking-wider">Type</th>
                    <th className="px-[20px] py-[12px] text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] border-b border-[#e2e8f0] dark:border-[#334155] uppercase tracking-wider">Qty Changed</th>
                    <th className="px-[20px] py-[12px] text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] border-b border-[#e2e8f0] dark:border-[#334155] uppercase tracking-wider">User</th>
                    <th className="px-[20px] py-[12px] text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] border-b border-[#e2e8f0] dark:border-[#334155] uppercase tracking-wider">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0] dark:divide-[#334155] text-[13px]">
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-[20px] py-[12px] text-slate-600 dark:text-slate-300 font-medium">2023-10-24 14:30</td>
                    <td className="px-[20px] py-[12px]">
                      <span className="px-2.5 py-0.5 rounded-[5px] text-[10px] font-bold bg-[#E2FBE9] text-[#0F8A5F] border border-[#B7F4C7]">Addition</span>
                    </td>
                    <td className="px-[20px] py-[12px] font-bold text-[#0F8A5F]">+20</td>
                    <td className="px-[20px] py-[12px] font-semibold text-slate-700 dark:text-slate-200">Dr. Smith</td>
                    <td className="px-[20px] py-[12px] text-slate-500 dark:text-slate-400">Received new batch</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-[20px] py-[12px] text-slate-600 dark:text-slate-300 font-medium">2023-10-20 09:15</td>
                    <td className="px-[20px] py-[12px]">
                      <span className="px-2.5 py-0.5 rounded-[5px] text-[10px] font-bold bg-[#FFF7E6] text-[#D48806] border border-[#FFE7BA]">Usage</span>
                    </td>
                    <td className="px-[20px] py-[12px] font-bold text-red-500">-5</td>
                    <td className="px-[20px] py-[12px] font-semibold text-slate-700 dark:text-slate-200">Sarah Jenkins</td>
                    <td className="px-[20px] py-[12px] text-slate-500 dark:text-slate-400">Routine blood tests</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-[20px] py-[12px] text-slate-600 dark:text-slate-300 font-medium">2023-10-15 11:45</td>
                    <td className="px-[20px] py-[12px]">
                      <span className="px-2.5 py-0.5 rounded-[5px] text-[10px] font-bold bg-[#FFF7E6] text-[#D48806] border border-[#FFE7BA]">Usage</span>
                    </td>
                    <td className="px-[20px] py-[12px] font-bold text-red-500">-10</td>
                    <td className="px-[20px] py-[12px] font-semibold text-slate-700 dark:text-slate-200">Sarah Jenkins</td>
                    <td className="px-[20px] py-[12px] text-slate-500 dark:text-slate-400">Weekly processing</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-[20px] py-[12px] text-slate-600 dark:text-slate-300 font-medium">2023-10-01 10:00</td>
                    <td className="px-[20px] py-[12px]">
                      <span className="px-2.5 py-0.5 rounded-[5px] text-[10px] font-bold bg-[#E6F7FF] text-[#1890FF] border border-[#BAE7FF]">Initial Stock</span>
                    </td>
                    <td className="px-[20px] py-[12px] font-bold text-blue-500">+40</td>
                    <td className="px-[20px] py-[12px] font-semibold text-slate-700 dark:text-slate-200">Admin</td>
                    <td className="px-[20px] py-[12px] text-slate-500 dark:text-slate-400">Initial inventory setup</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-[20px] py-[12px] text-slate-600 dark:text-slate-300 font-medium">2023-10-01 10:00</td>
                    <td className="px-[20px] py-[12px]">
                      <span className="px-2.5 py-0.5 rounded-[5px] text-[10px] font-bold bg-[#E6F7FF] text-[#1890FF] border border-[#BAE7FF]">Initial Stock</span>
                    </td>
                    <td className="px-[20px] py-[12px] font-bold text-blue-500">+40</td>
                    <td className="px-[20px] py-[12px] font-semibold text-slate-700 dark:text-slate-200">Admin</td>
                    <td className="px-[20px] py-[12px] text-slate-500 dark:text-slate-400">Initial inventory setup</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
