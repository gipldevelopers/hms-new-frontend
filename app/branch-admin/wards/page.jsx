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
  Check
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
import { API_URL } from "@/lib/api";

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-card p-5 rounded-[5px] border border-border flex items-center gap-4 transition-all flex-1">
    <div
      className={cn(
        "w-12 h-12 rounded-[5px] flex items-center justify-center shrink-0",
        color === "blue" && "bg-primary/10 text-primary",
        color === "rose" && "bg-rose-500/10 text-rose-500",
        color === "emerald" && "bg-emerald-500/10 text-emerald-500",
        color === "amber" && "bg-amber-500/10 text-amber-500"
      )}
    >
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-[11px] font-bold text-muted-foreground leading-none mb-1.5 uppercase tracking-wider">
        {title}
      </p>
      <p className="text-[20px] font-bold text-foreground leading-none">
        {value}
      </p>
    </div>
  </div>
);



export default function BedWardOverview() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [editingDeptId, setEditingDeptId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [branchId, setBranchId] = useState(null);

  const [departments, setDepartments] = useState([]);
  const [deleteDept, setDeleteDept] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statsData, setStatsData] = useState({
    totalBeds: 0,
    occupiedBeds: 0,
    availableBeds: 0,
    reservedBeds: 0,
    totalDepts: 0
  });

  const stats = [
    { 
      title: "Total beds", 
      value: statsData.totalBeds.toString(), 
      icon: LayoutGrid, 
      color: "blue"
    },
    { 
      title: "Occupied", 
      value: statsData.occupiedBeds.toString(), 
      icon: Hotel, 
      color: "rose"
    },
    { 
      title: "Available", 
      value: statsData.availableBeds.toString(), 
      icon: CheckCircle2, 
      color: "emerald"
    },
    { 
      title: "Reserved", 
      value: statsData.reservedBeds.toString(), 
      icon: Clock, 
      color: "amber"
    }
  ];

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.branchId) {
      setBranchId(user.branchId);
      fetchData(user.branchId);
    }
  }, []);

  const fetchData = async (bid) => {
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
          branchId: branchId,
          departments: [departments[deptIdx]]
        })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Changes saved successfully");
        fetchData(branchId);
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

  const confirmRemoveDept = async () => {
    if (!deleteDept) return;
    const { id, idx } = deleteDept;

    if (id.toString().startsWith('new-')) {
      setDepartments(departments.filter((_, i) => i !== idx));
      setDeleteDept(null);
      return;
    }

    try {
      setIsDeleting(true);
      const token = localStorage.getItem("authtoken");
      const res = await fetch(`/api/wards/${id}?branchId=${branchId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success("Department removed from registry");
        fetchData(branchId);
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete");
      }
    } catch (error) {
      toast.error("Error deleting");
    } finally {
      setIsDeleting(false);
      setDeleteDept(null);
    }
  };

  const handleDeptChange = (idx, field, value) => {
    const newDepts = [...departments];
    newDepts[idx][field] = value;
    
    if (field === 'name') {
      const dept = newDepts[idx];
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
    
    setDepartments(newDepts);
  };

  const handleWardChange = (deptIdx, wardIdx, field, value) => {
    const newDepts = [...departments];
    newDepts[deptIdx].wards[wardIdx][field] = value;
    setDepartments(newDepts);
  };

  const handleBedChange = (deptIdx, wardIdx, bedIdx, field, value) => {
    const newDepts = [...departments];
    newDepts[deptIdx].wards[wardIdx].beds[bedIdx][field] = value;
    setDepartments(newDepts);
  };

  const addWard = (deptIdx) => {
    const newDepts = [...departments];
    const dept = newDepts[deptIdx];
    const deptPrefix = (dept.name || "DE").substring(0, 2).toUpperCase().padEnd(2, 'X');
    const nextWardNum = dept.wards.length + 1;
    const wardNumStr = nextWardNum.toString().padStart(2, '0');
    const generatedCode = `${deptPrefix}W${wardNumStr}`;

    newDepts[deptIdx].wards.push({
      id: `new-w-${Date.now()}`,
      name: `Ward ${nextWardNum}`,
      code: generatedCode,
      beds: []
    });
    setDepartments(newDepts);
  };

  const addBed = (deptIdx, wardIdx) => {
    const newDepts = [...departments];
    const ward = newDepts[deptIdx].wards[wardIdx];
    const nextBedNum = ward.beds.length + 1;
    const bedNumStr = nextBedNum.toString().padStart(3, '0');
    const generatedEqId = `${ward.code}${bedNumStr}`;

    newDepts[deptIdx].wards[wardIdx].beds.push({
      id: `new-b-${Date.now()}`,
      label: `Bed ${nextBedNum}`,
      equipmentId: generatedEqId,
      status: "AVAILABLE"
    });
    setDepartments(newDepts);
  };

  const removeField = (deptIdx, wardIdx, bedIdx, type) => {
    const newDepts = [...departments];
    if (type === 'ward') {
      newDepts[deptIdx].wards.splice(wardIdx, 1);
    } else {
      newDepts[deptIdx].wards[wardIdx].beds.splice(bedIdx, 1);
    }
    setDepartments(newDepts);
  };

  const toggleAccordion = (id) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  const toggleDeptStatus = async (idx) => {
    const dept = departments[idx];
    const newStatus = dept.status === "Active" ? "Inactive" : "Active";
    const isActive = newStatus === "Active";

    const newDepts = [...departments];
    newDepts[idx].status = newStatus;
    newDepts[idx].active = isActive;
    setDepartments(newDepts);

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
            branchId: branchId,
            active: isActive 
          })
        });
        if (!res.ok) {
          const data = await res.json();
          toast.error(data.error || "Failed to update status");
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

  const filteredDepartments = departments.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.wards.some(w => w.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-6 bg-background min-h-screen space-y-[20px] flex flex-col transition-colors duration-300 font-sans pb-20 text-[#1e293b] dark:text-white">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-[20px] font-bold text-foreground tracking-tight leading-none">Bed & Ward Overview</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-card p-3 rounded-[5px] border border-border shadow-none">
        <div className="relative w-full md:w-[380px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search departments or wards..."
            className="w-full h-11 pl-11 pr-4 bg-background border border-border rounded-[5px] text-[13px] font-medium outline-none focus:border-primary transition-all shadow-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button 
          onClick={addDepartment}
          className="bg-primary text-white px-8 h-[48px] rounded-[5px] text-[13px] font-bold flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-none w-full md:w-auto"
        >
          <Plus className="w-4 h-4" /> Add Department
        </button>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        {filteredDepartments.map((dept, idx) => (
          <div 
            key={dept.id}
            className="bg-card rounded-[5px] border border-border overflow-hidden shadow-none h-fit"
          >
            <div 
              className={cn(
                "px-5 py-3.5 flex items-center justify-between cursor-pointer transition-colors duration-300",
                "bg-[#2D3A8C] text-white"
              )}
              onClick={() => toggleAccordion(dept.id)}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
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
                        "bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      )}
                    />
                    <button onClick={() => setEditingDeptId(null)} className="p-1 rounded hover:bg-white/10 text-white">
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <h3 className="text-[14px] font-bold text-white truncate max-w-[250px]">{dept.name}</h3>
                )}
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
                    className="p-1.5 hover:bg-white/10 rounded-[3px] transition-colors"
                  >
                    <Edit3 className="w-4 h-4 text-white" />
                  </button>
                  <button 
                    onClick={() => setDeleteDept({ id: dept.id, idx, name: dept.name })}
                    className="p-1.5 hover:bg-white/10 rounded-[3px] transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                  <button onClick={() => toggleAccordion(dept.id)} className="p-1.5 hover:bg-white/10 rounded-[3px] transition-colors">
                    {activeAccordion === dept.id ? <ChevronUp className="w-5 h-5 text-white" /> : <ChevronDown className="w-5 h-5 text-white" />}
                  </button>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {activeAccordion === dept.id && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }} className="overflow-hidden"
                >
                  <div className="p-6 space-y-8 bg-card max-h-[500px] overflow-y-auto custom-scrollbar">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-border pb-3.5 mb-2">
                        <h4 className="text-[13px] font-bold text-muted-foreground flex items-center gap-2">
                          <LayoutGrid className="w-3.5 h-3.5 opacity-50" />
                          Wards configuration
                        </h4>
                        <button onClick={() => addWard(idx)} className="text-[12px] font-bold text-primary flex items-center gap-1.5 hover:underline decoration-2 underline-offset-4 tracking-wide">
                          <Plus className="w-4 h-4" /> Add ward
                        </button>
                      </div>
                      
                      <div className="space-y-8">
                        {dept.wards.map((ward, wIdx) => (
                          <div key={wIdx} className="space-y-4 pb-6 border-b border-border/50 last:border-0 last:pb-0">
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-6">
                              <div className="flex-1 space-y-2">
                                <label className="text-[12px] font-bold text-muted-foreground ml-1">Ward name*</label>
                                <Input value={ward.name} onChange={(e) => handleWardChange(idx, wIdx, 'name', e.target.value)} placeholder="Enter ward name" className="h-11 bg-background border-border shadow-none" />
                              </div>
                              <div className="flex-1 space-y-2">
                                <label className="text-[12px] font-bold text-muted-foreground ml-1">Ward code*</label>
                                <Input value={ward.code} onChange={(e) => handleWardChange(idx, wIdx, 'code', e.target.value)} placeholder="Enter ward code" className="h-11 bg-background border-border shadow-none" />
                              </div>
                              <button onClick={() => removeField(idx, wIdx, null, 'ward')} className="h-11 w-11 shrink-0 border border-border rounded-[5px] flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all shadow-none">
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                            <div className="pl-6 space-y-4 border-l-2 border-primary/10">
                              <div className="flex items-center justify-between">
                                <h5 className="text-[11px] font-bold text-muted-foreground tracking-widest">Beds for {ward.name || 'this ward'}</h5>
                                <button onClick={() => addBed(idx, wIdx)} className="text-[11px] font-bold text-primary/70 hover:text-primary flex items-center gap-1">
                                  <Plus className="w-3 h-3" /> Add bed
                                </button>
                              </div>
                              <div className="space-y-4">
                                {ward.beds.map((bed, bIdx) => (
                                  <div key={bIdx} className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4">
                                    <div className="flex-1 space-y-1">
                                      <label className="text-[10px] font-bold text-muted-foreground ml-1">Bed label</label>
                                      <Input value={bed.label} onChange={(e) => handleBedChange(idx, wIdx, bIdx, 'label', e.target.value)} placeholder="e.g. Bed 101" className="h-10 bg-background border-border shadow-none" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                      <label className="text-[10px] font-bold text-muted-foreground ml-1">Equipment id</label>
                                      <Input value={bed.equipmentId} onChange={(e) => handleBedChange(idx, wIdx, bIdx, 'equipmentId', e.target.value)} placeholder="e.g. EQ-102" className="h-10 bg-background border-border shadow-none" />
                                    </div>
                                    <button onClick={() => removeField(idx, wIdx, bIdx, 'bed')} className="h-10 w-10 shrink-0 border border-border rounded-[5px] flex items-center justify-center text-muted-foreground hover:text-red-500 transition-all shadow-none">
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
                    <div className="flex justify-end items-center gap-4 pt-6 border-t border-border">
                      <button onClick={() => fetchData(branchId)} className="px-8 h-12 bg-background border border-border text-muted-foreground font-bold text-[12px] rounded-[5px] transition-all hover:bg-muted tracking-widest shadow-none">Discard</button>
                      <button onClick={() => handleSave(idx)} disabled={isSaving} className="px-10 h-12 bg-[#2D3A8C] text-white font-bold text-[12px] rounded-[5px] transition-all hover:opacity-90 shadow-none disabled:opacity-50 tracking-widest">
                        {isSaving ? "Saving..." : "Save changes"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Standardized Delete Modal */}
      <AnimatePresence>
        {deleteDept && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDeleteDept(null)}
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
                <h3 className="text-[18px] font-bold text-[#1e293b] dark:text-white mb-2">Delete Department?</h3>
                <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed max-w-[280px]">
                  Are you sure you want to delete <span className="font-bold text-gray-700 dark:text-gray-200">{deleteDept.name}</span>? This will remove all associated wards and beds.
                </p>
              </div>

              <div className="flex border-t border-gray-100 dark:border-white/5">
                <button 
                  onClick={() => setDeleteDept(null)}
                  className="flex-1 py-4 text-[13px] font-bold text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-r border-gray-100 dark:border-white/5"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmRemoveDept}
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
