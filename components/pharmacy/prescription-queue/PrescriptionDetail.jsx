"use client";
import React from "react";
import { ArrowLeft, Printer, Play, Pill, AlertCircle, Check, Loader2, Package } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

function getAuthHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("authtoken") : "";
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

function formatTime(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}

function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function waitingMinutes(dateStr) {
  if (!dateStr) return null;
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  return diff;
}

const STOCK_STATUS_STYLE = {
  "IN STOCK": "text-[#22c55e]",
  "LOW":      "text-[#f59e0b]",
  "OUT OF STOCK": "text-[#ef4444]",
};

export function PrescriptionDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [prescription, setPrescription] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [starting, setStarting] = React.useState(false);

  React.useEffect(() => {
    if (!id) return;
    const fetchPrescription = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE}/pharmacy/queue/${id}`, { headers: getAuthHeaders() });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || `Error ${res.status}`);
        }
        const data = await res.json();
        setPrescription(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPrescription();
  }, [id]);

  const handleStartProcessing = async () => {
    try {
      setStarting(true);
      const res = await fetch(`${API_BASE}/pharmacy/queue/${id}/status`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: "PROCESSING" }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update status");
      }
      router.push(`/pharmacy/dispensing-billing/${id}`);
    } catch (err) {
      alert(err.message);
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8f9fc] dark:bg-[#0a0f1d]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-[#2e37a4]" />
          <p className="text-[13px] font-bold text-[#64748b]">Loading prescription...</p>
        </div>
      </div>
    );
  }

  if (error || !prescription) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8f9fc] dark:bg-[#0a0f1d]">
        <div className="flex flex-col items-center gap-3">
          <AlertCircle size={32} className="text-red-500" />
          <p className="text-[13px] font-bold text-red-500">{error || "Prescription not found"}</p>
          <Link href="/pharmacy/prescription-queue" className="px-4 h-9 bg-[#2e37a4] text-white rounded-[5px] text-[12px] font-bold hover:opacity-90 flex items-center">
            Back to Queue
          </Link>
        </div>
      </div>
    );
  }

  const { patient, consultation, items, doctorName, pharmacyStatus, instructions, createdAt } = prescription;
  const waiting = waitingMinutes(createdAt);
  const rxId = `RX-${id.slice(-6).toUpperCase()}`;

  return (
    <div className="p-4 sm:p-6 space-y-[20px] font-sans bg-[#f8f9fc] dark:bg-[#0a0f1d] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/pharmacy/prescription-queue"
            className="p-2.5 bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[#64748b] hover:text-[#1e293b] dark:hover:text-white transition-all"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[20px] font-bold text-[#1e293b] dark:text-white">{rxId}</h1>
              <span className="bg-[#fef3c7] text-[#b45309] text-[11px] font-bold px-2 py-0.5 rounded-[4px]">
                {pharmacyStatus.charAt(0) + pharmacyStatus.slice(1).toLowerCase()}
              </span>
            </div>
            <p className="text-[12px] text-[#64748b] dark:text-[#94a3b8] font-bold mt-0.5 opacity-80">
              Received at {formatTime(createdAt)}
              {waiting !== null ? ` · Waiting: ${waiting} min` : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => window.print()}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 h-11 border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-bold text-[#1e293b] dark:text-white hover:bg-gray-50 dark:hover:bg-[#334155] transition-all"
          >
            <Printer size={16} /> Print
          </button>
          <button
            onClick={handleStartProcessing}
            disabled={starting}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 h-11 bg-[#2e37a4] text-white rounded-[5px] text-[13px] font-bold hover:opacity-90 transition-all disabled:opacity-60"
          >
            {starting ? (
              <><Loader2 size={14} className="animate-spin" /> Starting...</>
            ) : (
              <><Play size={14} fill="white" /> Start Processing</>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[20px]">
        {/* Left Column */}
        <div className="lg:col-span-4 space-y-[20px]">
          {/* Patient Info */}
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155]">
            <p className="text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider mb-5 opacity-70">
              Patient Information
            </p>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-[#2e37a4] text-white flex items-center justify-center rounded-full font-bold text-[16px]">
                {getInitials(patient?.name)}
              </div>
              <div>
                <h2 className="text-[18px] font-bold text-[#1e293b] dark:text-white">{patient?.name || "Unknown"}</h2>
                <p className="text-[13px] text-[#64748b] font-bold opacity-80 mt-0.5">
                  {patient?.contact || "No contact"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-y-6">
              <div className="space-y-1">
                <p className="text-[11px] text-[#64748b] font-bold uppercase tracking-tight opacity-70">Age / Gender</p>
                <p className="text-[14px] font-bold text-[#1e293b] dark:text-white">
                  {patient?.age ? `${patient.age} yrs` : "—"} / {patient?.gender || "—"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] text-[#64748b] font-bold uppercase tracking-tight opacity-70">Blood Group</p>
                <p className="text-[14px] font-bold text-[#1e293b] dark:text-white">{patient?.bloodGroup || "—"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] text-[#64748b] font-bold uppercase tracking-tight opacity-70">Prescribing Doctor</p>
                <p className="text-[14px] font-bold text-[#1e293b] dark:text-white">{doctorName || "—"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] text-[#64748b] font-bold uppercase tracking-tight opacity-70">Diagnosis</p>
                <p className="text-[14px] font-bold text-[#1e293b] dark:text-white">
                  {consultation?.finalDiagnosis || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Doctor Notes / Instructions */}
          {(instructions || consultation?.followUpNotes) && (
            <div className="bg-[#fffbeb] dark:bg-[#1e293b] p-6 rounded-[5px] border border-[#fef3c7] dark:border-[#334155]">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle size={16} className="text-[#b45309]" />
                <p className="text-[11px] font-bold text-[#b45309] uppercase tracking-wider">Doctor Notes</p>
              </div>
              <p className="text-[13px] text-[#b45309] dark:text-[#fcd34d] font-bold leading-relaxed opacity-90">
                {instructions || consultation?.followUpNotes}
              </p>
            </div>
          )}
        </div>

        {/* Right Column — Medications */}
        <div className="lg:col-span-8 bg-white dark:bg-[#1e293b] p-6 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] h-fit">
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-[#f1f5f9] dark:border-[#334155]">
            <h2 className="text-[16px] font-bold text-[#1e293b] dark:text-white">Prescribed Medications</h2>
            <span className="text-[12px] font-bold text-[#64748b] opacity-80">
              {items?.length || 0} Item{items?.length !== 1 ? "s" : ""}
            </span>
          </div>

          {!items || items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <Package size={28} className="text-[#64748b] opacity-40" />
              <p className="text-[13px] font-bold text-[#64748b]">No medicines prescribed</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const stockStatus = item.medicine?.status || null;
                const stockQty = item.medicine?.quantity ?? null;
                const rackId = item.medicine?.rackId || null;
                const stockStyle = stockStatus ? STOCK_STATUS_STYLE[stockStatus] || "text-[#64748b]" : "text-[#64748b]";

                return (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-[#eff6ff] dark:bg-[#1e40af]/20 rounded-[5px] shrink-0">
                        <Pill size={22} className="text-[#2e37a4]" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-x-2">
                          <h3 className="text-[14px] font-bold text-[#1e293b] dark:text-white">{item.medicineName}</h3>
                          {item.dosage && (
                            <span className="text-[12px] font-bold text-[#64748b] opacity-60 italic">{item.dosage}</span>
                          )}
                        </div>
                        <p className="text-[12px] font-bold text-[#64748b] opacity-80 mt-1">
                          {item.timing && <>Sig: <span className="text-[#1e293b] dark:text-[#cbd5e1]">{item.timing}</span></>}
                          {item.timing && item.duration && " · "}
                          {item.duration && <>Duration: <span className="text-[#1e293b] dark:text-[#cbd5e1]">{item.duration}</span></>}
                        </p>
                        {item.instructions && (
                          <p className="text-[11px] text-[#64748b] mt-0.5 italic opacity-70">{item.instructions}</p>
                        )}
                      </div>
                    </div>
                    <div className="sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-[#f1f5f9] dark:border-[#334155] shrink-0">
                      {rackId && (
                        <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-tight opacity-70 mb-1">
                          Rack: {rackId}
                        </p>
                      )}
                      {stockQty !== null ? (
                        <p className={`text-[14px] font-bold flex items-center sm:justify-end gap-1 ${stockStyle}`}>
                          <Check size={16} strokeWidth={3} /> {stockQty} in stock
                        </p>
                      ) : (
                        <p className="text-[12px] font-bold text-[#64748b] opacity-50">Stock unknown</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
