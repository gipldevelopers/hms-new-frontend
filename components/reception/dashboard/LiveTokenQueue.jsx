"use client";

import React from "react";
import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

const tokens = [
  { id: "A-101", patient: "Robert Fox", doctor: "Dr. Sarah Smith", dept: "Cardiology", status: "Next", time: "5 mins", color: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 border-amber-100 dark:border-amber-500/20" },
  { id: "B-042", patient: "Esther Howard", doctor: "Dr. John Doe", dept: "Neurology", status: "Waiting", time: "15 mins", color: "bg-sky-50 dark:bg-sky-500/10 text-sky-600 border-sky-100 dark:border-sky-500/20" },
  { id: "A-102", patient: "Jenny Wilson", doctor: "Dr. Sarah Smith", dept: "Cardiology", status: "Waiting", time: "20 mins", color: "bg-sky-50 dark:bg-sky-500/10 text-sky-600 border-sky-100 dark:border-sky-500/20" },
];

export default function LiveTokenQueue() {
  return (
    <div className="bg-card border border-border rounded-lg shadow-none overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="px-5 md:px-6 py-4 border-b border-border/60 flex justify-between items-center shrink-0">
        <h2 className="text-[15px] font-bold text-foreground">Live Token Queue</h2>
        <button className="h-8 px-3 border border-border rounded-lg text-[11px] font-bold text-muted-foreground hover:bg-muted transition-all">
          View all
        </button>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto no-scrollbar flex-1">
        <table className="w-full text-left border-collapse min-w-[650px] md:min-w-[700px]">
          <thead>
            <tr className="bg-muted/50 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              <th className="px-5 md:px-6 py-4">Token</th>
              <th className="px-5 md:px-6 py-4">Patient</th>
              <th className="px-5 md:px-6 py-4">Doctor</th>
              <th className="px-5 md:px-6 py-4">Status</th>
              <th className="px-5 md:px-6 py-4">Wait Time</th>
              <th className="px-5 md:px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tokens.map((token, i) => (
              <tr key={i} className="hover:bg-muted/30 transition-colors">
                <td className="px-5 md:px-6 py-4 md:py-5 text-[13px] font-bold text-foreground">{token.id}</td>
                <td className="px-5 md:px-6 py-4 md:py-5 text-[13px] font-medium text-foreground">{token.patient}</td>
                <td className="px-5 md:px-6 py-4 md:py-5">
                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold text-foreground leading-tight">{token.doctor}</span>
                    <span className="text-[11px] font-medium text-muted-foreground leading-tight">{token.dept}</span>
                  </div>
                </td>
                <td className="px-5 md:px-6 py-4 md:py-5">
                  <span className={cn(
                    "px-2.5 py-1 rounded-lg text-[10px] font-bold border",
                    token.color
                  )}>
                    {token.status}
                  </span>
                </td>
                <td className="px-5 md:px-6 py-4 md:py-5 text-[12px] font-medium text-muted-foreground">{token.time}</td>
                <td className="px-5 md:px-6 py-4 md:py-5">
                  <div className="flex justify-center items-center gap-2">
                    {token.status === "Next" ? (
                      <button className="h-8 px-5 bg-primary text-primary-foreground rounded-lg text-[11px] font-bold hover:opacity-90 transition-all shadow-none">
                        Call
                      </button>
                    ) : (
                      <button className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    )}
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
