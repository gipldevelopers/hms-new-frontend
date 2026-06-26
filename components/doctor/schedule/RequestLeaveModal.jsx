"use client";

import React, { useEffect, useState } from "react";
import { X, Calendar, Clock, FileText, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RequestLeaveModal({ isOpen, onClose, onLeaveAdded }) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [startTime, setStartTime] = useState("09:00 AM");
  const [endTime, setEndTime] = useState("05:00 PM");
  const [notes, setNotes] = useState("");
  const [department, setDepartment] = useState("Cardiology");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date) {
      setError("Leave Date is required.");
      return;
    }
    if (!startTime || startTime.trim() === "") {
      setError("Start Time is required.");
      return;
    }
    if (startTime.length > 50) {
      setError("Start Time must be 50 characters or less.");
      return;
    }
    if (!endTime || endTime.trim() === "") {
      setError("End Time is required.");
      return;
    }
    if (endTime.length > 50) {
      setError("End Time must be 50 characters or less.");
      return;
    }
    if (!department || department.trim() === "") {
      setError("Department is required.");
      return;
    }
    if (department.length > 100) {
      setError("Department must be 100 characters or less.");
      return;
    }
    if (notes && notes.length > 500) {
      setError("Reason / Notes must be 500 characters or less.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("authtoken");
      const res = await fetch("/api/doctor-opd/schedule/leave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          date: new Date(date).toISOString(),
          startTime,
          endTime,
          notes,
          department
        })
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.message || "Failed to submit leave request.");
      }

      // Reset fields
      setNotes("");
      setStartTime("09:00 AM");
      setEndTime("05:00 PM");

      if (onLeaveAdded) onLeaveAdded();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
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
            className="relative bg-card w-full max-w-[480px] rounded-lg shadow-xl overflow-hidden border border-border p-6 flex flex-col gap-4"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-2 border-b border-border/60">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <h2 className="text-[18px] font-bold text-foreground">
                  Request Leave
                </h2>
              </div>
              <button 
                onClick={onClose} 
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
                disabled={loading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 text-rose-600 rounded-lg text-[13px] font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Date Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Leave Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground pointer-events-none" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full h-10 pl-10 pr-4 bg-card border border-border rounded-lg text-[13px] font-medium outline-none focus:border-primary transition-all shadow-none"
                  />
                </div>
              </div>

              {/* Time Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Start Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground pointer-events-none" />
                    <input
                      type="text"
                      placeholder="e.g. 09:00 AM"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      required
                      className="w-full h-10 pl-10 pr-4 bg-card border border-border rounded-lg text-[13px] font-medium outline-none focus:border-primary transition-all shadow-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">End Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground pointer-events-none" />
                    <input
                      type="text"
                      placeholder="e.g. 05:00 PM"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      required
                      className="w-full h-10 pl-10 pr-4 bg-card border border-border rounded-lg text-[13px] font-medium outline-none focus:border-primary transition-all shadow-none"
                    />
                  </div>
                </div>
              </div>

              {/* Department Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Department</label>
                <input
                  type="text"
                  placeholder="e.g. Cardiology"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                  className="w-full h-10 px-4 bg-card border border-border rounded-lg text-[13px] font-medium outline-none focus:border-primary transition-all shadow-none"
                />
              </div>

              {/* Notes / Reason */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Reason / Notes</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-4.5 h-4.5 text-muted-foreground pointer-events-none" />
                  <textarea
                    placeholder="Provide details about your leave..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-[13px] font-medium outline-none focus:border-primary transition-all shadow-none resize-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-4 h-10 bg-card border border-border text-[13px] font-bold rounded-lg hover:bg-muted transition-all outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 h-10 bg-primary text-primary-foreground text-[13px] font-bold rounded-lg hover:bg-primary/95 transition-all outline-none flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
