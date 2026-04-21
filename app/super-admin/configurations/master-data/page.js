"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  LayoutGrid, 
  List, 
  ShieldCheck, 
  Search,
  Edit,
  Trash2,
  FileText,
  Eye,
  Settings2,
  Database
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteConfirmationModal } from "@/components/super-admin/branches/BranchComponents";

function MasterDataCard({ file, viewType, onDelete }) {
  const isList = viewType === "list";
  
  return (
    <div 
      className={cn(
        "group bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] overflow-hidden flex transition-all duration-500 relative",
        isList ? "flex-row items-center p-5 gap-6" : "flex-col p-6 h-full"
      )}
    >
      <div className={cn("flex-1 transition-all duration-500", isList && "flex-[3]")}>
        <div className="flex justify-between items-start mb-5">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-[5px] flex items-center justify-center border border-primary/20 shrink-0">
               <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-[17px] font-bold text-[#1e293b] dark:text-white leading-tight">{file.name}</h3>
              <p className="text-[12px] text-gray-400 dark:text-gray-500 mt-1.5 font-medium">{file.code}</p>
            </div>
          </div>
        </div>

        {isList ? (
           <div className="grid grid-cols-3 gap-6 animate-in fade-in duration-700">
              <div>
                <p className="text-[10px] font-bold text-gray-400 mb-1.5 font-sans">Total fields</p>
                <p className="text-[15px] font-bold text-[#1e293b] dark:text-white leading-none">{file.fields?.length || 0} Inputs</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 mb-1.5 font-sans">Total Records</p>
                <p className="text-[15px] font-bold text-[#1e293b] dark:text-white leading-none">{file._count?.records || 0} Entries</p>
              </div>
              <div className="line-clamp-2 max-w-[300px]">
                <p className="text-[10px] font-bold text-gray-400 mb-1.5 font-sans">Description</p>
                <p className="text-[12px] text-gray-500 leading-relaxed truncate">{file.description || "No description provided."}</p>
              </div>
           </div>
        ) : (
          <div className="animate-in fade-in zoom-in-95 duration-700">
            <p className="text-[12px] text-gray-400 dark:text-gray-500 mt-2 line-clamp-2 leading-relaxed font-medium min-h-[40px]">
              {file.description || "Standardized dynamic hospital master data schema."}
            </p>
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/5 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold text-gray-400 mb-1">Field Definition</p>
                <p className="text-[14px] font-bold text-[#1e293b] dark:text-white">{file.fields?.length || 0} Inputs</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 mb-1">Data Entries</p>
                <p className="text-[14px] font-bold text-[#1e293b] dark:text-white">{file._count?.records || 0} Records</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={cn(
         "flex items-center gap-2 transition-all duration-500", 
         isList ? "pb-0 px-0 flex-row w-auto border-l border-gray-100 dark:border-white/5 pl-8" : "mt-6"
      )}>
        <button 
          onClick={() => window.location.href=`/super-admin/configurations/master-data/fill?id=${file.id}`}
          className={cn("px-4 h-9 bg-primary/5 dark:bg-primary/10 hover:bg-primary/20 text-primary font-semibold text-[12px] rounded-[5px] transition-all flex items-center justify-center gap-2 shadow-none border border-primary/20", !isList && "flex-1")}
        >
          Fill Data
        </button>
        <button 
          onClick={() => window.location.href=`/super-admin/configurations/master-data/create?id=${file.id}`}
          className={cn("px-4 h-9 bg-primary text-white font-semibold text-[12px] rounded-[5px] transition-all hover:opacity-90 flex items-center justify-center gap-2", !isList && "flex-1")}
        >
          <Edit className="w-4 h-4" /> Edit
        </button>
        <button 
          onClick={() => onDelete(file.id)}
          className="w-9 h-9 bg-red-50 text-red-500 rounded-[5px] flex items-center justify-center hover:bg-red-500 hover:text-white transition-all border border-red-100 shadow-none"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function MasterDataPage() {
  const [viewType, setViewType] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [masterFiles, setMasterFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    fetchMasterData();
    
    // Force grid view on mobile/tablet
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setViewType("grid");
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Check initial
    
    return () => window.removeEventListener('resize', handleResize);
  }, [searchQuery]);

  const fetchMasterData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/master-data?search=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (res.ok && Array.isArray(data)) {
        setMasterFiles(data);
      } else {
        console.error("API Error or invalid data format:", data);
        setMasterFiles([]);
        if (data.message) toast.error(data.message);
      }
    } catch (err) {
      console.error("Fetch failed:", err);
      toast.error("Failed to fetch master data");
      setMasterFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    const item = masterFiles.find(f => f.id === id);
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/master-data/${itemToDelete.id}`, { 
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success("Schema deleted");
        setIsDeleteModalOpen(false);
        fetchMasterData();
      } else {
        throw new Error("Deletion failed");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="p-6 bg-[#F8F9FC] dark:bg-[#0A0F1D] min-h-screen space-y-[25px] flex flex-col transition-colors duration-300 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[20px] font-bold text-[#1e293b] dark:text-white leading-tight">Master Data Management</h1>
        </div>
        <button 
          onClick={() => window.location.href = '/super-admin/configurations/master-data/create'}
          className="bg-primary text-white px-5 py-2.5 rounded-[5px] text-[13px] font-semibold flex items-center gap-2 hover:opacity-90 transition-all border border-primary/20"
        >
          <Plus className="w-4.5 h-4.5" /> Add New Master Data
        </button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Design Schemas", value: Array.isArray(masterFiles) ? masterFiles.length : 0, icon: Settings2, color: "blue" },
          { label: "Active Fields", value: Array.isArray(masterFiles) ? masterFiles.reduce((acc, curr) => acc + (curr.fields?.length || 0), 0) : 0, icon: ShieldCheck, color: "indigo" },
          { label: "Total Data Entries", value: Array.isArray(masterFiles) ? masterFiles.reduce((acc, curr) => acc + (curr._count?.records || 0), 0) : 0, icon: Database, color: "emerald" },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-[#101935] p-5 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-[5px] flex items-center justify-center",
              stat.color === "blue" && "bg-primary/10 text-primary",
              stat.color === "indigo" && "bg-primary/10 text-primary",
              stat.color === "emerald" && "bg-emerald-50 text-emerald-500",
            )}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 leading-none">{stat.label}</p>
              <p className="text-[20px] font-bold text-[#1e293b] dark:text-white mt-1.5 leading-none">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-[#101935] p-3 rounded-[5px] border border-[#E7E8EB] dark:border-white/10">
        <div className="relative w-full md:w-[350px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search schemas..."
            className="w-full h-10 pl-10 pr-4 bg-[#F8F9FC] dark:bg-[#1e293b] border border-gray-100 dark:border-white/10 rounded-[5px] text-[13px] font-medium focus:border-primary transition-all font-semibold outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 hidden lg:flex">
          <div className="flex items-center gap-1 bg-[#F8F9FC] dark:bg-[#1e293b] p-1 rounded-[5px] border border-[#E7E8EB] dark:border-white/10">
            <button 
              onClick={() => setViewType("grid")}
              className={cn(
                "p-1.5 rounded-[5px] transition-all",
                viewType === "grid" ? "bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 text-primary shadow-sm" : "text-gray-400 hover:text-primary"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewType("list")}
              className={cn(
                "p-1.5 rounded-[5px] transition-all",
                viewType === "list" ? "bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 text-primary shadow-sm" : "text-gray-400 hover:text-primary"
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic View Content */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center p-20 text-gray-400 font-bold text-[13px]">
           Synchronizing with server...
        </div>
      ) : (
        <div className={cn(
          "grid gap-6 transition-all duration-500",
          viewType === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        )}>
          {masterFiles.map((file) => (
            <MasterDataCard key={file.id} file={file} viewType={viewType} onDelete={() => handleDeleteClick(file.id)} />
          ))}
          {masterFiles.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white dark:bg-[#101935] rounded-[5px] border border-dashed border-gray-200">
               <p className="text-gray-400 font-medium">No master data schemas found matching your search.</p>
            </div>
          )}
        </div>
      )}

      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={itemToDelete?.name}
        title="Delete Schema?"
      />
    </div>
  );
}
