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

  return (
    <div className="p-3 w-[260px] bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
      <div className="flex justify-between items-center mb-4 px-1">
        <button 
          type="button"
          onClick={() => setCurrentMonth(new Date(year, month - 1))}
          className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-gray-400 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-[13px] font-bold text-[#1e293b] dark:text-white capitalize">{monthName}, {year}</span>
        <button 
          type="button"
          onClick={() => setCurrentMonth(new Date(year, month + 1))}
          className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-gray-400 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => (
          <span key={d} className="text-[10px] font-bold text-gray-400 text-center py-1">{d}</span>
        ))}
        {days.map((day, i) => (
          <div key={i} className="aspect-square flex items-center justify-center">
            {day ? (
              <button
                type="button"
                onClick={() => { onSelect(day); onClose?.(); }}
                className={cn(
                  "w-8 h-8 rounded-[5px] text-[12px] font-semibold transition-all hover:bg-primary/5 dark:hover:bg-primary/10",
                  isSameDay(day, selectedDate) ? "bg-primary text-white hover:bg-primary" : "text-[#1e293b] dark:text-gray-300",
                  isSameDay(day, new Date()) && !isSameDay(day, selectedDate) && "text-primary font-bold"
                )}
              >
                {day.getDate()}
              </button>
            ) : <span />}
          </div>
        ))}
      </div>
      
      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 dark:border-white/5 px-1">
        <button type="button" onClick={() => { onSelect(null); onClose?.(); }} className="text-[11px] font-bold text-gray-400 hover:text-red-500 transition-colors">Clear</button>
        <button type="button" onClick={() => { onSelect(new Date()); onClose?.(); }} className="text-[11px] font-bold text-primary transition-colors">Today</button>
      </div>
    </div>
  );
}
