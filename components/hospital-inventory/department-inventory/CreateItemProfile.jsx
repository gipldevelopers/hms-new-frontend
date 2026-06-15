"use client";

import React, { useState } from "react";
import { Info, Check, ChevronDown } from "lucide-react";
import { toast } from "sonner";

export function CreateItemProfile({ initialData, onCancel, onSave }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "Propofol 10mg/ml (20ml)",
    sku: initialData?.sku || "ITM-90234",
    category: initialData ? (initialData.category.includes("&") ? initialData.category : `${initialData.category} & Sedatives`) : "Anesthetics & Sedatives",
    subcategory: initialData?.subcategory || "Intravenous Anesthetics",
    notes: initialData?.notes || "Short-acting, intravenously administered anesthetic agent. Used for induction and maintenance of general anesthesia.",
    unit: initialData?.unit || "Ampoule",
    location: initialData?.location || "Cold Vault Room B",
    minStock: initialData?.minThreshold !== undefined ? String(initialData.minThreshold) : "1,000",
    maxStock: initialData?.maxStock !== undefined ? String(initialData.maxStock) : "10,000",
    reorderQty: initialData?.qty !== undefined ? String(initialData.qty) : "1,500",
    shelfLife: initialData?.shelfLife || "24 Months",
    enableBatch: initialData?.enableBatch !== undefined ? initialData.enableBatch : true,
    enableExpiry: initialData?.enableExpiry !== undefined ? initialData.enableExpiry : true,
    vendor: initialData?.supplier || "Baxter Healthcare",
    cost: initialData?.unitPrice !== undefined ? String(initialData.unitPrice) : "12.50",
    taxRate: initialData?.taxRate || "12% (CGST+SGST)"
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.sku) {
      toast.error("Please fill in required fields.");
      return;
    }
    toast.success(initialData ? "Item Profile updated successfully!" : "New Item Profile created successfully!");
    if (onSave) {
      onSave({
        ...initialData,
        sku: formData.sku,
        name: formData.name,
        category: formData.category.replace(" & Sedatives", ""),
        unit: formData.unit,
        qty: parseFloat(String(formData.reorderQty).replace(/,/g, "")) || 0,
        minThreshold: parseFloat(String(formData.minStock).replace(/,/g, "")) || 0,
        minStock: parseFloat(String(formData.minStock).replace(/,/g, "")) || 0,
        expiry: initialData?.expiry || "Valid",
        status: initialData?.status || "In Stock",
        notes: formData.notes,
        lastUpdated: "Just now",
        location: formData.location,
        batches: formData.enableBatch ? "1" : "0",
        unitPrice: parseFloat(formData.cost) || 0
      });
    }
  };

  return (
    <div className="font-sans">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* main card container */}
        <div className="bg-white dark:bg-[#1e293b] p-6 sm:p-8 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] space-y-6 shadow-none">
          
          {/* Header Title */}
          <div>
            <h2 className="text-[20px] font-bold text-[#1e293b] dark:text-white leading-none tracking-tight">
              {initialData ? "Edit Item Profile" : "Create New Item Profile"}
            </h2>
          </div>

          {/* SECTION 1: BASIC INFORMATION */}
          <div className="space-y-4 pt-2">
            <h3 className="text-[11px] font-extrabold tracking-wider text-slate-500 uppercase">
              BASIC INFORMATION
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500">Item Name *</label>
                <input
                  type="text"
                  className="w-full h-10 px-3 bg-[#F8F9FC] dark:bg-[#0A0F1D] border border-[#E2E8F0] dark:border-slate-700 rounded-[5px] text-[13px] outline-none focus:border-[#2E37A4] text-foreground font-semibold"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500">Item Code (Unique ID) *</label>
                <input
                  type="text"
                  className="w-full h-10 px-3 bg-[#F8F9FC] dark:bg-[#0A0F1D] border border-[#E2E8F0] dark:border-slate-700 rounded-[5px] text-[13px] outline-none focus:border-[#2E37A4] text-foreground font-semibold"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500">Category *</label>
                <div className="relative">
                  <select
                    className="w-full h-10 pl-3 pr-10 bg-[#F8F9FC] dark:bg-[#0A0F1D] border border-[#E2E8F0] dark:border-slate-700 rounded-[5px] text-[13px] outline-none focus:border-[#2E37A4] text-foreground font-semibold appearance-none cursor-pointer"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option>Anesthetics & Sedatives</option>
                    <option>Surgical Supplies</option>
                    <option>Antibiotics</option>
                    <option>Intravenous Fluids</option>
                    <option>Analgesics</option>
                    <option>PPE</option>
                    <option>Anticoagulants</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500">Subcategory</label>
                <div className="relative">
                  <select
                    className="w-full h-10 pl-3 pr-10 bg-[#F8F9FC] dark:bg-[#0A0F1D] border border-[#E2E8F0] dark:border-slate-700 rounded-[5px] text-[13px] outline-none focus:border-[#2E37A4] text-foreground font-semibold appearance-none cursor-pointer"
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                  >
                    <option>Intravenous Anesthetics</option>
                    <option>Inhalational Anesthetics</option>
                    <option>Local Anesthetics</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500">Clinical Description</label>
              <textarea
                rows={3}
                className="w-full p-3 bg-[#F8F9FC] dark:bg-[#0A0F1D] border border-[#E2E8F0] dark:border-slate-700 rounded-[5px] text-[13px] outline-none focus:border-[#2E37A4] text-foreground resize-none leading-relaxed font-semibold"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>

          {/* SECTION 2: STOCK & SAFETY SETTINGS */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-extrabold tracking-wider text-slate-500 uppercase">
              STOCK & SAFETY SETTINGS
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500">Unit of Measure *</label>
                <div className="relative">
                  <select
                    className="w-full h-10 pl-3 pr-10 bg-[#F8F9FC] dark:bg-[#0A0F1D] border border-[#E2E8F0] dark:border-slate-700 rounded-[5px] text-[13px] outline-none focus:border-[#2E37A4] text-foreground font-semibold appearance-none cursor-pointer"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  >
                    <option>Ampoule</option>
                    <option>Vial</option>
                    <option>Pair</option>
                    <option>Capsule</option>
                    <option>Bag</option>
                    <option>Box of 20</option>
                    <option>Box of 36</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500">Storage Zone / Location</label>
                <div className="relative">
                  <select
                    className="w-full h-10 pl-3 pr-10 bg-[#F8F9FC] dark:bg-[#0A0F1D] border border-[#E2E8F0] dark:border-slate-700 rounded-[5px] text-[13px] outline-none focus:border-[#2E37A4] text-foreground font-semibold appearance-none cursor-pointer"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  >
                    <option>Cold Vault Room B</option>
                    <option>Zone A Shelf 3</option>
                    <option>Zone C Cabinet 1</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500">Safety Limit (Minimum)</label>
                <input
                  type="text"
                  className="w-full h-10 px-3 bg-[#F8F9FC] dark:bg-[#0A0F1D] border border-[#E2E8F0] dark:border-slate-700 rounded-[5px] text-[13px] outline-none focus:border-[#2E37A4] text-foreground font-semibold"
                  value={formData.minStock}
                  onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500">Maximum Allowed Level</label>
                <input
                  type="text"
                  className="w-full h-10 px-3 bg-[#F8F9FC] dark:bg-[#0A0F1D] border border-[#E2E8F0] dark:border-slate-700 rounded-[5px] text-[13px] outline-none focus:border-[#2E37A4] text-foreground font-semibold"
                  value={formData.maxStock}
                  onChange={(e) => setFormData({ ...formData, maxStock: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500">Reorder Trigger Quantity</label>
                <input
                  type="text"
                  className="w-full h-10 px-3 bg-[#F8F9FC] dark:bg-[#0A0F1D] border border-[#E2E8F0] dark:border-slate-700 rounded-[5px] text-[13px] outline-none focus:border-[#2E37A4] text-foreground font-semibold"
                  value={formData.reorderQty}
                  onChange={(e) => setFormData({ ...formData, reorderQty: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500">Shelf Life (Months)</label>
                <input
                  type="text"
                  className="w-full h-10 px-3 bg-[#F8F9FC] dark:bg-[#0A0F1D] border border-[#E2E8F0] dark:border-slate-700 rounded-[5px] text-[13px] outline-none focus:border-[#2E37A4] text-foreground font-semibold"
                  value={formData.shelfLife}
                  onChange={(e) => setFormData({ ...formData, shelfLife: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: TRACKING & COSTING */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-extrabold tracking-wider text-slate-500 uppercase">
              TRACKING & COSTING
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Left checkboxes panel */}
              <div className="space-y-3 justify-center flex flex-col">
                {/* Batch Tracking Toggle */}
                <div
                  onClick={() => setFormData({ ...formData, enableBatch: !formData.enableBatch })}
                  className="flex items-center justify-between p-4 border border-[#e2e8f0] dark:border-slate-700 bg-[#F8F9FC] dark:bg-[#0A0F1D] rounded-[5px] cursor-pointer hover:bg-slate-50/50 transition-colors"
                >
                  <div>
                    <div className="text-[12px] font-bold text-slate-800 dark:text-white">Enable Batch Tracking</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Required for pharmaceutical auditing</div>
                  </div>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${formData.enableBatch ? 'bg-[#2E37A4] border-[#2E37A4] text-white' : 'border-slate-300'}`}>
                    {formData.enableBatch && <Check size={12} strokeWidth={3} />}
                  </div>
                </div>

                {/* Expiry Alarm Toggle */}
                <div
                  onClick={() => setFormData({ ...formData, enableExpiry: !formData.enableExpiry })}
                  className="flex items-center justify-between p-4 border border-[#e2e8f0] dark:border-slate-700 bg-[#F8F9FC] dark:bg-[#0A0F1D] rounded-[5px] cursor-pointer hover:bg-slate-50/50 transition-colors"
                >
                  <div>
                    <div className="text-[12px] font-bold text-slate-800 dark:text-white">Enable Expiry Alarms</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Automated notification 60 days prior</div>
                  </div>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${formData.enableExpiry ? 'bg-[#2E37A4] border-[#2E37A4] text-white' : 'border-slate-300'}`}>
                    {formData.enableExpiry && <Check size={12} strokeWidth={3} />}
                  </div>
                </div>
              </div>

              {/* Right details fields */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500">Preferred Supplier / Vendor</label>
                  <div className="relative">
                    <select
                      className="w-full h-10 pl-3 pr-10 bg-[#F8F9FC] dark:bg-[#0A0F1D] border border-[#E2E8F0] dark:border-slate-700 rounded-[5px] text-[13px] outline-none focus:border-[#2E37A4] text-foreground font-semibold appearance-none cursor-pointer"
                      value={formData.vendor}
                      onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                    >
                      <option>Baxter Healthcare</option>
                      <option>Ansell Med</option>
                      <option>Pfizer Inc.</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500">Purchase Unit Cost ($)</label>
                    <input
                      type="text"
                      className="w-full h-10 px-3 bg-[#F8F9FC] dark:bg-[#0A0F1D] border border-[#E2E8F0] dark:border-slate-700 rounded-[5px] text-[13px] outline-none focus:border-[#2E37A4] text-foreground font-semibold"
                      value={formData.cost}
                      onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500">Standard Tax Rate</label>
                    <div className="relative">
                      <select
                        className="w-full h-10 pl-3 pr-10 bg-[#F8F9FC] dark:bg-[#0A0F1D] border border-[#E2E8F0] dark:border-slate-700 rounded-[5px] text-[13px] outline-none focus:border-[#2E37A4] text-foreground font-semibold appearance-none cursor-pointer"
                        value={formData.taxRate}
                        onChange={(e) => setFormData({ ...formData, taxRate: e.target.value })}
                      >
                        <option>12% (CGST+SGST)</option>
                        <option>18% (CGST+SGST)</option>
                        <option>5% (CGST+SGST)</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                        <ChevronDown size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* FOOTER ACTIONS ROW */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
          {/* Info tag */}
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <Info size={16} className="text-[#2E37A4] dark:text-[#5C67F2]" />
            <span className="text-[12px] font-semibold">Make sure code is unique across the catalog.</span>
          </div>

          {/* Button actions */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="h-10 px-6 rounded-[5px] border border-rose-500 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-[12px] font-bold transition-all cursor-pointer bg-transparent"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-10 px-6 rounded-[5px] bg-[#2E37A4] hover:bg-[#232a7d] text-[12px] font-bold text-white transition-all cursor-pointer"
            >
              Save Item
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}

export default CreateItemProfile;
