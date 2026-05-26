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

export function StatCards({ items = [] }) {
  const totalSkus = items.length;
  const lowStock = items.filter(item => item.status === "LOW" || item.status === "Out of Stock").length;

  // Calculate stock value dynamically
  const stockValue = items.reduce((acc, item) => {
    const numericQty = parseInt(item.qty) || 0;
    return acc + (numericQty * 350);
  }, 0);

  const formattedValue = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(stockValue);

  // Dynamically calculate items expiring in the current month
  const expiringThisMonth = items.filter(item => {
    if (!item.expiry) return false;
    const cleaned = String(item.expiry).trim();
    let expDate = null;
    
    const ddmmyyyyRegex = /^(\d{2})-(\d{2})-(\d{4})/;
    const yyyymmddRegex = /^(\d{4})-(\d{2})-(\d{2})/;
    
    if (ddmmyyyyRegex.test(cleaned)) {
      const [_, day, month, year] = cleaned.match(ddmmyyyyRegex);
      expDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else if (yyyymmddRegex.test(cleaned)) {
      const [_, year, month, day] = cleaned.match(yyyymmddRegex);
      expDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else {
      expDate = new Date(cleaned);
    }
    
    if (isNaN(expDate.getTime())) return false;
    
    const now = new Date();
    return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
  }).length;

  const stats = [
    {
      title: "Total Skus",
      value: totalSkus || "0",
      iconBgColor: "bg-indigo-50 dark:bg-indigo-950/20",
      iconColor: "text-indigo-500"
    },
    {
      title: "Total Stock Value",
      value: formattedValue,
      iconBgColor: "bg-emerald-50 dark:bg-emerald-950/20",
      iconColor: "text-emerald-500"
    },
    {
      title: "Low Stock Items",
      value: lowStock || "0",
      iconBgColor: "bg-blue-50 dark:bg-blue-950/20",
      iconColor: "text-blue-500"
    },
    {
      title: "Expiring this month",
      value: expiringThisMonth || "0",
      iconBgColor: "bg-rose-50 dark:bg-rose-950/20",
      iconColor: "text-rose-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px]">
      {stats.map((stat, i) => (
        <StatCard key={i} {...stat} />
      ))}
    </div>
  );
}
