import React from "react";
import { Users, Hospital, UserPlus, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({ title, value, percentage, isUp, color, icon: Icon }) {
  const colorMap = {
    indigo: {
      bg: "bg-[#F0F2FF]",
      icon: "text-[#5C67FF]",
      chart: "bg-[#3D429F]",
      type: "bars",
    },
    red: {
      bg: "bg-[#FFF1F1]",
      icon: "text-[#FF5C5C]",
      chart: "#FF5C5C",
      type: "line",
    },
    blue: {
      bg: "bg-[#E0F2FE]",
      icon: "text-[#3AB0FF]",
      chart: "bg-[#3AB0FF]",
      type: "bars_light",
    },
    emerald: {
      bg: "bg-[#E7F9ED]",
      icon: "text-[#2ECC71]",
      chart: "#10B981",
      type: "line_smooth",
    },
  };

  const style = colorMap[color] || colorMap.indigo;

  return (
    <div className="bg-white dark:bg-[#101935] p-5 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 flex justify-between min-w-[280px] h-[140px] transition-all">
      {/* Left Content */}
      <div className="flex flex-col justify-between">
        <div
          className={cn(
            "w-10 h-10 rounded-[5px] flex items-center justify-center",
            style.bg,
          )}
        >
          {Icon ? (
             <Icon className={cn("w-5 h-5", style.icon)} />
          ) : (
            <>
              {title === "Doctors" && (
                <Users className={cn("w-5 h-5", style.icon)} />
              )}
              {title === "Total Departments" && (
                <Hospital className={cn("w-5 h-5", style.icon)} />
              )}
              {title === "Total Users" && (
                <UserPlus className={cn("w-5 h-5", style.icon)} />
              )}
              {title === "Revenue" && (
                <DollarSign className={cn("w-5 h-5", style.icon)} />
              )}
            </>
          )}
        </div>

        <div className="mt-3">
          <p className="text-[13px] font-semibold text-gray-400 dark:text-slate-500 mb-0.5">
            {title}
          </p>
          <h2 className="text-[24px] font-bold text-[#1e293b] dark:text-white tracking-tight">
            {title === "Revenue" ? `₹${value}` : value}
          </h2>
        </div>
      </div>

      {/* Right Content */}
      <div className="flex flex-col items-end justify-between">
        <div className="flex flex-col items-end">
          <div
            className={cn(
              "text-[11px] font-bold px-2 py-0.5 rounded-[5px] text-white mb-1",
              isUp ? "bg-[#2ECC71]" : "bg-[#FF3B30]",
            )}
          >
            {isUp ? `+${percentage}%` : `-${percentage}%`}
          </div>
          <p className="text-[11px] font-medium text-gray-400 dark:text-slate-500 whitespace-nowrap">
            in last 7 Days
          </p>
        </div>

        {/* Charts Container */}
        <div className="w-20 h-10 flex items-end justify-end overflow-hidden">
          {style.type === "bars" && (
            <div className="flex items-end gap-1 h-full">
              {[30, 60, 45, 90, 50, 80].map((h, i) => (
                <div
                  key={i}
                  className={cn("w-1.5 rounded-[5px]", style.chart)}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          )}

          {style.type === "line" && (
            <svg viewBox="0 0 100 40" className="w-full h-full drop-shadow-sm">
              <defs>
                <linearGradient id="gradientRed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={style.chart} stopOpacity="0.4" />
                  <stop offset="100%" stopColor={style.chart} stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0 35 Q 20 35, 40 20 T 70 25 T 100 10"
                fill="none"
                stroke={style.chart}
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M0 35 Q 20 35, 40 20 T 70 25 T 100 10 V 40 H 0 Z"
                fill="url(#gradientRed)"
                opacity="0.2"
              />
            </svg>
          )}

          {style.type === "bars_light" && (
            <div className="flex items-end gap-1 h-full">
              {[100, 40, 60, 30, 70, 65].map((h, i) => (
                <div
                  key={i}
                  className={cn("w-1.5 rounded-[5px]", style.chart)}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          )}

          {style.type === "line_smooth" && (
            <svg viewBox="0 0 100 40" className="w-full h-full">
              <defs>
                <linearGradient id="gradientGreen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={style.chart} stopOpacity="0.4" />
                  <stop offset="100%" stopColor={style.chart} stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0 30 C 20 40, 40 35, 60 20 S 80 10, 100 5"
                fill="none"
                stroke={style.chart}
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M0 30 C 20 40, 40 35, 60 20 S 80 10, 100 5 V 40 H 0 Z"
                fill="url(#gradientGreen)"
                opacity="0.2"
              />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
