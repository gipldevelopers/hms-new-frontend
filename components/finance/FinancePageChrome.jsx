"use client";

import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function FinancePageShell({ children, className }) {
  return (
    <div
      className={cn(
        "min-h-screen bg-[#F8F9FC] p-4 sm:p-6 font-sans text-[#1e293b] dark:bg-[#0A0F1D] dark:text-white transition-colors duration-300",
        className
      )}
    >
      <div className="mx-auto flex max-w-[1720px] flex-col gap-5">{children}</div>
    </div>
  );
}

export function FinanceHeader({ title, description, actions, className }) {
  return (
    <div className={cn("flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between", className)}>
      <div>
        <h1 className="text-[20px] font-bold leading-none tracking-tight text-[#1e293b] dark:text-white">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 text-[12px] font-medium text-[#64748B] dark:text-slate-500">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">{actions}</div>
      ) : null}
    </div>
  );
}

export function FinanceStatCard({ title, value, icon: Icon, color = "blue", meta }) {
  const iconStyles = {
    blue: "bg-primary/10 text-primary",
    emerald: "bg-emerald-500/10 text-emerald-500",
    amber: "bg-amber-500/10 text-amber-500",
    rose: "bg-rose-500/10 text-rose-500",
    indigo: "bg-indigo-500/10 text-indigo-500",
    slate: "bg-slate-500/10 text-slate-500",
  };

  return (
    <div className="flex w-full items-center gap-4 rounded-[5px] border border-[#E7E8EB] bg-white p-5 transition-all dark:border-white/10 dark:bg-[#101935]">
      <div
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-[5px]",
          iconStyles[color] || iconStyles.blue
        )}
      >
        <Icon className="h-6 w-6" />
      </div>
      <div className="min-w-0">
        <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-[#64748B] dark:text-slate-500">
          {title}
        </p>
        <p className="text-[20px] font-bold leading-none text-[#1e293b] dark:text-white">{value}</p>
        {meta ? <p className="mt-3 text-[12px] font-medium text-[#64748B] dark:text-slate-500">{meta}</p> : null}
      </div>
    </div>
  );
}

export function FinanceToolbar({ children, className }) {
  return (
    <div className={cn("rounded-[5px] border border-[#E7E8EB] bg-white p-4 shadow-none dark:border-white/10 dark:bg-[#101935]", className)}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {children}
      </div>
    </div>
  );
}

export function FinanceSearchField({
  value,
  onChange,
  placeholder = "Search...",
  className,
}) {
  return (
    <div className={cn("relative w-full sm:w-[260px]", className)}>
      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B] dark:text-slate-500" />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-[44px] w-full rounded-[5px] border border-[#E7E8EB] bg-[#F8F9FC] pl-11 pr-4 text-[13px] font-medium text-[#1e293b] outline-none transition-all focus:border-primary dark:border-white/10 dark:bg-[#0A0F1D] dark:text-white"
      />
    </div>
  );
}

export function FinanceSelect({
  value,
  onChange,
  options,
  placeholder,
  icon: Icon,
  className,
  align = "start",
}) {
  const selected = options.find((option) => option.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "group flex h-[44px] min-w-[180px] w-full items-center gap-3 rounded-[5px] border border-[#E7E8EB] bg-white px-4 outline-none transition-all hover:border-primary sm:w-auto dark:border-white/10 dark:bg-[#101935]",
          className
        )}
      >
        {Icon ? <Icon className="h-4 w-4 shrink-0 text-primary" /> : null}
        <span
          className={cn(
            "flex-1 truncate text-left text-[13px] font-bold text-[#1e293b] dark:text-white",
            !selected && "text-[#64748B] dark:text-slate-500"
          )}
        >
          {selected?.label || placeholder}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-[#64748B] transition-colors group-hover:text-primary dark:text-slate-500" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        className="z-[500] w-[calc(100vw-48px)] rounded-[5px] border border-[#E7E8EB] bg-white p-1 shadow-xl sm:w-[200px] dark:border-white/10 dark:bg-[#101935]"
      >
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onChange(option.value)}
            className="mb-0.5 flex cursor-pointer items-center justify-between rounded-[5px] px-3 py-2 text-[13px] font-semibold text-[#1e293b] dark:text-white"
          >
            {option.label}
            {value === option.value ? <Check className="h-4 w-4 text-primary" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function FinanceTableCard({ children, className }) {
  return (
    <div className={cn("overflow-hidden rounded-[5px] border border-[#E7E8EB] bg-white shadow-none dark:border-white/10 dark:bg-[#101935]", className)}>
      {children}
    </div>
  );
}

export function FinanceSectionCard({ children, className }) {
  return (
    <section className={cn("rounded-[5px] border border-[#E7E8EB] bg-white shadow-none dark:border-white/10 dark:bg-[#101935]", className)}>
      {children}
    </section>
  );
}
