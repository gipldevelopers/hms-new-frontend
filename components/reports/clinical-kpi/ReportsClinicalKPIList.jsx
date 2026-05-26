"use client";

import React from "react";

export function ReportsClinicalKPIList() {
  const performanceData = [
    {
      department: "Cardiology",
      avgLos: "4.2d",
      readmission: "8.4%",
      infection: "1.2%",
      mortality: "1.8%",
      recovery: "92%",
      kpiScore: "94/100"
    },
    {
      department: "Cardiology",
      avgLos: "4.2d",
      readmission: "8.4%",
      infection: "1.2%",
      mortality: "1.8%",
      recovery: "92%",
      kpiScore: "94/100"
    },
    {
      department: "Neurology",
      avgLos: "3.9d",
      readmission: "7.1%",
      infection: "1.5%",
      mortality: "2.1%",
      recovery: "88%",
      kpiScore: "90/100"
    },
    {
      department: "Orthopedics",
      avgLos: "4.5d",
      readmission: "6.5%",
      infection: "1.8%",
      mortality: "1.5%",
      recovery: "91%",
      kpiScore: "93/100"
    },
    {
      department: "Pediatrics",
      avgLos: "4.0d",
      readmission: "7.8%",
      infection: "1.1%",
      mortality: "2.0%",
      recovery: "90%",
      kpiScore: "95/100"
    }
  ];

  return (
    <div className="space-y-[20px] font-sans">
      {/* Department Clinical Performance Card Table */}
      <div className="w-full bg-card rounded-lg border border-border flex flex-col font-sans transition-all overflow-hidden shadow-none hover:border-gray-300 dark:hover:border-white/20">
        <div className="px-6 py-4 border-b border-border flex items-center">
          <h3 className="text-[15px] font-bold text-[#1e293b] dark:text-white">
            Department Clinical Performance
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr className="bg-[#F8F9FC] dark:bg-[#0E1528]/50">
                <th className="px-6 py-3.5 text-left text-[12px] font-bold text-gray-400 dark:text-slate-400 tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3.5 text-left text-[12px] font-bold text-gray-400 dark:text-slate-400 tracking-wider">
                  Avg. LOS
                </th>
                <th className="px-6 py-3.5 text-left text-[12px] font-bold text-gray-400 dark:text-slate-400 tracking-wider">
                  Readmission
                </th>
                <th className="px-6 py-3.5 text-left text-[12px] font-bold text-gray-400 dark:text-slate-400 tracking-wider">
                  Infection
                </th>
                <th className="px-6 py-3.5 text-left text-[12px] font-bold text-gray-400 dark:text-slate-400 tracking-wider">
                  Mortality
                </th>
                <th className="px-6 py-3.5 text-left text-[12px] font-bold text-gray-400 dark:text-slate-400 tracking-wider">
                  Recovery
                </th>
                <th className="px-6 py-3.5 text-left text-[12px] font-bold text-gray-400 dark:text-slate-400 tracking-wider">
                  KPI Score
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-white dark:bg-[#101935]/20">
              {performanceData.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors"
                >
                  {/* Department (Blue Link) */}
                  <td className="px-6 py-4 whitespace-nowrap text-[13px] font-semibold text-[#3B82F6] dark:text-blue-400 hover:underline cursor-pointer">
                    {row.department}
                  </td>
                  {/* Avg. LOS */}
                  <td className="px-6 py-4 whitespace-nowrap text-[13px] text-gray-500 dark:text-slate-300 font-medium">
                    {row.avgLos}
                  </td>
                  {/* Readmission */}
                  <td className="px-6 py-4 whitespace-nowrap text-[13px] text-gray-500 dark:text-slate-300 font-medium">
                    {row.readmission}
                  </td>
                  {/* Infection */}
                  <td className="px-6 py-4 whitespace-nowrap text-[13px] text-gray-500 dark:text-slate-300 font-medium">
                    {row.infection}
                  </td>
                  {/* Mortality */}
                  <td className="px-6 py-4 whitespace-nowrap text-[13px] text-gray-500 dark:text-slate-300 font-medium">
                    {row.mortality}
                  </td>
                  {/* Recovery (Green text) */}
                  <td className="px-6 py-4 whitespace-nowrap text-[13px] text-[#2ECC71] dark:text-emerald-400 font-bold">
                    {row.recovery}
                  </td>
                  {/* KPI Score */}
                  <td className="px-6 py-4 whitespace-nowrap text-[13px] text-gray-500 dark:text-slate-300 font-medium">
                    {row.kpiScore}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
