"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, Download, Plus, Edit3, Eye, Trash2, X, Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";


const ITEM_CATEGORIES = {
  "SKU-PRP-9021": "Pharmaceuticals",
  "SKU-AMX-1120": "Pharmaceuticals",
  "SKU-PAR-3021": "Pharmaceuticals",
  "SKU-SAL-1022": "Pharmaceuticals",
  "SKU-SYR-85ML": "Surgical Supplies",
  "SKU-GLV-8800": "PPE & Safety"
};

const ITEM_STOCK_STATUS = {
  "SKU-PRP-9021": "In Stock",
  "SKU-AMX-1120": "In Stock",
  "SKU-SYR-85ML": "In Stock",
  "SKU-SAL-1022": "Low Stock",
  "SKU-PAR-3021": "Low Stock",
  "SKU-GLV-8800": "Out of Stock"
};

const getItemCategory = (item) => {
  if (!item) return "Pharmaceuticals";
  const name = (item.name || "").toLowerCase();
  const sku = (item.sku || "").toUpperCase();

  if (ITEM_CATEGORIES[sku]) return ITEM_CATEGORIES[sku];

  if (sku.includes("PRP") || sku.includes("AMX") || sku.includes("PAR") || sku.includes("SAL")) {
    return "Pharmaceuticals";
  }
  if (sku.includes("SYR") || name.includes("syringe") || name.includes("cotton") || name.includes("scalpel") || name.includes("spirit")) {
    return "Surgical Supplies";
  }
  if (sku.includes("GLV") || name.includes("glove") || name.includes("mask")) {
    return "PPE & Safety";
  }
  if (name.includes("reagent")) {
    return "Lab Reagents";
  }
  if (name.includes("valve") || name.includes("pacemaker") || name.includes("device")) {
    return "Medical Devices";
  }

  return "Pharmaceuticals";
};

const getItemStockStatus = (item) => {
  if (!item) return "In Stock";
  const name = (item.name || "").toLowerCase();
  const sku = (item.sku || "").toUpperCase();

  if (ITEM_STOCK_STATUS[sku]) return ITEM_STOCK_STATUS[sku];

  if (name.includes("scalpel") || sku.includes("GLV")) {
    return "Out of Stock";
  }
  if (name.includes("valve") || name.includes("mask") || sku.includes("SAL") || sku.includes("PAR")) {
    return "Low Stock";
  }
  return "In Stock";
};

