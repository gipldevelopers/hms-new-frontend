import React from "react";
import { Bed, Activity, Ambulance, BadgeIndianRupee, Clock, ShieldAlert, RotateCcw, HeartPulse } from "lucide-react";
import { ReportsStatCard } from "./ReportsStatCard";

export function ReportsStatGrid({ stats }) {
  if (!stats) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
      <ReportsStatCard
        title="Bed Occupancy"
        value={`${stats.bedOccupancy || 0}%`}
        trend="12%"
        isUp={true}
        color="indigo"
        icon={Bed}
      />
      <ReportsStatCard
        title="OT Utilization"
        value={`${stats.otUtilization || 0}%`}
        trend="5%"
        isUp={true}
        color="indigo"
        icon={Activity}
      />
      <ReportsStatCard
        title="Emergency Cases"
        value={stats.emergencyCases || 0}
        trend="-2"
        isUp={false}
        color="indigo"
        icon={Ambulance}
        trendSuffix="vs avg"
      />
      <ReportsStatCard
        title="Revenue Today"
        value={`₹${stats.revenueToday || 0}`}
        trend="2%"
        isUp={true}
        color="indigo"
        icon={BadgeIndianRupee}
      />
      <ReportsStatCard
        title="Average LOS"
        value={`${stats.avgLos || 0} Days`}
        trend="1.5 Days"
        isUp={true}
        color="indigo"
        icon={Clock}
      />
      <ReportsStatCard
        title="Infection Rate"
        value={`${stats.infectionRate || 0}%`}
        trend="5%"
        isUp={true}
        color="indigo"
        icon={ShieldAlert}
      />
      <ReportsStatCard
        title="Readmission Rate"
        value={`${stats.readmissionRate || 0}%`}
        trend="-2%"
        isUp={false}
        color="indigo"
        icon={RotateCcw}
        trendSuffix="vs avg"
      />
      <ReportsStatCard
        title="Mortality Count"
        value={stats.mortalityCount || 0}
        trend="2"
        isUp={true}
        color="indigo"
        icon={HeartPulse}
      />
    </div>
  );
}
