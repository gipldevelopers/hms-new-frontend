"use client";

import React, { useState } from "react";

// Custom Diamond Alert icon matching the screenshot exactly
const AlertDiamond = (props) => (
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
    <path d="M12 2L2 12l10 10 10-10L12 2z" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const defaultAlerts = [
  {
    id: 1,
    name: "Insulin Glargine 100 U/mL (3ml Pen)",
    details: "Main Store quantity down to 15 pens. Min threshold level: 80 pens.",
    type: "CRITICAL"
  },
  {
    id: 2,
    name: "Insulin Glargine 100 U/mL (3ml Pen)",
    details: "Main Store quantity down to 15 pens. Min threshold level: 80 pens.",
    type: "CRITICAL"
  },
  {
    id: 3,
    name: "Insulin Glargine 100 U/mL (3ml Pen)",
    details: "Main Store quantity down to 15 pens. Min threshold level: 80 pens.",
    type: "CRITICAL"
  },
  {
    id: 4,
    name: "Insulin Glargine 100 U/mL (3ml Pen)",
    details: "Main Store quantity down to 15 pens. Min threshold level: 80 pens.",
    type: "CRITICAL"
  }
];

export function LiveInventoryAlert({ alerts }) {
  const activeAlerts = alerts || defaultAlerts;

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 p-5 flex flex-col h-full">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-[16px] font-bold text-slate-800 dark:text-white leading-none">
          Live Inventory Alert
        </h3>
        <button className="px-3 py-1 border border-[#E2E8F0] dark:border-slate-700 text-[11px] font-bold text-slate-600 dark:text-slate-300 rounded-[5px] hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
          View all
        </button>
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto">
        {activeAlerts.map((alert) => (
          <div
            key={alert.id}
            className="p-4 bg-[#FFF0F0] dark:bg-red-950/10 border border-[#FFE0E0] dark:border-red-950/20 rounded-[8px] flex gap-3 relative transition-all duration-200"
          >
            <AlertDiamond className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-[12px] font-bold text-slate-800 dark:text-slate-100 leading-tight">
                {alert.name}
              </h4>
              <p className="text-[11px] text-slate-400 dark:text-slate-400 mt-1 leading-normal">
                {alert.details}
              </p>
              <p className="text-[10px] font-extrabold text-red-500 tracking-wider mt-2.5 uppercase leading-none">
                {alert.type}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LiveInventoryAlert;
