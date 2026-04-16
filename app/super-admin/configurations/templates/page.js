"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  LayoutGrid, 
  List, 
  FileText, 
  Search,
  Edit,
  Trash2,
  Eye,
  Database
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { DeleteConfirmationModal } from "@/components/super-admin/branches/BranchComponents";

function TemplateCard({ file, viewType, onDelete }) {
  const isList = viewType === "list";
  
  return (
    <div 
      className={cn(
        "group bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[10px] overflow-hidden flex transition-all duration-500 relative",
        isList ? "flex-row items-center p-5 gap-6" : "flex-col p-6 h-full"
      )}
    >
      <div className={cn("flex-1 transition-all duration-500", isList && "flex-[3]")}>
        <div className="flex justify-between items-start mb-5">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/10 rounded-[5px] flex items-center justify-center border border-indigo-100 dark:border-indigo-900/20 shrink-0">
               <FileText className="w-6 h-6 text-[#2D3A8C]" />
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
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-sans">Layout blocks</p>
                <p className="text-[15px] font-bold text-[#1e293b] dark:text-white leading-none">{(file.blocks || []).length} Sections</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-sans">Category</p>
                <p className="text-[15px] font-bold text-[#1e293b] dark:text-white leading-none capitalize">{file.category}</p>
              </div>
              <div className="line-clamp-2 max-w-[300px]">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-sans">Created On</p>
                <p className="text-[12px] text-gray-500 leading-relaxed truncate">{new Date(file.createdAt).toLocaleDateString()}</p>
              </div>
           </div>
        ) : (
          <div className="animate-in fade-in zoom-in-95 duration-700">
            <p className="text-[12px] text-gray-400 dark:text-gray-500 mt-2 line-clamp-2 leading-relaxed font-medium min-h-[40px] capitalize">
              Standardized hospital {file.category} document structure.
            </p>
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/5 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Layout Blocks</p>
                <p className="text-[14px] font-bold text-[#1e293b] dark:text-white">{(file.blocks || []).length} Blocks</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Last Update</p>
                <p className="text-[14px] font-bold text-[#1e293b] dark:text-white">{new Date(file.updatedAt).toLocaleDateString()}</p>
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
          onClick={() => window.location.href=`/super-admin/configurations/templates/create?id=${file.id}`}
          className={cn("px-4 h-9 bg-[#F4F5FB] dark:bg-[#1e293b] hover:bg-[#EAEBFF] text-[#2D3A8C] font-semibold text-[12px] rounded-[5px] transition-all flex items-center justify-center gap-2 border border-indigo-100/30", !isList && "flex-1")}
        >
          <Eye className="w-4 h-4" /> View
        </button>
        <button 
          onClick={() => window.location.href=`/super-admin/configurations/templates/create?id=${file.id}`}
          className={cn("px-4 h-9 bg-[#2D3A8C] text-white font-semibold text-[12px] rounded-[5px] transition-all hover:bg-[#1e2775] flex items-center justify-center gap-2", !isList && "flex-1")}
        >
          <Edit className="w-4 h-4" /> Edit
        </button>
        <button 
           onClick={() => onDelete(file.id)}
           className="w-9 h-9 bg-red-50 text-red-500 rounded-[5px] flex items-center justify-center hover:bg-red-500 hover:text-white transition-all border border-red-100"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function TemplatesPage() {
  const [viewType, setViewType] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    fetchTemplates();
    
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

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5050/api/templates?search=${searchQuery}`);
      const data = await res.json();
      if (res.ok) {
        setTemplates(data);
      }
    } catch (err) {
      toast.error("Failed to fetch templates");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    const item = templates.find(t => t.id === id);
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      const res = await fetch(`http://localhost:5050/api/templates/${itemToDelete.id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Template deleted");
        setIsDeleteModalOpen(false);
        fetchTemplates();
      }
    } catch (err) {
      toast.error("Deletion failed");
    }
  };

  return (
    <div className="p-6 bg-[#F8F9FC] dark:bg-[#0A0F1D] min-h-screen space-y-[25px] flex flex-col transition-colors duration-300 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[20px] font-bold text-[#1e293b] dark:text-white leading-tight">Document Templates</h1>
        </div>
        <button 
          onClick={() => window.location.href = '/super-admin/configurations/templates/create'}
          className="bg-[#2D3A8C] text-white px-5 py-2.5 rounded-[5px] text-[13px] font-semibold flex items-center gap-2 hover:bg-[#1e2775] transition-all"
        >
          <Plus className="w-4.5 h-4.5" /> Add New Template
        </button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Active Templates", value: templates.length, icon: FileText, color: "blue" },
          { label: "Design Blocks", value: templates.reduce((acc, curr) => acc + (curr.blocks?.length || 0), 0), icon: LayoutGrid, color: "indigo" },
          { label: "Categories", value: [...new Set(templates.map(t => t.category))].length, icon: Database, color: "emerald" },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-[#101935] p-5 rounded-[12px] border border-[#E7E8EB] dark:border-white/10 flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-[10px] flex items-center justify-center",
              stat.color === "blue" && "bg-blue-50 text-blue-500 dark:bg-blue-900/20",
              stat.color === "indigo" && "bg-indigo-50 text-indigo-500 dark:bg-indigo-900/20",
              stat.color === "emerald" && "bg-emerald-50 text-emerald-500 dark:bg-emerald-900/20",
            )}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none">{stat.label}</p>
              <p className="text-[20px] font-bold text-[#1e293b] dark:text-white mt-1.5 leading-none">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-[#101935] p-3 rounded-[12px] border border-[#E7E8EB] dark:border-white/10 shadow-none">
        <div className="relative w-full md:w-[350px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search templates..."
            className="w-full h-10 pl-10 pr-4 bg-[#F8F9FC] dark:bg-[#1e293b] border-none rounded-[6px] text-[13px] font-medium focus:ring-1 focus:ring-[#2D3A8C] transition-all font-semibold"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 hidden lg:flex">
          <div className="flex items-center gap-1 bg-[#F8F9FC] dark:bg-[#1e293b] p-1 rounded-[6px] border border-[#E7E8EB] dark:border-white/10 text-[#1e293b] dark:text-white">
            <button 
              onClick={() => setViewType("grid")}
              className={cn(
                "p-1.5 rounded-[4px] transition-all",
                viewType === "grid" ? "bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 text-[#2D3A8C] shadow-sm" : "text-gray-400 hover:text-[#2D3A8C]"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewType("list")}
              className={cn(
                "p-1.5 rounded-[4px] transition-all",
                viewType === "list" ? "bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 text-[#2D3A8C] shadow-sm" : "text-gray-400 hover:text-[#2D3A8C]"
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic View Content */}
      <div className={cn(
        "grid gap-6 transition-all duration-500 pb-10",
        viewType === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
      )}>
        {loading ? (
          <div className="col-span-full py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-[12px] animate-pulse">Loading Templates...</div>
        ) : (
          templates.map((file) => (
            <TemplateCard key={file.id} file={file} viewType={viewType} onDelete={handleDeleteClick} />
          ))
        )}
        {templates.length === 0 && !loading && (
          <div className="col-span-full py-24 text-center bg-white dark:bg-[#101935] rounded-[10px] border border-dashed border-gray-200">
             <p className="text-gray-400 font-medium font-bold uppercase tracking-widest text-xs opacity-50">No templates found in library.</p>
          </div>
        )}
      </div>

      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={itemToDelete?.name}
        title="Delete Template?"
      />
    </div>
  );
}
