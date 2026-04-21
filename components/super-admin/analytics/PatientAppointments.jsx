import React from "react";
import { ChevronDown } from "lucide-react";

export default function PatientAppointments() {
  const yLabels = ["20k", "15k", "10k", "8k", "5k", "0"];
  const xLabels = ["Jan", "Feb", "Mar", "Apr", "May", "June"];

  return (
    <div className="bg-white dark:bg-[#101935] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 overflow-hidden font-sans transition-all">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-[#E7E8EB] dark:border-white/10 bg-slate-50/50 dark:bg-white/5">
        <h3 className="text-[16px] font-bold text-[#101935] dark:text-white">Patients & Appointments</h3>
        <button className="flex items-center gap-2 text-[12px] font-bold text-[#64748B] dark:text-slate-400 border border-[#E7E8EB] dark:border-white/10 px-3 py-1.5 rounded-[5px] transition-colors">
          Monthly <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-6 h-[300px] relative flex">
        {/* Y-Axis Labels */}
        <div className="flex flex-col justify-between text-[11px] font-bold text-[#64748B] dark:text-slate-500 pr-6 pb-10">
          {yLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        {/* Chart Area */}
        <div className="relative flex-1 h-full">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pb-10 pointer-events-none">
            {yLabels.map((line) => (
              <div key={line} className="w-full border-t border-dashed border-[#F1F5F9] dark:border-white/5" />
            ))}
          </div>

          {/* SVG Graph */}
          <svg
            viewBox="0 0 500 200"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-[calc(100%-40px)] z-10"
          >
            {/* Patients Curve - Emerald Green */}
            <path
              d="M 0,140 C 50,140 80,125 125,120 S 175,90 225,95 S 275,180 325,180 S 375,140 425,140 S 475,30 500,30"
              fill="none"
              stroke="#10B981"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Appointments Curve - Cobalt Blue */}
            <path
              d="M 0,160 C 50,160 80,145 125,140 S 175,110 225,115 S 275,190 325,190 S 375,160 425,160 S 475,50 500,50"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* X-Axis Labels */}
          <div className="absolute bottom-0 w-full flex justify-between text-[11px] text-[#64748B] dark:text-slate-500 font-bold px-1">
            {xLabels.map((month) => (
              <span key={month}>{month}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
