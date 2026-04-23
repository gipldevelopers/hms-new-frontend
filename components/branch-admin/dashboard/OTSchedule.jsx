"use client";

import React from "react";

const schedules = [
  {
    ot: "OT-1",
    time: "09:00 AM",
    procedure: "Appendectomy",
    doctor: "Dr. Sharma",
    status: "active",
    borderColor: "border-[#D1E9FF]",
    bgColor: "bg-[#F0F9FF]",
    textColor: "text-[#1570EF]",
    subTextColor: "text-[#667085]",
  },
  {
    ot: "OT-2",
    time: "11:30 AM",
    procedure: "Knee Surgery",
    doctor: "Dr. Kumar",
    status: "active",
    borderColor: "border-[#D1E9FF]",
    bgColor: "bg-[#F0F9FF]",
    textColor: "text-[#1570EF]",
    subTextColor: "text-[#667085]",
  },
  {
    ot: "OT-3",
    time: "02:00 PM",
    procedure: "Cataract",
    doctor: "Dr. Verma",
    status: "active",
    borderColor: "border-[#D1FADF]",
    bgColor: "bg-[#ECFDF3]",
    textColor: "text-[#039855]",
    subTextColor: "text-[#067647]",
  },
  {
    ot: "OT-4",
    time: "04:00 PM",
    procedure: "Vacant",
    doctor: "Unscheduled",
    status: "vacant",
    borderColor: "border-[#EAECF0]",
    bgColor: "bg-[#F9FAFB]",
    textColor: "text-[#667085]",
    subTextColor: "text-[#98A2B3]",
  },
];

export function OTSchedule() {
  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 h-full overflow-hidden">
      <div className="flex justify-between items-center p-5">
        <h3 className="text-[16px] font-bold text-[#1e293b] dark:text-white">
          OT Schedule
        </h3>
        <span className="text-[10px] font-bold text-[#3B82F6]">Today</span>
      </div>

      <div className="border-b border-[#E7E8EB] dark:border-white/10 w-full"></div>

      <div className="p-5">
        <div className="space-y-3">
        {schedules.map((item, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-[8px] border ${item.borderColor} ${item.bgColor} flex flex-col justify-center transition-all hover:shadow-sm`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[13px] font-bold ${item.textColor}`}>
                {item.ot} | {item.time}
              </span>
            </div>
            <div className="flex items-center gap-2">
               <span className={`text-[12px] font-medium ${item.subTextColor}`}>{item.procedure} — {item.doctor}</span>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}
