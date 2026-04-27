"use client";

import React from "react";
import { UserPlus, Activity, Truck, Calendar, UserCog } from "lucide-react";

const links = [
  { label: "New Admission", icon: UserPlus },
  { label: "Emergency Case", icon: Activity },
  { label: "Dispatch Ambulance", icon: Truck },
  { label: "New Appointment", icon: Calendar },
];

export function QuickLinks() {
  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 overflow-hidden">
      <div className="p-5">
        <h3 className="text-[16px] font-bold text-[#1e293b] dark:text-white">
          Quick Links
        </h3>
      </div>

      <div className="border-b border-[#E7E8EB] dark:border-white/10 w-full"></div>

      <div className="p-5">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-[20px]">
        {links.map((link, idx) => (
          <button
            key={idx}
            className="flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-800 rounded-[5px] border border-gray-100 dark:border-gray-700 hover:border-primary hover:shadow-sm transition-all group"
          >
            <div className="mb-3">
              <link.icon className="w-6 h-6 text-[#1e293b] dark:text-white transition-colors" />
            </div>
            <span className="text-[12px] font-bold text-gray-700 dark:text-gray-200">
              {link.label}
            </span>
          </button>
        ))}
      </div>
      </div>
    </div>
  );
}
