import React from "react";
import { CalendarHeart } from "lucide-react";

function QuickLink({ label }) {
  return (
    <div className="flex flex-col items-center justify-center p-3 border border-[#F1F5F9] dark:border-white/10 rounded-[5px] transition-all cursor-pointer bg-white dark:bg-[#101935] hover:bg-gray-50 dark:hover:bg-[#1e293b] group">
      <div className="w-full h-[60px] bg-[#F4F7FA] dark:bg-[#1e293b] rounded-[5px] flex items-center justify-center mb-3">
        <CalendarHeart 
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

export function QuickLinks() {
  const links = [
    "Add Branch",
    "View Analytics",
    "Master data",
    "View Audit",
    "Global Settings",
  ];

  return (
    <div className="bg-white dark:bg-[#101935] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 overflow-hidden font-sans transition-all">
      {/* Header section with specific padding and border */}
      <div className="px-6 py-4 border-b border-[#E7E8EB] dark:border-white/10">
        <h3 className="text-[16px] font-bold text-[#101935] dark:text-white">Quick Links</h3>
      </div>

      {/* Grid Container with precise spacing */}
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {links.map((link) => (
            <QuickLink key={link} label={link} />
          ))}
        </div>
      </div>
    </div>
  );
}
