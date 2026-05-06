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
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-4 bg-card px-5 rounded-lg border border-border shadow-none">
      <div className="relative w-full lg:w-[320px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input 
          type="text" 
          placeholder="Search..." 
          className="w-full pl-10 pr-4 py-2.5 bg-muted border border-transparent focus:border-primary rounded-lg text-[13px] placeholder:text-muted-foreground outline-none transition-all text-foreground"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex flex-col sm:flex-row lg:items-center gap-3 w-full lg:w-auto">
        {/* Status Filters Group */}
        <div className="flex bg-muted p-1 rounded-lg border border-border overflow-x-auto no-scrollbar max-w-full">
          <div className="flex min-w-max">
            {statusFilters.map((filter) => (
              <button
                key={filter.label}
                onClick={() => setActiveFilter(filter.label)}
                className={cn(
                  "px-4 py-1.5 rounded-md text-[12px] font-bold transition-all flex items-center gap-2 uppercase-none",
                  activeFilter === filter.label
                    ? "bg-primary text-primary-foreground shadow-none"
                    : "text-muted-foreground hover:text-primary whitespace-nowrap"
                )}
              >
                {filter.label}
                {filter.count && (
                  <span className={cn(
                    "px-1.5 py-0.5 rounded-full text-[9px] font-bold",
                    activeFilter === filter.label 
                      ? "bg-primary-foreground/20 text-primary-foreground" 
                      : filter.variant === "danger" 
                        ? "bg-destructive/10 text-destructive" 
                        : "bg-muted-foreground/20 text-muted-foreground"
                  )}>
                    {filter.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Separator */}
        <div className="hidden sm:block w-[1px] h-8 bg-border mx-1" />

        {/* My Patients Filter */}
        <button
          onClick={() => setActiveFilter("My Patients")}
          className={cn(
            "w-full sm:w-auto px-4 py-2.5 rounded-lg text-[12px] font-bold transition-all flex items-center justify-center gap-2 uppercase-none border",
            activeFilter === "My Patients"
              ? "bg-primary/10 border-primary text-primary"
              : "bg-card border-border text-muted-foreground hover:bg-muted"
          )}
        >
          <UserRound className="w-3.5 h-3.5" />
          My Patients
        </button>
      </div>
    </div>
  );
}
