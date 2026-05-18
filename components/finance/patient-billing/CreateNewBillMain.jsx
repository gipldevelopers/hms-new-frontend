"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function CreateNewBillMain({ searchParams }) {
  const type = searchParams?.type || "ipd";

  const [patientId, setPatientId] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [billType, setBillType] = useState("");
  const [doctor, setDoctor] = useState("");

  useEffect(() => {
    if (type) {
      setBillType(type.toUpperCase());
    }
  }, [type]);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 font-inter">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[13px] font-medium text-gray-500 dark:text-gray-400">
          <Link href="/finance/patient-billing" className="hover:text-[#2E37A4] transition-colors">Patient Billing</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#1e293b] dark:text-white font-bold">Create New Bill</span>
        </div>
        <h1 className="text-[24px] font-bold text-[#1e293b] dark:text-white tracking-tight">Create New Bill</h1>
      </div>

      {/* Form Section */}
      <div className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[8px] p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#1e293b] dark:text-slate-300">
              Patient Name/UHID Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Unknown / John Doe"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full h-10 px-3 bg-white dark:bg-white/5 border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all dark:text-white font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#1e293b] dark:text-slate-300">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. 45"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="w-full h-10 px-3 bg-white dark:bg-white/5 border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all dark:text-white font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#1e293b] dark:text-slate-300">
              IPD/OPD
            </label>
            <div className="relative">
              <select
                value={billType}
                onChange={(e) => setBillType(e.target.value)}
                className="w-full h-10 pl-3 pr-8 bg-white dark:bg-white/5 border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] text-[#1e293b] dark:text-gray-300 appearance-none focus:outline-none focus:border-primary cursor-pointer font-medium"
              >
                <option value="" disabled>Select</option>
                <option value="IPD">IPD</option>
                <option value="OPD">OPD</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#1e293b] dark:text-slate-300">
              Consulting Doctor <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
                className="w-full h-10 pl-3 pr-8 bg-white dark:bg-white/5 border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] text-[#1e293b] dark:text-gray-300 appearance-none focus:outline-none focus:border-primary cursor-pointer font-medium"
              >
                <option value="" disabled>Select</option>
                <option value="Dr. Smith">Dr. Smith</option>
                <option value="Dr. John Doe">Dr. John Doe</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
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

