"use client";

import React from "react";

export function ReportsRevenueTrend() {
  // We want:
  // 3L corresponding to y = 200 (bottom, v = 0)
  // 6L corresponding to y = 0   (top, v = 200)
  // v is defined as the distance from 3L in scale units where 1L = 200/3 = 66.67 units.
  const data = [
    { m: "Apr", v: 47 },   // 3.7L
    { m: "May", v: 80 },   // 4.2L
    { m: "Jun", v: 100 },  // 4.5L
    { m: "Jul", v: 133 },  // 5.0L
    { m: "Aug", v: 117 },  // 4.75L
    { m: "Sep", v: 153 },  // 5.3L
    { m: "Oct", v: 173 },  // 5.6L
    { m: "Nov", v: 147 },  // 5.2L
    { m: "Dec", v: 187 },  // 5.8L
    { m: "Jan", v: 200 },  // 6.0L (exactly hits the 6L line!)
    { m: "Feb", v: 217 },  // 6.25L (above 6L!)
    { m: "Mar", v: 230 },  // 6.45L (above 6L!)
  ];

  // Calculate SVG path points for straight lines
  const points = data.map((d, i) => ({
    x: i * (800 / 11),
    y: 200 - d.v
  }));

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <div className="w-full md:h-[350px] h-auto bg-card rounded-lg border border-border flex flex-col font-sans transition-all overflow-hidden shadow-none hover:border-gray-300 dark:hover:border-white/20">
      <div className="p-5 pb-0">
        <h3 className="text-[16px] font-bold text-[#1e293b] dark:text-white leading-none mb-1">
          Revenue Trend
        </h3>
        <p className="text-[12px] text-gray-400 dark:text-slate-500 font-medium">
          Monthly overview — FY 2025-26
        </p>
      </div>

      <div className="px-10 py-6 relative flex-1 flex flex-col justify-end">
        {/* Container for Chart, Grid Lines, and Labels to ensure 100% alignment */}
        <div className="ml-10 mr-4 h-[200px] relative mb-2">

          {/* Y-Axis Labels - Aligned exactly with the 200px chart height */}
          <div className="absolute -left-10 top-0 bottom-0 flex flex-col justify-between text-[11px] font-semibold text-gray-400 dark:text-slate-500 z-10 font-sans leading-none translate-y-[-4px]">
            <span>6L</span>
            <span>5L</span>
            <span>4L</span>
            <span>3L</span>
          </div>

          {/* Horizontal Grid Lines - Aligned exactly with the 200px chart height */}
          <div className="absolute left-0 right-0 top-0 bottom-0 flex flex-col justify-between pointer-events-none">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="w-full border-t border-border/60"></div>
            ))}
          </div>

          {/* SVG Line Chart */}
          <svg viewBox="0 0 800 200" className="w-full h-full overflow-visible relative z-20">
            <defs>
              <filter id="line-glow-reports" x="-20%" y="-20%" width="140%" height="140%">
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
              <filter id="dot-glow-reports" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
                <feOffset in="blur" dx="0" dy="1" result="offsetBlur" />
                <feMerge>
                  <feMergeNode in="offsetBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="area-gradient-reports-rev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Area under line */}
            <path
              d={`${pathD} L 800 200 L 0 200 Z`}
              fill="url(#area-gradient-reports-rev)"
            />

            {/* Straight Line */}
            <path
              d={pathD}
              fill="none"
              stroke="#3B82F6"
              strokeWidth="3.5"
              filter="url(#line-glow-reports)"
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
                  r="5.5"
                  className={isLast
                    ? "fill-white"
                    : "fill-[#3B82F6]"
                  }
                  stroke={isLast ? "#3B82F6" : "none"}
                  strokeWidth={isLast ? "3.5" : "0"}
                  filter={isLast ? "" : "url(#dot-glow-reports)"}
                />
              );
            })}
          </svg>
        </div>

        {/* X-Axis Labels */}
        <div className="ml-10 mr-4 flex justify-between text-[11px] font-semibold text-gray-400 dark:text-slate-500 font-sans mt-2">
          {data.map((d, i) => (
            <span key={d.m} className={i % 2 === 1 ? "hidden sm:inline" : ""}>
              {d.m}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
