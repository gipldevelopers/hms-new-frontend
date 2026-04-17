"use client";

import React, { useState, useEffect } from "react";
import { Plus, LayoutGrid, List, Search, Building2, MapPin, Phone, Edit3, Trash2, Eye, Database } from "lucide-react";
import { 
  BranchStats, BranchCard, 
  DeleteConfirmationModal 
} from "@/components/super-admin/branches/BranchComponents";
import { AddBranchModal } from "@/components/super-admin/branches/AddBranchModal";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function BranchesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [viewType, setViewType] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [branches, setBranches] = useState([]);
  const [editingBranch, setEditingBranch] = useState(null);
  const [branchToDelete, setBranchToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [schemaInfo, setSchemaInfo] = useState({ version: null });
  const [isSyncingAll, setIsSyncingAll] = useState(false);

  // Responsive view enforcement
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setViewType("grid");
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredBranches = branches; // Server-side filtered now

  const outOfSyncBranches = branches.filter(b => 
    b.dbName && (!b.isDbInitialized || b.schemaVersion !== schemaInfo.version)
  );

  const fetchSchemaInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/branches/schema/info", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) setSchemaInfo(json.data);
    } catch (error) {
      console.error("Schema info error:", error);
    }
  };

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const url = searchQuery ? `/api/branches?search=${encodeURIComponent(searchQuery)}` : "/api/branches";
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        setBranches(json.data);
      }
    } catch (error) {
      console.error("Fetch branches error:", error);
      toast.error("Failed to load branches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBranches();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchSchemaInfo();
  }, []);

  const handleSyncAll = async () => {
    try {
      setIsSyncingAll(true);
      const token = localStorage.getItem("token");
      const res = await fetch("/api/branches/sync/all", {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Infrastructure synchronized for ${json.data.success.length} branches`);
        fetchBranches();
      } else {
        toast.error(json.message);
      }
    } catch (error) {
      toast.error("Universal sync failed");
    } finally {
      setIsSyncingAll(false);
    }
  };

  const handleCreateNew = () => {
    setEditingBranch(null);
    setIsModalOpen(true);
  };

  const handleEdit = (branch) => {
    setEditingBranch(branch);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (branch) => {
    setBranchToDelete(branch);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!branchToDelete) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/branches/${branchToDelete.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        setIsDeleteModalOpen(false);
        toast.success("Branch deleted successfully");
        fetchBranches();
      } else {
        toast.error(json.message || "Failed to delete branch");
      }
    } catch (error) {
      console.error("Delete branch error:", error);
      toast.error("An error occurred while deleting");
    }
  };

  return (
    <div className="p-6 bg-[#F8F9FC] dark:bg-[#0A0F1D] min-h-screen space-y-[25px] flex flex-col transition-colors duration-300 font-sans">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-[25px]">
        <h1 className="text-[20px] font-bold text-[#1e293b] dark:text-white leading-tight">Branch Management</h1>
        <div className="flex items-center gap-3">
          {branches.length > 0 && (
            <button 
              onClick={handleSyncAll}
              disabled={isSyncingAll}
              className={cn(
                "px-5 h-[44px] rounded-[6px] text-[13px] font-bold flex items-center gap-2 transition-all border shadow-none",
                outOfSyncBranches.some(b => !b.schemaVersion) 
                  ? "bg-red-500 text-white border-red-600 hover:bg-red-600 animate-pulse" 
                  : outOfSyncBranches.length > 0
                  ? "bg-amber-500 text-white border-amber-600 hover:bg-amber-600"
                  : "bg-white dark:bg-[#101935] text-gray-500 border-[#E7E8EB] dark:border-white/10 hover:bg-gray-50"
              )}
            >
              <Database className="w-4 h-4" /> 
              {isSyncingAll ? (
                <span>SYNCHRONIZING {branches.length}...</span>
              ) : outOfSyncBranches.some(b => !b.schemaVersion) ? (
                <span>Initialize All Branches ({outOfSyncBranches.length})</span>
              ) : outOfSyncBranches.length > 0 ? (
                <span>Universal Schema Sync ({outOfSyncBranches.length})</span>
              ) : (
                <span>Force Universal Sync</span>
              )}
            </button>
          )}
          <button 
            onClick={handleCreateNew}
            className="bg-primary text-white px-5 h-[44px] rounded-[6px] text-[13px] font-bold flex items-center gap-2 hover:bg-primary/90 transition-all border border-primary shadow-none"
          >
            <Plus className="w-4.5 h-4.5" /> Add New Branch
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <BranchStats />

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-[#101935] p-3 rounded-[12px] border border-[#E7E8EB] dark:border-white/10 shadow-none">
        <div className="relative w-full md:w-[350px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search branches by name, code or location..."
            className="w-full h-10 pl-10 pr-4 bg-[#F8F9FC] dark:bg-[#1e293b] border border-gray-100 dark:border-white/10 rounded-[6px] text-[13px] font-medium focus:border-primary transition-all font-semibold outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Responsive Switcher Hiding */}
        <div className="flex items-center gap-2 hidden lg:flex">
          <div className="flex items-center gap-1 bg-[#F8F9FC] dark:bg-[#1e293b] p-1 rounded-[6px] border border-[#E7E8EB] dark:border-white/10">
            <button 
              onClick={() => setViewType("grid")}
              className={cn(
                "p-1.5 rounded-[4px] transition-all",
                viewType === "grid" ? "bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 text-primary shadow-sm" : "text-gray-400 hover:text-primary"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewType("list")}
              className={cn(
                "p-1.5 rounded-[4px] transition-all",
                viewType === "list" ? "bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 text-primary shadow-sm" : "text-gray-400 hover:text-primary"
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Hospital List Section */}
      <div className="space-y-[20px] pb-10">
        <div className="flex justify-between items-center px-1 border-b border-gray-100 dark:border-white/5 pb-4">
          <h2 className="text-[14px] font-bold text-[#1e293b] dark:text-white uppercase tracking-wider">Registered Institutions</h2>
        </div>

        {/* Grid/List Content */}
        {loading ? (
          <div className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-[12px] animate-pulse">Synchronizing Branches...</div>
        ) : (
          <div className={cn(
            "grid gap-6 transition-all duration-500",
            viewType === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
          )}>
            {filteredBranches.map((branch) => (
              <BranchCard 
                key={branch.id} 
                branch={{
                   ...branch,
                   occupancy: "-",
                   staff: "-",
                   depts: "-",
                   manager: "-",
                   revenue: "₹-",
                   currentSchemaVersion: schemaInfo.version
                }} 
                viewType={viewType} 
                onEdit={() => handleEdit(branch)}
                onDelete={() => handleDeleteClick(branch)}
                isGlobalSyncing={isSyncingAll}
              />
            ))}
          </div>
        )}
        
        {!loading && filteredBranches.length === 0 && (
          <div className="py-24 text-center bg-white dark:bg-[#101935] rounded-[10px] border border-dashed border-gray-200">
             <p className="text-gray-400 font-medium font-bold uppercase tracking-widest text-xs opacity-50">No hospital branches match your records.</p>
          </div>
        )}
      </div>

      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={branchToDelete?.name}
      />

      <AddBranchModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchBranches}
        editingBranch={editingBranch}
      />
    </div>
  );
}
