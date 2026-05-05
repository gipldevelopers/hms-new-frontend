"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Search,
  Plus,
  ChevronDown,
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  MoreVertical,
  Play,
  ArrowRight,
  Filter,
  Check,
  Bell,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const STATS = [
  {
    label: "Total Queue",
    value: "42",
    icon: Calendar,
    color: "text-purple-600",
    bgColor: "bg-purple-600/10",
  },
  {
    label: "Waiting",
    value: "28",
    icon: Users,
    color: "text-rose-600",
    bgColor: "bg-rose-600/10",
  },
  {
    label: "In Progress",
    value: "01",
    icon: Clock,
    color: "text-blue-600",
    bgColor: "bg-blue-600/10",
  },
  {
    label: "Completed",
    value: "14",
    icon: CheckCircle2,
    color: "text-emerald-600",
    bgColor: "bg-emerald-600/10",
  },
];

const QUEUE_DATA = [
  { id: 1, token: "T-01", name: "Sarah Jenkins", ageGender: "45 yrs / F", waitTime: "Done", status: "Done" },
  { id: 2, token: "T-02", name: "Michael Chen", ageGender: "32 yrs / M", waitTime: "Done", status: "Done" },
  { id: 3, token: "T-03", name: "Elena Rodriguez", ageGender: "28 yrs / F", waitTime: "0 min", status: "Done" },
  { id: 4, token: "T-04", name: "James Wilson", ageGender: "61 yrs / M", waitTime: "15 mins", status: "Waiting" },
  { id: 5, token: "T-05", name: "Anita Patel", ageGender: "52 yrs / F", waitTime: "30 mins", status: "Waiting" },
  { id: 6, token: "T-06", name: "David Thompson", ageGender: "40 yrs / M", waitTime: "45 mins", status: "Waiting" },
];

