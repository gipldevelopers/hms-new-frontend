import React from "react";
import { Wallet, TrendingUp, Building2, Activity, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

const StatCard = ({ title, value, percentage, isUp, color, icon: Icon }) => {
  const colorMap = {
    indigo: {
      bg: "bg-[#F0F2FF]",
      icon: "text-[#5C67FF]",
      chart: "bg-[#3D429F]",
      type: "bars",
    },
    red: {
      bg: "bg-[#FFF1F1]",
      icon: "text-[#FF5C5C]",
      chart: "#FF5C5C",
      type: "line",
    },
    blue: {
      bg: "bg-[#E0F2FE]",
      icon: "text-[#3AB0FF]",
      chart: "bg-[#3AB0FF]",
      type: "bars_light",
    },
    emerald: {
      bg: "bg-[#E7F9ED]",
      icon: "text-[#2ECC71]",
      chart: "#10B981",
      type: "line_smooth",
    },
  };

  const style = colorMap[color] || colorMap.indigo;

  return (
    <div className="bg-white dark:bg-[#101935] p-5 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 flex justify-between h-[140px] transition-all">
      {/* Left Content */}
      <div className="flex flex-col justify-between">
        <div className={cn("w-10 h-10 rounded-[5px] flex items-center justify-center", style.bg)}>
          <Icon className={cn("w-5 h-5", style.icon)} />
        </div>

        <div className="mt-3">
          <p className="text-[13px] font-semibold text-gray-400 dark:text-slate-500 mb-0.5">
            {title}
          </p>
          <h2 className="text-[24px] font-bold text-[#1e293b] dark:text-white tracking-tight">
            {value}
          </h2>
        </div>
      </div>

      {/* Right Content */}
      <div className="flex flex-col items-end justify-between">
        <div className="flex flex-col items-end">
          <div
            className={cn(
              "text-[11px] font-bold px-2 py-0.5 rounded-[5px] text-white mb-1",
              isUp ? "bg-[#2ECC71]" : "bg-[#FF3B30]",
            )}
          >
            {isUp ? `+${percentage}%` : `-${percentage}%`}
          </div>
          <p className="text-[11px] font-medium text-gray-400 dark:text-slate-500 whitespace-nowrap tracking-tighter">
            in last 30 Days
          </p>
        </div>

        {/* Charts Container (Hand-crafted SVG charts from Dashboard) */}
        <div className="w-20 h-10 flex items-end justify-end overflow-hidden">
          {style.type === "bars" && (
            <div className="flex items-end gap-1 h-full">
              {[30, 60, 45, 90, 50, 80].map((h, i) => (
                <div key={i} className={cn("w-1.5 rounded-[5px]", style.chart)} style={{ height: `${h}%` }} />
              ))}
            </div>
          )}

          {style.type === "line" && (
            <svg viewBox="0 0 100 40" className="w-full h-full drop-shadow-sm">
              <path d="M0 35 Q 20 35, 40 20 T 70 25 T 100 10" fill="none" stroke={style.chart} strokeWidth="3" strokeLinecap="round" />
            </svg>
          )}

          {style.type === "bars_light" && (
            <div className="flex items-end gap-1 h-full">
              {[100, 40, 60, 30, 70, 65].map((h, i) => (
                <div key={i} className={cn("w-1.5 rounded-[5px]", style.chart)} style={{ height: `${h}%` }} />
              ))}
            </div>
          )}

          {style.type === "line_smooth" && (
            <svg viewBox="0 0 100 40" className="w-full h-full">
              <path d="M0 30 C 20 40, 40 35, 60 20 S 80 10, 100 5" fill="none" stroke={style.chart} strokeWidth="3" strokeLinecap="round" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};

export default function AnalyticsStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard 
        title="Total Revenue" 
        value="₹2,45,80,000" 
        percentage={18.2} 
        isUp={true}
        icon={Wallet} 
        color="indigo"
      />
      <StatCard 
        title="Revenue Growth" 
        value="+18.2%" 
        percentage={12.5} 
        isUp={true}
        icon={TrendingUp} 
        color="red"
      />
      <StatCard 
        title="Avg Revenue/Branch" 
        value="₹22,34,545" 
        percentage={3.2} 
        isUp={false}
        icon={Building2} 
        color="blue"
      />
      <StatCard 
        title="Revenue Target" 
        value="82%" 
        percentage={5.4} 
        isUp={true}
        icon={Activity} 
        color="emerald"
      />
    </div>
  );
}
