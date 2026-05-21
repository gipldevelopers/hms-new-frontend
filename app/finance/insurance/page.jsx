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
  FinanceTableCard,
  FinanceToolbar,
  CompactStatCard,
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";


// --- MOCK PROVIDERS WITH BRANDS & COLORS ---
const PROVIDERS = {
  "BlueCross BlueShield": { initial: "B", bg: "bg-[#f0f9ff] text-[#0284c7] border-[#e0f2fe]", dot: "bg-[#0284c7]" },
  "UnitedHealthcare": { initial: "U", bg: "bg-[#f0f9ff] text-[#0284c7] border-[#e0f2fe]", dot: "bg-[#0284c7]" },
  "Aetna": { initial: "A", bg: "bg-[#f0f9ff] text-[#0284c7] border-[#e0f2fe]", dot: "bg-[#0284c7]" },
  "Cigna": { initial: "A", bg: "bg-[#f0f9ff] text-[#0284c7] border-[#e0f2fe]", dot: "bg-[#0284c7]" },
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
    amount: "₹4,500.00",
    date: "Oct 27, 2023",
    status: "Approved",
    policyNo: "POL-BC-9908",
    coPay: "20%",
    diagnostics: "Acute Bronchitis",
    notes: "TPA approved within standard 4-hour SLA.",
  },
  {
    id: "CLM-2023-892",
    patient: "Sophia Turner",
    uhid: "P-882911",
    provider: "UnitedHealthcare",
    amount: "₹3,200.00",
    date: "Oct 26, 2023",
    status: "Pending",
    policyNo: "POL-UH-3312",
    coPay: "15%",
    diagnostics: "Dental Restoration",
    notes: "Awaiting additional document uploads from provider.",
  },
  {
    id: "CLM-2023-893",
    patient: "Michael Smith",
    uhid: "P-882912",
    provider: "Aetna",
    amount: "₹5,100.00",
    date: "Oct 25, 2023",
    status: "Rejected",
    policyNo: "POL-AE-4421",
    coPay: "30%",
    diagnostics: "Cosmetic Surgery",
    notes: "Claim rejected: Procedures not covered under standard corporate policy exclusions.",
  },
  {
    id: "CLM-2023-894",
    patient: "Emily Johnson",
    uhid: "P-882913",
    provider: "Cigna",
    amount: "₹6,000.00",
    date: "Oct 24, 2023",
    status: "Approved",
    policyNo: "POL-CG-8871",
    coPay: "10%",
    diagnostics: "Chronic Migraine Therapy",
    notes: "Full co-pay settled directly via corporate cashless program.",
  },
  {
    id: "CLM-2023-895",
    patient: "Daniel Wilson",
    uhid: "P-882914",
    provider: "Kaiser Permanente",
    amount: "₹3,000.00",
    date: "Oct 23, 2023",
    status: "Approved",
    policyNo: "POL-KP-5561",
    coPay: "25%",
    diagnostics: "Ophthalmology Consultation",
    notes: "TPA cashless authorization completed pre-procedure.",
  },
  {
    id: "CLM-2023-896",
    patient: "Olivia Brown",
    uhid: "P-882915",
    provider: "Humana",
    amount: "₹4,900.00",
    date: "Oct 22, 2023",
    status: "Pending",
    policyNo: "POL-HU-2287",
    coPay: "20%",
    diagnostics: "Orthopedic Evaluation",
    notes: "Pre-auth request in queue for final medical director review.",
  },
  {
    id: "CLM-2023-897",
    patient: "James Davis",
    uhid: "P-882916",
    provider: "Health Net",
    amount: "₹4,300.00",
    date: "Oct 21, 2023",
    status: "Rejected",
    policyNo: "POL-HN-7752",
    coPay: "15%",
    diagnostics: "Alternative Physiotherapy",
    notes: "Rejected due to out-of-network provider center limitation.",
  },
  {
    id: "CLM-2023-898",
    patient: "Ava Miller",
    uhid: "P-882917",
    provider: "Blue Shield",
    amount: "₹5,000.00",
    date: "Oct 20, 2023",
    status: "Approved",
    policyNo: "POL-BS-1104",
    coPay: "20%",
    diagnostics: "Pediatric Wellness Checkup",
    notes: "Cashless authorization cleared.",
  },
];

