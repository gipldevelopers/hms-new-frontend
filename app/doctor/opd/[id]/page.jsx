"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import {
  ArrowLeft, Printer, CheckCircle2, History, Activity, Heart,
  Thermometer, Wind, Scale, Plus, Trash2, Search, ChevronDown,
  UserPlus, X, Bell, Loader2, AlertCircle, Save,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FormDatePicker } from "@/components/ui/form-date-picker";
import { toast } from "sonner";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

function getAuthHeaders() {
  const token = localStorage.getItem("authtoken");
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}


// --- CUSTOM SELECT ---
function CustomSelect({ value, onChange, options, placeholder, minWidth = "120px", className }) {
  const selected = options.find((o) => o.value === value);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={cn(
          "flex items-center justify-between px-3 h-11 bg-card border border-border rounded-lg text-[13px] font-medium text-foreground outline-none transition-all hover:bg-muted",
          className
        )} style={{ minWidth }}>
          <span className="truncate">{selected ? selected.label : placeholder}</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground ml-2 flex-shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px] z-[10000] border border-border bg-card p-1 rounded-lg shadow-none">
        {options.map((opt) => (
          <DropdownMenuItem key={opt.value} onClick={() => onChange(opt.value)}
            className="text-[13px] font-medium py-2.5 rounded-lg cursor-pointer transition-colors outline-none hover:bg-muted">
            {opt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


// --- ADD MEDICINE MODAL ---
function AddMedicineModal({ onClose, onAdd, prescriptionId }) {
  const [formData, setFormData] = useState({
    medicineName: "", dosage: "", frequency: "1-0-1",
    timing: "After Food", duration: "3", durationType: "Days", instructions: ""
  });
  const [medicineSearch, setMedicineSearch] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const searchTimer = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => { setMounted(false); window.removeEventListener("keydown", handleEsc); };
  }, [onClose]);

  const searchMedicines = useCallback(async (q) => {
    if (!q || q.length < 1) { setMedicines([]); return; }
    setSearchLoading(true);
    try {
      // Search from pharmacy inventory
      const res = await fetch(`${API_BASE}/pharmacy/inventory`, { headers: getAuthHeaders() });
      const data = await res.json();
      
      if (data.success && Array.isArray(data.data)) {
        // Filter medicines by search query and only show IN STOCK items
        const filtered = data.data.filter(med => 
          med.medicineName.toLowerCase().includes(q.toLowerCase()) &&
          med.status !== "OUT OF STOCK" &&
          med.quantity > 0
        );
        setMedicines(filtered.slice(0, 10)); // Limit to 10 results
      } else {
        setMedicines([]);
      }
    } catch (err) { 
      console.error("Error searching medicines:", err);
      setMedicines([]); 
    }
    finally { setSearchLoading(false); }
  }, []);

  const handleMedicineInput = (val) => {
    setMedicineSearch(val);
    setFormData(f => ({ ...f, medicineName: val }));
    setSelectedMedicine(null);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => searchMedicines(val), 300);
  };

  const selectMedicine = (med) => {
    setFormData(f => ({ 
      ...f, 
      medicineName: med.medicineName, 
      medicineId: med.id 
    }));
    setMedicineSearch(med.medicineName);
    setSelectedMedicine(med);
    setMedicines([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prescriptionId) {
      alert("Please wait — creating prescription first...");
      return;
    }
    if (!formData.medicineName || formData.medicineName.trim() === "") {
      alert("Please select or enter a medicine name");
      return;
    }
    if (formData.medicineName.length > 200) {
      alert("Medicine name must be 200 characters or less");
      return;
    }
    if (!formData.dosage || formData.dosage.trim() === "") {
      alert("Dosage is required");
      return;
    }
    if (formData.dosage.length > 100) {
      alert("Dosage must be 100 characters or less");
      return;
    }
    const timingStr = `${formData.frequency} (${formData.timing})`;
    if (timingStr.length > 200) {
      alert("Timing details must be 200 characters or less");
      return;
    }
    const durationStr = `${formData.duration} ${formData.durationType}`;
    if (durationStr.length > 100) {
      alert("Duration must be 100 characters or less");
      return;
    }
    if (formData.instructions && formData.instructions.length > 500) {
      alert("Instructions must be 500 characters or less");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/doctor-opd/prescription/${prescriptionId}/items`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          medicineId: selectedMedicine?.id || null,
          medicineName: formData.medicineName,
          dosage: formData.dosage,
          timing: `${formData.frequency} (${formData.timing})`,
          duration: `${formData.duration} ${formData.durationType}`,
          instructions: formData.instructions || null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        onAdd(data.data);
        onClose();
      } else {
        alert("Error adding medicine: " + data.message);
      }
    } catch (err) {
      console.error("Error adding medicine:", err);
      alert("Error adding medicine: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!mounted) return null;

  // Show spinner if prescriptionId not ready yet
  if (!prescriptionId) {
    return createPortal(
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-card w-full max-w-lg rounded-lg border border-border p-10 flex flex-col items-center gap-4 z-50">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-[14px] font-bold text-foreground">Setting up prescription...</p>
          <p className="text-[12px] text-muted-foreground">Please wait a moment</p>
        </div>
      </div>,
      document.body
    );
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />
      <div className="relative bg-card w-full max-w-lg rounded-lg border border-border overflow-hidden animate-in zoom-in-95 duration-200 z-50">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h3 className="text-[16px] font-bold text-foreground">Add Medicine</h3>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Medicine Name *</label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-20" />
              <input required autoFocus placeholder="Type medicine name (e.g., Paracetamol, Amoxicillin)..."
                className="w-full h-11 pl-10 pr-4 bg-muted border border-border rounded-lg text-[13px] font-medium text-foreground outline-none focus:border-primary transition-all"
                value={medicineSearch}
                onChange={(e) => handleMedicineInput(e.target.value)}
                ref={inputRef}
              />
              {searchLoading && <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground z-20" />}
            </div>
            {medicines.length > 0 && (
              <div className="border border-border rounded-lg bg-card shadow-lg overflow-hidden max-h-56 overflow-y-auto z-50 relative">
                {medicines.map((m) => (
                  <button key={m.id} type="button" onClick={() => selectMedicine(m)}
                    className="w-full px-4 py-3 text-left text-[13px] hover:bg-muted transition-colors flex items-center justify-between border-b border-border last:border-b-0">
                    <div className="flex-1">
                      <div className="font-bold text-foreground">{m.medicineName}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        {m.type} • {m.mfg || "Unknown Mfg"} • Stock: {m.quantity}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <span className={cn(
                        "px-2 py-1 rounded text-[10px] font-bold whitespace-nowrap",
                        m.status === "IN STOCK" ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600" :
                        m.status === "LOW" ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600" :
                        "bg-red-50 dark:bg-red-500/10 text-red-600"
                      )}>
                        {m.status}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {medicineSearch && medicines.length === 0 && !searchLoading && (
              <div className="border border-border rounded-lg bg-card p-4 text-center text-[13px] text-muted-foreground">
                No medicines found matching &quot;{medicineSearch}&quot;
              </div>
            )}
            {selectedMedicine && (
              <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-lg p-3">
                <div className="text-[12px] font-bold text-primary mb-1">Selected Medicine</div>
                <div className="text-[13px] font-bold text-foreground">{selectedMedicine.medicineName}</div>
                <div className="text-[11px] text-muted-foreground mt-1">
                  Type: {selectedMedicine.type} • Stock: {selectedMedicine.quantity} • Status: {selectedMedicine.status}
                </div>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Dosage *</label>
              <input required placeholder="e.g. 1 Tablet"
                className="w-full h-11 px-4 bg-muted border border-border rounded-lg text-[13px] font-medium text-foreground outline-none focus:border-primary transition-all"
                value={formData.dosage} onChange={(e) => setFormData(f => ({ ...f, dosage: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Frequency *</label>
              <CustomSelect value={formData.frequency} onChange={(v) => setFormData(f => ({ ...f, frequency: v }))} minWidth="100%"
                options={[
                  { label: "1-0-0 (Morning)", value: "1-0-0" },
                  { label: "0-1-0 (Afternoon)", value: "0-1-0" },
                  { label: "0-0-1 (Night)", value: "0-0-1" },
                  { label: "1-0-1 (Twice)", value: "1-0-1" },
                  { label: "1-1-1 (Thrice)", value: "1-1-1" },
                  { label: "1-1-1-1 (Four times)", value: "1-1-1-1" },
                ]} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Timing *</label>
              <CustomSelect value={formData.timing} onChange={(v) => setFormData(f => ({ ...f, timing: v }))} minWidth="100%"
                options={[
                  { label: "After Food", value: "After Food" },
                  { label: "Before Food", value: "Before Food" },
                  { label: "Empty Stomach", value: "Empty Stomach" },
                  { label: "With Food", value: "With Food" },
                ]} />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Duration *</label>
              <div className="flex gap-2">
                <input required type="number" min="1"
                  className="w-20 h-11 px-3 bg-muted border border-border rounded-lg text-[13px] font-medium text-foreground outline-none focus:border-primary transition-all"
                  value={formData.duration} onChange={(e) => setFormData(f => ({ ...f, duration: e.target.value }))} />
                <div className="flex-1">
                  <CustomSelect value={formData.durationType} onChange={(v) => setFormData(f => ({ ...f, durationType: v }))} minWidth="100%"
                    options={[{ label: "Days", value: "Days" }, { label: "Weeks", value: "Weeks" }, { label: "Months", value: "Months" }]} />
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Special Instructions</label>
            <textarea placeholder="Any specific notes..."
              className="w-full min-h-[70px] p-4 bg-muted border border-border rounded-lg text-[13px] font-medium text-foreground outline-none focus:border-primary transition-all resize-none"
              value={formData.instructions} onChange={(e) => setFormData(f => ({ ...f, instructions: e.target.value }))} />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 h-11 border border-border bg-card text-foreground rounded-lg text-[13px] font-bold hover:bg-muted transition-all">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 h-11 bg-primary hover:opacity-95 text-primary-foreground rounded-lg text-[13px] font-bold transition-all shadow-none flex items-center justify-center gap-2 disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Add Medicine
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}


// --- PATIENT HISTORY DRAWER ---
function PatientHistoryDrawer({ onClose, history }) {
  const [mounted] = useState(() => typeof document !== "undefined");
  const [closing, setClosing] = useState(false);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(onClose, 280);
  }, [onClose]);

  useEffect(() => {
    const sw = window.innerWidth - document.documentElement.clientWidth;
    const orig = window.getComputedStyle(document.body).overflow;
    const origPad = window.getComputedStyle(document.body).paddingRight;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${sw}px`;
    const handleEsc = (e) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = orig;
      document.body.style.paddingRight = origPad;
      window.removeEventListener("keydown", handleEsc);
    };
  }, [handleClose]);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex justify-end">
      <div className={cn("absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300",
        closing ? "animate-out fade-out" : "animate-in fade-in")} onClick={handleClose} />
      <div className={cn("relative w-full max-w-[480px] h-full bg-background border-l border-border shadow-2xl flex flex-col duration-300",
        closing ? "animate-out slide-out-to-right" : "animate-in slide-in-from-right")}>
        <div className="p-6 bg-card border-b border-border flex items-center justify-between">
          <h2 className="text-[20px] font-bold text-foreground">Patient History</h2>
          <button onClick={handleClose} className="p-2 hover:bg-muted rounded-full transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto pt-10 pb-10 px-8 relative">
          {!history || history.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16">
              <History className="w-10 h-10 text-muted-foreground/30" />
              <p className="text-[14px] font-bold text-muted-foreground">No previous consultations</p>
            </div>
          ) : (
            <div className="space-y-0">
              {history.map((visit, idx) => (
                <div key={visit.id} className="flex gap-6 group">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-[16px] h-[16px] rounded-full border-[2px] border-primary bg-card z-10 mt-[5px]" />
                    {idx < history.length - 1 && <div className="w-[1px] bg-border flex-1 my-[2px]" />}
                  </div>
                  <div className={cn("flex-1", idx < history.length - 1 ? "pb-12" : "pb-0")}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                      <div>
                        <h3 className="text-[18px] font-bold text-foreground leading-none">
                          {new Date(visit.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                        </h3>
                        <p className="text-[13px] font-medium text-muted-foreground mt-1.5">{visit.doctorName || "Doctor"}</p>
                      </div>
                      {visit.finalDiagnosis && (
                        <span className="px-2.5 py-0.5 bg-primary/5 dark:bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold rounded-lg w-fit">
                          {visit.finalDiagnosis}
                        </span>
                      )}
                    </div>
                    <div className="bg-card border border-border rounded-lg p-5 space-y-4 shadow-none">
                      {visit.chiefComplaints && (
                        <div>
                          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Chief Complaints</p>
                          <p className="text-[13px] text-foreground leading-relaxed">{visit.chiefComplaints}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}


// --- CALL NEXT MODAL ---
function CallNextModal({ onClose, patientName, token, onConfirm }) {
  const [mounted] = useState(() => typeof document !== "undefined");
  const [closing, setClosing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClose = useCallback(() => { setClosing(true); setTimeout(onClose, 300); }, [onClose]);

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
    handleClose();
  };

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", handleEsc);
    const sw = window.innerWidth - document.documentElement.clientWidth;
    const orig = window.getComputedStyle(document.body).overflow;
    const origPad = window.getComputedStyle(document.body).paddingRight;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${sw}px`;
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = orig;
      document.body.style.paddingRight = origPad;
    };
  }, [handleClose]);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className={cn("absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300",
        closing ? "animate-out fade-out" : "animate-in fade-in")} onClick={handleClose} />
      <div className={cn("relative bg-card w-full max-w-[440px] rounded-lg border border-border flex flex-col p-8 items-center text-center duration-300 shadow-none z-10",
        closing ? "animate-out zoom-out-95 fade-out" : "animate-in zoom-in-95 fade-in")}>
        <div className="relative mb-6">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
            <Bell className="w-8 h-8 text-primary dark:text-foreground" />
          </div>
          <div className="absolute top-0 right-0 w-4 h-4 bg-destructive border-2 border-card rounded-full" />
        </div>
        <h2 className="text-[20px] font-bold text-foreground mb-3">Complete Consultation?</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-8 px-4 text-center">
          This will mark{" "}
          <span className="font-bold text-foreground">({token}: {patientName})</span>{" "}
          as completed and save all consultation data.
        </p>
        <div className="flex items-center gap-4 w-full">
          <button onClick={handleClose}
            className="flex-1 h-11 border border-border bg-card text-foreground rounded-lg text-[13px] font-bold hover:bg-muted transition-all outline-none">
            Cancel
          </button>
          <button onClick={handleConfirm} disabled={loading}
            className="flex-1 h-11 bg-primary hover:opacity-95 text-primary-foreground rounded-lg text-[13px] font-bold flex items-center justify-center gap-2 transition-all shadow-none outline-none disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            Complete
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}


// --- MAIN CONSULTATION PAGE ---
export default function ConsultationPage() {
  const router = useRouter();
  const params = useParams();
  const appointmentId = params?.id;

  // Data state
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState(null);

  // Consultation form state
  const [chiefComplaints, setChiefComplaints] = useState("");
  const [clinicalHistory, setClinicalHistory] = useState("");
  const [diagnoses, setDiagnoses] = useState([]);
  const [diagnosisInput, setDiagnosisInput] = useState("");
  const [labTests, setLabTests] = useState([]);
  const [labInput, setLabInput] = useState("");
  const [labPriority, setLabPriority] = useState("Normal");
  const [instructions, setInstructions] = useState("");
  const [followUp, setFollowUp] = useState(null);   // Date | null
  const [referral, setReferral] = useState("");

  // Prescription state
  const [consultationId, setConsultationId] = useState(null);
  const [prescriptionId, setPrescriptionId] = useState(null);
  const [medicines, setMedicines] = useState([]);

  // UI state
  const [showAddMedicine, setShowAddMedicine] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showCallNext, setShowCallNext] = useState(false);
  const [deletingMedId, setDeletingMedId] = useState(null);

  // Fetch patient data
  const fetchData = useCallback(async () => {
    if (!appointmentId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/doctor-opd/patients/${appointmentId}`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error(`Failed to load patient: ${res.status}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to load patient");

      const d = data.data;
      setPageData(d);

      // Populate form from existing consultation
      if (d.consultation) {
        const c = d.consultation;
        setConsultationId(c.id);
        setChiefComplaints(c.chiefComplaints || "");
        setClinicalHistory(c.clinicalHistory || "");
        setDiagnoses(c.finalDiagnosis ? c.finalDiagnosis.split(",").map(s => s.trim()).filter(Boolean) : []);
        setLabTests(Array.isArray(c.labTests)
          ? c.labTests.map((test) => typeof test === "string" ? { name: test } : test).filter((test) => test?.name)
          : []);
        setLabPriority(c.labTestOrder?.priority || "Normal");
        setInstructions(c.followUpNotes || "");
        setFollowUp(c.followUpDate ? new Date(c.followUpDate) : null);
        setReferral(c.referralDoctor || c.referralDepartment || "");

        // Load prescription medicines
        if (c.prescriptions && c.prescriptions.length > 0) {
          const rx = c.prescriptions[0];
          setPrescriptionId(rx.id);
          setMedicines(rx.items || []);
        }
      }
    } catch (err) {
      console.error("Error fetching patient:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [appointmentId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Auto-save consultation (debounced)
  const saveTimer = useRef(null);
  const saveConsultation = useCallback(async (status = "IN_PROGRESS") => {
    if (!appointmentId) return;
    if (chiefComplaints && chiefComplaints.length > 1000) {
      alert("Chief Complaints must be 1000 characters or less");
      return;
    }
    if (clinicalHistory && clinicalHistory.length > 1000) {
      alert("Clinical History must be 1000 characters or less");
      return;
    }
    const finalDiagnosisStr = diagnoses.join(", ");
    if (finalDiagnosisStr && finalDiagnosisStr.length > 500) {
      alert("Diagnoses details must be 500 characters or less");
      return;
    }
    if (labTests && labTests.some(t => t.name && t.name.length > 200)) {
      alert("Lab test name must be 200 characters or less");
      return;
    }
    if (instructions && instructions.length > 1000) {
      alert("Instructions must be 1000 characters or less");
      return;
    }
    if (referral && referral.length > 200) {
      alert("Referral details must be 200 characters or less");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/doctor-opd/consultation/${appointmentId}`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          chiefComplaints,
          clinicalHistory,
          finalDiagnosis: diagnoses.join(", "),
          labTests,
          labPriority,
          followUpNotes: instructions,
          followUpDate: followUp ? followUp.toISOString() : null,
          referralDoctor: referral || null,
          status,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setConsultationId(data.data.id);
        // Create prescription if not exists
        if (!prescriptionId && data.data.id) {
          const rxRes = await fetch(`${API_BASE}/doctor-opd/prescription/${data.data.id}`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({ instructions }),
          });
          const rxData = await rxRes.json();
          if (rxData.success) setPrescriptionId(rxData.data.id);
        }
        setSaveMsg("Saved");
        setTimeout(() => setSaveMsg(null), 2000);
      }
    } catch (err) { console.error("Save error:", err); }
    finally { setSaving(false); }
  }, [appointmentId, chiefComplaints, clinicalHistory, diagnoses, labTests, labPriority, instructions, followUp, referral, prescriptionId]);

  // Trigger auto-save on form changes
  useEffect(() => {
    if (!pageData) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveConsultation("IN_PROGRESS"), 1500);
    return () => clearTimeout(saveTimer.current);
  }, [pageData, saveConsultation, chiefComplaints, clinicalHistory, diagnoses, labTests, labPriority, instructions, followUp, referral]);

  const handleComplete = async () => {
    await saveConsultation("COMPLETED");
    // Update appointment status
    await fetch(`${API_BASE}/appointments/${appointmentId}/status`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status: "COMPLETED" }),
    });
    router.push("/doctor/opd");
  };

  const handleDeleteMedicine = async (itemId) => {
    setDeletingMedId(itemId);
    try {
      const res = await fetch(`${API_BASE}/doctor-opd/prescription/items/${itemId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) setMedicines(prev => prev.filter(m => m.id !== itemId));
    } catch (err) { console.error("Delete error:", err); }
    finally { setDeletingMedId(null); }
  };

  const handleMedicineAdded = (newItem) => {
    setMedicines(prev => [...prev, newItem]);
  };

  const handleOpenAddMedicine = useCallback(async () => {
    // If we already have a prescriptionId, open immediately
    if (prescriptionId) {
      setShowAddMedicine(true);
      return;
    }
    // Otherwise create consultation + prescription first
    setSaving(true);
    try {
      // Save consultation
      const res = await fetch(`${API_BASE}/doctor-opd/consultation/${appointmentId}`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          chiefComplaints,
          clinicalHistory,
          finalDiagnosis: diagnoses.join(", "),
          labTests,
          labPriority,
          followUpNotes: instructions,
          followUpDate: followUp ? followUp.toISOString() : null,
          referralDoctor: referral || null,
          status: "IN_PROGRESS",
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      const cId = data.data.id;
      setConsultationId(cId);

      // Create prescription
      const rxRes = await fetch(`${API_BASE}/doctor-opd/prescription/${cId}`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ instructions }),
      });
      const rxData = await rxRes.json();
      if (rxData.success) {
        setPrescriptionId(rxData.data.id);
      }
    } catch (err) {
      console.error("Error setting up prescription:", err);
    } finally {
      setSaving(false);
      setShowAddMedicine(true); // Open modal regardless — modal handles null prescriptionId
    }
  }, [prescriptionId, appointmentId, chiefComplaints, clinicalHistory, diagnoses, labTests, labPriority, instructions, followUp, referral]);

  const addDiagnosis = () => {
    const val = diagnosisInput.trim();
    if (val && !diagnoses.includes(val)) setDiagnoses(prev => [...prev, val]);
    setDiagnosisInput("");
  };

  const addLabTest = () => {
    const val = labInput.trim();
    if (val && !labTests.some((test) => test.name?.toLowerCase() === val.toLowerCase())) {
      setLabTests(prev => [...prev, { name: val }]);
    }
    setLabInput("");
  };

  const patient = pageData?.patient;
  const appointment = pageData?.appointment;
  const vitals = pageData?.vitals;
  const history = pageData?.previousConsultations || [];

  const FOLLOW_UP_OPTIONS = [
    { label: "After 3 Days", value: "3days" },
    { label: "After 1 Week", value: "1week" },
    { label: "After 2 Weeks", value: "2weeks" },
    { label: "After 1 Month", value: "1month" },
  ];


  // Loading state
  if (loading) {
    return (
      <div className="p-5 bg-background min-h-screen flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 hover:bg-card rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="h-6 bg-muted rounded w-40 animate-pulse" />
        </div>
        <div className="bg-card border border-border p-5 rounded-lg animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-muted" />
            <div className="space-y-2">
              <div className="h-5 bg-muted rounded w-48" />
              <div className="h-4 bg-muted rounded w-32" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-card border border-border p-5 rounded-lg animate-pulse h-24" />
          ))}
        </div>
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-5 bg-background min-h-screen flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 hover:bg-card rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <h1 className="text-[20px] font-bold text-foreground">Consultation</h1>
        </div>
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 flex flex-col items-center gap-4">
          <AlertCircle className="w-10 h-10 text-destructive" />
          <p className="text-[15px] font-bold text-destructive">Failed to load patient data</p>
          <p className="text-[13px] text-muted-foreground">{error}</p>
          <button onClick={fetchData}
            className="h-10 px-6 bg-primary text-primary-foreground rounded-lg text-[13px] font-bold">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 bg-background min-h-screen flex flex-col gap-5 transition-colors duration-300 font-sans pb-20">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 hover:bg-card rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <h1 className="text-[20px] font-bold text-foreground tracking-tight leading-none">Consultation</h1>
          {saving && (
            <span className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
            </span>
          )}
          {saveMsg && (
            <span className="flex items-center gap-1.5 text-[12px] text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" /> {saveMsg}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => saveConsultation("IN_PROGRESS")}
            className="h-10 px-4 bg-card border border-border text-foreground rounded-lg text-[13px] font-bold flex items-center gap-2 hover:bg-muted transition-all shadow-none outline-none">
            <Save className="w-4 h-4" /> Save
          </button>
          <button className="h-10 px-4 bg-card border border-border text-foreground rounded-lg text-[13px] font-bold flex items-center gap-2 hover:bg-muted transition-all shadow-none outline-none">
            <Printer className="w-4 h-4" /> Print
          </button>
          <button onClick={() => setShowCallNext(true)}
            className="h-10 px-4 bg-primary hover:opacity-95 text-primary-foreground rounded-lg text-[13px] font-bold flex items-center gap-2 transition-all shadow-none outline-none">
            <CheckCircle2 className="w-4 h-4" /> Complete Consultation
          </button>
        </div>
      </div>

      {/* Patient Profile Card */}
      <div className="bg-card border border-border p-5 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-none">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20 shrink-0">
            <span className="text-[20px] font-bold text-primary">
              {patient?.name?.charAt(0)?.toUpperCase() || "P"}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-[18px] font-bold text-foreground">{patient?.name || "—"}</h2>
              <span className="px-2 py-0.5 bg-amber-50 dark:bg-amber-500/10 text-amber-600 text-[10px] font-bold rounded-lg border border-amber-200/50 dark:border-amber-500/20">
                {appointment?.status || "In Progress"}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-[13px] font-medium text-muted-foreground">
              {patient?.age && <span>{patient.age} yrs</span>}
              {patient?.gender && <span>/ {patient.gender}</span>}
              {patient?.bloodGroup && (
                <span className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                  {patient.bloodGroup}
                </span>
              )}
              {appointment?.tokenNumber && (
                <span className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                  Token: <span className="font-bold text-foreground">{appointment.tokenNumber}</span>
                </span>
              )}
              {patient?.contact && (
                <span className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                  {patient.contact}
                </span>
              )}
            </div>
          </div>
        </div>
        <button onClick={() => setShowHistory(true)}
          className="h-10 px-4 bg-card border border-border text-foreground rounded-lg text-[13px] font-bold flex items-center gap-2 hover:bg-muted transition-all shadow-none outline-none w-full md:w-auto justify-center">
          <History className="w-4 h-4" /> View History
        </button>
      </div>

      {/* Vitals Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {[
          { label: "BLOOD PRESSURE", value: vitals ? `${vitals.systolic || "—"}/${vitals.diastolic || "—"}` : "—", unit: "mmHg", icon: Activity, color: "text-emerald-500", bgColor: "bg-emerald-50 dark:bg-emerald-500/10" },
          { label: "HEART RATE",     value: vitals?.heartRate || "—",     unit: "bpm", icon: Heart,       color: "text-rose-500",   bgColor: "bg-rose-50 dark:bg-rose-500/10" },
          { label: "TEMPERATURE",    value: vitals?.temperature || "—",   unit: "°F",  icon: Thermometer, color: "text-blue-500",   bgColor: "bg-blue-50 dark:bg-blue-500/10" },
          { label: "SPO2",           value: vitals?.spo2 || "—",          unit: "%",   icon: Wind,        color: "text-cyan-500",   bgColor: "bg-cyan-50 dark:bg-cyan-500/10" },
          { label: "WEIGHT",         value: "—",                          unit: "kg",  icon: Scale,       color: "text-indigo-500", bgColor: "bg-indigo-50 dark:bg-indigo-500/10" },
        ].map((v, i) => (
          <div key={i} className="bg-card border border-border p-5 rounded-lg shadow-none flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{v.label}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-[20px] font-bold text-foreground leading-none">{v.value}</span>
                <span className="text-[11px] font-medium text-muted-foreground">{v.unit}</span>
              </div>
            </div>
            <div className={cn("p-2 rounded-lg", v.bgColor)}>
              <v.icon className={cn("w-5 h-5", v.color)} />
            </div>
          </div>
        ))}
      </div>


      {/* Main Consultation Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Left Column: Clinical Notes & Lab */}
        <div className="lg:col-span-5 flex flex-col gap-5">

          {/* Clinical Notes */}
          <div className="bg-card border border-border rounded-lg shadow-none flex flex-col">
            <div className="p-5 border-b border-border">
              <h3 className="text-[15px] font-bold text-foreground">Clinical Notes</h3>
            </div>
            <div className="p-5 space-y-5">
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-muted-foreground">Chief Complaints</label>
                <textarea
                  placeholder="Enter chief complaints..."
                  className="w-full min-h-[90px] p-4 bg-muted border border-border rounded-lg text-[13px] font-medium text-foreground outline-none focus:border-primary transition-all resize-none"
                  value={chiefComplaints}
                  onChange={(e) => setChiefComplaints(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-muted-foreground">Clinical History / Examination</label>
                <textarea
                  placeholder="Enter clinical history and examination findings..."
                  className="w-full min-h-[100px] p-4 bg-card border border-border rounded-lg text-[13px] font-medium text-foreground outline-none focus:border-primary transition-all resize-none"
                  value={clinicalHistory}
                  onChange={(e) => setClinicalHistory(e.target.value)}
                />
              </div>
              <div className="space-y-3">
                <label className="text-[12px] font-bold text-muted-foreground">Diagnosis</label>
                <div className="flex gap-2">
                  <div className="flex-1 h-11 px-4 bg-card border border-border rounded-lg flex items-center gap-2">
                    <Activity className="w-4 h-4 text-muted-foreground shrink-0" />
                    <input
                      placeholder="Type diagnosis and press Enter..."
                      className="flex-1 bg-transparent text-[13px] font-medium text-foreground outline-none"
                      value={diagnosisInput}
                      onChange={(e) => setDiagnosisInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addDiagnosis(); } }}
                    />
                  </div>
                  <button onClick={addDiagnosis}
                    className="h-11 px-4 bg-primary text-primary-foreground rounded-lg text-[12px] font-bold hover:opacity-90 transition-all">
                    Add
                  </button>
                </div>
                {diagnoses.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {diagnoses.map((d, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 px-3 py-1 bg-primary/5 dark:bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold rounded-lg">
                        <Activity className="w-3 h-3" />
                        {d}
                        <button onClick={() => setDiagnoses(prev => prev.filter((_, i) => i !== idx))}
                          className="ml-1 hover:text-primary/70 transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Lab Investigations */}
          <div className="bg-card border border-border rounded-lg shadow-none flex flex-col">
            <div className="p-5 border-b border-border">
              <h3 className="text-[15px] font-bold text-foreground">Lab Investigations</h3>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-muted-foreground">Priority</label>
                <CustomSelect
                  value={labPriority}
                  onChange={setLabPriority}
                  minWidth="100%"
                  options={[
                    { label: "Normal", value: "Normal" },
                    { label: "High", value: "High" },
                    { label: "Urgent", value: "Urgent" },
                  ]}
                />
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Type lab test and press Enter..."
                    className="w-full h-11 pl-10 pr-4 bg-card border border-border rounded-lg text-[13px] font-medium outline-none focus:border-primary transition-all shadow-none"
                    value={labInput}
                    onChange={(e) => setLabInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addLabTest(); } }}
                  />
                </div>
                <button onClick={addLabTest}
                  className="h-11 px-4 bg-primary text-primary-foreground rounded-lg text-[12px] font-bold hover:opacity-90 transition-all">
                  Add
                </button>
              </div>
              {labTests.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {labTests.map((t, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 px-3 py-1 bg-muted border border-border text-foreground text-[11px] font-bold rounded-lg">
                      {t.name}
                      <button onClick={() => setLabTests(prev => prev.filter((_, i) => i !== idx))}>
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Prescription & Follow-up */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          <div className="bg-card border border-border rounded-lg shadow-none flex flex-col">
            <div className="p-5 border-b border-border">
              <h3 className="text-[15px] font-bold text-foreground">Prescription</h3>
            </div>
            <div className="p-5 space-y-5">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border uppercase tracking-wider text-[10px] font-bold text-muted-foreground">
                      <th className="px-4 py-3">Medicine</th>
                      <th className="px-4 py-3">Dosage</th>
                      <th className="px-4 py-3">Timing</th>
                      <th className="px-4 py-3">Duration</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {medicines.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-[13px] text-muted-foreground">
                          No medicines added yet. Click &quot;Add Medicine&quot; below.
                        </td>
                      </tr>
                    ) : (
                      medicines.map((m) => (
                        <tr key={m.id} className="text-[13px] font-medium text-foreground">
                          <td className="px-4 py-4 font-bold">{m.medicineName}</td>
                          <td className="px-4 py-4">{m.dosage}</td>
                          <td className="px-4 py-4">{m.timing}</td>
                          <td className="px-4 py-4">{m.duration}</td>
                          <td className="px-4 py-4 text-right">
                            <button
                              onClick={() => handleDeleteMedicine(m.id)}
                              disabled={deletingMedId === m.id}
                              className="p-1.5 hover:bg-destructive/10 text-destructive rounded transition-colors disabled:opacity-50">
                              {deletingMedId === m.id
                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                : <Trash2 className="w-4 h-4" />}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <button
                onClick={handleOpenAddMedicine}
                disabled={saving}
                className="w-full h-12 border-2 border-dashed border-border rounded-lg flex items-center justify-center gap-2 text-[13px] font-bold text-muted-foreground hover:bg-muted/50 transition-all disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Add Medicine
              </button>

              <div className="space-y-2">
                <label className="text-[12px] font-bold text-muted-foreground">Advice / Instructions</label>
                <textarea
                  placeholder="Drink plenty of warm fluids. Rest for 2 days..."
                  className="w-full min-h-[80px] p-4 bg-muted border border-border rounded-lg text-[13px] font-medium text-foreground outline-none focus:border-primary transition-all resize-none"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-muted-foreground">Follow-up</label>
                  <FormDatePicker
                    placeholder="Select follow-up date"
                    value={followUp}
                    onChange={(date) => setFollowUp(date || null)}
                    variant="muted"
                    align="top"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-muted-foreground">Referral (Optional)</label>
                  <div className="relative">
                    <UserPlus className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Doctor or department..."
                      className="w-full h-11 pl-10 pr-4 bg-card border border-border rounded-lg text-[13px] font-medium text-foreground outline-none focus:border-primary transition-all"
                      value={referral}
                      onChange={(e) => setReferral(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddMedicine && (
        <AddMedicineModal
          onClose={() => setShowAddMedicine(false)}
          onAdd={handleMedicineAdded}
          prescriptionId={prescriptionId}
        />
      )}
      {showHistory && (
        <PatientHistoryDrawer onClose={() => setShowHistory(false)} history={history} />
      )}
      {showCallNext && (
        <CallNextModal
          onClose={() => setShowCallNext(false)}
          patientName={patient?.name || "Patient"}
          token={appointment?.tokenNumber || "—"}
          onConfirm={handleComplete}
        />
      )}
    </div>
  );
}
