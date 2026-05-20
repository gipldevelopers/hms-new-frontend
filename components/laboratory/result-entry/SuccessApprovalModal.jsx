"use client";
import React, { useEffect } from "react";
import { X, Check } from "lucide-react";
import { motion } from "framer-motion";

export function SuccessApprovalModal({ onClose }) {
  // Disable body scroll when modal is active
  useEffect(() => {
    document.body.style.overflow = "hidden";

    // Auto-close after 2.5 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 2500);

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "unset";
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[1010] flex items-center justify-center p-5">
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
        className="relative bg-card w-full max-w-[360px] rounded-[5px] border border-border overflow-hidden shadow-none p-[30px] flex flex-col items-center justify-center text-center gap-4"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-[15px] right-[15px] p-1 text-muted-foreground hover:text-foreground hover:bg-muted/10 rounded-[5px] border border-border cursor-pointer transition-colors shadow-none outline-none"
        >
          <X size={14} />
        </button>

        {/* Success Icon */}
        <div className="w-[50px] h-[50px] bg-[#10B981] text-white rounded-full flex items-center justify-center shrink-0 mt-2 select-none shadow-none">
          <Check size={24} className="stroke-[3]" />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1.5 mt-1 select-none">
          <h3 className="text-[16px] font-bold text-foreground leading-tight">
            Submitted for Approval
          </h3>
          <p className="text-[12.5px] text-[#3B82F6] dark:text-[#60A5FA] font-semibold leading-normal">
            Sent to: Dr. A. Sharma (Pathologist)
          </p>
        </div>
      </motion.div>
    </div>
  );
}
