"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

// Near-expiry dataset from mockup Image 2
export function Expiring30Days({ items = [], searchQuery = "", selectedCategory = "All", selectedRoom = "All", onReturn }) {
  const router = useRouter();
  
  // Filters logic
  const filtered = items.filter(item => {
    if (selectedCategory !== "All" && item.category !== selectedCategory) return false;
    if (selectedRoom !== "All" && item.room !== selectedRoom) return false;

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchCode = item.code.toLowerCase().includes(q);
      const matchCabinet = item.cabinet.toLowerCase().includes(q);
      if (!matchName && !matchCode && !matchCabinet) return false;
    }
    return true;
  });

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] shadow-none overflow-hidden flex flex-col justify-start">

      {/* Table Subheader Strip */}
      <div className="p-4 flex flex-wrap justify-between items-center bg-[#FFFDF5]/50 dark:bg-amber-950/5 border-b border-[#e2e8f0] dark:border-[#334155] gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] animate-pulse" />
          <span className="text-[12px] font-bold text-slate-700 dark:text-slate-300">
            Near Expiry Stock Batches (Within 60 Days)
          </span>
        </div>
        <div className="text-[12px] font-bold text-[#D97706]">
          {filtered.length} {filtered.length === 1 ? "Batch" : "Batches"} Near Expiry
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px] text-left">
          <thead>
            <tr className="bg-[#F8F9FC] dark:bg-[#101935] border-b border-[#e2e8f0] dark:border-[#334155]">
              <th className="px-5 py-3 text-[11px] font-extrabold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider text-left">ITEM NAME</th>
              <th className="px-5 py-3 text-[11px] font-extrabold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider text-left">BATCH CODE</th>
              <th className="px-5 py-3 text-[11px] font-extrabold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider text-left">MFG DATE</th>
              <th className="px-5 py-3 text-[11px] font-extrabold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider text-left">EXPIRY DATE</th>
              <th className="px-5 py-3 text-[11px] font-extrabold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider text-left">REMAINING QTY</th>
              <th className="px-5 py-3 text-[11px] font-extrabold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider text-left">STORAGE CABINET</th>
              <th className="px-5 py-3 text-[11px] font-extrabold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider text-left">EST VALUE</th>
              <th className="px-5 py-3 text-[11px] font-extrabold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider text-center">STATUS</th>
              <th className="px-5 py-3 text-[11px] font-extrabold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider text-center">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e2e8f0] dark:divide-[#334155]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-5 py-10 text-center text-slate-400 font-semibold">
                  No near-expiry batches found.
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-slate-800 dark:text-slate-200">{item.name}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-500 dark:text-slate-400">{item.code}</td>
                  <td className="px-5 py-3.5 font-bold text-slate-800 dark:text-slate-350">{item.mfg}</td>
                  <td className="px-5 py-3.5 font-bold text-amber-500 dark:text-amber-400">{item.expiry}</td>
                  <td className="px-5 py-3.5 text-left font-semibold text-slate-700 dark:text-slate-200">{item.qty}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-500 dark:text-slate-400">{item.cabinet}</td>
                  <td className="px-5 py-3.5 text-left font-bold text-slate-800 dark:text-slate-200">{item.value}</td>
                  <td className="px-5 py-3.5 text-center">
                    <span className="inline-flex items-center justify-center px-3.5 py-1 rounded-full text-[10px] font-bold border border-[#FDE68A] bg-[#FFFBEB] dark:bg-amber-950/20 dark:border-amber-900/30 text-[#D97706] whitespace-nowrap">
                      Near Expiry (30d)
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => {
                          toast.success(`Initiating transfer usage for ${item.name}`);
                          router.push(`/hospital-inventory/stock/stock-transfer?itemId=${item.id}`);
                        }}
                        className="w-[66px] h-[32px] flex items-center justify-center text-center text-[9px] font-bold leading-[1.1] bg-[#E0F2FE] hover:bg-[#BAE6FD] text-[#0369A1] dark:bg-[#0369A1]/20 dark:text-[#38BDF8] rounded-[4px] border border-[#BAE6FD] dark:border-[#0369A1]/30 transition-all cursor-pointer"
                      >
                        Transfer<br />Usage
                      </button>
                      <button
                        onClick={() => onReturn ? onReturn(item) : toast.success(`Initiating return to vendor for ${item.name}`)}
                        className="w-[66px] h-[32px] flex items-center justify-center text-center text-[9px] font-bold leading-[1.1] bg-white hover:bg-slate-50 dark:bg-[#1e293b]/50 text-slate-500 dark:text-slate-400 rounded-[4px] border border-[#E2E8F0] dark:border-[#334155] hover:text-slate-700 dark:hover:text-white transition-all cursor-pointer"
                      >
                        Return<br />Vendor
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
