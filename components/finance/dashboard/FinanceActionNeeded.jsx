"use client";

import React from "react";
import { Clock, AlertTriangle, CreditCard } from "lucide-react";

const actions = [
  {
    title: "Dr. Sarah Smith Delayed",
    description: "Cardiology OPD is running 30 mins behind schedule.",
    icon: Clock,
    iconBg: "bg-[#F0F2FF]",
    iconColor: "text-[#5C67FF]",
  },
  {
    title: "Emergency Alert",
    description: "Trauma case arriving in 5 mins. Prep Room 1.",
    icon: AlertTriangle,
    iconBg: "bg-[#FFF1F1]",
    iconColor: "text-[#FF5C5C]",
  },
  {
    title: "Payment Pending",
    description: "3 patients checked out without completing pharmacy payment.",
    icon: CreditCard,
    iconBg: "bg-[#F0F2FF]",
    iconColor: "text-[#5C67FF]",
  },
];

export function FinanceActionNeeded() {
  return (
    <div className="w-full md:h-[350px] h-auto bg-card rounded-lg border border-border flex flex-col font-sans transition-all overflow-hidden shadow-none">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="text-[16px] font-bold text-[#1e293b] dark:text-white">
          Action Needed
        </h3>
      </div>

      <div className="flex-1 flex flex-col justify-between">
        {actions.map((action, idx) => (
          <div
            key={idx}
            className="flex items-start gap-4 py-[20px] px-5 border-b border-border/50 last:border-b-0 hover:bg-muted/30 transition-all cursor-pointer group"
          >
            <div className={`w-10 h-10 rounded-full ${action.iconBg} flex items-center justify-center shrink-0`}>
              <action.icon className={`w-5 h-5 ${action.iconColor}`} />
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="text-[14px] font-bold text-[#1e293b] dark:text-white group-hover:text-primary transition-colors">
                {action.title}
              </h4>
              <p className="text-[13px] text-[#64748b] dark:text-slate-400 leading-tight">
                {action.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
