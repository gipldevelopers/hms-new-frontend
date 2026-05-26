"use client";

import React from "react";
import { 
  ChevronDown, 
  Check, 
  X, 
  MessageSquare, 
  Calendar 
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function FormInput({ label, required, error, ...props }) {
  return (
    <div className="space-y-2 w-full">
      {label && (
        <label className="text-[13px] font-bold text-foreground flex items-center justify-between">
          <span>{label} {required && <span className="text-red-500">*</span>}</span>
          {error && <span className="text-[11px] text-red-500 font-medium animate-in fade-in slide-in-from-top-1">{error}</span>}
        </label>
      )}
      <input
        {...props}
        className={cn(
          "w-full h-11 px-4 bg-background border rounded-[5px] text-[13px] font-medium text-foreground outline-none transition-all shadow-none placeholder:text-muted-foreground/60",
          error ? "border-red-500 focus:border-red-600 bg-red-50/50" : "border-border focus:border-primary"
        )}
      />
    </div>
  );
}

export function FormSelect({ label, required, value, onChange, options, placeholder, error }) {
  const selected = options.find((o) => o.value === value);
  return (
    <div className="space-y-2 w-full">
      {label && (
        <label className="text-[13px] font-bold text-foreground flex items-center justify-between">
          <span>{label} {required && <span className="text-red-500">*</span>}</span>
          {error && <span className="text-[11px] text-red-500 font-medium animate-in fade-in slide-in-from-top-1">{error}</span>}
        </label>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className={cn(
            "w-full h-11 px-4 bg-background border rounded-[5px] text-[13px] font-medium text-foreground outline-none transition-all flex items-center justify-between shadow-none text-left",
            error ? "border-red-500 focus:border-red-600 bg-red-50/50" : "border-border focus:border-primary"
          )}>
            <span className={cn(!selected && "text-muted-foreground/60")}>
              {selected ? selected.label : placeholder}
            </span>
            <ChevronDown className="w-4 h-4 text-muted-foreground/60" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-[var(--radix-dropdown-menu-trigger-width)] border-border z-[600] p-1 bg-card rounded-[5px] shadow-xl"
        >
          {options.map((opt) => (
            <DropdownMenuItem
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={cn(
                "text-[13px] font-medium h-10 px-3 cursor-pointer focus:bg-primary/5 rounded-[3px]",
                value === opt.value && "bg-primary/5 text-primary font-bold",
              )}
            >
              {opt.label}
              {value === opt.value && <Check className="w-4 h-4 ml-auto" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function SuccessModal({ isOpen, onClose, uhid, onBookAppointment }) {
  React.useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white dark:bg-[#111827] w-full max-w-[480px] rounded-[5px] border border-border overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 hover:bg-muted rounded-full transition-colors text-muted-foreground"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-10 flex flex-col items-center text-center space-y-6">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-[#00A389] rounded-full flex items-center justify-center">
            <Check className="w-8 h-8 text-white stroke-[3]" />
          </div>

          <div className="space-y-2">
            <h2 className="text-[20px] font-bold text-foreground">
              Registration Successful!
            </h2>
            <p className="text-[13px] text-muted-foreground max-w-[280px] mx-auto">
              Patient has been registered successfully. Generated UHID:
            </p>
          </div>

          {/* UHID Box */}
          <div className="w-full bg-[#F1F5F9] dark:bg-white/5 py-3 rounded-[5px] flex items-center justify-center">
            <span className="text-[16px] font-bold text-foreground tracking-wide">
              {uhid}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 w-full pt-2">
            <button className="flex items-center justify-center gap-2 h-11 border border-border bg-white rounded-[5px] text-[13px] font-bold text-foreground hover:bg-muted transition-all shadow-none">
              <MessageSquare className="w-4 h-4" />
              Send SMS
            </button>
            <button
              onClick={onBookAppointment}
              className="flex items-center justify-center gap-2 h-11 bg-[#3B4CB8] text-white rounded-[5px] text-[13px] font-bold hover:opacity-90 transition-all shadow-none"
            >
              <Calendar className="w-4 h-4" />
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
