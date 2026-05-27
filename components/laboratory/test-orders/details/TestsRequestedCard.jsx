"use client";
import React from "react";

const statusColors = {
  Pending: "bg-[#f1f5f9] text-[#475569] dark:bg-[#334155] dark:text-[#cbd5e1]",
  Collecting: "bg-[#fef3c7] text-[#b45309] dark:bg-[#78350f]/30 dark:text-[#fcd34d]",
  Processing: "bg-[#dbeafe] text-[#1e40af] dark:bg-[#1e3a8a]/30 dark:text-[#93c5fd]",
  Completed: "bg-[#d1fae5] text-[#065f46] dark:bg-[#064e3b]/30 dark:text-[#6ee7b7]",
};

export function TestsRequestedCard({ tests = [], onUpdate, updatingTestId }) {
  return (
    <div className="bg-card text-card-foreground rounded-lg border border-border overflow-hidden w-full shadow-none">
      {/* Header */}
      <div className="px-5 py-4 flex justify-between items-center border-b border-border">
        <h2 className="text-[15px] font-bold text-foreground">Tests Requested ({tests.length})</h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="bg-muted/10 border-b border-border">
              <th className="px-5 py-3 text-[11px] font-bold text-muted-foreground">Test Name & Code</th>
              <th className="px-5 py-3 text-[11px] font-bold text-muted-foreground">Status</th>
              <th className="px-5 py-3 text-right text-[11px] font-bold text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tests.map((test, index) => (
              <tr key={index} className="hover:bg-muted/5 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold text-foreground">{test.name}</span>
                    <span className="text-[10px] text-muted-foreground font-semibold mt-0.5">{test.code}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-[4px] leading-none ${statusColors[test.status] || statusColors.Pending}`}>
                    {test.status || "Pending"}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button
                    onClick={() => onUpdate?.(test.id)}
                    disabled={test.status === "Completed" || updatingTestId === test.id}
                    className="px-3 py-1 bg-muted hover:bg-muted/80 text-[11px] font-bold text-foreground rounded border border-border transition-colors cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {test.status === "Completed" ? "Completed" : updatingTestId === test.id ? "Updating..." : "Update"}
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
