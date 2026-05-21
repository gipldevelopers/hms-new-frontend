"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  FinanceHeader,
  FinancePageShell,
  FinanceSearchField,
  FinanceSelect,
  FinanceStatCard,
  CompactStatCard,
  FinanceTableCard,
  FinanceToolbar,
} from "@/components/finance/FinancePageChrome";
import {
  ArrowRight,
  CircleX,
  BadgePercent,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Calculator,
  Download,
  Eye,
  ExternalLink,
  FileText,
  MessageSquareText,
  Paperclip,
  PieChart,
  Plus,
  ReceiptText,
  UserRound,
  XCircle,
  Search,
  ShieldCheck,
  UploadCloud,
  X,
} from "lucide-react";

const rupee = "\u20B9";

const summaryCards = [
  {
    title: "Total Discount Today",
    value: `${rupee}24,500`,
    change: "+12%  vs yesterday",
    icon: BadgePercent,
    tone: {
      icon: "text-violet-600",
      bg: "bg-violet-100",
      change: "text-emerald-500",
    },
  },
  {
    title: "Pending Approval",
    value: "28",
    change: "+12%  vs yesterday",
    icon: Clock3,
    tone: {
      icon: "text-amber-500",
      bg: "bg-amber-100",
      change: "text-emerald-500",
    },
  },
  {
    title: "Corporate Discounts",
    value: `${rupee}12,200`,
    change: "+8% vs last month",
    icon: Calculator,
    tone: {
      icon: "text-emerald-600",
      bg: "bg-emerald-100",
      change: "text-emerald-500",
    },
  },
  {
    title: "Revenue Impact",
    value: "-2.4%",
    change: "-2% vs last month",
    icon: PieChart,
    tone: {
      icon: "text-rose-500",
      bg: "bg-rose-100",
      change: "text-emerald-500",
    },
  },
];

