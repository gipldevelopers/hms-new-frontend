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
import { useRouter } from "next/navigation";
import { useEffect, use } from "react";
import { Activity } from "lucide-react";
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

const recordedByOptions = [
  { label: "Sarah Jenkins, RN", value: "sarah" },
  { label: "Mike Ross, RN",     value: "mike"  },
  { label: "Jessica Lee, NP",   value: "jessica" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PatientVitalsHistoryPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const patientId = resolvedParams?.patientId || "";

  const [patient, setPatient] = useState(null);
  const [vitalsHistory, setVitalsHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patientId) return;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authtoken");
        const headers = { Authorization: `Bearer ${token}` };
        
        // Fetch patient
        const patRes = await fetch(`/api/patients/${patientId}`, { headers });
        const patData = await patRes.json();
        setPatient(patData);

        // Fetch vitals
        const vitRes = await fetch(`/api/vitals/patient/${patientId}`, { headers });
        const vitData = await vitRes.json();
        
        if (Array.isArray(vitData)) {
          const mapped = vitData.map(v => ({
            id: v.id,
            dateLabel: new Date(v.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            time: new Date(v.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            bp: `${v.systolic || 0}/${v.diastolic || 0}`,
            bpStatus: (v.systolic > 140 || v.diastolic > 90 || v.systolic < 90 || v.diastolic < 60) ? "critical" : "normal",
            hr: v.heartRate || "--",
            spo2: v.spo2 ? `${v.spo2}%` : "--",
            spo2Status: v.spo2 < 95 ? "critical" : "normal",
            temp: v.temperature ? `${v.temperature} °C` : "--",
            resp: v.respiratoryRate || "--",
            pain: v.painLevel || "0",
            recordedBy: v.recordedBy || "Staff",
            notes: v.notes
          }));
          setVitalsHistory(mapped);
        } else {
          setVitalsHistory([]);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [patientId]);

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

  const uhid = patient?.id ? `UHID-${patient.id.toString().substring(0, 6).toUpperCase()}` : "Loading...";
  const bedName = patient?.admissions?.[0]?.bed?.label || "No Bed";

  return (
    <div className="p-4 md:p-6 bg-background min-h-screen flex flex-col space-y-[15px] md:space-y-[20px] transition-colors duration-300 font-sans pb-20">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Back + Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-muted rounded-lg transition-colors border border-transparent hover:border-border shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-[18px] md:text-[22px] font-bold text-foreground tracking-tight leading-tight">
              {patient?.name || "Patient"} – Vitals History
            </h1>
            <p className="text-[12px] text-muted-foreground font-medium mt-0.5">
              {bedName} • {uhid}
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
            onClick={() => router.push(`/staff/vitals/${patientId}/entry?from=vitals`)}
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

        {loading && (
          <div className="p-10 flex justify-center text-muted-foreground bg-card rounded-lg border border-border shadow-none">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mr-3"></div> Loading...
          </div>
        )}
        
        {!loading && filtered.length === 0 && (
          <div className="p-10 flex justify-center items-center flex-col text-muted-foreground bg-card rounded-lg border border-border shadow-none">
             <Activity className="w-10 h-10 mb-2 opacity-50" />
             <p className="font-medium text-sm">No vitals recorded yet</p>
          </div>
        )}

        {/* ── Mobile Card View ── */}
        {!loading && filtered.length > 0 && (
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
                    onClick={() => router.push(`/staff/vitals/${patientId}/entry?mode=edit&entryId=${v.id}&from=vitals`)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <Pencil className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => router.push(`/staff/vitals/${patientId}/entry?mode=view&entryId=${v.id}&from=vitals`)}
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
        )}

        {/* ── Desktop Table View ── */}
        {!loading && filtered.length > 0 && (
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
                          onClick={() => router.push(`/staff/vitals/${patientId}/entry?mode=edit&entryId=${v.id}&from=vitals`)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                          title="Edit entry"
                        >
                          <Pencil className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => router.push(`/staff/vitals/${patientId}/entry?mode=view&entryId=${v.id}&from=vitals`)}
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
        )}
      </div>
    </div>
  );
}
