"use client";
import React, { useState } from "react";
import { ChevronDown, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function CriticalValuesFilters({
  activeTab,
  setActiveTab,
  selectedDate,
  setSelectedDate,
  selectedDept,
  setSelectedDept,
  unacknowledgedCount = 2,
  acknowledgedCount = 1
}) {
  const dateOptions = [
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "Last 7 Days", value: "7days" }
  ];

  const departmentOptions = [
    { label: "Department: All", value: "all" },
    { label: "Biochemistry", value: "Biochemistry" },
    { label: "Immunology", value: "Immunology" },
    { label: "Hematology", value: "Hematology" }
  ];

  const currentDeptLabel = departmentOptions.find(o => o.value === selectedDept)?.label || "Department: All";
  const currentDateLabel = dateOptions.find(o => o.value === selectedDate)?.label || "Today";

  return (
    <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-[20px] w-full">
      {/* Left side: Custom Tabs */}
      <div className="flex items-center gap-[10px] bg-muted/20 p-[4px] rounded-[6px] border border-border w-fit">
        <button
          onClick={() => setActiveTab("unacknowledged")}
          className={cn(
            "h-8 px-[16px] text-[13px] font-bold rounded-[5px] transition-all cursor-pointer shadow-none outline-none border-none",
            activeTab === "unacknowledged"
              ? "bg-primary text-primary-foreground font-bold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Unacknowledged
        </button>
        <button
          onClick={() => setActiveTab("acknowledged")}
          className={cn(
            "h-8 px-[16px] text-[13px] font-bold rounded-[5px] transition-all cursor-pointer shadow-none outline-none border-none",
            activeTab === "acknowledged"
              ? "bg-primary text-primary-foreground font-bold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Acknowledged
        </button>
      </div>

      {/* Right side: Dropdown Selectors */}
      <div className="flex items-center gap-[12px] flex-wrap sm:flex-nowrap">
        {/* Date Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="h-10 px-3 bg-card border border-border rounded-[5px] text-[13px] font-bold text-foreground flex items-center gap-2 hover:bg-muted/10 transition-all outline-none shadow-none cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="truncate flex-1 text-left font-bold">{currentDateLabel}</span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[130px] border border-border bg-card rounded-[5px] p-1 z-[500] shadow-none">
            {dateOptions.map((opt) => (
              <DropdownMenuItem
                key={opt.value}
                onClick={() => setSelectedDate(opt.value)}
                className={cn(
                  "rounded-[4px] text-[13px] font-bold px-3 py-2 cursor-pointer",
                  selectedDate === opt.value
                    ? "bg-accent text-accent-foreground font-bold"
                    : "text-foreground hover:bg-muted/10"
                )}
              >
                {opt.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Department Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="h-10 px-3 bg-card border border-border rounded-[5px] text-[13px] font-bold text-foreground flex items-center gap-2 hover:bg-muted/10 transition-all outline-none shadow-none cursor-pointer"
            >
              <span className="truncate flex-1 text-left font-bold">{currentDeptLabel}</span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[150px] border border-border bg-card rounded-[5px] p-1 z-[500] shadow-none">
            {departmentOptions.map((opt) => (
              <DropdownMenuItem
                key={opt.value}
                onClick={() => setSelectedDept(opt.value)}
                className={cn(
                  "rounded-[4px] text-[13px] font-bold px-3 py-2 cursor-pointer",
                  selectedDept === opt.value
                    ? "bg-accent text-accent-foreground font-bold"
                    : "text-foreground hover:bg-muted/10"
                )}
              >
                {opt.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
