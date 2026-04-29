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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#101935] w-full max-w-2xl rounded-[10px] border border-[#E7E8EB] dark:border-white/10 flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-300 shadow-none">
        
        {/* Header */}
        <div className="p-6 border-b border-[#F4F5F7] dark:border-white/5 flex items-center justify-between bg-white dark:bg-[#101935] z-10 shadow-none">
          <div className="space-y-1">
            <h2 className="text-[20px] font-bold text-[#1A1C23] dark:text-white tracking-tight">Assign Patient to Bed {bedLabel}</h2>
            <p className="text-[12px] text-[#A0AEC0] font-medium tracking-wide">Select an existing patient from the database or create a new entry</p>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 flex items-center justify-center text-[#A0AEC0] hover:text-[#1A1C23] dark:hover:text-white transition-all shadow-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-4 bg-[#F9FAFB] dark:bg-white/2 border-b border-[#F4F5F7] dark:border-white/5 shadow-none">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#A0AEC0] group-focus-within:text-[#2D3A8C] transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name or contact number..."
              className="w-full bg-white dark:bg-[#0B1121] border border-[#E7E8EB] dark:border-white/10 rounded-[8px] py-3 pl-11 pr-4 text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-[#2D3A8C]/10 border-transparent focus:border-[#2D3A8C] transition-all dark:text-white placeholder:text-[#A0AEC0] shadow-none"
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
                <Loader2 className="w-10 h-10 text-[#2D3A8C] animate-spin" />
                <Activity className="absolute inset-0 m-auto w-4 h-4 text-[#2D3A8C]/40" />
              </div>
              <p className="text-[14px] font-bold text-gray-400 animate-pulse shadow-none">Accessing Patient Directory...</p>
            </div>
          ) : filteredPatients.length > 0 ? (
            filteredPatients.map((patient) => {
              const isAdmitted = patient.admissions?.length > 0;
              return (
                <div 
                  key={patient.id}
                  onClick={() => onSelect(patient)}
                  className="p-4 rounded-[8px] border transition-all flex items-center justify-between group cursor-pointer bg-white dark:bg-white/2 border-[#E7E8EB] dark:border-white/5 hover:border-[#2D3A8C] hover:bg-[#F3F4FF] dark:hover:bg-primary/5 shadow-none active:scale-[0.99]"
                >
                  <div className="flex items-center gap-4 shadow-none">
                    <div className="w-12 h-12 rounded-[8px] flex items-center justify-center shrink-0 bg-[#F3F4FF] dark:bg-primary/10 text-[#2D3A8C] dark:text-primary border border-[#E0E4FF] dark:border-primary/20 shadow-none">
                      <User className="w-6 h-6" />
                    </div>
                    <div className="space-y-1 shadow-none">
                      <div className="flex items-center gap-3 shadow-none">
                        <span className="text-[15px] font-bold text-[#1A1C23] dark:text-white group-hover:text-[#2D3A8C] transition-colors shadow-none">{patient.name}</span>
                        {isAdmitted && (
                          <span className="text-[10px] px-2.5 py-1 rounded-[4px] bg-indigo-50 text-indigo-600 border border-indigo-100 font-bold uppercase tracking-wider shadow-none">
                            In Ward
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-[12px] text-[#A0AEC0] font-medium shadow-none">
                        <span className="flex items-center gap-1.5 shadow-none"><Calendar className="w-3.5 h-3.5" /> {patient.age}y • {patient.gender}</span>
                        {patient.contact && <span className="flex items-center gap-1.5 shadow-none"><Phone className="w-3.5 h-3.5" /> {patient.contact}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 shadow-none">
                    <button className="px-4 py-2 bg-[#2D3A8C] text-white rounded-[6px] text-[12px] font-bold flex items-center gap-2 shadow-none">
                      <Check className="w-4 h-4" /> Select Patient
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center space-y-3 shadow-none">
              <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-200 shadow-none">
                <UserPlus className="w-8 h-8" />
              </div>
              <div className="space-y-1 shadow-none">
                <p className="text-[16px] font-bold text-gray-400 shadow-none">No matching patients found</p>
                <p className="text-[12px] text-gray-400 max-w-[200px] shadow-none">Check the spelling or register them as a new patient</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>,
    document.body
  );
}

