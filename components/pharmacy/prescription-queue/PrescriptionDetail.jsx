"use client";
import React from "react";
import { ArrowLeft, Printer, Play, Pill, AlertCircle, Check } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export function PrescriptionDetail() {
  const { id } = useParams();
  const medications = [
    { name: "Morphine Sulfate", dosage: "10mg/ml", sig: "IV Stat", qty: "2 Ampoules", stock: "50+" },
    { name: "Ondansetron", dosage: "4mg", sig: "IV Stat", qty: "1 Ampoule", stock: "24" },
    { name: "Ceftriaxone", dosage: "1g", sig: "IV q12h", qty: "2 Vials", stock: "12" },
    { name: "Normal Saline", dosage: "0.9%", sig: "500ml over 1h", qty: "1 Bag", stock: "100+" },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-[20px] font-sans bg-[#f8f9fc] dark:bg-[#0a0f1d] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/pharmacy/prescription-queue" className="p-2.5 bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[#64748b] hover:text-[#1e293b] dark:hover:text-white transition-all">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[20px] font-bold text-[#1e293b] dark:text-white">{id}</h1>
              <span className="bg-[#fef3c7] text-[#b45309] text-[11px] font-bold px-2 py-0.5 rounded-[4px]">Pending</span>
            </div>
            <p className="text-[12px] text-[#64748b] dark:text-[#94a3b8] font-bold mt-0.5 opacity-80">Received at 10:42 AM • Waiting: 12 min</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 h-11 border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-bold text-[#1e293b] dark:text-white hover:bg-gray-50 dark:hover:bg-[#334155] transition-all">
            <Printer size={16} /> Print
          </button>
          <Link 
            href={`/pharmacy/dispensing-billing/${id}`}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 h-11 bg-[#2e37a4] text-white rounded-[5px] text-[13px] font-bold hover:opacity-90 transition-all cursor-pointer"
          >
            Start Processing <Play size={14} fill="white" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[20px]">
        {/* Left Column (Col 4) */}
        <div className="lg:col-span-4 space-y-[20px]">
          {/* Patient Info Card */}
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155]">
            <p className="text-[11px] font-bold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider mb-5 opacity-70">Patient Information</p>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-[#2e37a4] text-white flex items-center justify-center rounded-full font-bold text-[16px]">SJ</div>
              <div>
                <h2 className="text-[18px] font-bold text-[#1e293b] dark:text-white">Sarah Jenkins</h2>
                <p className="text-[13px] text-[#64748b] font-bold opacity-80 mt-0.5">MRN-84729</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-y-8">
              <div className="space-y-1">
                <p className="text-[11px] text-[#64748b] font-bold uppercase tracking-tight opacity-70">Age / Gender</p>
                <p className="text-[14px] font-bold text-[#1e293b] dark:text-white">45 Years / Female</p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] text-[#64748b] font-bold uppercase tracking-tight opacity-70">Location</p>
                <p className="text-[14px] font-bold text-[#1e293b] dark:text-white">ER - Bed 4</p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] text-[#64748b] font-bold uppercase tracking-tight opacity-70">Prescribing Doctor</p>
                <p className="text-[14px] font-bold text-[#1e293b] dark:text-white">Dr. Smith</p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] text-[#64748b] font-bold uppercase tracking-tight opacity-70">Allergies</p>
                <p className="text-[14px] font-bold text-[#ef4444]">Penicillin</p>
              </div>
            </div>
          </div>

          {/* Doctor Notes Card */}
          <div className="bg-[#fffbeb] dark:bg-[#1e293b] p-6 rounded-[5px] border border-[#fef3c7] dark:border-[#334155]">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle size={16} className="text-[#b45309]" />
              <p className="text-[11px] font-bold text-[#b45309] uppercase tracking-wider">Doctor Notes</p>
            </div>
            <p className="text-[13px] text-[#b45309] dark:text-[#fcd34d] font-bold leading-relaxed opacity-90">
              Patient admitted with acute pain. Please prioritize analgesics. Administer first dose immediately in ER.
            </p>
          </div>
        </div>

        {/* Right Column (Col 8) */}
        <div className="lg:col-span-8 bg-white dark:bg-[#1e293b] p-6 rounded-[5px] border border-[#e2e8f0] dark:border-[#334155] h-fit">
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-[#f1f5f9] dark:border-[#334155]">
            <h2 className="text-[16px] font-bold text-[#1e293b] dark:text-white">Prescribed Medications</h2>
            <span className="text-[12px] font-bold text-[#64748b] opacity-80">4 Items</span>
          </div>
          <div className="space-y-4">
            {medications.map((med, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] transition-colors gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#eff6ff] dark:bg-[#1e40af]/20 rounded-[5px] shrink-0">
                    <Pill size={22} className="text-[#2e37a4]" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-x-2">
                      <h3 className="text-[14px] font-bold text-[#1e293b] dark:text-white">{med.name}</h3>
                      <span className="text-[12px] font-bold text-[#64748b] opacity-60 italic">{med.dosage}</span>
                    </div>
                    <p className="text-[12px] font-bold text-[#64748b] opacity-80 mt-1">
                      Sig: <span className="text-[#1e293b] dark:text-[#cbd5e1]">{med.sig}</span> &nbsp;·&nbsp; Qty: <span className="text-[#1e293b] dark:text-[#cbd5e1]">{med.qty}</span>
                    </p>
                  </div>
                </div>
                <div className="sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-[#f1f5f9] dark:border-[#334155]">
                  <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-tight opacity-70 mb-1">Stock Available</p>
                  <p className="text-[14px] font-bold text-[#22c55e] flex items-center sm:justify-end gap-1">
                    <Check size={16} strokeWidth={3} /> {med.stock}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
