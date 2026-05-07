"use client";

import React from "react";

export default function RevenueOverview() {
  return (
    <div className="bg-card border border-border rounded-lg shadow-none overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="px-5 md:px-6 py-4 border-b border-border/60 flex justify-between items-center shrink-0">
        <h2 className="text-[15px] font-bold text-foreground">Pending Payments & Revenue</h2>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
        <div className="space-y-8 md:space-y-12">
          {/* Collected Today */}
          <div className="space-y-2">
            <p className="text-[13px] font-medium text-muted-foreground">Collected Today</p>
            <p className="text-[32px] md:text-[36px] font-bold text-foreground leading-none tracking-tight">₹12,450</p>
          </div>

          {/* Pending Payments */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <p className="text-[13px] font-medium text-muted-foreground">Pending Payments</p>
              <p className="text-[14px] font-bold text-rose-600">₹1,240</p>
            </div>
            {/* Progress Bar */}
            <div className="h-1.5 bg-muted rounded-full overflow-hidden flex">
              <div className="h-full bg-rose-500 rounded-full w-[25%]" />
              <div className="h-full bg-slate-200 dark:bg-slate-800 flex-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
