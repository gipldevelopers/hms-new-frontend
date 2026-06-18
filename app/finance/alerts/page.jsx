"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  BadgeAlert,
  CalendarClock,
  Hash,
  Link2,
  MapPin,
  Scale,
  TimerReset,
  Waves,
  Loader2
} from "lucide-react";
import {
  FinanceHeader,
  FinancePageShell,
  FinanceSectionCard,
} from "@/components/finance/FinancePageChrome";

const rupee = "\u20B9";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

function getAuthHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("authtoken") : "";
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

const alertConfig = {
  critical: {
    icon: AlertTriangle,
    iconColor: "text-rose-500",
    iconBg: "bg-rose-50 dark:bg-rose-950/20"
  },
  overdue: {
    icon: TimerReset,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50 dark:bg-amber-950/20"
  },
  duesoon: {
    icon: CalendarClock,
    iconColor: "text-violet-500",
    iconBg: "bg-violet-50 dark:bg-violet-950/20"
  },
  info: {
    icon: BadgeAlert,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50 dark:bg-blue-950/20"
  }
};

const chipIcons = [Link2, Hash, MapPin];

function AlertCard({ item }) {
  const config = alertConfig[item.type] || alertConfig.info;
  const Icon = config.icon;

  return (
    <div className="rounded-[5px] border border-[#E7E8EB] bg-white p-5 shadow-none dark:border-white/10 dark:bg-[#101935]">
      <div className="flex gap-4">
        <div
          className={`mt-1 flex h-12 w-12 shrink-0 items-center justify-center self-start rounded-[5px] ${config.iconBg}`}
        >
          <Icon className={`h-5 w-5 ${config.iconColor}`} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-[16px] font-bold text-[#1e293b] dark:text-white">
                {item.title}
              </h2>
              <p className="mt-2 text-[13px] font-medium leading-relaxed text-[#64748B] dark:text-slate-500">
                {item.description}
              </p>
            </div>
            <span className="whitespace-nowrap text-[12px] font-medium text-[#64748B] dark:text-slate-500">
              {item.time}
            </span>
          </div>

          <div className="mt-5 flex flex-wrap gap-2.5">
            {(item.chips || []).map((chip, index) => {
              const ChipIcon = chipIcons[index % chipIcons.length];
              return (
                <span
                  key={chip.label}
                  className="inline-flex items-center gap-2 rounded-[5px] border border-[#E7E8EB] bg-[#F8F9FC] px-3 py-2 text-[12px] font-medium text-[#64748B] dark:border-white/10 dark:bg-[#0A0F1D] dark:text-slate-400"
                >
                  <ChipIcon className="h-4 w-4" />
                  {chip.label}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FinanceAlertsPage() {
  const [alertsData, setAlertsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/billing/alerts`, { headers: getAuthHeaders() });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || `Error ${res.status}`);
      setAlertsData(json.data);
    } catch (e) {
      console.error("fetchAlerts error:", e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (key) => {
    if (key === "critical") return "text-rose-500";
    if (key === "overdue") return "text-amber-500";
    if (key === "duesoon") return "text-violet-500";
    return "text-blue-500";
  };

  if (loading) {
    return (
      <FinancePageShell>
        <FinanceHeader title="Billing Alerts & Notifications" />
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
          <p className="text-[14px] text-gray-500 font-bold">Loading billing alerts...</p>
        </div>
      </FinancePageShell>
    );
  }

  if (error) {
    return (
      <FinancePageShell>
        <FinanceHeader title="Billing Alerts & Notifications" />
        <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 text-rose-600 rounded-[8px] p-6 text-[14px] font-semibold text-center max-w-[600px] mx-auto mt-12">
          <p className="mb-4">Failed to load alerts: {error}</p>
          <Button onClick={fetchAlerts} className="bg-rose-600 hover:bg-rose-700 text-white font-bold h-10 px-4 rounded-[6px] transition-colors cursor-pointer border-0">
            Retry Loading
          </Button>
        </div>
      </FinancePageShell>
    );
  }

  return (
    <FinancePageShell>
      <FinanceHeader title="Billing Alerts & Notifications" />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_430px]">
        <div className="space-y-4">
          {(alertsData.alertCards || []).map((item) => (
            <AlertCard key={item.title + item.time} item={item} />
          ))}
        </div>

        <div className="space-y-5">
          <FinanceSectionCard className="p-5">
            <h2 className="mb-5 text-[16px] font-bold text-[#1e293b] dark:text-white">
              Billing Status Overview
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {(alertsData.statusOverview || []).map((item) => (
                <div
                  key={item.label}
                  className="rounded-[5px] border border-[#E7E8EB] bg-[#F8F9FC] px-4 py-4 dark:border-white/10 dark:bg-[#0A0F1D]"
                >
                  <div className={`text-[24px] font-bold ${getStatusColor(item.key)}`}>
                    {item.value}
                  </div>
                  <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#64748B] dark:text-slate-500">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </FinanceSectionCard>

          <FinanceSectionCard className="p-5">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              <h2 className="text-[16px] font-bold text-[#1e293b] dark:text-white">
                Top Critical Invoices
              </h2>
            </div>

            <div className="space-y-5">
              {(alertsData.criticalInvoices || []).map((item) => (
                <div key={item.title} className="rounded-[5px] bg-[#F8F9FC] p-4 dark:bg-[#0A0F1D]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[14px] font-bold text-[#1e293b] dark:text-white">
                        {item.title}
                      </p>
                      <p className="mt-1 text-[12px] font-medium text-[#64748B] dark:text-slate-500">
                        {item.amount}
                      </p>
                    </div>
                    <span className="rounded-[5px] bg-rose-50 dark:bg-rose-950/20 px-3 py-1 text-[11px] font-bold text-rose-500">
                      {item.due}
                    </span>
                  </div>
                </div>
              ))}
              {(!alertsData.criticalInvoices || alertsData.criticalInvoices.length === 0) && (
                <p className="text-[12px] text-gray-500 font-medium text-center py-4">No critical invoices found.</p>
              )}
            </div>
          </FinanceSectionCard>

          <FinanceSectionCard className="p-5">
            <h2 className="mb-5 text-[16px] font-bold text-[#1e293b] dark:text-white">
              Recent Billing Activity
            </h2>

            <div className="space-y-5">
              {(alertsData.recentActivity || []).map((item) => (
                <div key={item.text} className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-slate-200" />
                  <div>
                    <p className="text-[13px] font-bold text-[#1e293b] dark:text-white">
                      {item.text}
                    </p>
                    <p className="mt-1 text-[12px] font-medium text-[#64748B] dark:text-slate-500">
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </FinanceSectionCard>
        </div>
      </section>
    </FinancePageShell>
  );
}
