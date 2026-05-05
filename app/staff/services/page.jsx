"use client";

import React, { useState } from "react";
import {
  Search,
  Plus,
  Eye,
  Check,
  X,
  ChevronDown,
  Clock,
  Sparkles,
  Activity,
  Filter,
  MessageSquare,
  Phone
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// --- Custom dropdown components to follow specific aesthetics
function CustomSelect({ value, onChange, options, placeholder, minWidth = "130px" }) {
  const selected = options.find((o) => o.value === value);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="h-11 px-4 bg-white dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-medium text-foreground flex items-center justify-between gap-3 hover:bg-muted transition-all outline-none w-full sm:w-auto shadow-none"
          style={{ minWidth }}
        >
          <span className="truncate flex-1 text-left font-medium">
            {selected ? selected.label : placeholder}
          </span>
          <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px] border border-[#E7E8EB] dark:border-white/10 bg-white dark:bg-[#101935] rounded-[5px] p-1 z-[500] shadow-none">
        <DropdownMenuItem
          onClick={() => onChange("")}
          className={cn("rounded-[5px] text-[13px] font-medium px-3 py-2.5 cursor-pointer", !value ? "bg-accent text-accent-foreground font-semibold" : "text-foreground hover:bg-muted")}
        >
          All
        </DropdownMenuItem>
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn("rounded-[5px] text-[13px] font-medium px-3 py-2.5 cursor-pointer flex items-center justify-between", value === opt.value ? "bg-accent text-accent-foreground font-semibold" : "text-foreground hover:bg-muted")}
          >
            {opt.label}
            {value === opt.value && <Check className="w-3.5 h-3.5 text-foreground" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Badge color helpers
const priorityBadge = (p) => ({
  Urgent: "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 font-medium text-[11px] px-2.5 py-0.5 rounded-[5px] inline-flex shadow-none",
  Normal: "bg-muted text-muted-foreground border border-border font-medium text-[11px] px-2.5 py-0.5 rounded-[5px] inline-flex shadow-none",
}[p] ?? "bg-muted text-muted-foreground border border-border rounded-[5px] font-medium text-[11px] px-2.5 py-0.5 inline-flex shadow-none");

const statusBadge = (s) => ({
  Pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-[5px] font-medium px-2.5 py-0.5 text-[11px] inline-flex shadow-none",
  Accepted: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-[5px] font-medium px-2.5 py-0.5 text-[11px] inline-flex shadow-none",
  Completed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-[5px] font-medium px-2.5 py-0.5 text-[11px] inline-flex shadow-none",
}[s] ?? "bg-muted text-muted-foreground border border-border rounded-[5px] font-medium px-2.5 py-0.5 text-[11px] inline-flex shadow-none");

// Predefined mock patients to add new request
const MOCK_PATIENTS = [
  { name: "John Smith", bed: "W1-B12" },
  { name: "Sarah Jenkins", bed: "W3-B04" },
  { name: "Michael Chang", bed: "W1-B08" },
  { name: "Emma Davis", bed: "W2-B22" },
  { name: "Robert Wilson", bed: "ICU-02" },
  { name: "Rajesh Kumar", bed: "ICU-04" },
  { name: "Maria Lopez", bed: "ICU-01" },
  { name: "Carlos Vega", bed: "ICU-05" },
];

const DEPARTMENTS = ["Laboratory", "Radiology", "Facilities", "Therapy", "Blood Bank"];

// Modal Popup for Adding Service Request
function NewRequestModal({ onClose, onSave }) {
  const [patientSearch, setPatientSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientOpen, setPatientOpen] = useState(false);
  const [requestType, setRequestType] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [dept, setDept] = useState("Laboratory");
  const [deptOpen, setDeptOpen] = useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const filteredPatients = MOCK_PATIENTS.filter((p) =>
    p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
    p.bed.toLowerCase().includes(patientSearch.toLowerCase())
  );

  const handleSave = () => {
    if (!selectedPatient || !requestType) return;
    onSave({
      patientName: selectedPatient.name,
      bed: selectedPatient.bed,
      requestType,
      requestDescription: description,
      priority,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dept,
      status: "Pending",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[4px]"
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 16 }}
        className="relative bg-white dark:bg-[#101935] w-full max-w-[500px] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 overflow-hidden shadow-none flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E7E8EB] dark:border-white/10 shrink-0 bg-white dark:bg-[#101935]">
          <h2 className="text-[16px] font-bold text-foreground">Create New Request</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-[5px] transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 space-y-5 overflow-y-auto flex-1 no-scrollbar bg-white dark:bg-[#101935]">
          {/* Patient */}
          <div>
            <label className="block text-[12px] font-bold text-muted-foreground mb-2">
              Select Patient <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setPatientOpen(!patientOpen)}
                className="w-full h-11 px-4 bg-[#F8F9FC] dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-medium text-left flex items-center justify-between outline-none transition-all shadow-none"
              >
                <span className={selectedPatient ? "text-foreground font-semibold" : "text-muted-foreground"}>
                  {selectedPatient ? `${selectedPatient.name} — Bed ${selectedPatient.bed}` : "Search by name or bed..."}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
              </button>
              {patientOpen && (
                <div className="absolute top-12 left-0 right-0 z-50 bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] overflow-hidden shadow-none">
                  <div className="p-2 border-b border-[#E7E8EB] dark:border-white/10">
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search by name or bed..."
                      value={patientSearch}
                      onChange={(e) => setPatientSearch(e.target.value)}
                      className="w-full h-9 px-3 bg-[#F8F9FC] dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] outline-none shadow-none text-foreground"
                    />
                  </div>
                  <div className="max-h-[160px] overflow-y-auto no-scrollbar">
                    {filteredPatients.map((p) => (
                      <button
                        key={p.name}
                        onClick={() => { setSelectedPatient(p); setPatientOpen(false); }}
                        className="w-full px-4 py-2.5 text-left text-[13px] font-medium hover:bg-muted flex items-center justify-between"
                      >
                        <span className="text-foreground font-semibold">{p.name}</span>
                        <span className="text-[11px] text-muted-foreground font-bold">Bed {p.bed}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Request Details Title */}
          <div>
            <label className="block text-[12px] font-bold text-muted-foreground mb-2">
              Request Title / Type <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={requestType}
              onChange={(e) => setRequestType(e.target.value)}
              placeholder="e.g. Lab Pickup, X-ray, Housekeeping"
              className="w-full h-11 px-4 bg-[#F8F9FC] dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-medium text-foreground outline-none transition-all shadow-none"
            />
          </div>

          {/* Specific Details */}
          <div>
            <label className="block text-[12px] font-bold text-muted-foreground mb-2">
              Details
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. CBC Blood Sample, Post-op mobility"
              rows={2}
              className="w-full px-4 py-3 bg-[#F8F9FC] dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-medium text-foreground outline-none transition-all resize-none shadow-none"
            />
          </div>

          {/* Assigned Dept + Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-bold text-muted-foreground mb-2">
                Assigned Dept
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDeptOpen(!deptOpen)}
                  className="w-full h-11 px-4 bg-[#F8F9FC] dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-medium text-left flex items-center justify-between outline-none transition-all shadow-none text-foreground"
                >
                  <span className="truncate">{dept}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                </button>
                {deptOpen && (
                  <div className="absolute top-12 left-0 right-0 z-50 bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] overflow-hidden shadow-none">
                    {DEPARTMENTS.map((d) => (
                      <button
                        key={d}
                        onClick={() => { setDept(d); setDeptOpen(false); }}
                        className="w-full px-4 py-2.5 text-left text-[13px] font-medium hover:bg-muted text-foreground"
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-muted-foreground mb-2">
                Priority
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setPriorityOpen(!priorityOpen)}
                  className="w-full h-11 px-4 bg-[#F8F9FC] dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-medium text-left flex items-center justify-between outline-none transition-all shadow-none text-foreground"
                >
                  {priority}
                  <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                </button>
                {priorityOpen && (
                  <div className="absolute top-12 left-0 right-0 z-50 bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] overflow-hidden shadow-none">
                    {["Normal", "Urgent"].map((p) => (
                      <button
                        key={p}
                        onClick={() => { setPriority(p); setPriorityOpen(false); }}
                        className="w-full px-4 py-2 text-left text-[13px] font-medium hover:bg-muted text-foreground"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-[#E7E8EB] dark:border-white/10 bg-[#F8F9FC] dark:bg-[#101935] shrink-0">
          <button
            onClick={onClose}
            className="h-10 px-4 border border-[#E7E8EB] dark:border-white/10 hover:bg-muted text-foreground rounded-[5px] text-[13px] font-semibold transition-all shadow-none bg-white dark:bg-[#101935]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="h-10 px-4 bg-primary hover:bg-primary/90 text-white rounded-[5px] text-[13px] font-bold flex items-center justify-center transition-all shadow-none"
          >
            Create Request
          </button>
        </div>
      </motion.div>
    </div>
  );
}

import { RefreshCw, Truck, MapPin, Building, ShieldCheck } from "lucide-react";

function LiveTrackingModal({ item, onClose }) {
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[4px]"
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 16 }}
        className="relative bg-white dark:bg-[#101935] w-full max-w-[720px] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 overflow-hidden shadow-none flex flex-col max-h-[90vh] "
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E7E8EB] dark:border-white/10 shrink-0 bg-white dark:bg-[#101935]">
          <div className="flex items-center gap-3">
            <h2 className="text-[16px] md:text-[18px] font-bold text-foreground">
              Live Tracking: #SR-8921
            </h2>
            <span className="bg-blue-500/10 text-blue-600 border border-blue-500/20 rounded-[5px] px-2 py-0.5 text-[10px] font-bold  leading-tight">
              In Progress
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => alert("Tracking status refreshed.")}
              className="h-9 px-3.5 border border-[#E7E8EB] dark:border-white/10 hover:bg-muted text-foreground rounded-[5px] text-[12px] font-bold flex items-center justify-center gap-2 transition-all bg-white dark:bg-[#101935] shadow-none outline-none "
            >
              <RefreshCw className="w-3.5 h-3.5 text-foreground shrink-0" />
              <span>Refresh Status</span>
            </button>
            <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-[5px] transition-all ">
              <X className="w-4.5 h-4.5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-5 space-y-5 overflow-y-auto flex-1 no-scrollbar bg-white dark:bg-[#101935]">
          {/* Light Blue Banner */}
          <div className="bg-blue-500/5 dark:bg-blue-950/20 border border-blue-500/20 dark:border-blue-500/10 p-4 rounded-[5px] flex items-center justify-between shadow-none ">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/15 border border-blue-500/20 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-blue-600 leading-tight">
                  Technician is on the way
                </h4>
                <p className="text-[12px] font-medium text-blue-700/80 dark:text-blue-300/80 mt-0.5 leading-tight">
                  Expected arrival in approx. 5 minutes
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[20px] font-bold text-blue-600 leading-none">
                5 Min
              </p>
              <p className="text-[9px] font-black text-blue-700/60 dark:text-blue-300/60 uppercase tracking-wider mt-1 ">
                Est. Time
              </p>
            </div>
          </div>

          {/* Details & Timeline Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
            {/* Left: Timeline */}
            <div className="flex flex-col space-y-4">
              <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none ">
                Status Timeline
              </h4>

              <div className="relative flex flex-col space-y-5 pl-2 ">
                {/* Timeline background vertical connector */}
                <div className="absolute top-3 bottom-4 left-5 w-[1.5px] bg-gray-100 dark:bg-white/5 z-0" />

                {/* Point 1 */}
                <div className="relative flex items-start gap-4 z-10 ">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 border border-emerald-600 flex items-center justify-center shrink-0 text-white">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-[13px] font-bold text-foreground leading-tight">Request Created</h5>
                    <p className="text-[11px] text-muted-foreground font-bold mt-1 leading-none ">
                      10:45 AM • Nurse Joy
                    </p>
                  </div>
                </div>

                {/* Point 2 */}
                <div className="relative flex items-start gap-4 z-10 ">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 border border-emerald-600 flex items-center justify-center shrink-0 text-white">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-[13px] font-bold text-foreground leading-tight">Accepted by Dept</h5>
                    <p className="text-[11px] text-muted-foreground font-bold mt-1 leading-none ">
                      10:52 AM • Central Lab
                    </p>
                  </div>
                </div>

                {/* Point 3 */}
                <div className="relative flex items-start gap-4 z-10 ">
                  <div className="w-6 h-6 rounded-full bg-white dark:bg-[#101935] border-2 border-blue-600 flex items-center justify-center shrink-0">
                    <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />
                  </div>
                  <div>
                    <h5 className="text-[13px] font-bold text-blue-600 leading-tight">In Transit to Ward</h5>
                    <p className="text-[12px] font-bold text-foreground mt-1 leading-tight ">
                      Currently moving to W1-B12
                    </p>
                    <p className="text-[11px] text-muted-foreground font-bold mt-1 leading-none ">
                      10:55 AM • Alex Turner
                    </p>
                  </div>
                </div>

                {/* Point 4 */}
                <div className="relative flex items-start gap-4 z-10  opacity-50">
                  <div className="w-6 h-6 rounded-full bg-white dark:bg-[#101935] border border-gray-200 dark:border-white/10 flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 bg-transparent rounded-full" />
                  </div>
                  <div>
                    <h5 className="text-[13px] font-bold text-foreground leading-tight">Sample Collected</h5>
                    <p className="text-[11px] text-muted-foreground font-bold mt-1 leading-none ">
                      Pending...
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Assigned Personnel & Location Details */}
            <div className="flex flex-col space-y-5 ">
              {/* Assigned Personnel */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none ">
                  Assigned Personnel
                </h4>
                <div className="p-4 bg-white dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] flex items-center justify-between shadow-none ">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center text-[12px] font-black text-foreground shrink-0 ">
                      AT
                    </div>
                    <div>
                      <h5 className="text-[13px] font-bold text-foreground leading-tight ">
                        Alex Turner
                      </h5>
                      <p className="text-[11px] text-muted-foreground font-medium mt-1 leading-none ">
                        Senior Lab Technician
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => alert("Calling personnel...")}
                    className="h-8 px-3.5 border border-[#E7E8EB] dark:border-white/10 hover:bg-muted text-foreground rounded-[5px] text-[11px] font-bold flex items-center justify-center gap-1.5 bg-white dark:bg-[#101935] transition-all shadow-none  outline-none"
                  >
                    <Phone className="w-3.5 h-3.5 text-foreground shrink-0" />
                    <span>Connect</span>
                  </button>
                </div>
              </div>

              {/* Location Details */}
              <div className="space-y-3 ">
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none ">
                  Location Details
                </h4>
                <div className="p-4 bg-white dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] flex flex-col space-y-4 shadow-none ">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-primary mt-1 shrink-0 " />
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground leading-tight uppercase ">
                        Destination
                      </p>
                      <p className="text-[13px] font-bold text-[#1e293b] dark:text-white mt-1 leading-tight ">
                        Ward 1, Bed 12 (W1-B12)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 pt-4 border-t border-[#E7E8EB] dark:border-white/10">
                    <Building className="w-4 h-4 text-primary mt-1 shrink-0 " />
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground leading-tight uppercase ">
                        Origin
                      </p>
                      <p className="text-[13px] font-bold text-[#1e293b] dark:text-white mt-1 leading-tight ">
                        Central Laboratory (Ground Floor)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Realtime Alert Subtext */}
              <div className="flex items-center gap-1.5 pt-1 text-muted-foreground ">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <p className="text-[11px] font-medium leading-none">
                  This tracking data is updated in real-time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Main Page
export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState([
    {
      id: 1,
      patientName: "John Smith",
      bed: "W1-B12",
      requestType: "Lab Pickup",
      requestDescription: "CBC Blood Sample",
      priority: "Normal",
      time: "10:45 AM",
      dept: "Laboratory",
      status: "Pending"
    },
    {
      id: 2,
      patientName: "Sarah Jenkins",
      bed: "W3-B04",
      requestType: "X-ray",
      requestDescription: "Chest PA view",
      priority: "Urgent",
      time: "10:30 AM",
      dept: "Radiology",
      status: "Accepted"
    },
    {
      id: 3,
      patientName: "Michael Chang",
      bed: "W1-B08",
      requestType: "Housekeeping",
      requestDescription: "Bed spill cleanup",
      priority: "Urgent",
      time: "10:15 AM",
      dept: "Facilities",
      status: "Pending"
    },
    {
      id: 4,
      patientName: "Emma Davis",
      bed: "W2-B22",
      requestType: "Physiotherapy",
      requestDescription: "Post-op mobility",
      priority: "Normal",
      time: "09:00 AM",
      dept: "Therapy",
      status: "Completed"
    },
    {
      id: 5,
      patientName: "Robert Wilson",
      bed: "ICU-02",
      requestType: "Blood Bank",
      requestDescription: "2 Units O+ PRBC",
      priority: "Urgent",
      time: "08:45 AM",
      dept: "Blood Bank",
      status: "Accepted"
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [trackingItem, setTrackingItem] = useState(null);

  const deptOptions = [
    { label: "Laboratory", value: "Laboratory" },
    { label: "Radiology", value: "Radiology" },
    { label: "Facilities", value: "Facilities" },
    { label: "Therapy", value: "Therapy" },
    { label: "Blood Bank", value: "Blood Bank" },
  ];

  const statusOptions = [
    { label: "Pending", value: "Pending" },
    { label: "Accepted", value: "Accepted" },
    { label: "Completed", value: "Completed" },
  ];

  const filtered = services.filter((item) => {
    const s = searchQuery.toLowerCase();
    const matchSearch =
      item.patientName.toLowerCase().includes(s) ||
      item.requestType.toLowerCase().includes(s) ||
      item.requestDescription.toLowerCase().includes(s);
    const matchDept = !deptFilter || item.dept === deptFilter;
    const matchStatus = !statusFilter || item.status === statusFilter;
    return matchSearch && matchDept && matchStatus;
  });

  const handleAddRequest = (newRequest) => {
    setServices((prev) => [{ id: prev.length + 1, ...newRequest }, ...prev]);
  };

  const updateStatus = (id, nextStatus) => {
    setServices((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: nextStatus } : item))
    );
  };

  return (
    <div className="p-[20px] bg-[#F8F9FC] dark:bg-[#0A0F1D] min-h-screen flex flex-col space-y-[20px] transition-colors duration-300 font-sans pb-20 ">
      
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h1 className="text-[20px] font-bold text-[#1e293b] dark:text-white tracking-tight leading-none">
          Service Request
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary hover:bg-primary/90 text-white h-11 px-5 rounded-[5px] text-[13px] font-bold flex items-center justify-center gap-2 transition-all w-full sm:w-auto shadow-none"
        >
          <Plus className="w-4.5 h-4.5" /> New Request
        </button>
      </div>

      {/* ── Main Content Area (Filter + List) ── */}
      <div className="space-y-[20px]">
        {/* ── Filter Bar ── */}
        <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-4 bg-white dark:bg-[#101935] p-3 border border-[#E7E8EB] dark:border-white/10 rounded-[5px] shadow-none">
          <div className="relative w-full xl:w-[380px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full h-11 pl-11 pr-4 bg-[#F8F9FC] dark:bg-[#1e293b] border border-gray-100 dark:border-white/10 rounded-[5px] text-[13px] font-medium focus:border-primary transition-all outline-none text-foreground placeholder:text-muted-foreground shadow-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <CustomSelect
              value={deptFilter}
              onChange={setDeptFilter}
              options={deptOptions}
              placeholder="Department"
              minWidth="140px"
            />
            <CustomSelect
              value={statusFilter}
              onChange={setStatusFilter}
              options={statusOptions}
              placeholder="Status"
              minWidth="140px"
            />
          </div>
        </div>

        {/* ── Mobile Card View ── */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-[#101935] p-5 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 shadow-none"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-[15px] font-bold text-[#1e293b] dark:text-white leading-tight">
                    {item.patientName}
                  </p>
                  <p className="text-[11px] text-blue-600 dark:text-blue-400 font-bold mt-0.5">
                    {item.bed}
                  </p>
                </div>
                <span className={cn(statusBadge(item.status))}>
                  {item.status}
                </span>
              </div>
              <p className="text-[14px] font-bold text-foreground mt-1 leading-tight">
                {item.requestType}
              </p>
              <p className="text-[12px] font-medium text-muted-foreground mt-1 leading-tight">
                {item.requestDescription}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-[#E7E8EB] dark:border-white/10 mt-4">
                <div className="flex items-center gap-3">
                  <span className={priorityBadge(item.priority)}>{item.priority}</span>
                  <span className="text-muted-foreground text-[12px] font-medium">
                    {item.time}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => router.push(`/staff/services/${item.id}`)}
                    className="p-2 hover:bg-muted rounded-[5px] border border-[#E7E8EB] dark:border-white/10 flex items-center justify-center transition-all text-foreground shadow-none bg-white dark:bg-[#1e293b]"
                    title="View details"
                  >
                    <Eye className="w-4 h-4 text-foreground shrink-0" />
                  </button>
                  <button
                    onClick={() => setTrackingItem(item)}
                    className="p-2 hover:bg-muted rounded-[5px] transition-all flex items-center gap-1 bg-white dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 text-[12px] font-medium shadow-none "
                    title="Track / Advance"
                  >
                    <Sparkles className="w-4 h-4 text-primary shrink-0" />
                    <span>Track</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] p-10 text-center text-muted-foreground font-medium italic text-[13px]">
              No service requests found.
            </div>
          )}
        </div>

        {/* ── Desktop Table View ── */}
        <div className="hidden md:block bg-white dark:bg-[#101935] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 overflow-hidden shadow-none">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#F8F9FC] dark:bg-white/[0.02]">
                  {[
                    "Patient & Bed",
                    "Request Details",
                    "Priority",
                    "Requested Time",
                    "Assigned Dept",
                    "Status",
                    "Action",
                  ].map((col, i) => (
                    <th
                      key={i}
                      className={cn(
                        "px-6 py-4 text-[11px] font-bold text-gray-400 border-b border-[#E7E8EB] dark:border-white/10 text-left uppercase tracking-widest",
                        i === 6 && "text-right"
                      )}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E8EB] dark:divide-white/5">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F8F9FC] dark:hover:bg-white/[0.01] transition-all group ">
                    <td className="px-6 py-4">
                      <div className="text-[14px] font-bold text-[#1e293b] dark:text-white leading-tight">
                        {item.patientName}
                      </div>
                      <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400 mt-1">
                        {item.bed}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[14px] font-bold text-[#1e293b] dark:text-white leading-tight">
                        {item.requestType}
                      </div>
                      <div className="text-[12px] text-gray-500 dark:text-gray-400 font-medium mt-0.5 truncate max-w-[200px]">
                        {item.requestDescription}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={priorityBadge(item.priority)}>{item.priority}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[13px] font-medium text-gray-500 dark:text-gray-400">
                        {item.time}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[14px] font-bold text-[#1e293b] dark:text-white">
                        {item.dept}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={statusBadge(item.status)}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => router.push(`/staff/services/${item.id}`)}
                          className="p-2 hover:bg-muted rounded-[5px] border border-[#E7E8EB] dark:border-white/10 flex items-center justify-center transition-all text-foreground  shadow-none bg-white dark:bg-[#1e293b]"
                          title="View details"
                        >
                          <Eye className="w-4 h-4 text-foreground shrink-0" />
                        </button>
                        <button
                          onClick={() => setTrackingItem(item)}
                          className="px-3.5 h-9 hover:bg-muted bg-white dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] flex items-center gap-1.5 transition-all text-[12px] font-medium text-foreground  shadow-none"
                          title="Track Request"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-primary" />
                          <span>Track</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-16 text-center text-[13px] font-medium text-muted-foreground italic"
                    >
                      No service requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Add New Request Modal ── */}
      <AnimatePresence>
        {showModal && (
          <NewRequestModal onClose={() => setShowModal(false)} onSave={handleAddRequest} />
        )}
      </AnimatePresence>

      {/* ── Live Tracking Modal ── */}
      <AnimatePresence>
        {trackingItem && (
          <LiveTrackingModal item={trackingItem} onClose={() => setTrackingItem(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
