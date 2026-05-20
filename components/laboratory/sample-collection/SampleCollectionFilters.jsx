"use client";
import React from "react";
import { Search, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SampleCollectionFilters({
  searchQuery,
  setSearchQuery,
  selectedWard,
  setSelectedWard,
  selectedPriority,
  setSelectedPriority,
  wardsList = ["All Wards", "Ward A", "Ward B", "OPD"],
  prioritiesList = ["All Priorities", "Urgent", "High", "Normal"]
}) {
  return (
    <div className="flex flex-col md:flex-row gap-[20px] md:items-center justify-between w-full">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-50" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Patient name / Order ID..."
          className="w-full h-11 pl-10 pr-4 bg-card border border-border rounded-[5px] text-[13px] font-bold text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary transition-all shadow-none hover:shadow-none focus:shadow-none"
        />
      </div>

      {/* Dropdown Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-[20px] w-full md:w-auto">
        {/* Ward Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full sm:w-[160px] h-11 px-4 bg-card border border-border rounded-[5px] text-[13px] font-bold text-foreground flex items-center justify-between hover:bg-muted/10 transition-all outline-none group data-[state=open]:border-primary shadow-none hover:shadow-none focus:shadow-none cursor-pointer">
              <span className="truncate text-left">Ward: {selectedWard === "All Wards" ? "All Wards" : selectedWard}</span>
              <ChevronDown size={14} className="text-muted-foreground transition-transform group-data-[state=open]:rotate-180 shrink-0 ml-2" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px] p-1 border-border rounded-[5px] shadow-none bg-card">
            {wardsList.map((opt) => (
              <DropdownMenuItem
                key={opt}
                onClick={() => setSelectedWard(opt)}
                className="font-bold text-[13px] h-10 px-3 rounded-[5px] cursor-pointer focus:bg-primary/5 focus:text-primary shadow-none hover:shadow-none"
              >
                {opt}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Priority Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full sm:w-[150px] h-11 px-4 bg-card border border-border rounded-[5px] text-[13px] font-bold text-foreground flex items-center justify-between hover:bg-muted/10 transition-all outline-none group data-[state=open]:border-primary shadow-none hover:shadow-none focus:shadow-none cursor-pointer">
              <span className="truncate text-left">Priority: {selectedPriority === "All Priorities" ? "All" : selectedPriority}</span>
              <ChevronDown size={14} className="text-muted-foreground transition-transform group-data-[state=open]:rotate-180 shrink-0 ml-2" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px] p-1 border-border rounded-[5px] shadow-none bg-card">
            {prioritiesList.map((opt) => (
              <DropdownMenuItem
                key={opt}
                onClick={() => setSelectedPriority(opt)}
                className="font-bold text-[13px] h-10 px-3 rounded-[5px] cursor-pointer focus:bg-primary/5 focus:text-primary shadow-none hover:shadow-none"
              >
                {opt === "All Priorities" ? "All" : opt}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
