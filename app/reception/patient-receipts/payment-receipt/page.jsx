"use client";

import React from "react";
import { 
  ArrowLeft, 
  Printer, 
  Download, 
  CheckCircle2, 
  Building2,
  User,
  CreditCard,
  Banknote,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function PaymentReceiptDocument() {
  const router = useRouter();

  const items = [
    { name: "Consultation Fee", sub: "Dr. Smith - General", amount: "₹120.00" },
    { name: "Complete Blood Count (CBC)", sub: "Pathology Dept.", amount: "₹45.00" },
    { name: "Registration Charges", sub: "Admin", amount: "₹50.00" },
  ];

  const transactions = [
    { method: "Cash Payment", time: "Oct 24, 2023 • 09:45 AM", amount: "+₹100.00", icon: Banknote, bg: "bg-[#3B4CB8]/5", color: "text-[#3B4CB8]" },
    { method: "Card Payment (**** 4242)", time: "Oct 24, 2023 • 11:30 AM", amount: "+₹115.00", icon: CreditCard, bg: "bg-[#3B4CB8]/5", color: "text-[#3B4CB8]" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FB] p-5 gap-8">
      {/* Top Nav */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[13px] font-bold text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Receipts
        </button>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none h-10 px-4 border border-border bg-white rounded-[var(--radius)] text-[12px] font-bold text-foreground flex items-center justify-center gap-2 hover:bg-muted transition-all shadow-none">
            <Printer className="w-4 h-4 text-muted-foreground" />
            Print
          </button>
          <button className="flex-1 sm:flex-none h-10 px-4 bg-[#3B4CB8] text-white rounded-[var(--radius)] text-[12px] font-bold flex items-center justify-center gap-2 hover:bg-[#2D3A8C] transition-all shadow-none">
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Page Header */}
      <div className="max-w-[850px] mx-auto w-full space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1 text-center sm:text-left">
            <h1 className="text-[24px] sm:text-[28px] font-bold text-foreground tracking-tight">Payment Receipt</h1>
            <p className="text-[12px] sm:text-[13px] font-medium text-muted-foreground">A copy of this receipt has been emailed to the patient.</p>
          </div>
          <span className="self-center sm:self-auto px-3 py-1.5 bg-[#E6F9F1] text-[#00A389] rounded-full text-[10px] sm:text-[11px] font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Payment Settled
          </span>
        </div>
      </div>

      {/* Receipt Document */}
      <div className="max-w-[850px] mx-auto w-full bg-white border border-border rounded-[var(--radius)] shadow-none overflow-hidden relative">
        {/* Top Accent Bar */}
        <div className="h-1.5 w-full bg-[#3B4CB8]" />
        
        <div className="p-8 sm:p-12 space-y-12">
          {/* Clinic & Receipt Info */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[var(--radius)] bg-[#3B4CB8]/5 flex items-center justify-center text-[#3B4CB8]">
                <Building2 className="w-6 h-6" />
              </div>
              <h2 className="text-[20px] font-bold text-foreground">HMS Clinic</h2>
            </div>
            <div className="text-left sm:text-right space-y-1">
              <p className="text-[11px] font-bold text-foreground tracking-wider uppercase">Receipt #RCPT-00892</p>
              <p className="text-[12px] font-medium text-muted-foreground">Date: Oct 24, 2023 11:30 AM</p>
              <p className="text-[12px] font-medium text-muted-foreground">Cashier: Ayush S. (Counter 4)</p>
            </div>
          </div>

          {/* Billing & Total Block */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-t border-b border-border/50 py-10">
            <div className="space-y-4">
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Billed To</p>
              <div className="space-y-1">
                <h3 className="text-[16px] font-bold text-foreground">Sarah Jenkins</h3>
                <p className="text-[12px] font-medium text-muted-foreground">Patient ID: PID-2023-4481</p>
                <p className="text-[12px] font-medium text-muted-foreground">Female, 32 yrs</p>
                <p className="text-[12px] font-medium text-muted-foreground">+91 84636 86523</p>
              </div>
            </div>
            
            <div className="w-full md:w-[320px] bg-[#F8FAFC] border border-border/60 rounded-[var(--radius)] p-8 text-center space-y-1">
              <p className="text-[13px] font-medium text-muted-foreground">Total Amount Paid</p>
              <h2 className="text-[42px] font-bold text-[#3B4CB8] tracking-tight">₹215.00</h2>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-6">
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Services / Items</p>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/60">
                  <th className="pb-4 text-[12px] font-bold text-foreground">Description</th>
                  <th className="pb-4 text-[12px] font-bold text-foreground text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {items.map((item, i) => (
                  <tr key={i}>
                    <td className="py-5">
                      <div className="space-y-1">
                        <p className="text-[14px] font-bold text-foreground">{item.name}</p>
                        <p className="text-[11px] font-medium text-muted-foreground">{item.sub}</p>
                      </div>
                    </td>
                    <td className="py-5 text-[14px] font-bold text-foreground text-right">{item.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Summary Block */}
            <div className="flex flex-col items-end gap-3 pt-6 border-t border-border/50">
              <div className="flex items-center gap-12 text-[13px] font-bold text-muted-foreground">
                <span>Subtotal</span>
                <span className="text-foreground w-20 text-right">₹215.00</span>
              </div>
              <div className="flex items-center gap-12 text-[13px] font-bold text-muted-foreground">
                <span>Discount</span>
                <span className="text-foreground w-20 text-right">₹0.00</span>
              </div>
              <div className="flex items-center gap-12 text-[13px] font-bold text-muted-foreground">
                <span>Taxes</span>
                <span className="text-foreground w-20 text-right">₹0.00</span>
              </div>
              <div className="flex items-center gap-12 pt-4">
                <span className="text-[16px] font-bold text-foreground uppercase tracking-wider">Total Billed</span>
                <span className="text-[20px] font-bold text-[#3B4CB8] w-20 text-right">₹215.00</span>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="space-y-6 pt-12 border-t border-border/50">
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Transaction History</p>
            <div className="grid grid-cols-1 gap-3">
              {transactions.map((t, i) => (
                <div key={i} className="p-4 border border-border rounded-[var(--radius)] flex items-center justify-between bg-[#F8FAFC]/50">
                  <div className="flex items-center gap-4">
                    <div className={cn("w-10 h-10 rounded-[var(--radius)] flex items-center justify-center shrink-0", t.bg)}>
                      <t.icon className={cn("w-5 h-5", t.color)} />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-[13px] font-bold text-foreground">{t.method}</h4>
                      <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {t.time}
                      </div>
                    </div>
                  </div>
                  <span className="text-[15px] font-bold text-[#3B4CB8]">{t.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Print Footer Spacer */}
      <div className="h-10" />
    </div>
  );
}
