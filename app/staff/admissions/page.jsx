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

const INITIAL_PATIENTS = [
  { id: 1, name: "Rajesh Kumar", ageGender: "45 / Male", bed: "ICU-04", diagnosis: "Acute Myocardial Infarction", status: "Pending Discharge" },
  { id: 2, name: "Maria Lopez", ageGender: "60 / Female", bed: "ICU-01", diagnosis: "Chronic Heart Failure", status: "Admitted" },
  { id: 3, name: "John Smith", ageGender: "50 / Male", bed: "ICU-02", diagnosis: "Pneumonia", status: "Pending Discharge" },
  { id: 4, name: "Anita Bhatt", ageGender: "30 / Female", bed: "ICU-03", diagnosis: "Severe Asthma Attack", status: "Admitted" },
  { id: 5, name: "Carlos Vega", ageGender: "55 / Male", bed: "ICU-05", diagnosis: "Acute Stroke", status: "Admitted" },
  { id: 6, name: "Helen Parker", ageGender: "40 / Female", bed: "ICU-06", diagnosis: "Diabetes Complications", status: "Pending Discharge" },
  { id: 7, name: "William Johnson", ageGender: "70 / Male", bed: "ICU-07", diagnosis: "Sepsis", status: "Admitted" },
  { id: 8, name: "Nina Patel", ageGender: "35 / Female", bed: "ICU-08", diagnosis: "Appendicitis", status: "Pending Discharge" },
  { id: 9, name: "George Brown", ageGender: "65 / Male", bed: "ICU-09", diagnosis: "COPD Exacerbation", status: "Admitted" },
];

