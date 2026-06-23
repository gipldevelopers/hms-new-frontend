"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlerts = async (showLoading = true) => {
      try {
        if (showLoading) setLoading(true);
        const token = localStorage.getItem("authtoken");
        const res = await fetch("/api/doctor-opd/alerts", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error("Failed to fetch alerts");
        const json = await res.json();
        if (json.success) {
          setAlerts(json.data || []);
        } else {
          throw new Error(json.message || "Failed to fetch alerts");
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        if (showLoading) setLoading(false);
      }
    };

    fetchAlerts(true);
    const interval = setInterval(() => {
      fetchAlerts(false);
    }, 5000); // Poll every 5 seconds for real-time updates

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-5 bg-background min-h-screen flex flex-col gap-5 transition-colors duration-300 font-sans pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h1 className="text-[20px] font-bold text-foreground tracking-tight leading-none">
          Alerts
        </h1>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-[#101935] border border-border rounded-[5px]">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-[13px] font-medium text-gray-500 dark:text-slate-400">Loading alerts...</p>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-[#101935] border border-border rounded-[5px] text-destructive">
          <AlertCircle className="w-10 h-10 mb-2" />
          <p className="text-[14px] font-bold">Error Loading Alerts</p>
          <p className="text-[12px] font-medium text-muted-foreground mt-1">{error}</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && alerts.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-[#101935] border border-border rounded-[5px] text-muted-foreground">
          <AlertCircle className="w-10 h-10 mb-2 opacity-50" />
          <p className="text-[14px] font-bold">No active alerts</p>
          <p className="text-[12px] font-medium mt-1">All clinical tasks and patient vitals are currently normal.</p>
        </div>
      )}

      {/* Alerts List */}
      {!loading && !error && alerts.length > 0 && (
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
      )}
    </div>
  );
}
