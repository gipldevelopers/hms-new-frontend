"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ShieldCheck, Eye } from "lucide-react";

// Healthy batches dataset from mockup Image 4
const HEALTHY_DATA = [
  { id: 20, name: "Saline IV Solution 0.9%", code: "SLN-99-B", mfg: "2023-10", expiry: "2025-12", qty: "2400", cabinet: "Pallet Main-3", value: "₹4,320.00", status: "Safe (1+ Year)", category: "Intravenous Fluids", room: "Main Store" },
  { id: 21, name: "Aspirin Cardio 100mg Tab", code: "ASP-112", mfg: "2023-11", expiry: "2026-05", qty: "3200", cabinet: "Shelf D-5", value: "₹980.00", status: "Safe (4+ Years)", category: "Antibiotics", room: "Central Pharmacy" },
  { id: 22, name: "Heparin Sodium 5000 IU/ml", code: "HEP-003", mfg: "2023-08", expiry: "2026-08", qty: "150", cabinet: "Cold Room Fridge B", value: "₹1,850.00", status: "Safe (3+ Years)", category: "Intravenous Fluids", room: "Cold Storage A" },
  { id: 23, name: "Heparin Sodium 5000 IU/ml", code: "HEP-003", mfg: "2023-08", expiry: "2026-08", qty: "150", cabinet: "Cold Room Fridge B", value: "₹1,850.00", status: "Safe (6+ Years)", category: "Intravenous Fluids", room: "Cold Storage A" },
  { id: 24, name: "Heparin Sodium 5000 IU/ml", code: "HEP-003", mfg: "2023-08", expiry: "2026-08", qty: "150", cabinet: "Cold Room Fridge B", value: "₹1,850.00", status: "Safe (2+ Years)", category: "Intravenous Fluids", room: "Cold Storage A" },
  { id: 25, name: "Heparin Sodium 5000 IU/ml", code: "HEP-003", mfg: "2023-08", expiry: "2026-08", qty: "150", cabinet: "Cold Room Fridge B", value: "₹1,850.00", status: "Safe (2+ Years)", category: "Intravenous Fluids", room: "Cold Storage A" },
  { id: 26, name: "Heparin Sodium 5000 IU/ml", code: "HEP-003", mfg: "2023-08", expiry: "2026-08", qty: "150", cabinet: "Cold Room Fridge B", value: "₹1,850.00", status: "Safe (2+ Years)", category: "Intravenous Fluids", room: "Cold Storage A" },
  { id: 27, name: "Heparin Sodium 5000 IU/ml", code: "HEP-003", mfg: "2023-08", expiry: "2026-08", qty: "150", cabinet: "Cold Room Fridge B", value: "₹1,850.00", status: "Safe (2+ Years)", category: "Intravenous Fluids", room: "Cold Storage A" }
];

export function ShowAllHealthy({ searchQuery = "", selectedCategory = "All", selectedRoom = "All", onView }) {
  const [items] = useState(HEALTHY_DATA);

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
      <div className="p-4 flex flex-wrap justify-between items-center bg-[#E8F5E9]/30 dark:bg-emerald-950/5 border-b border-[#e2e8f0] dark:border-[#334155] gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
          <span className="text-[12px] font-bold text-slate-700 dark:text-slate-300">
            Safe / Healthy Stock Batches
          </span>
        </div>
        <div className="text-[12px] font-bold text-[#10B981]">
          3 Batches Healthy
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
                  No healthy batches found.
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-slate-800 dark:text-slate-200">{item.name}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">{item.code}</td>
                  <td className="px-5 py-3.5 font-bold text-slate-800 dark:text-slate-350 whitespace-nowrap">{item.mfg}</td>
                  <td className="px-5 py-3.5 font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">{item.expiry}</td>
                  <td className="px-5 py-3.5 text-left font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">{item.qty}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">{item.cabinet}</td>
                  <td className="px-5 py-3.5 text-left font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">{item.value}</td>
                  <td className="px-5 py-3.5 text-center">
                    <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border border-[#A7F3D0] bg-[#ECFDF5] dark:bg-emerald-950/20 dark:border-emerald-900/30 text-[#059669] dark:text-[#34D399] whitespace-nowrap">
                      <ShieldCheck size={11} className="opacity-80" />
                      {item.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <button
                      onClick={() => onView ? onView(item) : toast.success(`Viewing batch details for ${item.name}`)}
                      className="p-1.5 text-slate-500 hover:text-[#2E37A4] dark:hover:text-[#5F69F8] transition-colors rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer inline-flex items-center justify-center"
                    >
                      <Eye size={15} />
                    </button>
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
