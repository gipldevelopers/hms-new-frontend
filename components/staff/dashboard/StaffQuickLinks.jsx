"use client";

import React from "react";
import { 
  PlusCircle, 
  Pill, 
  ClipboardList, 
  UserPlus, 
  ArrowRightLeft,
  Activity,
  FilePlus
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { id: 1, label: "Add Vitals", icon: ClipboardList },
  { id: 2, label: "Administer Med", icon: Pill },
  { id: 3, label: "Add Task", icon: FilePlus },
  { id: 4, label: "New Admission", icon: UserPlus },
  { id: 5, label: "Transfer Patient", icon: ArrowRightLeft },
];

function QuickLinkItem({ label, icon: Icon }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 border border-border rounded-lg transition-all cursor-pointer bg-card hover:bg-muted group h-full shadow-none">
      <div className="w-full h-[64px] bg-muted rounded-lg flex items-center justify-center mb-4">
        <Icon 
          className="w-6 h-6 text-foreground group-hover:scale-110 transition-transform" 
          strokeWidth={2} 
        />
      </div>
      <span className="text-[13px] font-bold text-foreground text-center leading-tight">
        {label}
      </span>
    </div>
  );
}

export default function StaffQuickLinks() {
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden font-sans transition-all h-full flex flex-col shadow-none">
      {/* Header section */}
      <div className="px-6 py-5 border-b border-border shrink-0">
        <h3 className="text-[16px] font-bold text-foreground uppercase tracking-wider">Quick Links</h3>
      </div>

      {/* Grid Container */}
      <div className="p-6 flex-1">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 h-full">
          {links.map((link) => (
            <QuickLinkItem key={link.id} label={link.label} icon={link.icon} />
          ))}
        </div>
      </div>
    </div>
  );
}
