import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Users, Building2, Bed, Users2, Edit3, 
  MapPin, Phone, LayoutGrid, List, Trash2 
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[20px] mb-8">
      <StatCard title="Total Branches" value={stats.totalBranches} percentage="2" isUp={true} color="indigo" icon={Building2} />
      <StatCard title="Total Departments" value={stats.totalDepartments} percentage="2" isUp={true} color="red" icon={Building2} />
      <StatCard title="Total Beds" value={stats.totalBeds} percentage="2" isUp={false} color="blue" icon={Bed} />
      <StatCard title="Total Staff" value={stats.totalStaff} percentage="2" isUp={true} color="emerald" icon={Users2} />
    </div>
  );
}

export function DeleteConfirmationModal({ isOpen, onClose, onConfirm, itemName }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#101935] w-full max-w-[400px] rounded-[12px] shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 border border-red-50 dark:border-red-900/20">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trash2 className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-[20px] font-bold text-[#1e293b] dark:text-white mb-2">Delete Branch?</h2>
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

// --- BRANCH CARD COMPONENT ---
export function BranchCard({ branch, viewType = "grid", onEdit, onDelete }) {
  const isList = viewType === "list";
  const router = useRouter();

  return (
    <div className={cn(
      "bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] overflow-hidden flex transition-all relative group",
      isList ? "flex-row items-center p-4 gap-6" : "flex-col"
    )}>
      {/* Thumbnail/Icon */}
      <div className={cn("p-5 flex-1", isList && "p-0 flex-[2]")}>
        {/* Top Header */}
        <div className="flex justify-between items-start mb-5">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-[#F0F2FF] dark:bg-[#1e293b] rounded-[5px] flex items-center justify-center border border-[#E7E8EB] dark:border-white/10 shrink-0">
              <Building2 className="w-6 h-6 text-[#2D3A8C]" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#1e293b] dark:text-white leading-tight">{branch.name}</h3>
              <div className="mt-1 space-y-0.5">
                <p className="text-[12px] text-gray-400 dark:text-slate-500 flex items-center gap-1.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#2D3A8C]" /> {branch.address}
                </p>
                <p className="text-[12px] text-gray-400 dark:text-slate-500 flex items-center gap-1.5 font-bold">
                  <Phone className="w-3.5 h-3.5 text-[#2D3A8C]" /> {branch.contact}
                </p>
              </div>
            </div>
          </div>
          <span className={cn(
            "text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider h-fit",
            branch.isActive ? "bg-[#E7F9ED] text-[#2ECC71]" : "bg-gray-100 text-gray-400"
          )}>
            {branch.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Stats Grid - 3 Columns */}
        <div className={cn("grid gap-2.5 mb-5", isList ? "grid-cols-3 mb-0" : "grid-cols-3")}>
          {[
            { label: "Occupancy", value: branch.occupancy, icon: Bed },
            { label: "Total Staff", value: branch.staff, icon: Users },
            { label: "Total Depts", value: branch.depts, icon: Building2 }
          ].map((item, idx) => (
            <div key={idx} className="bg-[#F8F9FC] dark:bg-[#1e293b]/50 p-3 rounded-[5px] border border-gray-50 dark:border-white/5 text-left">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                 <item.icon className="w-3 h-3" /> {item.label}
              </p>
              <p className="text-[18px] font-bold text-[#1e293b] dark:text-white leading-none mt-2">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        {!isList && (
          <div className="flex justify-between items-center pt-5 border-t border-gray-100 dark:border-white/5">
            <div>
              <p className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-wider">Branch Manager</p>
              <p className="font-bold text-[#1e293b] dark:text-white mt-1 text-[13px]">{branch.manager}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-wider">Monthly Revenue</p>
              <p className="font-bold text-[#1e293b] dark:text-white mt-1 text-[16px]">{branch.revenue}</p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className={cn("flex items-center gap-2.5 px-5 pb-5", isList && "pb-0 px-0 flex-col w-[150px] shrink-0")}>
        <button 
          onClick={() => router.push(`/super-admin/branches/${branch.id}`)}
          className="flex-1 h-9 bg-[#F4F5FB] dark:bg-[#1e293b] hover:bg-gray-100 text-[#1e293b] dark:text-slate-300 font-semibold text-[12px] rounded-[5px] transition-all flex items-center justify-center gap-2 border border-[#E7E8EB] dark:border-white/10"
        >
          View Details
        </button>
        <button 
          onClick={onEdit}
          className="flex-1 h-9 bg-[#2D3A8C] text-white font-semibold text-[12px] rounded-[5px] hover:bg-[#1e2775] transition-all flex items-center justify-center gap-2"
        >
          <Edit3 className="w-4 h-4" /> Edit
        </button>
        <button 
          onClick={onDelete}
          className={cn(
            "w-9 h-9 bg-red-50 text-red-500 rounded-[5px] flex items-center justify-center hover:bg-red-500 hover:text-white transition-all border border-red-100",
            isList && "w-full"
          )}
          title="Delete Branch"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}