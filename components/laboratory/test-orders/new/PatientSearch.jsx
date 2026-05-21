"use client";
import React, { useState } from "react";
import { Search, Phone, Mail, X, Users } from "lucide-react";

const mockPatients = [
  {
    id: "sarah",
    name: "Sarah Jenkins",
    uhid: "UHID-98234",
    age: "32 Yrs",
    gender: "Female",
    phone: "+1 (555) 123-4567",
    email: "sarah.j@example.com",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "robert",
    name: "Robert Fox",
    uhid: "UHID-98235",
    age: "45 Yrs",
    gender: "Male",
    phone: "+1 (555) 987-6543",
    email: "robert.f@example.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "esther",
    name: "Esther Howard",
    uhid: "UHID-98236",
    age: "32 Yrs",
    gender: "Female",
    phone: "+1 (555) 543-2100",
    email: "esther.h@example.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
  }
];

export function PatientSearch({ selectedPatient, onSelectPatient, onDeselectPatient }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredPatients = mockPatients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.uhid.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(e.target.value.length > 0);
  };

  const handleSelect = (patient) => {
    onSelectPatient(patient);
    setSearchQuery("");
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-4">
      {/* Search Bar Container */}
      <div className="bg-card text-card-foreground p-5 rounded-lg border border-border relative shadow-none">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-50" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(searchQuery.length > 0)}
            placeholder="Search by Name, Phone, or UHID... (e.g., type 'Sarah' or 'Robert')"
            className="w-full h-11 pl-10 pr-4 bg-background border border-border rounded-lg text-[13px] font-bold text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary transition-all shadow-none"
          />

          {/* Suggestions Dropdown */}
          {showSuggestions && filteredPatients.length > 0 && (
            <div className="absolute left-0 right-0 mt-1.5 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden divide-y divide-border">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  onClick={() => handleSelect(patient)}
                  className="p-3.5 hover:bg-muted/50 cursor-pointer flex items-center gap-3 transition-colors"
                >
                  <img
                    src={patient.avatar}
                    alt={patient.name}
                    className="w-8 h-8 rounded-full object-cover border border-border"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-foreground">{patient.name}</p>
                    <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                      {patient.uhid} • {patient.age} • {patient.gender}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Patient Card */}
        {selectedPatient && (
          <div className="mt-4 p-4 border border-border rounded-lg bg-background/50 flex flex-col md:flex-row md:items-center gap-4 transition-colors relative group">
            <img
              src={selectedPatient.avatar}
              alt={selectedPatient.name}
              className="w-12 h-12 rounded-full object-cover shrink-0 border border-border"
            />
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <h3 className="text-[14px] font-bold text-foreground truncate">{selectedPatient.name}</h3>
                <span className="text-[11px] text-muted-foreground font-semibold">
                  {selectedPatient.uhid} • {selectedPatient.age} • {selectedPatient.gender}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] font-bold text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Phone size={13} className="text-muted-foreground/80" />
                  {selectedPatient.phone}
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail size={13} className="text-muted-foreground/80" />
                  {selectedPatient.email}
                </span>
              </div>
            </div>

            {/* Remove patient selection button */}
            <button
              onClick={onDeselectPatient}
              className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Placeholder empty state when no patient is selected */}
      {!selectedPatient && (
        <div className="flex flex-col items-center text-center p-8 sm:p-16 bg-card rounded-lg border border-border select-none shadow-none">
          <div className="p-4 rounded-full bg-primary/5 text-primary mb-4 shrink-0">
            <Users size={32} strokeWidth={1.5} />
          </div>
          <h2 className="text-[15px] font-bold text-foreground mb-1">Search and Select a Patient</h2>
          <p className="text-[12px] text-muted-foreground max-w-sm leading-relaxed">
            Enter the patient's name, contact number, or unique hospital ID (UHID) in the search bar above to begin creating the test order.
          </p>
        </div>
      )}
    </div>
  );
}
