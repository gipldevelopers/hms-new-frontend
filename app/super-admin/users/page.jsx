"use client";

import React, { useState, useEffect } from "react";
import { Plus, LayoutGrid, Search, UserPlus, Filter, Building2, ChevronDown, Check } from "lucide-react";
import { UserTable, UserStats } from "@/components/super-admin/users/UserComponents";
import { AddUserModal } from "@/components/super-admin/users/AddUserModal";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const API_BASE = "/api";

export default function UserManagementPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branchSearch, setBranchSearch] = useState("");
  
  const [users, setUsers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authtoken");
      const headers = { 
        "Authorization": `Bearer ${token}` 
      };
      
      // Fetch Branches
      const branchRes = await fetch(`${API_BASE}/branches`, { headers });
      const branchJson = await branchRes.json();
      if (branchJson.success) setBranches(branchJson.data);

      // Fetch Users with active filters
      const userParams = new URLSearchParams();
      if (roleFilter !== "All") userParams.append("role", roleFilter);
      if (selectedBranch) userParams.append("branchId", selectedBranch.id);
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
      toast.error("Cloud synchronization timeout. System isolated.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(timer);
  }, [roleFilter, selectedBranch, searchQuery]);

  const filteredUsers = users; // Server-side filtered now

  const handleCreateNew = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleView = (user) => {
    toast.info(`Reviewing bio-matrix profile for ${user.name}`);
  };

  const handleDelete = async (user) => {
    const confirmed = window.confirm(`TERMNATE ACCESS: Are you sure you want to revoke all credentials for ${user.name}? This action is permanent across Global and Branch registries.`);
    
    if (confirmed) {
      try {
        const token = localStorage.getItem("authtoken");
        const res = await fetch(`${API_BASE}/users/${user.id}`, {
          method: "DELETE",
          headers: { 
            "Authorization": `Bearer ${token}` 
          }
        });
        const json = await res.json();
        if (json.success) {
          toast.success("Personnel access revoked and purged from system");
          fetchData();
        } else {
          toast.error(json.message || "Revocation failed");
        }
      } catch (err) {
        toast.error("Handshake error with security module");
      }
    }
  };

  const filteredBranches = branches.filter(b => 
    b.name.toLowerCase().includes(branchSearch.toLowerCase())
  );

  return (
    <div className="p-6 bg-[#F8F9FC] dark:bg-[#0A0F1D] min-h-screen flex flex-col transition-colors duration-300 font-sans">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-5">
        <h1 className="text-[20px] font-bold text-[#1e293b] dark:text-white tracking-tight leading-none">User Matrix Control</h1>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
             <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-3 bg-white dark:bg-[#101935] px-4 h-[42px] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 hover:border-primary transition-all outline-none group min-w-[240px] shadow-none">
                 <Building2 className="w-4 h-4 text-primary shrink-0" />
                 <span className={cn("text-[13px] font-bold truncate flex-1 text-left", !selectedBranch && "text-gray-400 font-medium")}>
                    {selectedBranch ? selectedBranch.name : "System Global Filter"}
                 </span>
                 <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors shrink-0" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[300px] border-[#E7E8EB] dark:bg-[#101935] dark:border-white/10 p-2 shadow-none flex flex-col gap-1 rounded-[5px]">
                <div className="relative mb-2 px-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input 
                    type="text"
                    placeholder="Search locations..."
                    className="w-full h-9 pl-8 pr-3 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-[5px] text-[11px] font-bold outline-none focus:border-primary"
                    value={branchSearch}
                    onChange={(e) => setBranchSearch(e.target.value)}
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                </div>
                
                <div className="max-h-[250px] overflow-y-auto custom-scrollbar">
                  <DropdownMenuItem 
                    onClick={() => setSelectedBranch(null)}
                    className="flex items-center gap-3 px-3 py-2 text-[12px] font-bold cursor-pointer rounded-[5px] mb-0.5 tracking-wide"
                  >
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span>Global Personnel View</span>
                    {!selectedBranch && <Check className="w-4 h-4 ml-auto text-primary" />}
                  </DropdownMenuItem>
                  {filteredBranches.map((branch) => (
                    <DropdownMenuItem 
                      key={branch.id} 
                      onClick={() => setSelectedBranch(branch)}
                      className="flex items-center gap-3 px-3 py-2 text-[12px] font-bold cursor-pointer rounded-[5px] mb-0.5 tracking-wide"
                    >
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span>{branch.name}</span>
                      {selectedBranch?.id === branch.id && <Check className="w-4 h-4 ml-auto text-primary" />}
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <button 
              onClick={handleCreateNew}
              className="bg-primary text-white px-6 h-[42px] rounded-[5px] text-[12px] font-bold flex items-center justify-center gap-3 hover:opacity-90 transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Register User
            </button>
        </div>
      </div>

      <UserStats />

      <div className="space-y-[30px] pb-20 relative">
        <UserTable 
          users={loading ? [] : filteredUsers}
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
            <p className="text-[11px] font-bold text-gray-400">Accessing Encrypted Personnel Registry...</p>
          </div>
        )}
      </div>

      <AddUserModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchData}
        editingUser={editingUser}
        branches={branches}
        selectedBranchId={selectedBranch?.id}
      />
    </div>
  );
}
