"use client";

import React, { useState } from "react";
import { 
  Search, 
  ChevronDown, 
  Eye, 
  Calendar, 
  LogOut, 
  Activity, 
  Clock 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function PatientsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const stats = [
    { label: "Today's Admissions", value: "07", icon: Calendar, color: "blue" },
    { label: "Today's Discharges", value: "04", icon: LogOut, color: "red" },
    { label: "In Progress", value: "02", icon: Activity, color: "emerald" },
    { label: "Pending", value: "03", icon: Clock, color: "amber" },
  ];

  const patients = [
    { name: "Rajesh Kumar", age: "45 / Male", bed: "ICU-04", diagnosis: "Acute Myocardial Infarction", status: "CRITICAL" },
    { name: "Maria Lopez", age: "60 / Female", bed: "ICU-01", diagnosis: "Chronic Heart Failure", status: "STABLE" },
    { name: "John Smith", age: "50 / Male", bed: "ICU-02", diagnosis: "Pneumonia", status: "SERIOUS" },
    { name: "Anita Bhatt", age: "30 / Female", bed: "ICU-03", diagnosis: "Severe Asthma Attack", status: "STABLE" },
    { name: "Carlos Vega", age: "55 / Male", bed: "ICU-05", diagnosis: "Acute Stroke", status: "CRITICAL" },
    { name: "Helen Parker", age: "40 / Female", bed: "ICU-06", diagnosis: "Diabetes Complications", status: "SERIOUS" },
    { name: "William Johnson", age: "70 / Male", bed: "ICU-07", diagnosis: "Sepsis", status: "CRITICAL" },
    { name: "Nina Patel", age: "35 / Female", bed: "ICU-08", diagnosis: "Appendicitis", status: "STABLE" },
    { name: "George Brown", age: "65 / Male", bed: "ICU-09", diagnosis: "COPD Exacerbation", status: "STABLE" },
  ];

  return (
    <div className="p-4 md:p-6 bg-[#F8F9FC] dark:bg-[#0A0F1D] min-h-screen flex flex-col space-y-[15px] md:space-y-[20px] transition-colors duration-300 font-sans pb-20">
      
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-[20px] md:text-[24px] font-bold text-[#1e293b] dark:text-white tracking-tight leading-none">Patients</h1>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-[#101935] p-5 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 flex items-center justify-between shadow-none">
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-12 h-12 rounded-[5px] flex items-center justify-center shrink-0",
                stat.color === "blue" && "bg-primary/10 text-primary",
                stat.color === "red" && "bg-rose-500/10 text-rose-500",
                stat.color === "emerald" && "bg-emerald-500/10 text-emerald-500",
                stat.color === "amber" && "bg-amber-500/10 text-amber-500",
              )}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] md:text-[11px] font-bold text-gray-400 leading-none mb-1.5 uppercase tracking-wider">{stat.label}</p>
                <p className="text-[18px] md:text-[20px] font-bold text-[#1e293b] dark:text-white leading-none">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area (Filter + Table) */}
      <div className="space-y-[15px] md:space-y-[20px]">
        {/* Filter Bar */}
        <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-4 bg-white dark:bg-[#101935] p-3 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 shadow-none">
          <div className="relative w-full xl:w-[380px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search patients..."
              className="w-full h-11 pl-11 pr-4 bg-[#F8F9FC] dark:bg-[#1e293b] border border-gray-100 dark:border-white/10 rounded-[5px] text-[13px] font-medium focus:border-primary transition-all font-semibold outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button className="h-11 px-5 bg-[#F8F9FC] dark:bg-[#1e293b] border border-gray-100 dark:border-white/10 rounded-[5px] text-[13px] font-bold text-foreground flex items-center justify-between gap-3 hover:bg-muted transition-all outline-none w-full sm:min-w-[140px]">
              Ward <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            <button className="h-11 px-5 bg-[#F8F9FC] dark:bg-[#1e293b] border border-gray-100 dark:border-white/10 rounded-[5px] text-[13px] font-bold text-foreground flex items-center justify-between gap-3 hover:bg-muted transition-all outline-none w-full sm:min-w-[140px]">
              Status <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Table Area (Desktop) / Card Area (Mobile) */}
        <div className="bg-transparent md:bg-white dark:md:bg-[#101935] md:rounded-[5px] md:border md:border-[#E7E8EB] dark:md:border-white/10 shadow-none overflow-hidden">
          {/* Mobile Card View */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {patients.map((patient, i) => (
              <div 
                key={i} 
                onClick={() => router.push(`/staff/patients/${i + 1}`)}
                className="bg-white dark:bg-[#101935] p-5 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 active:scale-[0.98] transition-all cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-[16px] font-bold text-[#1A1C23] dark:text-white mb-1">{patient.name}</h3>
                    <p className="text-[12px] font-medium text-gray-400">{patient.age} • Bed: <span className="text-[#1A1C23] dark:text-white font-bold">{patient.bed}</span></p>
                  </div>
                  <span className={cn(
                    "px-2.5 py-1 rounded-[5px] text-[9px] font-black border uppercase tracking-wider",
                    patient.status === "CRITICAL" && "bg-rose-50 text-rose-500 border-rose-100",
                    patient.status === "STABLE" && "bg-emerald-50 text-emerald-600 border-emerald-100",
                    patient.status === "SERIOUS" && "bg-orange-50 text-orange-500 border-orange-100"
                  )}>
                    {patient.status}
                  </span>
                </div>
                <div className="pt-4 border-t border-gray-50 dark:border-white/5 flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Diagnosis</p>
                    <p className="text-[13px] text-gray-500 dark:text-gray-400 font-medium line-clamp-1">{patient.diagnosis}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto no-scrollbar">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#F8F9FC] dark:bg-white/[0.02]">
                  <th className="px-8 py-4 text-left text-[11px] font-bold text-gray-400 border-b border-[#E7E8EB] dark:border-white/10 uppercase tracking-widest">PATIENT NAME</th>
                  <th className="px-8 py-4 text-left text-[11px] font-bold text-gray-400 border-b border-[#E7E8EB] dark:border-white/10 uppercase tracking-widest">AGE/GENDER</th>
                  <th className="px-8 py-4 text-left text-[11px] font-bold text-gray-400 border-b border-[#E7E8EB] dark:border-white/10 uppercase tracking-widest">BED NO</th>
                  <th className="px-8 py-4 text-left text-[11px] font-bold text-gray-400 border-b border-[#E7E8EB] dark:border-white/10 uppercase tracking-widest">DIAGNOSIS</th>
                  <th className="px-8 py-4 text-center text-[11px] font-bold text-gray-400 border-b border-[#E7E8EB] dark:border-white/10 uppercase tracking-widest">STATUS</th>
                  <th className="px-8 py-4 text-right text-[11px] font-bold text-gray-400 border-b border-[#E7E8EB] dark:border-white/10 uppercase tracking-widest">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E8EB] dark:divide-white/5">
                {patients.map((patient, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-all group cursor-pointer" onClick={() => router.push(`/staff/patients/${i + 1}`)}>
                    <td className="px-8 py-5">
                      <div className="text-[14px] font-bold text-[#1e293b] dark:text-white leading-tight">{patient.name}</div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-[14px] text-gray-500 dark:text-gray-400 font-medium">{patient.age}</div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-[14px] font-bold text-[#1e293b] dark:text-white">{patient.bed}</div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-[14px] text-gray-500 dark:text-gray-400 font-medium truncate max-w-[200px]">{patient.diagnosis}</div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className={cn(
                        "px-3 py-1 rounded-[5px] text-[10px] font-black border uppercase tracking-wider inline-flex",
                        patient.status === "CRITICAL" && "bg-rose-50 text-rose-500 border-rose-100",
                        patient.status === "STABLE" && "bg-emerald-50 text-emerald-600 border-emerald-100",
                        patient.status === "SERIOUS" && "bg-orange-50 text-orange-500 border-orange-100"
                      )}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-[5px] transition-colors">
                        <Eye className="w-5 h-5 text-primary" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
