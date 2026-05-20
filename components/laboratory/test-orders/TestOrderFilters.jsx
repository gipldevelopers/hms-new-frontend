"use client";
import React, { useState } from "react";
import { Search, Calendar, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function TestOrderFilters() {
  const [date, setDate] = useState("Today");
  const [priority, setPriority] = useState("Priority: All");
  const [status, setStatus] = useState("Status: All");
  const [doctor, setDoctor] = useState("Doctor: All Doctors");

  return (
    <div className="bg-card p-3 rounded-lg border border-border flex flex-col xl:flex-row gap-3 xl:items-center justify-between shadow-none">
      {/* Search Input */}
      <div className="relative w-full xl:w-[320px]">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-50" />
        <input
          type="text"
          placeholder="Search Patient name / Order ID..."
          className="w-full h-11 pl-10 pr-4 bg-background border border-border rounded-lg text-[13px] font-bold text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary transition-all shadow-none"
        />
      </div>

      {/* Filter Dropdowns */}
      <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
        {/* Date Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex-grow sm:flex-none sm:w-[150px] h-11 px-4 bg-background border border-border rounded-lg text-[13px] font-bold text-foreground flex items-center justify-between hover:bg-muted/50 transition-all outline-none group data-[state=open]:border-primary shadow-none cursor-pointer">
              <div className="flex items-center gap-2 truncate">
                <Calendar size={14} className="text-muted-foreground shrink-0" />
                <span className="truncate text-left">{date}</span>
              </div>
              <ChevronDown size={14} className="text-muted-foreground transition-transform group-data-[state=open]:rotate-180 shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px] p-1 border-border rounded-lg shadow-none bg-card">
            {["Today", "Yesterday", "Last 7 Days", "All Time"].map((opt) => (
              <DropdownMenuItem
                key={opt}
                onClick={() => setDate(opt)}
                className="font-bold text-[13px] h-10 px-3 rounded-lg cursor-pointer focus:bg-primary/5 focus:text-primary"
              >
                {opt}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Priority Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex-grow sm:flex-none sm:w-[150px] h-11 px-4 bg-background border border-border rounded-lg text-[13px] font-bold text-foreground flex items-center justify-between hover:bg-muted/50 transition-all outline-none group data-[state=open]:border-primary shadow-none cursor-pointer">
              <span className="truncate text-left flex-1 mr-2">{priority}</span>
              <ChevronDown size={14} className="text-muted-foreground transition-transform group-data-[state=open]:rotate-180 shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px] p-1 border-border rounded-lg shadow-none bg-card">
            {["Priority: All", "Urgent", "High", "Normal"].map((opt) => (
              <DropdownMenuItem
                key={opt}
                onClick={() => setPriority(opt)}
                className="font-bold text-[13px] h-10 px-3 rounded-lg cursor-pointer focus:bg-primary/5 focus:text-primary"
              >
                {opt}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Status Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex-grow sm:flex-none sm:w-[150px] h-11 px-4 bg-background border border-border rounded-lg text-[13px] font-bold text-foreground flex items-center justify-between hover:bg-muted/50 transition-all outline-none group data-[state=open]:border-primary shadow-none cursor-pointer">
              <span className="truncate text-left flex-1 mr-2">{status}</span>
              <ChevronDown size={14} className="text-muted-foreground transition-transform group-data-[state=open]:rotate-180 shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px] p-1 border-border rounded-lg shadow-none bg-card">
            {["Status: All", "Pending", "Collecting", "Completed"].map((opt) => (
              <DropdownMenuItem
                key={opt}
                onClick={() => setStatus(opt)}
                className="font-bold text-[13px] h-10 px-3 rounded-lg cursor-pointer focus:bg-primary/5 focus:text-primary"
              >
                {opt}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Doctor Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex-grow sm:flex-none sm:w-[170px] h-11 px-4 bg-background border border-border rounded-lg text-[13px] font-bold text-foreground flex items-center justify-between hover:bg-muted/50 transition-all outline-none group data-[state=open]:border-primary shadow-none cursor-pointer">
              <span className="truncate text-left flex-1 mr-2">{doctor}</span>
              <ChevronDown size={14} className="text-muted-foreground transition-transform group-data-[state=open]:rotate-180 shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[190px] p-1 border-border rounded-lg shadow-none bg-card">
            {["Doctor: All Doctors", "Dr. Sarah Smith", "Dr. Michael", "Dr. John Doe"].map((opt) => (
              <DropdownMenuItem
                key={opt}
                onClick={() => setDoctor(opt)}
                className="font-bold text-[13px] h-10 px-3 rounded-lg cursor-pointer focus:bg-primary/5 focus:text-primary"
              >
                {opt}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
