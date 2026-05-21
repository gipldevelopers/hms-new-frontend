"use client";

import React from "react";
import {
  Search, Plus, Eye, ChevronDown, Check, Ticket,
  Calendar, User, Clock, Activity, X, Printer,
  Hash, RefreshCw, Settings, Loader2, AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CustomCalendar } from "@/components/ui/custom-calendar";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

// ─── Status badge ─────────────────────────────────────────────────────────────
const STATUS_STYLE = {
  Waiting:   "bg-amber-50 text-amber-700 border-amber-200",
  Called:    "bg-blue-50 text-blue-700 border-blue-200",
  Completed: "bg-[#E6F9F1] text-[#00A389] border-[#00A389]/20",
  Skipped:   "bg-red-50 text-red-500 border-red-200",
};
const StatusBadge = ({ status }) => (
  <span className={cn("px-2.5 py-1 rounded-[5px] text-[11px] font-bold border", STATUS_STYLE[status] || STATUS_STYLE.Waiting)}>
    {status}
  </span>
);

// ─── Token display chip ───────────────────────────────────────────────────────
const TokenChip = ({ token, size = "sm" }) => (
  <span className={cn(
    "font-bold text-[#3B4CB8] bg-[#3B4CB8]/8 border border-[#3B4CB8]/20 rounded-[5px] tracking-wide",
    size === "sm" ? "px-2 py-0.5 text-[12px]" : "px-3 py-1 text-[14px]"
  )}>
    {token}
  </span>
);

