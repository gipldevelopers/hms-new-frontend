"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  Activity, 
  Droplets, 
  Thermometer, 
  Wind,
  ChevronRight,
  Clock,
  Loader2,
  Pill
} from "lucide-react";
import { cn } from "@/lib/utils";

const API_BASE = "/api";

export default function PatientSummary({ patientId }) {
  const [loading, setLoading] = useState(true);
  const [vitalsList, setVitalsList] = useState([]);
  const [medications, setMedications] = useState([]);
  const [tasks, setTasks] = useState([]);

  const fetchSummaryData = useCallback(async () => {
    if (!patientId) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("authtoken");
      const headers = { Authorization: `Bearer ${token}` };

      // 1. Fetch vitals
      const vitalsRes = await fetch(`${API_BASE}/vitals/patient/${patientId}`, { headers });
      const vitalsData = await vitalsRes.json();
      setVitalsList(Array.isArray(vitalsData) ? vitalsData : []);

      // 2. Fetch prescription/medications
      const prescriptionRes = await fetch(`${API_BASE}/patients/${patientId}/prescription`, { headers });
      const prescriptionData = await prescriptionRes.json();
      if (prescriptionData.success && prescriptionData.data) {
        setMedications(prescriptionData.data.items || []);
      }

      // 3. Fetch tasks
      const tasksRes = await fetch(`${API_BASE}/tasks?patientId=${patientId}`, { headers });
      const tasksData = await tasksRes.json();
      setTasks(Array.isArray(tasksData) ? tasksData : []);
    } catch (e) {
      console.error("Error fetching summary data", e);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchSummaryData();
  }, [fetchSummaryData]);

  // Format Vitals
  const latestVital = vitalsList[0] || null;
  const formattedVitals = [
    { 
      label: "HEART RATE", 
      value: latestVital?.heartRate !== null && latestVital?.heartRate !== undefined ? latestVital.heartRate : "--", 
      unit: "bpm", 
      icon: Activity, 
      color: "text-blue-500" 
    },
    { 
      label: "BLOOD PRESSURE", 
      value: latestVital?.systolic && latestVital?.diastolic ? `${latestVital.systolic}/${latestVital.diastolic}` : "--", 
      unit: "mmHg", 
      icon: Droplets, 
      color: (latestVital?.systolic > 140 || latestVital?.diastolic > 90) ? "text-destructive" : "text-destructive" 
    },
    { 
      label: "TEMPERATURE", 
      value: latestVital?.temperature !== null && latestVital?.temperature !== undefined ? latestVital.temperature : "--", 
      unit: "°C", 
      icon: Thermometer, 
      color: "text-amber-500" 
    },
    { 
      label: "SPO2", 
      value: latestVital?.spo2 !== null && latestVital?.spo2 !== undefined ? latestVital.spo2 : "--", 
      unit: "%", 
      icon: Wind, 
      color: "text-emerald-500" 
    },
  ];

  const getRelativeTime = (dateStr) => {
    if (!dateStr) return "No vitals recorded";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Taken just now";
    if (diffMins < 60) return `Taken ${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `Taken ${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return `Taken ${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  // Format Medications
  const formattedMedications = medications.slice(0, 3).map(med => ({
    time: med.timing || "Anytime",
    name: med.medicineName,
    route: `Dosage: ${med.dosage || "N/A"}`,
    duration: med.duration || "N/A"
  }));

  // Format Pending Tasks
  const pendingTasks = tasks
    .filter(t => t.status !== "Completed")
    .map(t => ({
      name: t.title,
      due: t.dueTime || "No due date",
      priority: t.priority || "MEDIUM",
      priorityColor: t.priority === "HIGH" ? "text-destructive" :
                     t.priority === "MEDIUM" ? "text-amber-500" :
                     t.priority === "LOW" ? "text-emerald-500" : "text-muted-foreground"
    }));

  const labs = [
    { name: "Complete Blood Count", time: "Today, 08:00 AM", status: "CRITICAL", statusColor: "bg-destructive/10 text-destructive border-destructive/20" },
    { name: "Lipid Panel", time: "Yesterday, 08:30 AM", status: "STABLE", statusColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 bg-card border border-border rounded-lg shadow-none min-h-[300px] animate-in fade-in duration-300">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-[13px] font-bold text-muted-foreground">Loading summary...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
      {/* Left Column: Vitals & Medications */}
      <div className="lg:col-span-8 space-y-6">
        {/* Latest Vitals Card */}
        <div className="bg-card p-5 md:p-6 rounded-lg border border-border shadow-none">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[15px] font-bold text-foreground">Latest Vitals</h3>
            <p className="text-[11px] text-muted-foreground font-medium">{getRelativeTime(latestVital?.createdAt)}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {formattedVitals.map((vital, idx) => (
              <div key={idx} className="bg-muted/30 p-4 rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <vital.icon className={cn("w-3.5 h-3.5", vital.color)} />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{vital.label}</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[24px] md:text-[28px] font-bold text-foreground leading-none">{vital.value}</span>
                  <span className="text-[12px] font-medium text-muted-foreground">{vital.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Due Medications Card */}
        <div className="bg-card p-5 md:p-6 rounded-lg border border-border shadow-none">
          <h3 className="text-[15px] font-bold text-foreground mb-6">Due Medications</h3>
          {formattedMedications.length === 0 ? (
            <div className="border border-border rounded-lg p-8 text-center flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <Pill className="w-8 h-8 text-muted-foreground/30" />
              <p className="text-[13px] font-bold">No medications assigned</p>
            </div>
          ) : (
            <div className="space-y-0 divide-y divide-border border border-border rounded-lg overflow-hidden">
              {formattedMedications.map((med, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-5 bg-transparent hover:bg-muted transition-all gap-4">
                  <div className="flex items-center gap-6 md:gap-10">
                    <span className="text-[12px] md:text-[13px] font-bold text-foreground min-w-[70px] md:min-w-[80px]">{med.time}</span>
                    <div>
                      <p className="text-[13px] md:text-[14px] font-bold text-foreground mb-0.5">{med.name}</p>
                      <p className="text-[11px] font-medium text-muted-foreground">{med.route}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    <span className="px-3 py-1 rounded-md text-[9px] font-bold border flex items-center gap-1.5 bg-muted text-muted-foreground border-border uppercase tracking-tight">
                      {med.duration}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Tasks & Labs */}
      <div className="lg:col-span-4 space-y-6">
        {/* Pending Tasks Card */}
        <div className="bg-card p-5 md:p-6 rounded-lg border border-border shadow-none">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[15px] font-bold text-foreground">Pending Tasks</h3>
            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[11px] font-bold text-muted-foreground">
              {pendingTasks.length}
            </span>
          </div>
          
          {pendingTasks.length === 0 ? (
            <div className="border border-border rounded-lg p-8 text-center text-muted-foreground text-[13px] font-bold">
              No pending tasks
            </div>
          ) : (
            <div className="space-y-4">
              {pendingTasks.map((task, idx) => (
                <div key={idx} className="p-4 bg-transparent border border-border rounded-lg shadow-none group">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex gap-3">
                       <div>
                          <p className="text-[13px] font-bold text-foreground leading-tight mb-2">{task.name}</p>
                          <div className="flex flex-wrap items-center gap-3">
                             <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                                <span className="text-[11px] font-medium text-muted-foreground">{task.due}</span>
                             </div>
                             <span className="text-muted-foreground hidden sm:block">•</span>
                             <span className={cn("text-[9px] font-black uppercase tracking-widest", task.priorityColor)}>{task.priority}</span>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Latest Labs Card */}
        <div className="bg-card p-6 rounded-lg border border-border shadow-none">
          <h3 className="text-[15px] font-bold text-foreground mb-6">Latest Labs</h3>
          <div className="space-y-3">
            {labs.map((lab, idx) => (
              <div key={idx} className="p-4 bg-transparent border border-border rounded-lg flex items-center justify-between shadow-none">
                <div>
                  <p className="text-[13px] font-bold text-foreground mb-1">{lab.name}</p>
                  <p className="text-[11px] font-medium text-muted-foreground">{lab.time}</p>
                </div>
                <span className={cn(
                  "px-2.5 py-1 rounded-md text-[9px] font-bold border", 
                  lab.statusColor
                )}>
                  {lab.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
