"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  Download, 
  Plus, 
  ChevronDown, 
  PlusCircle, 
  MoreHorizontal,
  Circle,
  ArrowLeft
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { AddMedicineToRackModal } from "./AddMedicineToRackModal";
import { API_URL } from "@/lib/api";

export function RackView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const highlight = searchParams ? searchParams.get("highlight") : null;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedRackId, setSelectedRackId] = useState("A-01");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("authtoken");
      const userStr = localStorage.getItem("user");
      if (!token || !userStr) {
        setError("Session expired. Please login again.");
        setLoading(false);
        return;
      }
      const user = JSON.parse(userStr);
      const branchId = user.branchId;

      const res = await fetch(`${API_URL}/pharmacy/inventory?branchId=${branchId}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const result = await res.json();
      if (result.success) {
        setItems(result.data || []);
      } else {
        setError(result.error || "Failed to fetch inventory items.");
      }
    } catch (err) {
      setError("Failed to load inventory. Please verify backend connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const getStatusStyles = (status) => {
    switch (status) {
      case "IN STOCK": return "bg-[#dcfce7] border-[#bbf7d0] text-[#15803d]";
      case "LOW": return "bg-[#fef3c7] border-[#fde68a] text-[#b45309]";
      case "OUT OF STOCK": return "bg-[#fee2e2] border-[#fecaca] text-[#b91c1c]";
      default: return "bg-gray-50 border-gray-200 text-gray-600";
    }
  };

  const getDotColor = (status) => {
    switch (status) {
      case "IN STOCK": return "bg-[#22c55e]";
      case "LOW": return "bg-[#f59e0b]";
      case "OUT OF STOCK": return "bg-[#ef4444]";
      default: return "bg-gray-400";
    }
  };

  // Racks A-01 to A-04 and E-01 to E-04
  const aisles = [
    { key: "A", name: "AISLE A - GENERAL TABLETS" },
    { key: "B", name: "AISLE B - ANTIBIOTICS & CAPSULES" },
    { key: "C", name: "AISLE C - SYRUPS & SUSPENSIONS" },
    { key: "D", name: "AISLE D - INJECTIONS & INFUSIONS" },
    { key: "E", name: "AISLE E - CREAMS & OINTMENTS" }
  ];
  const rackNumbers = ["01", "02", "03", "04"];

  // Group items by rackId, applying search filters if typed
  const filteredItems = items.filter(item => 
    item.medicineName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.rackId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const rackData = aisles.map((aisle) => {
    return {
      aisle: aisle.name,
      racks: rackNumbers.map((num) => {
        const rackId = `${aisle.key}-${num}`;
        const rackItems = filteredItems.filter((item) => item.rackId === rackId);
        return {
          id: rackId,
          highlighted: highlight === rackId,
          items: rackItems.map((item) => ({
            name: item.medicineName,
            qty: item.quantity,
            status: item.status
          }))
        };
      })
    };
  });

  return (
    <div className="p-4 sm:p-6 space-y-[20px] font-sans bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2.5 bg-card border border-border rounded-[5px] text-muted-foreground hover:text-foreground transition-all shadow-none"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-[20px] font-bold text-foreground leading-none">Rack Layout Management</h1>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 h-11 bg-card border border-border rounded-[5px] text-[13px] font-bold text-foreground hover:bg-muted transition-all shadow-none">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-card p-3 rounded-[5px] border border-border flex flex-col md:flex-row gap-3 items-center justify-between shadow-none">
        <div className="relative w-full md:w-[380px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-50" />
          <input 
            type="text"
            placeholder="Search medicines or racks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-background border border-border rounded-[5px] text-[13px] font-bold text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary transition-all shadow-none"
          />
        </div>
      </div>

      {/* Rack Map Section */}
      <div className="bg-card p-6 rounded-[5px] border border-border space-y-8 shadow-none">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-[15px] font-bold text-foreground">Physical Rack Map (A1-A4 to E1-E4)</h2>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
              <span className="text-[11px] font-bold text-muted-foreground">In Stock</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
              <span className="text-[11px] font-bold text-muted-foreground">Low Stock</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
              <span className="text-[11px] font-bold text-muted-foreground">Out of Stock</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-4">
            <div className="h-8 w-8 animate-spin border-[3px] border-primary/20 border-t-primary rounded-full" />
            <p className="text-[13px] font-bold text-muted-foreground">Loading rack configurations...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-500 font-bold text-[13px]">
            {error}
          </div>
        ) : (
          rackData.map((section, sIdx) => (
            <div key={sIdx} className="space-y-4">
              <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">{section.aisle}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px]">
                {section.racks.map((rack, rIdx) => (
                  <div 
                    key={rIdx} 
                    className={cn(
                      "bg-muted/10 rounded-[5px] border border-border flex flex-col overflow-hidden transition-all",
                      rack.highlighted && "border-[#2e37a4] ring-1 ring-[#2e37a4] dark:border-primary dark:ring-primary"
                    )}
                  >
                    <div className="px-4 py-3 flex items-center justify-between border-b border-border bg-muted/20">
                      <span className="text-[12px] font-bold text-foreground tracking-tight">{rack.id}</span>
                      <button 
                        onClick={() => {
                          setSelectedRackId(rack.id);
                          setIsAddModalOpen(true);
                        }}
                        className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      >
                        <PlusCircle size={14} />
                      </button>
                    </div>
                    <div className="p-2 space-y-2 flex-1">
                      {rack.items.length > 0 ? (
                        rack.items.map((item, iIdx) => (
                          <div 
                            key={iIdx} 
                            className={cn(
                              "px-3 py-2.5 rounded-[5px] border flex items-center justify-between gap-3 group transition-all",
                              getStatusStyles(item.status)
                            )}
                          >
                            <div className="min-w-0 flex-1">
                              <p className="text-[12px] font-bold truncate leading-tight mb-0.5">{item.name}</p>
                              <p className="text-[10px] font-bold opacity-70">Qty: {item.qty}</p>
                            </div>
                            <div className={cn("w-1.5 h-1.5 rounded-full shrink-0 shadow-sm", getDotColor(item.status))} />
                          </div>
                        ))
                      ) : (
                        <div className="text-[11px] font-bold text-muted-foreground/50 text-center py-6 italic select-none">
                          Empty
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      <AddMedicineToRackModal 
        open={isAddModalOpen} 
        onOpenChange={setIsAddModalOpen} 
        rackId={selectedRackId}
        items={items}
        onSuccess={fetchInventory}
      />
    </div>
  );
}
