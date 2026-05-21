"use client";

import React from "react";
import { Plus, CreditCard, FileText, LogOut, Printer } from "lucide-react";

const links = [
  { label: "Create Bill", icon: Plus },
  { label: "Collect Payment", icon: CreditCard },
  { label: "Generate Final Bill", icon: FileText },
  { label: "Start Discharge", icon: LogOut },
  { label: "Print Receipt", icon: Printer },
];

export function FinanceQuickLinks() {
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden font-sans transition-all md:h-[224px] h-auto shadow-none">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-[16px] font-bold text-[#101935] dark:text-white font-inter">Quick Links</h3>
      </div>

      <div className="p-6 md:h-[calc(100%-60px)]">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 h-full">
          {links.map((link, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center p-3 border border-border rounded-lg transition-all cursor-pointer bg-card group h-full hover:bg-muted/30 shadow-none"
            >
              <div className="w-full h-[60px] bg-[#F4F7FA] dark:bg-[#1e293b] rounded-[5px] flex items-center justify-center mb-3">
                <link.icon
                  className="w-[20px] h-[20px] text-[#0F172A] dark:text-blue-400  transition-transform"
                  strokeWidth={2}
                />
              </div>
              <span className="text-[12px] font-semibold text-[#101935] dark:text-slate-200 text-center leading-tight">
                {link.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
