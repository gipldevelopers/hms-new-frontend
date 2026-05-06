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
    badgeClass: "bg-[#2D3A8C] text-white",
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
    badgeClass: "bg-[#F1F2F4] dark:bg-white/5 text-[#5E6C84]",
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
    badgeClass: "bg-[#F1F2F4] dark:bg-white/5 text-[#5E6C84]",
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
    <div className="p-[20px] bg-[#F8F9FC] dark:bg-[#0A0F1D] min-h-screen flex flex-col space-y-[20px] transition-colors duration-300 font-sans pb-20">
      
      {/* ── Header Area ── */}
      <div className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 p-4 rounded-[5px] flex flex-col sm:flex-row justify-between items-center gap-4 shadow-none">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-[5px] border border-[#E7E8EB] dark:border-white/10 bg-white dark:bg-[#1e293b] hover:bg-gray-50 transition-all shadow-none"
          >
            <ArrowLeft className="w-5 h-5 text-[#5E6C84]" />
          </button>
          <div className="flex flex-col">
             <div className="flex items-center gap-2 text-[12px] font-medium text-[#5E6C84]">
               <span>Robert Chen</span>
               <span>/</span>
               <span>Notes</span>
             </div>
             <h1 className="text-[18px] font-bold text-[#1A1C23] dark:text-white leading-none mt-1">Note Version History</h1>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none h-10 px-4 bg-white dark:bg-[#101935] border border-[#2D3A8C] rounded-[5px] text-[13px] font-bold text-[#2D3A8C] dark:text-primary-foreground flex items-center justify-center gap-2 hover:bg-gray-50 transition-all shadow-none">
            <Printer className="w-4 h-4" />
            Print History
          </button>
        </div>
      </div>

      {/* ── Audit Trail Section ── */}
      <div className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 p-8 rounded-[5px] shadow-none">
        <h2 className="text-[16px] font-bold text-[#1A1C23] dark:text-white mb-8">Progress Note - Audit Trail</h2>
        
        <div className="relative space-y-8">
          {/* Vertical Line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-[#E7E8EB] dark:bg-white/10" />

          {NOTE_HISTORY.map((ver) => (
            <div key={ver.id} className="relative pl-10">
              {/* Timeline Dot */}
              <div className={cn(
                "absolute left-0 top-3 w-4 h-4 rounded-full border-2 border-white dark:border-[#101935] z-10",
                ver.current ? "bg-[#2D3A8C]" : "bg-[#5E6C84]"
              )} />

              {/* Version Card */}
              <div className={cn(
                "p-6 rounded-[5px] border transition-all",
                ver.current 
                  ? "bg-white dark:bg-[#101935] border-[#2D3A8C]" 
                  : "bg-white dark:bg-[#101935] border-[#E7E8EB] dark:border-white/10"
              )}>
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-bold text-[#1A1C23] dark:text-white">
                        {ver.version} {ver.tag}
                      </span>
                      <span className={cn("px-2 py-0.5 text-[9px] font-bold rounded-[3px] tracking-wider", ver.badgeClass)}>
                        {ver.badge}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[12px] font-medium text-[#5E6C84] dark:text-slate-500">
                      <Calendar className="w-3.5 h-3.5" />
                      {ver.date}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] font-bold text-[#1A1C23] dark:text-white">{ver.author}</p>
                    <p className="text-[11px] font-medium text-[#5E6C84] dark:text-slate-500">{ver.role}</p>
                  </div>
                </div>

                <div className="border-t border-[#E7E8EB] dark:border-white/10 pt-4">
                  <p className="text-[13px] text-[#5E6C84] dark:text-slate-400 leading-relaxed font-medium">
                    {ver.content}
                  </p>
                </div>

                {ver.hasChanges && (
                  <button className="mt-6 flex items-center gap-2 text-[12px] font-bold text-[#5E6C84] hover:text-[#2D3A8C] transition-all">
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
