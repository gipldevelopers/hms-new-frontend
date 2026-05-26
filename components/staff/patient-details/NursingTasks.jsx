"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, ChevronDown, Clock, Check, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function NursingTasks({ patientId, branchId }) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState("All");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const priorityOptions = ["All", "HIGH", "MEDIUM", "LOW"];

  const fetchTasks = async (search = "", priority = "All") => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authtoken");
      const params = new URLSearchParams();
      if (patientId) params.append("patientId", patientId);
      if (search) params.append("search", search);
      if (priority !== "All") params.append("priority", priority);
      if (branchId) params.append("branchId", branchId);

      const res = await fetch(`/api/tasks?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTasks(data || []);
      }
    } catch (err) {
      console.error("Error fetching patient tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchTasks(searchQuery, filterPriority);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [patientId, searchQuery, filterPriority, branchId]);

  const toggleTask = async (task) => {
    try {
      const newStatus = task.status === "Completed" ? "Pending" : "Completed";
      const token = localStorage.getItem("authtoken");
      const res = await fetch(`/api/tasks/${task.id}${branchId ? `?branchId=${branchId}` : ""}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchTasks(searchQuery, filterPriority);
      }
    } catch (err) {
      console.error("Error updating task status:", err);
    }
  };

  const prefix = pathname.startsWith("/super-admin") ? "/super-admin/patient-detail" : "/staff";

  const handleAction = (task) => {
    router.push(`${prefix}/tasks/${task.id}${branchId ? `?branchId=${branchId}` : ""}`);
  };

  const filteredTasks = tasks;

  const getPriorityColor = (p) => {
    const normalized = (p || "").toUpperCase();
    if (normalized === "HIGH") return "text-destructive";
    if (normalized === "MEDIUM") return "text-amber-500";
    return "text-emerald-500";
  };

  const getDotColor = (p) => {
    const normalized = (p || "").toUpperCase();
    if (normalized === "HIGH") return "bg-destructive";
    if (normalized === "MEDIUM") return "bg-amber-500";
    return "bg-emerald-500";
  };

  return (
    <div className="space-y-[20px] animate-in fade-in duration-500">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-[400px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-11 pr-4 bg-card border border-border rounded-lg text-[13px] outline-none focus:ring-1 focus:ring-primary/20 transition-all shadow-none text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-11 px-5 bg-card border border-border rounded-lg text-[13px] font-bold text-foreground flex items-center gap-3 hover:bg-muted transition-all outline-none w-full sm:w-auto justify-between sm:justify-start shadow-none">
                {filterPriority === "All" ? "All Priority" : filterPriority.charAt(0) + filterPriority.slice(1).toLowerCase()}
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px] bg-card border border-border rounded-lg p-1 shadow-none z-50">
              {priorityOptions.map((priority) => (
                <DropdownMenuItem
                  key={priority}
                  onClick={() => setFilterPriority(priority)}
                  className={cn(
                    "rounded-lg px-3 py-2 text-[13px] font-medium cursor-pointer transition-colors",
                    filterPriority === priority
                      ? "bg-primary/5 text-primary font-bold"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  {priority === "All" ? "All Priority" : priority.charAt(0) + priority.slice(1).toLowerCase()}
                  {filterPriority === priority && <Check className="w-4 h-4 ml-auto" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="bg-transparent md:bg-card md:rounded-lg md:border md:border-border overflow-hidden shadow-none">
        <div className="hidden md:block p-6 border-b border-border">
          <h4 className="text-[15px] font-bold text-foreground uppercase tracking-widest">Nursing Tasks</h4>
        </div>
        
        <div className="md:p-6 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-[13px] font-semibold text-muted-foreground">Loading tasks...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center p-12 border border-dashed border-border rounded-lg text-[13px] font-medium text-muted-foreground italic bg-card/50">
              No tasks found
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div key={task.id} className={cn("p-4 md:p-5 bg-card md:bg-transparent border border-border rounded-lg transition-all group shadow-none", task.status === "Completed" && "opacity-60")}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start md:items-center gap-4 md:gap-6">
                    <div className="shrink-0 pt-1 md:pt-0">
                      <div 
                        onClick={() => toggleTask(task)}
                        className={cn(
                          "w-6 h-6 rounded-md border-2 flex items-center justify-center cursor-pointer transition-all",
                          task.status === "Completed" 
                            ? "bg-primary border-primary text-primary-foreground" 
                            : "border-border hover:border-primary"
                        )}
                      >
                        {task.status === "Completed" && <Check className="w-4 h-4 stroke-[3px]" />}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className={cn("text-[15px] md:text-[16px] font-bold text-foreground mb-2 leading-tight", task.status === "Completed" && "line-through opacity-50")}>{task.title}</p>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-[12px] font-bold uppercase tracking-wide">{task.dueTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={cn("w-1.5 h-1.5 rounded-full", getDotColor(task.priority))} />
                          <span className={cn("text-[10px] font-black uppercase tracking-widest", getPriorityColor(task.priority))}>{task.priority}</span>
                        </div>
                        {task.assignedTo && (
                           <span className="text-[12px] font-bold text-muted-foreground/80">
                             Assigned: {task.assignedTo}
                           </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <button 
                      onClick={() => handleAction(task)}
                      className="h-11 px-4 md:px-5 text-[11px] font-black text-primary bg-primary/5 border border-primary/10 rounded-lg hover:bg-primary/10 transition-all uppercase tracking-widest w-full md:w-auto outline-none flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" /> Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
