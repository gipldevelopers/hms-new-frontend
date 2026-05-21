"use client";

import React from "react";
import { 
  AlertCircle, 
  TrendingDown, 
  Calendar, 
  Trash2, 
  Scale, 
  Thermometer,
  Clock,
  ArrowRight,
  Link as LinkIcon,
  CheckCircle2,
  AlertTriangle,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function PharmacyAlertsPage() {
  const alerts = [
    {
      id: 1,
      icon: AlertCircle,
      iconBg: "bg-[#fee2e2] text-[#ef4444]",
      title: "Insulin Injection stock critically low.",
      description: "Emergency threshold reached. Current Qty: 3. Immediate restocking required to avoid critical stockout.",
      time: "10 mins ago",
      tags: [
        { label: "Insulin Glargine 100 IU/mL", icon: LinkIcon },
        { label: "INS-9821", icon: TrendingDown },
        { label: "C-12", icon: Scale }
      ]
    },
    {
      id: 2,
      icon: TrendingDown,
      iconBg: "bg-[#fef3c7] text-[#f59e0b]",
      title: "Amlodipine 5mg stock is below reorder level.",
      description: "Current Qty: 18. Reorder Level: 50. Consider placing a purchase order soon.",
      time: "1 hr ago",
      tags: [
        { label: "Amlodipine 5mg Tablets", icon: LinkIcon },
        { label: "AML-4011", icon: TrendingDown },
        { label: "A-06", icon: Scale }
      ]
    },
    {
      id: 3,
      icon: Calendar,
      iconBg: "bg-[#f5f3ff] text-[#8b5cf6]",
      title: "Batch ASP204 expires in 12 days.",
      description: "Move this batch to the priority dispense queue to minimize wastage before expiration.",
      time: "2 hrs ago",
      tags: [
        { label: "Aspirin 75mg", icon: LinkIcon },
        { label: "ASP204", icon: TrendingDown },
        { label: "B-02", icon: Scale }
      ]
    },
    {
      id: 4,
      icon: Trash2,
      iconBg: "bg-[#fee2e2] text-[#ef4444]",
      title: "Expired stock detected in primary storage.",
      description: "Immediate quarantine required. Do not dispense. Action needed for safe disposal.",
      time: "4 hrs ago",
      tags: [
        { label: "Paracetamol IV", icon: LinkIcon },
        { label: "PAR102", icon: TrendingDown },
        { label: "D-04", icon: Scale }
      ]
    },
    {
      id: 5,
      icon: Scale,
      iconBg: "bg-[#fff7ed] text-[#ea580c]",
      title: "Physical count mismatch detected.",
      description: "System Qty: 120 | Physical Qty: 98. Investigation required to adjust inventory levels.",
      time: "5 hrs ago",
      tags: [
        { label: "Amoxicillin 500mg", icon: LinkIcon },
        { label: "AMX-001", icon: TrendingDown },
        { label: "A-01", icon: Scale }
      ]
    },
    {
      id: 6,
      icon: Thermometer,
      iconBg: "bg-[#ecfeff] text-[#06b6d4]",
      title: "Cold storage temperature exceeded safe limit.",
      description: "Recorded Temp: 10°C (Safe Limit: 2°C - 8°C). Please verify the storage unit immediately.",
      time: "1 day ago",
      tags: [
        { label: "Multiple Vaccines", icon: LinkIcon },
        { label: "Multiple", icon: TrendingDown },
        { label: "Cold Room 1", icon: Scale }
      ]
    }
  ];

  const statusStats = [
    { label: "Critical", value: "38", color: "text-[#ef4444]", bg: "bg-[#f8f9fc] dark:bg-white/5" },
    { label: "Low Stock", value: "124", color: "text-[#f59e0b]", bg: "bg-[#f8f9fc] dark:bg-white/5" },
    { label: "Expiring", value: "52", color: "text-[#8b5cf6]", bg: "bg-[#f8f9fc] dark:bg-white/5" },
    { label: "Pending POs", value: "18", color: "text-[#3b82f6]", bg: "bg-[#f8f9fc] dark:bg-white/5" },
  ];

  const criticalMedicines = [
    { name: "Insulin Glargine", sub: "3 units left", timeLeft: "2 days left", color: "bg-[#fee2e2] text-[#ef4444]" },
    { name: "Atorvastatin 20mg", sub: "15 units left", timeLeft: "4 days left", color: "bg-[#fee2e2] text-[#ef4444]" },
    { name: "Metformin 500mg", sub: "45 units left", timeLeft: "5 days left", color: "bg-[#fee2e2] text-[#ef4444]" },
  ];

  const recentActivity = [
    { user: "S. Jenkins", action: "resolved an alert", target: "PO #PO2048", time: "10m ago" },
    { user: "M. Lawson", action: "adjusted inventory", target: "Amoxicillin", time: "1h ago" },
    { user: "System", action: "auto-quarantined", target: "Batch PAR102", time: "4h ago" },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-[20px] font-sans bg-background min-h-screen">
      <h1 className="text-[20px] font-bold text-foreground">Alerts & Notifications</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[20px]">
        {/* Main Content - Alerts List */}
        <div className="lg:col-span-8 space-y-[20px]">
          {alerts.map((alert) => (
            <div key={alert.id} className="bg-card border border-border rounded-[5px] p-4 sm:p-5 flex flex-col gap-4 shadow-none transition-all">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                <div className="flex gap-3 sm:gap-4">
                  <div className={cn("w-10 h-10 rounded-[5px] flex items-center justify-center shrink-0 shadow-none", alert.iconBg)}>
                    <alert.icon size={18} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-[14px] sm:text-[15px] font-bold text-foreground leading-tight">{alert.title}</h3>
                    <p className="text-[12px] font-medium text-muted-foreground leading-relaxed max-w-2xl">{alert.description}</p>
                  </div>
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-muted-foreground whitespace-nowrap opacity-60 ml-[50px] sm:ml-0">{alert.time}</span>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 ml-[50px] sm:ml-[56px]">
                {alert.tags.map((tag, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-muted/50 dark:bg-white/5 border border-border rounded-[5px] text-[10px] font-bold text-muted-foreground transition-all">
                    <tag.icon size={11} className="opacity-60" />
                    {tag.label}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar - Overview & Activity */}
        <div className="lg:col-span-4 space-y-[20px]">
          {/* Status Overview */}
          <div className="bg-card border border-border rounded-[5px] p-5 sm:p-6 shadow-none">
            <h2 className="text-[14px] font-bold text-foreground mb-4">Status Overview</h2>
            <div className="grid grid-cols-2 gap-[12px] sm:gap-[15px]">
              {statusStats.map((stat, idx) => (
                <div key={idx} className={cn("p-3 sm:p-4 rounded-[5px] flex flex-col gap-1.5 sm:gap-2 transition-all shadow-none", stat.bg)}>
                  <span className={cn("text-[18px] sm:text-[20px] font-bold leading-none", stat.color)}>{stat.value}</span>
                  <span className="text-[9px] sm:text-[10px] font-bold text-muted-foreground tracking-wider">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Critical Medicines */}
          <div className="bg-card border border-border rounded-[5px] p-5 sm:p-6 shadow-none">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />
              <h2 className="text-[14px] font-bold text-foreground">Top Critical Medicines</h2>
            </div>
            <div className="space-y-6">
              {criticalMedicines.map((med, idx) => (
                <div key={idx} className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h4 className="text-[13px] font-bold text-foreground leading-none mb-1.5 truncate">{med.name}</h4>
                    <p className="text-[11px] font-medium text-muted-foreground">{med.sub}</p>
                  </div>
                  <span className={cn("px-2 py-0.5 rounded-[3px] text-[9px] font-bold whitespace-nowrap", med.color)}>
                    {med.timeLeft}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-card border border-border rounded-[5px] p-5 sm:p-6 shadow-none">
            <h2 className="text-[14px] font-bold text-foreground mb-6">Recent Activity</h2>
            <div className="space-y-6">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-border mt-1.5 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-[12px] font-medium text-muted-foreground leading-snug">
                      <span className="font-bold text-foreground">{activity.user}</span> {activity.action} <span className="font-bold text-foreground">{activity.target}</span>
                    </p>
                    <span className="text-[10px] font-bold text-muted-foreground opacity-60 tracking-tight">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
