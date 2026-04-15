"use client";

import React, { useState, useEffect } from "react";
import { Plus, LayoutGrid, List } from "lucide-react";
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
  const [branches, setBranches] = useState([]);
  const [editingBranch, setEditingBranch] = useState(null);
  const [branchToDelete, setBranchToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBranches = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/branches", {
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
    fetchBranches();
  }, []);

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
      <div className="flex justify-between items-center mb-[20px]">
        <h1 className="text-[20px] font-bold text-[#1e293b] dark:text-white leading-tight">Branch Management</h1>
        <button 
          onClick={handleCreateNew}
          className="bg-[#2D3A8C] text-white px-4 py-2 rounded-[5px] text-[13px] font-semibold flex items-center gap-2 hover:bg-[#1e2775] transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" /> New Branch
        </button>
      </div>

      {/* Stats Section */}
      <BranchStats />

      {/* Hospital List Section */}
      <div className="space-y-[20px]">
        <div className="flex justify-between items-center">
          <h2 className="text-[18px] font-bold text-[#1e293b] dark:text-white">All Hospital</h2>
          <div className="flex items-center gap-1 bg-white dark:bg-[#101935] p-1 rounded-[5px] border border-[#E7E8EB] dark:border-white/10">
            <button 
              onClick={() => setViewType("grid")}
              className={cn(
                "p-1.5 rounded-[3px] transition-all",
                viewType === "grid" ? "bg-[#F4F5FB] dark:bg-[#1e293b] text-[#2D3A8C]" : "text-gray-400 hover:text-[#2D3A8C]"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewType("list")}
              className={cn(
                "p-1.5 rounded-[3px] transition-all",
                viewType === "list" ? "bg-[#F4F5FB] dark:bg-[#1e293b] text-[#2D3A8C]" : "text-gray-400 hover:text-[#2D3A8C]"
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Grid of Branch Cards */}
        {loading ? (
          <div className="flex justify-center p-20 text-gray-400">Loading branches...</div>
        ) : (
          <div className={cn(
            "grid gap-[20px]",
            viewType === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
          )}>
            {branches.map((branch, i) => (
              <BranchCard 
                key={branch.id} 
                branch={{
                   ...branch,
                   occupancy: "-",
                   staff: "-",
                   depts: "-",
                   manager: "-",
                   revenue: "₹-"
                }} 
                viewType={viewType} 
                onEdit={() => handleEdit(branch)}
                onDelete={() => handleDeleteClick(branch)}
              />
            ))}
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
