import * as React from "react"

import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  ...props
}) {
  return (
    <input
      type={type}
      data-slot="input"
      suppressHydrationWarning
      className={cn(
        "h-12 w-full min-w-0 rounded-[5px] border border-gray-200 bg-white dark:bg-[#1E293B] px-4 text-[14px] font-bold transition-all outline-none placeholder:text-gray-400/50 focus:border-primary dark:border-white/10 dark:text-white shadow-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props} />
  );
}

export { Input }
