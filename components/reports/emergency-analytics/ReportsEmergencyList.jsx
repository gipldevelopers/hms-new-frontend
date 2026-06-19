"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";

export function ReportsEmergencyList({ triageBoard = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);

  const displayBoard = triageBoard.length > 0 ? triageBoard : [
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

  const filtered = displayBoard.filter(item => 
    item.uhid.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.triage.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedItems = filtered.slice(0, pageSize);

  return (
    <div className="w-full bg-card rounded-lg border border-border flex flex-col font-sans transition-all overflow-hidden shadow-none hover:border-gray-300 dark:hover:border-white/20">
      <div className="px-6 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h3 className="text-[15px] font-bold text-[#1e293b] dark:text-white shrink-0">
          Live Triage operation Board
        </h3>
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search patient, doctor, UHID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPageSize(10); // reset page size on search
            }}
            className="w-full pl-9 pr-4 py-1.5 border border-[#E7E8EB] dark:border-white/10 rounded-lg text-[12px] bg-white dark:bg-[#101935] text-gray-700 dark:text-slate-200 placeholder-gray-400 focus:outline-none focus:border-primary transition-all"
          />
        </div>
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
            {paginatedItems.map((row, i) => (
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
            {paginatedItems.length === 0 && (
              <tr>
                <td colSpan="8" className="px-6 py-10 text-center text-[13px] text-gray-400 dark:text-slate-500">
                  No active cases matching the filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filtered.length > pageSize && (
        <div className="px-6 py-3 border-t border-border flex justify-center bg-gray-50/30 dark:bg-[#0E1528]/10">
          <button 
            onClick={() => setPageSize(prev => prev + 15)}
            className="text-[12px] font-bold text-[#3B82F6] dark:text-blue-400 hover:underline"
          >
            Show More ({filtered.length - pageSize} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
