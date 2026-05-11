"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function CustomCalendar({ selectedDate, onSelect, onClose }) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());
  
  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
  
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const monthName = currentMonth.toLocaleString('default', { month: 'long' });
  
  const days = [];
  const startDay = firstDayOfMonth(year, month);
  const totalDays = daysInMonth(year, month);
  
  // Padding for start of month
  for (let i = 0; i < (startDay === 0 ? 6 : startDay - 1); i++) {
    days.push(null);
  }
  
  for (let i = 1; i <= totalDays; i++) {
    days.push(new Date(year, month, i));
  }
  
  const isSameDay = (d1, d2) => {
    if (!d1 || !d2) return false;
    return d1.getFullYear() === d2.getFullYear() && 
           d1.getMonth() === d2.getMonth() && 
           d1.getDate() === d2.getDate();
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 201 }, (_, i) => currentYear - 100 + i);

  return (
    <div className="p-4 w-[290px] bg-white dark:bg-[#1e293b] border border-border rounded-[5px] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
      <div className="flex justify-between items-center mb-4 px-1">
        <button 
          type="button"
          onClick={() => setCurrentMonth(new Date(year, month - 1))}
          className="p-2 hover:bg-muted rounded-full text-muted-foreground transition-all active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        <div className="flex items-center gap-1">
          <select 
            value={month} 
            onChange={(e) => setCurrentMonth(new Date(year, parseInt(e.target.value)))}
            className="bg-transparent text-[13px] font-bold text-foreground outline-none cursor-pointer hover:text-primary transition-colors appearance-none px-1"
          >
            {months.map((m, i) => (
              <option key={m} value={i} className="bg-white dark:bg-[#1e293b] text-foreground">{m}</option>
            ))}
          </select>
          <span className="text-[13px] font-bold text-muted-foreground">,</span>
          <select 
            value={year} 
            onChange={(e) => setCurrentMonth(new Date(parseInt(e.target.value), month))}
            className="bg-transparent text-[13px] font-bold text-foreground outline-none cursor-pointer hover:text-primary transition-colors appearance-none px-1"
          >
            {years.map(y => (
              <option key={y} value={y} className="bg-white dark:bg-[#1e293b] text-foreground">{y}</option>
            ))}
          </select>
        </div>

        <button 
          type="button"
          onClick={() => setCurrentMonth(new Date(year, month + 1))}
          className="p-2 hover:bg-muted rounded-full text-muted-foreground transition-all active:scale-95"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => (
          <span key={d} className="text-[10px] font-bold text-muted-foreground/60 text-center py-1 uppercase tracking-wider">{d}</span>
        ))}
        {days.map((day, i) => (
          <div key={i} className="aspect-square flex items-center justify-center">
            {day ? (
              <button
                type="button"
                onClick={() => { onSelect(day); onClose?.(); }}
                className={cn(
                  "w-8 h-8 rounded-[5px] text-[12px] font-semibold transition-all active:scale-90",
                  isSameDay(day, selectedDate) 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-foreground hover:bg-primary/10 hover:text-primary",
                  isSameDay(day, new Date()) && !isSameDay(day, selectedDate) && "text-primary font-bold border border-primary/20"
                )}
              >
                {day.getDate()}
              </button>
            ) : <span />}
          </div>
        ))}
      </div>
      
      <div className="flex justify-between items-center mt-3 pt-4 border-t border-border px-1 gap-3">
        <button 
          type="button" 
          onClick={() => { onSelect(null); onClose?.(); }} 
          className="flex-1 py-2 text-[11px] font-bold text-muted-foreground hover:text-foreground hover:bg-muted rounded-[5px] transition-all uppercase tracking-tight"
        >
          Clear
        </button>
        <button 
          type="button" 
          onClick={() => { onSelect(new Date()); onClose?.(); }} 
          className="flex-1 py-2 text-[11px] font-bold bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-[5px] transition-all uppercase tracking-tight"
        >
          Today
        </button>
      </div>
    </div>
  );
}
