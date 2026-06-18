"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  CalendarDays,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  MessageSquareText,
  Paperclip,
  ReceiptText,
  UserRound,
  X,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const rupee = "\u20B9"; // Indian Rupee symbol

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

function getAuthHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("authtoken") : "";
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function DiscountTypePill({ value }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#F1F3F4] px-[10px] py-[3px] text-[12px] font-medium text-[#5F6368] dark:bg-white/10 dark:text-slate-300">
      {value}
    </span>
  );
}

export default function ReviewDiscountPage() {
  const router = useRouter();
  const params = useParams();
  const requestId = params.id;

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (requestId) {
      fetchRequest();
    }
  }, [requestId]);

  const fetchRequest = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/billing/discounts/${requestId}`, { headers: getAuthHeaders() });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || `Error ${res.status}`);
      
      const req = json.data;
      const p = req.bill?.patient;
      const patientName = p
        ? `${p.firstName || ""} ${p.lastName || ""}`.trim() || p.name || "Unknown"
        : "Unknown";
      const patientInitials = patientName
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "UN";

      const age = p?.age || "N/A";
      const gender = p?.gender || "N/A";
      const uhid = p ? `UHID-${p.id.substring(0, 6).toUpperCase()}` : "—";
      const patientMeta = `UHID: ${uhid.replace("UHID-", "")} • ${gender} • ${age} Yrs`;

      const statusMap = {
        PENDING: "Pending",
        APPROVED: "Approved",
        REJECTED: "Rejected",
      };
      const status = statusMap[req.status] || req.status;

      const grossTotal = req.bill?.subtotal || 0;
      const proposedDiscount = req.discountAmount || 0;
      const revisedNetPayable = Math.max(0, grossTotal - proposedDiscount);

      const formattedDate = new Date(req.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      // Extract category from reason if formatted as [Category] Reason
      const matches = req.reason ? req.reason.match(/^\[(.*?)\]/) : null;
      const discountType = matches ? matches[1] : (req.discountType === "PERCENTAGE" || req.discountType === "FLAT" ? "Hardship" : req.discountType);
      const cleanReason = req.reason ? req.reason.replace(/^\[.*?\]\s*/, "") : "No reason provided";

      setRequest({
        id: req.id,
        patientName,
        patientInitials,
        patientMeta,
        billNumber: req.billId,
        discountType,
        amount: `${rupee}${proposedDiscount.toFixed(2)}`,
        percentage: req.discountType === "PERCENTAGE" ? `${req.discountValue}%` : "Flat",
        requestedBy: req.requestedBy || "Dr. Attending",
        status,
        requestedAt: formattedDate,
        grossTotal: `${rupee}${grossTotal.toFixed(2)}`,
        proposedDiscount: `-${rupee}${proposedDiscount.toFixed(2)}`,
        revisedNetPayable: `${rupee}${revisedNetPayable.toFixed(2)}`,
        reason: cleanReason,
        documentName: "Supporting_Doc.pdf",
        documentMeta: `${formattedDate.split(",")[0]} • 500 KB`,
        raw: req
      });
    } catch (e) {
      console.error("fetchRequest error:", e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/finance/discounts');
  };

  const handleAction = async (status) => {
    try {
      setActionLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/billing/discounts/${requestId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || `Error ${res.status}`);
      
      router.push('/finance/discounts');
    } catch (e) {
      console.error("handleAction error:", e);
      setError(e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprove = () => {
    handleAction("APPROVED");
  };

  const handleReject = () => {
    handleAction("REJECTED");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-[20px] bg-[#F8F9FC] dark:bg-[#0A0F1D]">
        <span className="animate-spin h-8 w-8 border-t-2 border-b-2 border-[#2E37A4] rounded-full mb-4"></span>
        <p className="text-[14px] text-slate-500 font-medium">Loading discount request details...</p>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-[20px] bg-[#F8F9FC] dark:bg-[#0A0F1D]">
        <h1 className="text-[20px] font-bold text-rose-500 mb-4">{error || "Request Not Found"}</h1>
        <Button onClick={handleBack} className="bg-[#2E37A4] hover:bg-[#2E37A4]/90">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Discounts
        </Button>
      </div>
    );
  }

  const statusStyles = {
    Approved: "bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6]",
    Pending: "bg-[#FEF7E0] text-[#B06000] border border-[#FEEFC3]",
    Rejected: "bg-[#FCE8E6] text-[#C5221F] border border-[#FAD2CF]",
  };

  const isPending = request.status === "Pending";

  return (
    <div className="flex flex-col gap-0 min-h-screen bg-[#F8F9FC] dark:bg-[#0A0F1D]">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between border-b border-[#E7E8EB] bg-white px-[20px] py-[16px] dark:border-white/10 dark:bg-[#101935]">
        <div className="flex items-center gap-[10px]">
          <button
            type="button"
            onClick={handleBack}
            className="rounded-[5px] p-1.5 text-slate-400 hover:bg-[#F8F9FC] hover:text-slate-700 dark:hover:bg-white/10 transition cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-[16px] font-bold text-slate-800 dark:text-white">
            Request {request.id}
          </h2>
          <span className={cn("inline-flex items-center justify-center rounded-full px-[10px] py-[3px] text-[12px] font-semibold min-w-[76px]", statusStyles[request.status])}>
            {request.status}
          </span>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="overflow-y-auto p-[20px] flex flex-col gap-[16px]">
        {/* Summary */}
        <div className="rounded-[5px] border border-[#E7E8EB] bg-white p-[16px] dark:border-white/10 dark:bg-[#101935] flex flex-col gap-[14px]">
          <div className="flex items-center gap-2 text-[13px] font-bold text-slate-800 dark:text-white">
            <FileText className="h-4 w-4 text-[#2E37A4]" />
            <span>Request Summary</span>
          </div>
          <div className="grid gap-[14px] sm:grid-cols-2 md:grid-cols-4">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-slate-500">Requested By</span>
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-[10px] font-bold text-violet-700 shrink-0">
                  {request.requestedBy.replace("Dr.", "").trim().split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <span className="text-[13px] font-medium text-slate-700 dark:text-slate-300 truncate">{request.requestedBy}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-slate-500">Date & Time</span>
              <div className="flex items-center gap-1 text-[12px] font-medium text-slate-700 dark:text-slate-300">
                <CalendarDays className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span>{request.requestedAt}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-slate-500">Discount Type</span>
              <DiscountTypePill value={request.discountType} />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-slate-500">Requested Amount</span>
              <div className="flex items-center gap-1 text-[13px] font-bold text-[#2E37A4]">
                <span>{request.amount}</span>
                <span className="text-[11px] font-medium text-slate-400">({request.percentage})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Patient & Bill */}
        <div className="rounded-[5px] border border-[#E7E8EB] bg-white p-[16px] dark:border-white/10 dark:bg-[#101935] flex flex-col gap-[14px]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-[13px] font-bold text-slate-800 dark:text-white">
              <UserRound className="h-4 w-4 text-[#2E37A4]" />
              <span>Patient & Bill Details</span>
            </div>
            <button type="button" className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#2E37A4] hover:underline">
              <span>View Full Bill</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="rounded-[5px] border border-[#E7E8EB] bg-[#F8F9FC] p-[14px] flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-[12px] font-bold text-blue-700 shrink-0">
              {request.patientInitials}
            </div>
            <div>
              <p className="text-[13px] font-bold text-slate-800 dark:text-white">{request.patientName}</p>
              <p className="text-[11px] font-medium text-slate-500">{request.patientMeta}</p>
            </div>
          </div>
          <div className="flex flex-col gap-[10px] text-[13px]">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Bill Number</span>
              <span className="font-bold text-slate-800 dark:text-white">{request.billNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Gross Total</span>
              <span className="font-bold text-slate-800 dark:text-white">{request.grossTotal}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Proposed Discount</span>
              <span className="rounded-[4px] bg-blue-50 px-2 py-0.5 font-bold text-[#2E37A4]">{request.proposedDiscount}</span>
            </div>
            <div className="border-t border-[#E7E8EB] pt-[10px] flex justify-between items-center">
              <span className="text-[13px] font-bold text-slate-800 dark:text-white">Revised Net Payable</span>
              <span className="text-[16px] font-bold text-slate-800 dark:text-white">{request.revisedNetPayable}</span>
            </div>
          </div>
        </div>

        {/* Reason & Docs */}
        <div className="rounded-[5px] border border-[#E7E8EB] bg-white p-[16px] dark:border-white/10 dark:bg-[#101935] flex flex-col gap-[14px]">
          <div className="flex items-center gap-2 text-[13px] font-bold text-slate-800 dark:text-white">
            <ReceiptText className="h-4 w-4 text-[#2E37A4]" />
            <span>Reason & Documents</span>
          </div>
          <div className="rounded-[5px] border border-[#E7E8EB] bg-[#F8F9FC] p-[14px] text-[13px] font-medium italic leading-relaxed text-slate-500">
            &quot;{request.reason}&quot;
          </div>
          <div className="flex items-center justify-between gap-4 rounded-[5px] border border-[#E7E8EB] bg-white p-[14px]">
            <div className="flex items-center gap-3">
              <div className="rounded-[5px] bg-rose-50 p-2 shrink-0">
                <Paperclip className="h-4 w-4 text-rose-500" />
              </div>
              <div>
                <p className="text-[13px] font-bold text-slate-800 dark:text-white truncate">{request.documentName}</p>
                <p className="text-[11px] font-medium text-slate-400">{request.documentMeta}</p>
              </div>
            </div>
            <button type="button" className="rounded-[5px] border border-[#E7E8EB] p-2 text-slate-500 hover:bg-[#F8F9FC] hover:text-[#2E37A4] transition cursor-pointer" aria-label="Download">
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-[#E7E8EB] bg-white px-[20px] py-[14px] dark:border-white/10 dark:bg-[#101935]">
        <Button variant="outline" className="h-[36px] rounded-[5px] border-[#E7E8EB] bg-white px-4 text-[13px] font-semibold text-slate-700 hover:bg-[#F8F9FC] shadow-none cursor-pointer">
          <MessageSquareText className="mr-2 h-4 w-4 text-slate-500" />
          Request Info
        </Button>
        <div className="flex items-center gap-3">
          <Button variant="outline" disabled={!isPending || actionLoading} onClick={handleReject}
            className={cn("h-[36px] rounded-[5px] px-4 text-[13px] font-semibold shadow-none cursor-pointer",
              isPending ? "border-rose-200 bg-white text-rose-500 hover:bg-rose-50" : "border-slate-200 bg-slate-100 text-slate-400"
            )}>
            <XCircle className="mr-2 h-4 w-4" />
            Reject
          </Button>
          <Button disabled={!isPending || actionLoading} onClick={handleApprove}
            className={cn("h-[36px] rounded-[5px] px-4 text-[13px] font-semibold shadow-none cursor-pointer",
              isPending ? "bg-[#2E37A4] text-white hover:bg-[#2E37A4]/90" : "bg-slate-200 text-slate-400"
            )}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Approve
          </Button>
        </div>
      </div>
    </div>
  );
}
