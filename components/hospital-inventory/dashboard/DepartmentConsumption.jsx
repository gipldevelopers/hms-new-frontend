"use client";

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const consumptionData = [
  { name: "ICU", value: 11000 },
  { name: "OT", value: 13000 },
  { name: "Pharmacy", value: 10000 },
  { name: "Emergency", value: 17000 },
  { name: "Labs", value: 5000 },
  { name: "Wards", value: 11000 }
];

export function DepartmentConsumption() {
  const [selectedPeriod, setSelectedPeriod] = useState("Monthly");

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 p-5 h-full">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h3 className="text-[16px] font-bold text-[#1e293b] dark:text-white">
            Department Consumption Analytics
          </h3>
          <p className="text-[12px] text-gray-400">Total units consumed per department</p>
        </div>
        <div>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="text-[12px] border border-[#E7E8EB] dark:border-white/10 dark:bg-slate-800 rounded px-2.5 py-1.5 font-semibold text-slate-600 dark:text-slate-200 outline-none cursor-pointer"
          >
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </div>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={consumptionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={38}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }}
              tickFormatter={(val) => `${val / 1000}k Units`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "5px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
              labelStyle={{ fontWeight: "bold", fontSize: "12px", color: "#1e293b" }}
              formatter={(value) => [`${value.toLocaleString()} Units`, "Consumption"]}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {consumptionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 3 ? "#4338CA" : "#5F54F1"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default DepartmentConsumption;
