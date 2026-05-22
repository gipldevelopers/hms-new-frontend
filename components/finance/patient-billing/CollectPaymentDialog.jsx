"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  CreditCard, 
  Wallet, 
  Smartphone, 
  Building2, 
  CheckCircle2, 
  Receipt, 
  Banknote, 
  Split, 
  ChevronDown 
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function CollectPaymentDialog({ open, onOpenChange, patientData, onPaymentConfirm }) {
  const balanceDue = patientData?.billing?.balanceDue || 0;
  const subtotal = patientData?.billing?.subtotal || 0;
  const discount = patientData?.billing?.discount || 0;
  const insuranceCovered = patientData?.billing?.insuranceCovered || 0;

  const [amountToPay, setAmountToPay] = useState(balanceDue.toFixed(2));
  const [paymentMethod, setPaymentMethod] = useState("Card");
  const [partialPayment, setPartialPayment] = useState(true);
  const [cardTerminal, setCardTerminal] = useState("Terminal 1 (Front Desk)");
  const [transactionRef, setTransactionRef] = useState("");

  const totalPending = balanceDue;

  useEffect(() => {
    if (open) {
      setAmountToPay(balanceDue.toFixed(2));
      setPartialPayment(true);
    }
  }, [open, balanceDue]);

  const cardTerminals = [
    "Terminal 1 (Front Desk)",
    "Terminal 2 (Billing Counter)",
    "Terminal 3 (Emergency)",
    "Terminal 4 (OPD)"
  ];

  const paymentMethods = [
    { id: "Card", label: "Card", icon: CreditCard },
    { id: "Cash", label: "Cash", icon: Banknote },
    { id: "UPI / QR", label: "UPI / QR", icon: Smartphone },
    { id: "Net Banking", label: "Net Banking", icon: Building2 },
    { id: "Wallet", label: "Wallet", icon: Wallet },
    { id: "Split", label: "Split", icon: Split }
  ];

  const handleTogglePartial = () => {
    if (partialPayment) {
      setPartialPayment(false);
      setAmountToPay(totalPending.toFixed(2));
    } else {
      setPartialPayment(true);
      const half = totalPending / 2;
      setAmountToPay(half > 0 ? half.toFixed(2) : "0.00");
    }
  };

  const handleConfirmPayment = () => {
    const numericAmount = parseFloat(amountToPay);
    if (!isNaN(numericAmount) && numericAmount > 0) {
      if (onPaymentConfirm) {
        onPaymentConfirm(numericAmount, paymentMethod, transactionRef);
      }
    }
    onOpenChange(false);
  };

  const remaining = totalPending - (parseFloat(amountToPay) || 0);
  const remainingText = remaining >= 0 ? `₹${remaining.toFixed(2)}` : "₹0.00";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[880px] w-[95vw] p-0 border border-[#E7E8EB] rounded-[5px] bg-white dark:border-white/10 dark:bg-[#101935] flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden shadow-none max-h-[95vh] lg:max-h-none">
        <DialogTitle className="sr-only">Collect Payment</DialogTitle>
        
        {/* Left Column - Invoice Details */}
        <div className="w-full lg:w-[40%] bg-[#F3F4FB] dark:bg-white/5 p-[20px] border-b lg:border-b-0 lg:border-r border-[#E7E8EB] dark:border-white/10 flex flex-col justify-between gap-[20px] shrink-0">
          <div className="space-y-[20px]">
            {/* Invoice Header */}
            <div className="flex items-center gap-[8px] text-[#1D2B8A] dark:text-[#9EA8FF]">
              <Receipt className="h-[18px] w-[18px]" />
              <span className="font-bold text-[14px]">Invoice Details</span>
            </div>
            
            {/* Invoice Information */}
            <div className="space-y-[20px]">
              <div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Invoice Number</p>
                <p className="text-[13px] text-slate-800 dark:text-white font-bold mt-[2px]">INV-2023-001</p>
              </div>
              
              <div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Patient</p>
                <p className="text-[13px] text-slate-800 dark:text-white font-bold mt-[2px]">{patientData?.name || "James Wilson"}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-[2px]">UHID: {patientData?.uhid || "UHID-839211"}</p>
              </div>
            </div>

            {/* SERVICES Section */}
            <div className="space-y-[12px] pt-[8px] flex-1 overflow-y-auto max-h-[160px]">
              <h4 className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Services</h4>
              <div className="space-y-[8px]">
                {(patientData?.charges?.flatMap(sec => sec.items) || []).length > 0 ? (
                  patientData.charges.flatMap(sec => sec.items).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-[8px]">
                      <span className="text-[13px] font-medium text-slate-700 dark:text-slate-300 truncate max-w-[180px]">{item.name}</span>
                      <span className="text-[13px] font-bold text-slate-800 dark:text-white">₹{item.total.toFixed(2)}</span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-medium text-slate-700 dark:text-slate-300">Consultation</span>
                      <span className="text-[13px] font-bold text-slate-800 dark:text-white">₹150.00</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-medium text-slate-700 dark:text-slate-300">Lab Tests</span>
                      <span className="text-[13px] font-bold text-slate-800 dark:text-white">₹45.00</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="space-y-[12px] pt-[12px] border-t border-[#E7E8EB] dark:border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-slate-600 dark:text-slate-400 font-medium">Subtotal</span>
              <span className="text-[13px] text-slate-800 dark:text-white font-bold">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-slate-600 dark:text-slate-400 font-medium">Discounts (5%)</span>
              <span className="text-[13px] text-green-600 dark:text-green-400 font-bold">-₹{discount.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-slate-600 dark:text-slate-400 font-medium">Insurance</span>
              <span className="text-[13px] text-[#137333] dark:text-[#81C995] font-bold">-₹{insuranceCovered.toFixed(2)}</span>
            </div>
            
            <div className="border-t border-[#E7E8EB] dark:border-white/10 my-[4px]" />

            <div className="flex items-baseline justify-between pt-[4px]">
              <span className="text-[13px] font-bold text-slate-800 dark:text-white">Total Pending</span>
              <span className="text-[20px] font-bold text-slate-800 dark:text-white">₹{totalPending.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Right Column - Collect Payment Details */}
        <div className="w-full lg:w-[60%] bg-white dark:bg-[#101935] p-[20px] flex flex-col gap-[20px] relative">
          {/* Close Button */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-[20px] right-[20px] flex items-center justify-center w-[32px] h-[32px] rounded-[5px] text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <h2 className="text-[16px] font-bold text-[#1D2B8A] dark:text-white pr-[40px]">Collect Payment</h2>

          {/* Amount to Pay */}
          <div className="space-y-[8px]">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Amount to Pay</label>
              <div className="flex items-center gap-[8px]">
                <span className="text-[12px] font-medium text-slate-500 dark:text-slate-400">Partial Payment</span>
                <button
                  type="button"
                  onClick={handleTogglePartial}
                  className={cn(
                    "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none",
                    partialPayment ? "bg-[#1D2B8A]" : "bg-slate-200"
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white transition duration-200",
                      partialPayment ? "translate-x-[18px]" : "translate-x-[2px]"
                    )}
                  />
                </button>
              </div>
            </div>
            
            <div className="relative">
              <span className="absolute left-[16px] top-1/2 -translate-y-1/2 text-[16px] font-bold text-slate-800 dark:text-white">
                ₹
              </span>
              <input
                type="text"
                value={amountToPay}
                onChange={(e) => {
                  const cleanVal = e.target.value.replace(/[^0-9.]/g, "");
                  setAmountToPay(cleanVal);
                }}
                className="w-full h-[48px] pl-[32px] pr-[16px] rounded-[5px] border border-slate-300 dark:border-white/10 bg-white dark:bg-[#101935] text-[16px] font-bold text-slate-800 dark:text-white outline-none focus:border-[#1D2B8A] transition"
              />
            </div>
            <p className="text-[11px] font-medium text-amber-600 dark:text-amber-500">
              Remaining balance will be {remainingText}
            </p>
          </div>

          {/* Payment Method */}
          <div className="space-y-[8px]">
            <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Payment Method</label>
            <div className="grid grid-cols-3 gap-[12px]">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                const isActive = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={cn(
                      "h-[75px] rounded-[5px] border flex flex-col items-center justify-center gap-[6px] transition shadow-none",
                      isActive
                        ? "border-2 border-[#1D2B8A] bg-[#EEF2FF] dark:bg-[#1D2B8A]/10 text-[#1D2B8A] dark:text-[#9EA8FF]"
                        : "border-[#E7E8EB] bg-white dark:border-white/10 dark:bg-[#101935] text-slate-600 dark:text-slate-400 hover:bg-[#F8F9FC] dark:hover:bg-white/5"
                    )}
                  >
                    <Icon className={cn("h-5 w-5", isActive ? "text-[#1D2B8A] dark:text-[#9EA8FF]" : "text-slate-400")} />
                    <span className="text-[12px] font-semibold">{method.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Payment Fields Wrapper */}
          <div className="bg-[#EDF5FD] dark:bg-white/5 p-[20px] rounded-[5px] space-y-[20px]">
            {/* Card Terminal Selection */}
            {paymentMethod === "Card" ? (
              <div className="space-y-[8px]">
                <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Card Terminal</label>
                <div className="relative">
                  <select
                    value={cardTerminal}
                    onChange={(e) => setCardTerminal(e.target.value)}
                    className="w-full h-[40px] pl-[12px] pr-[32px] rounded-[5px] border border-slate-300 bg-white text-[13px] text-slate-800 outline-none appearance-none cursor-pointer focus:border-[#1D2B8A] dark:bg-[#101935] dark:border-white/10 dark:text-white"
                  >
                    {cardTerminals.map((terminal, idx) => (
                      <option key={idx} value={terminal}>{terminal}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-[12px] top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            ) : null}

            {/* Transaction Reference (Optional) */}
            <div className="space-y-[8px]">
              <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Transaction Reference (Optional)
              </label>
              <input
                type="text"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder="e.g. TXN-12345"
                className="w-full h-[40px] px-[12px] rounded-[5px] border border-slate-300 bg-white text-[13px] text-slate-800 placeholder-slate-400 outline-none focus:border-[#1D2B8A] transition dark:bg-[#101935] dark:border-white/10 dark:text-white"
              />
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-[12px] pt-[8px]">
            <button
              onClick={() => onOpenChange(false)}
              className="h-[38px] px-[20px] rounded-[5px] border border-slate-300 bg-white text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition shadow-none dark:bg-[#101935] dark:border-white/10 dark:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmPayment}
              className="h-[38px] px-[20px] rounded-[5px] bg-[#1D2B8A] text-[13px] font-semibold text-white hover:bg-[#1D2B8A]/90 transition flex items-center justify-center gap-[8px] shadow-none"
            >
              <CheckCircle2 className="h-4 w-4" />
              Confirm Payment
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
