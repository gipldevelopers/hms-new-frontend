"use client";

import React, { useState, useEffect } from "react";
import { Search, ChevronDown, Eye, Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function LabReports({ patient, onViewReport }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryOptions = ["All", "Hematology", "Biochemistry", "Microbiology", "Radiology", "Imaging"];

  useEffect(() => {
    async function loadReports() {
      if (!patient || !patient.id) {
        setLoading(false);
        return;
      }
      try {
        const token = localStorage.getItem("authtoken");
        const res = await fetch("/api/laboratory/test-orders", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.ok) {
          const result = await res.json();
          if (result.success && Array.isArray(result.data)) {
            // Filter strictly by this patient's ID
            const patientOrders = result.data.filter(
              o => o.patientId === patient.id
            );

            // Map each database order to the UI format
            const mapped = patientOrders.map(order => {
              const testsArray = Array.isArray(order.tests) ? order.tests : [];
              const testNames = testsArray.map(t => t.name).join(", ") || "Clinical Report";

              // Derive category dynamically based on test names
              let category = "Biochemistry";
              const lowerNames = testNames.toLowerCase();
              if (lowerNames.includes("cbc") || lowerNames.includes("blood") || lowerNames.includes("hemoglobin") || lowerNames.includes("wbc") || lowerNames.includes("rbc") || lowerNames.includes("hematocrit")) {
                category = "Hematology";
              } else if (lowerNames.includes("urine") || lowerNames.includes("urinalysis") || lowerNames.includes("micro")) {
                category = "Microbiology";
              } else if (lowerNames.includes("x-ray") || lowerNames.includes("radiology") || lowerNames.includes("mri") || lowerNames.includes("scan")) {
                category = "Radiology";
              }

              // Check if report has been generated in localStorage
              const isGenerated = typeof window !== "undefined" && localStorage.getItem(`report-generated-${order.id}`) === "true";
              const statusText = isGenerated ? "COMPLETED" : "PENDING";
              const statusColor = isGenerated
                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                : "bg-destructive/10 text-destructive border-destructive/20";

              const orderedDate = new Date(order.createdAt || order.orderedAt || new Date());
              const dateStr = orderedDate.toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }) + ", " + orderedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return {
                id: order.id,
                date: dateStr,
                name: testNames,
                category,
                status: statusText,
                statusColor
              };
            });
            setReports(mapped);
          }
        }
      } catch (err) {
        console.error("Error loading lab reports for patient", err);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, [patient]);

  const filteredReports = reports.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "All" || r.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleView = (report) => {
    // Navigate directly to the print-ready generate report page for that result
    router.push(`/laboratory/sample-collection/report?id=${report.id}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 bg-card border border-border rounded-lg shadow-none min-h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-[13px] font-bold text-muted-foreground">Loading laboratory reports...</p>
      </div>
    );
  }

  return (
    <div className="space-y-[20px] font-sans">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-[400px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search reports..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-11 pr-4 bg-card border border-border rounded-lg text-[13px] outline-none focus:ring-1 focus:ring-primary/20 transition-all shadow-none text-foreground placeholder:text-muted-foreground font-semibold"
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-11 px-5 bg-card border border-border rounded-lg text-[13px] font-bold text-foreground flex items-center gap-3 hover:bg-muted transition-all outline-none w-full sm:w-auto justify-between sm:justify-start shadow-none">
                {filterCategory === "All" ? "All Categories" : filterCategory}
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px] bg-card border border-border rounded-lg p-1 shadow-none z-50">
              {categoryOptions.map((cat) => (
                <DropdownMenuItem
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={cn(
                    "rounded-lg px-3 py-2 text-[13px] font-medium cursor-pointer transition-colors",
                    filterCategory === cat
                      ? "bg-primary/5 text-primary font-bold"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  {cat === "All" ? "All Categories" : cat}
                  {filterCategory === cat && <Check className="w-4 h-4 ml-auto" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Card View (Mobile) / Table View (Desktop) */}
      <div className="bg-transparent md:bg-card md:rounded-lg md:border md:border-border shadow-none overflow-hidden">
        {/* Mobile Card View */}
        <div className="grid grid-cols-1 gap-4 md:hidden pb-10">
          {filteredReports.length > 0 ? (
            filteredReports.map((report, i) => (
              <div key={i} className="bg-card p-5 rounded-lg border border-border active:scale-[0.98] transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h4 className="text-[15px] font-bold text-foreground mb-1 leading-tight">{report.name}</h4>
                    <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">{report.date}</p>
                  </div>
                  <span className={cn(
                    "px-2.5 py-1 rounded-md text-[9px] font-black border uppercase tracking-widest ml-4",
                    report.statusColor
                  )}>
                    {report.status}
                  </span>
                </div>
                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Category</p>
                    <p className="text-[13px] text-foreground font-semibold">{report.category}</p>
                  </div>
                  <button 
                    onClick={() => handleView(report)}
                    className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary cursor-pointer hover:bg-primary/10 transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-card p-10 text-center border border-border rounded-lg text-muted-foreground font-bold">
              No laboratory reports found for this patient.
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto no-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted/30">
                <th className="px-6 py-4 text-left text-[11px] font-bold text-muted-foreground border-b border-border uppercase tracking-widest">DATE & TIME</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-muted-foreground border-b border-border uppercase tracking-widest">TEST NAME</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-muted-foreground border-b border-border uppercase tracking-widest">CATEGORY</th>
                <th className="px-6 py-4 text-center text-[11px] font-bold text-muted-foreground border-b border-border uppercase tracking-widest">STATUS</th>
                <th className="px-6 py-4 text-right text-[11px] font-bold text-muted-foreground border-b border-border uppercase tracking-widest">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredReports.length > 0 ? (
                filteredReports.map((report, i) => (
                  <tr key={i} className="hover:bg-muted/30 transition-all group">
                    <td className="px-6 py-5">
                      <span className="text-[13px] font-bold text-foreground leading-tight">{report.date}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[14px] font-bold text-foreground leading-tight">{report.name}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[13px] font-medium text-muted-foreground">{report.category}</span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={cn(
                        "px-3 py-1 rounded-md text-[9px] font-black border uppercase tracking-widest", 
                        report.statusColor
                      )}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button 
                        onClick={() => handleView(report)}
                        className="p-2 hover:bg-muted rounded-lg transition-all text-muted-foreground hover:text-primary cursor-pointer"
                        title="View Generated Report"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-muted-foreground font-bold text-[13px]">
                    No laboratory reports found for this patient.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
