"use client";
import React, { useState } from "react";
import { ChevronDown, AlertCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ClinicalInformation({ priority, setPriority }) {
  const [doctor, setDoctor] = useState("Dr. Sarah Smith (Cardiology)");
  const [department, setDepartment] = useState("Emergency");

  return (
    <div className="bg-card text-card-foreground p-5 rounded-lg border border-border space-y-4 shadow-none">
      <h2 className="text-[15px] font-bold text-foreground">Clinical Information</h2>

      {/* Doctor & Dept inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-tight">Referring Doctor</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full h-11 px-4 bg-background border border-border rounded-lg text-[13px] font-bold text-foreground flex items-center justify-between hover:bg-muted/50 transition-all outline-none group data-[state=open]:border-primary shadow-none cursor-pointer">
                <span className="truncate text-left">{doctor}</span>
                <ChevronDown size={14} className="text-muted-foreground transition-transform group-data-[state=open]:rotate-180 shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[300px] p-1 border-border rounded-lg shadow-none bg-card">
              {["Dr. Sarah Smith (Cardiology)", "Dr. Michael (General)", "Dr. John Doe (Internal)"].map((opt) => (
                <DropdownMenuItem
                  key={opt}
                  onClick={() => setDoctor(opt)}
                  className="font-bold text-[13px] h-10 px-3 rounded-lg cursor-pointer focus:bg-primary/5 focus:text-primary"
                >
                  {opt}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-tight">Department</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full h-11 px-4 bg-background border border-border rounded-lg text-[13px] font-bold text-foreground flex items-center justify-between hover:bg-muted/50 transition-all outline-none group data-[state=open]:border-primary shadow-none cursor-pointer">
                <span className="truncate text-left">{department}</span>
                <ChevronDown size={14} className="text-muted-foreground transition-transform group-data-[state=open]:rotate-180 shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[300px] p-1 border-border rounded-lg shadow-none bg-card">
              {["Emergency", "Cardiology", "Endocrinology", "Outpatient"].map((opt) => (
                <DropdownMenuItem
                  key={opt}
                  onClick={() => setDepartment(opt)}
                  className="font-bold text-[13px] h-10 px-3 rounded-lg cursor-pointer focus:bg-primary/5 focus:text-primary"
                >
                  {opt}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Priority Field */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-tight">Priority</label>
        <div className="grid grid-cols-3 gap-3">
          {/* Routine */}
          <button
            onClick={() => setPriority("Routine")}
            className={`h-11 rounded-lg border text-[13px] font-bold transition-all cursor-pointer flex items-center justify-center ${
              priority === "Routine"
                ? "bg-primary/5 border-primary text-primary"
                : "bg-background border-border text-foreground hover:bg-muted/50"
            }`}
          >
            Routine
          </button>

          {/* High */}
          <button
            onClick={() => setPriority("High")}
            className={`h-11 rounded-lg border text-[13px] font-bold transition-all cursor-pointer flex items-center justify-center ${
              priority === "High"
                ? "bg-amber-500/10 border-amber-500 text-amber-600"
                : "bg-background border-border text-foreground hover:bg-muted/50"
            }`}
          >
            High
          </button>

          {/* Urgent */}
          <button
            onClick={() => setPriority("Urgent")}
            className={`h-11 rounded-lg border text-[13px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              priority === "Urgent"
                ? "bg-rose-500/10 border-rose-500 text-rose-600"
                : "bg-background border-border text-foreground hover:bg-muted/50"
            }`}
          >
            <AlertCircle size={14} className={priority === "Urgent" ? "text-rose-600" : "text-muted-foreground"} />
            Urgent
          </button>
        </div>
      </div>
    </div>
  );
}
