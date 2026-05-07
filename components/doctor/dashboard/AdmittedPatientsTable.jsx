"use client";

import React from "react";
import { FileText } from "lucide-react";

const admittedPatients = [
  { bed: "W1-102", name: "Robert Chen", info: "45 yrs • M", admitted: "Oct 12, 2023", diagnosis: "Pneumonia", days: 4, avatar: "https://i.pravatar.cc/150?u=3" },
  { bed: "W1-104", name: "Sarah Jenkins", info: "28 yrs • F", admitted: "Oct 14, 2023", diagnosis: "Appendicitis Post-Op", days: 2, avatar: "https://i.pravatar.cc/150?u=4" },
  { bed: "W2-205", name: "Michael O'Connor", info: "62 yrs • M", admitted: "Oct 10, 2023", diagnosis: "Heart Failure", days: 6, avatar: "https://i.pravatar.cc/150?u=5" },
  { bed: "W2-208", name: "Emily Davis", info: "34 yrs • F", admitted: "Oct 15, 2023", diagnosis: "Dehydration", days: 1, avatar: "https://i.pravatar.cc/150?u=6" },
  { bed: "ICU-02", name: "David Smith", info: "55 yrs • M", admitted: "Oct 08, 2023", diagnosis: "Myocardial Infarction", days: 8, avatar: "https://i.pravatar.cc/150?u=7" },
];

export default function AdmittedPatientsTable() {
  return (
    <div className="bg-card border border-border rounded-lg shadow-none overflow-hidden">
      {/* Header */}
      <div className="px-5 md:px-6 py-4 border-b border-border/60">
        <h2 className="text-[15px] font-bold text-[#1e293b] dark:text-foreground">Admitted Patients</h2>
      </div>
      
      {/* Table Content */}
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse min-w-[850px] md:min-w-[900px]">
          <thead>
            <tr className="bg-[#f8fafc] dark:bg-white/5 text-[10px] font-bold text-[#64748b] uppercase tracking-wider">
              <th className="px-4 md:px-6 py-4">Bed No.</th>
              <th className="px-4 md:px-6 py-4">Patient</th>
              <th className="px-4 md:px-6 py-4">Admission Date</th>
              <th className="px-4 md:px-6 py-4">Diagnosis</th>
              <th className="px-4 md:px-6 py-4 text-center">Days Admitted</th>
              <th className="px-4 md:px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {admittedPatients.map((patient, i) => (
              <tr key={i} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 md:px-6 py-4 md:py-5">
                  <span className="px-2.5 md:px-3 py-1.5 bg-[#f1f5f9] dark:bg-white/10 rounded-lg text-[11px] md:text-[12px] font-bold text-[#475569] dark:text-muted-foreground whitespace-nowrap">
                    {patient.bed}
                  </span>
                </td>
                <td className="px-4 md:px-6 py-4 md:py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 md:w-9 md:h-9 rounded-full overflow-hidden border border-border shrink-0 bg-muted">
                      <img src={patient.avatar} alt={patient.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[12px] md:text-[13px] font-bold text-[#1e293b] dark:text-foreground leading-tight">{patient.name}</span>
                      <span className="text-[10px] md:text-[11px] font-medium text-[#64748b] leading-tight">{patient.info}</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 md:px-6 py-4 md:py-5 text-[11px] md:text-[12px] font-medium text-[#64748b] whitespace-nowrap">{patient.admitted}</td>
                <td className="px-4 md:px-6 py-4 md:py-5 text-[11px] md:text-[12px] font-medium text-[#64748b]">{patient.diagnosis}</td>
                <td className="px-4 md:px-6 py-4 md:py-5 text-center">
                  <span className="inline-flex items-center justify-center w-6 h-6 md:w-7 md:h-7 rounded-full bg-[#f0f9ff] text-[11px] md:text-[12px] font-bold text-[#0ea5e9] border border-[#e0f2fe]">
                    {patient.days}
                  </span>
                </td>
                <td className="px-4 md:px-6 py-4 md:py-5">
                  <div className="flex justify-center">
                    <button className="h-8 md:h-9 px-3 md:px-4 bg-primary text-primary-foreground rounded-lg flex items-center gap-2 text-[11px] md:text-[12px] font-bold hover:opacity-90 transition-all shadow-none whitespace-nowrap">
                      <FileText className="w-3.5 md:w-4 h-3.5 md:h-4" />
                      View Chart
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
