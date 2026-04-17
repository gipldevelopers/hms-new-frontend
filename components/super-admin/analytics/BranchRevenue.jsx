import React from "react";
import { ChevronDown } from "lucide-react";

export default function BranchRevenue() {
  const yLabels = ["₹100L", "₹75L", "₹50L", "₹25L", "0"];
  const data = [
    { name: "SG Highway", value: 44 },
    { name: "Krishna Shalby", value: 75 },
    { name: "Shalby Jaipur", value: 41 },
    { name: "Global Raipur", value: 92 },
    { name: "Krishna Vijay", value: 22 },
    { name: "Shalby Lucknow", value: 58 },
  ];

  return (
    <div className="bg-white dark:bg-[#101935] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 overflow-hidden font-sans transition-all">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-[#E7E8EB] dark:border-white/10 bg-slate-50/50 dark:bg-white/5">
        <h3 className="text-[16px] font-bold text-[#101935] dark:text-white tracking-wider">
          Branch Revenue Distribution
        </h3>
        <button className="flex items-center gap-2 text-[12px] font-bold text-[#64748B] dark:text-slate-400 border border-[#E7E8EB] dark:border-white/10 px-3 py-1.5 rounded-[5px] transition-colors">
          Monthly <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-6 h-[300px] relative flex">
        {/* Y-Axis Labels */}
        <div className="flex flex-col justify-between text-[11px] font-bold text-[#64748B] dark:text-slate-500 pr-6 pb-12">
          {yLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        {/* Chart Area */}
        <div className="relative flex-1 h-full">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pb-12 pointer-events-none">
            {yLabels.map((line) => (
              <div key={line} className="w-full border-t border-dashed border-[#F1F5F9] dark:border-white/5" />
            ))}
            <div className="w-full border-t border-dashed border-[#F1F5F9] dark:border-white/5" />
          </div>

          {/* Bars Container */}
          <div className="absolute inset-0 flex items-end justify-around pb-12 px-1 h-full z-10">
            {data.map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center h-full justify-end w-full max-w-[60px] px-1"
              >
                {/* The Bar */}
                <div
                  className="w-full bg-[#5E60AD] rounded-[2px] transition-all duration-1000"
                  style={{ height: `${(item.value / 100) * 100}%` }}
                ></div>

                {/* X-Axis Label */}
                <div className="absolute -bottom-10 w-full text-center">
                  <span className="text-[10px] text-[#334155] dark:text-slate-400 font-bold uppercase whitespace-nowrap overflow-hidden text-ellipsis px-0.5">
                    {item.name.split(" ")[0]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="h-10"></div>
    </div>
  );
}
