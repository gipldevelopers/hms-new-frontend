"use client";

import React, { useState } from "react";

// Custom ShoppingBagIcon matching the screenshot exactly
const ShoppingBagIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Bag Body */}
    <rect x="5" y="7" width="14" height="13" rx="2" />
    {/* Handle on top */}
    <path d="M9 7V5a3 3 0 0 1 6 0v2" />
    {/* Inside pocket arc */}
    <path d="M15 11a3 3 0 0 1-6 0" />
  </svg>
);

export function PendingApprovals() {
  const [approvals, setApprovals] = useState([
    {
      id: "PO-2025-9812",
      dept: "Central Surgery",
      item: "20,000 sterile surgical gloves",
      cost: "$18,400",
      user: "Head Nurse Mary J.",
      time: "2 hours ago",
      urgent: true
    },
    {
      id: "PO-2025-9812",
      dept: "Central Surgery",
      item: "20,000 sterile surgical gloves",
      cost: "$18,400",
      user: "Head Nurse Mary J.",
      time: "2 hours ago",
      urgent: true
    },
    {
      id: "PO-2025-9812",
      dept: "Central Surgery",
      item: "20,000 sterile surgical gloves",
      cost: "$18,400",
      user: "Head Nurse Mary J.",
      time: "2 hours ago",
      urgent: true
    },
    {
      id: "PO-2025-9812",
      dept: "Central Surgery",
      item: "20,000 sterile surgical gloves",
      cost: "$18,400",
      user: "Head Nurse Mary J.",
      time: "2 hours ago",
      urgent: true
    }
  ]);

  const handleAction = (id) => {
    // For visual demo, let's keep elements intact or delete upon action
    setApprovals(approvals.filter(app => app.id !== id));
  };

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 p-5 flex flex-col h-full">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-[14px] font-extrabold text-slate-800 dark:text-white uppercase tracking-wider leading-none">
          PENDING SOURCING & SETTLE APPROVALS
        </h3>
      </div>

      <div className="space-y-3">
        {approvals.map((app, index) => (
          <div
            key={`${app.id}-${index}`}
            className="py-2.5 px-3.5 bg-white dark:bg-slate-800/40 border border-[#E7E8EB] dark:border-white/5 rounded-[8px] flex flex-col gap-2 transition-all duration-200"
          >
            {/* Top Row: Icon + Sourced Code Details */}
            <div className="flex items-center gap-3">
              {/* Shopping Bag Icon Box */}
              <div className="w-8 h-8 rounded-[6px] border border-[#E7E8EB] dark:border-white/10 flex items-center justify-center shrink-0 bg-slate-50 dark:bg-slate-800/50 mt-0.5">
                <ShoppingBagIcon className="w-4 h-4 text-slate-500" />
              </div>
              <div className="flex-1 min-w-0 flex justify-between items-center">
                <h4 className="text-[12px] font-bold text-slate-805 dark:text-slate-100 leading-tight">
                  {app.id} - {app.dept}
                </h4>
                {app.urgent && (
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 bg-[#FFF0F0] dark:bg-red-950/40 text-red-500 rounded-sm shrink-0 uppercase leading-none">
                    Urgent
                  </span>
                )}
              </div>
            </div>

            {/* Second Row: Purchase Request (Starts under the icon) */}
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
              Purchase Request: <span className="font-semibold">{app.item}</span>. Cost: <span className="font-bold text-[#1e293b] dark:text-white">{app.cost}</span>.
            </p>

            {/* Divider Line */}
            <div className="border-t border-[#E7E8EB]/60 dark:border-white/5" />

            {/* Bottom Row: Requested By and Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="font-medium truncate max-w-full">
                Requested by: {app.user} • {app.time}
              </span>
              <div className="flex gap-2 shrink-0 items-center justify-end sm:justify-start">
                <button
                  onClick={() => handleAction(app.id)}
                  className="flex items-center justify-center px-3 py-1 bg-[#EDFDF5] border border-[#C6F6D5] text-[#10B981] rounded-[4px] font-extrabold text-[11px] hover:bg-[#C6F6D5]/80 transition-all cursor-pointer"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleAction(app.id)}
                  className="flex items-center justify-center px-3 py-1 bg-[#EEF2F6] dark:bg-slate-800 text-[#475569] dark:text-slate-300 rounded-[4px] font-extrabold text-[11px] hover:bg-[#E2E8F0] transition-all cursor-pointer"
                >
                  Deny
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PendingApprovals;
