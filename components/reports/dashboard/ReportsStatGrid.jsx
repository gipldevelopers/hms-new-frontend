import React from "react";
import { Bed, Activity, Ambulance, BadgeIndianRupee, Clock, ShieldAlert, RotateCcw, HeartPulse } from "lucide-react";
import { ReportsStatCard } from "./ReportsStatCard";

export function ReportsStatGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
      <ReportsStatCard
        title="Bed Occupancy"
        value="86%"
        trend="12%"
        isUp={true}
        color="indigo"
        icon={Bed}
      />
      <ReportsStatCard
        title="OT Utilization"
        value="72%"
        trend="5%"
        isUp={true}
        color="indigo"
        icon={Activity}
      />
      <ReportsStatCard
        title="Emergency Cases"
        value="142"
        trend="-2"
        isUp={false}
        color="indigo"
        icon={Ambulance}
        trendSuffix="vs avg"
      />
      <ReportsStatCard
        title="Revenue Today"
        value="₹45000"
        trend="2%"
        isUp={true}
        color="indigo"
        icon={BadgeIndianRupee}
      />
      <ReportsStatCard
        title="Average LOS"
        value="4.2d"
        trend="1.5d"
        isUp={true}
        color="indigo"
        icon={Clock}
      />
      <ReportsStatCard
        title="Infection Rate"
        value="1.2%"
        trend="5%"
        isUp={true}
        color="indigo"
        icon={ShieldAlert}
      />
      <ReportsStatCard
        title="Readmission Rate"
        value="4.8%"
        trend="-2%"
        isUp={false}
        color="indigo"
        icon={RotateCcw}
        trendSuffix="vs avg"
      />
      <ReportsStatCard
        title="Mortality Count"
        value="2"
        trend="2"
        isUp={true}
        color="indigo"
        icon={HeartPulse}
      />
    </div>
  );
}
