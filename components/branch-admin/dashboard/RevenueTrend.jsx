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

const data = [
  { month: "Apr", revenue: 3100 },
  { month: "May", revenue: 3800 },
  { month: "Jun", revenue: 4100 },
  { month: "Jul", revenue: 4800 },
  { month: "Aug", revenue: 4500 },
  { month: "Sep", revenue: 5200 },
  { month: "Oct", revenue: 5500 },
  { month: "Nov", revenue: 5000 },
  { month: "Dec", revenue: 5800 },
  { month: "Jan", revenue: 6200 },
  { month: "Feb", revenue: 6500 },
  { month: "Mar", revenue: 6800 },
];

export function RevenueTrend() {
  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 overflow-hidden">
      <div className="flex justify-between items-center p-5">
        <div>
          <h3 className="text-[16px] font-bold text-[#1e293b] dark:text-white">
            Revenue Trend
          </h3>
          <p className="text-[12px] text-gray-400">Monthly overview — FY 2025-26</p>
        </div>
      </div>

      <div className="border-b border-[#E7E8EB] dark:border-white/10 w-full"></div>

      <div className="p-5">
        <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevTrend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }}
              tickFormatter={(value) => `${value / 1000}L`}
            />
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
              stroke="#3B82F6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRevTrend)"
              dot={{ r: 4, fill: "#3B82F6", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, fill: "#3B82F6", strokeWidth: 2, stroke: "#fff" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      </div>
    </div>
  );
}
