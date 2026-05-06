"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  LogOut,
  Plus,
  ArrowRight,
  Check,
  Calendar,
  Clock,
  Sparkles,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function CustomSelect({ value, onChange, options, placeholder, minWidth = "100%" }) {
  const selected = options.find((o) => o.value === value);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="h-11 px-4 bg-muted/50 border border-border rounded-lg flex items-center justify-between gap-2 text-[13px] font-bold outline-none transition-all shadow-none text-foreground hover:bg-muted"
          style={{ minWidth }}
        >
          <span className="truncate">{selected ? selected.label : placeholder}</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[130px] border border-border bg-card p-1 rounded-lg shadow-none z-50">
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-lg text-[13px] font-medium px-3 py-2 cursor-pointer transition-colors outline-none ",
              value === opt.value
                ? "bg-primary/5 text-primary font-bold"
                : "text-foreground hover:bg-muted"
            )}
          >
            {opt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function PatientTransferPage() {
  const router = useRouter();
  const { id } = useParams();

  const [facility, setFacility] = useState("Mercy General (Internal)");
  const [ward, setWard] = useState("ICU - Level 3");
  const [reason, setReason] = useState("Escalation of Care");
  const [transferDateTime, setTransferDateTime] = useState("Today, 14:30");
  const [nursingNotes, setNursingNotes] = useState(
    "Pt requires strict I/O monitoring. PIV right forearm, intact. Foley catheter patent, output 400ml/shift. Family aware of transfer to ICU."
  );

  const [meds, setMeds] = useState([
    { id: 1, name: "Ceftriaxone 1g IV", last: "08:00", checked: true },
    { id: 2, name: "Heparin 5000U SC", last: "08:00", checked: true }
  ]);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmedCheckbox, setConfirmedCheckbox] = useState(false);

  const toggleMed = (id) => {
    setMeds(meds.map(m => m.id === id ? { ...m, checked: !m.checked } : m));
  };

  const handleInitiateTransfer = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmAndTransfer = () => {
    if (!confirmedCheckbox) return;
    alert("Transfer successfully initiated for the patient!");
    router.push("/staff/admissions");
  };

  return (
    <div className="p-[20px] bg-background min-h-screen flex flex-col space-y-[20px] transition-colors duration-300 font-sans pb-20 ">
      
      {/* ── Header Area ── */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 ">
        <div>
          <h1 className="text-[20px] font-bold text-foreground tracking-tight leading-none ">
            Patient Transfers
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="h-11 px-5 border border-border bg-card hover:bg-muted text-foreground rounded-lg text-[13px] font-bold flex items-center justify-center transition-all shadow-none outline-none"
          >
            Cancel
          </button>
          <button
            onClick={handleInitiateTransfer}
            className="h-11 px-5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg text-[13px] transition-all flex items-center justify-center gap-1.5 shadow-none outline-none "
          >
            <span>Initiate Transfer</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Patient Profile Banner ── */}
      <div className="p-5 bg-card border border-border rounded-lg shadow-none flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/10 overflow-hidden shrink-0">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100"
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[17px] font-bold text-foreground leading-tight">
                James Wilson
              </h2>
              <span className="text-[12px] text-muted-foreground font-medium">62 yrs • Male</span>
              <span className="bg-destructive/10 border border-destructive/20 text-destructive text-[10px] font-bold px-2 py-0.5 rounded-lg tracking-wider ">
                CRITICAL
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-y-2 gap-x-4 mt-3 ">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider leading-none">
                  UHID
                </p>
                <p className="text-[13px] font-bold text-foreground mt-1 leading-tight ">
                  UHID-839211
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider leading-none">
                  Bed No.
                </p>
                <p className="text-[13px] font-bold text-foreground mt-1 leading-tight ">
                  ICU-04
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider leading-none">
                  Admission Date
                </p>
                <p className="text-[13px] font-bold text-foreground mt-1 leading-tight ">
                  12 Oct 2023
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider leading-none">
                  Attending Doctor
                </p>
                <p className="text-[13px] font-bold text-foreground mt-1 leading-tight ">
                  Dr. Sarah Jenkins
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider leading-none">
                  Diagnosis
                </p>
                <p className="text-[13px] font-bold text-foreground mt-1 leading-tight truncate max-w-[160px]">
                  Acute Myocardial Infarction
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Destination Details Section ── */}
      <div className="bg-card p-5 rounded-lg border border-border shadow-none flex flex-col space-y-[20px]">
        <h3 className="text-[15px] font-bold text-foreground leading-tight">
          Destination Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          <div>
            <label className="block text-[11px] font-bold text-muted-foreground uppercase leading-none mb-1.5 ">
              Facility
            </label>
            <CustomSelect
              value={facility}
              onChange={setFacility}
              placeholder="Select Facility"
              options={[
                { label: "Mercy General (Internal)", value: "Mercy General (Internal)" },
                { label: "St. Jude Hospital", value: "St. Jude Hospital" },
              ]}
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-muted-foreground uppercase leading-none mb-1.5 ">
              Destination Ward
            </label>
            <CustomSelect
              value={ward}
              onChange={setWard}
              placeholder="Select Ward"
              options={[
                { label: "ICU - Level 3", value: "ICU - Level 3" },
                { label: "Emergency Room", value: "Emergency Room" },
                { label: "General Ward A", value: "General Ward A" },
              ]}
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-muted-foreground uppercase leading-none mb-1.5 ">
              Reason for Transfer
            </label>
            <CustomSelect
              value={reason}
              onChange={setReason}
              placeholder="Select Reason"
              options={[
                { label: "Escalation of Care", value: "Escalation of Care" },
                { label: "Symptom Improvement", value: "Symptom Improvement" },
                { label: "Patient Request", value: "Patient Request" },
              ]}
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-muted-foreground uppercase leading-none mb-1.5 ">
              Transfer Date / Time
            </label>
            <input
              type="text"
              placeholder="Select Date & Time"
              value={transferDateTime}
              onChange={(e) => setTransferDateTime(e.target.value)}
              className="w-full h-11 px-4 bg-muted/50 border border-border rounded-lg text-[13px] font-medium text-foreground outline-none transition-all shadow-none focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* ── Clinical Handover Card ── */}
      <div className="bg-card p-5 rounded-lg border border-border shadow-none flex flex-col space-y-[20px]">
        <h3 className="text-[15px] font-bold text-foreground leading-tight">
          Clinical Handover
        </h3>

        {/* Active Medications Subcard */}
        <div className="flex flex-col space-y-3 ">
          <div className="flex justify-between items-center ">
            <h4 className="text-[12px] font-bold text-foreground leading-tight">
              Active Medications
            </h4>
            <span className="bg-muted/50 border border-border text-[10px] font-bold text-muted-foreground px-2 py-0.5 rounded-lg tracking-wide ">
              {meds.filter(m => m.checked).length} Included
            </span>
          </div>

          <div className="border border-border rounded-lg overflow-hidden bg-card flex flex-col divide-y divide-border">
            {meds.map((med) => (
              <div
                key={med.id}
                onClick={() => toggleMed(med.id)}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted transition-all "
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-4.5 h-4.5 rounded-[3px] border flex items-center justify-center shrink-0 transition-all ",
                    med.checked
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-border bg-transparent"
                  )}>
                    {med.checked && <Check className="w-3 h-3 " />}
                  </div>
                  <span className="text-[13px] font-bold text-foreground ">
                    {med.name}
                  </span>
                </div>
                <span className="text-[11px] font-medium text-muted-foreground ">
                  Last: {med.last}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Nursing Notes Subcard */}
        <div>
          <label className="block text-[11px] font-bold text-muted-foreground uppercase leading-none mb-1.5 ">
            Nursing Notes & Instructions
          </label>
          <textarea
            placeholder="Enter diagnosis, symptoms, or special instructions here..."
            value={nursingNotes}
            onChange={(e) => setNursingNotes(e.target.value)}
            className="w-full min-h-[100px] p-4 bg-muted/50 border border-border rounded-lg text-[13px] font-medium text-foreground outline-none transition-all shadow-none resize-none focus:border-primary"
          />
        </div>
      </div>

      {/* ── Confirm Transfer Request Modal ── */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirmModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-[4px] "
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 16 }}
              className="relative bg-card w-full max-w-[580px] rounded-lg overflow-hidden shadow-none border border-border flex flex-col "
            >
              <div className="p-6 flex flex-col space-y-5 ">
                <div className="flex justify-between items-start ">
                  <div>
                    <h3 className="text-[17px] font-bold text-foreground leading-tight ">
                      Confirm Transfer Request
                    </h3>
                    <p className="text-[12.5px] text-muted-foreground font-medium mt-1 leading-relaxed ">
                      Review details before notifying ICU
                    </p>
                  </div>
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="p-1 hover:bg-muted rounded-lg text-muted-foreground transition-all outline-none "
                  >
                    <X className="w-4 h-4 " />
                  </button>
                </div>

                <p className="text-[13px] text-muted-foreground font-medium  leading-relaxed">
                  You are about to initiate a transfer out of your ward. Once confirmed, the receiving unit will be notified, a porter will be requested, and the handover document will be sent.
                </p>

                {/* Patient & Destination Box */}
                <div className="border border-border rounded-lg bg-muted/50 overflow-hidden divide-y divide-border ">
                  <div className="grid grid-cols-2 p-4 gap-4 ">
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider leading-none ">
                        Patient
                      </p>
                      <p className="text-[14px] font-bold text-foreground mt-1  leading-tight">
                        James Wilson
                      </p>
                      <p className="text-[11px] font-medium text-muted-foreground mt-0.5  leading-tight">
                        UHID: 839211
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider leading-none ">
                        Destination
                      </p>
                      <p className="text-[14px] font-bold text-foreground mt-1  leading-tight">
                        ICU - Level 3
                      </p>
                      <p className="text-[11px] font-medium text-muted-foreground mt-0.5  leading-tight">
                        Escalation of Care
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 p-4 gap-4 bg-muted/30">
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider leading-none ">
                        Current Bed Action
                      </p>
                      <div className="flex items-center gap-1.5 mt-1 ">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 " />
                        <p className="text-[12px] font-bold text-amber-600  leading-tight">
                          Release ICU-04 for cleaning
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider leading-none ">
                        Transport Details
                      </p>
                      <p className="text-[12px] font-bold text-foreground mt-1  leading-tight">
                        Stretcher, O2, Porter Req.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Handover Confirmed Checkbox */}
                <div
                  onClick={() => setConfirmedCheckbox(!confirmedCheckbox)}
                  className="p-3.5 border border-border rounded-lg bg-card flex items-center gap-3 cursor-pointer hover:bg-muted/50 transition-all"
                >
                  <div className={cn(
                    "w-4.5 h-4.5 rounded-[3px] border flex items-center justify-center shrink-0 transition-all ",
                    confirmedCheckbox
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-border bg-transparent"
                  )}>
                    {confirmedCheckbox && <Check className="w-3 h-3 " />}
                  </div>
                  <p className="text-[12.5px] font-medium text-foreground  leading-normal">
                    I confirm that the clinical handover documentation is complete and accurate.
                  </p>
                </div>
              </div>

              {/* Action Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 bg-muted/30 border-t border-border ">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="h-10 px-5 border border-border bg-card hover:bg-muted text-foreground font-semibold rounded-lg text-[13px] transition-all shadow-none outline-none"
                >
                  Cancel
                </button>
                <button
                  disabled={!confirmedCheckbox}
                  onClick={handleConfirmAndTransfer}
                  className="h-10 px-5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg text-[13px] transition-all shadow-none outline-none disabled:opacity-50"
                >
                  Confirm & Transfer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
