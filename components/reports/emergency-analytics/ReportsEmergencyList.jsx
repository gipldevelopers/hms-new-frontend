"use client";

import React from "react";

export function ReportsEmergencyList() {
  const triageBoard = [
    {
      uhid: "#ER-1010",
      name: "Maria Caral",
      triage: "P1",
      arrival: "10:14 AM",
      waiting: "0m",
      doctor: "Dr. Shah",
      ward: "Ward 1",
      status: "Critical CPR",
    },
    {
      uhid: "#ER-2020",
      name: "James Smith",
      triage: "P2",
      arrival: "11:02 AM",
      waiting: "5m",
      doctor: "Dr. Lee",
      ward: "Ward 2",
      status: "Severe Trauma",
    },
    {
      uhid: "#ER-3030",
      name: "Emily Chen",
      triage: "P3",
      arrival: "11:45 AM",
      waiting: "3m",
      doctor: "Dr. Patel",
      ward: "Ward 3",
      status: "Head Injury",
    },
    {
      uhid: "#ER-4040",
      name: "John Doe",
      triage: "P1",
      arrival: "12:30 PM",
      waiting: "0m",
      doctor: "Dr. Kim",
      ward: "Ward 4",
      status: "Heart Attack",
    },
    {
      uhid: "#ER-5050",
      name: "Sophia Johnson",
      triage: "P2",
      arrival: "1:15 PM",
      waiting: "2m",
      doctor: "Dr. White",
      ward: "Ward 5",
      status: "Stroke",
    },
  ];

  return (
    <div className="w-full bg-card rounded-lg border border-border flex flex-col font-sans transition-all overflow-hidden shadow-none hover:border-gray-300 dark:hover:border-white/20">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-[15px] font-bold text-[#1e293b] dark:text-white">
          Live Triage operation Board
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead>
            <tr className="bg-[#F8F9FC] dark:bg-[#0E1528]/50">
              <th className="px-6 py-3 text-left text-[12px] font-bold text-gray-400 dark:text-slate-400">
                UHID
              </th>
              <th className="px-6 py-3 text-left text-[12px] font-bold text-gray-400 dark:text-slate-400">
                Patient Name
              </th>
              <th className="px-6 py-3 text-left text-[12px] font-bold text-gray-400 dark:text-slate-400">
                Triage
              </th>
              <th className="px-6 py-3 text-left text-[12px] font-bold text-gray-400 dark:text-slate-400">
                Arrival
              </th>
              <th className="px-6 py-3 text-left text-[12px] font-bold text-gray-400 dark:text-slate-400">
                Waiting
              </th>
              <th className="px-6 py-3 text-left text-[12px] font-bold text-gray-400 dark:text-slate-400">
                Assignee Doctor
              </th>
              <th className="px-6 py-3 text-left text-[12px] font-bold text-gray-400 dark:text-slate-400">
                Bed/Ward
              </th>
              <th className="px-6 py-3 text-left text-[12px] font-bold text-gray-400 dark:text-slate-400">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {triageBoard.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                {/* UHID */}
                <td className="px-6 py-4 whitespace-nowrap text-[13px] font-bold text-[#3B82F6] dark:text-[#60A5FA] cursor-pointer hover:underline">
                  {row.uhid}
                </td>
                {/* Patient Name */}
                <td className="px-6 py-4 whitespace-nowrap text-[13px] font-semibold text-gray-700 dark:text-slate-200">
                  {row.name}
                </td>
                {/* Triage */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md shrink-0 ${
                      row.triage === "P1"
                        ? "bg-[#FFF1F1] text-[#EF4444] dark:bg-red-950/40 dark:text-red-400"
                        : row.triage === "P2"
                        ? "bg-[#FFFBEB] text-[#F59E0B] dark:bg-amber-950/40 dark:text-amber-400"
                        : "bg-[#ECFDF5] text-[#10B981] dark:bg-emerald-950/40 dark:text-emerald-400"
                    }`}
                  >
                    {row.triage}
                  </span>
                </td>
                {/* Arrival */}
                <td className="px-6 py-4 whitespace-nowrap text-[12px] text-gray-500 dark:text-slate-400">
                  {row.arrival}
                </td>
                {/* Waiting */}
                <td className="px-6 py-4 whitespace-nowrap text-[12px] text-gray-500 dark:text-slate-400">
                  {row.waiting}
                </td>
                {/* Assignee Doctor */}
                <td className="px-6 py-4 whitespace-nowrap text-[12px] text-gray-500 dark:text-slate-400">
                  {row.doctor}
                </td>
                {/* Bed/Ward */}
                <td className="px-6 py-4 whitespace-nowrap text-[12px] text-gray-500 dark:text-slate-400">
                  {row.ward}
                </td>
                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-[10px] font-bold px-2 py-1 bg-[#FFF5F5] text-[#EF4444] dark:bg-red-950/30 dark:text-red-400 rounded-md">
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
