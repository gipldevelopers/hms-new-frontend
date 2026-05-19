"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function PatientBillingDetailsMain({ searchParams }) {
  const type = searchParams?.type || "ipd";

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto space-y-6 font-inter">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-[24px] font-bold text-[#1e293b] dark:text-white tracking-tight">Patient Billing Details</h1>
          <div className="flex items-center gap-3">
            <button className="h-10 px-4 bg-white hover:bg-gray-50 dark:bg-white/5 border border-[#2E37A4] text-[#2E37A4] dark:text-blue-400 font-bold rounded-[6px] text-[13px] transition-all cursor-pointer">
              Initiate Discharge
            </button>
            <Link href="/finance/patient-billing/create" className="h-10 px-4 bg-white hover:bg-gray-50 dark:bg-white/5 border border-[#CBD5E1] dark:border-white/10 text-[#1e293b] dark:text-white font-bold rounded-[6px] text-[13px] transition-all cursor-pointer flex items-center justify-center shadow-none">
              + Add Charge
            </Link>
            <button className="h-10 px-5 bg-[#2E37A4] hover:bg-[#2E37A4]/90 text-white font-bold rounded-[6px] text-[13px] transition-all cursor-pointer shadow-sm">
              Collect Payment
            </button>
          </div>
        </div>
      </div>

      {/* Patient Billing Details Info Card Banner */}
      <div className="bg-card border border-border rounded-lg p-4 sm:p-6 shadow-none">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

          {/* Left Block - Patient Photo & Info (col-span 7) */}
          <div className="lg:col-span-7 flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {/* Circular Patient Photo / Avatar */}
            <div className="w-14 h-14 rounded-full overflow-hidden border border-[#E2E8F0] dark:border-white/10 flex-shrink-0 bg-gray-50 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="Patient Avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'/%3E%3C/svg%3E";
                }}
              />
            </div>

            {/* Patient Info Grid */}
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-[18px] font-bold text-[#1e293b] dark:text-white flex items-center gap-2">
                  {searchParams?.patient || "James Wilson"}
                  <span className="text-[13px] font-medium text-gray-400 dark:text-slate-400">62 yrs • Male</span>
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider block">UHID</span>
                  <span className="text-[13px] font-bold text-[#1e293b] dark:text-white">{searchParams?.uhid || "UHID-839211"}</span>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider block">Bed No.</span>
                  <span className="text-[13px] font-bold text-[#1e293b] dark:text-white">{searchParams?.room || "ICU-04"}</span>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider block">Admission Date</span>
                  <span className="text-[13px] font-bold text-[#1e293b] dark:text-white">12 Oct 2023</span>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider block">Attending Doctor</span>
                  <span className="text-[13px] font-bold text-[#1e293b] dark:text-white">Dr. Sarah Jenkins</span>
                </div>

                <div className="space-y-0.5 col-span-2">
                  <span className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider block">Diagnosis</span>
                  <span className="text-[13px] font-bold text-[#1e293b] dark:text-white">Acute Myocardial Infarction</span>
                </div>
              </div>
            </div>
          </div>

          {/* Vertical Separator for LG screens */}
          <div className="hidden lg:block lg:col-span-1 h-32 border-l border-[#E2E8F0] dark:border-white/10 justify-self-center"></div>

          {/* Right Block - Insurance Details (col-span 4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <h4 className="text-[16px] font-bold text-[#1e293b] dark:text-white">Insurance Details</h4>
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider text-[#218F40] bg-[#EBF7EE] border border-[#D3ECD9] dark:bg-green-500/10 dark:border-green-500/20 rounded-[4px] uppercase">
                Active
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider block">Insurance Name</span>
                <span className="text-[13px] font-bold text-[#1e293b] dark:text-white">BlueCross</span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider block">Provider</span>
                <span className="text-[13px] font-bold text-[#1e293b] dark:text-white">BlueCross BlueShield</span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider block">Policy No.</span>
                <span className="text-[13px] font-bold text-[#1e293b] dark:text-white">POL-98234-AX</span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider block">Status</span>
                <span className="inline-block px-2 py-0.5 text-[10px] font-bold tracking-wider text-[#218F40] bg-[#EBF7EE] border border-[#D3ECD9] dark:bg-green-500/10 dark:border-green-500/20 rounded-[4px] uppercase">
                  Approved
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Interactive Split Layout: Charges on left, Gross Total on right */}
      <BillingChargesSection />
    </div>
  );
}

