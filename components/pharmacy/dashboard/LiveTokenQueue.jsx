"use client";
import React from "react";

export function LiveTokenQueue() {
  const data = [
    { token: "T-104", patient: "John Doe", ward: "OPD", doctor: "Dr. Smith", wait: "5 mins", status: "Next", statusColor: "bg-[#e0e7ff] text-[#4338ca]" },
    { token: "T-105", patient: "Alice Johnson", ward: "Emergency", doctor: "Dr. Lee", wait: "10 mins", status: "Processing", statusColor: "bg-[#dbeafe] text-[#1e40af]" },
    { token: "T-106", patient: "Michael Brown", ward: "IPD", doctor: "Dr. Adams", wait: "15 mins", status: "Waiting", statusColor: "bg-[#f1f5f9] text-[#475569]" },
    { token: "T-107", patient: "Emily Davis", ward: "Discharge", doctor: "Dr. White", wait: "20 mins", status: "Waiting", statusColor: "bg-[#f1f5f9] text-[#475569]" },
    { token: "T-108", patient: "Sarah Miller", ward: "OPD", doctor: "Dr. Clark", wait: "22 mins", status: "Waiting", statusColor: "bg-[#f1f5f9] text-[#475569]" },
    { token: "T-109", patient: "David Wilson", ward: "IPD", doctor: "Dr. Evans", wait: "25 mins", status: "Waiting", statusColor: "bg-[#f1f5f9] text-[#475569]" },
    { token: "T-110", patient: "Laura Taylor", ward: "Emergency", doctor: "Dr. Moore", wait: "30 mins", status: "Waiting", statusColor: "bg-[#f1f5f9] text-[#475569]" },
    { token: "T-111", patient: "James Anderson", ward: "OPD", doctor: "Dr. King", wait: "45 mins", status: "Waiting", statusColor: "bg-[#f1f5f9] text-[#475569]" },
  ];

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] overflow-hidden">
      <div className="p-6 flex justify-between items-center border-b border-[#e2e8f0] dark:border-[#334155]">
        <h2 className="text-[16px] font-bold text-[#1e293b] dark:text-white">Live Token Queue</h2>
        <button className="text-[12px] font-semibold px-4 py-1.5 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] transition-colors">
          View all
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#f8fafc] dark:bg-[#1e293b]">
            <tr>
              <th className="px-6 py-4 text-[12px] font-bold text-[#64748b] dark:text-[#94a3b8]">Token</th>
              <th className="px-6 py-4 text-[12px] font-bold text-[#64748b] dark:text-[#94a3b8]">Patient</th>
              <th className="px-6 py-4 text-[12px] font-bold text-[#64748b] dark:text-[#94a3b8]">Ward/Type</th>
              <th className="px-6 py-4 text-[12px] font-bold text-[#64748b] dark:text-[#94a3b8]">Doctor</th>
              <th className="px-6 py-4 text-[12px] font-bold text-[#64748b] dark:text-[#94a3b8]">Wait/Time</th>
              <th className="px-6 py-4 text-[12px] font-bold text-[#64748b] dark:text-[#94a3b8]">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e2e8f0] dark:divide-[#334155]">
            {data.map((row, i) => (
              <tr key={i} className="transition-colors">
                <td className="px-6 py-4 text-[13px] font-bold text-[#1e293b] dark:text-white">{row.token}</td>
                <td className="px-6 py-4 text-[13px] font-medium text-[#475569] dark:text-[#cbd5e1]">{row.patient}</td>
                <td className="px-6 py-4">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-[4px] bg-[#f1f5f9] dark:bg-[#334155] text-[#475569] dark:text-[#94a3b8]">
                    {row.ward}
                  </span>
                </td>
                <td className="px-6 py-4 text-[13px] font-medium text-[#475569] dark:text-[#cbd5e1]">{row.doctor}</td>
                <td className="px-6 py-4 text-[13px] font-medium text-[#475569] dark:text-[#cbd5e1]">{row.wait}</td>
                <td className="px-6 py-4">
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-[4px] ${row.statusColor}`}>
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
