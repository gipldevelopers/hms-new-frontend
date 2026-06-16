"use client";

import React from "react";
import Link from "next/link";
import { Plus, CreditCard, FileText, LogOut, Printer } from "lucide-react";

/**
 * Each quick link maps to an existing route in the finance module.
 *
 * Create Bill        → /finance/patient-billing/create
 * Collect Payment    → /finance/payment            (Payment Management page)
 * Generate Final Bill→ /finance/patient-billing    (billing list — user selects patient)
 * Start Discharge    → /finance/patient-billing?tab=ipd  (IPD tab where discharge is initiated)
 * Print Receipt      → /finance/payment            (user picks a Paid invoice to print)
 */
const links = [
  {
    label: "Create Bill",
    icon: Plus,
    href: "/finance/patient-billing/create",
  },
  {
    label: "Collect Payment",
    icon: CreditCard,
    href: "/finance/payment",
  },
  {
    label: "Generate Final Bill",
    icon: FileText,
    href: "/finance/patient-billing",
  },
  {
    label: "Start Discharge",
    icon: LogOut,
    href: "/finance/patient-billing?tab=ipd",
  },
  {
    label: "Print Receipt",
    icon: Printer,
    href: "/finance/payment",
  },
];

export function FinanceQuickLinks() {
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden font-sans transition-all md:h-[224px] h-auto shadow-none">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-[16px] font-bold text-[#101935] dark:text-white font-inter">Quick Links</h3>
      </div>

      <div className="p-6 md:h-[calc(100%-60px)]">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 h-full">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex flex-col items-center justify-center p-3 border border-border rounded-lg transition-all cursor-pointer bg-card group h-full hover:bg-muted/30 shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div className="w-full h-[60px] bg-[#F4F7FA] dark:bg-[#1e293b] rounded-[5px] flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                <link.icon
                  className="w-[20px] h-[20px] text-[#0F172A] dark:text-blue-400 group-hover:text-primary transition-colors"
                  strokeWidth={2}
                />
              </div>
              <span className="text-[12px] font-semibold text-[#101935] dark:text-slate-200 text-center leading-tight">
                {link.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
