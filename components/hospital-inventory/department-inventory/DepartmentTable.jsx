"use client";
import React, { useState } from "react";
import { Download, Plus, Search, ChevronDown, Edit3, Eye, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function formatRelativeTime(dateInput) {
  if (!dateInput) return "1 hrs ago";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 10) {
    return "just now";
  }
  if (diffSecs < 60) {
    return `${diffSecs}s ago`;
  }
  if (diffMins < 60) {
    return `${diffMins} mins ago`;
  }
  if (diffHours < 24) {
    return `${diffHours} hrs ago`;
  }
  if (diffDays === 1) {
    return "1 day ago";
  }
  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}


export function DepartmentTable({
  items,
  onViewItem,
  onEditItem,
  onDeleteItem,
  onAddItemClick,
  onExportClick
}) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const categories = ["All", "Anesthetics", "Surgical Supplies", "Antibiotics", "Intravenous Fluids", "Analgesics", "PPE", "Anticoagulants"];
  const statuses = ["All", "In Stock", "Low", "Out of Stock"];

  // Filter items based on search and dropdown selectors
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;

    const matchesStatus =
      selectedStatus === "All" || item.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getExpiryBadgeClass = (expiry) => {
    switch (expiry) {
      case "Valid":
        return "bg-[#E2FBE9] text-[#0F8A5F] border-[#B7F4C7] dark:bg-emerald-950/20 dark:border-emerald-900/30";
      case "Expired":
        return "bg-[#FFF1F0] text-[#F5222D] border-[#FFCCC7] dark:bg-rose-950/20 dark:border-rose-900/30";
      case "Expiring Soon":
        return "bg-[#FFF7E6] text-[#D48806] border-[#FFE7BA] dark:bg-amber-950/20 dark:border-amber-900/30";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "In Stock":
        return "bg-[#E2FBE9] text-[#0F8A5F] border-[#B7F4C7] dark:bg-emerald-950/20 dark:border-emerald-900/30";
      case "Low":
        return "bg-[#FFF7E6] text-[#D48806] border-[#FFE7BA] dark:bg-amber-950/20 dark:border-amber-900/30";
      case "Out of Stock":
        return "bg-[#FFF1F0] text-[#F5222D] border-[#FFCCC7] dark:bg-rose-950/20 dark:border-rose-900/30";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="space-y-[20px] font-sans">

      {/* 1. Header Title & Primary Action Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
        <h1 className="text-[20px] font-bold text-[#1e293b] dark:text-white leading-none tracking-tight">
          Department Stock View
        </h1>
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={onExportClick}
            className="flex items-center justify-center gap-2 h-10 px-4 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1e293b] hover:bg-slate-50 dark:hover:bg-[#1e293b]/55 text-[13px] font-bold text-[#5e6c84] dark:text-slate-300 transition-all cursor-pointer shadow-none"
          >
            <Download size={14} className="text-slate-500" />
            Export
          </button>
          <button
            onClick={onAddItemClick}
            className="flex items-center justify-center gap-2 h-10 px-4 rounded-[5px] bg-[#2E37A4] hover:bg-[#232a7d] text-[13px] font-bold text-white transition-all cursor-pointer shadow-none"
          >
            <Plus size={14} />
            Add Item
          </button>
        </div>
      </div>

      {/* 2. Search and Filter Bar */}
      <div className="bg-white dark:bg-[#1e293b] p-3 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] shadow-none flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Simple clean search box */}
        <div className="relative w-full md:max-w-[320px]">
          <input
            type="text"
            placeholder="Search Patient name / Order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-3 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-[#2E37A4] transition-colors"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        </div>

        {/* Dropdown selectors */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-10 pl-4 pr-10 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer appearance-none min-w-[120px]"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  Category: {cat}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Stock Status Dropdown */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-10 pl-4 pr-10 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer appearance-none min-w-[140px]"
            >
              {statuses.map((stat) => (
                <option key={stat} value={stat}>
                  Stock Status: {stat}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 3. Main Data Table */}
      <div className="bg-white dark:bg-[#1e293b] rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] overflow-hidden shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12.5px]">
            <thead>
              <tr className="bg-[#F8F9FC] dark:bg-[#101935] border-b border-[#e2e8f0] dark:border-[#334155] text-slate-450 uppercase text-[10px] font-bold tracking-wider">
                <th className="px-5 py-3.5">SKU Code</th>
                <th className="px-5 py-3.5">Item Name</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Unit</th>
                <th className="px-5 py-3.5 text-right">Current Stock</th>
                <th className="px-5 py-3.5 text-right">Min Stock</th>
                <th className="px-5 py-3.5 text-center">Expiry</th>
                <th className="px-5 py-3.5">Last Updated</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-center w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0] dark:divide-[#334155] text-slate-700 dark:text-slate-250 font-medium">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="10" className="px-5 py-8 text-center text-slate-450 dark:text-slate-500 font-bold">
                    No items found matching the search filters.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/45 dark:hover:bg-white/5 transition-colors">
                    <td className="px-5 py-4 font-bold text-slate-650 dark:text-slate-400">
                      {item.sku}
                    </td>
                    <td className="px-5 py-4 font-extrabold text-slate-800 dark:text-white">
                      {item.name}
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      {item.category}
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      {item.unit}
                    </td>
                    <td className="px-5 py-4 text-right font-extrabold text-slate-850 dark:text-slate-100">
                      {parseFloat(item.qty).toLocaleString("en-IN")}
                    </td>
                    <td className="px-5 py-4 text-right text-slate-500">
                      {parseFloat(item.minThreshold).toLocaleString("en-IN")}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={cn(
                        "px-2.5 py-0.5 rounded-[4px] text-[10.5px] font-extrabold border uppercase tracking-wide",
                        getExpiryBadgeClass(item.expiry)
                      )}>
                        {item.expiry}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      {formatRelativeTime(item.updatedAt)}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={cn(
                        "px-2.5 py-0.5 rounded-[4px] text-[10.5px] font-extrabold border uppercase tracking-wide",
                        getStatusBadgeClass(item.status)
                      )}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onEditItem(item)}
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-[4px] transition-colors text-slate-500 hover:text-slate-700 cursor-pointer"
                          title="Edit Item"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => onViewItem(item)}
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-[4px] transition-colors text-[#2E37A4] hover:text-[#232a7d] cursor-pointer"
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => onDeleteItem(item)}
                          className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-[4px] transition-colors text-red-500 hover:text-red-700 cursor-pointer"
                          title="Delete Item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default DepartmentTable;
