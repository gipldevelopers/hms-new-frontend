"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  Search,
  ChevronDown,
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  ArrowRight,
  Bell,
  X,
  RefreshCw,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

function getAuthHeaders() {
  const token = localStorage.getItem("authtoken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function CustomSelect({ value, onChange, options, placeholder, minWidth = "100px" }) {
  const selected = options.find((o) => o.value === value);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="h-10 px-4 bg-card border border-border rounded-lg flex items-center justify-between gap-2 text-[13px] font-medium outline-none transition-all shadow-none w-full"
          style={{ minWidth }}
        >
          <span className="truncate text-foreground">{selected ? selected.label : placeholder}</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[120px] border border-border bg-card p-1 rounded-lg shadow-none z-50"
      >
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

function CallNextModal({ onClose, currentPatient, nextPatient, onConfirm }) {
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 300);
  };

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
    handleClose();
  };

  useEffect(() => {
    setMounted(true);
    const handleEsc = (e) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", handleEsc);
    const orig = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = orig;
    };
  }, []);

  if (!mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className={cn(
          "absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300",
          closing ? "animate-out fade-out" : "animate-in fade-in"
        )}
        onClick={handleClose}
      />
      <div
        className={cn(
          "relative bg-card w-full max-w-[440px] rounded-lg border border-border flex flex-col p-8 items-center text-center duration-300 shadow-none z-10",
          closing ? "animate-out zoom-out-95 fade-out" : "animate-in zoom-in-95 fade-in"
        )}
      >
        <div className="relative mb-6">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
            <Bell className="w-8 h-8 text-primary dark:text-foreground" />
          </div>
          <div className="absolute top-0 right-0 w-4 h-4 bg-destructive border-2 border-card rounded-full" />
        </div>
        <h2 className="text-[20px] font-bold text-foreground mb-3">Call Next Patient?</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-8 px-4">
          {currentPatient ? (
            <>
              This will mark{" "}
              <span className="font-bold text-foreground">
                ({currentPatient.tokenNumber}: {currentPatient.patient?.name})
              </span>{" "}
              as completed
              {nextPatient ? (
                <>
                  {" "}and call{" "}
                  <span className="font-bold text-foreground">
                    ({nextPatient.tokenNumber}: {nextPatient.patient?.name})
                  </span>
                  .
                </>
              ) : (
                ". No more patients in queue."
              )}
            </>
          ) : (
            "No active patient in queue."
          )}
        </p>
        <div className="flex items-center gap-4 w-full">
          <button
            onClick={handleClose}
            className="flex-1 h-11 border border-border bg-card text-foreground rounded-lg text-[13px] font-bold hover:bg-muted transition-all outline-none"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading || !currentPatient}
            className="flex-1 h-11 bg-primary hover:opacity-95 text-primary-foreground rounded-lg text-[13px] font-bold flex items-center justify-center gap-2 transition-all shadow-none outline-none disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bell className="w-4 h-4" />}
            Call Next
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

