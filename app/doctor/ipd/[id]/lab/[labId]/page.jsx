"use client";

import React from "react";
import { 
  ArrowLeft, 
  Printer, 
  Download, 
  ArrowUp, 
  ArrowDown,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";

const PATIENT_DATA = {
  name: "James Wilson",
  ageGender: "62 yrs • Male",
  status: "CRITICAL",
  uhid: "UHID-839211",
  bedNo: "ICU-04",
  admissionDate: "12 Oct 2023",
  attendingDoctor: "Dr. Sarah Jenkins",
  diagnosis: "Acute Myocardial Infarction",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James"
};

const REPORT_HEADER = {
  testName: "Complete Blood Count (CBC)",
  status: "Final Report",
  flag: "Abnormal",
  accessionNo: "L-849201",
  reportedDate: "Oct 13, 2023 14:30"
};

const ORDER_INFO = [
  { label: "Patient", value: "Robert Chen", subValue: "45 yrs, Male" },
  { label: "Ordered By", value: "Dr. Sarah Well", subValue: "Internal Medicine" },
  { label: "Specimen", value: "Whole Blood (EDTA)", subValue: "Collected: Oct 13, 09:00 AM" },
  { label: "Location", value: "IPD Ward 1", subValue: "Bed W1-102" },
];

const CBC_RESULTS = [
  { desc: "Hemoglobin (Hb)", result: "11.2", units: "g/dL", range: "13.5 - 17.5", flag: "LOW", color: "text-rose-500" },
  { desc: "White Blood Cells (WBC)", result: "14.5", units: "10^3/µL", range: "4.5 - 11.0", flag: "HIGH", color: "text-rose-500" },
  { desc: "Red Blood Cells (RBC)", result: "4.1", units: "10^6/µL", range: "4.5 - 5.9", flag: "LOW", color: "text-rose-500" },
  { desc: "Platelet Count", result: "185", units: "10^3/µL", range: "150 - 450", flag: null, color: "text-[#1A1C23]" },
  { desc: "Hematocrit (HCT)", result: "34.5", units: "%", range: "41.0 - 50.0", flag: "LOW", color: "text-rose-500" },
  { desc: "Mean Corpuscular Volume (MCV)", result: "84", units: "fL", range: "80.0 - 96.0", flag: null, color: "text-[#1A1C23]" },
];

export default function LabResultDetailPage() {
  const params = useParams();
  const patientId = params.id;

  return (
    <div className="p-[20px] bg-[#F8F9FC] dark:bg-[#0A0F1D] min-h-screen flex flex-col space-y-[20px] transition-colors duration-300 font-sans pb-20">
      
      {/* ── Header Area ── */}
      <div className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 p-4 rounded-[5px] flex flex-col sm:flex-row justify-between items-center gap-4 shadow-none">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Link 
            href={`/doctor/ipd/${patientId}?tab=Lab Results`}
            className="w-10 h-10 flex items-center justify-center rounded-[5px] border border-[#E7E8EB] dark:border-white/10 bg-white dark:bg-[#1e293b] hover:bg-gray-50 transition-all shadow-none"
          >
            <ArrowLeft className="w-5 h-5 text-[#5E6C84]" />
          </Link>
          <div className="flex flex-col">
             <div className="flex items-center gap-2 text-[12px] font-medium text-[#5E6C84]">
               <span>{PATIENT_DATA.name}</span>
               <span>/</span>
               <span>Lab Results</span>
             </div>
             <h1 className="text-[18px] font-bold text-[#1A1C23] dark:text-white leading-none mt-1">Lab Result</h1>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none h-10 px-4 bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-bold text-[#1A1C23] dark:text-white flex items-center justify-center gap-2 hover:bg-gray-50 transition-all shadow-none">
            <Printer className="w-4 h-4" />
            Print Report
          </button>
          <button className="flex-1 sm:flex-none h-10 px-4 bg-[#2D3A8C] text-white rounded-[5px] text-[13px] font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-none">
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>

      {/* ── Reused Patient Header Card ── */}
      <div className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 p-6 rounded-[5px] shadow-none flex flex-col lg:flex-row gap-8">
        <div className="flex items-center gap-5 min-w-[280px]">
          <div className="w-20 h-20 rounded-[5px] overflow-hidden bg-gray-100 dark:bg-white/10 border border-[#E7E8EB] dark:border-white/10 relative">
            <img 
              src={PATIENT_DATA.avatar} 
              alt={PATIENT_DATA.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h2 className="text-[24px] font-bold text-[#1A1C23] dark:text-white leading-none">{PATIENT_DATA.name}</h2>
              <span className="px-3 py-1 bg-rose-50 dark:bg-rose-500/10 text-rose-500 text-[10px] font-bold rounded-full border border-rose-100 dark:border-rose-500/20">{PATIENT_DATA.status}</span>
            </div>
            <p className="text-[14px] text-[#5E6C84] dark:text-slate-400 font-medium">{PATIENT_DATA.ageGender}</p>
            <div className="mt-2 text-[11px] font-bold text-[#5E6C84] uppercase tracking-wider">UHID</div>
            <p className="text-[14px] font-bold text-[#1A1C23] dark:text-white leading-none">{PATIENT_DATA.uhid}</p>
          </div>
        </div>
        <div className="hidden lg:block w-[1px] bg-[#E7E8EB] dark:bg-white/10 self-stretch" />
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6">
          <InfoItem label="Bed No." value={PATIENT_DATA.bedNo} />
          <InfoItem label="Admission Date" value={PATIENT_DATA.admissionDate} />
          <InfoItem label="Attending Doctor" value={PATIENT_DATA.attendingDoctor} />
          <InfoItem label="Diagnosis" value={PATIENT_DATA.diagnosis} />
        </div>
      </div>

      {/* ── Lab Report Content ── */}
      <div className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] overflow-hidden shadow-none">
        {/* Report Header Section */}
        <div className="p-6 border-b border-[#E7E8EB] dark:border-white/10 flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h3 className="text-[20px] font-bold text-[#1A1C23] dark:text-white">{REPORT_HEADER.testName}</h3>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1.5 text-[13px] font-bold text-emerald-500">
                <CheckCircle2 className="w-4 h-4" />
                {REPORT_HEADER.status}
              </div>
              <div className="w-[1px] h-4 bg-[#E7E8EB] dark:bg-white/10" />
              <div className="text-[13px] font-bold text-rose-500">
                Flag: {REPORT_HEADER.flag}
              </div>
            </div>
          </div>
          <div className="text-right flex flex-col gap-1 items-end">
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-bold text-[#5E6C84]">Accession #:</span>
              <span className="text-[12px] font-bold text-[#1A1C23] dark:text-white">{REPORT_HEADER.accessionNo}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-bold text-[#5E6C84]">Reported:</span>
              <span className="text-[12px] font-bold text-[#1A1C23] dark:text-white">{REPORT_HEADER.reportedDate}</span>
            </div>
          </div>
        </div>

        {/* Order Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 border-b border-[#E7E8EB] dark:border-white/10">
          {ORDER_INFO.map((info, idx) => (
            <div key={idx} className={cn("p-6", idx !== ORDER_INFO.length - 1 && "md:border-r border-[#E7E8EB] dark:border-white/10")}>
              <p className="text-[10px] font-bold text-[#5E6C84] uppercase tracking-wider mb-2">{info.label}</p>
              <p className="text-[14px] font-bold text-[#1A1C23] dark:text-white leading-tight">{info.value}</p>
              <p className="text-[12px] font-medium text-[#5E6C84] dark:text-slate-400 mt-1">{info.subValue}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] overflow-hidden shadow-none">
        {/* Results Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[#F8F9FC] dark:bg-white/[0.02] border-b border-[#E7E8EB] dark:border-white/10 text-[11px] font-bold text-[#5E6C84] uppercase tracking-wider">
                <th className="px-6 py-5">Test Description</th>
                <th className="px-6 py-5">Result</th>
                <th className="px-6 py-5">Units</th>
                <th className="px-6 py-5">Reference Range</th>
                <th className="px-6 py-5">Flag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E8EB] dark:divide-white/5">
              {CBC_RESULTS.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#F8F9FC] dark:hover:bg-white/[0.01] transition-colors">
                  <td className="px-6 py-4 text-[13px] font-bold text-[#1A1C23] dark:text-white">{row.desc}</td>
                  <td className={cn("px-6 py-4 text-[14px] font-bold", row.color)}>{row.result}</td>
                  <td className="px-6 py-4 text-[13px] font-medium text-[#5E6C84] dark:text-slate-400">{row.units}</td>
                  <td className="px-6 py-4 text-[13px] font-medium text-[#5E6C84] dark:text-slate-400">{row.range}</td>
                  <td className="px-6 py-4">
                    {row.flag && (
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-[10px] font-bold",
                        row.flag === "LOW" ? "bg-rose-50 text-rose-500" : "bg-rose-50 text-rose-600"
                      )}>
                        {row.flag === "LOW" ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />}
                        {row.flag}
                      </span>
                    )}
                    {!row.flag && <span className="text-gray-300">-</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Interpretation Section */}
        <div className="p-6 border-t border-[#E7E8EB] dark:border-white/10 bg-white dark:bg-[#101935]">
           <h4 className="text-[14px] font-bold text-[#1A1C23] dark:text-white mb-3">Interpretation / Notes:</h4>
           <p className="text-[13px] text-[#5E6C84] dark:text-slate-400 leading-relaxed font-medium">
             Leukocytosis with neutrophilia noted, consistent with current clinical diagnosis of pneumonia. Mild anemia observed. Correlate clinically.
           </p>
           <div className="mt-8 flex flex-col md:flex-row justify-between items-end md:items-center gap-4 pt-8 border-t border-dashed border-[#E7E8EB] dark:border-white/10">
              <p className="text-[11px] font-bold text-[#5E6C84]">
                Verified by: <span className="text-[#1A1C23] dark:text-white font-bold">Dr. Alan Turing, MD Pathologist</span>
              </p>
              <p className="text-[11px] font-bold text-[#5E6C84] text-right">
                Laboratory Services • Central City Hospital
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-[10px] font-bold text-[#5E6C84] dark:text-slate-500 uppercase tracking-wider leading-none mb-1">{label}</p>
      <p className="text-[14px] font-bold text-[#1A1C23] dark:text-white tracking-tight leading-tight">{value}</p>
    </div>
  );
}
