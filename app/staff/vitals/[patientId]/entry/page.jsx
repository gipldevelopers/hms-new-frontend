"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { AlertTriangle, ChevronRight, Calendar, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Data ─────────────────────────────────────────────────────────────────────
const patientMap = {
  1:  { name: "John Doe",           bed: "Bed 402-B", mrn: "MRN: 987654321" },
  2:  { name: "Mrs. Joseph Thiel",  bed: "Bed 201-A", mrn: "MRN: 123456789" },
  3:  { name: "Ada Rempel",         bed: "Bed 305-C", mrn: "MRN: 234567890" },
  4:  { name: "Alfonso Stiedemann", bed: "Bed 110-D", mrn: "MRN: 345678901" },
  5:  { name: "Dianna Sanford",     bed: "Bed 220-B", mrn: "MRN: 456789012" },
  6:  { name: "Marcus Reed",        bed: "Bed 315-A", mrn: "MRN: 567890123" },
  7:  { name: "Amelia Zhao",        bed: "Bed 408-C", mrn: "MRN: 678901234" },
  8:  { name: "Jason Patel",        bed: "Bed 502-B", mrn: "MRN: 789012345" },
  9:  { name: "Sofia Martinez",     bed: "Bed 601-A", mrn: "MRN: 890123456" },
  10: { name: "Liam Johnson",       bed: "Bed 703-D", mrn: "MRN: 901234567" },
  11: { name: "Ella Thompson",      bed: "Bed 804-C", mrn: "MRN: 012345678" },
};

const entryDataMap = {
  1: { bpSystolic: "185", bpDiastolic: "115", hr: "88", spo2: "86", respRate: "22", temp: "37.2", painScore: "4", notes: "Patient resting, complains of mild headache.", recordedAt: "Today, 10:45 AM", recordedBy: "Sarah Jenkins, RN", isCritical: true,  criticalMsg: "BP 185/115 mmHg, SpO2 86%" },
  2: { bpSystolic: "120", bpDiastolic: "80",  hr: "72", spo2: "98", respRate: "16", temp: "36.8", painScore: "2", notes: "",                                              recordedAt: "Today, 08:00 AM", recordedBy: "Sarah Jenkins, RN", isCritical: false, criticalMsg: "" },
  3: { bpSystolic: "118", bpDiastolic: "76",  hr: "68", spo2: "99", respRate: "14", temp: "36.9", painScore: "0", notes: "",                                              recordedAt: "Yesterday, 10:00 PM", recordedBy: "Mike Ross, RN",     isCritical: false, criticalMsg: "" },
};

const recentHistory = [
  { time: "08:00 AM", bp: "BP 120/80", hr: "HR 72" },
  { time: "04:00 AM", bp: "BP 118/76", hr: "HR 68" },
];

// ─── Field Component ──────────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div>
      <label className="block text-[12px] font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({ value, onChange, readOnly, placeholder, type = "text", suffix, isCritical, criticalLabel }) {
  return (
    <div>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          placeholder={placeholder}
          className={cn(
            "w-full h-11 rounded-[5px] border text-[14px] font-bold outline-none transition-all",
            suffix ? "pl-4 pr-10" : "px-4",
            readOnly
              ? "bg-[#F8F9FC] dark:bg-[#1e293b] border-gray-100 dark:border-white/10 text-[#1e293b] dark:text-white cursor-default"
              : isCritical
              ? "bg-rose-50 dark:bg-rose-500/10 border-rose-300 dark:border-rose-500/40 text-rose-500 focus:border-rose-400"
              : "bg-[#F8F9FC] dark:bg-[#1e293b] border-gray-100 dark:border-white/10 text-[#1e293b] dark:text-white focus:border-primary"
          )}
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] font-bold text-gray-400 pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
      {isCritical && !readOnly && criticalLabel && (
        <p className="text-[11px] text-rose-500 font-bold mt-1">{criticalLabel}</p>
      )}
    </div>
  );
}

