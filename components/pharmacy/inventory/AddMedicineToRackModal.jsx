"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { 
  X, 
  Package, 
  Snowflake, 
  Clock, 
  Pill, 
  ChevronDown, 
  Minus, 
  Plus,
  Calendar,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FormDatePicker } from "@/components/ui/form-date-picker";

// --- CUSTOM SELECT COMPONENT (Matches Doctor OPD Format) ---
function CustomSelect({ value, onChange, options, placeholder, minWidth = "120px", className }) {
  const selected = options.find((o) => o.value === value);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={cn(
          "flex items-center justify-between px-3 h-11 bg-muted border border-border rounded-lg text-[13px] font-medium text-foreground outline-none transition-all hover:bg-muted/80",
          className
        )} style={{ minWidth }}>
          <span className="truncate">{selected ? selected.label : placeholder}</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground ml-2 flex-shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px] z-[10000] border border-border bg-card p-1 rounded-lg shadow-none">
        {options.map((opt) => (
          <DropdownMenuItem 
            key={opt.value} 
            onClick={() => onChange(opt.value)}
            className="text-[13px] font-medium py-2.5 rounded-lg cursor-pointer transition-colors outline-none hover:bg-muted"
          >
            {opt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AddMedicineToRackModal({ open, onOpenChange }) {
  const [quantity, setQuantity] = useState(50);
  const [expiryDate, setExpiryDate] = useState(null);
  const [selectedShelf, setSelectedShelf] = useState("B2");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };

    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onOpenChange]);

  if (!mounted || !open) return null;

  const stats = [
    { label: "Rack Id", value: "B-04", icon: Package, color: "text-[#2e37a4]", bg: "bg-[#f0f2ff]" },
    { label: "Storage", value: "Cold Storage", icon: Snowflake, color: "text-[#06b6d4]", bg: "bg-[#ecfeff]" },
    { label: "Capacity", value: "80%", icon: Clock, color: "text-[#f59e0b]", bg: "bg-[#fffbeb]" },
    { label: "Current Items", value: "12 Medicines", icon: Pill, color: "text-[#10b981]", bg: "bg-[#ecfdf5]" },
  ];

  const shelfPositions = [
    ["A1", "A2", "A3", "A4"],
    ["B1", "B2", "B3", "B4"],
    ["C1", "C2", "C3", "C4"],
    ["D1", "D2", "D3", "D4"],
    ["E1", "E2", "E3", "E4"]
  ];

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop (Matches Doctor OPD Format) */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-all animate-in fade-in duration-200 z-0"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Modal Container (Horizontal Layout, max-w-5xl) */}
      <div className="relative bg-card w-full max-w-5xl rounded-lg border border-border shadow-2xl animate-in zoom-in-95 duration-200 z-50">
        {/* Header (Matches Doctor OPD Format) */}
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-[16px] font-bold text-foreground">Add Medicine to Rack</h3>
            <p className="text-[12px] text-muted-foreground font-medium">Assign medicine stock to selected storage rack</p>
          </div>
          <button onClick={() => onOpenChange(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Body (Horizontal Grid Layout) */}
        <div className="p-6 space-y-6">
          {/* Stats Cards (Horizontal Row) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div key={i} className="bg-muted/30 p-3 rounded-lg border border-border flex items-center gap-3">
                <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", stat.bg)}>
                  <stat.icon className={cn("w-4.5 h-4.5", stat.color)} />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-muted-foreground leading-none mb-1">{stat.label}</p>
                  <p className="text-[14px] font-bold text-foreground leading-none truncate">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            {/* Row 1: Medicine Selection (Wide) */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Select Medicine</label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  placeholder="Search and select medicine..."
                  className="w-full h-11 pl-10 pr-4 bg-muted border border-border rounded-lg text-[13px] font-medium text-foreground outline-none focus:border-primary transition-all shadow-none"
                  defaultValue="Amoxicillin 500mg"
                />
              </div>
            </div>

            {/* Row 2: Four Columns (Very Horizontal!) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Batch Number</label>
                <input 
                  type="text"
                  placeholder="e.g. BAT-9842"
                  className="w-full h-11 px-4 bg-muted border border-border rounded-lg text-[13px] font-medium text-foreground outline-none focus:border-primary transition-all shadow-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Quantity</label>
                <div className="flex h-11 w-full bg-muted border border-border rounded-lg overflow-hidden">
                  <button 
                    onClick={() => setQuantity(Math.max(0, quantity - 1))}
                    className="w-11 h-full flex items-center justify-center border-r border-border text-muted-foreground hover:bg-muted/80 transition-all"
                  >
                    <Minus size={14} />
                  </button>
                  <input 
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                    className="flex-1 h-full text-center text-[13px] font-bold text-foreground bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-11 h-full flex items-center justify-center border-l border-border text-muted-foreground hover:bg-muted/80 transition-all"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Expiry Date</label>
                <FormDatePicker
                  value={expiryDate}
                  onChange={setExpiryDate}
                  placeholder="MM/DD/YYYY"
                  variant="muted"
                  className="space-y-0"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Stock Status</label>
                <CustomSelect 
                  value="available"
                  onChange={() => {}}
                  minWidth="100%"
                  options={[
                    { label: "Available", value: "available" },
                    { label: "Low Stock", value: "low" },
                    { label: "Out of Stock", value: "oos" },
                  ]}
                />
              </div>
            </div>

            {/* Row 3: Two Columns (Storage Notes & Shelf Position) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Storage Notes</label>
                <textarea 
                  placeholder="Add any specific storage instructions..."
                  className="w-full min-h-[100px] p-4 bg-muted border border-border rounded-lg text-[13px] font-medium text-foreground outline-none focus:border-primary transition-all resize-none shadow-none"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Assign Shelf Position</label>
                <div className="grid grid-cols-5 gap-3">
                  {shelfPositions.map((row, rIdx) => (
                    <div key={rIdx} className="space-y-2">
                      {row.map((shelf, sIdx) => (
                        <button
                          key={`${rIdx}-${sIdx}`}
                          onClick={() => setSelectedShelf(shelf)}
                          className={cn(
                            "w-full h-8 flex items-center justify-center rounded-lg border text-[10px] font-bold transition-all shadow-none",
                            selectedShelf === shelf 
                              ? "bg-primary border-primary text-primary-foreground" 
                              : "bg-muted border-border text-muted-foreground hover:border-primary/30"
                          )}
                        >
                          {shelf}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer (Matches Doctor OPD Format) */}
        <div className="p-5 border-t border-border flex justify-end items-center gap-3 bg-card">
          <button 
            onClick={() => onOpenChange(false)}
            className="px-6 h-11 border border-border bg-card text-foreground rounded-lg text-[13px] font-bold hover:bg-muted transition-all"
          >
            Cancel
          </button>
          <button className="px-6 h-11 bg-primary hover:opacity-95 text-primary-foreground rounded-lg text-[13px] font-bold transition-all shadow-none">
            Save to Rack
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
