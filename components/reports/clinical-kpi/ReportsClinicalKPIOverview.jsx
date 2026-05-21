"use client";

import React from "react";
import { ClipboardCheck, ShieldCheck } from "lucide-react";

export function ReportsClinicalKPIOverview() {
  const qualityIndicators = [
    { name: "Sepsis Bundle Compliance (3-Hour)", rate: 96.4, target: 95.0, count: "134/139 Cases", trend: "up" },
    { name: "Hand Hygiene Compliance Rate", rate: 98.2, target: 95.0, count: "1,248 Audits", trend: "up" },
    { name: "Medication Reconciliation on Discharge", rate: 95.8, target: 98.0, count: "412/430 Patients", trend: "down" },
    { name: "Stroke Thrombolytic Therapy (<60 min)", rate: 92.5, target: 90.0, count: "37/40 Cases", trend: "up" },
    { name: "Prophylactic Antibiotic (Pre-op 1hr)", rate: 99.1, target: 98.0, count: "214/216 Procedures", trend: "up" }
  ];

  const complianceRates = [
    { label: "CPOE Usage Rate", rate: "99.4%", desc: "Computerized Physician Order Entry" },
    { label: "VTE Prophylaxis Rate", rate: "97.8%", desc: "Venous Thromboembolism prevention" },
    { label: "Time-to-Antibiotic (Pneumonia)", rate: "2.8 hrs", desc: "Door-to-dose average" },
    { label: "Discharge Summary Completion", rate: "1.4 hrs", desc: "Average post-discharge completion" }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-[20px] font-sans">
      {/* Quality Measures Compliance */}
      <div className="lg:col-span-8 bg-card rounded-lg border border-border flex flex-col shadow-none hover:border-gray-300 dark:hover:border-white/20 transition-all">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-primary" />
            <h3 className="text-[15px] font-bold text-[#1e293b] dark:text-white">
              Clinical Quality Indicators Compliance
            </h3>
          </div>
          <span className="text-[11px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded">
            Goal: &gt;95%
          </span>
        </div>

        <div className="p-6 flex-1 flex flex-col justify-between gap-5">
          {qualityIndicators.map((qi, idx) => (
            <div key={idx} className="space-y-1.5 w-full">
              <div className="flex justify-between items-center text-[12px] font-semibold text-gray-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#4F46E5] rounded-full shrink-0"></span>
                  <span className="font-bold">{qi.name}</span>
                </div>
                <span className="font-bold text-gray-500 dark:text-slate-400">
                  {qi.rate}% <span className="text-gray-300 dark:text-slate-600 font-medium">|</span> {qi.count}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    qi.rate >= qi.target ? "bg-[#0D9488]" : "bg-[#EF4444]"
                  }`}
                  style={{ width: `${qi.rate}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Physician Performance Metrics */}
      <div className="lg:col-span-4 bg-card rounded-lg border border-border flex flex-col shadow-none hover:border-gray-300 dark:hover:border-white/20 transition-all">
        <div className="px-6 py-4 border-b border-border flex items-center gap-2 shrink-0">
          <ShieldCheck className="w-5 h-5 text-[#3F51B5] dark:text-[#818CF8]" />
          <h3 className="text-[15px] font-bold text-[#1e293b] dark:text-white">
            Clinical Process & Efficiency
          </h3>
        </div>

        <div className="p-6 flex-1 flex flex-col justify-between gap-4">
          {complianceRates.map((item, idx) => (
            <div
              key={idx}
              className="p-3 bg-[#F8F9FC] dark:bg-[#1E293B]/30 rounded-lg flex justify-between items-center"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-[12px] font-bold text-gray-700 dark:text-slate-200">
                  {item.label}
                </span>
                <span className="text-[10px] text-gray-400 dark:text-slate-500 font-semibold leading-none">
                  {item.desc}
                </span>
              </div>
              <span className="text-[15px] font-black text-primary dark:text-[#818CF8]">
                {item.rate}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
