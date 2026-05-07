"use client";

import React from "react";
import { Plus } from "lucide-react";
import DoctorStats from "@/components/doctor/dashboard/DoctorStats";
import QuickLinks from "@/components/doctor/dashboard/QuickLinks";
import TodaySchedule from "@/components/doctor/dashboard/TodaySchedule";
import CriticalAlerts from "@/components/doctor/dashboard/CriticalAlerts";
import AdmittedPatientsTable from "@/components/doctor/dashboard/AdmittedPatientsTable";

export default function DoctorDashboard() {
  return (
    <div className="p-4 md:p-5 bg-background min-h-screen flex flex-col gap-5 md:gap-6 transition-colors duration-300 font-sans pb-20">
      
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h1 className="text-[20px] font-bold text-foreground tracking-tight leading-none">
          Doctor Dashboard
        </h1>
        <button className="h-10 px-5 rounded-lg bg-primary text-primary-foreground text-[13px] font-bold hover:opacity-90 transition-all shadow-none flex items-center gap-2 w-full sm:w-auto justify-center">
          <Plus className="w-4 h-4" />
          New Appointment
        </button>
      </div>

      {/* Stats Row */}
      <DoctorStats />

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
        
        {/* Left Column (Quick Links + Schedule) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <QuickLinks />
          <TodaySchedule className="flex-1" />
        </div>

        {/* Right Column (Critical Alerts) */}
        <div className="lg:col-span-2">
          <CriticalAlerts className="h-full" />
        </div>
      </div>

      {/* Admitted Patients Table */}
      <AdmittedPatientsTable />

    </div>
  );
}
