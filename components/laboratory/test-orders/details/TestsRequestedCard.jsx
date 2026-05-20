"use client";
import React from "react";

export function TestsRequestedCard({ tests = [] }) {
  return (
    <div className="bg-card text-card-foreground rounded-lg border border-border overflow-hidden w-full shadow-none">
      {/* Header */}
      <div className="px-5 py-4 flex justify-between items-center border-b border-border">
        <h2 className="text-[15px] font-bold text-foreground">Tests Requested ({tests.length})</h2>
        <button className="text-[13px] font-bold text-primary hover:opacity-80 transition-opacity cursor-pointer">
          Add Test
        </button>
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
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-[4px] leading-none ${test.statusColor}`}>
                    {test.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button className="px-3 py-1 bg-muted hover:bg-muted/80 text-[11px] font-bold text-foreground rounded border border-border transition-colors cursor-pointer select-none">
                    Update
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
