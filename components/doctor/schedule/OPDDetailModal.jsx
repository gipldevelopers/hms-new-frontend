"use client";

import React, { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function OPDDetailModal({ isOpen, onClose, data, onActionCompleted }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState(null); // 'cancel' or 'consultation'

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

  const handleCancel = async () => {
    if (!data?.id) return;
    try {
      setLoading(true);
      setActionType("cancel");
      
      if (data.id.toString().startsWith("mock-")) {
        await new Promise((resolve) => setTimeout(resolve, 600));
        alert(`Simulated Cancel of Mock Appointment for ${data.patient}`);
      } else {
        const token = localStorage.getItem("authtoken");
        const res = await fetch(`/api/appointments/${data.id}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ status: "CANCELLED" })
        });
        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          throw new Error(json.message || "Failed to cancel appointment");
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
      alert("Cannot start consultation for a mock patient.");
      return;
    }
    router.push(`/doctor/opd/${data.id}`);
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
                  {data?.patient || "Patient Name"}
                </h2>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-lg text-[10px] font-bold tracking-wider bg-blue-50 dark:bg-blue-500/10 text-blue-600 border border-blue-100 dark:border-blue-500/20 uppercase">
                    OPD Slot
                  </span>
                  <span className={cn(
                    "px-3 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase border",
                    data?.status === "Cancelled" && "bg-rose-50 dark:bg-rose-500/10 text-rose-600 border-rose-100 dark:border-rose-500/20",
                    data?.status === "Completed" && "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border-emerald-100 dark:border-emerald-500/20",
                    data?.status !== "Cancelled" && data?.status !== "Completed" && "bg-blue-50 dark:bg-blue-500/10 text-blue-600 border-blue-100 dark:border-blue-500/20"
                  )}>
                    {data?.status || "Booked"}
                  </span>
                </div>
              </div>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 md:p-6 flex-1 overflow-y-auto no-scrollbar space-y-6">
              {/* Main Info Card */}
              <div className="bg-muted/30 border border-border rounded-lg p-4 grid grid-cols-2 sm:grid-cols-3 gap-4 items-center">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">DATE</span>
                  <span className="text-[13px] md:text-[14px] font-bold text-foreground">
                    {data?.dateTime
                      ? new Date(data.dateTime).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                      : "Oct 24, 2023"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">TIME</span>
                  <span className="text-[13px] md:text-[14px] font-bold text-foreground">{data?.time || "09:00 AM"}</span>
                </div>
                <div className="flex flex-col gap-1 sm:text-right col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">TOKEN</span>
                  <span className="text-[13px] md:text-[14px] font-bold text-primary">
                    {data?.rawAppointment?.displayToken || data?.rawAppointment?.tokenNumber || "A12"}
                  </span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">AGE / GENDER</p>
                  <p className="text-[13px] md:text-[14px] font-bold text-foreground">
                    {data?.rawAppointment?.patient?.age || "45"} yrs • {data?.rawAppointment?.patient?.gender || "Male"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">VISIT TYPE</p>
                  <p className="text-[13px] md:text-[14px] font-bold text-foreground">
                    {data?.rawAppointment?.visitType || "Follow-up"}
                  </p>
                </div>
              </div>

              {/* Symptoms Section */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">SYMPTOMS / REASON</p>
                <div className="p-4 bg-muted/30 border border-border rounded-lg">
                  <p className="text-[13px] font-medium text-muted-foreground leading-relaxed">
                    {data?.rawAppointment?.chiefComplaints || data?.rawAppointment?.reason || "General OPD checkup slot."}
                  </p>
                </div>
              </div>

              {/* Quick Vitals Section */}
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">QUICK VITALS</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "BP", value: data?.rawAppointment?.vitals?.systolic ? `${data.rawAppointment.vitals.systolic}/${data.rawAppointment.vitals.diastolic}` : "120/80" },
                    { label: "Heart Rate", value: data?.rawAppointment?.vitals?.heartRate ? `${data.rawAppointment.vitals.heartRate} bpm` : "78 bpm" },
                    { label: "Temperature", value: data?.rawAppointment?.vitals?.temperature ? `${data.rawAppointment.vitals.temperature}°F` : "98.6°F" }
                  ].map((vital) => (
                    <div key={vital.label} className="p-3 bg-card border border-border rounded-lg flex flex-col items-center gap-1">
                      <span className="text-[11px] font-medium text-muted-foreground">{vital.label}</span>
                      <span className="text-[13px] md:text-[14px] font-bold text-foreground">{vital.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 md:p-6 bg-card border-t border-border flex flex-col sm:flex-row items-center gap-3 sticky bottom-0 z-10">
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="w-full sm:flex-1 h-11 rounded-lg border border-red-200 text-red-500 text-[13px] font-bold hover:bg-red-50 dark:hover:bg-red-500/10 transition-all shadow-none flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading && actionType === "cancel" && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading && actionType === "cancel" ? "Cancelling..." : "Cancel Appointment"}
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
