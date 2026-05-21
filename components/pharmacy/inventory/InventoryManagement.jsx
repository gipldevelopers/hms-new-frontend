"use client";

import React, { useState, useEffect } from "react";
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
  Box,
  Trash2
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { API_URL } from "@/lib/api";

export function InventoryManagement() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [deleteItem, setDeleteItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("authtoken");
      const userStr = localStorage.getItem("user");
      if (!token || !userStr) {
        setError("Session expired. Please login again.");
        setLoading(false);
        return;
      }
      const user = JSON.parse(userStr);
      const branchId = user.branchId;

      const res = await fetch(`${API_URL}/pharmacy/inventory?branchId=${branchId}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const result = await res.json();
      if (result.success) {
        setItems(result.data || []);
      } else {
        setError(result.error || "Failed to fetch inventory items.");
      }
    } catch (err) {
      setError("Failed to load inventory. Please verify that the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    if (!deleteItem) return;
    const handleEsc = (e) => {
      if (e.key === "Escape") setDeleteItem(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [deleteItem]);

  const confirmDelete = async () => {
    if (!deleteItem) return;
    try {
      setIsDeleting(true);
      const token = localStorage.getItem("authtoken");
      const userStr = localStorage.getItem("user");
      if (!token || !userStr) return;
      const user = JSON.parse(userStr);
      const branchId = user.branchId;

      const res = await fetch(`${API_URL}/pharmacy/inventory/${deleteItem.id}?branchId=${branchId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const result = await res.json();
      if (result.success) {
        setItems(prev => prev.filter(item => item.id !== deleteItem.id));
      } else {
        alert(result.error || "Failed to delete item.");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setIsDeleting(false);
      setDeleteItem(null);
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "IN STOCK":
        return "bg-[#dcfce7] text-[#15803d]";
      case "LOW":
        return "bg-[#fef3c7] text-[#b45309]";
      case "OUT OF STOCK":
        return "bg-[#fef2f2] text-[#ef4444]";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const formatRelativeTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  // Calculations for Dynamic Summary Cards
  const totalSkus = items.length;
  const totalValue = items.reduce((acc, item) => acc + (item.quantity * 150), 0); // Mock average rate of ₹150/unit
  const lowStockItemsCount = items.filter(item => item.status === "LOW" || item.status === "OUT OF STOCK").length;
  
  const expiringThisMonthCount = items.filter(item => {
    if (!item.expiryDate) return false;
    const exp = new Date(item.expiryDate);
    const now = new Date();
    return exp.getMonth() === now.getMonth() && exp.getFullYear() === now.getFullYear();
  }).length;

  const stats = [
    { label: "Total Skus", value: totalSkus.toString(), icon: Package, color: "text-[#2e37a4]", bg: "bg-[#f0f2ff]" },
    { label: "Total Stock Value", value: `₹${new Intl.NumberFormat('en-IN').format(totalValue)}`, icon: Banknote, color: "text-[#10b981]", bg: "bg-[#ecfdf5]" },
    { label: "Low Stock Items", value: lowStockItemsCount.toString(), icon: Box, color: "text-[#3b82f6]", bg: "bg-[#eff6ff]" },
    { label: "Expiring this month", value: expiringThisMonthCount.toString(), icon: Calendar, color: "text-[#ef4444]", bg: "bg-[#fef2f2]" },
  ];

  // Dynamic lists for filters
  const categories = ["All Categories", ...Array.from(new Set(items.map(item => item.type).filter(Boolean)))];
  const statuses = ["All Status", "IN STOCK", "LOW", "OUT OF STOCK"];

  // Filter items in memory
  const filteredItems = items.filter(item => {
    const matchesSearch = item.medicineName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || item.type === selectedCategory;
    const matchesStatus = selectedStatus === "All Status" || item.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-background border border-border rounded-[5px] text-[13px] font-bold text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary transition-all shadow-none"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Categories Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex-1 md:w-[150px] h-11 px-4 bg-background border border-border rounded-[5px] text-[13px] font-bold text-foreground flex items-center justify-between hover:bg-muted transition-all outline-none group data-[state=open]:border-primary shadow-none">
                <span className="truncate text-left flex-1 mr-2">{selectedCategory}</span>
                <ChevronDown size={14} className="text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px] p-1 border-border rounded-[5px] shadow-none bg-card">
              {categories.map((cat) => (
                <DropdownMenuItem 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="font-bold text-[13px] h-10 px-3 rounded-[5px] cursor-pointer focus:bg-primary/5 focus:text-primary"
                >
                  {cat}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex-1 md:w-[150px] h-11 px-4 bg-background border border-border rounded-[5px] text-[13px] font-bold text-foreground flex items-center justify-between hover:bg-muted transition-all outline-none group data-[state=open]:border-primary shadow-none">
                <span className="truncate text-left flex-1 mr-2">{selectedStatus}</span>
                <ChevronDown size={14} className="text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px] p-1 border-border rounded-[5px] shadow-none bg-card">
              {statuses.map((stat) => (
                <DropdownMenuItem 
                  key={stat}
                  onClick={() => setSelectedStatus(stat)}
                  className="font-bold text-[13px] h-10 px-3 rounded-[5px] cursor-pointer focus:bg-primary/5 focus:text-primary"
                >
                  {stat === "All Status" ? stat : stat}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Inventory Table / Content Area */}
      {loading ? (
        <div className="bg-card rounded-[5px] border border-border p-12 text-center shadow-none flex flex-col items-center justify-center gap-4">
          <div className="h-8 w-8 animate-spin border-[3px] border-primary/20 border-t-primary rounded-full" />
          <p className="text-[13px] font-bold text-muted-foreground">Loading stock items...</p>
        </div>
      ) : error ? (
        <div className="bg-card rounded-[5px] border border-border p-12 text-center shadow-none text-red-500 font-bold text-[13px]">
          {error}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-card rounded-[5px] border border-border p-12 text-center shadow-none text-muted-foreground font-bold text-[13px]">
          No inventory stock records found.
        </div>
      ) : (
        <div className="bg-card rounded-[5px] border border-border overflow-hidden shadow-none">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Medicine</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Category</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Mfg</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Qty</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Status</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Rack</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Updated</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0] dark:divide-[#334155]">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-[#1e293b]/80 transition-all">
                    <td className="px-6 py-4">
                      <p className="text-[13px] font-bold text-[#1e293b] dark:text-white">{item.medicineName}</p>
                    </td>
                    <td className="px-6 py-4 text-[13px] font-bold text-[#475569] dark:text-[#cbd5e1]">{item.type}</td>
                    <td className="px-6 py-4 text-[13px] font-bold text-[#475569] dark:text-[#cbd5e1]">{item.mfg || "-"}</td>
                    <td className="px-6 py-4 text-[13px] font-bold text-[#1e293b] dark:text-white">{item.quantity}</td>
                    <td className="px-6 py-4">
                      <span className={cn("text-[10px] font-bold px-2.5 py-1 rounded-[4px] uppercase tracking-tight", getStatusStyles(item.status))}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[13px] font-bold text-[#475569] dark:text-[#cbd5e1]">{item.rackId || "-"}</td>
                    <td className="px-6 py-4 text-[13px] font-bold text-[#475569] dark:text-[#cbd5e1]">{formatRelativeTime(item.updatedAt)}</td>
                    <td className="px-6 py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors outline-none">
                            <MoreHorizontal size={16} className="text-[#64748b]" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[140px] p-1 border-[#e2e8f0] dark:border-[#334155] rounded-[5px] shadow-none bg-white dark:bg-[#1e293b]">
                          <DropdownMenuItem asChild className="text-[#1e293b] dark:text-white font-bold text-[13px] h-10 px-3 rounded-[5px] cursor-pointer focus:bg-[#2e37a4] focus:text-white transition-colors">
                            <Link href={item.rackId ? `/pharmacy/inventory/rack-view?highlight=${item.rackId}` : "/pharmacy/inventory/rack-view"}>
                              Rack View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="text-[#1e293b] dark:text-white font-bold text-[13px] h-10 px-3 rounded-[5px] cursor-pointer focus:bg-[#2e37a4] focus:text-white transition-colors">
                            <Link href={`/pharmacy/inventory/add-stock/${item.medicineName.replace(/\s+/g, '-').toLowerCase()}`}>
                              Add Stock
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => setDeleteItem(item)}
                            className="text-red-600 font-bold text-[13px] h-10 px-3 rounded-[5px] cursor-pointer focus:bg-red-50 focus:text-red-700 transition-colors gap-2"
                          >
                            <Trash2 size={14} />
                            Delete Item
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
      )}

      {/* Standardized Delete Modal */}
      <AnimatePresence>
        {deleteItem && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDeleteItem(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-[4px]" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white dark:bg-[#101935] w-full max-w-[380px] rounded-[12px] overflow-hidden shadow-2xl border border-gray-100 dark:border-white/5"
            >
              <div className="p-8 flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-rose-50 dark:bg-rose-500/10 rounded-full flex items-center justify-center mb-4">
                  <Trash2 className="w-7 h-7 text-rose-500" />
                </div>
                <h3 className="text-[18px] font-bold text-[#1e293b] dark:text-white mb-2">Delete Medicine?</h3>
                <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed max-w-[280px]">
                  Are you sure you want to delete <span className="font-bold text-gray-700 dark:text-gray-200">{deleteItem.medicineName}</span>? This action cannot be undone.
                </p>
              </div>

              <div className="flex border-t border-gray-100 dark:border-white/5">
                <button 
                  onClick={() => setDeleteItem(null)}
                  className="flex-1 py-4 text-[13px] font-bold text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-r border-gray-100 dark:border-white/5"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 py-4 text-[13px] font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/5 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
