"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  FinanceHeader,
  FinancePageShell,
  FinanceSearchField,
  FinanceSelect,
  FinanceStatCard,
  FinanceTableCard,
  FinanceToolbar,
} from "@/components/finance/FinancePageChrome";
import {
  Search,
  Plus,
  Eye,
  FileText,
  ChevronDown,
  X,
  Shield,
  Clock,
  ShieldCheck,
  XCircle,
  AlertCircle,
  Activity,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Check,
  UploadCloud,
  Folder,
  Coins,
  Download,
  Info,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormDatePicker } from "@/components/ui/form-date-picker";

// --- MOCK PROVIDERS WITH BRANDS & COLORS ---
const PROVIDERS = {
  "BlueCross BlueShield": { initial: "B", bg: "bg-[#f0f9ff] text-[#0284c7] border-[#e0f2fe]", dot: "bg-[#0284c7]" },
  "UnitedHealthcare": { initial: "U", bg: "bg-[#f0f9ff] text-[#0284c7] border-[#e0f2fe]", dot: "bg-[#0284c7]" },
  "Aetna": { initial: "A", bg: "bg-[#f0f9ff] text-[#0284c7] border-[#e0f2fe]", dot: "bg-[#0284c7]" },
  "Cigna": { initial: "C", bg: "bg-[#f0f9ff] text-[#0284c7] border-[#e0f2fe]", dot: "bg-[#0284c7]" },
  "Kaiser Permanente": { initial: "K", bg: "bg-[#f0f9ff] text-[#0284c7] border-[#e0f2fe]", dot: "bg-[#0284c7]" },
  "Humana": { initial: "H", bg: "bg-[#f0f9ff] text-[#0284c7] border-[#e0f2fe]", dot: "bg-[#0284c7]" },
  "Health Net": { initial: "H", bg: "bg-[#f0f9ff] text-[#0284c7] border-[#e0f2fe]", dot: "bg-[#0284c7]" },
  "Blue Shield": { initial: "B", bg: "bg-[#f0f9ff] text-[#0284c7] border-[#e0f2fe]", dot: "bg-[#0284c7]" },
};

// --- MOCK PATIENT METADATA FOR WIZARD ---
const PATIENT_METADATA = {
  "P-109234": {
    name: "Robert Jones",
    uhid: "P-109234",
    dob: "May 14, 1985 (38y)",
    gender: "Male",
    admission: "Oct 22, 2023",
    provider: "BlueCross BlueShield",
    policyNo: "PDL-982374665",
    coverage: "80%",
    copay: "20%",
    amount: "₹4,500.00"
  },
  "P-109235": {
    name: "Alice Smith",
    uhid: "P-109235",
    dob: "Apr 23, 1997 (29y)",
    gender: "Female",
    admission: "Oct 20, 2023",
    provider: "UnitedHealthcare",
    policyNo: "PDL-881273922",
    coverage: "90%",
    copay: "10%",
    amount: "₹3,200.00"
  },
  "P-109236": {
    name: "Kevin Miller",
    uhid: "P-109236",
    dob: "Dec 12, 1983 (42y)",
    gender: "Male",
    admission: "Oct 19, 2023",
    provider: "Aetna",
    policyNo: "PDL-332910399",
    coverage: "70%",
    copay: "30%",
    amount: "₹5,100.00"
  },
  "P-109237": {
    name: "Laura Thompson",
    uhid: "P-109237",
    dob: "Sep 05, 1990 (35y)",
    gender: "Female",
    admission: "Oct 21, 2023",
    provider: "Cigna",
    policyNo: "PDL-119283991",
    coverage: "85%",
    copay: "15%",
    amount: "₹6,000.00"
  },
  "P-109238": {
    name: "Michael Garcia",
    uhid: "P-109238",
    dob: "Jun 18, 1975 (50y)",
    gender: "Male",
    admission: "Oct 18, 2023",
    provider: "Kaiser Permanente",
    policyNo: "PDL-449201939",
    coverage: "75%",
    copay: "25%",
    amount: "₹4,900.00"
  }
};

// --- INITIAL MOCK CLAIMS DATA ---
const INITIAL_CLAIMS = [
  {
    id: "CLM-2023-891",
    patient: "Robert Fox",
    uhid: "P-882910",
    provider: "BlueCross BlueShield",
    amount: "₹4500.00",
    date: "Oct, 2023",
    status: "Approved",
    policyNo: "POL-BC-9908",
    coPay: "20%",
    diagnostics: "Acute Bronchitis",
    notes: "TPA approved within standard 4-hour SLA.",
  },
  {
    id: "CLM-2023-891",
    patient: "Robert Fox",
    uhid: "P-882910",
    provider: "BlueCross BlueShield",
    amount: "₹4500.00",
    date: "Oct, 2023",
    status: "Approved",
    policyNo: "POL-BC-9908",
    coPay: "20%",
    diagnostics: "Acute Bronchitis",
    notes: "TPA approved within standard 4-hour SLA.",
  },
  {
    id: "CLM-2023-892",
    patient: "Alice Johnson",
    uhid: "P-882911",
    provider: "UnitedHealthcare",
    amount: "₹3200.00",
    date: "Oct, 2023",
    status: "Pending",
    policyNo: "POL-UH-3312",
    coPay: "15%",
    diagnostics: "Dental Restoration",
    notes: "Awaiting additional document uploads from provider.",
  },
  {
    id: "CLM-2023-893",
    patient: "Michael Brown",
    uhid: "P-882912",
    provider: "Aetna",
    amount: "₹5100.00",
    date: "Oct, 2023",
    status: "Rejected",
    policyNo: "POL-AE-4421",
    coPay: "30%",
    diagnostics: "Cosmetic Surgery",
    notes: "Claim rejected: Procedures not covered under standard exclusions.",
  },
  {
    id: "CLM-2023-894",
    patient: "Emily Davis",
    uhid: "P-882913",
    provider: "Cigna",
    amount: "₹6000.00",
    date: "Oct, 2023",
    status: "Approved",
    policyNo: "POL-CG-8871",
    coPay: "10%",
    diagnostics: "Chronic Migraine Therapy",
    notes: "Full co-pay settled directly via corporate cashless program.",
  },
  {
    id: "CLM-2023-895",
    patient: "James Smith",
    uhid: "P-882914",
    provider: "Kaiser Permanente",
    amount: "₹3000.00",
    date: "Oct, 2023",
    status: "Approved",
    policyNo: "POL-KP-5561",
    coPay: "25%",
    diagnostics: "Ophthalmology Consultation",
    notes: "TPA cashless authorization completed pre-procedure.",
  },
  {
    id: "CLM-2023-896",
    patient: "Patricia Garcia",
    uhid: "P-882915",
    provider: "Humana",
    amount: "₹4900.00",
    date: "Oct, 2023",
    status: "Pending",
    policyNo: "POL-HU-2287",
    coPay: "20%",
    diagnostics: "Orthopedic Evaluation",
    notes: "Pre-auth request in queue for final medical director review.",
  },
  {
    id: "CLM-2023-891",
    patient: "Robert Fox",
    uhid: "P-882910",
    provider: "BlueCross BlueShield",
    amount: "₹4500.00",
    date: "Oct, 2023",
    status: "Approved",
    policyNo: "POL-BC-9908",
    coPay: "20%",
    diagnostics: "Acute Bronchitis",
    notes: "TPA approved within standard 4-hour SLA.",
  },
  {
    id: "CLM-2023-897",
    patient: "Daniel Martinez",
    uhid: "P-882916",
    provider: "Health Net",
    amount: "₹4300.00",
    date: "Oct, 2023",
    status: "Rejected",
    policyNo: "POL-HN-7752",
    coPay: "15%",
    diagnostics: "Alternative Physiotherapy",
    notes: "Rejected due to out-of-network provider center limitation.",
  },
  {
    id: "CLM-2023-898",
    patient: "Linda Taylor",
    uhid: "P-882917",
    provider: "Blue Shield",
    amount: "₹5000.00",
    date: "Oct, 2023",
    status: "Approved",
    policyNo: "POL-BS-1104",
    coPay: "20%",
    diagnostics: "Pediatric Wellness Checkup",
    notes: "Cashless authorization cleared.",
  },
];

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

function getAuthHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("authtoken") : "";
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export default function InsurancePage() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modals state
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [isNewClaimOpen, setIsNewClaimOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);

  // Verify Patient Insurance portal states
  const [isVerifyingInsurance, setIsVerifyingInsurance] = useState(false);
  const [verifyUhid, setVerifyUhid] = useState("P-109234");
  const [verifyGroupNo, setVerifyGroupNo] = useState("GRP-12345");
  const [verifyRelation, setVerifyRelation] = useState("Self");
  const [hasVerifiedPolicy, setHasVerifiedPolicy] = useState(true);

  // Multi-Step Wizard states
  const [isCreatingClaim, setIsCreatingClaim] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardPatients, setWizardPatients] = useState([
    { id: "P-109234", name: "Robert Jones", age: 38, gender: "Male", admissionDate: "Oct 22, 2023", insurance: "BlueCross BlueShield", action: "Selected" },
    { id: "P-109235", name: "Alice Smith", age: 29, gender: "Female", admissionDate: "Oct 20, 2023", insurance: "UnitedHealthcare", action: "Select" },
    { id: "P-109236", name: "Kevin Miller", age: 42, gender: "Male", admissionDate: "Oct 19, 2023", insurance: "Aetna", action: "Pending" },
    { id: "P-109237", name: "Laura Thompson", age: 35, gender: "Female", admissionDate: "Oct 21, 2023", insurance: "Cigna", action: "Selected" },
    { id: "P-109238", name: "Michael Garcia", age: 50, gender: "Male", admissionDate: "Oct 18, 2023", insurance: "Kaiser Permanente", action: "Declined" },
  ]);
  const [treatmentDetails, setTreatmentDetails] = useState({
    primaryDiagnosis: "J01.90 - Acute sinusitis, unspecified",
    secondaryDiagnosis: "",
    procedureCode: "99213 - Office/outpatient visit",
    dateOfService: "2023-10-24",
    attendingProvider: "Dr. Sarah Jenkins"
  });
  const [uploadedFiles, setUploadedFiles] = useState({
    dischargeSummary: { name: "discharge_summary_RJ.pdf", size: "2.4 MB" },
    itemizedBill: { name: "final_bill_inv_002.pdf", size: "1.1 MB" },
    labReports: null,
    additionalDocs: []
  });

  // Fetch claims and patient records from APIs
  useEffect(() => {
    fetchClaims();
    fetchPatients();
  }, []);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/billing/claims`, { headers: getAuthHeaders() });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || `Error ${res.status}`);
      
      const mapped = json.data.map(c => {
        const p = c.patient;
        const patientName = p ? `${p.firstName || ""} ${p.lastName || ""}`.trim() || p.name || "Unknown" : "Unknown";
        const uhid = p ? `UHID-${p.id.substring(0, 6).toUpperCase()}` : "—";
        const dateStr = new Date(c.claimDate).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric"
        });
        
        return {
          id: c.id.substring(0, 8).toUpperCase(),
          realId: c.id,
          patient: patientName,
          uhid,
          provider: c.insuranceProvider,
          amount: `₹${Number(c.claimAmount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
          date: dateStr,
          status: c.status === "PENDING" ? "Pending" : c.status === "APPROVED" ? "Approved" : c.status === "REJECTED" ? "Rejected" : "Approved",
          policyNo: c.policyNumber,
          coPay: "20%",
          diagnostics: c.notes || "General Medical Care",
          notes: c.notes || "",
          rawApprovedAmount: c.approvedAmount || 0,
          rawClaimAmount: c.claimAmount || 0
        };
      });
      setClaims(mapped);
    } catch (e) {
      console.error("fetchClaims error:", e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await fetch(`${API_BASE}/billing/ipd-records`, { headers: getAuthHeaders() });
      const json = await res.json();
      if (res.ok && json.success) {
        const mapped = json.data.map((p, index) => ({
          id: p.patientId,
          uhidVal: p.uhid,
          name: p.patient,
          age: 35,
          gender: "Male",
          admissionDate: p.admissionDate,
          insurance: "BlueCross BlueShield",
          billId: p.billId,
          action: index === 0 ? "Selected" : "Select"
        }));
        if (mapped.length > 0) {
          setWizardPatients(mapped);
        }
      }
    } catch (e) {
      console.error("fetchPatients error:", e);
    }
  };

  const handleSelectPatient = (patientId) => {
    setWizardPatients(wizardPatients.map(p => {
      if (p.action === "Selected") {
        return { ...p, action: "Select" };
      }
      if (p.id === patientId) {
        return { ...p, action: "Selected" };
      }
      return p;
    }));
  };

  const handleWizardBack = () => {
    if (currentStep === 1) {
      setIsCreatingClaim(false);
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleWizardNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleSaveDraft = () => {
    alert("Draft claim saved successfully!");
  };

  const handleWizardSubmit = async () => {
    try {
      const activePat = wizardPatients.find(p => p.action === "Selected") || wizardPatients[0];
      const amountVal = parseFloat((PATIENT_METADATA[activePat.id]?.amount || "4500").replace(/[^\d.]/g, "")) || 4500;
      
      const payload = {
        billId: activePat.billId || "placeholder",
        patientId: activePat.id,
        insuranceProvider: activePat.insurance,
        policyNumber: PATIENT_METADATA[activePat.id]?.policyNo || `POL-${activePat.id}-99`,
        cardNumber: `CRD-${activePat.id}-123`,
        preAuthAmount: amountVal * 0.8,
        claimAmount: amountVal,
        notes: `TPA cashless request for ${treatmentDetails.primaryDiagnosis}. Provider: ${treatmentDetails.attendingProvider}`
      };

      const res = await fetch(`${API_BASE}/billing/claims`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || `Error ${res.status}`);

      alert("Insurance claim submitted successfully!");
      setIsCreatingClaim(false);
      setCurrentStep(1);
      fetchClaims();
    } catch (e) {
      alert("Failed to submit claim: " + e.message);
    }
  };

  // Dynamic search/filter
  const filteredClaims = claims.filter((claim) => {
    const matchesSearch =
      claim.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.provider.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || claim.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Verification Form states
  const [verifyName, setVerifyName] = useState("");
  const [verifyProvider, setVerifyProvider] = useState("BlueCross BlueShield");
  const [verifyPolicy, setVerifyPolicy] = useState("");
  const [verifyStatus, setVerifyStatus] = useState("idle");

  const handleVerifySubmit = (e) => {
    e.preventDefault();
    setVerifyStatus("checking");
    setTimeout(() => {
      setVerifyStatus("success");
    }, 1500);
  };

  // New Claim Form states
  const [newPatient, setNewPatient] = useState("");
  const [newUHID, setNewUHID] = useState("");
  const [newProvider, setNewProvider] = useState("BlueCross BlueShield");
  const [newAmount, setNewAmount] = useState("");
  const [newPolicy, setNewPolicy] = useState("");
  const [newDiagnostics, setNewDiagnostics] = useState("");

  const handleNewClaimSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        billId: "placeholder",
        patientId: newUHID || "P-882999",
        insuranceProvider: newProvider,
        policyNumber: newPolicy || "POL-GEN-1029",
        cardNumber: "CRD-GEN-1029",
        preAuthAmount: parseFloat(newAmount) * 0.8 || 0,
        claimAmount: parseFloat(newAmount) || 0,
        notes: newDiagnostics || "General Medical Care"
      };

      const res = await fetch(`${API_BASE}/billing/claims`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || `Error ${res.status}`);

      alert("New claim submitted successfully!");
      setIsNewClaimOpen(false);
      setNewPatient("");
      setNewUHID("");
      setNewAmount("");
      setNewPolicy("");
      fetchClaims();
    } catch (err) {
      alert("Failed to submit claim: " + err.message);
    }
  };

  if (isVerifyingInsurance) {
    // Lookup selected patient profile details dynamically based on verifyUhid
    const matchedPat = wizardPatients.find(p => p.id === verifyUhid || p.name.toLowerCase().includes(verifyUhid.toLowerCase())) || wizardPatients[0];
    const patMeta = PATIENT_METADATA[matchedPat.id] || {
      dob: "May 14, 1985 (38y)",
      gender: "Male",
      admission: "Oct 22, 2023",
      provider: "BlueCross BlueShield",
      policyNo: "POL-982374665",
      coverage: "80%",
      copay: "20%",
      amount: "₹4,500.00"
    };

    return (
      <FinancePageShell>
        {/* Main Content Area */}
        <div className="space-y-[20px]">
          {/* Content Header Title and Subtitle */}
          <div className="pb-0">
            <h2 className="text-[20px] font-bold text-gray-800 dark:text-white">Verify Patient Insurance</h2>
          </div>

          {/* Main Premium Container Card */}
          <div className="bg-white border border-[#E7E8EB] rounded-[8px] p-[20px] shadow-none dark:bg-[#101935] dark:border-white/10 space-y-[20px]">
            
            {/* Title and Subtitle inside card */}
            <div className="pb-[20px] border-b border-[#E7E8EB] dark:border-white/10">
              <h2 className="text-[20px] font-bold text-gray-800 dark:text-white">Verify Patient Insurance</h2>
              <p className="text-[13px] text-slate-400 font-medium mt-1">Check patient Eligibility and active policy status</p>
            </div>

            {/* Grid Layout: Left Column (3) & Right Column (1) */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-[20px] items-start">
              
              {/* Left Column (3 Columns for cards) */}
              <div className="lg:col-span-3 space-y-[20px]">
                
                {/* Card 1: Patient Lookup */}
                <div className="bg-white border border-[#E7E8EB] rounded-[8px] p-[20px] shadow-none dark:bg-[#0B1121] dark:border-white/10 space-y-[20px]">
                  <h3 className="text-[14px] font-bold text-gray-800 dark:text-white">Patient Lookup</h3>
                  
                  <div className="space-y-[10px]">
                    <span className="text-[12px] text-gray-500 font-semibold block">Patient UHID / Policy Number</span>
                    <div className="flex gap-[20px] flex-col sm:flex-row">
                      <div className="relative flex-1">
                        <Search className="absolute left-[16px] top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
                        <Input
                          value={verifyUhid}
                          onChange={(e) => setVerifyUhid(e.target.value)}
                          placeholder="Enter Patient UHID or Policy Number..."
                          className="h-[40px] rounded-[6px] border-[#2E37A4] pl-[44px] text-[13px] font-medium text-gray-800 focus-visible:ring-1 focus-visible:ring-[#2E37A4] dark:border-white/10 dark:bg-[#101935] dark:text-white dark:placeholder:text-slate-500"
                        />
                      </div>
                      <button 
                        onClick={() => {
                          setVerifyStatus("checking");
                          setTimeout(() => {
                            setVerifyStatus("success");
                            setHasVerifiedPolicy(true);
                          }, 1200);
                        }}
                        className="bg-[#2E37A4] hover:bg-[#1e257a] text-white text-[13px] font-bold px-[24px] h-[40px] rounded-[6px] transition-colors shadow-none shrink-0"
                      >
                        Search
                      </button>
                    </div>
                  </div>

                  {/* Profile Row directly on the white background (No surrounding box/borders per mockup) */}
                  {matchedPat && (
                    <div className="pt-[20px] border-t border-[#E7E8EB] dark:border-white/10 flex items-center gap-[20px] w-full">
                      <div className="w-[44px] h-[44px] rounded-full bg-[#C7D2FE] flex items-center justify-center text-sm font-bold text-[#3730A3] shrink-0">
                        {matchedPat.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-[20px] text-[13px] w-full">
                        <div>
                          <span className="text-[12px] text-gray-400 font-medium block mb-0.5">Patient Name</span>
                          <span className="text-gray-800 dark:text-white font-bold block truncate">{matchedPat.name}</span>
                        </div>
                        <div>
                          <span className="text-[12px] text-gray-400 font-medium block mb-0.5">UHID</span>
                          <span className="text-gray-700 dark:text-slate-300 font-bold block">{matchedPat.id}</span>
                        </div>
                        <div>
                          <span className="text-[12px] text-gray-400 font-medium block mb-0.5">Date of Birth</span>
                          <span className="text-gray-700 dark:text-slate-300 font-bold block">{patMeta.dob}</span>
                        </div>
                        <div>
                          <span className="text-[12px] text-gray-400 font-medium block mb-0.5">Contact</span>
                          <span className="text-gray-700 dark:text-slate-300 font-bold block">{patMeta.contact || "+1 (555) 123-4567"}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card 2: Primary Insurance Details */}
                <div className="bg-white border border-[#E7E8EB] rounded-[8px] p-[20px] shadow-none dark:bg-[#0B1121] dark:border-white/10 space-y-[20px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[#2E37A4] dark:text-indigo-400" />
                      <h3 className="text-[14px] font-bold text-gray-800 dark:text-white">Primary Insurance Details</h3>
                    </div>
                    <div className="bg-[#EAEBFA] text-[#2E37A4] border border-[#BFDBFE]/60 rounded-full px-3 py-1 flex items-center gap-1.5 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900">
                      <span className="text-[11px] font-bold">Ready for Verification</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px] text-[13px]">
                    <div className="space-y-2">
                      <span className="text-[12px] text-gray-500 font-semibold block">Insurance Provider</span>
                      <div className="relative">
                        <select
                          value={verifyProvider}
                          onChange={(e) => setVerifyProvider(e.target.value)}
                          className="h-[44px] w-full rounded-[6px] border border-[#E7E8EB] bg-white pl-[44px] pr-[36px] text-[13px] font-bold text-gray-800 outline-none appearance-none cursor-pointer focus:border-[#2E37A4] dark:border-white/10 dark:bg-[#101935] dark:text-white"
                        >
                          {Object.keys(PROVIDERS).map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                          <div className="w-[24px] h-[24px] rounded-[4px] bg-[#EBF5FF] text-[#1E40AF] border border-[#BFDBFE] flex items-center justify-center text-[10px] font-bold">
                            {PROVIDERS[verifyProvider]?.initial || "B"}
                          </div>
                        </div>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[12px] text-gray-500 font-semibold block">Policy/Member ID</span>
                      <Input
                        value={verifyPolicy || patMeta.policyNo}
                        onChange={(e) => setVerifyPolicy(e.target.value)}
                        placeholder="Enter policy/member ID..."
                        className="h-[44px] rounded-[6px] border-[#E7E8EB] text-[13px] font-bold text-gray-800 focus-visible:ring-[#2E37A4] dark:border-white/10 dark:bg-[#101935] dark:text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <span className="text-[12px] text-gray-500 font-semibold block">Group Number (Optional)</span>
                      <Input
                        value={verifyGroupNo}
                        onChange={(e) => setVerifyGroupNo(e.target.value)}
                        placeholder="Enter group number..."
                        className="h-[44px] rounded-[6px] border-[#E7E8EB] text-[13px] font-bold text-gray-800 focus-visible:ring-[#2E37A4] dark:border-white/10 dark:bg-[#101935] dark:text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <span className="text-[12px] text-gray-500 font-semibold block">Relationship to Subscriber</span>
                      <div className="relative">
                        <select
                          value={verifyRelation}
                          onChange={(e) => setVerifyRelation(e.target.value)}
                          className="h-[44px] w-full rounded-[6px] border border-[#E7E8EB] bg-white px-3 pr-[36px] text-[13px] font-bold text-gray-800 outline-none appearance-none cursor-pointer focus:border-[#2E37A4] dark:border-white/10 dark:bg-[#101935] dark:text-white"
                        >
                          <option value="Self">Self</option>
                          <option value="Spouse">Spouse</option>
                          <option value="Child">Child</option>
                          <option value="Other">Other</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Active Coverage tall card */}
              <div className="lg:col-span-1 space-y-[20px] w-full shrink-0">
                
                {verifyStatus === "checking" ? (
                  <div className="flex min-h-[380px] flex-col items-center justify-center space-y-[20px] rounded-[8px] border border-[#E7E8EB] bg-white p-[20px] shadow-none dark:border-white/10 dark:bg-[#0B1121]">
                    <Activity className="w-12 h-12 text-[#2E37A4] animate-pulse" />
                    <div className="text-center">
                      <span className="text-[13px] font-bold text-gray-800 dark:text-white block">Verifying Policy Status</span>
                      <span className="text-[11px] text-gray-400 font-medium block mt-1">Connecting to TPA secure endpoint...</span>
                    </div>
                  </div>
                ) : hasVerifiedPolicy ? (
                  <div className="flex min-h-[380px] flex-col overflow-hidden rounded-[8px] border border-[#E7E8EB] border-t-4 border-t-[#10B981] bg-white shadow-none dark:bg-[#0B1121] dark:border-white/10">
                    
                    {/* Green Top bar */}
                    <div className="bg-[#E6F4EA]/60 dark:bg-emerald-950/30 py-6 px-4 flex flex-col items-center justify-center border-b border-[#E7E8EB] dark:border-white/10 text-center space-y-3">
                      <div className="w-12 h-12 rounded-full border border-[#10B981] flex items-center justify-center text-[#10B981] dark:text-emerald-400 shrink-0 bg-white dark:bg-[#0B1121]">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-[14px] font-bold text-gray-800 dark:text-white block">Active Coverage</h4>
                        <span className="text-[11px] text-[#10B981] font-bold block mt-1">Verified today at 10:42 AM</span>
                      </div>
                    </div>

                    {/* Policy and Coverage specifics */}
                    <div className="p-[20px] space-y-[20px] text-[13px]">
                      <div>
                        <span className="text-[11px] text-gray-400 font-semibold block">Plan Name</span>
                        <span className="text-gray-800 dark:text-white font-bold block mt-0.5">Blue Access PPO</span>
                      </div>

                      <div className="grid grid-cols-2 gap-[20px]">
                        <div>
                          <span className="text-[11px] text-gray-400 font-semibold block">Effective Date</span>
                          <span className="text-gray-800 dark:text-white font-bold block mt-0.5">Jan 01, 2023</span>
                        </div>
                        <div>
                          <span className="text-[11px] text-gray-400 font-semibold block">Expiry Date</span>
                          <span className="text-gray-800 dark:text-white font-bold block mt-0.5">Dec 31, 2024</span>
                        </div>
                      </div>

                      <div className="border-t border-[#E7E8EB] pt-4 space-y-3 dark:border-white/10">
                        <span className="text-[11px] text-gray-400 font-semibold block">Coverage Highlights</span>
                        
                        <div className="flex justify-between font-medium">
                          <span className="text-gray-400 font-medium">Co-pay (Outpatient)</span>
                          <span className="text-gray-800 dark:text-white font-bold">₹25.00</span>
                        </div>
                        <div className="flex justify-between font-medium border-t border-[#E7E8EB] pt-3 dark:border-white/10">
                          <span className="text-gray-400 font-medium">Co-insurance</span>
                          <span className="text-gray-800 dark:text-white font-bold">20%</span>
                        </div>
                        <div className="flex justify-between font-medium border-t border-[#E7E8EB] pt-3 dark:border-white/10">
                          <span className="text-gray-400 font-medium">Deductible Met</span>
                          <span className="text-[#137333] dark:text-emerald-400 font-bold">₹1,200 / ₹1,500</span>
                        </div>
                      </div>

                      {/* Download Benefit button */}
                      <Button 
                        onClick={() => alert("Downloading Policy Benefits PDF...")}
                        variant="outline" 
                        className="w-full border-[#E7E8EB] text-gray-700 hover:bg-slate-50 text-[12px] font-bold py-2.5 h-[40px] rounded-[6px] flex items-center justify-center gap-1.5 shadow-none mt-2 dark:border-white/10 dark:text-slate-350 dark:hover:bg-slate-800"
                      >
                        <Download className="w-4 h-4" />
                        Download Benefits PDF
                      </Button>
                    </div>

                  </div>
                ) : (
                  <div className="flex min-h-[380px] flex-col items-center justify-center space-y-3.5 rounded-[8px] border border-[#E7E8EB] bg-white p-[20px] text-center shadow-none dark:border-white/10 dark:bg-[#0B1121]">
                    <div className="w-10 h-10 rounded-[6px] bg-[#EBF5FF] border border-[#BFDBFE] flex items-center justify-center text-gray-400 dark:bg-indigo-950/40">
                      <Shield className="w-5 h-5 text-[#2E37A4] dark:text-indigo-400" />
                    </div>
                    <div>
                      <span className="text-[13px] font-bold text-gray-800 dark:text-white block">Pending Verification</span>
                      <p className="text-[11px] text-gray-400 font-medium block mt-1 leading-normal max-w-[150px] mx-auto">
                        Fill policy numbers and click search or verify to pull coverage results.
                      </p>
                    </div>
                  </div>
                )}

              </div>

            </div>

            {/* Footer controls inside the parent container */}
            <div className="flex items-center justify-between border-t border-[#E7E8EB] pt-[20px] dark:border-white/10">
              <div>
                <Button
                  onClick={() => setIsVerifyingInsurance(false)}
                  variant="outline"
                  type="button"
                  className="border-[#E7E8EB] dark:border-white/10 text-gray-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-[13px] font-bold px-[20px] h-[40px] rounded-[6px] flex items-center gap-1.5 transition-all shadow-none"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              </div>
              <div className="flex gap-[20px]">
                <Button
                  onClick={() => setIsVerifyingInsurance(false)}
                  variant="outline"
                  type="button"
                  className="border-[#E7E8EB] dark:border-white/10 text-gray-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-[13px] font-bold px-[20px] h-[40px] rounded-[6px] transition-all shadow-none"
                >
                  Cancel
                </Button>
                <button
                  onClick={() => {
                    setVerifyStatus("checking");
                    setTimeout(() => {
                      setVerifyStatus("success");
                      setHasVerifiedPolicy(true);
                      alert("Patient insurance policy verified successfully!");
                    }, 1200);
                  }}
                  type="button"
                  className="bg-[#2E37A4] hover:bg-[#1e257a] text-white text-[13px] font-bold px-[24px] h-[40px] rounded-[6px] shadow-none transition-all"
                >
                  Verify
                </button>
              </div>
            </div>

          </div>

        </div>
      </FinancePageShell>
    );
  }

  if (isCreatingClaim) {
    return (
      <FinancePageShell>
        <FinanceHeader
          title="Create New Claim"
        />

        {/* Two-Column Wizard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-[20px] items-start">
          {/* Left Sidebar: Claim Steps */}
          <div className="col-span-1 bg-white border border-[#E7E8EB] rounded-[5px] p-[20px] shadow-none dark:bg-[#101935] dark:border-white/10">
              <h2 className="text-[13px] font-bold text-gray-800 dark:text-white border-b border-[#E7E8EB] pb-[10px] mb-[15px] dark:border-white/10">Claim Steps</h2>
              <div className="space-y-[16px]">
                {[
                  { number: 1, label: "Patient Selection" },
                  { number: 2, label: "Treatment Details" },
                  { number: 3, label: "Documents" },
                  { number: 4, label: "Review" },
                ].map((step) => {
                  const isActive = currentStep === step.number;
                  const isCompleted = currentStep > step.number;
                  return (
                    <div key={step.number} className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all border ${
                          isActive
                            ? "bg-[#2E37A4] text-white border-[#2E37A4]"
                            : isCompleted
                            ? "bg-[#E6F4EA] text-[#137333] border-[#C2E7CD]"
                            : "bg-[#F8F9FC] text-slate-400 border-[#E7E8EB] dark:bg-[#0B1121] dark:border-white/10"
                        }`}
                      >
                        {isActive || isCompleted ? <Check className="w-3.5 h-3.5" /> : step.number}
                      </div>
                      <span
                        className={`text-[13px] font-semibold ${
                          isActive
                            ? "text-[#2E37A4] dark:text-blue-400"
                            : isCompleted
                            ? "text-[#137333]"
                            : "text-slate-400"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Content Card: Step specific form */}
            <div className="col-span-1 lg:col-span-3 bg-white border border-[#E7E8EB] rounded-[5px] shadow-none dark:bg-[#101935] dark:border-white/10 overflow-hidden flex flex-col">
              {/* Step Content */}
              {currentStep === 1 && (
                <div className="p-[20px] space-y-[20px]">
                  <div className="flex justify-between items-center border-b border-[#E7E8EB] dark:border-white/10 pb-[15px]">
                    <div>
                      <h2 className="text-[16px] font-bold text-gray-800 dark:text-white">Select Patient</h2>
                      <p className="text-[13px] text-slate-400 font-medium mt-1">Please select the patient to generate cashless claim request</p>
                    </div>
                    <Button variant="outline" type="button" className="border-[#E7E8EB] text-gray-700 hover:bg-slate-50 text-[13px] font-semibold px-3 h-[36px] rounded-[6px] flex items-center gap-1.5 shadow-none dark:border-white/10 dark:text-slate-350 dark:hover:bg-slate-800">
                      <Search className="w-3.5 h-3.5 text-gray-400" />
                      Find Existing
                    </Button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead>
                        <tr className="border-b border-[#E7E8EB] bg-[#F8F9FC]/60 text-[12px] font-bold text-slate-500 dark:bg-[#0A0F1D]/40 dark:border-white/10 h-10">
                          <th className="pl-4">Patient Details</th>
                          <th>Admission</th>
                          <th>Primary Insurance</th>
                          <th className="pr-4 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E7E8EB] dark:divide-white/10 text-[13px] font-semibold text-slate-700 dark:text-slate-350">
                        {wizardPatients.map((p) => {
                          const isSelected = p.action === "Selected";
                          const isPending = p.action === "Pending";
                          const isDeclined = p.action === "Declined";
                          return (
                            <tr key={p.id} className="h-15 hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                              <td className="pl-4 py-2.5 align-middle">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-[#EBF5FF] text-[#1E40AF] border border-[#BFDBFE] flex items-center justify-center text-[12px] font-bold shrink-0">
                                    {p.name.split(" ").map(n => n[0]).join("")}
                                  </div>
                                  <div>
                                    <span className="font-bold text-[#1E293B] dark:text-white block text-[13px]">{p.name}</span>
                                    <span className="text-[11px] text-slate-400 font-medium block mt-0.5">{p.id} • {p.age}y • {p.gender}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="align-middle text-slate-600 dark:text-slate-300 font-medium">{p.admissionDate}</td>
                              <td className="align-middle">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-[6px] border border-[#BFDBFE] text-[11px] font-bold text-[#1E40AF] bg-[#EBF5FF]">
                                  {p.insurance}
                                </span>
                              </td>
                              <td className="pr-4 text-center align-middle">
                                {isSelected ? (
                                  <Badge className="bg-[#E6F4EA] text-[#137333] hover:bg-[#E6F4EA] px-3 py-1 text-[11px] font-bold rounded-[6px] shadow-none border-0">
                                    Selected
                                  </Badge>
                                ) : isPending ? (
                                  <Badge className="bg-[#FEF7E0] text-[#B06000] hover:bg-[#FEF7E0] px-3 py-1 text-[11px] font-bold rounded-[6px] shadow-none border-0">
                                    Pending
                                  </Badge>
                                ) : isDeclined ? (
                                  <Badge className="bg-[#FCE8E6] text-[#C5221F] hover:bg-[#FCE8E6] px-3 py-1 text-[11px] font-bold rounded-[6px] shadow-none border-0">
                                    Declined
                                  </Badge>
                                ) : (
                                  <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() => handleSelectPatient(p.id)}
                                    className="h-[32px] px-3.5 text-[11px] font-bold border-[#E7E8EB] hover:bg-slate-50 rounded-[6px] text-gray-700 shadow-none dark:border-white/10 dark:text-slate-350 dark:hover:bg-slate-800"
                                  >
                                    Select
                                  </Button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {currentStep === 2 && (() => {
                const activePat = wizardPatients.find(p => p.action === "Selected") || wizardPatients[0];
                const patMeta = PATIENT_METADATA[activePat.id] || {
                  dob: "May 14, 1985 (38y)",
                  gender: "Male",
                  admission: "Oct 22, 2023",
                  provider: "BlueCross BlueShield",
                  policyNo: "PDL-982374665",
                  coverage: "80%",
                  copay: "20%",
                  amount: "₹4,500.00"
                };
                
                return (
                  <div className="p-[20px] space-y-[20px]">
                    {/* Step Header */}
                    <div className="border-b border-[#E7E8EB] dark:border-white/10 pb-[15px]">
                      <h2 className="text-[16px] font-bold text-gray-800 dark:text-white">Treatment Details</h2>
                      <p className="text-[13px] text-slate-400 font-medium mt-1">Enter Patient treatment and attending provider details</p>
                    </div>

                    {/* Main Grid: Form on the Left, Context Cards on the Right */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-[20px] items-start">
                      
                      {/* Left Form (3 Columns) */}
                      <div className="col-span-1 lg:col-span-3 space-y-[20px]">
                        
                        {/* Section 1: Diagnosis Information */}
                        <div className="space-y-[12px]">
                          <h3 className="text-[13px] font-bold text-gray-800 dark:text-white">Diagnosis Information</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px]">
                            <div className="space-y-1">
                              <span className="text-[13px] text-gray-700 dark:text-slate-300 font-semibold block">Primary Diagnosis (ICD-10)</span>
                              <div className="relative">
                                <Input
                                  value={treatmentDetails.primaryDiagnosis}
                                  onChange={(e) => setTreatmentDetails({ ...treatmentDetails, primaryDiagnosis: e.target.value })}
                                  placeholder="Search ICD-10 codes..."
                                  className="h-[40px] text-[13px] border-[#E7E8EB] focus-visible:ring-[#2E37A4] pr-[36px] rounded-[6px] dark:border-white/10 dark:bg-[#0B1121] dark:text-white"
                                />
                                <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[13px] text-gray-700 dark:text-slate-300 font-semibold block">Secondary Diagnosis (Optional)</span>
                              <div className="relative">
                                <Input
                                  value={treatmentDetails.secondaryDiagnosis}
                                  onChange={(e) => setTreatmentDetails({ ...treatmentDetails, secondaryDiagnosis: e.target.value })}
                                  placeholder="Search ICD-10 codes..."
                                  className="h-[40px] text-[13px] border-[#E7E8EB] focus-visible:ring-[#2E37A4] pr-[36px] rounded-[6px] dark:border-white/10 dark:bg-[#0B1121] dark:text-white"
                                />
                                <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Section 2: Treatment & Procedure */}
                        <div className="space-y-[12px]">
                          <h3 className="text-[13px] font-bold text-gray-800 dark:text-white">Treatment & Procedure</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px]">
                            <div className="space-y-1">
                              <span className="text-[13px] text-gray-700 dark:text-slate-300 font-semibold block">Procedure Code (CPT)</span>
                              <FinanceSelect
                                value={treatmentDetails.procedureCode}
                                onChange={(val) => setTreatmentDetails({ ...treatmentDetails, procedureCode: val })}
                                options={[
                                  { value: "99213 - Office/outpatient visit", label: "99213 - Office/outpatient visit" },
                                  { value: "99214 - Office/outpatient visit, 30-39 minutes", label: "99214 - Office/outpatient visit, 30-39 min" },
                                  { value: "99215 - Office/outpatient visit, 40-54 minutes", label: "99215 - Office/outpatient visit, 40-54 min" },
                                ]}
                                placeholder="Select procedure code"
                                className="w-full min-w-0"
                              />
                            </div>
                            <div className="space-y-1">
                              <span className="text-[13px] text-gray-700 dark:text-slate-300 font-semibold block">Date of Service</span>
                              <FormDatePicker
                                value={treatmentDetails.dateOfService ? new Date(treatmentDetails.dateOfService) : null}
                                onChange={(date) => setTreatmentDetails({ ...treatmentDetails, dateOfService: date ? date.toISOString().split('T')[0] : '' })}
                                placeholder="DD/MM/YYYY"
                              />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[13px] text-gray-700 dark:text-slate-300 font-semibold block">Attending Provider</span>
                            <FinanceSelect
                              value={treatmentDetails.attendingProvider}
                              onChange={(val) => setTreatmentDetails({ ...treatmentDetails, attendingProvider: val })}
                              options={[
                                { value: "Dr. Sarah Jenkins", label: "Dr. Sarah Jenkins" },
                                { value: "Dr. Jane Foster", label: "Dr. Jane Foster" },
                                { value: "Dr. Michael Chang", label: "Dr. Michael Chang" },
                              ]}
                              placeholder="Select provider"
                              className="w-full min-w-0"
                            />
                          </div>
                        </div>

                        {/* Section 3: Billing Context */}
                        <div className="space-y-[12px]">
                          <h3 className="text-[13px] font-bold text-gray-800 dark:text-white">Billing Context</h3>
                          <div className="bg-[#EAEBFA]/60 border border-[#2E37A4]/20 rounded-[5px] p-[20px] flex justify-between items-center shadow-none dark:border-white/10 dark:bg-[#101935]">
                            <div className="space-y-1 max-w-[70%]">
                              <span className="text-[13px] font-bold text-[#2E37A4] dark:text-[#4F5BCA] block">Total Billed Amount</span>
                              <span className="text-[11px] text-[#2E37A4]/70 dark:text-[#4F5BCA]/70 font-medium block leading-normal">
                                This amount is auto-calculated from the patient&apos;s final bill. Any modifications should be done in the Patient Billing module.
                              </span>
                            </div>
                            <span className="text-[20px] font-extrabold text-[#2E37A4] dark:text-[#4F5BCA] tracking-tight">{patMeta.amount}</span>
                          </div>
                        </div>

                      </div>

                      {/* Right Context Cards (1 Column) */}
                      <div className="col-span-1 space-y-[20px] w-full shrink-0">
                        
                        {/* Patient Context Card */}
                        <div className="bg-white border border-[#E7E8EB] rounded-[5px] p-[20px] shadow-none dark:bg-[#101935] dark:border-white/10 space-y-[16px]">
                          <h4 className="text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-[16px]">Patient Context</h4>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#EBF5FF] border border-[#BFDBFE] flex items-center justify-center text-xs font-bold text-[#1E40AF]">
                              {activePat.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div>
                              <span className="font-bold text-[13px] text-gray-800 dark:text-white block leading-tight">{activePat.name}</span>
                              <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">UHID: {activePat.id}</span>
                            </div>
                          </div>
                          <div className="space-y-2.5 pt-1.5 text-[13px]">
                            <div className="flex justify-between font-medium">
                              <span className="text-slate-400">DOB</span>
                              <span className="text-slate-700 dark:text-slate-300 font-bold">{patMeta.dob}</span>
                            </div>
                            <div className="flex justify-between font-medium">
                              <span className="text-slate-400">Gender</span>
                              <span className="text-slate-700 dark:text-slate-300 font-bold">{patMeta.gender}</span>
                            </div>
                            <div className="flex justify-between font-medium">
                              <span className="text-slate-400">Admission</span>
                              <span className="text-slate-700 dark:text-slate-300 font-bold">{patMeta.admission}</span>
                            </div>
                          </div>
                        </div>

                        {/* Insurance Details Card */}
                        <div className="bg-white border border-[#E7E8EB] rounded-[5px] p-[20px] shadow-none dark:bg-[#101935] dark:border-white/10 space-y-[16px]">
                          <h4 className="text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-[16px]">Insurance Details</h4>
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-[5px] bg-[#EBF5FF] border border-[#BFDBFE] flex items-center justify-center shrink-0">
                              <Shield className="w-4 h-4 text-[#2E37A4]" />
                            </div>
                            <div>
                              <span className="font-bold text-[13px] text-gray-800 dark:text-white block">{patMeta.provider}</span>
                              <div className="flex items-center gap-1 mt-0.5">
                                <CheckCircle2 className="w-3 h-3 text-[#137333]" />
                                <span className="text-[10px] font-bold text-[#137333]">Verified Active</span>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2.5 pt-1.5 text-[13px]">
                            <div>
                              <span className="text-slate-400 font-medium block">Policy Number</span>
                              <span className="text-slate-700 dark:text-slate-300 font-bold block mt-0.5">{patMeta.policyNo}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 pt-1">
                              <div>
                                <span className="text-slate-400 font-medium block">Coverage</span>
                                <span className="text-slate-700 dark:text-slate-300 font-bold block mt-0.5">{patMeta.coverage}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 font-medium block">Co-pay</span>
                                <span className="text-slate-700 dark:text-slate-300 font-bold block mt-0.5">{patMeta.copay}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>

                    </div>
                  </div>
                );
              })()}

              {currentStep === 3 && (() => {
                const activePat = wizardPatients.find(p => p.action === "Selected") || wizardPatients[0];
                const patMeta = PATIENT_METADATA[activePat.id] || {
                  dob: "May 14, 1985 (38y)",
                  gender: "Male",
                  admission: "Oct 22, 2023",
                  provider: "BlueCross BlueShield",
                  policyNo: "PDL-982374665",
                  coverage: "80%",
                  copay: "20%",
                  amount: "₹4,500.00"
                };

                // Count uploaded required docs
                let uploadedCount = 0;
                if (uploadedFiles.dischargeSummary) uploadedCount++;
                if (uploadedFiles.itemizedBill) uploadedCount++;
                if (uploadedFiles.labReports) uploadedCount++;

                return (
                  <div className="p-[20px] space-y-[20px]">
                    {/* Step Header */}
                    <div className="pb-[15px]">
                      <h2 className="text-[20px] font-bold text-gray-800 dark:text-white">Document</h2>
                      <p className="text-[13px] text-slate-400 font-medium mt-1">Upload Patient&apos;s Required Documents</p>
                    </div>

                    {/* Main Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-[20px] items-start">
                      
                      {/* Left Documents Container */}
                      <div className="col-span-1 lg:col-span-3 space-y-[20px]">
                        
                        {/* Required Documents list */}
                        <div className="space-y-[12px]">
                          <div className="flex justify-between items-center">
                            <h3 className="text-[13px] font-bold text-gray-800 dark:text-white">Required Documents</h3>
                            <span className="text-[13px] font-semibold text-slate-500">{uploadedCount} of 3 uploaded</span>
                          </div>

                          <div className="space-y-[12px]">
                            {/* File 1: Discharge Summary */}
                            <div className="border border-[#E7E8EB] dark:border-white/10 rounded-[5px] p-[16px] bg-white dark:bg-[#101935] shadow-none flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#EBF5FF] flex items-center justify-center text-[#1E40AF]">
                                  <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[13px] font-bold text-gray-800 dark:text-white">Discharge Summary</span>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-[#FEF3C7] text-[#D97706]">Required</span>
                                  </div>
                                  <span className="text-[11px] text-slate-400 font-semibold mt-1 block">
                                    {uploadedFiles.dischargeSummary ? `${uploadedFiles.dischargeSummary.name} • ${uploadedFiles.dischargeSummary.size}` : "No file uploaded"}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {uploadedFiles.dischargeSummary ? (
                                  <>
                                    <Button variant="ghost" size="icon" className="w-8 h-8 rounded-[6px] hover:bg-slate-50 dark:hover:bg-slate-800 text-gray-400 hover:text-gray-600">
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      onClick={() => setUploadedFiles({ ...uploadedFiles, dischargeSummary: null })}
                                      variant="ghost"
                                      size="icon"
                                      className="w-8 h-8 rounded-[6px] hover:bg-rose-50 text-rose-500"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                    </Button>
                                  </>
                                ) : (
                                  <div className="relative">
                                    <button className="bg-[#2E37A4] hover:bg-[#1e257a] text-white text-[11px] font-semibold px-3 h-[32px] rounded-[6px] flex items-center gap-1 shadow-none">
                                      <UploadCloud className="w-3.5 h-3.5" />
                                      Upload
                                    </button>
                                    <input
                                      type="file"
                                      onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                          setUploadedFiles({
                                            ...uploadedFiles,
                                            dischargeSummary: { name: e.target.files[0].name, size: "1.8 MB" }
                                          });
                                        }
                                      }}
                                      className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* File 2: Itemized Bill */}
                            <div className="border border-[#E7E8EB] dark:border-white/10 rounded-[5px] p-[16px] bg-white dark:bg-[#101935] shadow-none flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#EBF5FF] flex items-center justify-center text-[#1E40AF]">
                                  <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[13px] font-bold text-gray-800 dark:text-white">Itemized Bill</span>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-[6px] text-[10px] font-bold bg-[#E6F4EA] text-[#137333]">Required</span>
                                  </div>
                                  <span className="text-[11px] text-slate-400 font-semibold mt-1 block">
                                    {uploadedFiles.itemizedBill ? `${uploadedFiles.itemizedBill.name} • ${uploadedFiles.itemizedBill.size}` : "No file uploaded"}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {uploadedFiles.itemizedBill ? (
                                  <>
                                    <Button variant="ghost" size="icon" className="w-8 h-8 rounded-[6px] hover:bg-slate-50 dark:hover:bg-slate-800 text-gray-400 hover:text-gray-600">
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      onClick={() => setUploadedFiles({ ...uploadedFiles, itemizedBill: null })}
                                      variant="ghost"
                                      size="icon"
                                      className="w-8 h-8 rounded-[6px] hover:bg-rose-50 text-rose-500"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                    </Button>
                                  </>
                                ) : (
                                  <div className="relative">
                                    <button className="bg-[#2E37A4] hover:bg-[#1e257a] text-white text-[11px] font-semibold px-3 h-[32px] rounded-[6px] flex items-center gap-1 shadow-none">
                                      <UploadCloud className="w-3.5 h-3.5" />
                                      Upload
                                    </button>
                                    <input
                                      type="file"
                                      onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                          setUploadedFiles({
                                            ...uploadedFiles,
                                            itemizedBill: { name: e.target.files[0].name, size: "1.2 MB" }
                                          });
                                        }
                                      }}
                                      className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* File 3: Lab Reports */}
                            <div className="border border-[#E7E8EB] dark:border-white/10 rounded-[5px] p-[16px] bg-white dark:bg-[#101935] shadow-none flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#EBF5FF] flex items-center justify-center text-[#1E40AF]">
                                  <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[13px] font-bold text-gray-800 dark:text-white">Lab Reports</span>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-[6px] text-[10px] font-bold bg-[#E6F4EA] text-[#137333]">Required</span>
                                  </div>
                                  <span className="text-[11px] text-slate-400 font-semibold mt-1 block">
                                    {uploadedFiles.labReports ? `${uploadedFiles.labReports.name} • ${uploadedFiles.labReports.size}` : "PDF, JPEG or PNG up to 10MB"}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {uploadedFiles.labReports ? (
                                  <>
                                    <Button variant="ghost" size="icon" className="w-8 h-8 rounded-[6px] hover:bg-slate-50 dark:hover:bg-slate-800 text-gray-400 hover:text-gray-600">
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      onClick={() => setUploadedFiles({ ...uploadedFiles, labReports: null })}
                                      variant="ghost"
                                      size="icon"
                                      className="w-8 h-8 rounded-[6px] hover:bg-rose-50 text-rose-500"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                    </Button>
                                  </>
                                ) : (
                                  <div className="relative">
                                    <button className="bg-[#2E37A4] hover:bg-[#1e257a] text-white text-[11px] font-semibold px-3 h-[32px] rounded-[6px] flex items-center gap-1 shadow-none">
                                      <UploadCloud className="w-3.5 h-3.5" />
                                      Upload
                                    </button>
                                    <input
                                      type="file"
                                      onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                          setUploadedFiles({
                                            ...uploadedFiles,
                                            labReports: { name: e.target.files[0].name, size: "4.2 MB" }
                                          });
                                        }
                                      }}
                                      className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Optional Documents Section */}
                        <div className="space-y-[12px] pt-1">
                          <h3 className="text-[13px] font-bold text-gray-800 dark:text-white">Additional Documents (Optional)</h3>
                          <div className="border border-dashed border-[#E7E8EB] dark:border-white/10 rounded-[5px] p-[24px] text-center bg-[#F8F9FC]/40 hover:bg-[#F8F9FC]/70 transition-colors flex flex-col items-center justify-center min-h-[160px] relative cursor-pointer">
                            <div className="w-12 h-12 rounded-full bg-[#EBF5FF] flex items-center justify-center text-[#2E37A4] mb-3">
                              <UploadCloud className="w-6 h-6" />
                            </div>
                            <span className="text-[13px] font-bold text-gray-800 dark:text-white">Click to upload or drag and drop</span>
                            <span className="text-[11px] text-slate-400 font-medium mt-1 mb-3">
                              Prescriptions, ID Proofs, Previous records (Max 10MB each)
                            </span>
                            <Button variant="outline" className="border-[#E7E8EB] text-slate-700 hover:bg-slate-50 text-[12px] font-semibold px-[16px] h-[34px] rounded-[6px] shadow-none dark:border-white/10 dark:text-slate-350">
                              Browse Files
                            </Button>
                            <input
                              type="file"
                              multiple
                              onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                  alert(`${e.target.files.length} optional documents selected successfully!`);
                                }
                              }}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                          </div>
                        </div>

                      </div>

                      {/* Right Context Cards */}
                      <div className="col-span-1 space-y-[20px] w-full shrink-0">
                        
                        {/* Patient Context Card */}
                        <div className="bg-white border border-[#E7E8EB] rounded-[5px] p-[20px] shadow-none dark:bg-[#101935] dark:border-white/10 space-y-[16px]">
                          <h4 className="text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-[16px]">Patient Context</h4>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#EBF5FF] border border-[#BFDBFE] flex items-center justify-center text-xs font-bold text-[#1E40AF]">
                              {activePat.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div>
                              <span className="font-bold text-[13px] text-gray-800 dark:text-white block leading-tight">{activePat.name}</span>
                              <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">UHID: {activePat.id}</span>
                            </div>
                          </div>
                          <div className="space-y-2.5 pt-1.5 text-[13px]">
                            <div className="flex justify-between font-medium">
                              <span className="text-slate-400">DOB</span>
                              <span className="text-slate-700 dark:text-slate-300 font-bold">{patMeta.dob}</span>
                            </div>
                            <div className="flex justify-between font-medium">
                              <span className="text-slate-400">Gender</span>
                              <span className="text-slate-700 dark:text-slate-300 font-bold">{patMeta.gender}</span>
                            </div>
                            <div className="flex justify-between font-medium">
                              <span className="text-slate-400">Admission</span>
                              <span className="text-slate-700 dark:text-slate-300 font-bold">{patMeta.admission}</span>
                            </div>
                          </div>
                        </div>

                        {/* Insurance Details Card */}
                        <div className="bg-white border border-[#E7E8EB] rounded-[5px] p-[20px] shadow-none dark:bg-[#101935] dark:border-white/10 space-y-[16px]">
                          <h4 className="text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-[16px]">Insurance Details</h4>
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-[5px] bg-[#EBF5FF] border border-[#BFDBFE] flex items-center justify-center shrink-0">
                              <Shield className="w-4 h-4 text-[#2E37A4]" />
                            </div>
                            <div>
                              <span className="font-bold text-[13px] text-gray-800 dark:text-white block">{patMeta.provider}</span>
                              <div className="flex items-center gap-1 mt-0.5">
                                <CheckCircle2 className="w-3 h-3 text-[#137333]" />
                                <span className="text-[10px] font-bold text-[#137333]">Verified Active</span>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2.5 pt-1.5 text-[13px]">
                            <div>
                              <span className="text-slate-400 font-medium block">Policy Number</span>
                              <span className="text-slate-700 dark:text-slate-300 font-bold block mt-0.5">{patMeta.policyNo}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 pt-1">
                              <div>
                                <span className="text-slate-400 font-medium block">Coverage</span>
                                <span className="text-slate-700 dark:text-slate-300 font-bold block mt-0.5">{patMeta.coverage}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 font-medium block">Co-pay</span>
                                <span className="text-slate-700 dark:text-slate-300 font-bold block mt-0.5">{patMeta.copay}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>

                    </div>
                  </div>
                );
              })()}

              {currentStep === 4 && (() => {
                const activePat = wizardPatients.find(p => p.action === "Selected") || wizardPatients[0];
                const patMeta = PATIENT_METADATA[activePat.id] || {
                  dob: "May 14, 1985 (38y)",
                  gender: "Male",
                  admission: "Oct 22, 2023",
                  provider: "BlueCross BlueShield",
                  policyNo: "PDL-982374665",
                  coverage: "80%",
                  copay: "20%",
                  amount: "₹4,500.00"
                };

                // Calculations for financials
                const totalBilledVal = parseFloat(patMeta.amount.replace(/[^\d.]/g, "")) || 4500;
                const copayPctVal = parseFloat(patMeta.copay.replace(/[^\d.]/g, "")) / 100 || 0.20;
                const copayAmtVal = totalBilledVal * copayPctVal;
                const nonPayableVal = 150;
                const netClaimVal = totalBilledVal - copayAmtVal - nonPayableVal;

                const formatVal = (num) => {
                  return `₹${num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                };

                return (
                  <div className="p-[20px] space-y-[20px]">
                    {/* Step Header */}
                    <div className="pb-[15px]">
                      <h2 className="text-[20px] font-bold text-gray-800 dark:text-white">Review Claim</h2>
                      <p className="text-[13px] text-slate-400 font-medium mt-1">Patient claim review</p>
                    </div>

                    {/* Main Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-[20px] items-start">
                      
                      {/* Left Review Panel */}
                      <div className="col-span-1 lg:col-span-3 space-y-[20px]">
                        
                        {/* Alert notice */}
                        <div className="bg-[#EBF5FF] border border-[#BFDBFE] rounded-[5px] p-[16px] flex gap-3 shadow-none">
                          <Info className="w-5 h-5 text-[#1E40AF] shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[13px] font-bold text-[#1E40AF] block">Almost done</span>
                            <span className="text-[11px] text-[#1E40AF] font-medium block mt-1 leading-normal">
                              Please review all details before submitting the claim. Edits cannot be made after submission.
                            </span>
                          </div>
                        </div>

                        {/* Section 1: Diagnosis & Treatment */}
                        <div className="space-y-[16px]">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Activity className="w-4 h-4 text-[#2E37A4]" />
                              <h3 className="text-[14px] font-bold text-gray-800 dark:text-white">Diagnosis & Treatment</h3>
                            </div>
                            <button
                              onClick={() => setCurrentStep(2)}
                              className="text-[13px] font-bold text-[#2E37A4] hover:underline cursor-pointer"
                            >
                              Edit
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-[16px] gap-x-6 text-[13px] pt-[12px]">
                            <div>
                              <span className="text-[12px] text-slate-400 font-medium block mb-1">Primary Diagnosis</span>
                              <span className="text-slate-800 dark:text-slate-200 font-bold block">{treatmentDetails.primaryDiagnosis || "Not provided"}</span>
                            </div>
                            <div>
                              <span className="text-[12px] text-slate-400 font-medium block mb-1">Secondary Diagnosis</span>
                              <span className="text-slate-700 dark:text-slate-300 font-bold block">{treatmentDetails.secondaryDiagnosis || "None provided"}</span>
                            </div>
                            <div>
                              <span className="text-[12px] text-slate-400 font-medium block mb-1">Procedure Code</span>
                              <span className="text-slate-800 dark:text-slate-200 font-bold block">{treatmentDetails.procedureCode || "Not provided"}</span>
                            </div>
                            <div>
                              <span className="text-[12px] text-slate-400 font-medium block mb-1">Date of Service</span>
                              <span className="text-slate-800 dark:text-slate-200 font-bold block">
                                {treatmentDetails.dateOfService ? new Date(treatmentDetails.dateOfService).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Not provided"}
                              </span>
                            </div>
                            <div className="col-span-1 sm:col-span-2">
                              <span className="text-[12px] text-slate-400 font-medium block mb-1">Attending Provider</span>
                              <span className="text-slate-800 dark:text-slate-200 font-bold block">{treatmentDetails.attendingProvider || "Not provided"}</span>
                            </div>
                          </div>
                        </div>

                        {/* Section 2: Attached Documents */}
                        <div className="space-y-[16px]">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Folder className="w-4 h-4 text-[#2E37A4]" />
                              <h3 className="text-[14px] font-bold text-gray-800 dark:text-white">Attached Documents</h3>
                            </div>
                            <button
                              onClick={() => setCurrentStep(3)}
                              className="text-[13px] font-bold text-[#2E37A4] hover:underline cursor-pointer"
                            >
                              Edit
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[12px]">
                            {[
                              { key: "dischargeSummary", label: "Discharge Summary", fallback: "discharge_summary_RJ.pdf" },
                              { key: "itemizedBill", label: "Itemized Bill", fallback: "final_bill_inv_002.pdf" },
                              { key: "labReports", label: "Lab Reports", fallback: "lab_results_24oct.pdf" },
                            ].map((doc) => {
                              const file = uploadedFiles[doc.key] || { name: doc.fallback };
                              return (
                                <div key={doc.key} className="border border-[#E7E8EB] rounded-[5px] p-[12px] dark:border-white/10 flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-[5px] bg-[#EBF5FF] flex items-center justify-center text-[#1E40AF] shrink-0">
                                    <FileText className="w-4 h-4" />
                                  </div>
                                  <div className="truncate">
                                    <span className="text-[13px] text-gray-800 dark:text-white font-bold block">{doc.label}</span>
                                    <span className="text-[11px] text-slate-400 font-medium truncate block mt-0.5">{file.name}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Section 3: Claim Financials */}
                        <div className="space-y-[16px]">
                          <div className="flex items-center gap-2">
                            <Coins className="w-4 h-4 text-[#2E37A4]" />
                            <h3 className="text-[14px] font-bold text-gray-800 dark:text-white">Claim Financials</h3>
                          </div>

                          <div className="space-y-[12px] text-[13px]">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-500 font-medium">Total Billed Amount</span>
                              <span className="text-slate-800 dark:text-slate-200 font-bold">{formatVal(totalBilledVal)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-500 font-medium">Patient Co-pay ({patMeta.copay})</span>
                              <span className="text-slate-800 dark:text-slate-200 font-bold">-{formatVal(copayAmtVal)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-500 font-medium">Non-payable Items</span>
                              <span className="text-slate-800 dark:text-slate-200 font-bold">-{formatVal(nonPayableVal)}</span>
                            </div>
                            <div className="flex justify-between items-center border-t border-[#E7E8EB] dark:border-white/10 pt-[12px]">
                              <span className="text-gray-800 dark:text-white font-bold">Net Claim Amount</span>
                              <span className="text-[#2E37A4] dark:text-blue-400 font-extrabold text-[18px] tracking-tight">{formatVal(netClaimVal)}</span>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Right Context Cards (1 Column) */}
                      <div className="col-span-1 space-y-[20px] w-full shrink-0">
                        
                        {/* Patient Context Card */}
                        <div className="bg-white border border-[#E7E8EB] rounded-[5px] p-[20px] shadow-none dark:bg-[#101935] dark:border-white/10 space-y-[16px]">
                          <h4 className="text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-[16px]">Patient Context</h4>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#EBF5FF] border border-[#BFDBFE] flex items-center justify-center text-xs font-bold text-[#1E40AF]">
                              {activePat.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div>
                              <span className="font-bold text-[13px] text-gray-800 dark:text-white block leading-tight">{activePat.name}</span>
                              <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">UHID: {activePat.id}</span>
                            </div>
                          </div>
                          <div className="space-y-2.5 pt-1.5 text-[13px]">
                            <div className="flex justify-between font-medium">
                              <span className="text-slate-400">DOB</span>
                              <span className="text-slate-700 dark:text-slate-300 font-bold">{patMeta.dob}</span>
                            </div>
                            <div className="flex justify-between font-medium">
                              <span className="text-slate-400">Gender</span>
                              <span className="text-slate-700 dark:text-slate-300 font-bold">{patMeta.gender}</span>
                            </div>
                            <div className="flex justify-between font-medium">
                              <span className="text-slate-400">Admission</span>
                              <span className="text-slate-700 dark:text-slate-300 font-bold">{patMeta.admission}</span>
                            </div>
                          </div>
                        </div>

                        {/* Insurance Details Card */}
                        <div className="bg-white border border-[#E7E8EB] rounded-[5px] p-[20px] shadow-none dark:bg-[#101935] dark:border-white/10 space-y-[16px]">
                          <h4 className="text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-[16px]">Insurance Details</h4>
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-[5px] bg-[#EBF5FF] border border-[#BFDBFE] flex items-center justify-center shrink-0">
                              <Shield className="w-4 h-4 text-[#2E37A4]" />
                            </div>
                            <div>
                              <span className="font-bold text-[13px] text-gray-800 dark:text-white block">{patMeta.provider}</span>
                              <div className="flex items-center gap-1 mt-0.5">
                                <CheckCircle2 className="w-3 h-3 text-[#137333]" />
                                <span className="text-[10px] font-bold text-[#137333]">Verified Active</span>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2.5 pt-1.5 text-[13px]">
                            <div>
                              <span className="text-slate-400 font-medium block">Policy Number</span>
                              <span className="text-slate-700 dark:text-slate-300 font-bold block mt-0.5">{patMeta.policyNo}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 pt-1">
                              <div>
                                <span className="text-slate-400 font-medium block">Coverage</span>
                                <span className="text-slate-700 dark:text-slate-300 font-bold block mt-0.5">{patMeta.coverage}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 font-medium block">Co-pay</span>
                                <span className="text-slate-700 dark:text-slate-300 font-bold block mt-0.5">{patMeta.copay}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>

                    </div>
                  </div>
                );
              })()}

              {/* Footer Navigation */}
              <div className="px-[20px] py-[16px] border-t border-[#E7E8EB] bg-[#F8F9FC]/60 dark:bg-white/5 dark:border-white/10 flex justify-between items-center rounded-b-[8px]">
                <div>
                  <Button
                    onClick={handleWizardBack}
                    variant="ghost"
                    type="button"
                    className="text-[13px] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 px-[16px] h-[38px] rounded-[6px] flex items-center gap-1.5 transition-all font-bold shadow-none"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleSaveDraft}
                    variant="outline"
                    type="button"
                    className="border-[#E7E8EB] dark:border-white/10 text-slate-750 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-[13px] font-semibold px-[16px] h-[38px] rounded-[6px] transition-all shadow-none"
                  >
                    Save Draft
                  </Button>
                  {currentStep < 4 ? (
                    <button
                      onClick={handleWizardNext}
                      type="button"
                      className="bg-[#2E37A4] hover:bg-[#1e257a] text-white text-[13px] font-semibold px-[18px] h-[38px] rounded-[6px] shadow-none transition-all flex items-center gap-1"
                    >
                      Save & Next
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <Button
                      onClick={handleWizardSubmit}
                      type="button"
                      className="bg-[#0F9D58] hover:bg-[#0b8043] text-white text-[13px] font-semibold px-[18px] h-[38px] rounded-[6px] shadow-none transition-all flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      Submit TPA Claim
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
      </FinancePageShell>
    );
  }

  // Calculate dynamic stats from database claims
  const statsTotalClaims = claims.length;
  const statsPendingPreAuth = claims.filter(c => c.status === "Pending").length;
  const statsApprovedAmount = claims
    .filter(c => c.status === "Approved" || c.status === "Settled")
    .reduce((sum, c) => sum + (c.rawApprovedAmount || c.rawClaimAmount || 0), 0);
  const statsRejectedClaims = claims.filter(c => c.status === "Rejected").length;

  return (
    <FinancePageShell>
      <FinanceHeader
        title="Insurance Management"
        actions={
          <>
            <button
              onClick={() => setIsVerifyingInsurance(true)}
              className="flex h-[38px] items-center gap-2 rounded-[5px] border border-[#2E37A4] px-[16px] text-[13px] font-semibold text-[#2E37A4] hover:bg-[#2E37A4]/5 transition-colors shadow-none cursor-pointer"
            >
              <Shield className="w-4 h-4 text-[#2E37A4]" />
              Verify Patient
            </button>
            <button
              onClick={() => setIsCreatingClaim(true)}
              className="flex h-[38px] items-center gap-2 rounded-[5px] bg-[#2E37A4] px-[16px] text-[13px] font-semibold text-white hover:bg-[#2E37A4]/90 transition-colors shadow-none cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              New Claim
            </button>
          </>
        }
      />

      {/* STATS CARDS */}
      <div className="grid grid-cols-2 gap-[20px] lg:grid-cols-4">
        <FinanceStatCard
          title="Total Claims (MTD)"
          value={statsTotalClaims.toString()}
          icon={FileText}
          color="blue"
          meta={
            <>
              <span className="text-[#0F9D58] font-bold">+12%</span>{" "}
              <span className="text-slate-400">vs yesterday</span>
            </>
          }
        />
        <FinanceStatCard
          title="Pending Pre-Auth"
          value={statsPendingPreAuth.toString()}
          icon={Clock}
          color="amber"
          meta={
            <>
              <span className="text-[#0F9D58] font-bold">5 urgent</span>
            </>
          }
        />
        <FinanceStatCard
          title="Approved Amount"
          value={`₹${statsApprovedAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
          icon={ShieldCheck}
          color="emerald"
          meta={
            <>
              <span className="text-[#0F9D58] font-bold">+8%</span>{" "}
              <span className="text-slate-400">vs last month</span>
            </>
          }
        />
        <FinanceStatCard
          title="Rejected Claims"
          value={statsRejectedClaims.toString()}
          icon={XCircle}
          color="rose"
          meta={
            <>
              <span className="text-[#0F9D58] font-bold">-2%</span>{" "}
              <span className="text-slate-400">vs last month</span>
            </>
          }
        />
      </div>

          {/* SEARCH & FILTER TOOLBAR */}
          <FinanceToolbar>
            <FinanceSearchField
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search..."
              className="w-full sm:w-[320px]"
            />
            <FinanceSelect
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="All Status"
              options={[
                { label: "All", value: "All" },
                { label: "Approved", value: "Approved" },
                { label: "Pending", value: "Pending" },
                { label: "Rejected", value: "Rejected" },
              ]}
              className="sm:min-w-[120px]"
            />
          </FinanceToolbar>

          {/* TABLE CONTAINER */}
          <FinanceTableCard>
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[900px] text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E7E8EB] bg-[#F8F9FC]/60 dark:bg-[#0A0F1D]/40">
                  <th className="px-[24px] py-[16px] text-[12px] font-bold text-slate-500 tracking-normal">Claim ID</th>
                  <th className="px-[24px] py-[16px] text-[12px] font-bold text-slate-500 tracking-normal">Patient</th>
                  <th className="px-[24px] py-[16px] text-[12px] font-bold text-slate-500 tracking-normal">Provider</th>
                  <th className="px-[24px] py-[16px] text-[12px] font-bold text-slate-500 tracking-normal">Total Amount</th>
                  <th className="px-[24px] py-[16px] text-[12px] font-bold text-slate-500 tracking-normal">Date</th>
                  <th className="px-[24px] py-[16px] text-[12px] font-bold text-slate-500 tracking-normal">Status</th>
                  <th className="px-[24px] py-[16px] text-[12px] font-bold text-slate-500 tracking-normal text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E8EB] dark:divide-white/10">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-[24px] py-[40px] text-center text-[13px] font-medium text-slate-400">
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-[#2E37A4]" />
                        Loading claims from database...
                      </span>
                    </td>
                  </tr>
                ) : filteredClaims.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-[24px] py-[40px] text-center text-[13px] font-medium text-slate-400">
                      No claims found matching filters.
                    </td>
                  </tr>
                ) : (
                  filteredClaims.map((claim, index) => {
                    const providerMeta = PROVIDERS[claim.provider] || { initial: "P" };
                    const initials = providerMeta.initial;
                    return (
                      <tr key={`${claim.id}-${index}`} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                        <td className="whitespace-nowrap px-[24px] py-[16px] text-[13px] font-semibold text-[#1E293B] dark:text-white">
                          {claim.id}
                        </td>
                        <td className="whitespace-nowrap px-[24px] py-[16px] text-[13px] font-semibold text-[#1E293B] dark:text-white">
                          {claim.patient}
                        </td>
                        <td className="px-[24px] py-[16px]">
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] bg-[#EBF5FF] text-[#1E40AF] border border-[#BFDBFE] text-[12px] font-bold">
                              {initials}
                            </div>
                            <span className="text-[13px] font-medium text-slate-700 dark:text-slate-300">
                              {claim.provider}
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-[24px] py-[16px] text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                          {claim.amount}
                        </td>
                        <td className="whitespace-nowrap px-[24px] py-[16px] text-[13px] font-normal text-slate-500">
                          {claim.date}
                        </td>
                        <td className="whitespace-nowrap px-[24px] py-[16px]">
                          <span
                            className={`inline-block px-[12px] py-[4px] rounded-[6px] text-[12px] font-medium ${
                              claim.status === "Approved"
                                ? "bg-[#E6F4EA] text-[#137333]"
                                : claim.status === "Pending"
                                ? "bg-[#FEF7E0] text-[#B06000]"
                                : "bg-[#FCE8E6] text-[#C5221F]"
                            }`}
                          >
                            {claim.status}
                          </span>
                        </td>
                        <td className="px-[24px] py-[16px] text-right">
                          <button
                            onClick={() => setSelectedClaim(claim)}
                            className="inline-flex items-center justify-center rounded-[6px] p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#2E37A4] transition-colors"
                          >
                            <Eye className="w-4.5 h-4.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            </div>
          </FinanceTableCard>

          {/* DIALOGS */}
          {/* 1. VERIFY PATIENT INSURANCE DIALOG */}
          <Dialog open={isVerifyOpen} onOpenChange={setIsVerifyOpen}>
            <DialogContent className="w-[calc(100vw-40px)] sm:max-w-[500px] p-0 border border-[#E7E8EB] rounded-[5px] overflow-hidden bg-white shadow-none focus-visible:outline-none max-h-[90vh] overflow-y-auto">
              <div className="p-[20px] border-b border-[#E7E8EB] flex justify-between items-center bg-white">
                <DialogTitle className="text-[16px] font-bold text-gray-900">
                  Verify Patient Insurance
                </DialogTitle>
                <button
                  onClick={() => setIsVerifyOpen(false)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleVerifySubmit} className="space-y-0">
                <div className="p-[20px] space-y-[20px]">
                  <div className="space-y-1">
                    <span className="text-[13px] text-gray-700 font-semibold block">
                      Patient Name / ID
                    </span>
                    <input
                      required
                      value={verifyName}
                      onChange={(e) => setVerifyName(e.target.value)}
                      placeholder="Enter Patient Name or ID..."
                      className="h-[40px] w-full rounded-[6px] border border-[#E7E8EB] bg-white px-3 text-[13px] font-medium text-slate-800 outline-none focus:border-[#2E37A4]"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[13px] text-gray-700 font-semibold block">
                      Insurance Provider
                    </span>
                    <div className="relative">
                      <select
                        value={verifyProvider}
                        onChange={(e) => setVerifyProvider(e.target.value)}
                        className="h-[40px] w-full rounded-[6px] border border-[#E7E8EB] bg-white px-3 pr-9 text-[13px] font-semibold text-slate-700 outline-none appearance-none cursor-pointer focus:border-[#2E37A4]"
                      >
                        {Object.keys(PROVIDERS).map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[13px] text-gray-700 font-semibold block">
                      Policy / Member ID
                    </span>
                    <input
                      required
                      value={verifyPolicy}
                      onChange={(e) => setVerifyPolicy(e.target.value)}
                      placeholder="Enter policy or member ID..."
                      className="h-[40px] w-full rounded-[6px] border border-[#E7E8EB] bg-white px-3 text-[13px] font-medium text-slate-800 outline-none focus:border-[#2E37A4]"
                    />
                  </div>

                  {verifyStatus === "checking" && (
                    <div className="bg-[#EEF2F6]/55 border border-[#E2E8F0] rounded-[6px] p-[20px] flex items-center gap-3">
                      <Activity className="w-5 h-5 text-[#2E37A4] animate-pulse" />
                      <span className="text-[13px] text-[#2E37A4] font-semibold">
                        Contacting TPA verification gateway...
                      </span>
                    </div>
                  )}

                  {verifyStatus === "success" && (
                    <div className="bg-[#E6F4EA] border border-[#C2E7CD] rounded-[6px] p-[20px] flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 text-[#137333]">
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                        <span className="text-[13px] font-bold">Policy Verified Active</span>
                      </div>
                      <p className="text-[11px] text-[#137333] font-medium pl-[28px]">
                        Policy is active. Approved copay is 80%. TPA Cashless Pre-Auth eligible for standard services.
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-[20px] border-t border-[#E7E8EB] bg-white flex justify-end gap-[12px]">
                  <button
                    type="button"
                    onClick={() => setIsVerifyOpen(false)}
                    className="h-[38px] rounded-[6px] border border-slate-200 px-[16px] text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Close
                  </button>
                  {verifyStatus !== "success" && (
                    <button
                      type="submit"
                      disabled={verifyStatus === "checking"}
                      className="h-[38px] rounded-[6px] bg-[#2E37A4] px-[16px] text-[13px] font-semibold text-white hover:bg-[#2E37A4]/90 transition-colors shadow-none disabled:opacity-50"
                    >
                      Verify Coverage
                    </button>
                  )}
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* 2. NEW CLAIM DIALOG */}
          <Dialog open={isNewClaimOpen} onOpenChange={setIsNewClaimOpen}>
            <DialogContent className="w-[calc(100vw-40px)] sm:max-w-[500px] p-0 border border-[#E7E8EB] rounded-[5px] overflow-hidden bg-white shadow-none focus-visible:outline-none max-h-[90vh] overflow-y-auto">
              <div className="p-[20px] border-b border-[#E7E8EB] flex justify-between items-center bg-white">
                <DialogTitle className="text-[16px] font-bold text-gray-900">
                  New Cashless Claim Submission
                </DialogTitle>
                <button
                  onClick={() => setIsNewClaimOpen(false)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleNewClaimSubmit} className="space-y-0">
                <div className="p-[20px] space-y-[20px]">
                  <div className="grid grid-cols-2 gap-[20px]">
                    <div className="space-y-1">
                      <span className="text-[13px] text-gray-700 font-semibold block">
                        Patient Name
                      </span>
                      <input
                        required
                        value={newPatient}
                        onChange={(e) => setNewPatient(e.target.value)}
                        placeholder="E.g., John Doe"
                        className="h-[40px] w-full rounded-[6px] border border-[#E7E8EB] bg-white px-3 text-[13px] font-medium text-slate-800 outline-none focus:border-[#2E37A4]"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[13px] text-gray-700 font-semibold block">
                        Patient UHID
                      </span>
                      <input
                        required
                        value={newUHID}
                        onChange={(e) => setNewUHID(e.target.value)}
                        placeholder="E.g., P-882988"
                        className="h-[40px] w-full rounded-[6px] border border-[#E7E8EB] bg-white px-3 text-[13px] font-medium text-slate-800 outline-none focus:border-[#2E37A4]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-[20px]">
                    <div className="space-y-1">
                      <span className="text-[13px] text-gray-700 font-semibold block">
                        Insurance Provider
                      </span>
                      <div className="relative">
                        <select
                          value={newProvider}
                          onChange={(e) => setNewProvider(e.target.value)}
                          className="h-[40px] w-full rounded-[6px] border border-[#E7E8EB] bg-white px-3 pr-9 text-[13px] font-semibold text-slate-700 outline-none appearance-none cursor-pointer focus:border-[#2E37A4]"
                        >
                          {Object.keys(PROVIDERS).map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[13px] text-gray-700 font-semibold block">
                        Policy ID
                      </span>
                      <input
                        required
                        value={newPolicy}
                        onChange={(e) => setNewPolicy(e.target.value)}
                        placeholder="E.g., POL-KP-1029"
                        className="h-[40px] w-full rounded-[6px] border border-[#E7E8EB] bg-white px-3 text-[13px] font-medium text-slate-800 outline-none focus:border-[#2E37A4]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-[20px]">
                    <div className="space-y-1">
                      <span className="text-[13px] text-gray-700 font-semibold block">
                        Claim Amount (INR)
                      </span>
                      <input
                        required
                        type="number"
                        value={newAmount}
                        onChange={(e) => setNewAmount(e.target.value)}
                        placeholder="E.g., 5000"
                        className="h-[40px] w-full rounded-[6px] border border-[#E7E8EB] bg-white px-3 text-[13px] font-medium text-slate-800 outline-none focus:border-[#2E37A4]"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[13px] text-gray-700 font-semibold block">
                        Diagnostic ICD-10 Code
                      </span>
                      <input
                        required
                        value={newDiagnostics}
                        onChange={(e) => setNewDiagnostics(e.target.value)}
                        placeholder="E.g., Influenza"
                        className="h-[40px] w-full rounded-[6px] border border-[#E7E8EB] bg-white px-3 text-[13px] font-medium text-slate-800 outline-none focus:border-[#2E37A4]"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-[20px] border-t border-[#E7E8EB] bg-white flex justify-end gap-[12px]">
                  <button
                    type="button"
                    onClick={() => setIsNewClaimOpen(false)}
                    className="h-[38px] rounded-[6px] border border-slate-200 px-[16px] text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-[38px] rounded-[6px] bg-[#2E37A4] px-[16px] text-[13px] font-semibold text-white hover:bg-[#2E37A4]/90 transition-colors shadow-none"
                  >
                    Submit Claim
                  </button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* 3. VIEW CLAIM DETAILS DIALOG */}
          <Dialog open={selectedClaim !== null} onOpenChange={(open) => !open && setSelectedClaim(null)}>
            <DialogContent className="w-[calc(100vw-40px)] sm:max-w-[550px] p-0 border border-[#E7E8EB] rounded-[5px] overflow-hidden bg-white shadow-none focus-visible:outline-none max-h-[90vh] overflow-y-auto">
              <div className="p-[20px] border-b border-[#E7E8EB] flex justify-between items-center bg-white">
                <DialogTitle className="text-[16px] font-bold text-gray-900">
                  Claim Information
                </DialogTitle>
                <button
                  onClick={() => setSelectedClaim(null)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {selectedClaim && (
                <div className="space-y-0">
                  <div className="p-[20px] space-y-[20px]">
                    {/* Header Info */}
                    <div className="flex justify-between items-start border-b border-[#E7E8EB] pb-[20px]">
                      <div>
                        <span className="text-[11px] text-[#2E37A4] font-bold block mb-1">
                          {selectedClaim.id}
                        </span>
                        <span className="text-[18px] font-bold text-gray-900 block leading-tight">
                          {selectedClaim.patient}
                        </span>
                      </div>
                      <span
                        className={`inline-block px-[12px] py-[4px] rounded-[6px] text-[12px] font-medium ${
                          selectedClaim.status === "Approved"
                            ? "bg-[#E6F4EA] text-[#137333]"
                            : selectedClaim.status === "Pending"
                            ? "bg-[#FEF7E0] text-[#B06000]"
                            : "bg-[#FCE8E6] text-[#C5221F]"
                        }`}
                      >
                        {selectedClaim.status}
                      </span>
                    </div>

                    {/* Grid details */}
                    <div className="grid grid-cols-2 gap-[20px] text-[13px]">
                      <div className="border border-[#E7E8EB] rounded-[5px] p-[20px] bg-[#F8F9FC]/40">
                        <span className="text-[11px] text-gray-400 font-bold block mb-1">
                          UHID
                        </span>
                        <span className="text-gray-800 font-bold block">
                          {selectedClaim.uhid}
                        </span>
                      </div>
                      <div className="border border-[#E7E8EB] rounded-[5px] p-[20px] bg-[#F8F9FC]/40">
                        <span className="text-[11px] text-gray-400 font-bold block mb-1">
                          Policy Number
                        </span>
                        <span className="text-gray-800 font-bold block">
                          {selectedClaim.policyNo}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-[20px] text-[13px]">
                      <div className="border border-[#E7E8EB] rounded-[5px] p-[20px] bg-[#F8F9FC]/40">
                        <span className="text-[11px] text-gray-400 font-bold block mb-1">
                          Provider
                        </span>
                        <span className="text-gray-800 font-bold block">
                          {selectedClaim.provider}
                        </span>
                      </div>
                      <div className="border border-[#E7E8EB] rounded-[5px] p-[20px] bg-[#F8F9FC]/40">
                        <span className="text-[11px] text-gray-400 font-bold block mb-1">
                          Co-Pay Exclusions
                        </span>
                        <span className="text-gray-800 font-bold block">
                          {selectedClaim.coPay || "N/A"}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-[20px] text-[13px]">
                      <div className="border border-[#E7E8EB] rounded-[5px] p-[20px] bg-[#F8F9FC]/40">
                        <span className="text-[11px] text-gray-400 font-bold block mb-1">
                          Claim Amount
                        </span>
                        <span className="text-gray-800 font-bold block text-[15px]">
                          {selectedClaim.amount}
                        </span>
                      </div>
                      <div className="border border-[#E7E8EB] rounded-[5px] p-[20px] bg-[#F8F9FC]/40">
                        <span className="text-[11px] text-gray-400 font-bold block mb-1">
                          Date Processed
                        </span>
                        <span className="text-gray-800 font-bold block">
                          {selectedClaim.date}
                        </span>
                      </div>
                    </div>

                    {/* Diagnoses and Notes */}
                    <div className="space-y-1.5">
                      <span className="text-[13px] text-gray-800 font-bold block">
                        Diagnostic Details
                      </span>
                      <div className="bg-[#F8F9FC]/60 border border-[#E7E8EB] rounded-[5px] p-[20px] text-[13px] font-medium text-gray-700">
                        {selectedClaim.diagnostics}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[13px] text-gray-800 font-bold block">
                        TPA Remarks & Logs
                      </span>
                      <div className="bg-[#F8F9FC]/60 border border-[#E7E8EB] rounded-[5px] p-[20px] text-[13px] font-medium text-gray-600 leading-relaxed">
                        {selectedClaim.notes}
                      </div>
                    </div>
                  </div>

                  <div className="p-[20px] border-t border-[#E7E8EB] bg-white flex justify-end">
                    <button
                      onClick={() => setSelectedClaim(null)}
                      className="h-[38px] rounded-[6px] bg-[#2E37A4] px-[20px] text-[13px] font-semibold text-white hover:bg-[#2E37A4]/90 transition-colors shadow-none"
                    >
                      Okay
                    </button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
      </FinancePageShell>
    );
  }

