"use client";
import React from "react";
import {
  ChevronDown, Check, X, Loader2, AlertCircle,
  CreditCard, Banknote, Smartphone, Wallet, Split, Pill, Search
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

function getAuthHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("authtoken") : "";
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

// Price per unit — derived from pharmacy item or fallback
function unitPrice(item) {
  return item.medicine?.price || item.unitPrice || 10; // fallback ₹10
}

const PAYMENT_METHODS = [
  { name: "Cash",        icon: Banknote },
  { name: "Card",        icon: CreditCard },
  { name: "UPI / QR",   icon: Smartphone },
  { name: "Net Banking", icon: CreditCard },
  { name: "Wallet",      icon: Wallet },
  { name: "Split",       icon: Split },
];

const INSURANCE_OPTIONS = ["None", "Private Insurance", "Govt Scheme", "Corporate", "Self Pay"];

export function DispensingBilling() {
  const { id } = useParams();
  const router = useRouter();

  // Data state
  const [prescription, setPrescription] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  // Billing state
  const [discount, setDiscount] = React.useState(0);
  const [insuranceScheme, setInsuranceScheme] = React.useState("None");
  const [insuranceId, setInsuranceId] = React.useState("");
  const [insuranceCoverage, setInsuranceCoverage] = React.useState(0);
  const [selectedPayment, setSelectedPayment] = React.useState("Cash");
  const [pharmacistNotes, setPharmacistNotes] = React.useState("");

  // Inventory search
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState([]);
  const [searching, setSearching] = React.useState(false);

  // Transaction modal
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [amountReceived, setAmountReceived] = React.useState("");
  const [printReceipt, setPrintReceipt] = React.useState(true);
  const [dispensing, setDispensing] = React.useState(false);

  // Fetch prescription
  React.useEffect(() => {
    if (!id) return;
    const fetch_ = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/pharmacy/queue/${id}`, { headers: getAuthHeaders() });
        if (!res.ok) { const e = await res.json(); throw new Error(e.message); }
        const data = await res.json();
        setPrescription(data.data);
      } catch (e) { setError(e.message); }
      finally { setLoading(false); }
    };
    fetch_();
  }, [id]);

  // Search inventory
  React.useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const timer = setTimeout(async () => {
      try {
        setSearching(true);
        const res = await fetch(`${API_BASE}/pharmacy/inventory?search=${encodeURIComponent(searchQuery)}`, { headers: getAuthHeaders() });
        if (!res.ok) return;
        const data = await res.json();
        setSearchResults((data.data || []).filter(i => i.status !== "OUT OF STOCK").slice(0, 6));
      } catch { setSearchResults([]); }
      finally { setSearching(false); }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Billing calculations
  const items = prescription?.items || [];
  // Estimate subtotal: ₹10 per item as fallback (no price field in schema)
  const subtotal = items.reduce((sum, item) => sum + unitPrice(item), 0);
  const discountAmt = (subtotal * Math.min(Math.max(Number(discount) || 0, 0), 100)) / 100;
  const afterDiscount = subtotal - discountAmt;
  const insuranceAmt = Math.min(Number(insuranceCoverage) || 0, afterDiscount);
  const taxable = afterDiscount - insuranceAmt;
  const tax = taxable * 0.05;
  const netPayable = Math.max(taxable + tax, 0);
  const change = parseFloat(amountReceived) - netPayable;

  const handleOpenDialog = () => {
    setAmountReceived(netPayable.toFixed(2));
    setIsDialogOpen(true);
  };

  const handleDispense = async () => {
    try {
      setDispensing(true);
      const res = await fetch(`${API_BASE}/pharmacy/queue/${id}/dispense`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          paymentMethod: selectedPayment,
          amountReceived: parseFloat(amountReceived),
          netPayable,
          discount: Number(discount),
          insuranceScheme,
          insuranceId,
          insuranceCoverage: insuranceAmt,
          tax,
          pharmacistNotes,
          printReceipt,
        }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.message); }
      setIsDialogOpen(false);
      router.push(`/pharmacy/prescription-queue`);
    } catch (e) {
      alert(e.message);
    } finally {
      setDispensing(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#f8f9fc] dark:bg-[#0a0f1d]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 size={32} className="animate-spin text-[#2e37a4]" />
        <p className="text-[13px] font-bold text-[#64748b]">Loading prescription...</p>
      </div>
    </div>
  );

  if (error || !prescription) return (
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

  const { patient, doctorName, consultation } = prescription;
  const rxId = `RX-${id.slice(-6).toUpperCase()}`;

  return (
    <div className="p-4 sm:p-6 space-y-[20px] font-sans bg-[#f8f9fc] dark:bg-[#0a0f1d] min-h-screen">
      {/* Top Info Bar */}
      <div className="bg-white dark:bg-[#1e293b] p-3 px-6 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] flex flex-wrap items-center gap-x-8 gap-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-bold text-[#64748b]">Rx:</span>
          <span className="text-[13px] font-bold text-[#2e37a4]">{rxId}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-bold text-[#64748b]">Patient:</span>
          <span className="text-[13px] font-bold text-[#1e293b] dark:text-white">{patient?.name || "—"}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-bold text-[#64748b]">Doctor:</span>
          <span className="text-[13px] font-bold text-[#1e293b] dark:text-white">{doctorName || "—"}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-bold text-[#64748b]">Diagnosis:</span>
          <span className="text-[13px] font-bold text-[#1e293b] dark:text-white">{consultation?.finalDiagnosis || "OPD"}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[20px]">
        {/* ── LEFT COLUMN ── */}
        <div className="lg:col-span-7 space-y-[20px]">
          {/* Prescribed Medicines */}
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155]">
            <div className="flex justify-between items-center mb-5 pb-4 border-b border-[#f1f5f9] dark:border-[#334155]">
              <h2 className="text-[15px] font-bold text-[#1e293b] dark:text-white">Prescribed Medicines</h2>
              <span className="text-[12px] font-bold text-[#64748b] opacity-70">{items.length} item{items.length !== 1 ? "s" : ""}</span>
            </div>
            {items.length === 0 ? (
              <div className="flex flex-col items-center py-10 gap-2">
                <Pill size={28} className="text-[#64748b] opacity-30" />
                <p className="text-[13px] font-bold text-[#64748b]">No medicines prescribed</p>
              </div>
            ) : (
              <div className="space-y-0 divide-y divide-[#f1f5f9] dark:divide-[#334155]">
                {items.map((item) => (
                  <div key={item.id} className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-[14px] font-bold text-[#1e293b] dark:text-white">{item.medicineName}</h3>
                        {item.dosage && <span className="text-[12px] font-bold text-[#64748b] opacity-60">{item.dosage}</span>}
                      </div>
                      <p className="text-[12px] font-bold text-[#64748b] mt-0.5">
                        {item.timing && <>Sig: <span className="text-[#1e293b] dark:text-white">{item.timing}</span></>}
                        {item.timing && item.duration && " · "}
                        {item.duration && <>Duration: <span className="text-[#1e293b] dark:text-white">{item.duration}</span></>}
                      </p>
                      {item.medicine && (
                        <p className="text-[11px] text-[#64748b] mt-0.5 opacity-70">
                          Stock: {item.medicine.quantity} · {item.medicine.status}
                          {item.medicine.rackId ? ` · Rack: ${item.medicine.rackId}` : ""}
                        </p>
                      )}
                    </div>
                    <span className="text-[13px] font-bold text-[#2e37a4]">₹{unitPrice(item).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Inventory Search */}
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155]">
            <h2 className="text-[15px] font-bold text-[#1e293b] dark:text-white mb-4">Search Inventory</h2>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b] opacity-50" />
              {searching && <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-[#64748b]" />}
              <input
                type="text"
                placeholder="Search medication by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-10 pr-10 bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[14px] font-bold text-[#1e293b] dark:text-white outline-none focus:border-primary transition-all"
              />
            </div>
            {searchResults.length > 0 && (
              <div className="mt-3 space-y-0 divide-y divide-[#f1f5f9] dark:divide-[#334155]">
                {searchResults.map((med) => (
                  <div key={med.id} className="py-3 flex items-center justify-between first:pt-0">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-[14px] font-bold text-[#1e293b] dark:text-white">{med.medicineName}</h3>
                        <span className="text-[12px] font-bold text-[#64748b] opacity-60">{med.type}</span>
                      </div>
                      <p className="text-[12px] font-bold text-[#64748b] mt-0.5">
                        Stock: <span className="text-[#1e293b] dark:text-white">{med.quantity}</span>
                        {med.rackId ? ` · Rack: ${med.rackId}` : ""}
                      </p>
                    </div>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-[4px] ${med.status === "IN STOCK" ? "bg-[#dcfce7] text-[#15803d]" : "bg-[#fef3c7] text-[#b45309]"}`}>
                      {med.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Doctor&apos;s Notes (Read-only)</label>
              <div className="w-full min-h-[80px] p-4 bg-[#f8f9fc] dark:bg-[#1e293b]/50 border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-bold text-[#64748b] opacity-80 leading-relaxed">
                {prescription.instructions || consultation?.followUpNotes || "No notes from doctor."}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Pharmacist Notes</label>
              <textarea
                placeholder="Add dispensing notes..."
                value={pharmacistNotes}
                onChange={(e) => setPharmacistNotes(e.target.value)}
                className="w-full min-h-[80px] p-4 bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-bold text-[#1e293b] dark:text-white outline-none focus:border-primary transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="lg:col-span-5 space-y-[20px]">
          {/* Billing Details */}
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] space-y-5">
            <div className="flex items-center gap-2">
              <CreditCard size={18} className="text-[#2e37a4]" />
              <h2 className="text-[15px] font-bold text-[#1e293b] dark:text-white">Billing Details</h2>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <p className="text-[10px] font-bold text-[#64748b] uppercase tracking-tight opacity-70 mb-1">Patient</p>
                <p className="text-[13px] font-bold text-[#1e293b] dark:text-white">
                  {patient?.name || "—"}{patient?.contact ? ` · ${patient.contact}` : ""}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#64748b] uppercase tracking-tight opacity-70 mb-1">Age / Gender</p>
                <p className="text-[13px] font-bold text-[#1e293b] dark:text-white">
                  {patient?.age ? `${patient.age} yrs` : "—"} / {patient?.gender || "—"}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] font-bold text-[#64748b] uppercase tracking-tight opacity-70 mb-1">Insurance / Scheme</p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center justify-between w-full h-11 px-4 bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-bold text-[#1e293b] dark:text-white hover:bg-gray-50 transition-all outline-none group data-[state=open]:border-primary shadow-none">
                      <span className="truncate">{insuranceScheme}</span>
                      <ChevronDown className="w-4 h-4 text-[#64748b] transition-transform group-data-[state=open]:rotate-180" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[280px]">
                    {INSURANCE_OPTIONS.map((s) => (
                      <DropdownMenuItem key={s} onClick={() => { setInsuranceScheme(s); if (s === "None") setInsuranceCoverage(0); }} className="font-bold text-[13px]">{s}</DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {insuranceScheme !== "None" && (
                <>
                  <div className="col-span-2">
                    <p className="text-[10px] font-bold text-[#64748b] uppercase tracking-tight opacity-70 mb-1">Insurance ID</p>
                    <input type="text" value={insuranceId} onChange={(e) => setInsuranceId(e.target.value)} placeholder="e.g. POL-98234-A" className="w-full h-11 px-4 bg-[#f8fafc] dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-bold text-[#1e293b] dark:text-white outline-none focus:border-primary" />
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] font-bold text-[#64748b] uppercase tracking-tight opacity-70 mb-1">Coverage Amount (₹)</p>
                    <input type="number" min="0" value={insuranceCoverage} onChange={(e) => setInsuranceCoverage(e.target.value)} className="w-full h-11 px-4 bg-[#f8fafc] dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-bold text-[#1e293b] dark:text-white outline-none focus:border-primary" />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Bill Summary */}
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] space-y-4">
            <h2 className="text-[15px] font-bold text-[#1e293b] dark:text-white">Bill Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[13px] font-bold text-[#64748b]">
                <span>Subtotal</span>
                <span className="text-[#1e293b] dark:text-white">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-[13px] font-bold text-[#64748b]">
                <span>Discount</span>
                <div className="flex items-center gap-1">
                  <input type="number" min="0" max="100" value={discount} onChange={(e) => setDiscount(e.target.value)} className="w-12 h-7 text-center bg-[#f8fafc] dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-[4px] text-[12px] font-bold outline-none focus:border-primary" />
                  <span className="text-[11px]">%</span>
                </div>
              </div>
              {insuranceAmt > 0 && (
                <div className="flex justify-between items-center text-[13px] font-bold text-[#22c55e]">
                  <span>Insurance Coverage</span>
                  <span>-₹{insuranceAmt.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-[13px] font-bold text-[#64748b]">
                <span>Tax (5%)</span>
                <span className="text-[#1e293b] dark:text-white">₹{tax.toFixed(2)}</span>
              </div>
              <div className="pt-4 border-t border-[#f1f5f9] dark:border-[#334155] flex justify-between items-center">
                <span className="text-[16px] font-bold text-[#1e293b] dark:text-white">Net Payable</span>
                <span className="text-[24px] font-bold text-[#2e37a4]">₹{netPayable.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155]">
            <h2 className="text-[15px] font-bold text-[#1e293b] dark:text-white mb-4">Payment Method</h2>
            <div className="grid grid-cols-3 gap-3">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.name}
                  onClick={() => setSelectedPayment(method.name)}
                  className={`flex flex-col items-center justify-center gap-2 p-4 rounded-[5px] border transition-all ${
                    selectedPayment === method.name
                      ? "border-[#2e37a4] bg-[#2e37a4]/5 text-[#2e37a4]"
                      : "border-[#e2e8f0] dark:border-[#334155] text-[#64748b] hover:bg-[#f8fafc] dark:hover:bg-[#334155]"
                  }`}
                >
                  <method.icon size={20} />
                  <span className="text-[11px] font-bold">{method.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Confirm & Dispense */}
          <button
            onClick={handleOpenDialog}
            className="w-full h-12 bg-[#2e37a4] text-white rounded-[5px] text-[14px] font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            Confirm &amp; Dispense <Check size={18} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* ── Complete Transaction Modal ── */}
      <AnimatePresence>
        {isDialogOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !dispensing && setIsDialogOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-[4px]"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white dark:bg-[#101935] w-full max-w-[450px] rounded-[12px] overflow-hidden shadow-2xl border border-gray-100 dark:border-white/5"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-[5px] bg-[#2e37a4]/10 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-[#2e37a4]" />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-[#1e293b] dark:text-white leading-none">Complete Transaction</h3>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 font-medium">Finalize payment and handover</p>
                  </div>
                </div>
                <button onClick={() => !dispensing && setIsDialogOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* Summary row */}
                <div className="flex gap-4 p-4 bg-[#f8f9fc] dark:bg-[#1e293b]/50 border border-[#e2e8f0] dark:border-[#334155] rounded-[5px]">
                  <div className="flex-1 border-r border-[#e2e8f0] dark:border-[#334155] pr-4">
                    <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-tight opacity-70 mb-2">Total Amount Due</p>
                    <p className="text-[28px] font-bold text-[#2e37a4]">₹{netPayable.toFixed(2)}</p>
                  </div>
                  <div className="flex-1 space-y-3 pl-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#64748b] opacity-70">Payment:</span>
                      <span className="text-[11px] font-bold text-[#1e293b] dark:text-white flex items-center gap-1">
                        <Banknote size={12} className="text-[#2e37a4]" /> {selectedPayment}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#64748b] opacity-70">Items:</span>
                      <span className="text-[11px] font-bold text-[#1e293b] dark:text-white">{items.length} Medicine{items.length !== 1 ? "s" : ""}</span>
                    </div>
                  </div>
                </div>

                {/* Amount received */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Amount Received (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={amountReceived}
                    onChange={(e) => setAmountReceived(e.target.value)}
                    className="w-full h-12 px-4 bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[16px] font-bold text-[#1e293b] dark:text-white outline-none focus:border-primary transition-all"
                  />
                </div>

                {/* Change */}
                {!isNaN(change) && parseFloat(amountReceived) > 0 && (
                  <div className={`p-4 rounded-[5px] flex justify-between items-center border ${change >= 0 ? "bg-[#f0fdf4] border-[#dcfce7] dark:border-[#065f46]" : "bg-[#fef2f2] border-[#fecaca]"}`}>
                    <span className={`text-[13px] font-bold ${change >= 0 ? "text-[#15803d]" : "text-[#dc2626]"}`}>
                      {change >= 0 ? "Change to Return:" : "Amount Short:"}
                    </span>
                    <span className={`text-[20px] font-bold ${change >= 0 ? "text-[#15803d]" : "text-[#dc2626]"}`}>
                      ₹{Math.abs(change).toFixed(2)}
                    </span>
                  </div>
                )}

                {/* Print receipt */}
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={printReceipt}
                      onChange={(e) => setPrintReceipt(e.target.checked)}
                      className="peer appearance-none w-5 h-5 border-2 border-[#e2e8f0] dark:border-[#334155] rounded-[4px] checked:bg-[#2e37a4] checked:border-[#2e37a4] transition-all"
                    />
                    <Check size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 transition-all" strokeWidth={4} />
                  </div>
                  <span className="text-[12px] font-bold text-[#475569] dark:text-[#cbd5e1]">Print receipt automatically after completion</span>
                </label>

                {/* Buttons */}
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => setIsDialogOpen(false)}
                    disabled={dispensing}
                    className="flex-1 h-11 border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-bold text-[#64748b] hover:bg-gray-50 transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDispense}
                    disabled={dispensing}
                    className="flex-[2] px-8 h-11 bg-[#2e37a4] text-white rounded-[5px] text-[13px] font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {dispensing ? <><Loader2 size={14} className="animate-spin" /> Processing...</> : <><Check size={16} strokeWidth={3} /> Mark as Paid</>}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
