"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Plus,
  IndianRupee,
  Clock,
  Shield,
  RefreshCcw,
  Eye,
  Ticket,
  ChevronDown,
  X,
  Banknote,
  CreditCard,
  Smartphone,
  Landmark,
  Activity,
  CheckCircle2,
  Printer,
  Download,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

// --- MOCK DATA ---
const statsData = [
  {
    title: "Today's Collection",
    value: "₹24,500.00",
    change: "+12%",
    changeType: "positive",
    subtitle: "vs yesterday",
    icon: IndianRupee,
    iconColor: "text-indigo-600",
    iconBg: "bg-indigo-100",
  },
  {
    title: "Pending Payments",
    value: "₹24,50", // As per screenshot
    change: "+5%",
    changeType: "positive",
    subtitle: "vs yesterday",
    icon: Clock,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-100",
  },
  {
    title: "Insurance Statements",
    value: "42 Pending",
    change: "-2",
    changeType: "negative",
    subtitle: "vs avg",
    icon: Shield,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-100",
  },
  {
    title: "Refunds Request",
    value: "₹450",
    change: "+2",
    changeType: "positive",
    subtitle: "vs yesterday",
    icon: RefreshCcw,
    iconColor: "text-rose-600",
    iconBg: "bg-rose-100",
  },
];

const tableData = [
  {
    invoiceId: "#INV-2023-001",
    patient: "Robert Fox",
    uhid: "P-882910",
    totalAmount: "₹450.00",
    dueAmount: "₹450.00",
    date: "Oct 23, 2023",
    status: "Pending",
    actionText: "Collect",
    paymentMethod: "Cash",
    items: [
      { name: "General Consultation", amount: "₹350.00" },
      { name: "Basic Vitals Check", amount: "₹100.00" },
    ],
  },
  {
    invoiceId: "#INV-2023-002",
    patient: "Sophia Turner",
    uhid: "P-882911",
    totalAmount: "₹600.00",
    dueAmount: "₹00.00",
    date: "Oct 24, 2023",
    status: "Completed",
    actionText: "Review",
    paymentMethod: "Credit Card",
    items: [
      { name: "General Consultation", amount: "₹500.00" },
      { name: "Basic Vitals Check", amount: "₹100.00" },
    ],
  },
  {
    invoiceId: "#INV-2023-003",
    patient: "Michael Smith",
    uhid: "P-882912",
    totalAmount: "₹750.00",
    dueAmount: "₹750.00",
    date: "Oct 25, 2023",
    status: "Pending",
    actionText: "Collect",
    paymentMethod: "UPI",
    items: [
      { name: "General Consultation", amount: "₹500.00" },
      { name: "Lab Investigations", amount: "₹250.00" },
    ],
  },
  {
    invoiceId: "#INV-2023-004",
    patient: "Emily Johnson",
    uhid: "P-882913",
    totalAmount: "₹300.00",
    dueAmount: "₹300.00",
    date: "Oct 26, 2023",
    status: "Overdue",
    actionText: "Pay",
    paymentMethod: "Bank",
    items: [
      { name: "General Consultation", amount: "₹200.00" },
      { name: "Pharmacy Charges", amount: "₹100.00" },
    ],
  },
  {
    invoiceId: "#INV-2023-005",
    patient: "Daniel Wilson",
    uhid: "P-882914",
    totalAmount: "₹1200.00",
    dueAmount: "₹1200.00",
    date: "Oct 27, 2023",
    status: "Paid",
    actionText: "Refund",
    paymentMethod: "Card",
    refundAmount: "₹450.00",
    totalBilled: "₹2,050.00",
    totalPaid: "₹2,500.00",
    items: [
      { name: "Specialist Consultation", amount: "₹800.00" },
      { name: "Diagnostic Scans", amount: "₹400.00" },
    ],
  },
  {
    invoiceId: "#INV-2023-006",
    patient: "Olivia Brown",
    uhid: "P-882915",
    totalAmount: "₹500.00",
    dueAmount: "₹500.00",
    date: "Oct 28, 2023",
    status: "Pending",
    actionText: "Collect",
    paymentMethod: "Cash",
    items: [
      { name: "General Consultation", amount: "₹400.00" },
      { name: "Nursing Charges", amount: "₹100.00" },
    ],
  },
  {
    invoiceId: "#INV-2023-007",
    patient: "James Davis",
    uhid: "P-882916",
    totalAmount: "₹900.00",
    dueAmount: "₹900.00",
    date: "Oct 29, 2023",
    status: "Completed",
    actionText: "Review",
    paymentMethod: "Bank Transfer",
    items: [
      { name: "ICU Charges", amount: "₹800.00" },
      { name: "Vitals Check", amount: "₹100.00" },
    ],
  },
  {
    invoiceId: "#INV-2023-008",
    patient: "Ava Miller",
    uhid: "P-882917",
    totalAmount: "₹250.00",
    dueAmount: "₹250.00",
    date: "Oct 30, 2023",
    status: "Overdue",
    actionText: "Pay",
    paymentMethod: "UPI",
    items: [
      { name: "General Consultation", amount: "₹150.00" },
      { name: "ECG Charges", amount: "₹100.00" },
    ],
  },
];

