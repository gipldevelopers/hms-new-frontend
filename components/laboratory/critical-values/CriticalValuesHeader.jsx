"use client";
import React from "react";
import { Plus } from "lucide-react";

export function CriticalValuesHeader({ unacknowledgedCount = 2, onReportClick }) {
  return (
    <div className="flex items-center justify-between gap-[10px] w-full select-none">
      <div className="flex items-center gap-3">
        <h1 className="text-[20px] md:text-[24px] font-bold text-foreground tracking-tight leading-none">
          Critical Value Alerts
        </h1>
        {unacknowledgedCount > 0 && (
          <span className="bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 border border-red-500/20 text-[12px] font-bold px-[10px] py-[3.5px] rounded-[5px] inline-flex items-center gap-1.5 shrink-0 select-none shadow-none">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0 animate-pulse" />
            <span>{unacknowledgedCount} Unacknowledged</span>
          </span>
        )}
      </div>
      <button
        onClick={onReportClick}
        className="h-10 px-4 bg-primary text-primary-foreground border border-primary font-bold text-[12.5px] rounded-[5px] hover:bg-primary/95 transition-colors cursor-pointer shadow-none outline-none flex items-center gap-1.5"
      >
        <Plus size={15} className="stroke-[2.5]" />
        <span>Report Critical Value</span>
      </button>
    </div>
  );
}
