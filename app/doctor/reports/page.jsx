"use client";

import React, { useState, useEffect } from "react";
import { Search, ChevronDown, Download, Users, Hospital, ClipboardCheck, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function CustomSelect({ value, onChange, options, placeholder, minWidth = "100px" }) {
  const selected = options.find((o) => o.value === value);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="h-10 px-4 bg-card border border-border rounded-lg flex items-center justify-between gap-2 text-[13px] font-medium outline-none transition-all shadow-none w-full sm:w-auto"
          style={{ minWidth: typeof window !== 'undefined' && window.innerWidth < 640 ? '100%' : minWidth }}
        >
          <span className="truncate text-foreground">{selected ? selected.label : placeholder}</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[120px] border border-border bg-card p-1 rounded-lg shadow-none z-50">
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-lg text-[13px] font-medium px-3 py-2 cursor-pointer transition-colors outline-none",
              value === opt.value
                ? "bg-primary/5 text-primary font-bold dark:bg-primary/10"
                : "text-foreground hover:bg-muted dark:hover:bg-muted/50"
            )}
          >
            {opt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function ReportsPage() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authtoken");
        const res = await fetch("/api/doctor-opd/reports", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error("Failed to fetch reports");
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        } else {
          throw new Error(json.message || "Failed to fetch reports");
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  // Filter lists based on search
  const filteredOpd = data?.opdSummary?.filter(item => 
    !search || item.date.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const filteredIpd = data?.ipdSummary?.filter(item => 
    !search || 
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.status.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const handleExport = () => {
    if (!data) return;
    try {
      let csvContent = "";
      
      // 1. Stats Overview
      csvContent += "--- STATS OVERVIEW ---\n";
      csvContent += `Total OPD Patients,${data.stats?.totalOPD || 0}\n`;
      csvContent += `Total IPD Patients,${data.stats?.totalIPD || 0}\n`;
      csvContent += `Pending Discharge Summaries,${data.stats?.pendingDischarges || 0}\n\n`;
      
      // 2. OPD Summary
      csvContent += "--- RECENT OPD SUMMARY (7 DAYS) ---\n";
      csvContent += "Date,Patients Seen,Orders Given\n";
      (data.opdSummary || []).forEach(item => {
        csvContent += `"${item.date}",${item.seen},${item.orders}\n`;
      });
      csvContent += "\n";
      
      // 3. IPD Summary
      csvContent += "--- RECENT IPD SUMMARY ---\n";
      csvContent += "Patient Name,Admitted,Discharged,Status\n";
      (data.ipdSummary || []).forEach(item => {
        csvContent += `"${item.name}","${item.admitted}","${item.discharged}","${item.status}"\n`;
      });
      
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `Doctor_Clinical_Report_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to export report:", err);
      alert("Failed to export report.");
    }
  };

  return (
    <div className="p-4 md:p-5 bg-background min-h-screen flex flex-col gap-5 md:gap-6 transition-colors duration-300 font-sans pb-20">
      
      {/* Header & Export */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h1 className="text-[20px] font-bold text-foreground tracking-tight leading-none">
          Reports
        </h1>
        <button 
          onClick={handleExport}
          disabled={!data || loading}
          className="h-10 px-6 rounded-lg bg-primary text-primary-foreground text-[13px] font-bold hover:opacity-90 transition-all shadow-none flex items-center gap-2 w-full sm:w-auto justify-center disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>


      {loading && (
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-[#101935] border border-border rounded-[5px] flex-1">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-[13px] font-medium text-gray-500 dark:text-slate-400">Loading reports...</p>
        </div>
      )}

      {!loading && error && (
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-[#101935] border border-border rounded-[5px] text-destructive flex-1">
          <AlertCircle className="w-10 h-10 mb-2" />
          <p className="text-[14px] font-bold">Error Loading Reports</p>
          <p className="text-[12px] font-medium text-muted-foreground mt-1">{error}</p>
        </div>
      )}

      {!loading && !error && data && (
        <>
          {/* Stats Cards Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { label: "Total OPD Patients", value: data.stats?.totalOPD || "0", icon: Users, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10", border: "border-blue-100 dark:border-blue-500/20" },
              { label: "Total IPD Patients", value: data.stats?.totalIPD || "0", icon: Hospital, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-500/10", border: "border-rose-100 dark:border-rose-500/20" },
              { label: "Pending Discharge Summaries", value: data.stats?.pendingDischarges || "0", icon: ClipboardCheck, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10", border: "border-emerald-100 dark:border-emerald-500/20" },
            ].map((stat, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-6 flex justify-between items-center shadow-none group">
                <div className="space-y-3">
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center border", stat.bg, stat.border)}>
                    <stat.icon className={cn("w-5 h-5", stat.color)} />
                  </div>
                  <p className="text-[13px] font-medium text-muted-foreground">{stat.label}</p>
                </div>
                <p className="text-[32px] font-bold text-foreground leading-none">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-card border border-border p-3.5 rounded-lg shadow-none">
            <div className="relative w-full md:max-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-4 bg-card border border-border rounded-lg text-[13px] font-medium outline-none focus:border-primary transition-all shadow-none placeholder:text-muted-foreground text-foreground"
              />
            </div>
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-3">
              <CustomSelect value="All" options={[{label: "All Time", value: "All"}]} placeholder="Period: All" minWidth="120px" />
              <CustomSelect value="All" options={[{label: "All Status", value: "All"}]} placeholder="Status: All" minWidth="120px" />
            </div>
          </div>

          {/* Tables Section */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            
            {/* OPD Summary Table */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-[14px] font-bold text-foreground flex items-center gap-2 px-1">
                Recent OPD Summary (7 Days)
              </h2>
              <div className="bg-card border border-border rounded-lg overflow-hidden shadow-none overflow-x-auto no-scrollbar">
                <table className="w-full text-left border-collapse min-w-[300px]">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      <th className="px-5 py-4">Date</th>
                      <th className="px-5 py-4 text-center">Patients Seen</th>
                      <th className="px-5 py-4 text-center">Orders Given</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredOpd.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-5 py-4 text-center text-[13px] text-muted-foreground">
                          No OPD summaries found
                        </td>
                      </tr>
                    ) : (
                      filteredOpd.map((item, i) => (
                        <tr key={i} className="hover:bg-muted/30 transition-colors">
                          <td className="px-5 py-3.5 text-[13px] font-medium text-foreground">{item.date}</td>
                          <td className="px-5 py-3.5 text-[13px] font-bold text-foreground text-center">{item.seen}</td>
                          <td className="px-5 py-3.5 text-[13px] font-medium text-muted-foreground text-center">{item.orders}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* IPD Summary Table */}
            <div className="lg:col-span-3 space-y-4">
              <h2 className="text-[14px] font-bold text-foreground flex items-center gap-2 px-1">
                Recent IPD Summary
              </h2>
              <div className="bg-card border border-border rounded-lg overflow-hidden shadow-none overflow-x-auto no-scrollbar">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      <th className="px-5 py-4">Patient Name</th>
                      <th className="px-5 py-4">Admitted</th>
                      <th className="px-5 py-4">Discharged</th>
                      <th className="px-5 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredIpd.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-5 py-4 text-center text-[13px] text-muted-foreground">
                          No IPD summaries found
                        </td>
                      </tr>
                    ) : (
                      filteredIpd.map((item, i) => (
                        <tr key={i} className="hover:bg-muted/30 transition-colors">
                          <td className="px-5 py-3 text-[13px] font-bold text-foreground">{item.name}</td>
                          <td className="px-5 py-3 text-[12px] font-medium text-muted-foreground">{item.admitted}</td>
                          <td className="px-5 py-3 text-[12px] font-medium text-muted-foreground">{item.discharged}</td>
                          <td className="px-5 py-3">
                            <span className={cn(
                              "px-2.5 py-0.5 rounded-lg text-[10px] font-bold tracking-wider",
                              item.status === "Discharged" ? "bg-muted text-muted-foreground" : "bg-blue-50 dark:bg-blue-500/10 text-blue-600"
                            )}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </>
      )}

    </div>
  );
}
