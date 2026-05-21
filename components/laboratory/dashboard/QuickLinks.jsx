import React from "react";
import { CalendarHeart } from "lucide-react";

function QuickLink({ label }) {
  return (
    <div className="flex flex-col items-center justify-center p-2.5 border border-border/60 rounded-lg transition-all cursor-pointer bg-card hover:bg-muted/10 group">
      <div className="w-full h-[48px] bg-muted/30 dark:bg-muted/10 rounded-lg flex items-center justify-center mb-2.5 px-6">
        <CalendarHeart 
          className="w-[22px] h-[22px] text-foreground dark:text-primary group-hover:scale-110 transition-transform" 
          strokeWidth={1.5} 
        />
      </div>
      <span className="text-[12px] font-bold text-foreground text-center leading-tight">
        {label}
      </span>
    </div>
  );
}

export function QuickLinks() {
  const links = [
    "New Test Order",
    "Collect Sample",
    "Emergency Entry",
    "Enter Results",
    "Print Report",
  ];

  return (
    <div className="bg-card text-card-foreground rounded-lg border border-border overflow-hidden font-sans transition-all">
      <div className="px-5 py-3 border-b border-border">
        <h3 className="text-[15px] font-bold text-foreground">Quick Links</h3>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-[15px]">
          {links.map((link) => (
            <QuickLink key={link} label={link} />
          ))}
        </div>
      </div>
    </div>
  );
}
