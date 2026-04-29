"use client";

import React from "react";
import { 
  UserPlus, 
  Calendar, 
  FileText, 
  FlaskConical, 
  ClipboardList 
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { name: "Add Patient", icon: UserPlus, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
  { name: "Book Appointment", icon: Calendar, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-500/10" },
  { name: "View Report", icon: FileText, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-500/10" },
  { name: "Order Lab", icon: FlaskConical, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
  { name: "Create Prescription", icon: ClipboardList, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-500/10" },
];

export default function QuickLinks() {
  return (
    <div className="bg-white dark:bg-[#101935] p-5 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 shadow-none">
      <h3 className="text-[14px] font-bold text-[#1A1C23] dark:text-white mb-5 uppercase-none">Quick Links</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {links.map((link, idx) => (
          <button 
            key={idx}
            className="flex flex-col items-center justify-center p-4 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-all group gap-3"
          >
            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform", link.bg, link.color)}>
              <link.icon className="w-5 h-5" />
            </div>
            <span className="text-[12px] font-bold text-[#5E6C84] dark:text-slate-400 text-center group-hover:text-primary transition-colors">
              {link.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
