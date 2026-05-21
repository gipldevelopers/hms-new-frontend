"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowUp, ArrowDown } from "lucide-react";
import { SubmitResultsModal } from "@/components/laboratory/result-entry/SubmitResultsModal";
import { SuccessApprovalModal } from "@/components/laboratory/result-entry/SuccessApprovalModal";
import { AnimatePresence } from "framer-motion";

// Mock Database representing findings for different patients
const PATIENT_DETAILS_DB = {
  "re-0": {
    name: "James Wilson",
    uhid: "UHID-839211",
    ageGender: "62 yrs • Male",
    bedNo: "ICU-04",
    admissionDate: "12 Oct 2023",
    attendingDoctor: "Dr. Sarah Jenkins",
    diagnosis: "Acute Myocardial Infarction",
    priority: "Urgent",
    remarks: "WBC count significantly elevated. RBC morphology appears normal. Please correlate clinically.",
    results: [
      { desc: "Hemoglobin (Hb)", val: "11.2", unit: "g/dL", ref: "13.5 - 17.5", flag: "LOW" },
      { desc: "White Blood Cells (WBC)", val: "14.5", unit: "10^3/µL", ref: "4.5 - 11.0", flag: "HIGH" },
      { desc: "Red Blood Cells (RBC)", val: "4.1", unit: "10^6/µL", ref: "4.5 - 5.9", flag: "LOW" },
      { desc: "Platelet Count", val: "185", unit: "10^3/µL", ref: "150 - 450", flag: null },
      { desc: "Hematocrit (HCT)", val: "34.5", unit: "%", ref: "41.0 - 50.0", flag: "LOW" },
      { desc: "Mean Corpuscular Volume (MCV)", val: "84", unit: "fL", ref: "80.0 - 96.0", flag: null }
    ]
  },
  "re-1": {
    name: "Robert Fox",
    uhid: "UHID-982344",
    ageGender: "45 Yrs • Male",
    bedNo: "Ward B-12",
    admissionDate: "15 Oct 2023",
    attendingDoctor: "Dr. Gregory House",
    diagnosis: "Anemia / Fatigue investigation",
    priority: "Urgent",
    remarks: "Hemoglobin indicates mild anemia. RBC count is borderline low. Suggest checking iron panels.",
    results: [
      { desc: "Hemoglobin (Hb)", val: "12.1", unit: "g/dL", ref: "13.5 - 17.5", flag: "LOW" },
      { desc: "White Blood Cells (WBC)", val: "10.8", unit: "10^3/µL", ref: "4.5 - 11.0", flag: null },
      { desc: "Red Blood Cells (RBC)", val: "4.1", unit: "10^6/µL", ref: "4.5 - 5.9", flag: "LOW" },
      { desc: "Platelet Count", val: "145", unit: "10^3/µL", ref: "150 - 450", flag: "LOW" }
    ]
  },
  "re-2": {
    name: "Esther Howard",
    uhid: "UHID-982355",
    ageGender: "28 Yrs • Female",
    bedNo: "OPD-02",
    admissionDate: "18 Oct 2023",
    attendingDoctor: "Dr. Sarah Jenkins",
    diagnosis: "Routine Lipid Screening",
    priority: "High",
    remarks: "Total cholesterol and LDL elevated. Recommend dietary adjustment and follow up in 3 months.",
    results: [
      { desc: "Total Cholesterol", val: "245", unit: "mg/dL", ref: "100 - 200", flag: "HIGH" },
      { desc: "Triglycerides", val: "185", unit: "mg/dL", ref: "50 - 150", flag: "HIGH" },
      { desc: "HDL Cholesterol", val: "38", unit: "mg/dL", ref: "40 - 60", flag: "LOW" },
      { desc: "LDL Cholesterol", val: "168", unit: "mg/dL", ref: "50 - 130", flag: "HIGH" }
    ]
  },
  "re-3": {
    name: "Esther Howard",
    uhid: "UHID-982355",
    ageGender: "28 Yrs • Female",
    bedNo: "OPD-02",
    admissionDate: "18 Oct 2023",
    attendingDoctor: "Dr. Sarah Jenkins",
    diagnosis: "Routine Lipid Screening",
    priority: "High",
    remarks: "Total cholesterol and LDL elevated. Recommend dietary adjustment and follow up in 3 months.",
    results: [
      { desc: "Total Cholesterol", val: "245", unit: "mg/dL", ref: "100 - 200", flag: "HIGH" },
      { desc: "Triglycerides", val: "185", unit: "mg/dL", ref: "50 - 150", flag: "HIGH" },
      { desc: "HDL Cholesterol", val: "38", unit: "mg/dL", ref: "40 - 60", flag: "LOW" },
      { desc: "LDL Cholesterol", val: "168", unit: "mg/dL", ref: "50 - 130", flag: "HIGH" }
    ]
  },
  "re-4": {
    name: "Jenny Wilson",
    uhid: "UHID-982366",
    ageGender: "38 Yrs • Female",
    bedNo: "ICU-08",
    admissionDate: "20 Oct 2023",
    attendingDoctor: "Dr. Sarah Jenkins",
    diagnosis: "Jaundice Evaluation",
    priority: "Normal",
    remarks: "Liver enzymes are within normal limits. Bilirubin is slightly elevated but stable.",
    results: [
      { desc: "Total Bilirubin", val: "0.9", unit: "mg/dL", ref: "0.1 - 1.2", flag: null },
      { desc: "SGOT / AST", val: "24", unit: "U/L", ref: "8 - 48", flag: null },
      { desc: "SGPT / ALT", val: "32", unit: "U/L", ref: "7 - 56", flag: null },
      { desc: "Alkaline Phosphatase", val: "98", unit: "U/L", ref: "44 - 147", flag: null }
    ]
  },
  "re-5": {
    name: "Cameron Williamson",
    uhid: "UHID-982377",
    ageGender: "51 Yrs • Male",
    bedNo: "Ward A-04",
    admissionDate: "22 Oct 2023",
    attendingDoctor: "Dr. Allison Cameron",
    diagnosis: "Hypothyroidism Assessment",
    priority: "Normal",
    remarks: "TSH level indicates adequate replacement dose. Free T4 and T3 values are within expectations.",
    results: [
      { desc: "TSH (Thyroid Stimulating)", val: "1.8", unit: "µIU/mL", ref: "0.4 - 4.0", flag: null },
      { desc: "Free T3", val: "3.1", unit: "pg/mL", ref: "2.3 - 4.2", flag: null },
      { desc: "Free T4", val: "1.2", unit: "ng/dL", ref: "0.8 - 1.8", flag: null }
    ]
  },
  "re-6": {
    name: "Wade Warren",
    uhid: "UHID-982388",
    ageGender: "59 Yrs • Male",
    bedNo: "Emergency-04",
    admissionDate: "23 Oct 2023",
    attendingDoctor: "Dr. Sarah Jenkins",
    diagnosis: "Dehydration assessment",
    priority: "Normal",
    remarks: "Glucose and kidney values normal. Sodium slightly high, likely related to mild dehydration.",
    results: [
      { desc: "Glucose (Fasting)", val: "88", unit: "mg/dL", ref: "70 - 99", flag: null },
      { desc: "BUN", val: "12", unit: "mg/dL", ref: "7 - 20", flag: null },
      { desc: "Creatinine", val: "0.85", unit: "mg/dL", ref: "0.6 - 1.2", flag: null },
      { desc: "Sodium", val: "148", unit: "mEq/L", ref: "136 - 145", flag: "HIGH" }
    ]
  }
};

function DetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "re-0"; // default to re-0 James Wilson

  const [patient, setPatient] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  useEffect(() => {
    const resolvedData = PATIENT_DETAILS_DB[id] || PATIENT_DETAILS_DB["re-0"];
    setPatient(resolvedData);
  }, [id]);

  const handleGoBack = () => {
    router.push("/laboratory/result-entry");
  };

  const handleAction = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => {
      setSuccessMsg("");
      router.push("/laboratory/result-entry");
    }, 1500);
  };

  if (!patient) {
    return (
      <div className="flex items-center justify-center p-[40px] text-muted-foreground font-semibold bg-card border border-border rounded-[5px] shadow-none">
        Loading lab result details...
      </div>
    );
  }

  return (
    <div className="space-y-[20px]">
      {/* Page Header and Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleGoBack}
          className="p-2 border border-border bg-card rounded-[5px] text-muted-foreground hover:text-foreground hover:bg-muted/10 cursor-pointer transition-colors shadow-none outline-none"
          aria-label="Go Back"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-[12px] text-muted-foreground font-semibold">
            <span>{patient.name}</span>
            <span>/</span>
            <span>Lab Results</span>
            {patient.priority === "Urgent" && (
              <span className="bg-red-500/10 text-red-600 px-2 py-0.5 rounded-[5px] text-[10px] font-bold border border-red-200/20">
                Urgent
              </span>
            )}
            {patient.priority === "High" && (
              <span className="bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-[5px] text-[10px] font-bold border border-amber-200/20">
                High
              </span>
            )}
          </div>
          <h1 className="text-[20px] font-bold text-foreground leading-tight mt-0.5">
            Lab Result
          </h1>
        </div>
      </div>

      {/* Patient Demographics Card */}
      <div className="bg-card border border-border rounded-[5px] p-[20px] shadow-none flex flex-col md:flex-row items-start md:items-center gap-[20px] transition-colors duration-300">
        {/* Avatar Profile Image */}
        <div className="w-[54px] h-[54px] rounded-full overflow-hidden bg-background border border-border/80 flex items-center justify-center shrink-0 select-none">
          <svg className="w-10 h-10 text-muted-foreground/80" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>

        {/* Info Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-[20px] md:gap-[15px]">
          {/* Patient Profile */}
          <div className="flex flex-col gap-0.5 md:col-span-1">
            <h2 className="text-[15px] font-bold text-foreground leading-snug truncate">
              {patient.name}
            </h2>
            <span className="text-[12px] text-muted-foreground font-semibold">
              {patient.ageGender}
            </span>
          </div>

          {/* UHID */}
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-bold text-muted-foreground/85 uppercase tracking-wide">
              UHID
            </span>
            <span className="text-[13px] font-bold text-foreground truncate">
              {patient.uhid}
            </span>
          </div>

          {/* Bed No */}
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-bold text-muted-foreground/85 uppercase tracking-wide">
              Bed No.
            </span>
            <span className="text-[13px] font-bold text-foreground truncate">
              {patient.bedNo}
            </span>
          </div>

          {/* Admission Date */}
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-bold text-muted-foreground/85 uppercase tracking-wide">
              Admission Date
            </span>
            <span className="text-[13px] font-bold text-foreground truncate">
              {patient.admissionDate}
            </span>
          </div>

          {/* Attending Doctor */}
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-bold text-muted-foreground/85 uppercase tracking-wide">
              Attending Doctor
            </span>
            <span className="text-[13px] font-bold text-foreground truncate">
              {patient.attendingDoctor}
            </span>
          </div>

          {/* Diagnosis Row - spans full columns on larger grid */}
          <div className="flex flex-col gap-0.5 sm:col-span-2 md:col-span-5 md:mt-2 pt-2 border-t border-border/40">
            <span className="text-[11px] font-bold text-muted-foreground/85 uppercase tracking-wide">
              Diagnosis
            </span>
            <span className="text-[13px] font-bold text-foreground">
              {patient.diagnosis}
            </span>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successMsg && (
        <div className="p-4 bg-emerald-500 text-white rounded-[5px] font-bold text-[13px] border border-emerald-600 shadow-none animate-pulse">
          {successMsg}
        </div>
      )}

      {/* Lab Results Table Card */}
      <div className="bg-card border border-border rounded-[5px] overflow-hidden shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/10 border-b border-border text-[12px] font-bold text-muted-foreground/80">
                <th className="px-[20px] py-[15px] tracking-normal">Test Description</th>
                <th className="px-[20px] py-[15px] tracking-normal">Result</th>
                <th className="px-[20px] py-[15px] tracking-normal">Units</th>
                <th className="px-[20px] py-[15px] tracking-normal">Reference Range</th>
                <th className="px-[20px] py-[15px] tracking-normal text-right pr-[30px] w-[140px]">Flag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-[13.5px]">
              {patient.results.map((row, idx) => {
                const isLow = row.flag === "LOW";
                const isHigh = row.flag === "HIGH";

                return (
                  <tr key={idx} className="hover:bg-muted/5 transition-colors duration-150">
                    <td className="px-[20px] py-[15px] font-semibold text-foreground/90">
                      {row.desc}
                    </td>
                    <td className={`px-[20px] py-[15px] font-bold ${row.flag ? "text-red-500" : "text-foreground"}`}>
                      {row.val}
                    </td>
                    <td className="px-[20px] py-[15px] text-muted-foreground/95 font-semibold">
                      {row.unit}
                    </td>
                    <td className="px-[20px] py-[15px] text-muted-foreground/95 font-semibold">
                      {row.ref}
                    </td>
                    <td className="px-[20px] py-[15px] text-right pr-[30px]">
                      {isLow && (
                        <span className="inline-flex items-center gap-1 rounded-[5px] bg-red-500/10 px-2.5 py-0.5 text-[11px] font-bold text-red-600 dark:text-red-400 border border-red-200/40">
                          <ArrowDown size={11} className="stroke-[2.5]" /> LOW
                        </span>
                      )}
                      {isHigh && (
                        <span className="inline-flex items-center gap-1 rounded-[5px] bg-red-500/10 px-2.5 py-0.5 text-[11px] font-bold text-red-600 dark:text-red-400 border border-red-200/40">
                          <ArrowUp size={11} className="stroke-[2.5]" /> HIGH
                        </span>
                      )}
                      {!row.flag && (
                        <span className="text-muted-foreground/50 font-semibold select-none pr-3">
                          -
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Technician Remarks */}
      <div className="flex flex-col gap-2">
        <span className="text-[13px] font-bold text-foreground">
          Technician Remarks
        </span>
        <div className="bg-card border border-border rounded-[5px] p-[16px] text-[13px] text-foreground font-semibold leading-relaxed">
          {patient.remarks}
        </div>
      </div>

      {/* Actions footer box */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          onClick={() => handleAction("Results sent back for retest. Redirecting...")}
          className="h-10 px-4 bg-card border border-primary text-primary font-bold text-[13px] rounded-[5px] hover:bg-primary/5 transition-colors cursor-pointer shadow-none outline-none"
        >
          Send for Retest
        </button>
        <button
          onClick={() => setIsSubmitModalOpen(true)}
          className="h-10 px-5 bg-primary text-primary-foreground border border-primary font-bold text-[13px] rounded-[5px] hover:bg-primary/95 transition-colors cursor-pointer shadow-none outline-none inline-flex items-center gap-1.5"
        >
          <span>Submit for Approval</span>
          <span className="text-[14px]">→</span>
        </button>
      </div>

      <AnimatePresence>
        {isSubmitModalOpen && (
          <SubmitResultsModal
            onClose={() => setIsSubmitModalOpen(false)}
            onConfirm={() => {
              setIsSubmitModalOpen(false);
              setIsSuccessModalOpen(true);
            }}
            patient={patient}
          />
        )}
        {isSuccessModalOpen && (
          <SuccessApprovalModal
            onClose={() => {
              setIsSuccessModalOpen(false);
              router.push("/laboratory/result-entry");
            }}
          />
        )}
      </AnimatePresence>

    </div>
  );
}

export default function ResultsEntryDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-[40px] text-muted-foreground font-semibold bg-card border border-border rounded-[5px]">
          Loading details...
        </div>
      }
    >
      <div className="p-[20px] bg-background text-foreground min-h-screen space-y-[20px] font-sans transition-colors duration-300">
        <DetailContent />
      </div>
    </Suspense>
  );
}
