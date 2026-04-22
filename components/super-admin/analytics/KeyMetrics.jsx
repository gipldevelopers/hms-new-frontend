import React from "react";
import { CalendarHeart, Wallet, Calendar, Users } from "lucide-react";

const Bed = (props) => (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" viewBox="0 0 24 24" 
      fill="none" stroke="currentColor" strokeWidth="2" 
      strokeLinecap="round" strokeLinejoin="round" 
    >
      <path d="M2 4v16" /><path d="M2 8h18a2 2 0 0 1 2 2v10" /><path d="M2 17h20" /><path d="M6 8v9" />
    </svg>
);

const MetricItem = ({ icon: Icon, title, value, trend }) => (
  <div className="bg-slate-50/30 dark:bg-white/5 p-5 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 flex flex-col justify-between min-h-[125px] transition-all">
    <div className="flex justify-between items-start w-full">
      <div className="flex items-center justify-center pt-1">
        <Icon className="w-6 h-6 text-[#101935] dark:text-white" />
      </div>
      <span className="text-[12px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full whitespace-nowrap">
        +{trend}%
      </span>
    </div>

    <div className="mt-4">
      <p className="text-[22px] font-bold text-[#101935] dark:text-white leading-none tracking-tight">
        {value}
      </p>
      <p className="text-[12px] font-bold text-[#64748B] dark:text-slate-500 mt-2 tracking-wide">
        {title}
      </p>
    </div>
  </div>
);

export default function KeyMetrics() {
  return (
    <div className="bg-white dark:bg-[#101935] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 overflow-hidden font-sans transition-all">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#E7E8EB] dark:border-white/10 bg-slate-50/50 dark:bg-white/5">
        <h3 className="text-[16px] font-bold text-[#101935] dark:text-white">Key Metrics</h3>
      </div>
      
      {/* Grid */}
      <div className="p-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricItem 
          icon={Wallet}
          title="Total Revenue" 
          value="12,458" 
          trend={0.25} 
        />
        <MetricItem 
          icon={Calendar}
          title="Total Appointments" 
          value="15,678" 
          trend={0.25} 
        />
        <MetricItem 
          icon={Bed}
          title="Total Beds" 
          value="2,500" 
          trend={0.25} 
        />
        <MetricItem 
          icon={Users}
          title="Active Departments" 
          value="148" 
          trend={0.25} 
        />
      </div>
    </div>
  );
}
