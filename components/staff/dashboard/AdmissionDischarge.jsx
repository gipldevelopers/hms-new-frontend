"use client";

import React from "react";
import { 
  LogIn, 
  LogOut,
  RotateCcw
} from "lucide-react";
import { cn } from "@/lib/utils";

const requests = [
  { id: 1, category: "Housekeeping", task: "Bed 106 Sanitization", time: "2 mins ago" },
  { id: 2, category: "Maintenance", task: "AC Repair Ward 4B", time: "15 mins ago" },
];

export default function AdmissionDischarge() {
  return (
    <div className="bg-white dark:bg-[#101935] p-5 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 shadow-none">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[16px] font-bold text-[#1A1C23] dark:text-white uppercase-none">Admission & Discharge</h3>
        <RotateCcw className="w-4 h-4 text-[#A0AEC0] cursor-pointer hover:text-[#2D3A8C] transition-all" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Admissions Card */}
        <div className="bg-[#F0FDF9] dark:bg-emerald-500/5 border border-[#CCFBEF] dark:border-emerald-500/10 p-4 rounded-[5px] flex justify-between items-start">
           <div className="space-y-1">
              <p className="text-[10px] font-bold text-[#0D9488] uppercase-none">ADMISSIONS</p>
              <p className="text-[24px] font-bold text-[#1A1C23] dark:text-white leading-none">03</p>
              <p className="text-[10px] font-medium text-[#0D9488]">Next ETA: 10:45 AM (ER Transfer)</p>
           </div>
           <LogIn className="w-5 h-5 text-[#0D9488]" />
        </div>

        {/* Discharges Card */}
        <div className="bg-[#F5F3FF] dark:bg-indigo-500/5 border border-[#EDE9FE] dark:border-indigo-500/10 p-4 rounded-[5px] flex justify-between items-start">
           <div className="space-y-1">
              <p className="text-[10px] font-bold text-[#4F46E5] uppercase-none">DISCHARGES</p>
              <p className="text-[24px] font-bold text-[#1A1C23] dark:text-white leading-none">05</p>
              <p className="text-[10px] font-medium text-[#4F46E5]">2 Ready | 3 Pending Clearance</p>
           </div>
           <LogOut className="w-5 h-5 text-[#4F46E5]" />
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-[10px] font-bold text-[#A0AEC0] uppercase-none">RECENT REQUESTS</h4>
        <div className="space-y-2">
          {requests.map((request) => (
            <div key={request.id} className="flex items-center justify-between p-2.5 border border-[#F4F5F7] dark:border-white/5 rounded-[5px] bg-white dark:bg-[#0B1121] hover:bg-gray-50 dark:hover:bg-white/10 transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  request.category === "Housekeeping" ? "bg-[#0D9488]" : "bg-[#F97316]"
                )} />
                <p className="text-[12px] font-bold text-[#1A1C23] dark:text-white">
                  {request.category}: <span className="font-medium text-[#5E6C84] dark:text-slate-400">{request.task}</span>
                </p>
              </div>
              <span className="text-[10px] font-medium text-[#A0AEC0]">{request.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
