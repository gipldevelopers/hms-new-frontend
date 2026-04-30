"use client";

import React, { useState } from "react";
import { Search, ChevronDown, Clock, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function NursingTasks() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState("All");
  
  const priorityOptions = ["All", "HIGH", "MEDIUM", "LOW"];

  const [tasks, setTasks] = useState([
    { 
      name: "Change IV dressing", 
      due: "Due in 2h", 
      priority: "HIGH", 
      priorityColor: "text-rose-500", 
      dotColor: "bg-rose-500",
      assignedTo: "Unassigned",
      completed: false
    },
    { 
      name: "Collect Blood Sample (CBC)", 
      due: "Due in 4h", 
      priority: "MEDIUM", 
      priorityColor: "text-amber-500", 
      dotColor: "bg-amber-500",
      assignedTo: "Sarah Jenkins",
      completed: false
    },
    { 
      name: "Patient positioning / Turn", 
      due: "Due in 5h", 
      priority: "LOW", 
      priorityColor: "text-emerald-500", 
      dotColor: "bg-emerald-500",
      assignedTo: "Unassigned",
      completed: false
    },
    { 
      name: "Incentive spirometry", 
      due: "Due in 6h", 
      priority: "MEDIUM", 
      priorityColor: "text-amber-500", 
      dotColor: "bg-amber-500",
      assignedTo: "Sarah Jenkins",
      completed: false
    }
  ]);

  const toggleTask = (idx) => {
    const updated = [...tasks];
    updated[idx].completed = !updated[idx].completed;
    setTasks(updated);
  };

  const handleAction = (type, task) => {
    alert(`${type}: ${task.name}`);
  };

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === "All" || t.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="space-y-[20px] animate-in fade-in duration-500">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-[400px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-11 pr-4 bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] outline-none focus:ring-1 focus:ring-primary/20 transition-all shadow-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-11 px-5 bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-bold text-[#1A1C23] dark:text-white flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-all outline-none w-full sm:w-auto justify-between sm:justify-start">
                {filterPriority === "All" ? "All Priority" : filterPriority.charAt(0) + filterPriority.slice(1).toLowerCase()}
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px] bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] p-1 shadow-xl">
              {priorityOptions.map((priority) => (
                <DropdownMenuItem
                  key={priority}
                  onClick={() => setFilterPriority(priority)}
                  className={cn(
                    "rounded-[5px] px-3 py-2 text-[13px] font-medium cursor-pointer transition-colors",
                    filterPriority === priority
                      ? "bg-primary/5 text-primary font-bold"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
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

      <div className="bg-transparent md:bg-white dark:md:bg-[#101935] md:rounded-[5px] md:border md:border-[#E7E8EB] dark:md:border-white/10 overflow-hidden shadow-none">
        <div className="hidden md:block p-6 border-b border-[#E7E8EB] dark:border-white/10">
          <h4 className="text-[15px] font-bold text-[#1A1C23] dark:text-white uppercase tracking-widest">Nursing Tasks</h4>
        </div>
        
        <div className="md:p-6 space-y-4">
          {filteredTasks.map((task, idx) => (
            <div key={idx} className={cn("p-4 md:p-5 bg-white dark:bg-[#101935] md:dark:bg-transparent border border-[#E7E8EB] dark:border-white/10 rounded-[5px] transition-all group shadow-none", task.completed && "opacity-60")}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start md:items-center gap-4 md:gap-6">
                  <div className="shrink-0 pt-1 md:pt-0">
                    <div 
                      onClick={() => toggleTask(idx)}
                      className={cn(
                        "w-6 h-6 rounded-[5px] border-2 flex items-center justify-center cursor-pointer transition-all",
                        task.completed 
                          ? "bg-primary border-primary text-white" 
                          : "border-gray-200 dark:border-white/10 hover:border-primary"
                      )}
                    >
                      {task.completed && <Check className="w-4 h-4 stroke-[3px]" />}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className={cn("text-[15px] md:text-[16px] font-bold text-[#1A1C23] dark:text-white mb-2 leading-tight", task.completed && "line-through opacity-50")}>{task.name}</p>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-[12px] font-bold uppercase tracking-wide">{task.due}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={cn("w-1.5 h-1.5 rounded-full", task.dotColor)} />
                        <span className={cn("text-[10px] font-black uppercase tracking-widest", task.priorityColor)}>{task.priority}</span>
                      </div>
                      {task.assignedTo && (
                         <span className="text-[12px] font-bold text-gray-400/80">
                           {task.assignedTo}
                         </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:flex items-center gap-3 w-full md:w-auto">
                  <button 
                    onClick={() => handleAction("Escalate", task)}
                    className="h-11 px-4 md:px-5 text-[11px] font-black text-[#5E6C84] dark:text-gray-400 bg-gray-50 dark:bg-white/5 border border-transparent rounded-[5px] hover:bg-gray-100 transition-all uppercase tracking-widest w-full md:w-auto"
                  >
                    Escalate
                  </button>
                  <button 
                    onClick={() => handleAction("View", task)}
                    className="h-11 px-4 md:px-5 text-[11px] font-black text-primary bg-primary/5 border border-primary/10 rounded-[5px] hover:bg-primary/10 transition-all uppercase tracking-widest w-full md:w-auto"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
