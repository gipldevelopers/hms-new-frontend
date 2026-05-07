"use client";

import React from "react";
import { Search, ChevronDown, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SurgeryDetailModal from "@/components/doctor/schedule/SurgeryDetailModal";
import OPDDetailModal from "@/components/doctor/schedule/OPDDetailModal";
import LeaveModal from "@/components/doctor/schedule/LeaveModal";

const scheduleData = [
  { id: 1, time: "08:00 AM", type: "OPD Slot", patient: "Michael Ross", status: "Available", typeVariant: "info" },
  { id: 2, time: "09:00 AM", type: "OPD Slot", patient: "John Doe", status: "Booked", typeVariant: "info" },
  { id: 3, time: "10:00 AM", type: "Surgery", patient: "Alice Smith", status: "Confirmed", typeVariant: "destructive" },
  { id: 4, time: "12:00 PM", type: "Surgery", patient: "Bob Johnson", status: "Confirmed", typeVariant: "destructive" },
  { id: 5, time: "02:00 PM", type: "OPD Slot", patient: "Mary Williams", status: "Checked In", typeVariant: "info" },
  { id: 6, time: "03:00 PM", type: "Leave", patient: "Staff Meeting", status: "Approved", typeVariant: "secondary" },
  { id: 7, time: "03:00 PM", type: "Leave", patient: "Clinical Audit", status: "Approved", typeVariant: "secondary" },
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

export default function SchedulePage() {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("All");
  const [typeFilter, setTypeFilter] = React.useState("All");
  const [isSurgeryModalOpen, setIsSurgeryModalOpen] = React.useState(false);
  const [isOPDModalOpen, setIsOPDModalOpen] = React.useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(null);

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    if (item.type === "Surgery") {
      setIsSurgeryModalOpen(true);
    } else if (item.type === "OPD Slot") {
      setIsOPDModalOpen(true);
    } else if (item.type === "Leave") {
      setIsLeaveModalOpen(true);
    }
  };

  return (
    <div className="p-4 md:p-5 bg-background min-h-screen flex flex-col gap-4 md:gap-5 transition-colors duration-300 font-sans pb-20">
      
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h1 className="text-[18px] md:text-[20px] font-bold text-foreground tracking-tight leading-none">
          Schedule
        </h1>
      </div>

      {/* Filter Toolbar */}
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
          <CustomSelect
            value={typeFilter}
            onChange={setTypeFilter}
            placeholder="Type: All"
            options={[{ label: "All Types", value: "All" }]}
            minWidth="120px"
          />
          <CustomSelect
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="Status: All"
            options={[{ label: "All Status", value: "All" }]}
            minWidth="120px"
          />
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-card border border-border rounded-lg overflow-hidden shadow-none overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              <th className="px-6 py-5">Time</th>
              <th className="px-6 py-5">Type</th>
              <th className="px-6 py-5">Patient</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-6 py-5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {scheduleData.map((item, index) => (
              <tr key={index} className="hover:bg-muted/30 transition-colors group">
                <td className="px-6 py-4 text-[13px] font-bold text-foreground">{item.time}</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-3 py-1 rounded-lg text-[10px] font-bold tracking-wider",
                    item.typeVariant === "info" && "bg-blue-50 dark:bg-blue-500/10 text-blue-600",
                    item.typeVariant === "destructive" && "bg-rose-50 dark:bg-rose-500/10 text-rose-600",
                    item.typeVariant === "secondary" && "bg-muted text-muted-foreground"
                  )}>
                    {item.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-[13px] font-medium text-muted-foreground">{item.patient}</td>
                <td className="px-6 py-4 text-[13px] font-bold text-foreground">{item.status}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <button 
                      onClick={() => handleViewDetails(item)}
                      className="h-9 w-9 bg-card border border-border rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted transition-all shadow-none outline-none group-hover:border-primary/30"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {scheduleData.map((item, index) => (
          <div key={index} className="bg-card border border-border p-4 rounded-lg space-y-4 shadow-none">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <span className="text-[14px] font-bold text-foreground">{item.time}</span>
                <span className={cn(
                  "w-fit px-2.5 py-0.5 rounded-lg text-[9px] font-bold tracking-wider uppercase",
                  item.typeVariant === "info" && "bg-blue-50 dark:bg-blue-500/10 text-blue-600",
                  item.typeVariant === "destructive" && "bg-rose-50 dark:bg-rose-500/10 text-rose-600",
                  item.typeVariant === "secondary" && "bg-muted text-muted-foreground"
                )}>
                  {item.type}
                </span>
              </div>
              <button 
                onClick={() => handleViewDetails(item)}
                className="h-9 w-9 bg-muted/50 rounded-lg flex items-center justify-center text-muted-foreground"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Patient</p>
                <p className="text-[13px] font-medium text-foreground">{item.patient}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Status</p>
                <p className="text-[13px] font-bold text-foreground">{item.status}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend Area */}
      <div className="p-5 border border-border bg-card rounded-lg flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <span className="text-[12px] font-bold text-muted-foreground">OPD</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span className="text-[12px] font-bold text-muted-foreground">Surgery</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground" />
          <span className="text-[12px] font-bold text-muted-foreground">Leave</span>
        </div>
      </div>

      <SurgeryDetailModal 
        isOpen={isSurgeryModalOpen} 
        onClose={() => setIsSurgeryModalOpen(false)} 
        data={selectedItem}
      />

      <OPDDetailModal 
        isOpen={isOPDModalOpen} 
        onClose={() => setIsOPDModalOpen(false)} 
        data={selectedItem}
      />

      <LeaveModal 
        isOpen={isLeaveModalOpen} 
        onClose={() => setIsLeaveModalOpen(false)} 
      />

    </div>
  );
}