function BillingChargesSection() {
  const [expanded, setExpanded] = useState({
    room: true,
    doctor: true,
    lab: true,
    pharmacy: true,
  });

  const toggle = (sec) => setExpanded((prev) => ({ ...prev, [sec]: !prev[sec] }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Section - Charges (col-span 8) - No horizontal padding to allow lines to extend full page */}
      <div className="lg:col-span-8 bg-card border border-border rounded-lg pt-6 pb-0 px-0 font-inter h-fit shadow-none">
        {/* Title */}
        <h2 className="text-[18px] font-bold text-[#1e293b] dark:text-white mb-5 px-6">Charges</h2>

        {/* Grid Table */}
        <div className="w-full overflow-x-auto">
          <div className="flex flex-col w-full min-w-[760px]">
            {/* Table Headers */}
            <div className="grid grid-cols-12 gap-4 text-[12px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider pb-3 px-6">
              <div className="col-span-5">Service Name</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-1 text-center">Qty</div>
              <div className="col-span-2 text-right">Price</div>
              <div className="col-span-1 text-right">Total</div>
              <div className="col-span-1 text-right">Source</div>
            </div>
            <div className="border-b border-[#E2E8F0] dark:border-white/10"></div>

            {/* 1. Room Charges Accordion & Items */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between py-[12px] px-[24px] bg-[#F8FAFC80] dark:bg-white/5">
                <button
                  onClick={() => toggle("room")}
                  className="flex items-center gap-2 text-[14px] font-bold text-[#1e293b] dark:text-white cursor-pointer select-none"
                >
                  <svg
                    className={`w-3.5 h-3.5 text-gray-500 transition-transform ${expanded.room ? "rotate-0" : "-rotate-90"}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                  Room Charges
                </button>
              </div>
              <div className="border-b border-[#E2E8F0] dark:border-white/10"></div>

              {expanded.room && (
                <>
                  <div className="grid grid-cols-12 gap-4 items-center py-3.5 px-6">
                    <div className="col-span-5 text-[14px] font-medium text-[#1e293b] dark:text-white">
                      General Ward (Oct 12 -Oct 14)
                    </div>
                    <div className="col-span-2 text-[14px] text-gray-500 dark:text-slate-400">Accommodation</div>
                    <div className="col-span-1 text-[14px] text-center text-[#1e293b] dark:text-white">2</div>
                    <div className="col-span-2 text-[14px] font-medium text-right text-gray-500 dark:text-slate-400">₹150.00</div>
                    <div className="col-span-1 text-[14px] font-bold text-right text-[#1e293b] dark:text-white">₹300.00</div>
                    <div className="col-span-1 text-right">
                      <span className="inline-block px-2 py-0.5 text-[10px] font-semibold text-gray-500 dark:text-slate-400 bg-[#F1F5F9] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[4px]">
                        System
                      </span>
                    </div>
                  </div>
                  <div className="border-b border-[#E2E8F0] dark:border-white/10"></div>
                </>
              )}
            </div>

            {/* 2. Doctor Visits Accordion & Items */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between py-[12px] px-[24px] bg-[#F8FAFC80] dark:bg-white/5">
                <button
                  onClick={() => toggle("doctor")}
                  className="flex items-center gap-2 text-[14px] font-bold text-[#1e293b] dark:text-white cursor-pointer select-none"
                >
                  <svg
                    className={`w-3.5 h-3.5 text-gray-500 transition-transform ${expanded.doctor ? "rotate-0" : "-rotate-90"}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                  Doctor Visits
                </button>
              </div>
              <div className="border-b border-[#E2E8F0] dark:border-white/10"></div>

              {expanded.doctor && (
                <>
                  {/* Row 1 */}
                  <div className="grid grid-cols-12 gap-4 items-center py-3.5 px-6">
                    <div className="col-span-5 text-[14px] font-medium text-[#1e293b] dark:text-white">Initial Consultation</div>
                    <div className="col-span-2 text-[14px] text-gray-500 dark:text-slate-400">Consultation</div>
                    <div className="col-span-1 text-[14px] text-center text-[#1e293b] dark:text-white">1</div>
                    <div className="col-span-2 text-[14px] font-medium text-right text-gray-500 dark:text-slate-400">₹100.00</div>
                    <div className="col-span-1 text-[14px] font-bold text-right text-[#1e293b] dark:text-white">₹100.00</div>
                    <div className="col-span-1 text-right">
                      <span className="inline-block px-2 py-0.5 text-[10px] font-semibold text-gray-500 dark:text-slate-400 bg-[#F1F5F9] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[4px]">
                        IPD
                      </span>
                    </div>
                  </div>
                  <div className="border-b border-[#E2E8F0] dark:border-white/10"></div>
                  {/* Row 2 */}
                  <div className="grid grid-cols-12 gap-4 items-center py-3.5 px-6">
                    <div className="col-span-5 text-[14px] font-medium text-[#1e293b] dark:text-white">Follow-up Visit</div>
                    <div className="col-span-2 text-[14px] text-gray-500 dark:text-slate-400">Consultation</div>
                    <div className="col-span-1 text-[14px] text-center text-[#1e293b] dark:text-white">2</div>
                    <div className="col-span-2 text-[14px] font-medium text-right text-gray-500 dark:text-slate-400">₹75.00</div>
                    <div className="col-span-1 text-[14px] font-bold text-right text-[#1e293b] dark:text-white">₹150.00</div>
                    <div className="col-span-1 text-right">
                      <span className="inline-block px-2 py-0.5 text-[10px] font-semibold text-gray-500 dark:text-slate-400 bg-[#F1F5F9] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[4px]">
                        IPD
                      </span>
                    </div>
                  </div>
                  <div className="border-b border-[#E2E8F0] dark:border-white/10"></div>
                </>
              )}
            </div>

            {/* 3. Lab Tests Accordion & Items */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between py-[12px] px-[24px] bg-[#F8FAFC80] dark:bg-white/5">
                <button
                  onClick={() => toggle("lab")}
                  className="flex items-center gap-2 text-[14px] font-bold text-[#1e293b] dark:text-white cursor-pointer select-none"
                >
                  <svg
                    className={`w-3.5 h-3.5 text-gray-500 transition-transform ${expanded.lab ? "rotate-0" : "-rotate-90"}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                  Lab Tests
                </button>
              </div>
              <div className="border-b border-[#E2E8F0] dark:border-white/10"></div>

              {expanded.lab && (
                <>
                  {/* Row 1 */}
                  <div className="grid grid-cols-12 gap-4 items-center py-3.5 px-6">
                    <div className="col-span-5 text-[14px] font-medium text-[#1e293b] dark:text-white">Complete Blood Count (CBC)</div>
                    <div className="col-span-2 text-[14px] text-gray-500 dark:text-slate-400">Pathology</div>
                    <div className="col-span-1 text-[14px] text-center text-[#1e293b] dark:text-white">1</div>
                    <div className="col-span-2 text-[14px] font-medium text-right text-gray-500 dark:text-slate-400">₹45.00</div>
                    <div className="col-span-1 text-[14px] font-bold text-right text-[#1e293b] dark:text-white">₹45.00</div>
                    <div className="col-span-1 text-right">
                      <span className="inline-block px-2 py-0.5 text-[10px] font-semibold text-gray-500 dark:text-slate-400 bg-[#F1F5F9] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[4px]">
                        Lab
                      </span>
                    </div>
                  </div>
                  <div className="border-b border-[#E2E8F0] dark:border-white/10"></div>
                  {/* Row 2 */}
                  <div className="grid grid-cols-12 gap-4 items-center py-3.5 px-6">
                    <div className="col-span-5 text-[14px] font-medium text-[#1e293b] dark:text-white">Lipid Profile</div>
                    <div className="col-span-2 text-[14px] text-gray-500 dark:text-slate-400">Pathology</div>
                    <div className="col-span-1 text-[14px] text-center text-[#1e293b] dark:text-white">1</div>
                    <div className="col-span-2 text-[14px] font-medium text-right text-gray-500 dark:text-slate-400">₹60.00</div>
                    <div className="col-span-1 text-[14px] font-bold text-right text-[#1e293b] dark:text-white">₹60.00</div>
                    <div className="col-span-1 text-right">
                      <span className="inline-block px-2 py-0.5 text-[10px] font-semibold text-gray-500 dark:text-slate-400 bg-[#F1F5F9] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[4px]">
                        Lab
                      </span>
                    </div>
                  </div>
                  <div className="border-b border-[#E2E8F0] dark:border-white/10"></div>
                </>
              )}
            </div>

            {/* 4. Pharmacy Accordion & Items */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between py-[12px] px-[24px] bg-[#F8FAFC80] dark:bg-white/5">
                <button
                  onClick={() => toggle("pharmacy")}
                  className="flex items-center gap-2 text-[14px] font-bold text-[#1e293b] dark:text-white cursor-pointer select-none"
                >
                  <svg
                    className={`w-3.5 h-3.5 text-gray-500 transition-transform ${expanded.pharmacy ? "rotate-0" : "-rotate-90"}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                  Pharmacy
                </button>
              </div>
              <div className="border-b border-[#E2E8F0] dark:border-white/10"></div>

              {expanded.pharmacy && (
                <>
                  {/* Row 1 */}
                  <div className="grid grid-cols-12 gap-4 items-center py-3.5 px-6">
                    <div className="col-span-5 text-[14px] font-medium text-[#1e293b] dark:text-white">Paracetamol 500mg (10 tabs)</div>
                    <div className="col-span-2 text-[14px] text-gray-500 dark:text-slate-400">Medicine</div>
                    <div className="col-span-1 text-[14px] text-center text-[#1e293b] dark:text-white">2</div>
                    <div className="col-span-2 text-[14px] font-medium text-right text-gray-500 dark:text-slate-400">₹5.00</div>
                    <div className="col-span-1 text-[14px] font-bold text-right text-[#1e293b] dark:text-white">₹10.00</div>
                    <div className="col-span-1 text-right">
                      <span className="inline-block px-2 py-0.5 text-[10px] font-semibold text-gray-500 dark:text-slate-400 bg-[#F1F5F9] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[4px]">
                        Pharmacy
                      </span>
                    </div>
                  </div>
                  <div className="border-b border-[#E2E8F0] dark:border-white/10"></div>
                  {/* Row 2 */}
                  <div className="grid grid-cols-12 gap-4 items-center py-3.5 px-6">
                    <div className="col-span-5 text-[14px] font-medium text-[#1e293b] dark:text-white">Amoxicillin 250mg (Strip)</div>
                    <div className="col-span-2 text-[14px] text-gray-500 dark:text-slate-400">Medicine</div>
                    <div className="col-span-1 text-[14px] text-center text-[#1e293b] dark:text-white">1</div>
                    <div className="col-span-2 text-[14px] font-medium text-right text-gray-500 dark:text-slate-400">₹12.00</div>
                    <div className="col-span-1 text-[14px] font-bold text-right text-[#1e293b] dark:text-white">₹12.00</div>
                    <div className="col-span-1 text-right">
                      <span className="inline-block px-2 py-0.5 text-[10px] font-semibold text-gray-500 dark:text-slate-400 bg-[#F1F5F9] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[4px]">
                        Pharmacy
                      </span>
                    </div>
                  </div>
                  <div className="border-b border-[#E2E8F0] dark:border-white/10"></div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer totals */}
        <div className="flex items-center justify-end gap-6 py-4 px-6 bg-[#F8FAFC] dark:bg-white/5 border-t border-[#E2E8F0] dark:border-white/10 rounded-b-[8px] text-[14px]">
          <span className="text-gray-500 dark:text-gray-400 font-medium">
            Total Items: <strong className="text-[#1e293b] dark:text-white font-semibold">7</strong>
          </span>
          <span className="text-gray-500 dark:text-gray-400 font-medium">
            Subtotal: <strong className="text-[#2E37A4] dark:text-blue-400 font-bold text-[16px]">₹677.00</strong>
          </span>
        </div>
      </div>

      {/* Right Section - Gross Total Summary (col-span 4) */}
      <div className="lg:col-span-4 bg-card border border-border rounded-lg pt-6 pb-6 px-0 h-fit font-inter shadow-none">
        {/* Title */}
        <h2 className="text-[18px] font-bold text-[#1e293b] dark:text-white mb-5 px-4 sm:px-6">Gross Total</h2>

        {/* Breakdown details */}
        <div className="px-4 sm:px-6 space-y-4">
          <div className="flex items-center justify-between text-[14px]">
            <span className="text-gray-500 dark:text-slate-400 font-medium">Total Charges</span>
            <span className="text-[#1e293b] dark:text-white font-bold">₹677.00</span>
          </div>

          <div className="flex items-center justify-between text-[14px]">
            <span className="text-gray-500 dark:text-slate-400 font-medium">Advance Paid</span>
            <span className="text-[#218F40] font-bold">-₹200.00</span>
          </div>

          <div className="flex items-center justify-between text-[14px]">
            <span className="text-gray-500 dark:text-slate-400 font-medium">Copayment (Insurance)</span>
            <span className="text-[#1e293b] dark:text-white font-bold">₹477.00</span>
          </div>
        </div>

        <div className="border-b border-border my-4"></div>

        {/* Calculation Details */}
        <div className="py-4 px-4 sm:px-6">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between text-[14px]">
              <span className="text-gray-500 dark:text-slate-400 font-medium">Discounts (5%)</span>
              <span className="text-[#218F40] font-bold">-₹33.85</span>
            </div>

            <div className="flex items-center justify-between text-[14px]">
              <span className="flex items-center gap-1 text-gray-500 dark:text-slate-400 font-medium">
                Insurance Covered
                <svg className="w-3.5 h-3.5 text-gray-400 cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
              </span>
              <span className="text-[#218F40] font-bold">-₹400.00</span>
            </div>
          </div>

          <div className="border-b border-border my-3.5"></div>

          <div className="flex items-center justify-between text-[14px] font-bold text-[#1e293b] dark:text-white">
            <span>Net Payable</span>
            <span>₹243.15</span>
          </div>
        </div>
        <div className="border-b border-border"></div>

        {/* Billing Status & Timeline */}
        <div className="py-5 px-4 sm:px-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-bold text-gray-500 dark:text-slate-400">Billing Health</span>
            <span className="px-2 py-0.5 text-[10.5px] font-bold text-[#218F40] bg-[#EBF7EE] border border-[#D3ECD9] dark:bg-green-500/10 dark:border-green-500/20 rounded-[4px] uppercase">
              Good
            </span>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="w-full bg-[#F1F5F9] dark:bg-white/5 h-2 rounded-[4px] overflow-hidden">
              <div className="bg-[#218F40] h-full rounded-[4px]" style={{ width: "80%" }}></div>
            </div>
            <div className="flex justify-between text-[11px] text-gray-400 dark:text-slate-400 font-medium">
              <span>80% Covered by Insurance & Advance</span>
              <span>20% Balance</span>
            </div>
          </div>
        </div>

        {/* Large Action Buttons */}
        <div className="px-4 sm:px-6 pb-2 space-y-3">
          <button className="w-full h-11 bg-[#F1F5F9] hover:bg-[#F1F5F9]/80 text-[#1e293b] font-bold rounded-[6px] text-[13px] flex items-center justify-center gap-2 transition-all cursor-pointer border border-[#E2E8F0] dark:border-white/10">
            Generate Interim Bill
          </button>

          <button className="w-full h-11 bg-[#E2E8F0] hover:bg-[#E2E8F0]/80 text-[#64748B] font-medium rounded-[6px] text-[13px] flex items-center justify-center gap-2 transition-all cursor-pointer border border-[#CBD5E1]">
            <svg className="w-4 h-4 text-[#64748B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            Download Bill
          </button>
        </div>
      </div>
    </div>
  );
}
