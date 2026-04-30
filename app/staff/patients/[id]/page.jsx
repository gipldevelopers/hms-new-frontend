"use client";

import React, { useState } from "react";
import { 
  ArrowLeft, 
  Plus, 
  ChevronRight, 
  AlertCircle, 
  Activity, 
  Droplets, 
  Thermometer, 
  Wind,
  Clock,
  ExternalLink
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

import PatientSummary from "@/components/staff/patient-details/PatientSummary";
import VitalsHistory from "@/components/staff/patient-details/VitalsHistory";
import NursingTasks from "@/components/staff/patient-details/NursingTasks";
import LabReports from "@/components/staff/patient-details/LabReports";
import MedicationMAR from "@/components/staff/patient-details/MedicationMAR";
import DoctorOrders from "@/components/staff/patient-details/DoctorOrders";
import NursingNotes from "@/components/staff/patient-details/NursingNotes";
import { useSearchParams } from "next/navigation";

export default function PatientDetailsPage({ params }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "Summary";
  
  const [activeTab, setActiveTab] = useState(currentTab);

  const tabs = ["Summary", "Vitals", "Medication", "Tasks", "Lab Results", "Doctor Orders", "Notes"];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    router.push(`?tab=${tab}`, { scroll: false });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Summary":
        return <PatientSummary />;
      case "Vitals":
        return (
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="text-[18px] font-bold text-[#1e293b] dark:text-white leading-none">Vitals History</h2>
              <button className="bg-[#2D3A8C] text-white px-6 h-[40px] rounded-[5px] text-[12px] font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-none">
                <Plus className="w-4 h-4" />
                Add Vitals
              </button>
            </div>
            <VitalsHistory />
          </div>
        );
      case "Medication":
        return <MedicationMAR />;
      case "Tasks":
        return (
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="text-[18px] font-bold text-[#1e293b] dark:text-white leading-none">Nursing Tasks</h2>
              <button className="bg-[#2D3A8C] text-white px-6 h-[40px] rounded-[5px] text-[12px] font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-none">
                <Plus className="w-4 h-4" />
                Add Tasks
              </button>
            </div>
            <NursingTasks />
          </div>
        );
      case "Lab Results":
        return (
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="text-[18px] font-bold text-[#1e293b] dark:text-white leading-none">Laboratory Reports</h2>
            </div>
            <LabReports />
          </div>
        );
      case "Doctor Orders":
        return (
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="text-[18px] font-bold text-[#1e293b] dark:text-white leading-none">Doctor Orders</h2>
              <button className="bg-[#2D3A8C] text-white px-6 h-[40px] rounded-[5px] text-[12px] font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-none">
                <Plus className="w-4 h-4" />
                Raise Request
              </button>
            </div>
            <DoctorOrders />
          </div>
        );
      case "Notes":
        return <NursingNotes />;
      default:
        return (
          <div className="bg-white dark:bg-[#101935] p-12 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Activity className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-[16px] font-bold text-[#1e293b] dark:text-white mb-1">{activeTab} Section</h3>
            <p className="text-[13px] text-gray-400 font-medium">This clinical module is currently being optimized.</p>
          </div>
        );
    }
  };

  return (
    <div className="p-4 md:p-6 bg-[#F8F9FC] dark:bg-[#0A0F1D] min-h-screen flex flex-col space-y-[15px] md:space-y-[20px] transition-colors duration-300 font-sans pb-20">
      
      {/* Top Allergy Alert - Separate Box */}
      <div className="bg-[#FFF5F5] dark:bg-rose-500/5 px-4 md:px-6 py-3 md:py-4 rounded-[5px] flex items-center gap-3 border-l-4 border-l-rose-500 shadow-none">
         <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
         <p className="text-[11px] md:text-[13px] font-bold text-rose-500 uppercase tracking-tight">
           ALLERGIES: <span className="font-medium normal-case ml-2 text-rose-500/80">Penicillin, Sulfa Drugs</span>
         </p>
      </div>

      {/* Patient Header Box */}
      <div className="bg-white dark:bg-[#101935] p-4 md:p-6 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 shadow-none">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-8">
          {/* Avatar Section */}
          <div className="w-[70px] h-[70px] md:w-[100px] md:h-[100px] rounded-full overflow-hidden border-2 border-gray-100 shrink-0 shadow-none">
             <img 
               src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=150&auto=format&fit=crop" 
               className="w-full h-full object-cover" 
               alt="James Wilson"
             />
          </div>

          {/* Info Section */}
          <div className="flex-1 space-y-4 md:space-y-6 w-full">
            {/* Top Line: Name, Age, Status */}
            <div className="flex flex-col xs:flex-row items-center justify-between gap-3">
              <div className="flex flex-col xs:flex-row items-center gap-2 md:gap-4 text-center xs:text-left">
                <h2 className="text-[18px] md:text-[22px] font-bold text-[#1A1C23] dark:text-white leading-none tracking-tight">James Wilson</h2>
                <span className="text-[12px] md:text-[13px] font-medium text-gray-400 leading-none">62 yrs • Male</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 text-rose-500 text-[9px] font-black uppercase tracking-widest">CRITICAL</span>
            </div>

            {/* Bottom Section: Metadata Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-y-5 gap-x-4 md:gap-8">
              <div>
                <p className="text-[8px] md:text-[9px] font-bold text-gray-400 mb-1 uppercase tracking-widest">UHID</p>
                <p className="text-[12px] md:text-[14px] font-bold text-[#1A1C23] dark:text-white">UHID-839211</p>
              </div>
              <div>
                <p className="text-[8px] md:text-[9px] font-bold text-gray-400 mb-1 uppercase tracking-widest">BED NO.</p>
                <p className="text-[12px] md:text-[14px] font-bold text-[#1A1C23] dark:text-white">ICU-04</p>
              </div>
              <div>
                <p className="text-[8px] md:text-[9px] font-bold text-gray-400 mb-1 uppercase tracking-widest">ADMISSION DATE</p>
                <p className="text-[12px] md:text-[14px] font-bold text-[#1A1C23] dark:text-white">12 Oct 2023</p>
              </div>
              <div className="hidden xs:block">
                <p className="text-[8px] md:text-[9px] font-bold text-gray-400 mb-1 uppercase tracking-widest">ATTENDING</p>
                <p className="text-[12px] md:text-[14px] font-bold text-[#1A1C23] dark:text-white leading-tight">Dr. Sarah Jenkins</p>
              </div>
              <div className="col-span-2 xs:col-span-1 lg:pl-8 lg:border-l lg:border-gray-100 dark:lg:border-white/5 pt-4 xs:pt-0 border-t xs:border-t-0 border-gray-50 dark:border-white/5">
                <p className="text-[8px] md:text-[9px] font-bold text-gray-400 mb-1 uppercase tracking-widest">DIAGNOSIS</p>
                <p className="text-[12px] md:text-[14px] font-bold text-[#1A1C23] dark:text-white leading-tight">Acute Myocardial Infarction</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Action */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4">
        <div className="relative group/tabs">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-full pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={cn(
                  "px-4 md:px-5 py-2.5 rounded-[5px] text-[12px] md:text-[13px] font-bold transition-all whitespace-nowrap",
                  activeTab === tab 
                    ? "bg-[#2D3A8C] text-white" 
                    : "text-[#5E6C84] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
          {/* Subtle scroll indicator for mobile */}
          <div className="absolute right-0 top-0 bottom-1 w-12 bg-gradient-to-l from-[#F8F9FC] dark:from-[#0A0F1D] to-transparent pointer-events-none md:hidden" />
        </div>
        
        {activeTab === "Summary" && (
          <button className="bg-[#2D3A8C] text-white px-6 h-[44px] rounded-[5px] text-[13px] font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-none shrink-0 w-full lg:w-auto">
            <Plus className="w-4 h-4" />
            Add Vitals
          </button>
        )}
      </div>

      {/* Dashboard Content */}
      <div className="w-full">
        {renderTabContent()}
      </div>
    </div>
  );
}
