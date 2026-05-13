"use client";

import React from "react";
import {
  ArrowLeft,
  Pencil,
  Ambulance,
  User,
  Building2,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Printer,
  ArrowLeftRight,
  AlertCircle,
  Loader2,
  Clock,
  ChevronRight,
  BedDouble,
  X,
  Check,
  ChevronDown,
  Stethoscope,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, useParams } from "next/navigation";

// ─── Transfer to Ward Modal ───────────────────────────────────────────────────
function TransferModal({ isOpen, patient, onClose, onSuccess }) {
  const [departments, setDepartments] = React.useState([]);
  const [loadingHierarchy, setLoadingHierarchy] = React.useState(false);
  const [hierarchyError, setHierarchyError] = React.useState("");

  // Selection state
  const [selectedDept, setSelectedDept]   = React.useState(null);
  const [selectedWard, setSelectedWard]   = React.useState(null);
  const [selectedBed, setSelectedBed]     = React.useState(null);
  const [reason, setReason]               = React.useState("");

  const [submitting, setSubmitting]       = React.useState(false);
  const [submitError, setSubmitError]     = React.useState("");

  // Derived lists
  const wards = selectedDept?.wards ?? [];
  const beds  = (selectedWard?.beds ?? []).filter((b) => b.status === "AVAILABLE");

  // Reset selections when department changes
  const handleDeptChange = (dept) => {
    setSelectedDept(dept);
    setSelectedWard(null);
    setSelectedBed(null);
  };

  const handleWardChange = (ward) => {
    setSelectedWard(ward);
    setSelectedBed(null);
  };

  // Load bed-map hierarchy when modal opens
  React.useEffect(() => {
    if (!isOpen) return;
    // Reset state on open
    setSelectedDept(null);
    setSelectedWard(null);
    setSelectedBed(null);
    setReason("");
    setSubmitError("");

    const load = async () => {
      try {
        setLoadingHierarchy(true);
        setHierarchyError("");
        const token = localStorage.getItem("authtoken");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bed-map/hierarchy`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to load ward data.");
        setDepartments(Array.isArray(json) ? json : []);
      } catch (err) {
        setHierarchyError(err.message);
      } finally {
        setLoadingHierarchy(false);
      }
    };
    load();
  }, [isOpen]);

  // ESC to close
  React.useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    if (isOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const handleTransfer = async () => {
    if (!selectedDept || !selectedWard || !selectedBed) {
      setSubmitError("Please select a department, ward, and bed.");
      return;
    }
    try {
      setSubmitting(true);
      setSubmitError("");
      const token = localStorage.getItem("authtoken");

      const body = {
        patientId:      patient.id,
        patientName:    patient.name    || "Unknown",
        patientAge:     patient.age     || 0,
        patientGender:  patient.gender  || "Unknown",
        patientContact: patient.contact || "",
        departmentId:   selectedDept.id,
        wardId:         selectedWard.id,
        bedId:          selectedBed.id,
        reason:         reason || `Emergency transfer — ${patient.emergencyType || "Emergency"}`,
        status:         "In Progress",
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || json.message || "Transfer failed.");

      onSuccess({
        department: selectedDept.name,
        ward:       selectedWard.name,
        bed:        selectedBed.label,
      });
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white dark:bg-[#111827] w-full max-w-[560px] rounded-[8px] border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#3B4CB8]/10 rounded-[6px] flex items-center justify-center">
              <BedDouble className="w-5 h-5 text-[#3B4CB8]" />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-foreground leading-none">Transfer to Ward</h2>
              <p className="text-[12px] text-muted-foreground mt-0.5">
                Assign a bed for <span className="font-bold text-foreground">{patient?.name || "this patient"}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-[5px] text-muted-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

          {/* Loading hierarchy */}
          {loadingHierarchy && (
            <div className="flex items-center justify-center py-12 gap-3 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-[13px] font-medium">Loading ward data...</span>
            </div>
          )}

          {/* Hierarchy error */}
          {hierarchyError && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-[5px] text-red-700 text-[13px] font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {hierarchyError}
            </div>
          )}

          {!loadingHierarchy && !hierarchyError && (
            <>
              {/* Step 1 — Department */}
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">
                  Step 1 — Select Department
                </label>
                {departments.length === 0 ? (
                  <p className="text-[13px] text-muted-foreground p-3 border border-dashed border-border rounded-[5px]">
                    No departments found. Please set up departments first.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {departments.map((dept) => {
                      const totalBeds     = dept.wards.reduce((s, w) => s + w.beds.length, 0);
                      const availableBeds = dept.wards.reduce((s, w) => s + w.beds.filter((b) => b.status === "AVAILABLE").length, 0);
                      const isSelected    = selectedDept?.id === dept.id;
                      return (
                        <button
                          key={dept.id}
                          onClick={() => handleDeptChange(dept)}
                          className={cn(
                            "flex items-center justify-between p-3.5 border rounded-[6px] text-left transition-all",
                            isSelected
                              ? "border-[#3B4CB8] bg-[#3B4CB8]/5 ring-1 ring-[#3B4CB8]"
                              : "border-border hover:bg-muted/50"
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={cn("w-7 h-7 rounded-[4px] flex items-center justify-center shrink-0", isSelected ? "bg-[#3B4CB8]" : "bg-muted")}>
                              <Stethoscope className={cn("w-3.5 h-3.5", isSelected ? "text-white" : "text-muted-foreground")} />
                            </div>
                            <span className="text-[13px] font-bold text-foreground">{dept.name}</span>
                          </div>
                          <span className={cn(
                            "text-[11px] font-bold px-2 py-0.5 rounded-[4px]",
                            availableBeds > 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
                          )}>
                            {availableBeds}/{totalBeds} free
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Step 2 — Ward */}
              {selectedDept && (
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">
                    Step 2 — Select Ward
                  </label>
                  {wards.length === 0 ? (
                    <p className="text-[13px] text-muted-foreground p-3 border border-dashed border-border rounded-[5px]">
                      No wards in this department.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {wards.map((ward) => {
                        const avail      = ward.beds.filter((b) => b.status === "AVAILABLE").length;
                        const isSelected = selectedWard?.id === ward.id;
                        return (
                          <button
                            key={ward.id}
                            onClick={() => handleWardChange(ward)}
                            disabled={avail === 0}
                            className={cn(
                              "flex items-center justify-between p-3.5 border rounded-[6px] text-left transition-all",
                              isSelected
                                ? "border-[#3B4CB8] bg-[#3B4CB8]/5 ring-1 ring-[#3B4CB8]"
                                : avail === 0
                                  ? "border-border opacity-40 cursor-not-allowed"
                                  : "border-border hover:bg-muted/50"
                            )}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className={cn("w-7 h-7 rounded-[4px] flex items-center justify-center shrink-0", isSelected ? "bg-[#3B4CB8]" : "bg-muted")}>
                                <Building2 className={cn("w-3.5 h-3.5", isSelected ? "text-white" : "text-muted-foreground")} />
                              </div>
                              <span className="text-[13px] font-bold text-foreground">{ward.name}</span>
                            </div>
                            <span className={cn(
                              "text-[11px] font-bold px-2 py-0.5 rounded-[4px]",
                              avail > 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
                            )}>
                              {avail}/{ward.beds.length} free
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Step 3 — Bed */}
              {selectedWard && (
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">
                    Step 3 — Select Bed
                  </label>
                  {beds.length === 0 ? (
                    <p className="text-[13px] text-muted-foreground p-3 border border-dashed border-border rounded-[5px]">
                      No available beds in this ward.
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {beds.map((bed) => {
                        const isSelected = selectedBed?.id === bed.id;
                        return (
                          <button
                            key={bed.id}
                            onClick={() => setSelectedBed(bed)}
                            className={cn(
                              "flex flex-col items-center gap-1.5 p-3 border rounded-[6px] transition-all",
                              isSelected
                                ? "border-[#3B4CB8] bg-[#3B4CB8]/5 ring-1 ring-[#3B4CB8]"
                                : "border-border hover:bg-muted/50"
                            )}
                          >
                            <BedDouble className={cn("w-5 h-5", isSelected ? "text-[#3B4CB8]" : "text-muted-foreground")} />
                            <span className={cn("text-[12px] font-bold", isSelected ? "text-[#3B4CB8]" : "text-foreground")}>
                              {bed.label}
                            </span>
                            <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-[3px]">
                              Available
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Reason (optional) */}
              {selectedBed && (
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">
                    Reason / Notes <span className="normal-case font-normal">(optional)</span>
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder={`Emergency transfer — ${patient?.emergencyType || "Emergency"}`}
                    rows={2}
                    className="w-full px-4 py-3 bg-background border border-border rounded-[5px] text-[13px] font-medium text-foreground outline-none focus:border-primary transition-all shadow-none placeholder:text-muted-foreground/60 resize-none"
                  />
                </div>
              )}

              {/* Selection summary */}
              {(selectedDept || selectedWard || selectedBed) && (
                <div className="flex items-center gap-2 text-[12px] font-medium text-muted-foreground flex-wrap">
                  {selectedDept && (
                    <span className="flex items-center gap-1 bg-muted px-2.5 py-1 rounded-[4px] text-foreground font-bold">
                      {selectedDept.name}
                    </span>
                  )}
                  {selectedWard && <><ChevronRight className="w-3.5 h-3.5 shrink-0" /><span className="flex items-center gap-1 bg-muted px-2.5 py-1 rounded-[4px] text-foreground font-bold">{selectedWard.name}</span></>}
                  {selectedBed  && <><ChevronRight className="w-3.5 h-3.5 shrink-0" /><span className="flex items-center gap-1 bg-[#3B4CB8]/10 text-[#3B4CB8] px-2.5 py-1 rounded-[4px] font-bold">Bed {selectedBed.label}</span></>}
                </div>
              )}

              {/* Submit error */}
              {submitError && (
                <div className="flex items-center gap-3 p-3.5 bg-red-50 border border-red-200 rounded-[5px] text-red-700 text-[13px] font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {submitError}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border shrink-0 bg-muted/20">
          <button
            onClick={onClose}
            className="px-5 h-10 border border-border bg-white rounded-[5px] text-[13px] font-bold text-foreground hover:bg-muted transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleTransfer}
            disabled={submitting || loadingHierarchy || !selectedBed}
            className="flex items-center gap-2 px-5 h-10 bg-[#3B4CB8] text-white rounded-[5px] text-[13px] font-bold hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <BedDouble className="w-4 h-4" />}
            Confirm Transfer
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Transfer Success Modal ───────────────────────────────────────────────────
function TransferSuccessModal({ isOpen, info, onClose }) {
  React.useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    if (isOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen || !info) return null;

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-white dark:bg-[#111827] w-full max-w-[400px] rounded-[8px] border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute right-4 top-4 p-1.5 hover:bg-muted rounded-[5px] text-muted-foreground">
          <X className="w-4 h-4" />
        </button>
        <div className="p-8 flex flex-col items-center text-center space-y-5">
          <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center">
            <Check className="w-8 h-8 text-white stroke-[3]" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-[18px] font-bold text-foreground">Transfer Successful</h2>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              Patient has been admitted to the ward.
            </p>
          </div>
          {/* Summary */}
          <div className="w-full bg-muted/40 rounded-[6px] p-4 space-y-2 text-left">
            {[
              { label: "Department", value: info.department },
              { label: "Ward",       value: info.ward },
              { label: "Bed",        value: info.bed },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{label}</span>
                <span className="text-[13px] font-bold text-foreground">{value}</span>
              </div>
            ))}
          </div>
          <button
            onClick={onClose}
            className="w-full h-11 bg-[#3B4CB8] text-white rounded-[5px] text-[13px] font-bold hover:opacity-90 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Priority config ──────────────────────────────────────────────────────────
const PRIORITY_CONFIG = {
  Red: {
    bg:      "bg-[#FEF2F2] dark:bg-red-500/10",
    border:  "border-red-100 dark:border-red-500/20",
    iconBg:  "bg-red-600",
    text:    "text-red-600",
    subText: "text-red-600/80",
    label:   "RED — CRITICAL",
    desc:    "Life-threatening condition. Immediate medical intervention required.",
    Icon:    Zap,
  },
  Yellow: {
    bg:      "bg-amber-50 dark:bg-amber-500/10",
    border:  "border-amber-100 dark:border-amber-500/20",
    iconBg:  "bg-amber-500",
    text:    "text-amber-600",
    subText: "text-amber-600/80",
    label:   "YELLOW — URGENT",
    desc:    "Urgent condition. Requires prompt medical attention.",
    Icon:    AlertTriangle,
  },
  Green: {
    bg:      "bg-emerald-50 dark:bg-emerald-500/10",
    border:  "border-emerald-100 dark:border-emerald-500/20",
    iconBg:  "bg-emerald-500",
    text:    "text-emerald-600",
    subText: "text-emerald-600/80",
    label:   "GREEN — STABLE",
    desc:    "Non-urgent condition. Patient is stable.",
    Icon:    CheckCircle2,
  },
};

const ArrivalIcon = ({ mode }) => {
  if (mode === "Ambulance") return <Ambulance className="w-4 h-4 text-muted-foreground" />;
  if (mode === "Walk-In")   return <User      className="w-4 h-4 text-muted-foreground" />;
  if (mode === "Referral")  return <Building2 className="w-4 h-4 text-muted-foreground" />;
  return null;
};

const DetailField = ({ label, children }) => (
  <div className="space-y-1">
    <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
    <div className="text-[14px] font-bold text-foreground">{children}</div>
  </div>
);

export default function EmergencyReviewPage() {
  const router = useRouter();
  const { id } = useParams();

  const [patient, setPatient]           = React.useState(null);
  const [loading, setLoading]           = React.useState(true);
  const [error, setError]               = React.useState("");
  const [confirming, setConfirming]     = React.useState(false);
  const [showTransfer, setShowTransfer] = React.useState(false);
  const [transferInfo, setTransferInfo] = React.useState(null);

  // ── Fetch patient ───────────────────────────────────────────────────────────
  React.useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authtoken");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/emergency/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (!res.ok || !json.success) {
          setError(json.message || "Failed to load patient details.");
          return;
        }
        setPatient(json.data);
      } catch (err) {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPatient();
  }, [id]);

  // ── Confirm draft → Emergency ───────────────────────────────────────────────
  const handleConfirm = async () => {
    try {
      setConfirming(true);
      const token = localStorage.getItem("authtoken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/emergency/${id}/confirm`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) setPatient(json.data);
    } catch (err) {
      console.error("Confirm failed:", err);
    } finally {
      setConfirming(false);
    }
  };

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const formatTime = (iso) =>
    iso ? new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "—";

  const formatDate = (iso) =>
    iso ? new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—";

  const priority = PRIORITY_CONFIG[patient?.triagePriority] || PRIORITY_CONFIG.Red;

  // ── Loading / Error states ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-[13px] font-medium">Loading patient details...</p>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="flex flex-col gap-5 p-5 min-h-screen bg-background">
        <button
          onClick={() => router.push("/reception/emergency-registration")}
          className="flex items-center gap-2 px-4 h-11 border border-border rounded-[5px] text-[13px] font-bold text-foreground hover:bg-muted transition-all w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to List
        </button>
        <div className="flex flex-col items-center gap-3 py-20 text-muted-foreground">
          <AlertCircle className="w-10 h-10 opacity-40" />
          <p className="text-[14px] font-medium">{error || "Patient not found."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 p-5 min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/reception/emergency-registration")}
          className="flex items-center gap-2 px-4 h-11 border border-border rounded-[5px] text-[13px] font-bold text-foreground hover:bg-muted transition-all shadow-none"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to List
        </button>
      </div>

      <div className="bg-card border border-border rounded-[5px] p-4 sm:p-8 space-y-8">

        {/* Title + Edit */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-border/60 pb-6">
          <div className="space-y-1">
            <h1 className="text-[22px] font-bold text-foreground">Emergency Registration</h1>
            <p className="text-[13px] text-muted-foreground">
              Review the critical details for this emergency patient.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Show "Confirm" button if still a draft */}
            {patient.status === "Draft" && (
              <button
                onClick={handleConfirm}
                disabled={confirming}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-[5px] text-[12px] font-bold hover:opacity-90 transition-all w-full sm:w-auto disabled:opacity-50"
              >
                {confirming ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                Confirm Emergency
              </button>
            )}
            <button
              onClick={() => router.push(`/reception/emergency-registration/${id}/edit`)}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-[5px] text-[12px] font-bold text-foreground hover:bg-muted transition-all shadow-none w-full sm:w-auto"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit Details
            </button>
          </div>
        </div>

        {/* Patient Details */}
        <div className="bg-white dark:bg-[#111827] border border-border rounded-[5px] p-5 sm:p-6 space-y-6">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-[15px] font-bold text-foreground">Patient Details</h3>
            <span className={cn(
              "px-2.5 py-1 rounded-[5px] text-[11px] font-bold",
              patient.status === "Emergency" ? "bg-[#FFF2F2] text-[#E11D48]" :
              patient.status === "Draft"     ? "bg-[#F5F3FF] text-[#7C3AED]" :
                                               "bg-[#E6F9F1] text-[#00A389]"
            )}>
              {patient.status}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <DetailField label="Full Name">{patient.name || "Unknown"}</DetailField>
            <DetailField label="Age / Gender">
              {[patient.gender, patient.age ? `${patient.age} yrs` : null].filter(Boolean).join(" / ") || "—"}
            </DetailField>
            <DetailField label="Mobile Number">{patient.contact || "—"}</DetailField>
          </div>
        </div>

        {/* Arrival & Condition */}
        <div className="bg-white dark:bg-[#111827] border border-border rounded-[5px] p-5 sm:p-6 space-y-6">
          <h3 className="text-[15px] font-bold text-foreground">Arrival & Condition</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            <DetailField label="Arrival Mode">
              <div className="flex items-center gap-2">
                <ArrivalIcon mode={patient.arrivalMode} />
                {patient.arrivalMode || "—"}
              </div>
            </DetailField>
            <DetailField label="Reported Complaint">
              <span className="leading-relaxed">{patient.emergencyType || "—"}</span>
            </DetailField>
          </div>
        </div>

        {/* Triage Priority */}
        <div className={cn("border rounded-[5px] p-5 sm:p-6", priority.bg, priority.border)}>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className={cn("w-10 h-10 rounded-[5px] flex items-center justify-center shrink-0", priority.iconBg)}>
              <priority.Icon className="w-6 h-6 text-white" />
            </div>
            <div className="space-y-1 flex-1">
              <h3 className={cn("text-[15px] font-bold", priority.text)}>{priority.label}</h3>
              <p className={cn("text-[13px] font-medium leading-relaxed", priority.subText)}>{priority.desc}</p>
            </div>
            <div className="w-full sm:w-auto text-left sm:text-right shrink-0 mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-current/10">
              <div className="flex items-center gap-1.5 sm:justify-end mb-0.5">
                <Clock className={cn("w-3 h-3", priority.text, "opacity-50")} />
                <p className={cn("text-[10px] font-bold uppercase tracking-widest opacity-50", priority.text)}>
                  Time of Arrival
                </p>
              </div>
              <p className={cn("text-[18px] font-bold", priority.text)}>
                {formatTime(patient.arrivalTime)}
              </p>
              <p className={cn("text-[11px] font-medium opacity-60", priority.text)}>
                {formatDate(patient.arrivalTime)}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            onClick={() => setShowTransfer(true)}
            className="flex items-center justify-center gap-2 px-6 h-11 border border-border bg-white rounded-[5px] text-[13px] font-bold text-foreground hover:bg-muted transition-all shadow-none w-full sm:w-auto"
          >
            <ArrowLeftRight className="w-4 h-4" />
            Transfer to Ward
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 px-6 h-11 bg-[#3B4CB8] text-white rounded-[5px] text-[13px] font-bold hover:opacity-90 transition-all shadow-none w-full sm:w-auto"
          >
            <Printer className="w-4 h-4" />
            Print Registration Slip
          </button>
        </div>
      </div>

      {/* Transfer to Ward Modal */}
      <TransferModal
        isOpen={showTransfer}
        patient={patient}
        onClose={() => setShowTransfer(false)}
        onSuccess={(info) => {
          setShowTransfer(false);
          setTransferInfo(info);
        }}
      />

      {/* Transfer Success Modal */}
      <TransferSuccessModal
        isOpen={!!transferInfo}
        info={transferInfo}
        onClose={() => setTransferInfo(null)}
      />
    </div>
  );
}
