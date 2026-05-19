"use client";

import React from "react";

export function FinanceRevenueTrend() {
  const data = [
    { m: "Apr", v: 40 },
    { m: "May", v: 48 },
    { m: "Jun", v: 55 },
    { m: "Jul", v: 70 },
    { m: "Aug", v: 65 },
    { m: "Sep", v: 80 },
    { m: "Oct", v: 95 },
    { m: "Nov", v: 85 },
    { m: "Dec", v: 105 },
    { m: "Jan", v: 120 },
    { m: "Feb", v: 135 },
    { m: "Mar", v: 150 },
  ];

  // Calculate SVG path points for straight lines
  const points = data.map((d, i) => ({
    x: i * (800 / 11),
    y: 200 - d.v
  }));

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <div className="w-full md:h-[350px] h-auto bg-card rounded-lg border border-border flex flex-col font-sans transition-all overflow-hidden shadow-none">
      <div className="p-5 pb-0">
        <h3 className="text-[16px] font-bold text-[#1e293b] dark:text-white leading-none mb-1">
          Revenue Trend
        </h3>
        <p className="text-[12px] text-gray-400 dark:text-slate-500 font-medium">
          Monthly overview — FY 2025-26
        </p>
      </div>

      <div className="px-10 py-6 relative flex-1 flex flex-col justify-end">
        {/* Y-Axis Labels */}
        <div className="absolute left-6 top-8 bottom-16 flex flex-col justify-between text-[11px] font-medium text-gray-400 dark:text-slate-600 z-10">
          <span>6L</span>
          <span>5L</span>
          <span>4L</span>
          <span>3L</span>
        </div>

        {/* Horizontal Grid Lines */}
        <div className="ml-10 mr-4 absolute left-6 right-6 top-8 bottom-16 flex flex-col justify-between pointer-events-none">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="w-full border-t border-border/50"></div>
          ))}
        </div>

        {/* Line Chart */}
        <div className="ml-10 mr-4 h-[200px] relative mb-2">
          <svg viewBox="0 0 800 200" className="w-full h-full overflow-visible">
            <defs>
              <filter id="line-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
                <feOffset in="blur" dx="0" dy="2" result="offsetBlur" />
                <feComponentTransfer in="offsetBlur" result="opacity">
                  <feFuncA type="linear" slope="0.4" />
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode in="opacity" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="dot-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
                <feOffset in="blur" dx="0" dy="1" result="offsetBlur" />
                <feMerge>
                  <feMergeNode in="offsetBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Area under line */}
            <path
              d={`${pathD} L 800 200 L 0 200 Z`}
              fill="url(#area-gradient)"
            />

            {/* Straight Line */}
            <path
              d={pathD}
              fill="none"
              stroke="#3B82F6"
              strokeWidth="3.5"
              filter="url(#line-glow)"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Dots */}
            {points.map((p, i) => {
              const isLast = i === points.length - 1;
              return (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r="5"
                  className={isLast
                    ? "fill-white"
                    : "fill-[#3B82F6]"
                  }
                  stroke={isLast ? "#3B82F6" : "none"}
                  strokeWidth={isLast ? "3" : "0"}
                  filter={isLast ? "" : "url(#dot-glow)"}
                />
              );
            })}
          </svg>
        </div>

        {/* X-Axis Labels */}
        <div className="ml-10 mr-4 flex justify-between text-[11px] font-medium text-gray-400 dark:text-slate-500">
          {data.map((d) => (
            <span key={d.m}>{d.m}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
