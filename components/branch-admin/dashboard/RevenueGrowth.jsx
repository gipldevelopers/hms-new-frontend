"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChevronDown } from "lucide-react";

const data = [
  { month: "JAN", revenue: 2000 },
  { month: "FEB", revenue: 3500 },
  { month: "MAR", revenue: 3200 },
  { month: "APR", revenue: 4500 },
  { month: "MAY", revenue: 4200 },
  { month: "JUN", revenue: 6500 },
];

export function RevenueGrowth() {
  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 h-full overflow-hidden">
      <div className="flex justify-between items-center p-5">
        <div>
          <h3 className="text-[16px] font-bold text-[#1e293b] dark:text-white">
            Revenue Growth
          </h3>
          <p className="text-[12px] text-gray-400">Cumulative monthly earnings</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 cursor-pointer">
          <span className="text-[12px] font-bold text-gray-600 dark:text-gray-300">Last 6 Months</span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      <div className="border-b border-[#E7E8EB] dark:border-white/10 w-full"></div>

      <div className="p-5">
        <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#5D69F4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#5D69F4" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }}
              dy={10}
            />
            <YAxis hide domain={[0, 8000]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "5px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              labelStyle={{ fontWeight: "bold", fontSize: "12px", color: "#1e293b" }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#5D69F4"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRev)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      </div>
    </div>
  );
}
