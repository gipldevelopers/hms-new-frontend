"use client";
import React, { useEffect } from "react";
import { X, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export function AcknowledgeCriticalModal({ isOpen, onClose, onConfirm, alertItem }) {
  // Disable body scroll when modal is active and handle Escape key close
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen || !alertItem) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center select-none">
      {/* Backdrop overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-[#090D1A]/40 backdrop-blur-[4px]"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="relative bg-card w-full max-w-[450px] border border-border rounded-[5px] flex flex-col overflow-hidden shadow-none mx-4 z-10"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-[20px] border-b border-border select-none">
          <h3 className="text-[14px] md: leading-none">
            Acknowledge Critical Value
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted/10 rounded-[5px] text-muted-foreground hover:text-foreground border border-border cursor-pointer transition-colors shadow-none outline-none"
          >
            <X size={14} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-[20px] flex flex-col gap-[20px]">
          {/* Critical Value Summary Box */}
          <div className="bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 rounded-[5px] p-[15px] flex flex-col gap-[10px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[8px]">
                <AlertCircle size={15} className="text-red-600 dark:text-red-400 shrink-0" />
                <span className="text-[13.5px] font-bold text-red-600 dark:text-red-400">
                  {alertItem.testName}
                </span>
              </div>
              <span className="text-[13.5px] font-bold text-red-600 dark:text-red-400">
                {alertItem.value}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11.5px] text-red-600/80 dark:text-red-400/80 font-bold">
              <span>Patient: {alertItem.patientName}</span>
              <span>{alertItem.uhid}</span>
            </div>
          </div>

          {/* Warning text */}
          <p className="text-[12.5px] leading-relaxed text-muted-foreground font-semibold select-none">
            By acknowledging, you confirm that you have reviewed this critical result and take full clinical responsibility for the subsequent patient care.
          </p>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 p-[20px] border-t border-border bg-muted/5">
          <button
            onClick={onClose}
            className="h-10 px-4 bg-card border border-red-500/20 text-red-600 dark:text-red-400 font-bold text-[12.5px] rounded-[5px] hover:bg-red-500/5 transition-colors cursor-pointer shadow-none outline-none"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="h-10 px-5 bg-primary text-primary-foreground border border-primary font-bold text-[12.5px] rounded-[5px] hover:bg-primary/95 transition-colors cursor-pointer shadow-none outline-none"
          >
            Acknowledge
          </button>
        </div>
      </motion.div>
    </div>
  );
}