// Subcomponent to organize code cleanly and avoid huge file sizes
function BillingChargesSection() {
  const [expanded, setExpanded] = React.useState({
    room: true,
    doctor: true,
    lab: true,
    pharmacy: true,
  });

  // Stateful list of wards to support interactive "+ Add Ward" adding a new row
  const [wards, setWards] = React.useState([
    {
      wardName: "General Ward (Oct 12 - Oct 14)",
      category: "WD-ERS-01",
      qty: "WD-ERS-01",
      price: "WD-ERS-01",
      total: "WD-ERS-01",
    },
  ]);

  const toggle = (sec) => setExpanded((prev) => ({ ...prev, [sec]: !prev[sec] }));

  const addWard = () => {
    setWards((prev) => [
      ...prev,
      { wardName: "", category: "", qty: "", price: "", total: "" },
    ]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Section - Charges (col-span 8) - No horizontal padding to allow lines to extend full page */}
      <div className="lg:col-span-8 bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[8px] pt-6 pb-0 px-0 font-inter h-fit">
        {/* Title */}
        <h2 className="text-[18px]  font-bold text-[#1e293b] dark:text-white mb-5 px-6">Charges</h2>

        {/* Grid Table */}
        <div className="flex flex-col w-full">
          {/* Table Headers */}
          <div className="hidden md:grid grid-cols-12 gap-4 text-[12px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider pb-3 px-6">
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
            <div className="flex items-center justify-between py-[12px] px-[24px] bg-[#F1F5F9]/50 dark:bg-white/5">
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
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addWard();
                }}
                className="text-[12px] font-bold text-[#2E37A4] hover:text-[#2E37A4]/80 transition-colors"
              >
                + Add Ward
              </button>
            </div>
            <div className="border-b border-[#E2E8F0] dark:border-white/10"></div>

            {expanded.room && (
              <>
                <div className="py-4 px-6 space-y-4">
                  {wards.map((ward, index) => (
                    <div key={index} className="grid grid-cols-2 md:grid-cols-12 gap-3 md:gap-4 items-end">
                      {/* Ward name is col-span-4 to give it double width so it is NOT hidden/cut off */}
                      <div className="col-span-2 md:col-span-4 space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase dark:text-slate-400 block md:hidden">Ward Name</label>
                        {index === 0 && (
                          <label className="text-[10px] font-bold text-gray-400 uppercase dark:text-slate-400 hidden md:block">Ward Name</label>
                        )}
                        <input
                          type="text"
                          defaultValue={ward.wardName}
                          placeholder="General Ward"
                          className="w-full h-9 px-3 bg-white dark:bg-white/5 border border-[#E2E8F0] dark:border-white/10 rounded-[5px] text-[14px] font-medium text-[#1e293b] dark:text-white focus:outline-none"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase dark:text-slate-400 block md:hidden">Category</label>
                        {index === 0 && (
                          <label className="text-[10px] font-bold text-gray-400 uppercase dark:text-slate-400 hidden md:block">Category</label>
                        )}
                        <input
                          type="text"
                          defaultValue={ward.category}
                          placeholder="Category code"
                          className="w-full h-9 px-3 bg-white dark:bg-white/5 border border-[#E2E8F0] dark:border-white/10 rounded-[5px] text-[14px] font-medium text-[#1e293b] dark:text-white focus:outline-none"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase dark:text-slate-400 block md:hidden">Qty</label>
                        {index === 0 && (
                          <label className="text-[10px] font-bold text-gray-400 uppercase dark:text-slate-400 hidden md:block">Qty</label>
                        )}
                        <input
                          type="text"
                          defaultValue={ward.qty}
                          placeholder="Qty code"
                          className="w-full h-9 px-3 bg-white dark:bg-white/5 border border-[#E2E8F0] dark:border-white/10 rounded-[5px] text-[14px] font-medium text-[#1e293b] dark:text-white focus:outline-none"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase dark:text-slate-400 block md:hidden">Price</label>
                        {index === 0 && (
                          <label className="text-[10px] font-bold text-gray-400 uppercase dark:text-slate-400 hidden md:block">Price</label>
                        )}
                        <input
                          type="text"
                          defaultValue={ward.price}
                          placeholder="Price code"
                          className="w-full h-9 px-3 bg-white dark:bg-white/5 border border-[#E2E8F0] dark:border-white/10 rounded-[5px] text-[14px] font-medium text-[#1e293b] dark:text-white focus:outline-none"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase dark:text-slate-400 block md:hidden">Total</label>
                        {index === 0 && (
                          <label className="text-[10px] font-bold text-gray-400 uppercase dark:text-slate-400 hidden md:block">Total</label>
                        )}
                        <input
                          type="text"
                          defaultValue={ward.total}
                          placeholder="Total code"
                          className="w-full h-9 px-3 bg-white dark:bg-white/5 border border-[#E2E8F0] dark:border-white/10 rounded-[5px] text-[14px] font-medium text-[#1e293b] dark:text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                  <div className="border-b border-[#E2E8F0] dark:border-white/10"></div>
                </>
              )}
            </div>

            {/* 2. Doctor Visits Accordion & Items */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between py-[12px] px-[24px] bg-[#F1F5F9]/50 dark:bg-white/5">
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
                <button className="text-[12px] font-bold text-[#2E37A4] hover:text-[#2E37A4]/80 transition-colors">
                  + Add Ward
                </button>
              </div>
              <div className="border-b border-[#E2E8F0] dark:border-white/10"></div>

              {expanded.doctor && (
                <>
                  {/* Row 1 */}
                  {/* Desktop Layout */}
                  <div className="hidden md:grid grid-cols-12 gap-4 items-center py-3.5 px-6">
                    <div className="col-span-5 text-[14px] font-medium text-[#1e293b] dark:text-white">Initial Consultation</div>
                    <div className="col-span-2 text-[14px] text-gray-500 dark:text-slate-400">Consultation</div>
                    <div className="col-span-1 text-[14px] text-center text-[#1e293b] dark:text-white">1</div>
                    <div className="col-span-2 text-[14px] font-medium text-right text-gray-500 dark:text-slate-400">$100.00</div>
                    <div className="col-span-1 text-[14px] font-bold text-right text-[#1e293b] dark:text-white">$100.00</div>
                    <div className="col-span-1 text-right">
                      <span className="inline-block px-2 py-0.5 text-[10px] font-semibold text-gray-500 dark:text-slate-400 bg-[#F1F5F9] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[4px]">
                        IPD
                      </span>
                    </div>
                  </div>
                  {/* Mobile Layout */}
                  <div className="flex flex-col md:hidden py-4 px-6 space-y-3.5">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <div className="text-[14px] font-semibold text-[#1e293b] dark:text-white">Initial Consultation</div>
                        <div className="text-[12px] text-gray-500 dark:text-slate-400 mt-0.5">Consultation</div>
                      </div>
                      <span className="shrink-0 inline-block px-2 py-0.5 text-[10px] font-semibold text-gray-500 dark:text-slate-400 bg-[#F1F5F9] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[4px]">
                        IPD
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 bg-[#F8FAFC] dark:bg-white/5 p-3 rounded-[6px] text-center">
                      <div>
                        <div className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider">Qty</div>
                        <div className="text-[13px] font-medium text-[#1e293b] dark:text-white mt-0.5">1</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider">Price</div>
                        <div className="text-[13px] font-medium text-gray-500 dark:text-slate-400 mt-0.5">$100.00</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider">Total</div>
                        <div className="text-[13px] font-bold text-[#1e293b] dark:text-white mt-0.5">$100.00</div>
                      </div>
                    </div>
                  </div>
                  <div className="border-b border-[#E2E8F0] dark:border-white/10"></div>

                  {/* Row 2 */}
                  {/* Desktop Layout */}
                  <div className="hidden md:grid grid-cols-12 gap-4 items-center py-3.5 px-6">
                    <div className="col-span-5 text-[14px] font-medium text-[#1e293b] dark:text-white">Follow-up Visit</div>
                    <div className="col-span-2 text-[14px] text-gray-500 dark:text-slate-400">Consultation</div>
                    <div className="col-span-1 text-[14px] text-center text-[#1e293b] dark:text-white">2</div>
                    <div className="col-span-2 text-[14px] font-medium text-right text-gray-500 dark:text-slate-400">$75.00</div>
                    <div className="col-span-1 text-[14px] font-bold text-right text-[#1e293b] dark:text-white">$150.00</div>
                    <div className="col-span-1 text-right">
                      <span className="inline-block px-2 py-0.5 text-[10px] font-semibold text-gray-500 dark:text-slate-400 bg-[#F1F5F9] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[4px]">
                        IPD
                      </span>
                    </div>
                  </div>
                  {/* Mobile Layout */}
                  <div className="flex flex-col md:hidden py-4 px-6 space-y-3.5">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <div className="text-[14px] font-semibold text-[#1e293b] dark:text-white">Follow-up Visit</div>
                        <div className="text-[12px] text-gray-500 dark:text-slate-400 mt-0.5">Consultation</div>
                      </div>
                      <span className="shrink-0 inline-block px-2 py-0.5 text-[10px] font-semibold text-gray-500 dark:text-slate-400 bg-[#F1F5F9] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[4px]">
                        IPD
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 bg-[#F8FAFC] dark:bg-white/5 p-3 rounded-[6px] text-center">
                      <div>
                        <div className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider">Qty</div>
                        <div className="text-[13px] font-medium text-[#1e293b] dark:text-white mt-0.5">2</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider">Price</div>
                        <div className="text-[13px] font-medium text-gray-500 dark:text-slate-400 mt-0.5">$75.00</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider">Total</div>
                        <div className="text-[13px] font-bold text-[#1e293b] dark:text-white mt-0.5">$150.00</div>
                      </div>
                    </div>
                  </div>
                  <div className="border-b border-[#E2E8F0] dark:border-white/10"></div>
                </>
              )}
            </div>

            {/* 3. Lab Tests Accordion & Items */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between py-[12px] px-[24px] bg-[#F1F5F9]/50 dark:bg-white/5">
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
                <button className="text-[12px] font-bold text-[#2E37A4] hover:text-[#2E37A4]/80 transition-colors">
                  + Add Ward
                </button>
              </div>
              <div className="border-b border-[#E2E8F0] dark:border-white/10"></div>

              {expanded.lab && (
                <>
                  {/* Row 1 */}
                  {/* Desktop Layout */}
                  <div className="hidden md:grid grid-cols-12 gap-4 items-center py-3.5 px-6">
                    <div className="col-span-5 text-[14px] font-medium text-[#1e293b] dark:text-white">Complete Blood Count (CBC)</div>
                    <div className="col-span-2 text-[14px] text-gray-500 dark:text-slate-400">Pathology</div>
                    <div className="col-span-1 text-[14px] text-center text-[#1e293b] dark:text-white">1</div>
                    <div className="col-span-2 text-[14px] font-medium text-right text-gray-500 dark:text-slate-400">$45.00</div>
                    <div className="col-span-1 text-[14px] font-bold text-right text-[#1e293b] dark:text-white">$45.00</div>
                    <div className="col-span-1 text-right">
                      <span className="inline-block px-2 py-0.5 text-[10px] font-semibold text-gray-500 dark:text-slate-400 bg-[#F1F5F9] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[4px]">
                        Lab
                      </span>
                    </div>
                  </div>
                  {/* Mobile Layout */}
                  <div className="flex flex-col md:hidden py-4 px-6 space-y-3.5">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <div className="text-[14px] font-semibold text-[#1e293b] dark:text-white">Complete Blood Count (CBC)</div>
                        <div className="text-[12px] text-gray-500 dark:text-slate-400 mt-0.5">Pathology</div>
                      </div>
                      <span className="shrink-0 inline-block px-2 py-0.5 text-[10px] font-semibold text-gray-500 dark:text-slate-400 bg-[#F1F5F9] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[4px]">
                        Lab
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 bg-[#F8FAFC] dark:bg-white/5 p-3 rounded-[6px] text-center">
                      <div>
                        <div className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider">Qty</div>
                        <div className="text-[13px] font-medium text-[#1e293b] dark:text-white mt-0.5">1</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider">Price</div>
                        <div className="text-[13px] font-medium text-gray-500 dark:text-slate-400 mt-0.5">$45.00</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider">Total</div>
                        <div className="text-[13px] font-bold text-[#1e293b] dark:text-white mt-0.5">$45.00</div>
                      </div>
                    </div>
                  </div>
                  <div className="border-b border-[#E2E8F0] dark:border-white/10"></div>

                  {/* Row 2 */}
                  {/* Desktop Layout */}
                  <div className="hidden md:grid grid-cols-12 gap-4 items-center py-3.5 px-6">
                    <div className="col-span-5 text-[14px] font-medium text-[#1e293b] dark:text-white">Lipid Profile</div>
                    <div className="col-span-2 text-[14px] text-gray-500 dark:text-slate-400">Pathology</div>
                    <div className="col-span-1 text-[14px] text-center text-[#1e293b] dark:text-white">1</div>
                    <div className="col-span-2 text-[14px] font-medium text-right text-gray-500 dark:text-slate-400">$60.00</div>
                    <div className="col-span-1 text-[14px] font-bold text-right text-[#1e293b] dark:text-white">$60.00</div>
                    <div className="col-span-1 text-right">
                      <span className="inline-block px-2 py-0.5 text-[10px] font-semibold text-gray-500 dark:text-slate-400 bg-[#F1F5F9] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[4px]">
                        Lab
                      </span>
                    </div>
                  </div>
                  {/* Mobile Layout */}
                  <div className="flex flex-col md:hidden py-4 px-6 space-y-3.5">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <div className="text-[14px] font-semibold text-[#1e293b] dark:text-white">Lipid Profile</div>
                        <div className="text-[12px] text-gray-500 dark:text-slate-400 mt-0.5">Pathology</div>
                      </div>
                      <span className="shrink-0 inline-block px-2 py-0.5 text-[10px] font-semibold text-gray-500 dark:text-slate-400 bg-[#F1F5F9] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[4px]">
                        Lab
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 bg-[#F8FAFC] dark:bg-white/5 p-3 rounded-[6px] text-center">
                      <div>
                        <div className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider">Qty</div>
                        <div className="text-[13px] font-medium text-[#1e293b] dark:text-white mt-0.5">1</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider">Price</div>
                        <div className="text-[13px] font-medium text-gray-500 dark:text-slate-400 mt-0.5">$60.00</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider">Total</div>
                        <div className="text-[13px] font-bold text-[#1e293b] dark:text-white mt-0.5">$60.00</div>
                      </div>
                    </div>
                  </div>
                  <div className="border-b border-[#E2E8F0] dark:border-white/10"></div>
                </>
              )}
            </div>

            {/* 4. Pharmacy Accordion & Items */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between py-[12px] px-[24px] bg-[#F1F5F9]/50 dark:bg-white/5">
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
                <button className="text-[12px] font-bold text-[#2E37A4] hover:text-[#2E37A4]/80 transition-colors">
                  + Add Ward
                </button>
              </div>
              <div className="border-b border-[#E2E8F0] dark:border-white/10"></div>

              {expanded.pharmacy && (
                <>
                  {/* Row 1 */}
                  {/* Row 1 */}
                  {/* Desktop Layout */}
                  <div className="hidden md:grid grid-cols-12 gap-4 items-center py-3.5 px-6">
                    <div className="col-span-5 text-[14px] font-medium text-[#1e293b] dark:text-white">Paracetamol 500mg (10 tabs)</div>
                    <div className="col-span-2 text-[14px] text-gray-500 dark:text-slate-400">Medicine</div>
                    <div className="col-span-1 text-[14px] text-center text-[#1e293b] dark:text-white">2</div>
                    <div className="col-span-2 text-[14px] font-medium text-right text-gray-500 dark:text-slate-400">$5.00</div>
                    <div className="col-span-1 text-[14px] font-bold text-right text-[#1e293b] dark:text-white">$10.00</div>
                    <div className="col-span-1 text-right">
                      <span className="inline-block px-2 py-0.5 text-[10px] font-semibold text-gray-500 dark:text-slate-400 bg-[#F1F5F9] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[4px]">
                        Pharmacy
                      </span>
                    </div>
                  </div>
                  {/* Mobile Layout */}
                  <div className="flex flex-col md:hidden py-4 px-6 space-y-3.5">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <div className="text-[14px] font-semibold text-[#1e293b] dark:text-white">Paracetamol 500mg (10 tabs)</div>
                        <div className="text-[12px] text-gray-500 dark:text-slate-400 mt-0.5">Medicine</div>
                      </div>
                      <span className="shrink-0 inline-block px-2 py-0.5 text-[10px] font-semibold text-gray-500 dark:text-slate-400 bg-[#F1F5F9] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[4px]">
                        Pharmacy
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 bg-[#F8FAFC] dark:bg-white/5 p-3 rounded-[6px] text-center">
                      <div>
                        <div className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider">Qty</div>
                        <div className="text-[13px] font-medium text-[#1e293b] dark:text-white mt-0.5">2</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider">Price</div>
                        <div className="text-[13px] font-medium text-gray-500 dark:text-slate-400 mt-0.5">$5.00</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider">Total</div>
                        <div className="text-[13px] font-bold text-[#1e293b] dark:text-white mt-0.5">$10.00</div>
                      </div>
                    </div>
                  </div>
                  <div className="border-b border-[#E2E8F0] dark:border-white/10"></div>

                  {/* Row 2 */}
                  {/* Desktop Layout */}
                  <div className="hidden md:grid grid-cols-12 gap-4 items-center py-3.5 px-6">
                    <div className="col-span-5 text-[14px] font-medium text-[#1e293b] dark:text-white">Amoxicillin 250mg (Strip)</div>
                    <div className="col-span-2 text-[14px] text-gray-500 dark:text-slate-400">Medicine</div>
                    <div className="col-span-1 text-[14px] text-center text-[#1e293b] dark:text-white">1</div>
                    <div className="col-span-2 text-[14px] font-medium text-right text-gray-500 dark:text-slate-400">$12.00</div>
                    <div className="col-span-1 text-[14px] font-bold text-right text-[#1e293b] dark:text-white">$12.00</div>
                    <div className="col-span-1 text-right">
                      <span className="inline-block px-2 py-0.5 text-[10px] font-semibold text-gray-500 dark:text-slate-400 bg-[#F1F5F9] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[4px]">
                        Pharmacy
                      </span>
                    </div>
                  </div>
                  {/* Mobile Layout */}
                  <div className="flex flex-col md:hidden py-4 px-6 space-y-3.5">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <div className="text-[14px] font-semibold text-[#1e293b] dark:text-white">Amoxicillin 250mg (Strip)</div>
                        <div className="text-[12px] text-gray-500 dark:text-slate-400 mt-0.5">Medicine</div>
                      </div>
                      <span className="shrink-0 inline-block px-2 py-0.5 text-[10px] font-semibold text-gray-500 dark:text-slate-400 bg-[#F1F5F9] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[4px]">
                        Pharmacy
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 bg-[#F8FAFC] dark:bg-white/5 p-3 rounded-[6px] text-center">
                      <div>
                        <div className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider">Qty</div>
                        <div className="text-[13px] font-medium text-[#1e293b] dark:text-white mt-0.5">1</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider">Price</div>
                        <div className="text-[13px] font-medium text-gray-500 dark:text-slate-400 mt-0.5">$12.00</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider">Total</div>
                        <div className="text-[13px] font-bold text-[#1e293b] dark:text-white mt-0.5">$12.00</div>
                      </div>
                    </div>
                  </div>
                  <div className="border-b border-[#E2E8F0] dark:border-white/10"></div>
                </>
              )}
            </div>
          </div>

        {/* Footer totals */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-end gap-4 sm:gap-6 py-4 px-6 bg-[#F8FAFC] dark:bg-white/5 border-t border-[#E2E8F0] dark:border-white/10 rounded-b-[8px] text-[14px]">
          <span className="text-gray-500 dark:text-gray-400 font-medium">
            Total Items: <strong className="text-[#1e293b] dark:text-white font-semibold">7</strong>
          </span>
          <span className="text-gray-500 dark:text-gray-400 font-medium">
            Subtotal: <strong className="text-[#2E37A4] dark:text-blue-400 font-bold text-[16px]">$677.00</strong>
          </span>
        </div>
      </div>

      {/* Right Section - Gross Total Summary (col-span 4) */}
      <div className="lg:col-span-4 bg-white dark:bg-[#101935] border border-[#E2E8F0] dark:border-white/10 rounded-[8px] pt-6 pb-6 px-0 h-fit font-inter">
        {/* Gross Total Header */}
        <div className="space-y-1 pb-4 px-6">
          <span className="text-[14px] font-bold text-[#64748B] dark:text-slate-400 uppercase tracking-wider">GROSS TOTAL</span>
          <h2 className="text-[28px] font-extrabold text-[#1e293b] dark:text-white">₹677.00</h2>
        </div>
        <div className="border-b border-[#E2E8F0] dark:border-white/10"></div>

        {/* Calculation Details */}
        <div className="py-4 px-6">
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

          <div className="border-b border-[#E2E8F0] dark:border-white/10 my-3.5"></div>

          <div className="flex items-center justify-between text-[14px] font-bold text-[#1e293b] dark:text-white">
            <span>Net Payable</span>
            <span>₹243.15</span>
          </div>
        </div>
        <div className="border-b border-[#E2E8F0] dark:border-white/10"></div>

        <div className="py-4 px-6 space-y-3.5">
          <div className="flex items-center justify-between text-[14px]">
            <span className="text-gray-500 dark:text-slate-400 font-medium">Advance Paid</span>
            <span className="text-gray-500 dark:text-slate-400 font-bold">-₹100.00</span>
          </div>

          <div className="flex items-center justify-between text-[14px] font-bold text-[#1e293b] dark:text-white">
            <span>Balance Due</span>
            <span className="text-[#DF8F2A] text-[18px] font-bold">₹143.15</span>
          </div>
        </div>
        <div className="border-b border-[#E2E8F0] dark:border-white/10"></div>

        {/* Progress Bar / Billing Health */}
        <div className="py-4 px-6 space-y-3">
          <div className="flex items-center justify-between text-[12px] font-bold">
            <span className="text-gray-400">Billing Health</span>
            <span className="text-[#DF8F2A]">Low Advance</span>
          </div>

          {/* Progress track */}
          <div className="w-full bg-[#FFE2C2]/50 dark:bg-amber-950/40 rounded-full h-1.5 overflow-hidden">
            <div className="bg-[#DF8F2A] h-full rounded-full" style={{ width: "40%" }}></div>
          </div>

          <div className="flex items-start gap-1.5 text-[11px] text-gray-500 dark:text-slate-400 leading-normal">
            <svg className="w-3.5 h-3.5 text-[#DF8F2A] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" />
            </svg>
            <span>Advance is less than 50% of the net payable amount.</span>
          </div>
        </div>
        <div className="border-b border-[#E2E8F0] dark:border-white/10"></div>

        {/* Action Buttons */}
        <div className="py-4 px-6 space-y-3">
          <button className="w-full h-11 bg-[#2E37A4] hover:bg-[#2E37A4]/90 text-white font-semibold rounded-[6px] text-[13px] flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <path d="M2 10h20" />
            </svg>
            Collect Payment
          </button>

          <button className="w-full h-11 bg-[#F1F5F9] hover:bg-[#F1F5F9]/80 text-[#1e293b] font-semibold rounded-[6px] text-[13px] flex items-center justify-center gap-2 transition-all cursor-pointer border border-[#E2E8F0]">
            <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
            </svg>
            Generate Interim Bill
          </button>

          <button className="w-full h-11 bg-[#E2E8F0] hover:bg-[#E2E8F0]/80 text-[#64748B`] font-medium rounded-[6px] text-[13px] flex items-center justify-center gap-2 transition-all cursor-pointer border border-[#CBD5E1]">
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
