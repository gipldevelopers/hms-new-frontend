"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef(({ className, checked, onCheckedChange, ...props }, ref) => (
  <div
    ref={ref}
    role="checkbox"
    aria-checked={checked}
    onClick={() => onCheckedChange?.(!checked)}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-[4px] border border-primary shadow-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 cursor-pointer",
      checked ? "bg-primary text-primary-foreground" : "bg-transparent",
      className
    )}
    {...props}
  >
    <div className={cn("flex items-center justify-center text-current transition-all", checked ? "opacity-100 scale-100" : "opacity-0 scale-50")}>
      <Check className="h-3 w-3 stroke-[3px]" />
    </div>
  </div>
))
Checkbox.displayName = "Checkbox"

export { Checkbox }
