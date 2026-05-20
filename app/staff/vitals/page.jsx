"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  Eye,
  Activity,
  AlertTriangle,
  TrendingUp,
  Clock,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ─── Reusable CustomSelect (matches admissions pattern) ───────────────────────
function CustomSelect({ value, onChange, options, placeholder, minWidth = "140px" }) {
  const selected = options.find((o) => o.value === value);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="h-11 px-5 bg-card border border-border rounded-lg text-[13px] font-bold text-foreground flex items-center justify-between gap-3 hover:bg-muted transition-all outline-none w-full sm:w-auto shadow-none"
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

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="bg-card p-5 rounded-lg border border-border flex items-center gap-4 shadow-none">
      <div
        className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center shrink-0",
          color === "blue"    && "bg-primary/10 text-primary",
          color === "red"     && "bg-destructive/10 text-destructive",
          color === "amber"   && "bg-amber-500/10 text-amber-500",
          color === "emerald" && "bg-emerald-500/10 text-emerald-500"
        )}
      >
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-[10px] md:text-[11px] font-bold text-muted-foreground leading-none mb-1.5 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-[18px] md:text-[20px] font-bold text-foreground leading-none">
          {value}
        </p>
      </div>
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const vitalsData = [
  { id: 1,  name: "Rajesh Kumar",       bp: "185/115", bpStatus: "critical", hr: 88, spo2: "86%",  spo2Status: "critical", temp: "37.2 °C", resp: 22, pain: 4, recordedBy: "Sarah Jenkins, RN", notes: true  },
  { id: 2,  name: "Mrs. Joseph Thiel",  bp: "120/80",  bpStatus: "normal",   hr: 72, spo2: "98%",  spo2Status: "normal",   temp: "36.8 °C", resp: 16, pain: 2, recordedBy: "Sarah Jenkins, RN", notes: false },
  { id: 3,  name: "Ada Rempel",         bp: "118/76",  bpStatus: "normal",   hr: 68, spo2: "99%",  spo2Status: "normal",   temp: "36.9 °C", resp: 14, pain: 0, recordedBy: "Mike Ross, RN",     notes: false },
  { id: 4,  name: "Alfonso Stiedemann", bp: "135/88",  bpStatus: "normal",   hr: 75, spo2: "97%",  spo2Status: "normal",   temp: "37.1 °C", resp: 18, pain: 1, recordedBy: "Mike Ross, RN",     notes: false },
  { id: 5,  name: "Dianna Sanford",     bp: "122/82",  bpStatus: "normal",   hr: 70, spo2: "98%",  spo2Status: "normal",   temp: "36.7 °C", resp: 16, pain: 0, recordedBy: "Sarah Jenkins, RN", notes: false },
  { id: 6,  name: "Marcus Reed",        bp: "130/85",  bpStatus: "normal",   hr: 75, spo2: "95%",  spo2Status: "normal",   temp: "37.1 °C", resp: 22, pain: 0, recordedBy: "Jessica Lee, NP",   notes: false },
  { id: 7,  name: "Amelia Zhao",        bp: "118/76",  bpStatus: "normal",   hr: 68, spo2: "97%",  spo2Status: "normal",   temp: "36.5 °C", resp: 18, pain: 1, recordedBy: "David Kim, PA",     notes: false },
  { id: 8,  name: "Jason Patel",        bp: "140/90",  bpStatus: "abnormal", hr: 80, spo2: "92%",  spo2Status: "abnormal", temp: "38.0 °C", resp: 25, pain: 0, recordedBy: "Emily Tran, RN",    notes: false },
  { id: 9,  name: "Sofia Martinez",     bp: "128/84",  bpStatus: "normal",   hr: 72, spo2: "96%",  spo2Status: "normal",   temp: "37.3 °C", resp: 20, pain: 0, recordedBy: "Michael Chen, MD",  notes: false },
  { id: 10, name: "Liam Johnson",       bp: "135/88",  bpStatus: "normal",   hr: 74, spo2: "94%",  spo2Status: "normal",   temp: "36.8 °C", resp: 19, pain: 2, recordedBy: "Rachel Green, NP",  notes: false },
  { id: 11, name: "Ella Thompson",      bp: "125/80",  bpStatus: "normal",   hr: 71, spo2: "93%",  spo2Status: "normal",   temp: "36.8 °C", resp: 21, pain: 1, recordedBy: "Tommy Brooks, RN",  notes: false },
];

