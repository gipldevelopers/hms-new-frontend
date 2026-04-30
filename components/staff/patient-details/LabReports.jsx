"use client";

import React, { useState } from "react";
import { Search, ChevronDown, Eye, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function LabReports() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const categoryOptions = ["All", "Hematology", "Biochemistry", "Microbiology", "Radiology", "Imaging"];

  const reports = [
    { 
      date: "Today, 08:00 AM", 
      name: "Complete Blood Count (CBC)", 
      category: "Hematology", 
      status: "CRITICAL", 
      statusColor: "bg-rose-50 text-rose-500 border-rose-100" 
    },
    { 
      date: "Yesterday, 08:30 AM", 
      name: "Lipid Panel", 
      category: "Biochemistry", 
      status: "STABLE", 
      statusColor: "bg-emerald-50 text-emerald-600 border-emerald-100" 
    },
    { 
      date: "Yesterday, 08:30 AM", 
      name: "HbA1c", 
      category: "Biochemistry", 
      status: "STABLE", 
      statusColor: "bg-emerald-50 text-emerald-600 border-emerald-100" 
    },
    { 
      date: "10 Oct 2023", 
      name: "Urinalysis", 
      category: "Microbiology", 
      status: "STABLE", 
      statusColor: "bg-emerald-50 text-emerald-600 border-emerald-100" 
    },
    { 
      date: "11 Oct 2023", 
      name: "Blood Test", 
      category: "Hematology", 
      status: "CRITICAL", 
      statusColor: "bg-rose-50 text-rose-500 border-rose-100" 
    },
    { 
      date: "12 Oct 2023", 
      name: "X-Ray", 
      category: "Radiology", 
      status: "STABLE", 
      statusColor: "bg-emerald-50 text-emerald-600 border-emerald-100" 
    },
    { 
      date: "13 Oct 2023", 
      name: "MRI Scan", 
      category: "Imaging", 
      status: "CRITICAL", 
      statusColor: "bg-rose-50 text-rose-500 border-rose-100" 
    }
  ];

  const filteredReports = reports.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "All" || r.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleView = (report) => {
    alert(`Viewing Lab Report: ${report.name}\nStatus: ${report.status}`);
  };

  return (
    <div className="space-y-[20px] animate-in fade-in duration-500">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-[400px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search reports..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-11 pr-4 bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] outline-none focus:ring-1 focus:ring-primary/20 transition-all shadow-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-11 px-5 bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-bold text-[#1A1C23] dark:text-white flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-all outline-none w-full sm:w-auto justify-between sm:justify-start">
                {filterCategory === "All" ? "All Categories" : filterCategory}
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px] bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] p-1 shadow-xl">
              {categoryOptions.map((cat) => (
                <DropdownMenuItem
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={cn(
                    "rounded-[5px] px-3 py-2 text-[13px] font-medium cursor-pointer transition-colors",
                    filterCategory === cat
                      ? "bg-primary/5 text-primary font-bold"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
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
      <div className="bg-transparent md:bg-white dark:md:bg-[#101935] md:rounded-[5px] md:border md:border-[#E7E8EB] dark:md:border-white/10 shadow-none overflow-hidden">
        {/* Mobile Card View */}
        <div className="grid grid-cols-1 gap-4 md:hidden pb-10">
          {filteredReports.map((report, i) => (
            <div key={i} className="bg-white dark:bg-[#101935] p-5 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 active:scale-[0.98] transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h4 className="text-[15px] font-bold text-[#1A1C23] dark:text-white mb-1 leading-tight">{report.name}</h4>
                  <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest">{report.date}</p>
                </div>
                <span className={cn(
                  "px-2.5 py-1 rounded-[5px] text-[9px] font-black border uppercase tracking-widest ml-4",
                  report.status === "CRITICAL" ? "bg-rose-50 text-rose-500 border-rose-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                )}>
                  {report.status}
                </span>
              </div>
              <div className="pt-4 border-t border-gray-50 dark:border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Category</p>
                  <p className="text-[13px] text-[#1A1C23] dark:text-white font-semibold">{report.category}</p>
                </div>
                <button 
                  onClick={() => handleView(report)}
                  className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto no-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#F8F9FC] dark:bg-white/[0.02]">
                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 border-b border-[#E7E8EB] dark:border-white/10 uppercase tracking-widest">DATE & TIME</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 border-b border-[#E7E8EB] dark:border-white/10 uppercase tracking-widest">TEST NAME</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 border-b border-[#E7E8EB] dark:border-white/10 uppercase tracking-widest">CATEGORY</th>
                <th className="px-6 py-4 text-center text-[11px] font-bold text-gray-400 border-b border-[#E7E8EB] dark:border-white/10 uppercase tracking-widest">STATUS</th>
                <th className="px-6 py-4 text-right text-[11px] font-bold text-gray-400 border-b border-[#E7E8EB] dark:border-white/10 uppercase tracking-widest">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E8EB] dark:divide-white/5">
              {filteredReports.map((report, i) => (
                <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-all group">
                  <td className="px-6 py-5">
                    <span className="text-[13px] font-bold text-[#1A1C23] dark:text-white leading-tight">{report.date}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[14px] font-bold text-[#1A1C23] dark:text-white leading-tight">{report.name}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[13px] font-medium text-gray-500">{report.category}</span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={cn(
                      "px-3 py-1 rounded-[5px] text-[9px] font-black border uppercase tracking-widest", 
                      report.status === "CRITICAL" 
                        ? "bg-rose-50 text-rose-500 border-rose-100" 
                        : "bg-emerald-50 text-emerald-600 border-emerald-100"
                    )}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button 
                      onClick={() => handleView(report)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-[5px] transition-all text-gray-400 hover:text-primary"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