const discountRequests = [
  {
    id: "REQ-2023-891",
    patientName: "Robert Fox",
    billNumber: "INV-44200",
    discountType: "Hardship",
    amount: `${rupee}4500.00`,
    requestedBy: "Dr. Smith",
    status: "Approved",
    requestedAt: "Oct 15, 2023, 10:30 AM",
    percentage: "10%",
    patientInitials: "RF",
    patientMeta: "UHID: 882910 • Male • 45 Yrs",
    grossTotal: `${rupee}45,000.00`,
    proposedDiscount: `-${rupee}4,500.00`,
    revisedNetPayable: `${rupee}40,500.00`,
    reason:
      "Patient requested financial assistance due to sudden unemployment. Reviewed financial hardship form and supporting documents attached.",
    documentName: "Unemployment_Proof.pdf",
    documentMeta: "Oct 15, 2023 • 1.2 MB",
  },
  {
    id: "REQ-2023-892",
    patientName: "Alice Johnson",
    billNumber: "INV-44201",
    discountType: "Staff Family",
    amount: `${rupee}7500.00`,
    requestedBy: "Dr. Brown",
    status: "Pending",
    requestedAt: "Oct 16, 2023, 12:15 PM",
    percentage: "15%",
    patientInitials: "AJ",
    patientMeta: "UHID: 882911 • Female • 38 Yrs",
    grossTotal: `${rupee}50,000.00`,
    proposedDiscount: `-${rupee}7,500.00`,
    revisedNetPayable: `${rupee}42,500.00`,
    reason:
      "Staff family concession requested with employment proof and dependent verification attached for approval.",
    documentName: "Staff_Family_Request.pdf",
    documentMeta: "Oct 16, 2023 • 860 KB",
  },
  {
    id: "REQ-2023-893",
    patientName: "Michael Lee",
    billNumber: "INV-44202",
    discountType: "Self Pay",
    amount: `${rupee}3200.00`,
    requestedBy: "Dr. Taylor",
    status: "Rejected",
    requestedAt: "Oct 17, 2023, 09:10 AM",
    percentage: "8%",
    patientInitials: "ML",
    patientMeta: "UHID: 882912 • Male • 29 Yrs",
    grossTotal: `${rupee}40,000.00`,
    proposedDiscount: `-${rupee}3,200.00`,
    revisedNetPayable: `${rupee}36,800.00`,
    reason:
      "Self-pay discount requested after follow-up consultation. Submitted remarks were found incomplete during review.",
    documentName: "SelfPay_Statement.pdf",
    documentMeta: "Oct 17, 2023 • 740 KB",
  },
  {
    id: "REQ-2023-894",
    patientName: "Emma Wilson",
    billNumber: "INV-44203",
    discountType: "Corporate",
    amount: `${rupee}6000.00`,
    requestedBy: "Dr. Davis",
    status: "Approved",
    requestedAt: "Oct 18, 2023, 04:45 PM",
    percentage: "12%",
    patientInitials: "EW",
    patientMeta: "UHID: 882913 • Female • 51 Yrs",
    grossTotal: `${rupee}50,000.00`,
    proposedDiscount: `-${rupee}6,000.00`,
    revisedNetPayable: `${rupee}44,000.00`,
    reason:
      "Corporate billing adjustment raised after employer benefit slab confirmation from the finance team.",
    documentName: "Corporate_Approval.pdf",
    documentMeta: "Oct 18, 2023 • 1.0 MB",
  },
  {
    id: "REQ-2023-895",
    patientName: "James Smith",
    billNumber: "INV-44204",
    discountType: "Hardship",
    amount: `${rupee}5000.00`,
    requestedBy: "Dr. Garcia",
    status: "Pending",
    requestedAt: "Oct 19, 2023, 11:00 AM",
    percentage: "10%",
    patientInitials: "JS",
    patientMeta: "UHID: 882914 • Male • 61 Yrs",
    grossTotal: `${rupee}50,000.00`,
    proposedDiscount: `-${rupee}5,000.00`,
    revisedNetPayable: `${rupee}45,000.00`,
    reason:
      "Hardship request initiated after emergency admission and family income declaration review.",
    documentName: "Income_Declaration.pdf",
    documentMeta: "Oct 19, 2023 • 1.4 MB",
  },
  {
    id: "REQ-2023-896",
    patientName: "Olivia Martinez",
    billNumber: "INV-44205",
    discountType: "Staff Family",
    amount: `${rupee}4200.00`,
    requestedBy: "Dr. Hernandez",
    status: "Approved",
    requestedAt: "Oct 20, 2023, 03:25 PM",
    percentage: "7%",
    patientInitials: "OM",
    patientMeta: "UHID: 882915 • Female • 33 Yrs",
    grossTotal: `${rupee}60,000.00`,
    proposedDiscount: `-${rupee}4,200.00`,
    revisedNetPayable: `${rupee}55,800.00`,
    reason:
      "Dependent staff-family benefit applied after HR verification and coverage confirmation.",
    documentName: "HR_Verification.pdf",
    documentMeta: "Oct 20, 2023 • 930 KB",
  },
  {
    id: "REQ-2023-897",
    patientName: "William Johnson",
    billNumber: "INV-44206",
    discountType: "Staff Family",
    amount: `${rupee}5500.00`,
    requestedBy: "Dr. Wilson",
    status: "Rejected",
    requestedAt: "Oct 21, 2023, 01:05 PM",
    percentage: "11%",
    patientInitials: "WJ",
    patientMeta: "UHID: 882916 • Male • 42 Yrs",
    grossTotal: `${rupee}50,000.00`,
    proposedDiscount: `-${rupee}5,500.00`,
    revisedNetPayable: `${rupee}44,500.00`,
    reason:
      "Requested family-discount slab exceeded policy limit and was sent back for revision.",
    documentName: "Family_Discount_Request.pdf",
    documentMeta: "Oct 21, 2023 • 1.1 MB",
  },
  {
    id: "REQ-2023-898",
    patientName: "Sophia Brown",
    billNumber: "INV-44207",
    discountType: "Hardship",
    amount: `${rupee}3000.00`,
    requestedBy: "Dr. Lee",
    status: "Approved",
    requestedAt: "Oct 22, 2023, 08:40 AM",
    percentage: "6%",
    patientInitials: "SB",
    patientMeta: "UHID: 882917 • Female • 27 Yrs",
    grossTotal: `${rupee}50,000.00`,
    proposedDiscount: `-${rupee}3,000.00`,
    revisedNetPayable: `${rupee}47,000.00`,
    reason:
      "Financial-aid request reviewed with submitted hardship note and outpatient billing summary.",
    documentName: "Hardship_Note.pdf",
    documentMeta: "Oct 22, 2023 • 680 KB",
  },
];

const discountRequestListRows = [
  {
    id: "REQ-2023-891",
    patientName: "Robert Fox",
    billNumber: "INV-44200",
    discountType: "Hardship",
    amount: `${rupee}4500.00`,
    requestedBy: "Dr. Smith",
    status: "Approved",
    actionLabel: "Review",
  },
  {
    id: "REQ-2023-892",
    patientName: "Alice Johnson",
    billNumber: "INV-44201",
    discountType: "Expense",
    amount: `${rupee}3000.00`,
    requestedBy: "Dr. Lee",
    status: "Pending",
    actionLabel: "Approve",
  },
  {
    id: "REQ-2023-893",
    patientName: "Michael Brown",
    billNumber: "INV-44202",
    discountType: "Miscellaneous",
    amount: `${rupee}6000.00`,
    requestedBy: "Dr. Patel",
    status: "Rejected",
    actionLabel: "Revise",
  },
  {
    id: "REQ-2023-894",
    patientName: "Sophia Davis",
    billNumber: "INV-44203",
    discountType: "Healthcare",
    amount: `${rupee}7500.00`,
    requestedBy: "Dr. Wilson",
    status: "Approved",
    actionLabel: "Review",
  },
  {
    id: "REQ-2023-895",
    patientName: "James Garcia",
    billNumber: "INV-44204",
    discountType: "Travel",
    amount: `${rupee}2000.00`,
    requestedBy: "Dr. Taylor",
    status: "Approved",
    actionLabel: "Review",
  },
  {
    id: "REQ-2023-896",
    patientName: "Olivia Martinez",
    billNumber: "INV-44205",
    discountType: "Training",
    amount: `${rupee}8500.00`,
    requestedBy: "Dr. Anderson",
    status: "Pending",
    actionLabel: "Approve",
  },
  {
    id: "REQ-2023-891",
    patientName: "Robert Fox",
    billNumber: "INV-44200",
    discountType: "Hardship",
    amount: `${rupee}4500.00`,
    requestedBy: "Dr. Smith",
    status: "Approved",
    actionLabel: "Review",
  },
  {
    id: "REQ-2023-897",
    patientName: "William Rodriguez",
    billNumber: "INV-44206",
    discountType: "Supplies",
    amount: `${rupee}4000.00`,
    requestedBy: "Dr. Thomas",
    status: "Rejected",
    actionLabel: "Revise",
  },
  {
    id: "REQ-2023-898",
    patientName: "Isabella Hernandez",
    billNumber: "INV-44207",
    discountType: "Equipment",
    amount: `${rupee}5500.00`,
    requestedBy: "Dr. Harris",
    status: "Approved",
    actionLabel: "Review",
  },
];

