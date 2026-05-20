"use client";

import React, { useState, useEffect } from "react";
import { X, Search, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function OrderTestModal({ isOpen, onClose }) {
  const [priority, setPriority] = useState("STAT");

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
            className="absolute inset-0 bg-black/60 backdrop-blur-[6px]"
          />

          {/* Modal card content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 16 }}
            className="relative bg-card w-full max-w-[650px] rounded-lg shadow-none overflow-hidden border border-border max-h-[95vh] flex flex-col"
          >
            
            {/* Modal Header */}
            <div className="p-5 md:p-6 pb-4 sticky top-0 bg-card z-10 border-b border-border/10">
              <div className="flex flex-col gap-3 w-full">
                <div className="flex justify-between items-center">
                  <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Search & Add Tests</label>
                  <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1 md:hidden">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Search by test name, code, or panel..."
                    className="w-full h-11 pl-10 pr-10 bg-card border border-border rounded-lg text-[13px] font-medium outline-none focus:border-primary transition-all placeholder:text-muted-foreground"
                  />
                  <button onClick={onClose} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors hidden md:block">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-5 md:p-6 flex-1 overflow-y-auto no-scrollbar space-y-6">
              {/* Selected Tests */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Selected Items</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Complete Blood Count (CBC)",
                    "Iron Studies Panel",
                    "Reticulocyte Count"
                  ].map((test) => (
                    <div 
                      key={test}
                      className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 border border-border rounded-lg text-[12px] font-bold text-foreground transition-all hover:border-primary/30"
                    >
                      <span className="truncate max-w-[200px]">{test}</span>
                      <X className="w-3.5 h-3.5 cursor-pointer text-muted-foreground hover:text-red-500 transition-colors shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Priority Level */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Priority Level</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {["Routine", "Urgent", "STAT"].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={cn(
                        "h-11 rounded-lg border text-[13px] font-bold transition-all flex items-center justify-center gap-2",
                        priority === p 
                          ? p === "STAT" 
                            ? "border-red-500 bg-red-50/50 text-red-500 dark:bg-red-500/10"
                            : "border-primary bg-primary/5 text-primary"
                          : "border-border text-muted-foreground hover:bg-muted/50"
                      )}
                    >
                      {p === "STAT" && <Zap className="w-3.5 h-3.5" />}
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clinical Notes */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Clinical Notes / Indications</label>
                <textarea 
                  className="w-full h-24 p-4 bg-card border border-border rounded-lg text-[13px] font-medium text-foreground outline-none focus:border-primary transition-all resize-none leading-relaxed placeholder:text-muted-foreground"
                  defaultValue="Severe anemia (Hb 4.2). Please draw immediately. Check for reticulocyte response and iron stores."
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 md:p-6 bg-card border-t border-border flex flex-col sm:flex-row justify-end gap-3 sticky bottom-0 z-10">
              <button 
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-8 h-11 rounded-lg border border-red-200 text-red-500 text-[13px] font-bold hover:bg-red-50 dark:hover:bg-red-500/10 transition-all shadow-none order-2 sm:order-1"
              >
                Cancel
              </button>
              <button 
                type="button"
                className="w-full sm:w-auto px-8 h-11 rounded-lg bg-primary text-white text-[13px] font-bold hover:opacity-90 transition-all shadow-none order-1 sm:order-2"
              >
                Sign & Order
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