// --- HELPER COMPONENTS ---

// 1. Stat Card Component
const StatCard = ({ stat }) => {
  const Icon = stat.icon;
  return (
    <CompactStatCard
      title={stat.title}
      value={stat.value}
      icon={Icon}
      color={
        stat.iconColor.includes("emerald")
          ? "emerald"
          : stat.iconColor.includes("amber")
          ? "amber"
          : stat.iconColor.includes("rose")
          ? "rose"
          : "blue"
      }
      meta={`${stat.change} ${stat.subtitle}`}
    />
  );
};

// 2. Status Badge Helper
const getStatusBadge = (status) => {
  const baseClasses = "inline-flex min-w-[82px] justify-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider border";
  switch (status.toLowerCase()) {
    case "completed":
    case "paid":
      return (
        <span className={`${baseClasses} bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20`}>
          {status}
        </span>
      );
    case "pending":
      return (
        <span className={`${baseClasses} bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20`}>
          {status}
        </span>
      );
    case "overdue":
      return (
        <span className={`${baseClasses} bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20`}>
          {status}
        </span>
      );
    default:
      return (
        <span className={`${baseClasses} bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-500/10 dark:text-slate-400 dark:border-white/5`}>
          {status}
        </span>
      );
  }
};


// 3. Collect Payment Modal Component
const CollectPaymentModal = ({ isOpen, onClose, invoice }) => {
  const [paymentMethod, setPaymentMethod] = useState("Card");

  if (!invoice) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[600px] p-0 border-0 rounded-xl overflow-hidden bg-white flex flex-col">
        <div className="px-4 sm:px-6 py-3.5 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
          <DialogTitle className="text-base font-bold text-gray-900">Collect Payment</DialogTitle>
          <button onClick={() => onClose(false)} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 sm:px-6 py-4 sm:py-5 bg-white space-y-3.5 flex-1 overflow-y-auto">
          {/* Invoice Summary Box */}
          <div className="bg-gray-50/80 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border border-gray-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-gray-900">{invoice.invoiceId}</span>
                <span className="bg-orange-100 text-orange-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Pending
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Patient: {invoice.patient} • UHID: {invoice.uhid}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs text-gray-500 font-medium mb-1">Due Amount</p>
              <p className="text-lg font-bold text-rose-500">{invoice.dueAmount}</p>
            </div>
          </div>

          {/* Paying Amount */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Paying Amount</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IndianRupee className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="text"
                defaultValue={invoice.dueAmount.replace("₹", "")}
                className="pl-8 font-medium h-11 border-gray-200"
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">Remaining balance will be ₹0.00</p>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Method</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: "Cash", icon: Banknote },
                { id: "Card", icon: CreditCard },
                { id: "UPI", icon: Smartphone },
                { id: "Bank", icon: Landmark },
              ].map((method) => {
                const Icon = method.icon;
                const isSelected = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex flex-col items-center justify-center py-2.5 rounded-lg border transition-all ${
                      isSelected
                        ? "border-[#312e81] bg-indigo-50/30"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 mb-1.5 ${
                        isSelected ? "text-[#312e81]" : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`text-xs font-semibold ${
                        isSelected ? "text-[#312e81]" : "text-gray-500"
                      }`}
                    >
                      {method.id}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Transaction Reference */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Transaction Reference (Optional)
            </label>
            <Input
              type="text"
              placeholder="e.g., TXN-123456789"
              className="h-11 border-gray-200 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 border-t border-gray-100 bg-white flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-3 shrink-0">
          <button 
            onClick={() => onClose(false)} 
            className="flex items-center justify-center border border-transparent text-gray-500 hover:text-gray-800 font-semibold px-6 h-9 rounded-lg hover:bg-gray-50 transition-all text-sm w-full sm:w-auto"
          >
            Cancel
          </button>
          <button className="flex items-center justify-center bg-[#312e81] hover:bg-[#1e1b4b] text-white font-semibold px-6 h-9 rounded-lg shadow-sm w-full sm:w-auto">
            Confirm & Collect
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// 4. Review Invoice Modal Component
const ReviewInvoiceModal = ({ isOpen, onClose, invoice }) => {
  if (!invoice) return null;

  const status = invoice.status.toLowerCase();
  const isPaid = status === "completed" || status === "paid";
  const statusBadgeBg = isPaid ? "bg-emerald-50 text-emerald-500 border-emerald-100" : "bg-orange-50 text-orange-500 border-orange-100";
  const statusText = isPaid ? "PAID" : "PENDING";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[620px] p-0 border-0 rounded-xl overflow-hidden bg-white flex flex-col">
        <div className="px-4 sm:px-6 py-3.5 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
          <DialogTitle className="text-base font-bold text-gray-900">Invoice Details</DialogTitle>
          <button onClick={() => onClose(false)} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3.5 bg-[#fafafa] flex-1 overflow-y-auto">
          <div className="bg-white border border-gray-100 rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
            {/* Header / Logo */}
            <div className="flex justify-between items-start mb-1">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-[#312e81] flex items-center justify-center text-white shadow-sm shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">MediCore Hospital</h3>
                  <p className="text-[10px] text-gray-400">123 Health Ave, Medical District</p>
                </div>
              </div>
              <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide border shrink-0 ${statusBadgeBg}`}>
                {statusText}
              </span>
            </div>

            {/* Billed To & Invoice Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-1 border-t border-b border-gray-50 py-3">
              <div>
                <p className="text-[10px] text-gray-400 mb-0.5">Billed To:</p>
                <p className="font-bold text-gray-900 text-xs">{invoice.patient}</p>
                <p className="text-[10px] text-gray-400 font-medium">UHID: {invoice.uhid}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 mb-0.5">Invoice Details:</p>
                <p className="font-bold text-gray-900 text-xs">{invoice.invoiceId.replace("#", "")}</p>
                <p className="text-[10px] text-gray-400 font-medium">Date: {invoice.date}</p>
              </div>
            </div>

            {/* Line Items */}
            <div className="mb-1">
              <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2 border-b border-gray-100 pb-1">
                <span>Description</span>
                <span className="text-right w-24">Amount</span>
              </div>
              {(invoice.items || [
                { name: "General Consultation", amount: "₹500.00" },
                { name: "Basic Vitals Check", amount: "₹100.00" }
              ]).map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs text-gray-700 py-1.5">
                  <span className="font-semibold text-gray-800">{item.name}</span>
                  <span className="font-bold text-gray-900 text-right w-24">{item.amount}</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-1 border-t border-gray-50 pt-2">
              <div className="w-full sm:w-1/2 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400 font-medium">Subtotal</span>
                  <span className="text-gray-900 font-bold">{invoice.totalAmount}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400 font-medium">Tax (0%)</span>
                  <span className="text-gray-900 font-bold">₹0.00</span>
                </div>
                <div className="flex justify-between items-center pt-1.5 border-t border-gray-100">
                  <span className="font-bold text-xs text-gray-900">Total</span>
                  <span className="font-extrabold text-gray-900 text-base">{invoice.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Paid Banner */}
            {isPaid && (
              <div className="bg-[#ecfdf5] border border-emerald-100 rounded-lg p-2.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3 text-emerald-600" />
                  </div>
                  <span className="text-emerald-800 text-xs font-semibold">Paid via {invoice.paymentMethod || "Credit Card"}</span>
                </div>
                <span className="text-emerald-700 font-extrabold text-xs shrink-0">{invoice.totalAmount}</span>
              </div>
            )}
            
            {/* Initiate Refund Button */}
            {isPaid && (
              <div className="flex justify-end">
                <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-500 hover:text-gray-700 text-[11px] font-semibold rounded-md hover:bg-gray-50 transition-colors bg-white shadow-sm">
                  <RefreshCcw className="w-3 h-3 text-gray-400" />
                  Initiate Refund
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 border-t border-gray-100 bg-white flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 shrink-0">
          <Button variant="outline" onClick={() => toast.info("Printing receipt...")} className="flex items-center justify-center gap-1.5 border-gray-200 text-gray-700 bg-white h-9 text-xs font-bold px-4 hover:bg-gray-50 transition-all rounded-lg w-full sm:w-auto">
            <Printer className="w-3.5 h-3.5 text-gray-500" />
            Print Receipt
          </Button>
          <button onClick={() => toast.info("Downloading PDF invoice...")} className="bg-[#312e81] hover:bg-[#1e1b4b] text-white text-xs font-bold px-4 h-9 flex items-center justify-center gap-1.5 rounded-lg shadow-sm transition-all w-full sm:w-auto">
            <Download className="w-3.5 h-3.5" />
            Download PDF
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// 5. Process Refund Modal Component
const ProcessRefundModal = ({ isOpen, onClose, invoice }) => {
  const [refundMethod, setRefundMethod] = useState("Source");

  if (!invoice) return null;

  const refundAmt = invoice.refundAmount || "₹450.00";
  const billedAmt = invoice.totalBilled || "₹2,050.00";
  const paidAmt = invoice.totalPaid || "₹2,500.00";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[600px] p-0 border-0 rounded-xl overflow-hidden bg-white shadow-lg flex flex-col">
        <div className="px-4 sm:px-6 py-3.5 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
          <DialogTitle className="text-lg font-bold text-gray-900">Process Refund</DialogTitle>
          <button onClick={() => onClose(false)} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 sm:px-6 py-4 sm:py-5 bg-white space-y-3.5 flex-1 overflow-y-auto">
          {/* Overpayment Warning Card */}
          <div className="bg-[#fef2f2] border border-[#fee2e2] rounded-xl p-3 flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-[#b91c1c] text-sm">Overpayment Detected</h4>
                <p className="text-xs text-[#f87171] mt-0.5 font-medium">Patient has paid more than the final bill amount.</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#fee2e2] flex items-center justify-center shrink-0">
                <AlertCircle className="w-4.5 h-4.5 text-[#ef4444]" />
              </div>
            </div>
            <div className="border-t border-[#fee2e2] pt-2 flex justify-between items-center">
              <span className="text-[#b91c1c] text-sm font-semibold">Refund Amount</span>
              <span className="text-[#ef4444] text-2xl font-extrabold">{refundAmt}</span>
            </div>
          </div>

          {/* Billed vs Paid 2-Column Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
            <div className="border border-gray-100 rounded-lg py-2 px-3.5 bg-white">
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Total Billed</span>
              <p className="text-base font-extrabold text-gray-800 mt-0.5">{billedAmt}</p>
            </div>
            <div className="border border-gray-100 rounded-lg py-2 px-3.5 bg-white">
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Total Paid (Advance)</span>
              <p className="text-base font-extrabold text-gray-800 mt-0.5">{paidAmt}</p>
            </div>
          </div>

          {/* Refund Method Selection */}
          <div>
            <span className="text-sm text-gray-800 font-bold mb-2 block">Refund Method</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: "Source", label: "Original Source", icon: RotateCcw },
                { id: "Cash", label: "Cash", icon: Banknote },
                { id: "Bank", label: "Bank Transfer", icon: Landmark },
              ].map((method) => {
                const Icon = method.icon;
                const isSelected = refundMethod === method.id;
                return (
                  <button
                    key={method.id}
                    onClick={() => setRefundMethod(method.id)}
                    className={`flex flex-col items-center justify-center py-2.5 rounded-lg border transition-all ${
                      isSelected
                        ? "border-[#312e81] bg-indigo-50/20"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <Icon
                      className={`w-4.5 h-4.5 mb-1 ${
                        isSelected ? "text-[#312e81]" : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`text-xs font-bold ${
                        isSelected ? "text-[#312e81]" : "text-gray-500"
                      }`}
                    >
                      {method.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="min-h-8 mt-1.5 overflow-hidden">
              <span className="text-[10px] text-gray-400 block transition-all">
                {refundMethod === "Source" && "Original source (Card ending in 4242) will take 3-5 business days."}
                {refundMethod === "Cash" && "Cash refunds are processed immediately at the billing counter."}
                {refundMethod === "Bank" && "Bank transfers will be processed to the patient's verified account in 1-2 business days."}
              </span>
            </div>
          </div>

          {/* Refund Reason */}
          <div>
            <span className="text-sm text-gray-800 font-bold mb-1.5 block">Refund Reason</span>
            <div className="relative">
              <select className="h-10 border border-gray-200 rounded-md w-full bg-white px-3 text-sm text-gray-700 font-medium appearance-none focus:outline-none focus:border-gray-300">
                <option>Advance Payment Overages</option>
                <option>Treatment Cancelled</option>
                <option>Billing Error</option>
                <option>Other</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Notes Optional */}
          <div>
            <span className="text-sm text-gray-800 font-bold mb-1.5 block">Notes (Optional)</span>
            <textarea
              placeholder="Add internal notes regarding this refund..."
              className="h-14 border border-gray-200 rounded-md w-full p-2.5 text-sm text-gray-700 placeholder:text-gray-400 bg-white border resize-none focus:outline-none focus:border-gray-300"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 border-t border-gray-100 bg-white flex flex-col-reverse sm:flex-row justify-end items-stretch sm:items-center gap-3 shrink-0">
          <button
            onClick={() => onClose(false)}
            className="flex items-center justify-center border border-transparent text-gray-500 hover:text-gray-800 font-bold h-9 rounded-lg hover:bg-gray-50 transition-colors text-sm w-full sm:w-auto"
          >
            Cancel
          </button>
          <button 
            onClick={() => onClose(false)}
            className="flex items-center justify-center bg-[#312e81] hover:bg-[#1e1b4b] text-white text-sm font-bold px-4 h-9.5 rounded-lg shadow-sm transition-all w-full sm:w-auto"
          >
            Confirm & Refund
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// --- MAIN PAGE COMPONENT ---
function PatientBillingPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reviewId = searchParams?.get("review");
  const collectId = searchParams?.get("collect");
  const refundId = searchParams?.get("refund");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Derived filtered list
  const filteredData = tableData.filter((row) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      row.invoiceId.toLowerCase().includes(q) ||
      row.patient.toLowerCase().includes(q) ||
      row.uhid.toLowerCase().includes(q) ||
      row.status.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "All" || row.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    if (reviewId) {
      const inv = tableData.find(item => item.invoiceId.replace("#", "") === reviewId);
      if (inv) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedInvoice(inv);
        setIsReviewModalOpen(true);
      }
    } else if (collectId) {
      const inv = tableData.find(item => item.invoiceId.replace("#", "") === collectId);
      if (inv) {
        setSelectedInvoice(inv);
        setIsModalOpen(true);
      }
    } else if (refundId) {
      const inv = tableData.find(item => item.invoiceId.replace("#", "") === refundId);
      if (inv) {
        setSelectedInvoice(inv);
        setIsRefundModalOpen(true);
      }
    }
  }, [reviewId, collectId, refundId]);

  const handleOpenModal = (invoice) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  };

  const handleOpenReviewModal = (invoice) => {
    setSelectedInvoice(invoice);
    setIsReviewModalOpen(true);
  };

  const handleOpenRefundModal = (invoice) => {
    setSelectedInvoice(invoice);
    setIsRefundModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    const fromPage = searchParams?.get("from");
    router.push(fromPage === "payment" ? "/finance/payment" : "/finance/patient-billing");
  };

  const handleCloseReviewModal = () => {
    setIsReviewModalOpen(false);
    const fromPage = searchParams?.get("from");
    router.push(fromPage === "payment" ? "/finance/payment" : "/finance/patient-billing");
  };

  const handleCloseRefundModal = () => {
    setIsRefundModalOpen(false);
    const fromPage = searchParams?.get("from");
    router.push(fromPage === "payment" ? "/finance/payment" : "/finance/patient-billing");
  };

  return (
    <FinancePageShell>
      <FinanceHeader
        title="Payment Management"
        className="flex-row items-center justify-between gap-3"
        actions={
          <button
            onClick={() => {
              const firstPending = tableData.find(r => r.status === "Pending") || tableData[0];
              handleOpenModal(firstPending);
            }}
            className="flex h-[32px] items-center justify-center gap-1.5 rounded-[5px] bg-primary px-4 text-[11px] font-bold text-white transition-all hover:opacity-90 whitespace-nowrap"
          >
            <Plus className="h-3.5 w-3.5" />
            Collect Payment
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statsData.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      <div className="space-y-5">
        <FinanceToolbar>
          <div className="w-full lg:w-auto">
            <FinanceSearchField
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search invoice, patient, UHID or status..."
              className="w-full sm:w-[320px]"
            />
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
            <FinanceSelect
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="All Status"
              icon={Ticket}
              options={[
                { label: "All Status", value: "All" },
                { label: "Pending", value: "Pending" },
                { label: "Completed", value: "Completed" },
                { label: "Paid", value: "Paid" },
                { label: "Overdue", value: "Overdue" },
              ]}
            />
          </div>
        </FinanceToolbar>

        <FinanceTableCard>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-muted/30">
                <th className="border-b border-border px-8 py-4 text-left text-[11px] font-bold tracking-widest text-muted-foreground">INVOICE ID</th>
                <th className="border-b border-border px-8 py-4 text-left text-[11px] font-bold tracking-widest text-muted-foreground">PATIENT</th>
                <th className="border-b border-border px-8 py-4 text-left text-[11px] font-bold tracking-widest text-muted-foreground">UHID</th>
                <th className="border-b border-border px-8 py-4 text-left text-[11px] font-bold tracking-widest text-muted-foreground">TOTAL AMOUNT</th>
                <th className="border-b border-border px-8 py-4 text-left text-[11px] font-bold tracking-widest text-muted-foreground">DUE AMOUNT</th>
                <th className="border-b border-border px-8 py-4 text-left text-[11px] font-bold tracking-widest text-muted-foreground">DATE</th>
                <th className="border-b border-border px-8 py-4 text-left text-[11px] font-bold tracking-widest text-muted-foreground">STATUS</th>
                <th className="border-b border-border px-8 py-4 text-left text-[11px] font-bold tracking-widest text-muted-foreground">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-8 py-20 text-center text-[13px] font-bold text-muted-foreground">
                    No invoices found matching your search.
                  </td>
                </tr>
              ) : (
                filteredData.map((row, index) => (
                <tr key={index} className="transition-colors hover:bg-muted/20">
                  <td className="whitespace-nowrap px-8 py-4 text-[14px] font-bold leading-tight text-foreground">{row.invoiceId}</td>
                  <td className="whitespace-nowrap px-8 py-4 text-[14px] font-bold leading-tight text-foreground">{row.patient}</td>
                  <td className="whitespace-nowrap px-8 py-4 text-[13px] font-medium text-muted-foreground">{row.uhid}</td>
                  <td className="whitespace-nowrap px-8 py-4 text-[13px] font-medium text-muted-foreground">{row.totalAmount}</td>
                  <td className={`whitespace-nowrap px-8 py-4 text-[13px] font-bold ${
                    row.dueAmount === "₹00.00" || row.dueAmount === "₹0.00"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-[#EF4444]"
                  }`}>{row.dueAmount}</td>
                  <td className="whitespace-nowrap px-8 py-4 text-[13px] font-medium text-muted-foreground">{row.date}</td>
                  <td className="px-8 py-4">
                    {getStatusBadge(row.status)}
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex items-center justify-start gap-3">
                      <button 
                        type="button"
                        onClick={() => handleOpenReviewModal(row)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#2E37A4] transition-all hover:bg-[#DBEAFE]/40 hover:text-[#1e257a]"
                      >
                        <Eye className="w-5 h-5" strokeWidth={1.8} />
                      </button>
                      <button 
                        onClick={() => {
                          if (row.actionText === "Collect" || row.actionText === "Pay") {
                            handleOpenModal(row);
                          } else if (row.actionText === "Review") {
                            handleOpenReviewModal(row);
                          } else if (row.actionText === "Refund") {
                            handleOpenRefundModal(row);
                          }
                        }}
                        className="flex h-10 min-w-[92px] items-center justify-center gap-2 whitespace-nowrap rounded-[5px] bg-[#DBEAFE] px-4 text-[12px] font-bold text-[#2E37A4] transition-all hover:bg-[#BFDBFE]"
                      >
                        <Ticket className="w-4 h-4" />
                        {row.actionText}
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

      <CollectPaymentModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        invoice={selectedInvoice} 
      />
      <ReviewInvoiceModal
        isOpen={isReviewModalOpen}
        onClose={handleCloseReviewModal}
        invoice={selectedInvoice}
      />
      <ProcessRefundModal
        isOpen={isRefundModalOpen}
        onClose={handleCloseRefundModal}
        invoice={selectedInvoice}
      />
    </FinancePageShell>
  );
}

export default function PatientBillingPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-gray-500 dark:text-slate-400">Loading...</div>}>
      <PatientBillingPageContent />
    </Suspense>
  );
}
