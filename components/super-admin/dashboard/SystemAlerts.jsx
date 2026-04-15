import React from "react";
import { CalendarHeart } from "lucide-react";
import { cn } from "@/lib/utils";

function AlertItem({ text, time, bg }) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3 rounded-[5px] transition-all cursor-pointer",
        bg,
        "dark:bg-[#1e293b]/50 dark:hover:bg-[#1e293b] dark:border dark:border-white/5"
      )}
    >
      <div className="mt-0.5 flex-shrink-0">
        <CalendarHeart className="w-4.5 h-4.5 text-[#0F172A] dark:text-blue-400" strokeWidth={2} />
      </div>
      
      <div className="flex flex-col">
        <p className="text-[13px] font-bold text-[#101935] dark:text-slate-200 leading-tight">
          {text}
        </p>
        <p className="text-[11px] text-[#94A3B8] dark:text-slate-500 font-medium mt-1">
          {time}
        </p>
      </div>
    </div>
  );
}

export function SystemAlerts() {
  return (
    <div className="bg-white dark:bg-[#101935] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 overflow-hidden font-sans transition-all">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-[#E7E8EB] dark:border-white/10">
        <h3 className="text-[16px] font-bold text-[#101935] dark:text-white">System Alerts</h3>
        <button className="text-[12px] font-semibold text-[#64748B] dark:text-slate-400 border border-[#E7E8EB] dark:border-white/10 px-3 py-1 rounded-[5px] hover:bg-gray-50 dark:hover:bg-[#1e293b] transition-colors">
          View all
        </button>
      </div>

      {/* Alerts List */}
      <div className="p-5 space-y-3">
        <AlertItem
          text="Backup scheduled for tonight at 2:00 AM"
          time="4 hours ago"
          bg="bg-[#F4F7FA]" // Light Blueish Gray
        />
        <AlertItem
          text="System update completed successfully"
          time="2 hours ago"
          bg="bg-[#FFF1F1]" // Light Red
        />
        <AlertItem
          text="New user login detected"
          time="30 minutes ago"
          bg="bg-[#E9F7EF]" // Light Green
        />
        <AlertItem
          text="Server maintenance ongoing"
          time="15 minutes ago"
          bg="bg-[#F4F7FA]" // Light Blueish Gray
        />
      </div>
    </div>
  );
}
