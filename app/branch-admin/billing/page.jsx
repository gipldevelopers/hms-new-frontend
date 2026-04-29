"use client";

import React, { useState, useMemo } from "react";
import { 
  Search, 
  FileText, 
  Plus, 
  Download, 
  Eye,
  ChevronDown,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// --- CUSTOM SELECT COMPONENT ---
function CustomSelect({ value, onChange, options, placeholder, className, minWidth = "100px" }) {
  const selectedOption = options.find(opt => opt.value === value);
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button 
          type="button"
          className={cn(
            "h-9 px-3 bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-medium text-foreground flex items-center justify-between gap-2 hover:bg-gray-50 dark:hover:bg-white/5 transition-all outline-none focus:border-primary w-full sm:w-auto shadow-none",
            className
          )}
          style={{ minWidth }}
        >
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[120px] border-[#E7E8EB] dark:border-white/10 shadow-none rounded-[5px] p-1 z-[500] bg-white dark:bg-[#101935]">
        {options.map((opt) => (
          <DropdownMenuItem 
            key={opt.value} 
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-[5px] text-[12px] font-medium px-3 py-2 cursor-pointer transition-colors",
              value === opt.value ? "bg-primary/5 text-primary font-bold" : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
            )}
          >
            {opt.label}
            {value === opt.value && <Check className="w-3.5 h-3.5 ml-auto text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const MOCK_DATA = [
  { id: "ADM001", patientName: "Rajesh Kumar", department: "Cardiology", totalAmount: "₹45,000", paid: "₹45,000", pending: "₹0", date: "2026-04-23 09:30 AM", status: "Paid" },
  { id: "ADM002", patientName: "Suresh Gupta", department: "Neurology", totalAmount: "₹65,000", paid: "₹30,000", pending: "₹35,000", date: "2026-04-23 10:15 AM", status: "Partial" },
  { id: "ADM003", patientName: "Anjali Sharma", department: "Orthopedics", totalAmount: "₹25,000", paid: "₹0", pending: "₹25,000", date: "2026-04-23 11:00 AM", status: "Pending" },
  { id: "ADM004", patientName: "Priya Verma", department: "Pediatrics", totalAmount: "₹15,000", paid: "₹15,000", pending: "₹0", date: "2026-04-23 11:45 AM", status: "Paid" },
  { id: "ADM005", patientName: "Vikram Singh", department: "Cardiology", totalAmount: "₹45,000", paid: "₹45,000", pending: "₹0", date: "2026-04-23 12:30 PM", status: "Paid" },
  { id: "ADM006", patientName: "Neha Kapoor", department: "Dermatology", totalAmount: "₹8,000", paid: "₹8,000", pending: "₹0", date: "2026-04-23 01:15 PM", status: "Paid" },
  { id: "ADM007", patientName: "Arun Patel", department: "Urology", totalAmount: "₹55,000", paid: "₹55,000", pending: "₹0", date: "2026-04-23 02:00 PM", status: "Paid" },
  { id: "ADM008", patientName: "Deepak Reddy", department: "Cardiology", totalAmount: "₹45,000", paid: "₹20,000", pending: "₹25,000", date: "2026-04-23 02:45 PM", status: "Partial" },
];

export default function BillingManagement() {
  const [activeTab, setActiveTab] = useState("All Invoices");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredData = useMemo(() => {
    return MOCK_DATA.filter(item => {
      const matchesSearch = item.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === "All Invoices" || item.status === activeTab;
      const matchesDept = selectedDept === "All" || item.department === selectedDept;
      const matchesStatus = selectedStatus === "All" || item.status === selectedStatus;
      
      return matchesSearch && matchesTab && matchesDept && matchesStatus;
    });
  }, [searchQuery, activeTab, selectedDept, selectedStatus]);

  const getStatusStyles = (status) => {
    switch (status) {
      case "Paid":
        return "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-500 dark:border-emerald-500/20";
      case "Partial":
        return "bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-500/10 dark:text-orange-500 dark:border-orange-500/20";
      case "Pending":
        return "bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-50 dark:border-red-500/20";
      default:
        return "bg-gray-50 text-gray-600 border-gray-100 dark:bg-white/5 dark:text-gray-400 dark:border-white/10";
    }
  };

  const departments = ["All", ...new Set(MOCK_DATA.map(i => i.department))];
  const statuses = ["All", "Paid", "Partial", "Pending"];

  return (
    <div className="p-4 sm:p-5 bg-[#F8F9FA] dark:bg-[#0B1121] min-h-screen flex flex-col space-y-5 transition-colors duration-300 font-sans pb-20">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h1 className="text-[20px] font-bold text-[#1A1C23] dark:text-white tracking-tight leading-none">
          Billing Management
        </h1>
        
        <div className="flex items-center gap-3">
          <button 
            className="h-[40px] px-4 rounded-[5px] text-[13px] font-bold flex items-center justify-center gap-2 bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 text-[#5E6C84] dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all shadow-none"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <button 
            className="h-[40px] px-4 rounded-[5px] text-[13px] font-bold flex items-center justify-center gap-2 bg-[#2D3A8C] text-white hover:opacity-90 transition-all shadow-none"
          >
            <Plus className="w-4 h-4" />
            Generate Invoice
          </button>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {["All Invoices", "Paid", "Pending"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-5 py-2 rounded-[5px] text-[12px] font-bold transition-all border shadow-none whitespace-nowrap",
              activeTab === tab 
                ? "bg-[#2D3A8C] text-white border-[#2D3A8C]" 
                : "bg-white dark:bg-[#101935] text-[#5E6C84] dark:text-slate-400 border-[#E7E8EB] dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Container */}
      <div className="bg-white dark:bg-[#101935] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 flex flex-col shadow-none overflow-hidden">
        
        {/* Filter Bar */}
        <div className="p-4 border-b border-[#E7E8EB] dark:border-white/10 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
          <div className="relative w-full md:w-[320px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0AEC0]" />
            <input 
              type="text" 
              placeholder="Search by ID or Patient Name..." 
              className="w-full h-10 pl-9 pr-4 bg-white dark:bg-[#0B1121] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-medium outline-none focus:border-primary transition-all shadow-none placeholder:text-[#A0AEC0]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="flex-1 md:flex-none">
              <CustomSelect 
                value={selectedDept}
                onChange={setSelectedDept}
                placeholder="Department"
                options={departments.map(d => ({ label: d, value: d }))}
                className="h-10 w-full"
                minWidth="140px"
              />
            </div>
            <div className="flex-1 md:flex-none">
              <CustomSelect 
                value={selectedStatus}
                onChange={setSelectedStatus}
                placeholder="Status"
                options={statuses.map(s => ({ label: s, value: s }))}
                className="h-10 w-full"
                minWidth="120px"
              />
            </div>
          </div>
        </div>

        {/* Table Area */}
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-[#F8F9FA] dark:bg-[#151D36]">
                <th className="px-4 sm:px-6 py-4 text-left text-[11px] font-bold text-[#5E6C84] dark:text-slate-400 border-b border-[#E7E8EB] dark:border-white/10 tracking-tight">Invoice Id</th>
                <th className="px-4 sm:px-6 py-4 text-left text-[11px] font-bold text-[#5E6C84] dark:text-slate-400 border-b border-[#E7E8EB] dark:border-white/10 tracking-tight">Patient Name</th>
                <th className="px-4 sm:px-6 py-4 text-left text-[11px] font-bold text-[#5E6C84] dark:text-slate-400 border-b border-[#E7E8EB] dark:border-white/10 tracking-tight">Department</th>
                <th className="px-4 sm:px-6 py-4 text-left text-[11px] font-bold text-[#5E6C84] dark:text-slate-400 border-b border-[#E7E8EB] dark:border-white/10 tracking-tight">Total Amount</th>
                <th className="px-4 sm:px-6 py-4 text-left text-[11px] font-bold text-[#5E6C84] dark:text-slate-400 border-b border-[#E7E8EB] dark:border-white/10 tracking-tight">Paid</th>
                <th className="px-4 sm:px-6 py-4 text-left text-[11px] font-bold text-[#5E6C84] dark:text-slate-400 border-b border-[#E7E8EB] dark:border-white/10 tracking-tight">Pending</th>
                <th className="px-4 sm:px-6 py-4 text-left text-[11px] font-bold text-[#5E6C84] dark:text-slate-400 border-b border-[#E7E8EB] dark:border-white/10 tracking-tight">Date</th>
                <th className="px-4 sm:px-6 py-4 text-left text-[11px] font-bold text-[#5E6C84] dark:text-slate-400 border-b border-[#E7E8EB] dark:border-white/10 tracking-tight">Status</th>
                <th className="px-4 sm:px-6 py-4 text-center text-[11px] font-bold text-[#5E6C84] dark:text-slate-400 border-b border-[#E7E8EB] dark:border-white/10 tracking-tight">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E8EB] dark:divide-white/10">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-20 text-center text-[#5E6C84] dark:text-slate-500 text-[13px] font-medium italic opacity-60">
                    No billing records found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all">
                    <td className="px-4 sm:px-6 py-4">
                      <span className="text-[13px] font-bold text-[#1A1C23] dark:text-white">{item.id}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span className="text-[13px] font-bold text-[#1A1C23] dark:text-white">{item.patientName}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span className="text-[13px] font-bold text-[#5E6C84] dark:text-slate-400">{item.department}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span className="text-[13px] font-bold text-[#1A1C23] dark:text-white">{item.totalAmount}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span className="text-[13px] font-bold text-emerald-500">{item.paid}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span className="text-[13px] font-bold text-orange-500">{item.pending}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span className="text-[13px] font-medium text-[#5E6C84] dark:text-slate-500 whitespace-nowrap">{item.date}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span className={cn(
                        "px-3 py-1 rounded-[5px] text-[11px] font-bold border inline-flex items-center justify-center min-w-[70px]",
                        getStatusStyles(item.status)
                      )}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-all group">
                        <Eye className="w-5 h-5 text-[#5E6C84] group-hover:text-primary transition-colors" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
