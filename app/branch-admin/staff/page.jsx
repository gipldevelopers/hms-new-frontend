"use client";

import React, { useState, useEffect } from "react";
import { Search, UserPlus, ArrowLeft } from "lucide-react";
import { UserTable, UserStats } from "@/components/super-admin/users/UserComponents";
import { AddUserModal } from "@/components/super-admin/users/AddUserModal";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const API_BASE = "/api";

export default function StaffManagementPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminInfo, setAdminInfo] = useState(null);

  useEffect(() => {
    setMounted(true);
    // Determine current admin info from local storage
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setAdminInfo(user);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authtoken");
      const headers = { 
        "Authorization": `Bearer ${token}` 
      };
      
      // Fetch Users (Scoping is handled by backend JWT)
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

  const handleDelete = async (user) => {
    const confirmed = window.confirm(`Are you sure you want to delete ${user.name}?`);
    if (confirmed) {
      try {
        const token = localStorage.getItem("authtoken");
        const res = await fetch(`${API_BASE}/users/${user.id}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` }
        });
        const json = await res.json();
        if (json.success) {
          toast.success("Staff member deleted successfully");
          fetchData();
        }
      } catch (err) {
        toast.error("Failed to delete staff member");
      }
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
          onDelete={handleDelete}
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
    </div>
  );
}
