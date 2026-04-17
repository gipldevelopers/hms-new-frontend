import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Users, Building2, Bed, Users2, Edit3, 
  MapPin, Phone, LayoutGrid, List, Trash2,
  FileText, Activity, Database, Settings2, Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StatCard } from "../dashboard/StatCard";

// --- STATS ROW COMPONENT ---
export function BranchStats() {
  const [stats, setStats] = useState({
    totalBranches: 0,
    totalDepartments: 0,
    totalBeds: 0,
    totalStaff: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/branches/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json.success) {
          setStats(json.data);
        }
      } catch (error) {
        console.error("Fetch stats error:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { title: "Total Branches", value: stats.totalBranches, icon: Building2, color: "blue" },
        { title: "Total Departments", value: stats.totalDepartments, icon: Database, color: "indigo" },
        { title: "Active Beds", value: stats.totalBeds, icon: Activity, color: "emerald" },
        { title: "Total Staff", value: stats.totalStaff, icon: Users2, color: "indigo" },
      ].map((stat, i) => (
        <div key={i} className="bg-white dark:bg-[#101935] p-5 rounded-[12px] border border-[#E7E8EB] dark:border-white/10 flex items-center gap-4">
          <div className={cn(
            "w-12 h-12 rounded-[10px] flex items-center justify-center",
            stat.color === "blue" && "bg-primary/10 text-primary",
            stat.color === "indigo" && "bg-primary/10 text-primary",
            stat.color === "emerald" && "bg-emerald-50 text-emerald-500",
          )}>
            <stat.icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none">{stat.title}</p>
            <p className="text-[20px] font-bold text-[#1e293b] dark:text-white mt-1.5 leading-none">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function DeleteConfirmationModal({ isOpen, onClose, onConfirm, itemName, title = "Delete Branch?" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/60 backdrop-blur-[6px] animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#101935] w-full max-w-[400px] rounded-[12px] shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 border border-red-50 dark:border-red-900/20">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trash2 className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-[20px] font-bold text-[#1e293b] dark:text-white mb-2">{title}</h2>
          <p className="text-gray-400 text-[14px] leading-relaxed">
            Are you sure you want to delete <span className="font-bold text-gray-600 dark:text-gray-300">"{itemName}"</span>? This action cannot be undone.
          </p>
        </div>

        <div className="flex border-t border-gray-100 dark:border-white/5">
          <button 
            onClick={onClose}
            className="flex-1 h-14 text-[14px] font-bold text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 h-14 text-[14px] font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all border-l border-gray-100 dark:border-white/5"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// --- BRANCH CARD COMPONENT (Optimized design to match Master/Template) ---
export function BranchCard({ branch, viewType = "grid", onEdit, onDelete, isGlobalSyncing = false }) {
  const isList = viewType === "list";
  const router = useRouter();
  const [localInitializing, setLocalInitializing] = useState(false);
  const [progress, setProgress] = useState(0);

  const isInitializing = localInitializing || isGlobalSyncing;

  useEffect(() => {
    let interval;
    if (isInitializing) {
      if (progress === 100) setProgress(0); // Reset if re-triggering
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev < 30) return prev + Math.random() * 8;
          if (prev < 70) return prev + Math.random() * 4;
          if (prev < 95) return prev + Math.random() * 1;
          return prev;
        });
      }, 400);
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [isInitializing]);

  const handleInitTables = async (e) => {
    e.stopPropagation();
    setLocalInitializing(true);
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/branches/${branch.id}/init-tables`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      
      setProgress(100);
      
      setTimeout(() => {
        if (json.success) {
          window.location.reload(); 
        } else {
          setLocalInitializing(false);
        }
      }, 500);
    } catch (error) {
      setLocalInitializing(false);
      console.error("Init tables error:", error);
    }
  };

  return (
    <div className={cn(
      "group bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[10px] overflow-hidden flex transition-all relative",
      isList ? "flex-row items-center p-5 gap-6" : "flex-col p-6 h-full"
    )}>
      
      {/* Progress Overlay during initialization */}
      {isInitializing && (
        <div className="absolute inset-0 z-10 bg-white/90 dark:bg-[#101935]/95 backdrop-blur-[2px] flex items-center justify-center p-8 animate-in fade-in duration-300">
           <div className="w-full max-w-[200px] text-center space-y-3">
              <div className="flex justify-between items-end mb-1">
                 <span className="text-[10px] font-bold text-primary uppercase tracking-widest animate-pulse">Provisioning Tables...</span>
                 <span className="text-[14px] font-black text-primary/80 mono">{Math.round(progress)}%</span>
              </div>
              <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden border border-primary/5">
                 <div 
                   className="h-full bg-primary transition-all duration-300 ease-out shadow-[0_0_15px_rgba(29,78,216,0.3)]"
                   style={{ width: `${progress}%` }}
                 />
              </div>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Setting up Healthcare Infrastructure</p>
           </div>
        </div>
      )}
      
      <div className={cn("flex-1 transition-all", isList && "flex-[3]")}>
        {/* Top Header */}
        <div className="flex justify-between items-start mb-5">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-[5px] flex items-center justify-center border border-primary/20 shrink-0">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-[17px] font-bold text-[#1e293b] dark:text-white leading-tight">{branch.name}</h3>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="text-[12px] text-gray-400 dark:text-gray-500 font-medium">#{branch.code}</span>
                <span className={cn(
                  "text-[9px] font-extrabold px-2 py-0.5 rounded-[4px] uppercase tracking-wider",
                  branch.active ? "bg-emerald-50 text-emerald-500 border border-emerald-100" : "bg-gray-50 text-gray-400 border border-gray-100"
                )}>
                  {branch.active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {isList ? (
           <div className="grid grid-cols-3 gap-6 animate-in fade-in duration-700">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-sans">Location</p>
                <div className="flex items-center gap-1.5 overflow-hidden">
                   <MapPin className="w-3.5 h-3.5 text-primary" />
                   <p className="text-[13px] font-bold text-[#1e293b] dark:text-white leading-none truncate">{branch.city}, {branch.state}</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-sans">Contact Center</p>
                <div className="flex items-center gap-1.5">
                   <Phone className="w-3.5 h-3.5 text-primary" />
                   <p className="text-[13px] font-bold text-[#1e293b] dark:text-white leading-none">{branch.contact}</p>
                </div>
              </div>
              <div className="line-clamp-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-sans">Facilities</p>
                <p className="text-[12px] text-gray-500 leading-relaxed truncate">{branch.address}</p>
              </div>
           </div>
        ) : (
          <div className="animate-in fade-in zoom-in-95 duration-700">
            <div className="space-y-3 mb-6">
               <p className="text-[12px] text-gray-400 dark:text-gray-500 flex items-center gap-2 font-medium">
                  <MapPin className="w-4 h-4 text-primary" /> {branch.address}
               </p>
               <p className="text-[12px] text-gray-400 dark:text-gray-500 flex items-center gap-2 font-medium">
                  <Phone className="w-4 h-4 text-primary" /> {branch.contact}
               </p>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/5 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Departments</p>
                <p className="text-[14px] font-bold text-[#1e293b] dark:text-white">Professional Setup</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                <p className={cn("text-[14px] font-bold", branch.active ? "text-emerald-500" : "text-gray-400")}>{branch.active ? "Fully Operational" : "Temporarily Offline"}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons - Unified Flat Design */}
      <div className={cn(
        "flex items-center gap-2", 
        isList ? "pb-0 px-0 flex-row w-auto border-l border-gray-100 dark:border-white/5 pl-8 shrink-0" : "mt-6 pt-4 border-t border-gray-50 dark:border-white/5"
      )}>
        {branch.dbName && (
           <button 
             onClick={handleInitTables}
             className={cn(
               "px-4 h-[40px] font-bold text-[11px] rounded-[6px] transition-all flex items-center justify-center gap-2 uppercase tracking-widest border shadow-none shrink-0", 
               branch.schemaVersion === branch.currentSchemaVersion 
                ? "bg-slate-50 text-slate-500 border-[#E7E8EB] hover:bg-slate-100 dark:bg-white/5 dark:border-white/10 dark:text-gray-400" 
                : !branch.schemaVersion 
                ? "bg-red-500 text-white border-red-600 hover:bg-red-600 animate-pulse" 
                : "bg-amber-500 text-white border-amber-600 hover:bg-amber-600",
               !isList && "flex-1"
             )}
           >
             <Database className="w-3.5 h-3.5" /> 
             <span className="truncate">
               {branch.schemaVersion === branch.currentSchemaVersion 
                 ? "Force Push" 
                 : branch.schemaVersion 
                 ? "Update Tables" 
                 : "Push Tables"}
             </span>
           </button>
        )}
        <button 
          onClick={() => router.push(`/super-admin/branches/${branch.id}`)}
          className={cn(
            "px-4 h-[40px] bg-white dark:bg-white/5 text-primary font-bold text-[12px] rounded-[6px] transition-all flex items-center justify-center gap-2 border border-[#E7E8EB] dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 shadow-none", 
            !isList && "flex-1"
          )}
        >
          <Eye className="w-4 h-4" /> View
        </button>
        <button 
          onClick={onEdit}
          className={cn(
            "px-4 h-[40px] bg-primary text-white font-bold text-[12px] rounded-[6px] transition-all hover:bg-primary/90 flex items-center justify-center gap-2 border border-primary shadow-none", 
            !isList && "flex-1"
          )}
        >
          <Edit3 className="w-4 h-4" /> Edit
        </button>
        <button 
          onClick={onDelete}
          className="w-[40px] h-[40px] bg-white dark:bg-white/5 text-red-500 rounded-[6px] flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-500/10 transition-all border border-[#E7E8EB] dark:border-white/10 shadow-none"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}