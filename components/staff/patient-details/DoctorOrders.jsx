"use client";

import React, { useState } from "react";
import { Search, ChevronDown, Calendar, User, Plus, Info, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DoctorOrders() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const categoryOptions = ["All", "DIETARY", "CONSULTATION", "NURSING"];

  const orders = [
    {
      category: "DIETARY",
      categoryVariant: "neutral",
      time: "Today, 08:00 AM",
      description: "NPO (Nothing by mouth) for 12 hours prior to stress test.",
      doctor: "Dr. Sarah Jenkins",
      status: "Active",
      statusVariant: "neutral"
    },
    {
      category: "CONSULTATION",
      categoryVariant: "danger",
      time: "Yesterday, 14:30 PM",
      description: "Cardiology consult required stat regarding recent ECG changes.",
      doctor: "Dr. Alan Turing",
      status: "Pending",
      statusVariant: "danger",
      isUrgent: true
    },
    {
      category: "NURSING",
      categoryVariant: "neutral",
      time: "Yesterday, 09:15 AM",
      description: "Strict I/O monitoring. Report if urine output < 30ml/hr.",
      doctor: "Dr. Sarah Jenkins",
      status: "Active",
      statusVariant: "neutral"
    }
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         order.doctor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "All" || order.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleRequest = (order) => {
    alert(`Raising request for: ${order.description}`);
  };

  return (
    <div className="space-y-[20px] animate-in fade-in duration-500">
      {/* Header Utilities */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-[400px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search orders..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-11 pr-4 bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] outline-none focus:ring-1 focus:ring-primary/20 transition-all shadow-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-11 px-5 bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-bold text-[#1A1C23] dark:text-white flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-all outline-none w-full sm:w-auto justify-between sm:justify-start">
                {filterCategory === "All" ? "All Categories" : filterCategory.charAt(0) + filterCategory.slice(1).toLowerCase()}
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px] bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] p-1 shadow-xl">
              {categoryOptions.map((cat) => (
                <DropdownMenuItem
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={cn(
                    "rounded-[5px] px-3 py-2 text-[13px] font-medium cursor-pointer transition-colors",
                    filterCategory === cat
                      ? "bg-primary/5 text-primary font-bold"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                  )}
                >
                  {cat === "All" ? "All Categories" : cat.charAt(0) + cat.slice(1).toLowerCase()}
                  {filterCategory === cat && <Check className="w-4 h-4 ml-auto" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Title Area */}
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] md:text-[18px] font-bold text-[#1A1C23] dark:text-white uppercase tracking-widest leading-none">Active Orders</h3>
      </div>

      {/* Orders List */}
      <div className="space-y-4 pb-10">
        {filteredOrders.map((order, idx) => (
          <div 
            key={idx} 
            className={cn(
              "bg-white dark:bg-[#101935] p-5 md:p-6 rounded-[5px] border transition-all",
              order.isUrgent ? "border-rose-200 dark:border-rose-500/30 ring-1 ring-rose-500/10" : "border-[#E7E8EB] dark:border-white/10"
            )}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex flex-wrap items-center gap-3 md:gap-4">
                <span className={cn(
                  "px-2.5 py-1 rounded-[3px] text-[9px] font-black uppercase tracking-widest",
                  order.categoryVariant === "danger" ? "bg-rose-500 text-white" : "bg-gray-100 dark:bg-white/5 text-gray-400 border border-gray-200/50 dark:border-white/5"
                )}>
                  {order.category}
                </span>
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-bold uppercase tracking-wide">{order.time}</span>
                </div>
              </div>
              <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-gray-50 dark:border-white/5">
                <span className={cn(
                  "text-[12px] font-black uppercase tracking-widest",
                  order.statusVariant === "danger" ? "text-rose-500" : "text-[#1A1C23] dark:text-gray-400"
                )}>
                  {order.status}
                </span>
                <button 
                  onClick={() => handleRequest(order)}
                  className="px-6 h-9 text-[10px] font-black text-[#5E6C84] dark:text-gray-400 bg-gray-50 dark:bg-white/5 border border-[#E7E8EB] dark:border-white/10 rounded-[5px] hover:bg-gray-100 transition-all uppercase tracking-widest"
                >
                  Raise Request
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[15px] md:text-[17px] font-bold text-[#1A1C23] dark:text-white leading-relaxed">
                {order.description}
              </p>
              <div className="flex items-center gap-2 text-gray-400 border-t border-gray-50 dark:border-white/5 pt-4">
                <div className="w-6 h-6 rounded-full bg-primary/5 flex items-center justify-center">
                  <User className="w-3 h-3 text-primary" />
                </div>
                <span className="text-[12px] font-bold">Ordered by: <span className="text-[#1A1C23] dark:text-white">{order.doctor}</span></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
