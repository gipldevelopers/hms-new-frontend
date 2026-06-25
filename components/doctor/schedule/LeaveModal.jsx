"use client";

import React, { useEffect } from "react";
import { Bell, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function LeaveModal({ isOpen, onClose, data }) {
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          />

          {/* Modal card content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 16 }}
            className="relative bg-card w-full max-w-[450px] rounded-lg shadow-none overflow-hidden border border-border p-10 flex flex-col items-center text-center gap-6"
          >
            {/* Top Right Close Icon */}
            <button 
              onClick={onClose} 
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
            {/* Bell Icon with Ring Effect */}
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                <Bell className="w-8 h-8 text-primary" />
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping opacity-20" />
            </div>

            <div className="space-y-3 w-full">
              <h2 className="text-[24px] font-bold text-foreground leading-tight">
                I am On Leave
              </h2>
              <p className="text-[14px] text-muted-foreground font-medium leading-relaxed max-w-[320px] mx-auto">
                Doctor is currently unavailable due to approved leave. Appointments and consultations are unavailable during your leave period.
              </p>
              {data && (
                <div className="bg-muted/30 border border-border rounded-lg p-4 space-y-3 text-left w-full mt-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">DATE</span>
                    <span className="text-[13px] font-bold text-foreground">
                      {data.dateTime ? new Date(data.dateTime).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">TIME</span>
                    <span className="text-[13px] font-bold text-foreground">{data.time || "All Day"}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">REASON / NOTES</span>
                    <span className="text-[13px] font-medium text-muted-foreground leading-snug">{data.patient || "Approved Leave"}</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
