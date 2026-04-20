"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Plus, LayoutGrid, Search, UserPlus, Filter, Building2, ChevronDown, Check, ArrowLeft } from "lucide-react";
import { UserTable, UserStats } from "@/components/super-admin/users/UserComponents";
import { AddUserModal } from "@/components/super-admin/users/AddUserModal";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const API_BASE = "/api";

export default function BranchUserManagementPage() {
  const { id: branchId } = useParams();
  const router = useRouter();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  
  const [users, setUsers] = useState([]);
  const [branch, setBranch] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = { 
        "Authorization": `Bearer ${token}` 
      };
      
      // Fetch Branch Details
      const branchRes = await fetch(`${API_BASE}/branches/${branchId}`, { headers });
      const branchJson = await branchRes.json();
      if (branchJson.success) setBranch(branchJson.data);

      // Fetch Users for this specific branch
      const userParams = new URLSearchParams();
      userParams.append("branchId", branchId);
      if (roleFilter !== "All") userParams.append("role", roleFilter);
      if (searchQuery) userParams.append("search", searchQuery);
      
      const userRes = await fetch(`${API_BASE}/users?${userParams.toString()}`, { headers });
      const userJson = await userRes.json();
      
      if (userJson.success) {
        const enrichedUsers = userJson.data.map(u => ({
          ...u,
          hospital: u.branch ? u.branch.name : "GLOBAL REGISTRY",
          status: u.status || "Active"
        }));
        setUsers(enrichedUsers);
      }
    } catch (error) {
      console.error("Fetch users error:", error);
      toast.error("Handshake fail. Registry inaccessible.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(timer);
  }, [roleFilter, searchQuery, branchId]);

  const handleCreateNew = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleView = (user) => {
    toast.info(`Reviewing profile for ${user.name}`);
  };

  const handleDelete = async (user) => {
    const confirmed = window.confirm(`REVOKE ACCESS: Are you sure you want to permanently remove all credentials for ${user.name}?`);
    
    if (confirmed) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/users/${user.id}`, {
          method: "DELETE",
          headers: { 
            "Authorization": `Bearer ${token}` 
          }
        });
        const json = await res.json();
        if (json.success) {
          toast.success("Personnel purged from registry");
          fetchData();
        } else {
          toast.error(json.message || "Revocation failed");
        }
      } catch (err) {
        toast.error("Security module handshake timeout");
      }
    }
  };

  return (
    <div className="p-6 bg-[#F8F9FC] dark:bg-[#0A0F1D] min-h-screen flex flex-col transition-colors duration-300 font-sans">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-gray-500 hover:text-primary transition-all shadow-none"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="space-y-1">
            <h1 className="text-[20px] font-bold text-[#1e293b] dark:text-white tracking-tight leading-none">
              {branch ? `${branch.name} Directory` : "Branch User Directory"}
            </h1>
          </div>
        </div>
        
        <button 
          onClick={handleCreateNew}
          className="bg-primary text-white px-8 h-[48px] rounded-[5px] text-[13px] font-bold flex items-center justify-center gap-3 hover:opacity-90 transition-all tracking-widest shadow-none"
        >
          <UserPlus className="w-4 h-4" />
          Add Branch User
        </button>
      </div>

      <UserStats />

      <div className="space-y-[30px] pb-20 relative">
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
          <div className="absolute inset-0 top-32 flex flex-col items-center pt-24 bg-white/50 dark:bg-[#0A0F1D]/50 backdrop-blur-sm z-10 rounded-[12px]">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest font-mono">Synchronizing Isolated Database...</p>
          </div>
        )}
      </div>

      <AddUserModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchData}
        editingUser={editingUser}
        branches={branch ? [branch] : []}
        selectedBranchId={branchId}
      />
    </div>
  );
}
