"use client";

import React, { useState, useEffect } from "react";
import { X, Check, Info } from "lucide-react";
import { toast } from "sonner";

export function CreateSupplierModal({ isOpen, onClose, onSave, supplierToEdit }) {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "Pharmaceuticals",
    contact: "",
    phone: "",
    email: "",
    address: "",
    rating: 4,
    status: "Active"
  });

  useEffect(() => {
    if (supplierToEdit) {
      setFormData({
        name: supplierToEdit.name || "",
        sku: supplierToEdit.sku || "",
        category: supplierToEdit.category || "Pharmaceuticals",
        contact: supplierToEdit.contact || "",
        phone: supplierToEdit.phone || "",
        email: supplierToEdit.email || "",
        address: supplierToEdit.address || "",
        rating: supplierToEdit.rating || 4,
        status: supplierToEdit.status || "Active"
      });
    } else {
      // Generate a new Supplier ID automatically
      const randomNum = Math.floor(100 + Math.random() * 900);
      setFormData({
        name: "",
        sku: `SUP-2026-${randomNum}`,
        category: "Pharmaceuticals",
        contact: "",
        phone: "",
        email: "",
        address: "",
        rating: 4,
        status: "Active"
      });
    }
  }, [supplierToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.contact || !formData.phone) {
      toast.error("Please fill in all required fields.");
      return;
    }
    
    toast.success(supplierToEdit ? "Supplier profile updated!" : "New Supplier added successfully!");
    if (onSave) {
      onSave({
        id: supplierToEdit ? supplierToEdit.id : Date.now(),
        ...formData
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-[0.5px] transition-all"
      />
      {/* Modal Card */}
      <div className="relative w-full max-w-[620px] bg-[#F8F9FC] dark:bg-[#0F172A] border border-[#E7E8EB] dark:border-white/10 p-5 rounded-[6px] shadow-2xl z-10 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex justify-between items-center pb-2 border-b border-[#E7E8EB] dark:border-white/10">
          <h3 className="text-[16px] font-bold text-slate-800 dark:text-white">
            {supplierToEdit ? "Edit Supplier Profile" : "Add New Supplier"}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Supplier Name & Code */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Supplier Name *</label>
              <input
                type="text"
                placeholder="e.g. PharmaCorp Global"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full h-10 px-3 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Supplier Code / ID *</label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full h-10 px-3 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* Sourcing Category & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full h-10 px-3 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-bold text-slate-800 dark:text-slate-200 outline-none focus:border-blue-500 transition-colors cursor-pointer"
              >
                <option>Pharmaceuticals</option>
                <option>Medical Devices</option>
                <option>Surgical Supplies</option>
                <option>PPE & Safety</option>
                <option>Lab Reagents</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full h-10 px-3 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-bold text-slate-800 dark:text-slate-200 outline-none focus:border-blue-500 transition-colors cursor-pointer"
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>

          {/* Contact Person & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Contact Person *</label>
              <input
                type="text"
                placeholder="e.g. Mark Stevenson"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                className="w-full h-10 px-3 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Contact Number *</label>
              <input
                type="text"
                placeholder="e.g. +91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full h-10 px-3 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* Email Address & Settle Rating */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                placeholder="e.g. support@supplier.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full h-10 px-3 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Rating (1 to 5 Stars)</label>
              <select
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                className="w-full h-10 px-3 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-bold text-slate-800 dark:text-slate-200 outline-none focus:border-blue-500 transition-colors cursor-pointer"
              >
                <option value={5}>5 Stars (Excellent)</option>
                <option value={4}>4 Stars (Good)</option>
                <option value={3}>3 Stars (Average)</option>
                <option value={2}>2 Stars (Below Average)</option>
                <option value={1}>1 Star (Poor)</option>
              </select>
            </div>
          </div>

          {/* Supplier Address */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Registered Sourcing Address</label>
            <textarea
              rows="2"
              placeholder="Enter full supplier business address..."
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-3 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 transition-colors resize-none"
            />
          </div>

          {/* Info Strip */}
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 pt-1">
            <Info size={16} className="text-[#2E37A4] dark:text-[#5C67F2]" />
            <span className="text-[11px] font-semibold">
              Supplier records are synchronized globally for decentralized hospital procurement departments.
            </span>
          </div>

          {/* Buttons */}
          <div className="flex justify-end items-center gap-3 pt-3 border-t border-[#E7E8EB] dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-5 rounded-[5px] border border-slate-200 dark:border-slate-700 bg-white hover:bg-slate-50 text-[12px] font-bold text-slate-500 hover:text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-10 px-5 rounded-[5px] bg-[#2E37A4] hover:bg-[#232a7d] text-[12px] font-bold text-white transition-colors cursor-pointer"
            >
              Save Supplier
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
