"use client";
import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Printer, Download, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Mock database matching all active and historical patients in Sample Collection list
const PATIENT_REPORTS = {
  "robert-1": {
    name: "Robert Fox",
    ageGender: "45 yrs • Male",
    uhid: "UHID-98234",
    bedNo: "Bed 12",
    admissionDate: "18 Oct 2023",
    attendingDoctor: "Dr. Sarah Jenkins",
    diagnosis: "Acute Coronary Syndrome",
    accession: "L-849202",
    reported: "Oct 18, 2023 14:30",
    orderedBy: "Dr. Sarah Well",
    department: "Internal Medicine",
    specimen: "Whole Blood (EDTA)",
    collectedTime: "Oct 18, 08:00 AM",
    location: "IPD Ward A",
    subLocation: "Bed A1-012"
  },
  "robert-2": {
    name: "Robert Fox",
    ageGender: "45 yrs • Male",
    uhid: "UHID-98234",
    bedNo: "Bed 12",
    admissionDate: "18 Oct 2023",
    attendingDoctor: "Dr. Sarah Jenkins",
    diagnosis: "Acute Coronary Syndrome",
    accession: "L-849203",
    reported: "Oct 18, 2023 14:30",
    orderedBy: "Dr. Sarah Well",
    department: "Internal Medicine",
    specimen: "Whole Blood (EDTA)",
    collectedTime: "Oct 18, 08:00 AM",
    location: "IPD Ward A",
    subLocation: "Bed A1-012"
  },
  "robert-3": {
    name: "Robert Fox",
    ageGender: "45 yrs • Male",
    uhid: "UHID-98234",
    bedNo: "Bed 12",
    admissionDate: "18 Oct 2023",
    attendingDoctor: "Dr. Sarah Jenkins",
    diagnosis: "Acute Coronary Syndrome",
    accession: "L-849204",
    reported: "Oct 18, 2023 14:30",
    orderedBy: "Dr. Sarah Well",
    department: "Internal Medicine",
    specimen: "Whole Blood (EDTA)",
    collectedTime: "Oct 18, 08:00 AM",
    location: "IPD Ward A",
    subLocation: "Bed A1-012"
  },
  "robert-4": {
    name: "Robert Fox",
    ageGender: "45 yrs • Male",
    uhid: "UHID-98234",
    bedNo: "Bed 12",
    admissionDate: "18 Oct 2023",
    attendingDoctor: "Dr. Sarah Jenkins",
    diagnosis: "Acute Coronary Syndrome",
    accession: "L-849205",
    reported: "Oct 18, 2023 14:30",
    orderedBy: "Dr. Sarah Well",
    department: "Internal Medicine",
    specimen: "Whole Blood (EDTA)",
    collectedTime: "Oct 18, 08:00 AM",
    location: "IPD Ward A",
    subLocation: "Bed A1-012"
  },
  "robert-5": {
    name: "Robert Fox",
    ageGender: "45 yrs • Male",
    uhid: "UHID-98234",
    bedNo: "Bed 12",
    admissionDate: "18 Oct 2023",
    attendingDoctor: "Dr. Sarah Jenkins",
    diagnosis: "Acute Coronary Syndrome",
    accession: "L-849206",
    reported: "Oct 18, 2023 14:30",
    orderedBy: "Dr. Sarah Well",
    department: "Internal Medicine",
    specimen: "Whole Blood (EDTA)",
    collectedTime: "Oct 18, 08:00 AM",
    location: "IPD Ward A",
    subLocation: "Bed A1-012"
  },
  "jane-1": {
    name: "Jane Cooper",
    ageGender: "34 yrs • Female",
    uhid: "UHID-98235",
    bedNo: "Bed 05",
    admissionDate: "19 Oct 2023",
    attendingDoctor: "Dr. Sarah Jenkins",
    diagnosis: "Hypothyroidism",
    accession: "L-849207",
    reported: "Oct 19, 2023 14:30",
    orderedBy: "Dr. Sarah Well",
    department: "Internal Medicine",
    specimen: "Whole Blood (EDTA)",
    collectedTime: "Oct 19, 08:00 AM",
    location: "IPD Ward B",
    subLocation: "Bed B2-005"
  },
  "albert-1": {
    name: "Albert Flores",
    ageGender: "52 yrs • Male",
    uhid: "UHID-98236",
    bedNo: "Bed 03",
    admissionDate: "20 Oct 2023",
    attendingDoctor: "Dr. Sarah Jenkins",
    diagnosis: "Renal Impairment",
    accession: "L-849208",
    reported: "Oct 20, 2023 14:30",
    orderedBy: "Dr. Sarah Well",
    department: "Internal Medicine",
    specimen: "Urine Specimen",
    collectedTime: "Oct 20, 08:00 AM",
    location: "IPD Ward A",
    subLocation: "Bed A1-003"
  },
  "esther-1": {
    name: "Esther Howard",
    ageGender: "29 yrs • Female",
    uhid: "UHID-98237",
    bedNo: "Clinic 2",
    admissionDate: "20 Oct 2023",
    attendingDoctor: "Dr. Sarah Jenkins",
    diagnosis: "Chest Pain Evaluation",
    accession: "L-849209",
    reported: "Oct 20, 2023 14:30",
    orderedBy: "Dr. Sarah Well",
    department: "Internal Medicine",
    specimen: "Citrate Plasma",
    collectedTime: "Oct 20, 08:00 AM",
    location: "OPD",
    subLocation: "Clinic 002"
  }
};

