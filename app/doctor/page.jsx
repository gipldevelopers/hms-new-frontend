"use client";

import React from "react";
import { Plus } from "lucide-react";
import DoctorStats from "@/components/doctor/dashboard/DoctorStats";
import QuickLinks from "@/components/doctor/dashboard/QuickLinks";
import CriticalAlerts from "@/components/doctor/dashboard/CriticalAlerts";
import TodaySchedule from "@/components/doctor/dashboard/TodaySchedule";
import WardOverview from "@/components/doctor/dashboard/WardOverview";
import PatientFlowChart from "@/components/doctor/dashboard/PatientFlowChart";
import AdmittedPatientsTable from "@/components/doctor/dashboard/AdmittedPatientsTable";

export default function DoctorDashboard() {
  return (
    <div className="p-4 sm:p-5 bg-[#F8F9FA] dark:bg-[#0B1121] min-h-screen flex flex-col space-y-6 transition-colors duration-300 font-sans pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h1 className="text-[20px] font-bold text-[#1A1C23] dark:text-white tracking-tight leading-none">
          Doctor Dashboard
        </h1>
        <button 
          className="h-[40px] px-4 rounded-[5px] text-[13px] font-bold flex items-center justify-center gap-2 bg-[#2D3A8C] text-white hover:opacity-90 transition-all shadow-none"
        >
          <Plus className="w-4 h-4" />
          New Appointment
        </button>
      </div>

      {/* Stats Section */}
      <DoctorStats />

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Quick Links + Schedule) */}
        <div className="lg:col-span-2 space-y-6">
          <QuickLinks />
          <TodaySchedule />
        </div>

        {/* Right Column (Critical Alerts) */}
        <div className="lg:col-span-1">
          <CriticalAlerts />
        </div>
      </div>

      {/* Analytics & Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Ward Overview (2/5) */}
        <div className="lg:col-span-2">
          <WardOverview />
        </div>
        
        {/* Patient Flow Chart (3/5) */}
        <div className="lg:col-span-3">
          <PatientFlowChart />
        </div>
      </div>

      {/* Admitted Patients Table */}
      <AdmittedPatientsTable />

    </div>
  );
}