export default function InsurancePage() {
  const [claims, setClaims] = useState(INITIAL_CLAIMS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modals state
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [isNewClaimOpen, setIsNewClaimOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);

  // Consolidated modal scroll-lock and escape key hook
  const isAnyModalOpen = isVerifyOpen || isNewClaimOpen || selectedClaim !== null;
  useEffect(() => {
    if (isAnyModalOpen) {
      document.body.style.overflow = "hidden";
      const handleEsc = (e) => {
        if (e.key === "Escape") {
          setIsVerifyOpen(false);
          setIsNewClaimOpen(false);
          setSelectedClaim(null);
        }
      };
      window.addEventListener("keydown", handleEsc);
      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleEsc);
      };
    }
  }, [isAnyModalOpen]);

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

  const handleWizardSubmit = () => {
    const activePat = wizardPatients.find(p => p.action === "Selected") || wizardPatients[0];
    const patMeta = PATIENT_METADATA[activePat.id] || { policyNo: "PDL-982374665", copay: "20%", amount: "₹4,500.00" };
    const generatedId = `CLM-2023-${Math.floor(100 + Math.random() * 900)}`;

    const dateToday = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const newClaim = {
      id: generatedId,
      patient: activePat.name,
      uhid: activePat.id,
      provider: activePat.insurance,
      amount: patMeta.amount,
      date: dateToday,
      status: "Pending",
      policyNo: patMeta.policyNo,
      coPay: patMeta.copay,
      diagnostics: treatmentDetails.primaryDiagnosis || "General Consultation",
      notes: `Pre-auth cashless authorization initialized for attending provider ${treatmentDetails.attendingProvider}.`,
    };

    setClaims([newClaim, ...claims]);
    setIsCreatingClaim(false);
    // Reset state
    setCurrentStep(1);
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
  const [verifyStatus, setVerifyStatus] = useState("idle"); // idle, checking, success, error

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

  const handleNewClaimSubmit = (e) => {
    e.preventDefault();
    const generatedId = `CLM-2023-${Math.floor(100 + Math.random() * 900)}`;
    const formattedAmount = `₹${parseFloat(newAmount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
    const dateToday = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const newClaim = {
      id: generatedId,
      patient: newPatient,
      uhid: newUHID || "P-882999",
      provider: newProvider,
      amount: formattedAmount,
      date: dateToday,
      status: "Pending",
      policyNo: newPolicy || "POL-GEN-1029",
      coPay: "20%",
      diagnostics: newDiagnostics || "General Medical Care",
      notes: "Cashless authorization request generated and pending medical TPA verification.",
    };

    setClaims([newClaim, ...claims]);
    setIsNewClaimOpen(false);

    // Reset fields
    setNewPatient("");
    setNewUHID("");
    setNewAmount("");
    setNewPolicy("");
    setNewDiagnostics("");
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
      <div className="min-h-screen flex-1 space-y-6 bg-[#f8fafc] p-6 transition-colors duration-300 dark:bg-[#0B1121]">

        {/* Navigation Breadcrumb & Page title */}
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-xl font-black text-[#0F172A] dark:text-white">Verify Patient Insurance</h1>
            <p className="text-xs font-semibold text-gray-400 dark:text-slate-500">Check patient Eligibility and active policy status</p>
          </div>
        </div>

        <div className="flex min-h-[580px] flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-white/10 dark:bg-[#101935]">

          {/* Main content grid */}
          <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">

            {/* Left Content (3 Columns on desktop, 1 on mobile) */}
            <div className="col-span-1 lg:col-span-3 space-y-6">

              {/* Card 1: Patient Lookup */}
              <div className="space-y-4 rounded-xl border border-slate-100 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#0B1121]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-white">Patient Lookup</h3>

                <div className="space-y-1.5">
                  <span className="text-[10px] text-gray-400 font-bold block">Patient UHID / Policy Number</span>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
                      <Input
                        value={verifyUhid}
                        onChange={(e) => setVerifyUhid(e.target.value)}
                        placeholder="Enter Patient UHID or Policy Number..."
                        className="h-10 rounded-lg border-slate-150 pl-10 text-xs focus-visible:ring-[#2E37A4] dark:border-white/10 dark:bg-[#101935] dark:text-white dark:placeholder:text-slate-500"
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
                      className="bg-[#2E37A4] hover:bg-[#1e257a] text-white text-xs font-bold px-5 h-10 rounded-lg shadow-sm"
                    >
                      Search
                    </button>
                  </div>
                </div>

                {/* Profile Box */}
                {matchedPat && (
                  <div className="mt-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-xl border border-slate-50 bg-[#f8fafc]/40 p-4 dark:border-white/10 dark:bg-white/5 gap-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 w-full">
                      <div className="w-10 h-10 rounded-full bg-slate-50 border border-[#e0f2fe]/50 flex items-center justify-center text-xs font-bold text-[#2E37A4] shrink-0">
                        {matchedPat.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-3.5 text-xs w-full">
                        <div>
                          <span className="text-[9px] text-gray-400 font-bold block mb-0.5">Patient Name</span>
                          <span className="text-gray-800 font-bold block truncate max-w-[120px]">{matchedPat.name}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-gray-400 font-bold block mb-0.5">UHID</span>
                          <span className="text-gray-700 font-semibold block">{matchedPat.id}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-gray-400 font-bold block mb-0.5">Date of Birth</span>
                          <span className="text-gray-700 font-semibold block">{patMeta.dob}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-gray-400 font-bold block mb-0.5">Contact</span>
                          <span className="text-gray-700 font-semibold block">+1 (555) 123-4567</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Card 2: Primary Insurance Details */}
              <div className="space-y-4 rounded-xl border border-slate-100 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#0B1121]">
                <div className="flex items-center justify-between border-b border-slate-50 pb-2 dark:border-white/10">
                  <div className="flex items-center gap-2 text-[#2E37A4]">
                    <Shield className="w-4 h-4" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-white">Primary Insurance Details</h3>
                  </div>
                  <div className="bg-indigo-50/50 text-[#2E37A4] border border-indigo-50/50 rounded-full px-2.5 py-0.5 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#2E37A4] animate-pulse" />
                    <span className="text-[9px] font-extrabold uppercase tracking-wide">Ready for Verification</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-xs pt-1.5">
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-gray-400 font-bold block">Insurance Provider</span>
                    <div className="relative">
                      <select
                        value={verifyProvider}
                        onChange={(e) => setVerifyProvider(e.target.value)}
                        className="h-10 w-full appearance-none rounded-lg border border-slate-150 bg-white px-3 text-xs font-bold text-gray-700 shadow-sm focus:border-slate-350 focus:outline-none dark:border-white/10 dark:bg-[#101935] dark:text-slate-200"
                      >
                        {Object.keys(PROVIDERS).map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] text-gray-400 font-bold block">Policy/Member ID</span>
                    <Input
                      value={verifyPolicy || patMeta.policyNo}
                      onChange={(e) => setVerifyPolicy(e.target.value)}
                      placeholder="Enter policy/member ID..."
                      className="h-10 rounded-lg border-slate-150 text-xs focus-visible:ring-[#2E37A4] dark:border-white/10 dark:bg-[#101935] dark:text-white dark:placeholder:text-slate-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] text-gray-400 font-bold block">Group Number (Optional)</span>
                    <Input
                      value={verifyGroupNo}
                      onChange={(e) => setVerifyGroupNo(e.target.value)}
                      placeholder="Enter group number..."
                      className="h-10 rounded-lg border-slate-150 text-xs focus-visible:ring-[#2E37A4] dark:border-white/10 dark:bg-[#101935] dark:text-white dark:placeholder:text-slate-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] text-gray-400 font-bold block">Relationship to Subscriber</span>
                    <div className="relative">
                      <select
                        value={verifyRelation}
                        onChange={(e) => setVerifyRelation(e.target.value)}
                        className="h-10 w-full appearance-none rounded-lg border border-slate-150 bg-white px-3 text-xs font-bold text-gray-700 shadow-sm focus:border-slate-350 focus:outline-none dark:border-white/10 dark:bg-[#101935] dark:text-slate-200"
                      >
                        <option value="Self">Self</option>
                        <option value="Spouse">Spouse</option>
                        <option value="Child">Child</option>
                        <option value="Other">Other</option>
                      </select>
                      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Panel: Verification status card (1 Column) */}
            <div className="space-y-4 shrink-0">

              {/* Coverage Check box */}
              {verifyStatus === "checking" ? (
                <div className="flex min-h-[340px] flex-col items-center justify-center space-y-4 rounded-xl border border-slate-100 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#0B1121]">
                  <Activity className="w-12 h-12 text-[#2E37A4] animate-pulse" />
                  <div className="text-center">
                    <span className="text-xs font-bold text-gray-800 block">Verifying Policy status</span>
                    <span className="text-[10px] text-gray-400 font-medium block mt-1">Connecting to TPA secure endpoint...</span>
                  </div>
                </div>
              ) : hasVerifiedPolicy ? (
                <div className="flex min-h-[340px] flex-col overflow-hidden rounded-xl border-2 border-emerald-500 bg-white shadow-sm dark:bg-[#0B1121]">

                  {/* Green Top bar */}
                  <div className="bg-[#E8F8F0] py-6 px-4 flex flex-col items-center justify-center border-b border-slate-50 text-center space-y-3.5">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-[#0F9D58]">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-800 block">Active Coverage</h4>
                      <span className="text-[10px] text-[#0F9D58] font-bold block mt-1">Verified today at 10:42 AM</span>
                    </div>
                  </div>

                  {/* Policy and Coverage specifics */}
                  <div className="p-4 space-y-4 text-xs">
                    <div>
                      <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">Plan Name</span>
                      <span className="text-gray-800 font-extrabold block mt-0.5">Blue Access PPO</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">Effective Date</span>
                        <span className="text-gray-800 font-bold block mt-0.5">Jan 01, 2023</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">Expiry Date</span>
                        <span className="text-gray-800 font-bold block mt-0.5">Dec 31, 2024</span>
                      </div>
                    </div>

                    <div className="border-t border-slate-50 pt-3 space-y-2">
                      <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">Coverage Highlights</span>

                      <div className="flex justify-between font-medium">
                        <span className="text-gray-400">Co-pay (Outpatient)</span>
                        <span className="text-gray-800 font-bold">$25.00</span>
                      </div>
                      <div className="flex justify-between font-medium border-t border-slate-50/50 pt-1.5">
                        <span className="text-gray-400">Co-insurance</span>
                        <span className="text-gray-800 font-bold">20%</span>
                      </div>
                      <div className="flex justify-between font-medium border-t border-slate-50/50 pt-1.5">
                        <span className="text-gray-400">Deductible Met</span>
                        <span className="text-[#0F9D58] font-bold">$1,200 / $1,500</span>
                      </div>
                    </div>

                    {/* Download Benefit button */}
                    <Button
                      onClick={() => alert("Downloading Policy Benefits PDF...")}
                      variant="outline"
                      className="w-full border-slate-150 text-gray-700 hover:bg-slate-50 text-[10px] font-bold py-2 h-9 rounded-lg flex items-center justify-center gap-1.5 shadow-sm mt-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download Benefits PDF
                    </Button>
                  </div>

                </div>
              ) : (
                <div className="flex min-h-[340px] flex-col items-center justify-center space-y-3.5 rounded-xl border border-slate-100 bg-white p-5 text-center shadow-sm dark:border-white/10 dark:bg-[#0B1121]">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-gray-400">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">Pending Verification</span>
                    <p className="text-[10px] text-gray-400 font-medium block mt-1 leading-normal max-w-[150px] mx-auto">
                      Fill policy numbers and click search or verify to pull coverage results.
                    </p>
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* Footer controls */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center border-t border-slate-50 bg-slate-50/10 px-6 py-4 dark:border-white/10 dark:bg-white/5">
            <div className="w-full sm:w-auto flex justify-start">
              <Button
                onClick={() => setIsVerifyingInsurance(false)}
                variant="ghost"
                type="button"
                className="text-xs text-gray-600 hover:text-gray-800 hover:bg-slate-50 px-4 h-9.5 rounded-lg flex items-center gap-1.5 transition-all font-bold w-full sm:w-auto justify-center"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </div>
            <div className="flex flex-col-reverse sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                onClick={() => setIsVerifyingInsurance(false)}
                variant="outline"
                type="button"
                className="border-gray-200 text-gray-700 hover:bg-slate-50 text-xs font-bold px-4.5 h-9.5 rounded-lg transition-all w-full sm:w-auto"
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
                className="bg-[#2E37A4] hover:bg-[#1e257a] text-white text-xs font-bold px-5.5 h-9.5 rounded-lg shadow-md transition-all flex items-center justify-center gap-1 w-full sm:w-auto"
              >
                Verify
              </button>
            </div>
          </div>

        </div>

      </div>
    );
  }

  if (isCreatingClaim) {
    return (
      <div className="min-h-screen flex-1 space-y-6 bg-[#f8fafc] p-6 transition-colors duration-300 dark:bg-[#0B1121]">
        {/* 1. HEADER SECTION */}
        <div className="flex justify-between items-center mb-2">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Create New Claim</h1>
          </div>
        </div>

        {/* 2. TWO-COLUMN WIZARD LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* LEFT SIDEBAR: Claim Steps */}
          <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm dark:bg-[#0B1121] dark:border-white/10">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50 pb-2.5 mb-4 sm:mb-0">Claim Steps</h2>
            <div className="flex flex-row overflow-x-auto sm:flex-col gap-4 sm:space-y-4 sm:gap-0 pb-2 sm:pb-0 scrollbar-none whitespace-nowrap">
              {[
                { number: 1, label: "Patient Selection" },
                { number: 2, label: "Treatment Details" },
                { number: 3, label: "Documents" },
                { number: 4, label: "Review" },
              ].map((step) => {
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;
                return (
                  <div key={step.number} className="flex items-center gap-3 shrink-0">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all border ${isActive
                        ? "bg-[#2E37A4] text-white border-[#2E37A4]"
                        : isCompleted
                          ? "bg-[#E8F8F0] text-[#0F9D58] border-[#E8F8F0]"
                          : "bg-slate-50 text-gray-400 border-slate-100"
                        }`}
                    >
                      {isCompleted ? <Check className="w-3 h-3" /> : step.number}
                    </div>
                    <span
                      className={`text-xs font-bold ${isActive
                        ? "text-[#2E37A4]"
                        : isCompleted
                          ? "text-[#0F9D58]"
                          : "text-gray-400"
                        }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT CONTENT CARD: Step specific form */}
          <div className="col-span-1 lg:col-span-3 bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden flex flex-col">
            {/* Step Content */}
            {currentStep === 1 && (
              <div className="p-6 space-y-5">
                <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-[#0F172A]">Select Patient</h2>
                    <p className="text-xs text-gray-400 font-semibold mt-0.5">Please select the patient</p>
                  </div>
                  <Button variant="outline" type="button" className="border-gray-200 text-gray-700 hover:bg-slate-50 text-xs font-bold px-3 h-8.5 rounded-lg flex items-center gap-1.5 shadow-sm">
                    <Search className="w-3.5 h-3.5 text-gray-400" />
                    Find Existing
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider h-10">
                        <th className="pl-4">PATIENT DETAILS</th>
                        <th>Admission</th>
                        <th>Primary Insurance</th>
                        <th className="pr-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-xs font-semibold text-gray-700">
                      {wizardPatients.map((p) => {
                        const isSelected = p.action === "Selected";
                        const isPending = p.action === "Pending";
                        const isDeclined = p.action === "Declined";
                        return (
                          <tr key={p.id} className="h-15 hover:bg-slate-50/30 transition-colors">
                            <td className="pl-4 py-2.5 align-middle">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-[10px] font-bold text-[#2E37A4] shrink-0 border border-[#e0f2fe]/40">
                                  {p.name.split(" ").map(n => n[0]).join("")}
                                </div>
                                <div>
                                  <span className="font-bold text-[#0F172A] block text-sm">{p.name}</span>
                                  <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">{p.id} • {p.age}y • {p.gender}</span>
                                </div>
                              </div>
                            </td>
                            <td className="align-middle text-gray-600 font-medium">{p.admissionDate}</td>
                            <td className="align-middle">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border border-[#e0f2fe]/40 text-[10px] font-semibold text-[#2E37A4] bg-indigo-50/30`}>
                                {p.insurance}
                              </span>
                            </td>
                            <td className="pr-4 text-center align-middle">
                              {isSelected ? (
                                <Badge className="bg-[#E8F8F0] text-[#0F9D58] hover:bg-[#E8F8F0] px-3.5 py-1 text-[10px] font-extrabold rounded-md shadow-none border-0">
                                  Selected
                                </Badge>
                              ) : isPending ? (
                                <Badge className="bg-[#FFF4E5] text-[#F2994A] hover:bg-[#FFF4E5] px-3.5 py-1 text-[10px] font-extrabold rounded-md shadow-none border-0">
                                  Pending
                                </Badge>
                              ) : isDeclined ? (
                                <Badge className="bg-[#FDF2F2] text-[#EB5757] hover:bg-[#FDF2F2] px-3.5 py-1 text-[10px] font-extrabold rounded-md shadow-none border-0">
                                  Declined
                                </Badge>
                              ) : (
                                <Button
                                  variant="outline"
                                  type="button"
                                  onClick={() => handleSelectPatient(p.id)}
                                  className="h-8 px-4 text-[10px] font-bold border-gray-200 hover:bg-slate-50 rounded-md text-gray-700"
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
                <div className="p-6 space-y-6">
                  {/* Step Header */}
                  <div className="border-b border-slate-50 pb-4">
                    <h2 className="text-lg font-bold text-[#0F172A]">Treatment Details</h2>
                    <p className="text-xs text-gray-400 font-semibold mt-0.5">Enter Patient treatment details</p>
                  </div>

                  {/* Main Grid: Form on the Left (col-span-3), Context Cards on the Right (col-span-1) */}
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">

                    {/* Left Form (3 Columns) */}
                    <div className="col-span-1 lg:col-span-3 space-y-6">

                      {/* Section 1: Diagnosis Information */}
                      <div className="space-y-3.5">
                        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Diagnosis Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <span className="text-xs text-gray-500 font-bold mb-1.5 block">Primary Diagnosis (ICD-10)</span>
                            <div className="relative">
                              <Input
                                value={treatmentDetails.primaryDiagnosis}
                                onChange={(e) => setTreatmentDetails({ ...treatmentDetails, primaryDiagnosis: e.target.value })}
                                placeholder="Search ICD-10 codes..."
                                className="h-10 text-xs border-gray-200 focus-visible:ring-[#2E37A4] pr-9"
                              />
                              <Search className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
                            </div>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 font-bold mb-1.5 block">Secondary Diagnosis (Optional)</span>
                            <div className="relative">
                              <Input
                                value={treatmentDetails.secondaryDiagnosis}
                                onChange={(e) => setTreatmentDetails({ ...treatmentDetails, secondaryDiagnosis: e.target.value })}
                                placeholder="Search ICD-10 codes..."
                                className="h-10 text-xs border-gray-200 focus-visible:ring-[#2E37A4] pr-9"
                              />
                              <Search className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Section 2: Treatment & Procedure */}
                      <div className="space-y-3.5">
                        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Treatment & Procedure</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <span className="text-xs text-gray-500 font-bold mb-1.5 block">Procedure Code (CPT)</span>
                            <div className="relative">
                              <select
                                value={treatmentDetails.procedureCode}
                                onChange={(e) => setTreatmentDetails({ ...treatmentDetails, procedureCode: e.target.value })}
                                className="w-full h-10 px-3 text-xs border border-gray-200 rounded-lg focus-visible:ring-[#2E37A4] bg-white appearance-none cursor-pointer pr-10 font-medium text-gray-700"
                              >
                                <option>99213 - Office/outpatient visit</option>
                                <option>99214 - Office/outpatient visit, 30-39 minutes</option>
                                <option>99215 - Office/outpatient visit, 40-54 minutes</option>
                              </select>
                              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                            </div>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 font-bold mb-1.5 block">Date of Service</span>
                            <Input
                              type="date"
                              value={treatmentDetails.dateOfService}
                              onChange={(e) => setTreatmentDetails({ ...treatmentDetails, dateOfService: e.target.value })}
                              className="h-10 text-xs border-gray-200 focus-visible:ring-[#2E37A4]"
                            />
                          </div>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 font-bold mb-1.5 block">Attending Provider</span>
                          <div className="relative">
                            <select
                              value={treatmentDetails.attendingProvider}
                              onChange={(e) => setTreatmentDetails({ ...treatmentDetails, attendingProvider: e.target.value })}
                              className="w-full h-10 pl-10 pr-10 text-xs border border-gray-200 rounded-lg focus-visible:ring-[#2E37A4] bg-white appearance-none cursor-pointer font-medium text-gray-700"
                            >
                              <option>Dr. Sarah Jenkins</option>
                              <option>Dr. Jane Foster</option>
                              <option>Dr. Michael Chang</option>
                            </select>
                            <div className="absolute left-3 top-2.5 w-5 h-5 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[9px] font-bold text-[#2E37A4] pointer-events-none">
                              DR
                            </div>
                            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                          </div>
                        </div>
                      </div>

                      {/* Section 3: Billing Context */}
                      <div className="space-y-3.5">
                        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Billing Context</h3>
                        <div className="bg-[#EEF2F6]/55 border border-[#E2E8F0] rounded-xl p-4.5 flex flex-col sm:flex-row gap-3 justify-between sm:items-center shadow-sm">
                          <div>
                            <span className="text-xs font-bold text-[#0F172A] block">Total Billed Amount</span>
                            <span className="text-[10px] text-gray-400 font-semibold block mt-1">
                              This amount is auto-calculated from the patient&apos;s final bill. Any modifications should be done in the Patient Billing module.
                            </span>
                          </div>
                          <span className="text-xl font-extrabold text-[#2E37A4] tracking-tight">{patMeta.amount}</span>
                        </div>
                      </div>

                    </div>

                    {/* Right Context Cards (1 Column) */}
                    <div className="space-y-4 shrink-0">

                      {/* Patient Context Card */}
                      <div className="bg-white border border-slate-100 rounded-xl p-4.5 shadow-sm space-y-4">
                        <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider border-b border-slate-50 pb-2">Patient Context</h4>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-50 border border-[#e0f2fe]/40 flex items-center justify-center text-xs font-bold text-[#2E37A4]">
                            {activePat.name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <div>
                            <span className="font-bold text-sm text-gray-800 block leading-tight">{activePat.name}</span>
                            <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">UHID: {activePat.id}</span>
                          </div>
                        </div>
                        <div className="space-y-2.5 pt-1.5 text-xs">
                          <div className="flex justify-between font-medium">
                            <span className="text-gray-400">DOB</span>
                            <span className="text-gray-700 font-bold">{patMeta.dob}</span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span className="text-gray-400">Gender</span>
                            <span className="text-gray-700 font-bold">{patMeta.gender}</span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span className="text-gray-400">Admission</span>
                            <span className="text-gray-700 font-bold">{patMeta.admission}</span>
                          </div>
                        </div>
                      </div>

                      {/* Insurance Details Card */}
                      <div className="bg-white border border-slate-100 rounded-xl p-4.5 shadow-sm space-y-4">
                        <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider border-b border-slate-50 pb-2">Insurance Details</h4>
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-[#2E37A4] shrink-0" />
                          <span className="font-extrabold text-xs text-gray-800 truncate">{patMeta.provider}</span>
                        </div>
                        <div className="bg-[#E8F8F0] border border-[#E8F8F0] rounded-lg px-2.5 py-1 flex items-center gap-1.5 w-fit">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#0F9D58]" />
                          <span className="text-[10px] font-extrabold text-[#0F9D58]">Verified Active</span>
                        </div>
                        <div className="space-y-2.5 pt-1.5 text-xs">
                          <div>
                            <span className="text-gray-400 font-medium block">Policy Number</span>
                            <span className="text-gray-700 font-bold block mt-0.5">{patMeta.policyNo}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-50">
                            <div>
                              <span className="text-gray-400 font-medium block">Coverage</span>
                              <span className="text-gray-700 font-bold block mt-0.5">{patMeta.coverage}</span>
                            </div>
                            <div>
                              <span className="text-gray-400 font-medium block">Co-pay</span>
                              <span className="text-gray-700 font-bold block mt-0.5">{patMeta.copay}</span>
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
                <div className="p-6 space-y-6">
                  {/* Step Header */}
                  <div className="border-b border-slate-50 pb-4">
                    <h2 className="text-lg font-bold text-[#0F172A]">Document</h2>
                    <p className="text-xs text-gray-400 font-semibold mt-0.5">Upload Patient&apos;s Required Documents</p>
                  </div>

                  {/* Main Grid: Forms/Docs on the Left (col-span-3), Context Cards on the Right (col-span-1) */}
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">

                    {/* Left Documents Container (3 Columns) */}
                    <div className="col-span-1 lg:col-span-3 space-y-6">

                      {/* Required Documents list */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Required Documents</h3>
                          <span className="text-xs font-semibold text-gray-500">{uploadedCount} of 3 uploaded</span>
                        </div>

                        <div className="space-y-3">
                          {/* File 1: Discharge Summary */}
                          <div className="border border-slate-100 rounded-xl p-3.5 bg-white shadow-sm hover:shadow transition-shadow flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-indigo-50/50 flex items-center justify-center text-[#2E37A4]">
                                <FileText className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-gray-800">Discharge Summary</span>
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#E8F8F0] text-[#0F9D58]">Required</span>
                                </div>
                                <span className="text-[10px] text-gray-400 font-medium mt-1 block">
                                  {uploadedFiles.dischargeSummary ? `${uploadedFiles.dischargeSummary.name} • ${uploadedFiles.dischargeSummary.size}` : "No file uploaded"}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {uploadedFiles.dischargeSummary ? (
                                <>
                                  <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg hover:bg-slate-50 text-gray-400 hover:text-gray-600">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    onClick={() => setUploadedFiles({ ...uploadedFiles, dischargeSummary: null })}
                                    variant="ghost"
                                    size="icon"
                                    className="w-8 h-8 rounded-lg hover:bg-rose-50 text-rose-500"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </>
                              ) : (
                                <div className="relative">
                                  <button className="bg-[#2E37A4] hover:bg-[#1e257a] text-white text-[10px] font-bold px-3 h-8 rounded-lg flex items-center gap-1 shadow-sm">
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
                          <div className="border border-slate-100 rounded-xl p-3.5 bg-white shadow-sm hover:shadow transition-shadow flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-indigo-50/50 flex items-center justify-center text-[#2E37A4]">
                                <FileText className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-gray-800">Itemized Bill</span>
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#E8F8F0] text-[#0F9D58]">Required</span>
                                </div>
                                <span className="text-[10px] text-gray-400 font-medium mt-1 block">
                                  {uploadedFiles.itemizedBill ? `${uploadedFiles.itemizedBill.name} • ${uploadedFiles.itemizedBill.size}` : "No file uploaded"}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {uploadedFiles.itemizedBill ? (
                                <>
                                  <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg hover:bg-slate-50 text-gray-400 hover:text-gray-600">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    onClick={() => setUploadedFiles({ ...uploadedFiles, itemizedBill: null })}
                                    variant="ghost"
                                    size="icon"
                                    className="w-8 h-8 rounded-lg hover:bg-rose-50 text-rose-500"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </>
                              ) : (
                                <div className="relative">
                                  <button className="bg-[#2E37A4] hover:bg-[#1e257a] text-white text-[10px] font-bold px-3 h-8 rounded-lg flex items-center gap-1 shadow-sm">
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
                                    className="absolute inset-0 opacity-1 cursor-pointer"
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* File 3: Lab Reports */}
                          <div className="border border-slate-100 rounded-xl p-3.5 bg-white shadow-sm hover:shadow transition-shadow flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-gray-400">
                                {uploadedFiles.labReports ? <FileText className="w-5 h-5 text-[#2E37A4]" /> : <UploadCloud className="w-5 h-5" />}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-gray-800">Lab Reports</span>
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#FFF4E5] text-[#F2994A]">Required</span>
                                </div>
                                <span className="text-[10px] text-gray-400 font-medium mt-1 block">
                                  {uploadedFiles.labReports ? `${uploadedFiles.labReports.name} • ${uploadedFiles.labReports.size}` : "PDF, JPEG or PNG up to 10MB"}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {uploadedFiles.labReports ? (
                                <>
                                  <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg hover:bg-slate-50 text-gray-400 hover:text-gray-600">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    onClick={() => setUploadedFiles({ ...uploadedFiles, labReports: null })}
                                    variant="ghost"
                                    size="icon"
                                    className="w-8 h-8 rounded-lg hover:bg-rose-50 text-rose-500"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </>
                              ) : (
                                <div className="relative">
                                  <Button className="border-[#2E37A4] text-[#2E37A4] hover:bg-indigo-50/40 text-[10px] font-bold px-3.5 h-8.5 rounded-lg flex items-center gap-1.5 shadow-sm border transition-all">
                                    <UploadCloud className="w-3.5 h-3.5" />
                                    Upload
                                  </Button>
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
                                    className="absolute inset-0 opacity-1 cursor-pointer"
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                        </div>
                      </div>

                      {/* Optional Documents Section */}
                      <div className="space-y-4 pt-1">
                        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Additional Documents (Optional)</h3>
                        <div className="border border-dashed border-gray-200 rounded-xl p-6.5 text-center bg-[#f8fafc]/30 hover:bg-[#f8fafc]/70 transition-colors flex flex-col items-center justify-center min-h-[160px] relative cursor-pointer">
                          <div className="w-10 h-10 rounded-full bg-indigo-50/50 flex items-center justify-center text-[#2E37A4] mb-3">
                            <UploadCloud className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-bold text-gray-800">Click to upload or drag and drop</span>
                          <span className="text-[10px] text-gray-400 font-medium mt-1 mb-3.5">
                            Prescriptions, ID Proofs, Previous records (Max 10MB each)
                          </span>
                          <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-slate-50 text-xs font-bold px-4 h-9 rounded-lg shadow-sm">
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

                    {/* Right Context Cards (1 Column) */}
                    <div className="space-y-4 shrink-0">

                      {/* Patient Context Card */}
                      <div className="bg-white border border-slate-100 rounded-xl p-4.5 shadow-sm space-y-4">
                        <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider border-b border-slate-50 pb-2">Patient Context</h4>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-50 border border-[#e0f2fe]/40 flex items-center justify-center text-xs font-bold text-[#2E37A4]">
                            {activePat.name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <div>
                            <span className="font-bold text-sm text-gray-800 block leading-tight">{activePat.name}</span>
                            <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">UHID: {activePat.id}</span>
                          </div>
                        </div>
                        <div className="space-y-2.5 pt-1.5 text-xs">
                          <div className="flex justify-between font-medium">
                            <span className="text-gray-400">DOB</span>
                            <span className="text-gray-700 font-bold">{patMeta.dob}</span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span className="text-gray-400">Gender</span>
                            <span className="text-gray-700 font-bold">{patMeta.gender}</span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span className="text-gray-400">Admission</span>
                            <span className="text-gray-700 font-bold">{patMeta.admission}</span>
                          </div>
                        </div>
                      </div>

                      {/* Insurance Details Card */}
                      <div className="bg-white border border-slate-100 rounded-xl p-4.5 shadow-sm space-y-4">
                        <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider border-b border-slate-50 pb-2">Insurance Details</h4>
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-[#2E37A4] shrink-0" />
                          <span className="font-extrabold text-xs text-gray-800 truncate">{patMeta.provider}</span>
                        </div>
                        <div className="bg-[#E8F8F0] border border-[#E8F8F0] rounded-lg px-2.5 py-1 flex items-center gap-1.5 w-fit">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#0F9D58]" />
                          <span className="text-[10px] font-extrabold text-[#0F9D58]">Verified Active</span>
                        </div>
                        <div className="space-y-2.5 pt-1.5 text-xs">
                          <div>
                            <span className="text-gray-400 font-medium block">Policy Number</span>
                            <span className="text-gray-700 font-bold block mt-0.5">{patMeta.policyNo}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-50">
                            <div>
                              <span className="text-gray-400 font-medium block">Coverage</span>
                              <span className="text-gray-700 font-bold block mt-0.5">{patMeta.coverage}</span>
                            </div>
                            <div>
                              <span className="text-gray-400 font-medium block">Co-pay</span>
                              <span className="text-gray-700 font-bold block mt-0.5">{patMeta.copay}</span>
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
                <div className="p-6 space-y-6">
                  {/* Step Header */}
                  <div className="border-b border-slate-50 pb-4">
                    <h2 className="text-lg font-bold text-[#0F172A]">Review Claim</h2>
                    <p className="text-xs text-gray-400 font-semibold mt-0.5">Patient claim review</p>
                  </div>

                  {/* Main Grid: Form/Review on the Left (col-span-3), Context Cards on the Right (col-span-1) */}
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">

                    {/* Left Review Panel (3 Columns) */}
                    <div className="col-span-1 lg:col-span-3 space-y-6">

                      {/* Alert notice */}
                      <div className="bg-[#e0f2fe]/35 border border-[#bae6fd]/50 rounded-xl p-4.5 flex gap-3.5 shadow-sm">
                        <AlertCircle className="w-5 h-5 text-[#0284c7] shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs font-bold text-[#0369a1] block">Almost done</span>
                          <span className="text-[10px] text-gray-400 font-medium block mt-1 leading-normal">
                            Please review all details before submitting the claim. Edits cannot be made after submission.
                          </span>
                        </div>
                      </div>

                      {/* Section 1: Diagnosis & Treatment */}
                      <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm dark:bg-[#0B1121] dark:border-white/10">
                        <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                          <div className="flex items-center gap-2 text-[#2E37A4]">
                            <Activity className="w-4 h-4" />
                            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Diagnosis & Treatment</h3>
                          </div>
                          <button
                            onClick={() => setCurrentStep(2)}
                            className="text-xs font-bold text-[#2E37A4] hover:underline cursor-pointer flex items-center gap-0.5"
                          >
                            Edit
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-xs pt-1">
                          <div>
                            <span className="text-[10px] text-gray-400 font-bold block mb-1">Primary Diagnosis</span>
                            <span className="text-gray-800 font-bold block leading-relaxed">{treatmentDetails.primaryDiagnosis || "Not provided"}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-400 font-bold block mb-1">Secondary Diagnosis</span>
                            <span className="text-gray-700 font-medium block leading-relaxed">{treatmentDetails.secondaryDiagnosis || "None provided"}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-400 font-bold block mb-1">Procedure Code</span>
                            <span className="text-gray-800 font-bold block">{treatmentDetails.procedureCode || "Not provided"}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-400 font-bold block mb-1">Date of Service</span>
                            <span className="text-gray-800 font-bold block">
                              {treatmentDetails.dateOfService ? new Date(treatmentDetails.dateOfService).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Not provided"}
                            </span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-[10px] text-gray-400 font-bold block mb-1">Attending Provider</span>
                            <span className="text-gray-800 font-bold block">{treatmentDetails.attendingProvider || "Not provided"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Section 2: Attached Documents */}
                      <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm dark:bg-[#0B1121] dark:border-white/10">
                        <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                          <div className="flex items-center gap-2 text-[#2E37A4]">
                            <Folder className="w-4 h-4" />
                            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Attached Documents</h3>
                          </div>
                          <button
                            onClick={() => setCurrentStep(3)}
                            className="text-xs font-bold text-[#2E37A4] hover:underline cursor-pointer flex items-center gap-0.5"
                          >
                            Edit
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                          {/* File list cards */}
                          {[
                            { key: "dischargeSummary", label: "Discharge Summary", fallback: "discharge_summary_RJ.pdf" },
                            { key: "itemizedBill", label: "Itemized Bill", fallback: "final_bill_inv_002.pdf" },
                            { key: "labReports", label: "Lab Reports", fallback: "lab_results_24oct.pdf" },
                          ].map((doc) => {
                            const file = uploadedFiles[doc.key] || { name: doc.fallback };
                            return (
                              <div key={doc.key} className="border border-slate-100 rounded-xl p-3 bg-[#f8fafc]/30 flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-indigo-50/50 flex items-center justify-center text-[#2E37A4]">
                                  <FileText className="w-4 h-4" />
                                </div>
                                <div className="truncate">
                                  <span className="text-[10px] text-gray-400 font-bold block">{doc.label}</span>
                                  <span className="text-xs text-gray-700 font-bold truncate block mt-0.5">{file.name}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Section 3: Claim Financials */}
                      <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm dark:bg-[#0B1121] dark:border-white/10">
                        <div className="flex items-center gap-2 text-[#2E37A4] border-b border-slate-50 pb-3">
                          <Coins className="w-4 h-4" />
                          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Claim Financials</h3>
                        </div>

                        <div className="space-y-3 pt-1 text-xs font-medium">
                          <div className="flex justify-between items-center text-gray-500 font-bold">
                            <span>Total Billed Amount</span>
                            <span className="text-gray-800 font-extrabold">{formatVal(totalBilledVal)}</span>
                          </div>
                          <div className="flex justify-between items-center text-gray-500 font-bold border-t border-slate-50/60 pt-2.5">
                            <span>Patient Co-pay ({patMeta.copay})</span>
                            <span className="text-rose-500 font-extrabold">-{formatVal(copayAmtVal)}</span>
                          </div>
                          <div className="flex justify-between items-center text-gray-500 font-bold border-t border-slate-50/60 pt-2.5">
                            <span>Non-payable Items</span>
                            <span className="text-rose-500 font-extrabold">-{formatVal(nonPayableVal)}</span>
                          </div>
                          <div className="flex justify-between items-center text-gray-500 font-bold border-t border-gray-100 pt-3 mt-1 text-sm bg-slate-50/30 p-2.5 rounded-lg border">
                            <span className="text-[#0F172A] font-extrabold">Net Claim Amount</span>
                            <span className="text-[#2E37A4] font-black text-lg tracking-tight">{formatVal(netClaimVal)}</span>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Right Context Cards (1 Column) */}
                    <div className="space-y-4 shrink-0">

                      {/* Patient Context Card */}
                      <div className="bg-white border border-slate-100 rounded-xl p-4.5 shadow-sm space-y-4">
                        <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider border-b border-slate-50 pb-2">Patient Context</h4>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-50 border border-[#e0f2fe]/40 flex items-center justify-center text-xs font-bold text-[#2E37A4]">
                            {activePat.name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <div>
                            <span className="font-bold text-sm text-gray-800 block leading-tight">{activePat.name}</span>
                            <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">UHID: {activePat.id}</span>
                          </div>
                        </div>
                        <div className="space-y-2.5 pt-1.5 text-xs">
                          <div className="flex justify-between font-medium">
                            <span className="text-gray-400">DOB</span>
                            <span className="text-gray-700 font-bold">{patMeta.dob}</span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span className="text-gray-400">Gender</span>
                            <span className="text-gray-700 font-bold">{patMeta.gender}</span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span className="text-gray-400">Admission</span>
                            <span className="text-gray-700 font-bold">{patMeta.admission}</span>
                          </div>
                        </div>
                      </div>

                      {/* Insurance Details Card */}
                      <div className="bg-white border border-slate-100 rounded-xl p-4.5 shadow-sm space-y-4">
                        <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider border-b border-slate-50 pb-2">Insurance Details</h4>
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-[#2E37A4] shrink-0" />
                          <span className="font-extrabold text-xs text-gray-800 truncate">{patMeta.provider}</span>
                        </div>
                        <div className="bg-[#E8F8F0] border border-[#E8F8F0] rounded-lg px-2.5 py-1 flex items-center gap-1.5 w-fit">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#0F9D58]" />
                          <span className="text-[10px] font-extrabold text-[#0F9D58]">Verified Active</span>
                        </div>
                        <div className="space-y-0 divide-y divide-slate-200 pt-1.5 text-xs">

                          <div>
                            <span className="text-gray-400 font-medium block">Policy Number</span>
                            <span className="text-gray-700 font-bold block mt-0.5">{patMeta.policyNo}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-50">
                            <div>
                              <span className="text-gray-400 font-medium block">Coverage</span>
                              <span className="text-gray-700 font-bold block mt-0.5">{patMeta.coverage}</span>
                            </div>
                            <div>
                              <span className="text-gray-400 font-medium block">Co-pay</span>
                              <span className="text-gray-700 font-bold block mt-0.5">{patMeta.copay}</span>
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
            <div className="px-6 py-4 border-t border-slate-50 bg-slate-50/10 flex justify-between items-center">
              <div>
                <Button
                  onClick={handleWizardBack}
                  variant="ghost"
                  type="button"
                  className="text-xs text-gray-600 hover:text-gray-800 hover:bg-slate-50 px-4 h-9.5 rounded-lg flex items-center gap-1.5 transition-all font-bold"
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
                  className="border-gray-200 text-gray-700 hover:bg-slate-50 text-xs font-bold px-4 h-9.5 rounded-lg transition-all"
                >
                  Save Draft
                </Button>
                {currentStep < 4 ? (
                  <button
                    onClick={handleWizardNext}
                    type="button"
                    className="bg-[#2E37A4] hover:bg-[#1e257a] text-white text-xs font-bold px-2 h-9.5 rounded-lg shadow-md transition-all flex items-center gap-1"
                  >
                    Save & Next
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <Button
                    onClick={handleWizardSubmit}
                    type="button"
                    className="bg-[#0F9D58] hover:bg-[#0b8043] text-white text-xs font-bold px-5 h-9.5 rounded-lg shadow-md transition-all flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    Submit TPA Claim
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <FinancePageShell>
      <FinanceHeader
        title="Insurance Management"
        description="Manage insurance claims, pre-auths, and TPA settles."
        className="flex-row items-center justify-between gap-3"
        actions={
          <>
            <Button
              onClick={() => {
                setIsVerifyingInsurance(true);
              }}
              variant="outline"
              className="h-[32px] rounded-[5px] border-primary px-3 text-[11px] font-bold text-primary hover:bg-primary/5 hover:text-primary whitespace-nowrap flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              Verify Patient
            </Button>
            <button
              onClick={() => {
                setIsCreatingClaim(true);
                setCurrentStep(1);
              }}
              className="flex h-[32px] items-center gap-1.5 rounded-[5px] bg-primary px-4 text-[11px] font-bold text-white shadow-none transition-all hover:opacity-90 whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              New Claim
            </button>
          </>
        }
      />

      {/* 2. STATS CARDS GRID */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <CompactStatCard
          title="Total Claims (MTD)"
          value="142"
          icon={FileText}
          color="blue"
          meta="+12% vs yesterday"
        />
        <CompactStatCard
          title="Pending Pre-Auth"
          value="28"
          icon={Clock}
          color="amber"
          meta="5 urgent"
        />
        <CompactStatCard
          title="Approved Amount"
          value="₹45,200"
          icon={ShieldCheck}
          color="emerald"
          meta="+8% vs last month"
        />
        <CompactStatCard
          title="Rejected Claims"
          value="12"
          icon={XCircle}
          color="rose"
          meta="-2% vs last month"
        />
      </div>

      {/* 3. TABLE FILTERING & SEARCH CONTROLS */}
      <FinanceToolbar>
        {/* Search */}
        <FinanceSearchField
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search claim, patient or provider..."
          className="sm:w-[320px]"
        />

        {/* Dropdown status selector */}
        <FinanceSelect
          value={statusFilter}
          onChange={setStatusFilter}
          placeholder="Filter by status"
          options={[
            { label: "All Claims", value: "All" },
            { label: "Approved", value: "Approved" },
            { label: "Pending", value: "Pending" },
            { label: "Rejected", value: "Rejected" },
          ]}
        />
      </FinanceToolbar>

      {/* 4. MAIN CLAIMS TABLE */}
      <FinanceTableCard>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30">
                <th className="border-b border-border px-6 py-4 text-left text-[11px] font-bold tracking-widest text-muted-foreground">CLAIM ID</th>
                <th className="border-b border-border px-6 py-4 text-left text-[11px] font-bold tracking-widest text-muted-foreground">PATIENT</th>
                <th className="border-b border-border px-6 py-4 text-left text-[11px] font-bold tracking-widest text-muted-foreground">PROVIDER</th>
                <th className="border-b border-border px-6 py-4 text-left text-[11px] font-bold tracking-widest text-muted-foreground">TOTAL AMOUNT</th>
                <th className="border-b border-border px-6 py-4 text-left text-[11px] font-bold tracking-widest text-muted-foreground">DATE</th>
                <th className="border-b border-border px-6 py-4 text-left text-[11px] font-bold tracking-widest text-muted-foreground">STATUS</th>
                <th className="border-b border-border px-6 py-4 text-right text-[11px] font-bold tracking-widest text-muted-foreground">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredClaims.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-16 text-center text-[12px] font-bold text-muted-foreground">
                    No claims found matching filters.
                  </td>
                </tr>
              ) : (
                filteredClaims.map((claim) => {
                  const providerMeta = PROVIDERS[claim.provider] || { initial: "P", bg: "bg-gray-50 text-gray-600 border-gray-100", dot: "bg-gray-500" };
                  return (
                    <tr key={claim.id} className="transition-colors hover:bg-muted/20">
                      <td className="whitespace-nowrap px-6 py-5 text-[14px] font-bold text-foreground">{claim.id}</td>
                      <td className="whitespace-nowrap px-6 py-5 text-[14px] font-bold text-foreground">{claim.patient}</td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[5px] border border-[#e0f2fe]/40 text-[10px] font-bold ${providerMeta.bg}`}>
                            {providerMeta.initial}
                          </div>
                          <span className="text-[13px] font-medium text-muted-foreground">{claim.provider}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-5 text-[13px] font-medium text-muted-foreground">{claim.amount}</td>
                      <td className="whitespace-nowrap px-6 py-5 text-[13px] font-medium text-muted-foreground">{claim.date}</td>
                      <td className="whitespace-nowrap px-6 py-5">
                        <Badge
                          className={`rounded-[5px] border px-3 py-1 text-[11px] font-bold shadow-none capitalize ${claim.status === "Approved"
                            ? "border-emerald-200 bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                            : claim.status === "Pending"
                              ? "border-amber-200 bg-amber-100 text-amber-700 hover:bg-amber-100"
                              : "border-red-200 bg-red-100 text-red-700 hover:bg-red-100"
                            }`}
                        >
                          {claim.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button
                          onClick={() => setSelectedClaim(claim)}
                          className="inline-flex items-center justify-center rounded-[5px] p-2 text-foreground transition-all hover:bg-muted hover:text-primary"
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

      {/* 5. MODAL: VERIFY PATIENT INSURANCE */}
      <AnimatePresence>
        {isVerifyOpen && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsVerifyOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-[6px]"
            />

            {/* Modal card content */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 16 }}
              className="relative bg-white dark:bg-[#0F172A] w-full max-w-[500px] rounded-[5px] shadow-none overflow-hidden border border-gray-100 dark:border-white/5"
            >
              {/* Header */}
              <div className="px-8 py-6 flex justify-between items-center border-b border-gray-100 dark:border-white/5">
                <div className="space-y-1">
                  <h2 className="text-[20px] font-bold text-[#1e293b] dark:text-white leading-none">
                    Verify Patient Insurance
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsVerifyOpen(false)}
                  className="group p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                </button>
              </div>

              {/* Body */}
              <form onSubmit={handleVerifySubmit} className="px-4 sm:px-8 py-5 sm:py-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">

                {/* Form Input fields */}
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-gray-600 dark:text-gray-300 ml-1">Patient Name / ID</label>
                  <input
                    type="text"
                    required
                    value={verifyName}
                    onChange={(e) => setVerifyName(e.target.value)}
                    placeholder="Enter Patient Name or ID..."
                    className="w-full h-[48px] px-4 rounded-[5px] border border-gray-200 dark:border-white/10 dark:bg-[#1E293B] text-[14px] text-gray-700 dark:text-white placeholder:text-gray-400 outline-none focus:border-primary transition-all shadow-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-gray-600 dark:text-gray-300 ml-1">Insurance Provider</label>
                  <div className="relative">
                    <select
                      value={verifyProvider}
                      onChange={(e) => setVerifyProvider(e.target.value)}
                      className="w-full h-[48px] px-4 rounded-[5px] border border-gray-200 dark:border-white/10 dark:bg-[#1E293B] text-[14px] text-gray-700 dark:text-white appearance-none outline-none focus:border-primary transition-all shadow-sm cursor-pointer font-semibold"
                    >
                      {Object.keys(PROVIDERS).map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-gray-600 dark:text-gray-300 ml-1">Policy / Member ID</label>
                  <input
                    type="text"
                    required
                    value={verifyPolicy}
                    onChange={(e) => setVerifyPolicy(e.target.value)}
                    placeholder="Enter policy or member ID..."
                    className="w-full h-[48px] px-4 rounded-[5px] border border-gray-200 dark:border-white/10 dark:bg-[#1E293B] text-[14px] text-gray-700 dark:text-white placeholder:text-gray-400 outline-none focus:border-primary transition-all shadow-sm"
                  />
                </div>

                {/* Status Alert logs */}
                {verifyStatus === "checking" && (
                  <div className="p-4 bg-indigo-50 dark:bg-indigo-500/5 rounded-[5px] border border-indigo-100 dark:border-indigo-500/20 flex items-start gap-3">
                    <Activity className="w-4 h-4 text-indigo-500 mt-0.5 animate-pulse" />
                    <div className="space-y-1">
                      <h4 className="text-[11px] font-bold text-indigo-600 dark:text-indigo-500">TPA Verification Gateway</h4>
                      <p className="text-[11px] text-indigo-700/70 dark:text-indigo-400/70 leading-relaxed">Contacting secure endpoint to verify patient eligibility status...</p>
                    </div>
                  </div>
                )}

                {verifyStatus === "success" && (
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-500/5 rounded-[5px] border border-emerald-100 dark:border-emerald-500/20 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0 animate-bounce" />
                    <div className="space-y-1">
                      <h4 className="text-[11px] font-bold text-emerald-600 dark:text-emerald-500">Policy Verified Active</h4>
                      <p className="text-[11px] text-emerald-700/70 dark:text-emerald-400/70 leading-relaxed">
                        Policy is active. Approved copay is 80%. TPA Cashless Pre-Auth eligible for standard services.
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col-reverse sm:flex-row justify-end items-stretch sm:items-center gap-3 sm:gap-4 pt-4 border-t border-gray-100 dark:border-white/5 w-full">
                  <button
                    type="button"
                    onClick={() => setIsVerifyOpen(false)}
                    className="px-8 h-[48px] rounded-[5px] text-gray-500 font-bold text-[13px] hover:text-primary transition-all w-full sm:w-auto"
                  >
                    Close
                  </button>
                  {verifyStatus !== "success" && (
                    <button
                      type="submit"
                      disabled={verifyStatus === "checking"}
                      className="bg-primary text-white px-10 h-[48px] rounded-[5px] font-bold text-[13px] hover:opacity-90 transition-all shadow-none disabled:opacity-50 w-full sm:w-auto flex items-center justify-center"
                    >
                      {verifyStatus === "checking" ? "Verifying..." : "Verify Coverage"}
                    </button>
                  )}
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. MODAL: NEW CLAIM SUBMISSION */}
      <AnimatePresence>
        {isNewClaimOpen && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewClaimOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-[6px]"
            />

            {/* Modal card content */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 16 }}
              className="relative bg-white dark:bg-[#0F172A] w-full max-w-[540px] rounded-[5px] shadow-none overflow-hidden border border-gray-100 dark:border-white/5"
            >
              {/* Header */}
              <div className="px-4 sm:px-8 py-5 sm:py-6 flex justify-between items-center border-b border-gray-100 dark:border-white/5">
                <div className="space-y-1">
                  <h2 className="text-[20px] font-bold text-[#1e293b] dark:text-white leading-none">
                    New Cashless Claim Submission
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewClaimOpen(false)}
                  className="group p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                </button>
              </div>

              {/* Body */}
              <form onSubmit={handleNewClaimSubmit} className="px-4 sm:px-8 py-5 sm:py-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-gray-600 dark:text-gray-300 ml-1">Patient Name</label>
                    <input
                      type="text"
                      required
                      value={newPatient}
                      onChange={(e) => setNewPatient(e.target.value)}
                      placeholder="E.g., John Doe"
                      className="w-full h-[48px] px-4 rounded-[5px] border border-gray-200 dark:border-white/10 dark:bg-[#1E293B] text-[14px] text-gray-700 dark:text-white placeholder:text-gray-400 outline-none focus:border-primary transition-all shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-gray-600 dark:text-gray-300 ml-1">Patient UHID</label>
                    <input
                      type="text"
                      required
                      value={newUHID}
                      onChange={(e) => setNewUHID(e.target.value)}
                      placeholder="E.g., P-882988"
                      className="w-full h-[48px] px-4 rounded-[5px] border border-gray-200 dark:border-white/10 dark:bg-[#1E293B] text-[14px] text-gray-700 dark:text-white placeholder:text-gray-400 outline-none focus:border-primary transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-gray-600 dark:text-gray-300 ml-1">Insurance Provider</label>
                    <div className="relative">
                      <select
                        value={newProvider}
                        onChange={(e) => setNewProvider(e.target.value)}
                        className="w-full h-[48px] px-4 rounded-[5px] border border-gray-200 dark:border-white/10 dark:bg-[#1E293B] text-[14px] text-gray-700 dark:text-white appearance-none outline-none focus:border-primary transition-all shadow-sm cursor-pointer font-semibold"
                      >
                        {Object.keys(PROVIDERS).map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-gray-600 dark:text-gray-300 ml-1">Policy ID</label>
                    <input
                      type="text"
                      required
                      value={newPolicy}
                      onChange={(e) => setNewPolicy(e.target.value)}
                      placeholder="E.g., POL-KP-1029"
                      className="w-full h-[48px] px-4 rounded-[5px] border border-gray-200 dark:border-white/10 dark:bg-[#1E293B] text-[14px] text-gray-700 dark:text-white placeholder:text-gray-400 outline-none focus:border-primary transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-gray-600 dark:text-gray-300 ml-1">Claim Amount (INR)</label>
                    <input
                      type="number"
                      required
                      value={newAmount}
                      onChange={(e) => setNewAmount(e.target.value)}
                      placeholder="E.g., 5000"
                      className="w-full h-[48px] px-4 rounded-[5px] border border-gray-200 dark:border-white/10 dark:bg-[#1E293B] text-[14px] text-gray-700 dark:text-white placeholder:text-gray-400 outline-none focus:border-primary transition-all shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-gray-600 dark:text-gray-300 ml-1">Diagnostic ICD-10 Code</label>
                    <input
                      type="text"
                      required
                      value={newDiagnostics}
                      onChange={(e) => setNewDiagnostics(e.target.value)}
                      placeholder="E.g., Influenza"
                      className="w-full h-[48px] px-4 rounded-[5px] border border-gray-200 dark:border-white/10 dark:bg-[#1E293B] text-[14px] text-gray-700 dark:text-white placeholder:text-gray-400 outline-none focus:border-primary transition-all shadow-sm"
                    />
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="p-4 bg-sky-50 dark:bg-sky-500/5 rounded-[5px] border border-sky-100 dark:border-sky-500/20 flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-sky-500 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-[11px] font-bold text-sky-600 dark:text-sky-500">Cashless Claim Processing</h4>
                    <p className="text-[11px] text-sky-700/70 dark:text-sky-400/70 leading-relaxed">System will automatically submit this cashless claim to the TPA queue for medical necessity evaluation and corporate policy matching.</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col-reverse sm:flex-row justify-end items-stretch sm:items-center gap-3 sm:gap-4 pt-4 border-t border-gray-100 dark:border-white/5">
                  <button
                    type="button"
                    onClick={() => setIsNewClaimOpen(false)}
                    className="px-8 h-[48px] rounded-[5px] text-gray-500 font-bold text-[13px] hover:text-primary transition-all w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-primary text-white px-10 h-[48px] rounded-[5px] font-bold text-[13px] hover:opacity-90 transition-all shadow-none w-full sm:w-auto flex items-center justify-center"
                  >
                    Submit Claim
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. MODAL: VIEW CLAIM DETAILS */}
      <AnimatePresence>
        {selectedClaim !== null && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedClaim(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-[6px]"
            />

            {/* Modal card content */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 16 }}
              className="relative bg-white dark:bg-[#0F172A] w-full max-w-[550px] rounded-[5px] shadow-none overflow-hidden border border-gray-100 dark:border-white/5"
            >
              {/* Header */}
              <div className="px-4 sm:px-8 py-5 sm:py-6 flex justify-between items-center border-b border-gray-100 dark:border-white/5">
                <div className="space-y-1">
                  <h2 className="text-[20px] font-bold text-[#1e293b] dark:text-white leading-none">
                    Claim Information
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedClaim(null)}
                  className="group p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                </button>
              </div>

              {/* Body */}
              <div className="px-4 sm:px-8 py-5 sm:py-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">

                {/* Header Info */}
                <div className="flex justify-between items-center border-b border-gray-100 dark:border-white/5 pb-4">
                  <div>
                    <span className="text-[11px] text-primary font-bold block uppercase tracking-wider">{selectedClaim.id}</span>
                    <span className="text-[18px] font-extrabold text-[#1e293b] dark:text-white block mt-0.5">{selectedClaim.patient}</span>
                  </div>
                  <Badge
                    className={`rounded-[5px] border px-3.5 py-1 text-[11px] font-bold shadow-none capitalize ${selectedClaim.status === "Approved"
                      ? "border-emerald-200 bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                      : selectedClaim.status === "Pending"
                        ? "border-amber-200 bg-amber-100 text-amber-700 hover:bg-amber-100"
                        : "border-red-200 bg-red-100 text-red-700 hover:bg-red-100"
                      }`}
                  >
                    {selectedClaim.status}
                  </Badge>
                </div>

                {/* Grid detail stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="border border-gray-100 dark:border-white/5 rounded-[5px] py-3.5 px-4 bg-gray-50/50 dark:bg-white/[0.01]">
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider block">UHID</span>
                    <span className="text-[#1e293b] dark:text-white text-[15px] font-extrabold block mt-1">{selectedClaim.uhid}</span>
                  </div>
                  <div className="border border-gray-100 dark:border-white/5 rounded-[5px] py-3.5 px-4 bg-gray-50/50 dark:bg-white/[0.01]">
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider block">Policy Number</span>
                    <span className="text-[#1e293b] dark:text-white text-[15px] font-extrabold block mt-1">{selectedClaim.policyNo}</span>
                  </div>
                </div>

                {/* Details Grid 2 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="border border-gray-100 dark:border-white/5 rounded-[5px] py-3.5 px-4 bg-gray-50/50 dark:bg-white/[0.01]">
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider block">Provider</span>
                    <span className="text-[#1e293b] dark:text-white text-[15px] font-extrabold block mt-1">{selectedClaim.provider}</span>
                  </div>
                  <div className="border border-gray-100 dark:border-white/5 rounded-[5px] py-3.5 px-4 bg-gray-50/50 dark:bg-white/[0.01]">
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider block">Co-Pay Exclusions</span>
                    <span className="text-[#1e293b] dark:text-white text-[15px] font-extrabold block mt-1">{selectedClaim.coPay}</span>
                  </div>
                </div>

                {/* Details Grid 3 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="border border-gray-100 dark:border-white/5 rounded-[5px] py-3.5 px-4 bg-gray-50/50 dark:bg-white/[0.01]">
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider block">Claim Amount</span>
                    <span className="text-primary text-[15px] font-extrabold block mt-1">{selectedClaim.amount}</span>
                  </div>
                  <div className="border border-gray-100 dark:border-white/5 rounded-[5px] py-3.5 px-4 bg-gray-50/50 dark:bg-white/[0.01]">
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider block">Date Processed</span>
                    <span className="text-[#1e293b] dark:text-white text-[15px] font-extrabold block mt-1">{selectedClaim.date}</span>
                  </div>
                </div>

                {/* Exclusions and Notes */}
                <div className="space-y-2">
                  <span className="text-[13px] font-bold text-gray-600 dark:text-gray-300 ml-1 block">Diagnostic Details</span>
                  <div className="p-4 bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-[5px] text-[13px] text-gray-700 dark:text-gray-300 font-semibold shadow-sm">
                    {selectedClaim.diagnostics}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[13px] font-bold text-gray-600 dark:text-gray-300 ml-1 block">TPA Remarks & Logs</span>
                  <div className="p-4 bg-[#f8fafc] dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-[5px] text-[13px] text-gray-600 dark:text-gray-400 font-medium leading-relaxed shadow-sm">
                    {selectedClaim.notes}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-3 sm:gap-4 pt-4 border-t border-gray-100 dark:border-white/5">
                  <button
                    type="button"
                    onClick={() => setSelectedClaim(null)}
                    className="bg-primary text-white w-full sm:w-auto px-10 h-[48px] rounded-[5px] font-bold text-[13px] hover:opacity-90 transition-all shadow-none flex items-center justify-center"
                  >
                    Okay
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </FinancePageShell>
  );
}

