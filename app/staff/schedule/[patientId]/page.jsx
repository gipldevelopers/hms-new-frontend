"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Clock, User, Check, X, AlertTriangle, ArrowLeft,
  Calendar, CheckCircle2, AlertCircle, ListTodo, Activity, MapPin, Pill, ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const INITIAL_PATIENTS = [
  { id: 1, name: "James Wilson",    doctor: "Dr. Aris Thorne",   dose: "Acute Myocardial Infarction", status: "1 Overdue"   },
  { id: 2, name: "Maria Lopez",     doctor: "Dr. Sarah Jenkins", dose: "Chronic Heart Failure",       status: "3 Meds Due"  },
  { id: 3, name: "John Smith",      doctor: "Dr. Aris Thorne",   dose: "Pneumonia",                   status: "All Clear"   },
  { id: 4, name: "Anita Bhatt",     doctor: "Dr. Michael Vane",  dose: "Severe Asthma Attack",        status: "1 Due Soon"  },
  { id: 5, name: "Carlos Vega",     doctor: "Dr. Sarah Jenkins", dose: "Acute Stroke",                status: "2 Overdue"   },
  { id: 6, name: "Helen Parker",    doctor: "Dr. Aris Thorne",   dose: "Diabetes Complications",      status: "1 Overdue"   },
  { id: 7, name: "William Johnson", doctor: "Dr. Sarah Jenkins", dose: "Sepsis",                      status: "3 Meds Due"  },
  { id: 8, name: "Nina Patel",      doctor: "Dr. Aris Thorne",   dose: "Appendicitis",                status: "All Clear"   },
  { id: 9, name: "George Brown",    doctor: "Dr. Michael Vane",  dose: "COPD Exacerbation",           status: "1 Due Soon"  },
];

