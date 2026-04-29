"use client";

import React, { useState } from "react";
import { 
  ArrowLeft,
  Heart,
  Activity,
  Droplets,
  Pill,
  FileText,
  AlertTriangle,
  Download,
  Share2,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import LabReportModal from "@/components/branch-admin/emergency/LabReportModal";

export default function EmergencyReportView({ params }) {
  const router = useRouter();
  const [showFullReport, setShowFullReport] = useState(false);
  const unwrappedParams = React.use(params);

  const patient = {
    id: unwrappedParams.id,
    name: "Johnnathan Doe",
    age: 45,
    gender: "Male",
    condition: "Chest Pain",
    status: "In Treatment",
    bed: "04 (ICU)",
    priority: "P1 - CRITICAL"
  };

  return (
    <div className="p-4 sm:p-5 bg-[#F8F9FA] dark:bg-[#0B1121] min-h-screen flex flex-col space-y-6 transition-colors duration-300 font-sans pb-20">
      
      {/* Header / Breadcrumb */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </button>
        <h1 className="text-[18px] font-bold text-[#1A1C23] dark:text-white">Patient Report</h1>
      </div>

      {/* Patient Profile Card */}
      <div className="bg-white dark:bg-[#101935] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-none">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 font-bold text-[18px]">
            JD
          </div>
          <div className="space-y-1">
            <h2 className="text-[20px] font-bold text-[#1A1C23] dark:text-white leading-none">{patient.name}</h2>
            <p className="text-[13px] text-[#5E6C84] dark:text-slate-500">{patient.age}y • {patient.gender} • {patient.condition}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-4 py-2 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-[5px] text-center min-w-[100px]">
             <p className="text-[10px] font-bold text-[#5E6C84] dark:text-slate-500 uppercase-none leading-tight mb-0.5">STATUS</p>
             <p className="text-[13px] font-bold text-blue-500 leading-tight">{patient.status}</p>
          </div>
          <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-[5px] text-center min-w-[100px]">
             <p className="text-[10px] font-bold text-[#5E6C84] dark:text-slate-500 uppercase-none leading-tight mb-0.5">BED</p>
             <p className="text-[13px] font-bold text-indigo-500 leading-tight">{patient.bed}</p>
          </div>
          <div className="px-4 py-2 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-[5px] text-center min-w-[100px]">
             <p className="text-[10px] font-bold text-[#5E6C84] dark:text-slate-500 uppercase-none leading-tight mb-0.5">PRIORITY</p>
             <p className="text-[13px] font-bold text-rose-500 leading-tight">{patient.priority}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left / Middle Column (2/3 width on lg) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Core Vitals */}
          <div className="bg-white dark:bg-[#101935] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 p-6 shadow-none">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[15px] font-bold text-[#1A1C23] dark:text-white">Core Vitals</h3>
              <p className="text-[11px] text-[#A0AEC0] font-medium">Last updated: 2m ago</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50/50 dark:bg-white/5 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 flex flex-col items-center justify-center space-y-1">
                 <p className="text-[11px] font-bold text-[#5E6C84] dark:text-slate-500 uppercase-none">HEART RATE</p>
                 <p className="text-[32px] font-bold text-[#2D3A8C] leading-none">88</p>
                 <p className="text-[11px] font-medium text-[#A0AEC0]">bpm</p>
              </div>
              <div className="p-4 bg-gray-50/50 dark:bg-white/5 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 flex flex-col items-center justify-center space-y-1">
                 <p className="text-[11px] font-bold text-[#5E6C84] dark:text-slate-500 uppercase-none">BLOOD PRESSURE</p>
                 <p className="text-[32px] font-bold text-[#2D3A8C] leading-none">120/80</p>
                 <p className="text-[11px] font-medium text-[#A0AEC0]">mmHg</p>
              </div>
              <div className="p-4 bg-gray-50/50 dark:bg-white/5 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 flex flex-col items-center justify-center space-y-1">
                 <p className="text-[11px] font-bold text-[#5E6C84] dark:text-slate-500 uppercase-none">SPO2</p>
                 <p className="text-[32px] font-bold text-emerald-500 leading-none">98%</p>
                 <p className="text-[11px] font-medium text-[#A0AEC0]">Normal range</p>
              </div>
            </div>
          </div>

          {/* Active Medications */}
          <div className="bg-white dark:bg-[#101935] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 p-6 shadow-none">
            <h3 className="text-[15px] font-bold text-[#1A1C23] dark:text-white mb-6">Active Medications</h3>
            <div className="space-y-3">
              {[
                { name: "Dopamine Infusion", dose: "5 mcg/kg/min • Continuous IV", status: "ACTIVE" },
                { name: "Ceftriaxone", dose: "2g • Every 24h • IV Push", status: "ACTIVE" },
                { name: "Heparin", dose: "5000 units • Subcutaneous • TID", status: "PENDING" },
              ].map((med, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-white dark:bg-[#0B1121] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                       <Pill className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-[#1A1C23] dark:text-white">{med.name}</p>
                      <p className="text-[11px] text-[#5E6C84] dark:text-slate-500">{med.dose}</p>
                    </div>
                  </div>
                  <span className={cn(
                    "px-2 py-1 rounded-[4px] text-[9px] font-bold",
                    med.status === "ACTIVE" ? "bg-blue-50 text-blue-500" : "bg-gray-100 text-gray-500"
                  )}>
                    {med.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1/3 width on lg) */}
        <div className="space-y-6">
          
          {/* Recent Lab Results */}
          <div className="bg-white dark:bg-[#101935] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 p-6 shadow-none">
            <h3 className="text-[15px] font-bold text-[#1A1C23] dark:text-white mb-6">Recent Lab Results</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-[13px] font-medium text-[#1A1C23] dark:text-white">WBC Count</p>
                  <p className="text-[13px] font-bold text-rose-500">14.2 High</p>
                </div>
                <div className="h-1.5 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-rose-500 rounded-full w-[85%]" />
                </div>
                <p className="text-[9px] text-[#A0AEC0] mt-1 font-medium">REF: 4.5 - 11.0 <span className="ml-auto float-right">K/uL</span></p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-[13px] font-medium text-[#1A1C23] dark:text-white">Hemoglobin</p>
                  <p className="text-[13px] font-bold text-[#1A1C23] dark:text-white">13.8</p>
                </div>
                <div className="h-1.5 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-500 rounded-full w-[65%]" />
                </div>
                <p className="text-[9px] text-[#A0AEC0] mt-1 font-medium">REF: 13.5 - 17.5 <span className="ml-auto float-right">G/DL</span></p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-[13px] font-medium text-[#1A1C23] dark:text-white">Creatinine</p>
                  <p className="text-[13px] font-bold text-[#1A1C23] dark:text-white">0.9</p>
                </div>
                <div className="h-1.5 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-500 rounded-full w-[45%]" />
                </div>
                <p className="text-[9px] text-[#A0AEC0] mt-1 font-medium">REF: 0.7 - 1.3 <span className="ml-auto float-right">MG/DL</span></p>
              </div>

              <button 
                onClick={() => setShowFullReport(true)}
                className="w-full h-11 border border-blue-100 dark:border-blue-500/20 text-blue-500 rounded-[5px] text-[13px] font-bold hover:bg-blue-50 dark:hover:bg-blue-500/5 transition-all mt-4"
              >
                Full Lab Report
              </button>
            </div>
          </div>

          {/* Allergies */}
          <div className="bg-white dark:bg-[#101935] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 p-6 shadow-none">
            <div className="flex items-center gap-2 mb-6">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <h3 className="text-[15px] font-bold text-[#1A1C23] dark:text-white">Allergies</h3>
            </div>
            
            <div className="p-4 bg-rose-50 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-500/10 rounded-[5px] flex items-start gap-4">
               <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center shrink-0">
                  <X className="w-5 h-5 text-rose-500" />
               </div>
               <div className="space-y-1">
                  <p className="text-[13px] font-bold text-rose-600">Penicillin</p>
                  <p className="text-[11px] text-rose-600/70 font-medium">Reaction: Anaphylaxis / Severe Rash</p>
                  <p className="text-[10px] text-rose-600/50 font-bold uppercase-none mt-1">VERIFIED BY DR. MILLER • 2023</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Lab Report Modal */}
      {showFullReport && <LabReportModal onClose={() => setShowFullReport(false)} />}
    </div>
  );
}
