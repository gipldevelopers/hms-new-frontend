"use client";
import React from "react";
import { X, AlertTriangle, Check } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function InitiateDischargeDialog({ open, onOpenChange, patientData, onGoToPayment }) {
  const patientName = patientData?.name || "John Doe";

  const netPayable = patientData?.billing?.netPayable || 0;
  const advancePaid = patientData?.billing?.advancePaid || 0;
  const balanceDue = patientData?.billing?.balanceDue || 0;

  const isAllCleared = balanceDue <= 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[460px] w-[95vw] p-[20px] border border-[#E7E8EB] rounded-[5px] bg-white dark:border-white/10 dark:bg-[#101935] flex flex-col gap-[20px] shadow-none">
        {isAllCleared ? (
          <>
            <DialogTitle className="sr-only">Discharge Complete</DialogTitle>
            
            {/* Close Button */}
            <button
              onClick={() => onOpenChange(false)}
              className="absolute top-[20px] right-[20px] flex items-center justify-center w-[32px] h-[32px] rounded-[5px] text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Checkmark Icon */}
            <div className="flex flex-col items-center justify-center text-center gap-[20px] pt-[20px] pb-[10px]">
              <div className="w-[64px] h-[64px] rounded-full bg-[#E6F4EA] dark:bg-green-950/30 flex items-center justify-center text-[#137333] dark:text-[#81C995]">
                <Check className="h-8 w-8 stroke-[3]" />
              </div>

              {/* Title & Description */}
              <div className="space-y-[8px]">
                <h2 className="text-[18px] font-bold text-slate-800 dark:text-white">
                  Discharge Complete
                </h2>
                <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-[360px] mx-auto">
                  All dues are cleared and the final bill is locked. The patient has been successfully discharged.
                </p>
              </div>

              {/* Highlight Box */}
              <div className="rounded-[5px] border border-[#CEEAD6] bg-[#E6F4EA]/10 dark:border-green-900/30 dark:bg-green-950/10 px-[24px] py-[12px] min-w-[200px] flex flex-col items-center justify-center gap-[4px] mt-[10px]">
                <span className="text-[10px] font-bold text-[#137333] dark:text-[#81C995] tracking-wider">
                  Final Amount Paid
                </span>
                <span className="text-[18px] font-bold text-[#137333] dark:text-[#81C995]">
                  ₹{netPayable.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            <DialogTitle className="sr-only">Initiate Discharge</DialogTitle>
            
            {/* Close Button */}
            <button
              onClick={() => onOpenChange(false)}
              className="absolute top-[20px] right-[20px] flex items-center justify-center w-[32px] h-[32px] rounded-[5px] text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <h2 className="text-[16px] font-bold text-[#1D2B8A] dark:text-white pr-[40px]">
              Initiate Discharge
            </h2>

            {/* Billing Info Card */}
            <div className="rounded-[5px] border border-[#E7E8EB] dark:border-white/10 p-[20px] space-y-[16px] bg-white dark:bg-[#101935]">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-slate-500 dark:text-slate-400 font-medium">Patient</span>
                <span className="text-[13px] text-slate-800 dark:text-white font-bold">{patientName}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-slate-500 dark:text-slate-400 font-medium">Total Bill</span>
                <span className="text-[13px] text-slate-800 dark:text-white font-bold">₹{netPayable.toFixed(2)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-slate-500 dark:text-slate-400 font-medium">Paid Amount</span>
                <span className="text-[13px] text-[#137333] dark:text-[#81C995] font-bold">₹{advancePaid.toFixed(2)}</span>
              </div>
              
              <div className="border-t border-[#E7E8EB] dark:border-white/10 my-[4px]" />
              
              <div className="flex items-center justify-between pt-[4px]">
                <span className="text-[13px] text-slate-800 dark:text-white font-bold">Balance Due</span>
                <span className="text-[15px] text-[#1D2B8A] dark:text-[#9EA8FF] font-bold">₹{balanceDue.toFixed(2)}</span>
              </div>
            </div>

            {/* Action Required Alert Box */}
            <div className="rounded-[5px] bg-[#FEF7E0] border border-[#FEEFC3] p-[16px] flex items-start gap-[12px]">
              <AlertTriangle className="h-5 w-5 text-[#B06000] shrink-0 mt-[2px]" />
              <div className="space-y-[4px]">
                <p className="text-[13px] font-bold text-[#B06000]">Action Required</p>
                <p className="text-[12px] text-[#B06000] leading-relaxed">
                  Pending dues must be cleared before discharge.
                </p>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-[12px] pt-[4px]">
              <button
                onClick={() => onOpenChange(false)}
                className="h-[38px] px-[20px] rounded-[5px] border border-slate-300 bg-white text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition shadow-none dark:bg-[#101935] dark:border-white/10 dark:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onOpenChange(false);
                  if (onGoToPayment) {
                    onGoToPayment();
                  }
                }}
                className="h-[38px] px-[20px] rounded-[5px] bg-[#1D2B8A] text-[13px] font-semibold text-white hover:bg-[#1D2B8A]/90 transition flex items-center justify-center gap-[8px] shadow-none"
              >
                Go to Collect Payment
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
