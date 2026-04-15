import React from "react";
import { ChevronDown } from "lucide-react";

export function BranchDistribution() {
  const data = [
    { name: "SG Highway", value: 35, color: "#72A9F1" }, // Light Blue
    { name: "Krishna Shalby", value: 35, color: "#9E58B6" }, // Purple
    { name: "Shalby Jaipur", value: 30, color: "#6167D1" }, // Indigo
  ];

  // SVG Constants for the donut
  const size = 200;
  const strokeWidth = 35;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  let currentOffset = 0;

  return (
    <div className="bg-white dark:bg-[#101935] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 flex flex-col h-full transition-all">
      {/* Header */}
      <div className="flex justify-between items-center p-5 border-b border-[#E7E8EB] dark:border-white/10">
        <h3 className="text-[16px] font-bold text-[#0F172A] dark:text-white">
          Branch Revenue Distribution
        </h3>
        <button className="flex items-center gap-2 text-[12px] font-semibold text-[#64748B] dark:text-slate-400 border border-[#E7E8EB] dark:border-white/10 px-3 py-1.5 rounded-[5px] hover:bg-gray-50 dark:hover:bg-[#1e293b] transition-colors">
          Weekly <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-6 flex flex-col items-center justify-center flex-grow">
        {/* Donut Chart SVG */}
        <div className="relative w-[180px] h-[180px] flex items-center justify-center">
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="rotate-[-90deg]"
          >
            {data.map((item, index) => {
              const strokeDasharray = `${(item.value * circumference) / 100} ${circumference}`;
              const strokeDashoffset = -currentOffset;
              currentOffset += (item.value * circumference) / 100;

              return (
                <circle
                  key={index}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="butt"
                  className="transition-all duration-500"
                  style={{
                    // Creates the white gap effect seen in the screenshot
                    outline: "1.5px solid white",
                    outlineOffset: "-0.5px",
                  }}
                />
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-6">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[12px] font-medium text-[#94A3B8] dark:text-slate-500">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
