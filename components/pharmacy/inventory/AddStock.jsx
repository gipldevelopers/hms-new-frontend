"use client";

import React, { useState } from "react";
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
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AddStock() {
  const { id } = useParams();
  const router = useRouter();
  const [quantity, setQuantity] = useState(50);

  const stats = [
    { label: "Rack Id", value: "B-04", icon: Package, color: "text-[#2e37a4]", bg: "bg-[#f0f2ff]" },
    { label: "Storage", value: "Cold Storage", icon: Snowflake, color: "text-[#06b6d4]", bg: "bg-[#ecfeff]" },
    { label: "Capacity", value: "80%", icon: Clock, color: "text-[#f59e0b]", bg: "bg-[#fffbeb]" },
    { label: "Current Items", value: "12 Medicines", icon: Pill, color: "text-[#10b981]", bg: "bg-[#ecfdf5]" },
  ];

  const isNew = id === "new";

  return (
    <div className="p-4 sm:p-6 space-y-[20px] font-sans bg-background dark:bg-[#0a0f1d] min-h-screen">
      {/* Dynamic Header */}
      {isNew ? (
        <div className="flex items-center justify-between">
          <h1 className="text-[20px] font-bold text-foreground">Stock / Inventory Management</h1>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center bg-card border border-border rounded-[5px] text-muted-foreground hover:text-foreground transition-all shadow-none shrink-0"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[18px] sm:text-[20px] font-bold text-foreground leading-none">Amoxicillin 250mg</h1>
              <span className="bg-[#fef3c7] text-[#b45309] text-[10px] font-bold px-2 py-0.5 rounded-[4px] uppercase tracking-tight">Low</span>
            </div>
            <p className="text-[12px] text-muted-foreground font-bold mt-1.5 opacity-70">
              Amoxicillin • Capsule • GSK • 10×10
            </p>
          </div>
        </div>
      )}

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Type Dropdown */}
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-foreground">Type</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-full h-12 px-4 bg-background border border-border rounded-[5px] text-[13px] font-bold text-foreground flex items-center justify-between hover:bg-muted transition-all outline-none group data-[state=open]:border-primary shadow-none">
                    <span className="text-muted-foreground/60">Add Stock Type..</span>
                    <ChevronDown size={14} className="text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[300px] p-1 border-border rounded-[5px] shadow-none bg-card">
                  <DropdownMenuItem className="font-bold text-[13px] h-11 px-3 rounded-[5px] cursor-pointer focus:bg-primary/5 focus:text-primary">New Purchase</DropdownMenuItem>
                  <DropdownMenuItem className="font-bold text-[13px] h-11 px-3 rounded-[5px] cursor-pointer focus:bg-primary/5 focus:text-primary">Returns</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Quantity Stepper */}
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-foreground">Quantity</label>
              <div className="flex h-12 w-full bg-background border border-border rounded-[5px] overflow-hidden shadow-none">
                <button 
                  onClick={() => setQuantity(Math.max(0, quantity - 1))}
                  className="w-12 h-full flex items-center justify-center border-r border-border text-muted-foreground hover:bg-muted transition-all shadow-none"
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
                  className="w-12 h-full flex items-center justify-center border-l border-border text-muted-foreground hover:bg-muted transition-all shadow-none"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Batch / Expiry Dropdown */}
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-foreground">Batch / Expiry</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full h-12 px-4 bg-background border border-border rounded-[5px] text-[13px] font-bold text-foreground flex items-center justify-between hover:bg-muted transition-all outline-none group data-[state=open]:border-primary shadow-none">
                  <span className="text-muted-foreground/60">Select Batch or Enter New...</span>
                  <ChevronDown size={14} className="text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[calc(100vw-80px)] md:w-[600px] p-1 border-border rounded-[5px] shadow-none bg-card">
                <DropdownMenuItem className="font-bold text-[13px] h-11 px-3 rounded-[5px] cursor-pointer focus:bg-primary/5 focus:text-primary">BTCH-9921 (Exp: 12/2026)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Notes Textarea */}
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-foreground">Notes</label>
            <textarea 
              placeholder="Received from new supplier..."
              className="w-full min-h-[100px] p-4 bg-background border border-border rounded-[5px] text-[13px] font-bold text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary transition-all resize-none shadow-none"
            />
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-3">
        <button 
          onClick={() => router.back()}
          className="flex items-center justify-center px-8 h-11 border border-destructive text-destructive rounded-[5px] text-[13px] font-bold hover:bg-destructive/5 transition-all shadow-none"
        >
          Cancel
        </button>
        <button className="flex items-center justify-center px-8 h-11 bg-primary text-primary-foreground rounded-[5px] text-[13px] font-bold hover:opacity-90 transition-all shadow-none">
          Save Adjustment
        </button>
      </div>
    </div>
  );
}
