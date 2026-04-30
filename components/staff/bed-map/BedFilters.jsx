"use client";

import React from "react";
import { 
  Search, 
  UserRound, 
  Command 
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function BedFilters({ 
  searchQuery, 
  setSearchQuery, 
  activeFilter, 
  setActiveFilter,
  stats
}) {

  const statusFilters = [
    { label: "All", count: stats?.total },
    { label: "Occupied", count: stats?.occupied },
    { label: "Vacant", count: stats?.vacant },
    { label: "Critical", count: stats?.critical, variant: "danger" },
  ];

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-4 bg-white dark:bg-[#101935] px-5 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 shadow-none">
      <div className="relative w-full lg:w-[320px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0AEC0]" />
        <input 
          type="text" 
          placeholder="Search..." 
          className="w-full pl-10 pr-4 py-2.5 bg-[#F4F5F7] dark:bg-white/5 border border-transparent focus:border-[#E7E8EB] rounded-[5px] text-[13px] placeholder:text-[#A0AEC0] outline-none transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex flex-col sm:flex-row lg:items-center gap-3 w-full lg:w-auto">
        {/* Status Filters Group */}
        <div className="flex bg-[#F4F5F7] dark:bg-white/5 p-1 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 overflow-x-auto no-scrollbar max-w-full">
          <div className="flex min-w-max">
            {statusFilters.map((filter) => (
              <button
                key={filter.label}
                onClick={() => setActiveFilter(filter.label)}
                className={cn(
                  "px-4 py-1.5 rounded-[4px] text-[12px] font-bold transition-all flex items-center gap-2 uppercase-none",
                  activeFilter === filter.label
                    ? "bg-[#2D3A8C] text-white shadow-none"
                    : "text-[#5E6C84] dark:text-slate-400 hover:text-[#2D3A8C] whitespace-nowrap"
                )}
              >
                {filter.label}
                {filter.count && (
                  <span className={cn(
                    "px-1.5 py-0.5 rounded-full text-[9px] font-bold",
                    activeFilter === filter.label 
                      ? "bg-white/20 text-white" 
                      : filter.variant === "danger" 
                        ? "bg-rose-100 text-rose-500" 
                        : "bg-gray-200 dark:bg-white/10 text-gray-500"
                  )}>
                    {filter.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Separator */}
        <div className="hidden sm:block w-[1px] h-8 bg-[#E7E8EB] dark:bg-white/10 mx-1" />

        {/* My Patients Filter */}
        <button
          onClick={() => setActiveFilter("My Patients")}
          className={cn(
            "w-full sm:w-auto px-4 py-2.5 rounded-[5px] text-[12px] font-bold transition-all flex items-center justify-center gap-2 uppercase-none border",
            activeFilter === "My Patients"
              ? "bg-[#F3F4FF] border-[#2D3A8C] text-[#2D3A8C]"
              : "bg-white dark:bg-white/5 border-[#E7E8EB] dark:border-white/10 text-[#5E6C84] dark:text-slate-400 hover:bg-gray-50"
          )}
        >
          <UserRound className="w-3.5 h-3.5" />
          My Patients
        </button>
      </div>
    </div>
  );
}
