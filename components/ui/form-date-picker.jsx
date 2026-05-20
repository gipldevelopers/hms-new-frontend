"use client";

import React, { useState, useEffect, useRef } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CustomCalendar } from "./custom-calendar";

export function FormDatePicker({ label, required, value, onChange, placeholder, className, variant = "default", error, align = "bottom", mode = "date" }) {
  const [inputValue, setInputValue] = useState(
    value ? format(new Date(value), mode === "month-year" ? "MM/yyyy" : "dd/MM/yyyy") : ""
  );
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (value) {
      setInputValue(format(new Date(value), mode === "month-year" ? "MM/yyyy" : "dd/MM/yyyy"));
    } else {
      setInputValue("");
    }
  }, [value, mode]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && containerRef.current.contains(event.target)) {
        return;
      }
      // Don't close if clicking inside a dropdown list (radix portal)
      if (event.target.closest && (
        event.target.closest('[role="menu"]') || 
        event.target.closest('[data-radix-popper-content-wrapper]')
      )) {
        return;
      }
      setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    let val = e.target.value.replace(/\D/g, ""); // Remove non-digits
    
    if (mode === "month-year") {
      if (val.length > 6) val = val.slice(0, 6);
      
      let formattedVal = "";
      if (val.length > 0) {
        formattedVal = val.slice(0, 2);
        if (val.length > 2) {
          formattedVal += "/" + val.slice(2, 6);
        }
      }
      setInputValue(formattedVal);
      
      if (val.length === 6) {
        const month = parseInt(val.slice(0, 2)) - 1;
        const year = parseInt(val.slice(2, 6));
        if (month >= 0 && month <= 11 && year >= 1000 && year <= 9999) {
          const date = new Date(year, month, 1);
          onChange(date);
        }
      }
    } else {
      if (val.length > 8) val = val.slice(0, 8);
      
      let formattedVal = "";
      if (val.length > 0) {
        formattedVal = val.slice(0, 2);
        if (val.length > 2) {
          formattedVal += "/" + val.slice(2, 4);
          if (val.length > 4) {
            formattedVal += "/" + val.slice(4, 8);
          }
        }
      }
      
      setInputValue(formattedVal);
      
      if (val.length === 8) {
        const day = parseInt(val.slice(0, 2));
        const month = parseInt(val.slice(2, 4)) - 1;
        const year = parseInt(val.slice(4, 8));
        const date = new Date(year, month, day);
        
        if (!isNaN(date.getTime()) && date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
          onChange(date);
        }
      }
    }
  };

  return (
    <div className={cn("space-y-2 relative w-full", className)} ref={containerRef}>
      {label && (
        <label className="text-[13px] font-bold text-foreground flex items-center justify-between">
          <span>{label} {required && <span className="text-red-500">*</span>}</span>
          {error && <span className="text-[11px] text-red-500 font-medium animate-in fade-in slide-in-from-top-1">{error}</span>}
        </label>
      )}
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder || (mode === "month-year" ? "MM/YYYY" : "DD/MM/YYYY")}
          className={cn(
            "w-full h-12 pl-11 pr-4 border rounded-[5px] text-[13px] font-bold text-foreground outline-none transition-all shadow-none placeholder:text-muted-foreground/60",
            error ? "border-red-500 focus:border-red-600 bg-red-50/50" : "border-border focus:border-primary",
            variant === "muted" ? "bg-muted/50" : "bg-background"
          )}
        />
        <div 
          className="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <CalendarIcon className="w-4 h-4 text-primary" />
        </div>
      </div>

      {isOpen && (
        <>
          {/* Mobile: Modal Style */}
          <div className="md:hidden fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setIsOpen(false)} />
            <div className="relative animate-in zoom-in-95 duration-200">
              <CustomCalendar
                selectedDate={value ? new Date(value) : null}
                mode={mode}
                onSelect={(date) => {
                  onChange(date);
                  if (date) setInputValue(format(date, mode === "month-year" ? "MM/yyyy" : "dd/MM/yyyy"));
                  setIsOpen(false);
                }}
                onClose={() => setIsOpen(false)}
              />
            </div>
          </div>

          {/* Desktop: Dropdown Style */}
          <div className={cn(
            "hidden md:block absolute z-[100] animate-in fade-in zoom-in-95 duration-200",
            align === "top" ? "bottom-[calc(100%+5px)] left-0" : "top-[calc(100%+5px)] left-0"
          )}>
            <CustomCalendar
              selectedDate={value ? new Date(value) : null}
              mode={mode}
              onSelect={(date) => {
                onChange(date);
                if (date) setInputValue(format(date, mode === "month-year" ? "MM/yyyy" : "dd/MM/yyyy"));
                setIsOpen(false);
              }}
              onClose={() => setIsOpen(false)}
            />
          </div>
        </>
      )}
    </div>
  );
}