// ─── Main Content ─────────────────────────────────────────────────────────────
function VitalsEntryContent() {
  const router       = useRouter();
  const params       = useParams();
  const searchParams = useSearchParams();

  const patientId = params?.patientId || "1";
  const mode      = searchParams?.get("mode") || "add";   // "add" | "edit" | "view"
  const entryId   = searchParams?.get("entryId") || null;

  const patient = patientMap[patientId] || patientMap[1];
  const prefill = entryId ? (entryDataMap[entryId] || entryDataMap[1]) : null;

  const isView = mode === "view";

  const [bpSystolic,  setBpSystolic]  = useState(prefill?.bpSystolic  || "");
  const [bpDiastolic, setBpDiastolic] = useState(prefill?.bpDiastolic || "");
  const [hr,          setHr]          = useState(prefill?.hr          || "");
  const [spo2,        setSpo2]        = useState(prefill?.spo2        || "");
  const [respRate,    setRespRate]    = useState(prefill?.respRate     || "");
  const [temp,        setTemp]        = useState(prefill?.temp        || "");
  const [painScore,   setPainScore]   = useState(prefill?.painScore   || "");
  const [notes,       setNotes]       = useState(prefill?.notes       || "");

  const recordedAt  = prefill?.recordedAt  || "Today, 10:45 AM";
  const recordedBy  = prefill?.recordedBy  || "Sarah Jenkins, RN";
  const isCritical  = prefill?.isCritical  || false;
  const criticalMsg = prefill?.criticalMsg || "";

  const bpCritical  = !isView && (parseInt(bpSystolic) > 180 || parseInt(bpDiastolic) > 110);
  const spo2Critical = !isView && parseInt(spo2) < 90;
  const showAlert   = isCritical || bpCritical || spo2Critical;

  // ── Sidebar panel (shared between mobile bottom + desktop right) ──
  const SidebarContent = () => (
    <div className="space-y-5">
      {/* Recorded At */}
      <div className="bg-white dark:bg-[#101935] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 p-5">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Recorded At</p>
        <div className="relative">
          <input
            readOnly
            value={recordedAt}
            className="w-full h-11 pl-4 pr-10 rounded-[5px] border border-gray-100 dark:border-white/10 bg-[#F8F9FC] dark:bg-[#1e293b] text-[13px] font-bold text-[#1e293b] dark:text-white outline-none cursor-default"
          />
          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Recorded By */}
      <div className="bg-white dark:bg-[#101935] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 p-5">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Recorded By</p>
        <input
          readOnly
          value={recordedBy}
          className="w-full h-11 px-4 rounded-[5px] border border-gray-100 dark:border-white/10 bg-[#F8F9FC] dark:bg-[#1e293b] text-[13px] font-bold text-[#1e293b] dark:text-white outline-none cursor-default"
        />
      </div>

      {/* Critical Alert */}
      {showAlert && (
        <div className="bg-white dark:bg-[#101935] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 p-5">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Critical Alert</p>
          <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-[5px] p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
              <p className="text-[13px] font-bold text-rose-500">Abnormal Vitals</p>
            </div>
            <p className="text-[12px] text-rose-400 font-medium mb-4 leading-relaxed">
              {criticalMsg || `BP ${bpSystolic}/${bpDiastolic} mmHg, SpO2 ${spo2}%`}
            </p>
            <div className="flex gap-2">
              <button className="flex-1 h-9 bg-rose-500 text-white rounded-[5px] text-[12px] font-bold hover:bg-rose-600 transition-colors">
                Notify Doctor
              </button>
              <button className="flex-1 h-9 bg-white dark:bg-[#1e293b] border border-rose-200 dark:border-rose-500/30 text-rose-500 rounded-[5px] text-[12px] font-bold hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
                View Patient
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vitals History */}
      <div className="bg-white dark:bg-[#101935] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 p-5">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">
          Vitals History (Last 10)
        </p>
        <div className="space-y-3">
          {recentHistory.map((h, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-[12px] font-bold text-gray-400">{h.time}</span>
              <span className="text-[12px] font-medium text-[#1e293b] dark:text-white">
                {h.bp}, {h.hr}
              </span>
            </div>
          ))}
        </div>
        <button
          onClick={() => router.push(`/staff/vitals/${patientId}`)}
          className="mt-4 w-full flex items-center justify-between text-primary text-[13px] font-bold hover:underline"
        >
          View Full Table
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 bg-[#F8F9FC] dark:bg-[#0A0F1D] min-h-screen transition-colors duration-300 font-sans pb-20">

      {/* ── Page Title ── */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.push(`/staff/vitals/${patientId}`)}
          className="p-2 hover:bg-white dark:hover:bg-white/5 rounded-[5px] transition-colors border border-transparent hover:border-[#E7E8EB] dark:hover:border-white/10 shrink-0"
        >
          <ArrowLeft className="w-5 h-5 text-[#1e293b] dark:text-white" />
        </button>
        <h1 className="text-[20px] md:text-[22px] font-bold text-[#1e293b] dark:text-white tracking-tight">
          Vitals History
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* ── Left / Main Column ── */}
        <div className="flex-1 min-w-0 space-y-5">

          {/* Patient Info + Action Buttons */}
          <div className="bg-white dark:bg-[#101935] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 p-5">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h2 className="text-[18px] md:text-[20px] font-bold text-[#1e293b] dark:text-white leading-tight">
                  {patient.name}
                </h2>
                <p className="text-[12px] text-gray-400 font-medium mt-1">
                  {patient.bed} • {patient.mrn}
                </p>
              </div>
              {!isView && (
                <div className="flex gap-3 sm:shrink-0">
                  <button
                    onClick={() => router.push(`/staff/vitals/${patientId}`)}
                    className="flex-1 sm:flex-none h-10 px-5 bg-white dark:bg-[#1e293b] border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] font-bold text-[#1e293b] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-all outline-none"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 sm:flex-none h-10 px-5 bg-primary text-white rounded-[5px] text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all outline-none whitespace-nowrap">
                    + Save Vitals
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Cardiovascular */}
          <div className="bg-white dark:bg-[#101935] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 p-5">
            <h3 className="text-[15px] font-bold text-[#1e293b] dark:text-white mb-5">Cardiovascular</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Blood Pressure */}
              <Field label="Blood Pressure (mmHg)">
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <input
                      type="number"
                      value={bpSystolic}
                      onChange={(e) => !isView && setBpSystolic(e.target.value)}
                      readOnly={isView}
                      placeholder="Systolic"
                      className={cn(
                        "w-full h-11 px-4 rounded-[5px] border text-[14px] font-bold outline-none transition-all",
                        isView
                          ? "bg-[#F8F9FC] dark:bg-[#1e293b] border-gray-100 dark:border-white/10 text-[#1e293b] dark:text-white cursor-default"
                          : bpCritical
                          ? "bg-rose-50 dark:bg-rose-500/10 border-rose-300 dark:border-rose-500/40 text-rose-500 focus:border-rose-400"
                          : "bg-[#F8F9FC] dark:bg-[#1e293b] border-gray-100 dark:border-white/10 text-[#1e293b] dark:text-white focus:border-primary"
                      )}
                    />
                    {bpCritical && (
                      <p className="text-[11px] text-rose-500 font-bold mt-1">Critical - High</p>
                    )}
                  </div>
                  <span className="text-gray-400 font-bold text-[18px] mt-2.5 shrink-0">/</span>
                  <div className="flex-1">
                    <input
                      type="number"
                      value={bpDiastolic}
                      onChange={(e) => !isView && setBpDiastolic(e.target.value)}
                      readOnly={isView}
                      placeholder="Diastolic"
                      className={cn(
                        "w-full h-11 px-4 rounded-[5px] border text-[14px] font-bold outline-none transition-all",
                        isView
                          ? "bg-[#F8F9FC] dark:bg-[#1e293b] border-gray-100 dark:border-white/10 text-[#1e293b] dark:text-white cursor-default"
                          : bpCritical
                          ? "bg-rose-50 dark:bg-rose-500/10 border-rose-300 dark:border-rose-500/40 text-rose-500 focus:border-rose-400"
                          : "bg-[#F8F9FC] dark:bg-[#1e293b] border-gray-100 dark:border-white/10 text-[#1e293b] dark:text-white focus:border-primary"
                      )}
                    />
                  </div>
                </div>
              </Field>

              {/* Heart Rate */}
              <Field label="Heart Rate (bpm)">
                <Input
                  type="number"
                  value={hr}
                  onChange={(e) => setHr(e.target.value)}
                  readOnly={isView}
                  placeholder="e.g. 72"
                />
              </Field>
            </div>
          </div>

          {/* Respiratory */}
          <div className="bg-white dark:bg-[#101935] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 p-5">
            <h3 className="text-[15px] font-bold text-[#1e293b] dark:text-white mb-5">Respiratory</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* SpO2 */}
              <Field label="SpO2 (%)">
                <Input
                  type="number"
                  value={spo2}
                  onChange={(e) => setSpo2(e.target.value)}
                  readOnly={isView}
                  placeholder="e.g. 98"
                  isCritical={spo2Critical}
                  criticalLabel="Critical - Low"
                />
              </Field>

              {/* Resp Rate */}
              <Field label="Resp Rate (breaths/min)">
                <Input
                  type="number"
                  value={respRate}
                  onChange={(e) => setRespRate(e.target.value)}
                  readOnly={isView}
                  placeholder="e.g. 16"
                />
              </Field>
            </div>
          </div>

          {/* General & Optional */}
          <div className="bg-white dark:bg-[#101935] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 p-5">
            <h3 className="text-[15px] font-bold text-[#1e293b] dark:text-white mb-5">General & Optional</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              {/* Temperature */}
              <Field label="Temperature">
                <Input
                  type="number"
                  value={temp}
                  onChange={(e) => setTemp(e.target.value)}
                  readOnly={isView}
                  placeholder="e.g. 37.2"
                  suffix="°C"
                />
              </Field>

              {/* Pain Score */}
              <Field label="Pain Score (0–10)">
                <Input
                  type="number"
                  value={painScore}
                  onChange={(e) => setPainScore(e.target.value)}
                  readOnly={isView}
                  placeholder="e.g. 4"
                />
              </Field>
            </div>

            {/* Notes */}
            <Field label="Notes">
              <textarea
                value={notes}
                onChange={(e) => !isView && setNotes(e.target.value)}
                readOnly={isView}
                placeholder="Patient resting, complains of mild headache..."
                rows={4}
                className={cn(
                  "w-full px-4 py-3 rounded-[5px] border text-[13px] font-medium outline-none transition-all resize-none",
                  isView
                    ? "bg-[#F8F9FC] dark:bg-[#1e293b] border-gray-100 dark:border-white/10 text-[#1e293b] dark:text-white cursor-default"
                    : "bg-[#F8F9FC] dark:bg-[#1e293b] border-gray-100 dark:border-white/10 text-[#1e293b] dark:text-white focus:border-primary"
                )}
              />
            </Field>
          </div>

          {/* ── Mobile Sidebar (shown below form on small screens) ── */}
          <div className="lg:hidden">
            <SidebarContent />
          </div>
        </div>

        {/* ── Right / Sidebar Column (desktop only) ── */}
        <div className="hidden lg:block w-[300px] shrink-0">
          <SidebarContent />
        </div>
      </div>
    </div>
  );
}

// ─── Page Export (wrapped in Suspense for useSearchParams) ────────────────────
export default function VitalsEntryPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 bg-[#F8F9FC] dark:bg-[#0A0F1D] min-h-screen flex items-center justify-center">
          <p className="text-[13px] font-medium text-gray-400">Loading...</p>
        </div>
      }
    >
      <VitalsEntryContent />
    </Suspense>
  );
}
