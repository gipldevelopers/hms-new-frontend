"use client";

import React from "react";
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
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { AddMedicineToRackModal } from "./AddMedicineToRackModal";

export function RackView() {
  const router = useRouter();
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  const rackData = [
    {
      aisle: "AISLE A - GENERAL TABLETS",
      racks: [
        { 
          id: "A-01", 
          items: [
            { name: "Aspirin 75mg", qty: 1200, status: "in-stock" },
            { name: "Ibuprofen 400mg", qty: 800, status: "in-stock" }
          ]
        },
        { 
          id: "A-02", 
          highlighted: true,
          items: [
            { name: "Pantoprazole 40mg", qty: 2100, status: "in-stock" }
          ]
        },
        { 
          id: "A-03", 
          items: [
            { name: "Lisinopril 5mg", qty: 120, status: "low" }
          ]
        },
        { 
          id: "A-04", 
          items: [
            { name: "Metformin 500mg", qty: 0, status: "oos" }
          ]
        },
        { 
          id: "A-05", 
          items: [
            { name: "Atorvastatin 10mg", qty: 450, status: "in-stock" }
          ]
        },
        { 
          id: "A-06", 
          items: [
            { name: "Amlodipine 5mg", qty: 30, status: "critical" },
            { name: "Losartan 50mg", qty: 25, status: "critical" }
          ]
        }
      ]
    },
    {
      aisle: "AISLE B - ANTIBIOTICS & CAPSULES",
      racks: [
        { id: "B-01", items: [{ name: "Ciprofloxacin 500mg", qty: 300, status: "in-stock" }] },
        { id: "B-02", items: [{ name: "Doxycycline 100mg", qty: 150, status: "low" }] },
        { id: "B-03", items: [{ name: "Cephalexin 500mg", qty: 600, status: "in-stock" }] },
        { id: "B-04", items: [{ name: "Amoxicillin 250mg", qty: 450, status: "low" }] },
        { id: "B-05", items: [{ name: "Ciprofloxacin 500mg", qty: 300, status: "in-stock" }] },
        { id: "B-06", items: [{ name: "Doxycycline 100mg", qty: 150, status: "low" }] },
        { id: "B-07", items: [{ name: "Cephalexin 500mg", qty: 600, status: "in-stock" }] },
        { id: "B-08", items: [{ name: "Amoxicillin 250mg", qty: 450, status: "low" }] },
      ]
    }
  ];

  const getStatusStyles = (status) => {
    switch (status) {
      case "in-stock": return "bg-[#dcfce7] border-[#bbf7d0] text-[#15803d]";
      case "low": return "bg-[#fef3c7] border-[#fde68a] text-[#b45309]";
      case "critical": return "bg-[#fee2e2] border-[#fecaca] text-[#b91c1c]";
      case "oos": return "bg-[#f1f5f9] border-[#e2e8f0] text-[#64748b]";
      default: return "";
    }
  };

  const getDotColor = (status) => {
    switch (status) {
      case "in-stock": return "bg-[#22c55e]";
      case "low": return "bg-[#f59e0b]";
      case "critical": return "bg-[#ef4444]";
      case "oos": return "bg-[#94a3b8]";
      default: return "";
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-[20px] font-sans bg-[#f8f9fc] dark:bg-[#0a0f1d] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2.5 bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[#64748b] hover:text-[#1e293b] dark:hover:text-white transition-all shadow-none"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-[20px] font-bold text-[#1e293b] dark:text-white leading-none">Rack Layout Management</h1>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 h-11 bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-bold text-[#1e293b] dark:text-white hover:bg-gray-50 transition-all shadow-none">
            <Download size={16} /> Export
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 h-11 bg-[#2e37a4] text-white rounded-[5px] text-[13px] font-bold hover:opacity-90 transition-all shadow-none"
          >
            <Plus size={16} strokeWidth={3} /> Add Stock
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-[#1e293b] p-3 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-[380px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b] opacity-50" />
          <input 
            type="text"
            placeholder="Search medicines, batches, or racks..."
            className="w-full h-11 pl-10 pr-4 bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-bold text-[#1e293b] dark:text-white placeholder:text-[#64748b]/60 outline-none focus:border-primary transition-all shadow-none"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex-1 md:w-[120px] h-11 px-4 bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-bold text-[#1e293b] dark:text-white flex items-center justify-between hover:bg-gray-50 transition-all outline-none group data-[state=open]:border-primary shadow-none">
                All <ChevronDown size={14} className="text-[#64748b] transition-transform group-data-[state=open]:rotate-180" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px] p-1 rounded-[5px]">
              <DropdownMenuItem className="font-bold text-[13px]">All</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex-1 md:w-[120px] h-11 px-4 bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-bold text-[#1e293b] dark:text-white flex items-center justify-between hover:bg-gray-50 transition-all outline-none group data-[state=open]:border-primary shadow-none">
                All <ChevronDown size={14} className="text-[#64748b] transition-transform group-data-[state=open]:rotate-180" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px] p-1 rounded-[5px]">
              <DropdownMenuItem className="font-bold text-[13px]">All</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Rack Map Section */}
      <div className="bg-white dark:bg-[#1e293b] p-6 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-[15px] font-bold text-[#1e293b] dark:text-white">Physical Rack Map</h2>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
              <span className="text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8]">In Stock</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
              <span className="text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8]">Low Stock</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
              <span className="text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8]">Critical</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#94a3b8]" />
              <span className="text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8]">Empty/OOS</span>
            </div>
          </div>
        </div>

        {rackData.map((section, sIdx) => (
          <div key={sIdx} className="space-y-4">
            <h3 className="text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-widest">{section.aisle}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px]">
              {section.racks.map((rack, rIdx) => (
                <div 
                  key={rIdx} 
                  className={cn(
                    "bg-[#f8fafc] dark:bg-white/5 rounded-[5px] border border-[#e2e8f0] dark:border-white/10 flex flex-col overflow-hidden transition-all",
                    rack.highlighted && "border-[#2e37a4] ring-1 ring-[#2e37a4]"
                  )}
                >
                  <div className="px-4 py-3 flex items-center justify-between border-b border-[#e2e8f0] dark:border-white/5">
                    <span className="text-[12px] font-bold text-[#1e293b] dark:text-white tracking-tight">{rack.id}</span>
                    <button 
                      onClick={() => setIsAddModalOpen(true)}
                      className="text-[#64748b] hover:text-[#1e293b] dark:hover:text-white transition-colors"
                    >
                      <PlusCircle size={14} />
                    </button>
                  </div>
                  <div className="p-2 space-y-2 flex-1">
                    {rack.items.map((item, iIdx) => (
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
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <AddMedicineToRackModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />
    </div>
  );
}
