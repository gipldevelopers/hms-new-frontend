"use client";

import React from "react";

export function ReportsBedAllocations() {
  const allocations = [
    {
      bedNumber: "#B-101",
      ward: "ICU",
      patientName: "Meena Patel",
      admissionDate: "12 Oct 2025",
      expDischarge: "18 Oct 2025",
      status: "Occupied",
    },
    {
      bedNumber: "#B-102",
      ward: "ICU",
      patientName: "-",
      admissionDate: "-",
      expDischarge: "-",
      status: "Cleaning",
    },
    {
      bedNumber: "#B-103",
      ward: "ICU",
      patientName: "-",
      admissionDate: "-",
      expDischarge: "-",
      status: "Available",
    },
    {
      bedNumber: "#B-104",
      ward: "ICU",
      patientName: "Tommy Lee",
      admissionDate: "19 Oct 2025",
      expDischarge: "26 Oct 2025",
      status: "Occupied",
    },
  ];

  return (
    <div className="w-full bg-card rounded-lg border border-border flex flex-col font-sans transition-all overflow-hidden shadow-none hover:border-gray-300 dark:hover:border-white/20">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-[15px] font-bold text-[#1e293b] dark:text-white">
          Live Bed Status
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead>
            <tr className="bg-[#F8F9FC] dark:bg-[#0E1528]/50">
              <th className="px-6 py-3 text-left text-[12px] font-bold text-gray-400 dark:text-slate-400">
                Bed Number
              </th>
              <th className="px-6 py-3 text-left text-[12px] font-bold text-gray-400 dark:text-slate-400">
                Ward / Bed
              </th>
              <th className="px-6 py-3 text-left text-[12px] font-bold text-gray-400 dark:text-slate-400">
                Patient Name
              </th>
              <th className="px-6 py-3 text-left text-[12px] font-bold text-gray-400 dark:text-slate-400">
                Admission Date
              </th>
              <th className="px-6 py-3 text-left text-[12px] font-bold text-gray-400 dark:text-slate-400">
                Exp. Discharge
              </th>
              <th className="px-6 py-3 text-right text-[12px] font-bold text-gray-400 dark:text-slate-400">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {allocations.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-[13px] font-bold text-[#3B82F6] dark:text-blue-400 hover:underline cursor-pointer">
                  {item.bedNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-[13px] font-medium text-gray-700 dark:text-slate-200">
                  {item.ward}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-[13px] text-gray-500 dark:text-slate-400">
                  {item.patientName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-[12px] text-gray-500 dark:text-slate-400">
                  {item.admissionDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-[12px] text-gray-500 dark:text-slate-400">
                  {item.expDischarge}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  {item.status === "Occupied" ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#2E37A45E]/60 dark:bg-indigo-950/40 text-[#3F51B5] dark:text-[#818CF8] border border-indigo-100/50 dark:border-indigo-900/30">
                      Occupied
                    </span>
                  ) : item.status === "Cleaning" ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#FFFBEB] dark:bg-amber-950/20 text-[#D97706] dark:text-amber-400 border border-amber-100 dark:border-amber-900/30">
                      Cleaning
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#EEFDF5] dark:bg-emerald-950/40 text-[#10B981] dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
                      Available
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
