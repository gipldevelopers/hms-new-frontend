"use client";

import React from "react";
import Link from "next/link";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const alerts = [
  {
    id: 1,
    type: "Critical Result",
    time: "2 hours ago",
    patientName: "Michael Chang",
    uhid: "92831",
    description: "Hemoglobin critically low – 4.2 g/dL",
    variant: "destructive",
  },
  {
    id: 2,
    type: "Pending Discharge",
    time: "5 hours ago",
    patientName: "Sarah oenkins",
    uhid: "10263",
    description: "Discharge summary pending for 24+ hours.",
    variant: "warning",
  },
  {
    id: 3,
    type: "Follow-up",
    time: "1 day ago",
    patientName: "Robert Ford",
    uhid: "88219",
    description: "Post-op day 7 routine check-up reminder.",
    variant: "info",
  },
  {
    id: 4,
    type: "Critical Result",
    time: "1 day ago",
    patientName: "Emily Davis",
    uhid: "71029",
    description: "Potassium level elevated – 6.5 mEq/L",
    variant: "destructive",
  },
  {
    id: 5,
    type: "Follow-up",
    time: "1 day ago",
    patientName: "Robert Ford",
    uhid: "88219",
    description: "Post-op day 7 routine check-up reminder.",
    variant: "info",
  },
  {
    id: 6,
    type: "Pending Discharge",
    time: "5 hours ago",
    patientName: "Sarah oenkins",
    uhid: "10263",
    description: "Discharge summary pending for 24+ hours.",
    variant: "warning",
  },
];

export default function AlertsPage() {
  return (
    <div className="p-5 bg-background min-h-screen flex flex-col gap-5 transition-colors duration-300 font-sans pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h1 className="text-[20px] font-bold text-foreground tracking-tight leading-none">
          Alerts
        </h1>
      </div>

      {/* Alerts List */}
      <div className="flex flex-col gap-5">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="p-5 bg-white dark:bg-[#101935] border border-border rounded-[5px] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
          >
            <div className="flex flex-col gap-3 flex-1">
              {/* Badge and Time */}
              <div className="flex items-center gap-3">
                <Badge
                  variant={alert.variant}
                  className="px-2 py-0.5 rounded-[3px] text-[10px] font-bold normal-case tracking-tight border-none"
                >
                  {alert.type}
                </Badge>
                <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-slate-400 font-medium">
                  <Clock className="w-3 h-3" />
                  {alert.time}
                </div>
              </div>

              {/* Patient Info */}
              <div className="flex items-center gap-2">
                <h3 className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight">
                  {alert.patientName}
                </h3>
                <span className="text-[13px] text-gray-400 dark:text-slate-500 font-medium">
                  • UHID: {alert.uhid}
                </span>
              </div>

              {/* Description */}
              <p className="text-[13px] text-gray-600 dark:text-slate-400 leading-relaxed font-medium">
                {alert.description}
              </p>
            </div>

            {/* Actions */}
            <div className="shrink-0 flex sm:justify-end">
              <Link href={`/doctor/alerts/${alert.id}`}>
                <Button
                  variant="outline"
                  className="h-9 px-5 text-[12px] font-bold border-border bg-gray-50/50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all text-gray-700 dark:text-gray-200"
                >
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
