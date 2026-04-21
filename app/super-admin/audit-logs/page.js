"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Search, Filter, Calendar as CalendarIcon, User, Activity, 
  Eye, Download, RefreshCcw, ShieldCheck,
  ChevronLeft, ChevronRight, Info, AlertCircle,
  X, ChevronDown, ChevronUp, Database,
  Lock, Key, Users, LayoutDashboard, Globe, Terminal,
  Plus, UserPlus, ArrowLeft, Building2, Check
} from "lucide-react";
import { format, startOfDay, endOfDay } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CustomCalendar } from "@/components/ui/custom-calendar";

const API_BASE = "/api";

// --- AUDIT STATS COMPONENT ---
function AuditStats({ stats }) {
  const cards = [
    { title: "Total traces", value: stats.totalTraces, icon: ShieldCheck, color: "blue" },
    { title: "Successful ops", value: stats.successfulOps, icon: Activity, color: "emerald" },
    { title: "Failed attempts", value: stats.failedAttempts, icon: AlertCircle, color: "red" },
    { title: "Unique actors", value: stats.uniqueActors, icon: Users, color: "indigo" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
      {cards.map((stat, i) => (
        <div key={i} className="bg-white dark:bg-[#101935] p-5 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 flex items-center gap-4 transition-all">
          <div className={cn(
            "w-12 h-12 rounded-[5px] flex items-center justify-center shrink-0",
            stat.color === "blue" && "bg-primary/10 text-primary",
            stat.color === "indigo" && "bg-indigo-50 text-indigo-500",
            stat.color === "emerald" && "bg-emerald-50 text-emerald-500",
            stat.color === "red" && "bg-red-50 text-red-500",
          )}>
            <stat.icon className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-bold text-gray-400 leading-none mb-1.5 truncate">{stat.title}</p>
            <p className="text-[20px] font-bold text-[#1e293b] dark:text-white leading-none truncate">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AuditLogsPage() {
  const router = useRouter();
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ totalTraces: 0, successfulOps: 0, failedAttempts: 0, uniqueActors: 0, modules: [] });
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [moduleFilter, setModuleFilter] = useState("All");
  const [expandedId, setExpandedId] = useState(null);
  const [openPicker, setOpenPicker] = useState(null); // 'from' or 'to'
  const pickerRef = useRef(null);
  
  const [dateFilters, setDateFilters] = useState({ from: "", to: "" });

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("authtoken");
      const res = await fetch(`${API_BASE}/audit-logs/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success) setStats(json.data);
    } catch (e) {
      console.error("Failed to fetch audit stats", e);
    }
  };

  const fetchLogs = async (page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authtoken");
      
      let url = `${API_BASE}/audit-logs?page=${page}&limit=${pagination.limit}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
      if (moduleFilter !== "All") url += `&module=${encodeURIComponent(moduleFilter)}`;
      
      const from = dateFilters.from;
      const to = dateFilters.to;
      
      if (from && !to) {
        const d = new Date(from);
        url += `&from=${startOfDay(d).toISOString()}&to=${endOfDay(d).toISOString()}`;
      } else {
        if (from) url += `&from=${startOfDay(new Date(from)).toISOString()}`;
        if (to) url += `&to=${endOfDay(new Date(to)).toISOString()}`;
      }

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const json = await res.json();
      if (json.success) {
        setLogs(json.data.logs);
        setPagination(json.data.pagination);
      }
    } catch (error) {
      console.error("Fetch logs error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLogs(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, moduleFilter, dateFilters]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) setOpenPicker(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRefresh = () => {
    fetchStats();
    fetchLogs(pagination.page);
    toast.success("Logs synchronized");
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatAction = (action, status) => {
    if (!action) return "Unknown Action";
    const map = {
      "USER_LOGIN": status === "SUCCESS" ? "User logged in" : "User login failed",
      "USER_LOGOUT": "User logged out",
      "PROVISION_USER": "Provisioned new personnel",
      "CREATE_BRANCH": "Created new branch",
      "PUT_MASTER-DATA": "Updated master data entry",
      "POST_MASTER-DATA": "Created new master data entry",
      "DELETE_MASTER-DATA": "Removed master data entry",
      "PUT_USERS": "Updated user profile",
      "PUT_BRANCHES": "Modified branch configuration",
    };
    if (map[action]) return map[action];
    let friendly = action.replace(/-/g, ' ').replace(/_/g, ' ').toLowerCase();
    friendly = friendly.replace(/^put /, 'updated ').replace(/^post /, 'created ').replace(/^delete /, 'removed ').replace(/^patch /, 'modified ');
    return friendly.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const formatRole = (role) => {
    if (!role) return "Guest";
    if (role === "SUPERADMIN") return "Super Admin";
    return role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  const dynamicModules = stats.modules || [];

  return (
    <div className="p-4 lg:p-6 bg-[#F8F9FC] dark:bg-[#0A0F1D] min-h-screen flex flex-col transition-colors duration-300 font-sans pb-10">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-gray-500 hover:text-primary transition-all shadow-none shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-[18px] lg:text-[20px] font-bold text-[#1e293b] dark:text-white tracking-tight leading-none">
            System audit logs
          </h1>
        </div>
        
        <button 
          onClick={handleRefresh}
          className="bg-primary text-white px-6 lg:px-8 h-[44px] lg:h-[48px] rounded-[5px] text-[13px] font-bold flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-none whitespace-nowrap"
        >
          <RefreshCcw className={cn("w-4 h-4", loading && "animate-spin")} />
          Sync traces
        </button>
      </div>

      <AuditStats stats={stats} />

      {/* Filter Bar */}
      <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-4 bg-white dark:bg-[#101935] p-3 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 shadow-none mb-6">
        <div className="relative w-full xl:w-[380px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search logs by actor, action or ip..." 
            className="w-full h-11 pl-11 pr-4 bg-[#F8F9FC] dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-medium outline-none focus:border-primary transition-all shadow-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-11 px-5 bg-[#F8F9FC] dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-bold text-gray-600 dark:text-gray-300 flex items-center justify-between gap-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-all outline-none shadow-none min-w-[200px]">
                    <span className="capitalize">{moduleFilter === "All" ? "Filter by module" : moduleFilter.replace(/_/g, ' ').toLowerCase()}</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[240px] border-[#E7E8EB] dark:border-white/10 shadow-xl rounded-[5px] p-1 max-h-[300px] overflow-y-auto custom-scrollbar">
                <DropdownMenuItem 
                  onClick={() => setModuleFilter("All")} 
                  className={cn("rounded-[5px] text-[13px] font-medium px-3 py-2 cursor-pointer transition-colors", moduleFilter === "All" ? "bg-primary/5 text-primary font-bold" : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5")}
                >
                  All modules
                  {moduleFilter === "All" && <Check className="w-4 h-4 ml-auto" />}
                </DropdownMenuItem>
                {dynamicModules.map(mod => (
                   <DropdownMenuItem 
                    key={mod} 
                    onClick={() => setModuleFilter(mod)} 
                    className={cn("rounded-[5px] text-[13px] font-medium px-3 py-2 cursor-pointer transition-colors", moduleFilter === mod ? "bg-primary/5 text-primary font-bold" : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5")}
                   >
                    <span className="capitalize">{mod.replace(/_/g, ' ').toLowerCase()}</span>
                    {moduleFilter === mod && <Check className="w-4 h-4 ml-auto" />}
                   </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Date Range Picker */}
            <div className="relative flex items-center bg-[#F8F9FC] dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] group h-11 w-full sm:w-auto" ref={pickerRef}>
              <div className="pl-4 pr-2 py-3 border-r border-[#E7E8EB] dark:border-white/10 shrink-0">
                <CalendarIcon className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
              </div>
              <div className="flex items-center px-1">
                <button 
                  onClick={() => setOpenPicker(openPicker === 'from' ? null : 'from')} 
                  className={cn(
                    "px-4 py-2 text-[12px] font-bold transition-all text-left min-w-[125px] whitespace-nowrap", 
                    dateFilters.from ? "text-[#1e293b] dark:text-white" : "text-gray-400"
                  )}
                >
                  {dateFilters.from ? format(new Date(dateFilters.from), "dd-MM-yyyy") : "start date"}
                </button>
                <div className="h-4 border-r border-gray-300 dark:border-white/20 mx-1 shrink-0" />
                <button 
                  onClick={() => setOpenPicker(openPicker === 'to' ? null : 'to')} 
                  className={cn(
                    "px-4 py-2 text-[12px] font-bold transition-all text-left min-w-[125px] whitespace-nowrap", 
                    dateFilters.to ? "text-[#1e293b] dark:text-white" : "text-gray-400"
                  )}
                >
                  {dateFilters.to ? format(new Date(dateFilters.to), "dd-MM-yyyy") : "end date"}
                </button>
              </div>
              {/* Picker Popovers - Aligned to right to prevent screen overflow */}
              <AnimatePresence>
                {openPicker === 'from' && (
                  <div className="absolute top-[105%] right-0 z-[200]">
                    <CustomCalendar 
                      selectedDate={dateFilters.from ? new Date(dateFilters.from) : null}
                      onSelect={(date) => {
                        setDateFilters(p => ({ ...p, from: date ? date.toISOString() : "" }));
                        setOpenPicker(null);
                      }}
                      onClose={() => setOpenPicker(null)}
                    />
                  </div>
                )}
                {openPicker === 'to' && (
                  <div className="absolute top-[105%] right-0 z-[200]">
                    <CustomCalendar 
                      selectedDate={dateFilters.to ? new Date(dateFilters.to) : null}
                      onSelect={(date) => {
                        setDateFilters(p => ({ ...p, to: date ? date.toISOString() : "" }));
                        setOpenPicker(null);
                      }}
                      onClose={() => setOpenPicker(null)}
                    />
                  </div>
                )}
              </AnimatePresence>
              {(dateFilters.from || dateFilters.to) && (
                <button onClick={() => { setDateFilters({ from: "", to: "" }); setOpenPicker(null); }} className="px-3 hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-all border-l border-[#E7E8EB] dark:border-white/10 h-full">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-[#101935] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 shadow-none overflow-hidden pb-4 flex-1">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse table-fixed min-w-[1000px]">
            <colgroup>
              <col className="w-[120px]" />
              <col className="w-[200px]" />
              <col className="w-[180px]" />
              <col className="w-[220px]" />
              <col className="w-[100px]" />
              <col className="w-[150px]" />
            </colgroup>
            <thead>
              <tr className="bg-[#F8FAFC] dark:bg-white/[0.02]">
                <th className="px-8 py-5 text-left text-[12px] font-bold text-gray-400 border-b border-[#E7E8EB] dark:border-white/10">Status</th>
                <th className="px-8 py-5 text-left text-[12px] font-bold text-gray-400 border-b border-[#E7E8EB] dark:border-white/10">Action</th>
                <th className="px-8 py-5 text-left text-[12px] font-bold text-gray-400 border-b border-[#E7E8EB] dark:border-white/10">Resource</th>
                <th className="px-8 py-5 text-left text-[12px] font-bold text-gray-400 border-b border-[#E7E8EB] dark:border-white/10">Performed by</th>
                <th className="px-8 py-5 text-left text-[12px] font-bold text-gray-400 border-b border-[#E7E8EB] dark:border-white/10">Details</th>
                <th className="px-8 py-5 text-right text-[12px] font-bold text-gray-400 border-b border-[#E7E8EB] dark:border-white/10">Date & time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E8EB] dark:divide-white/10">
              {logs.length === 0 && !loading ? (
                <tr>
                  <td colSpan="6" className="px-8 py-24 text-center text-gray-400 font-bold text-[12px] opacity-60">
                     System records status: empty
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <React.Fragment key={log.id}>
                    <tr className={cn("hover:bg-[#F8FAFC]/80 dark:hover:bg-white/[0.01] transition-all group cursor-pointer", expandedId === log.id && "bg-[#F8FAFC]/50 dark:bg-white/[0.02]")} onClick={() => toggleExpand(log.id)}>
                      <td className="px-8 py-6">
                        <span className={cn("inline-flex px-3 py-1 rounded-[5px] text-[11px] font-bold border leading-none items-center justify-center", log.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-red-100 text-red-700 border-red-200')}>
                          {log.status === 'SUCCESS' ? "Success" : "Failed"}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-[14px] font-bold text-[#1e293b] dark:text-white leading-tight truncate">
                           {formatAction(log.action, log.status)}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 truncate">
                           <div className="w-1.5 h-1.5 rounded-full bg-primary/20 shrink-0" />
                           <span className="text-[12px] font-bold text-gray-500 dark:text-gray-400 truncate capitalize">{log.module.toLowerCase().replace(/_/g, ' ')}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex flex-col truncate">
                            <span className="text-[14px] font-bold text-[#1e293b] dark:text-white truncate">{log.userName || "System node"}</span>
                            <span className="text-[10px] font-bold text-primary">{formatRole(log.userRole)}</span>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className={cn("w-8 h-8 rounded-[5px] flex items-center justify-center border transition-all duration-300", expandedId === log.id ? "bg-primary/10 border-primary/20 text-primary" : "bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-400 group-hover:border-primary/20 group-hover:text-primary")}>
                           {expandedId === log.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex flex-col items-end shrink-0">
                           <span className="text-[13px] font-bold text-[#1e293b] dark:text-white">{format(new Date(log.createdAt), "dd MMM yyyy")}</span>
                           <span className="text-[10px] font-bold text-gray-400 font-mono">{format(new Date(log.createdAt), "HH:mm:ss")}</span>
                        </div>
                      </td>
                    </tr>
                    <AnimatePresence initial={false}>
                      {expandedId === log.id && (
                        <tr className="bg-gray-50/50 dark:bg-white/[0.01]">
                          <td colSpan="6" className="px-0 py-0 overflow-hidden">
                            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
                              <div className="p-8 border-t border-[#E7E8EB] dark:border-white/10">
                                <div className="space-y-4">
                                     <h4 className="text-[10px] font-bold text-primary pl-1">Forensic state payload</h4>
                                     <div className="bg-[#05070D] p-1 rounded-[5px] border border-white/5">
                                        <div className="bg-black/40 p-6 rounded-[5px] max-h-[400px] overflow-auto custom-scrollbar">
                                           <pre className="text-[13px] font-mono text-cyan-400/80 leading-relaxed font-sans">{JSON.stringify(log.details, null, 2)}</pre>
                                        </div>
                                     </div>
                                </div>
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Premium Pagination Footer */}
      {!loading && logs.length > 0 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mt-6 py-6 border-t border-[#E7E8EB] dark:border-white/10">
           <div className="flex items-center gap-3">
             <div className="p-2.5 bg-primary/5 rounded-[5px] border border-primary/10 shrink-0">
                <Database className="w-4 h-4 text-primary" />
             </div>
             <div className="flex flex-col min-w-0">
                <span className="text-[12px] font-bold text-[#1e293b] dark:text-white leading-none mb-1">Trace Explorer</span>
                <p className="text-[11px] font-bold text-gray-400 truncate">
                  Showing <span className="text-primary">{logs.length}</span> of <span className="text-gray-900 dark:text-white">{pagination.total}</span> events
                </p>
             </div>
          </div>
          
          <div className="flex items-center gap-2 lg:gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            <button onClick={() => fetchLogs(pagination.page - 1)} disabled={pagination.page === 1} className="px-4 h-11 bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[12px] font-bold text-gray-500 hover:text-primary hover:border-primary flex items-center gap-2 transition-all disabled:opacity-30 shadow-none shrink-0">
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <div className="flex items-center gap-1.5 lg:gap-2 px-1 lg:px-2">
               {Array.from({ length: Math.min(5, pagination.totalPages) }).map((_, i) => {
                 const p = i + 1;
                 const isActive = pagination.page === p;
                 return (
                   <button key={p} onClick={()=>fetchLogs(p)} className={cn("w-10 h-10 lg:w-11 lg:h-11 rounded-[5px] text-[13px] font-bold transition-all flex items-center justify-center border shrink-0", isActive ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" : "bg-white dark:bg-[#101935] border-[#E7E8EB] dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-primary/40 hover:text-primary")}>
                     {p} 
                   </button>
                 )
               })}
               {pagination.totalPages > 5 && <span className="text-gray-400 font-bold px-1 select-none">...</span>}
            </div>
            <button onClick={() => fetchLogs(pagination.page + 1)} disabled={pagination.page === pagination.totalPages} className="px-4 h-11 bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[12px] font-bold text-gray-500 hover:text-primary hover:border-primary flex items-center gap-2 transition-all disabled:opacity-30 shadow-none shrink-0">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/50 dark:bg-[#0A0F1D]/50 backdrop-blur-sm z-50">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
          <p className="text-[11px] font-bold text-gray-400 font-mono">Decoding forensic buffers...</p>
        </div>
      )}
    </div>
  );
}
