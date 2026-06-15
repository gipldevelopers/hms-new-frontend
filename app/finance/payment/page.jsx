"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  IndianRupee,
  Clock,
  Shield,
  RefreshCw,
  Eye,
  ChevronDown,
  X,
  Plus,
  Ticket,
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
  ArrowUp,
  ArrowDown,
  FileText,
  FileX,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FinanceSearchField,
  FinanceSelect,
} from "@/components/finance/FinancePageChrome";

// ---------------------------------------------------------------------------
// API helpers
// ---------------------------------------------------------------------------
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

function getAuthHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("authtoken") : "";
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// ---------------------------------------------------------------------------
// Stat card config — driven by real API data
// ---------------------------------------------------------------------------
function buildStatsData(summary) {
  return [
    {
      title: "Today's Collection",
      value: `₹${Number(summary?.todayCollection || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
      changeText: "",
      trendType: "up",
      trendColor: "text-[#10B981]",
      subtitle: "collected today",
      icon: IndianRupee,
      iconColor: "text-[#6366F1]",
      iconBg: "bg-[#EEF2FF] dark:bg-[#6366F1]/10",
    },
    {
      title: "Pending Payments",
      value: `₹${Number(summary?.pendingTotal || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
      changeText: "",
      trendType: "down",
      trendColor: "text-[#EF4444]",
      subtitle: "balance due",
      icon: Clock,
      iconColor: "text-[#10B981]",
      iconBg: "bg-[#ECFDF5] dark:bg-[#10B981]/10",
    },
    {
      title: "Insurance Settlements",
      value: `${summary?.insurancePending || 0} Pending`,
      changeText: "",
      trendType: "down",
      trendColor: "text-[#EF4444]",
      subtitle: "awaiting settlement",
      icon: Shield,
      iconColor: "text-[#F59E0B]",
      iconBg: "bg-[#FFFBEB] dark:bg-[#F59E0B]/10",
    },
    {
      title: "Refunds Today",
      value: `₹${Number(summary?.refundsToday || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
      changeText: "",
      trendType: "down",
      trendColor: "text-[#10B981]",
      subtitle: "processed today",
      icon: RefreshCw,
      iconColor: "text-[#EF4444]",
      iconBg: "bg-[#FEF2F2] dark:bg-[#EF4444]/10",
    },
  ];
}

// ---------------------------------------------------------------------------
// Helper: action text from status
// ---------------------------------------------------------------------------
function getActionText(status) {
  switch (status) {
    case "Paid":      return "Review";
    case "Completed": return "Review";
    case "Refunded":  return "Review";
    case "Pending":   return "Collect";
    case "Overdue":   return "Collect";
    default:          return "Review";
  }
}

function getActionIcon(actionText) {
  switch (actionText) {
    case "Refund":  return <RotateCcw className="w-3.5 h-3.5" />;
    case "Collect": return <CreditCard className="w-3.5 h-3.5" />;
    case "Review":  return <FileText className="w-3.5 h-3.5" />;
    default:        return <Ticket className="w-3.5 h-3.5" />;
  }
}

function getStatusBadgeClasses(status) {
  switch (status) {
    case "Completed": return "text-[#10B981] bg-[#ECFDF5] dark:bg-emerald-950/20 dark:text-emerald-400";
    case "Pending":   return "text-[#D97706] bg-[#FFF3E6] dark:bg-amber-950/20 dark:text-amber-400";
    case "Overdue":   return "text-[#EF4444] bg-[#FEF2F2] dark:bg-rose-950/20 dark:text-rose-400";
    case "Paid":      return "text-[#2E37A4] bg-[#EEF2FF] dark:bg-indigo-950/20 dark:text-indigo-400";
    case "Refunded":  return "text-[#EF4444] bg-[#FEF2F2] dark:bg-rose-950/20 dark:text-rose-400";
    default:          return "text-gray-500 bg-gray-100 dark:bg-gray-800/50 dark:text-gray-400";
  }
}

// ---------------------------------------------------------------------------
// Collect Payment Modal — UI preserved exactly, no backend call (per task spec)
// ---------------------------------------------------------------------------
const CollectPaymentModal = ({ isOpen, onClose, invoice, onConfirm }) => {
  const [paymentMethod, setPaymentMethod] = useState("Card");
  if (!invoice) return null;

  const handleConfirm = () => {
    if (onConfirm) onConfirm(paymentMethod);
    else onClose(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100%-32px)] sm:w-full max-w-[540px] p-5 sm:p-6 border border-[#E2E8F0] dark:border-white/10 rounded-[12px] bg-white dark:bg-[#101935] shadow-xl gap-5 flex flex-col">
        <div className="flex justify-between items-center">
          <DialogTitle className="text-[15px] sm:text-[16px] font-bold text-[#1e293b] dark:text-white">
            Collect Payment
          </DialogTitle>
          <button
            onClick={() => onClose(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer transition-colors border-0 bg-transparent p-0 focus:outline-none"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-[#F8F9FC] dark:bg-[#0A0F1D] rounded-[8px] p-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center border border-[#E2E8F0] dark:border-white/5 gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-[#1e293b] dark:text-white text-[14px]">{invoice.invoiceId}</span>
              <span className="bg-[#FFF3E6] text-[#D97706] text-[10px] font-bold px-2 py-0.5 rounded-full select-none">
                Pending
              </span>
            </div>
            <p className="text-[12px] text-gray-500 dark:text-slate-400 font-medium">
              Patient: {invoice.patient} • UHID: {invoice.uhid}
            </p>
          </div>
          <div className="text-left sm:text-right border-t sm:border-t-0 border-[#E2E8F0]/50 dark:border-white/5 pt-2.5 sm:pt-0">
            <p className="text-[11px] text-gray-500 dark:text-slate-400 font-bold mb-0.5">Due Amount</p>
            <p className="text-[18px] font-bold text-[#EF4444]">{invoice.dueAmount}</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[13px] font-bold text-[#1e293b] dark:text-slate-300">
            Paying Amount
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <span className="text-[14px] font-bold">₹</span>
            </div>
            <input
              type="text"
              defaultValue={invoice.dueAmount.replace("₹", "")}
              className="pl-8 w-full h-10 border border-[#E2E8F0] dark:border-white/10 rounded-[6px] text-[13px] font-semibold text-[#1e293b] dark:text-white bg-white dark:bg-[#101935] focus:outline-none focus:border-[#2E37A4]"
            />
          </div>
          <p className="text-[11px] text-gray-400 dark:text-slate-500 font-medium">
            Remaining balance will be ₹0.00
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[13px] font-bold text-[#1e293b] dark:text-slate-300">
            Payment Method
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            {[
              { id: "Cash", icon: Banknote },
              { id: "Card", icon: CreditCard },
              { id: "UPI",  icon: Smartphone },
              { id: "Bank", icon: Landmark },
            ].map((method) => {
              const Icon = method.icon;
              const isSelected = paymentMethod === method.id;
              return (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`flex flex-col items-center justify-center py-2.5 rounded-[8px] border transition-all cursor-pointer shadow-none ${
                    isSelected
                      ? "border-[#2E37A4] bg-[#EEF2FF] text-[#2E37A4] dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-400 font-bold"
                      : "border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-[#101935] hover:bg-slate-50 dark:hover:bg-white/5 text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1 shrink-0" />
                  <span className="text-[11px] font-semibold">{method.id}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[13px] font-bold text-[#1e293b] dark:text-slate-300">
            Transaction Reference (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g., TXN-123456789"
            className="w-full h-10 border border-[#E2E8F0] dark:border-white/10 rounded-[6px] text-[13px] px-3 font-semibold text-[#1e293b] dark:text-white bg-white dark:bg-[#101935] placeholder:text-gray-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-[#2E37A4]"
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-2.5 sm:gap-3 pt-2">
          <button
            onClick={() => onClose(false)}
            className="order-2 sm:order-1 text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 text-[13px] font-semibold px-4 py-2 cursor-pointer transition-colors focus:outline-none border-0 bg-transparent w-full sm:w-auto text-center"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="order-1 sm:order-2 bg-[#2E37A4] hover:bg-[#2E37A4]/90 text-white font-semibold px-5 h-10 rounded-[6px] transition-colors cursor-pointer shadow-none border-0 text-[13px] focus:outline-none w-full sm:w-auto"
          >
            Confirm &amp; Collect
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ---------------------------------------------------------------------------
// Review Invoice Modal — UI preserved exactly
// ---------------------------------------------------------------------------
const ReviewInvoiceModal = ({ isOpen, onClose, invoice, onInitiateRefund }) => {
  if (!invoice) return null;
  const status  = invoice.status.toLowerCase();
  const isPaid  = status === "completed" || status === "paid";
  const statusBadgeBg = isPaid
    ? "bg-[#ECFDF5] text-[#10B981] border-[#A7F3D0] dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
    : "bg-[#FFF3E6] text-[#D97706] border-[#FDE68A] dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30";
  const statusText = isPaid ? "PAID" : "PENDING";

  const items = invoice.items || [];
  const calculatedSubtotal = items.reduce((sum, item) => {
    const val = parseFloat(String(item.amount || "0").replace("₹", "").replace(",", ""));
    return isNaN(val) ? sum : sum + val;
  }, 0);
  const subtotalStr =
    "₹" + calculatedSubtotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100%-32px)] sm:w-full max-w-[540px] p-5 sm:p-6 border border-[#E2E8F0] dark:border-white/10 rounded-[12px] bg-white dark:bg-[#101935] shadow-xl gap-5 flex flex-col">
        <div className="flex justify-between items-center">
          <DialogTitle className="text-[15px] sm:text-[16px] font-bold text-[#1e293b] dark:text-white">
            Invoice Details
          </DialogTitle>
          <button
            onClick={() => onClose(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer border-0 bg-transparent p-0 focus:outline-none"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[6px] bg-[#2E37A4] flex items-center justify-center text-white shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#1e293b] dark:text-white text-[14px]">HMS Hospital</h3>
              <p className="text-[11px] text-gray-400 dark:text-slate-500 font-medium">Billing Department</p>
            </div>
          </div>
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${statusBadgeBg} select-none`}>
            {statusText}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[11px] text-gray-400 dark:text-slate-500 font-bold mb-1">Billed To:</p>
            <p className="font-bold text-[#1e293b] dark:text-white text-[13px]">{invoice.patient}</p>
            <p className="text-[11px] text-gray-500 dark:text-slate-400 font-semibold mt-0.5">
              UHID: {invoice.uhid}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-gray-400 dark:text-slate-500 font-bold mb-1">Invoice Details:</p>
            <p className="font-bold text-[#1e293b] dark:text-white text-[13px]">
              {invoice.invoiceId.replace("#", "")}
            </p>
            <p className="text-[11px] text-gray-500 dark:text-slate-400 font-semibold mt-0.5">
              Date: {invoice.date}
            </p>
          </div>
        </div>

        <div className="border-t border-[#E2E8F0] dark:border-white/10 pt-3">
          <div className="flex justify-between text-[11px] font-bold text-gray-400 dark:text-slate-500 pb-2 border-b border-[#E2E8F0] dark:border-white/10">
            <span className="tracking-wider">DESCRIPTION</span>
            <span className="text-right tracking-wider">AMOUNT</span>
          </div>
          <div className="divide-y divide-[#E2E8F0]/30 dark:divide-white/5">
            {items.length > 0 ? (
              items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-[12px] text-[#1e293b] dark:text-slate-300 py-2">
                  <span className="font-semibold">{item.name}</span>
                  <span className="font-bold text-[#1e293b] dark:text-white">{item.amount}</span>
                </div>
              ))
            ) : (
              <p className="text-[12px] text-gray-400 py-3">No line items available.</p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-1 border-t border-[#E2E8F0] dark:border-white/10">
          <div className="w-full sm:w-1/2 space-y-1.5">
            <div className="flex justify-between text-[12px]">
              <span className="text-gray-500 dark:text-slate-400 font-medium">Subtotal</span>
              <span className="text-[#1e293b] dark:text-white font-bold">{subtotalStr}</span>
            </div>
            <div className="flex justify-between text-[12px]">
              <span className="text-gray-500 dark:text-slate-400 font-medium">Tax</span>
              <span className="text-[#1e293b] dark:text-white font-bold">₹0.00</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-[#E2E8F0] dark:border-white/10">
              <span className="font-bold text-[13px] text-[#1e293b] dark:text-white">Total</span>
              <span className="font-extrabold text-[#1e293b] dark:text-white text-[15px]">
                {invoice.totalAmount}
              </span>
            </div>
          </div>
        </div>

        {isPaid && (
          <div className="bg-[#ECFDF5] dark:bg-emerald-500/10 border border-[#A7F3D0] dark:border-emerald-500/20 rounded-[6px] p-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              <span className="text-[#065F46] dark:text-emerald-400 text-[12px] font-semibold">
                Paid via {invoice.paymentMethod || "—"}
              </span>
            </div>
            <span className="text-[#065F46] dark:text-emerald-400 font-extrabold text-[12px]">
              {invoice.totalAmount}
            </span>
          </div>
        )}

        {isPaid && (
          <div className="flex justify-end">
            <button
              onClick={() => onInitiateRefund?.()}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E2E8F0] dark:border-white/10 text-gray-500 dark:text-slate-400 hover:text-[#1e293b] hover:bg-slate-50 dark:hover:bg-white/5 text-[11px] font-bold rounded-[6px] transition-colors bg-white dark:bg-[#101935] cursor-pointer focus:outline-none"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Initiate Refund
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:justify-between items-stretch sm:items-center gap-2.5 sm:gap-3 pt-2">
          <button className="order-2 sm:order-1 flex items-center justify-center gap-1.5 border border-[#E2E8F0] dark:border-white/10 text-[#1e293b] dark:text-white bg-white dark:bg-[#101935] h-10 text-[12px] font-semibold px-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-all rounded-[6px] cursor-pointer focus:outline-none w-full sm:w-auto">
            <Printer className="w-4 h-4 text-gray-500" /> Print Receipt
          </button>
          <button
            onClick={() => onClose(false)}
            className="order-3 sm:order-2 sm:ml-auto text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 text-[13px] font-semibold px-4 py-2 cursor-pointer transition-colors focus:outline-none border-0 bg-transparent text-center"
          >
            Close
          </button>
          <button className="order-1 sm:order-3 bg-[#2E37A4] hover:bg-[#2E37A4]/90 text-white text-[12px] font-semibold px-4 h-10 flex items-center justify-center gap-1.5 rounded-[6px] border-0 transition-colors cursor-pointer focus:outline-none w-full sm:w-auto">
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ---------------------------------------------------------------------------
// Process Refund Modal — UI preserved exactly, no backend wiring per task spec
// ---------------------------------------------------------------------------
const ProcessRefundModal = ({ isOpen, onClose, invoice, onConfirm }) => {
  const [refundMethod, setRefundMethod] = useState("Source");
  if (!invoice) return null;
  const refundAmt = invoice.refundAmount || "₹0.00";
  const billedAmt = invoice.totalAmount  || "₹0.00";
  const paidAmt   = invoice.totalAmount  || "₹0.00";

  const handleConfirm = () => {
    onConfirm?.();
    onClose(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100%-32px)] sm:w-full max-w-[540px] p-5 sm:p-6 border border-[#E2E8F0] dark:border-white/10 rounded-[12px] bg-white dark:bg-[#101935] shadow-xl gap-5 flex flex-col">
        <div className="flex justify-between items-center">
          <DialogTitle className="text-[15px] sm:text-[16px] font-bold text-[#1e293b] dark:text-white">
            Process Refund
          </DialogTitle>
          <button
            onClick={() => onClose(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer border-0 bg-transparent p-0 focus:outline-none"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-[#FFF1F2] dark:bg-[#200F11] border border-[#FFE4E6] dark:border-[#521C22] rounded-[8px] p-4 flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-bold text-[#E11D48] text-[13px]">Overpayment Detected</h4>
              <p className="text-[11.5px] text-[#E11D48]/90 mt-1 font-medium">
                Patient has paid more than the final bill amount.
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-white dark:bg-rose-950/40 border border-[#FFE4E6] dark:border-rose-900/50 flex items-center justify-center shrink-0">
              <AlertCircle className="w-[18px] h-[18px] text-[#E11D48]" />
            </div>
          </div>
          <div className="border-t border-[#FFE4E6]/80 dark:border-rose-900/50 pt-3 flex justify-between items-center mt-2">
            <span className="text-[#E11D48] text-[13px] font-semibold">Refund Amount</span>
            <span className="text-[#E11D48] text-[22px] font-extrabold">{refundAmt}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="border border-[#E2E8F0] dark:border-white/10 rounded-[8px] py-2 px-3.5 bg-white dark:bg-[#101935]">
            <span className="text-[10px] text-gray-400 dark:text-slate-500 font-bold">Total Billed</span>
            <p className="text-[14px] font-bold text-[#1e293b] dark:text-white mt-0.5">{billedAmt}</p>
          </div>
          <div className="border border-[#E2E8F0] dark:border-white/10 rounded-[8px] py-2 px-3.5 bg-white dark:bg-[#101935]">
            <span className="text-[10px] text-gray-400 dark:text-slate-500 font-bold">Total Paid</span>
            <p className="text-[14px] font-bold text-[#1e293b] dark:text-white mt-0.5">{paidAmt}</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-[13px] text-[#1e293b] dark:text-white font-bold block">Refund Method</span>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { id: "Source", label: "Original Source", icon: RotateCcw },
              { id: "Cash",   label: "Cash",            icon: Banknote },
              { id: "Bank",   label: "Bank Transfer",   icon: Landmark },
            ].map((method) => {
              const Icon = method.icon;
              const isSelected = refundMethod === method.id;
              return (
                <button
                  key={method.id}
                  onClick={() => setRefundMethod(method.id)}
                  className={`flex flex-col items-center justify-center p-2 rounded-[8px] border transition-all cursor-pointer shadow-none ${
                    isSelected
                      ? "border-[#2E37A4] bg-[#EEF2FF] text-[#2E37A4] dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-400 font-bold"
                      : "border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-[#101935] hover:bg-slate-50 dark:hover:bg-white/5 text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1 shrink-0" />
                  <span className="text-[9px] sm:text-[11px] font-semibold text-center leading-tight">
                    {method.label}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="min-h-[16px] mt-1">
            <span className="text-[11px] text-gray-400 dark:text-slate-500 block font-medium">
              {refundMethod === "Source" && "Original source will take 3-5 business days."}
              {refundMethod === "Cash"   && "Cash refunds are processed immediately at the billing counter."}
              {refundMethod === "Bank"   && "Bank transfers will be processed in 1-2 business days."}
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-[13px] text-[#1e293b] dark:text-white font-bold block">Refund Reason</span>
          <div className="relative">
            <select className="h-10 border border-[#E2E8F0] dark:border-white/10 rounded-[6px] w-full bg-white dark:bg-[#101935] px-3 pr-8 text-[13px] text-[#1e293b] dark:text-white font-semibold appearance-none focus:outline-none focus:border-[#2E37A4] cursor-pointer">
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

        <div className="space-y-1.5">
          <span className="text-[13px] text-[#1e293b] dark:text-white font-bold block">Notes (Optional)</span>
          <textarea
            placeholder="Add internal notes regarding this refund..."
            className="h-14 border border-[#E2E8F0] dark:border-white/10 rounded-[6px] w-full p-2.5 text-[13px] text-[#1e293b] dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-600 bg-white dark:bg-[#101935] resize-none focus:outline-none focus:border-[#2E37A4]"
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-2.5 sm:gap-3 pt-2">
          <button
            onClick={() => onClose(false)}
            className="order-2 sm:order-1 text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 text-[13px] font-semibold px-4 py-2 cursor-pointer transition-colors focus:outline-none border-0 bg-transparent w-full sm:w-auto text-center"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="order-1 sm:order-2 bg-[#2E37A4] hover:bg-[#2E37A4]/90 text-white font-semibold px-5 h-10 rounded-[6px] transition-colors cursor-pointer shadow-none border-0 text-[13px] focus:outline-none w-full sm:w-auto"
          >
            Confirm &amp; Refund
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------
export default function PaymentPage() {
  const router = useRouter();

  // ── data state ──
  const [tableData,       setTableData]       = useState([]);
  const [summaryData,     setSummaryData]      = useState(null);
  const [loadingTable,    setLoadingTable]     = useState(true);
  const [loadingSummary,  setLoadingSummary]   = useState(true);
  const [tableError,      setTableError]       = useState(null);
  const [summaryError,    setSummaryError]     = useState(null);

  // ── filter state ──
  const [searchTerm,   setSearchTerm]   = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // ── modal state ──
  const [isModalOpen,       setIsModalOpen]       = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [selectedInvoice,   setSelectedInvoice]   = useState(null);

  // ── fetch payment summary ──
  const fetchSummary = useCallback(async () => {
    try {
      setLoadingSummary(true);
      setSummaryError(null);
      const res  = await fetch(`${API_BASE}/billing/payment-summary`, { headers: getAuthHeaders() });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || `Error ${res.status}`);
      setSummaryData(json.data);
    } catch (e) {
      console.error("payment-summary error:", e);
      setSummaryError(e.message);
      setSummaryData(null);
    } finally {
      setLoadingSummary(false);
    }
  }, []);

  // ── fetch payments table ──
  const fetchPayments = useCallback(async () => {
    try {
      setLoadingTable(true);
      setTableError(null);
      const res  = await fetch(`${API_BASE}/billing/all-payments`, { headers: getAuthHeaders() });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || `Error ${res.status}`);
      // Attach actionText derived from status
      const enriched = (json.data || []).map((row) => ({
        ...row,
        actionText: getActionText(row.status),
        items: [] // line items not included in list view
      }));
      setTableData(enriched);
    } catch (e) {
      console.error("all-payments error:", e);
      setTableError(e.message);
      setTableData([]);
    } finally {
      setLoadingTable(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
    fetchPayments();
  }, [fetchSummary, fetchPayments]);

  // ── derived: filtered rows ──
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

  const statsData = buildStatsData(summaryData);

  // ── modal handlers ──
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

  // ── stat card skeleton ──
  const StatSkeleton = () => (
    <div className="flex w-full h-full items-center justify-between rounded-[8px] border border-[#E2E8F0] bg-white p-3.5 sm:p-[20px] dark:border-white/10 dark:bg-[#101935] shadow-none gap-2 animate-pulse">
      <div className="space-y-2 flex-1">
        <div className="h-3 w-32 bg-muted rounded" />
        <div className="h-6 w-24 bg-muted rounded" />
        <div className="h-2.5 w-20 bg-muted rounded" />
      </div>
      <div className="h-11 w-11 rounded-full bg-muted shrink-0" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-[#0A0F1D] p-[20px] font-sans text-[#1e293b] dark:text-white transition-colors duration-300">
      <div className="mx-auto flex max-w-[1720px] flex-col gap-[20px]">

        {/* ── Header ── */}
        <div className="flex flex-row justify-between items-center gap-4">
          <h1 className="text-[16px] sm:text-[20px] font-bold text-[#1e293b] dark:text-white leading-tight tracking-tight">
            Payment Management
          </h1>
          <button
            onClick={() => {
              const firstPending = tableData.find((r) => r.status === "Pending" || r.status === "Overdue");
              if (firstPending) handleOpenModal(firstPending);
            }}
            className="flex h-9 sm:h-10 items-center justify-center gap-1.5 sm:gap-2 rounded-[6px] bg-[#2E37A4] hover:bg-[#2E37A4]/90 px-3 sm:px-4 text-[12px] sm:text-[13px] font-semibold text-white transition-all duration-200 border-0 shadow-none cursor-pointer shrink-0"
          >
            <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Collect
          </button>
        </div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[20px]">
          {loadingSummary
            ? [1, 2, 3, 4].map((i) => <StatSkeleton key={i} />)
            : statsData.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="flex w-full h-full items-center justify-between rounded-[8px] border border-[#E2E8F0] bg-white p-3.5 sm:p-[20px] dark:border-white/10 dark:bg-[#101935] shadow-none gap-2"
                  >
                    <div className="space-y-0.5 sm:space-y-1 min-w-0">
                      <p className="text-[11px] sm:text-[13px] font-semibold text-[#64748B] dark:text-slate-400 truncate">
                        {stat.title}
                      </p>
                      <p className="text-[18px] sm:text-[24px] font-bold text-[#1e293b] dark:text-white leading-tight truncate">
                        {stat.value}
                      </p>
                      <p className="text-[10px] sm:text-[12px] font-semibold text-[#64748B] dark:text-slate-500 flex items-center truncate">
                        <span className={`font-bold flex items-center ${stat.trendColor} shrink-0`}>
                          {stat.trendType === "up" ? (
                            <ArrowUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 shrink-0" />
                          ) : (
                            <ArrowDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 shrink-0" />
                          )}
                        </span>
                        <span className="ml-1 truncate">{stat.subtitle}</span>
                      </p>
                    </div>
                    <div
                      className={`flex h-8 w-8 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full ${stat.iconBg} ${stat.iconColor}`}
                    >
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                  </div>
                );
              })}
        </div>

        {/* ── Table Container ── */}
        <div className="rounded-[8px] border border-[#E2E8F0] bg-white dark:border-white/10 dark:bg-[#101935] shadow-none p-[20px] space-y-[20px]">

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-[20px]">
            <FinanceSearchField
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search..."
              className="w-full sm:w-[260px]"
            />
            <FinanceSelect
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="All"
              options={[
                { label: "All",       value: "All" },
                { label: "Pending",   value: "Pending" },
                { label: "Paid",      value: "Paid" },
                { label: "Overdue",   value: "Overdue" },
                { label: "Refunded",  value: "Refunded" },
              ]}
              className="w-full sm:w-[120px] min-w-0"
            />
          </div>

          {/* Loading skeleton rows */}
          {loadingTable && (
            <div className="space-y-3 animate-pulse">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-muted rounded" />
              ))}
            </div>
          )}

          {/* Error state */}
          {!loadingTable && tableError && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
                <FileX className="w-6 h-6 text-red-500" />
              </div>
              <p className="text-[13px] font-semibold text-red-500">Failed to load payment records</p>
              <p className="text-[12px] text-gray-400 dark:text-slate-500">{tableError}</p>
              <button
                onClick={fetchPayments}
                className="mt-1 h-9 px-4 bg-[#2E37A4] text-white text-[12px] font-semibold rounded-[6px] hover:bg-[#2E37A4]/90 transition cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}

          {/* Desktop table */}
          {!loadingTable && !tableError && (
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E2E8F0] dark:border-white/10">
                    {["Invoice ID", "Patient", "UHID", "Total Amount", "Due Amount", "Date", "Status", "Action"].map((h) => (
                      <th
                        key={h}
                        className="whitespace-nowrap pb-4 text-left text-[12px] font-bold text-[#64748B] dark:text-slate-400"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] dark:divide-white/10">
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="py-14 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            <FileX className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <p className="text-[13px] font-semibold text-muted-foreground">
                            {tableData.length === 0 ? "No payment records found." : "No records match your filters."}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((row, index) => (
                      <tr key={index} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                        <td className="whitespace-nowrap py-4 text-[13px] font-semibold text-[#1e293b] dark:text-white">
                          {row.invoiceId}
                        </td>
                        <td className="whitespace-nowrap py-4 text-[13px] font-semibold text-[#1e293b] dark:text-white">
                          {row.patient}
                        </td>
                        <td className="whitespace-nowrap py-4 text-[13px] font-semibold text-[#64748B] dark:text-slate-400">
                          {row.uhid}
                        </td>
                        <td className="whitespace-nowrap py-4 text-[13px] font-semibold text-[#64748B] dark:text-slate-400">
                          {row.totalAmount}
                        </td>
                        <td className="whitespace-nowrap py-4 text-[13px] font-bold text-[#EF4444]">
                          {row.dueAmount}
                        </td>
                        <td className="whitespace-nowrap py-4 text-[13px] font-semibold text-[#64748B] dark:text-slate-400">
                          {row.date}
                        </td>
                        <td className="whitespace-nowrap py-4">
                          <span
                            className={`inline-flex px-3 py-1 text-[11px] font-bold rounded-full select-none ${getStatusBadgeClasses(row.status)}`}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap py-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleOpenReviewModal(row)}
                              className="inline-flex items-center justify-center h-8 w-8 rounded-[6px] border border-[#BFDBFE] bg-[#EFF6FF] text-[#2E37A4] hover:bg-[#DBEAFE] transition-all cursor-pointer shadow-none"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (row.actionText === "Collect") handleOpenModal(row);
                                else if (row.actionText === "Review") handleOpenReviewModal(row);
                                else if (row.actionText === "Refund") handleOpenRefundModal(row);
                              }}
                              className="inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-[6px] border border-[#BFDBFE] bg-[#EFF6FF] text-[#2E37A4] hover:bg-[#DBEAFE] text-[12px] font-semibold transition-all cursor-pointer shadow-none"
                            >
                              {getActionIcon(row.actionText)}
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
          )}

          {/* Mobile card view */}
          {!loadingTable && !tableError && (
            <div className="block md:hidden space-y-4">
              {filteredData.length === 0 ? (
                <div className="py-14 text-center">
                  <p className="text-[13px] font-semibold text-muted-foreground">
                    {tableData.length === 0 ? "No payment records found." : "No records match your filters."}
                  </p>
                </div>
              ) : (
                filteredData.map((row, index) => (
                  <div
                    key={index}
                    className="border border-[#E2E8F0] dark:border-white/10 rounded-[8px] p-4 bg-white dark:bg-[#101935]/50 space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-[#1e293b] dark:text-white text-[14px]">{row.patient}</p>
                        <p className="text-[11px] text-[#64748B] dark:text-slate-400 font-semibold mt-0.5">
                          {row.invoiceId} • {row.uhid}
                        </p>
                      </div>
                      <span
                        className={`inline-flex px-2.5 py-0.5 text-[10px] font-bold rounded-full select-none ${getStatusBadgeClasses(row.status)}`}
                      >
                        {row.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 py-2 border-y border-[#E2E8F0]/50 dark:border-white/5 text-[12px]">
                      <div>
                        <p className="text-gray-400 dark:text-slate-500 font-semibold">Total Amount</p>
                        <p className="font-bold text-[#1e293b] dark:text-white mt-0.5">{row.totalAmount}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 dark:text-slate-500 font-semibold">Due Amount</p>
                        <p className="font-bold text-[#EF4444] mt-0.5">{row.dueAmount}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-[#64748B] dark:text-slate-400 font-semibold">{row.date}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenReviewModal(row)}
                          className="inline-flex items-center justify-center h-8 w-8 rounded-[6px] border border-[#BFDBFE] bg-[#EFF6FF] text-[#2E37A4] hover:bg-[#DBEAFE] transition-all cursor-pointer shadow-none"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (row.actionText === "Collect") handleOpenModal(row);
                            else if (row.actionText === "Review") handleOpenReviewModal(row);
                            else if (row.actionText === "Refund") handleOpenRefundModal(row);
                          }}
                          className="inline-flex items-center justify-center gap-1.5 h-8 px-2.5 rounded-[6px] border border-[#BFDBFE] bg-[#EFF6FF] text-[#2E37A4] hover:bg-[#DBEAFE] text-[11px] font-semibold transition-all cursor-pointer shadow-none"
                        >
                          {getActionIcon(row.actionText)}
                          {row.actionText}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Modals ── */}
      <CollectPaymentModal
        isOpen={isModalOpen}
        onClose={setIsModalOpen}
        invoice={selectedInvoice}
        onConfirm={(method) => {
          setIsModalOpen(false);
          // Optimistically update local row status so UI reflects change immediately
          if (selectedInvoice) {
            setTableData((prev) =>
              prev.map((r) =>
                r.invoiceId === selectedInvoice.invoiceId
                  ? { ...r, status: "Paid", dueAmount: "₹0.00", actionText: "Review", paymentMethod: method }
                  : r
              )
            );
          }
          setIsReviewModalOpen(true);
        }}
      />
      <ReviewInvoiceModal
        isOpen={isReviewModalOpen}
        onClose={setIsReviewModalOpen}
        invoice={selectedInvoice}
        onInitiateRefund={() => {
          setIsReviewModalOpen(false);
          setIsRefundModalOpen(true);
        }}
      />
      <ProcessRefundModal
        isOpen={isRefundModalOpen}
        onClose={setIsRefundModalOpen}
        invoice={selectedInvoice}
        onConfirm={() => {
          setIsRefundModalOpen(false);
        }}
      />
    </div>
  );
}
