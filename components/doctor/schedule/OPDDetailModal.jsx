"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function OPDDetailModal({ isOpen, onClose, data }) {
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

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-[500px] rounded-lg shadow-none overflow-hidden animate-in zoom-in-95 duration-200 border border-border max-h-[95vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="p-5 md:p-6 pb-4 flex justify-between items-start sticky top-0 bg-card z-10 border-b border-border/10">
          <div className="space-y-2">
            <h2 className="text-[20px] md:text-[24px] font-bold text-foreground leading-tight">
              {data?.patient || "Patient Name"}
            </h2>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-lg text-[10px] font-bold tracking-wider bg-blue-50 dark:bg-blue-500/10 text-blue-600 border border-blue-100 dark:border-blue-500/20 uppercase">
                OPD Slot
              </span>
              <span className="px-3 py-1 rounded-lg text-[10px] font-bold tracking-wider bg-blue-50 dark:bg-blue-500/10 text-blue-600 border border-blue-100 dark:border-blue-500/20 uppercase">
                Booked
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 md:p-6 flex-1 overflow-y-auto no-scrollbar space-y-6">
          {/* Main Info Card */}
          <div className="bg-muted/30 border border-border rounded-lg p-4 grid grid-cols-2 sm:grid-cols-3 gap-4 items-center">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">DATE</span>
              <span className="text-[13px] md:text-[14px] font-bold text-foreground">Oct 24, 2023</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">TIME</span>
              <span className="text-[13px] md:text-[14px] font-bold text-foreground">09:00 AM</span>
            </div>
            <div className="flex flex-col gap-1 sm:text-right col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">TOKEN</span>
              <span className="text-[13px] md:text-[14px] font-bold text-primary">A12</span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">AGE / GENDER</p>
              <p className="text-[13px] md:text-[14px] font-bold text-foreground">45 yrs • Male</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">VISIT TYPE</p>
              <p className="text-[13px] md:text-[14px] font-bold text-foreground">Follow-up</p>
            </div>
          </div>

          {/* Symptoms Section */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">SYMPTOMS / REASON</p>
            <div className="p-4 bg-muted/30 border border-border rounded-lg">
              <p className="text-[13px] font-medium text-muted-foreground leading-relaxed">
                Fever, headache and weakness for 2 days.
              </p>
            </div>
          </div>

          {/* Quick Vitals Section */}
          <div className="space-y-3">
            <p className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">QUICK VITALS</p>
            <div className="grid grid-cols-1 xs:grid-cols-3 gap-3">
              {[
                { label: "BP", value: "120/80" },
                { label: "HR", value: "78 bpm" },
                { label: "TEMP", value: "99°F" }
              ].map((vital) => (
                <div key={vital.label} className="p-3 bg-card border border-border rounded-lg flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{vital.label}</span>
                  <span className="text-[13px] md:text-[14px] font-bold text-foreground">{vital.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 md:p-6 bg-card border-t border-border flex flex-col sm:flex-row items-center gap-3 sticky bottom-0 z-10">
          <button 
            onClick={onClose}
            className="w-full sm:flex-1 h-11 rounded-lg border border-red-200 text-red-500 text-[13px] font-bold hover:bg-red-50 dark:hover:bg-red-500/10 transition-all shadow-none"
          >
            Cancel Appointment
          </button>
          <button 
            className="w-full sm:flex-1 h-11 rounded-lg bg-primary text-primary-foreground text-[13px] font-bold hover:opacity-90 transition-all shadow-none"
          >
            Start Consultation
          </button>
        </div>
      </div>
    </div>
  );
}
