"use client";

import React, { useState } from "react";
import { 
  Search, 
  ChevronDown, 
  FileText,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Link from "next/link";

const IPD_PATIENTS = [
  {
    id: 1,
    bedNo: "W1-102",
    patientName: "Robert Chen",
    ageGender: "45 yrs / M",
    admissionDate: "Oct 12, 2023",
    diagnosis: "Pneumonia",
    daysAdmitted: 4,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert"
  },
  {
    id: 2,
    bedNo: "W1-104",
    patientName: "Sarah Jenkins",
    ageGender: "28 yrs / F",
    admissionDate: "Oct 14, 2023",
    diagnosis: "Appendicitis Post-Op",
    daysAdmitted: 2,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
  },
  {
    id: 3,
    bedNo: "W2-205",
    patientName: "Michael O'Connor",
    ageGender: "62 yrs / M",
    admissionDate: "Oct 10, 2023",
    diagnosis: "Heart Failure",
    daysAdmitted: 6,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael"
  },
  {
    id: 4,
    bedNo: "W2-208",
    patientName: "Emily Davis",
    ageGender: "34 yrs / F",
    admissionDate: "Oct 15, 2023",
    diagnosis: "Dehydration",
    daysAdmitted: 1,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily"
  },
  {
    id: 5,
    bedNo: "ICU-02",
    patientName: "David Smith",
    ageGender: "55 yrs / M",
    admissionDate: "Oct 08, 2023",
    diagnosis: "Myocardial Infarction",
    daysAdmitted: 8,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David"
  },
  {
    id: 6,
    bedNo: "ICU-02",
    patientName: "David Smith",
    ageGender: "55 yrs / M",
    admissionDate: "Oct 08, 2023",
    diagnosis: "Myocardial Infarction",
    daysAdmitted: 8,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David1"
  },
  {
    id: 7,
    bedNo: "ICU-02",
    patientName: "David Smith",
    ageGender: "55 yrs / M",
    admissionDate: "Oct 08, 2023",
    diagnosis: "Myocardial Infarction",
    daysAdmitted: 8,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David2"
  },
  {
    id: 8,
    bedNo: "W2-205",
    patientName: "Michael O'Connor",
    ageGender: "62 yrs / M",
    admissionDate: "Oct 10, 2023",
    diagnosis: "Heart Failure",
    daysAdmitted: 6,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael3"
  },
  {
    id: 9,
    bedNo: "W2-208",
    patientName: "Emily Davis",
    ageGender: "34 yrs / F",
    admissionDate: "Oct 15, 2023",
    diagnosis: "Dehydration",
    daysAdmitted: 1,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily3"
  },
];

function CustomSelect({ value, onChange, options, placeholder, minWidth = "100px" }) {
  const selected = options.find((o) => o.value === value);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="h-10 px-4 bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] flex items-center justify-between gap-2 text-[13px] font-medium outline-none transition-all shadow-none"
          style={{ minWidth }}
        >
          <span className="truncate">{selected ? selected.label : placeholder}</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[120px] border border-[#E7E8EB] dark:border-white/10 bg-white dark:bg-[#101935] p-1 rounded-[5px] shadow-none z-50">
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-[5px] text-[13px] font-medium px-3 py-2 cursor-pointer transition-colors outline-none",
              value === opt.value
                ? "bg-primary/5 text-primary font-bold dark:bg-primary/10"
                : "text-foreground hover:bg-[#F8F9FC] dark:hover:bg-white/5"
            )}
          >
            {opt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function IPDPatientsPage() {
  const [search, setSearch] = useState("");
  const [wardFilter, setWardFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  return (
    <div className="p-[20px] bg-[#F8F9FC] dark:bg-[#0A0F1D] min-h-screen flex flex-col space-y-[20px] transition-colors duration-300 font-sans pb-20">
      
      {/* ── Header Area ── */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h1 className="text-[20px] font-bold text-[#1A1C23] dark:text-white tracking-tight leading-none">
          Admitted Patients
        </h1>
      </div>

      {/* ── Filter Toolbar ── */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 p-3.5 rounded-[5px] shadow-none">
        <div className="relative flex-1 max-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-10 bg-white dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-medium outline-none focus:border-primary transition-all shadow-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex items-center gap-3">
          <CustomSelect
            value={wardFilter}
            onChange={setWardFilter}
            placeholder="All"
            options={[{ label: "All", value: "All" }]}
            minWidth="80px"
          />
          <CustomSelect
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="All"
            options={[{ label: "All", value: "All" }]}
            minWidth="80px"
          />
        </div>
      </div>

      {/* ── Table Container ── */}
      <div className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] overflow-hidden shadow-none overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-white dark:bg-white/[0.02] border-b border-[#E7E8EB] dark:border-white/10 text-[11px] font-bold text-[#5E6C84] dark:text-slate-400">
              <th className="px-6 py-5">Bed No.</th>
              <th className="px-6 py-5">Patient</th>
              <th className="px-6 py-5">Admission Date</th>
              <th className="px-6 py-5">Diagnosis</th>
              <th className="px-6 py-5 text-center">Days Admitted</th>
              <th className="px-6 py-5 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E7E8EB] dark:divide-white/5">
            {IPD_PATIENTS.map((patient) => (
              <tr key={patient.id} className="hover:bg-[#F8F9FC] dark:hover:bg-white/[0.01] transition-colors">
                {/* Bed No */}
                <td className="px-6 py-4">
                  <span className="inline-flex items-center justify-center px-3 py-1.5 bg-[#F1F2F4] dark:bg-white/10 text-[#1A1C23] dark:text-white text-[12px] font-bold rounded-[5px]">
                    {patient.bedNo}
                  </span>
                </td>

                {/* Patient Info */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 dark:bg-white/10 flex-shrink-0 relative">
                       <img 
                        src={patient.avatar} 
                        alt={patient.patientName} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] font-bold text-[#1A1C23] dark:text-white leading-tight">
                        {patient.patientName}
                      </span>
                      <span className="text-[12px] text-[#5E6C84] dark:text-slate-400 font-medium">
                        {patient.ageGender}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Admission Date */}
                <td className="px-6 py-4 text-[13px] font-medium text-[#1A1C23] dark:text-white">
                  {patient.admissionDate}
                </td>

                {/* Diagnosis */}
                <td className="px-6 py-4 text-[13px] font-medium text-[#5E6C84] dark:text-slate-400">
                  {patient.diagnosis}
                </td>

                {/* Days Admitted */}
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-[#E8EBF8] dark:bg-primary/20 text-[#2D3A8C] dark:text-primary-foreground text-[12px] font-bold rounded-full">
                    {patient.daysAdmitted}
                  </span>
                </td>

                {/* Action */}
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <Link href={`/doctor/ipd/${patient.id}`} className="h-9 px-4 bg-[#2D3A8C] text-white rounded-[5px] text-[12px] font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-none outline-none">
                      <FileText className="w-3.5 h-3.5" />
                      View Chart
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile View (Cards) ── */}
      <div className="grid grid-cols-1 gap-[20px] md:hidden">
        {IPD_PATIENTS.map((patient) => (
          <div key={patient.id} className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 p-5 rounded-[5px] space-y-4 shadow-none">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 dark:bg-white/10 relative">
                  <img 
                    src={patient.avatar} 
                    alt={patient.patientName} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-[#1A1C23] dark:text-white leading-tight">{patient.patientName}</h3>
                  <p className="text-[12px] text-[#5E6C84] dark:text-slate-400 font-medium mt-0.5">{patient.ageGender}</p>
                </div>
              </div>
              <span className="inline-flex items-center justify-center px-3 py-1.5 bg-[#F1F2F4] dark:bg-white/10 text-[#1A1C23] dark:text-white text-[11px] font-bold rounded-[5px]">
                {patient.bedNo}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 py-3 border-t border-b border-[#E7E8EB] dark:border-white/5">
              <div>
                <p className="text-[10px] font-bold text-[#5E6C84] dark:text-slate-500 uppercase tracking-wider mb-1">Admission Date</p>
                <p className="text-[13px] font-medium text-[#1A1C23] dark:text-white">{patient.admissionDate}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#5E6C84] dark:text-slate-500 uppercase tracking-wider mb-1">Days Admitted</p>
                <span className="inline-flex items-center justify-center w-6 h-6 bg-[#E8EBF8] dark:bg-primary/20 text-[#2D3A8C] dark:text-primary-foreground text-[12px] font-bold rounded-full">
                  {patient.daysAdmitted}
                </span>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] font-bold text-[#5E6C84] dark:text-slate-500 uppercase tracking-wider mb-1">Diagnosis</p>
                <p className="text-[13px] font-medium text-[#5E6C84] dark:text-slate-400">{patient.diagnosis}</p>
              </div>
            </div>

            <Link href={`/doctor/ipd/${patient.id}`} className="w-full h-11 bg-[#2D3A8C] text-white rounded-[5px] text-[13px] font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-none outline-none">
              <FileText className="w-4 h-4" />
              View Patient Chart
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