// Default Report Details matching reference screenshot exactly
const DEFAULT_REPORT = {
  name: "James Wilson",
  ageGender: "62 yrs • Male",
  uhid: "UHID-839211",
  bedNo: "ICU-04",
  admissionDate: "12 Oct 2023",
  attendingDoctor: "Dr. Sarah Jenkins",
  diagnosis: "Acute Myocardial Infarction",
  accession: "L-849201",
  reported: "Oct 13, 2023 14:30",
  orderedBy: "Dr. Sarah Well",
  department: "Internal Medicine",
  specimen: "Whole Blood (EDTA)",
  collectedTime: "Oct 13, 08:00 AM",
  location: "IPD Ward 1",
  subLocation: "Bed W1-102"
};

// Standard complete test results rows
const TEST_ROWS = [
  {
    description: "Hemoglobin (Hb)",
    result: "11.2",
    units: "g/dL",
    referenceRange: "13.5 - 17.5",
    flag: "Low",
    isAbnormal: true
  },
  {
    description: "White Blood Cells (WBC)",
    result: "14.5",
    units: "10^3/µL",
    referenceRange: "4.5 - 11.0",
    flag: "High",
    isAbnormal: true
  },
  {
    description: "Red Blood Cells (RBC)",
    result: "4.1",
    units: "10^6/µL",
    referenceRange: "4.5 - 5.9",
    flag: "Low",
    isAbnormal: true
  },
  {
    description: "Platelet Count",
    result: "185",
    units: "10^3/µL",
    referenceRange: "150 - 450",
    flag: "-",
    isAbnormal: false
  },
  {
    description: "Hematocrit (HCT)",
    result: "34.5",
    units: "%",
    referenceRange: "41.0 - 50.0",
    flag: "Low",
    isAbnormal: true
  },
  {
    description: "Mean Corpuscular Volume (MCV)",
    result: "84",
    units: "fL",
    referenceRange: "80.0 - 98.0",
    flag: "-",
    isAbnormal: false
  }
];

function ReportContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [orderData, setOrderData] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [results, setResults] = useState([]);
  const [reportGenerated, setReportGenerated] = useState(false);

  // Fetch authentic order details from backend
  useEffect(() => {
    async function fetchOrder() {
      if (!id) {
        setLoadingOrder(false);
        return;
      }
      try {
        const token = localStorage.getItem("authtoken");
        const res = await fetch(`/api/laboratory/test-orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.ok) {
          const result = await res.json();
          if (result.success && result.data) {
            setOrderData(result.data);
          }
        }
      } catch (err) {
        console.error("Error loading order from backend:", err);
      } finally {
        setLoadingOrder(false);
      }
    }
    fetchOrder();
  }, [id]);

  // Map demographics dynamically
  const data = orderData ? {
    name: orderData.patient?.name || [orderData.patient?.firstName, orderData.patient?.lastName].filter(Boolean).join(" ") || "Patient",
    ageGender: `${orderData.patient?.age || "N/A"} yrs • ${orderData.patient?.gender || "N/A"}`,
    uhid: orderData.patient?.uhid || `UHID-${orderData.patient?.id ? orderData.patient?.id.slice(0, 8).toUpperCase() : "UNKNOWN"}`,
    bedNo: orderData.patient?.bedNo || "N/A",
    admissionDate: orderData.createdAt ? new Date(orderData.createdAt).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' }) : "N/A",
    attendingDoctor: orderData.doctorName || "Dr. Sarah Jenkins",
    diagnosis: orderData.clinicalNotes || "N/A",
    accession: orderData.orderNumber || orderData.orderId || `L-${orderData.id ? orderData.id.slice(0, 6).toUpperCase() : "UNKNOWN"}`,
    reported: orderData.createdAt ? new Date(orderData.createdAt).toLocaleString([], { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : "N/A",
    orderedBy: orderData.doctorName || "Dr. Sarah Well",
    department: orderData.departmentName || "Internal Medicine",
    specimen: "Whole Blood (EDTA)",
    collectedTime: orderData.createdAt ? new Date(new Date(orderData.createdAt).getTime() + 15 * 60 * 1000).toLocaleString([], { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : "N/A",
    location: orderData.patient?.ward || "IPD Ward A",
    subLocation: orderData.patient?.bedNo || "N/A"
  } : PATIENT_REPORTS[id] || DEFAULT_REPORT;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isGenerated = localStorage.getItem(`report-generated-${id || "james-wilson"}`) === "true";
      setReportGenerated(isGenerated);

      const savedResults = localStorage.getItem(`report-results-${id || "james-wilson"}`);
      if (savedResults) {
        try {
          const parsed = JSON.parse(savedResults);
          const standardized = parsed.map(r => {
            const valNum = parseFloat(r.result);
            const minVal = parseFloat(r.minValue);
            const maxVal = parseFloat(r.maxValue);

            let flag = "-";
            let isAbnormal = false;

            if (!isNaN(valNum)) {
              if (!isNaN(minVal) && valNum < minVal) {
                flag = "Low";
                isAbnormal = true;
              } else if (!isNaN(maxVal) && valNum > maxVal) {
                flag = "High";
                isAbnormal = true;
              }
            }

            let referenceRange = "Normal Range";
            if (!isNaN(minVal) && !isNaN(maxVal)) {
              referenceRange = `${r.minValue} - ${r.maxValue}`;
            } else if (!isNaN(minVal)) {
              referenceRange = `>= ${r.minValue}`;
            } else if (!isNaN(maxVal)) {
              referenceRange = `<= ${r.maxValue}`;
            } else if (r.referenceRange) {
              referenceRange = r.referenceRange;
            }

            return {
              description: r.name,
              result: r.result,
              units: r.units,
              referenceRange,
              flag,
              isAbnormal
            };
          });
          setResults(standardized);
        } catch (e) {
          console.error("Error parsing results", e);
        }
      }
    }
  }, [id]);

  const handlePrint = () => {
    toast.success(`Sent Lab Result report for ${data.name} to printer.`);
  };

  const handleDownload = () => {
    toast.success(`Downloading PDF report for ${data.name}...`);
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="p-[20px] bg-background text-foreground min-h-screen space-y-[20px] font-sans transition-colors duration-300">
      
      {/* Header section with actions and breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Navigation & breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleGoBack}
            className="p-2 border border-border bg-card rounded-[5px] text-muted-foreground hover:text-foreground hover:bg-muted/10 cursor-pointer transition-colors shadow-none"
            aria-label="Go Back"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="flex flex-col">
            <span className="text-[12px] text-muted-foreground font-semibold">
              {data.name} / Lab Results
            </span>
            <h1 className="text-[20px] font-bold text-foreground leading-tight">
              Lab Result
            </h1>
          </div>
        </div>

        {/* Buttons matching design details - full width on mobile, auto-width on tablet/desktop */}
        <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0 justify-between sm:justify-start">
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-1.5 border border-primary text-primary bg-transparent font-bold text-[13px] px-4 py-2 rounded-[5px] hover:bg-primary/5 cursor-pointer transition-colors shadow-none flex-1 sm:flex-none"
          >
            <Printer size={15} />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-1.5 bg-primary text-primary-foreground border border-primary font-bold text-[13px] px-4 py-2 rounded-[5px] hover:bg-primary/90 cursor-pointer transition-colors shadow-none flex-1 sm:flex-none"
          >
            <Download size={15} />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Patient Demographics Card - align avatar start on mobile */}
      <div className="bg-card border border-border rounded-[5px] p-[20px] shadow-none flex flex-col md:flex-row items-start md:items-center gap-[20px] transition-colors">
        {/* Simulated avatar matching the bearded patient portrait layout */}
        <div className="w-[54px] h-[54px] rounded-full overflow-hidden bg-muted flex items-center justify-center shrink-0 border border-border">
          <svg
            className="w-12 h-12 text-muted-foreground"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-[20px] flex-1 w-full text-[13px]">
          <div className="flex flex-col gap-1 col-span-2 sm:col-span-1">
            <span className="font-bold text-foreground text-[15px]">
              {data.name}
            </span>
            <span className="text-muted-foreground font-semibold">
              {data.ageGender}
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-bold text-muted-foreground/80 tracking-wide">
              UHID
            </span>
            <span className="font-bold text-foreground">
              {data.uhid}
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-bold text-muted-foreground/80 tracking-wide">
              Bed No.
            </span>
            <span className="font-bold text-foreground">
              {data.bedNo}
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-bold text-muted-foreground/80 tracking-wide">
              Admission Date
            </span>
            <span className="font-bold text-foreground">
              {data.admissionDate}
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-bold text-muted-foreground/80 tracking-wide">
              Attending Doctor
            </span>
            <span className="font-bold text-foreground">
              {data.attendingDoctor}
            </span>
          </div>

          <div className="flex flex-col gap-0.5 col-span-2 sm:col-span-3 md:col-span-5 border-t border-border/50 pt-[10px] md:border-t-0 md:pt-0">
            <span className="text-[11px] font-bold text-muted-foreground/80 tracking-wide">
              Diagnosis
            </span>
            <span className="font-bold text-foreground">
              {data.diagnosis}
            </span>
          </div>
        </div>
      </div>

      {/* Test Overview Card */}
      <div className="bg-card border border-border rounded-[5px] p-[20px] shadow-none flex flex-col gap-[20px] transition-colors">
        {/* Test title, badges, accession number */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-[15px] border-b border-border/50">
          <div className="flex flex-col gap-2">
            <h2 className="text-[16px] font-bold text-foreground leading-snug">
              Complete Blood Count (CBC)
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-[5px] bg-[#E8F5E9] dark:bg-[#1B5E20]/20 px-2.5 py-1 text-[11px] font-bold text-[#2E7D32] dark:text-[#81C784] whitespace-nowrap">
                <Check size={12} className="stroke-[3]" />
                Final Report
              </span>
              <span className="inline-flex items-center rounded-[5px] bg-destructive/10 px-2.5 py-1 text-[11px] font-bold text-destructive whitespace-nowrap">
                Flag: Abnormal
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:items-end text-[12px] gap-0.5">
            <span className="font-bold text-foreground whitespace-nowrap">
              Accession #: {data.accession}
            </span>
            <span className="text-muted-foreground font-semibold whitespace-nowrap">
              Reported: {data.reported}
            </span>
          </div>
        </div>

        {/* Ordering, Location, Specimen Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px] text-[13px]">
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-bold text-muted-foreground/80 tracking-wide">
              Ordered By
            </span>
            <span className="font-bold text-foreground">
              {data.orderedBy}
            </span>
            <span className="text-muted-foreground font-semibold">
              {data.department}
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-bold text-muted-foreground/80 tracking-wide">
              Specimen
            </span>
            <span className="font-bold text-foreground">
              {data.specimen}
            </span>
            <span className="text-muted-foreground font-semibold">
              Collected: {data.collectedTime}
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-bold text-muted-foreground/80 tracking-wide">
              Location
            </span>
            <span className="font-bold text-foreground">
              {data.location}
            </span>
            <span className="text-muted-foreground font-semibold">
              {data.subLocation}
            </span>
          </div>
        </div>
      </div>

      {/* Test Results Table Card */}
      <div className="bg-card border border-border rounded-[5px] shadow-none overflow-hidden transition-colors">
        
        {/* Results Table Responsive Wrapper */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border text-[12px] font-bold text-muted-foreground">
                <th className="px-[20px] py-[12px] whitespace-nowrap">Test Description</th>
                <th className="px-[20px] py-[12px] whitespace-nowrap">Result</th>
                <th className="px-[20px] py-[12px] whitespace-nowrap">Units</th>
                <th className="px-[20px] py-[12px] whitespace-nowrap">Reference Range</th>
                <th className="px-[20px] py-[12px] whitespace-nowrap">Flag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-[13px]">
              {results.length > 0 ? (
                results.map((row, idx) => {
                  const isLow = row.flag === "Low";
                  const isHigh = row.flag === "High";

                  return (
                    <tr key={idx} className="hover:bg-muted/5 transition-colors">
                      <td className="px-[20px] py-[12px] font-bold text-foreground whitespace-nowrap">
                        {row.description}
                      </td>
                      <td
                        className={`px-[20px] py-[12px] font-bold text-[14px] whitespace-nowrap ${
                          row.isAbnormal ? "text-destructive" : "text-foreground"
                        }`}
                      >
                        {row.result}
                      </td>
                      <td className="px-[20px] py-[12px] text-muted-foreground font-semibold whitespace-nowrap">
                        {row.units}
                      </td>
                      <td className="px-[20px] py-[12px] text-muted-foreground font-semibold whitespace-nowrap">
                        {row.referenceRange}
                      </td>
                      <td className="px-[20px] py-[12px] whitespace-nowrap">
                        {isLow && (
                          <span className="inline-flex items-center gap-1 bg-destructive/10 text-destructive font-bold text-[11px] px-2.5 py-0.5 rounded-[5px]">
                            ↓ Low
                          </span>
                        )}
                        {isHigh && (
                          <span className="inline-flex items-center gap-1 bg-[#FFE8D6] dark:bg-[#F97316]/20 text-[#EA580C] dark:text-[#FB923C] font-bold text-[11px] px-2.5 py-0.5 rounded-[5px]">
                            ↑ High
                          </span>
                        )}
                        {!row.isAbnormal && <span className="text-muted-foreground">-</span>}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="px-[20px] py-[40px] text-center text-muted-foreground font-bold text-[13px]">
                    No results have been filled yet. Please generate results from the "Generate Result" menu option first.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Main Container Card enclosing the restored details */}
      <div className="bg-card border border-border rounded-[5px] shadow-none overflow-hidden transition-colors flex flex-col">
        {/* Interpretation / Notes - separated by border-t */}
        <div className="p-[20px] border-t border-border flex flex-col gap-2 bg-card text-[13px] transition-colors">
          <span className="font-bold text-foreground">
            Interpretation / Notes:
          </span>
          <p className="text-muted-foreground leading-relaxed font-semibold">
            Leukocytosis with neutrophilia noted, consistent with current clinical diagnosis of pneumonia. Mild anemia observed. Correlate clinically.
          </p>
        </div>

        {/* Footer info - Pathologist and Hospital */}
        <div className="p-[20px] border-t border-border/50 border-dashed flex flex-col sm:flex-row justify-between gap-3 text-[12px] text-muted-foreground font-semibold bg-muted/5 transition-colors">
          <span>Verified by: Dr. Alan Turing, MD Pathologist</span>
          <span>Laboratory Services • Central City Hospital</span>
        </div>
      </div>

    </div>
  );
}

export default function LabResultReportPage() {
  return (
    <Suspense fallback={
      <div className="p-[20px] min-h-screen flex items-center justify-center bg-background text-foreground font-sans">
        <span className="text-[14px] font-semibold text-muted-foreground">Loading report...</span>
      </div>
    }>
      <ReportContent />
    </Suspense>
  );
}
