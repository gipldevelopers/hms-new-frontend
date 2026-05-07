"use client";

import React from "react";

const appointments = [
  { time: "10:00 AM", patient: "Cameron Williamson", type: "Consultation", doctor: "Dr. Michael" },
  { time: "10:30 AM", patient: "Brooklyn Simmons", type: "Follow-up", doctor: "Dr. Sarah" },
];

export default function TodayAppointments() {
  return (
    <div className="bg-card border border-border rounded-lg shadow-none overflow-hidden">
      {/* Header */}
      <div className="px-5 md:px-6 py-4 border-b border-border/60 flex justify-between items-center shrink-0">
        <h2 className="text-[15px] font-bold text-foreground">Today's Appointments</h2>
        <button className="h-8 px-3 border border-border rounded-lg text-[11px] font-bold text-muted-foreground hover:bg-muted transition-all">
          View all
        </button>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse min-w-[650px] md:min-w-[700px]">
          <thead>
            <tr className="bg-muted/50 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              <th className="px-5 md:px-6 py-4">Time</th>
              <th className="px-5 md:px-6 py-4">Patient</th>
              <th className="px-5 md:px-6 py-4">Doctor</th>
              <th className="px-5 md:px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {appointments.map((apt, i) => (
              <tr key={i} className="hover:bg-muted/30 transition-colors">
                <td className="px-5 md:px-6 py-4 md:py-5 text-[13px] font-bold text-foreground whitespace-nowrap">{apt.time}</td>
                <td className="px-5 md:px-6 py-4 md:py-5">
                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold text-foreground leading-tight">{apt.patient}</span>
                    <span className="text-[11px] font-medium text-muted-foreground leading-tight">{apt.type}</span>
                  </div>
                </td>
                <td className="px-5 md:px-6 py-4 md:py-5 text-[13px] font-medium text-foreground whitespace-nowrap">{apt.doctor}</td>
                <td className="px-5 md:px-6 py-4 md:py-5">
                  <div className="flex justify-center">
                    <button className="h-8 px-4 border border-border rounded-lg text-[11px] font-bold text-foreground hover:bg-muted transition-all shadow-none whitespace-nowrap">
                      Check-In
                    </button>
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
