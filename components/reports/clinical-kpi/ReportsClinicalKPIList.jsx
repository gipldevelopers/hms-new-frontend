"use client";

import React, { useState } from "react";
import { Filter, Search, Stethoscope } from "lucide-react";

export function ReportsClinicalKPIList() {
  const [department, setDepartment] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const audits = [
    {
      auditId: "#AUD-8012",
      metric: "Sepsis Bundle (3-Hour)",
      department: "ICU",
      doctor: "Dr. A. Sengupta",
      compliance: "98% Compliant",
      status: "Compliant",
      reviewedDate: "20 May 2026",
    },
    {
      auditId: "#AUD-8013",
      metric: "Time-to-Antibiotic (Pneumonia)",
      department: "Emergency Dept",
      doctor: "Dr. Rajesh Shah",
      compliance: "94% Compliant",
      status: "Compliant",
      reviewedDate: "20 May 2026",
    },
    {
      auditId: "#AUD-8014",
      metric: "Discharge Med Reconciliation",
      department: "Cardiology",
      doctor: "Dr. Sarah Patel",
      compliance: "83% Borderline",
      status: "Borderline",
      reviewedDate: "19 May 2026",
    },
    {
      auditId: "#AUD-8015",
      metric: "Pre-op Antibiotic Timing",
      department: "General Surgery",
      doctor: "Dr. David Miller",
      compliance: "99% Compliant",
      status: "Compliant",
      reviewedDate: "19 May 2026",
    },
    {
      auditId: "#AUD-8016",
      metric: "Inpatient VTE Prophylaxis",
      department: "General Medicine",
      doctor: "Dr. Amit Shah",
      compliance: "61% Non-Compliant",
      status: "Non-Compliant",
      reviewedDate: "18 May 2026",
    }
  ];

  const filteredAudits = audits.filter((item) => {
    const matchesDept = department === "All" || item.department === department;
    const matchesQuery =
      item.metric.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.auditId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesQuery;
  });

  return (
    <div className="space-y-[20px] font-sans">
      {/* Specialty Filter Panel */}
      <div className="bg-card rounded-lg border border-border p-4 flex flex-wrap items-center justify-between gap-4 shadow-none">
        <div className="flex items-center gap-2.5">
          <Filter className="w-4.5 h-4.5 text-gray-400 dark:text-slate-500" />
          <span className="text-[13px] font-bold text-gray-600 dark:text-slate-300">
            Filter Registry:
          </span>
          <div className="flex flex-wrap gap-2">
            {["All", "ICU", "Emergency Dept", "Cardiology", "General Surgery", "General Medicine"].map((dept) => (
              <button
                key={dept}
                onClick={() => setDepartment(dept)}
                className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all border ${
                  department === dept
                    ? "bg-[#EEF2FF] border-[#4F46E5] text-[#4F46E5] dark:bg-indigo-950/50 dark:border-indigo-500 dark:text-indigo-300"
                    : "bg-white border-border text-gray-500 hover:bg-gray-50 dark:bg-[#101935] dark:hover:bg-white/5 dark:text-slate-400"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-3.5 w-3.5 text-gray-400" />
          </span>
          <input
            type="text"
            placeholder="Search audits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-1.5 w-[200px] border border-border dark:border-white/10 rounded-lg text-[12px] bg-white dark:bg-[#101935] focus:outline-none focus:ring-1 focus:ring-primary text-gray-700 dark:text-slate-200"
          />
        </div>
      </div>

      {/* Audit Registry Card Table */}
      <div className="w-full bg-card rounded-lg border border-border flex flex-col font-sans transition-all overflow-hidden shadow-none hover:border-gray-300 dark:hover:border-white/20">
        <div className="px-6 py-4 border-b border-border flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-[#3F51B5] dark:text-[#818CF8]" />
          <h3 className="text-[15px] font-bold text-[#1e293b] dark:text-white">
            Clinical Quality Audit & Case Review Registry
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr className="bg-[#F8F9FC] dark:bg-[#0E1528]/50">
                <th className="px-6 py-3 text-left text-[12px] font-bold text-gray-400 dark:text-slate-400">
                  Audit ID
                </th>
                <th className="px-6 py-3 text-left text-[12px] font-bold text-gray-400 dark:text-slate-400">
                  Metric Category
                </th>
                <th className="px-6 py-3 text-left text-[12px] font-bold text-gray-400 dark:text-slate-400">
                  Reviewed Department
                </th>
                <th className="px-6 py-3 text-left text-[12px] font-bold text-gray-400 dark:text-slate-400">
                  Lead Auditor / Doctor
                </th>
                <th className="px-6 py-3 text-left text-[12px] font-bold text-gray-400 dark:text-slate-400">
                  Compliance Rating
                </th>
                <th className="px-6 py-3 text-left text-[12px] font-bold text-gray-400 dark:text-slate-400">
                  Last Reviewed
                </th>
                <th className="px-6 py-3 text-right text-[12px] font-bold text-gray-400 dark:text-slate-400">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredAudits.length > 0 ? (
                filteredAudits.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                    {/* Audit ID */}
                    <td className="px-6 py-4 whitespace-nowrap text-[13px] font-bold text-[#3B82F6] dark:text-blue-400 hover:underline cursor-pointer">
                      {row.auditId}
                    </td>
                    {/* Metric Category */}
                    <td className="px-6 py-4 whitespace-nowrap text-[13px] font-semibold text-gray-700 dark:text-slate-200">
                      {row.metric}
                    </td>
                    {/* Reviewed Department */}
                    <td className="px-6 py-4 whitespace-nowrap text-[13px] text-gray-500 dark:text-slate-400">
                      {row.department}
                    </td>
                    {/* Lead Auditor / Doctor */}
                    <td className="px-6 py-4 whitespace-nowrap text-[12px] text-gray-500 dark:text-slate-400">
                      {row.doctor}
                    </td>
                    {/* Compliance Rating */}
                    <td className="px-6 py-4 whitespace-nowrap text-[12px] text-gray-500 dark:text-slate-400">
                      {row.compliance}
                    </td>
                    {/* Last Reviewed */}
                    <td className="px-6 py-4 whitespace-nowrap text-[12px] text-gray-500 dark:text-slate-400">
                      {row.reviewedDate}
                    </td>
                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {row.status === "Compliant" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#ECFDF5] dark:bg-emerald-950/40 text-[#10B981] dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
                          Compliant
                        </span>
                      ) : row.status === "Borderline" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#FFFBEB] dark:bg-amber-950/20 text-[#D97706] dark:text-amber-400 border border-amber-100 dark:border-amber-900/30">
                          Borderline
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#FFF1F1] dark:bg-red-950/40 text-[#EF4444] dark:text-red-400 border border-red-100 dark:border-red-900/30">
                          Non-Compliant
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-[13px] text-gray-400 dark:text-slate-500">
                    No audits found matching the criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
