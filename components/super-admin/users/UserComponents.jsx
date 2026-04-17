import React, { useState, useEffect } from "react";
import { Search, ChevronDown, Eye, Mail, Building2, Edit3, Trash2, Users2, Activity, ShieldCheck, Database, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

// --- USER STATS COMPONENT ---
export function UserStats() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeDoctors: 0,
    activeNurses: 0,
    systemAdmins: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/users/stats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const json = await res.json();
        if (json.success) setStats(json.data);
      } catch (e) {}
    };
    fetchStats();
  }, []);

  const cards = [
    { title: "TOTAL USERS", value: stats.totalUsers, icon: Users2, color: "blue" },
    { title: "ACTIVE DOCTORS", value: stats.activeDoctors, icon: Activity, color: "emerald" },
    { title: "SUPPORT STAFF", value: stats.activeNurses, icon: Database, color: "indigo" },
    { title: "SYSTEM ADMINS", value: stats.systemAdmins, icon: ShieldCheck, color: "indigo" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((stat, i) => (
        <div key={i} className="bg-white dark:bg-[#101935] p-5 rounded-[12px] border border-[#E7E8EB] dark:border-white/10 flex items-center gap-4 transition-all">
          <div className={cn(
            "w-12 h-12 rounded-[10px] flex items-center justify-center",
            stat.color === "blue" && "bg-primary/10 text-primary",
            stat.color === "indigo" && "bg-indigo-50 text-indigo-500",
            stat.color === "emerald" && "bg-emerald-50 text-emerald-500",
          )}>
            <stat.icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1.5">{stat.title}</p>
            <p className="text-[20px] font-bold text-[#1e293b] dark:text-white leading-none">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// --- USER TABLE COMPONENT ---
export function UserTable({ 
  users, onEdit, onDelete, onView, 
  searchQuery, setSearchQuery, 
  roleFilter, setRoleFilter
}) {
  const roles = [
    "All", "SUPERADMIN", "BRANCH_ADMIN", "DOCTOR", "STAFF", 
    "RECEPTION", "PHARMACY", "LABORATORY", "RADIOLOGY", 
    "FINANCE", "REPORTS"
  ];

  return (
    <div className="space-y-6">
      
      {/* Filter Bar with Search and Role Selector */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-[#101935] p-3 rounded-[12px] border border-[#E7E8EB] dark:border-white/10 shadow-none">
        <div className="relative w-full md:w-[380px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search users by name, role or email..." 
            className="w-full h-11 pl-11 pr-4 bg-[#F8F9FC] dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-[8px] text-[13px] font-medium outline-none focus:border-primary transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {/* Role Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-11 px-5 bg-[#F8F9FC] dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-[8px] text-[13px] font-bold text-gray-600 dark:text-gray-300 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-all outline-none uppercase">
                    {roleFilter === "All" ? "Filter by Role" : roleFilter.replace('_', ' ')}
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px] border-[#E7E8EB] shadow-none h-64 overflow-y-auto">
                {roles.map(role => (
                   <DropdownMenuItem key={role} onClick={() => setRoleFilter(role)} className={cn(roleFilter === role && "text-primary font-bold")}>
                    {role === "All" ? "All Personnel" : role.replace('_', ' ')}
                    {roleFilter === role && <Check className="w-4 h-4 ml-auto" />}
                   </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>

      <div className="bg-white dark:bg-[#101935] rounded-[12px] border border-[#E7E8EB] dark:border-white/10 shadow-none overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] dark:bg-white/[0.02]">
                <th className="px-8 py-5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-[#E7E8EB] dark:border-white/10">NAME</th>
                <th className="px-8 py-5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-[#E7E8EB] dark:border-white/10">EMAIL</th>
                <th className="px-8 py-5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-[#E7E8EB] dark:border-white/10">ROLE</th>
                <th className="px-8 py-5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-[#E7E8EB] dark:border-white/10">ASSIGNED HOSPITAL</th>
                <th className="px-8 py-5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-[#E7E8EB] dark:border-white/10">STATUS</th>
                <th className="px-8 py-5 text-right text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-[#E7E8EB] dark:border-white/10">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E8EB] dark:divide-white/10">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-8 py-24 text-center text-gray-400 font-bold uppercase tracking-widest text-[12px] opacity-60">
                     SYSTEM RECORDS STATUS: EMPTY
                  </td>
                </tr>
              ) : (
                users.map((user, i) => (
                  <tr key={i} className="hover:bg-[#F8FAFC]/80 dark:hover:bg-white/[0.01] transition-all group">
                    <td className="px-8 py-6">
                      <div className="text-[14px] font-bold text-[#1e293b] dark:text-white leading-tight">{user.name}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-[14px] text-gray-600 dark:text-slate-400 font-medium">{user.email}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-[14px] font-bold text-[#1e293b] dark:text-white">{user.role}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-[14px] text-gray-600 dark:text-slate-400 font-medium">{user.hospital}</div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={cn(
                        "inline-flex px-3 py-1 rounded-full text-[11px] font-bold border leading-none items-center justify-center uppercase tracking-wider",
                        user.status === 'Active' 
                          ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                          : 'bg-red-100 text-red-700 border-red-200'
                      )}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => onView(user)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors group/btn"
                        >
                          <Eye className="w-5 h-5 text-primary" />
                        </button>
                        <button 
                          onClick={() => onEdit(user)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors group/btn"
                        >
                          <Edit3 className="w-5 h-5 text-blue-500" />
                        </button>
                        <button 
                          onClick={() => onDelete(user)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors group/btn"
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
    </div>
  );
}