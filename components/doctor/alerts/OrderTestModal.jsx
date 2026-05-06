"use client";

import React, { useState, useEffect } from "react";
import { X, Search, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#101935] w-full max-w-[650px] rounded-[5px] shadow-none overflow-hidden animate-in zoom-in-95 duration-200 border border-border">
        
        {/* Modal Header */}
        <div className="p-5 pb-0 flex justify-between items-start">
          <div className="flex flex-col gap-1 w-full">
            <label className="text-[12px] font-bold text-gray-700 dark:text-gray-300">Search & Add Tests</label>
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by test name, code, or panel..."
                className="w-full h-11 pl-10 pr-4 bg-white dark:bg-white/5 border border-border rounded-[5px] text-[13px] outline-none focus:border-primary transition-all"
              />
            </div>
          </div>
        </div>

        <div className="p-5 space-y-6">
          {/* Selected Tests */}
          <div className="flex flex-wrap gap-2">
            {[
              "Complete Blood Count (CBC)",
              "Iron Studies Panel",
              "Reticulocyte Count"
            ].map((test) => (
              <div 
                key={test}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#F1F5F9] dark:bg-white/5 border border-border rounded-[5px] text-[12px] font-bold text-gray-700 dark:text-gray-300"
              >
                {test}
                <X className="w-3.5 h-3.5 cursor-pointer text-gray-400 hover:text-red-500 transition-colors" />
              </div>
            ))}
          </div>

          {/* Priority Level */}
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-gray-700 dark:text-gray-300">Priority Level</label>
            <div className="flex gap-3">
              {["Routine", "Urgent", "STAT"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={cn(
                    "flex-1 h-11 rounded-[5px] border text-[13px] font-bold transition-all flex items-center justify-center gap-2",
                    priority === p 
                      ? p === "STAT" 
                        ? "border-red-500 bg-red-50/50 text-red-500 dark:bg-red-500/10"
                        : "border-primary bg-primary/5 text-primary"
                      : "border-border text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
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
            <label className="text-[12px] font-bold text-gray-700 dark:text-gray-300">Clinical Notes / Indications</label>
            <textarea 
              className="w-full h-24 p-4 bg-white dark:bg-white/5 border border-border rounded-[5px] text-[13px] font-medium text-gray-600 dark:text-gray-400 outline-none focus:border-primary transition-all resize-none leading-relaxed"
              defaultValue="Severe anemia (Hb 4.2). Please draw immediately. Check for reticulocyte response and iron stores. Patient is currently in Ward 3B."
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 bg-gray-50/50 dark:bg-white/[0.02] border-t border-border flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 h-10 rounded-[5px] border border-red-200 text-red-500 text-[13px] font-bold hover:bg-red-50 transition-all shadow-none"
          >
            Cancel
          </button>
          <button 
            className="px-6 h-10 rounded-[5px] bg-[#2E37A4] text-white text-[13px] font-bold hover:opacity-90 transition-all shadow-none"
          >
            Sign & Order
          </button>
        </div>
      </div>
    </div>
  );
}
