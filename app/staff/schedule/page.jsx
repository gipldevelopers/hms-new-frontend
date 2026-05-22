"use client";

import React, { useState } from "react";
import {
  Search, Plus, Eye, Check, X, ChevronDown, MoreVertical,
  Calendar, Clock, CheckCircle2, AlertCircle, ListTodo, Activity, MapPin
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ─── helpers ──────────────────────────────────────────────────────────────────
function CustomSelect({ value, onChange, options, placeholder, minWidth = "120px" }) {
  const selected = options.find((o) => o.value === value);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="h-11 px-5 bg-card border border-border rounded-[var(--radius)] text-[13px] font-bold text-foreground flex items-center justify-between gap-3 hover:bg-muted transition-all outline-none w-full sm:w-auto shadow-none"
          style={mounted ? { minWidth } : {}}
        >
          <span className="truncate flex-1 text-left">{selected ? selected.label : placeholder}</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px] border border-border bg-card rounded-[var(--radius)] p-1 z-[500] shadow-none">
        <DropdownMenuItem
          onClick={() => onChange("")}
          className={cn("rounded-[var(--radius)] text-[13px] font-medium px-3 py-2 cursor-pointer", !value ? "bg-accent text-accent-foreground font-semibold" : "text-foreground hover:bg-muted")}
        >
          All
        </DropdownMenuItem>
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn("rounded-[var(--radius)] text-[13px] font-medium px-3 py-2 cursor-pointer flex items-center justify-between", value === opt.value ? "bg-accent text-accent-foreground font-semibold" : "text-foreground hover:bg-muted")}
          >
            {opt.label}
            {value === opt.value && <Check className="w-3.5 h-3.5 text-foreground" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const statusBadgeClass = (status) => {
  if (status.includes("Overdue")) return "bg-destructive/10 text-destructive border border-destructive/20 font-medium px-2.5 py-0.5 rounded-[var(--radius)] text-[11px] inline-flex items-center gap-1.5 shadow-none";
  if (status.includes("Meds Due") || status.includes("Due Soon")) return "bg-amber-500/10 text-amber-600 border border-amber-500/20 font-medium px-2.5 py-0.5 rounded-[var(--radius)] text-[11px] inline-flex items-center gap-1.5 shadow-none";
  return "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-medium px-2.5 py-0.5 rounded-[var(--radius)] text-[11px] inline-flex items-center gap-1.5 shadow-none";
};

// ─── mock data ────────────────────────────────────────────────────────────────
const INITIAL_PATIENTS = [
  { id: 1, name: "James Wilson", doctor: "Dr. Aris Thorne", dose: "Acute Myocardial Infarction", status: "1 Overdue" },
  { id: 2, name: "Maria Lopez", doctor: "Dr. Sarah Jenkins", dose: "Chronic Heart Failure", status: "3 Meds Due" },
  { id: 3, name: "John Smith", doctor: "Dr. Aris Thorne", dose: "Pneumonia", status: "All Clear" },
  { id: 4, name: "Anita Bhatt", doctor: "Dr. Michael Vane", dose: "Severe Asthma Attack", status: "1 Due Soon" },
  { id: 5, name: "Carlos Vega", doctor: "Dr. Sarah Jenkins", dose: "Acute Stroke", status: "2 Overdue" },
  { id: 6, name: "Helen Parker", doctor: "Dr. Aris Thorne", dose: "Diabetes Complications", status: "1 Overdue" },
  { id: 7, name: "William Johnson", doctor: "Dr. Sarah Jenkins", dose: "Sepsis", status: "3 Meds Due" },
  { id: 8, name: "Nina Patel", doctor: "Dr. Aris Thorne", dose: "Appendicitis", status: "All Clear" },
  { id: 9, name: "George Brown", doctor: "Dr. Michael Vane", dose: "COPD Exacerbation", status: "1 Due Soon" },
];

export default function SchedulePage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [attendingFilter, setAttendingFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const attendingDoctors = [
    { label: "Dr. Aris Thorne", value: "Dr. Aris Thorne" },
    { label: "Dr. Sarah Jenkins", value: "Dr. Sarah Jenkins" },
    { label: "Dr. Michael Vane", value: "Dr. Michael Vane" },
  ];

  const statusOptions = [
    { label: "Overdue", value: "Overdue" },
    { label: "Due Soon", value: "Due Soon" },
    { label: "Meds Due", value: "Meds Due" },
    { label: "All Clear", value: "All Clear" },
  ];

  const filtered = INITIAL_PATIENTS.filter((p) => {
    const s = search.toLowerCase();
    const matchSearch = p.name.toLowerCase().includes(s) || p.dose.toLowerCase().includes(s);
    const matchDoctor = !attendingFilter || p.doctor === attendingFilter;
    const matchStatus = !statusFilter || p.status.includes(statusFilter);
    return matchSearch && matchDoctor && matchStatus;
  });

  return (
    <div className="p-5 bg-background text-foreground min-h-screen flex flex-col space-y-5 transition-colors duration-300 font-sans pb-20 shadow-none">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-5">
        <h1 className="text-[20px] md:text-[24px] font-bold text-foreground tracking-tight leading-none">
          Schedule
        </h1>
      </div>

      {/* ── Stats Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="bg-card text-card-foreground p-5 border border-border rounded-[var(--radius)] flex items-center justify-between shadow-none">
          <div className="flex items-center gap-4">
            <div className="bg-blue-500/10 text-blue-600 dark:text-blue-300 p-3 rounded-[var(--radius)]">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-muted-foreground leading-tight">Active Patients</p>
              <h3 className="text-[24px] font-bold text-foreground mt-1">14</h3>
            </div>
          </div>
        </div>

        <div className="bg-card text-card-foreground p-5 border border-border rounded-[var(--radius)] flex items-center justify-between shadow-none">
          <div className="flex items-center gap-4">
            <div className="bg-destructive/10 text-destructive p-3 rounded-[var(--radius)]">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-muted-foreground leading-tight">Medication Due Now</p>
              <h3 className="text-[24px] font-bold text-foreground mt-1">02</h3>
            </div>
          </div>
        </div>

        <div className="bg-card text-card-foreground p-5 border border-border rounded-[var(--radius)] flex items-center justify-between shadow-none">
          <div className="flex items-center gap-4">
            <div className="bg-blue-500/10 text-blue-600 dark:text-blue-300 p-3 rounded-[var(--radius)]">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-muted-foreground leading-tight">Overdue Medications</p>
              <h3 className="text-[24px] font-bold text-foreground mt-1">03</h3>
            </div>
          </div>
        </div>

        <div className="bg-card text-card-foreground p-5 border border-border rounded-[var(--radius)] flex items-center justify-between shadow-none">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 p-3 rounded-[var(--radius)]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-muted-foreground leading-tight">Ward Occupancy</p>
              <h3 className="text-[24px] font-bold text-foreground mt-1">93%</h3>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Overview Card Box ── */}
      <div className="bg-card text-card-foreground border border-border p-5 rounded-[var(--radius)] flex flex-col space-y-5 shadow-none">

        {/* Card Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-5">
          <h2 className="text-[18px] font-bold text-foreground tracking-tight leading-none">
            Ward Patient Overview
          </h2>
          <button
            onClick={() => router.push("/staff/admissions")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground h-11 px-5 rounded-[var(--radius)] text-[13px] font-bold flex items-center justify-center gap-1.5 transition-all w-full sm:w-auto shadow-none"
          >
            <Plus className="w-4 h-4" /> New Admission
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-transparent">
          <div className="relative w-full md:w-[260px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full h-11 pl-11 pr-4 bg-background border border-border rounded-[var(--radius)] text-[13px] font-normal focus:border-primary transition-all outline-none text-foreground placeholder:text-muted-foreground shadow-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <CustomSelect value={attendingFilter} onChange={setAttendingFilter} options={attendingDoctors} placeholder="Attending Doctor" minWidth="150px" />
            <CustomSelect value={statusFilter} onChange={setStatusFilter} options={statusOptions} placeholder="Status" minWidth="120px" />
          </div>
        </div>

        {/* Desktop View Table */}
        <div className="hidden md:block border border-border rounded-[var(--radius)] overflow-hidden bg-card text-card-foreground shadow-none">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted/30 border-b border-border">
                  {["Patient Name", "Attending Doctor", "Next Due Dose", "Medication Status", "Action"].map((col, i) => (
                    <th key={i} className={cn(
                      "px-6 py-3.5 text-[12px] font-semibold text-muted-foreground",
                      i === 4 ? "text-center" : "text-left"
                    )}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((patient) => (
                  <tr key={patient.id} className="hover:bg-muted/30 transition-all">
                    <td className="px-6 py-4">
                      <span className="text-[14px] font-semibold text-foreground">{patient.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[13px] font-medium text-foreground">{patient.doctor}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[13px] font-medium text-foreground">{patient.dose}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={statusBadgeClass(patient.status)}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className="p-2 hover:bg-muted rounded-[var(--radius)] transition-all inline-flex text-foreground shadow-none"
                            title="Actions"
                          >
                            <MoreVertical className="w-4.5 h-4.5" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="min-w-[150px] bg-card text-card-foreground border border-border rounded-[var(--radius)] p-1 z-[500] shadow-none">
                          <DropdownMenuItem
                            onClick={() => router.push(`/staff/schedule/${patient.id}`)}
                            className="text-[13px] font-medium px-3 py-2 text-foreground hover:bg-muted cursor-pointer rounded-[var(--radius)]"
                          >
                            View Schedule
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => router.push(`/staff/schedule/${patient.id}/mar`)}
                            className="text-[13px] font-medium px-3 py-2 text-foreground hover:bg-muted cursor-pointer rounded-[var(--radius)]"
                          >
                            MAR / Administer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center text-[13px] font-medium text-muted-foreground italic">
                      No patients found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile View Card List */}
        <div className="grid grid-cols-1 gap-5 md:hidden">
          {filtered.map((patient) => (
            <div key={patient.id} className="bg-card text-card-foreground p-5 rounded-[var(--radius)] border border-border shadow-none flex flex-col space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[15px] font-bold text-foreground leading-tight">{patient.name}</p>
                  <p className="text-[12px] font-medium text-muted-foreground mt-1">{patient.doctor}</p>
                </div>
                <span className={statusBadgeClass(patient.status)}>
                  {patient.status}
                </span>
              </div>
              <div className="pt-3 border-t border-border flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-medium text-muted-foreground leading-tight">Next due dose</p>
                  <p className="text-[13px] font-medium text-foreground mt-0.5">{patient.dose}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="p-2 hover:bg-muted rounded-[var(--radius)] transition-all inline-flex text-foreground shadow-none shrink-0"
                      title="Actions"
                    >
                      <MoreVertical className="w-4.5 h-4.5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-[150px] bg-card text-card-foreground border border-border rounded-[var(--radius)] p-1 z-[500] shadow-none">
                    <DropdownMenuItem
                      onClick={() => router.push(`/staff/schedule/${patient.id}`)}
                      className="text-[13px] font-medium px-3 py-2 text-foreground hover:bg-muted cursor-pointer rounded-[var(--radius)]"
                    >
                      View Schedule
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => router.push(`/staff/schedule/${patient.id}/mar`)}
                      className="text-[13px] font-medium px-3 py-2 text-foreground hover:bg-muted cursor-pointer rounded-[var(--radius)]"
                    >
                      MAR / Administer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
