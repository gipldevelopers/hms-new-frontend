"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  FinanceSearchField,
  FinanceSelect,
} from "@/components/finance/FinancePageChrome";
import {
  BadgePercent,
  Calculator,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleX,
  Clock3,
  Download,
  Eye,
  ExternalLink,
  FileText,
  MessageSquareText,
  Paperclip,
  PieChart,
  Plus,
  ReceiptText,
  Search,
  ShieldCheck,
  UploadCloud,
  UserRound,
  X,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const rupee = "\u20B9"; // Indian Rupee symbol

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

function getAuthHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("authtoken") : "";
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function mapDiscountRequest(req) {
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

  const discountTypeMap = {
    PERCENTAGE: "Percentage",
    FLAT: "Flat",
  };
  const discountType = req.discountType === "PERCENTAGE" || req.discountType === "FLAT"
    ? discountTypeMap[req.discountType]
    : req.discountType;

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

  return {
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
    reason: req.reason || "No reason provided",
    documentName: "Supporting_Doc.pdf",
    documentMeta: `${formattedDate.split(",")[0]} • 500 KB`,
    raw: req
  };
}

const statusOptions = ["All", "Approved", "Pending", "Rejected"];
const discountTypeOptions = ["Hardship / Financial Aid", "Corporate", "Staff Family", "Self Pay"];
const approverOptions = [
  "Dr. Sarah Smith (Director)",
  "Dr. James Wilson (Finance Head)",
  "Dr. Emily Taylor (Medical Superintendent)",
];
const selectedBill = {
  patientName: "Michael Chang", uhid: "882910",
  billNumber: "INV-44920", billDate: "Oct 15, 2023",
  billTotal: `${rupee}4,500.00`, balance: `${rupee}4,000.00`,
};

// Small Components

function StatCard({ card }) {
  const Icon = card.icon;
  return (
    <div className="flex items-center justify-between w-full rounded-[5px] border border-[#E7E8EB] bg-white p-[20px] dark:border-white/10 dark:bg-[#101935]">
      <div className="flex flex-col gap-[6px] min-w-0">
        <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400">
          {card.title}
        </p>
        <p className="text-[22px] font-bold text-slate-800 dark:text-white leading-none">
          {card.value}
        </p>
        <p className={cn("text-[12px] font-semibold", card.changePositive ? "text-[#137333]" : "text-[#C5221F]")}>
          <span>{card.change}</span>
          <span className="font-normal text-slate-400">{card.changeSuffix}</span>
        </p>
      </div>
      <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full ml-4", card.iconBg, card.iconColor)}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  const styles = {
    Approved: "bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6]",
    Pending: "bg-[#FEF7E0] text-[#B06000] border border-[#FEEFC3]",
    Rejected: "bg-[#FCE8E6] text-[#C5221F] border border-[#FAD2CF]",
  };
  return (
    <span className={cn(
      "inline-flex items-center justify-center rounded-full px-[10px] py-[3px] text-[12px] font-semibold min-w-[76px]",
      styles[status] || "bg-slate-100 text-slate-600 border border-slate-200"
    )}>
      {status}
    </span>
  );
}

function DiscountTypePill({ value }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#F1F3F4] px-[10px] py-[3px] text-[12px] font-medium text-[#5F6368] dark:bg-white/10 dark:text-slate-300">
      {value}
    </span>
  );
}

