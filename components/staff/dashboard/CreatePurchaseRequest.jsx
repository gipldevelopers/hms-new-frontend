"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Trash2,
  AlertTriangle,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const INITIAL_ITEMS = [
  {
    id: "1",
    name: "Surgical Gloves Sterile (Sz 7.5)",
    sku: "ETS-48300",
    current: 180,
    minLevel: 500,
    reqQty: 400,
    vendor: "Ansell Med",
    unitCost: 8.00
  },
  {
    id: "2",
    name: "N95 Respirator Masks (Regular)",
    sku: "ETS-88231",
    current: 85,
    minLevel: 200,
    reqQty: 300,
    vendor: "3M Health",
    unitCost: 24.50
  },
  {
    id: "3",
    name: "Amoxicillin Trihydrate 500mg",
    sku: "ETS-11234",
    current: 1200,
    minLevel: 1500,
    reqQty: 1000,
    vendor: "Pfizer Inc.",
    unitCost: 5.00
  }
];

const DEPARTMENTS = [
  "General Ward",
  "Central Pharmacy",
  "Reception",
  "Laboratory",
  "Emergency",
  "Surgical Unit"
];

const USERS = [
  "Ayush Solanki (Staff)",
  "John Doe (Receptionist)",
  "Sarah Alvi (Store Manager)",
  "Dr. J. Mercer (Chief Pharmacist)",
  "Jane Smith (Technician)"
];

