"use client";

import React from "react";
import { Search, ChevronDown, Download, Users, Hospital, ClipboardCheck, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const opdSummary = [
  { date: "Oct 24, 2023", seen: 42, orders: 18 },
  { date: "Oct 23, 2023", seen: 38, orders: 15 },
  { date: "Oct 22, 2023", seen: 45, orders: 22 },
  { date: "Oct 21, 2023", seen: 31, orders: 10 },
  { date: "Oct 20, 2023", seen: 29, orders: 12 },
  { date: "Oct 19, 2023", seen: 40, orders: 19 },
  { date: "Oct 18, 2023", seen: 36, orders: 14 },
];

const ipdSummary = [
  { name: "John Doe", admitted: "Oct 20, 2023", discharged: "Oct 24, 2023", status: "Discharged" },
  { name: "Jane Smith", admitted: "Oct 21, 2023", discharged: "-", status: "Admitted" },
  { name: "Robert Brown", admitted: "Oct 18, 2023", discharged: "Oct 22, 2023", status: "Discharged" },
  { name: "Emily Davis", admitted: "Oct 23, 2023", discharged: "-", status: "Admitted" },
  { name: "Michael Wilson", admitted: "Oct 19, 2023", discharged: "Oct 23, 2023", status: "Discharged" },
  { name: "Sarah Taylor", admitted: "Oct 22, 2023", discharged: "-", status: "Admitted" },
  { name: "David Anderson", admitted: "Oct 15, 2023", discharged: "Oct 20, 2023", status: "Discharged" },
  { name: "Lisa Thomas", admitted: "Oct 24, 2023", discharged: "-", status: "Admitted" },
  { name: "James Jackson", admitted: "Oct 16, 2023", discharged: "Oct 21, 2023", status: "Discharged" },
  { name: "William White", admitted: "Oct 24, 2023", discharged: "-", status: "Admitted" },
];

function CustomSelect({ value, onChange, options, placeholder, minWidth = "100px" }) {
  const selected = options.find((o) => o.value === value);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="h-10 px-4 bg-card border border-border rounded-lg flex items-center justify-between gap-2 text-[13px] font-medium outline-none transition-all shadow-none w-full sm:w-auto"
          style={{ minWidth: typeof window !== 'undefined' && window.innerWidth < 640 ? '100%' : minWidth }}
        >
          <span className="truncate text-foreground">{selected ? selected.label : placeholder}</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[120px] border border-border bg-card p-1 rounded-lg shadow-none z-50">
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-lg text-[13px] font-medium px-3 py-2 cursor-pointer transition-colors outline-none",
              value === opt.value
                ? "bg-primary/5 text-primary font-bold dark:bg-primary/10"
                : "text-foreground hover:bg-muted dark:hover:bg-muted/50"
            )}
          >
            {opt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function ReportsPage() {
  const [search, setSearch] = React.useState("");

  return (
    <div className="p-4 md:p-5 bg-background min-h-screen flex flex-col gap-5 md:gap-6 transition-colors duration-300 font-sans pb-20">
      
      {/* Header & Export - Moved to Top */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h1 className="text-[20px] font-bold text-foreground tracking-tight leading-none">
          Reports
        </h1>
        <button className="h-10 px-6 rounded-lg bg-primary text-primary-foreground text-[13px] font-bold hover:opacity-90 transition-all shadow-none flex items-center gap-2 w-full sm:w-auto justify-center">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[
          { label: "Total OPD Patients", value: "261", icon: Users, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10", border: "border-blue-100 dark:border-blue-500/20" },
          { label: "Total IPD Patients", value: "10", icon: Hospital, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-500/10", border: "border-rose-100 dark:border-rose-500/20" },
          { label: "Pending Discharge Summaries", value: "2", icon: ClipboardCheck, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10", border: "border-emerald-100 dark:border-emerald-500/20" },
        ].map((stat, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-6 flex justify-between items-center shadow-none group">
            <div className="space-y-3">
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center border", stat.bg, stat.border)}>
                <stat.icon className={cn("w-5 h-5", stat.color)} />
              </div>
              <p className="text-[13px] font-medium text-muted-foreground">{stat.label}</p>
            </div>
            <p className="text-[32px] font-bold text-foreground leading-none">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-card border border-border p-3.5 rounded-lg shadow-none">
        <div className="relative w-full md:max-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-card border border-border rounded-lg text-[13px] font-medium outline-none focus:border-primary transition-all shadow-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-3">
          <CustomSelect value="All" options={[{label: "All Time", value: "All"}]} placeholder="Period: All" minWidth="120px" />
          <CustomSelect value="All" options={[{label: "All Status", value: "All"}]} placeholder="Status: All" minWidth="120px" />
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* OPD Summary Table */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-[14px] font-bold text-foreground flex items-center gap-2 px-1">
            Recent OPD Summary (7 Days)
          </h2>
          <div className="bg-card border border-border rounded-lg overflow-hidden shadow-none overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse min-w-[300px]">
              <thead>
                <tr className="bg-muted/50 border-b border-border text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4 text-center">Patients Seen</th>
                  <th className="px-5 py-4 text-center">Orders Given</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {opdSummary.map((item, i) => (
                  <tr key={i} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5 text-[13px] font-medium text-foreground">{item.date}</td>
                    <td className="px-5 py-3.5 text-[13px] font-bold text-foreground text-center">{item.seen}</td>
                    <td className="px-5 py-3.5 text-[13px] font-medium text-muted-foreground text-center">{item.orders}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* IPD Summary Table */}
        <div className="lg:col-span-3 space-y-4">
          <h2 className="text-[14px] font-bold text-foreground flex items-center gap-2 px-1">
            Recent IPD Summary
          </h2>
          <div className="bg-card border border-border rounded-lg overflow-hidden shadow-none overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-muted/50 border-b border-border text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  <th className="px-5 py-4">Patient Name</th>
                  <th className="px-5 py-4">Admitted</th>
                  <th className="px-5 py-4">Discharged</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ipdSummary.map((item, i) => (
                  <tr key={i} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3 text-[13px] font-bold text-foreground">{item.name}</td>
                    <td className="px-5 py-3 text-[12px] font-medium text-muted-foreground">{item.admitted}</td>
                    <td className="px-5 py-3 text-[12px] font-medium text-muted-foreground">{item.discharged}</td>
                    <td className="px-5 py-3">
                      <span className={cn(
                        "px-2.5 py-0.5 rounded-lg text-[10px] font-bold tracking-wider",
                        item.status === "Discharged" ? "bg-muted text-muted-foreground" : "bg-blue-50 dark:bg-blue-500/10 text-blue-600"
                      )}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
