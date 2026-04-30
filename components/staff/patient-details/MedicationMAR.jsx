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
      timeColor: "text-[#1A1C23]"
    },
    {
      time: "12:00 PM",
      name: "Lisinopril",
      dosage: "10mg",
      route: "PO",
      notes: "Requires BP check before administration",
      status: "Overdue",
      statusVariant: "danger",
      timeColor: "text-rose-500",
      isOverdue: true
    },
    {
      time: "06:00 PM",
      name: "Atorvastatin",
      dosage: "40mg",
      route: "PO",
      status: "Due Now",
      statusVariant: "warning",
      timeColor: "text-[#1A1C23]"
    },
    {
      time: "PRN",
      name: "Acetaminophen",
      dosage: "500mg",
      route: "PO",
      notes: "For pain > 4/10 or temp > 38.5",
      status: "PRN Available",
      statusVariant: "neutral",
      timeColor: "text-[#1A1C23]"
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
        <h3 className="text-[15px] md:text-[18px] font-bold text-[#1A1C23] dark:text-white uppercase tracking-widest shrink-0">Medication Record (MAR)</h3>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative w-full sm:w-[280px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search medication..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-11 pr-4 bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] outline-none focus:ring-1 focus:ring-primary/20 transition-all shadow-none font-medium"
            />
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-11 px-5 bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-bold text-[#1A1C23] dark:text-white flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-all outline-none flex-1 sm:flex-none justify-between sm:min-w-[130px]">
                  {filterStatus === "All" ? "Status" : filterStatus}
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px] bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] p-1 shadow-xl">
                {statusOptions.map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={cn(
                      "rounded-[5px] px-3 py-2 text-[13px] font-medium cursor-pointer transition-colors",
                      filterStatus === status
                        ? "bg-primary/5 text-primary font-bold"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                    )}
                  >
                    {status === "All" ? "All Medications" : status}
                    {filterStatus === status && <Check className="w-4 h-4 ml-auto" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <button className="h-11 px-5 bg-[#2D3A8C] text-white rounded-[5px] text-[13px] font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-none flex-1 sm:flex-none justify-center">
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
              "bg-white dark:bg-[#101935] p-5 rounded-[5px] border transition-all flex flex-col md:flex-row md:items-center justify-between gap-5",
              med.isOverdue 
                ? "border-rose-200 bg-rose-50/10 dark:border-rose-500/20" 
                : "border-[#E7E8EB] dark:border-white/10"
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
                  <p className="text-[16px] font-bold text-[#1A1C23] dark:text-white leading-none">{med.name}</p>
                  <span className="px-2 py-0.5 bg-gray-50 dark:bg-white/5 text-gray-500 rounded text-[10px] font-black border border-gray-100 dark:border-white/5 uppercase tracking-tighter">{med.dosage}</span>
                  <span className="px-2 py-0.5 bg-gray-50 dark:bg-white/5 text-gray-500 rounded text-[10px] font-black border border-gray-100 dark:border-white/5 uppercase tracking-tighter">{med.route}</span>
                </div>
                {med.notes && (
                  <p className="text-[12px] md:text-[13px] text-gray-400 font-medium leading-tight">{med.notes}</p>
                )}
              </div>
            </div>

            {/* Status & Action Section */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between md:justify-end gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-gray-50 dark:border-white/5">
              {/* Status Badges */}
              <div className="flex items-center justify-center sm:justify-start">
                {med.statusVariant === "success" && (
                  <span className="text-[13px] font-black text-emerald-500 uppercase tracking-widest">GIVEN</span>
                )}
                {med.statusVariant === "danger" && (
                  <span className="px-4 py-1.5 bg-rose-50 dark:bg-rose-500/10 text-rose-500 border border-rose-100 dark:border-rose-500/20 rounded-[5px] text-[10px] font-black uppercase tracking-widest">Overdue</span>
                )}
                {med.statusVariant === "warning" && (
                  <span className="px-4 py-1.5 bg-amber-50 dark:bg-amber-500/10 text-amber-500 border border-amber-100 dark:border-amber-500/20 rounded-[5px] text-[10px] font-black uppercase tracking-widest">Due Now</span>
                )}
                {med.statusVariant === "neutral" && (
                  <span className="px-4 py-1.5 bg-gray-50 dark:bg-white/5 text-gray-400 border border-gray-100 dark:border-white/10 rounded-[5px] text-[10px] font-black uppercase tracking-widest">PRN Available</span>
                )}
              </div>

              {/* Administer Button */}
              {med.status !== "Given" && (
                <button 
                  onClick={() => handleAdminister(med)}
                  className="h-11 px-8 bg-[#2D3A8C] text-white rounded-[5px] text-[13px] font-bold hover:opacity-90 transition-all uppercase tracking-widest shadow-lg shadow-primary/10 w-full sm:w-auto"
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
