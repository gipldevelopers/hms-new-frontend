"use client";

import React, { useState } from "react";
import {
  Search,
  Plus,
  ChevronDown,
  LogOut,
  Send,
  X,
  Check,
  Building,
  BedDouble,
  User,
  Activity,
  Calendar
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

import { useEffect } from "react";
import { toast } from "sonner";

function CustomSelect({ value, onChange, options, placeholder, className, minWidth = "130px" }) {
  const selected = options.find((o) => o.value === value);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "h-11 px-5 bg-background border border-border rounded-[5px] flex items-center justify-between gap-3 text-[13px] font-bold outline-none transition-all shadow-none text-foreground w-full sm:w-auto hover:bg-muted focus:border-primary",
            className
          )}
          style={{ minWidth }}
        >
          <span className="truncate">{selected ? selected.label : placeholder}</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[130px] border border-border bg-card p-1 rounded-[5px] shadow-xl z-50">
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-[5px] text-[12px] font-medium px-3 py-2 cursor-pointer transition-colors outline-none flex items-center justify-between",
              value === opt.value
                ? "bg-primary/5 text-primary font-bold dark:bg-primary/10"
                : "text-gray-600 hover:bg-muted"
            )}
          >
            <span>{opt.label}</span>
            {value === opt.value && <Check className="w-3.5 h-3.5 ml-auto text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function WardPatientsPage() {
  const router = useRouter();
  const [patients, setPatients] = useState([]);
  const [wardsList, setWardsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [wardFilter, setWardFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [dischargeItem, setDischargeItem] = useState(null);
  const [transferItem, setTransferItem] = useState(null);

  const [dischargeSummaryChecked, setDischargeSummaryChecked] = useState(true);
  const [medReconciliationChecked, setMedReconciliationChecked] = useState(true);
  const [patientEducationChecked, setPatientEducationChecked] = useState(false);
  const [dischargeNotes, setDischargeNotes] = useState("");

  // Transfer fields
  const [targetWard, setTargetWard] = useState("");
  const [targetBed, setTargetBed] = useState("");
  const [availableBeds, setAvailableBeds] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authtoken");
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch Admissions
      const admRes = await fetch("/api/admissions/overview?status=In Progress", { headers });
      const admData = await admRes.json();

      const mapped = (Array.isArray(admData) ? admData : []).map(adm => ({
        id: adm.id,
        name: adm.patient?.name || "Unknown Patient",
        ageGender: `${adm.patient?.age || '??'} / ${adm.patient?.gender || '??'}`,
        bed: adm.bed?.label || "No Bed",
        wardId: adm.wardId,
        wardName: adm.ward?.name,
        diagnosis: adm.reason || "No diagnosis provided",
        status: adm.status === "In Progress" ? "Admitted" : adm.status,
        patientId: adm.patientId,
        bedId: adm.bedId
      }));
      setPatients(mapped);

      // Fetch Infrastructure (Wards)
      const infraRes = await fetch("/api/wards/overview", { headers });
      const infraData = await infraRes.json();
      setWardsList(Array.isArray(infraData) ? infraData : []);
    } catch (e) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = patients.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.bed.toLowerCase().includes(search.toLowerCase()) ||
      p.diagnosis.toLowerCase().includes(search.toLowerCase());
    const matchesWard = wardFilter === "All" || p.wardName === wardFilter || p.bed.startsWith(wardFilter);
    const matchesStatus = statusFilter === "All" || p.status === statusFilter;
    return matchesSearch && matchesWard && matchesStatus;
  });

  const handleDischarge = async (id) => {
    try {
      const token = localStorage.getItem("authtoken");
      const res = await fetch(`/api/admissions/${id}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: "Completed" })
      });

      if (res.ok) {
        toast.success("Patient discharged successfully");
        fetchData();
        setDischargeItem(null);
      } else {
        const data = await res.json();
        toast.error(data.error || "Discharge failed");
      }
    } catch (e) {
      toast.error("Network error");
    }
  };

  const handleTransfer = async (id) => {
    if (!targetWard || !targetBed) return;
    try {
      const token = localStorage.getItem("authtoken");
      const res = await fetch(`/api/admissions/${id}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          wardId: targetWard,
          bedId: targetBed
        })
      });

      if (res.ok) {
        toast.success("Patient transferred successfully");
        fetchData();
        setTransferItem(null);
        setTargetWard("");
        setTargetBed("");
      } else {
        const data = await res.json();
        toast.error(data.error || "Transfer failed");
      }
    } catch (e) {
      toast.error("Network error");
    }
  };

  const handleWardSelection = (wardId) => {
    setTargetWard(wardId);
    const ward = wardsList.find(w => w.id === wardId);
    if (ward) {
      setAvailableBeds(ward.beds?.filter(b => b.status === "AVAILABLE") || []);
    } else {
      setAvailableBeds([]);
    }
    setTargetBed("");
  };

  const statusBadge = (status) => {
    switch (status) {
      case "Pending Discharge":
        return "bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-500/10 dark:text-amber-500 dark:border-amber-500/20 px-3 py-1 rounded-[5px] text-[11px] font-bold leading-none items-center justify-center inline-flex w-fit";
      case "Admitted":
        return "bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20 px-3 py-1 rounded-[5px] text-[11px] font-bold leading-none items-center justify-center inline-flex w-fit";
      case "Discharged":
        return "bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 px-3 py-1 rounded-[5px] text-[11px] font-bold leading-none items-center justify-center inline-flex w-fit";
      default:
        return "bg-gray-50 text-gray-600 border border-border dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20 px-3 py-1 rounded-[5px] text-[11px] font-bold leading-none items-center justify-center inline-flex w-fit";
    }
  };

  return (
    <div className="p-[20px] bg-background min-h-screen flex flex-col space-y-[20px] transition-colors duration-300 font-sans pb-20 ">
      {/* ── Header Section ── */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 ">
        <div>
          <h1 className="text-[20px] font-bold text-foreground tracking-tight leading-none">
            Ward Patients
          </h1>
        </div>
        <button
          onClick={() => router.push("/staff/admissions/add")}
          className="bg-primary hover:bg-primary/90 text-primary-foreground h-11 px-6 rounded-[5px] text-[13px] font-bold flex items-center justify-center gap-2 transition-all shadow-none w-full sm:w-auto outline-none "
        >
          <Plus className="w-4 h-4" /> New Admission
        </button>
      </div>

      {/* ── Filter Toolbar ── */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-card border border-border p-3 rounded-[5px] shadow-none ">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground  pointer-events-none" />
          <input
            type="text"
            placeholder="Search patients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-11 pr-4 bg-background border border-border rounded-[5px] text-[13px] font-medium outline-none transition-all shadow-none text-foreground focus:border-primary placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <CustomSelect
            value={wardFilter}
            onChange={setWardFilter}
            placeholder="Filter by Ward"
            minWidth="140px"
            options={[
              { label: "All Wards", value: "All" },
              ...wardsList.map(w => ({ label: w.name, value: w.name }))
            ]}
          />
          <CustomSelect
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="Filter by Status"
            minWidth="140px"
            options={[
              { label: "All", value: "All" },
              { label: "Pending Discharge", value: "Pending Discharge" },
              { label: "Admitted", value: "Admitted" },
              { label: "Discharged", value: "Discharged" },
            ]}
          />
        </div>
      </div>

      {/* ── Dynamic Layout Grid or Table ── */}
      <div className="flex flex-col flex-1 ">
        {loading ? (
          <div className="flex-1 flex items-center justify-center p-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Mobile Responsive Grid Layout */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="bg-card p-5 rounded-[5px] border border-border shadow-none "
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-[15px] font-bold text-foreground leading-tight">
                        {item.name}
                      </h3>
                      <p className="text-[11px] text-blue-600 dark:text-blue-400 font-bold mt-1">
                        {item.bed}
                      </p>
                    </div>
                    <span className={statusBadge(item.status)}>{item.status}</span>
                  </div>
                  <p className="text-[13px] font-medium text-muted-foreground leading-tight  mt-1">
                    Age/Gender: {item.ageGender}
                  </p>
                  <p className="text-[14px] font-bold text-foreground leading-tight mt-2.5">
                    {item.diagnosis}
                  </p>
                  <div className="flex items-center justify-end pt-4 border-t border-border mt-4 ">
                    {item.status === "Pending Discharge" && (
                      <button
                        onClick={() => setDischargeItem(item)}
                        className="p-2.5 hover:bg-muted bg-card border border-border rounded-[5px] flex items-center justify-center gap-1.5 transition-all text-[12px] font-bold text-foreground shadow-none outline-none"
                      >
                        <LogOut className="w-4 h-4 text-emerald-600 shrink-0 " />
                        <span>Discharge</span>
                      </button>
                    )}
                    {item.status === "Admitted" && (
                      <button
                        onClick={() => setTransferItem(item)}
                        className="p-2.5 hover:bg-muted bg-card border border-border rounded-[5px] flex items-center justify-center gap-1.5 transition-all text-[12px] font-bold text-foreground shadow-none outline-none"
                      >
                        <Send className="w-4 h-4 text-blue-600 shrink-0  rotate-45" />
                        <span>Transfer</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="bg-card border border-border rounded-[5px] p-10 text-center text-muted-foreground font-medium italic text-[13px] ">
                  No patients found matching current criteria.
                </div>
              )}
            </div>

            {/* High Density Desktop Table Layout */}
            <div className="hidden md:block bg-card border border-border rounded-[5px] overflow-hidden flex-1 shadow-none ">
              <div className="overflow-x-auto no-scrollbar ">
                <table className="w-full text-left border-collapse ">
                  <thead>
                    <tr className="bg-muted/30 ">
                      <th className="px-8 py-3 text-left text-[11px] font-bold text-muted-foreground border-b border-border tracking-tight">
                        Patient Name
                      </th>
                      <th className="px-8 py-3 text-left text-[11px] font-bold text-muted-foreground border-b border-border tracking-tight">
                        Age/Gender
                      </th>
                      <th className="px-8 py-3 text-left text-[11px] font-bold text-muted-foreground border-b border-border tracking-tight">
                        Bed No
                      </th>
                      <th className="px-8 py-3 text-left text-[11px] font-bold text-muted-foreground border-b border-border tracking-tight">
                        Diagnosis
                      </th>
                      <th className="px-8 py-3 text-left text-[11px] font-bold text-muted-foreground border-b border-border tracking-tight">
                        Status
                      </th>
                      <th className="px-8 py-3 text-right text-[11px] font-bold text-muted-foreground border-b border-border tracking-tight">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border ">
                    {filtered.map((item) => (
                      <tr key={item.id} className="hover:bg-muted/10 transition-all group ">
                        <td className="px-8 py-3 text-[14px] font-bold text-foreground ">
                          {item.name}
                        </td>
                        <td className="px-8 py-3 text-[13px] font-medium text-muted-foreground ">
                          {item.ageGender}
                        </td>
                        <td className="px-8 py-3 text-[13px] font-bold text-blue-600 dark:text-blue-400 ">
                          {item.bed}
                        </td>
                        <td className="px-8 py-3 text-[13px] font-medium text-foreground  max-w-[220px] truncate leading-snug">
                          {item.diagnosis}
                        </td>
                        <td className="px-8 py-3 ">
                          <span className={statusBadge(item.status)}>{item.status}</span>
                        </td>
                        <td className="px-8 py-3 text-right ">
                          <div className="flex items-center justify-end gap-2 ">
                            {item.status === "Pending Discharge" && (
                              <button
                                onClick={() => setDischargeItem(item)}
                                className="px-3.5 h-9 hover:bg-muted bg-card border border-border rounded-[5px] flex items-center justify-center gap-1.5 transition-all text-[12px] font-bold text-foreground shadow-none outline-none "
                                title="Discharge Patient"
                              >
                                <LogOut className="w-3.5 h-3.5 text-emerald-600 shrink-0 " />
                                <span>Discharge</span>
                              </button>
                            )}
                            {item.status === "Admitted" && (
                              <button
                                onClick={() => setTransferItem(item)}
                                className="px-3.5 h-9 hover:bg-muted bg-card border border-border rounded-[5px] flex items-center justify-center gap-1.5 transition-all text-[12px] font-bold text-foreground shadow-none outline-none "
                                title="Transfer Patient"
                              >
                                <Send className="w-3.5 h-3.5 text-blue-600 shrink-0  rotate-45" />
                                <span>Transfer</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-8 py-16 text-center text-[13px] font-medium text-muted-foreground italic "
                        >
                          No patients found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Discharge Confirmation Modal ── */}
      <AnimatePresence>
        {dischargeItem && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDischargeItem(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] "
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 16 }}
              className="relative bg-card w-full max-w-[520px] rounded-[5px] overflow-hidden shadow-none border border-border flex flex-col "
            >
              {/* Header */}
              <div className="p-5 flex justify-between items-start border-b border-border ">
                <div>
                  <h3 className="text-[17px] font-bold text-foreground leading-tight ">
                    Discharge Patient
                  </h3>
                  <p className="text-[12px] text-gray-500 dark:text-gray-400 font-medium mt-0.5 leading-tight ">
                    Initiate discharge process
                  </p>
                </div>
                <button
                  onClick={() => setDischargeItem(null)}
                  className="p-1 hover:bg-muted rounded-[5px] text-muted-foreground transition-all outline-none "
                >
                  <X className="w-4 h-4 " />
                </button>
              </div>

              {/* Patient Card Subheader */}
              <div className="p-5 ">
                <div className="p-4 bg-muted/50 border border-border rounded-[5px] flex items-center justify-between gap-4 ">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-blue-500/10 dark:bg-blue-500/5 text-blue-600 border border-blue-500/10 rounded-full flex items-center justify-center  shrink-0 overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-[18px]">
                        {dischargeItem.name.charAt(0)}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-foreground leading-tight ">
                        {dischargeItem.name}
                      </h4>
                      <p className="text-[11px] font-medium text-muted-foreground mt-0.5  leading-tight">
                        Bed: {dischargeItem.bed}
                      </p>
                    </div>
                  </div>
                  <span className={statusBadge(dischargeItem.status)}>
                    {dischargeItem.status}
                  </span>
                </div>
              </div>

              {/* Discharge Checklist */}
              <div className="px-5 space-y-4  flex flex-col">
                <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider  leading-none">
                  Discharge Checklist
                </h4>

                <div className="space-y-3">
                  {/* Checklist item 1 */}
                  <div
                    onClick={() => setDischargeSummaryChecked(!dischargeSummaryChecked)}
                    className="p-3.5 border border-border rounded-[5px] bg-card flex items-center justify-between cursor-pointer  hover:bg-muted/50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-4.5 h-4.5 rounded-[3px] border flex items-center justify-center shrink-0 transition-all ",
                        dischargeSummaryChecked
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "border-gray-300 dark:border-white/20 bg-transparent"
                      )}>
                        {dischargeSummaryChecked && <Check className="w-3 h-3 " />}
                      </div>
                      <div>
                        <p className="text-[12.5px] font-bold text-foreground  leading-tight">
                          Discharge Summary Completed
                        </p>
                        <p className="text-[11px] font-medium text-muted-foreground mt-0.5  leading-tight">
                          Final assessment completed
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Checklist item 2 */}
                  <div
                    onClick={() => setMedReconciliationChecked(!medReconciliationChecked)}
                    className="p-3.5 border border-border rounded-[5px] bg-card flex items-center justify-between cursor-pointer  hover:bg-muted/50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-4.5 h-4.5 rounded-[3px] border flex items-center justify-center shrink-0 transition-all ",
                        medReconciliationChecked
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "border-gray-300 dark:border-white/20 bg-transparent"
                      )}>
                        {medReconciliationChecked && <Check className="w-3 h-3 " />}
                      </div>
                      <div>
                        <p className="text-[12.5px] font-bold text-foreground  leading-tight">
                          Medication Reconciliation
                        </p>
                        <p className="text-[11px] font-medium text-muted-foreground mt-0.5  leading-tight">
                          Take-home meds prescribed
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Checklist item 3 */}
                  <div
                    onClick={() => setPatientEducationChecked(!patientEducationChecked)}
                    className="p-3.5 border border-border rounded-[5px] bg-card flex items-center justify-between cursor-pointer  hover:bg-muted/50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-4.5 h-4.5 rounded-[3px] border flex items-center justify-center shrink-0 transition-all ",
                        patientEducationChecked
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "border-gray-300 dark:border-white/20 bg-transparent"
                      )}>
                        {patientEducationChecked && <Check className="w-3 h-3 " />}
                      </div>
                      <div>
                        <p className="text-[12.5px] font-bold text-foreground  leading-tight">
                          Patient Education & Instructions
                        </p>
                        <p className="text-[11px] font-medium text-muted-foreground mt-0.5  leading-tight">
                          Review follow-up care with patient
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Discharge Notes */}
              <div className="p-5 space-y-2 ">
                <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider  leading-none mb-1">
                  Discharge Notes (Optional)
                </h4>
                <textarea
                  placeholder="Add final nursing notes..."
                  value={dischargeNotes}
                  onChange={(e) => setDischargeNotes(e.target.value)}
                  className="w-full min-h-[80px] p-4 bg-background border border-border rounded-[5px] text-[13px] font-medium text-foreground outline-none transition-all shadow-none resize-none  focus:border-primary"
                />
              </div>

              {/* Action Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 bg-muted/30 border-t border-border ">
                <button
                  onClick={() => setDischargeItem(null)}
                  className="h-10 px-5 border border-border bg-card hover:bg-muted text-foreground font-semibold rounded-[5px] text-[13px] transition-all  shadow-none outline-none"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDischarge(dischargeItem.id)}
                  className="h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-[5px] text-[13px] transition-all flex items-center justify-center gap-1.5  shadow-none outline-none disabled:opacity-50"
                >
                  <LogOut className="w-3.5 h-3.5  rotate-180" />
                  <span>Confirm Discharge</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Transfer Confirmation Modal ── */}
      <AnimatePresence>
        {transferItem && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setTransferItem(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] "
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 16 }}
              className="relative bg-card w-full max-w-[420px] rounded-[5px] overflow-hidden shadow-none border border-border flex flex-col "
            >
              <div className="p-6 flex flex-col items-center text-center ">
                <div className="w-12 h-12 bg-blue-500/10 dark:bg-blue-500/5 text-blue-600 border border-blue-500/10 rounded-full flex items-center justify-center mb-4  shrink-0">
                  <Send className="w-6 h-6  rotate-45" />
                </div>
                <h3 className="text-[17px] font-bold text-foreground mb-1.5 leading-tight ">
                  Transfer Patient
                </h3>
                <p className="text-[12.5px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed ">
                  Transfer <span className="font-bold text-foreground">{transferItem.name}</span> to a different ward or bed.
                </p>
              </div>

              <div className="px-6 py-1 space-y-4 ">
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground uppercase leading-none mb-1.5 ">
                    Target Ward
                  </label>
                  <CustomSelect
                    value={targetWard}
                    onChange={handleWardSelection}
                    placeholder="Select Ward"
                    minWidth="100%"
                    options={wardsList.map(w => ({ label: w.name, value: w.id }))}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground uppercase leading-none mb-1.5 ">
                    Target Bed Number
                  </label>
                  <CustomSelect
                    value={targetBed}
                    onChange={setTargetBed}
                    placeholder="Select Bed"
                    minWidth="100%"
                    options={availableBeds.map(b => ({ label: b.label, value: b.id }))}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 px-6 py-4 mt-5 bg-muted/30 border-t border-border ">
                <button
                  onClick={() => setTransferItem(null)}
                  className="flex-1 h-10 border border-border bg-card hover:bg-muted text-foreground font-semibold rounded-[5px] text-[13px] transition-all  shadow-none outline-none"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleTransfer(transferItem.id)}
                  disabled={!targetWard || !targetBed}
                  className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-[5px] text-[13px] transition-all  shadow-none outline-none disabled:opacity-50"
                >
                  Transfer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