function SimpleDropdown({ value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o === value) || options[0];
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-[38px] min-w-[80px] items-center gap-[6px] rounded-[5px] border border-[#E7E8EB] bg-white px-[12px] text-[13px] font-medium text-slate-700 outline-none hover:border-[#2E37A4]/40 transition cursor-pointer dark:border-white/10 dark:bg-[#101935] dark:text-white"
      >
        <span>{selected}</span>
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 z-20 min-w-[110px] rounded-[5px] border border-[#E7E8EB] bg-white py-1 dark:border-white/10 dark:bg-[#101935]">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => { onChange(opt); setOpen(false); }}
                className={cn(
                  "flex w-full items-center px-[12px] py-[7px] text-left text-[13px] font-medium text-slate-700 hover:bg-[#F8F9FC] transition dark:text-white dark:hover:bg-white/5",
                  opt === value && "text-[#2E37A4] font-semibold bg-[#F8F9FC] dark:bg-white/5"
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Request Details Dialog

function RequestDetailsDialog({ request, open, onOpenChange }) {
  if (!request) return null;
  const statusStyles = {
    Approved: "bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6]",
    Pending: "bg-[#FEF7E0] text-[#B06000] border border-[#FEEFC3]",
    Rejected: "bg-[#FCE8E6] text-[#C5221F] border border-[#FAD2CF]",
  };
  const isPending = request.status === "Pending";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100vh-48px)] w-[calc(100vw-32px)] max-w-[680px] grid-rows-[auto_minmax(0,1fr)_auto] gap-0 rounded-[5px] border border-[#E7E8EB] bg-white p-0 shadow-none dark:border-white/10 dark:bg-[#101935]">
        <DialogTitle className="sr-only">Request Details</DialogTitle>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E7E8EB] px-[20px] py-[16px] dark:border-white/10">
          <div className="flex items-center gap-[10px]">
            <h2 className="text-[16px] font-bold text-slate-800 dark:text-white">
              Request {request.id}
            </h2>
            <span className={cn("inline-flex items-center justify-center rounded-full px-[10px] py-[3px] text-[12px] font-semibold min-w-[76px]", statusStyles[request.status])}>
              {request.status}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-[5px] p-1.5 text-slate-400 hover:bg-[#F8F9FC] hover:text-slate-700 dark:hover:bg-white/10 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto p-[20px] flex flex-col gap-[16px]">
          {/* Summary */}
          <div className="rounded-[5px] border border-[#E7E8EB] bg-white p-[16px] dark:border-white/10 dark:bg-[#0B1121] flex flex-col gap-[14px]">
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
          <div className="rounded-[5px] border border-[#E7E8EB] bg-white p-[16px] dark:border-white/10 dark:bg-[#0B1121] flex flex-col gap-[14px]">
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
          <div className="rounded-[5px] border border-[#E7E8EB] bg-white p-[16px] dark:border-white/10 dark:bg-[#0B1121] flex flex-col gap-[14px]">
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
        <div className="flex items-center justify-between border-t border-[#E7E8EB] bg-[#F8F9FC] px-[20px] py-[14px] dark:border-white/10 dark:bg-white/5">
          <Button variant="outline" className="h-[36px] rounded-[5px] border-[#E7E8EB] bg-white px-4 text-[13px] font-semibold text-slate-700 hover:bg-[#F8F9FC] shadow-none cursor-pointer">
            <MessageSquareText className="mr-2 h-4 w-4 text-slate-500" />
            Request Info
          </Button>
          <div className="flex items-center gap-3">
            <Button variant="outline" disabled={!isPending}
              className={cn("h-[36px] rounded-[5px] px-4 text-[13px] font-semibold shadow-none cursor-pointer",
                isPending ? "border-rose-200 bg-white text-rose-500 hover:bg-rose-50" : "border-slate-200 bg-slate-100 text-slate-400"
              )}>
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button disabled={!isPending}
              className={cn("h-[36px] rounded-[5px] px-4 text-[13px] font-semibold shadow-none cursor-pointer",
                isPending ? "bg-[#2E37A4] text-white hover:bg-[#2E37A4]/90" : "bg-slate-200 text-slate-400"
              )}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Approve
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Submit Preview Dialog (shown after clicking Submit Request)

function SubmitPreviewDialog({ open, onOpenChange, form, calculatedAmount, onConfirm }) {
  const previewRequest = {
    id: "REQ-8021",
    status: "Pending",
    requestedBy: form.approver.replace(/\s*\(.*\)/, "").trim(),
    requestedAt: "Oct 15, 2023, 10:33 AM",
    discountType: form.discountType.replace(" / Financial Aid", "").replace("Hardship / Financial Aid", "Hardship"),
    amount: calculatedAmount,
    percentage: `${form.percentage}%`,
    patientName: selectedBill.patientName,
    patientInitials: selectedBill.patientName.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase(),
    patientMeta: `UHID: ${selectedBill.uhid} • Male • 45 Yrs`,
    billNumber: selectedBill.billNumber,
    grossTotal: selectedBill.billTotal,
    proposedDiscount: `-${calculatedAmount}`,
    revisedNetPayable: `${rupee}4,050.00`,
    reason: form.reason,
    documentName: "Unemployment_Proof.pdf",
    documentMeta: "Oct 15, 2023 • 1.2 MB",
  };

  const approverInitials = form.approver
    .replace(/\s*\(.*\)/, "")
    .trim()
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col w-[calc(100vw-32px)] max-w-[720px] max-h-[calc(100vh-64px)] gap-0 rounded-[5px] border border-[#E7E8EB] bg-white p-0 shadow-none dark:border-white/10 dark:bg-[#101935]">
        <DialogTitle className="sr-only">Request Details</DialogTitle>

        {/* Header */}
        <div className="shrink-0 flex items-center justify-between border-b border-[#E7E8EB] px-[20px] py-[16px] dark:border-white/10">
          <div className="flex items-center gap-[10px]">
            <h2 className="text-[16px] font-bold text-slate-800 dark:text-white">
              Request {previewRequest.id}
            </h2>
            <span className="inline-flex items-center justify-center rounded-full px-[10px] py-[3px] text-[12px] font-semibold bg-[#FEF7E0] text-[#B06000] border border-[#FEEFC3]">
              Pending
            </span>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-[5px] p-1.5 text-slate-400 hover:bg-[#F8F9FC] hover:text-slate-700 dark:hover:bg-white/10 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto no-scrollbar flex-1 p-[20px] flex flex-col gap-[16px]">

          {/* Request Summary */}
          <div className="rounded-[5px] border border-[#E7E8EB] bg-white p-[16px] dark:border-white/10 dark:bg-[#0B1121] flex flex-col gap-[14px]">
            <div className="flex items-center gap-2 text-[13px] font-bold text-slate-800 dark:text-white">
              <FileText className="h-4 w-4 text-[#2E37A4]" />
              <span>Request Summary</span>
            </div>
            <div className="grid grid-cols-2 gap-[14px] sm:grid-cols-4">
              {/* Requested By */}
              <div className="flex flex-col gap-[6px]">
                <span className="text-[11px] font-semibold text-slate-400 tracking-wide">REQUESTED BY</span>
                <div className="flex items-center gap-[6px]">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EEF2FF] text-[10px] font-bold text-[#2E37A4]">
                    {approverInitials}
                  </div>
                  <span className="text-[13px] font-medium text-slate-700 dark:text-slate-300 truncate">
                    {previewRequest.requestedBy}
                  </span>
                </div>
              </div>
              {/* Date & Time */}
              <div className="flex flex-col gap-[6px]">
                <span className="text-[11px] font-semibold text-slate-400 tracking-wide">DATE & TIME</span>
                <div className="flex items-center gap-[5px] text-[12px] font-medium text-slate-700 dark:text-slate-300">
                  <CalendarDays className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>{previewRequest.requestedAt}</span>
                </div>
              </div>
              {/* Discount Type */}
              <div className="flex flex-col gap-[6px]">
                <span className="text-[11px] font-semibold text-slate-400 tracking-wide">DISCOUNT TYPE</span>
                <DiscountTypePill value={previewRequest.discountType} />
              </div>
              {/* Requested Amount */}
              <div className="flex flex-col gap-[6px]">
                <span className="text-[11px] font-semibold text-slate-400 tracking-wide">REQUESTED AMOUNT</span>
                <div className="flex items-center gap-[4px]">
                  <span className="text-[13px] font-bold text-[#2E37A4]">{previewRequest.amount}</span>
                  <span className="text-[11px] font-medium text-slate-400">({previewRequest.percentage})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Patient & Bill Details */}
          <div className="rounded-[5px] border border-[#E7E8EB] bg-white p-[16px] dark:border-white/10 dark:bg-[#0B1121] flex flex-col gap-[14px]">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-[13px] font-bold text-slate-800 dark:text-white">
                <UserRound className="h-4 w-4 text-[#2E37A4]" />
                <span>Patient & Bill Details</span>
              </div>
              <button type="button" className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#2E37A4] hover:underline cursor-pointer">
                <span>View Full Bill</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Patient card */}
            <div className="rounded-[5px] border border-[#E7E8EB] bg-[#F8F9FC] px-[14px] py-[12px] flex items-center gap-[10px] dark:border-white/10 dark:bg-white/5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#DBEAFE] text-[12px] font-bold text-[#1D4ED8]">
                {previewRequest.patientInitials}
              </div>
              <div>
                <p className="text-[13px] font-bold text-slate-800 dark:text-white">{previewRequest.patientName}</p>
                <p className="text-[11px] font-medium text-slate-500">{previewRequest.patientMeta}</p>
              </div>
            </div>

            {/* Bill rows */}
            <div className="flex flex-col gap-[10px] text-[13px]">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-500">Bill Number</span>
                <span className="font-bold text-slate-800 dark:text-white">{previewRequest.billNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-500">Gross Total</span>
                <span className="font-bold text-slate-800 dark:text-white">{previewRequest.grossTotal}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-500">Proposed Discount</span>
                <span className="rounded-[4px] bg-[#EEF2FF] px-[8px] py-[2px] font-bold text-[#2E37A4]">
                  {previewRequest.proposedDiscount}
                </span>
              </div>
              <div className="border-t border-[#E7E8EB] pt-[10px] flex items-center justify-between dark:border-white/10">
                <span className="text-[13px] font-bold text-slate-800 dark:text-white">Revised Net Payable</span>
                <span className="text-[16px] font-bold text-slate-800 dark:text-white">{previewRequest.revisedNetPayable}</span>
              </div>
            </div>
          </div>

          {/* Reason & Documents */}
          <div className="rounded-[5px] border border-[#E7E8EB] bg-white p-[16px] dark:border-white/10 dark:bg-[#0B1121] flex flex-col gap-[14px]">
            <div className="flex items-center gap-2 text-[13px] font-bold text-slate-800 dark:text-white">
              <ReceiptText className="h-4 w-4 text-[#2E37A4]" />
              <span>Reason & Documents</span>
            </div>

            {/* Quote box */}
            <div className="rounded-[5px] border border-[#E7E8EB] bg-[#F8F9FC] px-[14px] py-[12px] text-[13px] font-medium italic leading-relaxed text-slate-500 dark:border-white/10 dark:bg-white/5">
              &quot;{previewRequest.reason}&quot;
            </div>

            {/* File attachment */}
            <div className="flex items-center justify-between gap-4 rounded-[5px] border border-[#E7E8EB] bg-white px-[14px] py-[12px] dark:border-white/10 dark:bg-[#101935]">
              <div className="flex items-center gap-[10px]">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[5px] bg-rose-50">
                  <FileText className="h-4 w-4 text-rose-500" />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-slate-800 dark:text-white">{previewRequest.documentName}</p>
                  <p className="text-[11px] font-medium text-slate-400">{previewRequest.documentMeta}</p>
                </div>
              </div>
              <button
                type="button"
                className="rounded-[5px] border border-[#E7E8EB] p-[7px] text-slate-400 hover:text-[#2E37A4] transition cursor-pointer dark:border-white/10"
                aria-label="Download"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 flex items-center justify-between border-t border-[#E7E8EB] bg-[#F8F9FC] px-[20px] py-[14px] dark:border-white/10 dark:bg-white/5">
          <Button
            variant="outline"
            className="h-[36px] rounded-[5px] border-[#E7E8EB] bg-white px-[14px] text-[13px] font-semibold text-slate-700 hover:bg-[#F8F9FC] shadow-none cursor-pointer dark:border-white/10 dark:bg-[#101935] dark:text-white"
          >
            <MessageSquareText className="mr-2 h-4 w-4 text-slate-400" />
            Request Info
          </Button>
          <div className="flex items-center gap-[10px]">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-[36px] rounded-[5px] border-rose-200 bg-white px-[14px] text-[13px] font-semibold text-rose-500 hover:bg-rose-50 shadow-none cursor-pointer"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button
              onClick={() => { onConfirm(); onOpenChange(false); }}
              className="h-[36px] rounded-[5px] bg-[#2E37A4] px-[14px] text-[13px] font-semibold text-white hover:bg-[#2E37A4]/90 shadow-none cursor-pointer"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Approve
            </Button>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}

function ApplyDiscountForm({ form, calculatedAmount, onCancel, onSubmit, onFieldChange }) {
  return (
    <div className="flex flex-col gap-[20px]">

      {/* Page title */}
      <div>
        <h1 className="text-[20px] font-bold text-slate-800 dark:text-white leading-none">Apply Discount</h1>
      </div>

      {/* Search Bill or Patient */}
      <div className="flex flex-col gap-[8px]">
        <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Search Bill or Patient</label>
        <div className="relative">
          <FinanceSearchField
            value="INV-44920 - Michael Chang"
            onChange={() => {}}
            placeholder="Search bill or patient..."
            className="w-full sm:w-full"
          />
          <CircleX className="absolute right-[14px] top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 cursor-pointer" />
        </div>
      </div>

      {/* Bill info card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 rounded-[5px] border border-[#E7E8EB] bg-[#F8F9FC] divide-y sm:divide-y-0 sm:divide-x divide-[#E7E8EB] dark:border-white/10 dark:bg-white/5 dark:divide-white/10">
        <div className="px-[20px] py-[16px] flex flex-col gap-[4px]">
          <span className="text-[11px] font-semibold text-slate-400 tracking-wide">PATIENT NAME</span>
          <span className="text-[15px] font-bold text-slate-800 dark:text-white">{selectedBill.patientName}</span>
          <span className="text-[12px] text-slate-500">UHID: {selectedBill.uhid}</span>
        </div>
        <div className="px-[20px] py-[16px] flex flex-col gap-[4px]">
          <span className="text-[11px] font-semibold text-slate-400 tracking-wide">BILL NUMBER</span>
          <span className="text-[15px] font-bold text-slate-800 dark:text-white">{selectedBill.billNumber}</span>
          <span className="text-[12px] text-slate-500">{selectedBill.billDate}</span>
        </div>
        <div className="px-[20px] py-[16px] flex flex-col gap-[4px]">
          <span className="text-[11px] font-semibold text-slate-400 tracking-wide">BILL TOTAL</span>
          <span className="text-[15px] font-bold text-slate-800 dark:text-white">{selectedBill.billTotal}</span>
          <span className="text-[12px] text-slate-500">Balance: {selectedBill.balance}</span>
        </div>
      </div>

      {/* Discount Details section */}
      <div className="flex flex-col gap-[20px]">
        <h2 className="text-[15px] font-bold text-slate-800 dark:text-white">Discount Details</h2>

        {/* Row 1: Discount Type + Request Approval From */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px]">
          <div className="flex flex-col gap-[8px]">
            <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Discount Type</label>
            <FinanceSelect
              value={form.discountType}
              onChange={(val) => onFieldChange("discountType", val)}
              placeholder="Select discount type"
              options={discountTypeOptions.map((o) => ({ label: o, value: o }))}
              className="w-full sm:w-full h-[44px]"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Request Approval From</label>
            <FinanceSelect
              value={form.approver}
              onChange={(val) => onFieldChange("approver", val)}
              placeholder="Select approver"
              options={approverOptions.map((o) => ({ label: o, value: o }))}
              className="w-full sm:w-full h-[44px]"
            />
          </div>
        </div>

        {/* Row 2: Discount Value + Calculated Amount */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px]">
          <div className="flex flex-col gap-[8px]">
            <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Discount Value</label>
            <div className="flex h-[44px] overflow-hidden rounded-[5px] border border-[#E7E8EB] dark:border-white/10">
              <div className="flex items-center border-r border-[#E7E8EB] bg-[#F8F9FC] px-[14px] text-[13px] text-slate-500 font-medium shrink-0 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
                Percentage (%)
              </div>
              <input
                type="number"
                value={form.percentage}
                onChange={(e) => onFieldChange("percentage", e.target.value)}
                className="h-full w-full bg-white px-[14px] text-[13px] text-slate-800 outline-none dark:bg-[#101935] dark:text-white"
              />
            </div>
          </div>

          <div className="flex flex-col gap-[8px]">
            <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Calculated Amount</label>
            <input
              type="text"
              value={calculatedAmount}
              readOnly
              className="h-[44px] w-full rounded-[5px] border border-[#E7E8EB] bg-[#F8F9FC] px-[14px] text-[13px] font-medium text-slate-500 outline-none dark:border-white/10 dark:bg-white/5 dark:text-slate-400"
            />
          </div>
        </div>

        {/* Reason / Remarks */}
        <div className="flex flex-col gap-[8px]">
          <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Reason / Remarks</label>
          <textarea
            value={form.reason}
            onChange={(e) => onFieldChange("reason", e.target.value)}
            rows={4}
            className="w-full rounded-[5px] border border-[#E7E8EB] bg-white px-[14px] py-[12px] text-[13px] text-slate-800 outline-none focus:border-[#2E37A4] transition resize-none dark:border-white/10 dark:bg-[#101935] dark:text-white"
          />
        </div>

        {/* Supporting Documents */}
        <div className="flex flex-col gap-[8px]">
          <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Supporting Documents (Optional)</label>
          <div className="flex flex-col items-center justify-center py-[40px] rounded-[5px] border border-dashed border-[#E7E8EB] bg-white text-center cursor-pointer dark:border-white/10 dark:bg-[#101935]">
            <div className="mb-[10px] flex h-10 w-10 items-center justify-center rounded-full border border-[#E7E8EB] bg-white dark:border-white/10 dark:bg-[#101935]">
              <UploadCloud className="h-5 w-5 text-[#2E37A4]" />
            </div>
            <p className="text-[13px] text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-[#2E37A4] hover:underline cursor-pointer">Click to upload</span>
              {" "}or drag and drop
            </p>
            <p className="mt-[4px] text-[12px] text-slate-400">PDF, JPG, PNG up to 10MB</p>
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex items-center justify-end gap-[12px] pt-[4px] pb-[8px]">
        <button
          type="button"
          onClick={onCancel}
          className="h-[38px] px-[20px] rounded-[5px] border border-[#E7E8EB] bg-white text-[13px] font-semibold text-slate-700 hover:bg-[#F8F9FC] transition cursor-pointer dark:border-white/10 dark:bg-[#101935] dark:text-white"
        >
          Cancel
        </button>
        <Button
          onClick={onSubmit}
          className="h-[38px] rounded-[5px] bg-[#2E37A4] px-[20px] text-[13px] font-semibold text-white hover:bg-[#2E37A4]/90 shadow-none cursor-pointer"
        >
          Submit Request
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// Discount Table

function DiscountTable({ rows, onView }) {
  const router = useRouter();
  
  const handleReview = (req) => {
    router.push(`/finance/discounts/review/${req.id}`);
  };
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-[#E7E8EB] bg-white dark:bg-[#101935]">
            <th className="px-[20px] py-[14px] text-left text-[12px] font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">Request ID</th>
            <th className="px-[20px] py-[14px] text-left text-[12px] font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">Patient Name</th>
            <th className="px-[20px] py-[14px] text-left text-[12px] font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">Bill Number</th>
            <th className="px-[20px] py-[14px] text-left text-[12px] font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">Discount Type</th>
            <th className="px-[20px] py-[14px] text-left text-[12px] font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">Amount</th>
            <th className="px-[20px] py-[14px] text-left text-[12px] font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">Requested by</th>
            <th className="px-[20px] py-[14px] text-left text-[12px] font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">Status</th>
            <th className="px-[20px] py-[14px] text-center text-[12px] font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-[20px] py-[40px] text-center text-[13px] font-medium text-slate-400">
                No discount requests match your search.
              </td>
            </tr>
          ) : (
            rows.map((req) => (
              <tr key={req.id} className="border-b border-[#E7E8EB] last:border-0 hover:bg-[#F8F9FC] dark:hover:bg-white/5 transition-colors">
                <td className="whitespace-nowrap px-[20px] py-[14px] text-[13px] font-bold text-slate-800 dark:text-white">{req.id}</td>
                <td className="whitespace-nowrap px-[20px] py-[14px] text-[13px] font-medium text-slate-700 dark:text-slate-300">{req.patientName}</td>
                <td className="whitespace-nowrap px-[20px] py-[14px] text-[13px] font-medium text-slate-700 dark:text-slate-300">{req.billNumber}</td>
                <td className="whitespace-nowrap px-[20px] py-[14px]"><DiscountTypePill value={req.discountType} /></td>
                <td className="whitespace-nowrap px-[20px] py-[14px] text-[13px] font-medium text-slate-700 dark:text-slate-300">{req.amount}</td>
                <td className="whitespace-nowrap px-[20px] py-[14px] text-[13px] font-medium text-slate-700 dark:text-slate-300">{req.requestedBy}</td>
                <td className="whitespace-nowrap px-[20px] py-[14px]"><StatusPill status={req.status} /></td>
                <td className="px-[20px] py-[14px]">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleReview(req)}
                      className="h-[32px] px-[14px] rounded-[5px] bg-[#2E37A4] text-white text-[12px] font-semibold hover:bg-[#2E37A4]/90 transition cursor-pointer flex items-center gap-1"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Review
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// Request List View

function RequestListView({ searchTerm, statusFilter, rows, onSearchChange, onStatusChange, onView, onBack }) {
  return (
    <div className="flex flex-col gap-[20px]">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-[18px] font-bold text-slate-800 dark:text-white leading-none">Discount Request List</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onBack}
            className="h-[36px] rounded-[5px] border-[#2E37A4] px-[14px] text-[13px] font-semibold text-[#2E37A4] hover:bg-[#2E37A4]/5 shadow-none cursor-pointer">
            Back
          </Button>
          <Button className="h-[36px] rounded-[5px] bg-[#2E37A4] px-[14px] text-[13px] font-semibold text-white hover:bg-[#2E37A4]/90 shadow-none cursor-pointer">
            Bulk Approve
          </Button>
        </div>
      </div>

      {/* Table card */}
      <div className="rounded-[5px] border border-[#E7E8EB] bg-white dark:border-white/10 dark:bg-[#101935]">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-[20px] py-[14px] border-b border-[#E7E8EB] dark:border-white/10">
          <div className="relative w-full sm:w-[240px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input type="text" value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} placeholder="Search..."
              className="h-[36px] w-full rounded-[5px] border border-[#E7E8EB] bg-[#F8F9FC] pl-9 pr-4 text-[13px] text-slate-800 placeholder-slate-400 outline-none hover:border-[#2E37A4]/30 focus:border-[#2E37A4] transition dark:border-white/10 dark:bg-[#0A0F1D] dark:text-white" />
          </div>
          <SimpleDropdown value={statusFilter} onChange={onStatusChange} options={statusOptions} />
        </div>
        <DiscountTable rows={rows} onView={onView} />
      </div>
    </div>
  );
}

// Main Page

export default function DiscountsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [showRequestList, setShowRequestList] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitPreviewOpen, setSubmitPreviewOpen] = useState(false);
  
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [applyForm, setApplyForm] = useState({
    discountType: "Hardship / Financial Aid",
    approver: "Dr. Sarah Smith (Director)",
    percentage: "10",
    reason: "Patient requested financial assistance due to unemployment. Valid supporting documents attached.",
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/billing/discounts`, { headers: getAuthHeaders() });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || `Error ${res.status}`);
      setRequests(json.data.map(mapDiscountRequest));
    } catch (e) {
      console.error("fetchRequests error:", e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const dynamicSummaryCards = useMemo(() => {
    const today = new Date().toDateString();
    
    const todayApproved = requests.filter(r => 
      r.status === "Approved" && 
      r.raw?.createdAt && new Date(r.raw.createdAt).toDateString() === today
    );
    const todayVal = todayApproved.reduce((sum, r) => sum + (r.raw?.discountAmount || 0), 0);
    
    const pendingCount = requests.filter(r => r.status === "Pending").length;
    
    const corporateApproved = requests.filter(r => 
      r.status === "Approved" && 
      String(r.discountType).toLowerCase().includes("corporate")
    );
    const corporateVal = corporateApproved.reduce((sum, r) => sum + (r.raw?.discountAmount || 0), 0);
    
    const totalSubtotals = requests.reduce((sum, r) => sum + (r.raw?.bill?.subtotal || 0), 0);
    const totalDiscounts = requests.filter(r => r.status === "Approved").reduce((sum, r) => sum + (r.raw?.discountAmount || 0), 0);
    const impactPct = totalSubtotals > 0 ? (totalDiscounts / totalSubtotals) * 100 : 0;

    return [
      {
        title: "Total Discount Today",
        value: `${rupee}${todayVal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
        change: "+0%",
        changeSuffix: " vs yesterday",
        changePositive: true,
        icon: BadgePercent,
        iconColor: "text-[#6366F1]",
        iconBg: "bg-[#EEF2FF]",
      },
      {
        title: "Pending Approval",
        value: String(pendingCount),
        change: "0%",
        changeSuffix: " vs yesterday",
        changePositive: true,
        icon: Clock3,
        iconColor: "text-[#D97706]",
        iconBg: "bg-[#FEF7E0]",
      },
      {
        title: "Corporate Discounts",
        value: `${rupee}${corporateVal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
        change: "+0%",
        changeSuffix: " vs last month",
        changePositive: true,
        icon: Calculator,
        iconColor: "text-[#137333]",
        iconBg: "bg-[#E6F4EA]",
      },
      {
        title: "Revenue Impact",
        value: `-${impactPct.toFixed(1)}%`,
        change: "-0%",
        changeSuffix: " vs last month",
        changePositive: false,
        icon: PieChart,
        iconColor: "text-[#C5221F]",
        iconBg: "bg-[#FCE8E6]",
      },
    ];
  }, [requests]);

  const filteredRows = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return requests.filter((r) => {
      const matchSearch = !query || [r.id, r.patientName, r.billNumber, r.discountType, r.requestedBy, r.status]
        .some((f) => f && String(f).toLowerCase().includes(query));
      const matchStatus = statusFilter === "All" || r.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [requests, searchTerm, statusFilter]);

  const calculatedAmount = useMemo(() => {
    const pct = Number(applyForm.percentage || 0);
    return `${rupee}${((4500 * pct) / 100).toFixed(2)}`;
  }, [applyForm.percentage]);

  const handleView = (row) => {
    const full = requests.find((r) => r.id === row.id) || row;
    setSelectedRequest(full);
    setDialogOpen(true);
  };

  const handleFieldChange = (field, value) => setApplyForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-[#0A0F1D] text-[#1e293b] dark:text-white">
      <div className="mx-auto w-full max-w-[1700px] flex flex-col gap-[20px] p-[20px]">

        <RequestDetailsDialog request={selectedRequest} open={dialogOpen} onOpenChange={setDialogOpen} />
        <SubmitPreviewDialog
          open={submitPreviewOpen}
          onOpenChange={setSubmitPreviewOpen}
          form={applyForm}
          calculatedAmount={calculatedAmount}
          onConfirm={() => { setSubmitPreviewOpen(false); setShowApplyForm(false); setShowRequestList(true); }}
        />

        {showApplyForm ? (
          <ApplyDiscountForm
            form={applyForm}
            calculatedAmount={calculatedAmount}
            onCancel={() => setShowApplyForm(false)}
            onSubmit={() => setSubmitPreviewOpen(true)}
            onFieldChange={handleFieldChange}
          />
        ) : showRequestList ? (
          <RequestListView
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            rows={filteredRows}
            onSearchChange={setSearchTerm}
            onStatusChange={setStatusFilter}
            onView={handleView}
            onBack={() => setShowRequestList(false)}
          />
        ) : (
          <>
            {/* Page header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-[20px] font-bold text-slate-800 dark:text-white leading-none">Discounts</h1>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={() => router.push('/finance/discounts/requests')}
                  className="h-[36px] rounded-[5px] border-[#2E37A4] px-[14px] text-[13px] font-semibold text-[#2E37A4] hover:bg-[#2E37A4]/5 shadow-none cursor-pointer">
                  <ShieldCheck className="mr-1.5 h-4 w-4" />
                  Request List
                </Button>
                <Button onClick={() => router.push('/finance/discounts/apply')}
                  className="h-[36px] rounded-[5px] bg-[#2E37A4] px-[14px] text-[13px] font-semibold text-white hover:bg-[#2E37A4]/90 shadow-none cursor-pointer">
                  <Plus className="mr-1.5 h-4 w-4" />
                  Apply Discount
                </Button>
              </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 gap-[20px] sm:grid-cols-2 xl:grid-cols-4">
              {dynamicSummaryCards.map((card) => (
                <StatCard key={card.title} card={card} />
              ))}
            </div>

            {/* Table card */}
            <div className="rounded-[5px] border border-[#E7E8EB] bg-white dark:border-white/10 dark:bg-[#101935]">
              {/* Toolbar */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-[20px] py-[14px] border-b border-[#E7E8EB] dark:border-white/10">
                <div className="relative w-full sm:w-[240px]">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    className="h-[36px] w-full rounded-[5px] border border-[#E7E8EB] bg-[#F8F9FC] pl-9 pr-4 text-[13px] text-slate-800 placeholder-slate-400 outline-none hover:border-[#2E37A4]/30 focus:border-[#2E37A4] transition dark:border-white/10 dark:bg-[#0A0F1D] dark:text-white"
                  />
                </div>
                <SimpleDropdown value={statusFilter} onChange={setStatusFilter} options={statusOptions} />
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-[60px] text-[13px] text-slate-500 font-medium">
                  <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-[#2E37A4] rounded-full"></span>
                  Loading discount requests...
                </div>
              ) : error ? (
                <div className="py-[60px] text-center text-rose-500 font-medium text-[13px]">
                  {error}
                </div>
              ) : (
                <DiscountTable rows={filteredRows} onView={handleView} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
