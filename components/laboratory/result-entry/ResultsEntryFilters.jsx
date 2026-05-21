"use client";
import React from "react";
import { Search } from "lucide-react";

export function ResultsEntryFilters({
  searchQuery,
  setSearchQuery,
  selectedTab,
  setSelectedTab,
  allCount = 42,
  urgentCount = 5,
  highCount = 12
}) {
  return (
    <div className="flex flex-col gap-[20px] w-full">
      {/* Search Box */}
      <div className="relative w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-50" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search patient or barcode..."
          className="w-full h-11 pl-10 pr-4 bg-card border border-border rounded-[5px] text-[13px] font-bold text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary transition-all shadow-none hover:shadow-none focus:shadow-none"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-[10px]">
        {/* All Tab */}
        <button
          onClick={() => setSelectedTab("All")}
          className={`h-9 px-[15px] font-bold text-[12px] rounded-[5px] transition-all cursor-pointer shadow-none outline-none border ${
            selectedTab === "All"
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card hover:bg-muted/10 text-muted-foreground border-border"
          }`}
        >
          All ({allCount})
        </button>

        {/* Urgent Tab */}
        <button
          onClick={() => setSelectedTab("Urgent")}
          className={`h-9 px-[15px] font-bold text-[12px] rounded-[5px] transition-all cursor-pointer shadow-none outline-none border ${
            selectedTab === "Urgent"
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card hover:bg-muted/10 text-muted-foreground border-border"
          }`}
        >
          Urgent ({urgentCount})
        </button>

        {/* High Tab */}
        <button
          onClick={() => setSelectedTab("High")}
          className={`h-9 px-[15px] font-bold text-[12px] rounded-[5px] transition-all cursor-pointer shadow-none outline-none border ${
            selectedTab === "High"
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card hover:bg-muted/10 text-muted-foreground border-border"
          }`}
        >
          High ({highCount})
        </button>
      </div>
    </div>
  );
}
