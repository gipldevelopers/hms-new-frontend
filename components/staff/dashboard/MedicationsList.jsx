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
    <div className="bg-card p-5 rounded-lg border border-border shadow-none h-full flex flex-col">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h3 className="text-[16px] font-bold text-foreground uppercase tracking-wider">Medications Due</h3>
        <button className="text-[11px] font-bold text-primary hover:underline">VIEW ALL</button>
      </div>

      <div className="space-y-4 flex-1">
        {meds.map((med) => (
          <div
            key={med.id}
            className={cn(
              "flex items-center justify-between p-4 rounded-lg border transition-all cursor-pointer hover:bg-muted/30",
              med.status === "overdue"
                ? "bg-destructive/5 border-destructive/20"
                : "bg-card border-border"
            )}
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center shrink-0 border",
                med.status === "overdue"
                  ? "bg-destructive/10 border-destructive/20 text-destructive"
                  : "bg-primary/10 border-primary/20 text-primary"
              )}>
                <Pill className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[14px] font-bold text-foreground">{med.name}</p>
                <p className={cn(
                  "text-[12px] font-bold mt-0.5 tracking-wider",
                  med.status === "overdue" ? "text-destructive" : "text-muted-foreground"
                )}>
                  {med.detail}
                </p>
              </div>
            </div>
            <div className={cn(
              "w-7 h-7 rounded-[5px] flex items-center justify-center shrink-0 transition-colors",
              med.status === "overdue" ? "bg-destructive" : "bg-muted border border-border group-hover:bg-primary/10"
            )}>
              <Check className={cn(
                "w-4 h-4",
                med.status === "overdue" ? "text-destructive-foreground" : "text-muted-foreground"
              )} strokeWidth={3} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
