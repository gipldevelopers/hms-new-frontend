"use client";

import React, { useState } from "react";
import { ArrowLeft, Box, AlertTriangle, Layers, DollarSign, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function ItemDetailView({ item, onBack }) {
  if (!item) return null;

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
    const cleaned = String(num).replace(/,/g, "");
    return Number(cleaned).toLocaleString("en-IN");
  };

  const currentQty = item.qty ? formatNumber(item.qty) : "3,100";
  const reorderThreshold = item.minStock ? formatNumber(item.minStock) : "1,500";
  const safetyLimit = item.minThreshold ? formatNumber(item.minThreshold) : "1,000";
  const activeBatches = item.batches || "4";

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
            <DollarSign size={18} />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider leading-none">Unit Stock Valuation</div>
            <div className="text-[16px] font-extrabold text-slate-800 dark:text-white mt-1.5 leading-none">
              ₹52.50
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
      </div>

      {/* BOTTOM ROW GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Order History (Left - 3/5 wide) - Spans separator border edge-to-edge */}
        <div className="lg:col-span-3 bg-white dark:bg-[#1e293b] rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] py-6 px-0 space-y-4 shadow-none">
          <div className="flex items-center justify-between pb-3 px-6">
            <h2 className="text-[15px] font-extrabold text-slate-800 dark:text-white">Order History</h2>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Last 3 Transactions</span>
          </div>

          {/* Full-width Divider */}
          <div className="border-t border-[#e2e8f0] dark:border-slate-800"></div>

          <div className="overflow-x-auto bg-white dark:bg-[#1e293b]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8F9FC] dark:bg-[#0A0F1D] border-b border-[#e2e8f0] dark:border-slate-800">
                  <th className="py-3 pl-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Order Code</th>
                  <th className="py-3 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="py-3 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Quantity</th>
                  <th className="py-3 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Unit Rate</th>
                  <th className="py-3 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Price</th>
                  <th className="py-3 pr-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0] dark:divide-slate-800 text-[13px]">
                
                {/* Transaction 1 */}
                <tr className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                  <td className="py-3.5 pl-6 font-semibold text-slate-700 dark:text-slate-300">PO-2024-0891</td>
                  <td className="py-3.5 px-4 font-medium text-slate-500">14 Oct 2024</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">1,500 units</td>
                  <td className="py-3.5 px-4 font-medium text-slate-600 dark:text-slate-400">₹12.50</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-white">₹18,750.00</td>
                  <td className="py-3.5 pr-6 text-right">
                    <span className="px-2 py-0.5 rounded-[5px] text-[10px] font-bold text-[#2E37A4] border border-[#2E37A4] bg-[#2E37A4]/5 uppercase leading-none">
                      Delivered
                    </span>
                  </td>
                </tr>

                {/* Transaction 2 */}
                <tr className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                  <td className="py-3.5 pl-6 font-semibold text-slate-700 dark:text-slate-300">PO-2024-0542</td>
                  <td className="py-3.5 px-4 font-medium text-slate-500">22 May 2024</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">1,500 units</td>
                  <td className="py-3.5 px-4 font-medium text-slate-600 dark:text-slate-400">₹12.50</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-white">₹18,750.00</td>
                  <td className="py-3.5 pr-6 text-right">
                    <span className="px-2 py-0.5 rounded-[5px] text-[10px] font-bold text-[#2E37A4] border border-[#2E37A4] bg-[#2E37A4]/5 uppercase leading-none">
                      Delivered
                    </span>
                  </td>
                </tr>

                {/* Transaction 3 */}
                <tr className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                  <td className="py-3.5 pl-6 font-semibold text-slate-700 dark:text-slate-300">PO-2024-0112</td>
                  <td className="py-3.5 px-4 font-medium text-slate-500">09 Jan 2024</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">1,000 units</td>
                  <td className="py-3.5 px-4 font-medium text-slate-600 dark:text-slate-400">₹12.00</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-white">₹12,000.00</td>
                  <td className="py-3.5 pr-6 text-right">
                    <span className="px-2 py-0.5 rounded-[5px] text-[10px] font-bold text-[#2E37A4] border border-[#2E37A4] bg-[#2E37A4]/5 uppercase leading-none">
                      Delivered
                    </span>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>

        {/* Preferred Supplier (Right - 2/5 wide) - Spans separator border edge-to-edge */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] py-6 px-0 space-y-4 shadow-none">
          <div className="pb-3 px-6">
            <h2 className="text-[15px] font-extrabold text-slate-800 dark:text-white">Preferred Supplier</h2>
          </div>

          {/* Full-width Divider */}
          <div className="border-t border-[#e2e8f0] dark:border-slate-800"></div>

          <div className="space-y-4">
            {/* Supplier Profile Badge Card */}
            <div className="flex items-center gap-3 px-6">
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-extrabold text-[16px]">
                B
              </div>
              <div>
                <div className="text-[14px] font-extrabold text-slate-800 dark:text-white">Baxter Healthcare</div>
                <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-0.5">Contract Active (ID: SUP-8812)</div>
              </div>
            </div>

            {/* Full-width Divider */}
            <div className="border-t border-[#e2e8f0] dark:border-slate-800"></div>

            {/* List Details */}
            <div className="divide-y divide-[#e2e8f0] dark:divide-slate-800 text-[12px]">
              
              <div className="py-3 px-6 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                <span className="font-bold text-slate-400">Purchase Unit Cost</span>
                <span className="font-extrabold text-slate-700 dark:text-slate-200">₹563.50</span>
              </div>

              <div className="py-3 px-6 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                <span className="font-bold text-slate-400">Standard Tax Rate</span>
                <span className="font-extrabold text-slate-700 dark:text-slate-200">12% (CGST + SGST)</span>
              </div>

              <div className="py-3 px-6 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                <span className="font-bold text-slate-400">Avg. Delivery Time</span>
                <span className="font-extrabold text-slate-700 dark:text-slate-200">3 - 5 Business Days</span>
              </div>

            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
