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
import RequestLeaveModal from "@/components/doctor/schedule/RequestLeaveModal";

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
  const [schedule, setSchedule] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("All");
  const [typeFilter, setTypeFilter] = React.useState("All");
  const [isSurgeryModalOpen, setIsSurgeryModalOpen] = React.useState(false);
  const [isOPDModalOpen, setIsOPDModalOpen] = React.useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = React.useState(false);
  const [isRequestLeaveModalOpen, setIsRequestLeaveModalOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(null);

  const fetchSchedule = React.useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const token = localStorage.getItem("authtoken");
      const res = await fetch("/api/doctor-opd/schedule", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Failed to fetch schedule");
      const json = await res.json();
      if (json.success) {
        setSchedule(json.data || []);
      } else {
        throw new Error(json.message || "Failed to fetch schedule");
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchSchedule(true);
  }, [fetchSchedule]);

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

  const filteredSchedule = schedule.filter((item) => {
    const patientName = item.patient || "";
    const typeStr = item.type || "";
    const statusStr = item.status || "";
    const matchesSearch = !search ||
      patientName.toLowerCase().includes(search.toLowerCase()) ||
      typeStr.toLowerCase().includes(search.toLowerCase()) ||
      statusStr.toLowerCase().includes(search.toLowerCase());

    const matchesType = typeFilter === "All" || item.type === typeFilter;
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const typeOptions = [
    { label: "All Types", value: "All" },
    { label: "OPD Slot", value: "OPD Slot" },
    { label: "Surgery", value: "Surgery" },
    { label: "Leave", value: "Leave" }
  ];

  const statusOptions = [
    { label: "All Statuses", value: "All" },
    { label: "Available", value: "Available" },
    { label: "Booked", value: "Booked" },
    { label: "Checked In", value: "Checked In" },
    { label: "Waiting", value: "Waiting" },
    { label: "Completed", value: "Completed" },
    { label: "Cancelled", value: "Cancelled" },
    { label: "Confirmed", value: "Confirmed" },
    { label: "Discharge Pending", value: "Discharge Pending" },
    { label: "Approved", value: "Approved" }
  ];

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
            options={typeOptions}
            minWidth="120px"
          />
          <CustomSelect
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="Status: All"
            options={statusOptions}
            minWidth="120px"
          />
        </div>
      </div>

      {/* Schedule Table / Cards */}
      {loading ? (
        <div className="flex items-center justify-center p-8 bg-card border border-border rounded-lg">
          <p className="text-[13px] font-medium text-muted-foreground animate-pulse">Loading schedule...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center p-8 bg-card border border-border rounded-lg">
          <p className="text-[13px] font-medium text-destructive">Error loading schedule: {error}</p>
        </div>
      ) : filteredSchedule.length === 0 ? (
        <div className="flex items-center justify-center p-8 bg-card border border-border rounded-lg">
          <p className="text-[13px] font-medium text-muted-foreground">No events scheduled.</p>
        </div>
      ) : (
        <>
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
                {filteredSchedule.map((item, index) => (
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
            {filteredSchedule.map((item, index) => (
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
        </>
      )}

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
        onActionCompleted={() => fetchSchedule(false)}
      />

      <OPDDetailModal
        isOpen={isOPDModalOpen}
        onClose={() => setIsOPDModalOpen(false)}
        data={selectedItem}
        onActionCompleted={() => fetchSchedule(false)}
      />

      <LeaveModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        data={selectedItem}
      />

      <RequestLeaveModal
        isOpen={isRequestLeaveModalOpen}
        onClose={() => setIsRequestLeaveModalOpen(false)}
        onLeaveAdded={() => fetchSchedule(false)}
      />

    </div>
  );
}
