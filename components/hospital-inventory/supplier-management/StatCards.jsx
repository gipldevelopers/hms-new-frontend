"use client";

import React from "react";
import { CalendarHeart } from "lucide-react";

const StatCard = ({ title, value, iconBgColor, iconColor }) => (
  <div className="bg-white dark:bg-[#1e293b] p-5 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] flex items-center justify-between min-h-[110px] shadow-none">
    <div className="flex flex-col justify-between min-h-[75px] space-y-4">
      {/* Round circle icon container */}
      <div className={`w-9 h-9 rounded-full ${iconBgColor} flex items-center justify-center`}>
        <CalendarHeart size={16} className={iconColor} />
      </div>
      {/* Title at the bottom left */}
      <span className="text-[13px] text-[#64748b] dark:text-[#94a3b8] font-medium leading-none">
        {title}
      </span>
    </div>
    {/* Value centered vertically on the right */}
    <div className="flex items-center">
      <h3 className="text-[24px] font-bold text-[#1e293b] dark:text-white leading-none">
        {value}
      </h3>
    </div>
  </div>
);

export function StatCards({ suppliers = [], stats = null }) {
  const totalSuppliers = stats?.totalSuppliers ?? (suppliers.length || 0);
  const activeSuppliers = stats?.activeSuppliers ?? (suppliers.filter(s => s.status === "Active").length || 0);
  const pendingDeliveries = stats?.pendingDeliveries ?? 0;
  const delayedDeliveries = stats?.delayedDeliveries ?? 0;

  const stats_list = [
    {
      title: "Total Supplier",
      value: totalSuppliers,
      iconBgColor: "bg-indigo-50 dark:bg-indigo-950/20",
      iconColor: "text-indigo-500"
    },
    {
      title: "Active Supplier",
      value: activeSuppliers,
      iconBgColor: "bg-emerald-50 dark:bg-emerald-950/20",
      iconColor: "text-emerald-500"
    },
    {
      title: "Pending Deliveries",
      value: String(pendingDeliveries).padStart(2, "0"),
      iconBgColor: "bg-blue-50 dark:bg-blue-950/20",
      iconColor: "text-blue-500"
    },
    {
      title: "Delayed Deliveries",
      value: String(delayedDeliveries).padStart(2, "0"),
      iconBgColor: "bg-rose-50 dark:bg-rose-950/20",
      iconColor: "text-rose-500"
    }
  ];


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px]">
      {stats_list.map((stat, i) => (
        <StatCard key={i} {...stat} />
      ))}
    </div>
  );
}
export default StatCards;
