"use client";
import React, { useState, useEffect } from "react";
import { X, FlaskConical, AlertTriangle, ArrowRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";

export function SubmitResultsModal({ onClose, onConfirm, patient }) {
  const [notified, setNotified] = useState(false);

  // Disable body scroll when modal is active
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleConfirm = () => {
    if (notified) {
      onConfirm();
    }
  };

  const orderPatientStr = "ORD-88392 • Jane Doe";
  const departmentStr = "Hematology";

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-5">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-[6px]"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 16 }}
        className="relative bg-card w-full max-w-[460px] rounded-[5px] border border-border overflow-hidden shadow-none p-[20px] flex flex-col gap-[20px]"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-0.5">
            <h3 className="text-[16px] font-bold text-foreground leading-tight">
              Submit Results
            </h3>
            <span className="text-[12px] text-muted-foreground font-semibold">
              For pathologist approval
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border border-border rounded-[5px] text-muted-foreground hover:text-foreground hover:bg-muted/10 cursor-pointer transition-colors shadow-none outline-none"
          >
            <X size={15} />
          </button>
        </div>

        {/* Demographics Summary rows */}
        <div className="border border-border/80 rounded-[5px] overflow-hidden text-[12.5px]">
          {/* Row 1 */}
          <div className="flex justify-between items-center p-[12px] border-b border-border/60">
            <span className="text-muted-foreground font-semibold">Order & Patient</span>
            <span className="font-bold text-foreground">{orderPatientStr}</span>
          </div>
          {/* Row 2 */}
          <div className="flex justify-between items-center p-[12px] bg-muted/5">
            <span className="text-muted-foreground font-semibold">Department</span>
            <span className="font-bold text-foreground">{departmentStr}</span>
          </div>
        </div>

        {/* Tests List */}
        <div className="flex flex-col gap-2">
          <h4 className="text-[13px] font-bold text-foreground">
            Tests submitted (3)
          </h4>
          <div className="space-y-2.5 pl-0.5">
            <div className="flex items-center gap-2 text-[12.5px] text-muted-foreground font-semibold">
              <FlaskConical size={14} className="text-muted-foreground/70" />
              <span>Complete Blood Count (CBC)</span>
            </div>
            <div className="flex items-center gap-2 text-[12.5px] text-muted-foreground font-semibold">
              <FlaskConical size={14} className="text-muted-foreground/70" />
              <span>Comprehensive Metabolic Panel (CMP)</span>
            </div>
            <div className="flex items-center gap-2 text-[12.5px] text-muted-foreground font-semibold">
              <FlaskConical size={14} className="text-muted-foreground/70" />
              <span>Lipid Panel</span>
            </div>
          </div>
        </div>

        {/* Warning Notification block */}
        <div className="border border-red-200 dark:border-red-900/35 bg-red-500/5 dark:bg-red-950/10 rounded-[5px] p-[15px] flex flex-col gap-3">
          <div className="flex items-start gap-2.5">
            <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-0.5">
              <span className="text-[12.5px] font-bold text-red-600 dark:text-red-400">
                2 critical values detected
              </span>
              <span className="text-[11.5px] text-muted-foreground font-semibold leading-normal">
                Ensure ward has been notified before submitting.
              </span>
            </div>
          </div>

          {/* Verification Checkbox */}
          <div className="flex items-center gap-2.5 pt-1 border-t border-red-200/40 dark:border-red-900/10">
            <Checkbox
              checked={notified}
              onCheckedChange={setNotified}
              className="border-red-300 dark:border-red-800 text-red-600 focus-visible:ring-red-500"
            />
            <span
              className="text-[12.5px] font-bold text-foreground leading-none select-none cursor-pointer"
              onClick={() => setNotified(!notified)}
            >
              Ward has been notified
            </span>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            onClick={onClose}
            className="h-10 px-4 bg-card border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 font-bold text-[12.5px] rounded-[5px] hover:bg-red-500/5 transition-colors cursor-pointer shadow-none outline-none"
          >
            Cancel
          </button>
          <button
            disabled={!notified}
            onClick={handleConfirm}
            className="h-10 px-5 bg-primary text-primary-foreground border border-primary font-bold text-[12.5px] rounded-[5px] hover:bg-primary/95 transition-colors cursor-pointer shadow-none outline-none inline-flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed select-none"
          >
            <span>Submit for Approval</span>
            <ArrowRight size={13} className="stroke-[2.5]" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
