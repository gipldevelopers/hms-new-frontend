"use client";

import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  FinanceHeader,
  FinancePageShell,
  FinanceSectionCard,
  FinanceSelect,
  FinanceStatCard,
} from "@/components/finance/FinancePageChrome";
import {
  AlertTriangle,
  CircleDollarSign,
  Download,
  FileSpreadsheet,
  FileText,
  UserRoundPlus,
  Loader2
} from "lucide-react";

const rupee = "\u20B9";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

function getAuthHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("authtoken") : "";
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function ClaimsStatus({ status }) {
  const colors = {
    Approved: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50",
    Pending: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50",
    Rejected: "bg-red-100 text-red-700 border-red-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50",
  };

  return (
    <span className={`inline-flex items-center justify-center rounded-[5px] border px-3 py-1 text-[11px] font-bold ${colors[status] || colors.Pending}`}>
      {status}
    </span>
  );
}

export default function FinanceReportsPage() {
  const [period, setPeriod] = useState("This Month");
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/billing/reports`, { headers: getAuthHeaders() });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || `Error ${res.status}`);
      setReportData(json.data);
    } catch (e) {
      console.error("fetchReports error:", e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const bars = useMemo(() => {
    if (!reportData || !reportData.chartData) {
      return [
        { week: "Week 1", consultations: 0, procedures: 0 },
        { week: "Week 2", consultations: 0, procedures: 0 },
        { week: "Week 3", consultations: 0, procedures: 0 },
        { week: "Week 4", consultations: 0, procedures: 0 }
      ];
    }
    return reportData.chartData[period] || [];
  }, [reportData, period]);

  const maxTotal = useMemo(() => {
    if (bars.length === 0) return 1;
    const maxVal = Math.max(...bars.map((item) => (item.consultations || 0) + (item.procedures || 0)));
    return maxVal || 1;
  }, [bars]);

  if (loading) {
    return (
      <FinancePageShell>
        <FinanceHeader title="Billing Insights" />
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
          <p className="text-[14px] text-gray-500 font-bold">Loading insights data...</p>
        </div>
      </FinancePageShell>
    );
  }

  if (error) {
    return (
      <FinancePageShell>
        <FinanceHeader title="Billing Insights" />
        <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 text-rose-600 rounded-[8px] p-6 text-[14px] font-semibold text-center max-w-[600px] mx-auto mt-12">
          <p className="mb-4">Failed to load reports: {error}</p>
          <Button onClick={fetchReports} className="bg-rose-600 hover:bg-rose-700 text-white font-bold h-10 px-4 rounded-[6px] transition-colors cursor-pointer border-0">
            Retry Loading
          </Button>
        </div>
      </FinancePageShell>
    );
  }

  const insightCards = [
    {
      title: "Billed Amount",
      value: `₹${(reportData.totalBilled || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
      change: "Gross total billed revenue",
      icon: CircleDollarSign,
      iconColor: "text-emerald-500",
      iconBg: "bg-emerald-50"
    },
    {
      title: "Claims Approved",
      value: (reportData.claimsApprovedCount || 0).toLocaleString("en-IN"),
      change: "Settled cashless requests",
      icon: FileText,
      iconColor: "text-indigo-500",
      iconBg: "bg-indigo-50"
    },
    {
      title: "Outstanding Payments",
      value: `₹${(reportData.outstanding || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
      change: "Total balance due to be paid",
      icon: UserRoundPlus,
      iconColor: "text-fuchsia-500",
      iconBg: "bg-fuchsia-50"
    },
    {
      title: "Rejected Claims",
      value: (reportData.claimsRejectedCount || 0).toLocaleString("en-IN"),
      change: "Exclusions or denied coverages",
      icon: AlertTriangle,
      iconColor: "text-rose-500",
      iconBg: "bg-rose-50"
    }
  ];

  return (
    <FinancePageShell>
      <FinanceHeader
        title="Billing Insights"
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => alert("Report downloaded successfully")}
              className="h-[48px] rounded-[5px] border-primary px-5 text-[13px] font-bold text-primary hover:bg-primary/5 hover:text-primary"
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button
              onClick={() => alert("CSV Exported successfully")}
              className="h-[48px] rounded-[5px] bg-primary px-5 text-[13px] font-bold text-white hover:opacity-90"
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </>
        }
      />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {insightCards.map((card) => {
          const Icon = card.icon;
          return (
            <FinanceStatCard
              key={card.title}
              title={card.title}
              value={card.value}
              icon={Icon}
              color={
                card.iconColor.includes("emerald")
                  ? "emerald"
                  : card.iconColor.includes("indigo")
                  ? "indigo"
                  : card.iconColor.includes("fuchsia")
                  ? "blue"
                  : "rose"
              }
              meta={card.change}
            />
          );
        })}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <FinanceSectionCard>
          <div className="flex flex-col gap-4 border-b border-border px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-[16px] font-bold text-[#1e293b] dark:text-white">
              Billing Trends
            </h2>
            <div className="flex flex-wrap items-center gap-5">
              <div className="flex items-center gap-5 text-[12px] font-medium text-[#64748B] dark:text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#7C83E6]" />
                  <span>Consultations</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#3CCB95]" />
                  <span>Procedures</span>
                </div>
              </div>
              <FinanceSelect
                value={period}
                onChange={setPeriod}
                placeholder="Select Period"
                options={["This Month", "Last Month", "Quarterly"].map((option) => ({
                  label: option,
                  value: option,
                }))}
              />
            </div>
          </div>

          <div className="px-6 py-8">
            <div className="relative h-[320px]">
              <div className="absolute inset-0 flex flex-col justify-between">
                {[0, 1, 2, 3].map((line) => (
                  <div
                    key={line}
                    className="border-t border-slate-100 dark:border-white/5"
                  />
                ))}
              </div>

              <div className="relative z-10 flex h-full items-end justify-around gap-6">
                {bars.map((item) => {
                  const consultationHeight = Math.max(10, ((item.consultations || 0) / maxTotal) * 180);
                  const procedureHeight = Math.max(10, ((item.procedures || 0) / maxTotal) * 180);

                  return (
                    <div
                      key={item.week}
                      className="flex flex-1 max-w-[190px] flex-col items-center gap-3"
                    >
                      <div className="flex h-[270px] w-full flex-col justify-end overflow-hidden rounded-md">
                        <div
                          className="w-full rounded-t-md bg-[#3CCB95] transition-all duration-300"
                          style={{ height: `${procedureHeight}px` }}
                        />
                        <div
                          className="mt-1 w-full rounded-t-md bg-[#7C83E6] transition-all duration-300"
                          style={{ height: `${consultationHeight}px` }}
                        />
                      </div>
                      <p className="text-sm text-slate-400 dark:text-slate-500">{item.week}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </FinanceSectionCard>

        <FinanceSectionCard className="p-6">
          <h2 className="mb-6 text-[16px] font-bold text-[#1e293b] dark:text-white">
            Top Billed Categories
          </h2>
          <div className="space-y-6">
            {(reportData.topCategories || []).map((item) => (
              <div key={item.name} className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-[5px] border border-indigo-100 bg-indigo-50 text-sm font-semibold text-[#4A4FD2] dark:border-indigo-500/20 dark:bg-indigo-500/10">
                  {item.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-bold text-[#1e293b] dark:text-white">
                    {item.name}
                  </p>
                  <p className="text-[12px] font-medium text-[#64748B] dark:text-slate-500">
                    {item.specialty}
                  </p>
                </div>
                <div className="text-right text-[14px] font-bold text-[#1e293b] dark:text-white">
                  {item.amount}
                </div>
              </div>
            ))}
          </div>
        </FinanceSectionCard>
      </section>

      <FinanceSectionCard className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-border px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-[16px] font-bold text-[#1e293b] dark:text-white">
              Recent Claims Activity
            </h2>
            <span className="rounded-[5px] bg-amber-50 dark:bg-amber-950/20 px-3 py-1 text-[11px] font-bold text-amber-500">
              View All
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-muted/30">
                <th className="border-b border-border px-6 py-4 text-left text-[11px] font-bold tracking-widest text-muted-foreground">PATIENT</th>
                <th className="border-b border-border px-6 py-4 text-left text-[11px] font-bold tracking-widest text-muted-foreground">DATE</th>
                <th className="border-b border-border px-6 py-4 text-left text-[11px] font-bold tracking-widest text-muted-foreground">CLAIM ID</th>
                <th className="border-b border-border px-6 py-4 text-right text-[11px] font-bold tracking-widest text-muted-foreground">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {(reportData.recentClaims || []).map((item) => (
                <tr
                  key={item.claimId}
                  className="border-b border-border text-[14px] text-[#1e293b] dark:text-white transition-colors hover:bg-muted/20"
                >
                  <td className="whitespace-nowrap px-6 py-5 font-bold">
                    {item.patient}
                  </td>
                  <td className="whitespace-nowrap px-6 py-5 text-[13px] font-medium text-muted-foreground">{item.date}</td>
                  <td className="whitespace-nowrap px-6 py-5 text-[13px] font-medium text-muted-foreground">{item.claimId}</td>
                  <td className="whitespace-nowrap px-6 py-5 text-right">
                    <ClaimsStatus status={item.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FinanceSectionCard>
    </FinancePageShell>
  );
}
