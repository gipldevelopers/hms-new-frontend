"use client";

import React from "react";
import { ArrowLeft, Printer, Download, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DetailedLabReport({ patient, report, onBack }) {
  const latestAdmission = patient?.admissions?.[0] || {};
  const bedName = latestAdmission.bed?.label || "ICU-04";
  const doctorName = latestAdmission.doctor?.name || "Dr. Sarah Jenkins";
  const diagnosis = latestAdmission.reason || "Acute Myocardial Infarction";
  const admissionDate = latestAdmission.createdAt 
    ? new Date(latestAdmission.createdAt).toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' }) 
    : "12 Oct 2023";
  const uhid = `UHID-${patient?.id?.toString().substring(0, 6).toUpperCase() || "839211"}`;

  // Default test rows based on selected report name
  const isCbc = report?.name?.toLowerCase().includes("blood") || report?.name?.toLowerCase().includes("cbc");
  const isLipid = report?.name?.toLowerCase().includes("lipid");

  let testRows = [];
  let notes = "Clinical correlation is advised. All values verified by automated and manual validation protocols.";
  let verifiedBy = "Dr. Alan Turing, MD Pathologist";

  if (isCbc) {
    testRows = [
      { name: "Hemoglobin (Hb)", result: "11.2", units: "g/dL", range: "13.5 - 17.5", flag: "LOW", isAbnormal: true },
      { name: "White Blood Cells (WBC)", result: "14.5", units: "10^3/μL", range: "4.5 - 11.0", flag: "HIGH", isAbnormal: true },
      { name: "Red Blood Cells (RBC)", result: "4.1", units: "10^6/μL", range: "4.5 - 5.9", flag: "LOW", isAbnormal: true },
      { name: "Platelet Count", result: "185", units: "10^3/μL", range: "150 - 450", flag: "-", isAbnormal: false },
      { name: "Hematocrit (HCT)", result: "34.5", units: "%", range: "41.0 - 50.0", flag: "LOW", isAbnormal: true },
      { name: "Mean Corpuscular Volume (MCV)", result: "84", units: "fL", range: "80.0 - 98.0", flag: "-", isAbnormal: false }
    ];
    notes = "Leukocytosis with neutrophilia noted, consistent with current clinical diagnosis of pneumonia. Mild anemia observed. Correlate clinically.";
  } else if (isLipid) {
    testRows = [
      { name: "Total Cholesterol", result: "240", units: "mg/dL", range: "< 200", flag: "HIGH", isAbnormal: true },
      { name: "Triglycerides", result: "185", units: "mg/dL", range: "< 150", flag: "HIGH", isAbnormal: true },
      { name: "HDL Cholesterol", result: "38", units: "mg/dL", range: "> 40", flag: "LOW", isAbnormal: true },
      { name: "LDL Cholesterol", result: "165", units: "mg/dL", range: "< 100", flag: "HIGH", isAbnormal: true }
    ];
    notes = "Borderline high hyperlipidemia indicated. Dietary modification and follow-up lipid profile in 6 weeks recommended.";
  } else {
    // General placeholder test rows
    testRows = [
      { name: "Reference Marker Alpha", result: "4.2", units: "mmol/L", range: "3.5 - 5.1", flag: "-", isAbnormal: false },
      { name: "Reference Marker Beta", result: "108", units: "mg/dL", range: "70 - 100", flag: "HIGH", isAbnormal: true },
      { name: "Reference Marker Gamma", result: "0.8", units: "ng/mL", range: "0.2 - 1.2", flag: "-", isAbnormal: false }
    ];
    notes = "Minor elevation in Reference Marker Beta. Keep under monitoring. Correlate with general patient clinical progression.";
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-[20px] animate-in fade-in duration-500">
      
      {/* --- HEADER NAVIGATION ROW --- */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-card p-4 px-5 rounded-lg border border-border shadow-none">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 border border-border bg-card text-foreground rounded-lg hover:bg-muted transition-all outline-none"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider leading-none mb-1">
              {patient?.name || "Patient"} / Lab Results
            </p>
            <h2 className="text-[18px] font-black text-foreground uppercase tracking-widest leading-none">
              Lab Result
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handlePrint}
            className="h-11 px-5 border border-border bg-card text-foreground rounded-lg text-[13px] font-bold hover:bg-muted transition-all flex items-center gap-2 outline-none shadow-none"
          >
            <Printer className="w-4 h-4 text-muted-foreground" />
            <span>Print Report</span>
          </button>
          <button 
            onClick={handlePrint}
            className="h-11 px-5 bg-primary text-primary-foreground rounded-lg text-[13px] font-bold hover:opacity-90 transition-all flex items-center gap-2 outline-none shadow-none"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* --- PATIENT METADATA HEADER BOX --- */}
      <div className="bg-card p-5 md:p-6 rounded-lg border border-border shadow-none">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-8">
          <div className="w-[70px] h-[70px] rounded-full border-2 border-border shrink-0 bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-bold text-[28px] uppercase">
              {patient?.name?.charAt(0) || "P"}
            </span>
          </div>
          <div className="flex-1 space-y-4 w-full">
            <div className="flex flex-col sm:flex-row items-center justify-start gap-3 text-center sm:text-left">
              <h2 className="text-[18px] md:text-[20px] font-bold text-foreground leading-none">{patient?.name || "Patient"}</h2>
              <span className="text-[12px] md:text-[13px] font-medium text-muted-foreground leading-none">
                {patient?.age ? `${patient.age} yrs` : "62 yrs"} • {patient?.gender || "Male"}
              </span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-y-5 gap-x-4 md:gap-8">
              <div>
                <p className="text-[8px] md:text-[9px] font-bold text-muted-foreground mb-1 uppercase tracking-widest">UHID</p>
                <p className="text-[12px] md:text-[14px] font-bold text-foreground">{uhid}</p>
              </div>
              <div>
                <p className="text-[8px] md:text-[9px] font-bold text-muted-foreground mb-1 uppercase tracking-widest">BED NO.</p>
                <p className="text-[12px] md:text-[14px] font-bold text-foreground">{bedName}</p>
              </div>
              <div>
                <p className="text-[8px] md:text-[9px] font-bold text-muted-foreground mb-1 uppercase tracking-widest">ADMISSION DATE</p>
                <p className="text-[12px] md:text-[14px] font-bold text-foreground">{admissionDate}</p>
              </div>
              <div>
                <p className="text-[8px] md:text-[9px] font-bold text-muted-foreground mb-1 uppercase tracking-widest">ATTENDING DOCTOR</p>
                <p className="text-[12px] md:text-[14px] font-bold text-foreground leading-tight">{doctorName}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-[8px] md:text-[9px] font-bold text-muted-foreground mb-1 uppercase tracking-widest">DIAGNOSIS</p>
                <p className="text-[12px] md:text-[14px] font-bold text-foreground leading-tight truncate">{diagnosis}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- DETAILED TEST REPORT CARD --- */}
      <div className="bg-card p-5 md:p-6 rounded-lg border border-border shadow-none space-y-6">
        
        {/* Test Name & Identification */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-border pb-5">
          <div className="space-y-2">
            <h3 className="text-[18px] md:text-[20px] font-extrabold text-foreground leading-tight">
              {report?.name || "Laboratory Investigation"}
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-bold rounded-md flex items-center gap-1">
                <Check className="w-3 h-3" /> Final Report
              </span>
              <span className="px-2.5 py-0.5 bg-destructive/10 text-destructive border border-destructive/20 text-[10px] font-bold rounded-md flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Flag: Abnormal
              </span>
            </div>
          </div>
          <div className="text-left md:text-right text-[12px] text-muted-foreground space-y-0.5 font-medium shrink-0">
            <p className="font-bold text-foreground">Accession #: L-849201</p>
            <p>Reported: Oct 13, 2023 14:30</p>
          </div>
        </div>

        {/* Clinical Ordering Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-muted/20 p-5 rounded-lg border border-border text-[13px]">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">ORDERED BY</p>
            <p className="font-bold text-foreground">Dr. Sarah Well</p>
            <p className="text-muted-foreground">Internal Medicine</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">SPECIMEN</p>
            <p className="font-bold text-foreground">Whole Blood (EDTA)</p>
            <p className="text-muted-foreground">Collected: Oct 13, 08:00 AM</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">LOCATION</p>
            <p className="font-bold text-foreground">IPD Ward 1</p>
            <p className="text-muted-foreground">Bed {bedName}</p>
          </div>
        </div>

        {/* Results Table */}
        <div className="overflow-x-auto border border-border rounded-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="px-5 py-3.5 text-left text-[11px] font-bold text-muted-foreground uppercase tracking-widest">TEST DESCRIPTION</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-bold text-muted-foreground uppercase tracking-widest">RESULT</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-bold text-muted-foreground uppercase tracking-widest">UNITS</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-bold text-muted-foreground uppercase tracking-widest">REFERENCE RANGE</th>
                <th className="px-5 py-3.5 text-center text-[11px] font-bold text-muted-foreground uppercase tracking-widest">FLAG</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {testRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-muted/10 transition-colors">
                  <td className="px-5 py-4 text-[13px] font-bold text-foreground">{row.name}</td>
                  <td className={cn(
                    "px-5 py-4 text-[14px] font-black",
                    row.isAbnormal ? "text-destructive" : "text-foreground"
                  )}>
                    {row.result}
                  </td>
                  <td className="px-5 py-4 text-[13px] text-muted-foreground font-medium">{row.units}</td>
                  <td className="px-5 py-4 text-[13px] text-muted-foreground font-medium">{row.range}</td>
                  <td className="px-5 py-4 text-center">
                    {row.isAbnormal ? (
                      <span className="px-2 py-0.5 bg-destructive/10 text-destructive border border-destructive/20 text-[9px] font-black rounded uppercase tracking-tighter inline-flex items-center">
                        {row.flag === "LOW" ? "↓" : "↑"} {row.flag}
                      </span>
                    ) : (
                      <span className="text-[13px] text-muted-foreground/50 font-bold">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Interpretation / Pathology Notes */}
        <div className="space-y-4 pt-4 border-t border-border">
          <div>
            <h4 className="text-[13px] font-black text-foreground mb-2 uppercase tracking-wide">Interpretation / Notes:</h4>
            <p className="text-[13px] text-muted-foreground leading-relaxed max-w-4xl">
              {notes}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">
            <p>Verified by: <span className="text-foreground font-bold">{verifiedBy}</span></p>
            <p>Laboratory Services • Central City Hospital</p>
          </div>
        </div>

      </div>

    </div>
  );
}
