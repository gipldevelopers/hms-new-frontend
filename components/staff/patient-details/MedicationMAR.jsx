"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { 
  Plus, Clock, Pill, Search, Check, ChevronDown, 
  X, Loader2, Trash2 
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const API_BASE = "/api";

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
          "flex items-center justify-between px-3 h-11 bg-card border border-border rounded-lg text-[13px] font-medium text-foreground outline-none transition-all hover:bg-muted w-full",
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
      const res = await fetch(`${API_BASE}/pharmacy/inventory`, { headers: getAuthHeaders() });
      const data = await res.json();
      
      if (data.success && Array.isArray(data.data)) {
        const filtered = data.data.filter(med => 
          med.medicineName.toLowerCase().includes(q.toLowerCase()) &&
          med.status !== "OUT OF STOCK" &&
          med.quantity > 0
        );
        setMedicines(filtered.slice(0, 10));
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
    if (!formData.medicineName) {
      alert("Please select or enter a medicine name");
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

// --- MAIN MEDICATION MAR COMPONENT ---
export default function MedicationMAR({ patientId }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [prescription, setPrescription] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddMedicine, setShowAddMedicine] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchPrescription = useCallback(async () => {
    if (!patientId) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("authtoken");
      const res = await fetch(`${API_BASE}/patients/${patientId}/prescription`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.data) {
        setPrescription(data.data);
        setMedicines(data.data.items || []);
      }
    } catch (e) {
      console.error("Error fetching prescriptions", e);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchPrescription();
  }, [fetchPrescription]);

  const handleDelete = async (itemId) => {
    if (!confirm("Are you sure you want to delete this medication?")) return;
    setDeletingId(itemId);
    try {
      const token = localStorage.getItem("authtoken");
      const res = await fetch(`${API_BASE}/doctor-opd/prescription/items/${itemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setMedicines(prev => prev.filter(m => m.id !== itemId));
      } else {
        alert("Failed to delete medicine: " + data.message);
      }
    } catch (e) {
      console.error("Error deleting medicine", e);
      alert("Error deleting medicine");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredMedicines = medicines.filter(med => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = med.medicineName.toLowerCase().includes(query) ||
                         (med.dosage && med.dosage.toLowerCase().includes(query)) ||
                         (med.instructions && med.instructions.toLowerCase().includes(query)) ||
                         (med.timing && med.timing.toLowerCase().includes(query));
    return matchesSearch;
  });

  return (
    <div className="space-y-[20px] animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4">
        <h3 className="text-[15px] md:text-[18px] font-bold text-foreground uppercase tracking-widest shrink-0">Medication Record (MAR)</h3>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative w-full sm:w-[280px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search medication..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-11 pr-4 bg-card border border-border rounded-lg text-[13px] outline-none focus:ring-1 focus:ring-primary/20 transition-all shadow-none font-medium text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <button 
            onClick={() => setShowAddMedicine(true)}
            className="h-11 px-5 bg-primary text-primary-foreground rounded-lg text-[13px] font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-none justify-center sm:min-w-[100px]"
          >
            <Plus className="w-4 h-4" /> <span>Add</span>
          </button>
        </div>
      </div>

      {/* MAR List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 bg-card border border-border rounded-lg">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-[13px] font-bold text-muted-foreground">Loading medications...</p>
        </div>
      ) : filteredMedicines.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 bg-card border border-border rounded-lg text-center p-6 shadow-none">
          <Pill className="w-10 h-10 text-muted-foreground/30" />
          <p className="text-[14px] font-bold text-muted-foreground">No medications listed</p>
          <p className="text-[12px] text-muted-foreground max-w-sm">Click "Add" to assign new medications to this patient.</p>
        </div>
      ) : (
        <div className="space-y-4 pb-10">
          {filteredMedicines.map((med) => (
            <div 
              key={med.id} 
              className="bg-card p-5 rounded-lg border border-border transition-all shadow-none flex items-start justify-between gap-4 hover:border-border/80"
            >
              <div className="flex items-start gap-5">
                {/* Clock Icon & Timing Section */}
                <div className="text-[13px] md:text-[14px] font-black uppercase tracking-widest text-foreground flex items-center gap-2 pt-1 shrink-0">
                  <Clock className="w-4 h-4 text-primary shrink-0" />
                  <span>{med.timing}</span>
                </div>

                {/* Drug Info Section */}
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[16px] font-bold text-foreground leading-none">{med.medicineName}</p>
                    <span className="px-2 py-0.5 bg-muted text-muted-foreground rounded text-[10px] font-black border border-border uppercase tracking-tighter">{med.dosage}</span>
                    <span className="px-2 py-0.5 bg-muted text-muted-foreground rounded text-[10px] font-black border border-border uppercase tracking-tighter">{med.duration}</span>
                  </div>
                  {med.instructions && (
                    <p className="text-[12px] md:text-[13px] text-muted-foreground font-medium leading-tight">{med.instructions}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <button 
                onClick={() => handleDelete(med.id)}
                disabled={deletingId === med.id}
                className="p-2 text-muted-foreground hover:text-destructive hover:bg-muted rounded-lg transition-all disabled:opacity-50 shrink-0"
              >
                {deletingId === med.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      {showAddMedicine && (
        <AddMedicineModal 
          prescriptionId={prescription?.id} 
          onClose={() => setShowAddMedicine(false)} 
          onAdd={fetchPrescription} 
        />
      )}
    </div>
  );
}
