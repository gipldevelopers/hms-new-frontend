"use client";
import React, { useEffect, useRef, useState } from "react";
import { Search, Phone, Mail, X, Users, Loader2 } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

function getAuthHeaders() {
  const token = localStorage.getItem("authtoken");
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

function PatientAvatar({ patient, className = "w-8 h-8" }) {
  return (
    <div className={`${className} rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0`}>
      <span className="text-[12px] font-bold text-primary">{patient.name?.charAt(0)?.toUpperCase() || "P"}</span>
    </div>
  );
}

export function PatientSearch({ selectedPatient, onSelectPatient, onDeselectPatient }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const timerRef = useRef(null);

  useEffect(() => {
    clearTimeout(timerRef.current);
    const q = searchQuery.trim();
    if (!q) {
      setPatients([]);
      setError("");
      setLoading(false);
      return undefined;
    }

    timerRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${API_BASE}/laboratory/patients?search=${encodeURIComponent(q)}`, {
          headers: getAuthHeaders(),
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || "Failed to search patients");
        setPatients(Array.isArray(data.data) ? data.data : []);
        setShowSuggestions(true);
      } catch (err) {
        setPatients([]);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timerRef.current);
  }, [searchQuery]);

  const handleSelect = (patient) => {
    onSelectPatient(patient);
    setSearchQuery("");
    setPatients([]);
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-4">
      <div className="bg-card text-card-foreground p-5 rounded-lg border border-border relative shadow-none">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(e.target.value.trim().length > 0);
            }}
            onFocus={() => setShowSuggestions(searchQuery.trim().length > 0)}
            placeholder="Search by name, phone, email, or UHID..."
            className="w-full h-11 pl-10 pr-10 bg-background border border-border rounded-lg text-[13px] font-bold text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary transition-all shadow-none"
          />
          {loading && <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />}

          {showSuggestions && (
            <div className="absolute left-0 right-0 mt-1.5 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden divide-y divide-border">
              {patients.length > 0 ? (
                patients.map((patient) => (
                  <button
                    key={patient.id}
                    type="button"
                    onClick={() => handleSelect(patient)}
                    className="w-full p-3.5 hover:bg-muted/50 cursor-pointer flex items-center gap-3 transition-colors text-left"
                  >
                    <PatientAvatar patient={patient} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-foreground">{patient.name}</p>
                      <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                        {patient.uhid} - {patient.age || "-"} Yrs - {patient.gender || "-"}
                      </p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-4 text-[12px] font-semibold text-muted-foreground">
                  {loading ? "Searching patients..." : error || "No patients found"}
                </div>
              )}
            </div>
          )}
        </div>

        {selectedPatient && (
          <div className="mt-4 p-4 border border-border rounded-lg bg-background/50 flex flex-col md:flex-row md:items-center gap-4 transition-colors relative group">
            <PatientAvatar patient={selectedPatient} className="w-12 h-12" />
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <h3 className="text-[14px] font-bold text-foreground truncate">{selectedPatient.name}</h3>
                <span className="text-[11px] text-muted-foreground font-semibold">
                  {selectedPatient.uhid} - {selectedPatient.age || "-"} Yrs - {selectedPatient.gender || "-"}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] font-bold text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Phone size={13} className="text-muted-foreground/80" />
                  {selectedPatient.phone || "-"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail size={13} className="text-muted-foreground/80" />
                  {selectedPatient.email || "-"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onDeselectPatient}
              className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {!selectedPatient && (
        <div className="flex flex-col items-center text-center p-8 sm:p-16 bg-card rounded-lg border border-border select-none shadow-none">
          <div className="p-4 rounded-full bg-primary/5 text-primary mb-4 shrink-0">
            <Users size={32} strokeWidth={1.5} />
          </div>
          <h2 className="text-[15px] font-bold text-foreground mb-1">Search and Select a Patient</h2>
          <p className="text-[12px] text-muted-foreground max-w-sm leading-relaxed">
            Enter the patient&apos;s name, contact number, email, or UHID to begin creating the test order.
          </p>
        </div>
      )}
    </div>
  );
}
