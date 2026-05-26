"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceDot,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { TrendingUp } from "lucide-react";

// LOS Area Chart Data
const losData = [
  { week: "W1", los: 5.0 },
  { week: "W2", los: 6.2 },
  { week: "W3", los: 5.8 },
  { week: "W4", los: 6.0 },
  { week: "W5", los: 9.2 }, // Orthopedics Spike
  { week: "W6", los: 6.5 },
  { week: "W7", los: 6.0 }
];

// Mortality Donut Chart Data (sequenced clockwise from 12 o'clock)
const mortalityData = [
  { name: "ICU", value: 35, color: "#3B82F6" },
  { name: "Emergency", value: 30, color: "#3F51B5" },
  { name: "Surgical", value: 35, color: "#F59E0B" }
];

// Mortality Legend Data
const mortalityLegend = [
  { name: "Emergency", color: "#3F51B5" },
  { name: "ICU", color: "#3B82F6" },
  { name: "Surgical", color: "#F59E0B" }
];

// Custom Reference Dot Shape to render the red oval spike and label perfectly
const CustomReferenceDotShape = (props) => {
  const { cx, cy } = props;
  if (!cx || !cy) return null;
  return (
    <g>
      {/* Absolute Spike Annotation Overlay */}
      <foreignObject x={cx - 65} y={cy - 46} width={130} height={32}>
        <div className="bg-[#0F172A] text-white text-[9px] font-extrabold px-2 py-1 rounded-[4px] shadow-lg text-center whitespace-nowrap select-none border border-slate-800 leading-none flex items-center justify-center h-full">
          Orthopedics Spike: 9.2 Days
        </div>
      </foreignObject>
      {/* Oval shape */}
      <ellipse
        cx={cx}
        cy={cy}
        rx={12}
        ry={5}
        fill="transparent"
        stroke="#EF4444"
        strokeWidth={3}
      />
    </g>
  );
};

export function ReportsLOSAnalytics() {
  const [activeTab, setActiveTab] = useState("Weekly");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-[20px] font-sans">
      {/* Card 1: Length of Stay (LOS) Analytics */}
      <div className="lg:col-span-5 bg-card rounded-lg border border-border flex flex-col justify-between shadow-none hover:border-gray-300 dark:hover:border-white/20 transition-all min-h-[360px]">
        <div className="flex justify-between items-center p-5 pb-2 shrink-0">
          <h3 className="text-[15px] font-bold text-[#1e293b] dark:text-white">
            Length of Stay (LOS) Analytics
          </h3>
          {/* Daily/Weekly/Monthly Switcher */}
          <div className="flex items-center bg-[#F8F9FC] dark:bg-slate-800/40 p-0.5 rounded-[8px] border border-[#E7E8EB] dark:border-white/10">
            {["Daily", "Weekly", "Monthly"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-[6px] text-[10px] font-bold transition-all ${
                  activeTab === tab
                    ? "bg-white dark:bg-slate-700 text-[#1e293b] dark:text-white shadow-sm border border-gray-100 dark:border-slate-600"
                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Area */}
        <div className="px-5 pb-3 flex-1 relative flex flex-col justify-end">
          <div className="h-[275px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={losData} margin={{ top: 50, right: 15, left: -10, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorLos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5D69F4" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#5D69F4" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  stroke="#F1F5F9"
                  strokeDasharray=""
                />
                <XAxis
                  dataKey="week"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }}
                  dx={-5}
                  width={55}
                  domain={[0, 10]}
                  ticks={[2, 4, 6, 8, 10]}
                  tickFormatter={(val) => `${val} Days`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1E293B",
                    borderRadius: "6px",
                    border: "none",
                    color: "#fff",
                    fontSize: "11px",
                    fontWeight: "bold",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                  }}
                  itemStyle={{ color: "#fff" }}
                  labelStyle={{ display: "none" }}
                  formatter={(value) => [`${value} Days`, "Length of Stay"]}
                />
                <Area
                  type="monotone"
                  dataKey="los"
                  stroke="#5D69F4"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorLos)"
                />
                <ReferenceDot
                  x="W5"
                  y={9.2}
                  shape={CustomReferenceDotShape}
                  isFront={true}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Card 2: Readmission Analytics */}
      <div className="lg:col-span-3 bg-card rounded-lg border border-border p-5 flex flex-col justify-between shadow-none hover:border-gray-300 dark:hover:border-white/20 transition-all min-h-[360px]">
        <div className="pb-2 shrink-0">
          <h3 className="text-[15px] font-bold text-[#1e293b] dark:text-white">
            Readmission Analytics
          </h3>
        </div>

        {/* Severity Metrics Panel */}
        <div className="grid grid-cols-2 gap-3 p-3 bg-[#F8F9FC] dark:bg-[#1E293B]/30 rounded-lg border border-gray-100 dark:border-white/5 my-2 shrink-0">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
              7-Day Rate
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[18px] font-black text-[#1e293b] dark:text-white">
                6.2%
              </span>
              <span className="text-[10px] font-extrabold text-red-500 flex items-center">
                <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
                1.2%
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-0.5 pl-3 border-l border-gray-100 dark:border-white/5">
            <span className="text-[9px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
              Severity Score
            </span>
            <span className="text-[18px] font-black text-[#F59E0B] dark:text-amber-400">
              High
            </span>
          </div>
        </div>

        {/* Disease-Wise Section */}
        <div className="flex-1 flex flex-col justify-between gap-3 mt-2">
          <span className="text-[9px] font-extrabold text-[#3F51B5] dark:text-indigo-400 uppercase tracking-wider">
            Disease-Wise Readmission
          </span>
          
          {/* Cardiac */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[11px] font-extrabold text-gray-700 dark:text-slate-300">
              <span>Cardiac</span>
              <span>14.5%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-[#F59E0B] rounded-full" style={{ width: "14.5%" }}></div>
            </div>
          </div>

          {/* Pulmonary */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[11px] font-extrabold text-gray-700 dark:text-slate-300">
              <span>Pulmonary</span>
              <span>11.2%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-[#F59E0B] rounded-full" style={{ width: "11.2%" }}></div>
            </div>
          </div>

          {/* Diabetes Comp. */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[11px] font-extrabold text-gray-700 dark:text-slate-300">
              <span>Diabetes Comp.</span>
              <span>8.4%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-[#F59E0B] rounded-full" style={{ width: "8.4%" }}></div>
            </div>
          </div>

          {/* Post-Surgical */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[11px] font-extrabold text-gray-700 dark:text-slate-300">
              <span>Post-Surgical</span>
              <span>5.1%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-[#F59E0B] rounded-full" style={{ width: "5.1%" }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Mortality Insights */}
      <div className="lg:col-span-4 bg-card rounded-lg border border-border flex flex-col justify-between shadow-none hover:border-gray-300 dark:hover:border-white/20 transition-all min-h-[360px] overflow-hidden">
        <div className="p-5 pb-4 shrink-0">
          <h3 className="text-[15px] font-bold text-[#1e293b] dark:text-white">
            Mortality Insights
          </h3>
        </div>
        <div className="border-b border-[#E7E8EB] dark:border-white/10 w-full"></div>

        <div className="p-5 flex-1 flex flex-col justify-between">
          {/* Donut Chart Container */}
          <div className="flex-1 flex items-center justify-center min-h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mortalityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {mortalityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Custom Legend */}
          <div className="flex justify-center items-center gap-4 text-[11px] font-bold text-gray-500 dark:text-slate-400 mt-2 shrink-0">
            {mortalityLegend.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                ></span>
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
