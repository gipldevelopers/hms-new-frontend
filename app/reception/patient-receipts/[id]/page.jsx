"use client";

import React from "react";
import { 
  ArrowLeft, 
  Wallet, 
  Clock, 
  User, 
  Phone, 
  Calendar, 
  Stethoscope,
  Send,
  MoreVertical,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function PendingReceiptDetails() {
  const router = useRouter();

  const services = [
    { name: "OPD Consultation - Senior Specialist", dept: "Cardiology", price: "₹ 1,200.00", status: "Pending", total: "₹ 1,200.00" },
    { name: "Electrocardiogram (ECG)", dept: "Diagnostics", price: "₹ 500.00", status: "Pending", total: "₹ 500.00" },
    { name: "Medical Hygiene Kit", dept: "Consumables", price: "₹ 300.00", status: "Pending", total: "₹ 300.00" },
  ];

  return (
    <div className="flex flex-col gap-5 p-5 min-h-screen bg-background">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center rounded-[var(--radius)] border border-border bg-card hover:bg-muted transition-all shadow-none"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <h1 className="text-[18px] sm:text-[20px] font-bold text-foreground truncate">Pending Receipt</h1>
        </div>
        <button className="w-full md:w-auto h-11 px-6 bg-[#3B4CB8] text-white rounded-[var(--radius)] text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-[#2D3A8C] transition-all shadow-none whitespace-nowrap">
          Assign to Billing Department
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Main Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
        
        {/* Patient Profile Card */}
        <div className="lg:col-span-2 bg-card border border-border rounded-[var(--radius)] flex flex-col shadow-none">
          <div className="p-4 sm:p-6 flex items-center justify-between border-b border-border/50">
            <h2 className="text-[14px] font-bold text-foreground">Patient Profile</h2>
            <span className="px-3 py-1 bg-[#FEE2E2] text-[#EF4444] rounded-full text-[10px] font-bold">
              Balance Overdue
            </span>
          </div>
          
          <div className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[var(--radius)] overflow-hidden bg-muted flex-shrink-0 relative">
               <div className="absolute inset-0 flex items-center justify-center bg-primary/10 text-primary">
                  <User className="w-10 h-10" />
               </div>
               {/* Note: In a real app, an <Image /> would go here */}
            </div>

            {/* Details Grid */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 w-full">
              <div className="space-y-1 text-center sm:text-left">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-tight">Full Name</p>
                <h3 className="text-[16px] font-bold text-foreground">Rajesh Kumar Verma</h3>
                <p className="text-[11px] font-bold text-muted-foreground bg-muted/50 inline-block px-2 py-0.5 rounded-[3px]">PID: 98201-BXC</p>
              </div>

              <div className="space-y-1 text-center sm:text-left">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-tight">Phone Number</p>
                <p className="text-[14px] font-bold text-foreground">+91 98765 43210</p>
              </div>

              <div className="space-y-1 text-center sm:text-left">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-tight">Visit Type</p>
                <p className="text-[14px] font-bold text-foreground">OPD Consultation</p>
              </div>

              <div className="space-y-1 text-center sm:text-left">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-tight">Last Visit Date</p>
                <p className="text-[14px] font-bold text-foreground">October 24, 2023</p>
              </div>
            </div>
          </div>
        </div>

        {/* Amount Due Card */}
        <div className="bg-[#3B4CB8] rounded-[var(--radius)] p-6 sm:p-8 flex flex-col justify-between text-white relative overflow-hidden shadow-none min-h-[220px]">
          {/* Decorative Square top-right */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 -mr-10 -mt-10 rounded-full" />
          
          <div className="space-y-4 relative z-10">
            <div className="space-y-1">
              <p className="text-[13px] font-medium text-white/80">Total Amount Due</p>
              <h2 className="text-[36px] sm:text-[42px] font-bold tracking-tight leading-none">₹ 2,000.00</h2>
            </div>
            <div className="h-[1px] w-full bg-white/20" />
          </div>
          
          <div className="flex items-center justify-between relative z-10 mt-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-white/80" />
              <p className="text-[13px] font-bold text-white">Due in 2 days</p>
            </div>
            <Wallet className="w-6 h-6 text-white/40" />
          </div>
        </div>

      </div>

      {/* Service Breakdown */}
      <div className="bg-card border border-border rounded-[var(--radius)] overflow-hidden shadow-none">
        <div className="p-4 sm:p-6 border-b border-border/50">
          <h2 className="text-[14px] font-bold text-foreground">Service Breakdown</h2>
        </div>
        
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border/60">
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Service Details</th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Department</th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Unit Price</th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {services.map((item, index) => (
                <tr key={index} className="hover:bg-muted/5 transition-colors">
                  <td className="px-6 py-5 text-[14px] font-bold text-foreground">{item.name}</td>
                  <td className="px-6 py-5 text-[13px] font-medium text-foreground">{item.dept}</td>
                  <td className="px-6 py-5 text-[13px] font-medium text-foreground">{item.price}</td>
                  <td className="px-6 py-5 text-center">
                    <span className="px-3 py-1 bg-muted/50 text-muted-foreground rounded-[var(--radius)] text-[10px] font-bold inline-block">
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-[14px] font-bold text-foreground text-right">{item.total}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-muted/30 border-t border-border">
                <td colSpan={4} className="px-6 py-5 text-[13px] font-bold text-muted-foreground text-right uppercase tracking-widest">Subtotal</td>
                <td className="px-6 py-5 text-[18px] font-bold text-foreground text-right">₹ 2,000.00</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-border/60">
          {services.map((item, index) => (
            <div key={index} className="p-4 space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-[14px] font-bold text-foreground leading-tight">{item.name}</h3>
                  <p className="text-[11px] font-bold text-muted-foreground">{item.dept}</p>
                </div>
                <span className="px-2 py-0.5 bg-muted/50 text-muted-foreground rounded-[3px] text-[10px] font-bold">{item.status}</span>
              </div>
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-muted-foreground font-medium">Unit Price: {item.price}</span>
                <span className="font-bold text-foreground">Total: {item.total}</span>
              </div>
            </div>
          ))}
          <div className="p-4 bg-muted/20 flex justify-between items-center">
            <span className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest">Subtotal</span>
            <span className="text-[18px] font-bold text-foreground">₹ 2,000.00</span>
          </div>
        </div>
      </div>

    </div>
  );
}
