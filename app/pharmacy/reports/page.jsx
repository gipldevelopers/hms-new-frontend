"use client";

import React from "react";
import { 
  Printer, 
  FileDown, 
  DollarSign, 
  ClipboardList, 
  Users, 
  AlertTriangle,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function PharmacyReportsPage() {
  const stats = [
    { 
      label: "Total Revenue", 
      value: "$124,500", 
      trend: "+18%", 
      isUp: true, 
      icon: DollarSign, 
      iconColor: "text-[#10b981]", 
      iconBg: "bg-[#ecfdf5]" 
    },
    { 
      label: "Total Prescriptions", 
      value: "3,842", 
      trend: "+5%", 
      isUp: true, 
      icon: ClipboardList, 
      iconColor: "text-[#3b82f6]", 
      iconBg: "bg-[#eff6ff]" 
    },
    { 
      label: "New Patients", 
      value: "1,248", 
      trend: "+12%", 
      isUp: true, 
      icon: Users, 
      iconColor: "text-[#8b5cf6]", 
      iconBg: "bg-[#f5f3ff]" 
    },
    { 
      label: "Out of Stock Alerts", 
      value: "156", 
      trend: "-2%", 
      isUp: false, 
      icon: AlertTriangle, 
      iconColor: "text-[#ef4444]", 
      iconBg: "bg-[#fef2f2]" 
    }
  ];

  const chartWeeks = [
    { name: "Week 1", pValue: 40, sValue: 30 },
    { name: "Week 2", pValue: 55, sValue: 45 },
    { name: "Week 3", pValue: 45, sValue: 35 },
    { name: "Week 4", pValue: 70, sValue: 40 },
  ];

  const topMedicines = [
    { name: "Amoxicillin 500mg", cat: "Antibiotics", val: "₹4,120", short: "AM", color: "bg-[#f0f2ff] text-[#2e37a4]" },
    { name: "Paracetamol 650mg", cat: "Analgesics", val: "₹3,840", short: "PA", color: "bg-[#eff6ff] text-[#3b82f6]" },
    { name: "Omeprazole 20mg", cat: "Antacids", val: "₹3,560", short: "OM", color: "bg-[#f5f3ff] text-[#8b5cf6]" },
    { name: "Azithromycin 250mg", cat: "Antibiotics", val: "₹2,980", short: "AZ", color: "bg-[#ecfdf5] text-[#10b981]" },
    { name: "Cetirizine 10mg", cat: "Antihistamines", val: "₹2,750", short: "CE", color: "bg-[#fef2f2] text-[#ef4444]" },
  ];

  const pendingPOs = [
    { supplier: "PharmaCorp Inc.", date: "Oct 24, 2023", po: "#PO-2023-0891", amount: "₹4,500.00" },
    { supplier: "MediLife Supplies", date: "Oct 23, 2023", po: "#PO-2023-0885", amount: "₹1,200.00" },
    { supplier: "MediLife Supplies", date: "Oct 23, 2023", po: "#PO-2023-0884", amount: "₹1,200.00" },
    { supplier: "Global Health Dist.", date: "Oct 23, 2023", po: "#PO-2023-0883", amount: "₹1,200.00" },
    { supplier: "Global Health Dist.", date: "Oct 23, 2023", po: "#PO-2023-0882", amount: "₹1,200.00" },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-[20px] font-sans bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-[20px] font-bold text-foreground leading-none">Reports & Analytics</h1>
          <p className="text-[13px] font-medium text-muted-foreground">View and export clinic performance metrics.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 h-11 bg-card border border-border rounded-[5px] text-[13px] font-bold text-foreground hover:bg-muted transition-all shadow-none">
            <Printer size={16} /> Print
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 h-11 bg-primary text-primary-foreground rounded-[5px] text-[13px] font-bold hover:opacity-90 transition-all shadow-none">
            <FileDown size={16} /> Export PDF
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[15px] sm:gap-[20px]">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card p-4 sm:p-6 rounded-[5px] border border-border flex flex-col gap-4 sm:gap-5 transition-all shadow-none relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <span className="text-[11px] sm:text-[12px] font-bold text-muted-foreground tracking-tight">{stat.label}</span>
              <div className={cn("p-1.5 sm:p-2 rounded-full shadow-none shrink-0 transition-transform group-hover:scale-110", stat.iconBg)}>
                <stat.icon size={14} className={stat.iconColor} />
              </div>
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <div className="text-[18px] sm:text-[24px] font-bold text-foreground tracking-tight">{stat.value}</div>
              <div className="flex items-center gap-1">
                {stat.isUp ? (
                  <TrendingUp size={12} className="text-[#10b981]" />
                ) : (
                  <TrendingDown size={12} className="text-[#ef4444]" />
                )}
                <span className={cn("text-[9px] sm:text-[11px] font-bold", stat.isUp ? "text-[#10b981]" : "text-[#ef4444]")}>
                  {stat.trend} <span className="hidden sm:inline text-muted-foreground/60 font-medium ml-1">vs last month</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[20px]">
        {/* Revenue Trend Chart */}
        <div className="lg:col-span-8 bg-card border border-border rounded-[5px] p-5 sm:p-6 shadow-none flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-[15px] font-bold text-foreground">Revenue Trend</h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#818cf8]" />
                  <span className="text-[11px] font-bold text-muted-foreground">Prescriptions</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#34d399]" />
                  <span className="text-[11px] font-bold text-muted-foreground">Otc Sales</span>
                </div>
              </div>
              <button className="w-full sm:w-auto h-9 px-3 bg-background border border-border rounded-[5px] text-[11px] font-bold text-foreground flex items-center justify-between sm:justify-start gap-2 hover:bg-muted transition-all shadow-none">
                Monthly <ChevronDown size={14} className="text-muted-foreground" />
              </button>
            </div>
          </div>

          <div className="flex-1 flex items-end justify-around pb-4 min-h-[250px] sm:min-h-[280px] gap-2">
            {chartWeeks.map((week, idx) => (
              <div key={idx} className="flex flex-col items-center gap-4 w-full group">
                <div className="w-full max-w-[40px] sm:max-w-[80px] flex flex-col gap-1 transition-transform group-hover:scale-[1.02]">
                  <div 
                    className="w-full bg-[#34d399] rounded-t-[3px] sm:rounded-t-[5px]" 
                    style={{ height: `${week.sValue * 1.5}px` }} 
                  />
                  <div 
                    className="w-full bg-[#818cf8] rounded-b-[3px] sm:rounded-b-[5px]" 
                    style={{ height: `${week.pValue * 1.5}px` }} 
                  />
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-muted-foreground whitespace-nowrap">{week.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Dispensed Medicines */}
        <div className="lg:col-span-4 bg-card border border-border rounded-[5px] p-5 sm:p-6 shadow-none flex flex-col gap-6">
          <h2 className="text-[15px] font-bold text-foreground">Top Dispensed Medicines</h2>
          <div className="space-y-6 flex-1">
            {topMedicines.map((med, idx) => (
              <div key={idx} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className={cn("w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 shadow-none", med.color)}>
                    {med.short}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[13px] font-bold text-foreground leading-none mb-1.5 group-hover:text-primary transition-colors truncate">{med.name}</h4>
                    <p className="text-[11px] font-medium text-muted-foreground opacity-60 tracking-tight truncate">{med.cat}</p>
                  </div>
                </div>
                <span className="text-[13px] font-bold text-foreground tracking-tight whitespace-nowrap">{med.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending POs Action List */}
      <div className="bg-card border border-border rounded-[5px] overflow-hidden shadow-none">
        <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card">
          <div className="flex items-center gap-3">
            <h2 className="text-[15px] font-bold text-foreground leading-none">Pending Pos Action List</h2>
            <span className="px-2 py-0.5 bg-[#fff7ed] text-[#ea580c] text-[10px] font-bold rounded-[3px]">₹12,450 Total</span>
          </div>
          <button className="text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            <MoreHorizontal size={18} />
          </button>
        </div>
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead className="bg-muted/30">
              <tr>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground tracking-wider whitespace-nowrap">Supplier</th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground tracking-wider whitespace-nowrap">Date</th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground tracking-wider whitespace-nowrap">Po Number</th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground tracking-wider whitespace-nowrap text-right">Amount Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pendingPOs.map((po, idx) => (
                <tr key={idx} className="hover:bg-muted/20 transition-all group">
                  <td className="px-6 py-4 text-[13px] font-bold text-foreground">{po.supplier}</td>
                  <td className="px-6 py-4 text-[13px] font-medium text-muted-foreground">{po.date}</td>
                  <td className="px-6 py-4 text-[13px] font-bold text-primary">{po.po}</td>
                  <td className="px-6 py-4 text-[13px] font-bold text-foreground text-right tracking-tight">{po.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
