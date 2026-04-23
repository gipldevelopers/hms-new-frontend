"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { day: "Mon", admissions: 35, discharges: 25 },
  { day: "Tue", admissions: 42, discharges: 35 },
  { day: "Wed", admissions: 55, discharges: 45 },
  { day: "Thu", admissions: 40, discharges: 30 },
  { day: "Fri", admissions: 60, discharges: 50 },
  { day: "Sat", admissions: 30, discharges: 22 },
  { day: "Sun", admissions: 48, discharges: 38 },
];

export function AdmissionsDischarges() {
  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 h-full overflow-hidden">
      <div className="flex justify-between items-center p-5">
        <div>
          <h3 className="text-[16px] font-bold text-[#1e293b] dark:text-white">
            Admissions vs Discharges
          </h3>
          <p className="text-[12px] text-gray-400">Last 7 days</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-[3px] bg-[#3B82F6]"></div>
              <span className="text-[12px] font-medium text-[#64748B]">Admissions</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-[3px] bg-[#10B981]"></div>
              <span className="text-[12px] font-medium text-[#64748B]">Discharges</span>
           </div>
        </div>
      </div>

      <div className="border-b border-[#E7E8EB] dark:border-white/10 w-full"></div>

      <div className="p-5">
        <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            margin={{ top: 10, right: 0, left: -20, bottom: 0 }} 
            barGap={4}
            barCategoryGap="25%"
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fontWeight: 500, fill: "#94a3b8" }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fontWeight: 500, fill: "#94a3b8" }}
            />
            <Tooltip
              cursor={{ fill: "#f8fafc" }}
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "5px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              labelStyle={{ fontWeight: "bold", fontSize: "12px", color: "#1e293b" }}
            />
            <Bar
              dataKey="admissions"
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
              barSize={18}
            />
            <Bar
              dataKey="discharges"
              fill="#10B981"
              radius={[4, 4, 0, 0]}
              barSize={18}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      </div>
    </div>
  );
}
