"use client";

import React from "react";
import { 
  PlusCircle, 
  Pill, 
  ClipboardList, 
  UserPlus, 
  ArrowRightLeft,
  Activity,
  FilePlus
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { id: 1, label: "Add Vitals", icon: ClipboardList },
  { id: 2, label: "Administer Med", icon: Pill },
  { id: 3, label: "Add Task", icon: FilePlus },
  { id: 4, label: "New Admission", icon: UserPlus },
  { id: 5, label: "Transfer Patient", icon: ArrowRightLeft },
];

function QuickLinkItem({ label, icon: Icon }) {
  return (
    <div className="flex flex-col items-center justify-center p-3 border border-[#F1F5F9] dark:border-white/10 rounded-[5px] transition-all cursor-pointer bg-white dark:bg-[#101935] hover:bg-gray-50 dark:hover:bg-[#1e293b] group h-full">
      <div className="w-full h-[60px] bg-[#F4F7FA] dark:bg-[#1e293b] rounded-[5px] flex items-center justify-center mb-3">
        <Icon 
          className="w-[24px] h-[24px] text-[#0F172A] dark:text-blue-400 group-hover:scale-110 transition-transform" 
          strokeWidth={2} 
        />
      </div>
      <span className="text-[13px] font-bold text-[#101935] dark:text-slate-200 text-center leading-tight">
        {label}
      </span>
    </div>
  );
}

export default function StaffQuickLinks() {
  return (
    <div className="bg-white dark:bg-[#101935] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 overflow-hidden font-sans transition-all h-full flex flex-col">
      {/* Header section */}
      <div className="px-6 py-4 border-b border-[#E7E8EB] dark:border-white/10 shrink-0">
        <h3 className="text-[16px] font-bold text-[#101935] dark:text-white uppercase-none">Quick Links</h3>
      </div>

      {/* Grid Container */}
      <div className="p-6 flex-1">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 h-full">
          {links.map((link) => (
            <QuickLinkItem key={link.id} label={link.label} icon={link.icon} />
          ))}
        </div>
      </div>
    </div>
  );
}
