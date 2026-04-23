"use client";

import React from "react";
import { Plus } from "lucide-react";

const patients = [
  {
    id: "#PT-4821",
    name: "Rajesh Gupta",
    ward: "ICU / Bed 4A",
    doctor: "Dr. R. Sharma",
    status: "Critical",
    statusColor: "bg-red-50 text-red-600",
    date: "18 Apr 2026",
  },
  {
    id: "#PT-4820",
    name: "Meena Patel",
    ward: "Ward A / Bed 12",
    doctor: "Dr. P. Mehta",
    status: "Stable",
    statusColor: "bg-green-50 text-green-600",
    date: "20 Apr 2026",
  },
  {
    id: "#PT-4819",
    name: "Arun Mehta",
    ward: "Private / Room 3",
    doctor: "Dr. A. Kumar",
    status: "Discharging",
    statusColor: "bg-orange-50 text-orange-600",
    date: "18 Apr 2026",
  },
  {
    id: "#PT-4818",
    name: "Sunita Sharma",
    ward: "Ward B / Bed 7",
    doctor: "Dr. S. Verma",
    status: "Stable",
    statusColor: "bg-green-50 text-green-600",
    date: "21 Apr 2026",
  },
  {
    id: "#PT-4817",
    name: "Vikram Singh",
    ward: "Emergency / E2",
    doctor: "Dr. R. Sharma",
    status: "PT - High",
    statusColor: "bg-pink-50 text-pink-600",
    date: "21 Apr 2026",
  },
];

export function PatientActivity() {
  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 overflow-hidden">
      <div className="flex justify-between items-center p-5">
        <h3 className="text-[16px] font-bold text-[#1e293b] dark:text-white">
          Today&apos;s Patient Activity
        </h3>
        <button className="flex items-center gap-1.5 bg-[#2E37A4] text-white px-3 py-1.5 rounded-[5px] text-[11px] font-bold hover:bg-opacity-90 transition-all">
          <Plus className="w-3.5 h-3.5" />
          New Admission
        </button>
      </div>

      <div className="border-b border-[#E7E8EB] dark:border-white/10 w-full"></div>

      <div className="p-5">
        <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-50 dark:border-gray-800">
              <th className="pb-4 text-[11px] font-bold text-gray-400 uppercase tracking-wide">Patient ID</th>
              <th className="pb-4 text-[11px] font-bold text-gray-400 uppercase tracking-wide">Patient Name</th>
              <th className="pb-4 text-[11px] font-bold text-gray-400 uppercase tracking-wide">Ward / Bed</th>
              <th className="pb-4 text-[11px] font-bold text-gray-400 uppercase tracking-wide">Doctor</th>
              <th className="pb-4 text-[11px] font-bold text-gray-400 uppercase tracking-wide">Status</th>
              <th className="pb-4 text-[11px] font-bold text-gray-400 uppercase tracking-wide">Admission Date</th>
              <th className="pb-4 text-[11px] font-bold text-gray-400 uppercase tracking-wide">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
            {patients.map((patient, idx) => (
              <tr key={idx} className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="py-4 text-[12px] font-bold text-[#3B82F6]">{patient.id}</td>
                <td className="py-4 text-[12px] font-bold text-gray-700 dark:text-gray-200">{patient.name}</td>
                <td className="py-4 text-[12px] font-medium text-gray-500">{patient.ward}</td>
                <td className="py-4 text-[12px] font-medium text-gray-500">{patient.doctor}</td>
                <td className="py-4">
                  <span className={`px-2 py-0.5 rounded-[3px] text-[10px] font-bold ${patient.statusColor}`}>
                    {patient.status}
                  </span>
                </td>
                <td className="py-4 text-[12px] font-medium text-gray-500">{patient.date}</td>
                <td className="py-4">
                  <button className="text-[12px] font-bold text-[#3B82F6] hover:underline">
                    View
                  </button>
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
