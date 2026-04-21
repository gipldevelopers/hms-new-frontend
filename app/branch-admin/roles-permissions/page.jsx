"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  ShieldCheck, 
  ArrowLeft, 
  Lock, 
  Unlock, 
  Eye, 
  Edit3, 
  Trash2,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { AddUserModal } from "@/components/super-admin/users/AddUserModal";
import { UserStats } from "@/components/super-admin/users/UserComponents";

const API_BASE = "/api";

export default function RolesPermissionsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminInfo, setAdminInfo] = useState(null);

  useEffect(() => {
    setMounted(true);
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setAdminInfo(user);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authtoken");
      const headers = { "Authorization": `Bearer ${token}` };
      
      const res = await fetch(`${API_BASE}/users?search=${searchQuery}`, { headers });
      const json = await res.json();
      
      if (json.success) {
        // Filter out admins from roles page as requested (or just show staff)
        const staffUsers = json.data.filter(u => !["SUPERADMIN", "BRANCH_ADMIN"].includes(u.role));
        setUsers(staffUsers);
      }
    } catch (error) {
      console.error("Fetch roles error:", error);
      toast.error("Handshake timeout. Permissions registry disconnected.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mounted) {
      const timer = setTimeout(fetchData, 300);
      return () => clearTimeout(timer);
    }
  }, [searchQuery, mounted]);

  if (!mounted) return null;

  const handleToggleRestrict = async (user) => {
    const newStatus = !user.isRestricted;
    
    try {
      const token = localStorage.getItem("authtoken");
      const res = await fetch(`${API_BASE}/users/${user.id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({
          isRestricted: newStatus
        })
      });
      
      if (res.ok) {
        toast.success(`Access Security: Console matrix ${newStatus ? 'restricted' : 'restored'}`);
        fetchData();
      }
    } catch (err) {
      toast.error("Access control handshake failed");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (user) => {
    if (window.confirm(`VAPORIZE ACCESS: Permanently purge all roles and permissions for ${user.name}?`)) {
      try {
        const token = localStorage.getItem("authtoken");
        await fetch(`${API_BASE}/users/${user.id}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` }
        });
        toast.success("Security cleared. User wiped from permission matrix.");
        fetchData();
      } catch (err) {
        toast.error("Purge failure");
      }
    }
  };

  const formatRole = (role) => {
    if (!role) return "N/A";
    return role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  return (
    <div className="p-4 sm:p-6 bg-[#F8F9FC] dark:bg-[#0A0F1D] min-h-screen flex flex-col transition-colors duration-300 font-sans">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 border border-[#E7E8EB] dark:border-white/10 rounded-[5px] flex items-center justify-center hover:bg-gray-50 transition-all text-gray-400 bg-white dark:bg-[#101935] shadow-none shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="space-y-1">
            <h1 className="text-[18px] sm:text-[20px] font-bold text-[#1e293b] dark:text-white tracking-tight leading-none">Access control matrix</h1>
          </div>
        </div>
        
        <button 
          onClick={() => {
            setEditingUser(null);
            setIsModalOpen(true);
          }}
          className="bg-primary text-white px-6 sm:px-8 h-[44px] sm:h-[48px] rounded-[5px] text-[12px] sm:text-[13px] font-bold flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-none w-full sm:w-auto"
        >
          <ShieldCheck className="w-4 h-4" />
          Provision roles
        </button>
      </div>

      <UserStats />

      {/* Filter & Table Area */}
      <div className="space-y-6 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-[#101935] p-3 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 shadow-none">
          <div className="relative w-full md:w-[380px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search personnel by identity or clearance..." 
              className="w-full h-11 pl-11 pr-4 bg-[#F8F9FC] dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-medium outline-none focus:border-primary transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-[#101935] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 shadow-none overflow-hidden relative">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-[#F8FAFC] dark:bg-white/[0.02]">
                        <th className="px-8 py-5 text-left text-[11px] font-bold text-gray-400 border-b border-[#E7E8EB] dark:border-white/10 tracking-wider">Identity Card</th>
                        <th className="px-8 py-5 text-left text-[11px] font-bold text-gray-400 border-b border-[#E7E8EB] dark:border-white/10 tracking-wider">Primary Access</th>
                        <th className="px-8 py-5 text-left text-[11px] font-bold text-gray-400 border-b border-[#E7E8EB] dark:border-white/10 tracking-wider">Console Clearances</th>
                        <th className="px-8 py-5 text-right text-[11px] font-bold text-gray-400 border-b border-[#E7E8EB] dark:border-white/10 tracking-wider">Matrix Control</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#E7E8EB] dark:divide-white/10">
                    {users.map((user) => (
                        <tr key={user.id} className="hover:bg-[#F8FAFC]/80 dark:hover:bg-white/[0.01] transition-all group">
                            <td className="px-8 py-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-primary/5 dark:bg-primary/10 flex items-center justify-center text-primary font-bold text-[13px]">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[14px] font-bold text-[#1e293b] dark:text-white leading-tight">{user.name}</span>
                                        <span className="text-[11px] text-gray-400 font-medium">{user.email}</span>
                                    </div>
                                </div>
                            </td>
                            <td className="px-8 py-6">
                                <span className="inline-flex px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[11px] font-bold border border-indigo-100 dark:border-indigo-500/20 rounded-[5px] uppercase">
                                    {formatRole(user.role)}
                                </span>
                            </td>
                            <td className="px-8 py-6">
                                <div className="flex flex-wrap gap-1.5">
                                    {user.consoleRoles?.length > 0 ? (
                                        user.consoleRoles.map(role => (
                                            <span 
                                                key={role} 
                                                className={cn(
                                                    "px-2.5 py-1 text-[10px] font-bold border rounded-[5px] uppercase transition-all",
                                                    user.isRestricted 
                                                        ? "bg-gray-100 text-gray-400 border-gray-200 line-through opacity-50 shadow-none" 
                                                        : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20"
                                                )}
                                            >
                                                {formatRole(role)}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-[11px] text-gray-400 italic font-medium opacity-50">No secondary clearance</span>
                                    )}
                                </div>
                            </td>
                            <td className="px-8 py-6 text-right">
                                <div className="flex items-center justify-end gap-1">
                                    <button 
                                        onClick={() => handleToggleRestrict(user)}
                                        className={cn(
                                            "p-2 rounded-[5px] transition-colors group/btn",
                                            user.isRestricted 
                                                ? "bg-amber-50 text-amber-500 border border-amber-100 shadow-none" 
                                                : "text-gray-400 hover:text-amber-500 hover:bg-gray-100 dark:hover:bg-white/5"
                                        )}
                                        title={user.isRestricted ? "Restore Clearances" : "Restrict All Consoles"}
                                    >
                                        {user.isRestricted ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                                    </button>
                                    <button 
                                        onClick={() => toast.info(`Reviewing clearances for ${user.name}`)}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-[5px] transition-colors"
                                    >
                                        <Eye className="w-5 h-5 text-primary" />
                                    </button>
                                    <button 
                                        onClick={() => handleEdit(user)} 
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-[5px] transition-colors"
                                    >
                                        <Edit3 className="w-5 h-5 text-blue-500" />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(user)} 
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-[5px] transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5 text-red-500" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {users.length === 0 && !loading && (
                        <tr>
                            <td colSpan="4" className="py-24 text-center">
                                <div className="flex flex-col items-center gap-3">
                                    <AlertCircle className="w-10 h-10 text-gray-200" />
                                    <p className="text-[11px] font-bold text-gray-300 uppercase tracking-widest leading-none">Registry desolation confirmed.</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
          </div>

          {loading && (
            <div className="absolute inset-0 top-16 flex flex-col items-center pt-24 bg-white/50 dark:bg-[#101935]/50 backdrop-blur-sm z-10">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
              <p className="text-[11px] font-bold text-gray-400 italic">Decrypting permission indices...</p>
            </div>
          )}
        </div>
      </div>

      <AddUserModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchData}
        editingUser={editingUser}
        branches={adminInfo?.branch ? [adminInfo.branch] : []}
        selectedBranchId={adminInfo?.branchId}
      />
    </div>
  );
}
