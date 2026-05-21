"use client";
import React from "react";
import { CreditCard, FileText, Shield, Ticket, TrendingUp } from "lucide-react";
import Link from "next/link";

function QuickLink({ label, icon: Icon, href }) {
  return (
    <Link href={href} className="flex flex-col items-center justify-center p-3 border border-[#F1F5F9] dark:border-white/10 rounded-[5px] transition-all cursor-pointer bg-white dark:bg-[#101935] hover:bg-gray-50 dark:hover:bg-[#1e293b] group">
      <div className="w-full h-[80px] bg-[#F4F7FA] dark:bg-[#1e293b] rounded-[5px] flex items-center justify-center mb-3 px-6">
        <Icon 
          className="w-[28px] h-[28px] text-[#0F172A] dark:text-blue-400 group-hover:scale-110 transition-transform" 
          strokeWidth={1.5} 
        />
      </div>
      <span className="text-[13px] font-bold text-[#101935] dark:text-slate-200 text-center leading-tight">
        {label}
      </span>
    </Link>
  );
}

export function QuickLinks() {
  const links = [
    { label: "Collect Payment", icon: CreditCard, href: "/finance/payment" },
    { label: "Insurance Claims", icon: Shield, href: "/finance/insurance" },
    { label: "Discount Approval", icon: Ticket, href: "/finance/discounts" },
    { label: "Revenue Reports", icon: TrendingUp, href: "/finance/reports" },
  ];

  return (
    <div className="bg-white dark:bg-[#101935] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 overflow-hidden font-sans transition-all">
      <div className="px-6 py-4 border-b border-[#E7E8EB] dark:border-white/10">
        <h3 className="text-[16px] font-bold text-[#101935] dark:text-white">Quick Actions</h3>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[20px]">
          {links.map((link) => (
            <QuickLink key={link.label} label={link.label} icon={link.icon} href={link.href} />
          ))}
        </div>
      </div>
    </div>
  );
}
