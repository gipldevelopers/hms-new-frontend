"use client";

import React, { useState, Suspense, useEffect, use } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { AlertTriangle, ChevronRight, Calendar, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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
            "w-full h-11 rounded-lg border text-[14px] font-bold outline-none transition-all",
            suffix ? "pl-4 pr-10" : "px-4",
            readOnly
              ? "bg-muted border-border text-foreground cursor-default"
              : isCritical
                ? "bg-destructive/5 border-destructive/40 text-destructive focus:border-destructive"
                : "bg-muted border-border text-foreground focus:border-primary"
          )}
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] font-bold text-muted-foreground pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
      {isCritical && !readOnly && criticalLabel && (
        <p className="text-[11px] text-destructive font-bold mt-1">{criticalLabel}</p>
      )}
    </div>
  );
}

// ─── Main Content ─────────────────────────────────────────────────────────────
function VitalsEntryContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const patientId = params?.patientId || "";
  const mode = searchParams?.get("mode") || "add";   // "add" | "edit" | "view"
  const entryId = searchParams?.get("entryId") || null;
  const from = searchParams?.get("from") || "vitals";

  const destPath = from === "patient"
    ? `/staff/patients/${patientId}?tab=Vitals`
    : `/staff/vitals/${patientId}`;

  const isView = mode === "view";

  const [patient, setPatient] = useState(null);
  const [recentHistory, setRecentHistory] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [currentUser, setCurrentUser] = useState("Staff");

  const [bpSystolic, setBpSystolic] = useState("");
  const [bpDiastolic, setBpDiastolic] = useState("");
  const [hr, setHr] = useState("");
  const [spo2, setSpo2] = useState("");
  const [respRate, setRespRate] = useState("");
  const [temp, setTemp] = useState("");
  const [painScore, setPainScore] = useState("");
  const [notes, setNotes] = useState("");

  const recordedAt = new Date().toLocaleString();
  const recordedBy = currentUser;

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user.name) setCurrentUser(user.name);
    } catch (e) { }
  }, []);

  useEffect(() => {
    if (!patientId) return;
    const fetchPatientAndVitals = async () => {
      try {
        const token = localStorage.getItem("authtoken");
        const headers = { Authorization: `Bearer ${token}` };

        const patRes = await fetch(`/api/patients/${patientId}`, { headers });
        const patData = await patRes.json();
        setPatient(patData);

        const vitRes = await fetch(`/api/vitals/patient/${patientId}`, { headers });
        const vitData = await vitRes.json();
        if (Array.isArray(vitData)) {
          setRecentHistory(vitData.slice(0, 10));

          if (entryId && mode !== "add") {
            const prefill = vitData.find(v => v.id === entryId);
            if (prefill) {
              setBpSystolic(prefill.systolic || "");
              setBpDiastolic(prefill.diastolic || "");
              setHr(prefill.heartRate || "");
              setSpo2(prefill.spo2 || "");
              setRespRate(prefill.respiratoryRate || "");
              setTemp(prefill.temperature || "");
              setPainScore(prefill.painLevel || "");
              setNotes(prefill.notes || "");
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchPatientAndVitals();
  }, [patientId, entryId, mode]);

  const handleSave = async () => {
    if (isView) return;
    try {
      setIsSaving(true);
      const token = localStorage.getItem("authtoken");
      const payload = {
        patientId,
        systolic: bpSystolic ? Number(bpSystolic) : null,
        diastolic: bpDiastolic ? Number(bpDiastolic) : null,
        heartRate: hr ? Number(hr) : null,
        spo2: spo2 ? Number(spo2) : null,
        respiratoryRate: respRate ? Number(respRate) : null,
        temperature: temp ? Number(temp) : null,
        painLevel: painScore ? Number(painScore) : null,
        notes: notes || null,
        recordedBy: currentUser,
      };

      const url = entryId && mode === "edit" ? `/api/vitals/${entryId}` : "/api/vitals";
      const method = entryId && mode === "edit" ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success("Vitals saved successfully");
        router.push(destPath);
      } else {
        const err = await res.json();
        toast.error("Failed to save vitals: " + err.error);
      }
    } catch (e) {
      console.error(e);
      toast.error("Error saving vitals.");
    } finally {
      setIsSaving(false);
    }
  };

  const bpCritical = !isView && (parseInt(bpSystolic) > 180 || parseInt(bpDiastolic) > 110);
  const spo2Critical = !isView && parseInt(spo2) < 90;

  const uhid = patient?.id ? `UHID-${patient.id.toString().substring(0, 6).toUpperCase()}` : "Loading...";
  const bedName = patient?.admissions?.[0]?.bed?.label || "No Bed";

  // ── Sidebar panel (shared between mobile bottom + desktop right) ──
  const SidebarContent = () => (
    <div className="space-y-5">
      {/* Recorded At */}
      <div className="bg-card rounded-lg border border-border p-5">
        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Recorded At</p>
        <div className="relative">
          <input
            readOnly
            value={recordedAt}
            className="w-full h-11 pl-4 pr-10 rounded-lg border border-border bg-muted text-[13px] font-bold text-foreground outline-none cursor-default"
          />
          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Recorded By */}
      <div className="bg-card rounded-lg border border-border p-5">
        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Recorded By</p>
        <input
          readOnly
          value={recordedBy}
          className="w-full h-11 px-4 rounded-lg border border-border bg-muted text-[13px] font-bold text-foreground outline-none cursor-default"
        />
      </div>



      {/* Vitals History */}
      <div className="bg-card rounded-lg border border-border p-5">
        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-4">
          Vitals History (Last 10)
        </p>
        <div className="space-y-3">
          {recentHistory.length === 0 ? (
            <div className="text-[12px] font-medium text-muted-foreground">No recent vitals</div>
          ) : recentHistory.map((h, i) => {
            const hTime = new Date(h.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            return (
              <div key={i} className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-muted-foreground">{hTime}</span>
                <span className="text-[12px] font-medium text-foreground">
                  BP {h.systolic || 0}/{h.diastolic || 0}, HR {h.heartRate || "--"}
                </span>
              </div>
            )
          })}
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
    <div className="p-5 bg-background min-h-screen transition-colors duration-300 font-sans pb-20">

      {/* ── Page Title ── */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.push(destPath)}
          className="p-2 hover:bg-card rounded-lg transition-colors border border-transparent hover:border-border shrink-0"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-[20px] md:text-[22px] font-bold text-foreground tracking-tight">
          Vitals History
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">

        {/* ── Left / Main Column ── */}
        <div className="flex-1 min-w-0 space-y-5">

          {/* Patient Info + Action Buttons */}
          <div className="bg-card rounded-lg border border-border p-5">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h2 className="text-[18px] md:text-[20px] font-bold text-foreground leading-tight">
                  {patient?.name || "Patient"}
                </h2>
                <p className="text-[12px] text-muted-foreground font-medium mt-1">
                  {bedName} • {uhid}
                </p>
              </div>
              {!isView && (
                <div className="flex gap-3 sm:shrink-0">
                  <button
                    onClick={() => router.push(destPath)}
                    className="flex-1 sm:flex-none h-10 px-5 bg-card border border-border rounded-lg text-[13px] font-bold text-foreground hover:bg-muted transition-all outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 sm:flex-none h-10 px-5 bg-primary text-primary-foreground rounded-lg text-[13px] font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all outline-none whitespace-nowrap disabled:opacity-50"
                  >
                    {isSaving ? "Saving..." : "+ Save Vitals"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Cardiovascular */}
          <div className="bg-card rounded-lg border border-border p-5">
            <h3 className="text-[15px] font-bold text-foreground mb-5">Cardiovascular</h3>
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
                        "w-full h-11 px-4 rounded-lg border text-[14px] font-bold outline-none transition-all",
                        isView
                          ? "bg-muted border-border text-foreground cursor-default"
                          : bpCritical
                            ? "bg-destructive/5 border-destructive/40 text-destructive focus:border-destructive"
                            : "bg-muted border-border text-foreground focus:border-primary"
                      )}
                    />
                    {bpCritical && (
                      <p className="text-[11px] text-destructive font-bold mt-1">Critical - High</p>
                    )}
                  </div>
                  <span className="text-muted-foreground font-bold text-[18px] mt-2.5 shrink-0">/</span>
                  <div className="flex-1">
                    <input
                      type="number"
                      value={bpDiastolic}
                      onChange={(e) => !isView && setBpDiastolic(e.target.value)}
                      readOnly={isView}
                      placeholder="Diastolic"
                      className={cn(
                        "w-full h-11 px-4 rounded-lg border text-[14px] font-bold outline-none transition-all",
                        isView
                          ? "bg-muted border-border text-foreground cursor-default"
                          : bpCritical
                            ? "bg-destructive/5 border-destructive/40 text-destructive focus:border-destructive"
                            : "bg-muted border-border text-foreground focus:border-primary"
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
          <div className="bg-card rounded-lg border border-border p-5">
            <h3 className="text-[15px] font-bold text-foreground mb-5">Respiratory</h3>
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
          <div className="bg-card rounded-lg border border-border p-5">
            <h3 className="text-[15px] font-bold text-foreground mb-5">General & Optional</h3>
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
                  "w-full px-4 py-3 rounded-lg border text-[13px] font-medium outline-none transition-all resize-none",
                  isView
                    ? "bg-muted border-border text-foreground cursor-default"
                    : "bg-muted border-border text-foreground focus:border-primary"
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
        <div className="p-5 bg-background min-h-screen flex items-center justify-center">
          <p className="text-[13px] font-medium text-muted-foreground">Loading...</p>
        </div>
      }
    >
      <VitalsEntryContent />
    </Suspense>
  );
}
