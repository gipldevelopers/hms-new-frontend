"use client";

import React, { useEffect } from "react";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LeaveModal({ isOpen, onClose }) {
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
    <div 
      className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-card w-full max-w-[450px] rounded-lg shadow-none overflow-hidden animate-in zoom-in-95 duration-200 border border-border p-10 flex flex-col items-center text-center gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Bell Icon with Ring Effect */}
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
            <Bell className="w-8 h-8 text-primary" />
          </div>
          <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping opacity-20" />
        </div>

        <div className="space-y-3">
          <h2 className="text-[24px] font-bold text-foreground leading-tight">
            I am On Leave
          </h2>
          <p className="text-[14px] text-muted-foreground font-medium leading-relaxed max-w-[320px]">
            Doctor is currently unavailable due to approved leave. Appointments and consultations are unavailable during your leave period.
          </p>
        </div>

      </div>
    </div>
  );
}
