"use client";
import React from "react";

export function OrderInformationCard({ info }) {
  if (!info) return null;

  // Determine priority color tag
  const priorityColors = {
    "Urgent": "bg-rose-500",
    "High": "bg-amber-500",
    "Normal": "bg-emerald-500"
  };

  // Determine general status colors
  const statusColors = {
    "Pending": "bg-[#f1f5f9] text-[#475569] dark:bg-[#334155] dark:text-[#cbd5e1]",
    "Collecting": "bg-[#fef3c7] text-[#b45309] dark:bg-[#78350f]/30 dark:text-[#fcd34d]",
    "Completed": "bg-[#d1fae5] text-[#065f46] dark:bg-[#064e3b]/30 dark:text-[#6ee7b7]"
  };

  const priorityDot = priorityColors[info.priority] || "bg-emerald-500";
  const statusClass = statusColors[info.status] || "bg-[#fef3c7] text-[#b45309]";

  return (
    <div className="bg-card text-card-foreground p-5 rounded-lg border border-border space-y-4 shadow-none">
      <h2 className="text-[15px] font-bold text-foreground">Order Information</h2>
      
      <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-[12px] font-semibold">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Order ID</span>
          <span className="text-foreground">{info.orderId}</span>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Priority</span>
          <div className="flex items-center gap-1.5 font-bold">
            <span className={`w-1.5 h-1.5 rounded-full ${priorityDot}`} />
            <span className="text-foreground">{info.priority}</span>
          </div>
        </div>
        
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Referring Doctor</span>
          <span className="text-foreground">{info.doctor}</span>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Department</span>
          <span className="text-foreground">{info.department}</span>
        </div>
        
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Ordered At</span>
          <span className="text-foreground">{info.orderedAt}</span>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Status</span>
          <div>
            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-[4px] leading-none ${statusClass}`}>
              {info.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