const statusOptions = [
  { label: "Critical", value: "critical" },
  { label: "Abnormal", value: "abnormal" },
  { label: "Normal",   value: "normal"   },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function VitalsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery]   = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [wardFilter, setWardFilter]     = useState("");
  const [wardOptions, setWardOptions]   = useState([]);
  const [history, setHistory]           = useState([]);
  const [stats, setStats]               = useState({ totalPatients: 0, critical: 0, abnormal: 0, overdue: 0 });
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const token = localStorage.getItem("authtoken");
        const res = await fetch("/api/vitals/filters", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setWardOptions(data.wards || []);
        }
      } catch (e) {
        console.error("Error fetching vitals filters:", e);
      }
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem("authtoken");
          const headers = { Authorization: `Bearer ${token}` };

          const params = new URLSearchParams();
          if (searchQuery) params.append("search", searchQuery);
          if (statusFilter) params.append("status", statusFilter);
          if (wardFilter) params.append("ward", wardFilter);

          const [overRes, statsRes] = await Promise.all([
            fetch(`/api/vitals/overview?${params.toString()}`, { headers }),
            fetch("/api/vitals/stats", { headers })
          ]);

          if (overRes.ok) {
            const overData = await overRes.json();
            setHistory(overData);
          }
          if (statsRes.ok) {
            const statsData = await statsRes.json();
            setStats(statsData);
          }
        } catch (e) {
          console.error("Error fetching vitals:", e);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, statusFilter, wardFilter]);

  const filtered = history;

  return (
    <div className="p-5 bg-background min-h-screen flex flex-col space-y-5 transition-colors duration-300 font-sans pb-20">

      {/* ── Header ── */}
      <div className="flex justify-between items-center">
        <h1 className="text-[20px] md:text-[24px] font-bold text-foreground tracking-tight leading-none">
          Vitals
        </h1>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard label="Total Patients" value={String(stats.totalPatients).padStart(2, '0')} icon={Activity}      color="blue"    />
        <StatCard label="Critical"       value={String(stats.critical).padStart(2, '0')} icon={AlertTriangle} color="red"     />
        <StatCard label="Abnormal"       value={String(stats.abnormal).padStart(2, '0')} icon={TrendingUp}    color="amber"   />
        <StatCard label="Overdue"        value={String(stats.overdue).padStart(2, '0')} icon={Clock}         color="emerald" />
      </div>

      {/* ── Filter Bar + Table ── */}
      <div className="space-y-[15px] md:space-y-[20px]">

        {/* Filter Bar */}
        <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-4 bg-card p-3 rounded-lg border border-border shadow-none">
          <div className="relative w-full xl:w-[380px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full h-11 pl-11 pr-4 bg-muted border border-border rounded-lg text-[13px] font-medium focus:border-primary transition-all outline-none text-foreground placeholder:text-muted-foreground shadow-none"
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
              value={wardFilter}
              onChange={setWardFilter}
              options={wardOptions}
              placeholder="All"
              minWidth="140px"
            />
          </div>
        </div>

        {/* ── Card Grid / Table View ── */}
        {loading ? (
          <div className="p-10 flex justify-center text-muted-foreground bg-card rounded-lg border border-border shadow-none">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mr-3"></div> Loading...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 flex justify-center items-center flex-col text-muted-foreground bg-card rounded-lg border border-border shadow-none">
            <Activity className="w-10 h-10 mb-2 opacity-50" />
            <p className="font-medium text-sm">No vitals recorded yet</p>
          </div>
        ) : (
          <>
            {/* ── Mobile Card View ── */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {filtered.map((v) => (
                <div
                  key={v.id}
                  className="bg-card p-5 rounded-lg border border-border active:scale-[0.98] transition-all shadow-none"
                >
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-[16px] font-bold text-foreground leading-tight">{v.name}</h3>
                    <button
                      onClick={() => router.push(`/staff/vitals/${v.id}`)}
                      className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 ml-2 shadow-none"
                    >
                      <Eye className="w-4 h-4 text-primary" />
                    </button>
                  </div>

                  {/* Vitals Grid */}
                  <div className="grid grid-cols-3 gap-x-4 gap-y-4 mb-4">
                    {[
                      { label: "BP",   value: v.bp,   status: v.bpStatus   },
                      { label: "HR",   value: v.hr,   status: "normal"     },
                      { label: "SpO2", value: v.spo2, status: v.spo2Status },
                      { label: "Temp", value: v.temp, status: "normal"     },
                      { label: "Resp", value: v.resp, status: "normal"     },
                      { label: "Pain", value: v.pain, status: "normal"     },
                    ].map(({ label, value, status }) => (
                      <div key={label}>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
                        <p className={cn(
                          "text-[13px] font-bold",
                          status === "critical" && "text-destructive",
                          status === "abnormal" && "text-amber-500",
                          status === "normal"   && "text-foreground"
                        )}>
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="pt-4 border-t border-border">
                    <p className="text-[12px] font-medium text-muted-foreground">{v.recordedBy}</p>
                    {v.notes && <p className="text-[11px] text-muted-foreground italic mt-0.5">Notes attached</p>}
                  </div>
                </div>
              ))}
            </div>

            {/* ── Desktop Table View ── */}
            <div className="hidden md:block bg-card rounded-lg border border-border shadow-none overflow-hidden">
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted/30">
                      {["PATIENT NAME", "BP (mmHg)", "HR", "SpO2", "Temp", "Resp", "Pain", "Recorded By", "Actions"].map((col, i) => (
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
                      <tr key={v.id} className="hover:bg-muted/30 transition-all">

                        {/* Patient Name */}
                        <td className="px-8 py-5">
                          <span className="text-[14px] font-bold text-foreground">{v.name}</span>
                        </td>

                        {/* BP */}
                        <td className="px-8 py-5">
                          {v.bpStatus === "critical" ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-[12px] font-bold">
                              <AlertTriangle className="w-3 h-3 shrink-0" />{v.bp}
                            </span>
                          ) : v.bpStatus === "abnormal" ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[12px] font-bold">
                              {v.bp}
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
                          ) : v.spo2Status === "abnormal" ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[12px] font-bold">
                              {v.spo2}
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
                            <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Notes attached</p>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-8 py-5 text-center">
                          <button
                            onClick={() => router.push(`/staff/vitals/${v.id}`)}
                            className="p-2 hover:bg-muted rounded-lg transition-colors inline-flex shadow-none"
                            title="View vitals history"
                          >
                            <Eye className="w-5 h-5 text-primary" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
