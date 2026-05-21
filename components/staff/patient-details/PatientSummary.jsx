"use client";

import React from "react";
import { 
  Activity, 
  Droplets, 
  Thermometer, 
  Wind,
  ChevronRight,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function PatientSummary() {
  const vitals = [
    { label: "HEART RATE", value: "112", unit: "bpm", icon: Activity, color: "text-blue-500" },
    { label: "BLOOD PRESSURE", value: "145/90", unit: "mmHg", icon: Droplets, color: "text-destructive" },
    { label: "TEMPERATURE", value: "38.5", unit: "°C", icon: Thermometer, color: "text-amber-500" },
    { label: "SPO2", value: "94", unit: "%", icon: Wind, color: "text-emerald-500" },
  ];

  const medications = [
    { time: "08:00 AM", name: "Aspirin 81mg", route: "Route: PO", status: "Given", statusColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
    { time: "12:00 PM", name: "Lisinopril 10mg", route: "Route: PO", status: "OVERDUE", statusColor: "bg-destructive/10 text-destructive border-destructive/20" },
    { time: "06:00 PM", name: "Atorvastatin 40mg", route: "Route: PO", status: null },
  ];

  const tasks = [
    { name: "Change IV dressing", due: "Due in 2h", priority: "HIGH", priorityColor: "text-destructive" },
    { name: "Collect Blood Sample (CBC)", due: "Due in 4h", priority: "MEDIUM", priorityColor: "text-amber-500" },
    { name: "Patient positioning / Turn", due: "Due in 5h", priority: "LOW", priorityColor: "text-emerald-500" },
  ];

  const labs = [
    { name: "Complete Blood Count", time: "Today, 08:00 AM", status: "CRITICAL", statusColor: "bg-destructive/10 text-destructive border-destructive/20" },
    { name: "Lipid Panel", time: "Yesterday, 08:30 AM", status: "STABLE", statusColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
      {/* Left Column: Vitals & Medications */}
      <div className="lg:col-span-8 space-y-6">
        {/* Latest Vitals Card */}
        <div className="bg-card p-5 md:p-6 rounded-lg border border-border shadow-none">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[15px] font-bold text-foreground">Latest Vitals</h3>
            <p className="text-[11px] text-muted-foreground font-medium">Taken 15 mins ago</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {vitals.map((vital, idx) => (
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
          
          <button className="mt-6 flex items-center gap-2 text-[12px] font-bold text-primary hover:gap-3 transition-all group">
            View Vitals Trend 
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

        {/* Due Medications Card */}
        <div className="bg-card p-5 md:p-6 rounded-lg border border-border shadow-none">
          <h3 className="text-[15px] font-bold text-foreground mb-6">Due Medications</h3>
          <div className="space-y-0 divide-y divide-border border border-border rounded-lg overflow-hidden">
            {medications.map((med, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-5 bg-transparent hover:bg-muted transition-all cursor-pointer group gap-4">
                <div className="flex items-center gap-6 md:gap-10">
                  <span className="text-[12px] md:text-[13px] font-bold text-foreground min-w-[70px] md:min-w-[80px]">{med.time}</span>
                  <div>
                    <p className="text-[13px] md:text-[14px] font-bold text-foreground mb-0.5">{med.name}</p>
                    <p className="text-[11px] font-medium text-muted-foreground">{med.route}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                  {med.status && (
                    <span className={cn(
                      "px-3 py-1 rounded-md text-[9px] font-bold border flex items-center gap-1.5",
                      med.status === "Given" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-destructive/10 text-destructive border-destructive/20"
                    )}>
                      {med.status === "Given" && <span className="text-[12px]">✓</span>}
                      {med.status}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors hidden sm:block" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Tasks & Labs */}
      <div className="lg:col-span-4 space-y-6">
        {/* Pending Tasks Card */}
        <div className="bg-card p-5 md:p-6 rounded-lg border border-border shadow-none">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[15px] font-bold text-foreground">Pending Tasks</h3>
            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[11px] font-bold text-muted-foreground">3</span>
          </div>
          
          <div className="space-y-4">
            {tasks.map((task, idx) => (
              <div key={idx} className="p-4 bg-transparent border border-border rounded-lg shadow-none group">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex gap-3">
                     <div className={cn(
                       "w-4 h-4 rounded-full border-2 mt-1 shrink-0",
                       task.priority === "HIGH" ? "border-destructive bg-destructive" : "border-border"
                     )} />
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
          
          <button className="w-full mt-6 h-11 bg-muted text-[12px] font-bold text-muted-foreground rounded-lg border border-border hover:bg-muted/80 transition-all">
            View All Tasks
          </button>
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
