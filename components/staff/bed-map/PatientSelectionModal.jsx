"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { 
  X, 
  Search, 
  User, 
  Check, 
  UserPlus,
  Loader2,
  Calendar,
  Phone,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function PatientSelectionModal({ isOpen, onClose, onSelect, bedLabel, branchId }) {
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      fetchPatients();
    }
  }, [isOpen, branchId]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authtoken");
      const url = branchId ? `/api/patients?branchId=${branchId}` : "/api/patients";
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setPatients(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to fetch patients");
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.contact?.includes(searchQuery)
  );

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-card w-full max-w-2xl rounded-xl border border-border flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-300 shadow-none">
        
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between bg-card z-10 shadow-none">
          <div className="space-y-1">
            <h2 className="text-[20px] font-bold text-foreground tracking-tight">Assign Patient to Bed {bedLabel}</h2>
            <p className="text-[12px] text-muted-foreground font-medium tracking-wide">Select an existing patient from the database or create a new entry</p>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-all shadow-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-4 bg-muted/30 border-b border-border shadow-none">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name or contact number..."
              className="w-full bg-background border border-border rounded-lg py-3 pl-11 pr-4 text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-primary/10 border-transparent focus:border-primary transition-all text-foreground placeholder:text-muted-foreground shadow-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {/* Patient List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 min-h-[350px] scrollbar-hide shadow-none">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4 shadow-none">
              <div className="relative">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <Activity className="absolute inset-0 m-auto w-4 h-4 text-primary/40" />
              </div>
              <p className="text-[14px] font-bold text-muted-foreground animate-pulse shadow-none">Accessing Patient Directory...</p>
            </div>
          ) : filteredPatients.length > 0 ? (
            filteredPatients.map((patient) => {
              const isAdmitted = patient.admissions?.length > 0;
              return (
                <div 
                  key={patient.id}
                  onClick={() => onSelect(patient)}
                  className="p-4 rounded-lg border transition-all flex items-center justify-between group cursor-pointer bg-card border-border hover:border-primary hover:bg-primary/5 shadow-none active:scale-[0.99]"
                >
                  <div className="flex items-center gap-4 shadow-none">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0 bg-primary/10 text-primary border border-primary/20 shadow-none">
                      <User className="w-6 h-6" />
                    </div>
                    <div className="space-y-1 shadow-none">
                      <div className="flex items-center gap-3 shadow-none">
                        <span className="text-[15px] font-bold text-foreground group-hover:text-primary transition-colors shadow-none">{patient.name}</span>
                        {isAdmitted && (
                          <span className="text-[10px] px-2.5 py-1 rounded-sm bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 font-bold uppercase tracking-wider shadow-none">
                            In Ward
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-[12px] text-muted-foreground font-medium shadow-none">
                        <span className="flex items-center gap-1.5 shadow-none"><Calendar className="w-3.5 h-3.5" /> {patient.age}y • {patient.gender}</span>
                        {patient.contact && <span className="flex items-center gap-1.5 shadow-none"><Phone className="w-3.5 h-3.5" /> {patient.contact}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 shadow-none">
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-[12px] font-bold flex items-center gap-2 shadow-none hover:bg-primary/90">
                      <Check className="w-4 h-4" /> Select Patient
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center space-y-3 shadow-none">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground shadow-none">
                <UserPlus className="w-8 h-8" />
              </div>
              <div className="space-y-1 shadow-none">
                <p className="text-[16px] font-bold text-muted-foreground shadow-none">No matching patients found</p>
                <p className="text-[12px] text-muted-foreground max-w-[200px] shadow-none">Check the spelling or register them as a new patient</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>,
    document.body
  );
}

