import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { ArrowLeft, ChevronRight, Info, Calendar } from "lucide-react";
import { API_URL } from "@/lib/api";

export function ReturnVendorView({ item, onBack, onSuccess }) {
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
  const itemQty = parseFloat(item.qty) || 0;
  const unitOfMeasure = item.qty ? item.qty.replace(/^[0-9.\s]+/, "").trim() : "Units";
  const unitPrice = item.unitPrice || 5.0;
  const statusLabel = item.status || "Near Expiry (60d)";

  // Form states
  const [returnQty, setReturnQty] = useState(String(itemQty));
  const [pickupDate, setPickupDate] = useState(new Date().toISOString().substring(0, 10));
  const [vendor, setVendor] = useState("Pfizer Inc. — Contact: Arun Mehta");
  const [reason, setReason] = useState("Near Expiry — Unusable Before Expiry Date");
  const [settlementMode, setSettlementMode] = useState("Credit Note Against Future PO");
  const [loading, setLoading] = useState(false);
  const [returnNote, setReturnNote] = useState(
    `Batch ${batchCode} is expiring soon. ${itemQty} units are in sellable condition. Requesting vendor pickup and credit note.`
  );
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    if (onSuccess) onSuccess();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleCloseSuccess();
      }
    };
    if (showSuccessModal) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showSuccessModal]);

  const handleConfirm = async () => {
    try {
      const qtyVal = parseFloat(returnQty) || 0;
      if (qtyVal <= 0) {
        toast.error("Please enter a valid quantity to return");
        return;
      }
      if (qtyVal > itemQty) {
        toast.error(`Return quantity cannot exceed current batch quantity (${itemQty})`);
        return;
      }

      setLoading(true);
      const token = localStorage.getItem("authtoken");
      const userStr = localStorage.getItem("user");
      if (!token || !userStr) {
        toast.error("Authentication required");
        return;
      }
      const user = JSON.parse(userStr);
      const branchId = user.branchId;

      const res = await fetch(`${API_URL}/batch-expiry/return?branchId=${branchId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          itemId: item.id,
          returnQty: String(qtyVal),
          returnNote,
          vendor,
          reason,
          settlementMode
        })
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Debit Note request generated for batch ${batchCode}!`);
        setShowSuccessModal(true);
      } else {
        toast.error(data.error || "Failed to process return");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while confirming return");
    } finally {
      setLoading(false);
    }
  };

  const qtyToReturnVal = parseFloat(returnQty) || 0;
  const derivedDebitVal = qtyToReturnVal * unitPrice;
  const derivedDebitStr = `₹${derivedDebitVal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

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
              <select
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                className="w-full h-10 px-3 bg-[#F8F9FC] dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 transition-colors cursor-pointer"
              >
                <option value="Pfizer Inc. — Contact: Arun Mehta">Pfizer Inc. — Contact: Arun Mehta</option>
                <option value="Baxter Healthcare — Contact: Sales Team">Baxter Healthcare — Contact: Sales Team</option>
                <option value="Roche Diagnostics — Contact: Support">Roche Diagnostics — Contact: Support</option>
              </select>
            </div>

            {/* Reason */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Return Reason *</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full h-10 px-3 bg-[#F8F9FC] dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 transition-colors cursor-pointer"
              >
                <option value="Near Expiry — Unusable Before Expiry Date">Near Expiry — Unusable Before Expiry Date</option>
                <option value="Expired Stock — Returning for Replacement">Expired Stock — Returning for Replacement</option>
                <option value="Defective / Broken Seal">Defective / Broken Seal</option>
                <option value="Excess Stock Transfer">Excess Stock Transfer</option>
              </select>
            </div>

            {/* Settlement Mode */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Settlement Mode</label>
              <select
                value={settlementMode}
                onChange={(e) => setSettlementMode(e.target.value)}
                className="w-full h-10 px-3 bg-[#F8F9FC] dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 transition-colors cursor-pointer"
              >
                <option value="Credit Note Against Future PO">Credit Note Against Future PO</option>
                <option value="Direct Bank Refund">Direct Bank Refund</option>
                <option value="Product Replacement / Exchange">Product Replacement / Exchange</option>
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
              <span className="text-[13px] font-bold text-slate-800 dark:text-white">{qtyToReturnVal} {unitOfMeasure}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-slate-400">Unit Purchase Price</span>
              <span className="text-[13px] font-bold text-slate-800 dark:text-white">₹{unitPrice.toFixed(2)}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-slate-400">Total Debit / Credit</span>
              <span className="text-[14px] font-extrabold text-[#2E37A4] dark:text-[#5F69F8]">{derivedDebitStr}</span>
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

      {/* Success Modal */}
      {mounted && showSuccessModal && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-[0.5px]"
          style={{ backdropFilter: "blur(0.5px)" }}
        >
          <div className="relative w-full max-w-[440px] bg-white dark:bg-[#1e293b] rounded-[16px] shadow-2xl border border-slate-100 dark:border-slate-800 p-8 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button 
              onClick={handleCloseSuccess}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Green checkmark circle */}
            <div className="w-16 h-16 bg-[#10B981] rounded-full flex items-center justify-center text-white mb-6 shadow-lg shadow-emerald-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            {/* Modal Heading */}
            <h3 className="text-[18px] font-extrabold text-slate-900 dark:text-white mb-2 leading-tight">
              Stock Successfully Return
            </h3>

            {/* Modal Subtext */}
            <p className="text-[13px] font-semibold text-slate-500 dark:text-slate-400">
              Which is {statusLabel}
            </p>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
