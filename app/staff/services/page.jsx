"use client";

import React, { useState, useEffect } from "react";
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
  Phone,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
          className="h-11 px-4 bg-card border border-border rounded-lg text-[13px] font-medium text-foreground flex items-center justify-between gap-3 hover:bg-muted transition-all outline-none w-full sm:w-auto shadow-none"
          style={{ minWidth }}
        >
          <span className="truncate flex-1 text-left font-medium">
            {selected ? selected.label : placeholder}
          </span>
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px] border border-border bg-card rounded-lg p-1 z-[500] shadow-none">
        <DropdownMenuItem
          onClick={() => onChange("")}
          className={cn("rounded-lg text-[13px] font-medium px-3 py-2.5 cursor-pointer", !value ? "bg-accent text-accent-foreground font-semibold" : "text-foreground hover:bg-muted")}
        >
          All
        </DropdownMenuItem>
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn("rounded-lg text-[13px] font-medium px-3 py-2.5 cursor-pointer flex items-center justify-between", value === opt.value ? "bg-accent text-accent-foreground font-semibold" : "text-foreground hover:bg-muted")}
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
  Urgent: "bg-destructive/10 text-destructive border border-destructive/20 font-medium text-[11px] px-2.5 py-0.5 rounded-lg inline-flex shadow-none",
  Normal: "bg-muted text-muted-foreground border border-border font-medium text-[11px] px-2.5 py-0.5 rounded-lg inline-flex shadow-none",
}[p] ?? "bg-muted text-muted-foreground border border-border rounded-lg font-medium text-[11px] px-2.5 py-0.5 inline-flex shadow-none");

const statusBadge = (s) => ({
  Pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-lg font-medium px-2.5 py-0.5 text-[11px] inline-flex shadow-none",
  Accepted: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-lg font-medium px-2.5 py-0.5 text-[11px] inline-flex shadow-none",
  Completed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-lg font-medium px-2.5 py-0.5 text-[11px] inline-flex shadow-none",
}[s] ?? "bg-muted text-muted-foreground border border-border rounded-lg font-medium px-2.5 py-0.5 text-[11px] inline-flex shadow-none");



const DEPARTMENTS = ["Laboratory", "Radiology", "Facilities", "Therapy", "Blood Bank"];

