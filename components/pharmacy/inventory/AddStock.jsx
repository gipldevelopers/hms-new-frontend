"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Package, 
  Snowflake, 
  Clock, 
  Pill, 
  ChevronDown, 
  Minus, 
  Plus,
  ArrowLeft
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { FormDatePicker } from "@/components/ui/form-date-picker";
import { API_URL } from "@/lib/api";

export function AddStock() {
  const { id } = useParams();
  const router = useRouter();
  const isNew = id === "new";

  const [medicineName, setMedicineName] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [mfg, setMfg] = useState("");
  const [quantity, setQuantity] = useState(50);
  const [expiryDate, setExpiryDate] = useState(null);
  const [notes, setNotes] = useState("");
  const [matchedItemId, setMatchedItemId] = useState(null);
  const [currentItemsCount, setCurrentItemsCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [rackId, setRackId] = useState("");
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef(null);

  const stats = [
    { label: "Rack Id", value: rackId || "Not Assigned", icon: Package, color: "text-[#2e37a4]", bg: "bg-[#f0f2ff]" },
    { label: "Storage", value: "Cold Storage", icon: Snowflake, color: "text-[#06b6d4]", bg: "bg-[#ecfeff]" },
    { label: "Capacity", value: "80%", icon: Clock, color: "text-[#f59e0b]", bg: "bg-[#fffbeb]" },
    { label: "Current Items", value: `${currentItemsCount} Medicines`, icon: Pill, color: "text-[#10b981]", bg: "bg-[#ecfdf5]" },
  ];

  const medicineTypes = [
    "Tablet",
    "Capsule",
    "Syrup",
    "Injection",
    "Drops",
    "Cream",
    "Ointment",
    "Gel",
    "Lotion",
    "Powder",
    "Inhaler",
    "Spray",
    "Suspension",
    "Sachet",
    "Suppository",
    "Patch",
    "Vaccine",
    "IV Fluid / Infusion"
  ];

  // Prefill stock details and current count
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = localStorage.getItem("authtoken");
        const userStr = localStorage.getItem("user");
        if (!token || !userStr) return;
        const user = JSON.parse(userStr);
        const branchId = user.branchId;

        const res = await fetch(`${API_URL}/pharmacy/inventory?branchId=${branchId}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const result = await res.json();
        if (result.success && result.data) {
          setCurrentItemsCount(result.data.length);
          
          if (!isNew) {
            // Pre-fill from slug match
            const targetSlug = decodeURIComponent(id).toLowerCase();
            const matchedItem = result.data.find(item => 
              item.medicineName.toLowerCase() === targetSlug.replace(/-/g, ' ') ||
              item.medicineName.toLowerCase().replace(/\s+/g, '-') === targetSlug
            );

            if (matchedItem) {
              setMatchedItemId(matchedItem.id);
              setMedicineName(matchedItem.medicineName);
              setSelectedType(matchedItem.type);
              setMfg(matchedItem.mfg || "");
              setQuantity(matchedItem.quantity);
              if (matchedItem.expiryDate) {
                setExpiryDate(new Date(matchedItem.expiryDate));
              }
              setNotes(matchedItem.notes || "");
              setRackId(matchedItem.rackId || "");
            } else {
              // Fallback decoding if no DB entry is found yet
              const decodedName = decodeURIComponent(id)
                .split("-")
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");
              setMedicineName(decodedName);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load inventory stats:", err);
      }
    };

    fetchDetails();
  }, [id, isNew]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredTypes = medicineTypes.filter((type) =>
    type.toLowerCase().includes(selectedType.toLowerCase())
  );

  const handleSave = async () => {
    if (!medicineName.trim()) {
      alert("Medicine Name is required.");
      return;
    }
    if (!selectedType.trim()) {
      alert("Type is required.");
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

      const payload = {
        branchId,
        medicineName,
        type: selectedType,
        mfg,
        quantity,
        expiryDate: expiryDate ? expiryDate.toISOString() : null,
        notes,
        rackId: rackId || null,
        storageType: "Cold Storage"
      };

      let res;
      if (matchedItemId) {
        res = await fetch(`${API_URL}/pharmacy/inventory/${matchedItemId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`${API_URL}/pharmacy/inventory`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      }

      const result = await res.json();
      if (result.success) {
        router.push("/pharmacy/inventory");
      } else {
        alert(result.error || "Failed to save stock entry.");
      }
    } catch (err) {
      alert("Network error. Please make sure the backend server is running.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-[20px] font-sans bg-background dark:bg-[#0a0f1d] min-h-screen">
      {/* Dynamic Header with Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center bg-card border border-border rounded-[5px] text-muted-foreground hover:text-foreground transition-all shadow-none shrink-0 cursor-pointer"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          {isNew ? (
            <h1 className="text-[18px] sm:text-[20px] font-bold text-foreground leading-none">Stock / Inventory Management</h1>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <h1 className="text-[18px] sm:text-[20px] font-bold text-foreground leading-none">{medicineName || "Loading..."}</h1>
                <span className="bg-[#fef3c7] text-[#b45309] text-[10px] font-bold px-2 py-0.5 rounded-[4px] uppercase tracking-tight">Active</span>
              </div>
              <p className="text-[12px] text-muted-foreground font-bold mt-1.5 opacity-70">
                {medicineName} • {selectedType || "N/A"} • Rack {rackId || "Not Assigned"}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[20px]">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card p-4 sm:p-5 rounded-[5px] border border-border flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 transition-all shadow-none">
            <div className={cn("w-10 h-10 rounded-[5px] flex items-center justify-center shrink-0 shadow-none", stat.bg)}>
              <stat.icon className={cn("w-5 h-5 shadow-none", stat.color)} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-muted-foreground tracking-tight leading-none mb-1.5">{stat.label}</p>
              <p className="text-[14px] sm:text-[15px] font-bold text-foreground leading-none tracking-tight truncate">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Stock Details Form */}
      <div className="bg-card p-6 rounded-[5px] border border-border shadow-none">
        <h3 className="text-[14px] font-bold text-foreground mb-6">Stock Details</h3>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Medicine Name */}
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-foreground">Medicine Name</label>
              <input
                type="text"
                placeholder="e.g. Amoxicillin 250mg"
                value={medicineName}
                onChange={(e) => setMedicineName(e.target.value)}
                disabled={!isNew}
                className="w-full h-12 px-4 bg-background border border-border rounded-[5px] text-[13px] font-bold text-foreground placeholder:text-muted-foreground/45 outline-none focus:border-primary disabled:opacity-75 transition-all shadow-none font-sans"
              />
            </div>

            {/* Type Dropdown with automatic alphabetical search filter */}
            <div ref={containerRef} className="space-y-2 relative">
              <label className="text-[12px] font-bold text-foreground">Type</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Select or search type..."
                  value={selectedType}
                  onChange={(e) => {
                    setSelectedType(e.target.value);
                    setDropdownOpen(true);
                  }}
                  onFocus={() => setDropdownOpen(true)}
                  className="w-full h-12 pl-4 pr-10 bg-background border border-border rounded-[5px] text-[13px] font-bold text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary transition-all shadow-none font-sans"
                />
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/70 hover:text-foreground cursor-pointer transition-colors"
                >
                  <ChevronDown size={14} className={cn("transition-transform duration-200", dropdownOpen && "rotate-180")} />
                </button>
              </div>

              {dropdownOpen && (
                <div className="absolute z-[1050] left-0 right-0 top-[78px] bg-card border border-border rounded-[5px] shadow-none max-h-[220px] overflow-y-auto no-scrollbar p-1">
                  {filteredTypes.length > 0 ? (
                    filteredTypes.map((type) => (
                      <div
                        key={type}
                        onClick={() => {
                          setSelectedType(type);
                          setDropdownOpen(false);
                        }}
                        className="font-bold text-[13px] h-10 px-3.5 rounded-[5px] cursor-pointer flex items-center hover:bg-primary/5 hover:text-primary text-foreground select-none transition-colors"
                      >
                        {type}
                      </div>
                    ))
                  ) : (
                    <div className="text-[12.5px] font-bold text-muted-foreground p-4 text-center italic select-none">
                      No matching medicine types
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mfg Field */}
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-foreground">Mfg</label>
              <input
                type="text"
                placeholder="e.g. Cipla, GSK"
                value={mfg}
                onChange={(e) => setMfg(e.target.value)}
                className="w-full h-12 px-4 bg-background border border-border rounded-[5px] text-[13px] font-bold text-foreground placeholder:text-muted-foreground/45 outline-none focus:border-primary transition-all shadow-none font-sans"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quantity Stepper */}
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-foreground">Quantity</label>
              <div className="flex h-12 w-full bg-background border border-border rounded-[5px] overflow-hidden shadow-none">
                <button 
                  onClick={() => setQuantity(Math.max(0, quantity - 1))}
                  className="w-12 h-full flex items-center justify-center border-r border-border text-muted-foreground hover:bg-muted transition-all shadow-none cursor-pointer"
                >
                  <Minus size={14} />
                </button>
                <input 
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                  className="flex-1 h-full text-center text-[15px] font-bold text-foreground bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none shadow-none"
                />
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-full flex items-center justify-center border-l border-border text-muted-foreground hover:bg-muted transition-all shadow-none cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Expiry Date Picker (both by typing & calendar dropdown) */}
            <FormDatePicker
              label="Expiry"
              value={expiryDate}
              onChange={setExpiryDate}
              placeholder="MM/YYYY"
              mode="month-year"
              className="space-y-2"
            />
          </div>

          {/* Notes Textarea */}
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-foreground">Notes</label>
            <textarea 
              placeholder="Received from new supplier..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full min-h-[100px] p-4 bg-background border border-border rounded-[5px] text-[13px] font-bold text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary transition-all resize-none shadow-none font-sans"
            />
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-3">
        <button 
          onClick={() => router.back()}
          className="flex items-center justify-center px-8 h-11 border border-destructive text-destructive rounded-[5px] text-[13px] font-bold hover:bg-destructive/5 transition-all shadow-none cursor-pointer"
        >
          Cancel
        </button>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center justify-center px-8 h-11 bg-primary text-primary-foreground rounded-[5px] text-[13px] font-bold hover:opacity-90 disabled:opacity-50 transition-all shadow-none cursor-pointer"
        >
          {isSaving ? "Saving..." : "Save Adjustment"}
        </button>
      </div>

      {/* Hidden scrollbar styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none !important;
        }
        .no-scrollbar {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
      `}} />
    </div>
  );
}
