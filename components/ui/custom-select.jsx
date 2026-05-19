"use client";

import React from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder,
  minWidth = "140px",
  icon: Icon,
  showAllOption = true,
  className,
  align = "end"
}) {
  const selected = options.find((o) => o.value === value);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "h-10 px-3 bg-card border border-border rounded-lg text-[13px] font-medium text-foreground flex items-center gap-2 hover:bg-muted transition-all outline-none w-full sm:w-auto shadow-none",
            className
          )}
          style={minWidth ? { minWidth } : undefined}
        >
          {Icon && <Icon className="w-4 h-4 text-muted-foreground shrink-0" />}
          <span className="truncate flex-1 text-left font-medium">
            {selected ? selected.label : placeholder}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        className="min-w-[140px] w-[var(--radix-dropdown-menu-trigger-width)] border border-border bg-card rounded-lg p-1 z-[500] shadow-none"
      >
        {showAllOption && (
          <DropdownMenuItem
            onClick={() => onChange("")}
            className={cn(
              "rounded-lg text-[13px] font-medium px-3 py-2 cursor-pointer",
              !value ? "bg-accent text-accent-foreground font-semibold" : "text-foreground hover:bg-muted"
            )}
          >
            All
          </DropdownMenuItem>
        )}
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-lg text-[13px] font-medium px-3 py-2 cursor-pointer flex items-center justify-between",
              value === opt.value ? "bg-accent text-accent-foreground font-semibold" : "text-foreground hover:bg-muted"
            )}
          >
            {opt.label}
            {value === opt.value && <Check className="w-3.5 h-3.5 text-foreground" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