// Modal Popup for Adding Service Request
function NewRequestModal({ onClose, onSave, patientsList = [] }) {
  const [patientSearch, setPatientSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientOpen, setPatientOpen] = useState(false);
  const [requestType, setRequestType] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [dept, setDept] = useState("Laboratory");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const filteredPatients = patientsList.filter((p) =>
    p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
    p.bed.toLowerCase().includes(patientSearch.toLowerCase())
  );

  const handleSave = () => {
    if (!selectedPatient || !requestType) return;
    onSave({
      patientId: selectedPatient.id || crypto.randomUUID(),
      patientName: selectedPatient.name,
      bed: selectedPatient.bed,
      requestType,
      requestDescription: description,
      priority,
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
        className="absolute inset-0 bg-black/60 backdrop-blur-[6px]"
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 16 }}
        className="relative bg-card w-full max-w-[500px] rounded-lg border border-border overflow-hidden shadow-none flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0 bg-card">
          <h2 className="text-[16px] font-bold text-foreground">Create New Request</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 space-y-5 overflow-y-auto flex-1 no-scrollbar bg-card">
          {/* Patient */}
          <div>
            <label className="block text-[12px] font-bold text-muted-foreground mb-2 uppercase tracking-wide">
              Select Patient <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setPatientOpen(!patientOpen)}
                className="w-full h-11 px-4 bg-muted border border-border rounded-lg text-[13px] font-medium text-left flex items-center justify-between outline-none transition-all shadow-none"
              >
                <span className={selectedPatient ? "text-foreground font-semibold" : "text-muted-foreground"}>
                  {selectedPatient ? `${selectedPatient.name} — Bed ${selectedPatient.bed}` : "Search by name or bed..."}
                </span>
                <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
              </button>
              {patientOpen && (
                <div className="absolute top-12 left-0 right-0 z-50 bg-card border border-border rounded-lg overflow-hidden shadow-none">
                  <div className="p-2 border-b border-border">
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search by name or bed..."
                      value={patientSearch}
                      onChange={(e) => setPatientSearch(e.target.value)}
                      className="w-full h-9 px-3 bg-muted border border-border rounded-lg text-[13px] outline-none shadow-none text-foreground"
                    />
                  </div>
                  <div className="max-h-[160px] overflow-y-auto no-scrollbar">
                    {filteredPatients.map((p) => (
                      <button
                        key={p.id}
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
            <label className="block text-[12px] font-bold text-muted-foreground mb-2 uppercase tracking-wide">
              Request Title / Type <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={requestType}
              onChange={(e) => setRequestType(e.target.value)}
              placeholder="e.g. Lab Pickup, X-ray, Housekeeping"
              className="w-full h-11 px-4 bg-muted border border-border rounded-lg text-[13px] font-medium text-foreground outline-none transition-all shadow-none"
            />
          </div>

          {/* Specific Details */}
          <div>
            <label className="block text-[12px] font-bold text-muted-foreground mb-2 uppercase tracking-wide">
              Details
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. CBC Blood Sample, Post-op mobility"
              rows={2}
              className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-[13px] font-medium text-foreground outline-none transition-all resize-none shadow-none"
            />
          </div>

          {/* Assigned Dept + Priority */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-[12px] font-bold text-muted-foreground mb-2 uppercase tracking-wide">
                Assigned Dept
              </label>
              <div className="relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="w-full h-11 px-4 bg-muted border border-border rounded-lg text-[13px] font-medium text-left flex items-center justify-between outline-none transition-all shadow-none text-foreground cursor-pointer"
                    >
                      <span className="truncate">{dept}</span>
                      <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[180px] border border-border bg-card rounded-lg p-1 z-[1100] shadow-none">
                    {DEPARTMENTS.map((d) => (
                      <DropdownMenuItem
                        key={d}
                        onClick={() => setDept(d)}
                        className={cn(
                          "rounded-lg text-[13px] font-medium px-3 py-2.5 cursor-pointer text-foreground hover:bg-muted",
                          dept === d && "bg-accent text-accent-foreground font-semibold"
                        )}
                      >
                        {d}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-muted-foreground mb-2 uppercase tracking-wide">
                Priority
              </label>
              <div className="relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="w-full h-11 px-4 bg-muted border border-border rounded-lg text-[13px] font-medium text-left flex items-center justify-between outline-none transition-all shadow-none text-foreground cursor-pointer"
                    >
                      <span>{priority}</span>
                      <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[180px] border border-border bg-card rounded-lg p-1 z-[1100] shadow-none">
                    {["Normal", "Urgent"].map((p) => (
                      <DropdownMenuItem
                        key={p}
                        onClick={() => setPriority(p)}
                        className={cn(
                          "rounded-lg text-[13px] font-medium px-3 py-2.5 cursor-pointer text-foreground hover:bg-muted",
                          priority === p && "bg-accent text-accent-foreground font-semibold"
                        )}
                      >
                        {p}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-border bg-muted/30 shrink-0">
          <button
            onClick={onClose}
            className="h-10 px-4 border border-border hover:bg-muted text-foreground rounded-lg text-[13px] font-semibold transition-all shadow-none bg-card"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="h-10 px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-[13px] font-bold flex items-center justify-center transition-all shadow-none"
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

  const shortId = `#SR-${item.id.slice(0, 6).toUpperCase()}`;
  const isPending = item.status === "Pending";
  const isAccepted = item.status === "Accepted";
  const isCompleted = item.status === "Completed";
  
  let bannerTitle = "Awaiting acceptance";
  let bannerDetail = "The department will accept and dispatch personnel shortly.";
  let estTime = "N/A";
  if (isAccepted) {
    bannerTitle = "Technician is on the way";
    bannerDetail = "Expected arrival in approx. 5 minutes";
    estTime = "5 Min";
  } else if (isCompleted) {
    bannerTitle = "Request Completed";
    bannerDetail = "The requested service has been successfully completed.";
    estTime = "0 Min";
  }

  const personnelName = isPending ? "Unassigned" : "Alex Turner";
  const personnelRole = isPending ? "Awaiting assignment" : `Senior ${item.dept} Specialist`;
  const personnelInitials = isPending ? "--" : "AT";

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-[6px]"
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 16 }}
        className="relative bg-card w-full max-w-[720px] rounded-lg border border-border overflow-hidden shadow-none flex flex-col max-h-[90vh] "
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0 bg-card">
          <div className="flex items-center gap-3">
            <h2 className="text-[16px] md:text-[18px] font-bold text-foreground">
              Live Tracking: {shortId}
            </h2>
            <span className={cn(
              "rounded-lg px-2 py-0.5 text-[10px] font-bold leading-tight border",
              isPending && "bg-amber-500/10 text-amber-600 border-amber-500/20",
              isAccepted && "bg-blue-500/10 text-blue-600 border-blue-500/20",
              isCompleted && "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
            )}>
              {item.status}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => alert("Tracking status refreshed.")}
              className="h-9 px-3.5 border border-border hover:bg-muted text-foreground rounded-lg text-[12px] font-bold flex items-center justify-center gap-2 transition-all bg-card shadow-none outline-none "
            >
              <RefreshCw className="w-3.5 h-3.5 text-foreground shrink-0" />
              <span>Refresh Status</span>
            </button>
            <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg transition-all ">
              <X className="w-4.5 h-4.5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-5 space-y-5 overflow-y-auto flex-1 no-scrollbar bg-card">
          {/* Status Banner */}
          <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg flex items-center justify-between shadow-none ">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-primary leading-tight">
                  {bannerTitle}
                </h4>
                <p className="text-[12px] font-medium text-primary/80 mt-0.5 leading-tight">
                  {bannerDetail}
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[20px] font-bold text-primary leading-none">
                {estTime}
              </p>
              <p className="text-[9px] font-black text-primary/60 uppercase tracking-wider mt-1 ">
                Est. Time
              </p>
            </div>
          </div>

          {/* Details & Timeline Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
            {/* Left: Timeline */}
            <div className="flex flex-col space-y-4">
              <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none ">
                Status Timeline
              </h4>

              <div className="relative flex flex-col space-y-5 pl-2 ">
                {/* Timeline background vertical connector */}
                <div className="absolute top-3 bottom-4 left-5 w-[1.5px] bg-border z-0" />

                {/* Point 1 */}
                <div className="relative flex items-start gap-4 z-10 ">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 border border-emerald-600 flex items-center justify-center shrink-0 text-white">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-[13px] font-bold text-foreground leading-tight">Request Created</h5>
                    <p className="text-[11px] text-muted-foreground font-bold mt-1 leading-none ">
                      {item.time || "Today"} • Staff
                    </p>
                  </div>
                </div>

                {/* Point 2 */}
                <div className="relative flex items-start gap-4 z-10 " style={{ opacity: isPending ? 0.5 : 1 }}>
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-white",
                    (isAccepted || isCompleted) ? "bg-emerald-500 border border-emerald-600" : "bg-card border border-border text-muted-foreground"
                  )}>
                    {(isAccepted || isCompleted) ? <Check className="w-3.5 h-3.5" /> : <div className="w-2 h-2 bg-transparent rounded-full" />}
                  </div>
                  <div>
                    <h5 className="text-[13px] font-bold text-foreground leading-tight">Accepted by Dept</h5>
                    <p className="text-[11px] text-muted-foreground font-bold mt-1 leading-none ">
                      {(isAccepted || isCompleted) ? `${item.time || "Today"} • Central ${item.dept}` : "Pending..."}
                    </p>
                  </div>
                </div>

                {/* Point 3 */}
                <div className="relative flex items-start gap-4 z-10 " style={{ opacity: isPending ? 0.5 : 1 }}>
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center shrink-0",
                    isCompleted ? "bg-emerald-500 border border-emerald-600 text-white" : isAccepted ? "bg-card border-2 border-primary" : "bg-card border border-border"
                  )}>
                    {isCompleted ? <Check className="w-3.5 h-3.5 text-white" /> : isAccepted ? <div className="w-2.5 h-2.5 bg-primary rounded-full" /> : <div className="w-2 h-2 bg-transparent rounded-full" />}
                  </div>
                  <div>
                    <h5 className={cn("text-[13px] font-bold leading-tight", isAccepted ? "text-primary" : "text-foreground")}>In Transit to Ward</h5>
                    <p className="text-[12px] font-bold text-foreground mt-1 leading-tight ">
                      {isAccepted ? `Currently moving to Bed ${item.bed}` : isCompleted ? "Arrived at destination" : "Pending..."}
                    </p>
                    <p className="text-[11px] text-muted-foreground font-bold mt-1 leading-none ">
                      {(isAccepted || isCompleted) ? `${item.time || "Today"} • ${personnelName}` : "Pending..."}
                    </p>
                  </div>
                </div>

                {/* Point 4 */}
                <div className="relative flex items-start gap-4 z-10 " style={{ opacity: isCompleted ? 1 : 0.5 }}>
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center shrink-0",
                    isCompleted ? "bg-emerald-500 border border-emerald-600 text-white" : "bg-card border border-border"
                  )}>
                    {isCompleted ? <Check className="w-3.5 h-3.5" /> : <div className="w-2 h-2 bg-transparent rounded-full" />}
                  </div>
                  <div>
                    <h5 className="text-[13px] font-bold text-foreground leading-tight">Request Completed</h5>
                    <p className="text-[11px] text-muted-foreground font-bold mt-1 leading-none ">
                      {isCompleted ? `${item.time || "Today"} • Done` : "Pending..."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Assigned Personnel & Location Details */}
            <div className="flex flex-col space-y-5 ">
              {/* Assigned Personnel */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none ">
                  Assigned Personnel
                </h4>
                <div className="p-4 bg-card border border-border rounded-lg flex items-center justify-between shadow-none ">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center text-[12px] font-black text-foreground shrink-0 ">
                      {personnelInitials}
                    </div>
                    <div>
                      <h5 className="text-[13px] font-bold text-foreground leading-tight ">
                        {personnelName}
                      </h5>
                      <p className="text-[11px] text-muted-foreground font-medium mt-1 leading-none ">
                        {personnelRole}
                      </p>
                    </div>
                  </div>
                  {!isPending && (
                    <button
                      onClick={() => alert("Calling personnel...")}
                      className="h-8 px-3.5 border border-border hover:bg-muted text-foreground rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 bg-card transition-all shadow-none  outline-none"
                    >
                      <Phone className="w-3.5 h-3.5 text-foreground shrink-0" />
                      <span>Connect</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Location Details */}
              <div className="space-y-3 ">
                <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none ">
                  Location Details
                </h4>
                <div className="p-4 bg-card border border-border rounded-lg flex flex-col space-y-4 shadow-none ">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-primary mt-1 shrink-0 " />
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground leading-tight uppercase ">
                        Destination
                      </p>
                      <p className="text-[13px] font-bold text-foreground mt-1 leading-tight ">
                        Bed {item.bed}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 pt-4 border-t border-border">
                    <Building className="w-4 h-4 text-primary mt-1 shrink-0 " />
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground leading-tight uppercase ">
                        Origin
                      </p>
                      <p className="text-[13px] font-bold text-foreground mt-1 leading-tight ">
                        Central {item.dept}
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
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patientsList, setPatientsList] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [trackingItem, setTrackingItem] = useState(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authtoken");
      const res = await fetch("/api/services", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const result = await res.json();
        if (result.success && Array.isArray(result.data)) {
          const mapped = result.data.map(item => {
            const createdDate = new Date(item.createdAt);
            const timeString = createdDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return {
              ...item,
              time: timeString
            };
          });
          setServices(mapped);
        }
      }
    } catch (err) {
      console.error("Error loading services", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientsList = async () => {
    try {
      const token = localStorage.getItem("authtoken");
      const res = await fetch("/api/patients", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const result = await res.json();
        const patientsArray = Array.isArray(result)
          ? result
          : (result.success && Array.isArray(result.data))
            ? result.data
            : [];

        const mapped = patientsArray.map(p => {
          const name = p.name || [p.firstName, p.lastName].filter(Boolean).join(" ") || "Patient";
          const admission = p.admissions?.[0] || {};
          const bedLabel = admission.bed?.label || p.bedNo || "N/A";
          return {
            id: p.id,
            name,
            bed: bedLabel
          };
        });
        setPatientsList(mapped);
      }
    } catch (err) {
      console.error("Error loading patients in services page", err);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchPatientsList();
  }, []);

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
      (item.requestDescription && item.requestDescription.toLowerCase().includes(s));
    const matchDept = !deptFilter || item.dept === deptFilter;
    const matchStatus = !statusFilter || item.status === statusFilter;
    return matchSearch && matchDept && matchStatus;
  });

  const handleAddRequest = async (newRequest) => {
    try {
      const token = localStorage.getItem("authtoken");
      const res = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newRequest)
      });
      if (res.ok) {
        toast.success("Service request created successfully!");
        fetchServices();
      } else {
        toast.error("Failed to create service request.");
      }
    } catch (err) {
      console.error("Error creating request", err);
      toast.error("Error creating request.");
    }
  };

  const updateStatus = async (id, nextStatus) => {
    try {
      const token = localStorage.getItem("authtoken");
      const res = await fetch(`/api/services/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        setServices((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: nextStatus } : item))
        );
      }
    } catch (err) {
      console.error("Error updating status", err);
    }
  };

  if (loading) {
    return (
      <div className="p-5 bg-background min-h-screen flex flex-col items-center justify-center font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
        <span className="text-[13px] font-bold text-muted-foreground font-semibold">Loading service requests...</span>
      </div>
    );
  }

  return (
    <div className="p-5 bg-background min-h-screen flex flex-col space-y-5 transition-colors duration-300 font-sans pb-20 ">
      
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h1 className="text-[20px] font-bold text-foreground tracking-tight leading-none">
          Service Request
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground h-11 px-5 rounded-lg text-[13px] font-bold flex items-center justify-center gap-2 transition-all w-full sm:w-auto shadow-none"
        >
          <Plus className="w-4.5 h-4.5" /> New Request
        </button>
      </div>

      {/* ── Main Content Area (Filter + List) ── */}
      <div className="space-y-5">
        {/* ── Filter Bar ── */}
        <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-4 bg-card p-3 border border-border rounded-lg shadow-none">
          <div className="relative w-full xl:w-[380px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full h-11 pl-11 pr-4 bg-muted border border-border rounded-lg text-[13px] font-medium focus:border-primary transition-all outline-none text-foreground placeholder:text-muted-foreground shadow-none"
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
              className="bg-card p-5 rounded-lg border border-border shadow-none"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-[15px] font-bold text-foreground leading-tight">
                    {item.patientName}
                  </p>
                  <p className="text-[11px] text-primary font-bold mt-0.5">
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
              <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
                <div className="flex items-center gap-3">
                  <span className={priorityBadge(item.priority)}>{item.priority}</span>
                  <span className="text-muted-foreground text-[12px] font-medium">
                    {item.time}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => router.push(`/staff/services/${item.id}`)}
                    className="p-2 hover:bg-muted rounded-lg border border-border flex items-center justify-center transition-all text-foreground shadow-none bg-card"
                    title="View details"
                  >
                    <Eye className="w-4 h-4 text-foreground shrink-0" />
                  </button>
                  <button
                    onClick={() => setTrackingItem(item)}
                    className="p-2 hover:bg-muted rounded-lg transition-all flex items-center gap-1 bg-card border border-border text-[12px] font-medium shadow-none "
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
            <div className="bg-card border border-border rounded-lg p-10 text-center text-muted-foreground font-medium italic text-[13px]">
              No service requests found.
            </div>
          )}
        </div>

        {/* ── Desktop Table View ── */}
        <div className="hidden md:block bg-card rounded-lg border border-border overflow-hidden shadow-none">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted/30">
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
                        "px-6 py-4 text-[11px] font-bold text-muted-foreground border-b border-border text-left uppercase tracking-widest",
                        i === 6 && "text-right"
                      )}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-all group ">
                    <td className="px-6 py-4">
                      <div className="text-[14px] font-bold text-foreground leading-tight">
                        {item.patientName}
                      </div>
                      <div className="text-[11px] font-bold text-primary mt-1">
                        {item.bed}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[14px] font-bold text-foreground leading-tight">
                        {item.requestType}
                      </div>
                      <div className="text-[12px] text-muted-foreground font-medium mt-0.5 truncate max-w-[200px]">
                        {item.requestDescription}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={priorityBadge(item.priority)}>{item.priority}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[13px] font-medium text-muted-foreground">
                        {item.time}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[13px] font-medium text-foreground">
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
                          className="p-2 hover:bg-muted rounded-lg transition-all text-foreground shadow-none"
                          title="View details"
                        >
                          <Eye className="w-4.5 h-4.5" />
                        </button>
                        <button
                          onClick={() => setTrackingItem(item)}
                          className="h-8 px-3 hover:bg-primary/10 rounded-lg transition-all flex items-center gap-1.5 text-primary text-[12px] font-bold shadow-none"
                        >
                          <Sparkles className="w-4 h-4 shrink-0" />
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
          <NewRequestModal onClose={() => setShowModal(false)} onSave={handleAddRequest} patientsList={patientsList} />
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