function CustomSelect({ value, onChange, options, placeholder, minWidth = "100px" }) {
  const selected = options.find((o) => o.value === value);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="h-10 px-4 bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] flex items-center justify-between gap-2 text-[13px] font-medium outline-none transition-all shadow-none"
          style={{ minWidth }}
        >
          <span className="truncate">{selected ? selected.label : placeholder}</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[120px] border border-[#E7E8EB] dark:border-white/10 bg-white dark:bg-[#101935] p-1 rounded-[5px] shadow-none z-50">
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-[5px] text-[13px] font-medium px-3 py-2 cursor-pointer transition-colors outline-none",
              value === opt.value
                ? "bg-primary/5 text-primary font-bold dark:bg-primary/10"
                : "text-foreground hover:bg-[#F8F9FC] dark:hover:bg-white/5"
            )}
          >
            {opt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// --- CALL NEXT MODAL ---
function CallNextModal({ onClose }) {
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 300);
  };

  useEffect(() => {
    setMounted(true);
    const handleEsc = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleEsc);

    // Scroll lock
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = originalStyle;
    };
  }, []);

  if (!mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className={cn(
          "absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300",
          closing ? "animate-out fade-out" : "animate-in fade-in"
        )}
        onClick={handleClose}
      />
      
      {/* Modal Container */}
      <div className={cn(
        "relative bg-white dark:bg-[#101935] w-full max-w-[440px] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 flex flex-col p-8 items-center text-center duration-300 shadow-none z-10",
        closing ? "animate-out zoom-out-95 fade-out" : "animate-in zoom-in-95 fade-in"
      )}>
        {/* Bell Icon with Badge */}
        <div className="relative mb-6">
          <div className="w-16 h-16 bg-[#F8F9FC] dark:bg-white/5 rounded-full flex items-center justify-center">
            <Bell className="w-8 h-8 text-[#2D3A8C] dark:text-white" />
          </div>
          <div className="absolute top-0 right-0 w-4 h-4 bg-rose-500 border-2 border-white dark:border-[#101935] rounded-full" />
        </div>

        {/* Text Content */}
        <h2 className="text-[20px] font-bold text-foreground mb-3">Call Next Patient?</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-8 px-4">
          This will mark the current consultation <span className="font-bold text-foreground">(T-03: Elena Rodriguez)</span> as completed and call the next patient in queue <span className="font-bold text-foreground">(T-04: James Wilson)</span>.
        </p>

        {/* Actions */}
        <div className="flex items-center gap-4 w-full">
          <button 
            onClick={handleClose}
            className="flex-1 h-11 border border-[#E7E8EB] dark:border-white/10 bg-white dark:bg-transparent text-foreground rounded-[5px] text-[13px] font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-all outline-none"
          >
            Cancel
          </button>
          <button 
            onClick={handleClose}
            className="flex-1 h-11 bg-[#2D3A8C] hover:opacity-95 text-white rounded-[5px] text-[13px] font-bold flex items-center justify-center gap-2 transition-all shadow-none outline-none"
          >
            <Bell className="w-4 h-4" />
            Call Next
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

export default function OPDQueuePage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [showCallNext, setShowCallNext] = useState(false);

  return (
    <div className="p-[20px] bg-[#F8F9FC] dark:bg-[#0A0F1D] min-h-screen flex flex-col space-y-[20px] transition-colors duration-300 font-sans pb-20">
      
      {/* ── Header Area ── */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h1 className="text-[20px] font-bold text-[#1e293b] dark:text-white tracking-tight leading-none">
          Current Queue
        </h1>
        <button 
          onClick={() => setShowCallNext(true)}
          className="bg-[#2D3A8C] hover:opacity-95 text-white h-11 px-6 rounded-[5px] text-[13px] font-bold flex items-center justify-center gap-2 transition-all shadow-none w-full sm:w-auto outline-none"
        >
          Call Next Token <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[20px]">
        {STATS.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 p-4 md:p-5 rounded-[5px] flex flex-col sm:flex-row sm:items-center justify-between shadow-none transition-all"
          >
            <div className="flex flex-col gap-1">
              <div className={cn("p-2 rounded-[5px] w-fit", stat.bgColor)}>
                <stat.icon className={cn("w-5 h-5", stat.color)} />
              </div>
              <p className="text-[12px] md:text-[13px] font-medium text-muted-foreground mt-2">{stat.label}</p>
            </div>
            <p className="text-[24px] md:text-[32px] font-bold text-foreground leading-none mt-2 sm:mt-0">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* ── Filter Toolbar ── */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 p-3.5 rounded-[5px] shadow-none">
        <div className="relative flex-1 max-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-10 bg-white dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-medium outline-none focus:border-primary transition-all shadow-none placeholder:text-muted-foreground"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-muted-foreground bg-gray-100 dark:bg-white/5 px-1.5 py-0.5 rounded border border-[#E7E8EB] dark:border-white/10">
            ⌘K
          </div>
        </div>
        <div className="flex items-center gap-3">
          <CustomSelect
            value={typeFilter}
            onChange={setTypeFilter}
            placeholder="All"
            options={[{ label: "All", value: "All" }]}
            minWidth="70px"
          />
          <CustomSelect
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="All"
            options={[{ label: "All", value: "All" }]}
            minWidth="70px"
          />
        </div>
      </div>

      {/* ── Desktop Table ── */}
      <div className="hidden md:block bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] overflow-hidden shadow-none">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8F9FC] dark:bg-white/[0.02] border-b border-[#E7E8EB] dark:border-white/10 uppercase tracking-wider text-[11px] font-bold text-muted-foreground">
              <th className="px-6 py-5">Token No.</th>
              <th className="px-6 py-5">Patient Name</th>
              <th className="px-6 py-5">Age / Gender</th>
              <th className="px-6 py-5">Wait Time</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-6 py-5 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E7E8EB] dark:divide-white/5">
            {QUEUE_DATA.map((item) => (
              <tr key={item.id} className="hover:bg-[#F8F9FC] dark:hover:bg-white/[0.01] transition-colors group">
                <td className="px-6 py-4 text-[13px] font-bold text-foreground">{item.token}</td>
                <td className="px-6 py-4 text-[13px] font-bold text-foreground">{item.name}</td>
                <td className="px-6 py-4 text-[13px] font-medium text-muted-foreground">{item.ageGender}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    {item.waitTime === "Done" ? "Done" : item.waitTime}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-3 py-1 rounded-[5px] text-[10px] font-bold tracking-wider",
                    item.status === "Done" 
                      ? "bg-gray-100 dark:bg-white/10 text-gray-500" 
                      : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600"
                  )}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    {item.status === "Done" ? (
                      <span className="text-[12px] font-medium text-muted-foreground">Completed</span>
                    ) : (
                      <button 
                        onClick={() => router.push(`/doctor/opd/${item.id}`)}
                        className="h-9 px-6 bg-white dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[12px] font-bold text-foreground hover:bg-muted transition-all shadow-none outline-none"
                      >
                        Consult
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile View ── */}
      <div className="grid grid-cols-1 gap-[20px] md:hidden">
        {QUEUE_DATA.map((item) => (
          <div key={item.id} className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 p-5 rounded-[5px] space-y-4 shadow-none">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider leading-none mb-1.5">Token: {item.token}</p>
                <h3 className="text-[16px] font-bold text-foreground leading-tight">{item.name}</h3>
                <p className="text-[12px] font-medium text-muted-foreground mt-1">{item.ageGender}</p>
              </div>
              <span className={cn(
                "px-3 py-1 rounded-[5px] text-[10px] font-bold tracking-wider",
                item.status === "Done" 
                  ? "bg-gray-100 dark:bg-white/10 text-gray-500" 
                  : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600"
              )}>
                {item.status}
              </span>
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t border-[#E7E8EB] dark:border-white/5">
              <div className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                Wait: {item.waitTime}
              </div>
              {item.status === "Done" ? (
                <span className="text-[12px] font-medium text-muted-foreground italic">Completed</span>
              ) : (
                <button 
                  onClick={() => router.push(`/doctor/opd/${item.id}`)}
                  className="h-9 px-5 bg-[#2D3A8C] text-white rounded-[5px] text-[12px] font-bold shadow-none outline-none"
                >
                  Consult
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showCallNext && <CallNextModal onClose={() => setShowCallNext(false)} />}
    </div>
  );
}
