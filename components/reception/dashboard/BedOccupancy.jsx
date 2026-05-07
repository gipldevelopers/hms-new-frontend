"use client";

import React from "react";
import { cn } from "@/lib/utils";

const wards = [
  { name: "General Ward", value: 45, total: 50, color: "bg-amber-500" },
  { name: "ICU", value: 12, total: 15, color: "bg-amber-500" },
  { name: "Private Rooms", value: 8, total: 20, color: "bg-emerald-500", status: "Available" },
  { name: "Emergency", value: 10, total: 10, color: "bg-rose-500", status: "Full" },
];

export default function BedOccupancy() {
  return (
    <div className="bg-card border border-border rounded-lg shadow-none overflow-hidden">
      {/* Header */}
      <div className="px-5 md:px-6 py-4 border-b border-border/60">
        <h2 className="text-[15px] font-bold text-foreground">Bed Occupancy Status</h2>
      </div>

      {/* Grid Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {wards.map((ward, i) => {
            const percentage = Math.round((ward.value / ward.total) * 100);
            return (
              <div key={i} className="bg-muted/30 border border-border/60 rounded-lg p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-[13px] font-medium text-muted-foreground">{ward.name}</p>
                    <p className="text-[20px] font-bold text-foreground">
                      {ward.value}<span className="text-[14px] text-muted-foreground font-medium">/{ward.total}</span>
                    </p>
                  </div>
                  {ward.status && (
                    <span className={cn(
                      "px-2 py-0.5 rounded-lg text-[9px] font-bold tracking-wider border",
                      ward.status === "Available" ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border-emerald-100 dark:border-emerald-500/20" : "bg-rose-50 dark:bg-rose-500/10 text-rose-600 border-rose-100 dark:border-rose-500/20"
                    )}>
                      {ward.status}
                    </span>
                  )}
                  {!ward.status && (
                    <span className="text-[10px] font-bold text-amber-600">{percentage}% Full</span>
                  )}
                </div>
                {/* Progress Bar */}
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full transition-all duration-500", ward.color)} style={{ width: `${percentage}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
