"use client";

import React from "react";
import { 
  LogIn, 
  LogOut,
  RotateCcw
} from "lucide-react";
import { cn } from "@/lib/utils";

const requests = [
  { id: 1, category: "Housekeeping", task: "Bed 106 Sanitization", time: "2 mins ago" },
  { id: 2, category: "Maintenance", task: "AC Repair Ward 4B", time: "15 mins ago" },
];

export default function AdmissionDischarge() {
  return (
    <div className="bg-card p-5 rounded-lg border border-border shadow-none">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[16px] font-bold text-foreground uppercase tracking-wider">Admission & Discharge</h3>
        <RotateCcw className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary transition-all" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Admissions Card */}
        <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-lg flex justify-between items-start">
           <div className="space-y-1">
              <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">ADMISSIONS</p>
              <p className="text-[24px] font-bold text-emerald-600 dark:text-emerald-400 leading-none">03</p>
              <p className="text-[10px] font-medium text-emerald-600/80 dark:text-emerald-400/80">Next ETA: 10:45 AM (ER Transfer)</p>
           </div>
           <LogIn className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>

        {/* Discharges Card */}
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg flex justify-between items-start">
           <div className="space-y-1">
              <p className="text-[10px] font-bold text-primary tracking-wider">DISCHARGES</p>
              <p className="text-[24px] font-bold text-primary leading-none">05</p>
              <p className="text-[10px] font-medium text-primary/80">2 Ready | 3 Pending Clearance</p>
           </div>
           <LogOut className="w-5 h-5 text-primary" />
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-[10px] font-bold text-muted-foreground tracking-wider">RECENT REQUESTS</h4>
        <div className="space-y-2">
          {requests.map((request) => (
            <div key={request.id} className="flex items-center justify-between p-3 border border-border rounded-lg bg-card hover:bg-muted/50 transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  request.category === "Housekeeping" ? "bg-emerald-500" : "bg-amber-500"
                )} />
                <p className="text-[13px] font-bold text-foreground">
                  {request.category}: <span className="font-medium text-muted-foreground">{request.task}</span>
                </p>
              </div>
              <span className="text-[11px] font-medium text-muted-foreground">{request.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
