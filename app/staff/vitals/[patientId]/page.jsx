"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Search,
  ChevronDown,
  Pencil,
  Eye,
  Download,
  Plus,
  AlertTriangle,
  Check,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, useParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ─── CustomSelect ─────────────────────────────────────────────────────────────
function CustomSelect({ value, onChange, options, placeholder, minWidth = "140px" }) {
  const selected = options.find((o) => o.value === value);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="h-11 px-5 bg-muted/50 border border-border rounded-lg text-[13px] font-bold text-foreground flex items-center justify-between gap-3 hover:bg-muted transition-all outline-none w-full sm:w-auto"
          style={{ minWidth }}
        >
          <span className="truncate">{selected ? selected.label : placeholder}</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[calc(100vw-48px)] sm:w-[var(--radix-dropdown-menu-trigger-width)] sm:min-w-[140px] border-border shadow-xl rounded-lg p-1 z-[500]"
      >
        <DropdownMenuItem
          onClick={() => onChange("")}
          className={cn(
            "rounded-lg text-[12px] font-medium px-3 py-2 cursor-pointer transition-colors",
            !value ? "bg-primary/5 text-primary font-bold" : "text-muted-foreground hover:bg-muted"
          )}
        >
          All
        </DropdownMenuItem>
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-lg text-[12px] font-medium px-3 py-2 cursor-pointer transition-colors",
              value === opt.value
                ? "bg-primary/5 text-primary font-bold"
                : "text-muted-foreground hover:bg-muted"
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

// ─── DateRangeSelect ──────────────────────────────────────────────────────────
function DateRangeSelect({ value, onChange }) {
  const options = ["Today", "Last 7 Days", "Last 30 Days", "All Time"];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="h-10 px-4 bg-card border border-border rounded-lg text-[13px] font-bold text-foreground flex items-center gap-2 hover:bg-muted transition-all outline-none"
        >
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span>{value}</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[160px] border-border shadow-xl rounded-lg p-1 z-[500]"
      >
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt}
            onClick={() => onChange(opt)}
            className={cn(
              "rounded-lg text-[12px] font-medium px-3 py-2 cursor-pointer transition-colors",
              value === opt
                ? "bg-primary/5 text-primary font-bold"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            {opt}
            {value === opt && <Check className="w-3.5 h-3.5 ml-auto text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const patientMap = {
  1:  { name: "Rajesh Kumar",       bed: "Bed 402-B", mrn: "MRN: 987654321" },
  2:  { name: "Mrs. Joseph Thiel",  bed: "Bed 201-A", mrn: "MRN: 123456789" },
  3:  { name: "Ada Rempel",         bed: "Bed 305-C", mrn: "MRN: 234567890" },
  4:  { name: "Alfonso Stiedemann", bed: "Bed 110-D", mrn: "MRN: 345678901" },
  5:  { name: "Dianna Sanford",     bed: "Bed 220-B", mrn: "MRN: 456789012" },
  6:  { name: "Marcus Reed",        bed: "Bed 315-A", mrn: "MRN: 567890123" },
  7:  { name: "Amelia Zhao",        bed: "Bed 408-C", mrn: "MRN: 678901234" },
  8:  { name: "Jason Patel",        bed: "Bed 502-B", mrn: "MRN: 789012345" },
  9:  { name: "Sofia Martinez",     bed: "Bed 601-A", mrn: "MRN: 890123456" },
  10: { name: "Liam Johnson",       bed: "Bed 703-D", mrn: "MRN: 901234567" },
  11: { name: "Ella Thompson",      bed: "Bed 804-C", mrn: "MRN: 012345678" },
};

const vitalsHistory = [
  { id: 1, dateLabel: "Today",     time: "10:45 AM", bp: "185/115", bpStatus: "critical", hr: 88, spo2: "86%",  spo2Status: "critical", temp: "37.2 °C", resp: 22, pain: 4, recordedBy: "Sarah Jenkins, RN", notes: "Notes attached" },
  { id: 2, dateLabel: "Today",     time: "08:00 AM", bp: "120/80",  bpStatus: "normal",   hr: 72, spo2: "98%",  spo2Status: "normal",   temp: "36.8 °C", resp: 16, pain: 2, recordedBy: "Sarah Jenkins, RN", notes: null },
  { id: 3, dateLabel: "Yesterday", time: "10:00 PM", bp: "118/76",  bpStatus: "normal",   hr: 68, spo2: "99%",  spo2Status: "normal",   temp: "36.9 °C", resp: 14, pain: 0, recordedBy: "Mike Ross, RN",     notes: null },
  { id: 4, dateLabel: "Yesterday", time: "02:00 PM", bp: "135/88",  bpStatus: "normal",   hr: 75, spo2: "97%",  spo2Status: "normal",   temp: "37.1 °C", resp: 18, pain: 1, recordedBy: "Mike Ross, RN",     notes: null },
  { id: 5, dateLabel: "Yesterday", time: "08:00 AM", bp: "122/82",  bpStatus: "normal",   hr: 70, spo2: "98%",  spo2Status: "normal",   temp: "36.7 °C", resp: 16, pain: 0, recordedBy: "Sarah Jenkins, RN", notes: null },
];

const recordedByOptions = [
  { label: "Sarah Jenkins, RN", value: "sarah" },
  { label: "Mike Ross, RN",     value: "mike"  },
  { label: "Jessica Lee, NP",   value: "jessica" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PatientVitalsHistoryPage() {
  const router    = useRouter();
  const params    = useParams();
  const patientId = params?.patientId || "1";
  const patient   = patientMap[patientId] || patientMap[1];

  const [searchQuery,      setSearchQuery]      = useState("");
  const [dateFilter,       setDateFilter]       = useState("Last 7 Days");
  const [statusFilter,     setStatusFilter]     = useState("");
  const [recordedByFilter, setRecordedByFilter] = useState("");

  const statusOptions = [
    { label: "Critical", value: "critical" },
    { label: "Normal",   value: "normal"   },
  ];

  const filtered = vitalsHistory.filter((v) => {
    const matchSearch =
      v.recordedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.bp.includes(searchQuery) ||
      v.dateLabel.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus =
      !statusFilter || v.bpStatus === statusFilter || v.spo2Status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-4 md:p-6 bg-background min-h-screen flex flex-col space-y-[15px] md:space-y-[20px] transition-colors duration-300 font-sans pb-20">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Back + Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/staff/vitals")}
            className="p-2 hover:bg-muted rounded-lg transition-colors border border-transparent hover:border-border shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-[18px] md:text-[22px] font-bold text-foreground tracking-tight leading-tight">
              {patient.name} – Vitals History
            </h1>
            <p className="text-[12px] text-muted-foreground font-medium mt-0.5">
              {patient.bed} • {patient.mrn}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          <DateRangeSelect value={dateFilter} onChange={setDateFilter} />

          <button className="h-10 px-4 bg-card border border-border rounded-lg text-[13px] font-bold text-foreground flex items-center gap-2 hover:bg-muted transition-all outline-none">
            <Download className="w-4 h-4 text-muted-foreground" />
            Export
          </button>

          <button
            onClick={() => router.push(`/staff/vitals/${patientId}/entry`)}
            className="h-10 px-4 bg-primary text-primary-foreground rounded-lg text-[13px] font-bold flex items-center gap-2 hover:bg-primary/90 transition-all outline-none whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            New Entry
          </button>
        </div>
      </div>

      {/* ── Filter Bar + Table ── */}
      <div className="space-y-[15px] md:space-y-[20px]">

        {/* Filter Bar */}
        <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-4 bg-card p-3 rounded-lg border border-border shadow-none">
          <div className="relative w-full xl:w-[380px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full h-11 pl-11 pr-4 bg-muted/50 border border-border rounded-lg text-[13px] font-semibold focus:border-primary transition-all outline-none text-foreground placeholder:font-medium placeholder:text-muted-foreground"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <CustomSelect
              value={statusFilter}
              onChange={setStatusFilter}
              options={statusOptions}
              placeholder="All"
              minWidth="140px"
            />
            <CustomSelect
              value={recordedByFilter}
              onChange={setRecordedByFilter}
              options={recordedByOptions}
              placeholder="All"
              minWidth="140px"
            />
          </div>
        </div>

        {/* ── Mobile Card View ── */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {filtered.map((v) => (
            <div
              key={v.id}
              className="bg-card p-5 rounded-lg border border-border"
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[15px] font-bold text-foreground leading-tight">{v.dateLabel}</p>
                  <p className="text-[12px] text-muted-foreground font-medium mt-0.5">{v.time}</p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => router.push(`/staff/vitals/${patientId}/entry?mode=edit&entryId=${v.id}`)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <Pencil className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => router.push(`/staff/vitals/${patientId}/entry?mode=view&entryId=${v.id}`)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4 text-primary" />
                  </button>
                </div>
              </div>

              {/* Vitals Grid */}
              <div className="grid grid-cols-3 gap-x-4 gap-y-3 mb-4">
                {[
                  { label: "BP",   value: v.bp,   status: v.bpStatus   },
                  { label: "HR",   value: v.hr,   status: "normal"     },
                  { label: "SpO2", value: v.spo2, status: v.spo2Status },
                  { label: "Temp", value: v.temp, status: "normal"     },
                  { label: "Resp", value: v.resp, status: "normal"     },
                  { label: "Pain", value: v.pain, status: "normal"     },
                ].map(({ label, value, status }) => (
                  <div key={label}>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
                    <p className={cn(
                      "text-[13px] font-bold",
                      status === "critical" && "text-destructive",
                      status === "normal"   && "text-foreground"
                    )}>
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-border">
                <p className="text-[11px] font-medium text-muted-foreground">{v.recordedBy}</p>
                {v.notes && <p className="text-[10px] text-muted-foreground italic mt-0.5">{v.notes}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* ── Desktop Table View ── */}
        <div className="hidden md:block bg-card rounded-lg border border-border shadow-none overflow-hidden">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted/50">
                  {["Date & Time", "BP (mmHg)", "HR", "SpO2", "Temp", "Resp", "Pain", "Recorded By", "Actions"].map((col, i) => (
                    <th
                      key={i}
                      className={cn(
                        "px-8 py-4 text-[11px] font-bold text-muted-foreground border-b border-border uppercase tracking-widest",
                        i === 8 ? "text-center" : "text-left"
                      )}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((v) => (
                  <tr key={v.id} className="hover:bg-muted transition-all">

                    {/* Date & Time */}
                    <td className="px-8 py-5">
                      <p className="text-[14px] font-bold text-foreground leading-tight">{v.dateLabel}</p>
                      <p className="text-[12px] text-muted-foreground font-medium mt-0.5">{v.time}</p>
                    </td>

                    {/* BP */}
                    <td className="px-8 py-5">
                      {v.bpStatus === "critical" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-[12px] font-bold">
                          <AlertTriangle className="w-3 h-3 shrink-0" />{v.bp}
                        </span>
                      ) : (
                        <span className="text-[14px] font-medium text-foreground">{v.bp}</span>
                      )}
                    </td>

                    {/* HR */}
                    <td className="px-8 py-5">
                      <span className="text-[14px] font-medium text-foreground">{v.hr}</span>
                    </td>

                    {/* SpO2 */}
                    <td className="px-8 py-5">
                      {v.spo2Status === "critical" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-[12px] font-bold">
                          ↓ {v.spo2}
                        </span>
                      ) : (
                        <span className="text-[14px] font-medium text-foreground">{v.spo2}</span>
                      )}
                    </td>

                    {/* Temp */}
                    <td className="px-8 py-5">
                      <span className="text-[14px] font-medium text-foreground">{v.temp}</span>
                    </td>

                    {/* Resp */}
                    <td className="px-8 py-5">
                      <span className="text-[14px] font-medium text-foreground">{v.resp}</span>
                    </td>

                    {/* Pain */}
                    <td className="px-8 py-5">
                      <span className="text-[14px] font-medium text-foreground">{v.pain}</span>
                    </td>

                    {/* Recorded By */}
                    <td className="px-8 py-5">
                      <p className="text-[13px] font-medium text-foreground leading-tight">{v.recordedBy}</p>
                      {v.notes && (
                        <p className="text-[11px] text-muted-foreground font-medium mt-0.5 italic">{v.notes}</p>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => router.push(`/staff/vitals/${patientId}/entry?mode=edit&entryId=${v.id}`)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                          title="Edit entry"
                        >
                          <Pencil className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => router.push(`/staff/vitals/${patientId}/entry?mode=view&entryId=${v.id}`)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                          title="View entry"
                        >
                          <Eye className="w-5 h-5 text-primary" />
                        </button>
                      </div>
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
