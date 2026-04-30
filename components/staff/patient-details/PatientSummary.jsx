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
    { label: "BLOOD PRESSURE", value: "145/90", unit: "mmHg", icon: Droplets, color: "text-rose-500" },
    { label: "TEMPERATURE", value: "38.5", unit: "°C", icon: Thermometer, color: "text-amber-500" },
    { label: "SPO2", value: "94", unit: "%", icon: Wind, color: "text-emerald-500" },
  ];

  const medications = [
    { time: "08:00 AM", name: "Aspirin 81mg", route: "Route: PO", status: "Given", statusColor: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    { time: "12:00 PM", name: "Lisinopril 10mg", route: "Route: PO", status: "OVERDUE", statusColor: "bg-rose-50 text-rose-500 border-rose-100" },
    { time: "06:00 PM", name: "Atorvastatin 40mg", route: "Route: PO", status: null },
  ];

  const tasks = [
    { name: "Change IV dressing", due: "Due in 2h", priority: "HIGH", priorityColor: "text-rose-500" },
    { name: "Collect Blood Sample (CBC)", due: "Due in 4h", priority: "MEDIUM", priorityColor: "text-amber-500" },
    { name: "Patient positioning / Turn", due: "Due in 5h", priority: "LOW", priorityColor: "text-emerald-500" },
  ];

  const labs = [
    { name: "Complete Blood Count", time: "Today, 08:00 AM", status: "CRITICAL", statusColor: "bg-rose-50 text-rose-500 border-rose-100" },
    { name: "Lipid Panel", time: "Yesterday, 08:30 AM", status: "STABLE", statusColor: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
      {/* Left Column: Vitals & Medications */}
      <div className="lg:col-span-8 space-y-6">
        {/* Latest Vitals Card */}
        <div className="bg-white dark:bg-[#101935] p-5 md:p-6 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 shadow-none">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[15px] font-bold text-[#1A1C23] dark:text-white">Latest Vitals</h3>
            <p className="text-[11px] text-gray-400 font-medium">Taken 15 mins ago</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {vitals.map((vital, idx) => (
              <div key={idx} className="bg-white dark:bg-white/[0.02] p-4 rounded-[5px] border border-[#E7E8EB] dark:border-white/10">
                <div className="flex items-center gap-2 mb-4">
                  <vital.icon className={cn("w-3.5 h-3.5", vital.color)} />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{vital.label}</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[24px] md:text-[28px] font-bold text-[#1A1C23] dark:text-white leading-none">{vital.value}</span>
                  <span className="text-[12px] font-medium text-gray-400">{vital.unit}</span>
                </div>
              </div>
            ))}
          </div>
          
          <button className="mt-6 flex items-center gap-2 text-[12px] font-bold text-[#2D3A8C] dark:text-primary hover:gap-3 transition-all group">
            View Vitals Trend 
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

        {/* Due Medications Card */}
        <div className="bg-white dark:bg-[#101935] p-5 md:p-6 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 shadow-none">
          <h3 className="text-[15px] font-bold text-[#1A1C23] dark:text-white mb-6">Due Medications</h3>
          <div className="space-y-0 divide-y divide-[#E7E8EB] dark:divide-white/5 border border-[#E7E8EB] dark:border-white/10 rounded-[5px] overflow-hidden">
            {medications.map((med, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-5 bg-white dark:bg-transparent hover:bg-gray-50/50 transition-all cursor-pointer group gap-4">
                <div className="flex items-center gap-6 md:gap-10">
                  <span className="text-[12px] md:text-[13px] font-bold text-[#1A1C23] dark:text-white min-w-[70px] md:min-w-[80px]">{med.time}</span>
                  <div>
                    <p className="text-[13px] md:text-[14px] font-bold text-[#1A1C23] dark:text-white mb-0.5">{med.name}</p>
                    <p className="text-[11px] font-medium text-gray-400">{med.route}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                  {med.status && (
                    <span className={cn(
                      "px-3 py-1 rounded-[5px] text-[9px] font-bold border flex items-center gap-1.5",
                      med.status === "Given" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-500 border-rose-100"
                    )}>
                      {med.status === "Given" && <span className="text-[12px]">✓</span>}
                      {med.status}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors hidden sm:block" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Tasks & Labs */}
      <div className="lg:col-span-4 space-y-6">
        {/* Pending Tasks Card */}
        <div className="bg-white dark:bg-[#101935] p-5 md:p-6 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 shadow-none">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[15px] font-bold text-[#1A1C23] dark:text-white">Pending Tasks</h3>
            <span className="w-6 h-6 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-[11px] font-bold text-gray-400">3</span>
          </div>
          
          <div className="space-y-4">
            {tasks.map((task, idx) => (
              <div key={idx} className="p-4 bg-white dark:bg-transparent border border-[#E7E8EB] dark:border-white/10 rounded-[5px] shadow-none group">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex gap-3">
                     <div className={cn(
                       "w-4 h-4 rounded-full border-2 mt-1 shrink-0",
                       task.priority === "HIGH" ? "border-rose-500 bg-rose-500" : "border-gray-200"
                     )} />
                     <div>
                        <p className="text-[13px] font-bold text-[#1A1C23] dark:text-white leading-tight mb-2">{task.name}</p>
                        <div className="flex flex-wrap items-center gap-3">
                           <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-gray-300" />
                              <span className="text-[11px] font-medium text-gray-400">{task.due}</span>
                           </div>
                           <span className="text-gray-200 hidden sm:block">•</span>
                           <span className={cn("text-[9px] font-black uppercase tracking-widest", task.priorityColor)}>{task.priority}</span>
                        </div>
                     </div>
                  </div>
                  <button className="text-[10px] font-bold text-gray-400 bg-gray-50 dark:bg-white/5 border border-gray-100 px-3 py-1.5 rounded-[5px] hover:bg-gray-100 transition-all w-full sm:w-auto">Escalate</button>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-6 h-11 bg-[#F8F9FC] dark:bg-white/5 text-[12px] font-bold text-gray-500 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 hover:bg-gray-50 transition-all">
            View All Tasks
          </button>
        </div>

        {/* Latest Labs Card */}
        <div className="bg-white dark:bg-[#101935] p-6 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 shadow-none">
          <h3 className="text-[15px] font-bold text-[#1A1C23] dark:text-white mb-6">Latest Labs</h3>
          <div className="space-y-3">
            {labs.map((lab, idx) => (
              <div key={idx} className="p-4 bg-white dark:bg-transparent border border-[#E7E8EB] dark:border-white/10 rounded-[5px] flex items-center justify-between shadow-none">
                <div>
                  <p className="text-[13px] font-bold text-[#1A1C23] dark:text-white mb-1">{lab.name}</p>
                  <p className="text-[11px] font-medium text-gray-400">{lab.time}</p>
                </div>
                <span className={cn(
                  "px-2.5 py-1 rounded-[5px] text-[9px] font-bold border", 
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
