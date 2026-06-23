"use client";

import React from "react";
import Link from "next/link";
import { ClipboardCheck, Calendar, FileText, Plus, Stethoscope } from "lucide-react";

const quickLinks = [
  { name: "Patient Chart", icon: ClipboardCheck, path: "/doctor/ipd" },
  { name: "My Schedule", icon: Calendar, path: "/doctor/schedule" },
  { name: "View Report", icon: FileText, path: "/doctor/reports" },
  { name: "Discharge Request", icon: Plus, path: "/doctor/discharge" },
  { name: "Consultation", icon: Stethoscope, path: "/doctor/opd" },
];

export default function QuickLinks() {
  return (
    <div className="bg-card border border-border rounded-lg shadow-none overflow-hidden">
      {/* Header */}
      <div className="px-5 md:px-6 py-4 border-b border-border/60">
        <h2 className="text-[15px] font-bold text-[#1e293b] dark:text-foreground">Quick Links</h2>
      </div>
      
      {/* Grid Content */}
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {quickLinks.map((link, i) => (
            <Link 
              key={i} 
              href={link.path}
              className="flex flex-col items-center gap-2 md:gap-3 p-3 md:p-4 bg-white dark:bg-transparent border border-border rounded-lg hover:border-primary/30 transition-all group shadow-none"
            >
              <div className="w-full h-12 md:h-16 rounded-lg bg-muted/50 dark:bg-white/5 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-all">
                <link.icon className="w-5 h-5 md:w-7 md:h-7" />
              </div>
              <span className="text-[11px] md:text-[12px] font-bold text-foreground text-center line-clamp-1">
                {link.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
