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
  ArrowLeft
} from "lucide-react";

// Mock Database of Patients for Invoices
const patientInvoiceData = {
  "T-01": {
    name: "James Wilson",
    uhid: "UHID-839211",
    addressLine1: "123 Healthcare Ave, Ward ICU-04",
    addressLine2: "New York, NY 10001",
    currency: "₹",
    invoiceNo: "INV-2023-002",
    date: "Oct 24, 2023",
    services: [
      { name: "General Ward (Oct 12 - Oct 14)", doc: "Accommodation", qty: 2, price: 150.00, total: 300.00 },
      { name: "Initial Consultation", doc: "Dr. Sarah Jenkins", qty: 1, price: 100.00, total: 100.00 },
      { name: "Follow-up Visit", doc: "Dr. Sarah Jenkins", qty: 2, price: 75.00, total: 150.00 },
      { name: "Complete Blood Count (CBC)", doc: "Pathology Lab", qty: 1, price: 45.00, total: 45.00 },
      { name: "Lipid Profile", doc: "Pathology Lab", qty: 1, price: 60.00, total: 60.00 },
      { name: "Paracetamol 500mg (30 tabs)", doc: "Pharmacy", qty: 2, price: 5.00, total: 10.00 },
      { name: "Amoxicillin 250mg (Strip)", doc: "Pharmacy", qty: 1, price: 12.00, total: 12.00 }
    ],
    billing: {
      subtotal: 677.00,
      discount: 33.85,
      discountLabel: "Discount (5%)",
      insuranceCovered: 400.00,
      netPayable: 243.15,
      balanceDue: 143.15 // default before payment
    }
  },
  "P-982342": {
    name: "John Smith",
    uhid: "P-982342",
    addressLine1: "456 Patient Lane, Apt 4B",
    addressLine2: "New York, NY 10002",
    currency: "$",
    invoiceNo: "INV-2023-001",
    date: "Oct 24, 2023",
    services: [
      { name: "Cardiology Consultation", doc: "Dr. Jane Doe", qty: 1, price: 150.00, total: 150.00 },
      { name: "Dermatology Appointment", doc: "Dr. John Smith", qty: 2, price: 22.50, total: 45.00 }
    ],
    billing: {
      subtotal: 195.00,
      discount: 9.75, // GST (5%)
      discountLabel: "Tax (5%) GST",
      isTax: true,
      insuranceCovered: 50.00,
      netPayable: 154.75,
      balanceDue: 0.00
    }
  }
};

