"use client";

import React, { useState, useEffect } from "react";
import { X, Search, Zap, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function OrderTestModal({ isOpen, onClose, patientId, patientName }) {
  const [priority, setPriority] = useState("STAT");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);
  const [clinicalNotes, setClinicalNotes] = useState("");
  const [loadingTests, setLoadingTests] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleEsc = (e) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleEsc);

      // Pre-populate with typical test suggestions matching mockup
      setSelectedTests([
        { id: "cbc", name: "Complete Blood Count (CBC)", code: "CBC" },
        { id: "iron", name: "Iron Studies Panel", code: "IRON" },
        { id: "retic", name: "Reticulocyte Count", code: "RETIC" }
      ]);
      setPriority("STAT");
      setClinicalNotes("Severe anemia. Please draw immediately. Check for reticulocyte response and iron stores.");

      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleEsc);
      };
    }
  }, [isOpen, onClose]);

  // Debounced search for available laboratory tests
  useEffect(() => {
    if (!isOpen) return;
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    const delay = setTimeout(async () => {
      try {
        setLoadingTests(true);
        const token = localStorage.getItem("authtoken");
        const res = await fetch(`/api/laboratory/tests?search=${encodeURIComponent(searchTerm)}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setSearchResults(json.data || []);
          }
        }
      } catch (err) {
        console.error("Error searching tests:", err);
      } finally {
        setLoadingTests(false);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [searchTerm, isOpen]);

  const addTest = (test) => {
    if (selectedTests.some(t => t.name.toLowerCase() === test.name.toLowerCase())) return;
    setSelectedTests([...selectedTests, test]);
    setSearchTerm("");
    setSearchResults([]);
  };

  const removeTest = (testName) => {
    setSelectedTests(selectedTests.filter(t => t.name !== testName));
  };

  const handleSignAndOrder = async () => {
    if (selectedTests.length === 0) {
      alert("Please select at least one test to order.");
      return;
    }
    if (!patientId) {
      alert("Patient context missing. Cannot place laboratory order.");
      return;
    }
    try {
      setSubmitting(true);
      const token = localStorage.getItem("authtoken");
      const testNames = selectedTests.map(t => t.name);
      
      const body = {
        patientId,
        priority,
        tests: testNames,
        clinicalNotes
      };

      const res = await fetch("/api/laboratory/test-orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) throw new Error("Failed to create test order");
      const json = await res.json();
      if (json.success) {
        alert("Lab test order signed and submitted successfully!");
        onClose();
      } else {
        throw new Error(json.message || "Failed to create test order");
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-[6px]"
          />

          {/* Modal card content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 16 }}
            className="relative bg-card w-full max-w-[650px] rounded-lg shadow-none border border-border max-h-[95vh] flex flex-col z-10"
          >
            
            {/* Modal Header */}
            <div className="p-5 md:p-6 pb-4 bg-card border-b border-border/60">
              <div className="flex flex-col gap-3 w-full relative">
                <div className="flex justify-between items-center">
                  <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">
                    Search & Add Tests {patientName ? `for ${patientName}` : ""}
                  </label>
                  <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1 md:hidden">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Search by test name, code, or panel..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-11 pl-10 pr-10 bg-card border border-border rounded-lg text-[13px] font-medium outline-none focus:border-primary transition-all placeholder:text-muted-foreground text-foreground"
                  />
                  {loadingTests && (
                    <Loader2 className="absolute right-10 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
                  )}
                  <button onClick={onClose} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors hidden md:block">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Search Autocomplete popup */}
                {searchResults.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 bg-card border border-border rounded-lg shadow-xl max-h-[220px] overflow-y-auto z-[600] divide-y divide-border/60">
                    {searchResults.map((test) => (
                      <button
                        key={test.id}
                        type="button"
                        onClick={() => addTest(test)}
                        className="w-full px-4 py-3 text-left text-[13px] font-semibold text-foreground hover:bg-muted transition-colors flex justify-between items-center"
                      >
                        <span>{test.name}</span>
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider bg-muted border border-border px-1.5 py-0.5 rounded">
                          {test.code}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-5 md:p-6 flex-1 overflow-y-auto no-scrollbar space-y-6">
              {/* Selected Tests */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Selected Items</label>
                <div className="flex flex-wrap gap-2">
                  {selectedTests.length === 0 ? (
                    <p className="text-[13px] text-muted-foreground italic font-medium">No tests selected yet. Search and select above.</p>
                  ) : (
                    selectedTests.map((test) => (
                      <div 
                        key={test.name}
                        className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 border border-border rounded-lg text-[12px] font-bold text-foreground transition-all hover:border-primary/30"
                      >
                        <span className="truncate max-w-[200px]">{test.name}</span>
                        <X 
                          onClick={() => removeTest(test.name)}
                          className="w-3.5 h-3.5 cursor-pointer text-muted-foreground hover:text-red-500 transition-colors shrink-0" 
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Priority Level */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Priority Level</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {["Routine", "Urgent", "STAT"].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={cn(
                        "h-11 rounded-lg border text-[13px] font-bold transition-all flex items-center justify-center gap-2",
                        priority === p 
                          ? p === "STAT" 
                            ? "border-red-500 bg-red-50/50 text-red-500 dark:bg-red-500/10"
                            : "border-primary bg-primary/5 text-primary"
                          : "border-border text-muted-foreground hover:bg-muted/50"
                      )}
                    >
                      {p === "STAT" && <Zap className="w-3.5 h-3.5" />}
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clinical Notes */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Clinical Notes / Indications</label>
                <textarea 
                  className="w-full h-24 p-4 bg-card border border-border rounded-lg text-[13px] font-medium text-foreground outline-none focus:border-primary transition-all resize-none leading-relaxed placeholder:text-muted-foreground"
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  placeholder="Enter indications or special instructions..."
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 md:p-6 bg-card border-t border-border flex flex-col sm:flex-row justify-end gap-3 sticky bottom-0 z-10">
              <button 
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="w-full sm:w-auto px-8 h-11 rounded-lg border border-red-200 text-red-500 text-[13px] font-bold hover:bg-red-50 dark:hover:bg-red-500/10 transition-all shadow-none order-2 sm:order-1 disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleSignAndOrder}
                disabled={submitting}
                className="w-full sm:w-auto px-8 h-11 rounded-lg bg-primary text-white text-[13px] font-bold hover:opacity-90 transition-all shadow-none order-1 sm:order-2 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {submitting ? "Signing..." : "Sign & Order"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
