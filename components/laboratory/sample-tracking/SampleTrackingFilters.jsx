"use client";
import React from "react";
import { Search, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SampleTrackingFilters({
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
  selectedLocation,
  setSelectedLocation,
  statusList = ["All", "Received", "Processing"],
  locationList = ["All Labs", "Ward A → Main Lab", "Accessioning", "Biochemistry Auto-Analyzer", "Fridge A, Rack 2"]
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
        {/* Status Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full sm:w-[150px] h-11 px-4 bg-card border border-border rounded-[5px] text-[13px] font-bold text-foreground flex items-center justify-between hover:bg-muted/10 transition-all outline-none group data-[state=open]:border-primary shadow-none hover:shadow-none focus:shadow-none cursor-pointer">
              <span className="truncate text-left">Status: {selectedStatus}</span>
              <ChevronDown size={14} className="text-muted-foreground transition-transform group-data-[state=open]:rotate-180 shrink-0 ml-2" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px] p-1 border-border rounded-[5px] shadow-none bg-card">
            {statusList.map((opt) => (
              <DropdownMenuItem
                key={opt}
                onClick={() => setSelectedStatus(opt)}
                className="font-bold text-[13px] h-10 px-3 rounded-[5px] cursor-pointer focus:bg-primary/5 focus:text-primary shadow-none hover:shadow-none"
              >
                {opt}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Location Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full sm:w-[190px] h-11 px-4 bg-card border border-border rounded-[5px] text-[13px] font-bold text-foreground flex items-center justify-between hover:bg-muted/10 transition-all outline-none group data-[state=open]:border-primary shadow-none hover:shadow-none focus:shadow-none cursor-pointer">
              <span className="truncate text-left">Location: {selectedLocation === "All Labs" ? "All Labs" : selectedLocation}</span>
              <ChevronDown size={14} className="text-muted-foreground transition-transform group-data-[state=open]:rotate-180 shrink-0 ml-2" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px] p-1 border-border rounded-[5px] shadow-none bg-card">
            {locationList.map((opt) => (
              <DropdownMenuItem
                key={opt}
                onClick={() => setSelectedLocation(opt)}
                className="font-bold text-[13px] h-10 px-3 rounded-[5px] cursor-pointer focus:bg-primary/5 focus:text-primary shadow-none hover:shadow-none"
              >
                {opt === "All Labs" ? "All Labs" : opt}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
