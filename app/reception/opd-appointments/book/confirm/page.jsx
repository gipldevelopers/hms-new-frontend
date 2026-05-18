"use client";

import React from "react";
import {
  ArrowRight, Check, Printer, MessageSquare, PhoneCall,
  UserCheck, Info, Loader2, AlertCircle, ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const CONSULT_FEE = 500;
const REG_FEE = 50;
const TAX_RATE = 0.05;

function calcBilling(discount = 0) {
  const subtotal = CONSULT_FEE + REG_FEE;
  const disc = Math.min(discount, subtotal);
  const taxable = subtotal - disc;
  const tax = parseFloat((taxable * TAX_RATE).toFixed(2));
  const total = parseFloat((taxable + tax).toFixed(2));
  return { subtotal, disc, tax, total };
}

function formatDateTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }) +
    ", " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

export default function BookAppointmentStep3() {
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL;
  const headers = () => ({ Authorization: `Bearer ${localStorage.getItem("authtoken")}` });

  const [step1, setStep1] = React.useState(null);
  const [step2, setStep2] = React.useState(null);

  const [discountInput, setDiscountInput] = React.useState("");
  const [discount, setDiscount] = React.useState(0);
  const [discountError, setDiscountError] = React.useState("");

  const [booking, setBooking] = React.useState(false);
  const [bookError, setBookError] = React.useState("");
  const [confirmed, setConfirmed] = React.useState(null); // appointment data after booking

  const billing = calcBilling(discount);

  // Load session data
  React.useEffect(() => {
    const s1 = sessionStorage.getItem("appt_step1");
    const s2 = sessionStorage.getItem("appt_step2");
    if (!s1 || !s2) { router.replace("/reception/opd-appointments/book"); return; }
    setStep1(JSON.parse(s1));
    setStep2(JSON.parse(s2));
  }, []);

  const applyDiscount = () => {
    const val = parseFloat(discountInput);
    if (isNaN(val) || val < 0) { setDiscountError("Enter a valid amount."); return; }
    if (val > CONSULT_FEE + REG_FEE) { setDiscountError("Discount cannot exceed total."); return; }
    setDiscount(val);
    setDiscountError("");
  };

  const handleBook = async () => {
    if (!step1 || !step2) return;
    setBooking(true);
    setBookError("");
    try {
      const res = await fetch(`${API}/appointments`, {
        method: "POST",
        headers: { ...headers(), "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId:     step1.patient.id,
          doctorId:      step2.doctor?.id || null,
          doctorName:    step2.doctor?.name || null,
          departmentId:  step1.dept?.id || null,
          departmentName: step1.dept?.name || null,
          dateTime:      step2.dateTime,
          fee:           billing.total,
          notes:         null,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Booking failed.");
      setConfirmed(json.data);
      // Clear session
      sessionStorage.removeItem("appt_step1");
      sessionStorage.removeItem("appt_step2");
    } catch (e) {
      setBookError(e.message);
    } finally {
      setBooking(false);
    }
  };

  const handleCheckIn = async () => {
    if (!confirmed) return;
    try {
      await fetch(`${API}/appointments/${confirmed.id}/status`, {
        method: "PATCH",
        headers: { ...headers(), "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CHECKED_IN" }),
      });
      router.push("/reception/opd-appointments");
    } catch (e) { console.error(e); }
  };

  const handlePrint = () => {
    if (!confirmed) return;
    window.print();
  };

  // ── Confirmed state ──────────────────────────────────────────────────────────
  if (confirmed) {
    return (
      <div className="flex flex-col min-h-screen bg-background p-5 gap-5">
        <div className="flex items-center justify-between">
          <h1 className="text-[20px] font-bold text-foreground">Book Appointment: Step 3</h1>
          <div className="flex items-center gap-2 text-[12px] font-bold text-muted-foreground">
            <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[11px]">1</span>
            <span className="text-muted-foreground">Select</span>
            <span className="text-muted-foreground/40">›</span>
            <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[11px]">2</span>
            <span className="text-muted-foreground">Doctor</span>
            <span className="text-muted-foreground/40">›</span>
            <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-[11px]">3</span>
            <span className="text-primary">Confirm</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
          {/* Billing summary (read-only) */}
          <div className="bg-card border border-border rounded-[5px] overflow-hidden">
            <div className="p-4 sm:p-6 space-y-5">
              <h2 className="text-[14px] font-bold text-foreground">Billing Summary</h2>
              <div className="border border-border rounded-[5px] overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/30 border-b border-border">
                      <th className="px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase">Item</th>
                      <th className="px-4 py-3 text-[11px] font-bold text-muted-foreground text-right uppercase">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr><td className="px-4 py-3 text-[13px] font-medium text-foreground">Consultation Fee</td><td className="px-4 py-3 text-[13px] font-medium text-foreground text-right">₹{CONSULT_FEE.toFixed(2)}</td></tr>
                    <tr><td className="px-4 py-3 text-[13px] font-medium text-foreground">Registration Fee</td><td className="px-4 py-3 text-[13px] font-medium text-foreground text-right">₹{REG_FEE.toFixed(2)}</td></tr>
                    <tr><td className="px-4 py-3 text-[13px] font-medium text-[#00A389]">Discount</td><td className="px-4 py-3 text-[13px] font-medium text-[#00A389] text-right">- ₹{billing.disc.toFixed(2)}</td></tr>
                    <tr><td className="px-4 py-3 text-[13px] font-medium text-foreground">Tax (5%)</td><td className="px-4 py-3 text-[13px] font-medium text-foreground text-right">₹{billing.tax.toFixed(2)}</td></tr>
                  </tbody>
                  <tfoot>
                    <tr className="bg-muted/30 border-t border-border">
                      <td className="px-4 py-3 text-[13px] font-bold text-foreground">Total Payable</td>
                      <td className="px-4 py-3 text-[13px] font-bold text-foreground text-right">₹{billing.total.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <div className="bg-[#F0F7FF] border border-[#BFDBFE] rounded-[5px] p-4 flex gap-3">
                <Info className="w-5 h-5 text-[#0066FF] shrink-0" />
                <div className="space-y-1">
                  <p className="text-[13px] font-bold text-[#0066FF]">Payment Handled by Billing</p>
                  <p className="text-[12px] text-[#0066FF]/80 leading-relaxed">Forward this patient to the billing department for fee collection.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Confirmation card */}
          <div className="bg-card border border-border rounded-[5px] p-6 sm:p-8 flex flex-col items-center text-center space-y-6">
            <div className="space-y-3 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#E6F8F3] flex items-center justify-center">
                <Check className="w-8 h-8 text-[#00A389]" />
              </div>
              <h2 className="text-[18px] font-bold text-foreground">Appointment Confirmed</h2>
            </div>

            <div className="w-full border border-border rounded-[5px] overflow-hidden bg-card">
              <div className="p-4 border-b border-muted/30 flex justify-between items-center gap-4">
                <div className="text-left space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Appointment ID</p>
                  <p className="text-[12px] font-bold text-foreground truncate">{confirmed.id.slice(0, 13).toUpperCase()}</p>
                </div>
                <div className="text-right space-y-1 shrink-0">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Token</p>
                  <p className="text-[24px] font-bold text-primary leading-none">{confirmed.tokenNumber || "—"}</p>
                </div>
              </div>
              <div className="p-4 grid grid-cols-2 gap-y-5 text-left border-b border-muted/20">
                <div className="space-y-1 overflow-hidden">
                  <p className="text-[11px] font-medium text-muted-foreground uppercase">Patient</p>
                  <p className="text-[13px] font-bold text-foreground truncate">{confirmed.patient?.name || "—"}</p>
                </div>
                <div className="space-y-1 overflow-hidden">
                  <p className="text-[11px] font-medium text-muted-foreground uppercase">Doctor</p>
                  <p className="text-[13px] font-bold text-foreground truncate">{confirmed.doctorName || "—"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-medium text-muted-foreground uppercase">Department</p>
                  <p className="text-[13px] font-bold text-foreground">{confirmed.departmentName || "—"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-medium text-muted-foreground uppercase">Schedule</p>
                  <p className="text-[12px] font-bold text-foreground">{formatDateTime(confirmed.dateTime)}</p>
                </div>
              </div>
            </div>

            <div className="w-full grid grid-cols-2 gap-3">
              <button onClick={handlePrint} className="h-10 border border-border bg-card rounded-[5px] text-[12px] font-bold text-foreground hover:bg-muted flex items-center justify-center gap-2 transition-all">
                <Printer className="w-4 h-4 text-muted-foreground" /> Print Slip
              </button>
              <button className="h-10 border border-border bg-card rounded-[5px] text-[12px] font-bold text-foreground hover:bg-muted flex items-center justify-center gap-2 transition-all">
                <MessageSquare className="w-4 h-4 text-muted-foreground" /> Send SMS
              </button>
              <button className="h-10 border border-border bg-card rounded-[5px] text-[12px] font-bold text-foreground hover:bg-muted flex items-center justify-center gap-2 transition-all">
                <PhoneCall className="w-4 h-4 text-muted-foreground" /> WhatsApp
              </button>
              <button onClick={handleCheckIn} className="h-10 bg-primary text-white rounded-[5px] text-[12px] font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all">
                <UserCheck className="w-4 h-4" /> Check-In
              </button>
            </div>

            <button onClick={() => router.push("/reception/opd-appointments")}
              className="text-[12px] font-bold text-primary hover:underline">
              ← Back to Today&apos;s Schedule
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Pre-booking state ────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-screen bg-background p-5 gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-[20px] font-bold text-foreground">Book Appointment: Step 3</h1>
        <div className="flex items-center gap-2 text-[12px] font-bold text-muted-foreground">
          <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[11px]">1</span>
          <span className="text-muted-foreground">Select</span>
          <span className="text-muted-foreground/40">›</span>
          <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[11px]">2</span>
          <span className="text-muted-foreground">Doctor</span>
          <span className="text-muted-foreground/40">›</span>
          <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-[11px]">3</span>
          <span className="text-primary">Confirm</span>
        </div>
      </div>

      {/* Context banner */}
      {step1 && step2 && (
        <div className="flex flex-wrap items-center gap-3 p-3 bg-muted/30 border border-border rounded-[5px] text-[12px] font-medium text-muted-foreground">
          <span>Patient: <strong className="text-foreground">{step1.patient?.name}</strong></span>
          <span className="text-border">|</span>
          <span>Doctor: <strong className="text-foreground">{step2.doctor?.name || "Walk-in"}</strong></span>
          <span className="text-border">|</span>
          <span>Slot: <strong className="text-foreground">{formatDateTime(step2.dateTime)}</strong></span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">

        {/* Billing */}
        <div className="bg-card border border-border rounded-[5px] flex flex-col overflow-hidden">
          <div className="p-4 sm:p-6 space-y-5">
            <h2 className="text-[14px] font-bold text-foreground">Billing Details</h2>
            <div className="border border-border rounded-[5px] overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/30 border-b border-border">
                    <th className="px-4 py-3 text-[11px] font-bold text-muted-foreground uppercase">Item</th>
                    <th className="px-4 py-3 text-[11px] font-bold text-muted-foreground text-right uppercase">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr><td className="px-4 py-3 text-[13px] font-medium text-foreground">Consultation Fee</td><td className="px-4 py-3 text-[13px] font-medium text-foreground text-right">₹{CONSULT_FEE.toFixed(2)}</td></tr>
                  <tr><td className="px-4 py-3 text-[13px] font-medium text-foreground">Registration Fee</td><td className="px-4 py-3 text-[13px] font-medium text-foreground text-right">₹{REG_FEE.toFixed(2)}</td></tr>
                  <tr><td className="px-4 py-3 text-[13px] font-medium text-[#00A389]">Discount</td><td className="px-4 py-3 text-[13px] font-medium text-[#00A389] text-right">- ₹{billing.disc.toFixed(2)}</td></tr>
                  <tr><td className="px-4 py-3 text-[13px] font-medium text-foreground">Tax (5%)</td><td className="px-4 py-3 text-[13px] font-medium text-foreground text-right">₹{billing.tax.toFixed(2)}</td></tr>
                </tbody>
                <tfoot>
                  <tr className="bg-muted/30 border-t border-border">
                    <td className="px-4 py-3 text-[13px] font-bold text-foreground">Total Payable</td>
                    <td className="px-4 py-3 text-[13px] font-bold text-foreground text-right">₹{billing.total.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Discount input */}
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-muted-foreground">Manual Discount / Insurance</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="number"
                  min="0"
                  placeholder="Amount (₹)"
                  className="flex-1 h-11 px-4 bg-background border border-border rounded-[5px] text-[13px] font-medium outline-none focus:border-primary transition-all"
                  value={discountInput}
                  onChange={(e) => setDiscountInput(e.target.value)}
                />
                <button
                  onClick={applyDiscount}
                  className="w-full sm:w-auto h-11 px-6 bg-card border border-border rounded-[5px] text-[13px] font-bold text-foreground hover:bg-muted transition-all"
                >
                  Apply
                </button>
              </div>
              {discountError && <p className="text-[12px] text-red-500 font-medium">{discountError}</p>}
            </div>

            <div className="bg-[#F0F7FF] border border-[#BFDBFE] rounded-[5px] p-4 flex gap-3">
              <Info className="w-5 h-5 text-[#0066FF] shrink-0" />
              <div className="space-y-1">
                <p className="text-[13px] font-bold text-[#0066FF]">Payment Handled by Billing</p>
                <p className="text-[12px] text-[#0066FF]/80 leading-relaxed">
                  Forward this patient to the billing department for final fee collection.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 border-t border-border flex flex-col-reverse sm:flex-row items-center justify-end gap-3 bg-card mt-auto">
            <button
              onClick={() => router.back()}
              className="w-full sm:w-auto h-11 px-8 border border-border text-foreground hover:bg-muted rounded-[5px] text-[13px] font-bold transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={handleBook}
              disabled={booking || !step1 || !step2}
              className="w-full sm:w-auto h-11 px-8 bg-primary text-white rounded-[5px] text-[13px] font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
            >
              {booking ? <><Loader2 className="w-4 h-4 animate-spin" /> Booking...</> : <>Confirm Appointment <ArrowRight className="w-4 h-4" /></>}
            </button>
          </div>

          {bookError && (
            <div className="mx-4 mb-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-[5px]">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <p className="text-[12px] text-red-600 font-medium">{bookError}</p>
            </div>
          )}
        </div>

        {/* Preview card */}
        <div className="bg-card border border-border rounded-[5px] p-6 sm:p-8 flex flex-col items-center text-center space-y-6">
          <div className="space-y-2 flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-muted/40 flex items-center justify-center">
              <Check className="w-7 h-7 text-muted-foreground/40" />
            </div>
            <h2 className="text-[16px] font-bold text-foreground">Appointment Preview</h2>
            <p className="text-[12px] text-muted-foreground">Review details before confirming</p>
          </div>

          {step1 && step2 && (
            <div className="w-full border border-border rounded-[5px] overflow-hidden bg-card">
              <div className="p-4 grid grid-cols-2 gap-y-5 text-left">
                <div className="space-y-1 overflow-hidden">
                  <p className="text-[11px] font-medium text-muted-foreground uppercase">Patient</p>
                  <p className="text-[13px] font-bold text-foreground truncate">{step1.patient?.name}</p>
                  <p className="text-[11px] text-muted-foreground">{step1.patient?.contact}</p>
                </div>
                <div className="space-y-1 overflow-hidden">
                  <p className="text-[11px] font-medium text-muted-foreground uppercase">Doctor</p>
                  <p className="text-[13px] font-bold text-foreground truncate">{step2.doctor?.name || "Walk-in / TBD"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-medium text-muted-foreground uppercase">Department</p>
                  <p className="text-[13px] font-bold text-foreground">{step1.dept?.name || "—"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-medium text-muted-foreground uppercase">Schedule</p>
                  <p className="text-[12px] font-bold text-foreground">{formatDateTime(step2.dateTime)}</p>
                </div>
                <div className="col-span-2 pt-2 border-t border-border/60">
                  <p className="text-[11px] font-medium text-muted-foreground uppercase">Total Fee</p>
                  <p className="text-[18px] font-bold text-primary">₹{billing.total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
