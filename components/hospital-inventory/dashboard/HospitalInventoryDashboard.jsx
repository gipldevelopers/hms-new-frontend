"use client";

import React, { useState } from "react";
import { Plus, FilePlus } from "lucide-react";
import { StatCards } from "./StatCards";
import { InventoryValueTrends } from "./InventoryValueTrends";
import { DepartmentConsumption } from "./DepartmentConsumption";
import { LiveInventoryAlert } from "./LiveInventoryAlert";
import { PendingApprovals } from "./PendingApprovals";
import { StockHealthStatus } from "./StockHealthStatus";
import { ExpiryRiskTable } from "./ExpiryRiskTable";

export function HospitalInventoryDashboard() {
  const [showAddStock, setShowAddStock] = useState(false);
  const [showCreatePO, setShowCreatePO] = useState(false);
  const [qty, setQty] = useState(2500);
  const [cost, setCost] = useState(120);

  const totalValue = qty * cost;

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowAddStock(false);
        setShowCreatePO(false);
      }
    };
    if (showAddStock || showCreatePO) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showAddStock, showCreatePO]);

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50 dark:bg-slate-900/20 max-w-[1600px] mx-auto">
      {/* Premium Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-[22px] font-extrabold text-slate-800 dark:text-white leading-none tracking-tight">
            Dashboard
          </h1>
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => setShowCreatePO(true)}
            className="flex items-center gap-1.5 h-10 px-4 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1e293b] hover:bg-muted text-[13px] font-bold text-foreground transition-all cursor-pointer shadow-none"
          >
            <FilePlus className="w-4 h-4 text-[#2E37A4] dark:text-[#5C67F2]" /> Create Purchase Order
          </button>
          <button
            onClick={() => setShowAddStock(true)}
            className="flex items-center gap-1.5 h-10 px-4 rounded-[5px] border border-[#2E37A4] dark:border-[#5C67F2] bg-[#2E37A4] hover:bg-[#232a7d] dark:bg-[#5C67F2] dark:hover:bg-[#4b55e2] text-[13px] font-bold text-white transition-all cursor-pointer shadow-none"
          >
            <Plus className="w-4 h-4" /> Add Stock
          </button>
        </div>
      </div>

      {/* 1. Main Stat Cards Row (8 stats) */}
      <StatCards />

      {/* 2. Charts Row (Trends & Department Consumption) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <InventoryValueTrends />
        <DepartmentConsumption />
      </div>

      {/* 3. Alerts, Approvals, Circular Health Column Block (Refined with 60-40% remaining space split) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        <div className="lg:col-span-4 flex flex-col">
          <LiveInventoryAlert />
        </div>
        <div className="lg:col-span-5 flex flex-col">
          <PendingApprovals />
        </div>
        <div className="lg:col-span-3 flex flex-col">
          <StockHealthStatus />
        </div>
      </div>

      {/* 4. Bottom Table: Expiry Risk Management */}
      <ExpiryRiskTable />

      {/* Add Stock Popup with Backdrop Blur Overlay (Handoff Replication) */}
      {showAddStock && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[0.5px] transition-all duration-300">
          {/* Modal Container */}
          <div className="bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-[8px] w-full max-w-4xl flex flex-col overflow-hidden shadow-2xl animate-in fade-in-50 zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-[#e2e8f0] dark:border-[#334155] px-6 py-4 bg-white dark:bg-[#1e293b]">
              <h3 className="text-[16px] font-bold text-slate-800 dark:text-white leading-none">
                Add Stock
              </h3>
              <button
                onClick={() => setShowAddStock(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" /></svg>
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={(e) => { e.preventDefault(); setShowAddStock(false); }} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-5 bg-[#F8F9FC] dark:bg-[#0A0F1D] overflow-hidden">

                {/* Single Unified Card Wrapper (matches mockup perfectly) */}
                <div className="bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-[6px] p-5 space-y-5 shadow-none">

                  {/* 1. Item Identification Section */}
                  <div className="space-y-2.5">
                    <h4 className="text-[14px] font-bold text-slate-800 dark:text-white leading-none">
                      Item Identification
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[12px] font-semibold text-slate-700 dark:text-slate-300">
                          Select Item <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            className="w-full h-[38px] px-3 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-medium outline-none focus:border-[#2E37A4] text-slate-800 dark:text-white appearance-none cursor-pointer pr-10"
                            required
                          >
                            <option>Propofol 10mg/mL Injection (20ml)</option>
                            <option>Sterile surgical gloves (Box of 100)</option>
                          </select>
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="6 9 12 15 18 9" /></svg>
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[12px] font-semibold text-slate-700 dark:text-slate-300">
                          Linked Purchase Order <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          defaultValue="PO-2025-9812"
                          className="w-full h-[38px] px-3 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-medium outline-none focus:border-[#2E37A4] text-slate-800 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. Batch & Expiry Management Section */}
                  <div className="space-y-2.5">
                    <h4 className="text-[14px] font-bold text-slate-800 dark:text-white leading-none">
                      Batch & Expiry Management
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <label className="text-[12px] font-semibold text-slate-700 dark:text-slate-300">Batch Code</label>
                        <input
                          type="text"
                          defaultValue="B-PPF9021-X9"
                          className="w-full h-[38px] px-3 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-medium outline-none focus:border-[#2E37A4] text-slate-800 dark:text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[12px] font-semibold text-slate-700 dark:text-slate-300">Serial ID</label>
                        <div className="relative">
                          <input
                            type="text"
                            defaultValue="RF-882910-A"
                            className="w-full h-[38px] pl-3 pr-9 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-medium outline-none focus:border-[#2E37A4] text-slate-800 dark:text-white"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-slate-600 dark:hover:text-slate-200">
                            {/* Barcode scanner icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M7 7h2v2H7z" /><path d="M7 15h2v2H7z" /><path d="M15 7h2v2h-2z" /><path d="M15 15h2v2h-2z" /><path d="M11 11h2v2h-2z" /></svg>
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[12px] font-semibold text-slate-700 dark:text-slate-300">Manufactured Date</label>
                        <div className="relative">
                          <input
                            type="text"
                            defaultValue="2025-01-10"
                            className="w-full h-[38px] pl-3 pr-9 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-medium outline-none focus:border-[#2E37A4] text-slate-800 dark:text-white cursor-pointer"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                            {/* Calendar icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[12px] font-semibold text-slate-700 dark:text-slate-300">Expiry Date</label>
                        <div className="relative">
                          <input
                            type="text"
                            defaultValue="2027-06-30"
                            className="w-full h-[38px] pl-3 pr-9 bg-[#FFF5F5] dark:bg-red-950/20 border border-[#FEB2B2] dark:border-red-900/30 rounded-[5px] text-[13px] font-bold text-[#E53E3E] outline-none focus:border-red-500 cursor-pointer"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#E53E3E] pointer-events-none">
                            {/* Red calendar icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. Quantities, Pricing & Location Section */}
                  <div className="space-y-2.5">
                    <h4 className="text-[14px] font-bold text-slate-800 dark:text-white leading-none">
                      Quantities, Pricing & Location
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <label className="text-[12px] font-semibold text-slate-700 dark:text-slate-300">QTY Received</label>
                        <input
                          type="number"
                          value={qty}
                          onChange={(e) => setQty(Number(e.target.value))}
                          className="w-full h-[38px] px-3 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-medium outline-none focus:border-[#2E37A4] text-slate-800 dark:text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[12px] font-semibold text-slate-700 dark:text-slate-300">Unit of Measure</label>
                        <div className="relative">
                          <select
                            className="w-full h-[38px] px-3 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-medium outline-none focus:border-[#2E37A4] text-slate-800 dark:text-white appearance-none cursor-pointer pr-10"
                          >
                            <option>Vials (20ml)</option>
                            <option>Boxes</option>
                            <option>Bottles</option>
                          </select>
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="6 9 12 15 18 9" /></svg>
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[12px] font-semibold text-slate-700 dark:text-slate-300">Unit Sourcing Cost</label>
                        <input
                          type="text"
                          value={`₹${cost}`}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, "");
                            setCost(Number(val));
                          }}
                          className="w-full h-[38px] px-3 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-medium outline-none focus:border-[#2E37A4] text-slate-800 dark:text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[12px] font-semibold text-slate-700 dark:text-slate-300">Calculated Total Value</label>
                        <input
                          type="text"
                          value={qty === 2500 && cost === 120 ? "₹142000" : `₹${totalValue.toLocaleString()}`}
                          className="w-full h-[38px] px-3 bg-[#F8F9FC] dark:bg-slate-800 border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-bold text-slate-750 dark:text-slate-200 outline-none"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                      <div className="space-y-1">
                        <label className="text-[12px] font-semibold text-slate-700 dark:text-slate-300">Target Store Location</label>
                        <div className="relative">
                          <select className="w-full h-[38px] px-3 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-medium outline-none focus:border-[#2E37A4] text-slate-800 dark:text-white appearance-none cursor-pointer pr-10">
                            <option>Shalby</option>
                            <option>Central Pharmacy</option>
                          </select>
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="6 9 12 15 18 9" /></svg>
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[12px] font-semibold text-slate-700 dark:text-slate-300">Supplier/Contract Vendor</label>
                        <div className="relative">
                          <select className="w-full h-[38px] px-3 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-medium outline-none focus:border-[#2E37A4] text-slate-800 dark:text-white appearance-none cursor-pointer pr-10">
                            <option>Baxter Healthcare Corp (Approved Contract)</option>
                          </select>
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="6 9 12 15 18 9" /></svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1e293b] shrink-0">
                <button
                  type="button"
                  onClick={() => setShowAddStock(false)}
                  className="h-10 px-6 rounded-[4px] border border-[#EF4444] bg-white hover:bg-red-50 text-[12px] font-bold text-[#EF4444] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 px-6 rounded-[4px] bg-[#2E37A4] hover:bg-[#232a7d] text-[12px] font-bold text-white transition-all cursor-pointer"
                >
                  Add Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Purchase Order Popup with Backdrop Blur Overlay (Mockup Replication) */}
      {showCreatePO && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[0.5px] transition-all duration-300">
          {/* Modal Container */}
          <div className="bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-[8px] w-full max-w-6xl flex flex-col overflow-hidden shadow-2xl animate-in fade-in-50 zoom-in-95 duration-200">

            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-[#e2e8f0] dark:border-[#334155] px-6 py-4 bg-white dark:bg-[#1e293b]">
              <h3 className="text-[16px] font-bold text-slate-800 dark:text-white leading-none">
                Create Purchase Order
              </h3>
              <button
                onClick={() => setShowCreatePO(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" /></svg>
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={(e) => { e.preventDefault(); setShowCreatePO(false); }} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-5 bg-[#F8F9FC] dark:bg-[#0A0F1D] overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                  {/* Left Column (2 Cols - Sourced Line Items & Justifications in a Single Box) */}
                  <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-[6px] overflow-hidden shadow-none flex flex-col justify-between h-full">

                      <div className="p-5 space-y-4">
                        {/* Card 1: Sourced Line Items */}
                        <div className="flex justify-between items-center">
                          <h4 className="text-[11px] font-extrabold tracking-wider text-slate-500 dark:text-slate-400 leading-none">
                            SOURCED LINE ITEMS
                          </h4>
                          <button
                            type="button"
                            className="flex items-center gap-1.5 h-8 px-3 border border-[#2E37A4] hover:bg-[#2E37A4]/5 text-[11px] font-bold text-[#2E37A4] dark:text-[#5c68e2] dark:border-[#5c68e2] rounded-[5px] transition-all cursor-pointer bg-white dark:bg-slate-800"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><circle cx="11" cy="11" r="8" /><line x1="21" x2="16.65" y1="21" y2="16.65" /></svg>
                            Browse Catalog
                          </button>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-[#e2e8f0] dark:border-[#334155]">
                                <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">PRODUCT / DESCRIPTION</th>
                                <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">CURRENT STOCK</th>
                                <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">ORDER QTY</th>
                                <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">UNIT COST</th>
                                <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">TOTAL PRICE</th>
                                <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right"></th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#e2e8f0]/60 dark:divide-[#334155]/60">

                              {/* Row 1 */}
                              <tr>
                                <td className="py-2.5 pr-2">
                                  <div className="font-bold text-[13px] text-slate-805 dark:text-white">Propofol 10mg/mL Injection (20ml)</div>
                                  <span className="inline-block mt-0.5 text-[9.5px] font-bold bg-[#EDF2F7] dark:bg-slate-700 text-slate-500 dark:text-slate-300 px-1.5 py-0.5 rounded tracking-wide w-fit">
                                    SKU-PRP-9021
                                  </span>
                                </td>
                                <td className="py-2.5 text-[12px] font-medium text-slate-500 dark:text-slate-400 text-right">1,450 vials</td>
                                <td className="py-2.5 text-center">
                                  <input
                                    type="text"
                                    defaultValue="2,500"
                                    className="w-[70px] h-8 text-center bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[12px] font-bold text-slate-800 dark:text-white outline-none focus:border-[#2E37A4]"
                                  />
                                </td>
                                <td className="py-2.5">
                                  <div className="flex items-center justify-center gap-1">
                                    <span className="text-[12px] font-medium text-slate-400">₹</span>
                                    <input
                                      type="text"
                                      defaultValue="3.00"
                                      className="w-[70px] h-8 text-center bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[12px] font-bold text-slate-800 dark:text-white outline-none focus:border-[#2E37A4]"
                                    />
                                  </div>
                                </td>
                                <td className="py-2.5 text-right font-bold text-[13px] text-slate-808 dark:text-white">₹7,500.00</td>
                                <td className="py-2.5 text-right pl-3">
                                  <button type="button" className="text-red-400 hover:text-red-655 transition-colors cursor-pointer">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                                  </button>
                                </td>
                              </tr>

                              {/* Row 2 */}
                              <tr>
                                <td className="py-2.5 pr-2">
                                  <div className="font-bold text-[13px] text-slate-805 dark:text-white">Amoxicillin Trihydrate 500mg</div>
                                  <span className="inline-block mt-0.5 text-[9.5px] font-bold bg-[#EDF2F7] dark:bg-slate-700 text-slate-500 dark:text-slate-300 px-1.5 py-0.5 rounded tracking-wide w-fit">
                                    SKU-AMX-1120
                                  </span>
                                </td>
                                <td className="py-2.5 text-[12px] font-medium text-slate-500 dark:text-slate-400 text-right">8,200 caps</td>
                                <td className="py-2.5 text-center">
                                  <input
                                    type="text"
                                    defaultValue="10,000"
                                    className="w-[70px] h-8 text-center bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[12px] font-bold text-slate-800 dark:text-white outline-none focus:border-[#2E37A4]"
                                  />
                                </td>
                                <td className="py-2.5">
                                  <div className="flex items-center justify-center gap-1">
                                    <span className="text-[12px] font-medium text-slate-400">₹</span>
                                    <input
                                      type="text"
                                      defaultValue="0.15"
                                      className="w-[70px] h-8 text-center bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[12px] font-bold text-slate-800 dark:text-white outline-none focus:border-[#2E37A4]"
                                    />
                                  </div>
                                </td>
                                <td className="py-2.5 text-right font-bold text-[13px] text-slate-808 dark:text-white">₹1,500.00</td>
                                <td className="py-2.5 text-right pl-3">
                                  <button type="button" className="text-red-400 hover:text-red-655 transition-colors cursor-pointer">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                                  </button>
                                </td>
                              </tr>

                              {/* Row 3 */}
                              <tr>
                                <td className="py-2.5 pr-2">
                                  <div className="font-bold text-[13px] text-slate-805 dark:text-white">Disposable Syringes 5ml with Needle</div>
                                  <span className="inline-block mt-0.5 text-[9.5px] font-bold bg-[#EDF2F7] dark:bg-slate-700 text-slate-500 dark:text-slate-300 px-1.5 py-0.5 rounded tracking-wide w-fit">
                                    SKU-SYR-05ML
                                  </span>
                                </td>
                                <td className="py-2.5 text-[12px] font-medium text-slate-500 dark:text-slate-400 text-right">12,000 units</td>
                                <td className="py-2.5 text-center">
                                  <input
                                    type="text"
                                    defaultValue="15,000"
                                    className="w-[70px] h-8 text-center bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[12px] font-bold text-slate-800 dark:text-white outline-none focus:border-[#2E37A4]"
                                  />
                                </td>
                                <td className="py-2.5">
                                  <div className="flex items-center justify-center gap-1">
                                    <span className="text-[12px] font-medium text-slate-400">₹</span>
                                    <input
                                      type="text"
                                      defaultValue="0.30"
                                      className="w-[70px] h-8 text-center bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[12px] font-bold text-slate-800 dark:text-white outline-none focus:border-[#2E37A4]"
                                    />
                                  </div>
                                </td>
                                <td className="py-2.5 text-right font-bold text-[13px] text-slate-808 dark:text-white">₹4,500.00</td>
                                <td className="py-2.5 text-right pl-3">
                                  <button type="button" className="text-red-400 hover:text-red-655 transition-colors cursor-pointer">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                                  </button>
                                </td>
                              </tr>

                            </tbody>
                          </table>
                        </div>

                        {/* Card 2: Sourcing Justification */}
                        <div className="space-y-1.5 pt-2">
                          <h4 className="text-[11px] font-extrabold tracking-wider text-slate-500 dark:text-slate-400 leading-none">
                            SOURCING JUSTIFICATION / INSTRUCTIONS
                          </h4>
                          <textarea
                            rows="2"
                            defaultValue="Surgical supplies levels reached critical thresholds (less than 15 days of operating volume). Immediate fast-track shipment approved by Logistics Committee."
                            className="w-full p-3 text-[13px] leading-relaxed font-medium text-slate-600 dark:text-slate-350 border border-[#e2e8f0] dark:border-[#334155] bg-[#F8F9FC] dark:bg-[#0A0F1D] rounded-[5px] outline-none focus:border-[#2E37A4] resize-none"
                          />
                        </div>
                      </div>

                      {/* Grand Sourcing Totals Strip (Dark Indigo) */}
                      <div className="bg-[#0A0F1D] dark:bg-slate-950 p-4 flex justify-between items-center text-white shrink-0">
                        <div>
                          <div className="text-[9px] font-extrabold text-slate-400 tracking-wider">TOTAL SOURCED QTY</div>
                          <div className="text-[15px] font-black text-white mt-0.5">27,500 units</div>
                        </div>
                        <div>
                          <div className="text-[9px] font-extrabold text-slate-400 tracking-wider">PRE-NEGOTIATED SAVINGS</div>
                          <div className="text-[15px] font-black text-white mt-0.5">₹1,250.00</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[9px] font-extrabold text-slate-400 tracking-wider">GRAND SOURCING TOTAL</div>
                          <div className="text-[20px] font-black text-white mt-0.5 tracking-tight">₹13,500.00</div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Right Column (1 Col - Supplier & Delivery Details) */}
                  <div className="lg:col-span-1 space-y-4">

                    {/* Card 3: Supplier Details */}
                    <div className="bg-white dark:bg-[#1e293b] p-5 rounded-[6px] border border-[#e2e8f0] dark:border-[#334155] space-y-4 shadow-none">
                      <h4 className="text-[11px] font-extrabold tracking-wider text-slate-500 dark:text-slate-400 leading-none">
                        SUPPLIER DETAILS
                      </h4>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400">SELECT VENDOR</label>
                        <div className="relative">
                          <select className="w-full h-10 pl-9 pr-10 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-bold text-slate-800 dark:text-white appearance-none cursor-pointer">
                            <option>Baxter Healthcare Corp</option>
                          </select>
                          {/* Green indicator dot on the left */}
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#00A389]" />
                          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="6 9 12 15 18 9" /></svg>
                          </span>
                        </div>
                      </div>

                      {/* Sub Info Card */}
                      <div className="p-3.5 border border-[#e2e8f0] dark:border-[#334155] bg-[#F8F9FC] dark:bg-[#0A0F1D] rounded-[5px] space-y-2">
                        <div className="flex justify-between items-center text-[12px]">
                          <span className="font-semibold text-slate-400">Contract Ref:</span>
                          <span className="font-bold text-slate-850 dark:text-slate-200">BAXTER-MED-2025</span>
                        </div>
                        <div className="flex justify-between items-center text-[12px]">
                          <span className="font-semibold text-slate-400">Payment Terms:</span>
                          <span className="font-bold text-slate-850 dark:text-slate-200">Net 45</span>
                        </div>
                        <div className="flex justify-between items-center text-[12px]">
                          <span className="font-semibold text-slate-400">Primary Contact:</span>
                          <span className="font-bold text-slate-850 dark:text-slate-200">Johnathan Reed (Baxter)</span>
                        </div>
                      </div>
                    </div>

                    {/* Card 4: Delivery & Terms */}
                    <div className="bg-white dark:bg-[#1e293b] p-5 rounded-[6px] border border-[#e2e8f0] dark:border-[#334155] space-y-4 shadow-none">
                      <h4 className="text-[11px] font-extrabold tracking-wider text-slate-500 dark:text-slate-400 leading-none">
                        DELIVERY & TERMS
                      </h4>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400">TARGET DELIVERY STORE</label>
                        <div className="relative">
                          <select className="w-full h-10 px-3 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-bold text-slate-800 dark:text-white appearance-none cursor-pointer pr-10">
                            <option>Main Central Pharmacy Store</option>
                          </select>
                          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="6 9 12 15 18 9" /></svg>
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400">SHIPPING URGENCY</label>
                        <div className="relative">
                          <select className="w-full h-10 pl-9 pr-10 bg-[#FFF5F5] dark:bg-red-950/20 border border-[#FEB2B2] dark:border-red-900/30 rounded-[5px] text-[13px] font-bold text-[#E53E3E] appearance-none cursor-pointer">
                            <option>Emergency Expedited (24h)</option>
                          </select>
                          {/* Bolt icon */}
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#E53E3E] pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                          </span>
                          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#E53E3E]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="6 9 12 15 18 9" /></svg>
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1e293b] shrink-0">
                <button
                  type="button"
                  onClick={() => setShowCreatePO(false)}
                  className="h-10 px-6 rounded-[4px] border border-[#2E37A4] dark:border-[#5c68e2] bg-white dark:bg-[#1e293b] hover:bg-[#2E37A4]/5 text-[12px] font-bold text-[#2E37A4] dark:text-[#5c68e2] transition-all cursor-pointer"
                >
                  Save as Draft
                </button>
                <button
                  type="submit"
                  className="h-10 px-6 rounded-[4px] bg-[#2E37A4] hover:bg-[#232a7d] text-[12px] font-bold text-white transition-all cursor-pointer"
                >
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default HospitalInventoryDashboard;
