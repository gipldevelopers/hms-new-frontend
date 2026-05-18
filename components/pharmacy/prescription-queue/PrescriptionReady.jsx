"use client";
import React from "react";
import { ArrowLeft, Check, Printer, Package } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export function PrescriptionReady() {
  const { id } = useParams();
  
  const packedItems = [
    { name: "Amoxicillin", dosage: "500mg", sig: "1-1-1", qty: "21 Caps" },
    { name: "Paracetamol", dosage: "500mg", sig: "SOS", qty: "10 Tabs" },
    { name: "Pantoprazole", dosage: "40mg", sig: "1-0-0", qty: "7 Tabs" },
    { name: "B-Complex", dosage: "1 Tab", sig: "0-1-0", qty: "10 Tabs" },
    { name: "Cough Syrup", dosage: "100ml", sig: "10ml TDS", qty: "1 Bottle" },
    { name: "Cough Syrup", dosage: "100ml", sig: "10ml TDS", qty: "1 Bottle" },
    { name: "Cough Syrup", dosage: "100ml", sig: "10ml TDS", qty: "1 Bottle" },
    { name: "Vitamin C", dosage: "500mg", sig: "1-0-0", qty: "10 Tabs" },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-[20px] font-sans bg-[#f8f9fc] dark:bg-[#0a0f1d] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/pharmacy/prescription-queue" className="p-2.5 bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[#64748b] hover:text-[#1e293b] transition-all">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[20px] font-bold text-[#1e293b] dark:text-white">RX-2024-0047</h1>
              <span className="bg-[#dcfce7] text-[#15803d] text-[11px] font-bold px-2 py-0.5 rounded-[4px]">Ready</span>
              <span className="bg-[#fff7ed] text-[#c2410c] text-[11px] font-bold px-2 py-0.5 rounded-[4px]">IPD</span>
            </div>
            <p className="text-[12px] text-[#64748b] dark:text-[#94a3b8] font-bold mt-0.5 opacity-80">Packed by Dr. John Doe at 10:54 AM</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 h-11 border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-bold text-[#1e293b] dark:text-white hover:bg-gray-50 transition-all">
            <Printer size={16} /> Print Labels
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 h-11 bg-[#2e37a4] text-white rounded-[5px] text-[13px] font-bold hover:opacity-90 transition-all">
            <Check size={16} strokeWidth={3} /> Mark as Dispensed
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[20px]">
        {/* Left Column */}
        <div className="lg:col-span-4 space-y-[20px]">
          {/* Patient Info Card */}
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155]">
            <p className="text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider mb-5 opacity-70">Patient Information</p>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-[#fff7ed] text-[#c2410c] flex items-center justify-center rounded-full font-bold text-[16px]">EW</div>
              <div>
                <h2 className="text-[18px] font-bold text-[#1e293b] dark:text-white">Emma Watson</h2>
                <p className="text-[13px] text-[#64748b] font-bold opacity-80 mt-0.5">MRN-55821</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-y-8">
              <div className="space-y-1">
                <p className="text-[11px] text-[#64748b] font-bold uppercase tracking-tight opacity-70">Age / Gender</p>
                <p className="text-[14px] font-bold text-[#1e293b] dark:text-white">28 Years / Female</p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] text-[#64748b] font-bold uppercase tracking-tight opacity-70">Location</p>
                <p className="text-[14px] font-bold text-[#1e293b] dark:text-white">Ward 3 - B12</p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] text-[#64748b] font-bold uppercase tracking-tight opacity-70">Prescribing Doctor</p>
                <p className="text-[14px] font-bold text-[#1e293b] dark:text-white">Dr. Patel</p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] text-[#64748b] font-bold uppercase tracking-tight opacity-70">Allergies</p>
                <p className="text-[14px] font-bold text-[#1e293b] dark:text-white">None</p>
              </div>
            </div>
          </div>

          {/* Handover Card */}
          <div className="bg-[#f0fdf4] dark:bg-[#064e3b]/20 p-6 rounded-[5px] border border-[#dcfce7] dark:border-[#065f46]">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white dark:bg-[#1e293b] rounded-[5px] border border-[#dcfce7] dark:border-[#065f46] shrink-0">
                <Package size={24} className="text-[#15803d]" />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-[#15803d]">Ready for Handover</h3>
                <p className="text-[13px] text-[#166534] dark:text-[#34d399] font-bold mt-1 leading-relaxed opacity-90">
                  All 6 items have been verified and packed. Package is waiting at Counter 2.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Packed Items) */}
        <div className="lg:col-span-8 bg-white dark:bg-[#1e293b] p-6 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] h-fit">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#f1f5f9] dark:border-[#334155]">
            <h2 className="text-[16px] font-bold text-[#1e293b] dark:text-white">Packed Items</h2>
            <span className="text-[12px] font-bold text-[#64748b] opacity-80">6 Items Total</span>
          </div>
          
          <div className="space-y-3">
            {packedItems.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px]">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-[#f0fdf4] dark:bg-[#064e3b]/30 rounded-full flex items-center justify-center shrink-0">
                    <Check size={16} className="text-[#15803d]" strokeWidth={3} />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-x-2">
                      <h3 className="text-[14px] font-bold text-[#1e293b] dark:text-white">{item.name}</h3>
                      <span className="text-[12px] font-bold text-[#64748b] opacity-60">{item.dosage}</span>
                    </div>
                    <p className="text-[12px] font-bold text-[#64748b] opacity-80 mt-0.5">
                      Sig: <span className="text-[#1e293b] dark:text-[#cbd5e1]">{item.sig}</span> &nbsp;·&nbsp; Qty: <span className="text-[#1e293b] dark:text-[#cbd5e1]">{item.qty}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
