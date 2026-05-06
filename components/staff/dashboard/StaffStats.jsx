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
    <div className="bg-card p-4 rounded-lg border border-border flex flex-col justify-between shadow-none transition-all h-full">
      <div className="flex justify-between items-start mb-3">
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", iconBg, iconColor)}>
          <Icon className="w-4 h-4" />
        </div>
        {trend && (
          <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-accent text-accent-foreground border border-border">
            {trend}
            <TrendingUp className="w-3 h-3" />
          </div>
        )}
      </div>
      
      <div className="space-y-0.5 mb-4">
        <p className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
        <p className="text-[24px] font-bold text-foreground leading-tight">{value}</p>
      </div>

      <div className="pt-4 border-t border-border">
        {percentage !== undefined ? (
          <div className="space-y-2">
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
               <div 
                 className="h-full bg-primary rounded-full transition-all duration-500" 
                 style={{ width: `${percentage}%` }} 
               />
            </div>
            <p className="text-[11px] text-muted-foreground font-medium leading-none">{percentage}% capacity utilized</p>
          </div>
        ) : title === "Active Alerts" ? (
          <div className="flex items-center gap-2">
             <div className="flex -space-x-2">
                {["RK", "PS"].map((name, i) => (
                   <div key={i} className={cn(
                     "w-7 h-7 rounded-lg border border-card flex items-center justify-center text-[10px] font-bold text-white",
                     i === 0 ? "bg-blue-500" : "bg-purple-500"
                   )}>
                     {name}
                   </div>
                ))}
                <div className="w-7 h-7 rounded-lg border border-card bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                  +12
                </div>
             </div>
             <p className="text-[12px] text-muted-foreground font-medium">New critical alerts</p>
           </div>
        ) : (
          <div className="flex items-center">
            {details.map((detail, idx) => (
              <React.Fragment key={idx}>
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1 leading-none">{detail.label}</p>
                  <p className="text-[15px] font-bold text-foreground leading-none">{detail.value}</p>
                </div>
                {idx === 0 && <div className="w-[1px] h-5 bg-border mx-4" />}
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
