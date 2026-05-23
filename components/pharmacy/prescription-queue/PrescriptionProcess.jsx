"use client";
import React from "react";
import { ArrowLeft, Check, Loader2, AlertCircle, Pill } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

function getAuthHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("authtoken") : "";
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function PrescriptionProcess() {
  const { id } = useParams();
  const router = useRouter();
  const [prescription, setPrescription] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [pickedMap, setPickedMap] = React.useState({});
  const [markingReady, setMarkingReady] = React.useState(false);
  const [togglingId, setTogglingId] = React.useState(null);

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
        const rx = data.data;
        setPrescription(rx);

        // Parse existing picked state from pharmacyNotes JSON
        let existingPicked = {};
        try {
          if (rx.pharmacyNotes) {
            const parsed = JSON.parse(rx.pharmacyNotes);
            if (typeof parsed === "object" && !Array.isArray(parsed)) {
              existingPicked = parsed;
            }
          }
        } catch {
          existingPicked = {};
        }
        setPickedMap(existingPicked);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPrescription();
  }, [id]);

  const togglePicked = async (itemId) => {
    const newVal = !pickedMap[itemId];
    setPickedMap((prev) => ({ ...prev, [itemId]: newVal }));
    setTogglingId(itemId);
    try {
      await fetch(`${API_BASE}/pharmacy/queue/${id}/items`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ itemId, picked: newVal }),
      });
    } catch {
      // revert on error
      setPickedMap((prev) => ({ ...prev, [itemId]: !newVal }));
    } finally {
      setTogglingId(null);
    }
  };

  const handleMarkReady = async () => {
    try {
      setMarkingReady(true);
      const res = await fetch(`${API_BASE}/pharmacy/queue/${id}/status`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: "READY" }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update status");
      }
      router.push(`/pharmacy/prescription-queue/${id}/ready`);
    } catch (err) {
      alert(err.message);
      setMarkingReady(false);
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

  const { patient, items, doctorName, processedBy, processedAt } = prescription;
  const rxId = `RX-${id.slice(-6).toUpperCase()}`;
  const pickedCount = items?.filter((item) => pickedMap[item.id]).length || 0;
  const totalCount = items?.length || 0;
  const progress = totalCount > 0 ? Math.round((pickedCount / totalCount) * 100) : 0;

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
              <span className="bg-[#dbeafe] text-[#1e40af] text-[11px] font-bold px-2 py-0.5 rounded-[4px]">
                Processing
              </span>
            </div>
            <p className="text-[12px] text-[#64748b] dark:text-[#94a3b8] font-bold mt-0.5 opacity-80">
              {processedBy
                ? `Started by ${processedBy}${processedAt ? ` at ${new Date(processedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}` : ""}`
                : "Processing in progress"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            href={`/pharmacy/prescription-queue/${id}`}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 h-11 border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-bold text-[#1e293b] dark:text-white hover:bg-gray-50 transition-all"
          >
            View Details
          </Link>
          <button
            onClick={handleMarkReady}
            disabled={markingReady}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 h-11 bg-[#2e37a4] text-white rounded-[5px] text-[13px] font-bold hover:opacity-90 transition-all disabled:opacity-60"
          >
            {markingReady ? (
              <><Loader2 size={14} className="animate-spin" /> Marking...</>
            ) : (
              <><Check size={16} strokeWidth={3} /> Mark as Ready</>
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
              <div className="w-14 h-14 bg-[#2e37a4]/10 text-[#2e37a4] flex items-center justify-center rounded-full font-bold text-[16px]">
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

          {/* Fulfillment Progress */}
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155]">
            <p className="text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider mb-5 opacity-70">
              Fulfillment Progress
            </p>
            <div className="flex justify-between items-end mb-2">
              <p className="text-[16px] font-bold text-[#1e293b] dark:text-white">
                {pickedCount} / {totalCount} Picked
              </p>
              <p className="text-[12px] font-bold text-[#64748b]">{progress}%</p>
            </div>
            <div className="w-full h-2.5 bg-[#f1f5f9] dark:bg-[#334155] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#2e37a4] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            {progress === 100 && (
              <p className="text-[12px] font-bold text-[#15803d] mt-3 flex items-center gap-1">
                <Check size={14} strokeWidth={3} /> All items picked — ready to mark as Ready
              </p>
            )}
          </div>
        </div>

        {/* Right Column — Pick List */}
        <div className="lg:col-span-8 bg-white dark:bg-[#1e293b] p-6 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] h-fit">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-[16px] font-bold text-[#1e293b] dark:text-white">Pick List</h2>
              <p className="text-[12px] font-bold text-[#64748b] opacity-70">Mark items as picked from shelf</p>
            </div>
          </div>

          {!items || items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <Pill size={28} className="text-[#64748b] opacity-40" />
              <p className="text-[13px] font-bold text-[#64748b]">No medicines in this prescription</p>
            </div>
          ) : (
            <div className="space-y-0 divide-y divide-[#f1f5f9] dark:divide-[#334155]">
              {items.map((item) => {
                const isPicked = !!pickedMap[item.id];
                const isToggling = togglingId === item.id;
                const rackId = item.medicine?.rackId || null;

                return (
                  <div
                    key={item.id}
                    className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className={cn("text-[15px] font-bold text-[#1e293b] dark:text-white", isPicked && "line-through opacity-40")}>
                          {item.medicineName}
                        </h3>
                        {item.dosage && (
                          <span className={cn("text-[13px] font-bold text-[#64748b]", isPicked && "line-through opacity-40")}>
                            {item.dosage}
                          </span>
                        )}
                      </div>
                      <p className={cn("text-[12px] font-bold text-[#64748b] opacity-80", isPicked && "line-through opacity-40")}>
                        {item.timing && <>Sig: <span className="text-[#1e293b] dark:text-white">{item.timing}</span></>}
                        {item.timing && item.duration && " · "}
                        {item.duration && <>Duration: <span className="text-[#1e293b] dark:text-white">{item.duration}</span></>}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      {rackId && (
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-[#64748b] uppercase tracking-tight opacity-70 mb-0.5">
                            Location
                          </p>
                          <p className="text-[13px] font-bold text-[#1e293b] dark:text-white">{rackId}</p>
                        </div>
                      )}
                      <button
                        onClick={() => togglePicked(item.id)}
                        disabled={isToggling}
                        className={cn(
                          "flex items-center gap-2 px-4 h-9 rounded-[5px] text-[12px] font-bold transition-all border min-w-[90px] justify-center",
                          isPicked
                            ? "bg-[#dcfce7] text-[#15803d] border-[#dcfce7]"
                            : "border-[#e2e8f0] dark:border-[#334155] text-[#1e293b] dark:text-white hover:bg-[#f8fafc]"
                        )}
                      >
                        {isToggling ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : isPicked ? (
                          <><Check size={14} strokeWidth={3} /> Picked</>
                        ) : (
                          "Pick Item"
                        )}
                      </button>
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
