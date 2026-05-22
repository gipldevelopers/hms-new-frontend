"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const CustomDropdownItem = ({ children, active, onSelect }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (active && ref.current) {
      const timer = setTimeout(() => {
        ref.current?.scrollIntoView({ block: "center", behavior: "instant" });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [active]);

  return (
    <button
      ref={ref}
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onClick={onSelect}
      className={cn(
        "w-full text-left text-[12px] font-bold py-1.5 px-3 rounded-[5px] hover:bg-muted text-foreground transition-colors outline-none",
        active && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground"
      )}
    >
      {children}
    </button>
  );
};

export function CustomCalendar({ selectedDate, onSelect, onClose, mode = "date" }) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  const monthMenuRef = useRef(null);
  const yearMenuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (showMonthDropdown && monthMenuRef.current && !monthMenuRef.current.contains(e.target)) {
        setShowMonthDropdown(false);
      }
      if (showYearDropdown && yearMenuRef.current && !yearMenuRef.current.contains(e.target)) {
        setShowYearDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showMonthDropdown, showYearDropdown]);

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

  const shortMonths = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 201 }, (_, i) => currentYear - 100 + i);

  const handlePrev = () => {
    if (mode === "month-year") {
      setCurrentMonth(new Date(year - 1, month));
    } else {
      setCurrentMonth(new Date(year, month - 1));
    }
  };

  const handleNext = () => {
    if (mode === "month-year") {
      setCurrentMonth(new Date(year + 1, month));
    } else {
      setCurrentMonth(new Date(year, month + 1));
    }
  };

  return (
    <div className="relative p-4 w-[290px] bg-white dark:bg-[#1e293b] border border-border rounded-[5px] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
      <div className="flex justify-between items-center mb-4 px-1">
        <button
          type="button"
          onClick={handlePrev}
          className="p-2 hover:bg-muted rounded-full text-muted-foreground transition-all active:scale-95 animate-none"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1 relative">
          {mode !== "month-year" && (
            <>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMonthDropdown(!showMonthDropdown);
                  setShowYearDropdown(false);
                }}
                className="flex items-center gap-0.5 bg-transparent text-[13px] font-bold text-foreground outline-none cursor-pointer hover:text-primary transition-colors px-1"
              >
                {months[month]}
                <ChevronDown className="w-3 h-3 text-muted-foreground opacity-60" />
              </button>
              <span className="text-[13px] font-bold text-muted-foreground/60">,</span>
            </>
          )}

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.stopPropagation();
              setShowYearDropdown(!showYearDropdown);
              setShowMonthDropdown(false);
            }}
            className="flex items-center gap-0.5 bg-transparent text-[13px] font-bold text-foreground outline-none cursor-pointer hover:text-primary transition-colors px-1"
          >
            {year}
            <ChevronDown className="w-3 h-3 text-muted-foreground opacity-60" />
          </button>

          {showMonthDropdown && (
            <div
              ref={monthMenuRef}
              className="absolute left-0 top-[100%] mt-1 z-50 w-[120px] max-h-[200px] overflow-y-auto bg-white dark:bg-[#1e293b] border border-border rounded-[5px] shadow-lg py-1 no-scrollbar animate-in fade-in slide-in-from-top-1 duration-150"
            >
              {months.map((m, i) => (
                <CustomDropdownItem
                  key={m}
                  active={i === month}
                  onSelect={(e) => {
                    e.stopPropagation();
                    setCurrentMonth(new Date(year, i));
                    setShowMonthDropdown(false);
                  }}
                >
                  {m}
                </CustomDropdownItem>
              ))}
            </div>
          )}

          {showYearDropdown && (
            <div
              ref={yearMenuRef}
              className="absolute right-0 top-[100%] mt-1 z-50 w-[95px] max-h-[200px] overflow-y-auto bg-white dark:bg-[#1e293b] border border-border rounded-[5px] shadow-lg py-1 no-scrollbar animate-in fade-in slide-in-from-top-1 duration-150"
            >
              {years.map((y) => (
                <CustomDropdownItem
                  key={y}
                  active={y === year}
                  onSelect={(e) => {
                    e.stopPropagation();
                    setCurrentMonth(new Date(y, month));
                    setShowYearDropdown(false);
                  }}
                >
                  {y}
                </CustomDropdownItem>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleNext}
          className="p-2 hover:bg-muted rounded-full text-muted-foreground transition-all active:scale-95 animate-none"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {mode === "month-year" ? (
        <div className="grid grid-cols-3 gap-2 mb-2 pt-2">
          {shortMonths.map((m, idx) => {
            const isSelected = selectedDate && selectedDate.getFullYear() === year && selectedDate.getMonth() === idx;
            const isCurrentMonth = new Date().getFullYear() === year && new Date().getMonth() === idx;
            return (
              <button
                key={m}
                type="button"
                onClick={() => {
                  onSelect(new Date(year, idx, 1));
                  onClose?.();
                }}
                className={cn(
                  "h-10 rounded-[5px] text-[12px] font-bold transition-all active:scale-95",
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground hover:bg-primary/10 hover:text-primary bg-muted/20 border border-border/30",
                  isCurrentMonth && !isSelected && "text-primary font-bold border border-primary/20 bg-primary/5"
                )}
              >
                {m}
              </button>
            );
          })}
        </div>
      ) : (
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
      )}

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
          onClick={() => {
            const today = new Date();
            onSelect(mode === "month-year" ? new Date(today.getFullYear(), today.getMonth(), 1) : today);
            onClose?.();
          }}
          className="flex-1 py-2 text-[11px] font-bold bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-[5px] transition-all uppercase tracking-tight"
        >
          Today
        </button>
      </div>
    </div>
  );
}
