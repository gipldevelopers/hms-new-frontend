"use client";

import React from "react";
import {
  Search,
  ChevronDown,
  Eye,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Receipt,
  Filter,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export default function PatientReceipts() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("");

  const stats = [
    { label: "Today's Receipts", value: "142", icon: Receipt, color: "text-[#3B4CB8]", bg: "bg-[#3B4CB8]/5" },
    { label: "Pending", value: "45", icon: Clock, color: "text-[#EF4444]", bg: "bg-[#EF4444]/5" },
    { label: "Completed", value: "5", icon: CheckCircle2, color: "text-[#00A389]", bg: "bg-[#00A389]/5" },
    { label: "No Show", value: "2", icon: Calendar, color: "text-[#3B4CB8]", bg: "bg-[#3B4CB8]/5" },
  ];

  const receiptData = [
    { name: "Sarah Jenkins", mobile: "+91 84636 86523", gender: "Female", age: "32 yrs", date: "Oct 24, 2023 09:41 AM", status: "Pending" },
    { name: "Sarah Jenkins", mobile: "+91 84636 86523", gender: "Female", age: "32 yrs", date: "Oct 24, 2023 09:41 AM", status: "Completed" },
    { name: "Sarah Jenkins", mobile: "+91 84636 86523", gender: "Female", age: "32 yrs", date: "Oct 24, 2023 09:41 AM", status: "Completed" },
    { name: "Sarah Jenkins", mobile: "+91 84636 86523", gender: "Female", age: "32 yrs", date: "Oct 24, 2023 09:41 AM", status: "Completed" },
    { name: "Sarah Jenkins", mobile: "+91 84636 86523", gender: "Female", age: "32 yrs", date: "Oct 24, 2023 09:41 AM", status: "Pending" },
    { name: "Sarah Jenkins", mobile: "+91 84636 86523", gender: "Female", age: "32 yrs", date: "Oct 24, 2023 09:41 AM", status: "Completed" },
    { name: "Sarah Jenkins", mobile: "+91 84636 86523", gender: "Female", age: "32 yrs", date: "Oct 24, 2023 09:41 AM", status: "Completed" },
    { name: "Sarah Jenkins", mobile: "+91 84636 86523", gender: "Female", age: "32 yrs", date: "Oct 24, 2023 09:41 AM", status: "Pending" },
    { name: "Sarah Jenkins", mobile: "+91 84636 86523", gender: "Female", age: "32 yrs", date: "Oct 24, 2023 09:41 AM", status: "Pending" },
    { name: "Sarah Jenkins", mobile: "+91 84636 86523", gender: "Female", age: "32 yrs", date: "Oct 24, 2023 09:41 AM", status: "Completed" },
    { name: "Sarah Jenkins", mobile: "+91 84636 86523", gender: "Female", age: "32 yrs", date: "Oct 24, 2023 09:41 AM", status: "Completed" },
  ];

  const getStatusStyles = (status) => {
    switch (status) {
      case "Completed": return "bg-[#E6F9F1] text-[#00A389]";
      case "Pending": return "bg-muted/50 text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="flex flex-col gap-5 p-5 min-h-screen bg-background">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-[20px] font-bold text-foreground">
          Patient Receipts
        </h1>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card border border-border rounded-[var(--radius)] p-3 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-none">
            <div className="space-y-1 sm:space-y-3">
              <div className={cn("w-9 h-9 sm:w-11 sm:h-11 rounded-[var(--radius)] flex items-center justify-center shrink-0", stat.bg)}>
                <stat.icon className={cn("w-4.5 h-4.5 sm:w-5.5 sm:h-5.5", stat.color)} />
              </div>
              <p className="text-[10px] sm:text-[13px] font-bold text-muted-foreground uppercase tracking-tight sm:normal-case sm:tracking-normal">{stat.label}</p>
            </div>
            <h3 className="text-[20px] sm:text-[32px] font-bold text-foreground leading-none self-start sm:self-center">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Content Section */}
      <div className="bg-card border border-border rounded-[var(--radius)] overflow-hidden shadow-none">
        {/* Filters */}
        <div className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border/60">
          <div className="relative w-full lg:w-[320px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
            <input
              type="text"
              placeholder="Search receipts..."
              className="w-full h-10 pl-11 pr-4 bg-muted/30 border border-border rounded-[var(--radius)] text-[13px] font-medium outline-none focus:border-primary transition-all shadow-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex-1 sm:flex-none h-10 px-4 bg-card border border-border rounded-[var(--radius)] text-[13px] font-bold text-foreground flex items-center justify-between sm:justify-start gap-2 hover:bg-muted transition-all outline-none shadow-none">
                    <span className="truncate text-muted-foreground font-medium">Type:</span> All
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[180px] border-border bg-card rounded-[var(--radius)] p-1 shadow-xl">
                  <DropdownMenuItem className="text-[13px] font-medium h-10 px-3 cursor-pointer focus:bg-primary/5 rounded-[3px]">All Receipts</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex-1 sm:flex-none h-10 px-4 bg-card border border-border rounded-[var(--radius)] text-[13px] font-bold text-foreground flex items-center justify-between sm:justify-start gap-2 hover:bg-muted transition-all outline-none shadow-none">
                    <span className="truncate text-muted-foreground font-medium">Status:</span> All
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[180px] border-border bg-card rounded-[var(--radius)] p-1 shadow-xl">
                  <DropdownMenuItem className="text-[13px] font-medium h-10 px-3 cursor-pointer focus:bg-primary/5 rounded-[3px]">All Status</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Table View (Desktop) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-muted/30 border-b border-border/60">
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground tracking-wider uppercase">Patient Name</th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground tracking-wider uppercase">Mobile</th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground tracking-wider uppercase">Gender / Age</th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground tracking-wider uppercase">Registration Date</th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground tracking-wider uppercase text-center">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground tracking-wider uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {receiptData.map((item, index) => (
                <tr 
                  key={index} 
                  className="hover:bg-muted/10 transition-colors cursor-pointer"
                  onClick={() => {
                    if (item.status === "Pending") {
                      router.push(`/reception/patient-receipts/${index + 1}`);
                    } else {
                      router.push("/reception/patient-receipts/completed-receipt");
                    }
                  }}
                >
                  <td className="px-6 py-5 text-[14px] font-bold text-foreground">{item.name}</td>
                  <td className="px-6 py-5 text-[13px] font-medium text-foreground">{item.mobile}</td>
                  <td className="px-6 py-5 text-[13px] font-medium text-foreground">{item.gender} • {item.age}</td>
                  <td className="px-6 py-5 text-[13px] font-medium text-foreground">{item.date}</td>
                  <td className="px-6 py-5 text-center">
                    <span className={cn(
                      "px-3 py-1 rounded-[var(--radius)] text-[10px] font-bold inline-block",
                      getStatusStyles(item.status)
                    )}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2 hover:bg-muted rounded-[var(--radius)] transition-all">
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View - Cards */}
        <div className="md:hidden divide-y divide-border/60">
          {receiptData.map((item, index) => (
            <div 
              key={index} 
              className="p-4 space-y-4 hover:bg-muted/5 transition-colors cursor-pointer"
              onClick={() => {
                if (item.status === "Pending") {
                  router.push(`/reception/patient-receipts/${index + 1}`);
                } else {
                  router.push("/reception/patient-receipts/completed-receipt");
                }
              }}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="text-[15px] font-bold text-foreground">{item.name}</h3>
                  <p className="text-[12px] font-medium text-muted-foreground">{item.mobile}</p>
                </div>
                <span className={cn(
                  "px-2 py-0.5 rounded-[3px] text-[10px] font-bold",
                  getStatusStyles(item.status)
                )}>{item.status}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 p-3 bg-muted/20 border border-border/40 rounded-[var(--radius)]">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Info</p>
                  <p className="text-[12px] font-bold text-foreground">{item.gender} • {item.age}</p>
                </div>
                <div className="space-y-0.5 text-right">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Date</p>
                  <p className="text-[12px] font-bold text-foreground">{item.date.split(' ').slice(0, 3).join(' ')}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  className="flex-1 h-10 bg-card border border-border rounded-[var(--radius)] text-[12px] font-bold text-foreground shadow-none flex items-center justify-center gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (item.status === "Pending") {
                      router.push(`/reception/patient-receipts/${index + 1}`);
                    } else {
                      router.push("/reception/patient-receipts/completed-receipt");
                    }
                  }}
                >
                  <Eye className="w-4 h-4" />
                  View Receipt
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Footer */}
        <div className="p-4 sm:p-5 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] font-bold text-muted-foreground order-2 sm:order-1">
            Showing <span className="text-foreground">1</span> to <span className="text-foreground">10</span> of <span className="text-foreground">142</span> entries
          </p>
          <div className="flex items-center gap-2 order-1 sm:order-2">
            <button className="h-8 px-2 border border-border bg-card rounded-[3px] text-muted-foreground hover:bg-muted transition-all shadow-none disabled:opacity-50">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1">
              {[1, 2, 3, "...", 15].map((page, i) => (
                <button
                  key={i}
                  className={cn(
                    "w-8 h-8 rounded-[3px] text-[12px] font-bold transition-all shadow-none",
                    page === 1
                      ? "bg-primary text-white"
                      : "bg-card border border-border text-foreground hover:bg-muted"
                  )}
                >
                  {page}
                </button>
              ))}
            </div>
            <button className="h-8 px-2 border border-border bg-card rounded-[3px] text-muted-foreground hover:bg-muted transition-all shadow-none">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
