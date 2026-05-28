"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Trash2, Plus, Loader2 } from "lucide-react";
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

// Initial test rows - only one single blank row by default for manual typing
const INITIAL_TEST_ROWS = [
  {
    name: "",
    result: "",
    units: "",
    minValue: "",
    maxValue: ""
  }
];

function ReportEditContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [orderData, setOrderData] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [testRows, setTestRows] = useState([]);

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

  // Map demographics
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

  // Initialize test rows from localStorage or fallback to single blank manually-typed row
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`report-results-${id}`);
      if (saved) {
        try {
          setTestRows(JSON.parse(saved));
          return;
        } catch (e) {
          console.error("Error parsing saved results", e);
        }
      }
    }
    setTestRows(INITIAL_TEST_ROWS);
  }, [id]);

  const handleAddTest = () => {
    setTestRows((prev) => [...prev, { name: "", result: "", units: "", minValue: "", maxValue: "" }]);
  };

  const handleRemoveTest = (index) => {
    setTestRows((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleFieldChange = (index, field, value) => {
    setTestRows((prev) =>
      prev.map((row, idx) => (idx === index ? { ...row, [field]: value } : row))
    );
  };

  const handleDiscard = () => {
    router.back();
  };

  const handleSaveAndGenerate = () => {
    // Dynamically calculate high/low abnormal flags
    const processedRows = testRows.map(row => {
      const valNum = parseFloat(row.result);
      const minVal = parseFloat(row.minValue);
      const maxVal = parseFloat(row.maxValue);

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

      return {
        ...row,
        flag,
        isAbnormal
      };
    });

    localStorage.setItem(`report-results-${id || "james-wilson"}`, JSON.stringify(processedRows));
    localStorage.setItem(`report-generated-${id || "james-wilson"}`, "true");
    localStorage.setItem(`report-edited-${id || "james-wilson"}`, "true");

    toast.success(`Lab report saved and generated successfully for ${data.name}!`);
    
    // Redirect to the generated report
    router.push(`/laboratory/sample-collection/report?id=${id || ""}`);
  };

  if (loadingOrder) {
    return (
      <div className="p-[20px] min-h-screen flex flex-col items-center justify-center bg-background text-foreground font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
        <span className="text-[14px] font-semibold text-muted-foreground">Loading test order details...</span>
      </div>
    );
  }

  return (
    <div className="p-[20px] bg-background text-foreground min-h-screen space-y-[20px] font-sans transition-colors duration-300">
      
      {/* Header section with back button */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleDiscard}
          className="p-2 border border-border bg-card rounded-[5px] text-muted-foreground hover:text-foreground hover:bg-muted/10 cursor-pointer transition-colors shadow-none outline-none"
          aria-label="Go Back"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex flex-col">
          <h1 className="text-[20px] font-bold text-foreground leading-tight">
            Lab Result
          </h1>
        </div>
      </div>

      {/* Patient Demographics Card */}
      <div className="bg-card border border-border rounded-[5px] p-[20px] shadow-none flex flex-col md:flex-row items-start md:items-center gap-[20px] transition-colors">
        {/* Profile Avatar */}
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
            <span className="text-[11px] font-bold text-muted-foreground/80 tracking-wide uppercase">
              UHID
            </span>
            <span className="font-bold text-foreground">
              {data.uhid}
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-bold text-muted-foreground/80 tracking-wide uppercase">
              Bed No.
            </span>
            <span className="font-bold text-foreground">
              {data.bedNo}
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-bold text-muted-foreground/80 tracking-wide uppercase">
              Admission Date
            </span>
            <span className="font-bold text-foreground">
              {data.admissionDate}
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-bold text-muted-foreground/80 tracking-wide uppercase">
              Attending Doctor
            </span>
            <span className="font-bold text-foreground">
              {data.attendingDoctor}
            </span>
          </div>

          <div className="flex flex-col gap-0.5 col-span-2 sm:col-span-3 md:col-span-5 border-t border-border/50 pt-[10px] md:border-t-0 md:pt-0">
            <span className="text-[11px] font-bold text-muted-foreground/80 tracking-wide uppercase">
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
              <span className="inline-flex items-center rounded-[5px] bg-[#E8F5E9] dark:bg-[#1B5E20]/20 px-2.5 py-1 text-[11px] font-bold text-[#2E7D32] dark:text-[#81C784]">
                Final Report
              </span>
              <span className="inline-flex items-center rounded-[5px] bg-destructive/10 px-2.5 py-1 text-[11px] font-bold text-destructive">
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

        {/* Specimen and Location details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px] text-[13px]">
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-bold text-muted-foreground/80 tracking-wide">
              Ordered By
            </span>
            <span className="font-bold text-foreground">
              {data.orderedBy}
            </span>
            <span className="text-muted-foreground font-semibold text-[11px]">
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
            <span className="text-muted-foreground font-semibold text-[11px]">
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
            <span className="text-muted-foreground font-semibold text-[11px]">
              {data.subLocation}
            </span>
          </div>
        </div>
      </div>

      {/* Lab Test Results Entry Form */}
      <div className="bg-card border border-border rounded-[5px] p-[20px] shadow-none space-y-[20px]">
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-foreground">
            Lab Test Results
          </h2>
          <button
            onClick={handleAddTest}
            className="flex items-center gap-1 text-[13px] font-bold text-primary hover:underline bg-transparent border-0 cursor-pointer outline-none"
          >
            <Plus size={14} className="stroke-[2.5]" />
            <span>Add Test</span>
          </button>
        </div>

        {/* Dynamic Rows */}
        <div className="space-y-[15px]">
          {testRows.map((row, idx) => (
            <div key={idx} className="flex flex-col md:flex-row items-stretch md:items-end gap-[15px] pb-[15px] border-b border-border/30 last:border-0 last:pb-0">
              
              {/* Test Name Input */}
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-muted-foreground/80 tracking-wide uppercase">
                  Test Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hemoglobin"
                  value={row.name}
                  onChange={(e) => handleFieldChange(idx, "name", e.target.value)}
                  className="h-10 px-3 bg-background border border-border rounded-[5px] text-[13px] text-foreground focus:ring-1 focus:ring-primary/20 outline-none w-full shadow-none font-semibold transition-all"
                />
              </div>

              {/* Result Input */}
              <div className="w-full md:w-[120px] flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-muted-foreground/80 tracking-wide uppercase">
                  Result
                </label>
                <input
                  type="text"
                  placeholder="e.g. 12.5"
                  value={row.result}
                  onChange={(e) => handleFieldChange(idx, "result", e.target.value)}
                  className="h-10 px-3 bg-background border border-border rounded-[5px] text-[13px] text-foreground focus:ring-1 focus:ring-primary/20 outline-none w-full shadow-none font-semibold transition-all"
                />
              </div>

              {/* Units Input */}
              <div className="w-full md:w-[100px] flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-muted-foreground/80 tracking-wide uppercase">
                  Units
                </label>
                <input
                  type="text"
                  placeholder="e.g. g/dL"
                  value={row.units}
                  onChange={(e) => handleFieldChange(idx, "units", e.target.value)}
                  className="h-10 px-3 bg-background border border-border rounded-[5px] text-[13px] text-foreground focus:ring-1 focus:ring-primary/20 outline-none w-full shadow-none font-semibold transition-all"
                />
              </div>

              {/* Min Value Input */}
              <div className="w-full md:w-[110px] flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-muted-foreground/80 tracking-wide uppercase">
                  Min Value
                </label>
                <input
                  type="text"
                  placeholder="Min"
                  value={row.minValue || ""}
                  onChange={(e) => handleFieldChange(idx, "minValue", e.target.value)}
                  className="h-10 px-3 bg-background border border-border rounded-[5px] text-[13px] text-foreground focus:ring-1 focus:ring-primary/20 outline-none w-full shadow-none font-semibold transition-all"
                />
              </div>

              {/* Max Value Input */}
              <div className="w-full md:w-[110px] flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-muted-foreground/80 tracking-wide uppercase">
                  Max Value
                </label>
                <input
                  type="text"
                  placeholder="Max"
                  value={row.maxValue || ""}
                  onChange={(e) => handleFieldChange(idx, "maxValue", e.target.value)}
                  className="h-10 px-3 bg-background border border-border rounded-[5px] text-[13px] text-foreground focus:ring-1 focus:ring-primary/20 outline-none w-full shadow-none font-semibold transition-all"
                />
              </div>

              {/* Trash/Delete Action */}
              <div className="flex justify-end md:justify-start">
                <button
                  onClick={() => handleRemoveTest(idx)}
                  className="h-10 w-10 flex items-center justify-center border border-border hover:border-destructive/30 hover:bg-destructive/5 text-muted-foreground hover:text-destructive rounded-[5px] transition-colors cursor-pointer outline-none shadow-none"
                  title="Remove row"
                >
                  <Trash2 size={16} />
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          onClick={handleDiscard}
          className="h-10 px-5 bg-card border border-border text-foreground font-bold text-[13px] rounded-[5px] hover:bg-muted/10 transition-colors cursor-pointer shadow-none outline-none"
        >
          Discard
        </button>
        <button
          onClick={handleSaveAndGenerate}
          className="h-10 px-5 bg-primary text-primary-foreground border border-primary font-bold text-[13px] rounded-[5px] hover:bg-primary/90 transition-colors cursor-pointer shadow-none outline-none"
        >
          Save Changes & Generate Report
        </button>
      </div>

    </div>
  );
}

export default function ResultsEditPage() {
  return (
    <Suspense
      fallback={
        <div className="p-[20px] min-h-screen flex items-center justify-center bg-background text-foreground font-sans">
          <span className="text-[14px] font-semibold text-muted-foreground">Loading...</span>
        </div>
      }
    >
      <ReportEditContent />
    </Suspense>
  );
}
