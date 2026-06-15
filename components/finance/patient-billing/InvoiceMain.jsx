"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Printer,
  Download,
  Mail,
  MessageSquare,
  Plus,
  X,
  Building2,
  CheckCircle2,
  ArrowLeft,
  AlertCircle,
  Loader2,
  FileX
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

function getAuthHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("authtoken") : "";
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };
}

// ---------------------------------------------------------------------------
// Loading skeleton — mirrors the invoice layout
// ---------------------------------------------------------------------------
function InvoiceSkeleton() {
  return (
    <div className="p-[20px] max-w-[1600px] mx-auto space-y-[20px] animate-pulse">
      <div className="flex items-center gap-[8px]">
        <div className="w-[36px] h-[36px] rounded-[5px] bg-muted" />
        <div className="space-y-1.5">
          <div className="h-4 w-40 bg-muted rounded" />
          <div className="h-3 w-56 bg-muted rounded" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-[20px]">
        <div className="lg:col-span-3 bg-card rounded-[5px] border border-border p-[20px] space-y-[20px]">
          <div className="h-12 bg-muted rounded" />
          <div className="h-[1px] bg-border" />
          <div className="grid grid-cols-2 gap-[20px]">
            <div className="space-y-2">
              {[40, 32, 24, 48].map((w, i) => (
                <div key={i} className={`h-3 bg-muted rounded`} style={{ width: `${w * 3}px` }} />
              ))}
            </div>
            <div className="space-y-2">
              {[56, 40, 64, 40].map((w, i) => (
                <div key={i} className={`h-3 bg-muted rounded`} style={{ width: `${w * 3}px` }} />
              ))}
            </div>
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 bg-muted rounded" />
            ))}
          </div>
        </div>
        <div className="bg-card rounded-[5px] border border-border p-[20px] space-y-3 h-fit">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-9 bg-muted rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Error state
