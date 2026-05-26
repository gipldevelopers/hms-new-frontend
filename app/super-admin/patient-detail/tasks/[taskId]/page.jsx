"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Clock, User, Check, X, AlertTriangle, ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const priorityClass = (p) => {
  const normalized = (p || "").toUpperCase();
  if (normalized === "HIGH") {
    return "bg-destructive/10 text-destructive border border-destructive/20 font-medium text-[11px] px-2.5 py-0.5 rounded-[var(--radius)] inline-flex shadow-none";
  }
  if (normalized === "MEDIUM") {
    return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-medium text-[11px] px-2.5 py-0.5 rounded-[var(--radius)] inline-flex shadow-none";
  }
  return "bg-muted text-muted-foreground border border-border font-medium text-[11px] px-2.5 py-0.5 rounded-[var(--radius)] inline-flex shadow-none";
};

const statusBadge = (s) => {
  if (s === "In Progress") {
    return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-[var(--radius)] font-medium px-2.5 py-0.5 text-[11px] inline-flex shadow-none";
  }
  if (s === "Completed") {
    return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-[var(--radius)] font-medium px-2.5 py-0.5 text-[11px] inline-flex shadow-none";
  }
  return "bg-muted text-muted-foreground border border-border rounded-[var(--radius)] font-medium px-2.5 py-0.5 text-[11px] inline-flex shadow-none";
};

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.taskId;

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Pending");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [completedClicked, setCompletedClicked] = useState(false);

  React.useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authtoken");
        const res = await fetch(`/api/tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setTask(data);
          setStatus(data.status);
          setNote(data.description || "");
        }
      } catch (err) {
        console.error("Error loading task detail:", err);
      } finally {
        setLoading(false);
      }
    };
    if (taskId) {
      fetchTask();
    }
  }, [taskId]);

  const updateStatus = async (newStatus) => {
    try {
      setSaving(true);
      const token = localStorage.getItem("authtoken");
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus, description: note })
      });
      if (res.ok) {
        const data = await res.json();
        setTask(data);
        setStatus(data.status);
        setNote(data.description || "");
      }
    } catch (err) {
      console.error("Error updating task status:", err);
    } finally {
      setSaving(false);
    }
  };

  const saveNoteOnly = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("authtoken");
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status, description: note })
      });
      if (res.ok) {
        const data = await res.json();
        setTask(data);
        alert("Notes saved successfully");
      }
    } catch (err) {
      console.error("Error saving task notes:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[13px] font-semibold text-muted-foreground">Loading task details...</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background space-y-4">
        <p className="text-[14px] font-bold text-muted-foreground">Task not found</p>
        <button
          onClick={() => router.push("/super-admin/patient-detail/tasks")}
          className="h-10 px-4 bg-primary text-primary-foreground rounded-lg text-[13px] font-semibold transition-all"
        >
          Back to Tasks
        </button>
      </div>
    );
  }

  const isNoteModified = note !== (task.description || "");

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
                Admitted
              </span>
            </div>
            <p className="text-[13px] font-medium text-muted-foreground mt-1">
              Active Patient Profile
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
            {task.title || "No title provided"}
          </p>
        </div>

        {/* Due Time + Assigned Cards */}
        <div className="flex flex-col sm:flex-row gap-5">
          <div className="bg-muted/40 border border-border p-3 w-full sm:w-1/2 flex items-center gap-3 rounded-[var(--radius)]">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-[11px] font-medium text-muted-foreground leading-tight">Due time</p>
              <p className="text-[13px] font-bold text-foreground mt-0.5">{task.dueTime}</p>
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
              <p className="text-[11px] font-medium text-muted-foreground mt-0.5">
                {new Date(task.createdAt || Date.now()).toLocaleDateString()} at {new Date(task.createdAt || Date.now()).toLocaleTimeString()}
              </p>
            </div>

            {(status === "In Progress" || status === "Completed") && (
              <div className="relative">
                <span className="absolute -left-[24px] top-1.5 w-2 h-2 rounded-full bg-blue-600 border border-background" />
                <p className="text-[13px] font-bold text-foreground leading-tight">Started</p>
                <p className="text-[11px] font-medium text-muted-foreground mt-0.5">Assigned to {task.assignedTo}</p>
              </div>
            )}

            {status === "Completed" && (
              <div className="relative">
                <span className="absolute -left-[24px] top-1.5 w-2 h-2 rounded-full bg-emerald-600 border border-background" />
                <p className="text-[13px] font-bold text-foreground leading-tight">Completed</p>
                <p className="text-[11px] font-medium text-muted-foreground mt-0.5">Completed successfully</p>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="flex flex-col space-y-3">
          <h4 className="text-[14px] font-bold text-foreground">Notes / Description</h4>
          <textarea
            className="w-full h-24 p-3 border border-border bg-background rounded-[var(--radius)] text-[13px] text-foreground focus:border-primary outline-none resize-none shadow-none font-normal placeholder:text-muted-foreground"
            placeholder="Add a note or observation..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        {/* Bottom Actions */}
        <div className="flex justify-end items-center gap-3 pt-3">
          {isNoteModified && (
            <button
              onClick={saveNoteOnly}
              disabled={saving}
              className="h-10 px-4 bg-muted hover:bg-muted/80 text-foreground border border-border rounded-[var(--radius)] text-[13px] font-semibold transition-all shadow-none"
            >
              Save Notes
            </button>
          )}

          <button
            onClick={() => router.back()}
            className="h-10 px-4 border border-destructive/20 hover:bg-destructive/10 text-destructive rounded-[var(--radius)] text-[13px] font-semibold transition-all shadow-none"
          >
            Cancel
          </button>

          {status === "Pending" && (
            <button
              onClick={() => updateStatus("In Progress")}
              disabled={saving}
              className="h-10 px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-[var(--radius)] text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-all shadow-none"
            >
              Start Task
            </button>
          )}

          {status === "In Progress" && (
            <button
              onClick={() => updateStatus("Completed")}
              disabled={saving}
              className="h-10 px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-[var(--radius)] text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-all shadow-none"
            >
              <Check className="w-4 h-4" /> Mark as Completed
            </button>
          )}

          {status === "Completed" && (
            <button
              disabled={completedClicked}
              onClick={() => {
                setCompletedClicked(true);
                toast.success("patient task completed");
                router.push("/super-admin/patient-detail/tasks?status=Completed");
              }}
              className={cn(
                "h-10 px-4 text-primary-foreground rounded-[var(--radius)] text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-all shadow-none",
                completedClicked
                  ? "bg-primary/60 cursor-not-allowed"
                  : "bg-primary hover:bg-primary/90"
              )}
            >
              <Check className="w-4 h-4" /> Task Completed
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
