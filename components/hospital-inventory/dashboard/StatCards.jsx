"use client";

import React from "react";
import {
  BadgeIndianRupee,
  Box,
  ShieldAlert,
  Hourglass,
  ShoppingCart,
  TrendingUp,
  Boxes
} from "lucide-react";

// Custom ClipboardPen icon to match mockup exactly
const ClipboardPen = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Top Clip */}
    <rect x="9" y="3" width="6" height="3" rx="1" />
    {/* Clipboard Board with Top-Right Gap */}
    <path d="M9 4H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />
    <path d="M15 4h2a2 2 0 0 1 2 2v1" />
    {/* Pen/Pencil drawing inside the gap */}
    <path d="M18.8 7.2a2 2 0 0 1 0 2.8l-5.6 5.6-3.2.8.8-3.2 5.6-5.6a2 2 0 0 1 2.8 0z" />
    {/* Small dot/dash on the bottom-left */}
    <line x1="8" y1="16" x2="9" y2="16" />
  </svg>
);

export function StatCards({ stats }) {
  const cards = [
    {
      title: "Total Inventory",
      value: stats?.totalInventoryValue || "₹1,28,000",
      change: stats?.totalInventoryChange || "+12% vs yesterday",
      isPositive: stats?.totalInventoryPositive !== undefined ? stats.totalInventoryPositive : true,
      icon: BadgeIndianRupee
    },
    {
      title: "Total Available Stock",
      value: stats?.totalAvailableStockPercent || "72%",
      change: stats?.totalAvailableStockChange || "+5% vs yesterday",
      isPositive: stats?.totalAvailableStockPositive !== undefined ? stats.totalAvailableStockPositive : true,
      icon: Box
    },
    {
      title: "Low Stock Items",
      value: stats?.lowStockItemsCount || "142",
      change: stats?.lowStockItemsChange || "-2 vs avg",
      isPositive: stats?.lowStockItemsPositive !== undefined ? stats.lowStockItemsPositive : false,
      icon: ShieldAlert
    },
    {
      title: "Near Expiry Items",
      value: stats?.nearExpiryValue || "₹45,000",
      change: stats?.nearExpiryChange || "+2% vs yesterday",
      isPositive: stats?.nearExpiryPositive !== undefined ? stats.nearExpiryPositive : true,
      icon: Hourglass
    },
    {
      title: "Pending Purchase",
      value: stats?.pendingPurchaseValue || "4.2d",
      change: stats?.pendingPurchaseChange || "+1.5d vs yesterday",
      isPositive: stats?.pendingPurchasePositive !== undefined ? stats.pendingPurchasePositive : true,
      icon: ShoppingCart
    },
    {
      title: "Today's Consumption",
      value: stats?.todayConsumptionPercent || "1.2%",
      change: stats?.todayConsumptionChange || "+5% vs yesterday",
      isPositive: stats?.todayConsumptionPositive !== undefined ? stats.todayConsumptionPositive : true,
      icon: TrendingUp
    },
    {
      title: "Pending Requests",
      value: stats?.pendingRequestsPercent || "4.8%",
      change: stats?.pendingRequestsChange || "-2% vs avg",
      isPositive: stats?.pendingRequestsPositive !== undefined ? stats.pendingRequestsPositive : false,
      icon: ClipboardPen
    },
    {
      title: "Pending GRNs",
      value: stats?.pendingGrnsCount || "2",
      change: stats?.pendingGrnsChange || "+2 vs yesterday",
      isPositive: stats?.pendingGrnsPositive !== undefined ? stats.pendingGrnsPositive : true,
      icon: Boxes
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-white dark:bg-[#1E293B] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 p-5 flex justify-between items-center shadow-none"
          >
            <div>
              <p className="text-[12px] font-semibold text-slate-400 dark:text-slate-400">
                {card.title}
              </p>
              <h3 className="text-[22px] font-extrabold text-slate-800 dark:text-white mt-1.5 leading-none">
                {card.value}
              </h3>
              <p
                className={`text-[11px] mt-2 font-bold ${
                  card.isPositive ? "text-[#10B981]" : "text-[#EF4444]"
                }`}
              >
                {card.change}
              </p>
            </div>
            <div className="w-10 h-10 rounded-[6px] flex items-center justify-center bg-[#EEF2F6] dark:bg-slate-800/80 text-[#4F46E5] dark:text-[#818CF8] shrink-0">
              <Icon className="w-5 h-5 stroke-[2]" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
export default StatCards;
