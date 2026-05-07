"use client";

import React, { useEffect } from "react";
import { X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DischargeDetailModal({ isOpen, onClose, data }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleEsc = (e) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleEsc);
      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleEsc);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const checklist = [
    "Final Vitals Checked",
    "Medications Explained",
    "Reports Attached",
    "Billing Cleared"
  ];

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-[600px] rounded-lg shadow-none overflow-hidden animate-in zoom-in-95 duration-200 border border-border max-h-[95vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="p-5 md:p-6 pb-4 flex justify-between items-start sticky top-0 bg-card z-10 border-b border-border/10">
          <div className="space-y-2">
            <h2 className="text-[20px] md:text-[24px] font-bold text-foreground leading-tight">
              {data?.patient || "John Doe"}
            </h2>
            <span className="inline-block px-3 py-1 rounded-lg text-[10px] font-bold tracking-wider bg-orange-50 dark:bg-orange-500/10 text-orange-600 border border-orange-100 dark:border-orange-500/20 uppercase">
              Pending Discharge
            </span>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 md:p-6 flex-1 overflow-y-auto no-scrollbar space-y-6">
          {/* Top Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">AGE / GENDER</p>
              <p className="text-[13px] md:text-[14px] font-bold text-foreground">45 yrs • Male</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">UHID</p>
              <p className="text-[13px] md:text-[14px] font-bold text-foreground">UH10294</p>
            </div>
            <div className="space-y-1 col-span-2 sm:col-span-1">
              <p className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">WARD / BED</p>
              <p className="text-[13px] md:text-[14px] font-bold text-foreground">{data?.ward || "Ward A - B12"}</p>
            </div>
          </div>

          {/* Summary Card Grid */}
          <div className="bg-muted/30 border border-border rounded-lg p-4 md:p-5 grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-4">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">DIAGNOSIS</p>
              <p className="text-[13px] md:text-[14px] font-bold text-foreground">{data?.diagnosis || "Pneumonia"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">ADMISSION DATE</p>
              <p className="text-[13px] md:text-[14px] font-bold text-foreground">{data?.date || "Oct 12, 2023"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">TREATMENT STATUS</p>
              <p className="text-[13px] md:text-[14px] font-bold text-foreground">Stable</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">LAST VITALS</p>
              <p className="text-[13px] md:text-[14px] font-bold text-foreground">Normal</p>
            </div>
          </div>

          {/* Discharge Notes */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">DISCHARGE NOTES</p>
            <div className="p-4 bg-muted/30 border border-border rounded-lg border-l-4 border-l-primary/20">
              <p className="text-[13px] font-medium text-muted-foreground italic leading-relaxed">
                "Patient condition improved. No fever since 48 hours. Oxygen stable. Ready for discharge."
              </p>
            </div>
          </div>

          {/* Discharge Checklist */}
          <div className="space-y-3">
            <p className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">DISCHARGE CHECKLIST</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {checklist.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg group transition-all hover:bg-muted/10">
                  <div className="w-5 h-5 rounded-[4px] bg-primary flex items-center justify-center text-white shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span className="text-[12px] md:text-[13px] font-bold text-foreground truncate">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">FOLLOW-UP DATE</p>
              <p className="text-[13px] md:text-[14px] font-bold text-foreground">Nov 2, 2023</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">PRESCRIBED MEDICINES</p>
              <p className="text-[13px] md:text-[14px] font-bold text-foreground">3 Medicines</p>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-5 md:p-6 bg-card border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 sticky bottom-0 z-10">
          <button className="w-full md:w-auto text-[13px] font-bold text-primary hover:underline decoration-2 underline-offset-4 text-center md:text-left">
            View Full Medical Record
          </button>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button 
              onClick={onClose}
              className="w-full sm:flex-1 md:w-auto h-10 px-5 rounded-lg border border-red-200 text-red-500 text-[13px] font-bold hover:bg-red-50 dark:hover:bg-red-500/10 transition-all shadow-none"
            >
              Reject Request
            </button>
            <button 
              className="w-full sm:flex-1 md:w-auto h-10 px-5 rounded-lg bg-[#2E37A4] text-white text-[13px] font-bold hover:opacity-90 transition-all shadow-none"
            >
              Approve Discharge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
