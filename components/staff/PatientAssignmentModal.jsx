"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Search,
  Check,
  UserPlus,
  AlertCircle,
  Users
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function PatientAssignmentModal({ isOpen, onClose, staff, branchId }) {
  const [patients, setPatients] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && staff) {
      fetchPatients();
      fetchCurrentAssignments();
    }
  }, [isOpen, staff]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authtoken");
      const res = await fetch(`/api/patients?branchId=${branchId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setPatients(data);
      } else if (data.data && Array.isArray(data.data)) {
        setPatients(data.data);
      }
    } catch (error) {
      toast.error("Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentAssignments = async () => {
    try {
      const token = localStorage.getItem("authtoken");
      const res = await fetch(`/api/staff/${staff.id}/patients?branchId=${branchId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setSelectedIds(data.map(p => p.id));
      }
    } catch (error) {
      console.error("Failed to fetch current assignments:", error);
    }
  };

  const togglePatient = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("authtoken");
      const res = await fetch(`/api/staff/${staff.id}/patients?branchId=${branchId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ patientIds: selectedIds })
      });

      const result = await res.json();
      if (res.ok) {
        toast.success(`Assigned ${selectedIds.length} patients to ${staff.name}`);
        onClose();
      } else {
        toast.error(result.error || "Failed to save assignments");
      }
    } catch (error) {
      toast.error("Connection error");
    } finally {
      setSaving(false);
    }
  };

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.email && p.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[4px]"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative bg-white dark:bg-[#101935] w-full max-w-[500px] rounded-[12px] overflow-hidden shadow-2xl border border-gray-100 dark:border-white/5 flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[5px] bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-[#1e293b] dark:text-white leading-none">Assign Patients</h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 font-medium">To {staff?.name}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b border-gray-100 dark:border-white/5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patients by name..."
                  className="w-full h-10 pl-10 pr-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[5px] text-[13px] outline-none focus:border-primary transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Patients List */}
            <div className="flex-1 overflow-y-auto p-2 custom-scrollbar min-h-[300px]">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center py-20">
                  <div className="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin mb-3"></div>
                  <p className="text-[12px] font-bold text-gray-400 tracking-tight">Loading patients...</p>
                </div>
              ) : filteredPatients.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center py-20 text-center px-6">
                  <div className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-3">
                    <AlertCircle className="w-6 h-6 text-gray-300" />
                  </div>
                  <p className="text-[13px] font-bold text-gray-400">No patients found</p>
                  <p className="text-[11px] text-gray-500 mt-1">Try adjusting your search or add new patients.</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredPatients.map(patient => {
                    const isSelected = selectedIds.includes(patient.id);
                    return (
                      <button
                        key={patient.id}
                        onClick={() => togglePatient(patient.id)}
                        className={cn(
                          "w-full flex items-center justify-between p-3 rounded-[5px] transition-all text-left group",
                          isSelected
                            ? "bg-primary/5 border border-primary/20"
                            : "hover:bg-gray-50 dark:hover:bg-white/5 border border-transparent"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold",
                            isSelected ? "bg-primary text-white" : "bg-gray-100 dark:bg-white/10 text-gray-500"
                          )}>
                            {patient.name.charAt(0)}
                          </div>
                          <div>
                            <p className={cn(
                              "text-[13px] font-bold leading-none",
                              isSelected ? "text-primary" : "text-[#1e293b] dark:text-gray-200"
                            )}>
                              {patient.name}
                            </p>
                            <p className="text-[11px] text-gray-500 mt-1 font-medium italic">
                              ID: {patient.id.substring(0, 8)} • {patient.gender || 'N/A'}
                            </p>
                          </div>
                        </div>
                        <div className={cn(
                          "w-5 h-5 rounded-full border flex items-center justify-center transition-all",
                          isSelected
                            ? "bg-primary border-primary text-white"
                            : "border-gray-300 dark:border-white/10 text-transparent"
                        )}>
                          <Check className="w-3 h-3" strokeWidth={3} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50/50 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
              <p className="text-[11px] font-bold text-gray-400">
                {selectedIds.length} patients selected
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="px-4 h-9 rounded-[5px] text-[12px] font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || loading}
                  className="px-6 h-9 rounded-[5px] bg-primary text-white text-[12px] font-bold hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  Save Assignment
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
