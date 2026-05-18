"use client";
import React from "react";
import { Package, AlertTriangle, CreditCard } from "lucide-react";

export function ActionNeeded() {
  const actions = [
    {
      title: "Low Stock Alert",
      description: "Paracetamol 500mg running below minimum threshold (15 left).",
      icon: Package,
      iconColor: "text-[#b45309]",
      bgColor: "bg-[#fef3c7]",
    },
    {
      title: "Expiry Warning",
      description: "Ceftriaxone 1g (Batch: X82) expiring in 7 days.",
      icon: AlertTriangle,
      iconColor: "text-[#b91c1c]",
      bgColor: "bg-[#fee2e2]",
    },
    {
      title: "Payment Pending",
      description: "3 patients checked out without completing pharmacy payment.",
      icon: CreditCard,
      iconColor: "text-[#4338ca]",
      bgColor: "bg-[#e0e7ff]",
    },
  ];

  return (
    <div className="bg-white dark:bg-[#1e293b] p-6 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155]">
      <h2 className="text-[16px] font-bold text-[#1e293b] dark:text-white mb-6">Action Needed</h2>
      <div className="space-y-6">
        {actions.map((action, i) => (
          <div key={i} className="flex gap-4">
            <div className={`p-2.5 rounded-[5px] h-fit ${action.bgColor}`}>
              <action.icon size={18} className={action.iconColor} />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-[14px] font-bold text-[#1e293b] dark:text-white">{action.title}</h3>
              <p className="text-[11px] font-medium text-[#64748b] dark:text-[#94a3b8] leading-relaxed">{action.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
