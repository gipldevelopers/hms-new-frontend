"use client";
import React from "react";
import { MoreVertical } from "lucide-react";

export function LiveOrderQueue() {
  const queueData = [
    {
      orderId: "ORD-8901",
      patient: "Sarah Jenkins",
      doctor: "Dr. Sarah Smith",
      dept: "Emergency",
      status: "Next",
      statusColor: "bg-[#ffedd5] text-[#ea580c] dark:bg-[#7c2d12]/30 dark:text-[#fdba74]",
      waitTime: "10 mins"
    },
    {
      orderId: "ORD-8902",
      patient: "Michael Chang",
      doctor: "Dr. John Doe",
      dept: "Cardiology",
      status: "Waiting",
      statusColor: "bg-[#dbeafe] text-[#2563eb] dark:bg-[#1e3a8a]/30 dark:text-[#93c5fd]",
      waitTime: "25 mins"
    },
    {
      orderId: "ORD-8903",
      patient: "Emma Watson",
      doctor: "Dr. Sarah Smith",
      dept: "Endocrinology",
      status: "Waiting",
      statusColor: "bg-[#dbeafe] text-[#2563eb] dark:bg-[#1e3a8a]/30 dark:text-[#93c5fd]",
      waitTime: "1 hr"
    },
    {
      orderId: "ORD-8904",
      patient: "James Smith",
      doctor: "Dr. Michael",
      dept: "Infectious Disease",
      status: "Processing",
      statusColor: "bg-[#f3e8ff] text-[#7c3aed] dark:bg-[#581c87]/30 dark:text-[#d8b4fe]",
      waitTime: "2 hrs"
    },
    {
      orderId: "ORD-8905",
      patient: "Olivia Davis",
      doctor: "Dr. Sarah Smith",
      dept: "Emergency",
      status: "Next",
      statusColor: "bg-[#ffedd5] text-[#ea580c] dark:bg-[#7c2d12]/30 dark:text-[#fdba74]",
      waitTime: "5 mins"
    }
  ];

  return (
    <div className="bg-card text-card-foreground rounded-lg border border-border overflow-hidden w-full">
      {/* Header */}
      <div className="px-5 py-3 flex justify-between items-center border-b border-border">
        <h2 className="text-[15px] font-bold text-foreground">Live Order Queue</h2>
        <button className="text-[11px] font-semibold px-3 py-1 rounded-lg border border-border text-muted-foreground hover:bg-muted/50 transition-colors">
          View all
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse min-w-[600px] md:min-w-0">
          <thead>
            <tr className="bg-muted/20 border-b border-border">
              <th className="px-5 py-2 text-[11px] font-bold text-muted-foreground">Order</th>
              <th className="px-5 py-2 text-[11px] font-bold text-muted-foreground">Patient</th>
              <th className="px-5 py-2 text-[11px] font-bold text-muted-foreground">Doctor</th>
              <th className="px-5 py-2 text-[11px] font-bold text-muted-foreground">Status</th>
              <th className="px-5 py-2 text-[11px] font-bold text-muted-foreground">Wait Time</th>
              <th className="px-5 py-2 text-right text-[11px] font-bold text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {queueData.map((row, index) => (
              <tr key={index} className="hover:bg-muted/10 transition-colors">
                <td className="px-5 py-2 text-[12px] font-bold text-foreground">
                  {row.orderId}
                </td>
                <td className="px-5 py-2 text-[12px] font-semibold text-foreground">
                  {row.patient}
                </td>
                <td className="px-5 py-2 text-[12px]">
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground">{row.doctor}</span>
                    <span className="text-[10px] text-muted-foreground mt-0.5">{row.dept}</span>
                  </div>
                </td>
                <td className="px-5 py-2">
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-[4px] leading-none ${row.statusColor}`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-5 py-2 text-[12px] font-medium text-foreground">
                  {row.waitTime}
                </td>
                <td className="px-5 py-2 text-right">
                  <button className="text-muted-foreground hover:text-foreground p-0.5 rounded hover:bg-muted/50 transition-colors">
                    <MoreVertical size={14} />
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
