import React from "react";
import { StatCard } from "./StatCard";

export function StatGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[20px]">
      <StatCard title="Doctors" value="247" percentage="+95%" isUp={true} color="indigo" />
      <StatCard title="Total Departments" value="4178" percentage="+25%" isUp={true} color="red" />
      <StatCard title="Total Users" value="12178" percentage="-15%" isUp={false} color="blue" />
      <StatCard title="Revenue" value="55,124" percentage="+25%" isUp={true} color="emerald" />
    </div>
  );
}
