"use client";

import React from "react";
import { cn } from "@/lib/utils";

const patients = [
  { id: "#PT-4821", name: "Rajesh Gupta", ward: "ICU / Bed 4A", status: "Critical", date: "19 Apr 2026", statusColor: "rose" },
  { id: "#PT-4820", name: "Meena Patel", ward: "Ward A / Bed 12", status: "Stable", date: "20 Apr 2026", statusColor: "emerald" },
  { id: "#PT-4819", name: "Arjun Mehta", ward: "Private / Room 3", status: "Discharge Due", date: "18 Apr 2026", statusColor: "amber" },
  { id: "#PT-4818", name: "Sunita Sharma", ward: "Ward B / Bed 7", status: "Stable", date: "21 Apr 2026", statusColor: "emerald" },
  { id: "#PT-4817", name: "Vikram Singh", ward: "Emergency / E2", status: "P1 - High", date: "21 Apr 2026", statusColor: "rose" },
];

export default function AdmittedPatientsTable() {
  return (
    <div className="bg-white dark:bg-[#101935] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 shadow-none overflow-hidden">
      <div className="p-5 border-b border-[#E7E8EB] dark:border-white/10">
        <h3 className="text-[14px] font-bold text-[#1A1C23] dark:text-white uppercase-none">Admitted Patient</h3>
      </div>
      
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-[#F8F9FA] dark:bg-[#151D36]">
              <th className="px-6 py-4 text-left text-[11px] font-bold text-[#5E6C84] dark:text-slate-400 border-b border-[#E7E8EB] dark:border-white/10 tracking-tight uppercase-none">Patient ID</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-[#5E6C84] dark:text-slate-400 border-b border-[#E7E8EB] dark:border-white/10 tracking-tight uppercase-none">Patient Name</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-[#5E6C84] dark:text-slate-400 border-b border-[#E7E8EB] dark:border-white/10 tracking-tight uppercase-none">Ward / Bed</th>
              <th className="px-6 py-4 text-center text-[11px] font-bold text-[#5E6C84] dark:text-slate-400 border-b border-[#E7E8EB] dark:border-white/10 tracking-tight uppercase-none">Status</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-[#5E6C84] dark:text-slate-400 border-b border-[#E7E8EB] dark:border-white/10 tracking-tight uppercase-none">Admission Date</th>
              <th className="px-6 py-4 text-center text-[11px] font-bold text-[#5E6C84] dark:text-slate-400 border-b border-[#E7E8EB] dark:border-white/10 tracking-tight uppercase-none">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E7E8EB] dark:divide-white/10">
            {patients.map((patient, idx) => (
              <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all">
                <td className="px-6 py-4">
                  <span className="text-[13px] font-bold text-primary">{patient.id}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[13px] font-bold text-[#1A1C23] dark:text-white">{patient.name}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[13px] font-medium text-[#5E6C84] dark:text-slate-400">{patient.ward}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold",
                    patient.statusColor === "rose" && "bg-rose-50 text-rose-500",
                    patient.statusColor === "emerald" && "bg-emerald-50 text-emerald-500",
                    patient.statusColor === "amber" && "bg-amber-50 text-amber-500",
                  )}>
                    {patient.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[13px] font-medium text-[#5E6C84] dark:text-slate-400">{patient.date}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button className="text-[12px] font-bold text-primary hover:underline">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
