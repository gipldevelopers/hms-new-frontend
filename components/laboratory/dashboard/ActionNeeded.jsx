"use client";
import React from "react";
import { Activity, AlertTriangle, Clock, ClipboardCheck } from "lucide-react";

export function ActionNeeded() {
  const alerts = [
    {
      title: "Critical Potassium Level",
      description: "Potassium 5.8 mmol/L for Sarah Jenkins in ICU Bed 4.",
      icon: Activity,
      iconColor: "text-[#ef4444] dark:text-[#fca5a5]",
      bgColor: "bg-[#fee2e2] dark:bg-[#7f1d1d]/30"
    },
    {
      title: "Emergency Alert",
      description: "Troponin-I 1.2 ng/mL for Olivia Davis in ER Bay 2.",
      icon: AlertTriangle,
      iconColor: "text-[#ef4444] dark:text-[#fca5a5]",
      bgColor: "bg-[#fee2e2] dark:bg-[#7f1d1d]/30"
    },
    {
      title: "Sample Delayed",
      description: "Routine CBC running 45 mins behind schedule.",
      icon: Clock,
      iconColor: "text-[#2563eb] dark:text-[#93c5fd]",
      bgColor: "bg-[#e0e7ff] dark:bg-[#1e3a8a]/30"
    },
    {
      title: "Emergency Alert",
      description: "Troponin-I 1.2 ng/mL for Olivia Davis in ER Bay 2.",
      icon: AlertTriangle,
      iconColor: "text-[#ef4444] dark:text-[#fca5a5]",
      bgColor: "bg-[#fee2e2] dark:bg-[#7f1d1d]/30"
    },
    {
      title: "Sample Delayed",
      description: "Routine CBC running 45 mins behind schedule.",
      icon: Clock,
      iconColor: "text-[#2563eb] dark:text-[#93c5fd]",
      bgColor: "bg-[#e0e7ff] dark:bg-[#1e3a8a]/30"
    },
    {
      title: "Approval Pending",
      description: "4 results waiting for Pathologist review.",
      icon: ClipboardCheck,
      iconColor: "text-[#2563eb] dark:text-[#93c5fd]",
      bgColor: "bg-[#e0e7ff] dark:bg-[#1e3a8a]/30"
    }
  ];

  return (
    <div className="bg-card text-card-foreground rounded-lg border border-border w-full h-full flex flex-col justify-between overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-border shrink-0">
        <h2 className="text-[15px] font-bold text-foreground">Action Needed</h2>
      </div>

      {/* Content */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        {alerts.map((alert, index) => {
          const Icon = alert.icon;
          return (
            <div
              key={index}
              className="flex items-start gap-4 py-3 border-b border-border last:border-b-0 first:pt-0 last:pb-0 transition-colors"
            >
              <div className={`p-2.5 rounded-full ${alert.bgColor} shrink-0`}>
                <Icon size={16} className={alert.iconColor} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[13px] font-bold text-foreground leading-snug">
                  {alert.title}
                </h3>
                <p className="text-[11px] font-medium text-muted-foreground mt-1 leading-normal max-w-[240px] xl:max-w-[280px]">
                  {alert.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