export default function InvoiceMain({ params, searchParams }) {
  const router = useRouter();
  const uhid = params?.uhid || "P-982342";

  // State for success banner
  const [showBanner, setShowBanner] = useState(true);

  // Retrieve patient details (fall back to John Smith from the image if not found)
  const patient = patientInvoiceData[uhid] || patientInvoiceData["P-982342"];

  // Retrieve details from query params (which come from Collect Payment dialog confirmation)
  const queryAmount = searchParams?.amount;
  const queryMethod = searchParams?.method;
  const queryRef = searchParams?.ref;

  // Determine actual payment values based on transaction or default
  const transactionId = queryRef || "TXN-123456789";
  const paymentMethod = queryMethod ? `${queryMethod}` : "Credit Card (ends in 4242)";
  
  // Calculate pricing based on dynamic payment
  const subtotal = patient.billing.subtotal;
  const isTax = patient.billing.isTax;
  const adjustmentAmount = patient.billing.discount; // GST or Discount
  const insuranceCovered = patient.billing.insuranceCovered;
  
  // Grand total calculation: subtotal + tax (or - discount) - insurance
  const grandTotal = isTax 
    ? subtotal + adjustmentAmount - insuranceCovered 
    : subtotal - adjustmentAmount - insuranceCovered;

  // Paid amount: if dynamic, it's either the full grandTotal or what was paid
  const amountPaid = queryAmount ? parseFloat(queryAmount) : grandTotal;
  const balanceDue = Math.max(0, grandTotal - amountPaid);
  
  const currencySymbol = patient.currency;

  return (
    <div className="p-[20px] max-w-[1600px] mx-auto space-y-[20px] font-sans text-slate-800 dark:text-slate-200">
      
      {/* Back to billing link */}
      <div className="flex items-center gap-[8px]">
        <button
          onClick={() => router.push(`/finance/patient-billing/ipd-details/${uhid === "P-982342" ? "T-01" : uhid}`)}
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

      {/* Payment Success Banner Alert */}
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
                Transaction ID: {transactionId}. Invoice has been generated.
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

      {/* Grid Layout: Invoice Card + Invoice Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-[20px] items-start">

        {/* Left Side: Invoice details Sheet */}
        <div className="lg:col-span-3 bg-white dark:bg-[#101935] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 p-[20px] shadow-none space-y-[20px]">

          {/* Hospital Header Brand block */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-[20px]">
            <div className="flex items-start gap-[16px]">
              <div className="w-[48px] h-[48px] bg-[#2E37A4] rounded-[5px] flex items-center justify-center text-white shrink-0 shadow-none">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-[18px] font-bold text-slate-800 dark:text-white leading-tight">MedERP Hospital</h3>
                <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-[4px]">123 Healthcare Ave, Medical District</p>
                <p className="text-[12px] text-slate-400 dark:text-slate-500">New York, NY 10001 | +1 (555) 123-4567</p>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <h2 className="text-[24px] font-bold text-[#2E37A4] dark:text-[#9EA8FF] tracking-normal">Invoice</h2>
              <p className="text-[12px] font-bold text-slate-600 dark:text-slate-300 mt-[4px]">Invoice #: {patient.invoiceNo}</p>
              <p className="text-[12px] text-slate-400 dark:text-slate-500">Date: {patient.date}</p>
            </div>
          </div>

          <div className="border-b border-[#E7E8EB] dark:border-white/10" />

          {/* Billed To / Payment Info grid block */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px]">
            <div className="space-y-[6px]">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 block">Billed To</span>
              <h4 className="text-[14px] font-bold text-slate-800 dark:text-white">{patient.name}</h4>
              <p className="text-[12px] text-slate-500 dark:text-slate-400 font-semibold">UHID: {patient.uhid}</p>
              <p className="text-[12px] text-slate-400 dark:text-slate-500 leading-relaxed">
                {patient.addressLine1}<br />
                {patient.addressLine2}
              </p>
            </div>
            
            <div className="space-y-[6px]">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 block">Payment Info</span>
              <div className="grid grid-cols-12 gap-[8px] text-[12px]">
                <span className="col-span-4 text-slate-400 dark:text-slate-500 font-bold">Status:</span>
                <span className="col-span-8 font-bold text-[#137333] dark:text-[#81C995]">Paid</span>

                <span className="col-span-4 text-slate-400 dark:text-slate-500 font-bold">Method:</span>
                <span className="col-span-8 text-slate-700 dark:text-slate-300 font-medium">{paymentMethod}</span>

                <span className="col-span-4 text-slate-400 dark:text-slate-500 font-bold">Transaction:</span>
                <span className="col-span-8 text-slate-700 dark:text-slate-300 font-medium">{transactionId}</span>
              </div>
            </div>
          </div>

          <div className="border-b border-[#E7E8EB] dark:border-white/10" />

          {/* Services Table List */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E7E8EB] dark:border-white/10">
                  <th className="pb-[10px] text-[12px] font-bold text-slate-400 dark:text-slate-500">Service Description</th>
                  <th className="pb-[10px] text-[12px] font-bold text-slate-400 dark:text-slate-500 text-center">Qty</th>
                  <th className="pb-[10px] text-[12px] font-bold text-slate-400 dark:text-slate-500 text-right">Unit Price</th>
                  <th className="pb-[10px] text-[12px] font-bold text-slate-400 dark:text-slate-500 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E8EB]/60 dark:divide-white/5">
                {patient.services.map((service, idx) => (
                  <tr key={idx}>
                    <td className="py-[12px] pr-[16px]">
                      <div className="text-[13px] font-bold text-slate-800 dark:text-white">{service.name}</div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-[2px]">{service.doc}</div>
                    </td>
                    <td className="py-[12px] text-center text-[13px] font-semibold text-slate-800 dark:text-white">{service.qty}</td>
                    <td className="py-[12px] text-right text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                      {currencySymbol}{service.price.toFixed(2)}
                    </td>
                    <td className="py-[12px] text-right text-[13px] font-bold text-slate-800 dark:text-white">
                      {currencySymbol}{service.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Signature and Subtotals row block */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-[20px] pt-[12px]">

            {/* Terms and Sign block */}
            <div className="flex-1 flex flex-col justify-between self-stretch gap-[40px]">
              <div>
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 block">Terms & Conditions</span>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-[6px] max-w-[340px] leading-relaxed">
                  Payment is due within 30 days. Please make checks payable to MedERP Hospital. For billing inquiries, contact billing@mederp.com.
                </p>
              </div>
              <div className="pt-[20px]">
                <div className="w-[200px] border-t border-[#E7E8EB] dark:border-white/10 pt-[8px]">
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 block">Authorized Signature</span>
                </div>
              </div>
            </div>

            {/* Calculations Card Shaded block */}
            <div className="bg-[#F8F9FC] dark:bg-white/5 border border-[#E7E8EB] dark:border-white/10 p-[20px] rounded-[5px] w-full md:w-[300px] space-y-[12px] shadow-none shrink-0">
              <div className="flex justify-between text-[12px] text-slate-500 dark:text-slate-400">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800 dark:text-white">{currencySymbol}{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[12px] text-slate-500 dark:text-slate-400">
                <span>{patient.billing.discountLabel}</span>
                {isTax ? (
                  <span className="font-semibold text-slate-800 dark:text-white">
                    {currencySymbol}{adjustmentAmount.toFixed(2)}
                  </span>
                ) : (
                  <span className="font-bold text-[#137333] dark:text-[#81C995]">
                    -{currencySymbol}{adjustmentAmount.toFixed(2)}
                  </span>
                )}
              </div>
              <div className="flex justify-between text-[12px] text-slate-500 dark:text-slate-400">
                <span>Insurance Coverage</span>
                <span className="font-bold text-[#137333] dark:text-[#81C995]">
                  -{currencySymbol}{insuranceCovered.toFixed(2)}
                </span>
              </div>

              <div className="border-t border-dashed border-[#E7E8EB] dark:border-white/10 my-[8px]" />

              <div className="flex justify-between items-baseline">
                <span className="text-[12px] font-bold text-slate-800 dark:text-white">Grand Total</span>
                <span className="text-[16px] font-bold text-slate-800 dark:text-white">{currencySymbol}{grandTotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-baseline">
                <span className="text-[12px] font-bold text-slate-500 dark:text-slate-400">Amount Paid</span>
                <span className="text-[14px] font-bold text-[#137333] dark:text-[#81C995]">
                  {currencySymbol}{amountPaid.toFixed(2)}
                </span>
              </div>

              <div className="border-t border-dashed border-[#E7E8EB] dark:border-white/10 my-[8px]" />

              <div className="flex justify-between items-baseline">
                <span className="text-[12px] font-bold text-slate-700 dark:text-slate-300">Balance Due</span>
                <span className="text-[16px] font-bold text-slate-800 dark:text-white">{currencySymbol}{balanceDue.toFixed(2)}</span>
              </div>
            </div>

          </div>

        </div>

        {/* Right Side: Action Box Card */}
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
            onClick={() => router.push(`/finance/patient-billing`)} 
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
