"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Clock, User, Check, X, AlertTriangle, ArrowLeft,
  Calendar, CheckCircle2, AlertCircle, ListTodo, Activity, MapPin, Search, ChevronDown, CheckCircle, Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function CustomTimePicker({ value, onChange, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const initialHour = value ? parseInt(value.split(':')[0]) : 8;
  const initialMinute = value ? parseInt(value.split(':')[1]) : 0;
  const initialPeriod = value?.includes('PM') ? 'PM' : 'AM';
  const [hour, setHour] = useState(initialHour);
  const [minute, setMinute] = useState(initialMinute);
  const [period, setPeriod] = useState(initialPeriod);
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = ["00", "15", "30", "45"];
  const formatTime = (h, m, p) => `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${p}`;
  const handleSelect = (h, m, p) => {
    setHour(h); setMinute(m); setPeriod(p);
    onChange(formatTime(h, m, p));
  };
  return (
    <DropdownMenu open={isOpen && !disabled} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button type="button" disabled={disabled} className="w-full h-[48px] px-4 bg-card border border-border rounded-[var(--radius)] text-[14px] font-bold text-left flex items-center justify-between outline-none focus:border-primary transition-all disabled:opacity-50">
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-primary/50" />
            {value || "Select Time"}
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="p-0 border-border bg-card shadow-2xl z-[600] rounded-[var(--radius)] overflow-hidden">
        <div className="flex h-[200px]">
          <div className="w-16 overflow-y-auto border-r border-border custom-scrollbar py-1">
            {hours.map((h) => (
              <button key={h} type="button" className={cn("w-full py-2 text-[12px] font-bold transition-all", hour === h ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted")} onClick={() => handleSelect(h, minute, period)}>
                {h.toString().padStart(2, "0")}
              </button>
            ))}
          </div>
          <div className="w-16 overflow-y-auto border-r border-border custom-scrollbar py-1">
            {minutes.map((m) => (
              <button key={m} type="button" className={cn("w-full py-2 text-[12px] font-bold transition-all", minute === parseInt(m) ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted")} onClick={() => handleSelect(hour, parseInt(m), period)}>
                {m}
              </button>
            ))}
          </div>
          <div className="w-16 flex flex-col py-1">
            {["AM", "PM"].map((p) => (
              <button key={p} type="button" className={cn("w-full flex-1 text-[11px] font-bold transition-all", period === p ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted")} onClick={() => handleSelect(hour, minute, p)}>
                {p}
              </button>
            ))}
            <button type="button" className="h-10 border-t border-border bg-primary/5 text-primary flex items-center justify-center hover:bg-primary/10" onClick={() => setIsOpen(false)}>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const INITIAL_PATIENTS = [
  { id: 1, name: "James Wilson",    doctor: "Dr. Sarah Jenkins", dose: "Acute Myocardial Infarction", status: "1 Overdue"   },
  { id: 2, name: "Maria Lopez",     doctor: "Dr. Sarah Jenkins", dose: "Chronic Heart Failure",       status: "3 Meds Due"  },
  { id: 3, name: "John Smith",      doctor: "Dr. Aris Thorne",   dose: "Pneumonia",                   status: "All Clear"   },
  { id: 4, name: "Anita Bhatt",     doctor: "Dr. Michael Vane",  dose: "Severe Asthma Attack",        status: "1 Due Soon"  },
  { id: 5, name: "Carlos Vega",     doctor: "Dr. Sarah Jenkins", dose: "Acute Stroke",                status: "2 Overdue"   },
  { id: 6, name: "Helen Parker",    doctor: "Dr. Aris Thorne",   dose: "Diabetes Complications",      status: "1 Overdue"   },
  { id: 7, name: "William Johnson", doctor: "Dr. Sarah Jenkins", dose: "Sepsis",                      status: "3 Meds Due"  },
  { id: 8, name: "Nina Patel",      doctor: "Dr. Aris Thorne",   dose: "Appendicitis",                status: "All Clear"   },
  { id: 9, name: "George Brown",    doctor: "Dr. Michael Vane",  dose: "COPD Exacerbation",           status: "1 Due Soon"  },
];

export default function MARAdministerPage() {
  const params = useParams();
  const router = useRouter();

  const patientId = parseInt(params.patientId, 10) || 1;
  const patient = INITIAL_PATIENTS.find((p) => p.id === patientId) || INITIAL_PATIENTS[0];

  // Rights Verification Toggles state
  const [rights, setRights] = useState({
    rightPatient: true,
    rightDrug: true,
    rightDose: false,
    rightRoute: false,
    rightTime: false,
  });

  const toggleRight = (key) => {
    setRights((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const verifiedCount = Object.values(rights).filter(Boolean).length;

  // Form Fields State
  const [adminTime, setAdminTime] = useState("09:45 AM");
  const [adminSite, setAdminSite] = useState("Right Forearm (IV)");
  const [notes, setNotes] = useState("Patient tolerated procedure well. No immediate adverse reactions noted...");
  const [pin, setPin] = useState(["", "", "", ""]);

  return (
    <div className="p-5 bg-background text-foreground min-h-screen flex flex-col space-y-5 transition-colors duration-300 font-sans pb-20 shadow-none selection:bg-primary/10">
      
      {/* ── Header Toolbar ── */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-muted rounded-[var(--radius)] transition-all flex items-center gap-1 text-foreground font-bold text-[13px] shadow-none"
        >
          <ArrowLeft className="w-4 h-4" /> Back to schedule
        </button>
      </div>

      {/* ── Patient Profile Info Card ── */}
      <div className="bg-card text-card-foreground border border-border p-5 rounded-[var(--radius)] flex flex-col md:flex-row items-center gap-5 shadow-none">
        <div className="flex items-center gap-4 shrink-0 w-full md:w-auto">
          <img
            src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=100&auto=format&fit=crop&q=60"
            alt="Patient"
            className="w-16 h-16 rounded-full border border-border object-cover shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[18px] font-bold text-foreground leading-tight">
                {patient.name}
              </h2>
              <span className="bg-destructive/10 text-destructive border border-destructive/20 font-medium text-[11px] px-2 py-0.5 rounded-[var(--radius)] inline-flex">
                CRITICAL
              </span>
            </div>
            <p className="text-[13px] font-medium text-muted-foreground mt-1">
              62 yrs • Male
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-5 w-full border-t md:border-t-0 md:border-l border-border pt-5 md:pt-0 md:pl-5">
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground leading-tight">UHID</p>
            <p className="text-[13px] font-bold text-foreground mt-1">UHID-839211</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground leading-tight">BED NO.</p>
            <p className="text-[13px] font-bold text-foreground mt-1">ICU-04</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground leading-tight">ADMISSION DATE</p>
            <p className="text-[13px] font-bold text-foreground mt-1">12 Oct 2023</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground leading-tight">ATTENDING DOCTOR</p>
            <p className="text-[13px] font-bold text-foreground mt-1">{patient.doctor}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground leading-tight">DIAGNOSIS</p>
            <p className="text-[13px] font-bold text-foreground mt-1 leading-tight">{patient.dose}</p>
          </div>
        </div>
      </div>

      {/* ── Main Administration Screen Details Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ── Column 1: Scheduled Medication details ── */}
        <div className="flex flex-col space-y-5">
          <div className="bg-card text-card-foreground border border-border p-6 rounded-[var(--radius)] flex flex-col space-y-4 shadow-none">
            <div>
              <span className="bg-muted px-2 py-1 rounded-[var(--radius)] text-[10px] font-bold text-muted-foreground tracking-wider  border border-border">
                SCHEDULED MEDICATION
              </span>
              <h2 className="text-[28px] font-bold text-foreground tracking-tight mt-3 leading-tight">
                Rocephin
              </h2>
              <p className="text-[16px] font-bold text-blue-500 mt-0.5 leading-none">
                (Ceftriaxone)
              </p>
            </div>

            {/* Dose & Route row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/40 border border-border p-4 rounded-[var(--radius)]">
                <p className="text-[11px] font-bold text-muted-foreground leading-tight">DOSE</p>
                <p className="text-[22px] font-bold text-foreground mt-1 tracking-tight">1g</p>
              </div>
              <div className="bg-muted/40 border border-border p-4 rounded-[var(--radius)]">
                <p className="text-[11px] font-bold text-muted-foreground leading-tight">ROUTE</p>
                <p className="text-[16px] font-bold text-foreground mt-2 tracking-tight leading-snug">
                  IV Piggyback
                </p>
              </div>
            </div>

            {/* Pink scheduled alert section */}
            <div className="bg-red-500/5 dark:bg-red-950/20 border border-red-500/20 dark:border-red-500/10 p-4 rounded-[var(--radius)] flex flex-col justify-between items-start gap-2 shadow-none min-h-[90px] relative overflow-hidden">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-red-500" />
                  <span className="text-[11px] font-bold text-red-500 uppercase tracking-wide">
                    Scheduled Time
                  </span>
                </div>
                <span className="bg-red-500 text-white font-bold text-[11px] px-2.5 py-0.5 rounded-[var(--radius)] leading-none  shadow-none">
                  45 mins overdue
                </span>
              </div>
              <p className="text-[26px] font-bold text-red-600 dark:text-red-400 mt-1 leading-none tracking-tight">
                09:00 AM
              </p>
            </div>

            {/* Yellow warning section */}
            <div className="bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/20 dark:border-amber-500/10 p-4 rounded-[var(--radius)] flex items-start gap-3 shadow-none">
              <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-[13px] font-bold text-amber-600 dark:text-amber-400 leading-none">
                  Dose Interval Warning
                </h4>
                <p className="text-[12px] font-medium text-amber-700/80 dark:text-amber-300/80 leading-normal">
                  Last administered 6 hours ago. Minimum interval is 8 hours.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Column 2: Rights Verification ── */}
        <div className="bg-card text-card-foreground border border-border p-6 rounded-[var(--radius)] flex flex-col space-y-5 shadow-none ">
          <div className="flex items-center justify-between">
            <h3 className="text-[18px] font-bold text-foreground leading-none">
              Rights Verification
            </h3>
            <span className="bg-muted px-2.5 py-1 text-[12px] font-bold text-muted-foreground border border-border rounded-[var(--radius)] leading-none ">
              {verifiedCount}/5 Verified
            </span>
          </div>

          <div className="flex flex-col space-y-3">
            {[
              {
                key: "rightPatient",
                label: "Right Patient",
                desc: "Robert Harrison",
              },
              {
                key: "rightDrug",
                label: "Right Drug",
                desc: "Rocephin",
              },
              {
                key: "rightDose",
                label: "Right Dose",
                desc: "1g",
              },
              {
                key: "rightRoute",
                label: "Right Route",
                desc: "IV Piggyback",
              },
              {
                key: "rightTime",
                label: "Right Time",
                desc: "09:00 AM",
              },
            ].map((item) => (
              <div
                key={item.key}
                onClick={() => toggleRight(item.key)}
                className={cn(
                  "flex items-center justify-between p-3.5 border rounded-[var(--radius)] transition-all cursor-pointer ",
                  rights[item.key]
                    ? "bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/20"
                    : "bg-muted/30 border-border hover:bg-muted/40"
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center border transition-all",
                      rights[item.key]
                        ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-600"
                        : "bg-card border-border text-transparent"
                    )}
                  >
                    <Check className={cn("w-4 h-4", rights[item.key] ? "opacity-100" : "opacity-0")} />
                  </span>
                  <div>
                    <h4 className={cn("text-[13px] font-bold leading-tight", rights[item.key] ? "text-emerald-600" : "text-foreground")}>
                      {item.label}
                    </h4>
                    <p className="text-[12px] font-medium text-muted-foreground mt-0.5 leading-none">
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* Toggle Switch */}
                <button
                  type="button"
                  className={cn(
                    "h-6 w-11 rounded-full relative transition-all duration-300 shadow-none shrink-0 outline-none",
                    rights[item.key] ? "bg-emerald-500" : "bg-muted border border-border"
                  )}
                >
                  <div
                    className={cn(
                      "absolute top-[2px] w-[18px] h-[18px] bg-white rounded-full transition-all duration-300",
                      rights[item.key] ? "right-1" : "left-1"
                    )}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── Column 3: Administration Details ── */}
        <div className="bg-card text-card-foreground border border-border p-6 rounded-[var(--radius)] flex flex-col space-y-5 shadow-none ">
          <h3 className="text-[18px] font-bold text-foreground leading-none">
            Administration Details
          </h3>

          <div className="flex flex-col space-y-4">
            {/* Field 1: Admin Time */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-muted-foreground tracking-wide ml-1">
                ACTUAL ADMINISTRATION TIME
              </label>
              <CustomTimePicker value={adminTime} onChange={setAdminTime} />
            </div>

            {/* Field 2: Admin Site */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-muted-foreground tracking-wide ml-1">
                SITE OF ADMINISTRATION
              </label>
              <input
                type="text"
                value={adminSite}
                onChange={(e) => setAdminSite(e.target.value)}
                className="w-full h-11 px-4 bg-card border border-border rounded-[var(--radius)] text-[13px] font-bold focus:border-primary outline-none transition-all shadow-none"
              />
            </div>

            {/* Field 3: Response / Notes */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-muted-foreground tracking-wide ml-1">
                PATIENT RESPONSE / NOTES <span className="text-gray-400 font-medium">(Optional)</span>
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-4 bg-card border border-border rounded-[var(--radius)] text-[13px] font-bold focus:border-primary outline-none transition-all shadow-none resize-none"
              />
            </div>

            {/* Confirm with PIN header */}
            <div className="flex justify-between items-center pt-2">
              <span className="text-[11px] font-bold text-muted-foreground tracking-wide ml-1">
                CONFIRM WITH PIN
              </span>
              <div className="flex items-center gap-1.5 bg-muted/60 px-2 py-1 rounded-[var(--radius)] border border-border shrink-0 ">
                <img
                  src="https://i.pravatar.cc/100?u=drjenkins"
                  alt="Avatar"
                  className="w-4.5 h-4.5 rounded-full object-cover shrink-0"
                />
                <span className="text-[11px] font-bold text-foreground">Sarah Jenkins, RN</span>
              </div>
            </div>

            {/* PIN boxes inputs row */}
            <div className="grid grid-cols-4 gap-3">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  id={`pin-${index}`}
                  type="text"
                  maxLength={1}
                  value={pin[index] || ""}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    const newPin = [...pin];
                    newPin[index] = val;
                    setPin(newPin);
                    if (val && index < 3) {
                      document.getElementById(`pin-${index + 1}`)?.focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !pin[index] && index > 0) {
                      document.getElementById(`pin-${index - 1}`)?.focus();
                    }
                  }}
                  className="bg-card border border-border rounded-[var(--radius)] h-12 w-full text-center font-bold text-[18px] text-foreground focus:border-primary outline-none transition-all shadow-none  select-all"
                />
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex justify-end items-center gap-3 pt-3">
              <button
                onClick={() => router.back()}
                className="px-6 h-11 bg-card border border-red-200 dark:border-red-950/40 text-red-600 hover:bg-red-500/10 text-[13px] font-bold rounded-[var(--radius)] transition-all shadow-none  outline-none"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("Administration Submitted Successfully!");
                  router.push(`/staff/schedule/${patientId}`);
                }}
                className="px-6 h-11 bg-primary text-white text-[13px] font-bold rounded-[var(--radius)] hover:opacity-90 transition-all shadow-none  outline-none"
              >
                Confirm & submit
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
