"use client";

import React, { useState } from "react";
import { ChevronDown, Download, Plus, Edit3, Eye, Trash2, Star, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function SupplierTable({
  suppliers = [],
  onViewSupplier,
  onEditSupplier,
  onDeleteSupplier,
  onAddSupplierClick,
  onCreatePOClick
}) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Filter items
  const filteredSuppliers = suppliers.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase()) ||
      item.contact.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;

    const matchesStatus =
      selectedStatus === "All" || item.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = ["All", "Pharmaceuticals", "Medical Devices", "Surgical Supplies", "PPE & Safety", "Lab Reagents"];
  const statuses = ["All", "Active", "Inactive"];

  return (
    <div className="space-y-[20px]">

      {/* 1. Plain Header Title & Actions Row (Not inside a box) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
        <h1 className="text-[20px] font-bold text-[#1e293b] dark:text-white leading-none tracking-tight">
          Supplier Management
        </h1>
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={onCreatePOClick}
            className="flex items-center justify-center gap-2 h-10 px-4 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1e293b] hover:bg-slate-50 dark:hover:bg-[#1e293b]/50 text-[13px] font-bold text-[#5e6c84] dark:text-slate-350 transition-all cursor-pointer shadow-none"
          >
            <Download size={14} className="rotate-180 text-slate-500" />
            Create PO
          </button>
          <button
            onClick={onAddSupplierClick}
            className="flex items-center justify-center gap-2 h-10 px-4 rounded-[5px] bg-[#2E37A4] hover:bg-[#232a7d] text-[13px] font-bold text-white transition-all cursor-pointer shadow-none"
          >
            <Plus size={14} />
            Add Supplier
          </button>
        </div>
      </div>

      {/* 2. Standalone Filter Box (Different box) */}
      <div className="bg-white dark:bg-[#1e293b] p-3 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] shadow-none flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Simple clean search box */}
        <div className="relative w-full md:max-w-[280px]">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 px-3 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-[#2E37A4] transition-colors"
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
                  {cat === "All" ? "All" : cat}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Status Selector */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-10 pl-4 pr-10 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer appearance-none min-w-[100px]"
            >
              {statuses.map((stat) => (
                <option key={stat} value={stat}>
                  {stat === "All" ? "All" : stat}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 3. Table List Box (Different bordered box below) */}
      <div className="bg-white dark:bg-[#1e293b] rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] shadow-none overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#F8F9FC] dark:bg-[#101935]">
                <th className="px-5 py-3.5 text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] border-b border-[#e2e8f0] dark:border-[#334155] uppercase tracking-wider whitespace-nowrap">Supplier Name</th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] border-b border-[#e2e8f0] dark:border-[#334155] uppercase tracking-wider whitespace-nowrap">Category</th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] border-b border-[#e2e8f0] dark:border-[#334155] uppercase tracking-wider whitespace-nowrap">Contact Person</th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] border-b border-[#e2e8f0] dark:border-[#334155] uppercase tracking-wider whitespace-nowrap">Last Order</th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] border-b border-[#e2e8f0] dark:border-[#334155] uppercase tracking-wider whitespace-nowrap">Rating</th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] border-b border-[#e2e8f0] dark:border-[#334155] uppercase tracking-wider whitespace-nowrap">Status</th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] border-b border-[#e2e8f0] dark:border-[#334155] uppercase tracking-wider text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0] dark:divide-[#334155]">
              {filteredSuppliers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-16 text-center text-slate-400 dark:text-slate-500 font-medium">
                    No suppliers found matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredSuppliers.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-all group">
                    {/* Supplier Name */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="font-extrabold text-slate-800 dark:text-white text-[13.5px] leading-tight">
                        {item.name}
                      </div>
                      <div className="text-[10.5px] font-bold text-slate-400 mt-1 uppercase tracking-wide">
                        ID: {item.sku}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 rounded-[5px] text-[10px] font-extrabold text-blue-600 bg-blue-50 dark:bg-blue-950/20 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 uppercase tracking-wide">
                        {item.category}
                      </span>
                    </td>

                    {/* Contact Person */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="font-bold text-slate-700 dark:text-slate-200 text-[13px] leading-tight">
                        {item.contact}
                      </div>
                      <div className="text-[11px] font-semibold text-slate-400 mt-0.5">
                        {item.phone}
                      </div>
                    </td>

                    {/* Last Order Date */}
                    <td className="px-5 py-4 whitespace-nowrap text-slate-500 dark:text-slate-400 font-bold text-[12.5px]">
                      {item.lastOrder || "Oct 24, 2023"}
                    </td>

                    {/* Star Ratings */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex gap-0.5 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            fill={i < (item.rating || 4) ? "currentColor" : "none"}
                            className={cn(i < (item.rating || 4) ? "text-amber-400" : "text-slate-250 dark:text-slate-700")}
                          />
                        ))}
                      </div>
                    </td>

                    {/* Status Badges */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border leading-none tracking-wide",
                        item.status === "Active"
                          ? "bg-[#E2FBE9] border-[#B7F4C7] text-[#0F8A5F] dark:bg-emerald-950/20 dark:border-emerald-900/30"
                          : "bg-rose-50 border-rose-200/50 text-rose-600 dark:bg-rose-950/20 dark:border-rose-900/30"
                      )}>
                        <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", item.status === "Active" ? "bg-[#0F8A5F]" : "bg-rose-500")} />
                        {item.status}
                      </span>
                    </td>

                    {/* Actions column */}
                    <td className="px-5 py-4 whitespace-nowrap text-right text-[13px] relative">
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors outline-none cursor-pointer">
                              <MoreHorizontal size={16} className="text-[#64748b]" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[150px] p-1 border-[#e2e8f0] dark:border-[#334155] rounded-[5px] shadow-none bg-white dark:bg-[#1e293b]">
                            <DropdownMenuItem 
                              onClick={() => onViewSupplier(item)}
                              className="text-[#1e293b] dark:text-white font-bold text-[13px] h-10 px-3 rounded-[5px] cursor-pointer focus:bg-[#2e37a4] focus:text-white transition-colors gap-2"
                            >
                              <Eye size={14} />
                              View details
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => onEditSupplier(item)}
                              className="text-[#1e293b] dark:text-white font-bold text-[13px] h-10 px-3 rounded-[5px] cursor-pointer focus:bg-[#2e37a4] focus:text-white transition-colors gap-2"
                            >
                              <Edit3 size={14} />
                              Edit Supplier
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => onDeleteSupplier(item)}
                              className="text-red-650 font-bold text-[13px] h-10 px-3 rounded-[5px] cursor-pointer focus:bg-red-50 focus:text-red-700 transition-colors gap-2"
                            >
                              <Trash2 size={14} />
                              Delete Supplier
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
export default SupplierTable;
