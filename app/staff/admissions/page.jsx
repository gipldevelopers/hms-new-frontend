"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, Plus, Filter, Download, Eye,
  ChevronDown, Edit3, Trash2, MoreHorizontal,
  LayoutGrid, List, CheckCircle2, Clock, 
  UserPlus, FileText, ArrowLeft, Building2,
  Calendar, Check, AlertTriangle, LogOut, LogIn
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

// --- CUSTOM SELECT COMPONENT ---
function CustomSelect({ value, onChange, options, placeholder, className, minWidth = "160px" }) {
  const selectedOption = options.find(opt => opt.value === value);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button 
          type="button"
          className={cn(
            "h-11 px-5 bg-background border border-border rounded-[5px] text-[13px] font-bold text-foreground flex items-center justify-between gap-3 hover:bg-muted transition-all outline-none focus:border-primary w-full sm:w-auto",
            !value && "text-muted-foreground",
            className
          )}
          style={mounted && window.innerWidth > 640 ? { minWidth } : {}}
        >
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[calc(100vw-48px)] sm:w-[var(--radix-dropdown-menu-trigger-width)] sm:min-w-[160px] border-border shadow-xl rounded-[5px] p-1 z-[500]">
        <DropdownMenuItem 
          onClick={() => onChange("")}
          className={cn(
            "rounded-[5px] text-[12px] font-medium px-3 py-2 cursor-pointer transition-colors",
            !value ? "bg-primary/5 text-primary font-bold" : "text-gray-600 hover:bg-muted"
          )}
        >
          All {placeholder.split(' ').pop()}s
        </DropdownMenuItem>
        {options.map((opt) => (
          <DropdownMenuItem 
            key={opt.value} 
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-[5px] text-[12px] font-medium px-3 py-2 cursor-pointer transition-colors",
              value === opt.value ? "bg-primary/5 text-primary font-bold" : "text-gray-600 hover:bg-muted"
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

// --- STAT CARD COMPONENT ---
function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="bg-card p-5 rounded-[5px] border border-border flex items-center gap-4 transition-all w-full">
      <div
        className={cn(
          "w-12 h-12 rounded-[5px] flex items-center justify-center shrink-0",
          color === "blue" && "bg-primary/10 text-primary",
          color === "indigo" && "bg-primary/10 text-primary",
          color === "rose" && "bg-rose-500/10 text-rose-500",
          color === "emerald" && "bg-emerald-500/10 text-emerald-500",
          color === "amber" && "bg-amber-500/10 text-amber-500"
        )}
      >
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-[11px] font-bold text-muted-foreground leading-none mb-1.5 uppercase">
          {title}
        </p>
        <p className="text-[20px] font-bold text-foreground leading-none">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function AdmissionsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Admissions"); 
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [admissions, setAdmissions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [stats, setStats] = useState({ todayAdmissions: 0, todayDischarges: 0, inProgress: 0, pending: 0 });
  const [deleteId, setDeleteId] = useState(null);
  const [dischargeId, setDischargeId] = useState(null);
  const [admitId, setAdmitId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDischarging, setIsDischarging] = useState(false);
  const [isAdmitting, setIsAdmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authtoken");
      const headers = { "Authorization": `Bearer ${token}` };
      
      const params = new URLSearchParams({
        type: activeTab.toLowerCase(),
        search: searchQuery,
        departmentId: selectedDept,
        status: selectedStatus
      });

      const [admissionsRes, statsRes, deptsRes] = await Promise.all([
        fetch(`/api/admissions/overview?${params.toString()}`, { headers }),
        fetch(`/api/admissions/stats`, { headers }),
        fetch(`/api/wards/overview`, { headers })
      ]);

      const admissionsData = await admissionsRes.json();
      const statsData = await statsRes.json();
      const deptsData = await deptsRes.json();

      setAdmissions(Array.isArray(admissionsData) ? admissionsData : []);
      setStats(statsData);
      setDepartments(Array.isArray(deptsData) ? deptsData : []);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleDischarge = async () => {
    if (!dischargeId) return;
    try {
      setIsDischarging(true);
      const token = localStorage.getItem("authtoken");
      const res = await fetch(`/api/admissions/${dischargeId}`, {
        method: "PATCH",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          status: "Completed" 
        })
      });
      if (res.ok) {
        toast.success("Patient discharged successfully");
        fetchData();
        setDischargeId(null);
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to discharge patient");
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
      const res = await fetch(`/api/admissions/${admitId}`, {
        method: "PATCH",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          status: "In Progress" 
        })
      });
      if (res.ok) {
        toast.success("Patient re-admitted successfully");
        fetchData();
        setAdmitId(null);
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to re-admit patient");
      }
    } catch (error) {
      toast.error("Connection error");
    } finally {
      setIsAdmitting(false);
    }
  };

  useEffect(() => { fetchData(); }, [activeTab, selectedDept, selectedStatus]);

  useEffect(() => {
    const timer = setTimeout(() => { fetchData(); }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setIsDeleting(true);
      const token = localStorage.getItem("authtoken");
      const res = await fetch(`/api/admissions/${deleteId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success("Record deleted successfully");
        fetchData();
        setDeleteId(null);
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete record");
      }
    } catch (error) {
      toast.error("Connection error");
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "In Progress": return "bg-blue-50 text-blue-600 border-blue-100";
      case "Pending": return "bg-amber-50 text-amber-600 border-amber-100";
      default: return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-background min-h-screen flex flex-col space-y-5 transition-colors duration-300 font-sans pb-20">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h1 className="text-[20px] font-bold text-foreground tracking-tight leading-none">
          Admissions & Discharges
        </h1>
        
        <button 
          onClick={() => router.push("/staff/admissions/add")}
          className="bg-primary text-white px-8 h-[48px] rounded-[5px] text-[13px] font-bold flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-none w-full sm:w-auto"
        >
          <UserPlus className="w-4 h-4" />
          New Admission
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard title="Today's Admissions" value={stats.todayAdmissions} icon={Calendar} color="indigo" />
        <StatCard title="Today's Discharges" value={stats.todayDischarges} icon={CheckCircle2} color="rose" />
        <StatCard title="In Progress" value={stats.inProgress} icon={Clock} color="blue" />
        <StatCard title="Pending" value={stats.pending} icon={FileText} color="emerald" />
      </div>

      {/* Main Filter Bar */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 bg-card p-3 rounded-[5px] border border-border shadow-none">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
          {/* Search */}
          <div className="relative grow lg:w-[320px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search admissions..." 
              className="w-full h-11 pl-11 pr-4 bg-background border border-border rounded-[5px] text-[13px] font-medium outline-none focus:border-primary transition-all shadow-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Tabs */}
          <div className="flex bg-[#F1F5F9] dark:bg-[#1E293B] p-1 rounded-[5px] w-full sm:w-fit overflow-x-auto no-scrollbar">
            {["Admissions", "Discharge"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex-1 sm:flex-none px-6 py-2 rounded-[5px] text-[12px] font-bold transition-all whitespace-nowrap",
                  activeTab === tab ? "bg-white dark:bg-[#101935] text-primary shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
           <CustomSelect 
             value={selectedDept}
             onChange={setSelectedDept}
             placeholder="Filter by department"
             options={departments.map(d => ({ label: d.name, value: d.id }))}
             minWidth="180px"
             className="w-full sm:w-auto"
           />
           <CustomSelect 
             value={selectedStatus}
             onChange={setSelectedStatus}
             placeholder="Status"
             options={[
               { label: "Pending", value: "Pending" },
               { label: "In Progress", value: "In Progress" },
               { label: "Completed", value: "Completed" },
             ]}
             minWidth="130px"
             className="w-full sm:w-auto"
           />
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-card rounded-[5px] border border-border shadow-none overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-muted/30">
                <th className="px-8 py-3 text-left text-[11px] font-bold text-muted-foreground border-b border-border tracking-tight">Name</th>
                <th className="px-8 py-3 text-left text-[11px] font-bold text-muted-foreground border-b border-border tracking-tight">Age / Gender</th>
                <th className="px-8 py-3 text-left text-[11px] font-bold text-muted-foreground border-b border-border tracking-tight">Department</th>
                <th className="px-8 py-3 text-left text-[11px] font-bold text-muted-foreground border-b border-border tracking-tight">Date & Time</th>
                <th className="px-8 py-3 text-left text-[11px] font-bold text-muted-foreground border-b border-border tracking-tight">Status</th>
                <th className="px-8 py-3 text-right text-[11px] font-bold text-muted-foreground border-b border-border tracking-tight">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {admissions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-8 py-24 text-center text-gray-400 text-[12px] font-bold opacity-60 italic">
                    {loading ? "Syncing clinical records..." : "No records found"}
                  </td>
                </tr>
              ) : (
                admissions.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/10 transition-all group">
                    <td className="px-8 py-3">
                      <div className="text-[14px] font-bold text-foreground leading-tight">{item.patient?.name}</div>
                    </td>
                    <td className="px-8 py-3 text-[14px] text-muted-foreground font-medium tracking-tight">
                      {item.patient?.age} / {item.patient?.gender}
                    </td>
                    <td className="px-8 py-3 text-[14px] font-bold text-foreground tracking-tight">
                      {item.department?.name}
                    </td>
                    <td className="px-8 py-3 text-[14px] text-muted-foreground font-medium tracking-tight">
                      {new Date(item.admissionDate).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                    </td>
                    <td className="px-8 py-3">
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
                    <td className="px-8 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {activeTab === "Admissions" && (
                          <button 
                            onClick={() => setDischargeId(item.id)}
                            title="Discharge Patient"
                            className="p-2 hover:bg-emerald-50 dark:hover:bg-emerald-500/5 rounded-[5px] transition-all group/btn"
                          >
                            <LogOut className="w-5 h-5 text-emerald-500" />
                          </button>
                        )}
                        {activeTab === "Discharge" && (
                          <button 
                            onClick={() => setAdmitId(item.id)}
                            title="Re-admit Patient"
                            className="p-2 hover:bg-blue-50 dark:hover:bg-blue-500/5 rounded-[5px] transition-all group/btn"
                          >
                            <LogOut className="w-5 h-5 text-blue-500 rotate-180" />
                          </button>
                        )}
                        <button 
                          onClick={() => router.push(`/staff/admissions/edit/${item.id}`)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-[5px] transition-all"
                        >
                          <Edit3 className="w-5 h-5 text-blue-500" />
                        </button>
                        <button 
                          onClick={() => setDeleteId(item.id)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-[5px] transition-all"
                        >
                          <Trash2 className="w-5 h-5 text-red-500" />
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

      {/* Re-admit Confirmation Modal */}
      <AnimatePresence>
        {admitId && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setAdmitId(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-[4px]" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white dark:bg-[#101935] w-full max-w-[380px] rounded-[12px] overflow-hidden shadow-2xl border border-gray-100 dark:border-white/5"
            >
              <div className="p-8 flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                  <LogOut className="w-7 h-7 text-blue-500 rotate-180" />
                </div>
                <h3 className="text-[18px] font-bold text-[#1e293b] dark:text-white mb-2">Re-admit Patient?</h3>
                <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed max-w-[280px]">
                  This will reactivate the clinical record and set the patient's status back to <span className="font-bold text-blue-600">In Progress</span>.
                </p>
              </div>

              <div className="flex border-t border-gray-100 dark:border-white/5">
                <button 
                  onClick={() => setAdmitId(null)}
                  className="flex-1 py-4 text-[13px] font-bold text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-r border-gray-100 dark:border-white/5"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAdmit}
                  disabled={isAdmitting}
                  className="flex-1 py-4 text-[13px] font-bold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/5 transition-colors disabled:opacity-50"
                >
                  {isAdmitting ? "Processing..." : "Confirm Admit"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Discharge Confirmation Modal */}
      <AnimatePresence>
        {dischargeId && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDischargeId(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-[4px]" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white dark:bg-[#101935] w-full max-w-[380px] rounded-[12px] overflow-hidden shadow-2xl border border-gray-100 dark:border-white/5"
            >
              <div className="p-8 flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                  <LogOut className="w-7 h-7 text-emerald-500" />
                </div>
                <h3 className="text-[18px] font-bold text-[#1e293b] dark:text-white mb-2">Discharge Patient?</h3>
                <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed max-w-[280px]">
                  Confirming this action will mark the patient as <span className="font-bold text-emerald-600">Discharged</span> and liberate their assigned bed.
                </p>
              </div>

              <div className="flex border-t border-gray-100 dark:border-white/5">
                <button 
                  onClick={() => setDischargeId(null)}
                  className="flex-1 py-4 text-[13px] font-bold text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-r border-gray-100 dark:border-white/5"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDischarge}
                  disabled={isDischarging}
                  className="flex-1 py-4 text-[13px] font-bold text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/5 transition-colors disabled:opacity-50"
                >
                  {isDischarging ? "Processing..." : "Confirm Discharge"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDeleteId(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-[4px]" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white dark:bg-[#101935] w-full max-w-[380px] rounded-[12px] overflow-hidden shadow-2xl border border-gray-100 dark:border-white/5"
            >
              <div className="p-8 flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-rose-50 dark:bg-rose-500/10 rounded-full flex items-center justify-center mb-4">
                  <Trash2 className="w-7 h-7 text-rose-500" />
                </div>
                <h3 className="text-[18px] font-bold text-[#1e293b] dark:text-white mb-2">Delete Admission Record?</h3>
                <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed max-w-[280px]">
                  Are you sure you want to delete this clinical record? <span className="font-bold text-gray-700 dark:text-gray-200">This action cannot be undone.</span>
                </p>
              </div>

              <div className="flex border-t border-gray-100 dark:border-white/5">
                <button 
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-4 text-[13px] font-bold text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-r border-gray-100 dark:border-white/5"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 py-4 text-[13px] font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/5 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
