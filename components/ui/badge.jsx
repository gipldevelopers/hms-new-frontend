import * as React from "react"
import { cn } from "@/lib/utils"

function Badge({
  className,
  variant = "default",
  ...props
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-[5px] border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.5px] transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variant === "default" && "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        variant === "secondary" && "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        variant === "destructive" && "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        variant === "outline" && "text-foreground",
        variant === "success" && "border-emerald-500/20 bg-emerald-500/10 text-emerald-500",
        variant === "warning" && "border-orange-500/20 bg-orange-500/10 text-orange-500",
        variant === "info" && "border-blue-500/20 bg-blue-500/10 text-blue-500",
        className
      )}
      {...props}
    />
  );
}

export { Badge }
