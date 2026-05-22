"use client";

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
} from "lucide-react";
import {
  FinanceHeader,
  FinancePageShell,
  FinanceSectionCard,
} from "@/components/finance/FinancePageChrome";

const alertCards = [
  {
    title: "Outstanding invoice balance critically high.",
    description:
      "Payment overdue threshold reached. Current balance: $3,000. Immediate action required to avoid service interruption.",
    time: "10 mins ago",
    icon: AlertTriangle,
    iconColor: "text-rose-500",
    iconBg: "bg-rose-50",
    chips: [
      { icon: Link2, label: "Invoice #1001 - Consulting Services" },
      { icon: Hash, label: "INV-9921" },
      { icon: MapPin, label: "B-12" },
    ],
  },
  {
    title: "Payment for Invoice #AML-4011 is below the required threshold.",
    description:
      "Current balance: $1800. Minimum payment: $5000. Please schedule payment soon.",
    time: "1 hr ago",
    icon: TimerReset,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50",
    chips: [
      { icon: Link2, label: "Invoice #AML-4011 - Software License" },
      { icon: Hash, label: "AML-4011" },
      { icon: MapPin, label: "A-06" },
    ],
  },
  {
    title: "Invoice #ASP204 due in 12 days.",
    description: "Prioritize processing this invoice to avoid late fees.",
    time: "2 hrs ago",
    icon: CalendarClock,
    iconColor: "text-violet-500",
    iconBg: "bg-violet-50",
    chips: [
      { icon: Link2, label: "Invoice #ASP204 - Marketing Services" },
      { icon: Hash, label: "ASP204" },
      { icon: MapPin, label: "B-02" },
    ],
  },
  {
    title: "Expired invoice detected in billing system.",
    description:
      "Immediate review required. Do not process payment. Action needed for correction.",
    time: "4 hrs ago",
    icon: BadgeAlert,
    iconColor: "text-red-500",
    iconBg: "bg-red-50",
    chips: [
      { icon: Link2, label: "Invoice #PAR102 - IT Support" },
      { icon: Hash, label: "PAR102" },
      { icon: MapPin, label: "D-04" },
    ],
  },
  {
    title: "Billing discrepancy detected.",
    description:
      "System amount: $1200 | Recorded amount: $980. Investigation needed to reconcile.",
    time: "5 hrs ago",
    icon: Scale,
    iconColor: "text-orange-500",
    iconBg: "bg-orange-50",
    chips: [
      { icon: Link2, label: "Invoice #AMX-001 - Office Supplies" },
      { icon: Hash, label: "AMX-001" },
      { icon: MapPin, label: "A-01" },
    ],
  },
  {
    title: "Billing system error exceeded safe limits.",
    description:
      "Error code: 10 C (Safe Limit: 2 C - 8 C). Please verify billing system immediately.",
    time: "1 day ago",
    icon: Waves,
    iconColor: "text-cyan-500",
    iconBg: "bg-cyan-50",
    chips: [
      { icon: Link2, label: "Multiple invoices" },
      { icon: Hash, label: "Multiple" },
      { icon: MapPin, label: "Billing Queue 1" },
    ],
  },
];

const statusOverview = [
  { value: "38", label: "Critical", color: "text-rose-500" },
  { value: "124", label: "Overdue", color: "text-amber-500" },
  { value: "52", label: "Due Soon", color: "text-violet-500" },
  { value: "18", label: "Pending Payments", color: "text-blue-500" },
];

const criticalInvoices = [
  {
    title: "Invoice #1001 - Consulting Services",
    amount: "$3000 outstanding",
    due: "Due in 2 days",
  },
  {
    title: "Invoice #2002 - Advertising",
    amount: "$1500 outstanding",
    due: "Due in 4 days",
  },
  {
    title: "Invoice #3003 - Software License",
    amount: "$4500 outstanding",
    due: "Due in 5 days",
  },
];

const recentActivity = [
  { text: "S. Jenkins resolved payment issue PO #PO2048", time: "10m ago" },
  { text: "M. Lawson updated invoice AMX-001", time: "1h ago" },
  { text: "System auto-flagged invoice PAR102 for review", time: "4h ago" },
];

function AlertCard({ item }) {
  const Icon = item.icon;

  return (
    <div className="rounded-[5px] border border-[#E7E8EB] bg-white p-5 shadow-none dark:border-white/10 dark:bg-[#101935]">
      <div className="flex gap-4">
        <div
          className={`mt-1 flex h-12 w-12 shrink-0 items-center justify-center self-start rounded-[5px] ${item.iconBg}`}
        >
          <Icon className={`h-5 w-5 ${item.iconColor}`} />
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
            {item.chips.map((chip) => {
              const ChipIcon = chip.icon;
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
  return (
    <FinancePageShell>
        <FinanceHeader
          title="Billing Alerts & Notifications"
        />

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_430px]">
          <div className="space-y-4">
            {alertCards.map((item) => (
              <AlertCard key={item.title} item={item} />
            ))}
          </div>

          <div className="space-y-5">
            <FinanceSectionCard className="p-5">
              <h2 className="mb-5 text-[16px] font-bold text-[#1e293b] dark:text-white">
                Billing Status Overview
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {statusOverview.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[5px] border border-[#E7E8EB] bg-[#F8F9FC] px-4 py-4 dark:border-white/10 dark:bg-[#0A0F1D]"
                  >
                    <div className={`text-[24px] font-bold ${item.color}`}>
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
                {criticalInvoices.map((item) => (
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
                      <span className="rounded-[5px] bg-rose-50 px-3 py-1 text-[11px] font-bold text-rose-500">
                        {item.due}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </FinanceSectionCard>

            <FinanceSectionCard className="p-5">
              <h2 className="mb-5 text-[16px] font-bold text-[#1e293b] dark:text-white">
                Recent Billing Activity
              </h2>

              <div className="space-y-5">
                {recentActivity.map((item) => (
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