// ─── helpers ──────────────────────────────────────────────────────────────────
function CustomSelect({ value, onChange, options, minWidth = "120px" }) {
  const selected = options.find((o) => o.value === value);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="h-11 px-5 bg-card border border-border rounded-[var(--radius)] text-[13px] font-bold text-foreground flex items-center justify-between gap-3 hover:bg-muted transition-all outline-none w-full sm:w-auto shadow-none"
          style={mounted ? { minWidth } : {}}
        >
          <span className="truncate flex-1 text-left">{selected ? selected.label : value}</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px] border border-border bg-card rounded-[var(--radius)] p-1 z-[500] shadow-none">
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn("rounded-[var(--radius)] text-[13px] font-medium px-3 py-2 cursor-pointer flex items-center justify-between", value === opt.value ? "bg-accent text-accent-foreground font-semibold" : "text-foreground hover:bg-muted")}
          >
            {opt.label}
            {value === opt.value && <Check className="w-3.5 h-3.5 text-foreground" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function ScheduleDetailPage() {
  const params = useParams();
  const router = useRouter();

  const patientId = parseInt(params.patientId, 10) || 1;
  const patient = INITIAL_PATIENTS.find((p) => p.id === patientId) || INITIAL_PATIENTS[0];

  const [mobilePush, setMobilePush] = useState(true);
  const [statAlert, setStatAlert] = useState(false);
  const [alertTime, setAlertTime] = useState("15 min");

  return (
    <div className="p-5 bg-background text-foreground min-h-screen flex flex-col space-y-5 transition-colors duration-300 font-sans pb-20 shadow-none">
      
      {/* ── Header Toolbar ── */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-muted rounded-[var(--radius)] transition-all flex items-center gap-1 text-foreground font-bold text-[13px] shadow-none"
        >
          <ArrowLeft className="w-4 h-4" /> Back to schedule
        </button>
      </div>

      {/* ── Allergies Alert Banner ── */}
      <div className="bg-red-500/10 dark:bg-red-950/20 border border-red-500/20 dark:border-red-500/10 border-l-4 border-l-red-500 p-4 rounded-[var(--radius)] flex items-center gap-3 shadow-none">
        <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
        <span className="text-[13px] font-bold text-red-600 leading-none">ALLERGIES:</span>
        <span className="text-[13px] font-medium text-red-500 leading-none">Penicillin, Sulfa Drugs</span>
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

      {/* ── Potential Administration Conflict Warning Banner ── */}
      <div className="bg-amber-500/10 dark:bg-amber-950/20 border border-amber-500/20 dark:border-amber-500/10 border-l-4 border-l-amber-500 p-4 rounded-[var(--radius)] flex flex-col gap-1 shadow-none">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <span className="text-[13px] font-bold text-amber-600 dark:text-amber-400 leading-none">Potential Administration Conflict Detected</span>
        </div>
        <p className="text-[12px] font-medium text-amber-600/80 dark:text-amber-400/80 leading-relaxed max-w-4xl ml-7">
          Paracetamol and Pantoprazole are both scheduled for 08:00 AM. Total oral fluid volume exceeds standard morning threshold for this patient profile. Consider staggering by 30 minutes.
        </p>
      </div>

      {/* ── Main Two Column Grid Content ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        
        {/* Left Column: Admission Prescriptions */}
        <div className="xl:col-span-2 flex flex-col space-y-4">
          
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <h3 className="text-[16px] font-bold text-foreground tracking-tight leading-none">
              Admission Prescriptions
            </h3>
            <button
              onClick={() => router.push(`/staff/schedule/${patient.id}/full`)}
              className="h-11 px-5 border border-border hover:bg-muted text-foreground text-[13px] font-bold rounded-[var(--radius)] transition-all shadow-none shrink-0"
            >
              View Full Schedule
            </button>
          </div>

          {/* Cards Stack */}
          <div className="flex flex-col space-y-4">
            
            {/* 1. Paracetamol */}
            <div className="bg-card text-card-foreground border border-border p-4 rounded-[var(--radius)] flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-none">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[var(--radius)] bg-blue-500/10 text-blue-600 dark:text-blue-300 flex items-center justify-center shrink-0">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-foreground">Paracetamol 500mg</h4>
                  <div className="flex flex-wrap items-center gap-4 mt-3">
                    <div>
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase leading-tight">Generated Schedule</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        {["08:00 AM", "02:00 PM", "08:00 PM"].map((t) => (
                          <span key={t} className="px-2.5 py-1 bg-muted border border-border rounded-[var(--radius)] text-[11px] font-bold text-foreground shadow-none select-none">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => router.push(`/staff/schedule/${patient.id}/prescription`)}
                className="self-end sm:self-center h-11 px-5 border border-border hover:bg-muted text-foreground text-[13px] font-bold rounded-[var(--radius)] transition-all shrink-0 shadow-none"
              >
                View Details
              </button>
            </div>

            {/* 2. Pantoprazole */}
            <div className="bg-card text-card-foreground border border-border p-4 rounded-[var(--radius)] flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-none">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[var(--radius)] bg-blue-500/10 text-blue-600 dark:text-blue-300 flex items-center justify-center shrink-0">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-foreground">Pantoprazole 40mg</h4>
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-6 sm:gap-12 mt-3">
                    <div>
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase leading-tight">Generated Schedule</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="px-2.5 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-[var(--radius)] text-[11px] font-bold shadow-none select-none">
                          08:00 AM ⚠️
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase leading-tight">Special Instructions</p>
                      <p className="text-[13px] font-medium text-foreground italic mt-1.5 leading-none">Empty stomach.</p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => router.push(`/staff/schedule/${patient.id}/prescription`)}
                className="self-end sm:self-center h-11 px-5 border border-border hover:bg-muted text-foreground text-[13px] font-bold rounded-[var(--radius)] transition-all shrink-0 shadow-none"
              >
                View Details
              </button>
            </div>

            {/* 3. Ceftriaxone */}
            <div className="bg-card text-card-foreground border border-border p-4 rounded-[var(--radius)] flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-none">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[var(--radius)] bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 flex items-center justify-center shrink-0">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-foreground">Ceftriaxone 1g</h4>
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-6 sm:gap-12 mt-3">
                    <div>
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase leading-tight">Generated Schedule</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        {["08:00 AM", "08:00 PM"].map((t) => (
                          <span key={t} className="px-2.5 py-1 bg-muted border border-border rounded-[var(--radius)] text-[11px] font-bold text-foreground shadow-none select-none">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase leading-tight">Special Instructions</p>
                      <p className="text-[13px] font-medium text-foreground italic mt-1.5 leading-none">Dilute before IV.</p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => router.push(`/staff/schedule/${patient.id}/prescription`)}
                className="self-end sm:self-center h-11 px-5 border border-border hover:bg-muted text-foreground text-[13px] font-bold rounded-[var(--radius)] transition-all shrink-0 shadow-none"
              >
                View Details
              </button>
            </div>

          </div>

        </div>

        {/* Right Column: Alarm Settings & Today's Timeline */}
        <div className="flex flex-col space-y-5">
          
          {/* Alarm Settings Card */}
          <div className="bg-card text-card-foreground border border-border p-5 rounded-[var(--radius)] flex flex-col space-y-4 shadow-none">
            <h3 className="text-[15px] font-bold text-foreground tracking-tight leading-none">
              Alarm Settings
            </h3>

            {/* Nurse Alert */}
            <div className="flex justify-between items-center py-2">
              <div>
                <p className="text-[13px] font-bold text-foreground leading-tight">Nurse Station Alert</p>
                <p className="text-[11px] font-medium text-muted-foreground mt-0.5">Advance notification before dose</p>
              </div>
              <CustomSelect
                value={alertTime}
                onChange={setAlertTime}
                options={[
                  { label: "15 min", value: "15 min" },
                  { label: "30 min", value: "30 min" },
                  { label: "45 min", value: "45 min" },
                ]}
                minWidth="105px"
              />
            </div>

            {/* Push Alert */}
            <div className="flex justify-between items-center py-2 border-t border-border">
              <div>
                <p className="text-[13px] font-bold text-foreground leading-tight">Mobile Push Toggle</p>
                <p className="text-[11px] font-medium text-muted-foreground mt-0.5">Send alerts to assigned nurse's handheld</p>
              </div>
              <button
                onClick={() => setMobilePush(!mobilePush)}
                className={cn(
                  "w-10 h-6 flex items-center p-0.5 rounded-full transition-colors shrink-0 cursor-pointer",
                  mobilePush ? "bg-primary" : "bg-muted border border-border"
                )}
              >
                <span className={cn("w-5 h-5 rounded-full bg-white shadow-sm transition-transform", mobilePush ? "translate-x-4" : "translate-x-0")} />
              </button>
            </div>

            {/* Stat Alert Escalation */}
            <div className="flex justify-between items-center py-2 border-t border-border">
              <div>
                <p className="text-[13px] font-bold text-foreground leading-tight">Stat Alert Escalation</p>
                <p className="text-[11px] font-medium text-muted-foreground mt-0.5">Notify supervisor if dose delayed &gt;20m</p>
              </div>
              <button
                onClick={() => setStatAlert(!statAlert)}
                className={cn(
                  "w-10 h-6 flex items-center p-0.5 rounded-full transition-colors shrink-0 cursor-pointer",
                  statAlert ? "bg-primary" : "bg-muted border border-border"
                )}
              >
                <span className={cn("w-5 h-5 rounded-full bg-white shadow-sm transition-transform", statAlert ? "translate-x-4" : "translate-x-0")} />
              </button>
            </div>

          </div>

          {/* Today's Timeline Card */}
          <div className="bg-card text-card-foreground border border-border p-5 rounded-[var(--radius)] flex flex-col space-y-4 shadow-none">
            <h3 className="text-[15px] font-bold text-foreground tracking-tight leading-none">
              Today's Timeline
            </h3>

            <div className="flex flex-col space-y-5 relative border-l border-border ml-2.5 pl-5 py-2">
              <div className="relative">
                <span className="absolute -left-[24px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600 border border-background" />
                <p className="text-[11px] font-bold text-blue-600 leading-none">10:00 AM</p>
                <p className="text-[13px] font-bold text-foreground leading-tight mt-1">Patient Admitted</p>
                <p className="text-[11px] font-medium text-muted-foreground mt-0.5">Nurse Alpha Check-In</p>
              </div>

              <div className="relative">
                <span className="absolute -left-[24px] top-1 w-2.5 h-2.5 rounded-full bg-muted-foreground border border-background" />
                <p className="text-[11px] font-bold text-muted-foreground leading-none">02:00 PM</p>
                <p className="text-[13px] font-bold text-foreground leading-tight mt-1">Paracetamol (Dose 1)</p>
                <p className="text-[11px] font-medium text-muted-foreground mt-0.5">Scheduled</p>
              </div>

              <div className="relative">
                <span className="absolute -left-[24px] top-1 w-2.5 h-2.5 rounded-full bg-muted-foreground border border-background" />
                <p className="text-[11px] font-bold text-muted-foreground leading-none">08:00 PM</p>
                <p className="text-[13px] font-bold text-foreground leading-tight mt-1">Evening Round Cluster</p>
                <p className="text-[11px] font-medium text-muted-foreground mt-0.5">3 Medications</p>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
