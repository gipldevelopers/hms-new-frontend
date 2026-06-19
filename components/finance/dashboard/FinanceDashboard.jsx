"use client";

import React, { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";
import { FinanceStatGrid } from "./FinanceStatGrid";
import { FinanceQuickLinks } from "./FinanceQuickLinks";
import { PendingPayments } from "./PendingPayments";
import { FinanceActionNeeded } from "./FinanceActionNeeded";
import { PatientsWithRunningBills } from "./PatientsWithRunningBills";
import { RecentInvoices } from "./RecentInvoices";

const initialDashboardState = {
  stats: null,
  recentInvoices: [],
  runningBills: [],
  alerts: null,
  loading: true,
  errors: {}
};

const getAuthHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("authtoken") : "";
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const getBranchId = () => {
  if (typeof window === "undefined") return null;

  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user?.branchId || null;
  } catch {
    return null;
  }
};

const buildUrl = (path) => {
  const branchId = getBranchId();
  const params = new URLSearchParams();
  if (branchId) params.set("branchId", branchId);

  const query = params.toString();
  return `${API_URL}${path}${query ? `?${query}` : ""}`;
};

const fetchDashboardResource = async (path) => {
  const response = await fetch(buildUrl(path), {
    headers: getAuthHeaders()
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || "Unable to load finance dashboard data.");
  }

  return payload.data;
};

export default function FinanceDashboard() {
  const [dashboard, setDashboard] = useState(initialDashboardState);

  useEffect(() => {
    let isActive = true;

    const loadDashboard = async () => {
      setDashboard((current) => ({ ...current, loading: true, errors: {} }));

      const resources = await Promise.allSettled([
        fetchDashboardResource("/finance/dashboard/stats"),
        fetchDashboardResource("/finance/dashboard/recent-invoices"),
        fetchDashboardResource("/finance/dashboard/running-bills"),
        fetchDashboardResource("/finance/dashboard/alerts")
      ]);

      if (!isActive) return;

      const [stats, recentInvoices, runningBills, alerts] = resources;
      const errors = {};

      if (stats.status === "rejected") errors.stats = stats.reason.message;
      if (recentInvoices.status === "rejected") errors.recentInvoices = recentInvoices.reason.message;
      if (runningBills.status === "rejected") errors.runningBills = runningBills.reason.message;
      if (alerts.status === "rejected") errors.alerts = alerts.reason.message;

      setDashboard({
        stats: stats.status === "fulfilled" ? stats.value : null,
        recentInvoices: recentInvoices.status === "fulfilled" ? recentInvoices.value : [],
        runningBills: runningBills.status === "fulfilled" ? runningBills.value : [],
        alerts: alerts.status === "fulfilled" ? alerts.value : null,
        loading: false,
        errors
      });
    };

    loadDashboard();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <div className="p-6 bg-[#F8F9FC] dark:bg-[#0A0F1D] min-h-screen space-y-[20px] font-sans transition-colors duration-300">
      <div className="flex justify-between items-center mb-[20px]">
        <h1 className="text-[20px] font-bold text-[#1e293b] dark:text-white leading-tight tracking-tight">
          Today&apos;s Overview
        </h1>
      </div>

      <FinanceStatGrid stats={dashboard.stats} loading={dashboard.loading} error={dashboard.errors.stats} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[20px]">
        <div className="lg:col-span-8">
          <FinanceQuickLinks />
        </div>
        <div className="lg:col-span-4">
          <PendingPayments stats={dashboard.stats} loading={dashboard.loading} error={dashboard.errors.stats} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[20px]">
        <div className="lg:col-span-8">
          <RecentInvoices
            invoices={dashboard.recentInvoices}
            loading={dashboard.loading}
            error={dashboard.errors.recentInvoices}
          />
        </div>
        <div className="lg:col-span-4">
          <FinanceActionNeeded alerts={dashboard.alerts} loading={dashboard.loading} error={dashboard.errors.alerts} />
        </div>
      </div>

      <PatientsWithRunningBills
        bills={dashboard.runningBills}
        loading={dashboard.loading}
        error={dashboard.errors.runningBills}
      />
    </div>
  );
}
