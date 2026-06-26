"use client";

import React, { useState } from "react";
import { ArrowLeft, Box, AlertTriangle, Layers, IndianRupee, ChevronRight, Info, Plus, ArrowLeftRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { API_URL } from "@/lib/api";
import { toast } from "sonner";
import { createPortal } from "react-dom";

export function ItemDetailView({ item, onBack, onTransferStock, onRefreshDetails }) {
  if (!item) return null;

  const [mounted, setMounted] = useState(false);
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [adjustData, setAdjustData] = useState({
    type: "Addition",
    qtyChanged: "",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    const scrollContainers = document.querySelectorAll(".overflow-y-auto");
    scrollContainers.forEach((container) => {
      container.scrollTop = 0;
    });
  }, [item]);

  const handleAdjustSubmit = async (e) => {
    e.preventDefault();
    const qty = parseFloat(adjustData.qtyChanged);
    if (isNaN(qty) || qty <= 0) {
      toast.error("Quantity changed must be a positive number.");
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("authtoken");
      const userStr = localStorage.getItem("user");
      if (!token || !userStr) {
        toast.error("Session expired.");
        return;
      }
      const user = JSON.parse(userStr);
      const branchId = user.branchId;

      const payload = {
        qtyChanged: qty,
        type: adjustData.type,
        notes: adjustData.notes
      };

      const res = await fetch(`${API_URL}/stock-inventory/${item.id}/stock?branchId=${branchId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (result.success) {
        toast.success("Stock adjusted successfully!");
        setIsAdjustOpen(false);
        setAdjustData({ type: "Addition", qtyChanged: "", notes: "" });
        window.dispatchEvent(new Event("refresh-inventory"));
        if (onRefreshDetails) onRefreshDetails();
      } else {
        toast.error(result.error || "Failed to adjust stock.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mock standard values based on Propofol if details are missing
  const skuCode = item.sku || "ITM-90234";
  const itemName = item.name || "Propofol 10mg/ml (20ml)";
  const categoryName = item.category || "Anesthetics & Sedatives";
  const subcategoryName = item.subcategory || "Intravenous Anesthetics";
  const unitOfMeasure = item.unit || "Ampoule";
  const storageLocation = item.location || "Cold Vault Room B";
  
  // Format numbers nicely with commas
  const formatNumber = (num) => {
    if (!num) return "0";
    const parsed = parseFloat(String(num).replace(/,/g, ""));
    return isNaN(parsed) ? "0" : parsed.toLocaleString("en-IN");
  };

  const currentQty = item.qty ? formatNumber(item.qty) : "3,100";
  const reorderThreshold = item.minStock ? formatNumber(item.minStock) : "1,500";
  const safetyLimit = item.minThreshold ? formatNumber(item.minThreshold) : "1,000";
  const activeBatches = item.batches || "4";

  const supplierName = item.supplier || item.vendor || "Not Specified";
  const supplierLetter = (supplierName.trim().charAt(0) || "S").toUpperCase();
  const unitPrice = parseFloat(item.unitPrice || 0).toFixed(2);

  return (
    <>
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
                {itemName}
              </h1>
              <span className="px-2.5 py-0.5 rounded-[5px] text-[10px] font-bold bg-[#E2FBE9] border border-[#B7F4C7] text-[#0F8A5F] dark:bg-emerald-950/20 dark:border-emerald-900/30 uppercase leading-none">
                {item.status || "In Stock"}
              </span>
            </div>
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 mt-1.5 uppercase tracking-wider">
              <span>Stock Management</span>
              <ChevronRight size={10} className="text-slate-300" />
              <span>Item Directory</span>
              <ChevronRight size={10} className="text-slate-300" />
              <span className="text-slate-600 dark:text-slate-300 font-extrabold">{skuCode}</span>
            </div>
          </div>
        </div>
      </div>

      {/* STAT CARDS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* On-Hand Stock */}
        <div className="bg-white dark:bg-[#1e293b] p-4 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Box size={18} />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider leading-none">Current On-Hand Stock</div>
            <div className="text-[16px] font-extrabold text-slate-800 dark:text-white mt-1.5 leading-none">
              {currentQty} <span className="text-[12px] font-bold text-slate-400 dark:text-slate-500">{unitOfMeasure}s</span>
            </div>
          </div>
        </div>

        {/* Reorder Threshold */}
        <div className="bg-white dark:bg-[#1e293b] p-4 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <AlertTriangle size={18} />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider leading-none">Reorder Level Threshold</div>
            <div className="text-[16px] font-extrabold text-slate-800 dark:text-white mt-1.5 leading-none">
              {reorderThreshold} <span className="text-[12px] font-bold text-slate-400 dark:text-slate-500">{unitOfMeasure}s</span>
            </div>
          </div>
        </div>

        {/* Active Batches */}
        <div className="bg-white dark:bg-[#1e293b] p-4 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-950/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Layers size={18} />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider leading-none">Active Batches</div>
            <div className="text-[16px] font-extrabold text-slate-800 dark:text-white mt-1.5 leading-none">
              {activeBatches} <span className="text-[12px] font-bold text-slate-400 dark:text-slate-500">Batches</span>
            </div>
          </div>
        </div>

        {/* Unit Stock Valuation */}
        <div className="bg-white dark:bg-[#1e293b] p-4 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-[#0F8A5F] dark:text-emerald-400">
            <IndianRupee size={18} />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider leading-none">Unit Stock Valuation</div>
            <div className="text-[16px] font-extrabold text-slate-800 dark:text-white mt-1.5 leading-none">
              ₹{unitPrice}
            </div>
          </div>
        </div>

      </div>

      {/* BASIC SPECIFICATIONS SECTION - WITH FULL WIDTH SEPARATORS */}
      <div className="bg-white dark:bg-[#1e293b] rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] p-6 space-y-6 shadow-none">
        
        {/* Title & Divider - Spans Full Width */}
        <div className="border-b border-[#e2e8f0] dark:border-slate-700 pb-4 px-6 -mx-6 -mt-2 flex items-center justify-between">
          <h2 className="text-[15px] font-extrabold text-slate-800 dark:text-white">Basic Specifications</h2>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{skuCode}</span>
        </div>

        {/* Clinical Description block */}
        <div className="bg-[#F8F9FC] dark:bg-[#0A0F1D] p-4 rounded-[5px] border border-[#e2e8f0] dark:border-slate-800 space-y-1.5">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Clinical Description</div>
          <p className="text-[13px] font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
            {item.notes || "Short-acting, intravenously administered anesthetic agent. Used for induction and maintenance of general anesthesia."}
          </p>
        </div>

        {/* Specification field rows divided by full-width separator lines */}
        <div className="space-y-5 pt-2">
          
          {/* Row 1: Category & Subcategory */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Category</span>
              <span className="text-[13px] font-bold text-slate-800 dark:text-white">{categoryName}</span>
            </div>
            
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Subcategory</span>
              <span className="text-[13px] font-bold text-slate-800 dark:text-white">{subcategoryName}</span>
            </div>
          </div>

          {/* Separator 1 */}
          <div className="border-t border-[#e2e8f0] dark:border-slate-700 -mx-6"></div>

          {/* Row 2: Unit & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Unit of Measure</span>
              <span className="text-[13px] font-bold text-slate-800 dark:text-white">{unitOfMeasure}</span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Storage Zone & Location</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
                <span className="text-[13px] font-bold text-slate-800 dark:text-white">{storageLocation}</span>
              </div>
            </div>
          </div>

          {/* Separator 2 */}
          <div className="border-t border-[#e2e8f0] dark:border-slate-700 -mx-6"></div>

          {/* Row 3: Safety limit & Max allowed level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Safety Limit (Minimum)</span>
              <span className="text-[13px] font-bold text-slate-800 dark:text-white">{safetyLimit} units</span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Maximum Allowed Level</span>
              <span className="text-[13px] font-bold text-slate-800 dark:text-white">10,000 units</span>
            </div>
          </div>

          {/* Separator 3 */}
          <div className="border-t border-[#e2e8f0] dark:border-slate-700 -mx-6"></div>

          {/* Row 4: Shelf life & Alarms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Shelf Life</span>
              <span className="text-[13px] font-bold text-slate-800 dark:text-white">24 Months</span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Alarms & Monitoring</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2.5 py-0.5 text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/20 dark:text-blue-400 rounded-[5px] leading-none uppercase border border-blue-100 dark:border-blue-900/30">
                  Batch Tracking Enabled
                </span>
                <span className="px-2.5 py-0.5 text-[10px] font-bold text-purple-600 bg-purple-50 dark:bg-purple-950/20 dark:text-purple-400 rounded-[5px] leading-none uppercase border border-purple-100 dark:border-purple-900/30">
                  Expiry Alarm 3n
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>      {/* BOTTOM ROW GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
               {/* Stock Transaction History (Left - 3/5 wide) */}
        <div className="lg:col-span-3 bg-white dark:bg-[#1e293b] rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] pt-5 pb-0 px-0 shadow-none flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 px-6">
            <h2 className="text-[15px] font-extrabold text-slate-800 dark:text-white">Stock Transaction History</h2>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Audit History Log</span>
          </div>

          {/* Full-width Divider */}
          <div className="border-t border-[#e2e8f0] dark:border-slate-800"></div>

          <div className="overflow-x-auto bg-white dark:bg-[#1e293b] mt-1 flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8F9FC] dark:bg-[#0A0F1D] border-b border-[#e2e8f0] dark:border-slate-850">
                  <th className="py-3.5 pl-6 text-[11px] font-bold text-slate-450 uppercase tracking-wider">Date & Time</th>
                  <th className="py-3.5 px-4 text-[11px] font-bold text-slate-450 uppercase tracking-wider">Type</th>
                  <th className="py-3.5 px-4 text-[11px] font-bold text-slate-450 uppercase tracking-wider">Qty Changed</th>
                  <th className="py-3.5 px-4 text-[11px] font-bold text-slate-450 uppercase tracking-wider">User</th>
                  <th className="py-3.5 pr-6 text-[11px] font-bold text-slate-450 uppercase tracking-wider text-right">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0] dark:divide-slate-850 text-[13px]">
                {(!item.stockHistory || item.stockHistory.length === 0) ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-400 font-semibold pl-6">
                      No stock history recorded yet
                    </td>
                  </tr>
                ) : (
                  item.stockHistory.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                      <td className="py-3.5 pl-6 font-semibold text-slate-700 dark:text-slate-350">
                        {new Date(log.dateTime).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </td>
                      <td className="py-3.5 px-4 font-medium">
                        <span className={cn(
                          "px-2 py-0.5 rounded-[5px] text-[10px] font-bold uppercase border leading-none",
                          log.type === "Addition" && "bg-emerald-50 text-emerald-600 border-emerald-200/50",
                          log.type === "Usage" && "bg-[#FFF7E6] text-[#D48806] border-[#FFE7BA]",
                          log.type === "Initial Stock" && "bg-blue-50 text-blue-600 border-blue-200/50"
                        )}>
                          {log.type}
                        </span>
                      </td>
                      <td className={cn(
                        "py-3.5 px-4 font-extrabold",
                        log.qtyChanged.startsWith("+") ? "text-[#0F8A5F]" : "text-red-500"
                      )}>
                        {log.qtyChanged}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-200">{log.user}</td>
                      <td className="py-3.5 pr-6 text-right text-slate-500 dark:text-slate-400 font-medium">
                        {log.notes || "N/A"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Preferred Supplier (Right - 2/5 wide) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] pt-5 pb-0 px-0 shadow-none flex flex-col self-start">
          <div className="pb-4 px-6">
            <h2 className="text-[15px] font-extrabold text-slate-800 dark:text-white">Preferred Supplier</h2>
          </div>

          {/* Full-width Divider */}
          <div className="border-t border-[#e2e8f0] dark:border-slate-800"></div>

          {/* Supplier Info Row */}
          <div className="flex items-center gap-3 py-4 px-6 bg-white dark:bg-[#1e293b] min-h-[72px]">
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-extrabold text-[15px] shrink-0">
              {supplierLetter}
            </div>
            <div>
              <div className="text-[14px] font-extrabold text-slate-800 dark:text-white">{supplierName}</div>
              <div className="text-[10px] font-bold text-slate-450 dark:text-slate-500 mt-0.5">Contract Active (ID: SUP-8812)</div>
            </div>
          </div>

          {/* Full-width Divider */}
          <div className="border-t border-[#e2e8f0] dark:border-slate-800"></div>

          {/* List Details with exact top/bottom borders matching user view */}
          <div className="text-[13px] bg-white dark:bg-[#1e293b]">
            
            <div className="py-3.5 px-6 flex items-center justify-between border-b border-[#e2e8f0] dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
              <span className="font-semibold text-slate-500 dark:text-slate-400">Purchase Unit Cost</span>
              <span className="font-extrabold text-slate-800 dark:text-white">₹{unitPrice}</span>
            </div>

            <div className="py-3.5 px-6 flex items-center justify-between border-b border-[#e2e8f0] dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
              <span className="font-semibold text-slate-500 dark:text-slate-400">Standard Tax Rate</span>
              <span className="font-extrabold text-slate-800 dark:text-white">12% (CGST + SGST)</span>
            </div>

            <div className="py-3.5 px-6 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors rounded-b-[5px]">
              <span className="font-semibold text-slate-500 dark:text-slate-400">Avg. Delivery Time</span>
              <span className="font-extrabold text-slate-800 dark:text-white">3 - 5 Business Days</span>
            </div>

          </div>
        </div>
      </div>



    </div>

      {/* -------------------- ADJUST STOCK MODAL -------------------- */}
      {mounted && isAdjustOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-[0.5px]">
          <div className="relative w-full max-w-[480px] bg-white dark:bg-[#1e293b] border border-slate-150 dark:border-white/10 p-6 rounded-[8px] shadow-2xl z-10 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-white/10">
              <h3 className="text-[16px] font-bold text-slate-800 dark:text-white">Adjust Stock: {itemName}</h3>
              <button
                onClick={() => setIsAdjustOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit} className="space-y-4">
              <div className="space-y-4 bg-slate-50/50 dark:bg-slate-900/20 p-4 rounded-[6px] border border-slate-100 dark:border-slate-800">
                
                {/* Adjustment Type */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Adjustment Type *</label>
                  <select
                    value={adjustData.type}
                    onChange={(e) => setAdjustData({ ...adjustData, type: e.target.value })}
                    className="w-full h-10 px-3 bg-white dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-[#2E37A4] transition-all"
                  >
                    <option value="Addition">Addition (+)</option>
                    <option value="Usage">Usage (-)</option>
                  </select>
                </div>

                {/* Quantity Changed */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Quantity Changed *</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      placeholder="e.g. 50"
                      value={adjustData.qtyChanged}
                      onChange={(e) => setAdjustData({ ...adjustData, qtyChanged: e.target.value })}
                      className="w-full h-10 px-3 border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-[#0f172a] rounded-[5px] text-[13px] font-semibold outline-none focus:border-[#2E37A4] text-foreground"
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-slate-400 font-bold">
                      {unitOfMeasure}s
                    </span>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Notes / Reason</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Received new shipment from vendor, or broken ampoules discarded."
                    value={adjustData.notes}
                    onChange={(e) => setAdjustData({ ...adjustData, notes: e.target.value })}
                    className="w-full p-3 bg-white dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-medium outline-none focus:border-[#2E37A4] text-foreground resize-none"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdjustOpen(false)}
                  className="h-10 px-4 rounded-[5px] border border-rose-500 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-[12px] font-bold transition-all cursor-pointer bg-transparent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-10 px-6 rounded-[5px] bg-[#2E37A4] hover:bg-[#232a7d] text-[12px] font-bold text-white transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Adjusting..." : "Submit Adjustment"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
