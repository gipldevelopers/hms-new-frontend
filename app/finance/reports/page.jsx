"use client";

import { useMemo, useState } from "react";
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
} from "lucide-react";

const rupee = "\u20B9";

const insightCards = [
  {
    title: "Billed Amount",
    value: `${rupee}275,000`,
    change: "+22% from last month",
    tone: "positive",
    icon: CircleDollarSign,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-50",
  },
  {
    title: "Claims Approved",
    value: "2,157",
    change: "+9% from last month",
    tone: "positive",
    icon: FileText,
    iconColor: "text-indigo-500",
    iconBg: "bg-indigo-50",
  },
  {
    title: "Outstanding Payments",
    value: `${rupee}45,500`,
    change: "+3% from last month",
    tone: "positive",
    icon: UserRoundPlus,
    iconColor: "text-fuchsia-500",
    iconBg: "bg-fuchsia-50",
  },
  {
    title: "Rejected Claims",
    value: "156",
    change: "-5% from last month",
    tone: "negative",
    icon: AlertTriangle,
    iconColor: "text-rose-500",
    iconBg: "bg-rose-50",
  },
];

const chartData = {
  "This Month": [
    { week: "Week 1", consultations: 28, procedures: 16 },
    { week: "Week 2", consultations: 32, procedures: 20 },
    { week: "Week 3", consultations: 35, procedures: 14 },
    { week: "Week 4", consultations: 40, procedures: 19 },
  ],
  "Last Month": [
    { week: "Week 1", consultations: 22, procedures: 14 },
    { week: "Week 2", consultations: 29, procedures: 17 },
    { week: "Week 3", consultations: 31, procedures: 15 },
    { week: "Week 4", consultations: 34, procedures: 16 },
  ],
  Quarterly: [
    { week: "Week 1", consultations: 26, procedures: 18 },
    { week: "Week 2", consultations: 30, procedures: 18 },
    { week: "Week 3", consultations: 33, procedures: 21 },
    { week: "Week 4", consultations: 38, procedures: 24 },
  ],
};

const topProcedures = [
  {
    initials: "AM",
    name: "Angioplasty",
    specialty: "Cardiology",
    amount: `${rupee}18,500`,
  },
  {
    initials: "PA",
    name: "Cataract Removal",
    specialty: "Ophthalmology",
    amount: `${rupee}15,200`,
  },
  {
    initials: "OM",
    name: "Tonsillectomy",
    specialty: "Antacids",
    amount: `${rupee}12,800`,
  },
  {
    initials: "AZ",
    name: "Hip Replacement",
    specialty: "Orthopedics",
    amount: `${rupee}11,500`,
  },
  {
    initials: "CE",
    name: "Vasectomy",
    specialty: "Urology",
    amount: `${rupee}9,750`,
  },
];

const claimsActivity = [
  {
    patient: "Anya Sharma",
    date: "Nov 15, 2023",
    claimId: "#CL-2023-1122",
    status: "Approved",
  },
  {
    patient: "Rohan Verma",
    date: "Nov 14, 2023",
    claimId: "#CL-2023-1118",
    status: "Pending",
  },
  {
    patient: "Diya Patel",
    date: "Nov 14, 2023",
    claimId: "#CL-2023-1115",
    status: "Approved",
  },
  {
    patient: "Arnav Kapoor",
    date: "Nov 13, 2023",
    claimId: "#CL-2023-1110",
    status: "Rejected",
  },
  {
    patient: "Siya Singh",
    date: "Nov 13, 2023",
    claimId: "#CL-2023-1105",
    status: "Approved",
  },
];

function InsightCard({ card }) {
  const Icon = card.icon;

  return (
    <FinanceStatCard
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
}

function ClaimsStatus({ status }) {
  const colors = {
    Approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Pending: "bg-amber-100 text-amber-700 border-amber-200",
    Rejected: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <span className={`inline-flex items-center justify-center rounded-[5px] border px-3 py-1 text-[11px] font-bold ${colors[status]}`}>
      {status}
    </span>
  );
}

export default function FinanceReportsPage() {
  const [period, setPeriod] = useState("This Month");

  const bars = useMemo(() => chartData[period], [period]);
  const maxTotal = Math.max(
    ...bars.map((item) => item.consultations + item.procedures)
  );

  return (
    <FinancePageShell>
        <FinanceHeader
          title="Billing Insights"
          actions={
            <>
            <Button
              variant="outline"
              className="h-[48px] rounded-[5px] border-primary px-5 text-[13px] font-bold text-primary hover:bg-primary/5 hover:text-primary"
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button className="h-[48px] rounded-[5px] bg-primary px-5 text-[13px] font-bold text-white hover:opacity-90">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            </>
          }
        />

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {insightCards.map((card) => (
            <InsightCard key={card.title} card={card} />
          ))}
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
                  options={Object.keys(chartData).map((option) => ({
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
                    const consultationHeight =
                      (item.consultations / maxTotal) * 220 + 34;
                    const procedureHeight =
                      (item.procedures / maxTotal) * 220 + 20;

                    return (
                      <div
                        key={item.week}
                        className="flex flex-1 max-w-[190px] flex-col items-center gap-3"
                      >
                        <div className="flex h-[270px] w-full flex-col justify-end overflow-hidden rounded-md">
                          <div
                            className="w-full rounded-t-md bg-[#3CCB95]"
                            style={{ height: `${procedureHeight}px` }}
                          />
                          <div
                            className="mt-1 w-full rounded-t-md bg-[#7C83E6]"
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
              Top Billed Procedures
            </h2>
            <div className="space-y-6">
              {topProcedures.map((item) => (
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
              <span className="rounded-[5px] bg-amber-50 px-3 py-1 text-[11px] font-bold text-amber-500">
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
                {claimsActivity.map((item) => (
                  <tr
                    key={item.claimId}
                    className="border-b border-border text-[14px] text-foreground transition-colors hover:bg-muted/20"
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
