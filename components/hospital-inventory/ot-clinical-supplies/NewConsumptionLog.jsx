"use client";

import React, { useState } from "react";
import { Search, ChevronDown, Trash2, Plus, Info, AlertTriangle, X } from "lucide-react";
import { toast } from "sonner";

// Mock Inventory Items for Add Item Dialog
const INVENTORY_ITEMS = [
  { name: "Surgical Mask - N95 Premium", category: "Consumables | Sterile", stock: "450 Units", batch: "BN-992-K (Exp: 12/2025)", unit: "Units (Pack of 50)", price: 2.50 },
  { name: "Disposable Scalpels #15", category: "Instruments | Sterile", stock: "120 Units", batch: "S-8839-C (Exp: 08/2026)", unit: "Unit", price: 6.50 },
  { name: "Surgical Sutures (Nylon 4-0)", category: "Supplies | Sterile", stock: "280 Packs", batch: "B-9982-X (Exp: 04/2027)", unit: "Pack", price: 5.50 },
  { name: "Sterile Gauze Pads (4x4)", category: "Consumables | Sterile", stock: "800 Boxes", batch: "G-2210-A (Exp: 11/2026)", unit: "Box (10pcs)", price: 1.20 }
];

export function NewConsumptionLog({ onCancel, onSave }) {
  // Mock search/filters
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [stockStatus, setStockStatus] = useState("All");

  // Pop-up Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalSearchQuery, setModalSearchQuery] = useState("Surgical Mask - N95");
  const [selectedInvItem, setSelectedInvItem] = useState(INVENTORY_ITEMS[0]);
  const [modalUsedQty, setModalUsedQty] = useState("10");
  const [modalBatch, setModalBatch] = useState(INVENTORY_ITEMS[0].batch);

  // Form State
  const [department, setDepartment] = useState("Cardiology OT");
  const [procedureType, setProcedureType] = useState("");
  const [patientId, setPatientId] = useState("");
  const [date, setDate] = useState("2023-10-24");
  const [surgeon, setSurgeon] = useState("Dr. Sarah Chen (Chief Surgeon)");

  // Items state initialized with the screenshot items
  const [items, setItems] = useState([
    {
      id: "1",
      name: "Surgical Sutures (Nylon 4-0)",
      batch: "B-9982-X",
      usedQty: 12,
      unit: "Pack",
      price: 5.50
    },
    {
      id: "2",
      name: "Sterile Gauze Pads (4x4)",
      batch: "G-2210-A",
      usedQty: 50,
      unit: "Box (10pcs)",
      price: 1.20
    },
    {
      id: "3",
      name: "Disposable Scalpels #15",
      batch: "S-8839-C",
      usedQty: 3,
      unit: "Unit",
      price: 6.50
    }
  ]);

  // Handle quantity changes
  const handleQtyChange = (id, val) => {
    const parsed = parseInt(val) || 0;
    setItems(items.map(item => item.id === id ? { ...item, usedQty: parsed } : item));
  };

  // Delete item
  const handleDeleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  // Add Item handler
  const handleAddItem = () => {
    setModalSearchQuery("Surgical Mask - N95");
    setSelectedInvItem(INVENTORY_ITEMS[0]);
    setModalBatch(INVENTORY_ITEMS[0].batch);
    setModalUsedQty("10");
    setIsAddModalOpen(true);
  };

  // Escape key to cancel/close
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (isAddModalOpen) {
          setIsAddModalOpen(false);
        } else if (onCancel) {
          onCancel();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAddModalOpen, onCancel]);

  // Calculations
  const totalItemsCount = items.length;
  const totalCost = items.reduce((acc, curr) => acc + (curr.usedQty * curr.price), 0);

  const handleSubmit = () => {
    if (items.length === 0) {
      toast.error("Please add at least one item to log consumption.");
      return;
    }
    toast.success("Consumption log saved successfully!");
    if (onSave) {
      onSave({
        department,
        procedureType,
        patientId,
        date,
        surgeon,
        items
      });
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto p-2">
      {/* Header Bar */}
      <div className="flex justify-between items-center">
        <h1 className="text-[20px] font-bold text-slate-800 dark:text-white leading-none tracking-tight">
          New Consumption Log
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="h-10 px-6 rounded-[5px] border border-red-200 dark:border-red-900 bg-red-50/50 hover:bg-red-50 dark:bg-red-950/10 text-[13px] font-bold text-red-600 dark:text-red-400 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="h-10 px-6 rounded-[5px] bg-[#2E37A4] hover:bg-[#232a7d] text-[13px] font-bold text-white transition-all cursor-pointer"
          >
            Save Entry
          </button>
        </div>
      </div>

      {/* Search & Categories Filter Row */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white dark:bg-[#1e293b] p-4 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155]">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search Patient name / Order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] bg-slate-50/50 dark:bg-slate-900/20 text-[13px] text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#2E37A4] transition-all"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* Category Dropdown */}
          <div className="relative">
            <button className="flex items-center justify-between gap-2 h-10 px-4 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1e293b] text-[13px] font-bold text-[#5e6c84] dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
              Category
              <ChevronDown size={14} className="text-slate-500" />
            </button>
          </div>

          {/* Stock Status Dropdown */}
          <div className="relative">
            <button className="flex items-center justify-between gap-2 h-10 px-4 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1e293b] text-[13px] font-bold text-[#5e6c84] dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
              Stock Status
              <ChevronDown size={14} className="text-slate-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Form Area (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Procedure Details Card */}
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155]">
            <h2 className="text-[15px] font-extrabold text-slate-800 dark:text-white mb-5">
              Procedure Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Department */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-450 dark:text-slate-455 uppercase tracking-wide">
                  Department
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full h-10 px-3 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] bg-slate-50/50 dark:bg-slate-900/20 text-[13px] text-slate-800 dark:text-white focus:outline-none focus:border-[#2E37A4]"
                />
              </div>

              {/* Procedure Type */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-450 dark:text-slate-455 uppercase tracking-wide">
                  Procedure Type
                </label>
                <div className="relative">
                  <select
                    value={procedureType}
                    onChange={(e) => setProcedureType(e.target.value)}
                    className="w-full h-10 px-3 pr-10 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] bg-slate-50/50 dark:bg-slate-900/20 text-[13px] text-slate-800 dark:text-white focus:outline-none focus:border-[#2E37A4] appearance-none"
                  >
                    <option value="">Select Procedure...</option>
                    <option value="cardio">Cardiology Bypass</option>
                    <option value="ortho">Orthopedic Joint Replacement</option>
                    <option value="neuro">Neurosurgery Craniotomy</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>

              {/* Patient ID */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-450 dark:text-slate-455 uppercase tracking-wide">
                  Patient ID / Case Ref
                </label>
                <input
                  type="text"
                  placeholder="e.g. PAT-99201"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full h-10 px-3 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] bg-slate-50/50 dark:bg-slate-900/20 text-[13px] text-slate-800 dark:text-white focus:outline-none focus:border-[#2E37A4]"
                />
              </div>

              {/* Date */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-450 dark:text-slate-455 uppercase tracking-wide">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] bg-slate-50/50 dark:bg-slate-900/20 text-[13px] text-slate-800 dark:text-white focus:outline-none focus:border-[#2E37A4]"
                />
              </div>

              {/* Surgeon */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[11px] font-bold text-slate-450 dark:text-slate-455 uppercase tracking-wide">
                  Surgeon / Lead
                </label>
                <div className="relative">
                  <select
                    value={surgeon}
                    onChange={(e) => setSurgeon(e.target.value)}
                    className="w-full h-10 px-3 pr-10 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] bg-slate-50/50 dark:bg-slate-900/20 text-[13px] text-slate-800 dark:text-white focus:outline-none focus:border-[#2E37A4] appearance-none"
                  >
                    <option value="Dr. Sarah Chen (Chief Surgeon)">Dr. Sarah Chen (Chief Surgeon)</option>
                    <option value="Dr. Aris (Consultant)">Dr. Aris (Consultant)</option>
                    <option value="Dr. Elena R. (Anaesthetist)">Dr. Elena R. (Anaesthetist)</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Items Consumed Card */}
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155]">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-[16px] font-bold text-slate-800 dark:text-white">
                Items Consumed
              </h2>
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center gap-1.5 text-[13px] font-bold text-[#2E37A4] hover:text-[#232a7d] transition-colors cursor-pointer"
              >
                <svg
                  className="w-4 h-4 text-[#2E37A4]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v8M8 12h8" />
                </svg>
                Add Item
              </button>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto -mx-6">
              <table className="w-full border-collapse text-left text-[12.5px]">
                <thead>
                  <tr className="border-t border-b border-[#e2e8f0] dark:border-[#334155]">
                    <th className="px-6 py-3.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide w-1/3">
                      Item Name
                    </th>
                    <th className="px-6 py-3.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                      Batch<br />No.
                    </th>
                    <th className="px-6 py-3.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide text-center w-[120px]">
                      Used Qty
                    </th>
                    <th className="px-6 py-3.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                      Unit
                    </th>
                    <th className="px-6 py-3.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide text-right w-[80px]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0] dark:divide-[#334155]/60">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/30 dark:hover:bg-white/5 transition-colors">
                      {/* Item Name */}
                      <td className="px-6 py-4 text-[13px] text-slate-700 dark:text-slate-300 font-medium whitespace-pre-wrap leading-relaxed">
                        {item.name}
                      </td>

                      {/* Batch No */}
                      <td className="px-6 py-4 text-[13px] text-slate-550 dark:text-slate-400 font-medium leading-relaxed font-mono whitespace-pre-wrap">
                        {item.batch}
                      </td>

                      {/* Used Qty */}
                      <td className="px-6 py-4 text-center">
                        <input
                          type="number"
                          value={item.usedQty}
                          onChange={(e) => handleQtyChange(item.id, e.target.value)}
                          className="w-[75px] h-[34px] px-2 rounded-[4px] border border-[#d1d5db] dark:border-[#475569] bg-white dark:bg-[#0f172a] text-[13px] text-slate-800 dark:text-white font-medium focus:outline-none focus:border-[#2E37A4] text-center"
                        />
                      </td>

                      {/* Unit */}
                      <td className="px-6 py-4 text-[13px] text-slate-500 dark:text-slate-450 font-medium">
                        {item.unit}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-1.5 rounded-[4px] text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors inline-flex items-center justify-center cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center text-slate-400 dark:text-slate-500 font-medium">
                        No items added yet. Click "+ Add Item" to add tools or clinical supplies.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Summary Area (1/3 width) */}
        <div className="space-y-6">
          {/* Entry Summary Card */}
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155]">
            <h2 className="text-[15px] font-extrabold text-slate-800 dark:text-white mb-5">
              Entry Summary
            </h2>

            <div className="space-y-4">
              {/* Total Items */}
              <div className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-800">
                <span className="text-[13px] text-slate-550 dark:text-slate-400">
                  Total Items
                </span>
                <span className="text-[20px] font-black text-slate-800 dark:text-white">
                  {totalItemsCount}
                </span>
              </div>

              {/* Status */}
              <div className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-800">
                <span className="text-[13px] text-slate-550 dark:text-slate-400">
                  Status
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                  DRAFT
                </span>
              </div>

              {/* Est. Inventory Cost */}
              <div className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-800">
                <span className="text-[13px] text-slate-550 dark:text-slate-400">
                  Est. Inventory Cost
                </span>
                <span className="text-[14px] font-black text-slate-800 dark:text-white">
                  ₹{totalCost.toFixed(2)}
                </span>
              </div>

              {/* Log Reference ID */}
              <div className="bg-slate-50 dark:bg-slate-900/30 p-4 rounded-[5px] border border-slate-100 dark:border-slate-800 mt-2 space-y-1">
                <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                  Log Reference ID
                </p>
                <p className="text-[13px] font-extrabold text-[#2E37A4] dark:text-[#5c68f2] font-mono">
                  LOG-2023-1024-0491
                </p>
              </div>

              {/* Info alert box */}
              <div className="flex gap-2.5 p-3 rounded-[5px] bg-[#e6f4ea] dark:bg-emerald-950/15 border border-[#c2e7cc] dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-400 mt-4">
                <Info size={18} className="shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed font-medium">
                  All items removed from the physical shelf must be scanned or logged immediately to maintain live audit compliance.
                </p>
              </div>
            </div>
          </div>

          {/* CRITICAL LEVELS Card */}
          <div className="bg-blue-50/50 dark:bg-slate-900/10 p-6 rounded-[5px] border border-blue-100 dark:border-slate-800 space-y-3.5">
            <h3 className="text-[11px] font-black text-[#2E37A4] dark:text-blue-400 uppercase tracking-wider">
              CRITICAL LEVELS
            </h3>
            <p className="text-[12px] text-slate-650 dark:text-slate-450 leading-relaxed font-medium">
              "Disposable Scalpels #15" will reach re-order point after this consumption log is saved.
            </p>
            <div>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); toast.info("Opening replenishing configurations..."); }}
                className="text-[12px] font-bold text-[#2E37A4] hover:text-[#232a7d] hover:underline"
              >
                Auto-replenish settings
              </a>
            </div>
          </div>

        </div>

      </div>

      {/* Add Item Pop-up Modal */}
      {isAddModalOpen && (() => {
        const matchedItem = INVENTORY_ITEMS.find(item =>
          item.name.toLowerCase().includes(modalSearchQuery.toLowerCase())
        ) || INVENTORY_ITEMS[0];
        const activeBatch = modalBatch || matchedItem.batch;

        return (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-[0.5px] p-4">
            <div className="bg-white dark:bg-[#1e293b] w-full max-w-[420px] rounded-[8px] border border-[#e2e8f0] dark:border-[#334155] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              {/* Modal Header */}
              <div className="flex justify-between items-center px-5 py-4 border-b border-[#e2e8f0] dark:border-[#334155]">
                <h3 className="text-[15px] font-bold text-slate-800 dark:text-white">
                  Add Item to Consumption
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 space-y-4">
                {/* Search Inventory Item */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Search Inventory Item
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      value={modalSearchQuery}
                      onChange={(e) => {
                        setModalSearchQuery(e.target.value);
                        setModalBatch(""); // reset batch to match selected search item
                      }}
                      className="w-full h-10 pl-10 pr-3 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#0f172a] text-[13px] text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2E37A4]"
                    />
                  </div>
                </div>

                {/* Selected Result Card */}
                {matchedItem && (
                  <div className="flex justify-between items-center p-3 border border-[#e2e8f0] dark:border-[#334155] border-l-4 border-l-[#2E37A4] rounded-[5px] bg-[#eff6ff] dark:bg-blue-950/15">
                    <div>
                      <h4 className="text-[13px] font-extrabold text-[#2E37A4] dark:text-[#5c68f2]">
                        {matchedItem.name}
                      </h4>
                      <p className="text-[11px] text-slate-550 dark:text-slate-450 mt-0.5 font-medium">
                        {matchedItem.category}
                      </p>
                    </div>
                    <div className="text-blue-600 dark:text-blue-400 shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9 12l2 2 4-4" />
                      </svg>
                    </div>
                  </div>
                )}

                {/* Grid: Stock & Batch */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Available Stock */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Available Stock
                    </label>
                    <div className="flex items-center justify-between h-10 px-3 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] bg-slate-50/50 dark:bg-slate-900/30 text-[13px] text-slate-700 dark:text-slate-350 font-semibold">
                      <span>{matchedItem?.stock || "0 Units"}</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                    </div>
                  </div>

                  {/* Select Batch */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Select Batch
                    </label>
                    <div className="relative">
                      <select
                        value={activeBatch}
                        onChange={(e) => setModalBatch(e.target.value)}
                        className="w-full h-10 pl-3 pr-10 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#0f172a] text-[13px] text-slate-700 dark:text-slate-350 focus:outline-none focus:border-[#2E37A4] appearance-none cursor-pointer"
                      >
                        <option value={matchedItem?.batch}>{matchedItem?.batch}</option>
                        <option value="BN-993-L (Exp: 05/2026)">BN-993-L (Exp: 05/2026)</option>
                      </select>
                      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Used Quantity */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Used Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={modalUsedQty}
                      onChange={(e) => setModalUsedQty(e.target.value)}
                      className="w-[120px] h-10 px-3 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#0f172a] text-[13px] text-slate-800 dark:text-white font-medium focus:outline-none focus:border-[#2E37A4] text-center"
                    />
                    <span className="text-[13px] text-slate-550 dark:text-slate-400 font-medium">
                      {matchedItem?.unit || "Units"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 px-5 py-4 border-t border-[#e2e8f0] dark:border-[#334155]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="h-9 px-4 rounded-[4px] border border-red-200 dark:border-red-900/50 bg-red-50/50 hover:bg-red-55 text-[13px] font-bold text-red-600 dark:text-red-400 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const qty = parseInt(modalUsedQty) || 1;
                    const newItem = {
                      id: (items.length + 1).toString(),
                      name: matchedItem.name,
                      batch: activeBatch.split(" ")[0],
                      usedQty: qty,
                      unit: matchedItem.unit.split(" (")[0],
                      price: matchedItem.price
                    };
                    setItems([...items, newItem]);
                    setIsAddModalOpen(false);
                    toast.success(`${matchedItem.name} added successfully!`);
                  }}
                  className="h-9 px-4 rounded-[4px] bg-[#2E37A4] hover:bg-[#232a7d] text-[13px] font-bold text-white cursor-pointer transition-colors"
                >
                  Add to Log
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

export default NewConsumptionLog;
