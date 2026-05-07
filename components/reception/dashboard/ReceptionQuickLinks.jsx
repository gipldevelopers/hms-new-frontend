"use client";

import React from "react";
import { UserPlus, CalendarDays, Siren, Wallet, Printer } from "lucide-react";

const quickLinks = [
  { name: "New Patient", icon: UserPlus },
  { name: "Book Appointment", icon: CalendarDays },
  { name: "Emergency Entry", icon: Siren },
  { name: "Collect Payment", icon: Wallet },
  { name: "Print Receipt", icon: Printer },
];

export default function ReceptionQuickLinks() {
  return (
    <div className="bg-card border border-border rounded-lg shadow-none overflow-visible">
      {/* Header */}
      <div className="px-5 md:px-6 py-4 border-b border-border/60">
        <h2 className="text-[15px] font-bold text-foreground">Quick Links</h2>
      </div>
      
      {/* Grid Content */}
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {quickLinks.map((link, i) => (
            <button 
              key={i} 
              className="flex flex-col items-center gap-2 md:gap-3 p-3 md:p-4 bg-white dark:bg-transparent border border-border rounded-lg hover:border-primary/30 transition-all group shadow-none min-h-[100px] md:min-h-[120px]"
            >
              <div className="w-full h-10 md:h-14 rounded-lg bg-muted/50 dark:bg-white/5 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-all shrink-0">
                <link.icon className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <span className="text-[11px] md:text-[12px] font-bold text-foreground text-center leading-tight">
                {link.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
