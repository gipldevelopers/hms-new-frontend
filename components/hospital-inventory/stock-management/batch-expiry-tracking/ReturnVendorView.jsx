"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, ChevronRight, Info, Calendar } from "lucide-react";

export function ReturnVendorView({ item, onBack }) {
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    const mainEl = document.querySelector("main");
    if (mainEl) {
      mainEl.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [item]);

  if (!item) return null;

  // Derive initial values from the selected batch item
  const batchCode = item.code || "AMX-202";
  const itemQty = item.qty || "480";
  const itemValue = item.value ? String(item.value).replace("$", "₹") : "₹2,400.00";
  const statusLabel = "Near Expiry (60d)";

  // Form states
  const [returnQty, setReturnQty] = useState(`${itemQty} Capsules`);
  const [pickupDate, setPickupDate] = useState("2024-03-25");
  const [returnNote, setReturnNote] = useState(
    `Batch ${batchCode} is expiring in 15 days (Apr 2024). ${itemQty} units are in sellable condition. Requesting vendor pickup and full credit note. Original Invoice GRN-2024-72.`
  );

  const handleConfirm = () => {
    toast.success(`Debit Note request generated for batch ${batchCode}!`);
    onBack();
  };

  return (
    <div className="font-sans space-y-4">

      {/* TOP HEADER CONTAINER CARD */}
      <div className="bg-white dark:bg-[#1e293b] p-4 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] flex items-center justify-between shadow-none">
        <div className="flex items-center gap-3">
          {/* Circular Back Button with ArrowLeft */}
          <button
            onClick={onBack}
            className="flex items-center justify-center w-9 h-9 rounded-[5px] border border-[#e2e8f0] dark:border-slate-700 bg-white dark:bg-[#1e293b] text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 text-slate-700 dark:text-slate-300" />
          </button>
          
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[18px] sm:text-[20px] font-bold text-slate-800 dark:text-white leading-none">
                Back to Batch & Expiry Tracking
              </h1>
              <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 border border-amber-250 text-amber-600 dark:bg-amber-950/20 dark:border-amber-900/30 uppercase leading-none whitespace-nowrap">
                {statusLabel}
              </span>
            </div>
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 mt-1.5 uppercase tracking-wider">
              <span>Stock Management</span>
              <ChevronRight size={10} className="text-slate-300" />
              <span>Batch & Expiry Tracking</span>
              <ChevronRight size={10} className="text-slate-300" />
              <span className="text-slate-600 dark:text-slate-300 font-extrabold">{batchCode}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ALERT STRIP */}
      <div className="flex items-start gap-3 p-4 rounded-[5px] border border-blue-150 bg-[#F0F4FF] dark:bg-blue-950/15 dark:border-blue-900/30">
        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
          <Info size={16} />
        </div>
        <div>
          <h4 className="text-[13px] font-bold text-blue-800 dark:text-blue-300">
            Initiating Vendor Return / Debit Note Request
          </h4>
          <p className="text-[12px] font-medium text-blue-650 dark:text-blue-400/90 mt-1 leading-relaxed">
            Stock will be marked as "Returned — Pending Vendor Credit" and removed from active inventory once vendor acknowledgment is received.
          </p>
        </div>
      </div>

      {/* Return Request Details Card */}
      <div className="bg-white dark:bg-[#1e293b] rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] p-6 space-y-6 shadow-none">
        
        {/* Section Header */}
        <div className="space-y-1">
          <h2 className="text-[15px] font-extrabold text-slate-800 dark:text-white">Return Request Details</h2>
          <p className="text-[12px] font-medium text-slate-400">Fill return information to generate debit note and pickup challan</p>
        </div>

        {/* 2-Column Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Left Column */}
          <div className="space-y-4">
            
            {/* Auto ID */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Return Document ID (Auto-generated)</label>
              <input
                type="text"
                disabled
                value="RET-2024-08"
                className="w-full h-10 px-3 bg-[#F8F9FC] dark:bg-[#0A0F1D]/50 border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-semibold text-slate-400 dark:text-slate-500 cursor-not-allowed outline-none"
              />
            </div>

            {/* Qty */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Quantity to Return *</label>
                <span className="text-[10px] font-bold text-slate-400">Max: {itemQty}</span>
              </div>
              <input
                type="text"
                value={returnQty}
                onChange={(e) => setReturnQty(e.target.value)}
                className="w-full h-10 px-3 bg-[#F8F9FC] dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Pickup Date */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Expected Vendor Pickup Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full h-10 pl-3 pr-10 bg-[#F8F9FC] dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 transition-colors"
                />
                <Calendar size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

          </div>

          {/* Right Column */}
          <div className="space-y-4">
            
            {/* Vendor */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Return Vendor *</label>
              <select className="w-full h-10 px-3 bg-[#F8F9FC] dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 transition-colors cursor-pointer">
                <option>Pfizer Inc. — Contact: Arun Mehta</option>
                <option>Baxter Healthcare — Contact: Sales Team</option>
                <option>Roche Diagnostics — Contact: Support</option>
              </select>
            </div>

            {/* Reason */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Return Reason *</label>
              <select className="w-full h-10 px-3 bg-[#F8F9FC] dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 transition-colors cursor-pointer">
                <option>Near Expiry — Unusable Before Expiry Date</option>
                <option>Expired Stock — Returning for Replacement</option>
                <option>Defective / Broken Seal</option>
                <option>Excess Stock Transfer</option>
              </select>
            </div>

            {/* Settlement Mode */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Settlement Mode</label>
              <select className="w-full h-10 px-3 bg-[#F8F9FC] dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 transition-colors cursor-pointer">
                <option>Credit Note Against Future PO</option>
                <option>Direct Bank Refund</option>
                <option>Product Replacement / Exchange</option>
              </select>
            </div>

          </div>

        </div>

        {/* Note / Communication - Spans full width */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Return Note / Communication to Vendor</label>
          <textarea
            rows="3"
            value={returnNote}
            onChange={(e) => setReturnNote(e.target.value)}
            className="w-full p-3 bg-[#F8F9FC] dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-semibold text-slate-700 dark:text-slate-200 outline-none resize-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Debit Note Preview Box */}
        <div className="p-5 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1a2035] space-y-4">
          <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">DEBIT NOTE PREVIEW</h4>
          <div className="grid grid-cols-3 gap-4 pt-1">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-slate-400">Batch Qty Returning</span>
              <span className="text-[13px] font-bold text-slate-800 dark:text-white">{itemQty} Capsules</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-slate-400">Unit Purchase Price</span>
              <span className="text-[13px] font-bold text-slate-800 dark:text-white">₹5.00</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-slate-400">Total Debit / Credit</span>
              <span className="text-[14px] font-extrabold text-[#2E37A4] dark:text-[#5F69F8]">{itemValue}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Cancel and Confirm Buttons */}
      <div className="flex justify-end items-center gap-3 pt-2">
        <button
          onClick={onBack}
          className="h-10 px-6 rounded-[5px] border border-slate-200 dark:border-slate-700 bg-white hover:bg-slate-50 text-[13px] font-bold text-slate-500 hover:text-slate-700 dark:bg-[#1e293b] dark:text-slate-300 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          className="h-10 px-6 rounded-[5px] bg-[#2E37A4] hover:bg-[#232a7d] text-[13px] font-bold text-white transition-colors cursor-pointer shadow-none"
        >
          Confirm Return
        </button>
      </div>

    </div>
  );
}
