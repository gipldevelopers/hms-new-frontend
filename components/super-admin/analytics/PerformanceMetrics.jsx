import React from "react";
import { CalendarHeart } from "lucide-react";

const PerformanceMetricItem = ({ title, value, percentage, trend }) => (
  <div className="bg-slate-50/30 dark:bg-white/5 p-5 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 flex flex-col justify-between min-h-[135px] transition-all">
    <div className="flex justify-between items-start">
      <div className="w-9 h-9 rounded-[5px] bg-white dark:bg-[#0A0F1D] flex items-center justify-center border border-[#E7E8EB] dark:border-white/10 shadow-sm">
        <CalendarHeart className="w-4.5 h-4.5 text-[#64748B] dark:text-slate-400" />
      </div>
      <span className="text-[11px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
        +{trend}%
      </span>
    </div>

    <div className="mt-4 space-y-3">
      <div className="flex justify-between items-end gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-[20px] font-bold text-[#101935] dark:text-white leading-none tracking-tight truncate">
            {value}
          </p>
          <p className="text-[12px] font-bold text-[#64748B] dark:text-slate-500 mt-2 tracking-tight truncate">
            {title}
          </p>
        </div>
        <p className="text-[11px] font-bold text-[#94A3B8] whitespace-nowrap">Target: 5</p>
      </div>
      <div className="h-1.5 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#5E60AD] rounded-full transition-all duration-700" 
          style={{ width: `${percentage}%` }} 
        />
      </div>
    </div>
  </div>
);

export default function PerformanceMetrics() {
  const metrics = [
    { title: "Patient Satisfaction", value: "4.8", percentage: 95, trend: "0.25" },
    { title: "Operational Efficiency", value: "8.5 min", percentage: 85, trend: "0.25" },
    { title: "Diagnostic Accuracy", value: "12,458", percentage: 92, trend: "0.25" },
    { title: "Resource Utilization", value: "12,458", percentage: 90, trend: "0.25" },
  ];

  return (
    <div className="bg-white dark:bg-[#101935] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 overflow-hidden font-sans transition-all">
      {/* Container Header */}
      <div className="px-6 py-4 border-b border-[#E7E8EB] dark:border-white/10 bg-slate-50/50 dark:bg-white/5">
        <h3 className="text-[16px] font-bold text-[#101935] dark:text-white">Performance Metrics</h3>
      </div>
      
      {/* Grid */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
        {metrics.map((metric, index) => (
          <PerformanceMetricItem 
            key={index}
            title={metric.title}
            value={metric.value}
            percentage={metric.percentage}
            trend={metric.trend}
          />
        ))}
      </div>
    </div>
  );
}
