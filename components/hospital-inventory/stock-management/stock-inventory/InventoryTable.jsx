"use client";

import React, { useState } from "react";
import { Search, ChevronDown, Download, Plus, Edit3, Eye, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const INITIAL_STOCK_ITEMS = [
  { id: 1, sku: "ITM-90234", name: "Propofol 10mg/ml (20ml)", category: "Anesthetics", unit: "Ampoule", qty: "3100", minStock: "1000", batches: "4", status: "In Stock", vendor: "Baxter Healthcare" },
  { id: 2, sku: "ITM-48202", name: "Surgical Gloves Sterile (Sz 7.5)", category: "Surgical Supplies", unit: "Pair", qty: "180", minStock: "500", batches: "1", status: "Low", vendor: "Ansell Med" },
  { id: 3, sku: "ITM-11234", name: "Amoxicillin Trihydrate 500mg", category: "Antibiotics", unit: "Capsule", qty: "1200", minStock: "1500", batches: "3", status: "Out of Stock", vendor: "Pfizer Inc." },
  { id: 4, sku: "ITM-77301", name: "Saline IV Solution 0.9% 500ml", category: "Intravenous Fluids", unit: "Bag", qty: "2400", minStock: "800", batches: "2", status: "In Stock", vendor: "Baxter Healthcare" },
  { id: 5, sku: "ITM-00293", name: "Paracetamol IV 10mg/ml 100ml", category: "Analgesics", unit: "Vial", qty: "420", minStock: "400", batches: "2", status: "Out of Stock", vendor: "GlaxoSmithKline" },
  { id: 6, sku: "ITM-66231", name: "N95 Respirator Masks (Regular)", category: "PPE", unit: "Box of 20", qty: "85", minStock: "200", batches: "1", status: "Low", vendor: "3M Health" },
  { id: 7, sku: "ITM-33420", name: "Suture Vicryl 3-0 70cm", category: "Surgical Supplies", unit: "Box of 36", qty: "420", minStock: "150", batches: "3", status: "In Stock", vendor: "Ethicon" },
  { id: 8, sku: "ITM-29103", name: "Heparin Sodium 5000 IU/ml", category: "Anticoagulants", unit: "Vial", qty: "0", minStock: "100", batches: "0", status: "Out of Stock", vendor: "Sandoz" }
];

export function InventoryTable({ items = [], setItems, onViewItem, triggerAddModal, clearAddTrigger, onAddClick }) {
  const [localItems, setLocalItems] = useState(INITIAL_STOCK_ITEMS);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Modal States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    category: "",
    unit: "",
    qty: "",
    minStock: "",
    batches: "1",
    status: "In Stock",
    vendor: ""
  });

  React.useEffect(() => {
    if (triggerAddModal) {
      setIsAddOpen(true);
      if (clearAddTrigger) clearAddTrigger();
    }
  }, [triggerAddModal]);

  // Handle Add Item Submit
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.sku) {
      toast.error("Please enter item SKU and Name");
      return;
    }
    const newItem = {
      id: Date.now(),
      ...formData,
      status: parseInt(formData.qty) === 0 ? "Out of Stock" : parseInt(formData.qty) < parseInt(formData.minStock) ? "Low" : "In Stock"
    };
    setLocalItems([newItem, ...localItems]);
    setIsAddOpen(false);
    toast.success("Stock Item added successfully!");
    setFormData({ sku: "", name: "", category: "", unit: "", qty: "", minStock: "", batches: "1", status: "In Stock", vendor: "" });
  };

  // Handle Edit Item Submit
  const handleEditSubmit = (e) => {
    e.preventDefault();
    setLocalItems(localItems.map(item => item.id === selectedItem.id ? {
      ...item,
      ...formData,
      status: parseInt(formData.qty) === 0 ? "Out of Stock" : parseInt(formData.qty) < parseInt(formData.minStock) ? "Low" : "In Stock"
    } : item));
    setIsEditOpen(false);
    toast.success("Stock Item updated successfully!");
  };

  // Open Edit Modal
  const openEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      sku: item.sku,
      name: item.name,
      category: item.category,
      unit: item.unit,
      qty: item.qty,
      minStock: item.minStock,
      batches: item.batches,
      status: item.status,
      vendor: item.vendor
    });
    setIsEditOpen(true);
  };

  const deleteItem = (item) => {
    if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
      setLocalItems(localItems.filter(i => i.id !== item.id));
      toast.success("Item deleted successfully!");
    }
  };

  // Filter Logic
  const filtered = localItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase()) ||
      item.vendor.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;

    const matchesStatus = selectedStatus === "All" ||
      (selectedStatus === "In Stock" && item.status === "In Stock") ||
      (selectedStatus === "Low" && item.status === "Low") ||
      (selectedStatus === "Out of Stock" && item.status === "Out of Stock");

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = ["All", "Anesthetics", "Surgical Supplies", "Antibiotics", "Intravenous Fluids", "Analgesics", "PPE", "Anticoagulants"];
  const statuses = ["All", "In Stock", "Low", "Out of Stock"];

  return (
    <div className="space-y-[20px]">

      {/* Title & Action Buttons Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-[20px] font-bold text-[#1e293b] dark:text-white leading-none tracking-tight">
          Stock Inventory
        </h2>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => toast.success("Stock Inventory exported successfully!")}
            className="flex items-center justify-center gap-2 h-10 px-4 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1e293b] hover:bg-muted text-[13px] font-bold text-foreground transition-all cursor-pointer shadow-none"
          >
            <Download size={14} />
            Export
          </button>
          <button
            onClick={onAddClick || (() => setIsAddOpen(true))}
            className="flex items-center justify-center gap-2 h-10 px-4 rounded-[5px] bg-[#2E37A4] hover:bg-[#232a7d] text-[13px] font-bold text-white transition-all cursor-pointer shadow-none"
          >
            <Plus size={14} />
            Add Stock
          </button>
        </div>
      </div>

      {/* Sub-tabs List */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F1F5F9] dark:bg-[#1E293B]/60 rounded-[8px] border border-[#E2E8F0] dark:border-[#334155] w-fit">
        <button
          className="px-4 py-2 text-[12px] font-bold rounded-[6px] transition-all bg-[#2E37A4] text-white shadow-none cursor-pointer"
        >
          Stock Inventory
        </button>
        <button
          className="px-4 py-2 text-[12px] font-bold rounded-[6px] transition-all bg-transparent text-[#5E6C84] dark:text-slate-400 hover:text-[#2E37A4] dark:hover:text-[#5F69F8] cursor-pointer"
          onClick={() => window.location.href = "/hospital-inventory/stock/lab-inventory"}
        >
          Lab Inventory
        </button>
        <button
          className="px-4 py-2 text-[12px] font-bold rounded-[6px] transition-all bg-transparent text-[#5E6C84] dark:text-slate-400 hover:text-[#2E37A4] dark:hover:text-[#5F69F8] cursor-pointer"
          onClick={() => toast.info("Transfers & Requests module is ready for integration")}
        >
          Stock Transfer
        </button>
        <button
          className="px-4 py-2 text-[12px] font-bold rounded-[6px] transition-all bg-transparent text-[#5E6C84] dark:text-slate-400 hover:text-[#2E37A4] dark:hover:text-[#5F69F8] cursor-pointer"
          onClick={() => toast.info("Batch & Expiry Tracking module is ready for integration")}
        >
          Batch & Expiry Tracking
        </button>
      </div>

      {/* Search & Dynamic Filters Row */}
      <div className="relative flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white dark:bg-[#1e293b] p-3 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] shadow-none">

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search Patient name / Order ID..."
            className="w-full h-10 pl-11 pr-4 bg-[#F8F9FC] dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-medium outline-none focus:border-[#2E37A4] transition-all text-foreground"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Dynamic Filters */}
        <div className="flex flex-wrap items-center gap-2">

          {/* Category Dropdown */}
          <div className="relative">
            <button
              onClick={() => setActiveDropdown(activeDropdown === "category" ? null : "category")}
              className="flex items-center justify-between gap-2 h-10 px-4 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1e293b] hover:bg-muted text-[13px] font-bold text-foreground transition-all cursor-pointer shadow-none min-w-[120px]"
            >
              <span>Category: {selectedCategory}</span>
              <ChevronDown size={14} className="opacity-60" />
            </button>
            {activeDropdown === "category" && (
              <div className="absolute right-0 mt-1.5 w-56 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1e293b] shadow-lg z-50 py-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setActiveDropdown(null);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-2 text-[12px] font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors",
                      selectedCategory === cat ? "text-[#2E37A4] dark:text-[#5F69F8]" : "text-foreground"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Stock Status Dropdown */}
          <div className="relative">
            <button
              onClick={() => setActiveDropdown(activeDropdown === "status" ? null : "status")}
              className="flex items-center justify-between gap-2 h-10 px-4 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1e293b] hover:bg-muted text-[13px] font-bold text-foreground transition-all cursor-pointer shadow-none min-w-[140px]"
            >
              <span>Stock Status: {selectedStatus}</span>
              <ChevronDown size={14} className="opacity-60" />
            </button>
            {activeDropdown === "status" && (
              <div className="absolute right-0 mt-1.5 w-48 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1e293b] shadow-lg z-50 py-1">
                {statuses.map((stat) => (
                  <button
                    key={stat}
                    onClick={() => {
                      setSelectedStatus(stat);
                      setActiveDropdown(null);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-2 text-[12px] font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors",
                      selectedStatus === stat ? "text-[#2E37A4] dark:text-[#5F69F8]" : "text-foreground"
                    )}
                  >
                    {stat}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-[#1e293b] rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] overflow-x-auto shadow-none">
        <table className="w-full border-collapse text-left text-[13px]">
          <thead>
            <tr className="bg-[#F8F9FC] dark:bg-[#101935]">
              <th className="px-5 py-3 text-[11px] font-extrabold text-[#64748b] dark:text-[#94a3b8] border-b border-[#e2e8f0] dark:border-[#334155] uppercase tracking-wider">SKU Code</th>
              <th className="px-5 py-3 text-[11px] font-extrabold text-[#64748b] dark:text-[#94a3b8] border-b border-[#e2e8f0] dark:border-[#334155] uppercase tracking-wider">ITEM NAME</th>
              <th className="px-5 py-3 text-[11px] font-extrabold text-[#64748b] dark:text-[#94a3b8] border-b border-[#e2e8f0] dark:border-[#334155] uppercase tracking-wider">CATEGORY</th>
              <th className="px-5 py-3 text-[11px] font-extrabold text-[#64748b] dark:text-[#94a3b8] border-b border-[#e2e8f0] dark:border-[#334155] uppercase tracking-wider">UNIT</th>
              <th className="px-5 py-3 text-[11px] font-extrabold text-[#64748b] dark:text-[#94a3b8] border-b border-[#e2e8f0] dark:border-[#334155] uppercase tracking-wider">CURRENT STOCK</th>
              <th className="px-5 py-3 text-[11px] font-extrabold text-[#64748b] dark:text-[#94a3b8] border-b border-[#e2e8f0] dark:border-[#334155] uppercase tracking-wider">MIN STOCK</th>
              <th className="px-5 py-3 text-[11px] font-extrabold text-[#64748b] dark:text-[#94a3b8] border-b border-[#e2e8f0] dark:border-[#334155] uppercase tracking-wider">BATCHES</th>
              <th className="px-5 py-3 text-[11px] font-extrabold text-[#64748b] dark:text-[#94a3b8] border-b border-[#e2e8f0] dark:border-[#334155] uppercase tracking-wider">STATUS</th>
              <th className="px-5 py-3 text-[11px] font-extrabold text-[#64748b] dark:text-[#94a3b8] border-b border-[#e2e8f0] dark:border-[#334155] uppercase tracking-wider">PREFERRED VENDOR</th>
              <th className="px-5 py-3 text-[11px] font-extrabold text-[#64748b] dark:text-[#94a3b8] border-b border-[#e2e8f0] dark:border-[#334155] uppercase tracking-wider">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e2e8f0] dark:divide-[#334155]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="10" className="px-5 py-12 text-center text-slate-400 font-semibold">
                  No stock inventory items found
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-slate-500 dark:text-slate-400">{item.sku}</td>
                  <td className="px-5 py-3.5 font-bold text-slate-800 dark:text-slate-100">{item.name}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-500 dark:text-slate-400">{item.category}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-500 dark:text-slate-400">{item.unit}</td>
                  <td className="px-5 py-3.5 font-bold text-slate-800 dark:text-slate-100">{item.qty}</td>
                  <td className="px-5 py-3.5 font-bold text-slate-800 dark:text-slate-100">{item.minStock}</td>
                  <td className="px-5 py-3.5 text-center font-bold text-slate-800 dark:text-slate-100">
                    <span className="inline-block min-w-[20px] text-center font-bold">{item.batches}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={cn(
                      "px-2.5 py-1 rounded-[5px] text-[10px] font-extrabold border leading-none uppercase inline-block",
                      item.status === "In Stock" && "bg-emerald-50 dark:bg-emerald-950/20 text-[#10B981] border-emerald-200/50",
                      item.status === "Low" && "bg-[#FFF7E6] text-[#D48806] border-[#FFE7BA] dark:bg-amber-950/20 dark:text-amber-500",
                      item.status === "Out of Stock" && "bg-rose-50 dark:bg-rose-950/20 text-rose-600 border-rose-200/50"
                    )}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-slate-500 dark:text-slate-400">{item.vendor}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <button
                        onClick={() => openEdit(item)}
                        className="p-1 hover:text-[#2E37A4] dark:hover:text-[#5F69F8] transition-colors cursor-pointer"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => onViewItem && onViewItem(item)}
                        className="p-1 hover:text-[#2E37A4] dark:hover:text-[#5F69F8] transition-colors cursor-pointer"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => deleteItem(item)}
                        className="p-1 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* -------------------- ADD MODAL (Mockup Blur Theme) -------------------- */}
      {isAddOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center">
          {/* Backdrop with 0.5px blur & darker shade */}
          <div
            onClick={() => setIsAddOpen(false)}
            className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-[0.5px] transition-all"
          />
          {/* Modal Container */}
          <div className="relative w-full max-w-[620px] bg-[#F8F9FC] dark:bg-[#0F172A] border border-[#E7E8EB] dark:border-white/10 p-5 rounded-[6px] shadow-2xl z-10 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-2 border-b border-[#E7E8EB] dark:border-white/10">
              <h3 className="text-[16px] font-bold text-slate-800 dark:text-white">Add New Stock Item</h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              {/* Box Content Layout */}
              <div className="bg-white dark:bg-[#1E293B] border border-[#E7E8EB] dark:border-white/5 rounded-[6px] p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">SKU Code *</label>
                    <input
                      type="text"
                      className="w-full h-10 px-3 border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-[#0F172A] rounded-[5px] text-[13px] outline-none focus:border-[#2E37A4] text-foreground"
                      placeholder="e.g. ITM-98312"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Item Name *</label>
                    <input
                      type="text"
                      className="w-full h-10 px-3 border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-[#0F172A] rounded-[5px] text-[13px] outline-none focus:border-[#2E37A4] text-foreground"
                      placeholder="e.g. Surgical Gown XL"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Category</label>
                    <input
                      type="text"
                      className="w-full h-10 px-3 border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-[#0F172A] rounded-[5px] text-[13px] outline-none focus:border-[#2E37A4] text-foreground"
                      placeholder="e.g. Surgical Supplies"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Unit Size</label>
                    <input
                      type="text"
                      className="w-full h-10 px-3 border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-[#0F172A] rounded-[5px] text-[13px] outline-none focus:border-[#2E37A4] text-foreground"
                      placeholder="e.g. Box of 50"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Current Stock *</label>
                    <input
                      type="number"
                      className="w-full h-10 px-3 border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-[#0F172A] rounded-[5px] text-[13px] outline-none focus:border-[#2E37A4] text-foreground"
                      placeholder="350"
                      value={formData.qty}
                      onChange={(e) => setFormData({ ...formData, qty: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Min Stock *</label>
                    <input
                      type="number"
                      className="w-full h-10 px-3 border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-[#0F172A] rounded-[5px] text-[13px] outline-none focus:border-[#2E37A4] text-foreground"
                      placeholder="100"
                      value={formData.minStock}
                      onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Preferred Vendor</label>
                    <input
                      type="text"
                      className="w-full h-10 px-3 border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-[#0F172A] rounded-[5px] text-[13px] outline-none focus:border-[#2E37A4] text-foreground"
                      placeholder="e.g. Baxter Med"
                      value={formData.vendor}
                      onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="h-10 px-4 rounded-[5px] border border-[#e2e8f0] dark:border-slate-700 bg-white dark:bg-[#1E293B] hover:bg-slate-50 text-[13px] font-bold text-slate-700 dark:text-slate-300 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 rounded-[5px] bg-[#2E37A4] hover:bg-[#232a7d] text-[13px] font-bold text-white transition cursor-pointer"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------- EDIT MODAL (Mockup Blur Theme) -------------------- */}
      {isEditOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center">
          <div
            onClick={() => setIsEditOpen(false)}
            className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-[0.5px] transition-all"
          />
          <div className="relative w-full max-w-[620px] bg-[#F8F9FC] dark:bg-[#0F172A] border border-[#E7E8EB] dark:border-white/10 p-5 rounded-[6px] shadow-2xl z-10 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-2 border-b border-[#E7E8EB] dark:border-white/10">
              <h3 className="text-[16px] font-bold text-slate-800 dark:text-white">Edit Stock Item</h3>
              <button
                onClick={() => setIsEditOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="bg-white dark:bg-[#1E293B] border border-[#E7E8EB] dark:border-white/5 rounded-[6px] p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">SKU Code *</label>
                    <input
                      type="text"
                      className="w-full h-10 px-3 border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-[#0F172A] rounded-[5px] text-[13px] outline-none focus:border-[#2E37A4] text-foreground"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Item Name *</label>
                    <input
                      type="text"
                      className="w-full h-10 px-3 border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-[#0F172A] rounded-[5px] text-[13px] outline-none focus:border-[#2E37A4] text-foreground"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Category</label>
                    <input
                      type="text"
                      className="w-full h-10 px-3 border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-[#0F172A] rounded-[5px] text-[13px] outline-none focus:border-[#2E37A4] text-foreground"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Unit Size</label>
                    <input
                      type="text"
                      className="w-full h-10 px-3 border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-[#0F172A] rounded-[5px] text-[13px] outline-none focus:border-[#2E37A4] text-foreground"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Current Stock *</label>
                    <input
                      type="number"
                      className="w-full h-10 px-3 border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-[#0F172A] rounded-[5px] text-[13px] outline-none focus:border-[#2E37A4] text-foreground"
                      value={formData.qty}
                      onChange={(e) => setFormData({ ...formData, qty: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Min Stock *</label>
                    <input
                      type="number"
                      className="w-full h-10 px-3 border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-[#0F172A] rounded-[5px] text-[13px] outline-none focus:border-[#2E37A4] text-foreground"
                      value={formData.minStock}
                      onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Preferred Vendor</label>
                    <input
                      type="text"
                      className="w-full h-10 px-3 border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-[#0F172A] rounded-[5px] text-[13px] outline-none focus:border-[#2E37A4] text-foreground"
                      value={formData.vendor}
                      onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="h-10 px-4 rounded-[5px] border border-[#e2e8f0] dark:border-slate-700 bg-white dark:bg-[#1E293B] hover:bg-slate-50 text-[13px] font-bold text-slate-700 dark:text-slate-300 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 rounded-[5px] bg-[#2E37A4] hover:bg-[#232a7d] text-[13px] font-bold text-white transition cursor-pointer"
                >
                  Update Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