export default function CreatePurchaseRequest({ onBack }) {
  const router = useRouter();

  const [department, setDepartment] = useState("General Ward");
  const [requestedBy, setRequestedBy] = useState("Ayush Solanki (Staff)");
  const [requiredDate, setRequiredDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });
  const [priority, setPriority] = useState("Urgent");
  const [reason, setReason] = useState(
    "Surgical Gloves and Masks below critical threshold. Amoxicillin near reorder point. Urgently needed before weekly O.T. schedule."
  );

  const [items, setItems] = useState(INITIAL_ITEMS);

  // Calculate totals
  const totalCost = items.reduce((sum, item) => sum + (item.reqQty * item.unitCost), 0);
  const totalItemsCount = items.length;

  const handleQtyChange = (id, val) => {
    const qty = parseFloat(val) || 0;
    setItems(prev => prev.map(item => item.id === id ? { ...item, reqQty: qty } : item));
  };

  const handleUnitCostChange = (id, val) => {
    const cost = parseFloat(val) || 0;
    setItems(prev => prev.map(item => item.id === id ? { ...item, unitCost: cost } : item));
  };

  const handleItemFieldChange = (id, field, val) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: val } : item));
  };

  const handleDeleteItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleAddItem = () => {
    const newItem = {
      id: Date.now().toString(),
      name: "New Item",
      sku: "SKU-" + Math.floor(10000 + Math.random() * 90000),
      current: 0,
      minLevel: 100,
      reqQty: 100,
      vendor: "Generic Supplier",
      unitCost: 10.00
    };
    setItems(prev => [...prev, newItem]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authtoken");
    const userStr = localStorage.getItem("user");
    if (!token || !userStr) {
      alert("You must be logged in to submit a request.");
      return;
    }

    let branchId = "";
    try {
      branchId = JSON.parse(userStr).branchId;
    } catch (err) {
      console.error("Failed to parse user branchId", err);
    }

    const payload = {
      department,
      requestedBy,
      date: requiredDate,
      priority,
      items: items.map((item, idx) => ({
        id: idx + 1,
        qty: item.reqQty,
        sku: item.sku,
        name: item.name,
        unit: item.unitType || "units",
        total: item.reqQty * item.unitCost,
        unitPrice: item.unitCost
      }))
    };

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";
      const res = await fetch(`${API_URL}/approvals?branchId=${branchId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        alert("Purchase Request submitted successfully!");
        if (onBack) onBack();
        else router.back();
      } else {
        alert(data.error || "Failed to submit Purchase Request");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server. Please try again.");
    }
  };


  return (
    <div className="flex-1 p-6 bg-slate-50/50 dark:bg-slate-900/20 max-w-[1600px] mx-auto min-h-screen font-sans transition-colors duration-300">
      {/* Top Header Row */}
      <div className="flex justify-between items-center mb-6 bg-white dark:bg-[#1e293b] p-4 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onBack ? onBack() : router.back()}
            className="flex items-center justify-center w-10 h-10 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#0A0F1D] text-slate-600 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="space-y-0.5">
            <h1 className="text-[20px] font-bold text-slate-800 dark:text-white leading-none tracking-tight">
              Create New Purchase Request
            </h1>
            <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">
              Request vendor procurement for low or critical stock items.
            </p>
          </div>
        </div>

        {/* Dept Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-[5px] bg-slate-100 dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155]">
          <span className="w-2 h-2 rounded-full bg-[#10B981]" />
          <span className="text-[12px] font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">
            DEPT: General Ward & Nursing
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

          {/* Left Column: Request Information (Col-Span 4) */}
          <div className="lg:col-span-4 bg-white dark:bg-[#1e293b] p-5 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] flex flex-col gap-5 shadow-none h-full">
            <div>
              <h3 className="text-[14px] font-bold text-slate-855 dark:text-white leading-none">
                Request Information
              </h3>
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-505 mt-1">
                Fill in the metadata for this procurement request
              </p>
            </div>

            {/* Requesting Department */}
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-slate-700 dark:text-slate-300">
                Requesting Department *
              </label>
              <div className="relative">
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full h-10 px-3 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-medium outline-none focus:border-[#2E37A4] text-slate-800 dark:text-white appearance-none cursor-pointer pr-10"
                  required
                >
                  {DEPARTMENTS.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="6 9 12 15 18 9" /></svg>
                </span>
              </div>
            </div>

            {/* Requested By */}
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-slate-700 dark:text-slate-300">
                Requested By *
              </label>
              <div className="relative">
                <select
                  value={requestedBy}
                  onChange={(e) => setRequestedBy(e.target.value)}
                  className="w-full h-10 px-3 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-medium outline-none focus:border-[#2E37A4] text-slate-800 dark:text-white appearance-none cursor-pointer pr-10"
                  required
                >
                  {USERS.map(user => (
                    <option key={user} value={user}>{user}</option>
                  ))}
                </select>
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="6 9 12 15 18 9" /></svg>
                </span>
              </div>
            </div>

            {/* Required By Date */}
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-slate-700 dark:text-slate-300">
                Required By Date *
              </label>
              <input
                type="date"
                value={requiredDate}
                onChange={(e) => setRequiredDate(e.target.value)}
                className="w-full h-10 px-3 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-medium outline-none focus:border-[#2E37A4] text-slate-800 dark:text-white"
                required
              />
            </div>

            {/* Priority Level */}
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-slate-700 dark:text-slate-300">
                Priority Level *
              </label>

              <div className="space-y-2">
                {/* Urgent */}
                <div
                  onClick={() => setPriority("Urgent")}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-[5px] border cursor-pointer transition-all",
                    priority === "Urgent"
                      ? "bg-red-50/50 border-red-200 dark:bg-red-950/10 dark:border-red-900/40"
                      : "bg-white border-[#e2e8f0] dark:bg-[#0A0F1D] dark:border-[#334155] hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                >
                  <input
                    type="radio"
                    name="priority"
                    checked={priority === "Urgent"}
                    onChange={() => setPriority("Urgent")}
                    className="mt-1 h-3.5 w-3.5 text-red-600 border-red-300 focus:ring-red-500"
                  />
                  <div className="-mt-0.5">
                    <span className="text-[13px] font-bold text-red-600 dark:text-red-400">Urgent</span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      Critical patient care impact
                    </p>
                  </div>
                </div>

                {/* High */}
                <div
                  onClick={() => setPriority("High")}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-[5px] border cursor-pointer transition-all",
                    priority === "High"
                      ? "bg-amber-50/50 border-amber-200 dark:bg-amber-950/10 dark:border-amber-900/40"
                      : "bg-white border-[#e2e8f0] dark:bg-[#0A0F1D] dark:border-[#334155] hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                >
                  <input
                    type="radio"
                    name="priority"
                    checked={priority === "High"}
                    onChange={() => setPriority("High")}
                    className="mt-1 h-3.5 w-3.5 text-amber-600 border-amber-300 focus:ring-amber-500"
                  />
                  <div className="-mt-0.5">
                    <span className="text-[13px] font-bold text-amber-600 dark:text-amber-400">High</span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      Needed within 48 hours
                    </p>
                  </div>
                </div>

                {/* Normal */}
                <div
                  onClick={() => setPriority("Normal")}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-[5px] border cursor-pointer transition-all",
                    priority === "Normal"
                      ? "bg-blue-50/50 border-blue-200 dark:bg-blue-950/10 dark:border-blue-900/40"
                      : "bg-white border-[#e2e8f0] dark:bg-[#0A0F1D] dark:border-[#334155] hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                >
                  <input
                    type="radio"
                    name="priority"
                    checked={priority === "Normal"}
                    onChange={() => setPriority("Normal")}
                    className="mt-1 h-3.5 w-3.5 text-blue-600 border-blue-300 focus:ring-blue-505"
                  />
                  <div className="-mt-0.5">
                    <span className="text-[13px] font-bold text-blue-600 dark:text-blue-400">Normal</span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      Standard procurement cycle
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reason / Justification */}
            <div className="space-y-1.5 flex-1 flex flex-col">
              <label className="text-[12px] font-bold text-slate-700 dark:text-slate-300">
                Reason / Justification
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full flex-1 p-3 text-[13px] leading-relaxed font-medium text-slate-600 dark:text-slate-300 border border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#0A0F1D] rounded-[5px] outline-none focus:border-[#2E37A4] resize-none min-h-[100px]"
              />
            </div>
          </div>

          {/* Right Column (Col-Span 8) */}
          <div className="lg:col-span-8 space-y-6">

            {/* Warning Banner */}
            <div className="flex items-start gap-3 p-4 bg-[#FFFbeb] dark:bg-amber-950/20 border border-[#FCD34D] dark:border-amber-900/30 rounded-[5px]">
              <AlertTriangle className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
              <p className="text-[12px] font-bold text-[#b45309] dark:text-amber-400 leading-snug">
                3 items auto-detected as below minimum stock threshold. Suggested quantities have been pre-filled.
              </p>
            </div>

            {/* Items to Procure Box */}
            <div className="bg-white dark:bg-[#1e293b] p-5 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] space-y-4 shadow-none">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-[14px] font-bold text-slate-855 dark:text-white leading-none">
                    Items to Procure
                  </h3>
                  <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mt-1">
                    Edit quantities before submitting
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="flex items-center gap-1 text-[12px] font-extrabold text-[#2E37A4] dark:text-[#5C67F2] hover:underline"
                >
                  <Plus className="w-4 h-4" /> Add Item Row
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[12.5px]">
                  <thead>
                    <tr className="border-b border-[#e2e8f0] dark:border-[#334155] text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                      <th className="pb-3 pr-2">Item</th>
                      <th className="pb-3 text-center px-2">Current</th>
                      <th className="pb-3 text-center px-2">Min Level</th>
                      <th className="pb-3 text-center px-2 w-[85px]">Req. Qty</th>
                      <th className="pb-3 px-2">Vendor</th>
                      <th className="pb-3 text-center px-2 w-[85px]">Unit Cost</th>
                      <th className="pb-3 text-right pl-2">Total</th>
                      <th className="pb-3 pl-3 w-[40px]"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e2e8f0]/60 dark:divide-[#334155]/60">
                    {items.map((item) => {
                      const itemTotal = item.reqQty * item.unitCost;
                      return (
                        <tr key={item.id} className="align-middle">
                          <td className="py-3 pr-2 max-w-[200px]">
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => handleItemFieldChange(item.id, "name", e.target.value)}
                              className="font-bold text-[13px] text-slate-800 dark:text-white bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#2E37A4] outline-none w-full"
                            />
                            <input
                              type="text"
                              value={item.sku}
                              onChange={(e) => handleItemFieldChange(item.id, "sku", e.target.value)}
                              className="block mt-0.5 text-[9.5px] font-semibold text-slate-400 bg-transparent border-none outline-none w-full"
                            />
                          </td>
                          <td className="py-3 text-center px-2 font-bold text-red-500 dark:text-red-400">
                            {item.current}
                          </td>
                          <td className="py-3 text-center px-2 font-medium text-slate-500 dark:text-slate-400">
                            {item.minLevel}
                          </td>
                          <td className="py-3 text-center px-2">
                            <input
                              type="number"
                              value={item.reqQty || ""}
                              onChange={(e) => handleQtyChange(item.id, e.target.value)}
                              className="w-[75px] h-8 text-center bg-[#F8F9FC] dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[12px] font-bold text-slate-800 dark:text-white outline-none focus:border-[#2E37A4] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                          </td>
                          <td className="py-3 px-2">
                            <input
                              type="text"
                              value={item.vendor}
                              onChange={(e) => handleItemFieldChange(item.id, "vendor", e.target.value)}
                              className="font-medium text-slate-600 dark:text-slate-305 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#2E37A4] outline-none w-full"
                            />
                          </td>
                          <td className="py-3 text-center px-2">
                            <div className="flex items-center justify-center gap-0.5">
                              <span className="text-[12px] font-medium text-slate-400">$</span>
                              <input
                                type="number"
                                step="0.01"
                                value={item.unitCost || ""}
                                onChange={(e) => handleUnitCostChange(item.id, e.target.value)}
                                className="w-[65px] h-8 text-center bg-transparent border-b border-transparent hover:border-slate-305 focus:border-[#2E37A4] outline-none font-bold text-slate-800 dark:text-white"
                              />
                            </div>
                          </td>
                          <td className="py-3 text-right pl-2 font-bold text-[13px] text-slate-808 dark:text-white">
                            ₹{itemTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="py-3 pl-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleDeleteItem(item.id)}
                              className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Total Summary Row */}
              <div className="flex justify-end pt-4 border-t border-[#e2e8f0] dark:border-[#334155]">
                <div className="flex items-center gap-3">
                  <span className="text-[12px] font-bold text-slate-505 dark:text-slate-400">
                    Estimated Total Procurement Cost
                  </span>
                  <span className="text-[18px] font-extrabold text-[#2E37A4] dark:text-[#5C67F2] tracking-tight">
                    ₹{totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* Approval Routing Box */}
            <div className="bg-white dark:bg-[#1e293b] p-5 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] space-y-4 shadow-none">
              <h3 className="text-[12px] font-extrabold tracking-wider text-slate-400 dark:text-slate-505 uppercase leading-none">
                APPROVAL ROUTING
              </h3>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-2">
                {/* Step 1: Initiator */}
                <div className="flex-1 w-full sm:w-auto flex flex-col items-center justify-center p-3 rounded-[5px] border border-[#DEDFEE] bg-[#EEF0FA] dark:bg-indigo-950/20 dark:border-indigo-900/30 text-center">
                  <span className="text-[12px] font-bold text-indigo-700 dark:text-indigo-400 leading-tight block text-ellipsis overflow-hidden whitespace-nowrap w-full">
                    Ayush Solanki
                  </span>
                  <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-extrabold tracking-wide uppercase mt-1">
                    Initiator
                  </span>
                </div>

                {/* Arrow */}
                <div className="shrink-0 flex justify-center text-slate-400">
                  <ArrowRight className="w-4 h-4 rotate-90 sm:rotate-0" />
                </div>
                {/* Step 2: Pharmacist Review */}
                <div className="flex-1 w-full sm:w-auto flex flex-col items-center justify-center p-3 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#0A0F1D] text-center">
                  <span className="text-[12px] font-bold text-slate-800 dark:text-slate-350 leading-tight block">
                    Dr. J. Mercer
                  </span>
                  <span className="text-[10px] text-slate-455 dark:text-slate-505 font-extrabold tracking-wide uppercase mt-1">
                    Pharmacist Review
                  </span>
                </div>

                {/* Arrow */}
                <div className="shrink-0 flex justify-center text-slate-400">
                  <ArrowRight className="w-4 h-4 rotate-90 sm:rotate-0" />
                </div>

                {/* Step 3: Final Authorization */}
                <div className="flex-1 w-full sm:w-auto flex flex-col items-center justify-center p-3 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#0A0F1D] text-center">
                  <span className="text-[12px] font-bold text-slate-800 dark:text-slate-355 leading-tight block">
                    Purchase Manager
                  </span>
                  <span className="text-[10px] text-slate-455 dark:text-slate-500 font-extrabold tracking-wide uppercase mt-1">
                    Final Authorization
                  </span>
                </div>

                {/* Arrow */}
                <div className="shrink-0 flex justify-center text-slate-400">
                  <ArrowRight className="w-4 h-4 rotate-90 sm:rotate-0" />
                </div>

                {/* Step 4: Budget Approval */}
                <div className="flex-1 w-full sm:w-auto flex flex-col items-center justify-center p-3 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#0A0F1D] text-center">
                  <span className="text-[12px] font-bold text-slate-805 dark:text-slate-355 leading-tight block">
                    Finance Head
                  </span>
                  <span className="text-[10px] text-slate-455 dark:text-slate-500 font-extrabold tracking-wide uppercase mt-1">
                    Budget Approval
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions Strip */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-[#1e293b] p-4 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155]">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2E37A4] dark:bg-[#5C67F2]" />
                <span className="text-[12.5px] font-bold text-slate-700 dark:text-slate-300">
                  {totalItemsCount} items ready. Estimated cost <span className="text-slate-850 dark:text-white font-bold">₹{totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </span>
              </div>

              <div className="flex gap-3 w-full sm:w-auto shrink-0 justify-end">
                <button
                  type="button"
                  onClick={() => onBack ? onBack() : router.back()}
                  className="h-10 px-5 rounded-[5px] border border-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 text-[12px] font-bold text-red-500 transition-all cursor-pointer bg-white dark:bg-transparent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 px-6 rounded-[5px] bg-[#2E37A4] hover:bg-[#232a7d] text-[12px] font-bold text-white transition-all cursor-pointer shadow-none border-none"
                >
                  Submit for Approval
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
