"use client";

import React from "react";
import { 
  ChevronDown, 
  Layers
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function BedHeader({ departments, selectedDept, selectedWard, onDeptChange, onWardChange }) {
  const [isDeptOpen, setIsDeptOpen] = React.useState(false);
  const [isWardOpen, setIsWardOpen] = React.useState(false);

  // Click outside to close
  React.useEffect(() => {
    const handleClickOutside = () => {
      setIsDeptOpen(false);
      setIsWardOpen(false);
    };
    if (isDeptOpen || isWardOpen) {
      window.addEventListener("click", handleClickOutside);
    }
    return () => window.removeEventListener("click", handleClickOutside);
  }, [isDeptOpen, isWardOpen]);

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 py-5 px-5 bg-white dark:bg-[#101935] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 shadow-none relative">
      <div className="space-y-4 w-full lg:w-auto">
        {/* Dual Selector System */}
        <div className="grid grid-cols-2 lg:flex lg:items-center gap-2 w-full lg:w-auto">
          {/* Department Selector */}
          <div className="flex items-center gap-2 relative">
            <div className="hidden sm:flex w-8 h-8 rounded-[5px] bg-[#F4F5F7] dark:bg-white/5 items-center justify-center text-[#2D3A8C] dark:text-primary border border-[#E7E8EB] dark:border-white/10 shrink-0">
               <Layers className="w-4 h-4" />
            </div>
            <div className="relative flex-1 sm:flex-none">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDeptOpen(!isDeptOpen);
                  setIsWardOpen(false);
                }}
                className={cn(
                  "w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 px-3 py-1.5 rounded-[5px] hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-left border border-[#E7E8EB] sm:border-transparent dark:border-white/10 sm:dark:border-transparent shadow-none sm:shadow-none",
                  isDeptOpen && "bg-gray-100 dark:bg-white/5 border-[#E7E8EB] dark:border-white/10"
                )}
              >
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-[#A0AEC0] uppercase-none leading-none">DEPARTMENT</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] sm:text-[15px] font-bold text-[#1A1C23] dark:text-white leading-none truncate max-w-[100px] sm:max-w-[150px]">{selectedDept?.name || "Select Dept"}</span>
                    <ChevronDown className={cn("w-3.5 h-3.5 text-[#A0AEC0] transition-transform", isDeptOpen && "rotate-180 text-[#2D3A8C]")} />
                  </div>
                </div>
              </button>

              {isDeptOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] py-1 z-50 shadow-none animate-in fade-in zoom-in-95 duration-200">
                  {departments.map((dept) => (
                    <button
                      key={dept.id}
                      onClick={() => {
                        onDeptChange(dept.id);
                        setIsDeptOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-2 text-[13px] font-bold transition-colors hover:bg-gray-50 dark:hover:bg-white/5",
                        selectedDept?.id === dept.id ? "text-[#2D3A8C] bg-[#F3F4FF] dark:bg-primary/10" : "text-[#5E6C84] dark:text-slate-400"
                      )}
                    >
                      {dept.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="hidden sm:block w-[1px] h-8 bg-[#E7E8EB] dark:bg-white/10 mx-2" />

          {/* Ward Selector */}
          <div className="flex items-center gap-2 relative">
            <div className="relative flex-1 sm:flex-none">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsWardOpen(!isWardOpen);
                  setIsDeptOpen(false);
                }}
                className={cn(
                  "w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 px-3 py-1.5 rounded-[5px] hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-left border border-[#E7E8EB] sm:border-transparent dark:border-white/10 sm:dark:border-transparent shadow-none sm:shadow-none",
                  isWardOpen && "bg-gray-100 dark:bg-white/5 border-[#E7E8EB] dark:border-white/10"
                )}
              >
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-[#A0AEC0] uppercase-none leading-none">WARD</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] sm:text-[15px] font-bold text-[#1A1C23] dark:text-white leading-none truncate max-w-[100px] sm:max-w-[150px]">{selectedWard?.name || "Select Ward"}</span>
                    <ChevronDown className={cn("w-3.5 h-3.5 text-[#A0AEC0] transition-transform", isWardOpen && "rotate-180 text-[#2D3A8C]")} />
                  </div>
                </div>
              </button>

              {isWardOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] py-1 z-50 shadow-none animate-in fade-in zoom-in-95 duration-200">
                  {(selectedDept?.wards || []).map((w) => (
                    <button
                      key={w.id}
                      onClick={() => {
                        onWardChange(w.id);
                        setIsWardOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-2 text-[13px] font-bold transition-colors hover:bg-gray-50 dark:hover:bg-white/5",
                        selectedWard?.id === w.id ? "text-[#2D3A8C] bg-[#F3F4FF] dark:bg-primary/10" : "text-[#5E6C84] dark:text-slate-400"
                      )}
                    >
                      {w.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