// ---------------------------------------------------------------------------
function InvoiceError({ message, onBack }) {
  return (
    <div className="p-[20px] max-w-[1600px] mx-auto space-y-[20px]">
      <div className="flex items-center gap-[8px]">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-[36px] h-[36px] rounded-[5px] border border-[#E7E8EB] text-slate-600 hover:bg-[#F8F9FC] transition dark:border-white/10 dark:text-slate-400 dark:hover:bg-white/5 shadow-none"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="text-[16px] font-bold">Patient Billing Invoice</h1>
      </div>
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
          <FileX className="w-7 h-7 text-red-500" />
        </div>
        <p className="text-[15px] font-bold text-[#1e293b] dark:text-white">Invoice Not Found</p>
        <p className="text-[13px] text-slate-500 dark:text-slate-400 text-center max-w-sm">{message}</p>
        <button
          onClick={onBack}
          className="mt-2 h-[38px] px-5 bg-[#2E37A4] hover:bg-[#2E37A4]/90 text-white text-[13px] font-semibold rounded-[5px] transition cursor-pointer"
        >
          Back to Billing
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Empty state — bill exists but has no line items
// ---------------------------------------------------------------------------
function InvoiceEmpty({ invoiceNo, onBack }) {
  return (
    <div className="p-[20px] max-w-[1600px] mx-auto space-y-[20px]">
      <div className="flex items-center gap-[8px]">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-[36px] h-[36px] rounded-[5px] border border-[#E7E8EB] text-slate-600 hover:bg-[#F8F9FC] transition dark:border-white/10 dark:text-slate-400 dark:hover:bg-white/5 shadow-none"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="text-[16px] font-bold">Patient Billing Invoice</h1>
      </div>
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
          <AlertCircle className="w-7 h-7 text-muted-foreground" />
        </div>
        <p className="text-[15px] font-bold text-[#1e293b] dark:text-white">{invoiceNo}</p>
        <p className="text-[13px] text-slate-500 dark:text-slate-400">This invoice has no line items recorded.</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function InvoiceMain({ params, searchParams }) {
  const router = useRouter();

  // billId comes from URL params — e.g. /finance/patient-billing/invoice/[uhid]
  // The route passes either a real billId or a uhid. We use billId from params.
  const billId = params?.uhid || params?.billId || null;

  // Payment context passed from the Collect Payment dialog via query params
  const queryAmount  = searchParams?.amount  || null;
  const queryMethod  = searchParams?.method  || null;
  const queryRef     = searchParams?.ref     || null;
  const queryShowed  = searchParams?.paid    || null;   // "1" when arriving post-payment

  const [invoiceData, setInvoiceData]   = useState(null);
  const [loading,     setLoading]       = useState(true);
  const [error,       setError]         = useState(null);
  const [showBanner,  setShowBanner]    = useState(!!queryShowed || !!queryRef);

  useEffect(() => {
    if (!billId) {
      setError("No bill ID provided in the URL.");
      setLoading(false);
      return;
    }

    const fetchInvoice = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE}/billing/invoice/${billId}`, {
          headers: getAuthHeaders()
        });

        const json = await res.json();

        if (!res.ok || !json.success) {
          throw Object.assign(
            new Error(json.message || `Server error: ${res.status}`),
            { statusCode: res.status }
          );
        }

        setInvoiceData(json.data);
      } catch (e) {
        console.error("InvoiceMain fetch error:", e);
        setError(e.message || "Failed to load invoice.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [billId]);

  const handleBack = () => router.push("/finance/patient-billing");

  // ---------- render states ----------
  if (loading) return <InvoiceSkeleton />;
  if (error)   return <InvoiceError message={error} onBack={handleBack} />;
  if (!invoiceData) return <InvoiceError message="Invoice data could not be loaded." onBack={handleBack} />;
  if (!invoiceData.lineItems || invoiceData.lineItems.length === 0)
    return <InvoiceEmpty invoiceNo={invoiceData.invoiceNo} onBack={handleBack} />;

  // ---------- derived display values ----------
  const { patient, hospital, lineItems, billing, invoiceNo, invoiceDate } = invoiceData;

  const transactionId  = queryRef    || "—";
  const paymentMethod  = queryMethod || billing.paymentMethod || "—";
  const amountPaid     = queryAmount ? parseFloat(queryAmount) : billing.amountPaid;
  const balanceDue     = Math.max(0, billing.netPayable - amountPaid);
  const isPaid         = billing.status === "PAID" || amountPaid >= billing.netPayable;
  const statusText     = isPaid ? "PAID" : billing.status;

  const fmt = (n) => `₹${Number(n || 0).toFixed(2)}`;

  return (
    <div className="p-[20px] max-w-[1600px] mx-auto space-y-[20px] font-sans text-slate-800 dark:text-slate-200">

      {/* Back navigation */}
      <div className="flex items-center gap-[8px]">
        <button
          onClick={handleBack}
          className="flex items-center justify-center w-[36px] h-[36px] rounded-[5px] border border-[#E7E8EB] text-slate-600 hover:bg-[#F8F9FC] transition dark:border-white/10 dark:text-slate-400 dark:hover:bg-white/5 shadow-none"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-[16px] font-bold">Patient Billing Invoice</h1>
          <p className="text-[12px] text-slate-500">
            Patient Billing &gt; Invoice &gt; {patient.name}
          </p>
        </div>
      </div>

      {/* Payment success banner — shown when arriving right after payment collection */}
      {showBanner && (
        <div className="bg-[#E6F4EA] dark:bg-emerald-950/20 border border-[#CEEAD6] dark:border-emerald-800/30 rounded-[5px] p-[20px] flex items-center justify-between shadow-none transition-all">
          <div className="flex items-center gap-[12px]">
            <div className="w-[32px] h-[32px] rounded-full bg-[#137333] flex items-center justify-center text-white shrink-0">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-[14px] font-bold text-[#137333] dark:text-emerald-400">
                Payment Collected Successfully
              </h4>
              <p className="text-[12px] text-[#137333] dark:text-slate-400 mt-[2px]">
                {transactionId !== "—"
                  ? `Transaction ID: ${transactionId}. Invoice has been generated.`
                  : "Invoice has been generated."}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="p-[4px] hover:bg-[#DDF2E4]/50 dark:hover:bg-white/10 rounded-[5px] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-[#137333] dark:text-emerald-400" />
          </button>
        </div>
      )}

      {/* Invoice grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-[20px] items-start">

        {/* ── Invoice sheet ── */}
        <div className="lg:col-span-3 bg-white dark:bg-[#101935] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 p-[20px] shadow-none space-y-[20px]">

          {/* Hospital header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-[20px]">
            <div className="flex items-start gap-[16px]">
              <div className="w-[48px] h-[48px] bg-[#2E37A4] rounded-[5px] flex items-center justify-center text-white shrink-0">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-[18px] font-bold text-slate-800 dark:text-white leading-tight">
                  {hospital.name}
                </h3>
                {hospital.address && (
                  <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-[4px]">
                    {hospital.address}
                    {hospital.city ? `, ${hospital.city}` : ""}
                  </p>
                )}
                {hospital.contact && (
                  <p className="text-[12px] text-slate-400 dark:text-slate-500">
                    {hospital.contact}
                  </p>
                )}
              </div>
            </div>
            <div className="text-left sm:text-right">
              <h2 className="text-[24px] font-bold text-[#2E37A4] dark:text-[#9EA8FF] tracking-normal">
                Invoice
              </h2>
              <p className="text-[12px] font-bold text-slate-600 dark:text-slate-300 mt-[4px]">
                Invoice #: {invoiceNo}
              </p>
              <p className="text-[12px] text-slate-400 dark:text-slate-500">Date: {invoiceDate}</p>
            </div>
          </div>

          <div className="border-b border-[#E7E8EB] dark:border-white/10" />

          {/* Billed to / Payment info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px]">
            <div className="space-y-[6px]">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 block">
                Billed To
              </span>
              <h4 className="text-[14px] font-bold text-slate-800 dark:text-white">{patient.name}</h4>
              <p className="text-[12px] text-slate-500 dark:text-slate-400 font-semibold">
                UHID: {patient.uhid}
              </p>
              {patient.contact && (
                <p className="text-[12px] text-slate-400 dark:text-slate-500">{patient.contact}</p>
              )}
              {(patient.address || patient.city) && (
                <p className="text-[12px] text-slate-400 dark:text-slate-500 leading-relaxed">
                  {patient.address}
                  {patient.city ? `, ${patient.city}` : ""}
                  {patient.state ? `, ${patient.state}` : ""}
                </p>
              )}
            </div>

            <div className="space-y-[6px]">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 block">
                Payment Info
              </span>
              <div className="grid grid-cols-12 gap-[8px] text-[12px]">
                <span className="col-span-4 text-slate-400 dark:text-slate-500 font-bold">Status:</span>
                <span
                  className={`col-span-8 font-bold ${
                    isPaid
                      ? "text-[#137333] dark:text-[#81C995]"
                      : "text-[#D97706] dark:text-amber-400"
                  }`}
                >
                  {statusText}
                </span>

                <span className="col-span-4 text-slate-400 dark:text-slate-500 font-bold">Method:</span>
                <span className="col-span-8 text-slate-700 dark:text-slate-300 font-medium">
                  {paymentMethod}
                </span>

                {transactionId !== "—" && (
                  <>
                    <span className="col-span-4 text-slate-400 dark:text-slate-500 font-bold">
                      Transaction:
                    </span>
                    <span className="col-span-8 text-slate-700 dark:text-slate-300 font-medium">
                      {transactionId}
                    </span>
                  </>
                )}

                <span className="col-span-4 text-slate-400 dark:text-slate-500 font-bold">Type:</span>
                <span className="col-span-8 text-slate-700 dark:text-slate-300 font-medium">
                  {billing.type || "OPD"}
                </span>
              </div>
            </div>
          </div>

          <div className="border-b border-[#E7E8EB] dark:border-white/10" />

          {/* Services table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E7E8EB] dark:border-white/10">
                  <th className="pb-[10px] text-[12px] font-bold text-slate-400 dark:text-slate-500">
                    Service Description
                  </th>
                  <th className="pb-[10px] text-[12px] font-bold text-slate-400 dark:text-slate-500 text-center">
                    Qty
                  </th>
                  <th className="pb-[10px] text-[12px] font-bold text-slate-400 dark:text-slate-500 text-right">
                    Unit Price
                  </th>
                  <th className="pb-[10px] text-[12px] font-bold text-slate-400 dark:text-slate-500 text-right">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E8EB]/60 dark:divide-white/5">
                {lineItems.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-[12px] pr-[16px]">
                      <div className="text-[13px] font-bold text-slate-800 dark:text-white">
                        {item.name}
                      </div>
                      {item.doc && (
                        <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-[2px]">
                          {item.doc}
                        </div>
                      )}
                    </td>
                    <td className="py-[12px] text-center text-[13px] font-semibold text-slate-800 dark:text-white">
                      {item.qty}
                    </td>
                    <td className="py-[12px] text-right text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                      {fmt(item.price)}
                    </td>
                    <td className="py-[12px] text-right text-[13px] font-bold text-slate-800 dark:text-white">
                      {fmt(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Terms + totals */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-[20px] pt-[12px]">

            {/* Terms */}
            <div className="flex-1 flex flex-col justify-between self-stretch gap-[40px]">
              <div>
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 block">
                  Terms &amp; Conditions
                </span>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-[6px] max-w-[340px] leading-relaxed">
                  Payment is due within 30 days. For billing inquiries, contact your hospital
                  billing department.
                </p>
              </div>
              <div className="pt-[20px]">
                <div className="w-[200px] border-t border-[#E7E8EB] dark:border-white/10 pt-[8px]">
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 block">
                    Authorized Signature
                  </span>
                </div>
              </div>
            </div>

            {/* Calculation summary card */}
            <div className="bg-[#F8F9FC] dark:bg-white/5 border border-[#E7E8EB] dark:border-white/10 p-[20px] rounded-[5px] w-full md:w-[300px] space-y-[12px] shadow-none shrink-0">
              <div className="flex justify-between text-[12px] text-slate-500 dark:text-slate-400">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800 dark:text-white">
                  {fmt(billing.subtotal)}
                </span>
              </div>

              {billing.discount > 0 && (
                <div className="flex justify-between text-[12px] text-slate-500 dark:text-slate-400">
                  <span>Discount</span>
                  <span className="font-bold text-[#137333] dark:text-[#81C995]">
                    -{fmt(billing.discount)}
                  </span>
                </div>
              )}

              {billing.tax > 0 && (
                <div className="flex justify-between text-[12px] text-slate-500 dark:text-slate-400">
                  <span>Tax / GST</span>
                  <span className="font-semibold text-slate-800 dark:text-white">
                    {fmt(billing.tax)}
                  </span>
                </div>
              )}

              <div className="border-t border-dashed border-[#E7E8EB] dark:border-white/10 my-[8px]" />

              <div className="flex justify-between items-baseline">
                <span className="text-[12px] font-bold text-slate-800 dark:text-white">Net Payable</span>
                <span className="text-[16px] font-bold text-slate-800 dark:text-white">
                  {fmt(billing.netPayable)}
                </span>
              </div>

              <div className="flex justify-between items-baseline">
                <span className="text-[12px] font-bold text-slate-500 dark:text-slate-400">
                  Amount Paid
                </span>
                <span className="text-[14px] font-bold text-[#137333] dark:text-[#81C995]">
                  {fmt(amountPaid)}
                </span>
              </div>

              <div className="border-t border-dashed border-[#E7E8EB] dark:border-white/10 my-[8px]" />

              <div className="flex justify-between items-baseline">
                <span className="text-[12px] font-bold text-slate-700 dark:text-slate-300">
                  Balance Due
                </span>
                <span
                  className={`text-[16px] font-bold ${
                    balanceDue > 0
                      ? "text-[#EF4444]"
                      : "text-slate-800 dark:text-white"
                  }`}
                >
                  {fmt(balanceDue)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Action sidebar ── */}
        <div className="bg-white dark:bg-[#101935] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 p-[20px] shadow-none space-y-[12px] h-fit">
          <h3 className="text-[14px] font-bold text-slate-800 dark:text-white pb-[10px] border-b border-[#E7E8EB] dark:border-white/10">
            Invoice Actions
          </h3>

          <button
            onClick={() => window.print()}
            className="w-full h-[38px] bg-[#2E37A4] hover:bg-[#2E37A4]/90 text-white font-semibold rounded-[5px] text-[13px] flex items-center justify-center gap-[8px] cursor-pointer transition-colors shadow-none"
          >
            <Printer className="w-4 h-4 text-white" />
            Print Invoice
          </button>

          <button
            className="w-full h-[38px] bg-white hover:bg-slate-50 dark:bg-white/5 border border-[#E7E8EB] dark:border-white/10 text-slate-700 dark:text-white font-semibold rounded-[5px] text-[13px] flex items-center justify-center gap-[8px] cursor-pointer transition-colors shadow-none"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Download PDF
          </button>

          <button
            className="w-full h-[38px] bg-white hover:bg-slate-50 dark:bg-white/5 border border-[#E7E8EB] dark:border-white/10 text-slate-700 dark:text-white font-semibold rounded-[5px] text-[13px] flex items-center justify-center gap-[8px] cursor-pointer transition-colors shadow-none"
          >
            <Mail className="w-4 h-4 text-slate-500" />
            Email Invoice
          </button>

          <button
            className="w-full h-[38px] bg-[#E6F4EA] hover:bg-[#DDF2E4] border border-[#CEEAD6] text-[#137333] dark:bg-emerald-950/20 dark:border-emerald-800/30 dark:text-emerald-400 font-semibold rounded-[5px] text-[13px] flex items-center justify-center gap-[8px] cursor-pointer transition-colors shadow-none"
          >
            <MessageSquare className="w-4 h-4 text-[#137333] dark:text-emerald-400" />
            WhatsApp Share
          </button>

          <button
            onClick={() => router.push("/finance/patient-billing")}
            className="w-full h-[38px] bg-white hover:bg-slate-50 dark:bg-white/5 border border-[#E7E8EB] dark:border-white/10 text-slate-700 dark:text-white font-semibold rounded-[5px] text-[13px] flex items-center justify-center gap-[8px] cursor-pointer transition-all mt-[12px] shadow-none"
          >
            <Plus className="w-4 h-4 text-slate-500" />
            Create New Bill
          </button>
        </div>

      </div>
    </div>
  );
}
