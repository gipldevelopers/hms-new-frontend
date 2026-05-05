"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { 
  ArrowLeft, 
  Printer, 
  CheckCircle2, 
  History, 
  Activity, 
  Heart, 
  Thermometer, 
  Wind, 
  Scale, 
  Plus, 
  Trash2, 
  Search,
  ChevronDown,
  Calendar,
  UserPlus,
  X,
  Bell
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// --- CUSTOM SELECT COMPONENT ---
function CustomSelect({ value, onChange, options, placeholder, minWidth = "120px", className }) {
  const selected = options.find((o) => o.value === value);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={cn(
          "flex items-center justify-between px-3 h-11 bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-medium text-foreground outline-none transition-all hover:bg-gray-50 dark:hover:bg-white/5",
          className
        )} style={{ minWidth }}>
          <span className="truncate">{selected ? selected.label : placeholder}</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground ml-2 flex-shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px] z-[10000]">
        {options.map((opt) => (
          <DropdownMenuItem 
            key={opt.value} 
            onClick={() => onChange(opt.value)}
            className="text-[13px] font-medium py-2.5"
          >
            {opt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// --- ADD MEDICINE MODAL ---
function AddMedicineModal({ onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequency: "1-0-1",
    timing: "After Food",
    duration: "3",
    durationType: "Days",
    instructions: ""
  });

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      setMounted(false);
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      id: Date.now(),
      name: formData.name,
      dosage: formData.dosage,
      timing: `${formData.frequency} (${formData.timing})`,
      duration: `${formData.duration} ${formData.durationType}`
    });
    onClose();
  };

  if (!mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-all animate-in fade-in duration-200 z-0"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative bg-white dark:bg-[#101935] w-full max-w-lg rounded-[5px] border border-[#E7E8EB] dark:border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 z-50">
        {/* Header */}
        <div className="p-5 border-b border-[#E7E8EB] dark:border-white/5 flex items-center justify-between">
          <h3 className="text-[16px] font-bold text-foreground">Add New Medicine</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Medicine Name</label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                required
                autoFocus
                placeholder="Search medicine..."
                className="w-full h-11 pl-10 pr-4 bg-[#F8F9FC] dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-medium outline-none focus:border-primary transition-all"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Dosage</label>
              <input 
                required
                placeholder="e.g. 1 Tablet"
                className="w-full h-11 px-4 bg-[#F8F9FC] dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-medium outline-none focus:border-primary transition-all"
                value={formData.dosage}
                onChange={(e) => setFormData({...formData, dosage: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Frequency</label>
              <CustomSelect 
                value={formData.frequency}
                onChange={(val) => setFormData({...formData, frequency: val})}
                minWidth="100%"
                options={[
                  { label: "1-0-0 (Morning)", value: "1-0-0" },
                  { label: "0-1-0 (Afternoon)", value: "0-1-0" },
                  { label: "0-0-1 (Night)", value: "0-0-1" },
                  { label: "1-0-1 (Twice)", value: "1-0-1" },
                  { label: "1-1-1 (Thrice)", value: "1-1-1" },
                  { label: "1-1-1-1 (Four times)", value: "1-1-1-1" },
                ]}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Timing</label>
              <CustomSelect 
                value={formData.timing}
                onChange={(val) => setFormData({...formData, timing: val})}
                minWidth="100%"
                options={[
                  { label: "After Food", value: "After Food" },
                  { label: "Before Food", value: "Before Food" },
                  { label: "Empty Stomach", value: "Empty Stomach" },
                ]}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Duration</label>
              <div className="flex gap-2">
                <input 
                  required
                  type="number"
                  className="w-20 h-11 px-3 bg-[#F8F9FC] dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-medium outline-none focus:border-primary transition-all"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                />
                <div className="flex-1">
                  <CustomSelect 
                    value={formData.durationType}
                    onChange={(val) => setFormData({...formData, durationType: val})}
                    minWidth="100%"
                    options={[
                      { label: "Days", value: "Days" },
                      { label: "Weeks", value: "Weeks" },
                      { label: "Months", value: "Months" },
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Special Instructions (Optional)</label>
            <textarea 
              placeholder="Any specific notes..."
              className="w-full min-h-[80px] p-4 bg-[#F8F9FC] dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-medium text-foreground outline-none focus:border-primary transition-all resize-none"
              value={formData.instructions}
              onChange={(e) => setFormData({...formData, instructions: e.target.value})}
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 h-11 border border-[#E7E8EB] dark:border-white/10 bg-white dark:bg-transparent text-foreground rounded-[5px] text-[13px] font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 h-11 bg-[#2D3A8C] hover:opacity-95 text-white rounded-[5px] text-[13px] font-bold transition-all shadow-none"
            >
              Add Medicine
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return typeof document !== "undefined" 
    ? createPortal(modalContent, document.body) 
    : null;
}

// --- PATIENT HISTORY DRAWER ---
function PatientHistoryDrawer({ onClose }) {
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);

  const handleClose = useCallback(() => {
    setClosing(true);
    // Use slightly less than animation duration to avoid any "flash" of content
    setTimeout(() => {
      onClose();
    }, 280);
  }, [onClose]);

  useEffect(() => {
    setMounted(true);
    
    // Prevent body scroll and compensate for scrollbar width
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    const originalStyle = window.getComputedStyle(document.body).overflow;
    const originalPadding = window.getComputedStyle(document.body).paddingRight;
    
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollBarWidth}px`;

    const handleEsc = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleEsc);
    
    return () => {
      document.body.style.overflow = originalStyle;
      document.body.style.paddingRight = originalPadding;
      window.removeEventListener("keydown", handleEsc);
    };
  }, [handleClose]);

  if (!mounted) return null;

  const historyData = [
    {
      date: "12 Oct 2023",
      doctor: "Dr. Smith • Cardiology",
      diagnosis: "Hypertension",
      notes: "Patient reported mild chest discomfort. BP elevated at 140/90.",
      investigations: ["ECG (Normal)", "Lipid Profile"],
      prescriptions: [
        { name: "Amlodipine 5mg", dosage: "1-0-0", duration: "30 Days" }
      ]
    },
    {
      date: "05 Aug 2023",
      doctor: "Dr. Adams • General Medicine",
      diagnosis: "Acute Bronchitis",
      notes: "Severe cough for 5 days. No fever.",
      investigations: ["Chest X-Ray (Clear)"],
      prescriptions: [
        { name: "Azithromycin 500mg", dosage: "1-0-0", duration: "5 Days" },
        { name: "Cough Syrup", dosage: "10ml", duration: "5 Days" }
      ]
    }
  ];

  const drawerContent = (
    <div className="fixed inset-0 z-[1000] flex justify-end">
      {/* Backdrop */}
      <div 
        className={cn(
          "absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300",
          closing ? "animate-out fade-out" : "animate-in fade-in"
        )}
        onClick={handleClose}
      />
      
      {/* Drawer Container */}
      <div className={cn(
        "relative w-full max-w-[480px] h-full bg-[#F8F9FC] dark:bg-[#0A0F1D] border-l border-[#E7E8EB] dark:border-white/10 shadow-2xl flex flex-col duration-300",
        closing ? "animate-out slide-out-to-right" : "animate-in slide-in-from-right"
      )}>
        {/* Header */}
        <div className="p-6 bg-white dark:bg-[#101935] border-b border-[#E7E8EB] dark:border-white/5 flex items-center justify-between">
          <h2 className="text-[20px] font-bold text-foreground">Patient History</h2>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Scrollable Timeline */}
        <div className="flex-1 overflow-y-auto pt-10 pb-10 px-8 relative scrollbar-hide">
          <div className="space-y-0">
            {historyData.map((visit, idx) => (
              <div key={idx} className="flex gap-6 group">
                {/* Left Timeline Column */}
                <div className="flex flex-col items-center shrink-0">
                  {/* Timeline Indicator */}
                  <div className="w-[16px] h-[16px] rounded-full border-[2px] border-[#2D3A8C] bg-white dark:bg-[#0A0F1D] z-10 mt-[5px]" />
                  
                  {/* Vertical Line Segment */}
                  {idx < historyData.length - 1 && (
                    <div className="w-[1px] bg-[#E2E4E9] dark:bg-white/10 flex-1 my-[2px]" />
                  )}
                </div>

                {/* Right Content Column */}
                <div className={cn("flex-1", idx < historyData.length - 1 ? "pb-12" : "pb-0")}>
                  {/* Visit Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div>
                      <h3 className="text-[20px] font-bold text-foreground leading-none">{visit.date}</h3>
                      <p className="text-[13px] font-medium text-muted-foreground mt-1.5">{visit.doctor}</p>
                    </div>
                    <span className="px-2.5 py-0.5 bg-primary/5 dark:bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold rounded-[5px] w-fit">
                      {visit.diagnosis}
                    </span>
                  </div>

                  {/* Visit Details Card */}
                  <div className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] p-6 space-y-6 shadow-none">
                    {/* Notes */}
                    <div className="space-y-2.5">
                      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Notes</p>
                      <p className="text-[14px] text-foreground leading-relaxed">
                        {visit.notes}
                      </p>
                    </div>

                    {/* Investigations */}
                    {visit.investigations.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Investigations</p>
                        <div className="flex flex-wrap gap-2.5">
                          {visit.investigations.map((test, i) => (
                            <span key={i} className="px-3.5 py-1.5 bg-[#F8F9FC] dark:bg-white/5 border border-[#E7E8EB] dark:border-white/10 text-[12px] font-bold text-foreground rounded-[5px]">
                              {test}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Prescriptions */}
                    {visit.prescriptions.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Prescription</p>
                        <div className="space-y-2.5">
                          {visit.prescriptions.map((med, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-white/[0.02] border border-[#E7E8EB] dark:border-white/5 rounded-[5px]">
                              <div className="flex flex-col">
                                <span className="text-[13px] font-bold text-foreground">{med.name}</span>
                                <span className="text-[12px] text-muted-foreground font-medium">{med.dosage}</span>
                              </div>
                              <span className="text-[12px] font-bold text-muted-foreground">{med.duration}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );

  return createPortal(drawerContent, document.body);
}

export default function ConsultationPage() {
  const router = useRouter();
  const params = useParams();

  // Mock data for the patient based on screenshot
  const patient = {
    name: "Elena Rodriguez",
    ageGender: "28 yrs / Female",
    token: "T-03",
    waitingSince: "09:15 AM",
    status: "In Progress",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100"
  };

  const [diagnoses, setDiagnoses] = useState(["Viral Pharyngitis"]);
  const [labTests, setLabTests] = useState(["CBC (Complete Blood Count)"]);
  const [medicines, setMedicines] = useState([
    { id: 1, name: "Paracetamol 500mg", dosage: "1 Tablet", timing: "1-0-1 (After Food)", duration: "3 Days" },
    { id: 2, name: "Amoxicillin 250mg", dosage: "1 Capsule", timing: "1-1-1 (After Food)", duration: "5 Days" },
  ]);

  const [showAddMedicine, setShowAddMedicine] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showCallNext, setShowCallNext] = useState(false);

  const removeDiagnosis = (tag) => setDiagnoses(diagnoses.filter(t => t !== tag));
  const removeLabTest = (tag) => setLabTests(labTests.filter(t => t !== tag));
  const removeMedicine = (id) => setMedicines(medicines.filter(m => m.id !== id));

  const addMedicine = (newMed) => {
    setMedicines([...medicines, newMed]);
  };

  return (
    <div className="p-[20px] bg-[#F8F9FC] dark:bg-[#0A0F1D] min-h-screen flex flex-col space-y-[20px] transition-colors duration-300 font-sans pb-20">
      
      {/* ── Header Area ── */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-white dark:hover:bg-white/5 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <h1 className="text-[20px] font-bold text-[#1e293b] dark:text-white tracking-tight leading-none">
            Consultation
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-10 px-4 bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 text-foreground rounded-[5px] text-[13px] font-bold flex items-center gap-2 hover:bg-muted transition-all shadow-none outline-none">
            <Printer className="w-4 h-4" /> Print Prescription
          </button>
          <button 
            onClick={() => setShowCallNext(true)}
            className="h-10 px-4 bg-[#2D3A8C] hover:opacity-95 text-white rounded-[5px] text-[13px] font-bold flex items-center gap-2 transition-all shadow-none outline-none"
          >
            <CheckCircle2 className="w-4 h-4" /> Complete Consultation
          </button>
        </div>
      </div>

      {/* ── Patient Profile Card ── */}
      <div className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 p-5 rounded-[5px] flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-none transition-all">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/10">
            <img src={patient.avatar} alt={patient.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-[18px] font-bold text-[#1e293b] dark:text-white">{patient.name}</h2>
              <span className="px-2 py-0.5 bg-amber-50 dark:bg-amber-500/10 text-amber-600 text-[10px] font-bold rounded-[5px] border border-amber-200/50 dark:border-amber-500/20">
                {patient.status}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-[13px] font-medium text-muted-foreground">
              <span>{patient.ageGender}</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                Token: <span className="font-bold text-foreground">{patient.token}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                <History className="w-3.5 h-3.5" /> Waiting since {patient.waitingSince}
              </span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setShowHistory(true)}
          className="h-10 px-4 bg-white dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 text-foreground rounded-[5px] text-[13px] font-bold flex items-center gap-2 hover:bg-muted transition-all shadow-none outline-none w-full md:w-auto justify-center"
        >
          <History className="w-4 h-4" /> View History
        </button>
      </div>


      {/* ── Vitals Grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-[20px]">
        {[
          { label: "BLOOD PRESSURE", value: "120/80", unit: "mmHg", icon: Activity, color: "text-emerald-500", bgColor: "bg-emerald-50 dark:bg-emerald-500/10" },
          { label: "HEART RATE", value: "84", unit: "bpm", icon: Heart, color: "text-rose-500", bgColor: "bg-rose-50 dark:bg-rose-500/10" },
          { label: "TEMPERATURE", value: "98.6", unit: "°F", icon: Thermometer, color: "text-blue-500", bgColor: "bg-blue-50 dark:bg-blue-500/10" },
          { label: "SPO2", value: "98", unit: "%", icon: Wind, color: "text-cyan-500", bgColor: "bg-cyan-50 dark:bg-cyan-500/10" },
          { label: "WEIGHT", value: "64", unit: "kg", icon: Scale, color: "text-indigo-500", bgColor: "bg-indigo-50 dark:bg-indigo-500/10" },
        ].map((v, i) => (
          <div key={i} className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 p-5 rounded-[5px] shadow-none flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{v.label}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-[20px] font-bold text-foreground leading-none">{v.value}</span>
                <span className="text-[11px] font-medium text-muted-foreground">{v.unit}</span>
              </div>
            </div>
            <div className={cn("p-2 rounded-[5px]", v.bgColor)}>
              <v.icon className={cn("w-5 h-5", v.color)} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Consultation Content ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[20px]">
        
        {/* Left Column: Clinical Notes & Investigations */}
        <div className="lg:col-span-5 flex flex-col gap-[20px]">
          <div className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] shadow-none flex flex-col">
            <div className="p-5 border-b border-[#E7E8EB] dark:border-white/5">
              <h3 className="text-[15px] font-bold text-foreground">Clinical Notes</h3>
            </div>
            <div className="p-5 space-y-6">
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-muted-foreground">Chief Complaints</label>
                <div className="p-4 bg-[#F8F9FC] dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] text-foreground min-h-[80px]">
                  Patient complains of mild fever (100.4*F) since 2 days. Associated with dry cough and mild headache. No history of chills or rigors.
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-muted-foreground">Clinical History / Examination</label>
                <textarea 
                  placeholder="Enter details..."
                  className="w-full min-h-[100px] p-4 bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-medium text-foreground outline-none focus:border-primary transition-all resize-none"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[12px] font-bold text-muted-foreground">Diagnosis</label>
                <div className="flex flex-wrap gap-2">
                  <div className="flex-1 min-w-[200px] h-11 px-4 bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] flex items-center gap-2">
                    <Activity className="w-4 h-4 text-muted-foreground" />
                    <span className="text-[13px] font-medium">Viral Pharyngitis</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {diagnoses.map((d, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 px-3 py-1 bg-primary/5 dark:bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold rounded-[5px]">
                      <Activity className="w-3 h-3" />
                      {d}
                      <button onClick={() => removeDiagnosis(d)} className="ml-1 hover:text-primary/70 transition-colors"><X className="w-3 h-3" /></button>
                    </div>
                  ))}
                  <button className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 dark:bg-white/5 border border-[#E7E8EB] dark:border-white/10 text-muted-foreground text-[11px] font-bold rounded-[5px] hover:bg-muted transition-all">
                    <Plus className="w-3 h-3" /> Add another
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] shadow-none flex flex-col">
            <div className="p-5 border-b border-[#E7E8EB] dark:border-white/5">
              <h3 className="text-[15px] font-bold text-foreground">Lab Investigations</h3>
            </div>
            <div className="p-5 space-y-4">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search and add lab tests..." 
                  className="w-full h-11 pl-10 pr-10 bg-white dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-medium outline-none focus:border-primary transition-all shadow-none"
                />
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex flex-wrap gap-2">
                {labTests.map((t, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-white/5 border border-[#E7E8EB] dark:border-white/10 text-foreground text-[11px] font-bold rounded-[5px]">
                    {t}
                    <button onClick={() => removeLabTest(t)}><X className="w-3 h-3" /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Prescription & Follow-up */}
        <div className="lg:col-span-7 flex flex-col gap-[20px]">
          <div className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] shadow-none flex flex-col h-full">
            <div className="p-5 border-b border-[#E7E8EB] dark:border-white/5">
              <h3 className="text-[15px] font-bold text-foreground">Prescription</h3>
            </div>
            <div className="p-5 space-y-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F8F9FC] dark:bg-white/[0.02] border-b border-[#E7E8EB] dark:border-white/10 uppercase tracking-wider text-[10px] font-bold text-muted-foreground">
                      <th className="px-4 py-3">Medicine</th>
                      <th className="px-4 py-3">Dosage</th>
                      <th className="px-4 py-3">Timing</th>
                      <th className="px-4 py-3">Duration</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7E8EB] dark:divide-white/5">
                    {medicines.map((m) => (
                      <tr key={m.id} className="text-[13px] font-medium text-foreground">
                        <td className="px-4 py-4">{m.name}</td>
                        <td className="px-4 py-4">{m.dosage}</td>
                        <td className="px-4 py-4">{m.timing}</td>
                        <td className="px-4 py-4">{m.duration}</td>
                        <td className="px-4 py-4 text-right">
                          <button onClick={() => removeMedicine(m.id)} className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-500 rounded transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <button 
                onClick={() => setShowAddMedicine(true)}
                className="w-full h-12 border-2 border-dashed border-[#E7E8EB] dark:border-white/10 rounded-[5px] flex items-center justify-center gap-2 text-[13px] font-bold text-muted-foreground hover:bg-[#F8F9FC] dark:hover:bg-white/5 transition-all"
              >
                <Plus className="w-4 h-4" /> Add Medicine
              </button>

              <div className="space-y-2">
                <label className="text-[12px] font-bold text-muted-foreground">Advice / Instructions</label>
                <div className="p-4 bg-[#F8F9FC] dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] text-foreground min-h-[80px]">
                  Drink plenty of warm fluids. Rest for 2 days. Review after 3 days if symptoms persist.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px] pt-2">
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-muted-foreground">Follow-up</label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <CustomSelect 
                      placeholder="Select duration"
                      value="3days"
                      onChange={() => {}}
                      minWidth="100%"
                      className="pl-10"
                      options={[{ label: "After 3 Days", value: "3days" }]}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-muted-foreground">Referral (Optional)</label>
                  <div className="relative">
                    <UserPlus className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                      type="text" 
                      placeholder="Search doctor or department..."
                      className="w-full h-11 pl-10 pr-4 bg-white dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-medium outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Add Medicine Modal ── */}
      {showAddMedicine && (
        <AddMedicineModal 
          onClose={() => setShowAddMedicine(false)} 
          onAdd={addMedicine}
        />
      )}

      {showHistory && (
        <PatientHistoryDrawer onClose={() => setShowHistory(false)} />
      )}
      
      {showCallNext && <CallNextModal onClose={() => setShowCallNext(false)} />}
    </div>
  );
}

// --- CALL NEXT MODAL ---
function CallNextModal({ onClose }) {
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 300);
  };

  useEffect(() => {
    setMounted(true);
    const handleEsc = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleEsc);

    // Scroll lock
    const originalStyle = window.getComputedStyle(document.body).overflow;
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    const originalPadding = window.getComputedStyle(document.body).paddingRight;
    
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollBarWidth}px`;

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = originalStyle;
      document.body.style.paddingRight = originalPadding;
    };
  }, []);

  if (!mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className={cn(
          "absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300",
          closing ? "animate-out fade-out" : "animate-in fade-in"
        )}
        onClick={handleClose}
      />
      
      {/* Modal Container */}
      <div className={cn(
        "relative bg-white dark:bg-[#101935] w-full max-w-[440px] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 flex flex-col p-8 items-center text-center duration-300 shadow-none z-10",
        closing ? "animate-out zoom-out-95 fade-out" : "animate-in zoom-in-95 fade-in"
      )}>
        {/* Bell Icon with Badge */}
        <div className="relative mb-6">
          <div className="w-16 h-16 bg-[#F8F9FC] dark:bg-white/5 rounded-full flex items-center justify-center">
            <Bell className="w-8 h-8 text-[#2D3A8C] dark:text-white" />
          </div>
          <div className="absolute top-0 right-0 w-4 h-4 bg-rose-500 border-2 border-white dark:border-[#101935] rounded-full" />
        </div>

        {/* Text Content */}
        <h2 className="text-[20px] font-bold text-foreground mb-3">Call Next Patient?</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-8 px-4 text-center">
          This will mark the current consultation <span className="font-bold text-foreground">(T-03: Elena Rodriguez)</span> as completed and call the next patient in queue <span className="font-bold text-foreground">(T-04: James Wilson)</span>.
        </p>

        {/* Actions */}
        <div className="flex items-center gap-4 w-full">
          <button 
            onClick={handleClose}
            className="flex-1 h-11 border border-[#E7E8EB] dark:border-white/10 bg-white dark:bg-transparent text-foreground rounded-[5px] text-[13px] font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-all outline-none"
          >
            Cancel
          </button>
          <button 
            onClick={handleClose}
            className="flex-1 h-11 bg-[#2D3A8C] hover:opacity-95 text-white rounded-[5px] text-[13px] font-bold flex items-center justify-center gap-2 transition-all shadow-none outline-none"
          >
            <Bell className="w-4 h-4" />
            Call Next
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
