"use client";

import React, { useEffect, useState } from "react";
import { X, UserPlus, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function RequestDischargeModal({ isOpen, onClose, onSuccess }) {
  const [admissions, setAdmissions] = useState([]);
  const [selectedAdmissionId, setSelectedAdmissionId] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleEsc = (e) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleEsc);
      
      // Fetch active admissions (In Progress)
      const fetchActiveAdmissions = async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem("authtoken");
          const res = await fetch("/api/admissions/overview?status=In Progress", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (!res.ok) throw new Error("Failed to fetch active admissions");
          const data = await res.json();
          setAdmissions(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error(err);
          setError("Error loading admitted patients.");
        } finally {
          setLoading(false);
        }
      };

      fetchActiveAdmissions();

      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleEsc);
      };
    }
  }, [isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAdmissionId) return;

    try {
      setSubmitting(true);
      setError(null);
      const token = localStorage.getItem("authtoken");
      const res = await fetch(`/api/admissions/${selectedAdmissionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status: "Pending",
          dischargeNotes: notes // Optional notes if the schema/backend allows or just for local reference
        })
      });

      if (!res.ok) throw new Error("Failed to request discharge");
      
      onSuccess();
      onClose();
      // Reset form
      setSelectedAdmissionId("");
      setNotes("");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update admission status.");
    } finally {
      setSubmitting(false);
    }
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
            className="relative bg-card w-full max-w-[500px] rounded-lg shadow-none overflow-hidden border border-border max-h-[90vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="p-5 md:p-6 pb-4 flex justify-between items-start sticky top-0 bg-card z-10 border-b border-border/10">
              <div className="space-y-1">
                <h2 className="text-[18px] md:text-[20px] font-bold text-foreground leading-tight">
                  Request Patient Discharge
                </h2>
                <p className="text-[12px] text-muted-foreground">
                  Select an active admitted patient to initiate their discharge request.
                </p>
              </div>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto no-scrollbar p-5 md:p-6 space-y-5">
              {error && (
                <div className="p-3.5 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 text-[12px] font-medium rounded-lg">
                  {error}
                </div>
              )}

              {/* Select Admitted Patient */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-muted-foreground tracking-wider uppercase">
                  Select Patient
                </label>
                {loading ? (
                  <div className="h-11 border border-border rounded-lg bg-muted/20 animate-pulse flex items-center px-3 text-[13px] text-muted-foreground">
                    Loading admitted patients...
                  </div>
                ) : admissions.length === 0 ? (
                  <div className="p-4 border border-border border-dashed rounded-lg text-center text-[13px] text-muted-foreground">
                    No active admitted patients found.
                  </div>
                ) : (
                  <select
                    required
                    value={selectedAdmissionId}
                    onChange={(e) => setSelectedAdmissionId(e.target.value)}
                    className="w-full h-11 px-3 bg-card border border-border rounded-lg text-[13px] font-medium outline-none focus:border-primary transition-all text-foreground"
                  >
                    <option value="">-- Choose Admitted Patient --</option>
                    {admissions.map((adm) => (
                      <option key={adm.id} value={adm.id}>
                        {adm.patient?.name || "Unknown"} (Ward: {adm.ward?.name || "N/A"} - Bed: {adm.bed?.label || "N/A"})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Discharge Notes */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-muted-foreground tracking-wider uppercase">
                  Discharge Summary / Notes
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe patient recovery status, discharge instructions, or follow-up details..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3.5 bg-card border border-border rounded-lg text-[13px] font-medium outline-none focus:border-primary transition-all text-foreground resize-none placeholder:text-muted-foreground"
                />
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-border/10 flex items-center justify-end gap-3 bg-card">
                <button
                  type="button"
                  onClick={onClose}
                  className="h-10 px-5 rounded-lg border border-border text-foreground text-[13px] font-bold hover:bg-muted transition-all shadow-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !selectedAdmissionId}
                  className="h-10 px-5 rounded-lg bg-[#2E37A4] text-white text-[13px] font-bold hover:opacity-90 transition-all shadow-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitting ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
