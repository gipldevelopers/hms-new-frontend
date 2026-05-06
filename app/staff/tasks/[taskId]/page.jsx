"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Clock, User, Check, X, AlertTriangle, ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── mock data ────────────────────────────────────────────────────────────────
const MOCK_TASKS = [
  { id: 1,  patient: "Robert Chen",    bed: "A-12", title: "Discharge Preparation",    priority: "Medium", dueTime: "10:00 AM", assignedTo: "Sarah Jenkins", status: "In Progress" },
  { id: 2,  patient: "Maria Garcia",   bed: "A-14", title: "Administer Pain Medication", priority: "Low",    dueTime: "10:15 AM", assignedTo: "Unassigned", status: "Pending"     },
  { id: 3,  patient: "James Wilson",   bed: "A-15", title: "Check Vitals",             priority: "High",   dueTime: "09:00 AM", assignedTo: "David Miller",  status: "Completed"   },
  { id: 4,  patient: "Emma Thompson",  bed: "A-18", title: "Change Wound Dressing",    priority: "Medium", dueTime: "11:30 AM", assignedTo: "Sarah Jenkins", status: "Pending"     },
  { id: 5,  patient: "William Davis",  bed: "A-21", title: "Check Vitals",             priority: "Low",    dueTime: "08:00 AM", assignedTo: "David Miller",  status: "Completed"   },
  { id: 6,  patient: "Sophia Martinez",bed: "B-15", title: "Administer Medication",    priority: "Medium", dueTime: "09:15 AM", assignedTo: "Lisa Roberts",  status: "In Progress" },
  { id: 7,  patient: "James Wilson",   bed: "C-34", title: "Schedule Test",            priority: "High",   dueTime: "10:30 AM", assignedTo: "Tom Green",     status: "Pending"     },
  { id: 8,  patient: "Emily Johnson",  bed: "D-42", title: "Review Chart",             priority: "Low",    dueTime: "11:00 AM", assignedTo: "Sara Thomas",   status: "Completed"   },
  { id: 9,  patient: "Michael Brown",  bed: "E-50", title: "Update Records",           priority: "High",   dueTime: "01:30 PM", assignedTo: "Rachel Kim",    status: "In Progress" },
];

const priorityClass = (p) => ({
  High:   "bg-destructive/10 text-destructive border border-destructive/20 font-medium text-[11px] px-2.5 py-0.5 rounded-[var(--radius)] inline-flex shadow-none",
  Medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-medium text-[11px] px-2.5 py-0.5 rounded-[var(--radius)] inline-flex shadow-none",
  Low:    "bg-muted text-muted-foreground border border-border font-medium text-[11px] px-2.5 py-0.5 rounded-[var(--radius)] inline-flex shadow-none",
}[p] ?? "text-muted-foreground text-[11px]");