function CustomSelect({ value, onChange, options, placeholder, minWidth = "130px" }) {
  const selected = options.find((o) => o.value === value);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="h-11 px-4 bg-white dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] flex items-center justify-between gap-2 text-[13px] font-medium outline-none transition-all shadow-none select-none text-foreground w-full sm:w-auto hover:bg-muted"
          style={{ minWidth }}
        >
          <span className="truncate">{selected ? selected.label : placeholder}</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[130px] border border-[#E7E8EB] dark:border-white/10 bg-white dark:bg-[#101935] p-1 rounded-[5px] shadow-none z-50">
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-[5px] text-[13px] font-medium px-3 py-2 cursor-pointer transition-colors outline-none select-none",
              value === opt.value
                ? "bg-primary/5 text-primary font-bold dark:bg-primary/10"
                : "text-foreground hover:bg-[#F8F9FC] dark:hover:bg-white/5"
            )}
          >
            {opt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function WardPatientsPage() {
  const router = useRouter();
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
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

  const filtered = patients.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.bed.toLowerCase().includes(search.toLowerCase()) ||
      p.diagnosis.toLowerCase().includes(search.toLowerCase());
    const matchesWard = wardFilter === "All" || p.bed.startsWith(wardFilter);
    const matchesStatus = statusFilter === "All" || p.status === statusFilter;
    return matchesSearch && matchesWard && matchesStatus;
  });

  const handleDischarge = (id) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Discharged" } : p))
    );
    setDischargeItem(null);
  };

  const handleTransfer = (id) => {
    if (!targetWard || !targetBed) return;
    setPatients((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, bed: `${targetWard}-${targetBed}`, status: "Admitted" } : p
      )
    );
    setTransferItem(null);
    setTargetWard("");
    setTargetBed("");
  };

  const statusBadge = (status) => {
    switch (status) {
      case "Pending Discharge":
        return "bg-amber-500/10 text-amber-600 border border-amber-500/20 px-2.5 py-0.5 rounded-[5px] text-[11px] font-bold select-none leading-tight";
      case "Admitted":
        return "bg-blue-500/10 text-blue-600 border border-blue-500/20 px-2.5 py-0.5 rounded-[5px] text-[11px] font-bold select-none leading-tight";
      case "Discharged":
        return "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2.5 py-0.5 rounded-[5px] text-[11px] font-bold select-none leading-tight";
      default:
        return "bg-gray-100 text-gray-600 border border-border px-2.5 py-0.5 rounded-[5px] text-[11px] font-bold select-none leading-tight";
    }
  };

  return (
    <div className="p-4 md:p-6 bg-[#F8F9FC] dark:bg-[#0A0F1D] min-h-screen flex flex-col space-y-[20px] transition-colors duration-300 font-sans pb-20 select-none">
      {/* ── Header Section ── */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 select-none">
        <div>
          <h1 className="text-[22px] md:text-[24px] font-bold text-[#1e293b] dark:text-white tracking-tight leading-none">
            Ward Patients
          </h1>
        </div>
        <button
          onClick={() => router.push("/staff/admissions/add")}
          className="bg-primary hover:bg-primary/90 text-white h-11 px-6 rounded-[5px] text-[13px] font-bold flex items-center justify-center gap-2 transition-all shadow-none w-full sm:w-auto outline-none select-none"
        >
          <Plus className="w-4 h-4" /> New Admission
        </button>
      </div>

      {/* ── Filter Toolbar ── */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 p-3.5 rounded-[5px] shadow-none select-none">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground select-none pointer-events-none" />
          <input
            type="text"
            placeholder="Search patients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-[#F8F9FC] dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-medium outline-none transition-all shadow-none select-none text-foreground focus:border-primary"
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
              { label: "ICU", value: "ICU" },
              { label: "Ward 1", value: "W1" },
              { label: "Ward 2", value: "W2" },
              { label: "Ward 3", value: "W3" },
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
      <div className="flex flex-col flex-1 select-none">
        {/* Mobile Responsive Grid Layout */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-[#101935] p-5 rounded-[5px] border border-[#E7E8EB] dark:border-white/10 shadow-none select-none"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-[15px] font-bold text-[#1e293b] dark:text-white leading-tight">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-blue-600 dark:text-blue-400 font-bold mt-1">
                    {item.bed}
                  </p>
                </div>
                <span className={statusBadge(item.status)}>{item.status}</span>
              </div>
              <p className="text-[13px] font-medium text-muted-foreground leading-tight select-none mt-1">
                Age/Gender: {item.ageGender}
              </p>
              <p className="text-[14px] font-bold text-foreground leading-tight mt-2.5">
                {item.diagnosis}
              </p>
              <div className="flex items-center justify-end pt-4 border-t border-[#E7E8EB] dark:border-white/10 mt-4 select-none">
                {item.status === "Pending Discharge" && (
                  <button
                    onClick={() => setDischargeItem(item)}
                    className="p-2.5 hover:bg-muted bg-white dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] flex items-center justify-center gap-1.5 transition-all text-[12px] font-bold text-foreground select-none shadow-none outline-none"
                  >
                    <LogOut className="w-4 h-4 text-emerald-600 shrink-0 select-none" />
                    <span>Discharge</span>
                  </button>
                )}
                {item.status === "Admitted" && (
                  <button
                    onClick={() => router.push(`/staff/admissions/transfer/${item.id}`)}
                    className="p-2.5 hover:bg-muted bg-white dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] flex items-center justify-center gap-1.5 transition-all text-[12px] font-bold text-foreground select-none shadow-none outline-none"
                  >
                    <Send className="w-4 h-4 text-blue-600 shrink-0 select-none rotate-45" />
                    <span>Transfer</span>
                  </button>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] p-10 text-center text-muted-foreground font-medium italic text-[13px] select-none">
              No patients found matching current criteria.
            </div>
          )}
        </div>

        {/* High Density Desktop Table Layout */}
        <div className="hidden md:block bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] overflow-hidden flex-1 shadow-none select-none">
          <div className="overflow-x-auto no-scrollbar select-none">
            <table className="w-full text-left border-collapse select-none">
              <thead>
                <tr className="bg-[#F8F9FC] dark:bg-[#1e293b] select-none">
                  <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground tracking-wider select-none uppercase">
                    Patient Name
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground tracking-wider select-none uppercase">
                    Age/Gender
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground tracking-wider select-none uppercase">
                    Bed No
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground tracking-wider select-none uppercase">
                    Diagnosis
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground tracking-wider select-none uppercase">
                    Status
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground tracking-wider select-none uppercase text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E8EB] dark:divide-white/5 select-none">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F8F9FC] dark:hover:bg-white/[0.01] transition-all group select-none">
                    <td className="px-6 py-4 text-[14px] font-bold text-[#1e293b] dark:text-white select-none">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 text-[13px] font-medium text-muted-foreground select-none">
                      {item.ageGender}
                    </td>
                    <td className="px-6 py-4 text-[13px] font-bold text-blue-600 dark:text-blue-400 select-none">
                      {item.bed}
                    </td>
                    <td className="px-6 py-4 text-[13px] font-medium text-foreground select-none max-w-[220px] truncate leading-snug">
                      {item.diagnosis}
                    </td>
                    <td className="px-6 py-4 select-none">
                      <span className={statusBadge(item.status)}>{item.status}</span>
                    </td>
                    <td className="px-6 py-4 text-right select-none">
                      <div className="flex items-center justify-end gap-2 select-none">
                        {item.status === "Pending Discharge" && (
                          <button
                            onClick={() => setDischargeItem(item)}
                            className="px-3.5 h-9 hover:bg-muted bg-white dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] flex items-center justify-center gap-1.5 transition-all text-[12px] font-bold text-foreground select-none shadow-none outline-none select-none"
                            title="Discharge Patient"
                          >
                            <LogOut className="w-3.5 h-3.5 text-emerald-600 shrink-0 select-none" />
                            <span>Discharge</span>
                          </button>
                        )}
                        {item.status === "Admitted" && (
                          <button
                            onClick={() => router.push(`/staff/admissions/transfer/${item.id}`)}
                            className="px-3.5 h-9 hover:bg-muted bg-white dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] flex items-center justify-center gap-1.5 transition-all text-[12px] font-bold text-foreground select-none shadow-none outline-none select-none"
                            title="Transfer Patient"
                          >
                            <Send className="w-3.5 h-3.5 text-blue-600 shrink-0 select-none rotate-45" />
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
                      className="px-6 py-16 text-center text-[13px] font-medium text-muted-foreground italic select-none"
                    >
                      No patients found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
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
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-[4px] select-none"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 16 }}
              className="relative bg-white dark:bg-[#101935] w-full max-w-[520px] rounded-[5px] overflow-hidden shadow-none border border-[#E7E8EB] dark:border-white/10 flex flex-col select-none"
            >
              {/* Header */}
              <div className="p-5 flex justify-between items-start border-b border-[#E7E8EB] dark:border-white/10 select-none">
                <div>
                  <h3 className="text-[17px] font-bold text-[#1e293b] dark:text-white leading-tight select-none">
                    Discharge Patient
                  </h3>
                  <p className="text-[12px] text-gray-500 dark:text-gray-400 font-medium mt-0.5 leading-tight select-none">
                    Initiate discharge process
                  </p>
                </div>
                <button
                  onClick={() => setDischargeItem(null)}
                  className="p-1 hover:bg-muted rounded-[5px] text-muted-foreground transition-all outline-none select-none"
                >
                  <X className="w-4 h-4 select-none" />
                </button>
              </div>

              {/* Patient Card Subheader */}
              <div className="p-5 select-none">
                <div className="p-4 bg-white dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] flex items-center justify-between gap-4 select-none">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-blue-500/10 dark:bg-blue-500/5 text-blue-600 border border-blue-500/10 rounded-full flex items-center justify-center select-none shrink-0 overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100"
                        alt="Patient"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-[#1e293b] dark:text-white leading-tight select-none">
                        {dischargeItem.name}
                      </h4>
                      <p className="text-[11px] font-medium text-muted-foreground mt-0.5 select-none leading-tight">
                        MRN: 884728 • Bed: {dischargeItem.bed}
                      </p>
                    </div>
                  </div>
                  <span className="bg-amber-500/10 text-amber-600 border border-amber-500/20 px-2 py-0.5 rounded-[5px] text-[10px] font-bold select-none leading-tight">
                    Pending Discharge
                  </span>
                </div>
              </div>

              {/* Discharge Checklist */}
              <div className="px-5 space-y-4 select-none flex flex-col">
                <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider select-none leading-none">
                  Discharge Checklist
                </h4>

                <div className="space-y-3">
                  {/* Checklist item 1 */}
                  <div
                    onClick={() => setDischargeSummaryChecked(!dischargeSummaryChecked)}
                    className="p-3.5 border border-[#E7E8EB] dark:border-white/10 rounded-[5px] bg-white dark:bg-[#101935] flex items-center justify-between cursor-pointer select-none hover:bg-muted/50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-4.5 h-4.5 rounded-[3px] border flex items-center justify-center shrink-0 transition-all select-none",
                        dischargeSummaryChecked
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "border-gray-300 dark:border-white/20 bg-transparent"
                      )}>
                        {dischargeSummaryChecked && <Check className="w-3 h-3 select-none" />}
                      </div>
                      <div>
                        <p className="text-[12.5px] font-bold text-foreground select-none leading-tight">
                          Discharge Summary Completed
                        </p>
                        <p className="text-[11px] font-medium text-muted-foreground mt-0.5 select-none leading-tight">
                          Signed by Dr. Evans
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Checklist item 2 */}
                  <div
                    onClick={() => setMedReconciliationChecked(!medReconciliationChecked)}
                    className="p-3.5 border border-[#E7E8EB] dark:border-white/10 rounded-[5px] bg-white dark:bg-[#101935] flex items-center justify-between cursor-pointer select-none hover:bg-muted/50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-4.5 h-4.5 rounded-[3px] border flex items-center justify-center shrink-0 transition-all select-none",
                        medReconciliationChecked
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "border-gray-300 dark:border-white/20 bg-transparent"
                      )}>
                        {medReconciliationChecked && <Check className="w-3 h-3 select-none" />}
                      </div>
                      <div>
                        <p className="text-[12.5px] font-bold text-foreground select-none leading-tight">
                          Medication Reconciliation
                        </p>
                        <p className="text-[11px] font-medium text-muted-foreground mt-0.5 select-none leading-tight">
                          Take-home meds prescribed
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Checklist item 3 */}
                  <div
                    onClick={() => setPatientEducationChecked(!patientEducationChecked)}
                    className="p-3.5 border border-[#E7E8EB] dark:border-white/10 rounded-[5px] bg-white dark:bg-[#101935] flex items-center justify-between cursor-pointer select-none hover:bg-muted/50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-4.5 h-4.5 rounded-[3px] border flex items-center justify-center shrink-0 transition-all select-none",
                        patientEducationChecked
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "border-gray-300 dark:border-white/20 bg-transparent"
                      )}>
                        {patientEducationChecked && <Check className="w-3 h-3 select-none" />}
                      </div>
                      <div>
                        <p className="text-[12.5px] font-bold text-foreground select-none leading-tight">
                          Patient Education & Instructions
                        </p>
                        <p className="text-[11px] font-medium text-muted-foreground mt-0.5 select-none leading-tight">
                          Review follow-up care with patient
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Discharge Notes */}
              <div className="p-5 space-y-2 select-none">
                <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider select-none leading-none mb-1">
                  Discharge Notes (Optional)
                </h4>
                <textarea
                  placeholder="Add final nursing notes..."
                  value={dischargeNotes}
                  onChange={(e) => setDischargeNotes(e.target.value)}
                  className="w-full min-h-[80px] p-4 bg-[#F8F9FC] dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-medium text-foreground outline-none transition-all shadow-none resize-none select-none focus:border-primary"
                />
              </div>

              {/* Action Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 bg-[#F8F9FC] dark:bg-[#101935] border-t border-[#E7E8EB] dark:border-white/10 select-none">
                <button
                  onClick={() => setDischargeItem(null)}
                  className="h-10 px-5 border border-[#E7E8EB] dark:border-white/10 bg-white dark:bg-[#101935] hover:bg-muted text-foreground font-semibold rounded-[5px] text-[13px] transition-all select-none shadow-none outline-none"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDischarge(dischargeItem.id)}
                  className="h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-[5px] text-[13px] transition-all flex items-center justify-center gap-1.5 select-none shadow-none outline-none disabled:opacity-50"
                >
                  <LogOut className="w-3.5 h-3.5 select-none rotate-180" />
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
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-[4px] select-none"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 16 }}
              className="relative bg-white dark:bg-[#101935] w-full max-w-[420px] rounded-[5px] overflow-hidden shadow-none border border-[#E7E8EB] dark:border-white/10 flex flex-col select-none"
            >
              <div className="p-6 flex flex-col items-center text-center select-none">
                <div className="w-12 h-12 bg-blue-500/10 dark:bg-blue-500/5 text-blue-600 border border-blue-500/10 rounded-full flex items-center justify-center mb-4 select-none shrink-0">
                  <Send className="w-6 h-6 select-none rotate-45" />
                </div>
                <h3 className="text-[17px] font-bold text-[#1e293b] dark:text-white mb-1.5 leading-tight select-none">
                  Transfer Patient
                </h3>
                <p className="text-[12.5px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed select-none">
                  Transfer <span className="font-bold text-foreground">{transferItem.name}</span> to a different ward or bed.
                </p>
              </div>

              <div className="px-6 py-1 space-y-4 select-none">
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground uppercase leading-none mb-1.5 select-none">
                    Target Ward
                  </label>
                  <CustomSelect
                    value={targetWard}
                    onChange={setTargetWard}
                    placeholder="Select Ward"
                    minWidth="100%"
                    options={[
                      { label: "ICU", value: "ICU" },
                      { label: "Ward 1", value: "W1" },
                      { label: "Ward 2", value: "W2" },
                      { label: "Ward 3", value: "W3" },
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground uppercase leading-none mb-1.5 select-none">
                    Target Bed Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. B01, B02"
                    value={targetBed}
                    onChange={(e) => setTargetBed(e.target.value)}
                    className="w-full h-11 px-4 bg-[#F8F9FC] dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-medium text-foreground outline-none transition-all shadow-none select-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 px-6 py-4 mt-5 bg-[#F8F9FC] dark:bg-[#101935] border-t border-[#E7E8EB] dark:border-white/10 select-none">
                <button
                  onClick={() => setTransferItem(null)}
                  className="flex-1 h-10 border border-[#E7E8EB] dark:border-white/10 bg-white dark:bg-[#101935] hover:bg-muted text-foreground font-semibold rounded-[5px] text-[13px] transition-all select-none shadow-none outline-none"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleTransfer(transferItem.id)}
                  disabled={!targetWard || !targetBed}
                  className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-[5px] text-[13px] transition-all select-none shadow-none outline-none disabled:opacity-50"
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
