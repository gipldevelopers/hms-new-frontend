import React from "react";
import { ChevronDown } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function DepartmentDistribution() {
  const data = [
    { name: "Cardiology", value: 28, color: "#3B82F6" },
    { name: "Orthopedics", value: 22, color: "#10B981" },
    { name: "Neurology", value: 18, color: "#A855F7" },
    { name: "Emergency", value: 15, color: "#F59E0B" },
    { name: "Pediatrics", value: 12, color: "#EF4444" },
    { name: "Others", value: 5, color: "#64748B" },
  ];

  const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, name, value, color }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.25;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill={color}
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-[13px] font-medium"
      >
        {`${name} ${value}%`}
      </text>
    );
  };

  return (
    <div className="bg-white dark:bg-[#101935] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 flex flex-col h-full font-sans transition-all">
      {/* Header (No background as per image) */}
      <div className="flex justify-between items-center px-6 py-4">
        <h3 className="text-[16px] font-bold text-[#1E293B] dark:text-white">
          Department Distribution
        </h3>
        <button className="flex items-center gap-2 text-[12px] font-medium text-[#1e293b] dark:text-slate-300 border border-[#E7E8EB] dark:border-white/10 px-3 py-1.5 rounded-[5px] bg-white dark:bg-white/5">
          Monthly <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </button>
      </div>

      <div className="flex-grow flex items-center justify-center p-2">
        <div className="w-full h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={75}
                dataKey="value"
                strokeWidth={1}
                stroke="#fff"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="h-4"></div>
    </div>
  );
}