// ─── Token Generated Modal ────────────────────────────────────────────────────
function TokenGeneratedModal({ isOpen, onClose, token }) {
  React.useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    if (isOpen) window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && token && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 16 }}
            className="relative bg-white dark:bg-[#111827] w-full max-w-[400px] rounded-[8px] border border-border overflow-hidden z-10"
          >
            <button onClick={onClose} className="absolute right-4 top-4 p-1 hover:bg-muted rounded-full text-muted-foreground">
              <X className="w-4 h-4" />
            </button>
            <div className="p-8 flex flex-col items-center text-center space-y-6">
              <div className="w-16 h-16 bg-[#00A389] rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-white stroke-[3]" />
              </div>
              <div className="space-y-1">
                <h2 className="text-[18px] font-bold text-foreground">Token Generated</h2>
                <p className="text-[13px] text-muted-foreground">Successfully added to today&apos;s queue</p>
              </div>
              <div className="w-full bg-[#F5F7FF] dark:bg-primary/5 border border-primary/10 py-8 rounded-[8px] flex flex-col items-center gap-2">
                <span className="text-[11px] font-bold text-primary/60 tracking-widest uppercase">Token Number</span>
                <span className="text-[48px] font-bold text-[#3B4CB8] leading-none tracking-wide">{token.displayToken}</span>
                <span className="text-[12px] text-muted-foreground font-medium">{token.patient?.name || "Patient"}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 w-full">
                <button onClick={onClose} className="h-11 border border-border rounded-[5px] text-[13px] font-bold text-foreground hover:bg-muted transition-all">
                  Close
                </button>
                <button onClick={() => window.print()} className="flex items-center justify-center gap-2 h-11 bg-[#3B4CB8] text-white rounded-[5px] text-[13px] font-bold hover:opacity-90 transition-all">
                  <Printer className="w-4 h-4" />
                  Print Token
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ─── Prefix Settings Modal ────────────────────────────────────────────────────
function PrefixModal({ isOpen, currentPrefix, onClose, onSave }) {
  const [value, setValue] = React.useState(currentPrefix || "OPD");
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => { if (isOpen) { setValue(currentPrefix || "OPD"); setError(""); } }, [isOpen, currentPrefix]);
  React.useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    if (isOpen) window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [isOpen, onClose]);

  const PRESETS = ["OPD", "GEN", "EMG", "IPD", "CON", "LAB"];

  const handleSave = async () => {
    const clean = value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
    if (!clean) { setError("Use letters/numbers only, max 6 chars."); return; }
    setSaving(true);
    try {
      const token = localStorage.getItem("authtoken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tokens/prefix`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ prefix: clean }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to update prefix.");
      onSave(json.data.prefix);
      onClose();
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 16 }}
            className="relative bg-white dark:bg-[#111827] w-full max-w-[380px] rounded-[8px] border border-border overflow-hidden z-10"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div>
                <h2 className="text-[15px] font-bold text-foreground">Token Prefix Settings</h2>
                <p className="text-[12px] text-muted-foreground mt-0.5">Applies to all new tokens from today</p>
              </div>
              <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-[5px] text-muted-foreground"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Custom Prefix</label>
                <input
                  value={value}
                  onChange={(e) => { setValue(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6)); setError(""); }}
                  placeholder="e.g. OPD"
                  className="w-full h-11 px-4 bg-background border border-border rounded-[5px] text-[14px] font-bold text-foreground outline-none focus:border-primary transition-all tracking-widest"
                />
                {error && <p className="text-[11px] text-red-500 font-medium">{error}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Quick Presets</label>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((p) => (
                    <button key={p} onClick={() => setValue(p)}
                      className={cn("px-3 h-8 rounded-[5px] text-[12px] font-bold border transition-all",
                        value === p ? "bg-[#3B4CB8] text-white border-[#3B4CB8]" : "border-border text-foreground hover:bg-muted"
                      )}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="pt-1 bg-muted/30 rounded-[5px] p-3 text-center">
                <p className="text-[11px] text-muted-foreground font-medium">Preview</p>
                <p className="text-[22px] font-bold text-[#3B4CB8] tracking-wide">{value || "OPD"}-001</p>
              </div>
              <div className="flex gap-3 pt-1">
                <button onClick={onClose} className="flex-1 h-10 border border-border rounded-[5px] text-[13px] font-bold text-foreground hover:bg-muted transition-all">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="flex-1 h-10 bg-[#3B4CB8] text-white rounded-[5px] text-[13px] font-bold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save Prefix
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TokenManagement() {
  const [activeTab, setActiveTab]       = React.useState("listing");
  const [isLoaded, setIsLoaded]         = React.useState(false);
  const [searchInput, setSearchInput]   = React.useState("");
  const [search, setSearch]             = React.useState("");
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
  const calendarRef = React.useRef(null);

  // Data state
  const [patients, setPatients]         = React.useState([]);
  const [todayTokens, setTodayTokens]   = React.useState([]);
  const [history, setHistory]           = React.useState([]);
  const [stats, setStats]               = React.useState(null);
  const [prefix, setPrefix]             = React.useState("OPD");
  const [loading, setLoading]           = React.useState(true);

  // Modal state
  const [generatedToken, setGeneratedToken] = React.useState(null);
  const [showTokenModal, setShowTokenModal] = React.useState(false);
  const [showPrefixModal, setShowPrefixModal] = React.useState(false);
  const [generatingFor, setGeneratingFor]   = React.useState(null); // patientId being generated

  // User role from localStorage
  const [userRole, setUserRole] = React.useState("");

  React.useEffect(() => {
    const saved = localStorage.getItem("hms-token-tab");
    if (saved) setActiveTab(saved);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setUserRole(user.role || "");
    setIsLoaded(true);
  }, []);

  // Debounce search
  React.useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Close calendar on outside click
  React.useEffect(() => {
    const h = (e) => { if (calendarRef.current && !calendarRef.current.contains(e.target)) setIsCalendarOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    localStorage.setItem("hms-token-tab", tab);
  };

  const apiHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("authtoken")}`,
  });

  // ── Fetch stats + prefix ──────────────────────────────────────────────────
  const fetchStats = React.useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tokens/stats`, { headers: apiHeaders() });
      const json = await res.json();
      if (json.success) { setStats(json.data); setPrefix(json.data.prefix); }
    } catch (e) { console.error(e); }
  }, []);

  // ── Fetch patients list ───────────────────────────────────────────────────
  const fetchPatients = React.useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tokens/patients?${params}`, { headers: apiHeaders() });
      const json = await res.json();
      if (json.success) setPatients(json.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [search]);

  // ── Fetch today's tokens ──────────────────────────────────────────────────
  const fetchTodayTokens = React.useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tokens/today`, { headers: apiHeaders() });
      const json = await res.json();
      if (json.success) setTodayTokens(json.data);
    } catch (e) { console.error(e); }
  }, []);

  // ── Fetch history ─────────────────────────────────────────────────────────
  const fetchHistory = React.useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (selectedDate) params.set("date", selectedDate.toISOString());
      if (search) params.set("search", search);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tokens/history?${params}`, { headers: apiHeaders() });
      const json = await res.json();
      if (json.success) setHistory(json.data);
    } catch (e) { console.error(e); }
  }, [selectedDate, search]);

  // Load on mount and tab change
  React.useEffect(() => {
    if (!isLoaded) return;
    fetchStats();
    if (activeTab === "listing") fetchPatients();
    if (activeTab === "history") fetchHistory();
  }, [isLoaded, activeTab, fetchPatients, fetchHistory, fetchStats]);

  // ── Generate token ────────────────────────────────────────────────────────
  const handleGenerateToken = async (patient) => {
    setGeneratingFor(patient.id);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tokens/generate`, {
        method: "POST",
        headers: { ...apiHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ patientId: patient.id }),
      });
      const json = await res.json();
      if (!res.ok) { alert(json.message || "Failed to generate token."); return; }
      setGeneratedToken(json.data);
      setShowTokenModal(true);
      fetchPatients();
      fetchStats();
    } catch (e) { alert("Network error."); }
    finally { setGeneratingFor(null); }
  };

  const canChangePrefix = ["SUPERADMIN", "BRANCH_ADMIN"].includes(userRole);

  const formatDate = (iso) =>
    iso ? new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—";

  if (!isLoaded) return null;

  return (
    <div className="flex flex-col gap-5 p-5 min-h-screen bg-background">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-bold text-foreground">Token Queue Management</h1>
          {stats && (
            <p className="text-[12px] text-muted-foreground mt-0.5">
              Today: <span className="font-bold text-foreground">{stats.total}</span> tokens issued &nbsp;·&nbsp;
              Next: <span className="font-bold text-[#3B4CB8]">{stats.nextToken}</span>
            </p>
          )}
        </div>
        {canChangePrefix && (
          <button
            onClick={() => setShowPrefixModal(true)}
            className="flex items-center gap-2 h-10 px-4 border border-border rounded-[5px] text-[13px] font-bold text-foreground hover:bg-muted transition-all"
          >
            <Settings className="w-4 h-4" />
            Prefix: <span className="text-[#3B4CB8]">{prefix}</span>
          </button>
        )}
      </div>

      {/* ── Stats row (always visible) ── */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Today",  value: stats.total,     color: "text-foreground",   bg: "bg-muted/40" },
            { label: "Waiting",      value: stats.waiting,   color: "text-amber-600",    bg: "bg-amber-50" },
            { label: "Completed",    value: stats.completed, color: "text-[#00A389]",    bg: "bg-[#E6F9F1]" },
            { label: "Skipped",      value: stats.skipped,   color: "text-red-500",      bg: "bg-red-50" },
          ].map((s) => (
            <div key={s.label} className={cn("rounded-[5px] border border-border p-4 flex flex-col gap-1", s.bg)}>
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{s.label}</p>
              <p className={cn("text-[28px] font-bold leading-none", s.color)}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Tabs ── */}
      <div className="flex items-center gap-2">
        {["listing", "history"].map((tab) => (
          <button key={tab} onClick={() => handleTabChange(tab)}
            className={cn("px-5 h-10 rounded-[5px] text-[13px] font-bold transition-all",
              activeTab === tab ? "bg-[#3B4CB8] text-white" : "bg-white border border-border text-foreground hover:bg-muted"
            )}>
            {tab === "listing" ? "Patient List" : "Token History"}
          </button>
        ))}
      </div>

      {/* ── Card ── */}
      <div className="bg-card border border-border rounded-[5px] flex flex-col overflow-hidden">

        {/* Filter bar */}
        <div className="p-3 flex flex-col md:flex-row gap-3 items-center justify-between border-b border-border/60">
          <div className="relative w-full md:w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={activeTab === "listing" ? "Search patients..." : "Search tokens or patients..."}
              className="w-full h-11 pl-10 pr-4 bg-background border border-border rounded-[5px] text-[13px] font-medium outline-none focus:border-primary transition-all shadow-none placeholder:text-muted-foreground/60"
            />
          </div>

          {activeTab === "history" && (
            <div className="relative" ref={calendarRef}>
              <button onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className="h-11 px-4 bg-background border border-border rounded-[5px] text-[13px] font-bold text-foreground flex items-center gap-2 hover:bg-muted transition-all outline-none">
                <Calendar className="w-4 h-4 text-muted-foreground/60" />
                {selectedDate ? format(selectedDate, "MMM dd, yyyy") : "All Dates"}
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
              {isCalendarOpen && (
                <div className="absolute top-[calc(100%+5px)] right-0 z-[100] animate-in fade-in zoom-in-95 duration-200">
                  <CustomCalendar
                    selectedDate={selectedDate}
                    onSelect={(date) => { setSelectedDate(date); setIsCalendarOpen(false); }}
                    onClose={() => setIsCalendarOpen(false)}
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === "listing" && (
            <button onClick={() => { fetchPatients(); fetchStats(); }}
              className="h-11 px-4 border border-border rounded-[5px] text-[13px] font-bold text-foreground hover:bg-muted transition-all flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          )}
        </div>

        {/* ── Patient Listing Tab ── */}
        {activeTab === "listing" && (
          <>
            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-muted/30 border-b border-border/60">
                    {["Patient Name", "Mobile", "Gender / Age", "Reg. Date", "Today's Token", "Actions"].map((h) => (
                      <th key={h} className="px-5 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        {Array.from({ length: 6 }).map((__, j) => (
                          <td key={j} className="px-5 py-5"><div className="h-4 bg-muted rounded w-3/4" /></td>
                        ))}
                      </tr>
                    ))
                  ) : patients.length === 0 ? (
                    <tr><td colSpan={6} className="px-5 py-16 text-center text-[13px] text-muted-foreground">No patients found.</td></tr>
                  ) : patients.map((p) => (
                    <tr key={p.id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-5 py-4 text-[13px] font-bold text-foreground">{p.name || "Unknown"}</td>
                      <td className="px-5 py-4 text-[13px] font-medium text-foreground">{p.contact || "—"}</td>
                      <td className="px-5 py-4 text-[13px] font-medium text-foreground">
                        {[p.gender, p.age ? `${p.age} yrs` : null].filter(Boolean).join(" • ") || "—"}
                      </td>
                      <td className="px-5 py-4 text-[13px] font-medium text-foreground">{formatDate(p.createdAt)}</td>
                      <td className="px-5 py-4">
                        {p.todayToken ? (
                          <div className="flex items-center gap-2">
                            <TokenChip token={p.todayToken.displayToken} />
                            <StatusBadge status={p.todayToken.status} />
                          </div>
                        ) : (
                          <span className="text-[12px] text-muted-foreground font-medium">Not issued</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {p.todayToken ? (
                          <span className="text-[12px] text-muted-foreground font-medium italic">Token issued</span>
                        ) : (
                          <button
                            onClick={() => handleGenerateToken(p)}
                            disabled={generatingFor === p.id}
                            className="flex items-center gap-2 h-8 px-3 border border-[#3B4CB8]/20 bg-[#3B4CB8]/5 text-[#3B4CB8] rounded-[5px] text-[11px] font-bold hover:bg-[#3B4CB8] hover:text-white transition-all disabled:opacity-50"
                          >
                            {generatingFor === p.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Ticket className="w-3.5 h-3.5" />}
                            Generate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="md:hidden divide-y divide-border/60">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="p-4 space-y-3 animate-pulse">
                    <div className="h-5 bg-muted rounded w-1/2" />
                    <div className="h-4 bg-muted rounded w-1/3" />
                  </div>
                ))
              ) : patients.map((p) => (
                <div key={p.id} className="p-4 space-y-3 hover:bg-muted/5 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-[15px] font-bold text-foreground">{p.name || "Unknown"}</h3>
                      <p className="text-[13px] text-muted-foreground">{p.contact || "—"}</p>
                    </div>
                    {p.todayToken && <TokenChip token={p.todayToken.displayToken} />}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[12px]">
                    <div><span className="text-muted-foreground">Gender/Age: </span><span className="font-bold">{[p.gender, p.age ? `${p.age}y` : null].filter(Boolean).join(" • ") || "—"}</span></div>
                    <div><span className="text-muted-foreground">Reg: </span><span className="font-bold">{new Date(p.createdAt).toLocaleDateString()}</span></div>
                  </div>
                  {p.todayToken ? (
                    <div className="flex items-center gap-2">
                      <StatusBadge status={p.todayToken.status} />
                      <span className="text-[12px] text-muted-foreground">Token already issued today</span>
                    </div>
                  ) : (
                    <button onClick={() => handleGenerateToken(p)} disabled={generatingFor === p.id}
                      className="w-full h-10 bg-[#3B4CB8] text-white rounded-[5px] text-[12px] font-bold flex items-center justify-center gap-2 disabled:opacity-50">
                      {generatingFor === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ticket className="w-4 h-4" />}
                      Generate Token
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── History Tab ── */}
        {activeTab === "history" && (
          <>
            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-muted/30 border-b border-border/60">
                    {["Token", "Patient", "Mobile", "Issued At", "Status"].map((h) => (
                      <th key={h} className="px-5 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {history.length === 0 ? (
                    <tr><td colSpan={5} className="px-5 py-16 text-center text-[13px] text-muted-foreground">
                      {selectedDate ? `No tokens on ${format(selectedDate, "MMM dd, yyyy")}.` : "No token history yet."}
                    </td></tr>
                  ) : history.map((t) => (
                    <tr key={t.id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-5 py-4"><TokenChip token={t.displayToken} /></td>
                      <td className="px-5 py-4 text-[13px] font-bold text-foreground">{t.patient?.name || "Unknown"}</td>
                      <td className="px-5 py-4 text-[13px] font-medium text-foreground">{t.patient?.contact || "—"}</td>
                      <td className="px-5 py-4 text-[13px] font-medium text-foreground">{formatDate(t.createdAt)}</td>
                      <td className="px-5 py-4"><StatusBadge status={t.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="md:hidden divide-y divide-border/60">
              {history.length === 0 ? (
                <div className="p-10 text-center text-[13px] text-muted-foreground">No token history yet.</div>
              ) : history.map((t) => (
                <div key={t.id} className="p-4 space-y-3 hover:bg-muted/5 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TokenChip token={t.displayToken} />
                      <StatusBadge status={t.status} />
                    </div>
                    <span className="text-[12px] text-muted-foreground">{new Date(t.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-foreground">{t.patient?.name || "Unknown"}</p>
                    <p className="text-[12px] text-muted-foreground">{t.patient?.contact || "—"}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <TokenGeneratedModal isOpen={showTokenModal} onClose={() => setShowTokenModal(false)} token={generatedToken} />
      <PrefixModal
        isOpen={showPrefixModal}
        currentPrefix={prefix}
        onClose={() => setShowPrefixModal(false)}
        onSave={(p) => { setPrefix(p); fetchStats(); }}
      />
    </div>
  );
}
