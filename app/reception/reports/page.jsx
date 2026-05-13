"use client";

import React from "react";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  CalendarDays, 
  DollarSign, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  Printer,
  FileSpreadsheet,
  FileDown,
  MoreVertical
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ReportsAnalytics() {
  const stats = [
    { label: "Total Revenue", value: "$124,500", trend: "+18%", trendUp: true, icon: DollarSign, color: "text-[#00A389]", bg: "bg-[#00A389]/5" },
    { label: "Total Appointments", value: "3,842", trend: "+5%", trendUp: true, icon: CalendarDays, color: "text-[#3B4CB8]", bg: "bg-[#3B4CB8]/5" },
    { label: "New Registrations", value: "1,248", trend: "+12%", trendUp: true, icon: Users, color: "text-[#8B5CF6]", bg: "bg-[#8B5CF6]/5" },
    { label: "Emergency Cases", value: "156", trend: "-2%", trendUp: false, icon: Activity, color: "text-[#EF4444]", bg: "bg-[#EF4444]/5" },
  ];

  const topDoctors = [
    { name: "Dr. Sarah Jenkins", specialty: "Cardiology", value: "₹412", init: "SJ", color: "bg-[#3B4CB8]/10 text-[#3B4CB8]" },
    { name: "Dr. Michael Chen", specialty: "Neurology", value: "₹384", init: "MC", color: "bg-[#8B5CF6]/10 text-[#8B5CF6]" },
    { name: "Dr. Emily Blunt", specialty: "Pediatrics", value: "₹356", init: "EB", color: "bg-[#00A389]/10 text-[#00A389]" },
    { name: "Dr. Robert Fox", specialty: "Orthopedics", value: "₹298", init: "RF", color: "bg-[#3B4CB8]/10 text-[#3B4CB8]" },
    { name: "Dr. Lisa Ray", specialty: "General", value: "₹275", init: "LR", color: "bg-muted text-muted-foreground" },
  ];

  const pendingPayments = [
    { patient: "Alice Johnson", date: "Oct 24, 2023", invoice: "#INV-2023-0891", amount: "₹450.00" },
    { patient: "Mark Spencer", date: "Oct 23, 2023", invoice: "#INV-2023-0885", amount: "₹1,200.00" },
    { patient: "Mark Spencer", date: "Oct 23, 2023", invoice: "#INV-2023-0885", amount: "₹1,200.00" },
    { patient: "Mark Spencer", date: "Oct 23, 2023", invoice: "#INV-2023-0885", amount: "₹1,200.00" },
    { patient: "Mark Spencer", date: "Oct 23, 2023", invoice: "#INV-2023-0885", amount: "₹1,200.00" },
    { patient: "Mark Spencer", date: "Oct 23, 2023", invoice: "#INV-2023-0885", amount: "₹1,200.00" },
  ];

  return (
    <div className="flex flex-col gap-5 p-5 min-h-screen bg-background">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-[20px] font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-[13px] font-medium text-muted-foreground">View and export clinic performance metrics.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button className="flex-1 sm:flex-none h-10 px-4 border border-border bg-card rounded-[var(--radius)] text-[12px] font-bold text-foreground flex items-center justify-center gap-2 hover:bg-muted transition-all shadow-none">
            <Printer className="w-4 h-4 text-muted-foreground" />
            Print
          </button>
          <button className="flex-1 sm:flex-none h-10 px-4 border border-border bg-card rounded-[var(--radius)] text-[12px] font-bold text-foreground flex items-center justify-center gap-2 hover:bg-muted transition-all shadow-none">
            <FileSpreadsheet className="w-4 h-4 text-[#00A389]" />
            Export Excel
          </button>
          <button className="flex-1 sm:flex-none h-10 px-4 bg-[#3B4CB8] text-white rounded-[var(--radius)] text-[12px] font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-none">
            <FileDown className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card border border-border rounded-[var(--radius)] p-4 sm:p-5 space-y-3 sm:space-y-4 shadow-none">
            <div className="flex items-center justify-between">
                <p className="text-[10px] sm:text-[12px] font-bold text-muted-foreground uppercase tracking-tight sm:normal-case sm:tracking-normal">{stat.label}</p>
                <div className={cn("w-7 h-7 sm:w-8 sm:h-8 rounded-[var(--radius)] flex items-center justify-center shrink-0", stat.bg)}>
                    <stat.icon className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4", stat.color)} />
                </div>
            </div>
            <div className="space-y-1">
                <h3 className="text-[18px] sm:text-[24px] font-bold text-foreground leading-none">{stat.value}</h3>
                <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-1.5">
                    <div className="flex items-center gap-1">
                      {stat.trendUp ? (
                          <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00A389]" />
                      ) : (
                          <ArrowDownRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#EF4444]" />
                      )}
                      <span className={cn("text-[10px] sm:text-[11px] font-bold", stat.trendUp ? "text-[#00A389]" : "text-[#EF4444]")}>
                          {stat.trend}
                      </span>
                    </div>
                    <span className="text-[9px] sm:text-[11px] text-muted-foreground/60 font-medium lowercase">last month</span>
                </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Revenue Trend Chart */}
        <div className="lg:col-span-8 bg-card border border-border rounded-[var(--radius)] flex flex-col shadow-none overflow-hidden">
          <div className="p-5 border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-[14px] font-bold text-foreground">Revenue Trend</h2>
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
                        <span className="text-[11px] font-bold text-muted-foreground">Consultation</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#00A389]" />
                        <span className="text-[11px] font-bold text-muted-foreground">Procedures</span>
                    </div>
                </div>
                <button className="h-8 px-3 border border-border rounded-[var(--radius)] text-[11px] font-bold text-foreground flex items-center gap-2 hover:bg-muted transition-all shadow-none">
                    Monthly
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
            </div>
          </div>
          <div className="p-8 flex-1 flex flex-col justify-end min-h-[300px]">
            <div className="flex items-end justify-between gap-4 sm:gap-8 h-full">
                {[
                  { w: "Week 1", v1: "40%", v2: "30%" },
                  { w: "", v1: "60%", v2: "25%" },
                  { w: "Week 2", v1: "35%", v2: "55%" },
                  { w: "", v1: "70%", v2: "20%" },
                  { w: "Week 3", v1: "55%", v2: "30%" },
                  { w: "", v1: "65%", v2: "40%" },
                  { w: "Week 4", v1: "45%", v2: "15%" },
                  { w: "", v1: "65%", v2: "35%" }
                ].map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-3 h-full">
                    <div className="w-full flex-1 flex flex-col-reverse gap-0.5 rounded-t-[3px] overflow-hidden">
                        <div className="w-full bg-[#00A389]/80 hover:bg-[#00A389] transition-all" style={{ height: bar.v2 }} />
                        <div className="w-full bg-[#8B5CF6]/80 hover:bg-[#8B5CF6] transition-all" style={{ height: bar.v1 }} />
                    </div>
                    {bar.w && <span className="text-[10px] font-bold text-muted-foreground whitespace-nowrap">{bar.w}</span>}
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Top Doctors */}
        <div className="lg:col-span-4 bg-card border border-border rounded-[var(--radius)] flex flex-col shadow-none">
          <div className="p-5 border-b border-border/50">
            <h2 className="text-[14px] font-bold text-foreground">Top Doctors</h2>
          </div>
          <div className="p-2 flex-1">
            <div className="space-y-1">
                {topDoctors.map((doc, i) => (
                    <div key={i} className="p-3 hover:bg-muted/30 rounded-[var(--radius)] flex items-center justify-between transition-all group">
                        <div className="flex items-center gap-3">
                            <div className={cn("w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0", doc.color)}>
                                {doc.init}
                            </div>
                            <div className="space-y-0.5">
                                <h4 className="text-[13px] font-bold text-foreground">{doc.name}</h4>
                                <p className="text-[11px] font-medium text-muted-foreground">{doc.specialty}</p>
                            </div>
                        </div>
                        <span className="text-[13px] font-bold text-foreground">{doc.value}</span>
                    </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pending Payments Table */}
      <div className="bg-card border border-border rounded-[var(--radius)] shadow-none overflow-hidden">
        <div className="p-5 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-[14px] font-bold text-foreground">Pending Payments Action List</h2>
            <span className="px-2 py-0.5 bg-[#FEF3C7] text-[#D97706] rounded-[3px] text-[10px] font-bold">₹12,450 Total</span>
          </div>
          <button className="h-8 px-3 border border-border rounded-[var(--radius)] text-[11px] font-bold text-foreground hover:bg-muted transition-all shadow-none">
            View All
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-muted/30 border-b border-border/60">
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Patient</th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Invoice</th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider text-right">Amount Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {pendingPayments.map((item, i) => (
                <tr key={i} className="hover:bg-muted/5 transition-colors group">
                  <td className="px-6 py-4 text-[14px] font-bold text-foreground">{item.patient}</td>
                  <td className="px-6 py-4 text-[13px] font-medium text-foreground">{item.date}</td>
                  <td className="px-6 py-4 text-[13px] font-medium text-foreground">{item.invoice}</td>
                  <td className="px-6 py-4 text-[14px] font-bold text-foreground text-right">{item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