function StatusBadge({ status }) {
  const map = {
    SCHEDULED:  { label: "Scheduled",   cls: "bg-blue-50 dark:bg-blue-500/10 text-blue-600" },
    CHECKED_IN: { label: "Checked In",  cls: "bg-amber-50 dark:bg-amber-500/10 text-amber-600" },
    WAITING:    { label: "Waiting",     cls: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600" },
    COMPLETED:  { label: "Completed",   cls: "bg-muted text-muted-foreground" },
    CANCELLED:  { label: "Cancelled",   cls: "bg-red-50 dark:bg-red-500/10 text-red-600" },
    NO_SHOW:    { label: "No Show",     cls: "bg-gray-50 dark:bg-gray-500/10 text-gray-500" },
  };
  const s = map[status] || { label: status, cls: "bg-muted text-muted-foreground" };
  return (
    <span className={cn("px-3 py-1 rounded-lg text-[10px] font-bold tracking-wider", s.cls)}>
      {s.label}
    </span>
  );
}

export default function OPDQueuePage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [patients, setPatients] = useState([]);
  const [stats, setStats] = useState({ total: 0, waiting: 0, inProgress: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCallNext, setShowCallNext] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (statusFilter !== "All") params.append("status", statusFilter);

      const [patientsRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/doctor-opd/patients?${params}`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE}/doctor-opd/stats`, { headers: getAuthHeaders() }),
      ]);

      if (!patientsRes.ok) throw new Error(`Failed to fetch patients: ${patientsRes.status}`);
      if (!statsRes.ok) throw new Error(`Failed to fetch stats: ${statsRes.status}`);

      const patientsData = await patientsRes.json();
      const statsData = await statsRes.json();

      setPatients(patientsData.success ? patientsData.data : []);
      setStats(statsData.success ? statsData.data : { total: 0, waiting: 0, inProgress: 0, completed: 0 });
    } catch (err) {
      console.error("Error fetching OPD data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => fetchData(), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const getWaitTime = (dateTime) => {
    if (!dateTime) return "—";
    const diff = Math.floor((Date.now() - new Date(dateTime)) / 60000);
    if (diff < 0) return "Upcoming";
    if (diff === 0) return "Just now";
    return `${diff} min${diff !== 1 ? "s" : ""}`;
  };

  // Find current in-progress and next waiting patient
  const inProgressPatient = patients.find((p) => p.status === "CHECKED_IN" || p.status === "WAITING");
  const nextPatient = patients.find(
    (p) => (p.status === "WAITING" || p.status === "SCHEDULED") && p.id !== inProgressPatient?.id
  );

  const handleCallNext = async () => {
    if (!inProgressPatient) return;
    try {
      await fetch(`${API_BASE}/appointments/${inProgressPatient.appointmentId}/status`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: "COMPLETED" }),
      });
      await fetchData();
    } catch (err) {
      console.error("Error calling next patient:", err);
    }
  };

  const STAT_CARDS = [
    { label: "Total Queue",  value: stats.total,      icon: Calendar,      color: "text-purple-600", bgColor: "bg-purple-600/10" },
    { label: "Waiting",      value: stats.waiting,    icon: Users,         color: "text-rose-600",   bgColor: "bg-rose-600/10" },
    { label: "In Progress",  value: stats.inProgress, icon: Clock,         color: "text-blue-600",   bgColor: "bg-blue-600/10" },
    { label: "Completed",    value: stats.completed,  icon: CheckCircle2,  color: "text-emerald-600",bgColor: "bg-emerald-600/10" },
  ];

  const STATUS_OPTIONS = [
    { label: "All",        value: "All" },
    { label: "Scheduled",  value: "SCHEDULED" },
    { label: "Checked In", value: "CHECKED_IN" },
    { label: "Waiting",    value: "WAITING" },
    { label: "Completed",  value: "COMPLETED" },
    { label: "Cancelled",  value: "CANCELLED" },
  ];

  return (
    <div className="p-5 bg-background min-h-screen flex flex-col gap-5 transition-colors duration-300 font-sans pb-20">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h1 className="text-[20px] font-bold text-foreground tracking-tight leading-none">
          OPD Queue / Tokens
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="h-11 px-4 bg-card border border-border text-foreground rounded-lg text-[13px] font-bold flex items-center gap-2 hover:bg-muted transition-all shadow-none outline-none"
          >
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            Refresh
          </button>
          <button
            onClick={() => setShowCallNext(true)}
            className="bg-primary hover:opacity-95 text-primary-foreground h-11 px-6 rounded-lg text-[13px] font-bold flex items-center justify-center gap-2 transition-all shadow-none w-full sm:w-auto outline-none"
          >
            Call Next Token <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {STAT_CARDS.map((stat, idx) => (
          <div
            key={idx}
            className="bg-card border border-border p-4 md:p-5 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between shadow-none transition-all"
          >
            <div className="flex flex-col gap-1">
              <div className={cn("p-2 rounded-lg w-fit", stat.bgColor)}>
                <stat.icon className={cn("w-5 h-5", stat.color)} />
              </div>
              <p className="text-[12px] md:text-[13px] font-medium text-muted-foreground mt-2">{stat.label}</p>
            </div>
            <p className="text-[24px] md:text-[32px] font-bold text-foreground leading-none mt-2 sm:mt-0">
              {loading ? "—" : String(stat.value).padStart(2, "0")}
            </p>
          </div>
        ))}
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-card border border-border p-3.5 rounded-lg shadow-none">
        <div className="relative flex-1 max-w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search patient, token..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-card border border-border rounded-lg text-[13px] font-medium outline-none focus:border-primary transition-all shadow-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex items-center gap-3">
          <CustomSelect
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="All Status"
            options={STATUS_OPTIONS}
            minWidth="130px"
          />
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
          <div>
            <p className="text-[13px] font-bold text-destructive">Failed to load OPD data</p>
            <p className="text-[12px] text-muted-foreground mt-0.5">{error}</p>
          </div>
          <button
            onClick={fetchData}
            className="ml-auto text-[12px] font-bold text-primary hover:underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden md:block bg-card border border-border rounded-lg overflow-hidden shadow-none">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b border-border uppercase tracking-wider text-[11px] font-bold text-muted-foreground">
              <th className="px-6 py-5">Token No.</th>
              <th className="px-6 py-5">Patient Name</th>
              <th className="px-6 py-5">Age / Gender</th>
              <th className="px-6 py-5">Doctor</th>
              <th className="px-6 py-5">Wait Time</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-6 py-5 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 bg-muted rounded w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : patients.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Users className="w-10 h-10 text-muted-foreground/30" />
                    <p className="text-[14px] font-bold text-muted-foreground">No patients in queue today</p>
                    <p className="text-[12px] text-muted-foreground/70">
                      Patients will appear here once appointments are booked and tokens are generated.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              patients.map((item) => (
                <tr key={item.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-4 text-[13px] font-bold text-foreground">
                    {item.token?.displayToken || item.tokenNumber || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-[13px] font-bold text-foreground">{item.patient?.name || "—"}</p>
                      {item.patient?.contact && (
                        <p className="text-[11px] text-muted-foreground mt-0.5">{item.patient.contact}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[13px] font-medium text-muted-foreground">
                    {item.patient?.age ? `${item.patient.age} yrs` : "—"}
                    {item.patient?.gender ? ` / ${item.patient.gender.charAt(0)}` : ""}
                  </td>
                  <td className="px-6 py-4 text-[13px] font-medium text-muted-foreground">
                    {item.doctorName || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      {item.status === "COMPLETED" ? "Done" : getWaitTime(item.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      {item.status === "COMPLETED" ? (
                        <span className="text-[12px] font-medium text-muted-foreground">Completed</span>
                      ) : (
                        <button
                          onClick={() => router.push(`/doctor/opd/${item.appointmentId}`)}
                          className="h-9 px-6 bg-card border border-border rounded-lg text-[12px] font-bold text-foreground hover:bg-muted transition-all shadow-none outline-none"
                        >
                          Consult
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-card border border-border p-5 rounded-lg animate-pulse space-y-3">
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/3" />
            </div>
          ))
        ) : patients.length === 0 ? (
          <div className="bg-card border border-border p-10 rounded-lg flex flex-col items-center gap-3">
            <Users className="w-10 h-10 text-muted-foreground/30" />
            <p className="text-[14px] font-bold text-muted-foreground text-center">No patients in queue today</p>
          </div>
        ) : (
          patients.map((item) => (
            <div key={item.id} className="bg-card border border-border p-5 rounded-lg space-y-4 shadow-none">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider leading-none mb-1.5">
                    Token: {item.token?.displayToken || item.tokenNumber || "—"}
                  </p>
                  <h3 className="text-[16px] font-bold text-foreground leading-tight">
                    {item.patient?.name || "—"}
                  </h3>
                  <p className="text-[12px] font-medium text-muted-foreground mt-1">
                    {item.patient?.age ? `${item.patient.age} yrs` : ""}
                    {item.patient?.gender ? ` / ${item.patient.gender}` : ""}
                  </p>
                  {item.doctorName && (
                    <p className="text-[12px] text-muted-foreground mt-0.5">{item.doctorName}</p>
                  )}
                </div>
                <StatusBadge status={item.status} />
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  {item.status === "COMPLETED" ? "Done" : getWaitTime(item.createdAt)}
                </div>
                {item.status === "COMPLETED" ? (
                  <span className="text-[12px] font-medium text-muted-foreground italic">Completed</span>
                ) : (
                  <button
                    onClick={() => router.push(`/doctor/opd/${item.appointmentId}`)}
                    className="h-9 px-5 bg-primary text-primary-foreground rounded-lg text-[12px] font-bold shadow-none outline-none"
                  >
                    Consult
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {showCallNext && (
        <CallNextModal
          onClose={() => setShowCallNext(false)}
          currentPatient={inProgressPatient}
          nextPatient={nextPatient}
          onConfirm={handleCallNext}
        />
      )}
    </div>
  );
}
