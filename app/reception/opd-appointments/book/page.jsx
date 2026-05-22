"use client";

import React, { Suspense } from "react";
import {
  Search, ArrowRight, HeartPulse, Stethoscope, Bone, Ear, Smile, Brain,
  Eye, Baby, Loader2, UserPlus, CheckCircle2, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

const DEPT_ICONS = {
  Cardiology: HeartPulse, Dental: Smile, ENT: Ear, Orthopedic: Bone,
  Neurology: Brain, Ophthalmology: Eye, Pediatrics: Baby,
};
const DEFAULT_ICON = Stethoscope;

function BookAppointmentStep1Content() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientIdParam = searchParams.get("patientId");
  const API = process.env.NEXT_PUBLIC_API_URL;
  const headers = () => ({ Authorization: `Bearer ${localStorage.getItem("authtoken")}` });

  const [departments, setDepartments] = React.useState([]);
  const [deptLoading, setDeptLoading] = React.useState(true);

  const [selectedDept, setSelectedDept] = React.useState(null); // { id, name }
  const [selectedPatient, setSelectedPatient] = React.useState(null);

  const [searchInput, setSearchInput] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [patients, setPatients] = React.useState([]);
  const [searchLoading, setSearchLoading] = React.useState(false);
  const [hasSearched, setHasSearched] = React.useState(false);

  const [errors, setErrors] = React.useState({});

  // Load departments
  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/appointments/departments`, { headers: headers() });
        const json = await res.json();
        if (json.success) setDepartments(json.data);
      } catch (e) { console.error(e); }
      finally { setDeptLoading(false); }
    })();
  }, []);

  // Preselect patient if patientId is in query params
  React.useEffect(() => {
    if (!patientIdParam) return;
    (async () => {
      try {
        const res = await fetch(`${API}/patients/${patientIdParam}`, { headers: headers() });
        if (res.ok) {
          const result = await res.json();
          setSelectedPatient({
            id: result.id,
            name: `${result.firstName || ""} ${result.lastName || ""}`.trim(),
            age: result.age,
            gender: result.gender,
            contact: result.contact || result.mobile
          });
        }
      } catch (e) {
        console.error("Error fetching preselected patient:", e);
      }
    })();
  }, [patientIdParam]);

  // Debounce search input
  React.useEffect(() => {
    const t = setTimeout(() => setSearchQuery(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Search patients when query changes
  React.useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setPatients([]);
      setHasSearched(false);
      return;
    }
    (async () => {
      setSearchLoading(true);
      setHasSearched(true);
      try {
        const res = await fetch(
          `${API}/appointments/patients?q=${encodeURIComponent(searchQuery.trim())}`,
          { headers: headers() }
        );
        const json = await res.json();
        if (json.success) setPatients(json.data);
      } catch (e) { console.error(e); }
      finally { setSearchLoading(false); }
    })();
  }, [searchQuery]);

  const validate = () => {
    const e = {};
    if (!selectedDept)    e.dept    = "Please select a department.";
    if (!selectedPatient) e.patient = "Please select a patient.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    sessionStorage.setItem("appt_step1", JSON.stringify({ dept: selectedDept, patient: selectedPatient }));
    router.push("/reception/opd-appointments/book/select-doctor");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background p-5 gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-[20px] font-bold text-foreground">Book Appointment: Step 1</h1>
        <div className="flex items-center gap-2 text-[12px] font-bold text-muted-foreground">
          <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-[11px]">1</span>
          <span className="text-primary">Select</span>
          <span className="text-muted-foreground/40">›</span>
          <span className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-[11px]">2</span>
          <span>Doctor</span>
          <span className="text-muted-foreground/40">›</span>
          <span className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-[11px]">3</span>
          <span>Confirm</span>
        </div>
      </div>

      <div className="flex flex-col gap-5 w-full">

        {/* Department */}
        <div className="bg-card border border-border rounded-[5px] p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[14px] font-bold text-foreground">Select Department</h2>
            {errors.dept && <p className="text-[12px] text-red-500 font-medium">{errors.dept}</p>}
          </div>
          {deptLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-24 rounded-[5px] bg-muted animate-pulse" />
              ))}
            </div>
          ) : departments.length === 0 ? (
            <p className="text-[13px] text-muted-foreground py-6 text-center">No departments found. Please add departments in master data.</p>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {departments.map((dept) => {
                const Icon = DEPT_ICONS[dept.name] || DEFAULT_ICON;
                const isSelected = selectedDept?.id === dept.id;
                return (
                  <button
                    key={dept.id}
                    onClick={() => { setSelectedDept(dept); setErrors((e) => ({ ...e, dept: undefined })); }}
                    className={cn(
                      "flex flex-col items-center justify-center py-6 px-2 gap-2 rounded-[5px] border transition-all outline-none",
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:bg-muted/30"
                    )}
                  >
                    <Icon className={cn("w-5 h-5", isSelected ? "text-primary" : "text-muted-foreground")} />
                    <span className={cn("text-[12px] font-medium text-center", isSelected ? "text-primary font-bold" : "text-foreground/60")}>
                      {dept.name}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Patient Search */}
        <div className="bg-card border border-border rounded-[5px] p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[14px] font-bold text-foreground">Select Patient</h2>
            {errors.patient && <p className="text-[12px] text-red-500 font-medium">{errors.patient}</p>}
          </div>

          {/* Search bar */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 pointer-events-none" />
              {searchLoading && (
                <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
              )}
              <input
                type="text"
                placeholder="Search by name, phone, or patient ID..."
                className="w-full h-11 pl-11 pr-10 bg-background border border-border rounded-[5px] text-[13px] font-medium outline-none focus:border-primary transition-all"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <button
              onClick={() => router.push("/reception/patient-registration/new")}
              className="w-full sm:w-auto h-11 px-5 bg-card border border-border rounded-[5px] text-[13px] font-bold text-foreground hover:bg-muted transition-all flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" /> Register New
            </button>
          </div>

          {/* Selected patient banner */}
          {selectedPatient && (
            <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-[5px]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <p className="text-[13px] font-bold text-foreground">{selectedPatient.name}</p>
                  <p className="text-[11px] text-muted-foreground">{selectedPatient.age} yrs · {selectedPatient.gender} · {selectedPatient.contact}</p>
                </div>
              </div>
              <button onClick={() => setSelectedPatient(null)} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-muted">
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
          )}

          {/* Results */}
          {!selectedPatient && (
            <div className="space-y-2">
              {!hasSearched && (
                <div className="h-28 border border-dashed border-border rounded-[5px] flex items-center justify-center bg-muted/10">
                  <p className="text-[12px] text-muted-foreground">Type at least 2 characters to search</p>
                </div>
              )}
              {hasSearched && !searchLoading && patients.length === 0 && (
                <div className="h-28 border border-dashed border-border rounded-[5px] flex flex-col items-center justify-center gap-2 bg-muted/10">
                  <p className="text-[13px] font-medium text-muted-foreground">No patients found for &quot;{searchQuery}&quot;</p>
                  <button onClick={() => router.push("/reception/patient-registration/new")}
                    className="text-[12px] font-bold text-primary hover:underline">
                    + Register as new patient
                  </button>
                </div>
              )}
              {patients.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setSelectedPatient(p); setErrors((e) => ({ ...e, patient: undefined })); }}
                  className="w-full p-4 border border-border bg-card rounded-[5px] text-left hover:border-primary hover:bg-primary/5 transition-all group"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <h4 className="text-[14px] font-bold text-foreground group-hover:text-primary transition-colors">{p.name}</h4>
                      <p className="text-[12px] font-medium text-muted-foreground">
                        {p.age ? `${p.age} yrs` : "—"} · {p.gender || "—"} · {p.contact || "—"}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground/60 bg-muted px-2 py-0.5 rounded-[3px] shrink-0">
                      {p.id.slice(0, 8).toUpperCase()}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
          <button
            onClick={() => router.back()}
            className="w-full sm:w-auto h-11 px-8 border border-destructive/30 text-destructive hover:bg-destructive/5 rounded-[5px] text-[13px] font-bold transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleNext}
            className="w-full sm:w-auto h-11 px-8 bg-primary text-white rounded-[5px] text-[13px] font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all"
          >
            Next Step <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BookAppointmentStep1() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col min-h-screen bg-background p-5 justify-center items-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      }
    >
      <BookAppointmentStep1Content />
    </Suspense>
  );
}
