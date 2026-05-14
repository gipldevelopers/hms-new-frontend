"use client";
import React from "react";
import { FileText, Clock, CheckCircle2, Package, AlertCircle, ShoppingCart } from "lucide-react";

const StatCard = ({ title, value, subValue, icon: Icon, trend, trendValue, iconBgColor, iconColor }) => (
  <div className="bg-white dark:bg-[#1e293b] p-5 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] flex flex-col justify-between min-h-[120px]">
    <div className="flex justify-between items-start mb-4">
      <span className="text-[13px] text-[#64748b] dark:text-[#94a3b8] font-medium">{title}</span>
      <div className={`p-2 rounded-[5px] ${iconBgColor}`}>
        <Icon size={16} className={iconColor} />
      </div>
    </div>
    <div className="flex items-end justify-between">
      <h3 className="text-[24px] font-bold text-[#1e293b] dark:text-white leading-none">{value}</h3>
      {trendValue && (
        <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-[4px] ${trend === 'up' ? 'bg-[#dcfce7] text-[#15803d]' : 'bg-[#f1f5f9] text-[#475569]'}`}>
          {trendValue}
        </span>
      )}
      {subValue && (
        <span className="text-[11px] font-medium text-[#64748b] dark:text-[#94a3b8]">
          {subValue}
        </span>
      )}
    </div>
  </div>
);

export function OverviewCards() {
  const stats = [
    {
      title: "Total prescriptions",
      value: "145",
      trend: "up",
      trendValue: "+12%",
      icon: FileText,
      iconBgColor: "bg-[#e0e7ff]",
      iconColor: "text-[#4338ca]"
    },
    {
      title: "Pending Queue",
      value: "12",
      icon: Clock,
      iconBgColor: "bg-[#fef3c7]",
      iconColor: "text-[#b45309]"
    },
    {
      title: "Dispensed",
      value: "128",
      subValue: "₹4,250",
      icon: CheckCircle2,
      iconBgColor: "bg-[#dcfce7]",
      iconColor: "text-[#15803d]"
    },
    {
      title: "Low Stock",
      value: "24",
      subValue: "Items",
      icon: Package,
      iconBgColor: "bg-[#fee2e2]",
      iconColor: "text-[#b91c1c]"
    },
    {
      title: "Expiring Soon",
      value: "8",
      subValue: "Next 30d",
      icon: AlertCircle,
      iconBgColor: "bg-[#ffedd5]",
      iconColor: "text-[#ea580c]"
    },
    {
      title: "Pending POs",
      value: "5",
      subValue: "Open",
      icon: ShoppingCart,
      iconBgColor: "bg-[#e0e7ff]",
      iconColor: "text-[#4338ca]"
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-[20px]">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
