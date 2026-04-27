"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  LayoutGrid, 
  ShieldCheck, 
  FileText, 
  Search,
  Check,
  ChevronDown,
  Building2,
  Save,
  Info,
  ArrowRight,
  Database,
  X,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const API_BASE = "/api";

export default function AssignmentsPage() {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [masterData, setMasterData] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [selectedMasterData, setSelectedMasterData] = useState([]);
  const [selectedTemplates, setSelectedTemplates] = useState([]);

  // Search states
  const [branchSearch, setBranchSearch] = useState("");
  const [mdSearch, setMdSearch] = useState("");
  const [templateSearch, setTemplateSearch] = useState("");

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedBranch) {
      fetchCurrentAssignments(selectedBranch.id);
    } else {
      setSelectedMasterData([]);
      setSelectedTemplates([]);
    }
  }, [selectedBranch]);

  const getHeaders = () => {
    const token = localStorage.getItem("authtoken");
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };
  };

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const headers = getHeaders();
      // Fetch Branches
      const branchRes = await fetch(`${API_BASE}/branches`, { headers });
      const branchJson = await branchRes.json();
      if (branchJson.success) setBranches(branchJson.data);
      
      // Fetch Master Data
      const mdRes = await fetch(`${API_BASE}/master-data`, { headers });
      const mdData = await mdRes.json();
      setMasterData(mdData);
      
      // Fetch Templates
      const tempRes = await fetch(`${API_BASE}/templates`, { headers });
      const tempData = await tempRes.json();
      setTemplates(tempData);
    } catch (err) {
      toast.error("Failed to connect");
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentAssignments = async (branchId) => {
    try {
      const res = await fetch(`${API_BASE}/assignments?branchId=${branchId}`, {
        headers: getHeaders()
      });
      const json = await res.json();
      if (json.success) {
        const mdIds = json.data.filter(a => a.masterDataId).map(a => a.masterDataId);
        const tempIds = json.data.filter(a => a.templateId).map(a => a.templateId);
        setSelectedMasterData(mdIds);
        setSelectedTemplates(tempIds);
      }
    } catch (err) {
      toast.error("Failed to load assignments");
    }
  };

  const filteredBranches = branches.filter(b => 
    b.name.toLowerCase().includes(branchSearch.toLowerCase())
  );

  const filteredMasterData = masterData.filter(m => 
    m.name.toLowerCase().includes(mdSearch.toLowerCase()) ||
    m.code.toLowerCase().includes(mdSearch.toLowerCase())
  );

  const filteredTemplates = templates.filter(t => 
    t.name.toLowerCase().includes(templateSearch.toLowerCase()) ||
    t.category.toLowerCase().includes(templateSearch.toLowerCase())
  );

  const handleToggleMasterData = (id) => {
    setSelectedMasterData(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleToggleTemplate = (id) => {
    setSelectedTemplates(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (!selectedBranch) {
      toast.error("Please select a branch.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/assignments`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          branchId: selectedBranch.id,
          masterDataIds: selectedMasterData,
          templateIds: selectedTemplates
        })
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Assignments updated for ${selectedBranch.name}`);
      } else {
        toast.error(json.message || "Failed to save assignments");
      }
    } catch (err) {
      toast.error("Failed to save assignments");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-6 bg-[#F8F9FC] dark:bg-[#0A0F1D] min-h-screen space-y-[15px] md:space-y-[25px] flex flex-col transition-colors duration-300 font-sans pb-20">
      {/* Header - Fluid Design */}
      <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-4 mb-2">
        <div>
          <h1 className="text-[18px] md:text-[20px] font-bold text-[#1e293b] dark:text-white leading-tight">Branch Assignments</h1>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
           <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-3 bg-white dark:bg-[#101935] px-4 py-2.5 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 hover:border-primary transition-all outline-none group w-full sm:min-w-[240px] shadow-none">
                 <Building2 className="w-4 h-4 text-primary shrink-0" />
                 <span className={cn("text-[13px] font-bold truncate flex-1 text-left", !selectedBranch && "text-gray-400 font-medium")}>
                    {selectedBranch ? selectedBranch.name : "Select Branch"}
                 </span>
                 <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors shrink-0" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[calc(100vw-32px)] sm:w-[300px] border-[#E7E8EB] dark:bg-[#101935] dark:border-white/10 p-2 shadow-none flex flex-col gap-1 rounded-[5px]">
                <div className="relative mb-2 px-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input 
                    type="text"
                    placeholder="Search branches..."
                    className="w-full h-9 pl-8 pr-3 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-[5px] text-[12px] font-medium outline-none focus:border-primary"
                    value={branchSearch}
                    onChange={(e) => setBranchSearch(e.target.value)}
                    onKeyDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                
                <div className="max-h-[250px] overflow-y-auto custom-scrollbar">
                  {filteredBranches.map((branch) => (
                    <DropdownMenuItem 
                      key={branch.id} 
                      onClick={() => setSelectedBranch(branch)}
                      className="flex items-center gap-3 px-3 py-2 text-[13px] font-semibold cursor-pointer rounded-[5px] mb-0.5"
                    >
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span>{branch.name}</span>
                      {selectedBranch?.id === branch.id && <Check className="w-4 h-4 ml-auto text-primary" />}
                    </DropdownMenuItem>
                  ))}
                  {filteredBranches.length === 0 && <div className="p-3 text-center text-gray-400 text-xs font-bold">No matching branch</div>}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <button 
              disabled={saving || !selectedBranch}
              onClick={handleSave}
              className="bg-primary text-white px-6 py-2.5 rounded-[5px] text-[13px] font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 shadow-none border border-primary/20 h-[42px] whitespace-nowrap"
            >
              <Save className="w-4.5 h-4.5" /> {saving ? "Saving..." : "Save Assignments"}
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 items-start pb-10">
        {/* Master Data Assignments */}
        <div className="bg-white dark:bg-[#101935] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 overflow-hidden shadow-none flex flex-col">
          <div className="p-4 md:p-5 border-b border-gray-100 dark:border-white/5 flex flex-col gap-4 bg-[#F8F9FC]/30 dark:bg-white/[0.01]">
             <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary/10 dark:bg-primary/20 rounded-[5px] flex items-center justify-center border border-primary/20">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-[13px] md:text-[14px] font-bold text-[#1e293b] dark:text-white">Master Data Access</h3>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setSelectedMasterData(masterData.map(m => m.id))}
                    className="text-[10px] md:text-[11px] font-bold text-primary hover:opacity-80 transition-colors"
                  >
                    All
                  </button>
                  <span className="text-gray-200">/</span>
                  <button 
                    onClick={() => setSelectedMasterData([])}
                    className="text-[10px] md:text-[11px] font-bold text-gray-400 hover:text-red-500 transition-colors"
                  >
                    Clear
                  </button>
                </div>
             </div>

             {/* Search Bar for Master Data */}
              <div className="relative group/search">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within/search:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Filter schemas..."
                  className="w-full h-10 pl-10 pr-4 bg-white dark:bg-[#0A0F1D] border border-gray-100 dark:border-white/10 rounded-[5px] text-[13px] font-semibold outline-none focus:border-primary/50 transition-all shadow-none"
                  value={mdSearch}
                  onChange={(e) => setMdSearch(e.target.value)}
                />
             </div>
          </div>

          <div className="p-2 space-y-1.5 custom-scrollbar bg-white/50 dark:bg-transparent min-h-[100px]">
             {!selectedBranch && !loading && (
               <div className="py-16 md:py-20 text-center flex flex-col items-center gap-3">
                  <Target className="w-10 h-10 text-gray-200" />
                  <p className="text-[10px] md:text-[11px] font-bold text-gray-400 px-4">Select a branch to manage data</p>
               </div>
             )}
             {loading && (
                <div className="py-10 text-center text-gray-300 text-[11px] font-bold animate-pulse">Syncing...</div>
             )}
             {selectedBranch && !loading && filteredMasterData.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => handleToggleMasterData(item.id)}
                  className={cn(
                    "flex items-center p-3 md:p-4 rounded-[5px] transition-all cursor-pointer border group mx-1",
                    selectedMasterData.includes(item.id) 
                      ? "bg-primary/5 border-primary/20 dark:bg-primary/10 dark:border-primary/30 shadow-none" 
                      : "bg-white dark:bg-[#101935]/40 border-gray-100/50 dark:border-white/5 hover:border-primary/30 dark:hover:border-primary/30"
                  )}
                >
                   <div className={cn(
                     "w-9 h-9 md:w-10 md:h-10 rounded-[5px] flex items-center justify-center transition-all",
                     selectedMasterData.includes(item.id) ? "bg-primary text-white" : "bg-gray-100 dark:bg-[#1e293b] text-gray-400 group-hover:text-primary"
                   )}>
                      <Database className="w-5 h-5" />
                   </div>
                   <div className="flex-1 ml-3 md:ml-4 text-left">
                      <h4 className="text-[13px] md:text-[14px] font-bold text-[#1e293b] dark:text-white leading-tight truncate">{item.name}</h4>
                      <p className="text-[10px] md:text-[11px] text-gray-400 font-bold mt-1 tracking-tight opacity-70 truncate">{item.code} • {item.fields?.length || 0} Fields</p>
                   </div>
                   <div className={cn(
                     "w-5 h-5 rounded-[5px] border transition-all flex items-center justify-center shrink-0",
                     selectedMasterData.includes(item.id) ? "bg-primary border-primary" : "border-gray-200 dark:border-white/10 group-hover:border-primary/50"
                   )}>
                      {selectedMasterData.includes(item.id) && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                   </div>
                </div>
             ))}
          </div>
        </div>

        {/* Template Assignments */}
        <div className="bg-white dark:bg-[#101935] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 overflow-hidden shadow-none flex flex-col">
          <div className="p-4 md:p-5 border-b border-gray-100 dark:border-white/5 flex flex-col gap-4 bg-[#F8F9FC]/30 dark:bg-white/[0.01]">
             <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary/10 dark:bg-primary/20 rounded-[5px] flex items-center justify-center border border-primary/20">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-[13px] md:text-[14px] font-bold text-[#1e293b] dark:text-white">Document Templates</h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setSelectedTemplates(templates.map(t => t.id))}
                    className="text-[10px] md:text-[11px] font-bold text-primary hover:opacity-80 transition-colors"
                  >
                    All
                  </button>
                  <span className="text-gray-200">/</span>
                  <button 
                    onClick={() => setSelectedTemplates([])}
                    className="text-[10px] md:text-[11px] font-bold text-gray-400 hover:text-red-500 transition-colors"
                  >
                    Clear
                  </button>
                </div>
             </div>

             {/* Search Bar for Templates */}
              <div className="relative group/search">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within/search:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Filter templates..."
                  className="w-full h-10 pl-10 pr-4 bg-white dark:bg-[#0A0F1D] border border-gray-100 dark:border-white/10 rounded-[5px] text-[13px] font-semibold outline-none focus:border-primary/50 transition-all shadow-none"
                  value={templateSearch}
                  onChange={(e) => setTemplateSearch(e.target.value)}
                />
             </div>
          </div>

          <div className="p-2 space-y-1.5 custom-scrollbar bg-white/50 dark:bg-transparent min-h-[100px]">
             {!selectedBranch && !loading && (
               <div className="py-16 md:py-20 text-center flex flex-col items-center gap-3">
                  <Target className="w-10 h-10 text-gray-200" />
                  <p className="text-[10px] md:text-[11px] font-bold text-gray-400 px-4">Select a branch to manage templates</p>
               </div>
             )}
             {loading && (
                <div className="py-10 text-center text-gray-300 text-[11px] font-bold animate-pulse">Syncing...</div>
             )}
             {selectedBranch && !loading && filteredTemplates.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => handleToggleTemplate(item.id)}
                  className={cn(
                    "flex items-center p-3 md:p-4 rounded-[5px] transition-all cursor-pointer border group mx-1",
                    selectedTemplates.includes(item.id) 
                      ? "bg-primary/5 border-primary/20 dark:bg-primary/10 dark:border-primary/30 shadow-none" 
                      : "bg-white dark:bg-[#101935]/40 border-gray-100/50 dark:border-white/5 hover:border-primary/30 dark:hover:border-primary/30"
                  )}
                >
                   <div className={cn(
                     "w-9 h-9 md:w-10 md:h-10 rounded-[5px] flex items-center justify-center transition-all",
                     selectedTemplates.includes(item.id) ? "bg-primary text-white" : "bg-gray-100 dark:bg-[#1e293b] text-gray-400 group-hover:text-primary"
                   )}>
                      <FileText className="w-5.5 h-5.5" />
                   </div>
                   <div className="flex-1 ml-3 md:ml-4 text-left">
                      <h4 className="text-[13px] md:text-[14px] font-bold text-[#1e293b] dark:text-white leading-tight truncate">{item.name}</h4>
                      <div className="flex items-center gap-2 mt-1.5">
                         <span className="text-[8px] md:text-[9px] font-extrabold text-primary px-2 py-0.5 bg-primary/5 dark:bg-primary/20 rounded-full flex items-center gap-1 border border-primary/10">
                            {item.category}
                         </span>
                         <span className="text-[10px] md:text-[11px] text-gray-400 font-bold tracking-tight opacity-70 truncate">{(item.blocks || []).length} Secs</span>
                      </div>
                   </div>
                   <div className={cn(
                     "w-5 h-5 rounded-[5px] border transition-all flex items-center justify-center shrink-0",
                     selectedTemplates.includes(item.id) ? "bg-primary border-primary" : "border-gray-200 dark:border-white/10 group-hover:border-primary/50"
                   )}>
                      {selectedTemplates.includes(item.id) && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                   </div>
                </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
