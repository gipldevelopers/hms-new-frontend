"use client";

import React from "react";
import { 
  X,
  Share2,
  Download,
  Printer,
  ChevronRight,
  MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function LabReportModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-[200] bg-white dark:bg-[#0B1121] overflow-y-auto no-scrollbar font-sans">
      
      {/* Modal Header (Sticky) */}
      <div className="sticky top-0 z-10 bg-white dark:bg-[#0B1121] border-b border-[#E7E8EB] dark:border-white/10 px-4 sm:px-10 h-[72px] flex items-center justify-between">
        <div className="flex items-center gap-3">
           <h1 className="text-[18px] font-bold text-[#1A1C23] dark:text-white">Patients Lab Report</h1>
        </div>
        <div className="flex items-center gap-3">
           <button 
             onClick={onClose}
             className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 transition-all"
           >
             <X className="w-5 h-5" />
           </button>
        </div>
      </div>

      {/* Report Content */}
      <div className="max-w-[1000px] mx-auto p-4 sm:p-10 space-y-10">
        
        {/* Hospital Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
           <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#2D3A8C] rounded-[5px] flex items-center justify-center text-white text-[24px] font-bold">
                 H
              </div>
              <div>
                 <h2 className="text-[22px] font-bold text-[#1A1C23] dark:text-white leading-tight">MedAdmin General Hospital</h2>
                 <p className="text-[13px] text-[#5E6C84] dark:text-slate-500">1200 Healthcare Ave, Medical District, NY 10001</p>
                 <p className="text-[13px] text-[#5E6C84] dark:text-slate-500">Tel: (555) 123-4567 • www.medadmin.hospital</p>
              </div>
           </div>
           <div className="text-right flex flex-col items-end gap-2">
              <h3 className="text-[24px] font-bold text-[#2D3A8C] dark:text-primary leading-tight">LABORATORY REPORT</h3>
              <p className="text-[13px] font-bold text-[#5E6C84] dark:text-slate-500">ORDER #: LAB-90210</p>
              <div className="flex gap-0.5 mt-1">
                 {[...Array(12)].map((_, i) => (
                    <div key={i} className={cn("w-0.5 bg-[#1A1C23] dark:bg-white", i % 3 === 0 ? "h-6" : "h-4")} />
                 ))}
              </div>
           </div>
        </div>

        {/* Patient & Report Metadata */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 border-t border-b border-[#E7E8EB] dark:border-white/10 py-8">
           <div className="space-y-1">
              <p className="text-[10px] font-bold text-[#A0AEC0] uppercase-none">PATIENT NAME</p>
              <p className="text-[14px] font-bold text-[#1A1C23] dark:text-white">Johnnathan Doe</p>
           </div>
           <div className="space-y-1">
              <p className="text-[10px] font-bold text-[#A0AEC0] uppercase-none">AGE / SEX</p>
              <p className="text-[14px] font-bold text-[#1A1C23] dark:text-white">45 Years / Male</p>
           </div>
           <div className="space-y-1">
              <p className="text-[10px] font-bold text-[#A0AEC0] uppercase-none">UHID</p>
              <p className="text-[14px] font-bold text-[#1A1C23] dark:text-white">882910</p>
           </div>
           <div className="space-y-1">
              <p className="text-[10px] font-bold text-[#A0AEC0] uppercase-none">LOCATION</p>
              <p className="text-[14px] font-bold text-[#1A1C23] dark:text-white">Emergency / ICU Bed 04</p>
           </div>

           <div className="space-y-1">
              <p className="text-[10px] font-bold text-[#A0AEC0] uppercase-none">REFERRED BY</p>
              <p className="text-[14px] font-bold text-[#1A1C23] dark:text-white">Dr. Sarah Jenkins</p>
           </div>
           <div className="space-y-1">
              <p className="text-[10px] font-bold text-[#A0AEC0] uppercase-none">SAMPLE DATE</p>
              <p className="text-[14px] font-bold text-[#1A1C23] dark:text-white">Oct 24, 2023, 10:30 AM</p>
           </div>
           <div className="space-y-1">
              <p className="text-[10px] font-bold text-[#A0AEC0] uppercase-none">REPORT DATE</p>
              <p className="text-[14px] font-bold text-[#1A1C23] dark:text-white">Oct 24, 2023, 11:45 AM</p>
           </div>
           <div className="space-y-1">
              <p className="text-[10px] font-bold text-[#A0AEC0] uppercase-none">PRIORITY</p>
              <p className="text-[14px] font-bold text-rose-500 uppercase-none">STAT (CRITICAL)</p>
           </div>
        </div>

        {/* Hematology Section */}
        <div className="space-y-6">
           <div className="bg-[#F8F9FA] dark:bg-[#151D36] px-4 py-3 rounded-[5px]">
              <h4 className="text-[13px] font-bold text-[#1A1C23] dark:text-white uppercase-none">HEMATOLOGY (CBC)</h4>
           </div>
           
           <div className="space-y-8 px-4">
              <LabResultItem label="WBC Count" value="14.2" status="High" refRange="4.5 - 11.0" unit="K/uL" percentage={85} color="bg-rose-500" />
              <LabResultItem label="Hemoglobin" value="13.8" status="" refRange="13.5 - 17.5" unit="G/DL" percentage={65} color="bg-blue-500" />
              <LabResultItem label="Platelets" value="185" status="" refRange="150 - 450" unit="K/uL" percentage={45} color="bg-blue-500" />
              <LabResultItem label="Hematocrit" value="41" status="" refRange="38 - 50" unit="%" percentage={55} color="bg-blue-500" />
           </div>
        </div>

        {/* Cardiac Markers Section */}
        <div className="space-y-6 pt-4">
           <div className="bg-[#F8F9FA] dark:bg-[#151D36] px-4 py-3 rounded-[5px] flex items-center justify-between">
              <h4 className="text-[13px] font-bold text-[#1A1C23] dark:text-white uppercase-none">CARDIAC MARKERS</h4>
              <span className="px-2 py-1 bg-rose-50 dark:bg-rose-500/10 text-rose-500 text-[9px] font-bold rounded-[4px] border border-rose-100 dark:border-rose-500/20 uppercase-none">CRITICAL ABNORMALITIES</span>
           </div>
           
           <div className="space-y-8 px-4">
              <LabResultItem label="Troponin I (High Sensitivity)" value="0.45" status="High" refRange="< 0.04" unit="NG/ML" percentage={95} color="bg-rose-500" />
              <LabResultItem label="CK-MB" value="8.2" status="High" refRange="0 - 3.0" unit="NG/ML" percentage={75} color="bg-rose-500" />
              <LabResultItem label="Myoglobin" value="65" status="" refRange="0 - 85" unit="NG/ML" percentage={60} color="bg-blue-500" />
           </div>
        </div>

        {/* Footer Area */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-[#E7E8EB] dark:border-white/10 pt-10">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[5px] overflow-hidden border border-[#E7E8EB] dark:border-white/10">
                 <img src="https://ui-avatars.com/api/?name=Johnnathan+Doe&background=2D3A8C&color=fff" alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div>
                 <p className="text-[15px] font-bold text-[#1A1C23] dark:text-white leading-none">Johnnathan Doe</p>
                 <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 text-[9px] font-bold rounded-[4px] uppercase-none">COMPLETED</span>
                    <p className="text-[11px] text-[#A0AEC0] font-medium">MRN: 482-991-002 • Report Date: Oct 24, 2023 • Age: 42 (M)</p>
                 </div>
              </div>
           </div>
           
           <div className="flex items-center gap-3">
              <button className="h-10 px-5 border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-bold text-[#5E6C84] dark:text-slate-400 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-white/5 transition-all shadow-none">
                 <Share2 className="w-4 h-4" />
                 Share Report
              </button>
              <button className="h-10 px-5 bg-[#2D3A8C] text-white rounded-[5px] text-[13px] font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-none">
                 <Download className="w-4 h-4" />
                 Download PDF
              </button>
           </div>
        </div>

        <div className="flex justify-between items-center pt-6 text-[10px] text-[#A0AEC0] font-medium border-t border-[#E7E8EB] dark:border-white/10">
           <p>© 2023 City General Hospital - Department of Pathology. This is a secure medical record.</p>
           <div className="flex gap-4">
              <span>Confidentiality Agreement</span>
              <span>Verified Result 2901-X</span>
           </div>
        </div>
      </div>
    </div>
  );
}

function LabResultItem({ label, value, status, refRange, unit, percentage, color }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <p className="text-[13px] font-medium text-[#1A1C23] dark:text-white">{label}</p>
        <div className="flex items-center gap-2">
           <span className="text-[14px] font-bold text-[#1A1C23] dark:text-white">{value}</span>
           {status && <span className={cn("text-[14px] font-bold", status === "High" ? "text-rose-500" : "text-[#1A1C23] dark:text-white")}>{status}</span>}
        </div>
      </div>
      <div className="h-2 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
         <div className={cn("h-full rounded-full transition-all duration-500", color)} style={{ width: `${percentage}%` }} />
      </div>
      <div className="flex justify-between text-[10px] font-medium text-[#A0AEC0] uppercase-none">
         <p>REF: {refRange}</p>
         <p>{unit}</p>
      </div>
    </div>
  );
}
