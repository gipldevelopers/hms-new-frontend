"use client";

import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const revenueTrendData = [
  { month: "Jan", gap: 0.8, direct: 0.7, insurance: 0.6 },
  { month: "Feb", gap: 1.0, direct: 0.9, insurance: 0.7 },
  { month: "Mar", gap: 1.2, direct: 1.1, insurance: 1.1 },
  { month: "Apr", gap: 1.3, direct: 1.0, insurance: 1.1 },
  { month: "May", gap: 1.5, direct: 1.1, insurance: 1.9 },
  { month: "Jun", gap: 0.7, direct: 0.6, insurance: 0.5 },
  { month: "Jul", gap: 0.9, direct: 0.8, insurance: 0.7 },
  { month: "Aug", gap: 1.0, direct: 1.0, insurance: 0.8 },
  { month: "Sep", gap: 1.6, direct: 1.3, insurance: 1.5 },
  { month: "Oct", gap: 1.5, direct: 1.2, insurance: 1.6 },
  { month: "Nov", gap: 1.2, direct: 1.0, insurance: 0.9 },
  { month: "Dec", gap: 1.1, direct: 0.4, insurance: 0.6 }
];
const paymentModeData = [
  { name: "Insurance", value: 45, color: "#4F46E5" },
  { name: "Card", value: 30, color: "#10B981" },
  { name: "UPI", value: 15, color: "#3B82F6" },
  { name: "Cash", value: 10, color: "#E2E8F0" }
];

export function ReportsFinancialChartsGrid() {
  const [timeframe, setTimeframe] = useState("Monthly");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-[24px] font-sans">
      {/* Left Card: Revenue Trend Bar Chart */}
      <div className="lg:col-span-8 bg-card rounded-lg border border-border flex flex-col justify-between shadow-none hover:border-gray-300 dark:hover:border-white/20 transition-all lg:h-[380px] h-auto overflow-hidden">
        {/* Header */}
        <div className="p-5 pb-3 flex justify-between items-center shrink-0">
          <h3 className="text-[15px] font-bold text-[#1E293B] dark:text-white">
            Revenue Trend
          </h3>
          <div className="relative">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="text-[11px] font-bold text-gray-500 dark:text-slate-300 bg-[#F8F9FC] dark:bg-slate-800 border border-[#E7E8EB] dark:border-slate-700 rounded-lg px-2.5 py-1 outline-none cursor-pointer hover:bg-gray-100/50"
            >
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>
        </div>
        <div className="border-b border-[#E7E8EB] dark:border-white/10 w-full"></div>

        {/* Recharts Stacked Bar Chart */}
        <div className="px-5 pb-5 flex-1 relative flex flex-col justify-end w-full">
          <div className="h-[290px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueTrendData} margin={{ top: 20, right: 10, left: -25, bottom: 5 }} barGap={0} barSize={16}>
                <CartesianGrid vertical={false} stroke="#F1F5F9" strokeDasharray="" />
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
                  width={60}
                  dx={-5}
                  domain={[0, 5]}
                  ticks={[0, 1, 2, 3, 4, 5]}
                  tickFormatter={(val) => `${val}L`}
                />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "gap") return [null, null];
                    return [`${value}L`, name === "direct" ? "Direct Pay" : "Insurance"];
                  }}
                  contentStyle={{
                    backgroundColor: "#1E293B",
                    borderRadius: "6px",
                    border: "none",
                    color: "#fff",
                    fontSize: "11px",
                    fontWeight: "bold",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                  }}
                  cursor={{ fill: "transparent" }}
                />
                {/* Floating Stacked bars: transparent bottom gap, light blue in middle, indigo on top */}
                <Bar dataKey="gap" stackId="revenue" fill="transparent" />
                <Bar dataKey="direct" stackId="revenue" fill="#3B82F6" radius={[0, 0, 0, 0]} />
                <Bar dataKey="insurance" stackId="revenue" fill="#4F46E5" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Right Column: Unified Payment Mode & Insurance Status Card */}
      <div className="lg:col-span-4 bg-card rounded-lg border border-border flex flex-col shadow-none hover:border-gray-300 dark:hover:border-white/20 transition-all lg:h-[380px] h-auto overflow-hidden p-5 justify-between">
        {/* Payment Mode Distribution Section */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="pb-1.5">
            <h3 className="text-[12px] font-black text-[#475569] dark:text-slate-300 uppercase tracking-wider">
              Payment Mode Distribution
            </h3>
          </div>
          <div className="flex items-center justify-between gap-5 py-5">
            {/* Donut Chart */}
            <div className="relative w-[90px] h-[90px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[{ value: 100 }]}
                    cx="50%"
                    cy="50%"
                    innerRadius={28}
                    outerRadius={36}
                    paddingAngle={0}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                    stroke="none"
                  >
                    <Cell fill="#4F46E5" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[13px] font-black text-[#1E293B] dark:text-white">100%</span>
              </div>
            </div>

            {/* Legends Table */}
            <div className="flex-1 flex flex-col justify-center gap-1 pl-2">
              {paymentModeData.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-[11px] font-bold">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                    <span className="text-gray-600 dark:text-slate-400 font-extrabold">{item.name}</span>
                  </div>
                  <span className="text-[#1E293B] dark:text-white font-black">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#E7E8EB] dark:border-white/10 my-1 w-full "></div>

        {/* Insurance & TPA Status Section */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="pb-4">
            <h3 className="text-[12px] font-black text-[#475569] dark:text-slate-300 uppercase tracking-wider mt-4">
              Insurance & TPA Status
            </h3>
          </div>
          <div className="flex flex-col gap-6">
            {/* Approved Claims */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] font-bold text-gray-700 dark:text-slate-300 leading-none">
                <span className="font-extrabold text-[#1E293B] dark:text-slate-200">Approved Claims</span>
                <span className="text-[#10B981] font-black">68%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-[#10B981] rounded-full" style={{ width: "68%" }}></div>
              </div>
            </div>

            {/* Pending Claims */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] font-bold text-gray-700 dark:text-slate-300 leading-none">
                <span className="font-extrabold text-[#1E293B] dark:text-slate-200">Pending Claims</span>
                <span className="text-[#F59E0B] font-black">24%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-[#F59E0B] rounded-full" style={{ width: "24%" }}></div>
              </div>
            </div>

            {/* Rejected Claims */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] font-bold text-gray-700 dark:text-slate-300 leading-none">
                <span className="font-extrabold text-[#1E293B] dark:text-slate-200">Rejected Claims</span>
                <span className="text-[#EF4444] font-black">8%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-[#EF4444] rounded-full" style={{ width: "8%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
