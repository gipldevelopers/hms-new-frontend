"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Clock, User, Check, X, AlertTriangle, ArrowLeft,
  Calendar, CheckCircle2, AlertCircle, ListTodo, Activity, MapPin, Pill, Edit3
} from "lucide-react";
import { cn } from "@/lib/utils";

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

export default function PrescriptionDetailPage() {
  const params = useParams();
  const router = useRouter();

  const patientId = parseInt(params.patientId, 10) || 1;
  const patient = INITIAL_PATIENTS.find((p) => p.id === patientId) || INITIAL_PATIENTS[0];

  return (
    <div className="p-5 bg-background text-foreground min-h-screen flex flex-col space-y-5 transition-colors duration-300 font-sans pb-20 shadow-none">
      
      {/* ── Allergies Alert Banner ── */}
      <div className="bg-destructive/10 border border-destructive/20 border-l-4 border-l-destructive p-4 rounded-[var(--radius)] flex items-center gap-3 shadow-none">
        <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
        <span className="text-[13px] font-bold text-destructive/90 leading-none">ALLERGIES:</span>
        <span className="text-[13px] font-medium text-destructive leading-none">Penicillin, Sulfa Drugs</span>
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

      {/* ── Title Section ── */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-card text-card-foreground border border-border p-4 px-5 rounded-[var(--radius)] shadow-none">
        <h3 className="text-[14px] font-bold text-foreground tracking-tight leading-none">
          Medication Detail: Novorapid Flexpen
        </h3>
        <button
          onClick={() => router.back()}
          className="h-9 px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-[var(--radius)] text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all w-full sm:w-auto shadow-none shrink-0"
        >
          <Edit3 className="w-4 h-4" /> Edit Schedule
        </button>
      </div>

      {/* ── Dynamic Prescription Grid Card Area ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        
        {/* Left Side: Prescription Order Details */}
        <div className="xl:col-span-2 bg-card text-card-foreground border border-border rounded-[var(--radius)] flex flex-col shadow-none h-fit overflow-hidden">
          {/* Grey Banner Header */}
          <div className="bg-muted/50 border-b border-border p-3 px-5">
            <p className="text-[11px] font-bold text-muted-foreground uppercase leading-none tracking-tight">
              Prescription Order Details
            </p>
          </div>

          <div className="p-5 flex flex-col space-y-5">
            {/* First row of medication name and dosage */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-b border-border pb-5">
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground leading-tight">DRUG NAME & GENERIC</p>
                <p className="text-[14px] font-bold text-primary mt-1 leading-tight">Novorapid Flexpen</p>
                <p className="text-[12px] font-medium text-muted-foreground mt-1 leading-tight">Insulin Aspart (rDNA origin)</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground leading-tight">DOSE, ROUTE & FREQ</p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="text-[14px] font-bold text-foreground">Sliding Scale</span>
                  <span className="text-muted-foreground ">•</span>
                  <span className="text-[13px] font-bold text-foreground">TDS</span>
                </div>
              </div>
            </div>

            {/* Special instructions Section */}
            <div className="border-b border-border pb-5">
              <p className="text-[11px] font-semibold text-muted-foreground leading-tight uppercase">Special Instructions / Pre-checks</p>
              <div className="bg-amber-500/10 border border-amber-500/20 border-l-4 border-l-amber-500 p-4 rounded-[var(--radius)] mt-3">
                <p className="text-[13px] font-bold text-amber-700 dark:text-amber-400 leading-tight">
                  MANDATORY: Check Capillary Blood Glucose (CBG) before giving.
                </p>
              </div>
              <p className="text-[13px] font-medium text-foreground leading-relaxed mt-3 max-w-2xl">
                Administer 15 minutes before main meals. Rotate injection sites.
              </p>
            </div>

            {/* Ordered By and duration Footer row in card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground leading-tight">ORDERED BY</p>
                <p className="text-[13px] font-bold text-foreground mt-1 leading-tight">Dr. R. Mehta (Endocrinology)</p>
                <p className="text-[11px] font-medium text-muted-foreground mt-1 leading-none">12 Oct 2023, 09:30 AM</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground leading-tight">DURATION</p>
                <p className="text-[13px] font-bold text-foreground mt-1 leading-tight">Valid Until Discharge</p>
                <p className="text-[11px] font-medium text-muted-foreground mt-1 leading-none">Or until modified by doctor</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Compliance Summary */}
        <div className="bg-card text-card-foreground border border-border rounded-[var(--radius)] flex flex-col shadow-none h-fit overflow-hidden">
          {/* Grey Banner Header */}
          <div className="bg-muted/50 border-b border-border p-3 px-5">
            <p className="text-[11px] font-bold text-muted-foreground uppercase leading-none tracking-tight">
              Compliance (This Admission)
            </p>
          </div>

          <div className="p-5 flex flex-col space-y-4">
            <div className="flex items-baseline gap-2 mt-1">
              <h4 className="text-[28px] font-bold text-emerald-600 leading-none">92%</h4>
              <span className="text-[12px] font-medium text-muted-foreground">Overall Compliance</span>
            </div>

            {/* Progress Bars Stack */}
            <div className="flex flex-col space-y-4 pt-2">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase">Given on time</span>
                  <span className="text-[12px] font-bold text-emerald-600">11 doses</span>
                </div>
                <div className="w-full bg-muted h-2.5 rounded-full overflow-hidden border border-border">
                  <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: "92%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase">Delayed / Overdue</span>
                  <span className="text-[12px] font-bold text-amber-600">1 dose</span>
                </div>
                <div className="w-full bg-muted h-2.5 rounded-full overflow-hidden border border-border">
                  <div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: "8%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase">Missed / Skipped</span>
                  <span className="text-[12px] font-bold text-muted-foreground">0 doses</span>
                </div>
                <div className="w-full bg-muted h-2.5 rounded-full overflow-hidden border border-border">
                  <div className="bg-muted-foreground/30 h-full rounded-full transition-all" style={{ width: "0%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
