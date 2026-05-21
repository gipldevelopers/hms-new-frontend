"use client";
import React from "react";
import { FileText, ClipboardList, FlaskConical, CheckCircle2 } from "lucide-react";

export function OrderTimelineCard({ timeline = [] }) {
  if (timeline.length === 0) return null;

  // Map step names to lucide icons
  const iconMap = {
    "Order Placed": FileText,
    "Sample Collection Started": ClipboardList,
    "Sample Received in Lab": FlaskConical,
    "Results Ready": CheckCircle2
  };

  return (
    <div className="bg-card text-card-foreground p-5 rounded-lg border border-border space-y-4 shadow-none">
      <h2 className="text-[15px] font-bold text-foreground">Order Timeline</h2>

      <div className="relative pl-1 pr-1">
        {timeline.map((step, index) => {
          const Icon = iconMap[step.title] || CheckCircle2;
          
          // Use provided override iconColor, or fall back to default rules
          const iconColor = step.iconColor || (step.isDone
            ? (step.title === "Order Placed"
                ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                : "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400")
            : step.isActive
            ? "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 animate-pulse"
            : "bg-muted text-muted-foreground/80");

          return (
            <div key={index} className="flex gap-4 min-h-[70px] relative">
              {/* Stepper Line */}
              <div className="flex flex-col items-center shrink-0">
                <div className={`p-2 rounded-full ${iconColor} z-10 shrink-0`}>
                  <Icon size={14} />
                </div>
                {index < timeline.length - 1 && (
                  <div className={`w-0.5 flex-grow border-l-2 ${step.isDone ? "border-emerald-500" : "border-border"} my-1`} />
                )}
              </div>

              {/* Stepper Content */}
              <div className="flex-1 pb-4 flex justify-between gap-2">
                <div className="min-w-0">
                  <h4 className="text-[12px] font-bold text-foreground leading-snug">
                    {step.title}
                  </h4>
                  <p className="text-[10px] text-muted-foreground font-semibold mt-0.5 leading-normal">
                    {step.desc}
                  </p>
                </div>
                {step.time && (
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-bold text-foreground block">{step.time}</span>
                    <span className="text-[9px] font-bold text-muted-foreground block mt-0.5">{step.date}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
