"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";

export function StockTransfer({ slugs = [] }) {
  const router = useRouter();
  // Recent dispatches list matching your shared image
  const [dispatches, setDispatches] = useState([
    { id: "TX-2024-991", source: "Central Store", destination: "O.T. Recovery Unit", date: "2024-03-22", totalItems: 5 },
    { id: "TX-2024-988", source: "Central Pharmacy", destination: "Emergency Ward", date: "2024-03-21", totalItems: 3 },
    { id: "TX-2024-984", source: "Central Store", destination: "ICU Department B", date: "2024-03-20", totalItems: 12 },
    { id: "TX-2024-979", source: "Central Store", destination: "Outpatient Clinic", date: "2024-03-18", totalItems: 2 },
  ]);

  // Form states
  const [transferId, setTransferId] = useState("TX-2024-995");
  const [fromDept, setFromDept] = useState("Central Store");
  const [toDept, setToDept] = useState("O.T. Recovery Unit");
  const [transferDate, setTransferDate] = useState("2024-03-22");

  // Selected items with initial quantities
  const [items, setItems] = useState([
    { id: 1, name: "Surgical Gloves Sterile", batch: "GLV-11", stock: "160 pr", qty: 50 },
    { id: 2, name: "Propofol 10mg/ml", batch: "PPF-24-A", stock: "3100 amp", qty: 100 }
  ]);

  const [notes, setNotes] = useState("Urgent restocking for evening neuro-surgeries.");

  // Handle quantity change
  const handleQtyChange = (id, val) => {
    const numericVal = parseInt(val) || 0;
    setItems(items.map(item => item.id === id ? { ...item, qty: numericVal } : item));
  };

  // Submit transfer
  const handleTransferSubmit = (e) => {
    e.preventDefault();

    if (!fromDept || !toDept) {
      toast.error("Please select both source and destination departments");
      return;
    }

    if (fromDept === toDept) {
      toast.error("Source and destination departments cannot be the same");
      return;
    }

    const totalItems = items.reduce((sum, item) => sum + item.qty, 0);
    if (totalItems <= 0) {
      toast.error("Please enter a valid transfer quantity greater than 0");
      return;
    }

    // Append new transfer record
    const newDispatch = {
      id: transferId,
      source: fromDept,
      destination: toDept,
      date: transferDate,
      totalItems: items.length // Number of unique line items
    };

    setDispatches([newDispatch, ...dispatches]);
    toast.success(`Successfully transferred stock! ID: ${transferId}`);

    // Generate next transfer ID (mock increment)
    const nextNum = parseInt(transferId.split("-")[2]) + 1;
    setTransferId(`TX-2024-${nextNum}`);

    // Reset notes/quantities
    setNotes("");
    setItems(items.map(item => ({ ...item, qty: 0 })));
  };

  return (
    <div className="flex-1 p-6 bg-slate-50/50 dark:bg-slate-900/20 max-w-[1600px] mx-auto min-h-screen space-y-[20px] font-sans transition-colors duration-300 mt-3">

      {/* Title & Action Buttons Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-[20px] font-bold text-[#1e293b] dark:text-white leading-none tracking-tight">
          Stock Transfer
        </h2>
      </div>

      {/* Sub-tabs List matching mockup */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F1F5F9] dark:bg-[#1E293B]/60 rounded-[8px] border border-[#E2E8F0] dark:border-[#334155] w-fit">
        <button
          className="px-4 py-2 text-[12px] font-bold rounded-[6px] transition-all bg-transparent text-[#5E6C84] dark:text-slate-400 hover:text-[#2E37A4] dark:hover:text-[#5F69F8] cursor-pointer"
          onClick={() => router.push("/hospital-inventory/stock/stock-inventory")}
        >
          Stock Inventory
        </button>
        <button
          className="px-4 py-2 text-[12px] font-bold rounded-[6px] transition-all bg-transparent text-[#5E6C84] dark:text-slate-400 hover:text-[#2E37A4] dark:hover:text-[#5F69F8] cursor-pointer"
          onClick={() => router.push("/hospital-inventory/stock/lab-inventory")}
        >
          Lab Inventory
        </button>
        <button
          className="px-4 py-2 text-[12px] font-bold rounded-[6px] transition-all bg-[#2E37A4] text-white shadow-none cursor-pointer"
        >
          Stock Transfer
        </button>
        <button
          className="px-4 py-2 text-[12px] font-bold rounded-[6px] transition-all bg-transparent text-[#5E6C84] dark:text-slate-400 hover:text-[#2E37A4] dark:hover:text-[#5F69F8] cursor-pointer"
          onClick={() => router.push("/hospital-inventory/stock/batch-expiry-tracking")}
        >
          Batch & Expiry Tracking
        </button>
      </div>

      {/* Two Column Grid matching your exact shared layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

        {/* Left Column - Create Internal Stock Transfer Form */}
        <div className="lg:col-span-5 bg-white dark:bg-[#1e293b] rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] p-5 space-y-4 shadow-none">
          <form onSubmit={handleTransferSubmit} className="space-y-4">

            {/* Header info */}
            <div className="space-y-1">
              <span className="inline-block px-2 py-0.5 rounded-[4px] text-[9px] font-extrabold bg-[#2E37A4]/10 text-[#2E37A4] dark:bg-[#5F69F8]/20 dark:text-[#5F69F8] uppercase tracking-wider">
                New Dispatch
              </span>
              <h3 className="text-[15px] font-bold text-slate-800 dark:text-white">Create Internal Stock Transfer</h3>
              <p className="text-[12px] text-slate-400 font-medium">Move stock from main storage to a specific clinic ward</p>
            </div>

            <hr className="border-[#e2e8f0] dark:border-[#334155]" />

            {/* Transfer ID */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Transfer ID</label>
              <input
                type="text"
                disabled
                value={transferId}
                className="w-full h-10 px-3 bg-slate-50 dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-bold text-slate-500 cursor-not-allowed outline-none"
              />
            </div>

            {/* Source & Destination Wards Dropdowns */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">From Department</label>
                <select
                  value={fromDept}
                  onChange={(e) => setFromDept(e.target.value)}
                  className="w-full h-10 px-3 bg-white dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-[#2E37A4] transition-all"
                >
                  <option value="Central Store">Central Store</option>
                  <option value="Central Pharmacy">Central Pharmacy</option>
                  <option value="Emergency Ward">Emergency Ward</option>
                  <option value="O.T. Recovery Unit">O.T. Recovery Unit</option>
                  <option value="ICU Department B">ICU Department B</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">To Department</label>
                <select
                  value={toDept}
                  onChange={(e) => setToDept(e.target.value)}
                  className="w-full h-10 px-3 bg-white dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-[#2E37A4] transition-all"
                >
                  <option value="O.T. Recovery Unit">O.T. Recovery Unit</option>
                  <option value="Emergency Ward">Emergency Ward</option>
                  <option value="ICU Department B">ICU Department B</option>
                  <option value="Outpatient Clinic">Outpatient Clinic</option>
                  <option value="Central Store">Central Store</option>
                </select>
              </div>
            </div>

            {/* Transfer Date */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Transfer Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={transferDate}
                  onChange={(e) => setTransferDate(e.target.value)}
                  className="w-full h-10 pl-3 pr-10 bg-white dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-[#2E37A4] transition-all"
                />
                <Calendar size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Selected Items */}
            <div className="space-y-2">
              <label className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Selected Items to Transfer</label>

              <div className="space-y-2.5">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] bg-[#F8F9FC] dark:bg-[#0f172a]/20">
                    <div className="space-y-0.5">
                      <span className="text-[13px] font-bold text-slate-800 dark:text-slate-200">{item.name}</span>
                      <div className="text-[11px] text-slate-400 font-semibold">
                        Batch: <span className="text-slate-500 dark:text-slate-300 font-bold">{item.batch}</span> &bull; Stock: <span className="text-slate-500 dark:text-slate-300 font-bold">{item.stock}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-400 font-bold">Qty:</span>
                      <input
                        type="number"
                        min="0"
                        value={item.qty}
                        onChange={(e) => handleQtyChange(item.id, e.target.value)}
                        className="w-14 h-8 px-2 border border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#0f172a] rounded-[4px] text-[12px] font-extrabold text-center outline-none focus:border-[#2E37A4]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transfer Notes */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Transfer Notes / Destination Purpose</label>
              <textarea
                rows="3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Urgent restocking for evening neuro-surgeries."
                className="w-full p-3 bg-white dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-[#2E37A4] resize-none"
              />
            </div>

            {/* Transfer Button */}
            <button
              type="submit"
              className="w-full h-11 bg-[#2E37A4] hover:bg-[#232a7d] text-[13px] font-extrabold text-white rounded-[5px] transition-all cursor-pointer shadow-none flex items-center justify-center"
            >
              Transfer Stock
            </button>

          </form>
        </div>

        {/* Right Column - Recent Dispatches Table Card */}
        <div className="lg:col-span-7 bg-white dark:bg-[#1e293b] rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] shadow-none overflow-hidden flex flex-col justify-start">

          <div className="p-4 pb-3 space-y-1">
            <h3 className="text-[15px] font-bold text-slate-800 dark:text-white">Recent Dispatches</h3>
            <p className="text-[12px] text-slate-400 font-medium">Tracking current movement between wards</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[13px] text-left">
              <thead>
                <tr className="bg-[#F8F9FC] dark:bg-[#101935] border-b border-[#e2e8f0] dark:border-[#334155]">
                  <th className="px-5 py-3 text-[11px] font-extrabold text-[#64748b] dark:text-[#94a3b8] text-left uppercase tracking-wider">Transfer ID</th>
                  <th className="px-5 py-3 text-[11px] font-extrabold text-[#64748b] dark:text-[#94a3b8] text-left uppercase tracking-wider">Source</th>
                  <th className="px-5 py-3 text-[11px] font-extrabold text-[#64748b] dark:text-[#94a3b8] text-left uppercase tracking-wider">Destination</th>
                  <th className="px-5 py-3 text-[11px] font-extrabold text-[#64748b] dark:text-[#94a3b8] text-left uppercase tracking-wider">Date</th>
                  <th className="px-5 py-3 text-[11px] font-extrabold text-[#64748b] dark:text-[#94a3b8] text-center uppercase tracking-wider">Total Items</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0] dark:divide-[#334155]">
                {dispatches.map((disp) => (
                  <tr key={disp.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-[#2E37A4] dark:text-[#5F69F8]">{disp.id}</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-500 dark:text-slate-400">{disp.source}</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-500 dark:text-slate-400">{disp.destination}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-800 dark:text-slate-100">{disp.date}</td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-[4px] text-[11px] font-extrabold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {disp.totalItems}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>

    </div>
  );
}

export default StockTransfer;
