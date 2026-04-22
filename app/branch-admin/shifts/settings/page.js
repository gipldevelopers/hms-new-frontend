"use client";

import React from "react";
import { Settings2, Shield, Calendar, Clock, Bell, UserCheck } from "lucide-react";

export default function ShiftSettingsPage() {
  const sections = [
    {
      title: "General Configuration",
      icon: Settings2,
      items: [
        { label: "Working Days", desc: "Select the operational days for this branch", value: "Mon - Sat" },
        { label: "Grace Period", desc: "Allowed minutes for late check-in", value: "15 Minutes" },
        { label: "Overtime Threshold", desc: "Daily hours after which overtime starts", value: "9 Hours" }
      ]
    },
    {
      title: "Roster Rules",
      icon: Calendar,
      items: [
        { label: "Auto-Generation", desc: "Generate next week's roster automatically", value: "Enabled", type: "toggle" },
        { label: "Minimum Gap", desc: "Min. hours between two shifts for staff", value: "11 Hours" },
        { label: "Rotation Cycle", desc: "Frequency of shift rotation for teams", value: "Fortnightly" }
      ]
    }
  ];

  return (
    <div className="p-6 space-y-5 min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120]">
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold text-[#1e293b] dark:text-white tracking-tight">
          Shift Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">
          Control branch-wide shift policies and scheduling behaviors
        </p>
      </div>

      <div className="max-w-4xl space-y-5">
        {sections.map((section) => (
          <div key={section.title} className="bg-white dark:bg-[#101935] rounded-[5px] border border-gray-100 dark:border-white/5 shadow-none overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/2 flex items-center gap-3">
              <section.icon className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold dark:text-white">{section.title}</h2>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-white/5">
              {section.items.map((item) => (
                <div key={item.label} className="px-8 py-6 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-white/2 transition-colors">
                  <div className="space-y-1">
                    <p className="text-sm font-bold dark:text-white">{item.label}</p>
                    <p className="text-xs text-gray-400 font-medium">{item.desc}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-black text-primary">{item.value}</span>
                    <button className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-primary/5 text-primary rounded-[5px] hover:bg-primary/10 transition-colors">Change</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
