import React from "react";
import { BadgeIndianRupee, Clock, FileText, IndianRupee, ReceiptText, WalletCards } from "lucide-react";
import { FinanceStatCard } from "./FinanceStatCard";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

const formatCurrency = (value) => currency.format(Number(value || 0));

const StatGridMessage = ({ children }) => (
  <div className="bg-card p-5 rounded-lg border border-border min-h-[134px] flex items-center text-[13px] text-gray-500 dark:text-slate-400">
    {children}
  </div>
);

export function FinanceStatGrid({ stats, loading, error }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-[16px]">
        {Array.from({ length: 6 }).map((_, index) => (
          <StatGridMessage key={index}>Loading statistics...</StatGridMessage>
        ))}
      </div>
    );
  }

  if (error) {
    return <StatGridMessage>{error}</StatGridMessage>;
  }

  const cards = [
    {
      title: "Total Revenue",
      value: formatCurrency(stats?.totalRevenue),
      meta: "All bills",
      color: "purple",
      icon: BadgeIndianRupee
    },
    {
      title: "Total Collections",
      value: formatCurrency(stats?.totalCollections),
      meta: "Amount paid",
      color: "green",
      icon: WalletCards
    },
    {
      title: "Pending Payments",
      value: formatCurrency(stats?.pendingPayments),
      meta: `${stats?.pendingBillCount || 0} pending bills`,
      color: "orange",
      icon: Clock
    },
    {
      title: "Total Bills",
      value: String(stats?.totalBills || 0),
      meta: "Generated bills",
      color: "purple",
      icon: FileText
    },
    {
      title: "Today's Collections",
      value: formatCurrency(stats?.todayCollections),
      meta: "Collected today",
      color: "green",
      icon: IndianRupee
    },
    {
      title: "Today's Revenue",
      value: formatCurrency(stats?.todayRevenue),
      meta: "Billed today",
      color: "red",
      icon: ReceiptText
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-[16px]">
      {cards.map((card) => (
        <FinanceStatCard key={card.title} {...card} />
      ))}
    </div>
  );
}
