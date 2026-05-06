"use client";

import React from "react";
import { 
  ArrowLeft, 
  Printer, 
  Calendar,
  History,
  CornerDownRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

const NOTE_HISTORY = [
  {
    id: 3,
    version: "v3",
    tag: "(Current)",
    badge: "LATEST",
    badgeClass: "bg-primary text-primary-foreground",
    date: "Today, 09:45 AM",
    author: "Dr. Sarah Well",
    role: "Attending",
    content: "Patient is responding well to IV antibiotics. Fever has subsided. Chest X-ray scheduled for tomorrow morning. Plan: Continue current antibiotic regimen. Monitor vitals every 4 hours. Encourage oral fluid intake.",
    current: true,
    hasChanges: true
  },
  {
    id: 2,
    version: "v2",
    tag: "",
    badge: "EDITED",
    badgeClass: "bg-muted text-muted-foreground",
    date: "Today, 09:35 AM",
    author: "Dr. Sarah Well",
    role: "Attending",
    content: "Patient is responding well to IV antibiotics. Fever has subsided. Chest X-ray scheduled for tomorrow morning. Plan: Continue current antibiotic regimen.",
    current: false,
    hasChanges: true
  },
  {
    id: 1,
    version: "v1",
    tag: "",
    badge: "ORIGINAL",
    badgeClass: "bg-muted text-muted-foreground",
    date: "Today, 09:30 AM",
    author: "Dr. Sarah Well",
    role: "Attending",
    content: "Patient is responding well to IV antibiotics. Fever has subsided. Plan: Continue current antibiotic regimen.",
    current: false,
    hasChanges: false
  }
];

export default function NoteHistoryPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id;

  return (
    <div className="p-5 bg-background min-h-screen flex flex-col gap-5 transition-colors duration-300 font-sans pb-20">
      
      {/* ── Header Area ── */}
      <div className="bg-card border border-border p-4 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4 shadow-none">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-border bg-card hover:bg-muted transition-all shadow-none"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="flex flex-col">
             <div className="flex items-center gap-2 text-[12px] font-medium text-muted-foreground">
               <span>Robert Chen</span>
               <span>/</span>
               <span>Notes</span>
             </div>
             <h1 className="text-[18px] font-bold text-foreground leading-none mt-1">Note Version History</h1>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none h-10 px-4 bg-card border border-primary rounded-lg text-[13px] font-bold text-primary flex items-center justify-center gap-2 hover:bg-muted transition-all shadow-none">
            <Printer className="w-4 h-4" />
            Print History
          </button>
        </div>
      </div>

      {/* ── Audit Trail Section ── */}
      <div className="bg-card border border-border p-8 rounded-lg shadow-none">
        <h2 className="text-[16px] font-bold text-foreground mb-8">Progress Note - Audit Trail</h2>
        
        <div className="relative space-y-8">
          {/* Vertical Line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-border" />

          {NOTE_HISTORY.map((ver) => (
            <div key={ver.id} className="relative pl-10">
              {/* Timeline Dot */}
              <div className={cn(
                "absolute left-0 top-3 w-4 h-4 rounded-full border-2 border-card z-10",
                ver.current ? "bg-primary" : "bg-muted-foreground"
              )} />

              {/* Version Card */}
              <div className={cn(
                "p-6 rounded-lg border transition-all",
                ver.current 
                  ? "bg-card border-primary" 
                  : "bg-card border-border"
              )}>
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-bold text-foreground">
                        {ver.version} {ver.tag}
                      </span>
                      <span className={cn("px-2 py-0.5 text-[9px] font-bold rounded-[3px] tracking-wider", ver.badgeClass)}>
                        {ver.badge}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[12px] font-medium text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />
                      {ver.date}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] font-bold text-foreground">{ver.author}</p>
                    <p className="text-[11px] font-medium text-muted-foreground">{ver.role}</p>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <p className="text-[13px] text-muted-foreground leading-relaxed font-medium">
                    {ver.content}
                  </p>
                </div>

                {ver.hasChanges && (
                  <button className="mt-6 flex items-center gap-2 text-[12px] font-bold text-muted-foreground hover:text-primary transition-all">
                    <CornerDownRight className="w-3.5 h-3.5" />
                    View changes from previous version
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
