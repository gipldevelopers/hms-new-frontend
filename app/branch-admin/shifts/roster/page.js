"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  Users, 
  CalendarDays,
  Calendar as CalendarIcon,
  Filter,
  MoreVertical,
  X,
  Check,
  Zap,
  Sun,
  Sunset,
  Moon,
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CustomCalendar } from "@/components/ui/custom-calendar";

// --- CONFIGURATION ---
const SHIFT_TYPES = {
  Morning: { 
    icon: Sun, 
    color: "text-sky-500", 
    bg: "bg-sky-50 dark:bg-sky-500/10", 
    border: "border-sky-100 dark:border-sky-500/20",
    dot: "bg-sky-500"
  },
  Evening: { 
    icon: Sunset, 
    color: "text-amber-500", 
    bg: "bg-amber-50 dark:bg-amber-500/10", 
    border: "border-amber-100 dark:border-amber-500/20",
    dot: "bg-amber-500"
  },
  Night: { 
    icon: Moon, 
    color: "text-indigo-500", 
    bg: "bg-indigo-50 dark:bg-indigo-500/10", 
    border: "border-indigo-100 dark:border-indigo-500/20",
    dot: "bg-indigo-500"
  },
  Emergency: { 
    icon: Zap, 
    color: "text-red-500", 
    bg: "bg-red-50 dark:bg-red-500/10", 
    border: "border-red-100 dark:border-red-500/20",
    dot: "bg-red-500"
  },
};

// --- HELPERS ---
const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

