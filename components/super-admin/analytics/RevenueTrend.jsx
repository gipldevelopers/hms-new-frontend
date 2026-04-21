import React from "react";
import { ChevronDown } from "lucide-react";

export default function RevenueTrend() {
  const data = [
    { m: "Jan", v1: 28, v2: 35, offset: 20 },
    { m: "Feb", v1: 32, v2: 45, offset: 25 },
    { m: "Mar", v1: 55, v2: 55, offset: 30 },
    { m: "Apr", v1: 55, v2: 50, offset: 32 },
    { m: "May", v1: 90, v2: 55, offset: 38 },
    { m: "Jun", v1: 25, v2: 30, offset: 18 },
    { m: "Jul", v1: 35, v2: 40, offset: 22 },
    { m: "Aug", v1: 42, v2: 48, offset: 25 },
    { m: "Sep", v1: 75, v2: 65, offset: 40 },
    { m: "Oct", v1: 80, v2: 60, offset: 38 },
    { m: "Nov", v1: 45, v2: 50, offset: 30 },
    { m: "Dec", v1: 30, v2: 20, offset: 28 },
  ];

  return (
    <div className="w-full bg-white dark:bg-[#101935] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 flex flex-col font-sans transition-all">
      {/* Header */}
      <div className="flex justify-between items-center p-5">
        <h3 className="text-[16px] font-bold text-[#0F172A] dark:text-white">Revenue Trend</h3>
        <button className="flex items-center gap-2 text-[12px] font-medium text-[#64748B] dark:text-slate-400 border border-[#E7E8EB] dark:border-white/10 px-3 py-1.5 rounded-[5px] transition-colors">
          Monthly <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="px-6 pb-8 pt-2 relative">
        {/* Y-Axis Labels & Dashed Lines */}
        <div className="absolute inset-x-6 top-2 bottom-12 flex flex-col justify-between pointer-events-none">
          {["₹50L", "₹40L", "₹30L", "₹20L", "₹10L", "₹0L"].map((label) => (
            <div key={label} className="relative flex items-center w-full h-0">
              <span className="absolute -left-1 text-[11px] font-bold text-[#94A3B8] dark:text-slate-500 w-8 text-right pr-2">
                {label}
              </span>
              <div className="ml-8 w-full border-t border-dashed border-[#E7E8EB] dark:border-white/5"></div>
            </div>
          ))}
        </div>

        {/* Bars Container */}
        <div className="h-[200px] ml-8 flex items-end justify-between relative z-10 px-2 mt-4">
          {data.map((item, i) => (
            <div
              key={i}
              className="flex-1 flex flex-col items-center group h-full justify-end"
            >
              {/* Floating Stacked Bar */}
              <div
                className="w-full max-w-[16px] flex flex-col justify-end"
                style={{ marginBottom: `${item.offset}%` }}
              >
                {/* Purple Bar (Top) */}
                <div
                  className="bg-[#4F46E5] w-full rounded-[5px]"
                  style={{ height: `${item.v1 * 0.7}px` }}
                ></div>
                {/* Gap */}
                <div className="h-[2px]"></div>
                {/* Blue Bar (Bottom) */}
                <div
                  className="bg-[#38BDF8] w-full rounded-[5px]"
                  style={{ height: `${item.v2 * 0.7}px` }}
                ></div>
              </div>

              {/* X-Axis Month Label */}
              <span className="absolute -bottom-6 text-[10px] text-[#64748B] dark:text-slate-500 font-bold">
                {item.m}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
