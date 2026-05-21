"use client";

import React from "react";
import {
  Search,
  Plus,
  Eye,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  Ambulance,
  User,
  Building2,
  AlertCircle,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

// ─── Constants ────────────────────────────────────────────────────────────────
const PAGE_SIZE_OPTIONS = [10, 20, 50];

const PRIORITY_MAP = {
  Red:    { label: "CRITICAL (RED)",  style: "bg-[#FFF2F2] text-[#E11D48] border-[#E11D48]/20" },
  Yellow: { label: "URGENT (YELLOW)", style: "bg-[#FFF9F2] text-[#D97706] border-[#D97706]/20" },
  Green:  { label: "STABLE (GREEN)",  style: "bg-[#E6F9F1] text-[#00A389] border-[#00A389]/20" },
};

const STATUS_STYLE = {
  Emergency: "bg-[#FFF2F2] text-[#E11D48]",
  Draft:     "bg-[#F5F3FF] text-[#7C3AED]",
  Complete:  "bg-[#E6F9F1] text-[#00A389]",
};

// ─── Small components ─────────────────────────────────────────────────────────
const StatusPill = ({ status }) => (
  <span className={cn("px-2.5 py-1 rounded-[5px] text-[11px] font-bold", STATUS_STYLE[status] || STATUS_STYLE.Complete)}>
    {status}
  </span>
);

const PriorityBadge = ({ priority }) => {
  const p = PRIORITY_MAP[priority] || PRIORITY_MAP.Red;
  return (
    <span className={cn("px-2 py-0.5 rounded-[4px] text-[10px] font-bold border", p.style)}>
      {p.label}
    </span>
  );
};

const ArrivalIcon = ({ mode }) => {
  if (mode === "Ambulance") return <Ambulance className="w-4 h-4 text-muted-foreground" />;
  if (mode === "Walk-In")   return <User      className="w-4 h-4 text-muted-foreground" />;
  if (mode === "Referral")  return <Building2 className="w-4 h-4 text-muted-foreground" />;
  return null;
};

// ─── Pagination component ─────────────────────────────────────────────────────
function Pagination({ page, totalPages, total, limit, onPageChange, onLimitChange }) {
  if (totalPages <= 0) return null;

  // Build page number array with ellipsis: [1, …, 4, 5, 6, …, 12]
  const getPages = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [];
    pages.push(1);
    if (page > 3)             pages.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push("…");
    pages.push(totalPages);
    return pages;
  };

  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to   = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4 border-t border-border/60">
      {/* Left: record count + page size */}
      <div className="flex items-center gap-3 text-[12px] text-muted-foreground font-medium">
        <span>
          {total === 0 ? "No records" : `Showing ${from}–${to} of ${total}`}
        </span>
        <span className="text-border">|</span>
        <div className="flex items-center gap-1.5">
          <span>Rows:</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-7 px-2.5 bg-background border border-border rounded-[4px] text-[12px] font-bold text-foreground flex items-center gap-1.5 hover:bg-muted transition-all outline-none">
                {limit}
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[70px] border-border bg-card shadow-xl rounded-[5px] p-1">
              {PAGE_SIZE_OPTIONS.map((s) => (
                <DropdownMenuItem
                  key={s}
                  onClick={() => onLimitChange(s)}
                  className={cn("text-[12px] font-medium h-8 px-3 cursor-pointer focus:bg-primary/5 rounded-[3px]", limit === s && "bg-primary/5 text-primary font-bold")}
                >
                  {s}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Right: page buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="w-8 h-8 flex items-center justify-center rounded-[5px] border border-border text-muted-foreground hover:bg-muted transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {getPages().map((p, i) =>
          p === "…" ? (
            <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-[12px] text-muted-foreground">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={cn(
                "w-8 h-8 flex items-center justify-center rounded-[5px] text-[12px] font-bold transition-all border",
                page === p
                  ? "bg-[#3B4CB8] text-white border-[#3B4CB8]"
                  : "border-border text-foreground hover:bg-muted"
              )}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-[5px] border border-border text-muted-foreground hover:bg-muted transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function EmergencyRegistration() {
  const router = useRouter();

  // ── State ───────────────────────────────────────────────────────────────────
  const [patients, setPatients]       = React.useState([]);
  const [loading, setLoading]         = React.useState(true);
  const [searchInput, setSearchInput] = React.useState("");   // raw input
  const [search, setSearch]           = React.useState("");   // debounced
  const [priority, setPriority]       = React.useState("All");
  const [status, setStatus]           = React.useState("All");
  const [page, setPage]               = React.useState(1);
  const [limit, setLimit]             = React.useState(10);
  const [total, setTotal]             = React.useState(0);
  const [totalPages, setTotalPages]   = React.useState(0);

  // ── Debounce search input (400 ms) ──────────────────────────────────────────
  React.useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput);
      setPage(1); // reset to page 1 on new search
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Reset page when filters change
  const handlePriority = (val) => { setPriority(val); setPage(1); };
  const handleStatus   = (val) => { setStatus(val);   setPage(1); };
  const handleLimit    = (val) => { setLimit(val);    setPage(1); };

  // ── Fetch ───────────────────────────────────────────────────────────────────
  React.useEffect(() => {
    let cancelled = false;

    const fetchList = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authtoken");

        const params = new URLSearchParams({ page, limit });
        if (search)            params.set("search",   search);
        if (priority !== "All") params.set("priority", priority);
        if (status   !== "All") params.set("status",   status);

        const res  = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/emergency?${params.toString()}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const json = await res.json();

        if (!cancelled && json.success) {
          setPatients(json.data);
          setTotal(json.total);
          setTotalPages(json.totalPages);
        }
      } catch (err) {
        console.error("Failed to fetch emergency list:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchList();
    return () => { cancelled = true; };
  }, [search, priority, status, page, limit]);

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const formatDate = (iso) =>
    iso ? new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—";

  const hasActiveFilters = priority !== "All" || status !== "All" || search !== "";

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setPriority("All");
    setStatus("All");
    setPage(1);
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-5 p-5 min-h-screen bg-background">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-bold text-foreground">Emergency Patient Registration</h1>
          {total > 0 && !loading && (
            <p className="text-[12px] text-muted-foreground mt-0.5">{total} record{total !== 1 ? "s" : ""} found</p>
          )}
        </div>
        <button
          onClick={() => router.push("/super-admin/emergency-registration/new")}
          className="flex items-center gap-2 bg-[#3B4CB8] text-white px-4 h-11 rounded-[5px] text-[13px] font-bold hover:opacity-90 transition-all shadow-none w-full md:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          New Registration
        </button>
      </div>

      {/* Card */}
      <div className="bg-card border border-border rounded-[5px] shadow-none flex flex-col overflow-hidden">

        {/* ── Filter bar ── */}
        <div className="p-3 flex flex-col md:flex-row gap-3 items-start md:items-center justify-between border-b border-border/60">

          {/* Search */}
          <div className="relative w-full md:w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name or mobile..."
              className="w-full h-11 pl-10 pr-9 bg-background border border-border rounded-[5px] text-[13px] font-medium outline-none focus:border-primary transition-all shadow-none placeholder:text-muted-foreground/60"
            />
            {searchInput && (
              <button
                onClick={() => { setSearchInput(""); setSearch(""); setPage(1); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
            {/* Priority filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={cn(
                  "h-11 px-4 border rounded-[5px] text-[13px] font-medium flex items-center gap-2 hover:bg-muted transition-all outline-none min-w-[130px] justify-between",
                  priority !== "All" ? "bg-primary/5 border-primary text-primary" : "bg-background border-border text-foreground"
                )}>
                  {priority === "All" ? "All Priority" : priority}
                  <ChevronDown className="w-4 h-4 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[150px] border-border bg-card shadow-xl rounded-[5px] p-1">
                {["All", "Red", "Yellow", "Green"].map((p) => (
                  <DropdownMenuItem
                    key={p}
                    onClick={() => handlePriority(p)}
                    className={cn("text-[13px] font-medium h-10 px-3 cursor-pointer focus:bg-primary/5 rounded-[3px]", priority === p && "bg-primary/5 text-primary font-bold")}
                  >
                    {p === "All" ? "All Priority" : p}
                    {priority === p && <Check className="w-4 h-4 ml-auto" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Status filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={cn(
                  "h-11 px-4 border rounded-[5px] text-[13px] font-medium flex items-center gap-2 hover:bg-muted transition-all outline-none min-w-[130px] justify-between",
                  status !== "All" ? "bg-primary/5 border-primary text-primary" : "bg-background border-border text-foreground"
                )}>
                  {status === "All" ? "All Status" : status}
                  <ChevronDown className="w-4 h-4 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[150px] border-border bg-card shadow-xl rounded-[5px] p-1">
                {["All", "Emergency", "Draft", "Complete"].map((s) => (
                  <DropdownMenuItem
                    key={s}
                    onClick={() => handleStatus(s)}
                    className={cn("text-[13px] font-medium h-10 px-3 cursor-pointer focus:bg-primary/5 rounded-[3px]", status === s && "bg-primary/5 text-primary font-bold")}
                  >
                    {s === "All" ? "All Status" : s}
                    {status === s && <Check className="w-4 h-4 ml-auto" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Clear filters pill */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="h-11 px-3 flex items-center gap-1.5 text-[12px] font-bold text-muted-foreground hover:text-foreground border border-dashed border-border rounded-[5px] hover:bg-muted transition-all"
              >
                <X className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* ── Desktop Table ── */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr className="bg-muted/30 border-b border-border/60">
                {["PATIENT NAME", "MOBILE", "ARRIVAL MODE", "TRIAGE PRIORITY", "REGISTRATION DATE", "STATUS", "ACTIONS"].map((h) => (
                  <th
                    key={h}
                    className={cn("px-5 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider", h === "ACTIONS" && "text-center")}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? (
                // Skeleton rows
                Array.from({ length: limit }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 7 }).map((__, j) => (
                      <td key={j} className="px-5 py-5">
                        <div className="h-4 bg-muted rounded-[3px] w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : patients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                      <AlertCircle className="w-8 h-8 opacity-30" />
                      <p className="text-[13px] font-medium">
                        {hasActiveFilters ? "No results match your filters." : "No emergency registrations yet."}
                      </p>
                      {hasActiveFilters && (
                        <button onClick={clearFilters} className="text-[12px] text-primary font-bold hover:underline">
                          Clear filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : patients.map((p) => (
                <tr key={p.id} className="hover:bg-muted/10 transition-colors group">
                  <td className="px-5 py-4 text-[13px] font-bold text-foreground">{p.name || "Unknown"}</td>
                  <td className="px-5 py-4 text-[13px] font-medium text-foreground">{p.contact || "—"}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-[13px] font-medium text-foreground">
                      <ArrivalIcon mode={p.arrivalMode} />
                      {p.arrivalMode || "—"}
                    </div>
                  </td>
                  <td className="px-5 py-4"><PriorityBadge priority={p.triagePriority} /></td>
                  <td className="px-5 py-4 text-[13px] font-medium text-foreground">{formatDate(p.arrivalTime || p.createdAt)}</td>
                  <td className="px-5 py-4"><StatusPill status={p.status} /></td>
                  <td className="px-5 py-4">
                    <div className="flex justify-center">
                      <button
                        onClick={() => router.push(`/super-admin/emergency-registration/${p.id}`)}
                        className="p-1.5 hover:bg-muted rounded-[5px] text-muted-foreground group-hover:text-foreground transition-all"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Mobile List ── */}
        <div className="lg:hidden divide-y divide-border/60">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-4 space-y-3 animate-pulse">
                <div className="h-4 bg-muted rounded w-1/3" />
                <div className="h-5 bg-muted rounded w-1/2" />
                <div className="grid grid-cols-2 gap-3">
                  {Array.from({ length: 4 }).map((__, j) => <div key={j} className="h-4 bg-muted rounded" />)}
                </div>
              </div>
            ))
          ) : patients.length === 0 ? (
            <div className="p-10 flex flex-col items-center gap-3 text-muted-foreground">
              <AlertCircle className="w-8 h-8 opacity-30" />
              <p className="text-[13px] font-medium">
                {hasActiveFilters ? "No results match your filters." : "No emergency registrations yet."}
              </p>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-[12px] text-primary font-bold hover:underline">
                  Clear filters
                </button>
              )}
            </div>
          ) : patients.map((p) => (
            <div
              key={p.id}
              className="p-4 space-y-4 hover:bg-muted/5 active:bg-muted/10 cursor-pointer transition-colors"
              onClick={() => router.push(`/super-admin/emergency-registration/${p.id}`)}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1.5">
                  <PriorityBadge priority={p.triagePriority} />
                  <h3 className="text-[15px] font-bold text-foreground">{p.name || "Unknown"}</h3>
                </div>
                <div className="p-2 bg-muted/50 rounded-full shrink-0">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Arrival Mode</p>
                  <div className="flex items-center gap-1.5 text-[13px] font-bold text-foreground">
                    <ArrivalIcon mode={p.arrivalMode} />
                    {p.arrivalMode || "—"}
                  </div>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Mobile</p>
                  <p className="text-[13px] font-bold text-foreground">{p.contact || "—"}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Status</p>
                  <StatusPill status={p.status} />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Reg. Date</p>
                  <p className="text-[13px] font-medium text-foreground">{formatDate(p.arrivalTime || p.createdAt)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Pagination ── */}
        {!loading && totalPages > 0 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={handleLimit}
          />
        )}
      </div>
    </div>
  );
}
