"use client";
import React from "react";
import { Eye, Search, ChevronDown, Loader2, AlertCircle, ClipboardList } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

function getAuthHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("authtoken") : "";
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

const STATUS_OPTIONS = [
  { value: "All", label: "All Status" },
  { value: "PENDING", label: "Pending" },
  { value: "PROCESSING", label: "Processing" },
  { value: "READY", label: "Ready" },
  { value: "DISPENSED", label: "Dispensed" },
];

const STATUS_STYLES = {
  PENDING:    "bg-[#fef3c7] text-[#b45309]",
  PROCESSING: "bg-[#dbeafe] text-[#1e40af]",
  READY:      "bg-[#dcfce7] text-[#15803d]",
  DISPENSED:  "bg-[#f1f5f9] text-[#64748b]",
};

function formatTime(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}

function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export function PrescriptionQueue() {
  const [prescriptions, setPrescriptions] = React.useState([]);
  const [stats, setStats] = React.useState({ pending: 0, processing: 0, ready: 0, dispensedToday: 0 });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("All");

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (statusFilter !== "All") params.append("status", statusFilter);

      const [queueRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/pharmacy/queue?${params}`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE}/pharmacy/queue/stats`, { headers: getAuthHeaders() }),
      ]);

      if (!queueRes.ok) throw new Error(`Failed to fetch queue: ${queueRes.status}`);
      if (!statsRes.ok) throw new Error(`Failed to fetch stats: ${statsRes.status}`);

      const queueData = await queueRes.json();
      const statsData = await statsRes.json();

      setPrescriptions(queueData.data || []);
      setStats(statsData.data || { pending: 0, processing: 0, ready: 0, dispensedToday: 0 });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  React.useEffect(() => {
    const timer = setTimeout(() => fetchData(), search ? 400 : 0);
    return () => clearTimeout(timer);
  }, [fetchData, search]);

  const statCards = [
    { label: "Pending",    value: stats.pending,       color: "text-[#b45309]",  bg: "bg-[#fef3c7]" },
    { label: "Processing", value: stats.processing,    color: "text-[#1e40af]",  bg: "bg-[#dbeafe]" },
    { label: "Ready",      value: stats.ready,         color: "text-[#15803d]",  bg: "bg-[#dcfce7]" },
    { label: "Dispensed Today", value: stats.dispensedToday, color: "text-[#64748b]", bg: "bg-[#f1f5f9]" },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-[20px] font-sans bg-[#f8f9fc] dark:bg-[#0a0f1d] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-[20px] font-bold text-[#1e293b] dark:text-white leading-none">Prescription Queue</h1>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative w-full md:w-[260px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b] opacity-50" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patient, doctor..."
              className="w-full h-11 pl-10 pr-4 bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-bold text-[#1e293b] dark:text-white placeholder:text-[#64748b]/60 outline-none focus:border-primary transition-all"
            />
          </div>

          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full md:w-[150px] h-11 px-4 bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-bold text-[#1e293b] dark:text-white flex items-center justify-between hover:bg-[#f8fafc] dark:hover:bg-[#334155] transition-all outline-none group data-[state=open]:border-primary">
                <span className="truncate text-left flex-1 mr-2">
                  {STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label || "All Status"}
                </span>
                <ChevronDown className="w-4 h-4 text-[#64748b] transition-transform group-data-[state=open]:rotate-180" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px] p-1 border-[#e2e8f0] dark:border-[#334155] rounded-[5px] shadow-none">
              {STATUS_OPTIONS.map((opt) => (
                <DropdownMenuItem
                  key={opt.value}
                  onClick={() => setStatusFilter(opt.value)}
                  className="font-bold text-[13px] h-10 px-3 rounded-[5px] cursor-pointer focus:bg-primary/5 focus:text-primary"
                >
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>


        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white dark:bg-[#1e293b] rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] p-4">
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider opacity-70">{s.label}</p>
            <p className={`text-[28px] font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#1e293b] rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 size={28} className="animate-spin text-[#2e37a4]" />
            <p className="text-[13px] font-bold text-[#64748b]">Loading prescriptions...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <AlertCircle size={28} className="text-red-500" />
            <p className="text-[13px] font-bold text-red-500">{error}</p>
            <button
              onClick={() => fetchData()}
              className="px-4 h-9 bg-[#2e37a4] text-white rounded-[5px] text-[12px] font-bold hover:opacity-90"
            >
              Retry
            </button>
          </div>
        ) : prescriptions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <ClipboardList size={32} className="text-[#64748b] opacity-40" />
            <p className="text-[14px] font-bold text-[#64748b]">No prescriptions found</p>
            <p className="text-[12px] text-[#64748b] opacity-70">
              {search || statusFilter !== "All"
                ? "Try adjusting your filters"
                : "Prescriptions appear here after doctors complete OPD consultations"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#f8fafc] dark:bg-[#0f172a]">
                <tr>
                  <th className="px-6 py-4 text-[12px] font-bold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider">Rx ID</th>
                  <th className="px-6 py-4 text-[12px] font-bold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-4 text-[12px] font-bold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider">Doctor</th>
                  <th className="px-6 py-4 text-[12px] font-bold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider">Items</th>
                  <th className="px-6 py-4 text-[12px] font-bold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider">Time</th>
                  <th className="px-6 py-4 text-[12px] font-bold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-[12px] font-bold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0] dark:divide-[#334155]">
                {prescriptions.map((rx) => {
                  const statusStyle = STATUS_STYLES[rx.pharmacyStatus] || "bg-[#f1f5f9] text-[#64748b]";
                  const href =
                    rx.pharmacyStatus === "READY"
                      ? `/pharmacy/prescription-queue/${rx.id}/ready`
                      : rx.pharmacyStatus === "PROCESSING"
                      ? `/pharmacy/prescription-queue/${rx.id}/process`
                      : `/pharmacy/prescription-queue/${rx.id}`;

                  return (
                    <tr key={rx.id} className="hover:bg-[#f8fafc] dark:hover:bg-[#0f172a] transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-[13px] font-bold text-[#2e37a4] font-mono">
                          RX-{rx.id.slice(-6).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#2e37a4]/10 text-[#2e37a4] flex items-center justify-center text-[11px] font-bold shrink-0">
                            {getInitials(rx.patient?.name)}
                          </div>
                          <div>
                            <p className="text-[13px] font-bold text-[#1e293b] dark:text-white">
                              {rx.patient?.name || "Unknown"}
                            </p>
                            <p className="text-[11px] text-[#64748b] font-bold opacity-70">
                              {rx.patient?.age ? `${rx.patient.age} yrs` : ""}
                              {rx.patient?.gender ? ` · ${rx.patient.gender}` : ""}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[13px] font-bold text-[#475569] dark:text-[#cbd5e1]">
                        {rx.doctorName || "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[13px] font-bold text-[#475569] dark:text-[#cbd5e1]">
                          {rx.items?.length || 0} item{rx.items?.length !== 1 ? "s" : ""}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[13px] font-bold text-[#475569] dark:text-[#cbd5e1]">
                        {formatTime(rx.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[11px] font-bold px-3 py-1 rounded-[4px] ${statusStyle}`}>
                          {rx.pharmacyStatus.charAt(0) + rx.pharmacyStatus.slice(1).toLowerCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={href}
                          className="inline-flex items-center gap-1.5 text-[#64748b] hover:text-[#2e37a4] dark:hover:text-white transition-colors"
                        >
                          <Eye size={17} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