export function PurchaseTable({
  orders = [],
  onViewOrder,
  onEditOrder,
  onDeleteOrder,
  onCreatePOClick,
  onExportClick,
  defaultFilter = "all"
}) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStockStatus, setSelectedStockStatus] = useState("All");
  const [activeFilter, setActiveFilter] = useState(defaultFilter);

  // Sync activeFilter when defaultFilter prop changes (e.g. navigating from stat card)
  useEffect(() => {
    setActiveFilter(defaultFilter);
  }, [defaultFilter]);

  const now = new Date();

  // Pre-filter by pending/delayed before search/category filters
  const isPendingOrder = (order) => {
    const status = (order.orderStatus || "").toUpperCase();
    return status !== "COMPLETED" && status !== "CANCELLED" && status !== "DELIVERED";
  };

  const isDelayedOrder = (order) => {
    if (!isPendingOrder(order)) return false;
    if (!order.expectedDelivery) return false;
    const expectedDate = new Date(order.expectedDelivery);
    return !isNaN(expectedDate.getTime()) && expectedDate < now;
  };

  const preFiltered = orders.filter(order => {
    if (activeFilter === "pending") return isPendingOrder(order);
    if (activeFilter === "delayed") return isDelayedOrder(order);
    return true;
  });


  const categories = ["All", "Pharmaceuticals", "Medical Devices", "Surgical Supplies", "PPE & Safety", "Lab Reagents"];
  const stockStatuses = ["All", "In Stock", "Low Stock", "Out of Stock"];

  // Filter orders (from pre-filtered set)
  const filteredOrders = preFiltered.filter(order => {

    const matchesSearch =
      order.poNumber.toLowerCase().includes(search.toLowerCase()) ||
      order.vendor.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === "All" || (order.items && order.items.some(item => {
      return getItemCategory(item) === selectedCategory;
    }));

    const matchesStockStatus = selectedStockStatus === "All" || (order.items && order.items.some(item => {
      return getItemStockStatus(item) === selectedStockStatus;
    }));

    return matchesSearch && matchesCategory && matchesStockStatus;
  });

  const paymentStyles = {
    PAID: "bg-[#E2FBE9] border-[#B7F4C7] text-[#0F8A5F] dark:bg-emerald-950/20 dark:border-emerald-900/30",
    PENDING: "bg-slate-100 border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-450",
    VOID: "bg-rose-50 border-rose-150 text-rose-600 dark:bg-rose-950/20 dark:border-rose-900/30"
  };

  const statusStyles = {
    "PARTIAL RECEIVED": "bg-[#E0F2FE] border-[#BAE6FD] text-[#0369A1] dark:bg-sky-950/20 dark:border-sky-900/30",
    ORDERED: "bg-[#EFF6FF] border-[#DBEAFE] text-[#1D4ED8] dark:bg-blue-950/20 dark:border-blue-900/30",
    COMPLETED: "bg-[#F0FDF4] border-[#DCFCE7] text-[#15803D] dark:bg-emerald-950/20 dark:border-emerald-900/30",
    CANCELLED: "bg-rose-50 border-rose-200 text-rose-650 dark:bg-rose-950/20 dark:border-rose-900/30"
  };

  const statusDots = {
    "PARTIAL RECEIVED": "bg-[#0369A1]",
    ORDERED: "bg-[#1D4ED8]",
    COMPLETED: "bg-[#15803D]",
    CANCELLED: "bg-rose-500"
  };

  return (
    <div className="space-y-[20px]">
      {/* Filter Banner — shown when stat card was clicked */}
      {activeFilter !== "all" && (
        <div className={cn(
          "flex items-center justify-between gap-3 px-4 py-3 rounded-[5px] border text-[13px] font-semibold",
          activeFilter === "pending"
            ? "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/30 text-blue-700 dark:text-blue-300"
            : "bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/30 text-rose-700 dark:text-rose-300"
        )}>
          <div className="flex items-center gap-2.5">
            {activeFilter === "pending"
              ? <Clock size={15} className="shrink-0" />
              : <AlertTriangle size={15} className="shrink-0" />}
            <span>
              {activeFilter === "pending"
                ? `Showing ${preFiltered.length} Pending Deliveries — Purchase Orders not yet completed or delivered.`
                : `Showing ${preFiltered.length} Delayed Deliveries — Pending orders whose expected delivery date has passed.`}
            </span>
          </div>
          <button
            onClick={() => setActiveFilter("all")}
            className="flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded-[5px] bg-white/70 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 border border-current/20 text-[12px] font-bold transition-all cursor-pointer"
          >
            <X size={11} /> Clear Filter
          </button>
        </div>
      )}

      {/* 1. Header Title & Actions Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
        <h1 className="text-[20px] font-bold text-[#1e293b] dark:text-white leading-none tracking-tight">
          Purchase Management
        </h1>
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={onExportClick}
            className="flex items-center justify-center gap-2 h-10 px-4 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1e293b] hover:bg-slate-50 dark:hover:bg-[#1e293b]/50 text-[13px] font-bold text-[#5e6c84] dark:text-slate-350 transition-all cursor-pointer shadow-none"
          >
            <Download size={14} className="text-slate-500 dark:text-slate-400" />
            Export
          </button>
          <button
            onClick={onCreatePOClick}
            className="flex items-center justify-center gap-2 h-10 px-4 rounded-[5px] bg-[#2E37A4] hover:bg-[#232a7d] text-[13px] font-bold text-white transition-all cursor-pointer shadow-none"
          >
            <Plus size={14} />
            Create Purchase Order
          </button>
        </div>
      </div>

      {/* 2. Standalone Search & Filter Box */}
      <div className="bg-white dark:bg-[#1e293b] p-3 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] shadow-none flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Simple clean search box matching screenshot style */}
        <div className="relative w-full md:max-w-[450px]">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search Patient name / Order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-3 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-[#2E37A4] transition-colors"
          />
        </div>

        {/* Category & Status Dropdowns */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          {/* Category Selector */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-10 pl-4 pr-10 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer appearance-none min-w-[120px]"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "All" ? "Category" : cat}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Stock Status Selector */}
          <div className="relative">
            <select
              value={selectedStockStatus}
              onChange={(e) => setSelectedStockStatus(e.target.value)}
              className="h-10 pl-4 pr-10 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer appearance-none min-w-[130px]"
            >
              {stockStatuses.map((stat) => (
                <option key={stat} value={stat}>
                  {stat === "All" ? "Stock Status" : stat}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 3. Table Box */}
      <div className="bg-white dark:bg-[#1e293b] rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] shadow-none overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#F8F9FC] dark:bg-[#101935]">
                <th className="px-5 py-3.5 text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] border-b border-[#e2e8f0] dark:border-[#334155] uppercase tracking-wider whitespace-nowrap">PO Number</th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] border-b border-[#e2e8f0] dark:border-[#334155] uppercase tracking-wider whitespace-nowrap">Vendor</th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] border-b border-[#e2e8f0] dark:border-[#334155] uppercase tracking-wider whitespace-nowrap">Order Date</th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] border-b border-[#e2e8f0] dark:border-[#334155] uppercase tracking-wider whitespace-nowrap">Expected Delivery</th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] border-b border-[#e2e8f0] dark:border-[#334155] uppercase tracking-wider whitespace-nowrap">Total Amount</th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] border-b border-[#e2e8f0] dark:border-[#334155] uppercase tracking-wider whitespace-nowrap">Payment</th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] border-b border-[#e2e8f0] dark:border-[#334155] uppercase tracking-wider whitespace-nowrap">Order Status</th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] border-b border-[#e2e8f0] dark:border-[#334155] uppercase tracking-wider whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0] dark:divide-[#334155]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-5 py-16 text-center text-slate-400 dark:text-slate-500 font-medium">
                    No purchase orders found matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-all group">
                    {/* PO Number */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="font-extrabold text-[#1E293B] dark:text-white text-[13px]">
                        {order.poNumber}
                      </span>
                    </td>

                    {/* Vendor */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="font-extrabold text-slate-700 dark:text-slate-200 text-[13px]">
                        {order.vendor}
                      </span>
                    </td>

                    {/* Order Date */}
                    <td className="px-5 py-4 whitespace-nowrap text-slate-500 dark:text-slate-450 font-bold text-[12.5px]">
                      {order.orderDate}
                    </td>

                    {/* Expected Delivery */}
                    <td className="px-5 py-4 whitespace-nowrap text-slate-500 dark:text-slate-455 font-bold text-[12.5px]">
                      {order.expectedDelivery}
                    </td>

                    {/* Total Amount */}
                    <td className="px-5 py-4 whitespace-nowrap text-slate-800 dark:text-white font-extrabold text-[13px]">
                      {order.totalAmount}
                    </td>

                    {/* Payment Badge */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={cn(
                        "inline-flex items-center justify-center px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase border leading-none tracking-wide min-w-[65px] text-center",
                        paymentStyles[order.payment]
                      )}>
                        {order.payment}
                      </span>
                    </td>

                    {/* Order Status Badge with Dot */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase border leading-none tracking-wide",
                        statusStyles[order.orderStatus]
                      )}>
                        <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", statusDots[order.orderStatus])} />
                        {order.orderStatus}
                      </span>
                    </td>

                    {/* Actions Column */}
                    <td className="px-5 py-4 whitespace-nowrap text-[13px]">
                      <div className="flex items-center gap-2">
                        {/* Edit Button */}
                        <button
                          onClick={() => onEditOrder(order)}
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-[5px] transition-colors cursor-pointer"
                          title="Edit Order"
                        >
                          <Edit3 size={15} className="text-blue-500" />
                        </button>
                        {/* View Button */}
                        <button
                          onClick={() => onViewOrder(order)}
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-[5px] transition-colors cursor-pointer"
                          title="View Order Details"
                        >
                          <Eye size={15} className="text-slate-500 dark:text-slate-400" />
                        </button>
                        {/* Delete Button */}
                        <button
                          onClick={() => onDeleteOrder(order)}
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-[5px] transition-colors cursor-pointer"
                          title="Delete Order"
                        >
                          <Trash2 size={15} className="text-red-500" />
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

export default PurchaseTable;
