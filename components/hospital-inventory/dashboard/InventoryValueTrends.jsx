"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const defaultTrendData = [
  { month: "Apr", value: 3.8, purchase: 3.1 },
  { month: "May", value: 4.2, purchase: 3.6 },
  { month: "Jun", value: 4.5, purchase: 3.9 },
  { month: "Jul", value: 5.1, purchase: 4.3 },
  { month: "Aug", value: 4.9, purchase: 4.0 },
  { month: "Sep", value: 5.4, purchase: 4.6 },
  { month: "Oct", value: 5.8, purchase: 5.1 },
  { month: "Nov", value: 5.3, purchase: 4.7 },
  { month: "Dec", value: 5.9, purchase: 5.3 },
  { month: "Jan", value: 6.4, purchase: 5.6 },
  { month: "Feb", value: 6.5, purchase: 5.8 },
  { month: "Mar", value: 6.9, purchase: 6.2 }
];

export function InventoryValueTrends({ trends }) {
  const chartData = trends || defaultTrendData;
  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 p-5 h-full">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h3 className="text-[16px] font-bold text-[#1e293b] dark:text-white">
            Inventory Value Trends
          </h3>
          <p className="text-[12px] text-gray-400">Monthly Value vs Purchase 2025-26</p>
        </div>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPurchase" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }}
              tickFormatter={(val) => `${val}L`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "5px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
              labelStyle={{ fontWeight: "bold", fontSize: "12px", color: "#1e293b" }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3B82F6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorValue)"
              dot={{ r: 3, fill: "#3B82F6", strokeWidth: 1.5, stroke: "#fff" }}
              activeDot={{ r: 5 }}
            />
            <Area
              type="monotone"
              dataKey="purchase"
              stroke="#EF4444"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorPurchase)"
              dot={{ r: 3, fill: "#EF4444", strokeWidth: 1.5, stroke: "#fff" }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default InventoryValueTrends;
