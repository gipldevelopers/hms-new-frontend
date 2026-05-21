"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  Trash2, 
  Hotel,
  Bed,
  CheckCircle2,
  Clock,
  LayoutGrid,
  Sparkles,
  Edit3,
  X,
  Building2,
  Database,
  Check,
  Save
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const StatCard = ({ title, value, subValue, icon: Icon, iconBg, iconColor, badge, badgeBg, badgeText }) => (
  <div className="bg-card p-5 rounded-[5px] border border-border flex flex-col justify-between h-[135px] transition-all shadow-none">
    <div className="flex justify-between items-start">
      <div className={`p-2 rounded-[5px] ${iconBg} dark:bg-opacity-10`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-[3px] flex items-center gap-1", badgeBg, badgeText)}>
        {badge}
      </div>
    </div>
    <div className="mt-4">
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.1em] mb-1">{title}</p>
      <div className="flex justify-between items-end">
        <h3 className="text-2xl font-bold text-foreground leading-none tracking-tight">{value}</h3>
        <span className="text-[10px] text-muted-foreground font-medium whitespace-nowrap ml-2 opacity-80">{subValue}</span>
      </div>
    </div>
  </div>
);

export default function SuperAdminWards() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [editingDeptId, setEditingDeptId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branchSearch, setBranchSearch] = useState("");
  const [departments, setDepartments] = useState([]);
  const [statsData, setStatsData] = useState({
    totalBeds: 0,
    occupiedBeds: 0,
    availableBeds: 0,
    reservedBeds: 0,
    totalDepts: 0
  });

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const token = localStorage.getItem("authtoken");
      const res = await fetch(`/api/branches`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBranches(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch branches:", error);
    }
  };

  const fetchData = async (bid) => {
    if (!bid) {
      setDepartments([]);
      setStatsData({ totalBeds: 0, occupiedBeds: 0, availableBeds: 0, reservedBeds: 0, totalDepts: 0 });
      return;
    }
    try {
      setIsLoading(true);
      const token = localStorage.getItem("authtoken");
      const res = await fetch(`/api/wards/overview?branchId=${bid}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setDepartments(data.map(d => ({
          ...d,
          status: d.active ? "Active" : "Inactive"
        })));
        fetchStats(bid);
      } else {
        toast.error(data.error || "Failed to fetch configurations");
      }
    } catch (error) {
      toast.error("Error connecting to server");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async (bid) => {
    try {
      const token = localStorage.getItem("authtoken");
      const res = await fetch(`/api/wards/stats?branchId=${bid}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setStatsData(data);
      }
    } catch (error) {
      console.error("Stats error:", error);
    }
  };

  const handleSave = async (deptIdx) => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem("authtoken");
      const res = await fetch(`/api/wards/sync`, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          branchId: selectedBranch.id,
          departments: [departments[deptIdx]]
        })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Changes saved successfully");
        fetchData(selectedBranch.id);
      } else {
        toast.error(data.error || "Failed to save changes");
      }
    } catch (error) {
      toast.error("Error saving changes");
    } finally {
      setIsSaving(false);
    }
  };

  const addDepartment = () => {
    if (!selectedBranch) {
      toast.error("Please select a branch first");
      return;
    }
    const newDept = {
      id: `new-${Date.now()}`,
      name: "New department",
      status: "Active",
      active: true,
      wards: []
    };
    setDepartments([...departments, newDept]);
    setActiveAccordion(newDept.id);
  };

  const removeDepartment = async (id, idx) => {
    if (id.toString().startsWith('new-')) {
      setDepartments(departments.filter((_, i) => i !== idx));
      return;
    }

    if (!confirm("Are you sure? This will delete from all databases.")) return;

    try {
      const token = localStorage.getItem("authtoken");
      const res = await fetch(`/api/wards/${id}?branchId=${selectedBranch.id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success("Department deleted");
        fetchData(selectedBranch.id);
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete");
      }
    } catch (error) {
      toast.error("Error deleting");
    }
  };

  const handleDeptChange = (idx, field, value) => {
    const nd = [...departments];
    nd[idx][field] = value;
    
    if (field === 'name') {
      const dept = nd[idx];
      const deptPrefix = (value || "DE").substring(0, 2).toUpperCase().padEnd(2, 'X');
      
      if (dept.wards) {
        dept.wards.forEach((ward, wIdx) => {
          const wardNumStr = (wIdx + 1).toString().padStart(2, '0');
          ward.code = `${deptPrefix}W${wardNumStr}`;
          
          if (ward.beds) {
            ward.beds.forEach((bed, bIdx) => {
              const bedNumStr = (bIdx + 1).toString().padStart(3, '0');
              bed.equipmentId = `${ward.code}${bedNumStr}`;
            });
          }
        });
      }
    }
    
    setDepartments(nd);
  };

  const handleWardChange = (deptIdx, wardIdx, field, value) => {
    const nd = [...departments];
    nd[deptIdx].wards[wardIdx][field] = value;
    setDepartments(nd);
  };

  const handleBedChange = (deptIdx, wardIdx, bedIdx, field, value) => {
    const nd = [...departments];
    nd[deptIdx].wards[wardIdx].beds[bedIdx][field] = value;
    setDepartments(nd);
  };

  const addWard = (deptIdx) => {
    const nd = [...departments];
    const dept = nd[deptIdx];
    const deptPrefix = (dept.name || "DE").substring(0, 2).toUpperCase().padEnd(2, 'X');
    const nextWardNum = dept.wards.length + 1;
    const wardNumStr = nextWardNum.toString().padStart(2, '0');
    const generatedCode = `${deptPrefix}W${wardNumStr}`;

    nd[deptIdx].wards.push({ 
      id: `new-w-${Date.now()}`, 
      name: `Ward ${nextWardNum}`, 
      code: generatedCode, 
      beds: [] 
    });
    setDepartments(nd);
  };

  const addBed = (deptIdx, wardIdx) => {
    const nd = [...departments];
    const ward = nd[deptIdx].wards[wardIdx];
    const nextBedNum = ward.beds.length + 1;
    const bedNumStr = nextBedNum.toString().padStart(3, '0');
    const generatedEqId = `${ward.code}${bedNumStr}`;

    nd[deptIdx].wards[wardIdx].beds.push({ 
      id: `new-b-${Date.now()}`, 
      label: `Bed ${nextBedNum}`, 
      equipmentId: generatedEqId,
      status: "AVAILABLE" 
    });
    setDepartments(nd);
  };

  const removeField = (deptIdx, wardIdx, bedIdx, type) => {
    const nd = [...departments];
    if (type === 'ward') {
      nd[deptIdx].wards.splice(wardIdx, 1);
    } else {
      nd[deptIdx].wards[wardIdx].beds.splice(bedIdx, 1);
    }
    setDepartments(nd);
  };

  const toggleDeptStatus = async (idx) => {
    const dept = departments[idx];
    const newStatus = dept.status === "Active" ? "Inactive" : "Active";
    const isActive = newStatus === "Active";

    // Update local state first for responsiveness
    const newDepts = [...departments];
    newDepts[idx].status = newStatus;
    newDepts[idx].active = isActive;
    setDepartments(newDepts);

    // If it's an existing department, call the API
    if (dept.id && !dept.id.toString().startsWith('new-')) {
      try {
        const token = localStorage.getItem("authtoken");
        const res = await fetch(`/api/wards/${dept.id}/status`, {
          method: "PATCH",
          headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ 
            branchId: selectedBranch.id,
            active: isActive 
          })
        });
        if (!res.ok) {
          const data = await res.json();
          toast.error(data.error || "Failed to update status");
          // Revert state on failure
          const revertDepts = [...departments];
          revertDepts[idx].status = dept.status;
          revertDepts[idx].active = dept.active;
          setDepartments(revertDepts);
        } else {
          toast.success(`Department ${newStatus}`);
        }
      } catch (error) {
        toast.error("Connection error");
      }
    }
  };

  const filteredBranches = branches.filter(b => 
    b.name.toLowerCase().includes(branchSearch.toLowerCase())
  );

  const stats = [
    { 
      title: "Total beds", 
      value: statsData.totalBeds.toString(), 
      subValue: `In ${statsData.totalDepts} depts`, 
      icon: LayoutGrid, 
      iconBg: "bg-blue-50 text-blue-500",
      iconColor: "text-blue-500",
      badge: "Total",
      badgeBg: "bg-blue-100",
      badgeText: "text-blue-600"
    },
    { 
      title: "Occupied", 
      value: statsData.occupiedBeds.toString(), 
      subValue: `${((statsData.occupiedBeds / (statsData.totalBeds || 1)) * 100).toFixed(1)}%`, 
      icon: Hotel, 
      iconBg: "bg-red-50 text-red-500",
      iconColor: "text-red-500",
      badge: "In Use",
      badgeBg: "bg-red-100",
      badgeText: "text-red-600"
    },
    { 
      title: "Available", 
      value: statsData.availableBeds.toString(), 
      subValue: `${((statsData.availableBeds / (statsData.totalBeds || 1)) * 100).toFixed(1)}%`, 
      icon: CheckCircle2, 
      iconBg: "bg-emerald-50 text-emerald-500",
      iconColor: "text-emerald-500",
      badge: "Ready",
      badgeBg: "bg-emerald-100",
      badgeText: "text-emerald-600"
    },
    { 
      title: "Reserved", 
      value: statsData.reservedBeds.toString(), 
      subValue: "Planned", 
      icon: Clock, 
      iconBg: "bg-amber-50 text-amber-500",
      iconColor: "text-amber-500",
      badge: "Scheduled",
      badgeBg: "bg-amber-100",
      badgeText: "text-amber-600"
    }
  ];

  return (
    <div className="p-6 bg-background min-h-screen space-y-[20px] flex flex-col transition-colors duration-300 font-sans pb-20">
      
      {/* Header */}
      <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-4">
        <div>
          <h1 className="text-[20px] font-bold text-foreground tracking-tight leading-none tracking-tight">Global Infrastructure Management</h1>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
           <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-3 bg-card px-4 h-[48px] rounded-[5px] border border-border hover:border-primary transition-all outline-none group w-full sm:min-w-[260px] shadow-none font-bold text-[13px]">
                 <Building2 className="w-4 h-4 text-primary shrink-0" />
                 <span className={cn("truncate flex-1 text-left", !selectedBranch && "text-muted-foreground font-medium")}>
                    {selectedBranch ? selectedBranch.name : "Select Branch to Manage"}
                 </span>
                 <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[calc(100vw-32px)] sm:w-[320px] border-border bg-card p-2 shadow-xl flex flex-col gap-1 rounded-[5px]">
                <div className="relative mb-2 px-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <input 
                    type="text"
                    placeholder="Search branches..."
                    className="w-full h-10 pl-9 pr-3 bg-background border border-border rounded-[5px] text-[13px] font-medium outline-none focus:border-primary"
                    value={branchSearch}
                    onChange={(e) => setBranchSearch(e.target.value)}
                    onKeyDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                
                <div className="max-h-[250px] overflow-y-auto no-scrollbar">
                  {filteredBranches.map((branch) => (
                    <DropdownMenuItem 
                      key={branch.id} 
                      onClick={() => {
                        setSelectedBranch(branch);
                        fetchData(branch.id);
                      }}
                      className="flex items-center gap-3 px-3 py-2.5 text-[13px] font-semibold cursor-pointer rounded-[5px] mb-0.5"
                    >
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <span>{branch.name}</span>
                      {selectedBranch?.id === branch.id && <Check className="w-4 h-4 ml-auto text-primary" />}
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <button 
              onClick={addDepartment}
              className="bg-primary text-white px-8 h-[48px] rounded-[5px] text-[13px] font-bold flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-none whitespace-nowrap"
            >
              <Plus className="w-4 h-4" /> Add Department
            </button>
        </div>
      </div>

      {!selectedBranch ? (
        <div className="flex flex-col items-center justify-center py-40 bg-card rounded-[5px] border border-border shadow-none">
          <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mb-4">
            <Building2 className="w-8 h-8 text-primary opacity-20" />
          </div>
          <h3 className="text-[16px] font-bold text-foreground mb-1">No Branch Selected</h3>
        </div>
      ) : (
        <div className="space-y-[20px]">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <StatCard key={i} {...stat} />
            ))}
          </div>

          {/* Filter Bar with Search and Role Selector Pattern */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-card p-3 rounded-[5px] border border-border shadow-none">
            <div className="relative w-full md:w-[380px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search departments or wards..."
                className="w-full h-11 pl-11 pr-4 bg-background border border-border rounded-[5px] text-[13px] font-medium outline-none focus:border-primary transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="py-20 text-center text-muted-foreground text-[12px] font-bold animate-pulse tracking-widest uppercase">Fetching Data...</div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start pb-20">
              {departments.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase())).map((dept, idx) => (
                <div key={dept.id} className="bg-card rounded-[5px] border border-border overflow-hidden shadow-none h-fit">
                  {/* Accordion Header */}
                  <div 
                    className={cn(
                      "px-5 py-4 flex items-center justify-between cursor-pointer transition-all duration-300",
                      activeAccordion === dept.id ? "bg-[#2D3A8C] text-white" : "bg-muted/30"
                    )}
                    onClick={() => setActiveAccordion(activeAccordion === dept.id ? null : dept.id)}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
                      <div className={cn(
                        "w-9 h-9 rounded-[5px] flex items-center justify-center transition-all",
                        activeAccordion === dept.id ? "bg-white/20" : "bg-primary/10"
                      )}>
                        <Database className={cn("w-4.5 h-4.5", activeAccordion === dept.id ? "text-white" : "text-primary")} />
                      </div>
                      <div className="flex-1 min-w-0">
                        {editingDeptId === dept.id ? (
                           <div className="flex items-center gap-2 flex-1">
                             <Input 
                                autoFocus
                                value={dept.name}
                                onChange={(e) => handleDeptChange(idx, 'name', e.target.value)}
                                onBlur={() => setEditingDeptId(null)}
                                onKeyDown={(e) => e.key === 'Enter' && setEditingDeptId(null)}
                                className={cn(
                                  "h-8 text-[14px] font-bold focus:ring-0 w-full max-w-[250px] transition-all",
                                  activeAccordion === dept.id 
                                    ? "bg-white/10 border-white/20 text-white placeholder:text-white/50" 
                                    : "bg-background border-border text-foreground"
                                )}
                             />
                             <button onClick={() => setEditingDeptId(null)} className={cn(
                               "p-1 rounded",
                               activeAccordion === dept.id ? "hover:bg-white/10 text-white" : "hover:bg-black/5 text-primary"
                             )}>
                                <Check className="w-4 h-4" />
                             </button>
                           </div>
                        ) : (
                          <div className="flex items-center gap-2 group/title">
                            <h3 className={cn(
                              "text-[14px] font-bold truncate max-w-[250px]",
                              activeAccordion === dept.id ? "text-white" : "text-foreground"
                            )}>{dept.name}</h3>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => toggleDeptStatus(idx)}
                        className={cn(
                          "text-[10px] font-bold px-4 py-1.5 rounded-full tracking-wider transition-all shadow-inner active:scale-95",
                          dept.status === "Active" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
                        )}
                      >
                        {dept.status}
                      </button>
                      <div className="flex items-center gap-1.5">
                        <button 
                          onClick={() => setEditingDeptId(dept.id)}
                          className={cn(
                            "p-1.5 rounded-[3px] transition-all",
                            activeAccordion === dept.id ? "hover:bg-white/20 text-white" : "hover:bg-black/5 text-muted-foreground"
                          )}
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => removeDepartment(dept.id, idx)}
                          className={cn(
                            "p-1.5 rounded-[3px] transition-all",
                            activeAccordion === dept.id ? "hover:bg-white/20 text-white" : "text-muted-foreground hover:text-red-500"
                          )}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <ChevronDown className={cn("w-4 h-4 transition-transform", activeAccordion === dept.id && "rotate-180")} />
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {activeAccordion === dept.id && (
                      <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                        <div className="p-6 space-y-8 bg-card max-h-[600px] overflow-y-auto no-scrollbar border-t border-border">
                           
                           {/* Wards Section */}
                           <div className="space-y-6">
                             <div className="flex items-center justify-between border-b border-border pb-3.5 mb-2">
                               <h4 className="text-[13px] font-bold text-muted-foreground flex items-center gap-2">
                                 <LayoutGrid className="w-3.5 h-3.5 opacity-50" />
                                 Wards configuration
                               </h4>
                               <button 
                                 onClick={() => addWard(idx)}
                                 className="text-[12px] font-bold text-primary flex items-center gap-1.5 hover:underline decoration-2 underline-offset-4"
                               >
                                 <Plus className="w-4 h-4" /> Add ward
                               </button>
                             </div>

                             <div className="space-y-8">
                               {dept.wards.map((ward, wIdx) => (
                                 <div key={wIdx} className="space-y-4 pb-6 border-b border-border/50 last:border-0 last:pb-0">
                                   <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-6">
                                     <div className="flex-1 space-y-2">
                                       <label className="text-[12px] font-bold text-muted-foreground ml-1">Ward name*</label>
                                       <Input 
                                         value={ward.name} 
                                         onChange={(e) => handleWardChange(idx, wIdx, 'name', e.target.value)}
                                         placeholder="Enter ward name"
                                         className="h-11 bg-background border-border"
                                       />
                                     </div>
                                     <div className="flex-1 space-y-2">
                                       <label className="text-[12px] font-bold text-muted-foreground ml-1">Ward code*</label>
                                       <Input 
                                          value={ward.code}
                                          onChange={(e) => handleWardChange(idx, wIdx, 'code', e.target.value)}
                                          placeholder="Enter ward code"
                                          className="h-11 bg-background border-border"
                                       />
                                     </div>
                                     <button 
                                        onClick={() => removeField(idx, wIdx, null, 'ward')}
                                        className="h-11 w-11 shrink-0 border border-border rounded-[5px] flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-all shadow-none"
                                     >
                                       <Trash2 className="w-4.5 h-4.5" />
                                     </button>
                                   </div>

                                   {/* Beds Section */}
                                   <div className="pl-6 space-y-4 border-l-2 border-primary/10">
                                      <div className="flex items-center justify-between">
                                        <h5 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Beds for {ward.name || 'this ward'}</h5>
                                        <button 
                                          onClick={() => addBed(idx, wIdx)}
                                          className="text-[11px] font-bold text-primary/70 hover:text-primary flex items-center gap-1"
                                        >
                                          <Plus className="w-3 h-3" /> Add bed
                                        </button>
                                      </div>
                                      
                                      <div className="space-y-4">
                                        {ward.beds.map((bed, bIdx) => (
                                          <div key={bIdx} className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4">
                                            <div className="flex-1 space-y-1">
                                              <label className="text-[10px] font-bold text-muted-foreground ml-1">Bed label</label>
                                              <Input 
                                                value={bed.label} 
                                                onChange={(e) => handleBedChange(idx, wIdx, bIdx, 'label', e.target.value)}
                                                placeholder="e.g. Bed 101"
                                                className="h-10 bg-background border-border"
                                              />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                              <label className="text-[10px] font-bold text-muted-foreground ml-1">Equipment id</label>
                                              <Input 
                                                value={bed.equipmentId} 
                                                onChange={(e) => handleBedChange(idx, wIdx, bIdx, 'equipmentId', e.target.value)}
                                                placeholder="e.g. EQ-102"
                                                className="h-10 bg-background border-border"
                                              />
                                            </div>
                                            <button 
                                              onClick={() => removeField(idx, wIdx, bIdx, 'bed')}
                                              className="h-10 w-10 shrink-0 border border-border rounded-[5px] flex items-center justify-center text-muted-foreground hover:text-red-500 transition-all"
                                            >
                                              <Trash2 className="w-4 h-4" />
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                   </div>
                                 </div>
                               ))}
                             </div>
                           </div>

                           <div className="flex justify-end items-center gap-3 pt-6 border-t border-border">
                              <button 
                                onClick={() => fetchData(selectedBranch.id)} 
                                className="px-8 h-11 border border-border text-[11px] font-bold text-muted-foreground hover:bg-muted rounded-[5px] transition-all uppercase tracking-widest"
                              >
                                Discard
                              </button>
                              <button 
                                onClick={() => handleSave(idx)}
                                disabled={isSaving}
                                className="px-10 h-11 bg-primary text-white font-bold text-[11px] rounded-[5px] shadow-none hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2 tracking-widest uppercase"
                              >
                                {isSaving ? "Saving..." : "Save Changes"}
                              </button>
                           </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
