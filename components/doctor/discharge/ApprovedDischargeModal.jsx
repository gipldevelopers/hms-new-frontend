"use client";

import React, { useEffect } from "react";
import { X, Check, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function ApprovedDischargeModal({ isOpen, onClose, data }) {
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

  const checklist = [
    "Final Vitals Checked",
    "Medications Explained",
    "Reports Attached"
  ];

  const handleDownload = () => {
    if (!data) return;
    
    const age = data.rawAdmission?.patient?.age || "32";
    const gender = data.rawAdmission?.patient?.gender || "Female";
    const uhid = data.rawAdmission?.patientId?.slice(0, 8) || "UH10295";
    const diagnosis = data.diagnosis || data.reason || "Appendicitis";
    const date = data.date || (data.rawAdmission?.admissionDate ? new Date(data.rawAdmission.admissionDate).toLocaleDateString() : "Oct 12, 2023");
    const dischargeDate = data.rawAdmission?.dischargeDate ? new Date(data.rawAdmission.dischargeDate).toLocaleString() : "Oct 16, 2023, 10:45 AM";
    const doctor = data.requestedBy || "Dr. Patel";

    const content = `==================================================
        PATIENT DISCHARGE SUMMARY (APPROVED)
==================================================
Patient Name:    ${data.patient || "Alice Smith"}
Age/Gender:      ${age} yrs • ${gender}
UHID:            ${uhid}
Ward / Bed:      ${data.ward || "ICU - A03"}
Diagnosis:       ${diagnosis}
Admission Date:  ${date}
Discharged On:   ${dischargeDate}
Approved By:     ${doctor}
Status:          Discharged (Recovered)

Discharge Checklist:
- Final Vitals Checked: Checked
- Medications Explained: Checked
- Reports Attached: Checked

Clinical Discharge Notes:
Post-operative recovery excellent. Patient is fit for discharge with oral antibiotics.
Follow-up Advice: Follow up in 1 week.
==================================================
`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `discharge_summary_${(data.patient || "patient").replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formattedDischargeDate = data?.rawAdmission?.dischargeDate
    ? new Date(data.rawAdmission.dischargeDate).toLocaleDateString()
    : "Oct 16, 2023";
  const formattedDischargeTime = data?.rawAdmission?.dischargeDate
    ? new Date(data.rawAdmission.dischargeDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : "10:45 AM";

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
            className="relative bg-card w-full max-w-[600px] rounded-lg shadow-none overflow-hidden border border-border max-h-[95vh] flex flex-col"
          >
            
            {/* Modal Header */}
            <div className="p-5 md:p-6 pb-4 flex justify-between items-start sticky top-0 bg-card z-10 border-b border-border/10">
              <div className="space-y-2">
                <h2 className="text-[20px] md:text-[24px] font-bold text-foreground leading-tight">
                  {data?.patient || "Alice Smith"}
                </h2>
                <span className="inline-block px-3 py-1 rounded-lg text-[10px] font-bold tracking-wider bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border border-emerald-100 dark:border-emerald-500/20 uppercase">
                  Approved
                </span>
              </div>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 md:p-6 flex-1 overflow-y-auto no-scrollbar space-y-6">
              {/* Success Banner */}
              <div className="bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10 p-4 rounded-lg flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 shrink-0">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div className="flex flex-col min-w-0">
                  <p className="text-[13px] md:text-[14px] font-bold text-emerald-700 dark:text-emerald-400 truncate">
                    Discharge Approved by {data?.requestedBy || "Dr. Patel"}
                  </p>
                  <p className="text-[11px] md:text-[12px] font-medium text-emerald-600/80 dark:text-emerald-400/60 truncate">
                    on {formattedDischargeDate} at {formattedDischargeTime}
                  </p>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">AGE / GENDER</p>
                  <p className="text-[13px] md:text-[14px] font-bold text-foreground leading-tight">
                    {data?.rawAdmission?.patient?.age || "32"} yrs • {data?.rawAdmission?.patient?.gender || "Female"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">UHID</p>
                  <p className="text-[13px] md:text-[14px] font-bold text-foreground leading-tight">
                    {data?.rawAdmission?.patientId?.slice(0, 8) || "UH10295"}
                  </p>
                </div>
                <div className="space-y-1 col-span-2 sm:col-span-1">
                  <p className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">WARD / BED</p>
                  <p className="text-[13px] md:text-[14px] font-bold text-foreground leading-tight">{data?.ward || "ICU - A03"}</p>
                </div>
              </div>

              {/* Summary Card Grid */}
              <div className="bg-muted/30 border border-border rounded-lg p-4 md:p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">DIAGNOSIS</p>
                  <p className="text-[13px] md:text-[14px] font-bold text-foreground leading-tight">{data?.diagnosis || "Appendicitis"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">STATUS</p>
                  <p className="text-[13px] md:text-[14px] font-bold text-foreground leading-tight">Recovered</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">VITALS</p>
                  <p className="text-[13px] md:text-[14px] font-bold text-foreground leading-tight">Normal</p>
                </div>
              </div>

              {/* Discharge Notes */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">DISCHARGE NOTES</p>
                <div className="p-4 bg-muted/30 border border-border rounded-lg">
                  <p className="text-[13px] font-medium text-muted-foreground leading-relaxed">
                    Post-operative recovery excellent. Patient is fit for discharge with oral antibiotics.
                  </p>
                </div>
              </div>

              {/* Discharge Checklist */}
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">DISCHARGE CHECKLIST</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {checklist.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg">
                      <div className="w-5 h-5 rounded-[4px] bg-primary flex items-center justify-center text-white shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className="text-[12px] md:text-[13px] font-bold text-foreground truncate">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-5 md:p-6 bg-card border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-0 z-10">
              <button 
                type="button"
                className="w-full sm:w-auto text-[13px] font-bold text-primary hover:underline decoration-2 underline-offset-4 text-center sm:text-left"
              >
                View Full Medical Record
              </button>
              <button 
                type="button"
                onClick={handleDownload}
                className="w-full sm:w-auto h-11 px-6 rounded-lg bg-[#2E37A4] text-white text-[13px] font-bold hover:opacity-90 transition-all shadow-none"
              >
                Download Summary
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
