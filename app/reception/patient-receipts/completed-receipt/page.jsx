"use client";

import React from "react";
import { 
  ArrowLeft, 
  Printer, 
  FileText, 
  Mail, 
  Phone, 
  User, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Receipt,
  FileCheck,
  Stethoscope
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function CompletedReceiptDetails() {
  const router = useRouter();

  const services = [
    { name: "Consultation Fee", sub: "Standard Cardiology Review", price: "₹150.00", total: "₹150.00" },
    { name: "Echocardiogram (ECG)", sub: "Diagnostic Imaging Services", price: "₹450.00", total: "₹450.00" },
    { name: "Blood Panel (Lipid Profile)", sub: "Laboratory Analysis", price: "₹85.00", total: "₹85.00" },
  ];

  const history = [
    { id: "#RCP-2023-7412", date: "Aug 12, 2023", amount: "₹120.00" },
    { id: "#RCP-2023-6110", date: "Jun 05, 2023", amount: "₹345.50" },
    { id: "#RCP-2023-5001", date: "Apr 21, 2023", amount: "₹89.00" },
  ];

  return (
    <div className="flex flex-col gap-5 p-5 min-h-screen bg-background">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.back()}
              className="w-9 h-9 flex items-center justify-center rounded-[var(--radius)] border border-border bg-card hover:bg-muted transition-all shadow-none"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <h1 className="text-[18px] sm:text-[20px] font-bold text-foreground">Receipt #RCP-2023-8842</h1>
          </div>
          <div className="flex items-center gap-2 ml-12">
            <span className="px-2 py-0.5 bg-[#E6F9F1] text-[#00A389] rounded-[3px] text-[10px] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Paid
            </span>
            <p className="text-[11px] sm:text-[12px] font-medium text-muted-foreground">Settled on Oct 24, 2023 • 14:32 PM</p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none h-10 px-4 border border-border bg-card rounded-[var(--radius)] text-[12px] font-bold text-foreground flex items-center justify-center gap-2 hover:bg-muted transition-all shadow-none">
            <Printer className="w-4 h-4 text-muted-foreground" />
            Print
          </button>
          <button 
            onClick={() => router.push("/reception/patient-receipts/payment-receipt")}
            className="flex-1 md:flex-none h-10 px-4 bg-primary text-white rounded-[var(--radius)] text-[12px] font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-none"
          >
            Generate Receipt
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Column: Patient Profile */}
        <div className="lg:col-span-5 bg-card border border-border rounded-[var(--radius)] p-6 space-y-8 flex flex-col shadow-none h-full">
          <div className="flex items-center gap-4">
             <div className="w-20 h-20 rounded-[var(--radius)] bg-muted overflow-hidden relative border border-border/50 shrink-0">
                <div className="absolute inset-0 flex items-center justify-center bg-primary/5 text-primary">
                    <User className="w-10 h-10" />
                </div>
             </div>
             <div className="space-y-1">
                <h2 className="text-[20px] font-bold text-foreground leading-tight">Elena Rodriguez</h2>
                <p className="text-[12px] font-bold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-[3px] inline-block">Patient ID: PAT-99203</p>
             </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-3">
               <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Contact Information</p>
               <div className="space-y-2.5">
                  <div className="flex items-center gap-3 text-foreground/80 hover:text-primary transition-colors cursor-pointer group">
                    <div className="w-8 h-8 rounded-[var(--radius)] border border-border flex items-center justify-center group-hover:bg-primary/5">
                        <Mail className="w-4 h-4" />
                    </div>
                    <span className="text-[13px] font-bold">elena.r@email.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-foreground/80 hover:text-primary transition-colors cursor-pointer group">
                    <div className="w-8 h-8 rounded-[var(--radius)] border border-border flex items-center justify-center group-hover:bg-primary/5">
                        <Phone className="w-4 h-4" />
                    </div>
                    <span className="text-[13px] font-bold">+1 (555) 012-3456</span>
                  </div>
               </div>
            </div>

            <div className="space-y-3">
               <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Primary Physician</p>
               <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-[var(--radius)] border border-border flex items-center justify-center text-primary/60">
                        <Stethoscope className="w-4 h-4" />
                    </div>
                    <span className="text-[13px] font-bold text-foreground">Dr. Jonathan Harker (Cardiology)</span>
               </div>
            </div>

            <div className="space-y-3">
               <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Last Visit Date</p>
               <p className="text-[14px] font-bold text-foreground ml-11">October 24, 2023</p>
            </div>
          </div>

          <button className="mt-auto w-full h-11 border border-border bg-card rounded-[var(--radius)] text-[13px] font-bold text-foreground hover:bg-muted transition-all shadow-none">
            View Full Medical Record
          </button>
        </div>

        {/* Right Column: Charge Breakdown */}
        <div className="lg:col-span-7 bg-card border border-border rounded-[var(--radius)] flex flex-col shadow-none overflow-hidden h-full">
          <div className="p-5 border-b border-border/50 flex items-center justify-between">
            <h2 className="text-[14px] font-bold text-foreground">Current Charge Breakdown</h2>
            <p className="text-[11px] font-bold text-muted-foreground">Service Date: Oct 23, 2023</p>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-muted/30 border-b border-border/60">
                  <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider text-right">Unit Price</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {services.map((item, index) => (
                  <tr key={index} className="hover:bg-muted/5 transition-colors">
                    <td className="px-6 py-5">
                      <div className="space-y-0.5">
                        <p className="text-[14px] font-bold text-foreground">{item.name}</p>
                        <p className="text-[11px] font-medium text-muted-foreground">{item.sub}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-[14px] font-bold text-foreground text-right">{item.price}</td>
                    <td className="px-6 py-5 text-[14px] font-bold text-foreground text-right">{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 bg-muted/20 border-t border-border/50 space-y-4">
            <div className="flex justify-between items-center text-[13px] font-bold text-muted-foreground">
                <span>Subtotal</span>
                <span className="text-foreground">₹685.00</span>
            </div>
            <div className="flex justify-between items-center text-[13px] font-bold text-muted-foreground border-b border-border/40 pb-4">
                <span>Tax (5%)</span>
                <span className="text-foreground">₹34.25</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-[18px] font-bold text-foreground">Total Paid</span>
                <span className="text-[28px] font-bold text-primary">₹719.25</span>
            </div>
          </div>
        </div>
      </div>

      {/* Previous Payments History */}
      <div className="bg-card border border-border rounded-[var(--radius)] p-6 space-y-6 shadow-none">
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-foreground leading-none">Previous Payments History</h2>
          <button className="h-8 px-3 text-[12px] font-bold text-primary bg-primary/5 hover:bg-primary/10 rounded-[var(--radius)] transition-all">
            View all
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {history.map((item, index) => (
            <div key={index} className="p-4 border border-border rounded-[var(--radius)] flex items-center justify-between hover:border-primary/30 hover:bg-primary/0 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-[var(--radius)] bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/5 transition-colors">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-[13px] font-bold text-foreground leading-none">{item.id}</p>
                  <p className="text-[11px] font-medium text-muted-foreground">{item.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[15px] font-bold text-foreground leading-none">{item.amount}</p>
                <p className="text-[9px] font-bold text-[#00A389] uppercase mt-1">Settled</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
