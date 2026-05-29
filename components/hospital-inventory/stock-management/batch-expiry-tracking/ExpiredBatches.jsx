"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

// Expired dataset from mockup Image 1
const EXPIRED_DATA = [
  { id: 1, name: "Cefuroxime Axetil 250mg", code: "CEF-912", mfg: "2022-03", expiry: "2024-02", qty: "240", cabinet: "Cabinet C-2", valueLoss: "₹1,200.00", category: "Antibiotics", room: "Central Pharmacy" },
  { id: 2, name: "Suture Silk Black Braided 2-0", code: "SU-4421", mfg: "2021-01", expiry: "2024-01", qty: "45", cabinet: "O.T. Cabinet 4", valueLoss: "₹380.00", category: "Surgical Supplies", room: "O.T. Recovery Unit" },
  { id: 3, name: "Suture Silk Black Braided 2-0", code: "SU-4421", mfg: "2021-01", expiry: "2024-01", qty: "45", cabinet: "O.T. Cabinet 4", valueLoss: "₹380.00", category: "Surgical Supplies", room: "O.T. Recovery Unit" },
  { id: 4, name: "Suture Silk Black Braided 2-0", code: "SU-4421", mfg: "2021-01", expiry: "2024-01", qty: "45", cabinet: "O.T. Cabinet 4", valueLoss: "₹380.00", category: "Surgical Supplies", room: "O.T. Recovery Unit" },
  { id: 5, name: "Suture Silk Black Braided 2-0", code: "SU-4421", mfg: "2021-01", expiry: "2024-01", qty: "45", cabinet: "O.T. Cabinet 4", valueLoss: "₹360.00", category: "Surgical Supplies", room: "O.T. Recovery Unit" },
  { id: 6, name: "Suture Silk Black Braided 2-0", code: "SU-4421", mfg: "2021-01", expiry: "2024-01", qty: "45", cabinet: "O.T. Cabinet 4", valueLoss: "₹360.00", category: "Surgical Supplies", room: "O.T. Recovery Unit" }
];

export function ExpiredBatches({ searchQuery = "", selectedCategory = "All", selectedRoom = "All" }) {
  const [items] = useState(EXPIRED_DATA);

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
      <div className="p-4 flex flex-wrap justify-between items-center bg-[#FFF5F5]/30 dark:bg-red-950/5 border-b border-[#e2e8f0] dark:border-[#334155] gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] animate-pulse" />
          <span className="text-[12px] font-bold text-slate-700 dark:text-slate-300">
            Expired Stock Batches (Needs Immediate Write-off / Disposal)
          </span>
        </div>
        <div className="text-[12px] font-bold text-[#EF4444]">
          {filtered.length} {filtered.length === 1 ? "Batch" : "Batches"} Detected
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
              <th className="px-5 py-3 text-[11px] font-extrabold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider text-left">EST VALUE LOSS</th>
              <th className="px-5 py-3 text-[11px] font-extrabold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider text-center">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e2e8f0] dark:divide-[#334155]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-5 py-10 text-center text-slate-400 font-semibold">
                  No expired batches found.
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-slate-800 dark:text-slate-200">{item.name}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-500 dark:text-slate-400">{item.code}</td>
                  <td className="px-5 py-3.5 font-bold text-slate-800 dark:text-slate-350">{item.mfg}</td>
                  <td className="px-5 py-3.5 font-bold text-red-500 dark:text-red-400">{item.expiry}</td>
                  <td className="px-5 py-3.5 text-left font-semibold text-slate-700 dark:text-slate-200">{item.qty}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-500 dark:text-slate-400">{item.cabinet}</td>
                  <td className="px-5 py-3.5 text-left font-bold text-slate-800 dark:text-slate-200">{item.valueLoss}</td>
                  <td className="px-5 py-3.5 text-center">
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-bold border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900/30 text-red-500">
                      Expired
                    </span>
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