export default function CalendarSchedulingPage() {
  const [branchId, setBranchId] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [view, setView] = useState("month");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Real Data State
  const [staff, setStaff] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [roster, setRoster] = useState([]);
  
  // Modal State
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedStaffIds, setSelectedStaffIds] = useState([]);
  const [notes, setNotes] = useState("");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const datePickerRef = useRef(null);
  const router = useRouter();

  // 🛡️ AUTH & BRANCH INITIALIZATION
  useEffect(() => {
    const initializePage = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authtoken");
        if (!token) {
          router.push("/login");
          return;
        }

        // 1. Fetch User Profile to determine role and branch
        const userRes = await fetch("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const userJson = await userRes.json();
        
        if (!userJson.success) {
          router.push("/login");
          return;
        }

        const user = userJson.data;
        let bid = null;

        if (user.role === "BRANCH_ADMIN") {
          // Branch Admin has a fixed branch assignment
          bid = user.branchId;
        } else if (user.role === "SUPERADMIN") {
          // SuperAdmin uses the active selection
          bid = localStorage.getItem("activeBranchId");
        }

        if (!bid) {
          if (user.role === "SUPERADMIN") {
            toast.error("Please select a branch from the management console first.");
            router.push("/super-admin/branches");
          } else {
            toast.error("Account configuration error: No branch assigned.");
          }
          return;
        }

        setBranchId(bid);
        await fetchInitialData(bid);
      } catch (err) {
        console.error("Initialization failed:", err);
        toast.error("Secure handshake failed. Please refresh.");
      } finally {
        setLoading(false);
      }
    };

    initializePage();
  }, []);

  const fetchInitialData = async (bid) => {
    try {
      const token = localStorage.getItem("authtoken");
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch Staff & Templates in parallel
      const [staffRes, templatesRes] = await Promise.all([
        fetch(`/api/staff?branchId=${bid}`, { headers }),
        fetch(`/api/shifts/templates?branchId=${bid}`, { headers })
      ]);

      const staffData = await staffRes.json();
      const templatesData = await templatesRes.json();

      setStaff(Array.isArray(staffData) ? staffData : []);
      setTemplates(Array.isArray(templatesData) ? templatesData : []);
      
      // Initial roster fetch for current month
      await fetchRosterForMonth(bid, currentDate);
    } catch (err) {
      toast.error("Connectivity established, but data retrieval failed.");
      setStaff([]);
      setTemplates([]);
    }
  };

  const fetchRosterForMonth = async (bid, date) => {
    try {
      const token = localStorage.getItem("authtoken");
      const start = new Date(date.getFullYear(), date.getMonth(), 1).toISOString();
      const end = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString();
      
      const res = await fetch(`/api/shifts/roster?branchId=${bid}&startDate=${start}&endDate=${end}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setRoster(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Roster fetch failed", err);
      setRoster([]);
    }
  };

  useEffect(() => {
    if (branchId) fetchRosterForMonth(branchId, currentDate);
  }, [currentDate]);

  const handleCreateAssignment = async () => {
    if (!selectedTemplate || selectedStaffIds.length === 0) {
      toast.error("Selection incomplete");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("authtoken");
      const template = templates.find(t => t.id === selectedTemplate);
      
      // Batch creation logic (one per staff member)
      const promises = selectedStaffIds.map(sid => {
        const staffMember = staff.find(s => s.id === sid);
        return fetch("/api/shifts/roster", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({
            branchId,
            staffId: sid,
            staffName: `${staffMember.firstName} ${staffMember.lastName}`,
            templateId: template.id,
            date: selectedDate,
            startTime: template.startTime,
            endTime: template.endTime,
            department: template.department,
            notes
          })
        });
      });

      await Promise.all(promises);
      toast.success("Roster synchronized across registries");
      setIsModalOpen(false);
      fetchRosterForMonth(branchId, currentDate);
      
      // Reset Modal
      setSelectedTemplate(null);
      setSelectedStaffIds([]);
      setNotes("");
    } catch (err) {
      toast.error("Registry synchronization failed");
    } finally {
      setSubmitting(false);
    }
  };

  // --- CALENDAR LOGIC ---
  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;

  const formatDate = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const toggleStaffSelection = (id) => {
    setSelectedStaffIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center space-y-4 bg-[#F8F9FC] dark:bg-[#0A0F1D]">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Synchronizing Healthcare Roster...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#F8F9FC] dark:bg-[#0A0F1D] min-h-screen space-y-[25px] flex flex-col transition-colors duration-300 font-sans">
      
      {/* Header Section */}
      <div className="flex justify-between items-center mb-[25px]">
        <div>
           <h1 className="text-[20px] font-bold text-[#1e293b] dark:text-white leading-tight">Branch Staff Roster</h1>
        </div>

        <div className="flex items-center gap-3">
           <div className="relative" ref={datePickerRef}>
              <button 
                onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                className="flex items-center bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] h-[44px] shadow-none hover:border-primary/30 transition-all px-4 gap-3 group"
              >
                 <div className="p-1.5 bg-primary/5 rounded-[5px] group-hover:bg-primary/10 transition-colors">
                    <CalendarDays className="w-4 h-4 text-primary" />
                 </div>
                 <div className="flex flex-col items-start min-w-[120px]">
                    <span className="text-[13px] font-bold text-[#1e293b] dark:text-white leading-none">
                       {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter mt-0.5">Registry Navigation</span>
                 </div>
                 <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform duration-300", isDatePickerOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {isDatePickerOpen && (
                  <div className="absolute top-[110%] right-0 z-[500] shadow-xl">
                    <CustomCalendar 
                      selectedDate={currentDate}
                      onSelect={(date) => {
                        if (date) setCurrentDate(date);
                        setIsDatePickerOpen(false);
                      }}
                      onClose={() => setIsDatePickerOpen(false)}
                    />
                  </div>
                )}
              </AnimatePresence>
           </div>

           <div className="hidden lg:flex bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] p-1 h-[44px] shadow-none items-center">
              {["Month", "Week", "Day"].map(v => (
                <button
                  key={v}
                  onClick={() => setView(v.toLowerCase())}
                  className={cn(
                    "px-5 h-[36px] rounded-[5px] text-[10px] font-bold uppercase tracking-[1px] transition-all duration-300 flex items-center justify-center",
                    view === v.toLowerCase() 
                      ? "bg-primary text-white shadow-none" 
                      : "text-gray-400 hover:text-primary"
                  )}
                >
                  {v}
                </button>
              ))}
           </div>
        </div>
      </div>

      {/* Calendar View Container */}
      <div className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] overflow-hidden shadow-none flex-1 flex flex-col relative min-h-[600px]">
        <AnimatePresence mode="wait">
          {/* 1. Month View */}
          {view === "month" && (
            <motion.div 
              key="month"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col"
            >
               <div className="grid grid-cols-7 border-b border-[#E7E8EB] dark:border-white/10 bg-[#F8F9FC] dark:bg-[#1e293b]">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
                    <div key={day} className="py-3 text-center">
                       <span className="text-[10px] font-bold uppercase tracking-[2px] text-gray-400">{day}</span>
                    </div>
                  ))}
               </div>

               <div className="grid grid-cols-7 flex-1">
                  {Array.from({ length: startOffset }).map((_, i) => (
                    <div key={`off-${i}`} className="border-b border-r border-[#E7E8EB]/50 dark:border-white/5 bg-[#F8F9FC]/30 dark:bg-white/[0.01]" />
                  ))}

                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const dayRoster = (roster || []).filter(r => new Date(r.date).toISOString().split('T')[0] === dateStr);
                    const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();

                    return (
                      <div 
                        key={day} 
                        onClick={() => { setSelectedDate(dateStr); setIsModalOpen(true); }}
                        className={cn(
                          "p-4 border-b border-r border-[#E7E8EB] dark:border-white/10 hover:bg-primary/[0.02] transition-all cursor-pointer relative group min-h-[130px]",
                          isToday && "bg-primary/[0.04]"
                        )}
                      >
                        <div className="flex justify-between items-start mb-3">
                           <span className={cn(
                             "text-[14px] font-bold w-7 h-7 flex items-center justify-center rounded-[5px] transition-all duration-300",
                             isToday ? "bg-primary text-white" : "text-gray-400 group-hover:text-primary"
                           )}>
                              {day}
                           </span>
                           {dayRoster.length > 0 && (
                             <div className="flex -space-x-1">
                               {dayRoster.slice(0, 3).map((r, idx) => (
                                 <div key={idx} className={cn("w-2 h-2 rounded-full border border-white dark:border-[#101935]", SHIFT_TYPES[r.type]?.bg || "bg-gray-200")} />
                               ))}
                             </div>
                           )}
                        </div>

                        <div className="space-y-1.5 overflow-hidden">
                           {dayRoster.slice(0, 2).map((entry, idx) => {
                             const config = SHIFT_TYPES[entry.type] || SHIFT_TYPES.Morning;
                             return (
                               <div key={idx} className={cn(
                                 "px-2 py-1 rounded-[3px] border border-transparent flex items-center gap-2 transition-all",
                                 config.bg, config.color
                               )}>
                                  <div className={cn("w-1 h-1 rounded-full shrink-0", config.dot || "bg-current")} />
                                  <p className="text-[9px] font-bold truncate uppercase flex-1 tracking-tight">{entry.staffName?.split(' ')[0]}</p>
                                  {entry.attendance && (
                                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500 shrink-0" />
                                  )}
                               </div>
                             );
                           })}
                           {dayRoster.length > 2 && (
                             <p className="text-[8px] font-bold text-center text-gray-400 mt-1 uppercase tracking-widest">+ {dayRoster.length - 2} STAFF</p>
                           )}
                        </div>
                      </div>
                    );
                  })}
               </div>
            </motion.div>
          )}

          {/* 2. Timeline View (Week & Day Architecture) */}
          {(view === "week" || view === "day") && (
            <motion.div 
              key={view}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 flex flex-col h-full bg-white dark:bg-[#101935]"
            >
               {/* Timeline Header */}
               <div className="flex border-b border-[#E7E8EB] dark:border-white/10 bg-[#F8F9FC] dark:bg-[#1e293b]">
                  <div className="w-[80px] border-r border-[#E7E8EB] dark:border-white/10" />
                  <div className="flex-1 grid divide-x divide-[#E7E8EB] dark:divide-white/10" style={{ gridTemplateColumns: view === "week" ? "repeat(7, 1fr)" : "1fr" }}>
                    {Array.from({ length: view === "week" ? 7 : 1 }).map((_, i) => {
                      const d = new Date(currentDate);
                      if (view === "week") {
                        const dayOffset = d.getDay() === 0 ? 6 : d.getDay() - 1;
                        d.setDate(d.getDate() - dayOffset + i);
                      }
                      const isToday = d.toDateString() === new Date().toDateString();
                      return (
                        <div key={i} className={cn("py-4 text-center", isToday && "bg-primary/[0.04]")}>
                           <p className={cn("text-[10px] font-bold uppercase tracking-[2px]", isToday ? "text-primary" : "text-gray-400")}>
                             {d.toLocaleDateString('en-US', { weekday: 'short' })}
                           </p>
                           <p className={cn("text-[24px] font-bold mt-1 leading-none", isToday ? "text-primary" : "text-[#1e293b] dark:text-white")}>
                             {d.getDate()}
                           </p>
                        </div>
                      );
                    })}
                  </div>
               </div>

               {/* Timeline Body (Scrolling Area) */}
               <div className="flex-1 overflow-y-auto no-scrollbar relative min-h-[500px]">
                  <div className="flex min-h-full">
                     {/* Time Axis */}
                     <div className="w-[80px] border-r border-[#E7E8EB] dark:border-white/10 bg-[#F8F9FC] dark:bg-[#1e293b]">
                        {Array.from({ length: 24 }).map((_, i) => (
                          <div key={i} className="h-[80px] border-b border-[#E7E8EB]/50 dark:border-white/5 px-3 flex items-start pt-2">
                             <span className="text-[10px] font-bold text-gray-400 tracking-tighter">
                                {String(i).padStart(2, '0')}:00
                             </span>
                          </div>
                        ))}
                     </div>

                        {/* Current Time Indicator (Live Pulse) */}
                        {Array.from({ length: view === "week" ? 7 : 1 }).some((_, i) => {
                          const d = new Date(currentDate);
                          if (view === "week") {
                            const dayOffset = d.getDay() === 0 ? 6 : d.getDay() - 1;
                            d.setDate(d.getDate() - dayOffset + i);
                          }
                          return d.toDateString() === new Date().toDateString();
                        }) && (
                          <div 
                            className="absolute left-[80px] right-0 z-30 pointer-events-none"
                            style={{ 
                              top: `${(new Date().getHours() * 60 + new Date().getMinutes()) / 60 * 80}px` 
                            }}
                          >
                             <div className="relative w-full">
                                <div className="absolute left-0 right-0 h-[1.5px] bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.3)]" />
                                <div className="absolute left-0 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500 shadow-lg" />
                                <div className="absolute left-4 -translate-y-1/2 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-[3px] shadow-lg">
                                   LIVE PULSE
                                </div>
                             </div>
                          </div>
                        )}

                        {/* Assignments Column */}
                        <div className="flex-1 grid divide-x divide-[#E7E8EB]/50 dark:divide-white/5" style={{ gridTemplateColumns: view === "week" ? "repeat(7, 1fr)" : "1fr" }}>
                          {Array.from({ length: view === "week" ? 7 : 1 }).map((_, i) => {
                            const d = new Date(currentDate);
                            if (view === "week") {
                              const dayOffset = d.getDay() === 0 ? 6 : d.getDay() - 1;
                              d.setDate(d.getDate() - dayOffset + i);
                            }
                            const dateStr = d.toISOString().split('T')[0];
                            const dayRoster = (roster || []).filter(r => new Date(r.date).toISOString().split('T')[0] === dateStr);
                            const isToday = d.toDateString() === new Date().toDateString();

                            return (
                              <div key={i} className={cn("relative h-[1920px] hover:bg-gray-50/30 dark:hover:bg-white/[0.01] transition-colors", isToday && "bg-primary/[0.01]")}>
                                {dayRoster.map((entry, idx) => {
                                  const config = SHIFT_TYPES[entry.type] || SHIFT_TYPES.Morning;
                                  const getMinutes = (t) => {
                                    if (!t) return 0;
                                    const [time, period] = t.split(' ');
                                    let [h, m] = time.split(':').map(Number);
                                    if (period === 'PM' && h !== 12) h += 12;
                                    if (period === 'AM' && h === 12) h = 0;
                                    return h * 60 + m;
                                  };

                                  const startMins = getMinutes(entry.startTime);
                                  const endMins = getMinutes(entry.endTime);
                                  const top = (startMins / 60) * 80;
                                  const height = Math.max(40, ((endMins - startMins) / 60) * 80);

                                  return (
                                    <motion.div 
                                      key={idx}
                                      initial={{ opacity: 0, scale: 0.95 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      className={cn(
                                        "absolute left-1 right-1 rounded-[5px] border p-2 shadow-none transition-all hover:z-20 hover:scale-[1.02] cursor-pointer flex flex-col overflow-hidden",
                                        config.bg, config.color, config.border
                                      )}
                                      style={{ top: `${top}px`, height: `${height}px` }}
                                    >
                                       <div className="flex items-center gap-2 mb-1">
                                          <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", config.dot || "bg-current")} />
                                          <p className="text-[9px] font-bold uppercase truncate flex-1 tracking-tighter leading-none">{entry.staffName}</p>
                                          {entry.attendance && (
                                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500 shrink-0" />
                                          )}
                                       </div>
                                       <p className="text-[8px] font-bold opacity-70 leading-none">{entry.startTime} - {entry.endTime}</p>
                                       {height > 60 && (
                                         <p className="text-[8px] font-bold mt-auto uppercase tracking-widest opacity-40">{entry.type}</p>
                                       )}
                                    </motion.div>
                                  );
                                })}
                                <button 
                                  onClick={() => { setSelectedDate(dateStr); setIsModalOpen(true); }}
                                  className="absolute inset-x-0 h-full w-full opacity-0 hover:opacity-100 flex items-start justify-center pt-2 transition-all group"
                                >
                                  <div className="bg-primary text-white text-[9px] font-bold px-3 py-1 rounded-[5px] shadow-lg transform -translate-y-2 group-hover:translate-y-0 transition-transform">
                                    + ASSIGN STAFF
                                  </div>
                                </button>
                              </div>
                            );
                          })}
                        </div>
                     </div>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </div>
      <div className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 p-5 rounded-[5px] flex items-center justify-between shadow-none">
         <div className="flex items-center gap-10">
            <span className="text-[10px] font-bold uppercase tracking-[2px] text-gray-400">Pattern Registry:</span>
            <div className="flex gap-6">
               {Object.entries(SHIFT_TYPES).map(([name, config]) => (
                 <div key={name} className="flex items-center gap-2 px-3 py-1.5 rounded-[5px] bg-[#F8F9FC] dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10">
                    <div className={cn("w-2 h-2 rounded-full", config.dot || "bg-current", config.color)} />
                    <span className="text-[10px] font-bold text-[#1e293b] dark:text-white uppercase tracking-tight">{name}</span>
                 </div>
               ))}
            </div>
         </div>
         <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50 text-emerald-500 rounded-[5px] border border-emerald-100">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Global Sync Active</span>
         </div>
      </div>

      {/* Assignment Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/60 backdrop-blur-[6px]">
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: 20 }}
               className="bg-white dark:bg-[#101935] w-full max-w-[550px] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 overflow-hidden shadow-2xl"
             >
                <div className="p-7 border-b border-[#E7E8EB] dark:border-white/10 flex justify-between items-center bg-[#F8F9FC] dark:bg-[#1e293b]">
                   <div>
                      <h2 className="text-[20px] font-bold text-[#1e293b] dark:text-white">Personnel Orchestration</h2>
                      <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">Assigning for {selectedDate}</p>
                   </div>
                   <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-[5px] hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-gray-400">
                      <X className="w-6 h-6" />
                   </button>
                </div>

                <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {/* 1. Shift Pattern Selection */}
                    <div className="space-y-4">
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[2px] block pl-1">
                          Clinical Shift Pattern
                       </label>
                       <div className="grid grid-cols-1 gap-3">
                          {templates.map(t => (
                             <div 
                               key={t.id} 
                               onClick={() => setSelectedTemplate(t.id)}
                               className={cn(
                                 "relative flex items-center justify-between p-5 rounded-[5px] border transition-all duration-300 group cursor-pointer",
                                 selectedTemplate === t.id 
                                   ? "border-primary bg-primary/[0.03]" 
                                   : "border-[#E7E8EB] dark:border-white/10 bg-white dark:bg-[#101935] hover:border-primary/50"
                               )}
                             >
                                <div className="flex items-center gap-4">
                                   <div className={cn(
                                     "w-3 h-3 rounded-full animate-pulse", 
                                     SHIFT_TYPES[t.type]?.bg || "bg-gray-400"
                                   )} />
                                   <div>
                                      <p className="text-[15px] font-bold text-[#1e293b] dark:text-white leading-tight">{t.name}</p>
                                      <div className="flex items-center gap-2 mt-1.5">
                                         <Clock className="w-3 h-3 text-gray-400" />
                                         <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tight">
                                            {t.startTime} - {t.endTime} • {t.department}
                                         </p>
                                      </div>
                                   </div>
                                </div>
                                <div className={cn(
                                  "w-6 h-6 rounded-[5px] flex items-center justify-center transition-all duration-300",
                                  selectedTemplate === t.id ? "bg-primary text-white" : "bg-gray-100 dark:bg-white/5 text-gray-300"
                                )}>
                                   <CheckCircle2 className="w-4 h-4" />
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>

                    {/* 2. Personnel Selection */}
                    <div className="space-y-4">
                       <div className="flex justify-between items-end px-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[2px]">Available Personnel</label>
                          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-[5px]">{selectedStaffIds.length} SELECTED</span>
                       </div>
                       <div className="grid grid-cols-2 gap-3">
                          {staff.map(s => (
                            <div 
                               key={s.id} 
                               onClick={() => toggleStaffSelection(s.id)}
                               className={cn(
                                 "group relative flex flex-col p-4 rounded-[5px] border transition-all duration-300 cursor-pointer text-center items-center justify-center gap-3",
                                 selectedStaffIds.includes(s.id) 
                                   ? "border-primary bg-primary/[0.05]" 
                                   : "border-[#E7E8EB] dark:border-white/10 bg-white dark:bg-[#101935] hover:border-primary/50"
                               )}>
                               <div className={cn(
                                 "w-12 h-12 rounded-[5px] flex items-center justify-center text-[14px] font-bold uppercase transition-all duration-500",
                                 selectedStaffIds.includes(s.id) ? "bg-primary text-white" : "bg-[#F8F9FC] dark:bg-[#1e293b] text-gray-400 border border-[#E7E8EB] dark:border-white/10"
                               )}>
                                  {s.firstName?.[0]}{s.lastName?.[0] || s.firstName?.[1] || ""}
                               </div>
                               <div className="min-w-0 w-full">
                                  <p className={cn(
                                    "text-[13px] font-bold transition-colors truncate",
                                    selectedStaffIds.includes(s.id) ? "text-primary" : "text-[#1e293b] dark:text-white"
                                  )}>{s.firstName} {s.lastName}</p>
                                  <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-1">{s.designation || "Medical Staff"}</p>
                                </div>
                                {selectedStaffIds.includes(s.id) && (
                                  <div className="absolute top-2 right-2 w-4 h-4 bg-primary text-white rounded-[3px] flex items-center justify-center shadow-lg">
                                     <Check className="w-2.5 h-2.5 stroke-[4]" />
                                  </div>
                                )}
                            </div>
                          ))}
                          {staff.length === 0 && (
                           <div className="py-10 text-center border border-dashed border-[#E7E8EB] dark:border-white/10 rounded-[5px] col-span-2">
                              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">No staff records found</p>
                           </div>
                         )}
                       </div>
                    </div>
                </div>

                <div className="p-7 bg-[#F8F9FC] dark:bg-[#1e293b] border-t border-[#E7E8EB] dark:border-white/10 flex gap-4">
                   <button 
                     onClick={() => setIsModalOpen(false)}
                     className="flex-1 h-[50px] rounded-[5px] text-[13px] font-bold text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-all border border-[#E7E8EB] dark:border-white/10"
                   >
                     Discard
                   </button>
                   <button 
                     disabled={submitting || !selectedTemplate || selectedStaffIds.length === 0}
                     onClick={handleCreateAssignment}
                     className="flex-[2] h-[50px] bg-primary text-white rounded-[5px] text-[14px] font-bold flex items-center justify-center gap-3 hover:bg-primary/90 transition-all disabled:opacity-50 border border-primary shadow-none"
                   >
                     {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-4 h-4" />}
                     {submitting ? "Synchronizing..." : "Authorize Roster Entry"}
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
