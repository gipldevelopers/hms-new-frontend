"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { AlertTriangle } from "lucide-react";

export function ReportsOTScheduleBoard() {
  const efficiencyData = [
    { name: "Utilized", value: 84, color: "#4F46E5" },
    { name: "Unutilized", value: 16, color: "#E2E8F0" }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-[24px] font-sans">
      {/* Left Column: Live OT Schedule Board */}
      <div className="lg:col-span-8 bg-card rounded-lg border border-border flex flex-col justify-between shadow-none hover:border-gray-300 dark:hover:border-white/20 transition-all h-[471px] overflow-hidden">
        {/* Header */}
        <div className="p-5 pb-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 shrink-0">
          <h3 className="text-[15px] font-bold text-[#1e293b] dark:text-white">
            Live OT Schedule Board
          </h3>
          {/* Calendar Legends */}
          <div className="flex flex-wrap items-center gap-3 text-[10px] font-extrabold text-gray-500 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#10B981] shrink-0"></span>
              <span>COMPLETED</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#4F46E5] shrink-0"></span>
              <span>SCHEDULED</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#F59E0B] shrink-0"></span>
              <span>DELAYED</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#EF4444] shrink-0"></span>
              <span>EMERGENCY</span>
            </div>
          </div>
        </div>
        <div className="border-b border-[#E7E8EB] dark:border-white/10 w-full"></div>

        {/* Timeline Grid */}
        <div className="p-5 flex-1 flex flex-col justify-between relative overflow-x-auto min-w-[650px] no-scrollbar">
          {/* Red Vertical Timeline Marker */}
          <div className="absolute top-[52px] bottom-6 w-[1.5px] bg-red-500 z-20 pointer-events-none" style={{ left: "41.5%" }}>
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm select-none whitespace-nowrap">
              Now 11:30 AM
            </div>
            {/* Timeline line red pulse */}
            <div className="absolute top-[10%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full bg-red-500 border border-white animate-ping"></div>
          </div>

          {/* Time scale headers */}
          <div className="grid grid-cols-12 text-[10px] font-extrabold text-gray-400 dark:text-slate-500 pb-2 pl-[90px] border-b border-gray-100 dark:border-white/5 shrink-0">
            <div className="col-span-3 text-left">08:00 AM</div>
            <div className="col-span-3 text-left pl-[10%]">10:00 AM</div>
            <div className="col-span-3 text-left pl-[15%]">12:00 PM</div>
            <div className="col-span-2 text-left pl-[15%]">02:00 PM</div>
            <div className="col-span-1 text-right">04:00 PM</div>
          </div>

          {/* Room Row 1 */}
          <div className="flex items-center py-2.5 border-b border-gray-100 dark:border-white/5 relative h-[56px] shrink-0">
            <span className="w-[80px] text-[11px] font-black text-gray-700 dark:text-slate-300 shrink-0">
              OT Room 1
            </span>
            <div className="flex-1 h-8 bg-gray-50/50 dark:bg-slate-900/10 rounded-lg relative overflow-hidden">
              {/* CABG - Dr. Shah */}
              <div
                className="absolute top-0 bottom-0 left-0 bg-[#E6F9F0] border border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/40 rounded-md p-1.5 px-3 flex flex-col justify-center cursor-pointer hover:shadow-sm"
                style={{ width: "32%" }}
              >
                <span className="text-[10px] font-black text-[#047857] dark:text-emerald-400 leading-none">
                  CABG - Dr. Shah
                </span>
                <span className="text-[8px] font-bold text-[#10B981] dark:text-emerald-500 mt-0.5">
                  Completed
                </span>
              </div>
              {/* Valve Replacement */}
              <div
                className="absolute top-0 bottom-0 left-[36%] bg-[#EEF2FF] border border-indigo-100 border-b-[3px] border-b-[#4F46E5] dark:bg-indigo-950/20 dark:border-indigo-900/40 rounded-md p-1.5 px-3 flex flex-col justify-center cursor-pointer hover:shadow-sm"
                style={{ width: "42%" }}
              >
                <span className="text-[10px] font-black text-[#4338CA] dark:text-indigo-400 leading-none">
                  Valve Replacement
                </span>
                <span className="text-[8px] font-bold text-[#4F46E5] dark:text-indigo-500 mt-0.5">
                  In Progress
                </span>
              </div>
            </div>
          </div>

          {/* Room Row 2 */}
          <div className="flex items-center py-2.5 border-b border-gray-100 dark:border-white/5 relative h-[56px] shrink-0">
            <span className="w-[80px] text-[11px] font-black text-gray-700 dark:text-slate-300 shrink-0">
              OT Room 2
            </span>
            <div className="flex-1 h-8 bg-gray-50/50 dark:bg-slate-900/10 rounded-lg relative overflow-hidden">
              {/* Hip Replace */}
              <div
                className="absolute top-0 bottom-0 left-[6%] bg-[#E6F9F0] border border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/40 rounded-md p-1.5 px-3 flex flex-col justify-center cursor-pointer hover:shadow-sm"
                style={{ width: "24%" }}
              >
                <span className="text-[10px] font-black text-[#047857] dark:text-emerald-400 leading-none">
                  Hip Replace
                </span>
                <span className="text-[8px] font-bold text-[#10B981] dark:text-emerald-500 mt-0.5">
                  Completed
                </span>
              </div>
              {/* Knee Arthro */}
              <div
                className="absolute top-0 bottom-0 left-[38%] bg-[#FFFBEB] border border-amber-100 dark:bg-amber-950/20 dark:border-amber-900/40 rounded-md p-1.5 px-3 flex flex-col justify-center cursor-pointer hover:shadow-sm"
                style={{ width: "36%" }}
              >
                <span className="text-[10px] font-black text-[#B45309] dark:text-amber-400 leading-none">
                  Knee Arthro - Dr. Patel
                </span>
                <span className="text-[8px] font-bold text-[#F59E0B] dark:text-amber-500 mt-0.5">
                  Delayed (Cleaning)
                </span>
              </div>
            </div>
          </div>

          {/* Room Row 3 */}
          <div className="flex items-center py-2.5 border-b border-gray-100 dark:border-white/5 relative h-[56px] shrink-0">
            <span className="w-[80px] text-[11px] font-black text-gray-700 dark:text-slate-300 shrink-0">
              OT Room 3
            </span>
            <div className="flex-1 h-8 bg-gray-50/50 dark:bg-slate-900/10 rounded-lg relative overflow-hidden">
              {/* Appendectomy */}
              <div
                className="absolute top-0 bottom-0 left-0 bg-[#E6F9F0] border border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/40 rounded-md p-1.5 px-3 flex flex-col justify-center cursor-pointer hover:shadow-sm"
                style={{ width: "18%" }}
              >
                <span className="text-[10px] font-black text-[#047857] dark:text-emerald-400 leading-none">
                  Appendectomy
                </span>
              </div>
              {/* Trauma Surg */}
              <div
                className="absolute top-0 bottom-0 left-[24%] bg-[#FFF1F1] border border-red-100 dark:bg-red-950/20 dark:border-red-900/40 rounded-md p-1.5 px-3 flex flex-col justify-center cursor-pointer hover:shadow-sm"
                style={{ width: "32%" }}
              >
                <span className="text-[10px] font-black text-[#EF4444] dark:text-red-400 leading-none flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-[#EF4444] shrink-0" />
                  Trauma Surg
                </span>
                <span className="text-[8px] font-bold text-red-500 mt-0.5">
                  Emergency
                </span>
              </div>
              {/* Hernia Repair */}
              <div
                className="absolute top-0 bottom-0 left-[62%] border border-dashed border-indigo-300 bg-white dark:bg-[#1E293B] rounded-md p-1.5 px-3 flex flex-col justify-center cursor-pointer hover:shadow-sm"
                style={{ width: "24%" }}
              >
                <span className="text-[10px] font-black text-[#4338CA] dark:text-indigo-400 leading-none">
                  Hernia Repair
                </span>
                <span className="text-[8px] font-bold text-[#4F46E5] dark:text-indigo-500 mt-0.5">
                  Scheduled
                </span>
              </div>
            </div>
          </div>

          {/* Emerg. OT Row */}
          <div className="flex items-center pt-2.5 relative h-[62px] shrink-0 bg-[#FFF5F5] dark:bg-red-950/5 border border-[#FEE2E2] dark:border-red-950/20 rounded-lg px-2 mt-1">
            <span className="w-[80px] text-[11px] font-black text-red-500 dark:text-red-400 shrink-0">
              Emerg. OT
            </span>
            <div className="flex-1 h-8 bg-white/40 dark:bg-slate-900/20 rounded-lg relative overflow-hidden">
              {/* Craniotomy */}
              <div
                className="absolute top-0 bottom-0 left-[9%] bg-[#FFF1F1] border border-red-200 border-b-[3px] border-b-[#EF4444] dark:bg-red-950/30 dark:border-red-900/60 rounded-md p-1.5 px-3 flex flex-col justify-center cursor-pointer hover:shadow-sm"
                style={{ width: "64%" }}
              >
                <span className="text-[10px] font-black text-[#9B1C1C] dark:text-red-300 leading-none">
                  Craniotomy - Dr. Lee
                </span>
                <span className="text-[8px] font-bold text-red-500 mt-0.5">
                  Critical In Progress
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Live Room Status & Efficiency */}
      <div className="lg:col-span-4 flex flex-col gap-[24px] lg:h-[471px] h-auto">
        
        {/* Live Room Status Card (h-[275px] to sum to 471px including 24px gap) */}
        <div className="bg-card rounded-lg border border-border flex flex-col justify-between shadow-none hover:border-gray-300 dark:hover:border-white/20 transition-all lg:h-[275px] h-auto overflow-hidden">
          <div className="p-4 pb-3 shrink-0">
            <h3 className="text-[12px] font-black text-[#1e293b] dark:text-white uppercase tracking-wider">
              Live Room Status
            </h3>
          </div>
          <div className="border-b border-[#E7E8EB] dark:border-white/10 w-full"></div>

          <div className="p-4 flex-1 flex flex-col justify-between gap-2.5">
            {/* Room 1 */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#F5F6FF] border border-[#E0E7FF] dark:bg-indigo-950/20 dark:border-indigo-900/30">
              <div className="flex flex-col gap-0.5">
                <span className="text-[12px] font-black text-[#4F46E5] dark:text-indigo-400">
                  OT Room 1
                </span>
                <span className="text-[10px] text-gray-500 dark:text-slate-400 font-bold leading-none mt-1">
                  Valve Replacement (Dr. Shah)
                </span>
              </div>
              <span className="inline-flex items-center px-2.5 py-1 rounded text-[9px] font-black bg-[#4F46E5] text-white tracking-wide shadow-sm">
                In Progress
              </span>
            </div>

            {/* Room 2 */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#FFFDF5] border border-[#FEF3C7] dark:bg-amber-950/20 dark:border-amber-900/30">
              <div className="flex flex-col gap-0.5">
                <span className="text-[12px] font-black text-[#F59E0B] dark:text-amber-400">
                  OT Room 2
                </span>
                <span className="text-[10px] text-gray-500 dark:text-slate-400 font-bold leading-none mt-1">
                  Cleaning in progress
                </span>
              </div>
              <span className="inline-flex items-center px-2.5 py-1 rounded text-[9px] font-black bg-[#F59E0B] text-white tracking-wide shadow-sm">
                Delayed
              </span>
            </div>

            {/* Room 4 */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#F4FDF9] border border-[#D1FAE5] dark:bg-emerald-950/20 dark:border-emerald-900/30">
              <div className="flex flex-col gap-0.5">
                <span className="text-[12px] font-black text-[#10B981] dark:text-emerald-400">
                  OT Room 4
                </span>
                <span className="text-[10px] text-gray-500 dark:text-slate-400 font-bold leading-none mt-1">
                  Ready for next surgery
                </span>
              </div>
              <span className="inline-flex items-center px-2.5 py-1 rounded text-[9px] font-black bg-[#10B981] text-white tracking-wide shadow-sm">
                Available
              </span>
            </div>
          </div>
        </div>

        {/* OT Efficiency Score Card (h-[172px] to sum to 471px including 24px gap) */}
        <div className="bg-card rounded-lg border border-border flex flex-col justify-between shadow-none hover:border-gray-300 dark:hover:border-white/20 transition-all lg:h-[172px] h-auto overflow-hidden">
          <div className="p-4 pb-3 shrink-0">
            <h3 className="text-[12px] font-black text-[#1e293b] dark:text-white uppercase tracking-wider">
              OT Efficiency Score
            </h3>
          </div>
          <div className="border-b border-[#E7E8EB] dark:border-white/10 w-full"></div>

          <div className="p-4 flex-1 flex items-center justify-between gap-4">
            {/* Donut Chart */}
            <div className="relative w-[75px] h-[75px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={efficiencyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={26}
                    outerRadius={36}
                    paddingAngle={0}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                    isAnimationActive={false}
                  >
                    {efficiencyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[13px] font-extrabold text-[#1e293b] dark:text-white">84%</span>
              </div>
            </div>

            {/* Performance Bars */}
            <div className="flex-1 flex flex-col justify-center gap-2.5 pl-1">
              {/* Turnover Perf */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px] font-extrabold text-gray-700 dark:text-slate-300 leading-none">
                  <span>Turnover Perf.</span>
                  <span className="text-amber-500 font-black">72%</span>
                </div>
                <div className="w-full h-1 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: "72%" }}></div>
                </div>
              </div>

              {/* On-Time Starts */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px] font-extrabold text-gray-700 dark:text-slate-300 leading-none">
                  <span>On-Time Starts</span>
                  <span className="text-[#10B981] font-black">88%</span>
                </div>
                <div className="w-full h-1 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#10B981] rounded-full" style={{ width: "88%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