const statusBadge = (s) => ({
  "In Progress": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-[var(--radius)] font-medium px-2.5 py-0.5 text-[11px] inline-flex shadow-none",
  "Pending":     "bg-muted text-muted-foreground border border-border rounded-[var(--radius)] font-medium px-2.5 py-0.5 text-[11px] inline-flex shadow-none",
  "Completed":   "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-[var(--radius)] font-medium px-2.5 py-0.5 text-[11px] inline-flex shadow-none",
}[s] ?? "bg-muted text-muted-foreground border-border");

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [note, setNote] = useState("");

  const taskId = parseInt(params.taskId, 10) || 1;
  const task = MOCK_TASKS.find((t) => t.id === taskId) || MOCK_TASKS[0];

  const [status, setStatus] = useState(task.status);

  return (
    <div className="p-5 bg-background text-foreground min-h-screen flex flex-col space-y-5 transition-colors duration-300 font-sans pb-20 shadow-none">
      
      {/* ── Header Toolbar ── */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-muted rounded-[var(--radius)] transition-all flex items-center gap-1 text-foreground font-medium text-[13px] shadow-none"
        >
          <ArrowLeft className="w-4 h-4" /> Back to tasks
        </button>
      </div>

      {/* ── Allergies Alert Banner ── */}
      <div className="bg-destructive/10 border border-destructive/20 border-l-4 border-l-destructive p-4 rounded-[var(--radius)] flex items-center gap-3 shadow-none">
        <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
        <span className="text-[13px] font-bold text-destructive/90 leading-none">Allergies:</span>
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
                {task.patient}
              </h2>
              <span className="bg-destructive/10 text-destructive border border-destructive/20 font-medium text-[11px] px-2 py-0.5 rounded-[var(--radius)] inline-flex">
                Critical
              </span>
            </div>
            <p className="text-[13px] font-medium text-muted-foreground mt-1">
              62 yrs • Male
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-5 w-full border-t md:border-t-0 md:border-l border-border pt-5 md:pt-0 md:pl-5">
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground leading-tight">Uhid</p>
            <p className="text-[13px] font-bold text-foreground mt-1">Uhid-839211</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground leading-tight">Bed no.</p>
            <p className="text-[13px] font-bold text-foreground mt-1">{task.bed}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground leading-tight">Admission date</p>
            <p className="text-[13px] font-bold text-foreground mt-1">12 Oct 2023</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground leading-tight">Attending doctor</p>
            <p className="text-[13px] font-bold text-foreground mt-1">Dr. Sarah Jenkins</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground leading-tight">Diagnosis</p>
            <p className="text-[13px] font-bold text-foreground mt-1">Acute Myocardial Infarction</p>
          </div>
        </div>
      </div>

      {/* ── Task Details Main Card ── */}
      <div className="bg-card text-card-foreground border border-border rounded-[var(--radius)] p-5 flex flex-col space-y-5 shadow-none">
        
        {/* Top Badges */}
        <div className="flex justify-between items-center">
          <span className={priorityClass(task.priority)}>{task.priority}</span>
          <span className={statusBadge(status)}>{status}</span>
        </div>

        {/* Title & Description */}
        <div>
          <h3 className="text-[18px] font-bold text-foreground leading-tight">
            {task.title}
          </h3>
          <p className="text-[13px] font-medium text-muted-foreground mt-2 leading-relaxed">
            Prepare patient for afternoon discharge. Ensure all paperwork is signed and final checks are completed before family arrives.
          </p>
        </div>

        {/* Due Time + Assigned Cards */}
        <div className="flex flex-col sm:flex-row gap-5">
          <div className="bg-muted/40 border border-border p-3 w-full sm:w-1/2 flex items-center gap-3 rounded-[var(--radius)]">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-[11px] font-medium text-muted-foreground leading-tight">Due time</p>
              <p className="text-[13px] font-bold text-foreground mt-0.5">{task.dueTime} Today</p>
            </div>
          </div>

          <div className="bg-muted/40 border border-border p-3 w-full sm:w-1/2 flex items-center gap-3 rounded-[var(--radius)]">
            <User className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-[11px] font-medium text-muted-foreground leading-tight">Assigned to</p>
              <p className="text-[13px] font-bold text-foreground mt-0.5">{task.assignedTo}</p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="flex flex-col space-y-3">
          <h4 className="text-[14px] font-bold text-foreground">Timeline</h4>
          <div className="flex flex-col space-y-4 relative border-l border-border ml-2.5 pl-5 py-1">
            <div className="relative">
              <span className="absolute -left-[24px] top-1.5 w-2 h-2 rounded-full bg-muted-foreground border border-background" />
              <p className="text-[13px] font-bold text-foreground leading-tight">Task Created</p>
              <p className="text-[11px] font-medium text-muted-foreground mt-0.5">07:30 AM by Dr. Smith</p>
            </div>
            
            {(status === "In Progress" || status === "Completed") && (
              <div className="relative">
                <span className="absolute -left-[24px] top-1.5 w-2 h-2 rounded-full bg-blue-600 border border-background" />
                <p className="text-[13px] font-bold text-foreground leading-tight">Started</p>
                <p className="text-[11px] font-medium text-muted-foreground mt-0.5">08:15 AM by {task.assignedTo}</p>
              </div>
            )}

            {status === "Completed" && (
              <div className="relative">
                <span className="absolute -left-[24px] top-1.5 w-2 h-2 rounded-full bg-emerald-600 border border-background" />
                <p className="text-[13px] font-bold text-foreground leading-tight">Completed</p>
                <p className="text-[11px] font-medium text-muted-foreground mt-0.5">09:15 AM by {task.assignedTo}</p>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="flex flex-col space-y-3">
          <h4 className="text-[14px] font-bold text-foreground">Notes</h4>
          <textarea
            className="w-full h-24 p-3 border border-border bg-background rounded-[var(--radius)] text-[13px] text-foreground focus:border-primary outline-none resize-none shadow-none font-normal placeholder:text-muted-foreground"
            placeholder="Add a note or observation..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        {/* Bottom Actions */}
        <div className="flex justify-end items-center gap-3 pt-3">
          <button
            onClick={() => router.back()}
            className="h-10 px-4 border border-destructive/20 hover:bg-destructive/10 text-destructive rounded-[var(--radius)] text-[13px] font-semibold transition-all shadow-none"
          >
            Cancel
          </button>

          {status === "Pending" && (
            <button
              onClick={() => setStatus("In Progress")}
              className="h-10 px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-[var(--radius)] text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-all shadow-none"
            >
              Start Task
            </button>
          )}

          {status === "In Progress" && (
            <button
              onClick={() => setStatus("Completed")}
              className="h-10 px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-[var(--radius)] text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-all shadow-none"
            >
              <Check className="w-4 h-4" /> Mark as Completed
            </button>
          )}

          {status === "Completed" && (
            <button
              disabled
              className="h-10 px-4 bg-primary/60 text-primary-foreground rounded-[var(--radius)] text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-all shadow-none cursor-not-allowed"
            >
              <Check className="w-4 h-4" /> Task Completed
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
