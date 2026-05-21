"use client";

import React, { useState, useEffect, useRef } from "react";
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
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "@/lib/api";

// --- CUSTOM SELECT COMPONENT ---
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

export function AddMedicineToRackModal({ open, onOpenChange, rackId, items = [], onSuccess }) {
  const [medicineSearch, setMedicineSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isMedicineDropdownOpen, setIsMedicineDropdownOpen] = useState(false);
  const [quantity, setQuantity] = useState(50);
  const [expiryDate, setExpiryDate] = useState(null);
  const [notes, setNotes] = useState("");
  const [selectedShelf, setSelectedShelf] = useState("B2");
  const [isSaving, setIsSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  const dropdownRef = useRef(null);

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

  // Reset fields when opening modal
  useEffect(() => {
    if (open) {
      setMedicineSearch("");
      setSelectedItem(null);
      setIsMedicineDropdownOpen(false);
      setQuantity(50);
      setExpiryDate(null);
      setNotes("");
    }
  }, [open]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMedicineDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) return null;

  // Filter and sort medicines: unassigned first, then alphabetically
  const filteredMedicines = [...items]
    .filter((item) =>
      item.medicineName.toLowerCase().includes(medicineSearch.toLowerCase())
    )
    .sort((a, b) => {
      const aAssigned = !!a.rackId;
      const bAssigned = !!b.rackId;
      if (aAssigned !== bAssigned) {
        return aAssigned ? 1 : -1; // Unassigned first
      }
      return a.medicineName.localeCompare(b.medicineName);
    });

  const handleSelectMedicine = (item) => {
    setSelectedItem(item);
    setMedicineSearch(item.medicineName);
    setQuantity(item.quantity || 0);
    setExpiryDate(item.expiryDate ? new Date(item.expiryDate) : null);
    setNotes(item.notes || "");
    setIsMedicineDropdownOpen(false);
  };

  const handleSaveToRack = async () => {
    if (!selectedItem) {
      alert("Please select a medicine from the search dropdown.");
      return;
    }

    try {
      setIsSaving(true);
      const token = localStorage.getItem("authtoken");
      const userStr = localStorage.getItem("user");
      if (!token || !userStr) {
        alert("Session expired. Please login again.");
        return;
      }
      const user = JSON.parse(userStr);
      const branchId = user.branchId;

      const res = await fetch(`${API_URL}/pharmacy/inventory/${selectedItem.id}?branchId=${branchId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          rackId,
          quantity,
          expiryDate: expiryDate ? expiryDate.toISOString() : null,
          notes
        })
      });

      const result = await res.json();
      if (result.success) {
        if (onSuccess) onSuccess();
        onOpenChange(false);
      } else {
        alert(result.error || "Failed to add medicine to rack.");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const currentCount = items ? items.filter(item => item.rackId === rackId).length : 0;

  const stats = [
    { label: "Rack Id", value: rackId || "-", icon: Package, color: "text-[#2e37a4]", bg: "bg-[#f0f2ff]" },
    { label: "Storage", value: "Cold Storage", icon: Snowflake, color: "text-[#06b6d4]", bg: "bg-[#ecfeff]" },
    { label: "Capacity", value: "80%", icon: Clock, color: "text-[#f59e0b]", bg: "bg-[#fffbeb]" },
    { label: "Current Items", value: `${currentCount} Medicines`, icon: Pill, color: "text-[#10b981]", bg: "bg-[#ecfdf5]" },
  ];

  const shelfPositions = [
    ["A1", "A2", "A3", "A4"],
    ["B1", "B2", "B3", "B4"],
    ["C1", "C2", "C3", "C4"],
    ["D1", "D2", "D3", "D4"],
    ["E1", "E2", "E3", "E4"]
  ];

  // Dynamic stock status option logic
  const getStockStatusValue = () => {
    if (quantity === 0) return "oos";
    if (quantity < 500) return "low";
    return "available";
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm z-0"
            onClick={() => onOpenChange(false)}
          />
          
          {/* Modal Container */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 16 }}
            className="relative bg-card w-full max-w-5xl rounded-lg border border-border shadow-2xl z-50"
          >
            {/* Header */}
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-[16px] font-bold text-foreground">Add Medicine to Rack</h3>
                <p className="text-[12px] text-muted-foreground font-medium">Assign medicine stock to selected storage rack</p>
              </div>
              <button onClick={() => onOpenChange(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Stats Cards */}
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
                {/* Row 1: Medicine Selection (Live Search Dropdown) */}
                <div ref={dropdownRef} className="space-y-2 relative">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Select Medicine</label>
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                      placeholder="Search and select medicine from inventory..."
                      value={medicineSearch}
                      onChange={(e) => {
                        setMedicineSearch(e.target.value);
                        setIsMedicineDropdownOpen(true);
                      }}
                      onFocus={() => setIsMedicineDropdownOpen(true)}
                      className="w-full h-11 pl-10 pr-10 bg-muted border border-border rounded-lg text-[13px] font-medium text-foreground outline-none focus:border-primary transition-all shadow-none"
                    />
                    {medicineSearch && (
                      <button 
                        onClick={() => {
                          setMedicineSearch("");
                          setSelectedItem(null);
                        }}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {isMedicineDropdownOpen && (
                    <div className="absolute z-[1050] left-0 right-0 top-[76px] bg-card border border-border rounded-lg shadow-xl max-h-[220px] overflow-y-auto no-scrollbar p-1">
                      {filteredMedicines.length > 0 ? (
                        filteredMedicines.map((med) => (
                          <div
                            key={med.id}
                            onClick={() => handleSelectMedicine(med)}
                            className="font-bold text-[13px] h-10 px-3.5 rounded-lg cursor-pointer flex items-center justify-between hover:bg-primary/5 hover:text-primary text-foreground select-none transition-colors"
                          >
                            <span>{med.medicineName}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-muted-foreground font-medium bg-muted px-2 py-0.5 rounded uppercase">
                                {med.type} (Qty: {med.quantity})
                              </span>
                              <span className={cn(
                                "text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tight",
                                med.rackId 
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" 
                                  : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                              )}>
                                {med.rackId ? `Rack ${med.rackId}` : "Unassigned"}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-[12.5px] font-bold text-muted-foreground p-4 text-center italic select-none">
                          No matching medicines in inventory
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Row 2: Four Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Batch Number</label>
                    <input 
                      type="text"
                      placeholder="e.g. BAT-9842"
                      className="w-full h-11 px-4 bg-muted border border-border rounded-lg text-[13px] font-medium text-foreground outline-none focus:border-primary transition-all shadow-none"
                      defaultValue="BAT-9842"
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
                      placeholder="MM/YYYY"
                      mode="month-year"
                      variant="muted"
                      className="space-y-0"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Stock Status</label>
                    <CustomSelect 
                      value={getStockStatusValue()}
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
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full min-h-[100px] p-4 bg-muted border border-border rounded-lg text-[13px] font-medium text-foreground outline-none focus:border-primary transition-all resize-none shadow-none"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Assign Shelf Position</label>
                    <div className="grid grid-cols-5 gap-3">
                      {shelfPositions.map((row, rIdx) => (
                        <div key={rIdx} className="space-y-2">
                          {row.map((shelf) => (
                            <button
                              key={shelf}
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

            {/* Footer */}
            <div className="p-5 border-t border-border flex justify-end items-center gap-3 bg-card">
              <button 
                onClick={() => onOpenChange(false)}
                className="px-6 h-11 border border-border bg-card text-foreground rounded-lg text-[13px] font-bold hover:bg-muted transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveToRack}
                disabled={isSaving}
                className="px-6 h-11 bg-primary hover:opacity-95 text-primary-foreground rounded-lg text-[13px] font-bold transition-all shadow-none disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save to Rack"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
