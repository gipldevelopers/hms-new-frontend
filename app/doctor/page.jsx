"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, RefreshCw, AlertCircle } from "lucide-react";
import DoctorStats from "@/components/doctor/dashboard/DoctorStats";
import QuickLinks from "@/components/doctor/dashboard/QuickLinks";
import TodaySchedule from "@/components/doctor/dashboard/TodaySchedule";
import CriticalAlerts from "@/components/doctor/dashboard/CriticalAlerts";
import AdmittedPatientsTable from "@/components/doctor/dashboard/AdmittedPatientsTable";
import { cn } from "@/lib/utils";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

export default function DoctorDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("authtoken");
      const res = await fetch(`${API_BASE}/doctor-opd/dashboard`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch dashboard data: ${res.status}`);
      }

      const resData = await res.json();
      if (resData.success) {
        setData(resData.data);
      } else {
        throw new Error(resData.message || "Failed to load dashboard data");
      }
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleAlertAction = useCallback((alert) => {
    if (alert.status === "ACKNOWLEDGE") {
      // Dismiss the alert from the local state
      setData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          alerts: prev.alerts.filter(a => a !== alert)
        };
      });
    } else if (alert.status === "VIEW TASK" || alert.status === "VIEW RESULTS") {
      // Route appropriately
      window.location.href = alert.status === "VIEW TASK" ? "/doctor/schedule" : "/doctor/reports";
    }
  }, []);

  return (
    <div className="p-4 md:p-5 bg-background min-h-screen flex flex-col gap-5 md:gap-6 transition-colors duration-300 font-sans pb-20">
      
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h1 className="text-[20px] font-bold text-foreground tracking-tight leading-none">
          Doctor Dashboard
        </h1>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
          <div className="flex-1">
            <p className="text-[13px] font-bold text-destructive">Failed to load dashboard data</p>
            <p className="text-[12px] text-muted-foreground mt-0.5">{error}</p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="text-[12px] font-bold text-primary hover:underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Stats Row */}
      <DoctorStats stats={data?.stats} loading={loading} />

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
        
        {/* Left Column (Quick Links + Schedule) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <QuickLinks />
          <TodaySchedule className="flex-1" schedule={data?.schedule} loading={loading} />
        </div>

        {/* Right Column (Critical Alerts) */}
        <div className="lg:col-span-2">
          <CriticalAlerts className="h-full" alerts={data?.alerts} loading={loading} onAction={handleAlertAction} />
        </div>
      </div>

      {/* Admitted Patients Table */}
      <AdmittedPatientsTable patients={data?.admittedPatients} loading={loading} />

    </div>
  );
}
