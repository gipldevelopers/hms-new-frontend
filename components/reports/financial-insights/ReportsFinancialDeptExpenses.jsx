"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export function ReportsFinancialDeptExpenses() {
  const departments = [
    { name: "Surgery", amount: "$480K", margin: "42% Margin", pct: 100, color: "#4F46E5" },
    { name: "Cardiology", amount: "$320K", margin: "38% Margin", pct: 70, color: "#3B82F6" },
    { name: "Orthopedics", amount: "$250K", margin: "45% Margin", pct: 55, color: "#10B981" },
    { name: "Emergency", amount: "$180K", margin: "22% Margin", pct: 40, color: "#F59E0B" },
    { name: "OPD General", amount: "$95K", margin: "18% Margin", pct: 18, color: "#E2E8F0" }
  ];

  const expenseData = [
    { name: "OP Cost", value: 42, color: "#EF4444" },
    { name: "Other Cost", value: 58, color: "#F1F5F9" }
  ];

  const expensesList = [
    { name: "Staff & Payroll", amount: "$450K" },
    { name: "OT Operations", amount: "$120K" },
    { name: "Pharmacy Cost", amount: "$85K" },
    { name: "Equipment", amount: "$60K" }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px] font-sans">
      {/* Department Revenue Comparison Card */}
      <div className="bg-card rounded-lg border border-border flex flex-col justify-between shadow-none hover:border-gray-300 dark:hover:border-white/20 transition-all lg:h-[298px] h-auto overflow-hidden p-5">
        <div className="pb-2 shrink-0">
          <h3 className="text-[12px] font-black text-[#475569] dark:text-slate-300 uppercase tracking-wider">
            Department Revenue Comparison
          </h3>
        </div>

        <div className="flex-1 flex flex-col justify-between py-1.5">
          {departments.map((dept, idx) => (
            <div key={idx} className="space-y-0.5">
              <div className="flex justify-between items-center text-[11px] font-bold">
                <span className="text-[#1E293B] dark:text-slate-200 font-extrabold">{dept.name}</span>
                <div className="flex items-center gap-6">
                  <span className="text-gray-500 dark:text-slate-400 font-bold">{dept.amount}</span>
                  <span className="text-[#10B981] font-black w-[80px] text-right">{dept.margin}</span>
                </div>
              </div>
              <div className="w-full h-1.5 bg-gray-50 dark:bg-white/5 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${dept.pct}%`, backgroundColor: dept.color }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expense Analytics Card */}
      <div className="bg-card rounded-lg border border-border flex flex-col justify-between shadow-none hover:border-gray-300 dark:hover:border-white/20 transition-all lg:h-[298px] h-auto overflow-hidden p-5">
        <div className="pb-2 shrink-0">
          <h3 className="text-[12px] font-black text-[#475569] dark:text-slate-300 uppercase tracking-wider">
            Expense Analytics
          </h3>
        </div>

        <div className="flex-1 flex flex-row items-center justify-between gap-6 py-1">
          {/* Expenses Table list */}
          <div className="flex-1 flex flex-col justify-between h-[170px]">
            {expensesList.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-slate-800/30 last:border-b-0">
                <span className="text-[11px] font-extrabold text-gray-500 dark:text-slate-400">{item.name}</span>
                <span className="text-[12px] font-black text-[#1E293B] dark:text-white">{item.amount}</span>
              </div>
            ))}
          </div>

          {/* OP COST Donut Chart */}
          <div className="relative w-[110px] h-[110px] shrink-0 flex items-center justify-center mr-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={36}
                  outerRadius={46}
                  paddingAngle={0}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center select-none text-center">
              <span className="text-[16px] font-black text-[#EF4444] leading-none">42%</span>
              <span className="text-[7px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">OP Cost</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
