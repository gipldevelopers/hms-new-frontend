"use client";

import React, { useState } from "react";
import { ChevronLeft, Mail, Phone, MapPin, Download, CheckCircle, ShieldAlert, Star } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function SupplierDetailView({ supplier, onBack }) {
  if (!supplier) return null;

  // Mock list of recent Purchase Orders sourced from this supplier
  const mockOrders = [
    { code: "PO-2025-9812", date: "24 Oct 2025", items: "Propofol 10mg/mL, Sterile Gloves", qty: "20,000 units", cost: "₹18,400.00", status: "Delivered" },
    { code: "PO-2025-7721", date: "15 Aug 2025", items: "Surgical Sutures USP 3-0", qty: "5,000 units", cost: "₹12,250.00", status: "Delivered" },
    { code: "PO-2025-3419", date: "09 May 2025", items: "Hematology Reagent Bottle A", qty: "300 bottles", cost: "₹8,900.00", status: "Delivered" }
  ];

  return (
    <div className="space-y-[20px] font-sans transition-colors duration-300">
      
      {/* Header Panel */}
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
                  {supplier.name}
                </h1>
                <span className={cn(
                  "px-2.5 py-0.5 rounded-[5px] text-[10px] font-extrabold uppercase border leading-none tracking-wide",
                  supplier.status === "Active" ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border-emerald-200/50 dark:border-emerald-900/30" : "bg-rose-50 dark:bg-rose-950/20 text-rose-600 border-rose-200/50 dark:border-rose-900/30"
                )}>
                  {supplier.status}
                </span>
              </div>
              <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-[4px]">
                Hospital Sourcing &gt; Supplier Directory &gt; {supplier.sku || "SUP-2024-001"}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-[12px]">
            <button
              onClick={() => toast.success("Supplier contract and terms exported!")}
              className="h-[38px] px-[16px] rounded-[5px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#101935] text-[13px] font-semibold text-slate-600 dark:text-slate-350 hover:bg-[#F8F9FC] dark:hover:bg-white/5 transition flex items-center justify-center gap-[6px] cursor-pointer"
            >
              Export Terms
            </button>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Card: Essential Stats & Contact Details */}
        <div className="lg:col-span-1 space-y-5">
          
          {/* Supplier Info Details Card */}
          <div className="bg-white dark:bg-[#1e293b] p-5 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] space-y-5">
            <h3 className="text-[15px] font-bold text-slate-800 dark:text-white">Supplier Profile</h3>
            
            {/* Rating Stars Details */}
            <div className="flex items-center gap-3 bg-[#F8F9FC] dark:bg-[#0A0F1D] p-3 rounded-[5px] border border-[#e2e8f0] dark:border-slate-800">
              <div className="flex gap-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < (supplier.rating || 4) ? "currentColor" : "none"}
                    className={cn(i < (supplier.rating || 4) ? "text-amber-400" : "text-slate-300 dark:text-slate-700")}
                  />
                ))}
              </div>
              <span className="text-[12px] font-extrabold text-slate-600 dark:text-slate-300">
                {supplier.rating || 4}.0 Quality Rating
              </span>
            </div>

            <div className="space-y-4">
              
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</div>
                  <div className="text-[13px] font-bold text-slate-700 dark:text-slate-200">{supplier.email || "support@pharmacorp.com"}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contact Number</div>
                  <div className="text-[13px] font-bold text-slate-700 dark:text-slate-200">{supplier.phone || "+1 (555) 012-3456"}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Registered Address</div>
                  <div className="text-[13px] font-bold text-slate-700 dark:text-slate-200 leading-normal">
                    {supplier.address || "102, Pharma City Complex, Sector 4, New Delhi, India"}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Compliance & Risk Level */}
          <div className="bg-white dark:bg-[#1e293b] p-5 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] space-y-4">
            <h4 className="text-[14px] font-bold text-slate-800 dark:text-white">Compliance Status</h4>
            
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-emerald-500 shrink-0" />
              <div>
                <div className="text-[13px] font-bold text-slate-800 dark:text-white">Active Settle Contract</div>
                <div className="text-[11px] font-medium text-slate-400 mt-0.5">Valid until Oct 2027</div>
              </div>
            </div>

            <div className="border-t border-[#e2e8f0] dark:border-slate-800 pt-3 flex items-center gap-3">
              <ShieldAlert className="w-8 h-8 text-indigo-500 shrink-0" />
              <div>
                <div className="text-[13px] font-bold text-slate-800 dark:text-white">Risk Rating: LOW</div>
                <div className="text-[11px] font-medium text-slate-400 mt-0.5">Excellent historical delivery lead-times</div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Card: Order History List */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-[#1e293b] rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] h-full flex flex-col overflow-hidden">
            
            <div className="px-5 py-4 border-b border-[#e2e8f0] dark:border-[#334155] flex justify-between items-center bg-white dark:bg-[#1e293b]">
              <h4 className="text-[15px] font-bold text-[#1e293b] dark:text-white">Recent Purchase Orders</h4>
              <button
                onClick={() => toast.success("Purchase order sheet exported!")}
                className="text-[12px] font-bold text-[#2E37A4] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Export Sheet
              </button>
            </div>

            <div className="overflow-x-auto flex-1 bg-white dark:bg-[#1e293b]">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-[#F8F9FC] dark:bg-[#101935]">
                    <th className="px-5 py-3 text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] border-b border-[#e2e8f0] dark:border-[#334155] uppercase tracking-wider">PO Code</th>
                    <th className="px-5 py-3 text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] border-b border-[#e2e8f0] dark:border-[#334155] uppercase tracking-wider">Order Date</th>
                    <th className="px-5 py-3 text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] border-b border-[#e2e8f0] dark:border-[#334155] uppercase tracking-wider">Sourced Items</th>
                    <th className="px-5 py-3 text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] border-b border-[#e2e8f0] dark:border-[#334155] uppercase tracking-wider">Sourced Qty</th>
                    <th className="px-5 py-3 text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] border-b border-[#e2e8f0] dark:border-[#334155] uppercase tracking-wider">Total Value</th>
                    <th className="px-5 py-3 text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] border-b border-[#e2e8f0] dark:border-[#334155] uppercase tracking-wider text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0] dark:divide-[#334155] text-[13px]">
                  {mockOrders.map((po, index) => (
                    <tr key={index} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-5 py-4 font-bold text-[#2E37A4] dark:text-[#5C67F2]">{po.code}</td>
                      <td className="px-5 py-4 font-semibold text-slate-500">{po.date}</td>
                      <td className="px-5 py-4 font-bold text-slate-700 dark:text-slate-350">{po.items}</td>
                      <td className="px-5 py-4 font-bold text-slate-700 dark:text-slate-350">{po.qty}</td>
                      <td className="px-5 py-4 font-black text-slate-800 dark:text-white">{po.cost}</td>
                      <td className="px-5 py-4 text-right">
                        <span className="px-2 py-0.5 rounded-[5px] text-[10px] font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-900/30 uppercase leading-none">
                          {po.status}
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

    </div>
  );
}