const statusOptions = ["All", "Approved", "Pending", "Rejected"];
const discountTypeOptions = [
  "Hardship / Financial Aid",
  "Corporate",
  "Staff Family",
  "Self Pay",
];
const approverOptions = [
  "Dr. Sarah Smith (Director)",
  "Dr. James Wilson (Finance Head)",
  "Dr. Emily Taylor (Medical Superintendent)",
];
const selectedBill = {
  patientName: "Michael Chang",
  uhid: "882910",
  billNumber: "INV-44920",
  billDate: "Oct 15, 2023",
  billTotal: `${rupee}4,500.00`,
  balance: `${rupee}4,000.00`,
};

function StatCard({ card }) {
  const Icon = card.icon;

  return (
    <CompactStatCard
      title={card.title}
      value={card.value}
      icon={Icon}
      color={
        card.tone.icon.includes("emerald")
          ? "emerald"
          : card.tone.icon.includes("amber")
          ? "amber"
          : card.tone.icon.includes("rose")
          ? "rose"
          : card.tone.icon.includes("violet")
          ? "indigo"
          : "blue"
      }
      meta={card.change}
    />
  );
}

function StatusPill({ status }) {
  const normalizedStatus = status ? status.toLowerCase() : "";
  const statusStyles = {
    approved: "border-emerald-100 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    pending: "border-amber-100 bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    rejected: "border-rose-100 bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
  };

  const styleClass = statusStyles[normalizedStatus] || "border-slate-100 bg-slate-50 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400 dark:border-white/5";

  return (
    <span
      className={`inline-flex min-w-[82px] justify-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider border ${styleClass}`}
    >
      {status}
    </span>
  );
}


function DiscountTypePill({ value }) {
  return (
    <span className="inline-flex rounded-[5px] border border-gray-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-2.5 py-1 text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide">
      {value}
    </span>
  );
}

function buildRequestDetails(request) {
  return {
    ...request,
    requestedAt: request.requestedAt || "Oct 17, 2023, 09:10 AM",
    percentage: request.percentage || "10%",
    patientInitials:
      request.patientInitials ||
      request.patientName
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    patientMeta: request.patientMeta || "UHID: 882910 • Male • 45 Yrs",
    grossTotal: request.grossTotal || `${rupee}45,000.00`,
    proposedDiscount: request.proposedDiscount || `-${request.amount}`,
    revisedNetPayable: request.revisedNetPayable || `${rupee}40,500.00`,
    reason:
      request.reason ||
      "Patient requested financial assistance due to sudden unemployment. Reviewed financial hardship form and supporting documents attached.",
    documentName: request.documentName || "Supporting_Document.pdf",
    documentMeta: request.documentMeta || "Oct 17, 2023 • 1.2 MB",
  };
}

