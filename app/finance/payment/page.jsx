"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
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
  Search,
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


const CollectPaymentModal = ({ isOpen, onClose, invoice }) => {
  const [paymentMethod, setPaymentMethod] = useState("Card");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleEsc = (e) => {
        if (e.key === "Escape") onClose(false);
      };
      window.addEventListener("keydown", handleEsc);
      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleEsc);
      };
    }
  }, [isOpen, onClose]);

  if (!invoice) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onClose(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-[6px]"
          />

          {/* Modal card content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 16 }}
            className="relative bg-white dark:bg-[#0F172A] w-full max-w-[600px] rounded-[5px] shadow-none overflow-hidden border border-gray-100 dark:border-white/5 flex flex-col max-h-[calc(100vh-32px)]"
          >
            {/* Header */}
            <div className="px-4 sm:px-8 py-4 sm:py-6 flex justify-between items-center border-b border-gray-100 dark:border-white/5 shrink-0">
              <div className="space-y-1">
                <h2 className="text-[20px] font-bold text-[#1e293b] dark:text-white leading-none">
                  Collect Payment
                </h2>
              </div>
              <button 
                type="button"
                onClick={() => onClose(false)}
                className="group p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
              </button>
            </div>

            {/* Body */}
            <div className="px-4 sm:px-8 py-5 sm:py-8 space-y-6 flex-1 overflow-y-auto custom-scrollbar bg-slate-50/20 dark:bg-transparent">
              
              {/* Invoice Summary Box - premium alert style */}
              <div className="p-4 bg-sky-50 dark:bg-sky-500/5 rounded-[5px] border border-sky-100 dark:border-sky-500/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-sky-950 dark:text-sky-400 leading-none">{invoice.invoiceId}</span>
                    <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-[5px]">
                      Pending
                    </span>
                  </div>
                  <p className="text-[12px] text-sky-800/80 dark:text-sky-300/60 font-semibold">
                    Patient: {invoice.patient} • UHID: {invoice.uhid}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-[11px] text-sky-800/70 dark:text-sky-300/40 font-bold mb-0.5 uppercase tracking-wide">Due Amount</p>
                  <p className="text-[20px] font-black text-rose-500">{invoice.dueAmount}</p>
                </div>
              </div>

              {/* Paying Amount input */}
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-600 dark:text-gray-300 ml-1">Paying Amount</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <IndianRupee className="h-4.5 w-4.5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    defaultValue={invoice.dueAmount.replace("₹", "")}
                    className="w-full h-[48px] pl-10 pr-4 rounded-[5px] border border-gray-200 dark:border-white/10 dark:bg-[#1E293B] text-[14px] text-gray-700 dark:text-white placeholder:text-gray-400 outline-none focus:border-primary transition-all shadow-sm font-semibold"
                  />
                </div>
                <p className="text-[11px] text-gray-400 font-semibold ml-1">Remaining balance will be ₹0.00</p>
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-600 dark:text-gray-300 ml-1">Payment Method</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
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
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        className={`flex flex-col items-center justify-center py-3.5 rounded-[5px] border transition-all ${
                          isSelected
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 bg-white dark:bg-[#1E293B]"
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 mb-2 ${
                            isSelected ? "text-primary" : "text-gray-400 dark:text-gray-500"
                          }`}
                        />
                        <span
                          className={`text-[12px] font-bold ${
                            isSelected ? "text-primary" : "text-gray-500 dark:text-gray-400"
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
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-600 dark:text-gray-300 ml-1">
                  Transaction Reference (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., TXN-123456789"
                  className="w-full h-[48px] px-4 rounded-[5px] border border-gray-200 dark:border-white/10 dark:bg-[#1E293B] text-[14px] text-gray-700 dark:text-white placeholder:text-gray-400 outline-none focus:border-primary transition-all shadow-sm font-medium"
                />
              </div>

            </div>

            {/* Footer */}
            <div className="px-4 sm:px-8 py-4 sm:py-6 border-t border-gray-100 dark:border-white/5 flex flex-col-reverse sm:flex-row justify-end items-stretch sm:items-center gap-3 sm:gap-4 shrink-0">
              <button 
                type="button" 
                onClick={() => onClose(false)}
                className="px-4 sm:px-8 h-[48px] rounded-[5px] text-gray-500 font-bold text-[13px] hover:text-primary transition-all bg-transparent border border-transparent"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={() => {
                  toast.success("Payment collected successfully");
                  onClose(false);
                }}
                className="bg-primary text-white px-6 sm:px-10 h-[48px] rounded-[5px] font-bold text-[13px] hover:opacity-90 transition-all shadow-none"
              >
                Confirm & Collect
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// 4. Review Invoice Modal Component
const ReviewInvoiceModal = ({ isOpen, onClose, invoice }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleEsc = (e) => {
        if (e.key === "Escape") onClose(false);
      };
      window.addEventListener("keydown", handleEsc);
      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleEsc);
      };
    }
  }, [isOpen, onClose]);

  if (!invoice) return null;

  const status = invoice.status.toLowerCase();
  const isPaid = status === "completed" || status === "paid";
  const statusBadgeBg = isPaid ? "bg-emerald-500 text-white" : "bg-amber-500 text-white";
  const statusText = isPaid ? "PAID" : "PENDING";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onClose(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-[6px]"
          />

          {/* Modal card content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 16 }}
            className="relative bg-white dark:bg-[#0F172A] w-full max-w-[620px] rounded-[5px] shadow-none overflow-hidden border border-gray-100 dark:border-white/5 flex flex-col max-h-[calc(100vh-32px)]"
          >
            {/* Header */}
            <div className="px-4 sm:px-8 py-4 sm:py-6 flex justify-between items-center border-b border-gray-100 dark:border-white/5 shrink-0">
              <div className="space-y-1">
                <h2 className="text-[20px] font-bold text-[#1e293b] dark:text-white leading-none">
                  Invoice Details
                </h2>
              </div>
              <button 
                type="button"
                onClick={() => onClose(false)}
                className="group p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
              </button>
            </div>

            {/* Body */}
            <div className="px-4 sm:px-8 py-5 sm:py-8 space-y-6 flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50 dark:bg-[#0B1121]/20">
              
              <div className="bg-white dark:bg-[#1E293B]/20 border border-gray-150 dark:border-white/5 rounded-[5px] p-4 sm:p-6 space-y-6 shadow-sm">
                
                {/* Header / Logo */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-[5px] bg-primary flex items-center justify-center text-white shadow-sm shrink-0">
                      <Activity className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-gray-900 dark:text-white text-[15px]">MediCore Hospital</h3>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 font-semibold">123 Health Ave, Medical District</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-[5px] uppercase tracking-wider ${statusBadgeBg}`}>
                    {statusText}
                  </span>
                </div>

                {/* Billed To & Invoice Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-b border-gray-100 dark:border-white/5 py-4">
                  <div>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold block uppercase tracking-wide mb-1">Billed To:</span>
                    <p className="font-bold text-gray-800 dark:text-white text-[13px]">{invoice.patient}</p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 font-bold mt-0.5">UHID: {invoice.uhid}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold block uppercase tracking-wide mb-1">Invoice Details:</span>
                    <p className="font-bold text-gray-800 dark:text-white text-[13px]">{invoice.invoiceId.replace("#", "")}</p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 font-bold mt-0.5">Date: {invoice.date}</p>
                  </div>
                </div>

                {/* Line Items */}
                <div>
                  <div className="flex justify-between text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3 border-b border-gray-100 dark:border-white/5 pb-1.5">
                    <span>Description</span>
                    <span className="text-right w-28">Amount</span>
                  </div>
                  <div className="space-y-3">
                    {(invoice.items || [
                      { name: "General Consultation", amount: "₹500.00" },
                      { name: "Basic Vitals Check", amount: "₹100.00" }
                    ]).map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[13px] text-gray-700 dark:text-gray-300">
                        <span className="font-bold text-gray-800 dark:text-white">{item.name}</span>
                        <span className="font-bold text-gray-900 dark:text-white text-right w-28">{item.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="flex justify-end border-t border-gray-100 dark:border-white/5 pt-4">
                  <div className="w-full sm:w-1/2 space-y-2">
                    <div className="flex justify-between text-[12px] font-semibold text-gray-500 dark:text-gray-400">
                      <span>Subtotal</span>
                      <span className="text-gray-800 dark:text-white font-bold">{invoice.totalAmount}</span>
                    </div>
                    <div className="flex justify-between text-[12px] font-semibold text-gray-500 dark:text-gray-400">
                      <span>Tax (0%)</span>
                      <span className="text-gray-800 dark:text-white font-bold">₹0.00</span>
                    </div>
                    <div className="flex justify-between items-center pt-2.5 border-t border-gray-100 dark:border-white/5">
                      <span className="font-extrabold text-[13px] text-gray-900 dark:text-white uppercase tracking-wide">Total</span>
                      <span className="font-black text-gray-950 dark:text-white text-[18px]">{invoice.totalAmount}</span>
                    </div>
                  </div>
                </div>

                {/* Paid Banner */}
                {isPaid && (
                  <div className="bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/20 rounded-[5px] p-4 flex justify-between items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <span className="text-emerald-800 dark:text-emerald-400 text-[12px] font-bold">Paid via {invoice.paymentMethod || "Credit Card"}</span>
                    </div>
                    <span className="text-emerald-700 dark:text-emerald-400 font-black text-[13px] shrink-0">{invoice.totalAmount}</span>
                  </div>
                )}
                
                {/* Initiate Refund Button */}
                {isPaid && (
                  <div className="flex justify-end">
                    <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-white text-[11px] font-bold rounded-[5px] hover:bg-gray-50 dark:hover:bg-white/5 transition-all bg-white dark:bg-transparent shadow-sm">
                      <RefreshCcw className="w-3.5 h-3.5" />
                      Initiate Refund
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 sm:px-8 py-4 sm:py-6 border-t border-gray-100 dark:border-white/5 bg-white dark:bg-[#0F172A] flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4 shrink-0">
              <button 
                type="button"
                onClick={() => toast.info("Printing receipt...")}
                className="flex items-center justify-center gap-2 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 bg-white dark:bg-transparent h-[44px] text-[13px] font-bold px-5 hover:bg-gray-50 dark:hover:bg-white/5 transition-all rounded-[5px] shadow-sm w-full sm:w-auto"
              >
                <Printer className="w-4 h-4 text-gray-500" />
                Print Receipt
              </button>
              <button 
                type="button"
                onClick={() => toast.info("Downloading PDF invoice...")}
                className="bg-primary text-white text-[13px] font-bold px-6 h-[44px] flex items-center justify-center gap-2 rounded-[5px] hover:opacity-90 shadow-none transition-all w-full sm:w-auto"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// 5. Process Refund Modal Component
const ProcessRefundModal = ({ isOpen, onClose, invoice }) => {
  const [refundMethod, setRefundMethod] = useState("Source");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleEsc = (e) => {
        if (e.key === "Escape") onClose(false);
      };
      window.addEventListener("keydown", handleEsc);
      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleEsc);
      };
    }
  }, [isOpen, onClose]);

  if (!invoice) return null;

  const refundAmt = invoice.refundAmount || "₹450.00";
  const billedAmt = invoice.totalBilled || "₹2,050.00";
  const paidAmt = invoice.totalPaid || "₹2,500.00";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onClose(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-[6px]"
          />

          {/* Modal card content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 16 }}
            className="relative bg-white dark:bg-[#0F172A] w-full max-w-[600px] rounded-[5px] shadow-none overflow-hidden border border-gray-100 dark:border-white/5 flex flex-col max-h-[calc(100vh-32px)]"
          >
            {/* Header */}
            <div className="px-4 sm:px-8 py-4 sm:py-6 flex justify-between items-center border-b border-gray-100 dark:border-white/5 shrink-0">
              <div className="space-y-1">
                <h2 className="text-[20px] font-bold text-[#1e293b] dark:text-white leading-none">
                  Process Refund
                </h2>
              </div>
              <button 
                type="button"
                onClick={() => onClose(false)}
                className="group p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
              </button>
            </div>

            {/* Body */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Refund processed successfully!");
                onClose(false);
              }}
              className="px-4 sm:px-8 py-5 sm:py-8 space-y-6 flex-1 overflow-y-auto custom-scrollbar"
            >
              
              {/* Overpayment Warning Card */}
              <div className="p-4 bg-red-50 dark:bg-red-500/5 rounded-[5px] border border-red-100 dark:border-red-500/20 flex flex-col sm:flex-row items-stretch sm:items-start gap-3 justify-between">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[13px] font-bold text-red-800 dark:text-red-400">Overpayment Detected</h4>
                    <p className="text-[11px] text-red-700/80 dark:text-red-400/70 font-semibold leading-relaxed">Patient has paid more than the final bill amount.</p>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-red-600 dark:text-red-400 font-bold block uppercase tracking-wider">Refund Amount</span>
                  <span className="text-red-600 dark:text-red-400 text-[20px] font-black">{refundAmt}</span>
                </div>
              </div>

              {/* Billed vs Paid Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-gray-150 dark:border-white/5 rounded-[5px] py-3 px-4 bg-white dark:bg-transparent">
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">Total Billed</span>
                  <p className="text-[15px] font-extrabold text-gray-800 dark:text-white mt-0.5">{billedAmt}</p>
                </div>
                <div className="border border-gray-150 dark:border-white/5 rounded-[5px] py-3 px-4 bg-white dark:bg-transparent">
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">Total Paid (Advance)</span>
                  <p className="text-[15px] font-extrabold text-gray-800 dark:text-white mt-0.5">{paidAmt}</p>
                </div>
              </div>

              {/* Refund Method */}
              <div className="space-y-2">
                <span className="text-[13px] font-bold text-gray-600 dark:text-gray-300 ml-1 block">Refund Method</span>
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
                        type="button"
                        onClick={() => setRefundMethod(method.id)}
                        className={`flex flex-col items-center justify-center py-3.5 rounded-[5px] border transition-all ${
                          isSelected
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 bg-white dark:bg-[#1E293B]"
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 mb-2 ${
                            isSelected ? "text-primary" : "text-gray-400 dark:text-gray-500"
                          }`}
                        />
                        <span
                          className={`text-[12px] font-bold ${
                            isSelected ? "text-primary" : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {method.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="min-h-8 overflow-hidden mt-1 ml-1">
                  <span className="text-[11px] text-gray-400 dark:text-gray-500 font-semibold block transition-all">
                    {refundMethod === "Source" && "Original source (Card ending in 4242) will take 3-5 business days."}
                    {refundMethod === "Cash" && "Cash refunds are processed immediately at the billing counter."}
                    {refundMethod === "Bank" && "Bank transfers will be processed to the patient's verified account in 1-2 business days."}
                  </span>
                </div>
              </div>

              {/* Refund Reason */}
              <div className="space-y-2">
                <span className="text-[13px] font-bold text-gray-600 dark:text-gray-300 ml-1 block">Refund Reason</span>
                <div className="relative">
                  <select className="w-full h-[48px] px-4 rounded-[5px] border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1E293B] text-[14px] text-gray-700 dark:text-white outline-none focus:border-primary transition-all shadow-sm appearance-none font-semibold">
                    <option>Advance Payment Overages</option>
                    <option>Treatment Cancelled</option>
                    <option>Billing Error</option>
                    <option>Other</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <span className="text-[13px] font-bold text-gray-600 dark:text-gray-300 ml-1 block">Notes (Optional)</span>
                <textarea
                  placeholder="Add internal notes regarding this refund..."
                  className="w-full h-20 p-4 rounded-[5px] border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1E293B] text-[14px] text-gray-700 dark:text-white placeholder:text-gray-400 outline-none focus:border-primary transition-all shadow-sm resize-none"
                />
              </div>

            </form>

            {/* Footer */}
            <div className="px-4 sm:px-8 py-4 sm:py-6 border-t border-gray-100 dark:border-white/5 flex flex-col-reverse sm:flex-row justify-end items-stretch sm:items-center gap-3 sm:gap-4 shrink-0">
              <button 
                type="button" 
                onClick={() => onClose(false)}
                className="px-4 sm:px-8 h-[48px] rounded-[5px] text-gray-500 font-bold text-[13px] hover:text-primary transition-all bg-transparent border border-transparent"
              >
                Cancel
              </button>
              <button 
                type="submit"
                onClick={() => {
                  toast.success("Refund processed successfully");
                  onClose(false);
                }}
                className="bg-primary text-white px-6 sm:px-10 h-[48px] rounded-[5px] font-bold text-[13px] hover:opacity-90 transition-all shadow-none"
              >
                Confirm & Refund
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function PaymentPage() {
  const router = useRouter();
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
          <CompactStatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={
              stat.iconColor.includes("emerald")
                ? "emerald"
                : stat.iconColor.includes("amber")
                ? "amber"
                : stat.iconColor.includes("rose")
                ? "rose"
                : stat.iconColor.includes("indigo")
                ? "indigo"
                : "blue"
            }
            meta={`${stat.change} ${stat.subtitle}`}
          />
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
                <th className="whitespace-nowrap border-b border-border px-8 py-4 text-left text-[11px] font-bold tracking-widest text-muted-foreground">INVOICE ID</th>
                <th className="whitespace-nowrap border-b border-border px-8 py-4 text-left text-[11px] font-bold tracking-widest text-muted-foreground">PATIENT</th>
                <th className="whitespace-nowrap border-b border-border px-8 py-4 text-left text-[11px] font-bold tracking-widest text-muted-foreground">UHID</th>
                <th className="whitespace-nowrap border-b border-border px-8 py-4 text-left text-[11px] font-bold tracking-widest text-muted-foreground">TOTAL AMOUNT</th>
                <th className="whitespace-nowrap border-b border-border px-8 py-4 text-left text-[11px] font-bold tracking-widest text-muted-foreground">DUE AMOUNT</th>
                <th className="whitespace-nowrap border-b border-border px-8 py-4 text-left text-[11px] font-bold tracking-widest text-muted-foreground">DATE</th>
                <th className="whitespace-nowrap border-b border-border px-8 py-4 text-left text-[11px] font-bold tracking-widest text-muted-foreground">STATUS</th>
                <th className="whitespace-nowrap border-b border-border px-8 py-4 text-left text-[11px] font-bold tracking-widest text-muted-foreground">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-8 py-24 text-center text-[13px] font-bold text-muted-foreground">
                    No invoices found matching your search.
                  </td>
                </tr>
              ) : (
                filteredData.map((row, index) => (
                <tr key={index} className="group transition-all hover:bg-muted/20">
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
                    <div className="flex items-center justify-start gap-4">
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
        onClose={setIsModalOpen} 
        invoice={selectedInvoice} 
      />
      <ReviewInvoiceModal
        isOpen={isReviewModalOpen}
        onClose={setIsReviewModalOpen}
        invoice={selectedInvoice}
      />
      <ProcessRefundModal
        isOpen={isRefundModalOpen}
        onClose={setIsRefundModalOpen}
        invoice={selectedInvoice}
      />
    </FinancePageShell>
  );
}
