"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, Plus, ChevronDown, Edit3, Trash2, 
  LayoutGrid, List, CheckCircle2, Clock, 
  Building2, Calendar, AlertTriangle, LogOut, LogIn,
  Check, Filter, X
} from "lucide-react";
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

// --- COMPACT STAT CARD ---
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-card p-5 rounded-[5px] border border-border flex items-center gap-4 transition-all w-full">
    <div
      className={cn(
        "w-12 h-12 rounded-[5px] flex items-center justify-center shrink-0",
        color === "blue" && "bg-primary/10 text-primary",
        color === "rose" && "bg-rose-500/10 text-rose-500",
        color === "emerald" && "bg-emerald-500/10 text-emerald-500",
        color === "amber" && "bg-amber-500/10 text-amber-500",
        color === "indigo" && "bg-indigo-500/10 text-indigo-500"
      )}
    >
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-[11px] font-bold text-muted-foreground leading-none mb-1.5 uppercase tracking-wider">
        {title}
      </p>
      <p className="text-[20px] font-bold text-foreground leading-none">
        {value}
      </p>
    </div>
  </div>
);

// --- CUSTOM SELECT FOR FILTERS ---
const CustomSelect = ({ value, onChange, options, placeholder, icon: Icon, className }) => (
  <DropdownMenu>
    <DropdownMenuTrigger className={cn("flex items-center gap-3 bg-card px-4 h-[44px] rounded-[5px] border border-border hover:border-primary transition-all outline-none group min-w-[180px] shadow-none w-full sm:w-auto", className)}>
      {Icon && <Icon className="w-4 h-4 text-primary shrink-0" />}
      <span className={cn("text-[13px] font-bold flex-1 text-left truncate", !value && "text-muted-foreground")}>
        {options.find(opt => opt.value === value)?.label || placeholder}
      </span>
      <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start" className="w-[calc(100vw-48px)] sm:w-[200px] border-border bg-card p-1 shadow-xl rounded-[5px] z-[500]">
      {options.map((opt) => (
        <DropdownMenuItem 
          key={opt.value} 
          onClick={() => onChange(opt.value)}
          className="flex items-center justify-between px-3 py-2 text-[13px] font-semibold cursor-pointer rounded-[3px] mb-0.5"
        >
          {opt.label}
          {value === opt.value && <Check className="w-4 h-4 text-primary" />}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);

export default function SuperAdminAdmissionsPage() {
  const router = useRouter();
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branchSearch, setBranchSearch] = useState("");
  
  const [activeTab, setActiveTab] = useState("Admissions");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [admissions, setAdmissions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [stats, setStats] = useState({ todayAdmissions: 0, todayDischarges: 0, inProgress: 0, pending: 0 });
  
  const [deleteId, setDeleteId] = useState(null);
  const [dischargeId, setDischargeId] = useState(null);
  const [admitId, setAdmitId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDischarging, setIsDischarging] = useState(false);
  const [isAdmitting, setIsAdmitting] = useState(false);

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    if (selectedBranch) {
      fetchData();
      fetchDepartments();
    }
  }, [selectedBranch, activeTab, selectedDept, selectedStatus]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (selectedBranch) fetchData();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchBranches = async () => {
    try {
      const token = localStorage.getItem("authtoken");
      const res = await fetch("/api/branches", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setBranches(data.data);
        if (data.data.length > 0) setSelectedBranch(data.data[0]);
      }
    } catch (e) {
      toast.error("Failed to load branches");
    }
  };

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem("authtoken");
      const res = await fetch(`/api/wards/overview?branchId=${selectedBranch.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setDepartments(Array.isArray(data) ? data : []);
    } catch (e) {}
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authtoken");
      const headers = { "Authorization": `Bearer ${token}` };
      
      const queryParams = new URLSearchParams({
        branchId: selectedBranch.id,
        type: activeTab.toLowerCase(),
        search: searchQuery,
        departmentId: selectedDept,
        status: selectedStatus
      });

      const [admissionsRes, statsRes] = await Promise.all([
        fetch(`/api/admissions/overview?${queryParams}`, { headers }),
        fetch(`/api/admissions/stats?branchId=${selectedBranch.id}`, { headers })
      ]);

      const admissionsData = await admissionsRes.json();
      const statsData = await statsRes.json();

      setAdmissions(Array.isArray(admissionsData) ? admissionsData : []);
      setStats(statsData);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDischarge = async () => {
    if (!dischargeId) return;
    try {
      setIsDischarging(true);
      const token = localStorage.getItem("authtoken");
      const res = await fetch(`/api/admissions/${dischargeId}?branchId=${selectedBranch.id}`, {
        method: "PATCH",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: "Completed" })
      });
      if (res.ok) {
        toast.success("Patient discharged successfully");
        fetchData();
        setDischargeId(null);
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to discharge");
      }
    } catch (error) {
      toast.error("Connection error");
    } finally {
      setIsDischarging(false);
    }
  };

  const handleAdmit = async () => {
    if (!admitId) return;
    try {
      setIsAdmitting(true);
      const token = localStorage.getItem("authtoken");
      const res = await fetch(`/api/admissions/${admitId}?branchId=${selectedBranch.id}`, {
        method: "PATCH",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: "In Progress" })
      });
      if (res.ok) {
        toast.success("Patient re-admitted successfully");
        fetchData();
        setAdmitId(null);
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to re-admit");
      }
    } catch (error) {
      toast.error("Connection error");
    } finally {
      setIsAdmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setIsDeleting(true);
      const token = localStorage.getItem("authtoken");
      const res = await fetch(`/api/admissions/${deleteId}?branchId=${selectedBranch.id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success("Admission record purged");
        fetchData();
        setDeleteId(null);
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete");
      }
    } catch (error) {
      toast.error("Connection error");
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "In Progress": return "bg-primary/10 text-primary border-primary/20";
      case "Pending": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      default: return "bg-gray-100 text-gray-500 border-gray-200";
    }
  };

  const filteredBranches = branches.filter(b => b.name.toLowerCase().includes(branchSearch.toLowerCase()));

  return (
    <div className="p-4 sm:p-6 bg-background min-h-screen flex flex-col font-sans gap-[20px] pb-20 text-[#1e293b] dark:text-white transition-colors duration-300">
      
      {/* Super Admin Branch Header */}
      <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-4">
        <div>
          <h1 className="text-[20px] font-bold text-foreground tracking-tight leading-none tracking-tight">Global Admissions Registry</h1>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-3 bg-card px-4 h-[48px] rounded-[5px] border border-border hover:border-primary transition-all outline-none group w-full sm:min-w-[280px] shadow-none font-bold text-[13px]">
                  <Building2 className="w-4 h-4 text-primary shrink-0" />
                  <span className={cn("truncate flex-1 text-left", !selectedBranch && "text-muted-foreground font-medium")}>
                    {selectedBranch ? selectedBranch.name : "Select Branch Registry"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[calc(100vw-32px)] sm:w-[320px] border-border bg-card p-2 shadow-xl flex flex-col gap-1 rounded-[5px] z-[500]">
                <div className="relative mb-2 px-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <input 
                    type="text"
                    placeholder="Search branches..."
                    className="w-full h-10 pl-9 pr-3 bg-background border border-border rounded-[5px] text-[13px] font-medium outline-none focus:border-primary"
                    value={branchSearch}
                    onChange={(e) => setBranchSearch(e.target.value)}
                    onKeyDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="max-h-[250px] overflow-y-auto no-scrollbar">
                  {filteredBranches.map((branch) => (
                    <DropdownMenuItem 
                      key={branch.id} 
                      onClick={() => setSelectedBranch(branch)}
                      className="flex items-center gap-3 px-3 py-2.5 text-[13px] font-semibold cursor-pointer rounded-[5px] mb-0.5"
                    >
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <span>{branch.name}</span>
                      {selectedBranch?.id === branch.id && <Check className="w-4 h-4 ml-auto text-primary" />}
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <button 
              onClick={() => router.push(`/super-admin/admissions/add?branchId=${selectedBranch?.id}`)}
              disabled={!selectedBranch}
              className="bg-primary text-white px-8 h-[48px] rounded-[5px] text-[13px] font-bold flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-none whitespace-nowrap disabled:opacity-50 w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" /> Add Admission
            </button>
        </div>
      </div>

      {!selectedBranch ? (
        <div className="flex flex-col items-center justify-center py-40 bg-card rounded-[5px] border border-border shadow-none">
          <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mb-4">
            <Building2 className="w-8 h-8 text-primary opacity-20" />
          </div>
          <h3 className="text-[16px] font-bold text-foreground mb-1 text-center px-4">Select a specific branch registry to manage clinical records</h3>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatCard title="Today's Admissions" value={stats.todayAdmissions} icon={Calendar} color="blue" />
            <StatCard title="Discharges" value={stats.todayDischarges} icon={CheckCircle2} color="rose" />
            <StatCard title="In Progress" value={stats.inProgress} icon={Clock} color="emerald" />
            <StatCard title="Pending" value={stats.pending} icon={AlertTriangle} color="amber" />
          </div>

          {/* Controls Bar */}
          <div className="bg-card rounded-[5px] border border-border overflow-hidden shadow-none">
            <div className="p-4 flex flex-col lg:flex-row justify-between lg:items-center gap-4">
              <div className="flex bg-muted/50 p-1 rounded-[5px] w-full sm:w-fit overflow-x-auto no-scrollbar">
                {["Admissions", "Discharge"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "flex-1 sm:flex-none px-8 py-2 rounded-[5px] text-[13px] font-bold transition-all whitespace-nowrap",
                      activeTab === tab ? "bg-primary text-white shadow-md" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                <div className="relative w-full sm:w-[260px]">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Search patient name..." 
                    className="w-full h-[44px] pl-11 pr-4 bg-background border border-border rounded-[5px] text-[13px] font-medium outline-none focus:border-primary transition-all shadow-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                  <CustomSelect 
                    value={selectedDept}
                    onChange={setSelectedDept}
                    placeholder="All Departments"
                    icon={LayoutGrid}
                    options={[
                      { label: "All Departments", value: "" },
                      ...departments.map(d => ({ label: d.name, value: d.id }))
                    ]}
                    className="w-full sm:w-auto"
                  />

                  <CustomSelect 
                    value={selectedStatus}
                    onChange={setSelectedStatus}
                    placeholder="All Status"
                    icon={Filter}
                    options={[
                      { label: "All Status", value: "" },
                      { label: "Pending", value: "Pending" },
                      { label: "In Progress", value: "In Progress" },
                      { label: "Completed", value: "Completed" }
                    ]}
                    className="w-full sm:w-auto"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-muted/30">
                    <th className="px-8 py-4 text-left text-[11px] font-bold text-muted-foreground tracking-widest border-b border-border">Patient Info</th>
                    <th className="px-8 py-4 text-left text-[11px] font-bold text-muted-foreground tracking-widest border-b border-border">Age/Gender</th>
                    <th className="px-8 py-4 text-left text-[11px] font-bold text-muted-foreground tracking-widest border-b border-border">Department/Ward</th>
                    <th className="px-8 py-4 text-left text-[11px] font-bold text-muted-foreground tracking-widest border-b border-border">Date & Time</th>
                    <th className="px-8 py-4 text-left text-[11px] font-bold text-muted-foreground tracking-widest border-b border-border">Status</th>
                    <th className="px-8 py-4 text-right text-[11px] font-bold text-muted-foreground tracking-widest border-b border-border">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    <tr><td colSpan="6" className="px-8 py-20 text-center text-muted-foreground text-[13px] font-bold animate-pulse uppercase tracking-widest">Synchronizing Registry...</td></tr>
                  ) : admissions.length === 0 ? (
                    <tr><td colSpan="6" className="px-8 py-20 text-center text-muted-foreground text-[14px] font-medium">No clinical records found for the selected criteria</td></tr>
                  ) : (
                    admissions.map((item) => (
                      <tr key={item.id} className="hover:bg-muted/20 transition-all group">
                        <td className="px-8 py-4">
                          <div className="flex flex-col">
                            <span className="text-[14px] font-bold text-foreground">{item.patient?.name}</span>
                            <span className="text-[11px] font-medium text-muted-foreground">{item.patient?.contact}</span>
                          </div>
                        </td>
                        <td className="px-8 py-4 text-[13px] font-semibold text-muted-foreground">
                          {item.patient?.age} yrs / {item.patient?.gender}
                        </td>
                        <td className="px-8 py-4">
                          <div className="flex flex-col">
                            <span className="text-[13px] font-bold text-foreground">{item.department?.name}</span>
                            <span className="text-[11px] font-medium text-primary uppercase tracking-wider">{item.ward?.name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-4 text-[13px] font-medium text-muted-foreground">
                          {new Date(item.admissionDate).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                        </td>
                        <td className="px-8 py-4">
                          <div className="flex flex-col gap-1">
                            <span className={cn("px-3 py-1 rounded-[5px] text-[11px] font-bold border leading-none items-center justify-center inline-flex w-fit", getStatusColor(item.status))}>
                              {item.status}
                            </span>
                            {item.department && !item.department.active && (
                              <div className="flex items-center gap-1 text-[10px] font-bold text-amber-600 animate-pulse">
                                <AlertTriangle className="w-3 h-3" />
                                Inactive Dept
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {activeTab === "Admissions" && (
                              <button 
                                onClick={() => setDischargeId(item.id)}
                                title="Discharge Patient"
                                className="p-2 hover:bg-emerald-50 dark:hover:bg-emerald-500/5 rounded-[5px] transition-all"
                              >
                                <LogOut className="w-5 h-5 text-emerald-500" />
                              </button>
                            )}
                            {activeTab === "Discharge" && (
                              <button 
                                onClick={() => setAdmitId(item.id)}
                                title="Re-admit Patient"
                                className="p-2 hover:bg-blue-50 dark:hover:bg-blue-500/5 rounded-[5px] transition-all"
                              >
                                <LogOut className="w-5 h-5 text-blue-500 rotate-180" />
                              </button>
                            )}
                            <button 
                              onClick={() => router.push(`/super-admin/admissions/edit/${item.id}?branchId=${selectedBranch.id}`)}
                              className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-[5px] transition-all"
                            >
                              <Edit3 className="w-5 h-5 text-muted-foreground" />
                            </button>
                            <button 
                              onClick={() => setDeleteId(item.id)}
                              className="p-2 hover:bg-rose-50 dark:hover:bg-rose-500/5 rounded-[5px] transition-all"
                            >
                              <Trash2 className="w-5 h-5 text-rose-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Confirmation Modals (Re-admit, Discharge, Delete) */}
      <AnimatePresence>
        {admitId && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAdmitId(null)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-[4px]" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-white dark:bg-[#101935] w-full max-w-[380px] rounded-[12px] overflow-hidden shadow-2xl border border-gray-100 dark:border-white/5">
              <div className="p-8 flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                  <LogOut className="w-7 h-7 text-blue-500 rotate-180" />
                </div>
                <h3 className="text-[18px] font-bold text-[#1e293b] dark:text-white mb-2">Re-admit Patient?</h3>
                <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed max-w-[280px]">Reactivate clinical record and set status to <span className="font-bold text-blue-600">In Progress</span>.</p>
              </div>
              <div className="flex border-t border-gray-100 dark:border-white/5">
                <button onClick={() => setAdmitId(null)} className="flex-1 py-4 text-[13px] font-bold text-gray-400 hover:bg-gray-50 border-r border-gray-100">Cancel</button>
                <button onClick={handleAdmit} disabled={isAdmitting} className="flex-1 py-4 text-[13px] font-bold text-blue-600 hover:bg-blue-50 disabled:opacity-50">{isAdmitting ? "Syncing..." : "Confirm Admit"}</button>
              </div>
            </motion.div>
          </div>
        )}

        {dischargeId && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDischargeId(null)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-[4px]" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-white dark:bg-[#101935] w-full max-w-[380px] rounded-[12px] overflow-hidden shadow-2xl border border-gray-100 dark:border-white/5">
              <div className="p-8 flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                  <LogOut className="w-7 h-7 text-emerald-500" />
                </div>
                <h3 className="text-[18px] font-bold text-[#1e293b] dark:text-white mb-2">Discharge Patient?</h3>
                <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed max-w-[280px]">Mark as <span className="font-bold text-emerald-600">Discharged</span> and liberate assigned bed.</p>
              </div>
              <div className="flex border-t border-gray-100 dark:border-white/5">
                <button onClick={() => setDischargeId(null)} className="flex-1 py-4 text-[13px] font-bold text-gray-400 hover:bg-gray-50 border-r border-gray-100">Cancel</button>
                <button onClick={handleDischarge} disabled={isDischarging} className="flex-1 py-4 text-[13px] font-bold text-emerald-600 hover:bg-emerald-50 disabled:opacity-50">{isDischarging ? "Syncing..." : "Confirm Discharge"}</button>
              </div>
            </motion.div>
          </div>
        )}

        {deleteId && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteId(null)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-[4px]" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-white dark:bg-[#101935] w-full max-w-[380px] rounded-[12px] overflow-hidden shadow-2xl border border-gray-100 dark:border-white/5">
              <div className="p-8 flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-rose-50 dark:bg-rose-500/10 rounded-full flex items-center justify-center mb-4">
                  <Trash2 className="w-7 h-7 text-rose-500" />
                </div>
                <h3 className="text-[18px] font-bold text-[#1e293b] dark:text-white mb-2">Purge Clinical Record?</h3>
                <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed max-w-[280px]">This action is <span className="font-bold text-rose-500">Irreversible</span> and will delete the record from all databases.</p>
              </div>
              <div className="flex border-t border-gray-100 dark:border-white/5">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-4 text-[13px] font-bold text-gray-400 hover:bg-gray-50 border-r border-gray-100">Cancel</button>
                <button onClick={handleDelete} disabled={isDeleting} className="flex-1 py-4 text-[13px] font-bold text-rose-500 hover:bg-rose-50 disabled:opacity-50">{isDeleting ? "Purging..." : "Confirm Purge"}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
