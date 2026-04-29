"use client";

import React from "react";
import { 
  Pill, 
  Check,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const meds = [
  { id: 1, name: "Bed 108: Insulin Glargine", detail: "15 min OVERDUE", status: "overdue", color: "rose" },
  { id: 2, name: "Bed 101: Paracetamol", detail: "Due in 5 mins", status: "pending", color: "blue" },
  { id: 3, name: "Bed 105: Metformin", detail: "Due in 12 mins", status: "pending", color: "blue" },
];

export default function MedicationsList() {
  return (
    <div className="bg-white dark:bg-[#101935] p-5 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 shadow-none h-full flex flex-col">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h3 className="text-[16px] font-bold text-[#1A1C23] dark:text-white uppercase-none">Medications Due</h3>
        <button className="text-[11px] font-bold text-[#2D3A8C] dark:text-primary hover:underline uppercase-none">VIEW ALL</button>
      </div>
      
      <div className="space-y-4 flex-1">
        {meds.map((med) => (
          <div 
            key={med.id} 
            className={cn(
              "flex items-center justify-between p-3.5 rounded-[5px] border transition-all cursor-pointer",
              med.status === "overdue" 
                ? "bg-[#FEF2F2] border-[#FDE2E2] dark:bg-rose-500/5 dark:border-rose-500/10" 
                : "bg-white dark:bg-[#0B1121] border-[#F4F5F7] dark:border-white/5"
            )}
          >
            <div className="flex items-center gap-4">
               <div className={cn(
                 "w-12 h-12 rounded-[5px] flex items-center justify-center shrink-0",
                 med.status === "overdue" 
                  ? "bg-white border border-[#FDE2E2] text-[#D92D20]" 
                  : "bg-[#F3F4FF] text-[#2D3A8C]"
               )}>
                  <Pill className="w-5 h-5" />
               </div>
               <div>
                  <p className="text-[13px] font-bold text-[#1A1C23] dark:text-white">{med.name}</p>
                  <p className={cn(
                    "text-[11px] font-bold mt-0.5 uppercase-none",
                    med.status === "overdue" ? "text-[#D92D20]" : "text-[#A0AEC0]"
                  )}>
                    {med.detail}
                  </p>
               </div>
            </div>
            <div className={cn(
              "w-6 h-6 rounded-[4px] flex items-center justify-center shrink-0",
              med.status === "overdue" ? "bg-[#D92D20]" : "bg-[#F3F4FF]"
            )}>
               <Check className={cn(
                 "w-4 h-4",
                 med.status === "overdue" ? "text-white" : "text-[#A0AEC0]"
               )} strokeWidth={3} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
