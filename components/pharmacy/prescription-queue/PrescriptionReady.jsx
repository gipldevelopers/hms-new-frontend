"use client";
import React from "react";
import { ArrowLeft, Check, Printer, Package, Loader2, AlertCircle, Pill } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

function getAuthHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("authtoken") : "";
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function formatTime(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}

export function PrescriptionReady() {
  const { id } = useParams();
  const [prescription, setPrescription] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [dispensing, setDispensing] = React.useState(false);
  const [dispensed, setDispensed] = React.useState(false);

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

  const handleDispense = async () => {
    try {
      setDispensing(true);
      const res = await fetch(`${API_BASE}/pharmacy/queue/${id}/status`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: "DISPENSED" }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to dispense");
      }
      const data = await res.json();
      // Update prescription in place — show dispensed state without redirecting
      setPrescription(data.data);
      setDispensed(true);
    } catch (err) {
      alert(err.message);
    } finally {
      setDispensing(false);
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

  const { patient, items, doctorName, processedBy, processedAt, pharmacyStatus, dispensedAt } = prescription;
  const rxId = `RX-${id.slice(-6).toUpperCase()}`;
  const isDispensed = dispensed || pharmacyStatus === "DISPENSED";

  return (
    <div className="p-4 sm:p-6 space-y-[20px] font-sans bg-[#f8f9fc] dark:bg-[#0a0f1d] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/pharmacy/prescription-queue"
            className="p-2.5 bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[#64748b] hover:text-[#1e293b] transition-all"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[20px] font-bold text-[#1e293b] dark:text-white">{rxId}</h1>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-[4px] ${isDispensed ? "bg-[#f1f5f9] text-[#64748b]" : "bg-[#dcfce7] text-[#15803d]"}`}>
                {isDispensed ? "Dispensed" : "Ready"}
              </span>
            </div>
            <p className="text-[12px] text-[#64748b] dark:text-[#94a3b8] font-bold mt-0.5 opacity-80">
              {isDispensed
                ? `Dispensed${dispensedAt ? ` at ${formatTime(dispensedAt)}` : ""}`
                : processedBy
                ? `Packed by ${processedBy}${processedAt ? ` at ${formatTime(processedAt)}` : ""}`
                : "Ready for handover"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => window.print()}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 h-11 border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-bold text-[#1e293b] dark:text-white hover:bg-gray-50 transition-all"
          >
            <Printer size={16} /> Print Labels
          </button>
          <button
            onClick={handleDispense}
            disabled={dispensing || isDispensed}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 h-11 rounded-[5px] text-[13px] font-bold transition-all disabled:opacity-70 ${
              isDispensed
                ? "bg-[#f1f5f9] text-[#64748b] cursor-default"
                : "bg-[#2e37a4] text-white hover:opacity-90"
            }`}
          >
            {isDispensed ? (
              <><Check size={16} strokeWidth={3} /> Dispensed</>
            ) : dispensing ? (
              <><Loader2 size={14} className="animate-spin" /> Dispensing...</>
            ) : (
              <><Check size={16} strokeWidth={3} /> Mark as Dispensed</>
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
              <div className="w-14 h-14 bg-[#fff7ed] text-[#c2410c] flex items-center justify-center rounded-full font-bold text-[16px]">
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
                <p className="text-[11px] text-[#64748b] font-bold uppercase tracking-tight opacity-70">Doctor</p>
                <p className="text-[14px] font-bold text-[#1e293b] dark:text-white">{doctorName || "—"}</p>
              </div>
            </div>
          </div>

          {/* Handover / Dispensed Card */}
          {isDispensed ? (
            <div className="bg-[#f8fafc] dark:bg-[#1e293b] p-6 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155]">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#f1f5f9] dark:bg-[#334155] rounded-[5px] shrink-0">
                  <Check size={24} className="text-[#64748b]" strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-[#64748b]">Dispensed</h3>
                  <p className="text-[13px] text-[#64748b] font-bold mt-1 leading-relaxed opacity-80">
                    Prescription has been dispensed to the patient.
                    {dispensedAt ? ` Completed at ${formatTime(dispensedAt)}.` : ""}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#f0fdf4] dark:bg-[#064e3b]/20 p-6 rounded-[5px] border border-[#dcfce7] dark:border-[#065f46]">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white dark:bg-[#1e293b] rounded-[5px] border border-[#dcfce7] dark:border-[#065f46] shrink-0">
                  <Package size={24} className="text-[#15803d]" />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-[#15803d]">Ready for Handover</h3>
                  <p className="text-[13px] text-[#166534] dark:text-[#34d399] font-bold mt-1 leading-relaxed opacity-90">
                    All {items?.length || 0} item{items?.length !== 1 ? "s" : ""} have been verified and packed.
                    Package is waiting at the pharmacy counter.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column — Packed Items */}
        <div className="lg:col-span-8 bg-white dark:bg-[#1e293b] p-6 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] h-fit">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#f1f5f9] dark:border-[#334155]">
            <h2 className="text-[16px] font-bold text-[#1e293b] dark:text-white">Packed Items</h2>
            <span className="text-[12px] font-bold text-[#64748b] opacity-80">
              {items?.length || 0} Item{items?.length !== 1 ? "s" : ""} Total
            </span>
          </div>

          {!items || items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <Pill size={28} className="text-[#64748b] opacity-40" />
              <p className="text-[13px] font-bold text-[#64748b]">No medicines in this prescription</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 border border-[#e2e8f0] dark:border-[#334155] rounded-[5px]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-[#f0fdf4] dark:bg-[#064e3b]/30 rounded-full flex items-center justify-center shrink-0">
                      <Check size={16} className="text-[#15803d]" strokeWidth={3} />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-x-2">
                        <h3 className="text-[14px] font-bold text-[#1e293b] dark:text-white">{item.medicineName}</h3>
                        {item.dosage && (
                          <span className="text-[12px] font-bold text-[#64748b] opacity-60">{item.dosage}</span>
                        )}
                      </div>
                      <p className="text-[12px] font-bold text-[#64748b] opacity-80 mt-0.5">
                        {item.timing && <>Sig: <span className="text-[#1e293b] dark:text-[#cbd5e1]">{item.timing}</span></>}
                        {item.timing && item.duration && " · "}
                        {item.duration && <>Duration: <span className="text-[#1e293b] dark:text-[#cbd5e1]">{item.duration}</span></>}
                      </p>
                    </div>
                  </div>
                  {item.medicine?.rackId && (
                    <div className="text-right shrink-0">
                      <p className="text-[10px] font-bold text-[#64748b] uppercase tracking-tight opacity-70 mb-0.5">Rack</p>
                      <p className="text-[13px] font-bold text-[#1e293b] dark:text-white">{item.medicine.rackId}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
