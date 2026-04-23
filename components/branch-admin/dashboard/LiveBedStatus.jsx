"use client";

import React from "react";

const wards = [
  {
    name: "Ward A (General)",
    beds: [
      "occupied", "occupied", "available", "occupied", "occupied", "cleaning", "occupied", "occupied", "available", "occupied", "occupied", "occupied", "available", "occupied", "occupied", "occupied", "available", "occupied", "occupied", "available"
    ]
  },
  {
    name: "ICU Wing",
    beds: [
      "occupied", "occupied", "occupied", "occupied", "available", "occupied", "occupied", "occupied", "available", "occupied"
    ]
  },
  {
    name: "Private Rooms",
    beds: [
      "available", "available", "occupied", "occupied", "available", "occupied", "available", "occupied", "occupied"
    ]
  }
];

export function LiveBedStatus() {
  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 h-full overflow-hidden">
      <div className="flex justify-between items-center p-5">
        <h3 className="text-[16px] font-bold text-[#1e293b] dark:text-white">
          Live Bed Status
        </h3>
        <button className="text-[10px] font-bold text-gray-500 hover:text-primary transition-colors">
          View all
        </button>
      </div>

      <div className="border-b border-[#E7E8EB] dark:border-white/10 w-full"></div>

      <div className="p-5">
        <div className="flex items-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-[2px] bg-[#10B981]"></div>
          <span className="text-[11px] font-bold text-[#64748B]">Available (68)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-[2px] bg-[#EF4444]"></div>
          <span className="text-[11px] font-bold text-[#64748B]">Occupied (312)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-[2px] bg-[#F59E0B]"></div>
          <span className="text-[11px] font-bold text-[#64748B]">Cleaning (118)</span>
        </div>
      </div>

      <div className="space-y-4">
        {wards.map((ward, idx) => (
          <div key={idx}>
            <h4 className="text-[11px] font-bold text-[#94A3B8] mb-2 uppercase tracking-wide">
              {ward.name}
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {ward.beds.map((status, bIdx) => (
                <div
                  key={bIdx}
                  className={`w-3.5 h-3.5 rounded-[2px] ${
                    status === "available"
                      ? "bg-[#10B981]"
                      : status === "occupied"
                      ? "bg-[#EF4444]"
                      : "bg-[#F59E0B]"
                  }`}
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-5 border-t border-[#F1F5F9] dark:border-white/5 space-y-3">
         <div className="flex justify-between items-center">
            <span className="text-[13px] font-medium text-[#64748B]">ICU Availability:</span>
            <div className="flex items-center gap-2">
               <span className="text-[12px] font-bold text-[#EF4444]">Free</span>
               <div className="flex items-center h-6 bg-[#FEF2F2] rounded-[4px] overflow-hidden w-[100px]">
                  <div className="bg-[#EF4444] h-full flex items-center px-2 min-w-[40px]">
                     <span className="text-[11px] font-bold text-white">3/10</span>
                  </div>
               </div>
            </div>
         </div>
         <div className="flex justify-between items-center">
            <span className="text-[13px] font-medium text-[#64748B]">OT Status:</span>
            <span className="text-[12px] font-bold text-[#10B981] bg-[#ECFDF5] px-3 py-1 rounded-[4px]">
               2 Active Now
            </span>
         </div>
      </div>
    </div>
    </div>
  );
}
