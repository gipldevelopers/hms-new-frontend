import React from "react";
import { BadgeIndianRupee, Clock, Shield, RefreshCw } from "lucide-react";
import { FinanceStatCard } from "./FinanceStatCard";

export function FinanceStatGrid() {
  return (
    <div className="space-y-4">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[16px]">
        <FinanceStatCard
          title="Total Revenue Today"
          value="₹24,500"
          trend="12%"
          isUp={true}
          color="purple"
          icon={BadgeIndianRupee}
        />
        <FinanceStatCard
          title="Pending Collections"
          value="₹2,450"
          trend="5%"
          isUp={true}
          color="green"
          icon={Clock}
        />
        <FinanceStatCard
          title="Insurance Claims"
          value="42 Pending"
          trend="-2"
          isUp={false}
          color="orange"
          icon={Shield}
          trendSuffix="vs avg"
        />
        <FinanceStatCard
          title="Refunds Today"
          value="₹450"
          trend="2"
          isUp={true}
          color="red"
          icon={RefreshCw}
        />
      </div>
    </div>
  );
}
