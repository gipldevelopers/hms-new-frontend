"use client";

import { useMemo, useState } from "react";
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
    <FinanceStatCard
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
          : "indigo"
      }
      meta={card.change}
    />
  );
}

function StatusPill({ status }) {
  const statusStyles = {
    Approved: "bg-emerald-100 text-emerald-700",
    Pending: "bg-amber-100 text-amber-600",
    Rejected: "bg-rose-100 text-rose-600",
  };

  return (
    <span
      className={`inline-flex min-w-[78px] justify-center rounded-full px-3 py-1 text-xs font-medium ${
        statusStyles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}

function DiscountTypePill({ value }) {
  return (
    <Badge className="rounded-full border-0 bg-slate-100 px-3 py-1 text-xs font-medium normal-case tracking-normal text-slate-500 hover:bg-slate-100 dark:bg-white/10 dark:text-slate-300">
      {value}
    </Badge>
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
  if (!request) return null;

  const statusStyles = {
    Approved: "bg-emerald-100 text-emerald-700",
    Pending: "bg-amber-100 text-amber-600",
    Rejected: "bg-rose-100 text-rose-600",
  };
  const isPending = request.status === "Pending";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100vh-64px)] max-w-[760px] grid-rows-[auto_minmax(0,1fr)_auto] gap-0 rounded-[24px] border border-slate-200 bg-white p-0 shadow-[0_30px_90px_rgba(15,23,42,0.22)] dark:border-white/10 dark:bg-[#101935]">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-white/10">
          <div className="flex items-center gap-4">
            <DialogTitle className="text-[1.5rem] font-bold text-slate-900 dark:text-white">
              Request {request.id}
            </DialogTitle>
            <span
              className={`inline-flex rounded-full px-3 py-1 text-[11px] font-medium ${
                statusStyles[request.status] || "bg-slate-100 text-slate-600"
              }`}
            >
              {request.status}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-slate-200"
            aria-label="Close request details"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="max-h-[calc(100vh-220px)] space-y-5 overflow-y-auto px-5 py-5">
          <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#0B1121]">
            <div className="mb-4 flex items-center gap-3 text-base font-semibold text-slate-900 dark:text-white">
              <FileText className="h-4.5 w-4.5 text-[#3B47D8]" />
              <span>Request Summary</span>
            </div>
            <div className="grid gap-5 md:grid-cols-4">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-400">
                  Requested By
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-xs font-semibold text-violet-700">
                    {request.requestedBy
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <p className="text-sm text-slate-900 dark:text-white">{request.requestedBy}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-400">
                  Date & Time
                </p>
                <div className="flex items-center gap-2 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                  <CalendarDays className="h-4 w-4 text-slate-500" />
                  <span>{request.requestedAt}</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-400">
                  Discount Type
                </p>
                <DiscountTypePill value={request.discountType} />
              </div>
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-400">
                  Requested Amount
                </p>
                <div className="flex items-center gap-2 text-sm font-semibold text-[#3B47D8]">
                  <BadgePercent className="h-4 w-4" />
                  <span>{request.amount}</span>
                  <span className="text-xs font-medium text-slate-400">
                    ({request.percentage})
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#0B1121]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-base font-semibold text-slate-900 dark:text-white">
                <UserRound className="h-4.5 w-4.5 text-[#3B47D8]" />
                <span>Patient & Bill Details</span>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-2 text-xs font-medium text-[#3B47D8] transition hover:text-[#2b35ae]"
              >
                View Full Bill
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-4 rounded-[20px] border border-slate-200 bg-slate-50/60 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-base font-semibold text-blue-700">
                  {request.patientInitials}
                </div>
                <div>
                  <p className="text-base font-semibold text-slate-900 dark:text-white">
                    {request.patientName}
                  </p>
                  <p className="text-xs text-slate-500">{request.patientMeta}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">Bill Number</span>
                <span className="font-medium text-slate-900 dark:text-white">{request.billNumber}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">Gross Total</span>
                <span className="font-medium text-slate-900 dark:text-white">{request.grossTotal}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">Proposed Discount</span>
                <span className="rounded-lg bg-blue-50 px-3 py-1 font-medium text-[#3B47D8]">
                  {request.proposedDiscount}
                </span>
              </div>
              <div className="border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-base font-semibold text-slate-900 dark:text-white">
                    Revised Net Payable
                  </span>
                  <span className="text-[1.3rem] font-bold text-slate-900 dark:text-white">
                    {request.revisedNetPayable}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#0B1121]">
            <div className="mb-4 flex items-center gap-3 text-base font-semibold text-slate-900 dark:text-white">
              <ReceiptText className="h-4.5 w-4.5 text-[#6A63FF]" />
              <span>Reason & Documents</span>
            </div>

            <div className="mb-4 rounded-[20px] border border-slate-200 bg-slate-50/60 p-4 text-xs italic leading-6 text-slate-500">
              &quot;{request.reason}&quot;
            </div>

            <div className="flex items-center justify-between gap-4 rounded-[20px] border border-slate-200 bg-white px-4 py-3">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-rose-50 p-2.5">
                  <Paperclip className="h-4.5 w-4.5 text-rose-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {request.documentName}
                  </p>
                  <p className="text-xs text-slate-400">{request.documentMeta}</p>
                </div>
              </div>
              <button
                type="button"
                className="rounded-full border border-slate-200 p-2.5 text-slate-500 transition hover:bg-slate-50 hover:text-[#3B47D8]"
                aria-label={`Download ${request.documentName}`}
              >
                <Download className="h-4.5 w-4.5" />
              </button>
            </div>
          </section>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-white/10 dark:bg-white/5">
          <Button
            variant="outline"
            className="h-11 rounded-2xl border-slate-200 bg-white px-4 text-[11px] font-medium leading-none text-slate-700 hover:bg-slate-100"
          >
            <MessageSquareText className="mr-2 h-4 w-4" />
            Request Info
          </Button>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              disabled={!isPending}
              className={`h-11 rounded-2xl px-4 text-[11px] font-medium leading-none ${
                isPending
                  ? "border-rose-200 bg-white text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                  : "border-slate-200 bg-slate-100 text-slate-400 hover:bg-slate-100 hover:text-slate-400"
              }`}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button
              disabled={!isPending}
              className={`h-11 rounded-2xl px-4 text-[11px] font-medium leading-none ${
                isPending
                  ? "bg-[#2E37A4] text-white hover:bg-[#232b82]"
                  : "bg-slate-200 text-slate-400 hover:bg-slate-200"
              }`}
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

function ApplyDiscountForm({
  form,
  calculatedAmount,
  onCancel,
  onBackToList,
  onFieldChange,
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)] dark:border-white/10 dark:bg-[#101935]">
      <div className="space-y-8 px-8 py-10">
        <div className="space-y-1">
            <h1 className="text-[2.2rem] font-bold tracking-tight text-slate-900 dark:text-white">
            Apply Discount
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400">
            Provide valid identification documents.
          </p>
        </div>

        <div className="space-y-4">
          <label className="block text-[1.05rem] font-medium text-slate-900">
            Search Bill or Patient
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <Input
              value="INV-44920 - Michael Chang"
              readOnly
            className="h-12 rounded-2xl border-slate-200 pl-12 pr-12 text-lg text-slate-700 shadow-none dark:border-white/10 dark:bg-[#0B1121] dark:text-slate-300"
            />
            <CircleX className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
          </div>

          <div className="grid gap-0 overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50/40 dark:border-white/10 dark:bg-white/5 lg:grid-cols-3">
            <div className="space-y-1 px-6 py-5">
              <p className="text-sm uppercase tracking-[0.12em] text-slate-400">
                Patient Name
              </p>
              <p className="text-[1.05rem] font-semibold text-slate-900 dark:text-white">
                {selectedBill.patientName}
              </p>
              <p className="text-lg text-slate-500">UHID: {selectedBill.uhid}</p>
            </div>
            <div className="space-y-1 border-t border-slate-200 px-6 py-5 lg:border-l lg:border-t-0">
              <p className="text-sm uppercase tracking-[0.12em] text-slate-400">
                Bill Number
              </p>
              <p className="text-[1.05rem] font-semibold text-slate-900">
                {selectedBill.billNumber}
              </p>
              <p className="text-lg text-slate-500">{selectedBill.billDate}</p>
            </div>
            <div className="space-y-1 border-t border-slate-200 px-6 py-5 lg:border-l lg:border-t-0">
              <p className="text-sm uppercase tracking-[0.12em] text-slate-400">
                Bill Total
              </p>
              <p className="text-[1.7rem] font-bold text-slate-900">
                {selectedBill.billTotal}
              </p>
              <p className="text-lg text-slate-500">
                Balance: {selectedBill.balance}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-7">
          <h2 className="text-[2rem] font-bold tracking-tight text-slate-900 dark:text-white">
            Discount Details
          </h2>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <label className="block text-[1.05rem] font-medium text-slate-900">
                Discount Type
              </label>
              <div className="relative">
                <select
                  value={form.discountType}
                  onChange={(event) =>
                    onFieldChange("discountType", event.target.value)
                  }
                  className="h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 pr-10 text-lg text-slate-800 outline-none dark:border-white/10 dark:bg-[#0B1121] dark:text-slate-300"
                >
                  {discountTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-[1.05rem] font-medium text-slate-900">
                Request Approval From
              </label>
              <div className="relative">
                <select
                  value={form.approver}
                  onChange={(event) => onFieldChange("approver", event.target.value)}
                  className="h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 pr-10 text-lg text-slate-800 outline-none dark:border-white/10 dark:bg-[#0B1121] dark:text-slate-300"
                >
                  {approverOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-[1.05rem] font-medium text-slate-900">
                Discount Value
              </label>
              <div className="flex overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10">
                <div className="flex min-w-[145px] items-center border-r border-slate-200 bg-slate-50 px-4 text-lg text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
                  Percentage (%)
                </div>
                <input
                  type="number"
                  value={form.percentage}
                  onChange={(event) => onFieldChange("percentage", event.target.value)}
                  className="h-12 w-full bg-transparent px-4 text-lg text-slate-900 outline-none dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-[1.05rem] font-medium text-slate-900">
                Calculated Amount
              </label>
              <Input
                value={calculatedAmount}
                readOnly
                className="h-12 rounded-2xl border-slate-200 bg-slate-50 px-4 text-lg text-slate-500 shadow-none dark:border-white/10 dark:bg-white/5 dark:text-slate-400"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-[1.05rem] font-medium text-slate-900">
              Reason / Remarks
            </label>
            <textarea
              value={form.reason}
              onChange={(event) => onFieldChange("reason", event.target.value)}
              className="min-h-[130px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-lg text-slate-800 outline-none dark:border-white/10 dark:bg-[#0B1121] dark:text-slate-300"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-[1.05rem] font-medium text-slate-900">
              Supporting Documents (Optional)
            </label>
            <div className="flex min-h-[210px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-300 bg-slate-50/30 px-6 text-center dark:border-white/10 dark:bg-white/5">
              <div className="mb-4 rounded-full bg-indigo-100 p-4">
                <UploadCloud className="h-6 w-6 text-[#2E37A4]" />
              </div>
              <p className="text-xl font-medium text-[#2E37A4]">
                Click to upload or drag and drop
              </p>
              <p className="mt-2 text-base text-slate-400">
                PDF, JPG, PNG up to 10MB
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 border-t border-slate-200 bg-slate-50 px-8 py-5 dark:border-white/10 dark:bg-white/5">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-lg font-medium text-slate-500 transition hover:text-slate-700"
        >
          Cancel
        </button>
        <Button
          onClick={onBackToList}
          className="h-12 rounded-2xl bg-[#2E37A4] px-6 text-lg font-medium text-white hover:bg-[#232b82]"
        >
          Submit Request
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
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
        actions={
          <>
          <Button
            onClick={onBackToDiscounts}
            variant="outline"
            className="h-[48px] rounded-[5px] border-primary px-5 text-[13px] font-bold text-primary hover:bg-primary/5 hover:text-primary"
          >
            Back
          </Button>
          <Button className="h-[48px] rounded-[5px] bg-primary px-5 text-[13px] font-bold text-white hover:opacity-90">
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
          <table className="min-w-full">
            <thead className="bg-muted/30">
              <tr className="border-b border-border text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                <th className="px-5 py-4">Request ID</th>
                <th className="px-5 py-4">Patient Name</th>
                <th className="px-5 py-4">Bill Number</th>
                <th className="px-5 py-4">Discount Type</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Requested by</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-16 text-center text-sm font-medium text-slate-400"
                  >
                    No discount requests match your current search.
                  </td>
                </tr>
              ) : (
                rows.map((request, index) => (
                  <tr
                    key={`${request.id}-${index}`}
                    className="border-b border-border text-sm text-slate-900 transition-colors hover:bg-muted/20"
                  >
                    <td className="whitespace-nowrap px-5 py-5 font-medium">
                      {request.id}
                    </td>
                    <td className="whitespace-nowrap px-5 py-5">
                      {request.patientName}
                    </td>
                    <td className="whitespace-nowrap px-5 py-5">
                      {request.billNumber}
                    </td>
                    <td className="whitespace-nowrap px-5 py-5">
                      <DiscountTypePill value={request.discountType} />
                    </td>
                    <td className="whitespace-nowrap px-5 py-5 font-medium">
                      {request.amount}
                    </td>
                    <td className="px-5 py-5">{request.requestedBy}</td>
                    <td className="whitespace-nowrap px-5 py-5">
                      <StatusPill status={request.status} />
                    </td>
                    <td className="px-5 py-5">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => onOpenRequestDialog(request)}
                          aria-label={`View ${request.id}`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100 hover:text-[#2E37A4]"
                        >
                          <Eye className="h-5 w-5" strokeWidth={1.8} />
                        </button>
                        <Button className="h-9 rounded-xl bg-[#2E37A4] px-4 text-xs font-medium text-white hover:bg-[#232b82]">
                          {request.actionLabel}
                        </Button>
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
    <FinancePageShell className="px-6 py-7">
      <div className="mx-auto max-w-[1700px] space-y-6">
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
              actions={
                <>
                <Button
                  variant="outline"
                  onClick={() => setShowRequestList(true)}
                  className="h-[48px] rounded-[5px] border-primary px-5 text-[13px] font-bold text-primary hover:bg-primary/5 hover:text-primary"
                >
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Request List
                </Button>
                <Button
                  onClick={() => setShowApplyForm(true)}
                  className="h-[48px] rounded-[5px] bg-primary px-5 text-[13px] font-bold text-white hover:opacity-90"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Apply Discount
                </Button>
                </>
              }
            />

            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
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
                <table className="min-w-full">
                  <thead className="bg-muted/30 dark:bg-muted/30">
                    <tr className="border-b border-border text-left text-[11px] font-bold uppercase tracking-widest text-muted-foreground dark:border-border dark:text-muted-foreground">
                      <th className="px-5 py-4">Request ID</th>
                      <th className="px-5 py-4">Patient Name</th>
                      <th className="px-5 py-4">Bill Number</th>
                      <th className="px-5 py-4">Discount Type</th>
                      <th className="px-5 py-4">Amount</th>
                      <th className="px-5 py-4">Requested by</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.length === 0 ? (
                      <tr>
                        <td
                          colSpan={8}
                          className="px-5 py-16 text-center text-sm font-medium text-slate-400 dark:text-slate-500"
                        >
                          No discount requests match your current search.
                        </td>
                      </tr>
                    ) : (
                      filteredRequests.map((request) => (
                        <tr
                          key={request.id}
                          className="border-b border-border text-sm text-slate-900 transition-colors hover:bg-muted/20 dark:border-border dark:text-white dark:hover:bg-muted/20"
                        >
                          <td className="whitespace-nowrap px-5 py-5 font-medium">
                            {request.id}
                          </td>
                          <td className="whitespace-nowrap px-5 py-5">
                            {request.patientName}
                          </td>
                          <td className="whitespace-nowrap px-5 py-5">
                            {request.billNumber}
                          </td>
                          <td className="whitespace-nowrap px-5 py-5">
                            <DiscountTypePill value={request.discountType} />
                          </td>
                          <td className="whitespace-nowrap px-5 py-5 font-medium">
                            {request.amount}
                          </td>
                          <td className="px-5 py-5">{request.requestedBy}</td>
                          <td className="whitespace-nowrap px-5 py-5">
                            <StatusPill status={request.status} />
                          </td>
                          <td className="px-5 py-5 text-center">
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
