"use client";

import React from "react";

const doctors = [
  {
    name: "Dr. R. Sharma",
    specialty: "Cardiology",
    status: "on-duty",
    initials: "RS",
    color: "bg-blue-100 text-blue-600",
  },
  {
    name: "Dr. P. Mehta",
    specialty: "Neurology",
    status: "on-duty",
    initials: "PM",
    color: "bg-pink-100 text-pink-600",
  },
  {
    name: "Dr. A. Kumar",
    specialty: "Orthopedics",
    status: "in-ot",
    initials: "AK",
    color: "bg-orange-100 text-orange-600",
  },
  {
    name: "Dr. S. Verma",
    specialty: "Pediatrics",
    status: "off",
    initials: "SV",
    color: "bg-green-100 text-green-600",
  },
];

const statusColors = {
  "on-duty": "bg-green-500",
  "in-ot": "bg-orange-400",
  "off": "bg-red-500",
};

export function DoctorStatus() {
  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 h-full overflow-hidden">
      <div className="flex justify-between items-center p-5">
        <h3 className="text-[16px] font-bold text-[#1e293b] dark:text-white">
          Doctor Status
        </h3>
        <button className="text-[10px] font-bold text-gray-500 hover:text-primary transition-colors">
          View all
        </button>
      </div>

      <div className="border-b border-[#E7E8EB] dark:border-white/10 w-full"></div>

      <div className="p-5">
        <div className="flex flex-col mb-4">
        {doctors.map((doc, idx) => (
          <React.Fragment key={idx}>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold ${doc.color}`}>
                  {doc.initials}
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-[#1e293b] dark:text-white leading-tight">
                    {doc.name}
                  </h4>
                  <p className="text-[12px] text-[#64748B] dark:text-slate-400 font-medium">{doc.specialty}</p>
                </div>
              </div>
              <div className={`w-3 h-3 rounded-full ${statusColors[doc.status]} border-2 border-white dark:border-[#1E293B] shadow-sm`}></div>
            </div>
            {idx < doctors.length - 1 && (
              <div className="border-b border-[#E7E8EB] dark:border-white/10 w-full"></div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="flex items-center gap-4 pt-4 border-t border-[#F1F5F9] dark:border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
          <span className="text-[11px] font-bold text-[#64748B]">On Duty</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#F59E0B]"></div>
          <span className="text-[11px] font-bold text-[#64748B]">In OT</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#EF4444]"></div>
          <span className="text-[11px] font-bold text-[#64748B]">Off</span>
        </div>
      </div>
      </div>
    </div>
  );
}
