"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, Filter, Calendar, User, Activity, 
  Eye, Download, RefreshCcw, ShieldCheck,
  ChevronLeft, ChevronRight, Info, AlertCircle,
  X, ChevronDown, ChevronUp, Database,
  Lock, Key, Users, LayoutDashboard, Globe, Terminal
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const ROLE_PERMISSIONS = [
  { module: "User Management", roles: ["SUPERADMIN"], icon: Users, color: "text-blue-500", bg: "bg-blue-500/5", border: "border-blue-500/20" },
  { module: "Branch Management", roles: ["SUPERADMIN"], icon: Globe, color: "text-emerald-500", bg: "bg-emerald-500/5", border: "border-emerald-500/20" },
  { module: "Master Data", roles: ["SUPERADMIN", "BRANCH_ADMIN"], icon: Database, color: "text-amber-500", bg: "bg-amber-500/5", border: "border-amber-500/20" },
  { module: "Templates", roles: ["SUPERADMIN", "BRANCH_ADMIN"], icon: LayoutDashboard, color: "text-purple-500", bg: "bg-purple-500/5", border: "border-purple-500/20" },
  { module: "System Logs", roles: ["SUPERADMIN"], icon: ShieldCheck, color: "text-rose-500", bg: "bg-rose-500/5", border: "border-rose-500/20" },
];

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0, totalPages: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    module: "",
    from: "",
    to: ""
  });
  const [expandedId, setExpandedId] = useState(null);
  const [showPermissions, setShowPermissions] = useState(false);

  const fetchLogs = async (page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      let url = `/api/audit-logs?page=${page}&limit=${pagination.limit}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
      if (filters.module) url += `&module=${encodeURIComponent(filters.module)}`;
      if (filters.from) url += `&from=${filters.from}`;
      if (filters.to) url += `&to=${filters.to}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Safety check for non-JSON or error responses
      if (!res.ok) {
        const errorText = await res.text();
        console.error("API Error Response:", errorText);
        throw new Error(`Server returned ${res.status}: ${errorText.substring(0, 100)}`);
      }

      const json = await res.json();
      
      if (json.success) {
        setLogs(json.data.logs);
        setPagination(json.data.pagination);
      } else {
        toast.error(json.message || "Trace acquisition failed");
      }
    } catch (error) {
      console.error("Fetch logs error:", error);
      toast.error("An error occurred while fetching logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLogs(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, filters]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getActionStyle = (action) => {
    if (action.includes("CREATE") || action.includes("POST")) return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    if (action.includes("UPDATE") || action.includes("PATCH") || action.includes("PUT")) return "bg-sky-500/10 text-sky-600 border-sky-500/20";
    if (action.includes("DELETE")) return "bg-rose-500/10 text-rose-600 border-rose-500/20";
    if (action.includes("LOGIN")) return "bg-violet-500/10 text-violet-600 border-violet-500/20";
    return "bg-slate-500/10 text-slate-600 border-slate-500/20";
  };

  return (
    <div className="p-8 bg-[#F8F9FC] dark:bg-[#080B14] min-h-screen space-y-8 font-sans transition-all duration-500">
      
      {/* ── HEADER DESIGN – CRISP & MODERN ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-primary" />
             </div>
             <h1 className="text-3xl font-black text-[#1e293b] dark:text-white tracking-tighter">
                Control Hub <span className="text-primary italic font-medium tracking-normal text-sm ml-2 px-3 py-1 bg-primary/5 rounded-full border border-primary/10">Audit Traces</span>
             </h1>
          </div>
          <p className="text-[12px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-[2px] ml-13"> Forensic Activity Log & Security Monitor </p>
        </div>

        <div className="flex items-center gap-3 ml-13 md:ml-0">
          <button 
            onClick={() => setShowPermissions(!showPermissions)}
            className={cn(
              "group relative px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 border",
              showPermissions 
                ? "bg-primary text-white border-primary" 
                : "bg-white dark:bg-white/[0.03] border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-primary/40"
            )}
          >
            <span className="flex items-center gap-2">
               <Lock className={cn("w-4 h-4 transition-transform", showPermissions && "scale-110")} />
               Auth Map
            </span>
          </button>
          <button 
            onClick={() => fetchLogs(pagination.page)}
            className="p-3 rounded-xl bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 text-gray-500 hover:text-primary hover:border-primary/40 transition-all duration-300"
          >
            <RefreshCcw className={cn("w-5 h-5", loading && "animate-spin")} />
          </button>
        </div>
      </div>

      {/* ── EXCITING AUTHORIZATION BOXES ── */}
      <AnimatePresence>
        {showPermissions && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-2">
              {ROLE_PERMISSIONS.map((perm, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -5 }}
                  className={cn(
                    "relative p-5 rounded-2xl border transition-all duration-300",
                    perm.bg, perm.border
                  )}
                >
                   <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", perm.bg)}>
                      <perm.icon className={cn("w-5 h-5", perm.color)} />
                   </div>
                   <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-1.5">{perm.module}</h3>
                   <div className="flex flex-wrap gap-1">
                      {perm.roles.map(r => (
                        <span key={r} className="text-[9px] font-black text-primary uppercase tracking-tighter">@{r}</span>
                      ))}
                   </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SEARCH & FILTER BOX – FLAT & CRISP ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 bg-white dark:bg-white/[0.02] p-2 rounded-2xl border border-gray-200 dark:border-white/10">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Trace by Actor, Action or IP..."
            className="w-full h-12 pl-12 pr-4 bg-transparent border-none outline-none text-sm font-bold text-gray-700 dark:text-white placeholder:text-gray-400 placeholder:font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 border-l border-gray-100 dark:border-white/5 pl-4">
           <Activity className="w-4 h-4 text-gray-300" />
           <select 
            className="w-full h-12 bg-transparent border-none outline-none text-[12px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-300 cursor-pointer"
            value={filters.module}
            onChange={(e) => setFilters(prev => ({ ...prev, module: e.target.value }))}
          >
            <option value="">Functional Unit: ALL</option>
            <option value="USER_MANAGEMENT">@User_Management</option>
            <option value="BRANCH_MANAGEMENT">@Branch_Management</option>
            <option value="AUTHENTICATION">@Authentication</option>
            <option value="MASTER_DATA">@Master_Data</option>
            <option value="TEMPLATES">@Templates</option>
          </select>
        </div>

        <div className="flex items-center gap-4 border-l border-gray-100 dark:border-white/5 pl-4">
           <div className="flex items-center gap-2 w-full">
              <Calendar className="w-4 h-4 text-gray-300" />
              <div className="flex items-center gap-2 w-full">
                <input type="date" value={filters.from} onChange={(e)=>setFilters(p=>({...p,from:e.target.value}))} className="bg-transparent border-none outline-none text-[10px] font-black text-gray-500 uppercase flex-1" />
                <span className="text-gray-300">/</span>
                <input type="date" value={filters.to} onChange={(e)=>setFilters(p=>({...p,to:e.target.value}))} className="bg-transparent border-none outline-none text-[10px] font-black text-gray-500 uppercase flex-1" />
              </div>
           </div>
        </div>

        <div className="flex items-center justify-end px-4">
          <button 
            onClick={() => { setSearchQuery(""); setFilters({ module: "", from: "", to: "" }); }}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            title="Reset Filters"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ── ACTIVITY STREAM – BOX DESIGN ── */}
      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-2xl animate-pulse" />
          ))
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-3xl">
             <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-gray-300" />
             </div>
             <p className="text-sm font-black text-gray-400 uppercase tracking-[3px]">Forensic Buffer Empty</p>
          </div>
        ) : (
          logs.map((log) => (
            <div 
              key={log.id}
              className={cn(
                "group relative bg-white dark:bg-white/[0.02] border transition-all duration-500 rounded-2xl overflow-hidden",
                expandedId === log.id 
                  ? "border-primary/40 bg-primary/[0.02]" 
                  : "border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20"
              )}
            >
              {/* Row Header */}
              <div 
                className="p-5 md:p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6"
                onClick={() => toggleExpand(log.id)}
              >
                <div className="flex items-center gap-6">
                   <div className="hidden md:flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-[#F8F9FC] dark:bg-white/5 border border-gray-100 dark:border-white/5 group-hover:border-primary/20 transition-colors">
                      <span className="text-[12px] font-black text-gray-900 dark:text-white leading-none mb-1">{format(new Date(log.createdAt), "dd")}</span>
                      <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">{format(new Date(log.createdAt), "MMM")}</span>
                   </div>
                   
                   <div className="space-y-1">
                      <div className="flex items-center gap-3">
                         <h3 className="text-[14px] font-black text-gray-900 dark:text-white capitalize tracking-tight font-sans">
                            {log.userName || "Security_Node"}
                         </h3>
                         <span className="text-[9px] px-2 py-0.5 rounded-[4px] bg-primary/5 text-primary font-black uppercase tracking-widest border border-primary/10">
                            {log.userRole || "CORE"}
                         </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-gray-500 font-semibold lowercase tracking-tight">
                         <span>{log.userEmail}</span>
                         <span className="text-gray-300 text-[10px]">|</span>
                         <span className="font-mono text-[9px] text-gray-400 font-bold tracking-widest">{format(new Date(log.createdAt), "HH:mm:ss")}</span>
                      </div>
                   </div>
                </div>

                <div className="flex-1 max-w-md hidden lg:block px-8 border-x border-gray-100 dark:border-white/5">
                   <div className="flex items-center gap-2 mb-2">
                      <Terminal className="w-3.5 h-3.5 text-gray-300" />
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-[2px] mb-0.5">{log.module}</span>
                   </div>
                   <div className={cn(
                      "inline-flex items-center px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-colors",
                      getActionStyle(log.action)
                   )}>
                      {log.action}
                   </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 shrink-0">
                   <div className={cn(
                      "flex items-center gap-2 text-[11px] font-black uppercase tracking-[2px]",
                      log.status === "SUCCESS" ? "text-emerald-500" : "text-rose-500"
                   )}>
                      <div className={cn("w-2 h-2 rounded-full animate-pulse", log.status === "SUCCESS" ? "bg-emerald-500" : "bg-rose-500")} />
                      {log.status || "SUCCESS"}
                   </div>
                   <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 dark:bg-white/5 text-gray-400 group-hover:text-primary transition-colors">
                      {expandedId === log.id ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5" />}
                   </div>
                </div>
              </div>

              {/* Accordion Content with Framer Motion Height Animation */}
              <AnimatePresence>
                {expandedId === log.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                  >
                    <div className="p-8 pt-2 border-t border-gray-100 dark:border-white/5 bg-gray-50/30 dark:bg-black/10">
                       <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 mt-6 relative z-10">
                          
                          {/* Descriptive Metadata */}
                          <div className="space-y-8">
                             <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-primary uppercase tracking-[4px] flex items-center gap-2 pl-1">
                                   <Activity className="w-4 h-4" /> Trace Visualization
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                   <div className="bg-white dark:bg-white/[0.03] p-5 rounded-2xl border border-gray-100 dark:border-white/10">
                                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 opacity-50">Functional Node</p>
                                      <p className="text-[12px] font-black text-gray-900 dark:text-white uppercase tracking-wider">{log.module}</p>
                                   </div>
                                   <div className="bg-white dark:bg-white/[0.03] p-5 rounded-2xl border border-gray-100 dark:border-white/10">
                                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 opacity-50">Operation Result</p>
                                      <div className="flex items-center gap-2">
                                         <div className={cn("w-1.5 h-1.5 rounded-full", log.status === 'SUCCESS' ? "bg-emerald-500" : "bg-rose-500")} />
                                         <p className={cn("text-[12px] font-black uppercase tracking-widest", log.status === 'SUCCESS' ? "text-emerald-500" : "text-rose-500")}>
                                            {log.status || "SUCCESS"}
                                         </p>
                                      </div>
                                   </div>
                                </div>
                                <div className="bg-white dark:bg-white/[0.03] p-6 rounded-3xl border border-gray-100 dark:border-white/10 space-y-4">
                                   <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center">
                                         <Globe className="w-4 h-4 text-gray-400" />
                                      </div>
                                      <div>
                                         <p className="text-[9px] font-black text-gray-400 uppercase tracking-[2px] mb-0.5">Origin Protocol (IPv4)</p>
                                         <p className="text-[13px] font-mono font-black text-gray-800 dark:text-gray-200">{log.ipAddress || "127.0.0.1"}</p>
                                      </div>
                                   </div>
                                   <div className="pt-4 border-t border-gray-100 dark:border-white/5">
                                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-[2px] mb-2 pl-1">Client Authorization String</p>
                                      <div className="text-[11px] text-gray-500 font-medium leading-relaxed font-mono bg-gray-50/50 dark:bg-black/20 p-4 rounded-xl border border-gray-100 dark:border-white/5">
                                         {log.userAgent}
                                      </div>
                                   </div>
                                </div>
                             </div>
                          </div>

                          {/* Code Trace Payload */}
                          <div className="space-y-4">
                             <div className="flex items-center justify-between pl-1">
                                <h4 className="text-[10px] font-black text-primary uppercase tracking-[4px] flex items-center gap-2">
                                   <Database className="w-4 h-4" /> State Interaction Payload
                                </h4>
                                <button 
                                  onClick={() => { navigator.clipboard.writeText(JSON.stringify(log.details, null, 2)); toast.success("Buffer Updated: Forensic Payload Seeded"); }}
                                  className="text-[10px] font-black text-primary hover:bg-primary/5 px-4 py-1.5 rounded-lg border border-primary/20 transition-all uppercase tracking-widest"
                                >
                                  Seed Buffer
                                </button>
                             </div>
                             <div className="bg-[#05070D] p-1 rounded-[2.5rem] border border-white/5 shadow-2xl relative">
                                <div className="absolute top-6 left-6 flex gap-2 z-20">
                                   <div className="w-2.5 h-2.5 rounded-full bg-rose-500/30 border border-rose-500/20" />
                                   <div className="w-2.5 h-2.5 rounded-full bg-amber-500/30 border border-amber-500/20" />
                                   <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/30 border border-emerald-500/20" />
                                </div>
                                <div className="bg-black/40 p-10 pt-16 rounded-[2.2rem] border border-white/[0.02]">
                                   <pre className="text-[13px] font-mono text-cyan-400/80 overflow-x-auto custom-scrollbar max-h-[400px] leading-relaxed selection:bg-cyan-500/20">
                                      {JSON.stringify(log.details, null, 2)}
                                   </pre>
                                </div>
                             </div>
                          </div>

                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>

      {/* ── FOOTER PAGINATION – MINIMALIST ── */}
      {!loading && logs.length > 0 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-10 border-t border-gray-200 dark:border-white/10">
          <div className="text-[11px] font-black text-gray-400 uppercase tracking-[3px] border-l-2 border-primary/40 pl-6">
            PAGE <span className="text-gray-900 dark:text-white mx-1">{pagination.page}</span> / <span className="text-gray-900 dark:text-white mx-1">{pagination.totalPages}</span>
            <span className="mx-4 text-gray-200 dark:text-white/10">|</span>
            TOTAL TRACES: <span className="text-gray-900 dark:text-white ml-1">{pagination.total}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="w-12 h-12 rounded-2xl border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-white hover:border-primary/50 transition-all disabled:opacity-30 disabled:hover:border-gray-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1.5">
               {Array.from({ length: Math.min(5, pagination.totalPages) }).map((_, i) => {
                 const p = i + 1;
                 return (
                   <button 
                    key={p} onClick={()=>handlePageChange(p)}
                    className={cn(
                      "w-12 h-12 rounded-2xl text-xs font-black uppercase tracking-tighter transition-all duration-300",
                      pagination.page === p ? "bg-primary text-white" : "bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-primary/40"
                    )}
                   > {p} </button>
                 )
               })}
            </div>
            <button 
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="w-12 h-12 rounded-2xl border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-white hover:border-primary/50 transition-all disabled:opacity-30 disabled:hover:border-gray-200"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