function RequestDetailsDialog({ request, open, onOpenChange }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const handleEsc = (e) => {
        if (e.key === "Escape") onOpenChange(false);
      };
      window.addEventListener("keydown", handleEsc);
      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleEsc);
      };
    }
  }, [open, onOpenChange]);

  if (!request) return null;

  const isPending = request.status && request.status.toLowerCase() === "pending";

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-[6px]"
          />

          {/* Modal card content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 16 }}
            className="relative bg-white dark:bg-[#0F172A] w-full max-w-[700px] rounded-[5px] shadow-none overflow-hidden border border-gray-100 dark:border-white/5 flex flex-col max-h-[calc(100vh-32px)]"
          >
            {/* Header */}
            <div className="px-4 sm:px-8 py-5 sm:py-6 flex justify-between items-center border-b border-gray-100 dark:border-white/5 shrink-0">
              <div className="flex items-center gap-4">
                <h2 className="text-[20px] font-bold text-[#1e293b] dark:text-white leading-none">
                  Request {request.id}
                </h2>
                <StatusPill status={request.status} />
              </div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="group p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
                aria-label="Close request details"
              >
                <X className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
              </button>
            </div>

            {/* Body */}
            <div className="px-4 sm:px-8 py-5 sm:py-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50 dark:bg-[#0B1121]/20">
              
              {/* Section 1: Summary */}
              <section className="bg-white dark:bg-[#1E293B]/20 border border-gray-150 dark:border-white/5 rounded-[5px] p-5 space-y-4 shadow-sm">
                <div className="flex items-center gap-3 text-[14px] font-bold text-slate-800 dark:text-white">
                  <FileText className="h-4.5 w-4.5 text-primary" />
                  <span>Request Summary</span>
                </div>
                <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Requested By
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 text-[10px] font-bold text-violet-700 uppercase">
                        {request.requestedBy
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <p className="text-[13px] font-semibold text-gray-700 dark:text-white">{request.requestedBy}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Date & Time
                    </p>
                    <div className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-700 dark:text-white">
                      <CalendarDays className="h-4 w-4 text-gray-400" />
                      <span>{request.requestedAt}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Discount Type
                    </p>
                    <div>
                      <DiscountTypePill value={request.discountType} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Requested Amount
                    </p>
                    <div className="flex items-center gap-1.5 text-[13px] font-bold text-primary">
                      <BadgePercent className="h-4 w-4" />
                      <span>{request.amount}</span>
                      <span className="text-[11px] font-semibold text-gray-400">
                        ({request.percentage})
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 2: Patient & Bill Details */}
              <section className="bg-white dark:bg-[#1E293B]/20 border border-gray-150 dark:border-white/5 rounded-[5px] p-5 space-y-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 text-[14px] font-bold text-slate-800 dark:text-white">
                    <UserRound className="h-4.5 w-4.5 text-primary" />
                    <span>Patient & Bill Details</span>
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-primary transition hover:opacity-80"
                  >
                    View Full Bill
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Patient overview card matching payments sky-blue style */}
                <div className="p-4 bg-sky-50 dark:bg-sky-500/5 rounded-[5px] border border-sky-100 dark:border-sky-500/20 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-bold text-sky-950 dark:text-sky-400 leading-none">{request.patientName}</span>
                      <span className="bg-sky-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-[5px] uppercase shrink-0">
                        {request.patientInitials}
                      </span>
                    </div>
                    <p className="text-[12px] text-sky-800/80 dark:text-sky-300/60 font-semibold">
                      {request.patientMeta}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-[11px] text-sky-800/70 dark:text-sky-300/40 font-bold mb-0.5 uppercase tracking-wide">Gross Total</p>
                    <p className="text-[20px] font-black text-slate-800 dark:text-white">{request.grossTotal}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2 text-[13px] border-t border-gray-100 dark:border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 font-semibold">Bill Number</span>
                    <span className="font-bold text-gray-800 dark:text-white">{request.billNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 font-semibold">Proposed Discount</span>
                    <span className="rounded-[5px] bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 text-[11px] font-bold text-primary uppercase tracking-wide">
                      {request.proposedDiscount}
                    </span>
                  </div>
                  <div className="border-t border-dashed border-gray-200 dark:border-white/10 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] font-extrabold text-gray-800 dark:text-white">
                        Revised Net Payable
                      </span>
                      <span className="text-[20px] font-black text-[#EF4444]">
                        {request.revisedNetPayable}
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 3: Reason & Documents */}
              <section className="bg-white dark:bg-[#1E293B]/20 border border-gray-150 dark:border-white/5 rounded-[5px] p-5 space-y-4 shadow-sm">
                <div className="flex items-center gap-3 text-[14px] font-bold text-slate-800 dark:text-white">
                  <ReceiptText className="h-4.5 w-4.5 text-[#6A63FF]" />
                  <span>Reason & Documents</span>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-[5px] border border-gray-100 dark:border-white/5 text-[12px] font-medium leading-relaxed italic text-gray-500 dark:text-gray-400">
                  &quot;{request.reason}&quot;
                </div>

                <div className="flex items-center justify-between gap-4 rounded-[5px] border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1E293B] px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-[5px] bg-rose-50 dark:bg-rose-950/20 p-2 shrink-0">
                      <Paperclip className="h-4.5 w-4.5 text-rose-500" />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-gray-800 dark:text-white truncate max-w-[160px] sm:max-w-[280px]">
                        {request.documentName}
                      </p>
                      <p className="text-[11px] text-gray-400 font-semibold">{request.documentMeta}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="rounded-[5px] border border-gray-200 dark:border-white/10 p-2.5 text-gray-500 hover:text-primary transition-all bg-white dark:bg-transparent"
                    aria-label={`Download ${request.documentName}`}
                  >
                    <Download className="h-4.5 w-4.5" />
                  </button>
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="px-4 sm:px-8 py-5 sm:py-6 border-t border-gray-100 dark:border-white/5 bg-white dark:bg-[#0F172A] flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4 shrink-0">
              <button
                type="button"
                onClick={() => {
                  toast.info("Request Info clicked");
                  onOpenChange(false);
                }}
                className="px-6 h-[48px] rounded-[5px] border border-gray-200 dark:border-white/10 text-gray-500 hover:text-primary font-bold text-[13px] transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <MessageSquareText className="h-4 w-4" />
                Request Info
              </button>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <button
                  type="button"
                  disabled={!isPending}
                  onClick={() => {
                    toast.error("Discount request rejected");
                    onOpenChange(false);
                  }}
                  className={`px-8 h-[48px] rounded-[5px] font-bold text-[13px] flex items-center justify-center gap-2 transition-all w-full sm:w-auto ${
                    isPending
                      ? "border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-500"
                      : "bg-gray-100 text-gray-400 border border-gray-200 dark:bg-white/5 dark:border-white/5 cursor-not-allowed"
                  }`}
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </button>
                <button
                  type="button"
                  disabled={!isPending}
                  onClick={() => {
                    toast.success("Discount request approved");
                    onOpenChange(false);
                  }}
                  className={`px-8 h-[48px] rounded-[5px] font-bold text-[13px] flex items-center justify-center gap-2 transition-all w-full sm:w-auto ${
                    isPending
                      ? "bg-primary text-white hover:opacity-90"
                      : "bg-gray-100 text-gray-400 border border-gray-200 dark:bg-white/5 dark:border-white/5 cursor-not-allowed"
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Approve
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function ApplyDiscountForm({
  form,
  calculatedAmount,
  onCancel,
  onBackToList,
  onFieldChange,
}) {
  return (
    <section className="overflow-hidden rounded-[5px] border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0F172A] shadow-sm">
      {/* Header */}
      <div className="px-4 sm:px-8 py-5 sm:py-6 border-b border-gray-100 dark:border-white/5">
        <h2 className="text-[20px] font-bold text-[#1e293b] dark:text-white leading-none">
          Apply Discount
        </h2>
        <p className="text-[12px] text-gray-400 font-semibold mt-1">
          Provide valid identification documents and details.
        </p>
      </div>

      <div className="px-4 sm:px-8 py-5 sm:py-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
        {/* Search Patient section */}
        <div className="space-y-2">
          <label className="text-[13px] font-bold text-gray-600 dark:text-gray-300 ml-1">
            Search Bill or Patient
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value="INV-44920 - Michael Chang"
              readOnly
              className="w-full h-[48px] pl-12 pr-12 rounded-[5px] border border-gray-200 dark:border-white/10 dark:bg-[#1E293B] bg-white text-[14px] text-gray-700 dark:text-white placeholder:text-gray-400 outline-none focus:border-primary transition-all shadow-sm font-semibold"
            />
            <CircleX className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer" />
          </div>

          {/* Selected Patient Grid Card - premium styling */}
          <div className="grid grid-cols-1 sm:grid-cols-3 border border-gray-200 dark:border-white/10 rounded-[5px] bg-slate-50/50 dark:bg-[#0B1121]/20 overflow-hidden shadow-sm mt-3">
            <div className="space-y-1 px-6 py-4">
              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold block uppercase tracking-wide">
                Patient Name
              </span>
              <p className="font-bold text-gray-800 dark:text-white text-[13px]">
                {selectedBill.patientName}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold mt-0.5">
                UHID: {selectedBill.uhid}
              </p>
            </div>
            <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-gray-200 dark:border-white/10 px-6 py-4">
              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold block uppercase tracking-wide">
                Bill Number
              </span>
              <p className="font-bold text-gray-800 dark:text-white text-[13px]">
                {selectedBill.billNumber}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold mt-0.5">
                Date: {selectedBill.billDate}
              </p>
            </div>
            <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-gray-200 dark:border-white/10 px-6 py-4">
              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold block uppercase tracking-wide">
                Bill Total
              </span>
              <p className="font-extrabold text-primary text-[16px]">
                {selectedBill.billTotal}
              </p>
              <p className="text-[11px] text-rose-500 font-bold mt-0.5">
                Balance: {selectedBill.balance}
              </p>
            </div>
          </div>
        </div>

        {/* Discount details */}
        <div className="space-y-6 pt-4 border-t border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-2">
            <BadgePercent className="h-5 w-5 text-primary" />
            <h3 className="text-[15px] font-bold text-slate-800 dark:text-white leading-none">
              Discount Details
            </h3>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-gray-600 dark:text-gray-300 ml-1">
                Discount Type
              </label>
              <div className="relative">
                <select
                  value={form.discountType}
                  onChange={(event) =>
                    onFieldChange("discountType", event.target.value)
                  }
                  className="w-full h-[48px] pl-4 pr-10 rounded-[5px] border border-gray-200 dark:border-white/10 dark:bg-[#1E293B] bg-white text-[14px] text-gray-700 dark:text-white outline-none focus:border-primary transition-all font-semibold appearance-none"
                >
                  {discountTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-bold text-gray-600 dark:text-gray-300 ml-1">
                Request Approval From
              </label>
              <div className="relative">
                <select
                  value={form.approver}
                  onChange={(event) => onFieldChange("approver", event.target.value)}
                  className="w-full h-[48px] pl-4 pr-10 rounded-[5px] border border-gray-200 dark:border-white/10 dark:bg-[#1E293B] bg-white text-[14px] text-gray-700 dark:text-white outline-none focus:border-primary transition-all font-semibold appearance-none"
                >
                  {approverOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-bold text-gray-600 dark:text-gray-300 ml-1">
                Discount Value
              </label>
              <div className="flex rounded-[5px] border border-gray-200 dark:border-white/10 overflow-hidden bg-white dark:bg-[#1E293B]">
                <div className="flex min-w-[130px] items-center justify-center border-r border-gray-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-[12px] font-bold text-gray-500 uppercase tracking-wide shrink-0">
                  Percentage (%)
                </div>
                <input
                  type="number"
                  value={form.percentage}
                  onChange={(event) => onFieldChange("percentage", event.target.value)}
                  className="w-full h-[48px] px-4 bg-transparent text-[14px] text-gray-700 dark:text-white outline-none font-semibold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-bold text-gray-600 dark:text-gray-300 ml-1">
                Calculated Amount
              </label>
              <input
                type="text"
                value={calculatedAmount}
                readOnly
                className="w-full h-[48px] px-4 rounded-[5px] border border-gray-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-[14px] text-gray-500 dark:text-gray-400 font-bold outline-none cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-bold text-gray-600 dark:text-gray-300 ml-1">
              Reason / Remarks
            </label>
            <textarea
              value={form.reason}
              onChange={(event) => onFieldChange("reason", event.target.value)}
              placeholder="Provide context or comments for the request..."
              className="w-full min-h-[120px] p-4 rounded-[5px] border border-gray-200 dark:border-white/10 dark:bg-[#1E293B] bg-white text-[14px] text-gray-700 dark:text-white placeholder:text-gray-400 outline-none focus:border-primary transition-all font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-bold text-gray-600 dark:text-gray-300 ml-1">
              Supporting Documents (Optional)
            </label>
            <div className="flex min-h-[180px] flex-col items-center justify-center rounded-[5px] border border-dashed border-gray-300 dark:border-white/10 bg-slate-50/30 dark:bg-white/5 px-6 text-center hover:bg-slate-50/60 dark:hover:bg-white/10 transition-colors cursor-pointer">
              <div className="mb-3 rounded-full bg-indigo-50 dark:bg-indigo-950/20 p-3 shrink-0">
                <UploadCloud className="h-6 w-6 text-[#2E37A4]" />
              </div>
              <p className="text-[14px] font-bold text-[#2E37A4]">
                Click to upload or drag and drop
              </p>
              <p className="mt-1 text-[11px] text-gray-400 font-semibold">
                PDF, JPG, PNG up to 10MB
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 sm:px-8 py-5 sm:py-6 border-t border-gray-100 dark:border-white/5 bg-white dark:bg-[#0F172A] flex flex-col-reverse sm:flex-row justify-end items-stretch sm:items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-8 h-[48px] rounded-[5px] text-gray-500 font-bold text-[13px] hover:text-primary transition-all w-full sm:w-auto flex items-center justify-center"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            toast.success("Discount request submitted successfully");
            onBackToList();
          }}
          className="bg-primary text-white px-10 h-[48px] rounded-[5px] font-bold text-[13px] hover:opacity-90 transition-all shadow-none flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          Submit Request
          <ArrowRight className="h-4.5 w-4.5" />
        </button>
      </div>
    </section>
  );
}

function DiscountRequestListView({
  searchTerm,
  statusFilter,
  rows,
  onSearchChange,
  onStatusChange,
  onOpenRequestDialog,
  onBackToDiscounts,
}) {
  return (
    <>
      <FinanceHeader
        title="Discount Request List"
        className="flex-row items-center justify-between gap-3"
        actions={
          <>
          <Button
            onClick={onBackToDiscounts}
            variant="outline"
            className="h-[32px] rounded-[5px] border-primary px-3 text-[11px] font-bold text-primary hover:bg-primary/5 hover:text-primary whitespace-nowrap flex items-center justify-center"
          >
            Back
          </Button>
          <Button className="h-[32px] rounded-[5px] bg-primary px-4 text-[11px] font-bold text-white hover:opacity-90 whitespace-nowrap flex items-center justify-center">
            Bulk Approve
          </Button>
          </>
        }
      />

      <div className="space-y-5">
        <FinanceToolbar>
          <FinanceSearchField
            value={searchTerm}
            onChange={onSearchChange}
            placeholder="Search request, patient, bill, approver..."
            className="w-full sm:w-[320px]"
          />
          <FinanceSelect
            value={statusFilter}
            onChange={onStatusChange}
            placeholder="All Status"
            options={statusOptions.map((status) => ({ label: status, value: status }))}
            className="sm:min-w-[150px]"
          />
        </FinanceToolbar>

        <FinanceTableCard>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-muted/30">
              <tr className="border-b border-border">
                <th className="whitespace-nowrap px-8 py-4 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">REQUEST ID</th>
                <th className="whitespace-nowrap px-8 py-4 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">PATIENT NAME</th>
                <th className="whitespace-nowrap px-8 py-4 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">BILL NUMBER</th>
                <th className="whitespace-nowrap px-8 py-4 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">DISCOUNT TYPE</th>
                <th className="whitespace-nowrap px-8 py-4 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">AMOUNT</th>
                <th className="whitespace-nowrap px-8 py-4 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">REQUESTED BY</th>
                <th className="whitespace-nowrap px-8 py-4 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">STATUS</th>
                <th className="whitespace-nowrap px-8 py-4 text-center text-[11px] font-bold uppercase tracking-widest text-muted-foreground">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-8 py-16 text-center text-[13px] font-bold text-slate-400 dark:text-slate-500"
                  >
                    No discount requests match your current search.
                  </td>
                </tr>
              ) : (
                rows.map((request, index) => (
                  <tr
                    key={`${request.id}-${index}`}
                    className="group transition-all hover:bg-muted/20 dark:hover:bg-muted/20"
                  >
                    <td className="whitespace-nowrap px-8 py-4 text-[14px] font-bold leading-tight text-[#1e293b] dark:text-white">
                      {request.id}
                    </td>
                    <td className="whitespace-nowrap px-8 py-4 text-[14px] font-bold leading-tight text-[#1e293b] dark:text-white">
                      {request.patientName}
                    </td>
                    <td className="whitespace-nowrap px-8 py-4 text-[13px] font-semibold text-gray-500 dark:text-slate-400">
                      {request.billNumber}
                    </td>
                    <td className="whitespace-nowrap px-8 py-4 text-[13px] font-medium text-gray-500 dark:text-slate-400">
                      <DiscountTypePill value={request.discountType} />
                    </td>
                    <td className="whitespace-nowrap px-8 py-4 text-[13px] font-bold text-primary">
                      {request.amount}
                    </td>
                    <td className="px-8 py-4 text-[13px] font-semibold text-gray-600 dark:text-slate-300">
                      {request.requestedBy}
                    </td>
                    <td className="whitespace-nowrap px-8 py-4">
                      <StatusPill status={request.status} />
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => onOpenRequestDialog(request)}
                          aria-label={`View ${request.id}`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100 hover:text-[#2E37A4]"
                        >
                          <Eye className="h-5 w-5" strokeWidth={1.8} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        </FinanceTableCard>
      </div>
    </>
  );
}

export default function DiscountsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [showRequestList, setShowRequestList] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [applyForm, setApplyForm] = useState({
    discountType: "Hardship / Financial Aid",
    approver: "Dr. Sarah Smith (Director)",
    percentage: "10",
    reason:
      "Patient requested financial assistance due to unemployment. Valid supporting documents attached.",
  });

  const filteredRequests = useMemo(() => {
    if (searchTerm.length > 0 && searchTerm.trim().length === 0) {
      return [];
    }

    const query = searchTerm.trim().toLowerCase();

    return discountRequests.filter((request) => {
      const matchesSearch =
        query.length === 0 ||
        [
          request.id,
          request.patientName,
          request.billNumber,
          request.discountType,
          request.requestedBy,
          request.status,
        ].some((field) => field.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "All" || request.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const filteredRequestListRows = useMemo(() => {
    if (searchTerm.length > 0 && searchTerm.trim().length === 0) {
      return [];
    }

    const query = searchTerm.trim().toLowerCase();

    return discountRequestListRows.filter((request) => {
      const matchesSearch =
        query.length === 0 ||
        [
          request.id,
          request.patientName,
          request.billNumber,
          request.discountType,
          request.requestedBy,
          request.status,
          request.actionLabel,
        ].some((field) => field.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "All" || request.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const calculatedAmount = useMemo(() => {
    const percentage = Number(applyForm.percentage || 0);
    const amount = (4500 * percentage) / 100;
    return `${rupee}${amount.toFixed(2)}`;
  }, [applyForm.percentage]);

  const handleApplyFieldChange = (field, value) => {
    setApplyForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleOpenRequestDialog = (request) => {
    const fullRequest =
      discountRequests.find(
        (item) =>
          item.id === request.id &&
          item.billNumber === request.billNumber &&
          item.patientName.split(" ")[0] === request.patientName.split(" ")[0]
      ) || discountRequests.find((item) => item.id === request.id);

    setSelectedRequest(buildRequestDetails(fullRequest || request));
    setIsRequestDialogOpen(true);
  };

  return (
    <FinancePageShell>
      <div className="space-y-6">
        <RequestDetailsDialog
          request={selectedRequest}
          open={isRequestDialogOpen}
          onOpenChange={setIsRequestDialogOpen}
        />
        {showApplyForm ? (
          <ApplyDiscountForm
            form={applyForm}
            calculatedAmount={calculatedAmount}
            onCancel={() => setShowApplyForm(false)}
            onBackToList={() => {
              setShowApplyForm(false);
              setShowRequestList(true);
            }}
            onFieldChange={handleApplyFieldChange}
          />
        ) : showRequestList ? (
          <DiscountRequestListView
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            rows={filteredRequestListRows}
            onSearchChange={setSearchTerm}
            onStatusChange={setStatusFilter}
            onOpenRequestDialog={handleOpenRequestDialog}
            onBackToDiscounts={() => setShowRequestList(false)}
          />
        ) : (
          <>
            <FinanceHeader
              title="Discounts"
              className="flex-row items-center justify-between gap-3"
              actions={
                <>
                <Button
                  variant="outline"
                  onClick={() => setShowRequestList(true)}
                  className="h-[32px] rounded-[5px] border-primary px-3 text-[11px] font-bold text-primary hover:bg-primary/5 hover:text-primary whitespace-nowrap flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Request List
                </Button>
                <Button
                  onClick={() => setShowApplyForm(true)}
                  className="h-[32px] rounded-[5px] bg-primary px-4 text-[11px] font-bold text-white hover:opacity-90 whitespace-nowrap flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Apply Discount
                </Button>
                </>
              }
            />

            <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {summaryCards.map((card) => (
                <StatCard key={card.title} card={card} />
              ))}
            </section>

            <div className="space-y-5">
              <FinanceToolbar>
                <FinanceSearchField
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Search request, patient, bill, approver..."
                  className="w-full sm:w-[320px]"
                />
                <FinanceSelect
                  value={statusFilter}
                  onChange={setStatusFilter}
                  placeholder="All Status"
                  options={statusOptions.map((status) => ({ label: status, value: status }))}
                  className="sm:min-w-[150px]"
                />
              </FinanceToolbar>

              <FinanceTableCard>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-muted/30 dark:bg-muted/30">
                    <tr className="border-b border-border">
                      <th className="whitespace-nowrap px-8 py-4 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground dark:text-muted-foreground">REQUEST ID</th>
                      <th className="whitespace-nowrap px-8 py-4 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground dark:text-muted-foreground">PATIENT NAME</th>
                      <th className="whitespace-nowrap px-8 py-4 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground dark:text-muted-foreground">BILL NUMBER</th>
                      <th className="whitespace-nowrap px-8 py-4 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground dark:text-muted-foreground">DISCOUNT TYPE</th>
                      <th className="whitespace-nowrap px-8 py-4 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground dark:text-muted-foreground">AMOUNT</th>
                      <th className="whitespace-nowrap px-8 py-4 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground dark:text-muted-foreground">REQUESTED BY</th>
                      <th className="whitespace-nowrap px-8 py-4 text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground dark:text-muted-foreground">STATUS</th>
                      <th className="whitespace-nowrap px-8 py-4 text-center text-[11px] font-bold uppercase tracking-widest text-muted-foreground dark:text-muted-foreground">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredRequests.length === 0 ? (
                      <tr>
                        <td
                          colSpan={8}
                          className="px-8 py-16 text-center text-[13px] font-bold text-slate-400 dark:text-slate-500"
                        >
                          No discount requests match your current search.
                        </td>
                      </tr>
                    ) : (
                      filteredRequests.map((request) => (
                        <tr
                          key={request.id}
                          className="group transition-all hover:bg-muted/20 dark:hover:bg-muted/20"
                        >
                          <td className="whitespace-nowrap px-8 py-4 text-[14px] font-bold leading-tight text-[#1e293b] dark:text-white">
                            {request.id}
                          </td>
                          <td className="whitespace-nowrap px-8 py-4 text-[14px] font-bold leading-tight text-[#1e293b] dark:text-white font-bold">
                            {request.patientName}
                          </td>
                          <td className="whitespace-nowrap px-8 py-4 text-[13px] font-semibold text-gray-500 dark:text-slate-400">
                            {request.billNumber}
                          </td>
                          <td className="whitespace-nowrap px-8 py-4">
                            <DiscountTypePill value={request.discountType} />
                          </td>
                          <td className="whitespace-nowrap px-8 py-4 text-[13px] font-bold text-primary">
                            {request.amount}
                          </td>
                          <td className="px-8 py-4 text-[13px] font-semibold text-gray-600 dark:text-slate-300">
                            {request.requestedBy}
                          </td>
                          <td className="whitespace-nowrap px-8 py-4">
                            <StatusPill status={request.status} />
                          </td>
                          <td className="px-8 py-4 text-center">
                            <button
                              type="button"
                              onClick={() => handleOpenRequestDialog(request)}
                              aria-label={`View ${request.id}`}
                              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100 hover:text-[#2E37A4]"
                            >
                              <Eye className="h-5 w-5" strokeWidth={1.8} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              </FinanceTableCard>
            </div>
          </>
        )}
      </div>
    </FinancePageShell>
  );
}
