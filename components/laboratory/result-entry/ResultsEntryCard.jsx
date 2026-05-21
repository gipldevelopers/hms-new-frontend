"use client";
import React from "react";

export function ResultsEntryCard({ item, onViewDetails }) {
  const isUrgent = item.status === "Urgent";
  const isHigh = item.status === "High";
  const isNormal = item.status === "Normal";

  return (
    <div className="bg-card border border-border rounded-[5px] p-[20px] flex flex-col md:flex-row md:items-center justify-between gap-[20px] transition-colors duration-150 shadow-none hover:shadow-none">
      
      {/* Left Column: Demographics & Test info */}
      <div className="flex flex-col items-start gap-3">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-[15px] font-bold text-foreground leading-snug">
            {item.patientName}
          </h3>
          <span className="text-[13px] text-muted-foreground font-semibold">
            {item.testName}
          </span>
        </div>

        {/* Status Badge */}
        <div>
          {isUrgent && (
            <span className="inline-flex items-center rounded-[5px] bg-red-500/10 px-2.5 py-0.5 text-[11px] font-bold text-red-600 dark:text-red-400 border border-red-200/40 dark:border-red-900/35">
              Urgent
            </span>
          )}
          {isHigh && (
            <span className="inline-flex items-center rounded-[5px] bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-bold text-amber-600 dark:text-amber-400 border border-amber-200/40 dark:border-amber-900/35">
              High
            </span>
          )}
          {isNormal && (
            <span className="inline-flex items-center rounded-[5px] bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-200/40 dark:border-emerald-900/35">
              Normal
            </span>
          )}
        </div>
      </div>

      {/* Right Column: Time & Call to Action button */}
      <div className="flex flex-col items-end justify-between md:h-[68px] gap-2">
        <span className="text-[12px] text-muted-foreground font-bold leading-none self-start md:self-auto select-none">
          {item.timeElapsed}
        </span>
        <button
          onClick={() => onViewDetails(item)}
          className="w-full md:w-auto h-9 px-4 bg-primary text-primary-foreground border border-primary font-bold text-[12px] rounded-[5px] hover:bg-primary/95 cursor-pointer transition-colors shadow-none outline-none inline-flex items-center justify-center"
        >
          View Details
        </button>
      </div>

    </div>
  );
}
