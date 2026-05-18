"use client";

import React from "react";
import {
  Search, Plus, Calendar, ChevronDown, CalendarDays,
  UserCheck, Clock, XCircle, UserX, X, Check, Loader2, RefreshCw,
  Ticket, Printer, Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

const STATUS_STYLE = {
  CHECKED_IN: "bg-[#E6F9F1] text-[#00A389]",
  WAITING:    "bg-[#FEF9EE] text-[#F59E0B]",
  SCHEDULED:  "bg-blue-50 text-blue-600",
  CANCELLED:  "bg-[#FFF1F1] text-red-500",
  NO_SHOW:    "bg-slate-100 text-slate-500",
  COMPLETED:  "bg-purple-50 text-purple-600",
};
const STATUS_LABEL = {
  CHECKED_IN: "Checked In", WAITING: "Waiting", SCHEDULED: "Scheduled",
  CANCELLED: "Cancelled", NO_SHOW: "No Show", COMPLETED: "Completed",
};

// ─── Print Preview Modal ──────────────────────────────────────────────────────
function PrintPreviewModal({ isOpen, onClose, appointment, formatTime }) {
  const printRef = React.useRef(null);

  React.useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    if (isOpen) window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [isOpen, onClose]);

  const handlePrint = () => {
    const printContent = printRef.current?.innerHTML;
    if (!printContent) return;

    const win = window.open("", "_blank", "width=800,height=600");
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Appointment Slip — ${appointment?.tokenNumber || ""}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Arial, sans-serif; background: #fff; color: #111; }
            .slip { width: 100%; max-width: 420px; margin: 0 auto; padding: 24px; }
            .header { text-align: center; border-bottom: 2px solid #3B4CB8; padding-bottom: 14px; margin-bottom: 16px; }
            .hospital-name { font-size: 18px; font-weight: 800; color: #3B4CB8; letter-spacing: 0.5px; }
            .slip-title { font-size: 11px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 1px; margin-top: 3px; }
            .token-box { background: #F5F7FF; border: 2px solid #3B4CB8; border-radius: 8px; padding: 16px; text-align: center; margin: 16px 0; }
            .token-label { font-size: 10px; font-weight: 700; color: #3B4CB8; text-transform: uppercase; letter-spacing: 1.5px; }
            .token-number { font-size: 52px; font-weight: 900; color: #3B4CB8; line-height: 1; margin: 4px 0; }
            .token-date { font-size: 11px; color: #666; }
            .section { margin-bottom: 14px; }
            .section-title { font-size: 9px; font-weight: 700; color: #999; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; border-bottom: 1px solid #eee; padding-bottom: 4px; }
            .row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 7px; }
            .row-label { font-size: 11px; color: #666; font-weight: 500; }
            .row-value { font-size: 12px; color: #111; font-weight: 700; text-align: right; max-width: 60%; }
            .status-badge { display: inline-block; padding: 2px 10px; border-radius: 4px; font-size: 11px; font-weight: 700; }
            .status-SCHEDULED  { background: #EFF6FF; color: #2563EB; }
            .status-CHECKED_IN { background: #ECFDF5; color: #059669; }
            .status-WAITING    { background: #FFFBEB; color: #D97706; }
            .status-COMPLETED  { background: #F5F3FF; color: #7C3AED; }
            .status-CANCELLED  { background: #FEF2F2; color: #DC2626; }
            .status-NO_SHOW    { background: #F1F5F9; color: #64748B; }
            .footer { margin-top: 20px; padding-top: 12px; border-top: 1px dashed #ccc; text-align: center; }
            .footer p { font-size: 10px; color: #999; line-height: 1.6; }
            .barcode-placeholder { margin: 12px auto 0; width: 160px; height: 36px; background: repeating-linear-gradient(90deg, #111 0px, #111 2px, #fff 2px, #fff 5px); border-radius: 2px; opacity: 0.15; }
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              @page { margin: 10mm; size: A5 portrait; }
            }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 300);
  };

  if (!isOpen || !appointment) return null;

  const a = appointment;
  const apptDate = a.dateTime ? new Date(a.dateTime) : null;
  const dateStr = apptDate
    ? apptDate.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "—";
  const timeStr = formatTime(a.dateTime);
  const printedAt = new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-[3px]">
      <div className="bg-card border border-border rounded-[8px] w-full max-w-[560px] overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">

        {/* Modal header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-primary" />
            <h2 className="text-[15px] font-bold text-foreground">Print Preview</h2>
            <span className="text-[11px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-[3px]">
              {a.tokenNumber || "No Token"}
            </span>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-all">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Preview area */}
        <div className="overflow-y-auto flex-1 p-6 bg-muted/20">
          {/* Paper shadow wrapper */}
          <div className="bg-white rounded-[6px] shadow-[0_4px_24px_rgba(0,0,0,0.12)] mx-auto" style={{ maxWidth: 420 }}>
            <div ref={printRef}>
              <div className="slip" style={{ padding: 24 }}>

                {/* Header */}
                <div className="header" style={{ textAlign: "center", borderBottom: "2px solid #3B4CB8", paddingBottom: 14, marginBottom: 16 }}>
                  <div className="hospital-name" style={{ fontSize: 18, fontWeight: 800, color: "#3B4CB8" }}>
                    Hospital Management System
                  </div>
                  <div className="slip-title" style={{ fontSize: 11, fontWeight: 600, color: "#666", textTransform: "uppercase", letterSpacing: 1, marginTop: 3 }}>
                    OPD Appointment Slip
                  </div>
                </div>

                {/* Token box */}
                <div className="token-box" style={{ background: "#F5F7FF", border: "2px solid #3B4CB8", borderRadius: 8, padding: 16, textAlign: "center", margin: "16px 0" }}>
                  <div className="token-label" style={{ fontSize: 10, fontWeight: 700, color: "#3B4CB8", textTransform: "uppercase", letterSpacing: 1.5 }}>
                    Token Number
                  </div>
                  <div className="token-number" style={{ fontSize: 52, fontWeight: 900, color: "#3B4CB8", lineHeight: 1, margin: "4px 0" }}>
                    {a.tokenNumber || "—"}
                  </div>
                  <div className="token-date" style={{ fontSize: 11, color: "#666" }}>{dateStr}</div>
                </div>

                {/* Patient info */}
                <div className="section" style={{ marginBottom: 14 }}>
                  <div className="section-title" style={{ fontSize: 9, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, borderBottom: "1px solid #eee", paddingBottom: 4 }}>
                    Patient Details
                  </div>
                  {[
                    ["Patient Name", a.patient?.name || "—"],
                    ["Contact",      a.patient?.contact || "—"],
                    ["Age / Gender", [a.patient?.age ? `${a.patient.age} yrs` : null, a.patient?.gender].filter(Boolean).join(" · ") || "—"],
                  ].map(([label, value]) => (
                    <div key={label} className="row" style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                      <span className="row-label" style={{ fontSize: 11, color: "#666", fontWeight: 500 }}>{label}</span>
                      <span className="row-value" style={{ fontSize: 12, color: "#111", fontWeight: 700, textAlign: "right" }}>{value}</span>
                    </div>
                  ))}
                </div>

                {/* Appointment info */}
                <div className="section" style={{ marginBottom: 14 }}>
                  <div className="section-title" style={{ fontSize: 9, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, borderBottom: "1px solid #eee", paddingBottom: 4 }}>
                    Appointment Details
                  </div>
                  {[
                    ["Department", a.departmentName || "—"],
                    ["Doctor",     a.doctorName     || "—"],
                    ["Date",       dateStr],
                    ["Time",       timeStr],
                  ].map(([label, value]) => (
                    <div key={label} className="row" style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                      <span className="row-label" style={{ fontSize: 11, color: "#666", fontWeight: 500 }}>{label}</span>
                      <span className="row-value" style={{ fontSize: 12, color: "#111", fontWeight: 700, textAlign: "right", maxWidth: "60%" }}>{value}</span>
                    </div>
                  ))}
                  <div className="row" style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                    <span className="row-label" style={{ fontSize: 11, color: "#666", fontWeight: 500 }}>Status</span>
                    <span className={`status-badge status-${a.status}`} style={{
                      display: "inline-block", padding: "2px 10px", borderRadius: 4, fontSize: 11, fontWeight: 700,
                      background: a.status === "SCHEDULED" ? "#EFF6FF" : a.status === "CHECKED_IN" ? "#ECFDF5" : a.status === "WAITING" ? "#FFFBEB" : "#F1F5F9",
                      color: a.status === "SCHEDULED" ? "#2563EB" : a.status === "CHECKED_IN" ? "#059669" : a.status === "WAITING" ? "#D97706" : "#64748B",
                    }}>
                      {STATUS_LABEL[a.status] || a.status}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="footer" style={{ marginTop: 20, paddingTop: 12, borderTop: "1px dashed #ccc", textAlign: "center" }}>
                  <div className="barcode-placeholder" style={{ margin: "0 auto 10px", width: 160, height: 36, background: "repeating-linear-gradient(90deg, #111 0px, #111 2px, #fff 2px, #fff 5px)", borderRadius: 2, opacity: 0.15 }} />
                  <p style={{ fontSize: 10, color: "#999", lineHeight: 1.6 }}>
                    Please arrive 10 minutes before your scheduled time.<br />
                    Carry this slip and a valid ID proof.<br />
                    <span style={{ color: "#bbb" }}>Printed: {printedAt}</span>
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-border shrink-0 bg-card">
          <p className="text-[11px] text-muted-foreground">
            Slip for <strong className="text-foreground">{a.patient?.name}</strong> · {timeStr}
          </p>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="h-9 px-5 border border-border rounded-[5px] text-[12px] font-bold text-foreground hover:bg-muted transition-all">
              Close
            </button>
            <button
              onClick={handlePrint}
              className="h-9 px-5 bg-primary text-white rounded-[5px] text-[12px] font-bold flex items-center gap-2 hover:opacity-90 transition-all"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OPDAppointments() {
  const router = useRouter();
  const [appointments, setAppointments] = React.useState([]);
  const [stats, setStats]               = React.useState(null);
  const [departments, setDepartments]   = React.useState([]);
  const [doctors, setDoctors]           = React.useState([]);
  const [loading, setLoading]           = React.useState(true);
  const [searchInput, setSearchInput]   = React.useState("");
  const [search, setSearch]             = React.useState("");
  const [deptFilter, setDeptFilter]     = React.useState("All");
  const [statusFilter, setStatusFilter] = React.useState("All");
  const [isRescheduleOpen, setIsRescheduleOpen] = React.useState(false);
  const [isCancelOpen, setIsCancelOpen]         = React.useState(false);
  const [selectedAppt, setSelectedAppt]         = React.useState(null);
  const [newDateTime, setNewDateTime]           = React.useState("");
  const [cancelReason, setCancelReason]         = React.useState("Patient request");
  const [actionLoading, setActionLoading]       = React.useState(false);
  const [actionError, setActionError]           = React.useState("");
  const [printAppt, setPrintAppt]               = React.useState(null);

  const API = process.env.NEXT_PUBLIC_API_URL;
  const headers = () => ({ Authorization: `Bearer ${localStorage.getItem("authtoken")}` });

  // Debounce search
  React.useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // ESC closes modals
  React.useEffect(() => {
    const h = (e) => { if (e.key === "Escape") { setIsRescheduleOpen(false); setIsCancelOpen(false); } };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const fetchAll = React.useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search)                  params.set("search", search);
      if (statusFilter !== "All")  params.set("status", statusFilter);
      if (deptFilter   !== "All")  params.set("departmentId", deptFilter);

      const [listRes, statsRes, deptRes] = await Promise.all([
        fetch(`${API}/appointments?${params}`,      { headers: headers() }),
        fetch(`${API}/appointments/stats`,           { headers: headers() }),
        fetch(`${API}/appointments/departments`,     { headers: headers() }),
      ]);
      const [list, statsJson, deptJson] = await Promise.all([listRes.json(), statsRes.json(), deptRes.json()]);
      if (list.success)      setAppointments(list.data);
      if (statsJson.success) setStats(statsJson.data);
      if (deptJson.success)  setDepartments(deptJson.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [search, statusFilter, deptFilter]);

  React.useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleStatusUpdate = async (apptId, status, extra = {}) => {
    setActionLoading(true); setActionError("");
    try {
      const res = await fetch(`${API}/appointments/${apptId}/status`, {
        method: "PATCH",
        headers: { ...headers(), "Content-Type": "application/json" },
        body: JSON.stringify({ status, ...extra }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      setIsRescheduleOpen(false); setIsCancelOpen(false);
      fetchAll();
    } catch (e) { setActionError(e.message); }
    finally { setActionLoading(false); }
  };

  const handleReschedule = async () => {
    if (!newDateTime) { setActionError("Please select a new date and time."); return; }
    setActionLoading(true); setActionError("");
    try {
      const res = await fetch(`${API}/appointments/${selectedAppt.id}/reschedule`, {
        method: "PATCH",
        headers: { ...headers(), "Content-Type": "application/json" },
        body: JSON.stringify({ dateTime: newDateTime }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      setIsRescheduleOpen(false); fetchAll();
    } catch (e) { setActionError(e.message); }
    finally { setActionLoading(false); }
  };

  const formatTime = (iso) => iso ? new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "—";

  const STATUSES = ["All", "SCHEDULED", "CHECKED_IN", "WAITING", "COMPLETED", "CANCELLED", "NO_SHOW"];

  return (
    <div className="flex flex-col gap-5 p-5 min-h-screen bg-background">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-[20px] font-bold text-foreground">Today&apos;s Schedule</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => router.push("/reception/tokens")}
            className="h-10 px-4 bg-muted/50 border border-border rounded-[5px] text-[13px] font-bold text-foreground flex items-center gap-2 hover:bg-muted transition-all">
            <Ticket className="w-4 h-4 text-[#3B4CB8]" /> Token Queue
          </button>
          <button onClick={() => router.push("/reception/opd-appointments/book")}
            className="h-10 px-5 bg-primary text-white rounded-[5px] text-[13px] font-bold flex items-center gap-2 hover:opacity-90 transition-all">
            <Plus className="w-4 h-4" /> Book Appointment
          </button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 xl:grid-cols-5 gap-3">
          {[
            { label: "Today's Total",  value: stats.total,     Icon: CalendarDays, color: "text-[#3B4CB8]", bg: "bg-[#3B4CB8]/5" },
            { label: "Checked In",     value: stats.checkedIn, Icon: UserCheck,    color: "text-[#00A389]", bg: "bg-[#00A389]/5" },
            { label: "Waiting",        value: stats.waiting,   Icon: Clock,        color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Cancelled",      value: stats.cancelled, Icon: XCircle,      color: "text-red-500",   bg: "bg-red-50" },
            { label: "No Show",        value: stats.noShow,    Icon: UserX,        color: "text-slate-500", bg: "bg-slate-100" },
          ].map((s, i) => (
            <div key={i} className={cn("bg-card border border-border rounded-[5px] p-4 flex items-center justify-between gap-3", i === 4 && "col-span-2 xl:col-span-1")}>
              <div>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-tight">{s.label}</p>
                <h3 className="text-[26px] font-bold text-foreground leading-none mt-1">{s.value}</h3>
              </div>
              <div className={cn("w-10 h-10 rounded-[5px] flex items-center justify-center shrink-0", s.bg)}>
                <s.Icon className={cn("w-5 h-5", s.color)} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table card */}
      <div className="bg-card border border-border rounded-[5px] overflow-hidden">
        {/* Filters */}
        <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border/60">
          <div className="relative w-full md:w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 pointer-events-none" />
            <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search patient, doctor, token..."
              className="w-full h-10 pl-10 pr-4 bg-muted/30 border border-border rounded-[5px] text-[13px] font-medium outline-none focus:border-primary transition-all" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* Department filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-10 px-4 bg-card border border-border rounded-[5px] text-[13px] font-medium text-foreground flex items-center gap-2 hover:bg-muted outline-none">
                  Dept: {deptFilter === "All" ? "All" : departments.find(d => d.id === deptFilter)?.name || "All"}
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px] border-border bg-card rounded-[5px] p-1 shadow-xl">
                <DropdownMenuItem onClick={() => setDeptFilter("All")} className={cn("text-[13px] font-medium h-10 px-3 cursor-pointer rounded-[3px]", deptFilter === "All" && "bg-primary/5 text-primary font-bold")}>All Departments</DropdownMenuItem>
                {departments.map((d) => (
                  <DropdownMenuItem key={d.id} onClick={() => setDeptFilter(d.id)} className={cn("text-[13px] font-medium h-10 px-3 cursor-pointer rounded-[3px]", deptFilter === d.id && "bg-primary/5 text-primary font-bold")}>{d.name}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Status filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-10 px-4 bg-card border border-border rounded-[5px] text-[13px] font-medium text-foreground flex items-center gap-2 hover:bg-muted outline-none">
                  {statusFilter === "All" ? "All Status" : STATUS_LABEL[statusFilter]}
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px] border-border bg-card rounded-[5px] p-1 shadow-xl">
                {STATUSES.map((s) => (
                  <DropdownMenuItem key={s} onClick={() => setStatusFilter(s)} className={cn("text-[13px] font-medium h-10 px-3 cursor-pointer rounded-[3px]", statusFilter === s && "bg-primary/5 text-primary font-bold")}>
                    {s === "All" ? "All Status" : STATUS_LABEL[s]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <button onClick={fetchAll} className="h-10 px-3 border border-border rounded-[5px] text-muted-foreground hover:bg-muted transition-all">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-muted/30 border-b border-border/60">
                {["Token", "Patient", "Department", "Doctor", "Time", "Status", "Actions"].map((h) => (
                  <th key={h} className={cn(
                    "px-5 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider",
                    h === "Actions" && "min-w-[260px]"
                  )}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">{Array.from({ length: 7 }).map((__, j) => <td key={j} className="px-5 py-5"><div className="h-4 bg-muted rounded w-3/4" /></td>)}</tr>
                ))
              ) : appointments.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-16 text-center text-[13px] text-muted-foreground">No appointments found for today.</td></tr>
              ) : appointments.map((a) => (
                <tr key={a.id} className="hover:bg-muted/10 transition-colors">
                  <td className="px-5 py-4">
                    {a.tokenNumber ? (
                      <button
                        onClick={() => router.push("/reception/tokens")}
                        className="font-bold text-[#3B4CB8] bg-[#3B4CB8]/8 border border-[#3B4CB8]/20 rounded-[5px] px-2 py-0.5 text-[12px] tracking-wide hover:bg-[#3B4CB8] hover:text-white transition-all"
                        title="View in Token Queue"
                      >
                        {a.tokenNumber}
                      </button>
                    ) : (
                      <span className="text-[12px] text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-[13px] font-bold text-foreground">{a.patient?.name || "—"}</td>
                  <td className="px-5 py-4 text-[13px] font-medium text-foreground">{a.departmentName || "—"}</td>
                  <td className="px-5 py-4 text-[13px] font-medium text-foreground">{a.doctorName || "—"}</td>
                  <td className="px-5 py-4 text-[13px] font-medium text-foreground">{formatTime(a.dateTime)}</td>
                  <td className="px-5 py-4">
                    <span className={cn("px-2.5 py-1 rounded-[5px] text-[11px] font-bold", STATUS_STYLE[a.status] || "bg-muted text-muted-foreground")}>
                      {STATUS_LABEL[a.status] || a.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 flex-nowrap">
                      <button
                        onClick={() => setPrintAppt(a)}
                        className="h-7 w-7 shrink-0 flex items-center justify-center border border-border bg-card text-muted-foreground rounded-[3px] hover:bg-primary hover:text-white hover:border-primary transition-all"
                        title="Print Appointment Slip"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                      {a.status !== "CANCELLED" && a.status !== "COMPLETED" && (
                        <>
                          <button onClick={() => { setSelectedAppt(a); setNewDateTime(""); setActionError(""); setIsRescheduleOpen(true); }}
                            className="h-7 px-3 shrink-0 whitespace-nowrap border border-border bg-card text-foreground rounded-[3px] text-[11px] font-bold hover:bg-muted transition-all">
                            Reschedule
                          </button>
                          <button onClick={() => { setSelectedAppt(a); setCancelReason("Patient request"); setActionError(""); setIsCancelOpen(true); }}
                            className="h-7 px-3 shrink-0 whitespace-nowrap border border-border bg-card text-foreground rounded-[3px] text-[11px] font-bold hover:bg-muted transition-all">
                            Cancel
                          </button>
                        </>
                      )}
                      {a.status === "SCHEDULED" && (
                        <button onClick={() => handleStatusUpdate(a.id, "CHECKED_IN")}
                          className="h-7 px-3 shrink-0 whitespace-nowrap border border-[#00A389]/30 bg-[#E6F9F1] text-[#00A389] rounded-[3px] text-[11px] font-bold hover:bg-[#00A389] hover:text-white transition-all">
                          Check In
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-border/60">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <div key={i} className="p-4 space-y-3 animate-pulse"><div className="h-5 bg-muted rounded w-1/2" /><div className="h-4 bg-muted rounded w-1/3" /></div>)
          ) : appointments.map((a) => (
            <div key={a.id} className="p-4 space-y-3 hover:bg-muted/5 transition-colors">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-foreground bg-muted/30 px-2 py-0.5 rounded-[3px]">{a.tokenNumber || "—"}</span>
                    <span className={cn("px-2 py-0.5 rounded-[3px] text-[10px] font-bold", STATUS_STYLE[a.status])}>{STATUS_LABEL[a.status]}</span>
                  </div>
                  <h3 className="text-[15px] font-bold text-foreground">{a.patient?.name || "—"}</h3>
                </div>
                <p className="text-[12px] font-bold text-foreground">{formatTime(a.dateTime)}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 p-3 bg-muted/20 border border-border/40 rounded-[5px]">
                <div><p className="text-[10px] font-bold text-muted-foreground uppercase">Doctor</p><p className="text-[12px] font-bold text-foreground truncate">{a.doctorName || "—"}</p></div>
                <div className="text-right"><p className="text-[10px] font-bold text-muted-foreground uppercase">Dept</p><p className="text-[12px] font-bold text-foreground">{a.departmentName || "—"}</p></div>
              </div>
              {a.status !== "CANCELLED" && a.status !== "COMPLETED" && (
                <div className="flex gap-2">
                  <button onClick={() => { setSelectedAppt(a); setNewDateTime(""); setActionError(""); setIsRescheduleOpen(true); }} className="flex-1 h-9 bg-card border border-border rounded-[5px] text-[12px] font-bold text-foreground hover:bg-muted">Reschedule</button>
                  <button onClick={() => { setSelectedAppt(a); setCancelReason("Patient request"); setActionError(""); setIsCancelOpen(true); }} className="flex-1 h-9 bg-card border border-border rounded-[5px] text-[12px] font-bold text-foreground hover:bg-muted">Cancel</button>
                  <button onClick={() => setPrintAppt(a)} className="h-9 w-9 flex items-center justify-center bg-card border border-border rounded-[5px] text-muted-foreground hover:bg-primary hover:text-white hover:border-primary transition-all" title="Print Slip">
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              )}
              {(a.status === "CANCELLED" || a.status === "COMPLETED") && (
                <button onClick={() => setPrintAppt(a)} className="w-full h-9 flex items-center justify-center gap-2 bg-card border border-border rounded-[5px] text-[12px] font-bold text-muted-foreground hover:bg-muted transition-all">
                  <Printer className="w-3.5 h-3.5" /> Print Slip
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Reschedule Modal */}
      {isRescheduleOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
          <div className="bg-card border border-border rounded-[5px] w-full max-w-[480px] overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-5 flex items-center justify-between border-b border-border/60">
              <h2 className="text-[16px] font-bold text-foreground">Reschedule Appointment</h2>
              <button onClick={() => setIsRescheduleOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted"><X className="w-4 h-4 text-muted-foreground" /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="p-4 bg-muted/20 border border-border/40 rounded-[5px] space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Current Appointment</p>
                <p className="text-[13px] font-bold text-foreground">{selectedAppt?.patient?.name} · {selectedAppt?.doctorName}</p>
                <p className="text-[12px] font-bold text-amber-600">{formatTime(selectedAppt?.dateTime)}</p>
              </div>
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-muted-foreground">New Date & Time <span className="text-red-500">*</span></label>
                <input type="datetime-local" value={newDateTime} onChange={(e) => setNewDateTime(e.target.value)}
                  className="w-full h-11 px-4 bg-background border border-border rounded-[5px] text-[13px] font-medium outline-none focus:border-primary transition-all" />
              </div>
              {actionError && <p className="text-[12px] text-red-500 font-medium">{actionError}</p>}
            </div>
            <div className="p-5 border-t border-border/60 flex items-center justify-end gap-3">
              <button onClick={() => setIsRescheduleOpen(false)} className="h-10 px-6 border border-border rounded-[5px] text-[12px] font-bold text-foreground hover:bg-muted">Cancel</button>
              <button onClick={handleReschedule} disabled={actionLoading} className="h-10 px-6 bg-primary text-white rounded-[5px] text-[12px] font-bold hover:opacity-90 disabled:opacity-50 flex items-center gap-2">
                {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {isCancelOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]">
          <div className="bg-card border border-border rounded-[5px] w-full max-w-[460px] overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-5 flex items-center justify-between border-b border-border/60">
              <div className="flex items-center gap-2"><XCircle className="w-5 h-5 text-red-500" /><h2 className="text-[16px] font-bold text-foreground">Cancel Appointment</h2></div>
              <button onClick={() => setIsCancelOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted"><X className="w-4 h-4 text-muted-foreground" /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="p-4 bg-muted/20 border border-border/40 rounded-[5px] space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Appointment</p>
                <p className="text-[13px] font-bold text-foreground">{selectedAppt?.patient?.name} · Token {selectedAppt?.tokenNumber}</p>
                <p className="text-[12px] font-medium text-muted-foreground">{selectedAppt?.doctorName} · {formatTime(selectedAppt?.dateTime)}</p>
              </div>
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-muted-foreground">Cancellation Reason</label>
                <select value={cancelReason} onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full h-11 px-4 bg-background border border-border rounded-[5px] text-[13px] font-medium outline-none focus:border-primary transition-all">
                  {["Patient request", "Doctor unavailable", "Emergency", "Duplicate booking", "Other"].map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div className="flex gap-2 p-3 bg-red-50/50 rounded-[5px] border border-red-100">
                <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-[12px] font-medium text-red-500 leading-tight">This action cannot be undone. The slot will be released.</p>
              </div>
              {actionError && <p className="text-[12px] text-red-500 font-medium">{actionError}</p>}
            </div>
            <div className="p-5 border-t border-border/60 flex items-center justify-end gap-3">
              <button onClick={() => setIsCancelOpen(false)} className="h-10 px-6 border border-border rounded-[5px] text-[12px] font-bold text-foreground hover:bg-muted">Back</button>
              <button onClick={() => handleStatusUpdate(selectedAppt.id, "CANCELLED", { cancelReason })} disabled={actionLoading}
                className="h-10 px-6 bg-red-600 text-white rounded-[5px] text-[12px] font-bold hover:opacity-90 disabled:opacity-50 flex items-center gap-2">
                {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print Preview Modal */}
      <PrintPreviewModal
        isOpen={!!printAppt}
        onClose={() => setPrintAppt(null)}
        appointment={printAppt}
        formatTime={formatTime}
      />
    </div>
  );
}

