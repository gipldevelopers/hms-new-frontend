"use client";

import React, { useState, useEffect } from "react";
import { Search, UserPlus, ArrowLeft, Trash2 } from "lucide-react";
import { UserTable, UserStats } from "@/components/super-admin/users/UserComponents";
import { AddUserModal } from "@/components/super-admin/users/AddUserModal";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = "/api";

export default function StaffManagementPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
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
      
      const userParams = new URLSearchParams();
      if (roleFilter !== "All") userParams.append("role", roleFilter);
      if (searchQuery) userParams.append("search", searchQuery);
      
      const userRes = await fetch(`${API_BASE}/users?${userParams.toString()}`, { headers });
      const userJson = await userRes.json();
      
      if (userJson.success) {
        const enrichedUsers = userJson.data.map(u => ({
          ...u,
          hospital: u.branch ? u.branch.name : "LOCAL BRANCH",
          status: u.status || "Active"
        }));
        setUsers(enrichedUsers);
      }
    } catch (error) {
      console.error("Fetch staff error:", error);
      toast.error("Unable to load staff data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(timer);
  }, [roleFilter, searchQuery]);

  if (!mounted) return null;

  const handleCreateNew = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleView = (user) => {
    toast.info(`Viewing profile for ${user.name}`);
  };

  const confirmDelete = async () => {
    if (!deleteUser) return;
    try {
      setIsDeleting(true);
      const token = localStorage.getItem("authtoken");
      const res = await fetch(`${API_BASE}/users/${deleteUser.id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Staff member removed from records");
        fetchData();
      } else {
        toast.error(json.message || "Failed to remove staff member");
      }
    } catch (err) {
      toast.error("Network error during operation");
    } finally {
      setIsDeleting(false);
      setDeleteUser(null);
    }
  };

  return (
    <div className="p-6 bg-background min-h-screen flex flex-col space-y-5 transition-colors duration-300 font-sans">
      
      {/* Header Section */}
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-[20px] font-bold text-foreground tracking-tight leading-none">Staff Management</h1>
        
        <button 
          onClick={handleCreateNew}
          className="bg-primary text-white px-8 h-[48px] rounded-[5px] text-[13px] font-bold flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-none"
        >
          <UserPlus className="w-4 h-4" />
          Add staff
        </button>
      </div>

      <div className="mb-[20px]">
        <UserStats />
      </div>

      <div className="space-y-5 pb-20 relative">
        <UserTable 
          users={loading ? [] : users}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={(user) => setDeleteUser(user)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
        />
        
        {loading && (
          <div className="absolute inset-0 top-32 flex flex-col items-center pt-24 bg-white/50 dark:bg-[#0A0F1D]/50 backdrop-blur-sm z-10 rounded-[5px]">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
            <p className="text-[11px] font-bold text-gray-400">Loading staff members...</p>
          </div>
        )}
      </div>

      <AddUserModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchData}
        editingUser={editingUser}
        branches={adminInfo?.branch ? [adminInfo.branch] : []}
        selectedBranchId={adminInfo?.branchId}
      />

      {/* Standardized Delete Modal */}
      <AnimatePresence>
        {deleteUser && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDeleteUser(null)}
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
                <h3 className="text-[18px] font-bold text-[#1e293b] dark:text-white mb-2">Delete Staff Member?</h3>
                <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed max-w-[280px]">
                  Are you sure you want to delete <span className="font-bold text-gray-700 dark:text-gray-200">{deleteUser.name}</span>? This action will permanently remove their credentials.
                </p>
              </div>

              <div className="flex border-t border-gray-100 dark:border-white/5">
                <button 
                  onClick={() => setDeleteUser(null)}
                  className="flex-1 py-4 text-[13px] font-bold text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-r border-gray-100 dark:border-white/5"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
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
