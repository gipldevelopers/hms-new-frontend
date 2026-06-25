"use client";

import React, { useEffect, useState } from "react";
import { X, Calendar, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function SurgeryDetailModal({ isOpen, onClose, data, onActionCompleted }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState(null); // 'complete' or 'consultation'

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

  const handleCompleteSurgery = async () => {
    if (!data?.id) return;
    try {
      setLoading(true);
      setActionType("complete");
      
      if (data.id.toString().startsWith("mock-")) {
        await new Promise((resolve) => setTimeout(resolve, 600));
        alert(`Simulated Mark Completed of Mock Surgery/Admission for ${data.patient}`);
      } else {
        const token = localStorage.getItem("authtoken");
        const res = await fetch(`/api/admissions/${data.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ status: "Completed" })
        });
        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          throw new Error(json.error || json.message || "Failed to update surgery/admission status");
        }
      }
      
      if (onActionCompleted) onActionCompleted();
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
      setActionType(null);
    }
  };

  const handleStartConsultation = () => {
    if (!data?.id) return;
    if (data.id.toString().startsWith("mock-")) {
      alert("Cannot view chart for a mock patient.");
      return;
    }
    router.push(`/doctor/ipd/${data.id}`);
  };

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
            className="relative bg-card w-full max-w-[500px] rounded-lg shadow-none overflow-hidden border border-border max-h-[95vh] flex flex-col"
          >
            
            {/* Modal Header */}
            <div className="p-5 md:p-6 pb-4 flex justify-between items-start sticky top-0 bg-card z-10 border-b border-border/10">
              <div className="space-y-2">
                <h2 className="text-[20px] md:text-[24px] font-bold text-foreground leading-tight">
                  {data?.patient && data.patient !== "-" ? data.patient : "Surgery Slot"}
                </h2>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-lg text-[10px] font-bold tracking-wider bg-rose-50 dark:bg-rose-500/10 text-rose-600 border border-rose-100 dark:border-rose-500/20 uppercase">
                    Surgery
                  </span>
                  <span className={cn(
                    "px-3 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase border",
                    data?.status === "Discharge Pending" && "bg-amber-50 dark:bg-amber-500/10 text-amber-600 border-amber-100 dark:border-amber-500/20",
                    data?.status === "Discharged" && "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border-emerald-100 dark:border-emerald-500/20",
                    data?.status !== "Discharged" && data?.status !== "Discharge Pending" && "bg-blue-50 dark:bg-blue-500/10 text-blue-600 border-blue-100 dark:border-blue-500/20"
                  )}>
                    {data?.status || "Confirmed"}
                  </span>
                </div>
              </div>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 md:p-6 flex-1 overflow-y-auto no-scrollbar space-y-6">
              {/* Info Card */}
              <div className="bg-muted/30 border border-border rounded-lg overflow-hidden">
                <div className="p-4 flex items-center gap-4 border-b border-border/60">
                  <div className="w-9 h-9 rounded-lg bg-card border border-border flex items-center justify-center text-muted-foreground shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Date</span>
                    <span className="text-[13px] md:text-[14px] font-bold text-foreground truncate">
                      {data?.dateTime
                        ? new Date(data.dateTime).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "short", day: "numeric" })
                        : "Tuesday, Oct 24, 2023"}
                    </span>
                  </div>
                </div>
                <div className="p-4 flex items-center gap-4">
                  <div className="w-9 h-9 rounded-lg bg-card border border-border flex items-center justify-center text-muted-foreground shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Time</span>
                    <span className="text-[13px] md:text-[14px] font-bold text-foreground truncate">{data?.time || "9:00 AM – 11:00 AM"}</span>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">PATIENT INFO</p>
                  <p className="text-[13px] md:text-[14px] font-bold text-foreground leading-tight">
                    {data?.rawAdmission?.patient?.age || "45"} yrs • {data?.rawAdmission?.patient?.gender || "Male"}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">UHID</p>
                  <p className="text-[13px] md:text-[14px] font-bold text-foreground leading-tight">
                    {data?.rawAdmission?.patientId?.slice(0, 8) || "10294"}
                  </p>
                </div>
                <div className="col-span-1 sm:col-span-2 space-y-1.5">
                  <p className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">DIAGNOSIS / REASON</p>
                  <p className="text-[13px] md:text-[14px] font-bold text-foreground leading-tight">{data?.diagnosis || data?.rawAdmission?.reason || "Acute Appendicitis"}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">PROCEDURE</p>
                  <p className="text-[13px] md:text-[14px] font-bold text-foreground leading-tight">{data?.rawAdmission?.procedure || "Appendectomy"}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">LOCATION</p>
                  <p className="text-[13px] md:text-[14px] font-bold text-foreground leading-tight text-primary">
                    {data?.ward || (data?.rawAdmission?.ward ? `${data.rawAdmission.ward.name} - ${data.rawAdmission.bed?.label || "Bed"}` : "Operating Room 2")}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 md:p-6 bg-card border-t border-border flex flex-col sm:flex-row items-center gap-3 sticky bottom-0 z-10">
              <button 
                type="button"
                onClick={handleCompleteSurgery}
                disabled={loading}
                className="w-full sm:flex-1 h-11 rounded-lg border border-border bg-card text-foreground text-[13px] font-bold hover:bg-muted transition-all shadow-none flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading && actionType === "complete" && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading && actionType === "complete" ? "Completing..." : "Mark Completed"}
              </button>
              <button 
                type="button"
                onClick={handleStartConsultation}
                disabled={loading}
                className="w-full sm:flex-1 h-11 rounded-lg bg-primary text-primary-foreground text-[13px] font-bold hover:opacity-90 transition-all shadow-none flex items-center justify-center gap-2 disabled:opacity-50"
              >
                Start Consultation
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
