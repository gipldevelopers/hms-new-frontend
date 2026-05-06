"use client";

import React, { useState } from "react";
import { Plus, ChevronRight, AlertCircle, Clock, Pill, Search, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function MedicationMAR() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const statusOptions = ["All", "Given", "Overdue", "Due Now", "PRN"];

  const medications = [
    {
      time: "08:00 AM",
      name: "Aspirin",
      dosage: "81mg",
      route: "PO",
      notes: "Taken with water",
      status: "Given",
      statusVariant: "success",
      timeColor: "text-foreground"
    },
    {
      time: "12:00 PM",
      name: "Lisinopril",
      dosage: "10mg",
      route: "PO",
      notes: "Requires BP check before administration",
      status: "Overdue",
      statusVariant: "danger",
      timeColor: "text-destructive",
      isOverdue: true
    },
    {
      time: "06:00 PM",
      name: "Atorvastatin",
      dosage: "40mg",
      route: "PO",
      status: "Due Now",
      statusVariant: "warning",
      timeColor: "text-foreground"
    },
    {
      time: "PRN",
      name: "Acetaminophen",
      dosage: "500mg",
      route: "PO",
      notes: "For pain > 4/10 or temp > 38.5",
      status: "PRN Available",
      statusVariant: "neutral",
      timeColor: "text-foreground"
    }
  ];

  const filteredMedications = medications.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         med.dosage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "All" || med.status.includes(filterStatus);
    return matchesSearch && matchesStatus;
  });

  const handleAdminister = (med) => {
    alert(`Administering ${med.name} ${med.dosage} via ${med.route}`);
  };

  return (
    <div className="space-y-[20px] animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4">
        <h3 className="text-[15px] md:text-[18px] font-bold text-foreground uppercase tracking-widest shrink-0">Medication Record (MAR)</h3>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative w-full sm:w-[280px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search medication..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-11 pr-4 bg-card border border-border rounded-lg text-[13px] outline-none focus:ring-1 focus:ring-primary/20 transition-all shadow-none font-medium text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-11 px-5 bg-card border border-border rounded-lg text-[13px] font-bold text-foreground flex items-center gap-3 hover:bg-muted transition-all outline-none flex-1 sm:flex-none justify-between sm:min-w-[130px] shadow-none">
                  {filterStatus === "All" ? "Status" : filterStatus}
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px] bg-card border border-border rounded-lg p-1 shadow-none z-50">
                {statusOptions.map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={cn(
                      "rounded-lg px-3 py-2 text-[13px] font-medium cursor-pointer transition-colors",
                      filterStatus === status
                        ? "bg-primary/5 text-primary font-bold"
                        : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {status === "All" ? "All Medications" : status}
                    {filterStatus === status && <Check className="w-4 h-4 ml-auto" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <button className="h-11 px-5 bg-primary text-primary-foreground rounded-lg text-[13px] font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-none flex-1 sm:flex-none justify-center">
              <Plus className="w-4 h-4" /> <span>Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAR List */}
      <div className="space-y-4 pb-10">
        {filteredMedications.map((med, idx) => (
          <div 
            key={idx} 
            className={cn(
              "bg-card p-5 rounded-lg border transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-none",
              med.isOverdue 
                ? "border-destructive/30 bg-destructive/5" 
                : "border-border"
            )}
          >
            <div className="flex items-start gap-5">
              {/* Time Section */}
              <div className={cn("text-[14px] md:text-[16px] font-black uppercase tracking-widest min-w-[70px] pt-1", med.timeColor)}>
                {med.time}
              </div>

              {/* Drug Info Section */}
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[16px] font-bold text-foreground leading-none">{med.name}</p>
                  <span className="px-2 py-0.5 bg-muted text-muted-foreground rounded text-[10px] font-black border border-border uppercase tracking-tighter">{med.dosage}</span>
                  <span className="px-2 py-0.5 bg-muted text-muted-foreground rounded text-[10px] font-black border border-border uppercase tracking-tighter">{med.route}</span>
                </div>
                {med.notes && (
                  <p className="text-[12px] md:text-[13px] text-muted-foreground font-medium leading-tight">{med.notes}</p>
                )}
              </div>
            </div>

            {/* Status & Action Section */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between md:justify-end gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-border">
              {/* Status Badges */}
              <div className="flex items-center justify-center sm:justify-start">
                {med.statusVariant === "success" && (
                  <span className="text-[13px] font-black text-emerald-500 uppercase tracking-widest">GIVEN</span>
                )}
                {med.statusVariant === "danger" && (
                  <span className="px-4 py-1.5 bg-destructive/10 text-destructive border border-destructive/20 rounded-md text-[10px] font-black uppercase tracking-widest">Overdue</span>
                )}
                {med.statusVariant === "warning" && (
                  <span className="px-4 py-1.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-md text-[10px] font-black uppercase tracking-widest">Due Now</span>
                )}
                {med.statusVariant === "neutral" && (
                  <span className="px-4 py-1.5 bg-muted text-muted-foreground border border-border rounded-md text-[10px] font-black uppercase tracking-widest">PRN Available</span>
                )}
              </div>

              {/* Administer Button */}
              {med.status !== "Given" && (
                <button 
                  onClick={() => handleAdminister(med)}
                  className="h-11 px-8 bg-primary text-primary-foreground rounded-lg text-[13px] font-bold hover:bg-primary/90 transition-all uppercase tracking-widest shadow-none w-full sm:w-auto"
                >
                  Administer
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
