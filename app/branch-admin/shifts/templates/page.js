"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  LayoutGrid, 
  List, 
  Search, 
  Clock, 
  Edit3, 
  Trash2, 
  Eye, 
  Coffee, 
  Sun, 
  Moon, 
 Sunset, 
  Zap, 
  CalendarDays,
  Activity,
  CheckCircle2,
  RefreshCcw,
  Building2,
  Users,
  X,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const API_BASE = "/api/shifts";

// --- CUSTOM TIME PICKER COMPONENT ---
function CustomTimePicker({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Parse initial value or default to 08:00 AM
  const initialHour = value ? parseInt(value.split(':')[0]) : 8;
  const initialMinute = value ? parseInt(value.split(':')[1]) : 0;
  const initialPeriod = value?.includes('PM') ? 'PM' : 'AM';

  const [hour, setHour] = useState(initialHour);
  const [minute, setMinute] = useState(initialMinute);
  const [period, setPeriod] = useState(initialPeriod);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = ["00", "15", "30", "45"];

  const formatTime = (h, m, p) => {
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${p}`;
  };

  const handleSelect = (h, m, p) => {
    setHour(h);
    setMinute(m);
    setPeriod(p);
    onChange(formatTime(h, m, p));
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full h-12 justify-start font-bold text-[13px] bg-background border-border relative pl-12"
        >
          <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
          {value || "Select Time"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="start" 
        className="p-0 border-border bg-card shadow-2xl z-[600]"
      >
        <div className="flex h-[200px]">
          {/* Hours */}
          <div className="w-16 overflow-y-auto border-r border-border custom-scrollbar py-1">
            {hours.map((h) => (
              <button
                key={h}
                type="button"
                className={cn(
                  "w-full py-2 text-[12px] font-bold transition-all",
                  hour === h ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"
                )}
                onClick={() => handleSelect(h, minute, period)}
              >
                {h.toString().padStart(2, "0")}
              </button>
            ))}
          </div>
          {/* Minutes */}
          <div className="w-16 overflow-y-auto border-r border-border custom-scrollbar py-1">
            {minutes.map((m) => (
              <button
                key={m}
                type="button"
                className={cn(
                  "w-full py-2 text-[12px] font-bold transition-all",
                  minute === parseInt(m) ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"
                )}
                onClick={() => handleSelect(hour, parseInt(m), period)}
              >
                {m}
              </button>
            ))}
          </div>
          {/* AM/PM */}
          <div className="w-16 flex flex-col py-1">
            {["AM", "PM"].map((p) => (
              <button
                key={p}
                type="button"
                className={cn(
                  "w-full flex-1 text-[11px] font-bold transition-all",
                  period === p ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"
                )}
                onClick={() => handleSelect(hour, minute, p)}
              >
                {p}
              </button>
            ))}
            <button 
              type="button"
              className="h-10 border-t border-border bg-primary/5 text-primary flex items-center justify-center hover:bg-primary/10"
              onClick={() => setIsOpen(false)}
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const shiftTypes = [
  { label: "Morning", icon: Sun, color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "Evening", icon: Sunset, color: "text-orange-500", bg: "bg-orange-500/10" },
  { label: "Night", icon: Moon, color: "text-purple-500", bg: "bg-purple-500/10" },
  { label: "Emergency", icon: Zap, color: "text-red-500", bg: "bg-red-500/10" }
];

export default function ShiftTemplatesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewType, setViewType] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [branchId, setBranchId] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.branchId) {
      setBranchId(user.branchId);
    }
  }, []);

  const getHeaders = () => {
    const token = localStorage.getItem("authtoken");
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };
  };

  const fetchTemplates = async () => {
    if (!branchId) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/templates?branchId=${branchId}`, {
        headers: getHeaders()
      });
      const data = await res.json();
      setTemplates(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to fetch shift templates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [branchId]);

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this template?")) return;
    try {
      const res = await fetch(`${API_BASE}/templates/${id}?branchId=${branchId}`, {
        method: "DELETE",
        headers: getHeaders()
      });
      if (res.ok) {
        toast.success("Template purged from registry");
        fetchTemplates();
      }
    } catch (error) {
      toast.error("Failed to delete template");
    }
  };

  const filteredTemplates = templates.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalStaffRequired = templates.reduce((acc, t) => {
    const staffing = typeof t.staffing === 'string' ? JSON.parse(t.staffing) : t.staffing;
    return acc + Object.values(staffing || {}).reduce((a, b) => a + b, 0);
  }, 0);

  return (
    <div className="p-6 bg-background min-h-screen space-y-5 flex flex-col transition-colors duration-300 font-sans">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-[20px] font-bold text-foreground leading-tight tracking-tight">Shift Template Registry</h1>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => {
              setEditingTemplate(null);
              setIsModalOpen(true);
            }}
            className="px-8 h-[48px] text-[13px] font-bold shadow-none"
          >
            <Plus className="w-4.5 h-4.5 mr-2" /> Orchestrate Template
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { title: "Active Templates", value: templates.length, icon: CalendarDays, color: "blue" },
          { title: "Departmental Clusters", value: [...new Set(templates.map(t => t.department))].length, icon: Building2, color: "indigo" },
          { title: "Allocated Staff", value: totalStaffRequired, icon: Users, color: "emerald" },
          { title: "Compliance Logic", value: "Active", icon: Activity, color: "indigo" },
        ].map((stat, i) => (
          <div key={i} className="bg-card p-5 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 flex items-center gap-4 transition-all hover:shadow-sm">
            <div className={cn(
              "w-12 h-12 rounded-[5px] flex items-center justify-center border transition-all",
              stat.color === "blue" && "bg-primary/10 text-primary border-primary/20",
              stat.color === "indigo" && "bg-primary/10 text-primary border-primary/20",
              stat.color === "emerald" && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
            )}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-muted-foreground leading-none uppercase tracking-tight">{stat.title}</p>
              <p className="text-[20px] font-bold text-foreground mt-1.5 leading-none">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-card p-3 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 shadow-none">
        <div className="relative w-full md:w-[400px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            type="text" 
            placeholder="Filter templates by nomenclature or sector..."
            className="pl-10 h-10 bg-background font-bold text-[13px] border-[#E7E8EB]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-background p-1 rounded-[5px] border border-border">
            <Button 
              variant={viewType === "grid" ? "outline" : "ghost"}
              size="icon-sm"
              onClick={() => setViewType("grid")}
              className={cn("h-8 w-8 rounded-[4px]", viewType === "grid" && "bg-card border-border text-primary shadow-none")}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button 
              variant={viewType === "list" ? "outline" : "ghost"}
              size="icon-sm"
              onClick={() => setViewType("list")}
              className={cn("h-8 w-8 rounded-[4px]", viewType === "list" && "bg-card border-border text-primary shadow-none")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Templates List Section */}
      <div className="relative min-h-[400px] pb-20">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm z-10 rounded-[5px]">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
            <p className="text-[11px] font-bold text-gray-400">Synchronizing branch registry...</p>
          </div>
        ) : (
          <div className={cn(
            "grid gap-5 transition-all duration-500",
            viewType === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
          )}>
            <AnimatePresence mode="popLayout">
              {filteredTemplates.map((template) => (
                <motion.div
                  key={template.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <ShiftCard 
                    template={template} 
                    viewType={viewType} 
                    onEdit={() => handleEdit(template)}
                    onDelete={() => handleDelete(template.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && filteredTemplates.length === 0 && (
          <div className="py-32 flex flex-col items-center justify-center text-center bg-card rounded-[5px] border border-dashed border-[#E7E8EB] dark:border-white/10">
             <CalendarDays className="w-12 h-12 text-muted-foreground/20 mb-4" />
             <p className="text-muted-foreground font-bold text-[13px]">No staffing templates found in the current cluster.</p>
             <p className="text-[11px] text-gray-400 mt-1">Initiate a new configuration to begin scheduling.</p>
          </div>
        )}
      </div>

      {/* Creation/Edit Modal */}
      <AddTemplateModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchTemplates}
        editingTemplate={editingTemplate}
        branchId={branchId}
        getHeaders={getHeaders}
      />
    </div>
  );
}

// --- SUB-COMPONENTS ---

function ShiftCard({ template, viewType, onEdit, onDelete }) {
  const isList = viewType === "list";
  const typeInfo = shiftTypes.find(s => s.label === template.type) || shiftTypes[0];
  
  const staffing = typeof template.staffing === 'string' ? JSON.parse(template.staffing) : template.staffing;
  const staffCount = Object.values(staffing || {}).reduce((a, b) => a + b, 0);

  return (
    <div className={cn(
      "group bg-card border border-[#E7E8EB] dark:border-white/10 rounded-[5px] overflow-hidden flex transition-all relative",
      isList ? "flex-row items-center p-5 gap-5" : "flex-col p-6 h-full hover:border-primary/20 hover:shadow-md"
    )}>
      <div className={cn("flex-1 transition-all", isList && "flex-[3]")}>
        <div className="flex justify-between items-start mb-5">
          <div className="flex gap-4">
            <div className={cn(
              "w-12 h-12 rounded-[5px] flex items-center justify-center border shrink-0",
              typeInfo.bg,
              "border-primary/20"
            )}>
              <typeInfo.icon className={cn("w-6 h-6", typeInfo.color)} />
            </div>
            <div>
              <h3 className="text-[17px] font-bold text-[#1e293b] dark:text-white leading-tight tracking-tight">{template.name}</h3>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="text-[12px] text-gray-400 dark:text-gray-500 font-bold">{template.department}</span>
                <span className={cn(
                  "text-[9px] font-extrabold px-2 py-0.5 rounded-[5px] bg-emerald-50 text-emerald-500 border border-emerald-100 uppercase"
                )}>
                  {template.rule}
                </span>
              </div>
            </div>
          </div>
        </div>

        {isList ? (
          <div className="grid grid-cols-3 gap-5">
            <div>
              <p className="text-[10px] font-bold text-gray-400 mb-1.5 font-sans uppercase tracking-tighter">Temporal Window</p>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <p className="text-[13px] font-bold text-[#1e293b] dark:text-white leading-none">{template.startTime} - {template.endTime}</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 mb-1.5 font-sans uppercase tracking-tighter">Pause Duration</p>
              <div className="flex items-center gap-1.5">
                <Coffee className="w-3.5 h-3.5 text-primary" />
                <p className="text-[13px] font-bold text-[#1e293b] dark:text-white leading-none">{template.breakDuration} Mins</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 mb-1.5 font-sans uppercase tracking-tighter">Registry Load</p>
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-primary" />
                <p className="text-[13px] font-bold text-[#1e293b] dark:text-white leading-none">{staffCount} Members</p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="space-y-4 mb-6">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-50 dark:bg-white/5 rounded-[5px] flex items-center justify-center">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase leading-none tracking-tight">Shift Duration</p>
                    <p className="text-[13px] font-bold dark:text-white mt-1">{template.startTime} to {template.endTime}</p>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-50 dark:bg-white/5 rounded-[5px] flex items-center justify-center">
                    <Coffee className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase leading-none tracking-tight">Break Interval</p>
                    <p className="text-[13px] font-bold dark:text-white mt-1">{template.breakDuration} Mins Total</p>
                  </div>
               </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/5 grid grid-cols-2 gap-5">
              <div>
                <p className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-tighter">Policy</p>
                <p className="text-[14px] font-bold text-[#1e293b] dark:text-white">{template.rule}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-tighter">Capacity</p>
                <p className="text-[14px] font-bold text-emerald-500">{staffCount} Req.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className={cn(
        "flex items-center gap-2", 
        isList ? "pb-0 px-0 flex-row w-auto border-l border-[#E7E8EB] dark:border-white/10 pl-8 shrink-0" : "mt-6 pt-4 border-t border-[#E7E8EB] dark:border-white/10"
      )}>
        <button 
          onClick={onEdit}
          className={cn(
            "px-4 h-[44px] bg-primary text-white font-bold text-[12px] rounded-[5px] transition-all hover:opacity-90 flex items-center justify-center gap-2 shadow-none", 
            !isList && "flex-1"
          )}
        >
          <Edit3 className="w-4 h-4" /> Edit
        </button>
        <button 
          onClick={onDelete}
          className="w-[44px] h-[44px] bg-background text-red-500 rounded-[5px] flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-500/10 transition-all border border-[#E7E8EB] dark:border-white/10 shadow-none"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function AddTemplateModal({ isOpen, onClose, onSuccess, editingTemplate, branchId, getHeaders }) {
  const [formData, setFormData] = useState({
    name: "",
    department: "Outpatient (OPD)",
    type: "Morning",
    startTime: "08:00 AM",
    endTime: "02:00 PM",
    breakDuration: "30",
    rule: "Fixed Shift",
    staffing: {
      Doctor: 1,
      Nurse: 2,
      Technician: 1,
      Admin: 1
    }
  });

  useEffect(() => {
    if (editingTemplate) {
      setFormData({
        ...editingTemplate,
        staffing: typeof editingTemplate.staffing === 'string' ? JSON.parse(editingTemplate.staffing) : editingTemplate.staffing
      });
    } else {
      setFormData({
        name: "",
        department: "Outpatient (OPD)",
        type: "Morning",
        startTime: "08:00 AM",
        endTime: "02:00 PM",
        breakDuration: "30",
        rule: "Fixed Shift",
        staffing: { Doctor: 1, Nurse: 2, Technician: 1, Admin: 1 }
      });
    }
  }, [editingTemplate, isOpen]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStaffingChange = (role, value) => {
    setFormData(prev => ({
      ...prev,
      staffing: { ...prev.staffing, [role]: parseInt(value) || 0 }
    }));
  };

  const handleSave = async () => {
    if (!formData.name) {
      toast.error("Nomenclature definition required");
      return;
    }
    
    try {
      const url = editingTemplate ? `${API_BASE}/templates/${editingTemplate.id}` : `${API_BASE}/templates`;
      const method = editingTemplate ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify({ ...formData, branchId })
      });
      
      if (res.ok) {
        toast.success(editingTemplate ? "Registry definition updated" : "Staffing orchestrated successfully");
        onSuccess();
        onClose();
      } else {
        const error = await res.json();
        toast.error(error.error || "Registry synchronization failure");
      }
    } catch (error) {
      toast.error("Network module handshake failure");
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/60 backdrop-blur-[6px] animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-card w-full max-w-[720px] rounded-[5px] overflow-hidden animate-in zoom-in-95 duration-200 border border-border shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-10 py-8 flex justify-between items-center border-b border-border">
          <div>
            <h2 className="text-[22px] font-extrabold text-foreground tracking-tight leading-none">
              {editingTemplate ? "Modify Staffing Definition" : "Orchestrate Shift Template"}
            </h2>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-[2px] mt-3">Temporal window and role-based capacity logic</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="rounded-full h-10 w-10 hover:bg-muted"
          >
            <X className="w-6 h-6 text-muted-foreground" />
          </Button>
        </div>

        {/* Modal Body */}
        <div className="px-10 py-8 space-y-8 max-h-[70vh] overflow-y-auto no-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-muted-foreground ml-1 uppercase tracking-tight">Template Nomenclature</label>
              <Input 
                type="text" 
                placeholder="e.g. Morning Ward Configuration"
                className="h-[52px] bg-background font-bold text-[14px] border-[#E7E8EB]"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-muted-foreground ml-1 uppercase tracking-tight">Clinical Sector</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full h-[52px] justify-between font-bold text-[14px] bg-background border-[#E7E8EB]">
                    <span>{formData.department}</span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="start" 
                  className="w-[300px] border-border bg-card z-[600]"
                >
                  {["Outpatient (OPD)", "Emergency", "Cardiology", "Surgery", "ICU", "General Ward"].map((dept) => (
                    <DropdownMenuItem 
                      key={dept} 
                      className="font-bold text-[12px] h-11 cursor-pointer focus:bg-primary/5"
                      onClick={() => handleChange("department", dept)}
                    >
                      {dept}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[12px] font-bold text-muted-foreground ml-1 uppercase tracking-tight">Staffing Category</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {shiftTypes.map(type => (
                <button
                  key={type.label}
                  type="button"
                  onClick={() => handleChange("type", type.label)}
                  className={cn(
                    "flex flex-col items-center gap-3 p-6 rounded-[5px] border transition-all group",
                    formData.type === type.label 
                      ? "bg-primary/5 border-primary shadow-sm" 
                      : "border-[#E7E8EB] bg-background hover:border-primary hover:bg-primary/5 shadow-none"
                  )}
                >
                  <type.icon className={cn("w-7 h-7", type.color)} />
                  <span className="text-[12px] font-extrabold text-foreground uppercase tracking-tight">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-10 gap-y-6">
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-muted-foreground ml-1 uppercase tracking-tight">Temporal Initiation</label>
              <CustomTimePicker 
                value={formData.startTime} 
                onChange={(val) => handleChange("startTime", val)} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-muted-foreground ml-1 uppercase tracking-tight">Temporal Termination</label>
              <CustomTimePicker 
                value={formData.endTime} 
                onChange={(val) => handleChange("endTime", val)} 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-10 gap-y-6">
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-muted-foreground ml-1 uppercase tracking-tight">Break Allocation (Mins)</label>
              <div className="relative">
                <Coffee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
                <Input 
                  type="number" 
                  placeholder="30"
                  className="h-[52px] pl-12 bg-background font-bold text-[14px] border-[#E7E8EB]"
                  value={formData.breakDuration}
                  onChange={(e) => handleChange("breakDuration", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-muted-foreground ml-1 uppercase tracking-tight">Operational Policy</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full h-[52px] justify-between font-bold text-[14px] bg-background border-[#E7E8EB] relative pl-12">
                    <RefreshCcw className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
                    <span>{formData.rule}</span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="start" 
                  className="w-[300px] border-border bg-card z-[600]"
                >
                  {["Fixed Shift", "Rotating Shift", "Split Shift"].map((rule) => (
                    <DropdownMenuItem 
                      key={rule} 
                      className="font-bold text-[12px] h-11 cursor-pointer focus:bg-primary/5"
                      onClick={() => handleChange("rule", rule)}
                    >
                      {rule}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="space-y-6 pt-6 border-t border-dashed border-border">
            <div className="flex items-center justify-between">
               <label className="text-[12px] font-bold text-muted-foreground ml-1 flex items-center gap-2 uppercase tracking-tight">
                 <Users className="w-4 h-4 text-primary" />
                 Minimum Capacity Logic
               </label>
               <span className="text-[10px] font-extrabold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-[5px] uppercase">Compliance Active</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {[
                { label: "Doctor", icon: Activity },
                { label: "Nurse", icon: Activity },
                { label: "Technician", icon: Activity },
                { label: "Admin", icon: Users }
              ].map((role) => (
                <div key={role.label} className="space-y-2">
                  <p className="text-[11px] font-extrabold text-gray-400 ml-1 uppercase tracking-tight">{role.label}s</p>
                  <div className="relative">
                    <Input 
                      type="number" 
                      min="0"
                      className="h-11 pl-4 bg-background font-bold text-[14px] border-[#E7E8EB]"
                      value={formData.staffing[role.label]}
                      onChange={(e) => handleStaffingChange(role.label, e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-10 py-8 flex justify-end items-center gap-5 border-t border-border bg-muted/5">
          <Button 
            variant="outline"
            onClick={onClose}
            className="px-10 h-[52px] text-[13px] font-bold"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className="px-12 h-[52px] text-[13px] font-bold shadow-lg shadow-primary/20"
          >
            {editingTemplate ? "Commit Changes" : "Save Definition"}
          </Button>
        </div>
      </div>
    </div>
  );
}
