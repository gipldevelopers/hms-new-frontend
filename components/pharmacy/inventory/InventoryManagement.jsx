"use client";

import React from "react";
import { 
  Package, 
  Banknote, 
  AlertTriangle, 
  Calendar, 
  Search, 
  Download, 
  Plus, 
  ChevronDown, 
  MoreHorizontal,
  Box
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function InventoryManagement() {
  const stats = [
    { label: "Total Skus", value: "4081", icon: Package, color: "text-[#2e37a4]", bg: "bg-[#f0f2ff]" },
    { label: "Total Stock Value", value: "₹12,45,000", icon: Banknote, color: "text-[#10b981]", bg: "bg-[#ecfdf5]" },
    { label: "Low Stock Items", value: "124", icon: Box, color: "text-[#3b82f6]", bg: "bg-[#eff6ff]" },
    { label: "Expiring this month", value: "38", icon: Calendar, color: "text-[#ef4444]", bg: "bg-[#fef2f2]" },
  ];

  const inventoryData = [
    { medicine: "Paracetamol 500mg", category: "Tablet", mfg: "Cipla", qty: "4500", status: "IN STOCK", rack: "A-12", updated: "2h ago" },
    { medicine: "Amoxicillin 250mg", category: "Capsule", mfg: "GSK", qty: "450", status: "LOW", rack: "B-04", updated: "1d ago" },
    { medicine: "Ceftriaxone 1g", category: "Injection", mfg: "Sun Pharma", qty: "12", status: "IN STOCK", rack: "C-01 (Cold)", updated: "5m ago" },
    { medicine: "Azithromycin 500mg", category: "Tablet", mfg: "Pfizer", qty: "0", status: "OUT OF STOCK", rack: "A-15", updated: "3d ago" },
    { medicine: "Pantoprazole 40mg", category: "Tablet", mfg: "Torrent", qty: "2100", status: "IN STOCK", rack: "A-02", updated: "1h ago" },
    { medicine: "Cough Syrup (Benadryl)", category: "Syrup", mfg: "J&J", qty: "320", status: "IN STOCK", rack: "S-08", updated: "4h ago" },
    { medicine: "Insulin Glargine", category: "Injection", mfg: "Sanofi", qty: "45", status: "LOW", rack: "Fridge-2", updated: "10m ago" },
  ];

  const getStatusStyles = (status) => {
    switch (status) {
      case "IN STOCK":
        return "bg-[#dcfce7] text-[#15803d]";
      case "LOW":
        return "bg-[#fef3c7] text-[#b45309]";
      case "OUT OF STOCK":
        return "bg-[#f1f5f9] text-[#475569]";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-[20px] font-sans bg-background min-h-screen">
      {/* Module Header - Simplified */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-[20px] font-bold text-foreground leading-none">Inventory Management</h1>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 h-11 bg-card border border-border rounded-[5px] text-[13px] font-bold text-foreground hover:bg-muted transition-all shadow-none">
            <Download size={16} /> Export
          </button>
          <Link href="/pharmacy/inventory/add-stock/new" className="flex-1 md:flex-none">
            <button className="w-full flex items-center justify-center gap-2 px-6 h-11 bg-primary text-primary-foreground rounded-[5px] text-[13px] font-bold hover:opacity-90 transition-all shadow-none">
              <Plus size={16} strokeWidth={3} /> Add Stock
            </button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[20px]">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card p-4 sm:p-6 rounded-[5px] border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all shadow-none">
            <div className="flex flex-col justify-between h-full space-y-3 sm:space-y-4">
              <div className={cn("p-2.5 rounded-[5px] w-fit shadow-none", stat.bg)}>
                <stat.icon className={cn("w-5 h-5", stat.color)} />
              </div>
              <span className="text-[11px] sm:text-[12px] font-bold text-muted-foreground opacity-80 whitespace-nowrap">{stat.label}</span>
            </div>
            <div className="text-[18px] sm:text-[22px] font-bold text-foreground tracking-tight">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="bg-card p-3 rounded-[5px] border border-border flex flex-col md:flex-row gap-3 items-center justify-between shadow-none">
        <div className="relative w-full md:w-[320px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-50" />
          <input 
            type="text"
            placeholder="Search..."
            className="w-full h-11 pl-10 pr-4 bg-background border border-border rounded-[5px] text-[13px] font-bold text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary transition-all shadow-none"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex-1 md:w-[130px] h-11 px-4 bg-background border border-border rounded-[5px] text-[13px] font-bold text-foreground flex items-center justify-between hover:bg-muted transition-all outline-none group data-[state=open]:border-primary shadow-none">
                <span className="truncate text-left flex-1 mr-2">All Categories</span>
                <ChevronDown size={14} className="text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px] p-1 border-border rounded-[5px] shadow-none bg-card">
              <DropdownMenuItem className="font-bold text-[13px] h-10 px-3 rounded-[5px] cursor-pointer focus:bg-primary/5 focus:text-primary">All Categories</DropdownMenuItem>
              <DropdownMenuItem className="font-bold text-[13px] h-10 px-3 rounded-[5px] cursor-pointer focus:bg-primary/5 focus:text-primary">Tablet</DropdownMenuItem>
              <DropdownMenuItem className="font-bold text-[13px] h-10 px-3 rounded-[5px] cursor-pointer focus:bg-primary/5 focus:text-primary">Syrup</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex-1 md:w-[130px] h-11 px-4 bg-background border border-border rounded-[5px] text-[13px] font-bold text-foreground flex items-center justify-between hover:bg-muted transition-all outline-none group data-[state=open]:border-primary shadow-none">
                <span className="truncate text-left flex-1 mr-2">All Status</span>
                <ChevronDown size={14} className="text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px] p-1 border-border rounded-[5px] shadow-none bg-card">
              <DropdownMenuItem className="font-bold text-[13px] h-10 px-3 rounded-[5px] cursor-pointer focus:bg-primary/5 focus:text-primary">All Status</DropdownMenuItem>
              <DropdownMenuItem className="font-bold text-[13px] h-10 px-3 rounded-[5px] cursor-pointer focus:bg-primary/5 focus:text-primary">In Stock</DropdownMenuItem>
              <DropdownMenuItem className="font-bold text-[13px] h-10 px-3 rounded-[5px] cursor-pointer focus:bg-primary/5 focus:text-primary">Low</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-card rounded-[5px] border border-border overflow-hidden shadow-none">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Medicine</th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Category</th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Mfg/Pack</th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Qty</th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Rack</th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Updated</th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0] dark:divide-[#334155]">
              {inventoryData.map((item, i) => (
                <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-[#1e293b]/80 transition-all">
                  <td className="px-6 py-4">
                    <p className="text-[13px] font-bold text-[#1e293b] dark:text-white">{item.medicine}</p>
                  </td>
                  <td className="px-6 py-4 text-[13px] font-bold text-[#475569] dark:text-[#cbd5e1]">{item.category}</td>
                  <td className="px-6 py-4 text-[13px] font-bold text-[#475569] dark:text-[#cbd5e1]">{item.mfg}</td>
                  <td className="px-6 py-4 text-[13px] font-bold text-[#1e293b] dark:text-white">{item.qty}</td>
                  <td className="px-6 py-4">
                    <span className={cn("text-[10px] font-bold px-2.5 py-1 rounded-[4px] uppercase tracking-tight", getStatusStyles(item.status))}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[13px] font-bold text-[#475569] dark:text-[#cbd5e1]">{item.rack}</td>
                  <td className="px-6 py-4 text-[13px] font-bold text-[#475569] dark:text-[#cbd5e1]">{item.updated}</td>
                  <td className="px-6 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors outline-none">
                          <MoreHorizontal size={16} className="text-[#64748b]" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[140px] p-1 border-[#e2e8f0] dark:border-[#334155] rounded-[5px] shadow-none bg-white dark:bg-[#1e293b]">
                        <DropdownMenuItem asChild className="text-[#1e293b] dark:text-white font-bold text-[13px] h-10 px-3 rounded-[5px] cursor-pointer focus:bg-[#2e37a4] focus:text-white transition-colors">
                          <Link href="/pharmacy/inventory/rack-view">
                            Rack View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="text-[#1e293b] dark:text-white font-bold text-[13px] h-10 px-3 rounded-[5px] cursor-pointer focus:bg-[#2e37a4] focus:text-white transition-colors">
                          <Link href={`/pharmacy/inventory/add-stock/${item.medicine.replace(/\s+/g, '-').toLowerCase()}`}>
                            Add Stock
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
