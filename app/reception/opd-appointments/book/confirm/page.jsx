"use client";

import React from "react";
import { 
  ArrowRight, 
  Check, 
  Printer, 
  MessageSquare, 
  PhoneCall, 
  UserCheck, 
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function BookAppointmentStep3() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-background p-5 gap-5">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-[20px] font-bold text-foreground">
          Book Appointment: Step 3
        </h1>
      </div>

      {/* Main Content Area - Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full items-start">
        
        {/* Left Column: Billing Details */}
        <div className="bg-card border border-border rounded-[var(--radius)] flex flex-col overflow-hidden h-full">
          <div className="p-4 sm:p-6 space-y-6">
            <h2 className="text-[14px] font-bold text-foreground">Billing Details</h2>
            
            {/* Billing Table */}
            <div className="border border-border rounded-[var(--radius)] overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/30 border-b border-border">
                    <th className="px-3 sm:px-4 py-3 text-[11px] sm:text-[12px] font-bold text-muted-foreground uppercase">Item</th>
                    <th className="px-3 sm:px-4 py-3 text-[11px] sm:text-[12px] font-bold text-muted-foreground text-right uppercase">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-3 sm:px-4 py-3 text-[12px] sm:text-[13px] font-medium text-foreground">Consultation Fee</td>
                    <td className="px-3 sm:px-4 py-3 text-[12px] sm:text-[13px] font-medium text-foreground text-right">₹500.00</td>
                  </tr>
                  <tr>
                    <td className="px-3 sm:px-4 py-3 text-[12px] sm:text-[13px] font-medium text-foreground">Registration Fee</td>
                    <td className="px-3 sm:px-4 py-3 text-[12px] sm:text-[13px] font-medium text-foreground text-right">₹50.00</td>
                  </tr>
                  <tr>
                    <td className="px-3 sm:px-4 py-3 text-[12px] sm:text-[13px] font-medium text-[#00A389]">Discount</td>
                    <td className="px-3 sm:px-4 py-3 text-[12px] sm:text-[13px] font-medium text-[#00A389] text-right">- ₹0.00</td>
                  </tr>
                  <tr>
                    <td className="px-3 sm:px-4 py-3 text-[12px] sm:text-[13px] font-medium text-foreground">Tax (5%)</td>
                    <td className="px-3 sm:px-4 py-3 text-[12px] sm:text-[13px] font-medium text-foreground text-right">₹27.50</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="bg-muted/30 border-t border-border">
                    <td className="px-3 sm:px-4 py-3 text-[12px] sm:text-[13px] font-bold text-foreground">Total Payable</td>
                    <td className="px-3 sm:px-4 py-3 text-[12px] sm:text-[13px] font-bold text-foreground text-right">₹577.50</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Discount Input */}
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-muted-foreground">Manual Discount / Insurance</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Amount or code"
                  className="flex-1 h-11 px-4 bg-background border border-border rounded-[var(--radius)] text-[13px] font-medium outline-none focus:border-primary transition-all shadow-none"
                />
                <button className="w-full sm:w-auto h-11 px-6 bg-card border border-border rounded-[var(--radius)] text-[13px] font-bold text-foreground hover:bg-muted transition-all shadow-none">
                  Apply
                </button>
              </div>
            </div>

            {/* Info Message */}
            <div className="bg-[#F0F7FF] border border-[#BFDBFE] rounded-[var(--radius)] p-4 flex gap-3">
              <Info className="w-5 h-5 text-[#0066FF] shrink-0" />
              <div className="space-y-1">
                <p className="text-[13px] font-bold text-[#0066FF]">Payment Handled by Billing</p>
                <p className="text-[11px] sm:text-[12px] text-[#0066FF]/80 leading-relaxed">
                  Please forward this patient to the billing department for final fee collection. Reception does not collect payments.
                </p>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-4 sm:p-6 border-t border-border flex flex-col-reverse sm:flex-row items-center justify-end gap-3 bg-card mt-auto">
            <button 
              onClick={() => router.back()}
              className="w-full sm:w-auto h-11 px-8 border border-destructive/30 text-destructive hover:bg-destructive/5 rounded-[var(--radius)] text-[13px] font-bold transition-all shadow-none"
            >
              Cancel
            </button>
            <button 
              className="w-full sm:w-auto h-11 px-8 bg-primary text-white rounded-[var(--radius)] text-[13px] font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-none"
            >
              Confirm Appointment
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Appointment Confirmation */}
        <div className="bg-card border border-border rounded-[var(--radius)] p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-6 lg:min-h-[620px]">
          <div className="space-y-3 flex flex-col items-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#E6F8F3] flex items-center justify-center">
              <Check className="w-7 h-7 sm:w-8 sm:h-8 text-[#00A389]" />
            </div>
            <h2 className="text-[18px] font-bold text-foreground">Appointment Confirmed</h2>
          </div>

          {/* Confirmation Details Card */}
          <div className="w-full border border-border rounded-[var(--radius)] overflow-hidden bg-card">
            {/* Header Row */}
            <div className="p-4 border-b border-muted/30 flex justify-between items-center gap-4">
              <div className="text-left space-y-1 overflow-hidden">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Appointment ID</p>
                <p className="text-[12px] sm:text-[13px] font-bold text-foreground truncate">APT-2024-0847</p>
              </div>
              <div className="text-right space-y-1 shrink-0">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Token</p>
                <p className="text-[20px] sm:text-[24px] font-bold text-primary leading-none">#47</p>
              </div>
            </div>
            
            {/* Details Grid */}
            <div className="p-4 grid grid-cols-2 gap-y-5 text-left border-b border-muted/20">
              <div className="space-y-1 overflow-hidden">
                <p className="text-[10px] sm:text-[11px] font-medium text-muted-foreground uppercase">Patient</p>
                <p className="text-[12px] sm:text-[13px] font-bold text-foreground truncate">Ramesh Kumar</p>
              </div>
              <div className="space-y-1 overflow-hidden">
                <p className="text-[10px] sm:text-[11px] font-medium text-muted-foreground uppercase">Doctor</p>
                <p className="text-[12px] sm:text-[13px] font-bold text-foreground truncate">Dr. Arvind Gupta</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] sm:text-[11px] font-medium text-muted-foreground uppercase">Schedule</p>
                <p className="text-[12px] sm:text-[13px] font-bold text-foreground">Today, 10:30 AM</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] sm:text-[11px] font-medium text-muted-foreground uppercase">Position</p>
                <p className="text-[11px] sm:text-[12px] font-bold text-[#F59E0B] flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5" />
                  3rd in queue
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons Grid - 2x2 */}
          <div className="w-full grid grid-cols-2 gap-3">
            <button className="h-10 border border-border bg-card rounded-[var(--radius)] text-[11px] sm:text-[12px] font-bold text-foreground hover:bg-muted flex items-center justify-center gap-2 transition-all shadow-none">
              <Printer className="w-4 h-4 text-muted-foreground" />
              <span className="truncate">Print Slip</span>
            </button>
            <button className="h-10 border border-border bg-card rounded-[var(--radius)] text-[11px] sm:text-[12px] font-bold text-foreground hover:bg-muted flex items-center justify-center gap-2 transition-all shadow-none">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
              <span className="truncate">Send SMS</span>
            </button>
            <button className="h-10 border border-border bg-card rounded-[var(--radius)] text-[11px] sm:text-[12px] font-bold text-foreground hover:bg-muted flex items-center justify-center gap-2 transition-all shadow-none">
              <PhoneCall className="w-4 h-4 text-muted-foreground" />
              <span className="truncate">WhatsApp</span>
            </button>
            <button className="h-10 bg-primary text-white rounded-[var(--radius)] text-[11px] sm:text-[12px] font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-none">
              <UserCheck className="w-4 h-4" />
              <span className="truncate">Check-In</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
