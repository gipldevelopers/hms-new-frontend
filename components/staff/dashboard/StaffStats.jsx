"use client";

import React from "react";
import { 
  Bed, 
  Pill, 
  ClipboardList, 
  AlertCircle,
  TrendingUp,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

function StatCard({ title, value, icon: Icon, percentage, details, trend, iconBg, iconColor }) {
  return (
    <div className="bg-white dark:bg-[#101935] p-3.5 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 flex flex-col justify-between shadow-none transition-all h-full">
      <div className="flex justify-between items-start mb-2">
        <div className={cn("w-7 h-7 rounded-full flex items-center justify-center", iconBg, iconColor)}>
          <Icon className="w-3.5 h-3.5" />
        </div>
        {trend && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F0F3FF] dark:bg-primary/10 text-[#2D3A8C] dark:text-primary border border-blue-50 dark:border-primary/20">
            {trend}
            <TrendingUp className="w-3 h-3" />
          </div>
        )}
      </div>
      
      <div className="space-y-0.5 mb-3">
        <p className="text-[12px] font-medium text-[#5E6C84] dark:text-slate-400 uppercase-none">{title}</p>
        <p className="text-[22px] font-bold text-[#1A1C23] dark:text-white leading-tight">{value}</p>
      </div>

      <div className="pt-3 border-t border-[#F8F9FA] dark:border-white/5">
        {percentage !== undefined ? (
          <div className="space-y-1.5">
            <div className="h-1 w-full bg-[#F4F5F7] dark:bg-white/5 rounded-full overflow-hidden">
               <div 
                 className="h-full bg-[#FF7D3F] rounded-full transition-all duration-500" 
                 style={{ width: `${percentage}%` }} 
               />
            </div>
            <p className="text-[11px] text-[#A0AEC0] font-medium uppercase-none leading-none">{percentage}% capacity utilized</p>
          </div>
        ) : title === "Active Alerts" ? (
          <div className="flex items-center gap-2">
             <div className="flex -space-x-1.5">
                {["RK", "PS"].map((name, i) => (
                  <div key={i} className={cn(
                    "w-6 h-6 rounded-full border border-white dark:border-[#101935] flex items-center justify-center text-[8px] font-bold text-white",
                    i === 0 ? "bg-[#B0B8E8]" : "bg-[#C4C9F2]"
                  )}>
                    {name}
                  </div>
                ))}
                <div className="w-6 h-6 rounded-full border border-white dark:border-[#101935] bg-[#F4F5F7] dark:bg-white/10 flex items-center justify-center text-[8px] font-bold text-[#A0AEC0]">
                  +12
                </div>
             </div>
             <p className="text-[12px] text-[#5E6C84] dark:text-slate-500 font-medium uppercase-none">New critical alerts today</p>
           </div>
        ) : (
          <div className="flex items-center">
            {details.map((detail, idx) => (
              <React.Fragment key={idx}>
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-[#A0AEC0] uppercase-none mb-0.5 leading-none">{detail.label}</p>
                  <p className="text-[14px] font-bold text-[#1A1C23] dark:text-white leading-none">{detail.value}</p>
                </div>
                {idx === 0 && <div className="w-[1px] h-4 bg-[#F0F2F5] dark:bg-white/5 mx-3" />}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function StaffStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <StatCard 
        title="Bed Occupancy" 
        value="14" 
        icon={Bed} 
        percentage={70}
        trend="+5.2%"
        iconBg="bg-orange-50 dark:bg-orange-500/10"
        iconColor="text-orange-500"
      />
      <StatCard 
        title="Medications Due" 
        value="10" 
        icon={Pill} 
        details={[
          { label: "OVERDUE", value: "4" },
          { label: "IN 30 MIN", value: "6" }
        ]}
        trend="+12.4%"
        iconBg="bg-blue-50 dark:bg-blue-500/10"
        iconColor="text-blue-500"
      />
      <StatCard 
        title="Tasks Pending" 
        value="11" 
        icon={ClipboardList} 
        details={[
          { label: "OVERDUE", value: "3" },
          { label: "COMPLETED", value: "24" }
        ]}
        trend="+8.1%"
        iconBg="bg-emerald-50 dark:bg-emerald-500/10"
        iconColor="text-emerald-500"
      />
      <StatCard 
        title="Active Alerts" 
        value="5" 
        icon={AlertCircle} 
        details={[]}
        trend="+18.2%"
        iconBg="bg-rose-50 dark:bg-rose-500/10"
        iconColor="text-rose-500"
      />
    </div>
  );
}
