"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Hospital, Plus, CreditCard, X, ChevronDown, Smartphone, Wallet, Building2, Landmark, Layers } from "lucide-react";

export function OPDBillingDetailsMain({ searchParams }) {
  const [showCollectPayment, setShowCollectPayment] = useState(false);
  const [showInitiateDischarge, setShowInitiateDischarge] = useState(false);
  const [showInvoiceView, setShowInvoiceView] = useState(false);
  const [showDischargeComplete, setShowDischargeComplete] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowCollectPayment(false);
        setShowInitiateDischarge(false);
        setShowDischargeComplete(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (showInvoiceView) {
    return <InvoiceGeneratedPage searchParams={searchParams} onClose={() => setShowInvoiceView(false)} />;
  }
  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto space-y-6 font-inter">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-[24px] font-bold text-[#1e293b] dark:text-white tracking-tight">Patient Billing Details</h1>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowInitiateDischarge(true)}
              className="h-10 px-4 bg-white hover:bg-gray-50 dark:bg-white/5 border border-[#2E37A4] text-[#2E37A4] dark:text-blue-400 font-bold rounded-[6px] text-[13px] transition-all cursor-pointer flex items-center gap-2"
            >
              <Hospital className="w-4 h-4 text-[#2E37A4] dark:text-blue-400" />
              Initiate Discharge
            </button>
            <Link href="/finance/patient-billing/create" className="h-10 px-4 bg-white hover:bg-gray-50 dark:bg-white/5 border border-[#CBD5E1] dark:border-white/10 text-[#1e293b] dark:text-white font-bold rounded-[6px] text-[13px] transition-all cursor-pointer flex items-center gap-2 shadow-none">
              <Plus className="w-4 h-4 text-[#1e293b] dark:text-white" />
              Add Charge
            </Link>
            <button onClick={() => setShowCollectPayment(true)} className="h-10 px-5 bg-[#2E37A4] hover:bg-[#2E37A4]/90 text-white font-bold rounded-[6px] text-[13px] transition-all cursor-pointer shadow-sm flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-white" />
              Collect Payment
            </button>
          </div>
        </div>
      </div>

      {/* Patient Billing Details Info Card Banner */}
      <div className="bg-card border border-border rounded-lg p-4 sm:p-6 shadow-none">
        <div className="flex flex-col lg:flex-row items-stretch justify-between gap-8">

          {/* Left Block - Patient Photo & Info */}
          <div className="flex-1 flex gap-5">
            {/* Circular Patient Photo / Avatar */}
            <div className="w-[72px] h-[72px] rounded-full overflow-hidden border border-[#E2E8F0] dark:border-white/10 flex-shrink-0 bg-gray-50 flex items-center justify-center">
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
            <div className="flex-1">
              <div>
                <h3 className="text-[20px] font-bold text-[#1e293b] dark:text-white flex items-baseline gap-2">
                  {searchParams?.patient || "James Wilson"}
                  <span className="text-[13px] font-medium text-gray-400 dark:text-slate-400">62 yrs • Male</span>
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6 mt-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider block">UHID</span>
                  <span className="text-[13px] font-bold text-[#1e293b] dark:text-white block">{searchParams?.uhid || "UHID-839211"}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider block">Bed No.</span>
                  <span className="text-[13px] font-bold text-[#1e293b] dark:text-white block">{searchParams?.room || "ICU-04"}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider block">Admission Date</span>
                  <span className="text-[13px] font-bold text-[#1e293b] dark:text-white block">12 Oct 2023</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider block">Attending Doctor</span>
                  <span className="text-[13px] font-bold text-[#1e293b] dark:text-white block">Dr. Sarah Jenkins</span>
                </div>

                <div className="space-y-1 col-span-2">
                  <span className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider block">Diagnosis</span>
                  <span className="text-[13px] font-bold text-[#1e293b] dark:text-white block">Acute Myocardial Infarction</span>
                </div>
              </div>
            </div>
          </div>

          {/* Vertical Separator for LG screens */}
          <div className="hidden lg:block w-[1px] border-l border-[#E2E8F0] dark:border-white/10 self-stretch my-2"></div>

          {/* Right Block - Insurance Details */}
          <div className="flex-1 lg:pl-8">
            <div className="flex items-center gap-2">
              <h4 className="text-[18px] font-bold text-[#1e293b] dark:text-white">Insurance Details</h4>
              <span className="px-2 py-0.5 text-[9px] font-bold tracking-wider text-[#218F40] bg-[#1B6D24]/20 border border-[#1B6D24] dark:bg-green-500/10 dark:border-green-500/20 rounded-[12px] uppercase">
                Active
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6 mt-[22px]">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider block">Insurance Name</span>
                <span className="text-[13px] font-bold text-[#1e293b] dark:text-white block">BlueCross</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider block">Provider</span>
                <span className="text-[13px] font-bold text-[#1e293b] dark:text-white block">BlueCross BlueShield</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider block">Policy No.</span>
                <span className="text-[13px] font-bold text-[#1e293b] dark:text-white block">POL-98234-AX</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider block">Status</span>
                <div className="pt-0.5">
                  <span className="inline-block px-2 py-0.5 text-[10px] font-semibold text-[#10B981] bg-[#10B9811A]  dark:bg-green-500/10 dark:border-green-500/20 rounded-[33554400px]">
                    Approved
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Interactive Split Layout: Charges on left, Gross Total on right */}
      <OPDBillingChargesSection
        searchParams={searchParams}
        showCollectPayment={showCollectPayment}
        setShowCollectPayment={setShowCollectPayment}
        setShowInvoiceView={setShowInvoiceView}
        showInitiateDischarge={showInitiateDischarge}
        setShowInitiateDischarge={setShowInitiateDischarge}
        showDischargeComplete={showDischargeComplete}
        setShowDischargeComplete={setShowDischargeComplete}
      />

      {/* Discharge Complete Modal Popup Overlay */}
      {showDischargeComplete && (
        <div
          onClick={() => setShowDischargeComplete(false)}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/35 backdrop-blur-[1px] p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-[#101935] rounded-[12px] shadow-2xl p-12 max-w-[850px] w-full text-center border border-[#E2E8F0] dark:border-white/10 relative cursor-default"
          >
            <button
              onClick={() => setShowDischargeComplete(false)}
              className="absolute top-4 right-4 p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-all cursor-pointer"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>

            {/* Checkmark Icon Container */}
            <div className="w-14 h-14 rounded-full bg-[#E8F8EE] dark:bg-emerald-500/10 flex items-center justify-center mx-auto text-[#218F40] dark:text-emerald-400">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            {/* Title */}
            <h2 className="text-[18px] font-bold text-[#1E293B] dark:text-white mt-4">Discharge Complete</h2>

            {/* Subtitle */}
            <p className="text-[13px] text-gray-500 dark:text-slate-400 max-w-[550px] mx-auto mt-2 leading-relaxed font-medium">
              All dues are cleared and the final bill is locked. The patient has been successfully discharged.
            </p>

            {/* Box: Final Amount Paid */}
            <div className="border border-[#E2E8F0] dark:border-white/10 rounded-[6px] py-2 px-6 bg-[#F8FAFC]/50 dark:bg-white/5 inline-block mx-auto mt-5 text-center shadow-sm">
              <span className="text-[9px] font-bold tracking-wider text-gray-400 dark:text-slate-500 uppercase block">FINAL AMOUNT PAID</span>
              <span className="text-[15px] font-extrabold text-[#218F40] dark:text-green-400 mt-0.5 block">₹5,500.00</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} function OPDBillingChargesSection({
  searchParams,
  showCollectPayment,
  setShowCollectPayment,
  setShowInvoiceView,
  showInitiateDischarge,
  setShowInitiateDischarge,
  showDischargeComplete,
  setShowDischargeComplete,
}) {
  const handleConfirmPayment = () => {
    setShowCollectPayment(false);
    setShowDischargeComplete(true);
  };

  const [expanded, setExpanded] = useState({
    room: true,
    doctor: true,
    lab: true,
    pharmacy: true,
  });
  const [partialPayment, setPartialPayment] = useState(true);
  const [payAmount, setPayAmount] = useState("₹100.00");
  const [selectedMethod, setSelectedMethod] = useState("card");

  const [wards, setWards] = useState([
    {
      wardName: "General Ward (Oct 12 -Oct 14)",
      category: "Accommodation",
      qty: "2",
      price: "₹150.00",
      total: "₹300.00",
      isSystem: true,
      source: "System",
    },
  ]);
  const [doctors, setDoctors] = useState([
    { name: "Initial Consultation", category: "Consultation", qty: "1", price: "₹100.00", total: "₹100.00", isSystem: true, source: "IPD" },
    { name: "Follow-up Visit", category: "Consultation", qty: "2", price: "₹75.00", total: "₹150.00", isSystem: true, source: "IPD" }
  ]);
  const [labs, setLabs] = useState([
    { name: "Complete Blood Count (CBC)", category: "Pathology", qty: "1", price: "₹45.00", total: "₹45.00", isSystem: true, source: "Lab" },
    { name: "Lipid Profile", category: "Pathology", qty: "1", price: "₹60.00", total: "₹60.00", isSystem: true, source: "Lab" }
  ]);
  const [pharmacy, setPharmacy] = useState([
    { name: "Paracetamol 500mg (10 tabs)", category: "Medicine", qty: "2", price: "₹5.00", total: "₹10.00", isSystem: true, source: "Pharmacy" },
    { name: "Amoxicillin 250mg (Strip)", category: "Medicine", qty: "1", price: "₹12.00", total: "₹12.00", isSystem: true, source: "Pharmacy" }
  ]);

  const toggle = (sec) => setExpanded((prev) => ({ ...prev, [sec]: !prev[sec] }));

  // Dynamic Handlers for Add, Remove, and Update
  const addWardRow = () => {
    setWards(prev => [...prev, { wardName: "", category: "", qty: "", price: "", total: "" }]);
  };
  const removeWardRow = (index) => {
    setWards(prev => prev.filter((_, i) => i !== index));
  };
  const updateWardRow = (index, field, value) => {
    setWards(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addDoctorRow = () => {
    setDoctors(prev => [...prev, { name: "", category: "", qty: "", price: "", total: "", isSystem: false }]);
  };
  const removeDoctorRow = (index) => {
    setDoctors(prev => prev.filter((_, i) => i !== index));
  };
  const updateDoctorRow = (index, field, value) => {
    setDoctors(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addLabRow = () => {
    setLabs(prev => [...prev, { name: "", category: "", qty: "", price: "", total: "", isSystem: false }]);
  };
  const removeLabRow = (index) => {
    setLabs(prev => prev.filter((_, i) => i !== index));
  };
  const updateLabRow = (index, field, value) => {
    setLabs(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addPharmacyRow = () => {
    setPharmacy(prev => [...prev, { name: "", category: "", qty: "", price: "", total: "", isSystem: false }]);
  };
  const removePharmacyRow = (index) => {
    setPharmacy(prev => prev.filter((_, i) => i !== index));
  };
  const updatePharmacyRow = (index, field, value) => {
    setPharmacy(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  // Safe numerical parser to support dynamic addition total logic
  const parseVal = (str) => {
    if (!str) return 0;
    const num = parseFloat(String(str).replace(/[^\d.]/g, ''));
    return isNaN(num) ? 0 : num;
  };

  const getRowTotal = (item) => {
    let qtyStr = item.qty;
    let priceStr = item.price;
    let totalStr = item.total;

    if (qtyStr === "WD-ERS-01") qtyStr = "2";
    if (priceStr === "WD-ERS-01") priceStr = "150.00";
    if (totalStr === "WD-ERS-01") totalStr = "300.00";

    const qty = parseVal(qtyStr);
    const price = parseVal(priceStr);
    const totalVal = totalStr ? parseVal(totalStr) : (qty * price);

    return totalVal > 0 ? totalVal : (qty * price);
  };

  const calculateSectionTotal = (list) => {
    return list.reduce((sum, item) => sum + getRowTotal(item), 0);
  };

  const roomTotal = calculateSectionTotal(wards);
  const doctorTotal = calculateSectionTotal(doctors);
  const labTotal = calculateSectionTotal(labs);
  const pharmacyTotal = calculateSectionTotal(pharmacy);

  const subtotal = roomTotal + doctorTotal + labTotal + pharmacyTotal;
  const totalItems = wards.length + doctors.length + labs.length + pharmacy.length;

  const firstEditableWardIdx = wards.findIndex(item => !item.isSystem);
  const firstEditableDoctorIdx = doctors.findIndex(item => !item.isSystem);
  const firstEditableLabIdx = labs.findIndex(item => !item.isSystem);
  const firstEditablePharmacyIdx = pharmacy.findIndex(item => !item.isSystem);

  const discountsVal = subtotal * 0.05;
  const insuranceVal = 400.00;
  const netPayableVal = Math.max(0, subtotal - discountsVal - insuranceVal);
  const advanceVal = 100.00;
  const balanceDueVal = netPayableVal - advanceVal;

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
            <div className="grid grid-cols-12 gap-4 text-[12px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider py-3 px-6 bg-muted/30 border-b border-border">
              <div className="col-span-5">Service Name</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-1 text-center">Qty</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-1 text-center">Total</div>
              <div className="col-span-1 text-right">Source</div>
            </div>

            {/* 1. Room Charges Accordion & Items */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between py-[12px] px-[24px] bg-[#F8FAFC]/50 dark:bg-white/5">
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
                <div className="py-4 space-y-4">
                  {wards.map((item, index) => {
                    if (item.isSystem) {
                      return (
                        <div key={index} className="grid grid-cols-12 gap-4 items-center py-3.5 px-6 border-b border-[#E2E8F0] dark:border-white/10 last:border-0">
                          <div className="col-span-5 text-[14px] font-medium text-[#1e293b] dark:text-white">{item.wardName}</div>
                          <div className="col-span-2 text-[14px] text-gray-500 dark:text-slate-400">{item.category}</div>
                          <div className="col-span-1 text-[14px] text-center text-[#1e293b] dark:text-white">{item.qty}</div>
                          <div className="col-span-2 text-[14px] font-medium text-center text-gray-500 dark:text-slate-400">{item.price}</div>
                          <div className="col-span-1 text-[14px] font-bold text-center text-[#1e293b] dark:text-white">{item.total}</div>
                          <div className="col-span-1 text-right">
                            <span className="inline-block px-2 py-0.5 text-[10px] font-semibold text-[#64748B] dark:text-slate-400 bg-[#F1F5F9] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[33554400px]">
                              {item.source}
                            </span>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={index} className="flex items-end w-full py-2 px-6">
                        <div className="grid grid-cols-6 gap-4 flex-1 items-end">
                          {/* Ward Name textarea */}
                          <div className="space-y-1">
                            {index === firstEditableWardIdx && (
                              <label className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider block">
                                Ward Name
                              </label>
                            )}
                            <textarea
                              value={item.wardName}
                              onChange={(e) => updateWardRow(index, "wardName", e.target.value)}
                              placeholder="General Ward"
                              rows={2}
                              className="w-full h-[46px] px-3 py-1.5 bg-white dark:bg-white/5 border border-[#E2E8F0] dark:border-white/10 rounded-[8px] text-[13px] font-medium text-[#1e293b] dark:text-white focus:outline-none resize-none overflow-y-hidden leading-[1.2] whitespace-normal break-words"
                            />
                          </div>

                          {/* Category */}
                          <div className="space-y-1">
                            {index === firstEditableWardIdx && (
                              <label className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider block">
                                Category
                              </label>
                            )}
                            <textarea
                              value={item.category}
                              onChange={(e) => updateWardRow(index, "category", e.target.value)}
                              placeholder="Category"
                              rows={2}
                              className="w-full h-[46px] px-3 py-1.5 bg-white dark:bg-white/5 border border-[#E2E8F0] dark:border-white/10 rounded-[8px] text-[13px] font-medium text-[#1e293b] dark:text-white focus:outline-none resize-none overflow-y-hidden leading-[1.2] whitespace-normal break-words"
                            />
                          </div>

                          {/* Qty */}
                          <div className="space-y-1">
                            {index === firstEditableWardIdx && (
                              <label className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider block text-center">
                                Qty
                              </label>
                            )}
                            <input
                              type="text"
                              value={item.qty}
                              onChange={(e) => updateWardRow(index, "qty", e.target.value)}
                              placeholder="Qty"
                              className="w-full h-[46px] px-2 text-center bg-white dark:bg-white/5 border border-[#E2E8F0] dark:border-white/10 rounded-[8px] text-[13px] font-medium text-[#1e293b] dark:text-white focus:outline-none"
                            />
                          </div>

                          {/* Price */}
                          <div className="space-y-1">
                            {index === firstEditableWardIdx && (
                              <label className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider block text-center">
                                Price
                              </label>
                            )}
                            <input
                              type="text"
                              value={item.price}
                              onChange={(e) => updateWardRow(index, "price", e.target.value)}
                              placeholder="Price"
                              className="w-full h-[46px] px-3 text-center bg-white dark:bg-white/5 border border-[#E2E8F0] dark:border-white/10 rounded-[8px] text-[13px] font-medium text-[#1e293b] dark:text-white focus:outline-none"
                            />
                          </div>

                          {/* Total */}
                          <div className="space-y-1">
                            {index === firstEditableWardIdx && (
                              <label className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider block text-center">
                                Total
                              </label>
                            )}
                            <input
                              type="text"
                              value={item.total}
                              onChange={(e) => updateWardRow(index, "total", e.target.value)}
                              placeholder="Total"
                              className="w-full h-[46px] px-2 text-center bg-white dark:bg-white/5 border border-[#E2E8F0] dark:border-white/10 rounded-[8px] text-[13px] font-medium text-[#1e293b] dark:text-white focus:outline-none"
                            />
                          </div>

                          {/* Source */}
                          <div className="space-y-1 flex justify-center items-center h-[46px]">
                            {index === firstEditableWardIdx && (
                              <label className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider block opacity-0 select-none absolute -top-5">
                                Source
                              </label>
                            )}
                            <span className="inline-block px-2 py-0.5 text-[10px] font-semibold text-gray-500 dark:text-slate-400 bg-[#F1F5F9] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[4px]">
                              OPD
                            </span>
                          </div>
                        </div>

                        {/* Remove Action Button */}
                        <div className="w-[40px] flex justify-center items-center h-[46px] ml-4">
                          {index === firstEditableWardIdx && (
                            <label className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider block opacity-0 select-none absolute -top-5">
                              Remove
                            </label>
                          )}
                          <button
                            onClick={() => removeWardRow(index)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-[6px] transition-all cursor-pointer flex items-center justify-center"
                            title="Remove item"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="border-b border-[#E2E8F0] dark:border-white/10"></div>
            </div>

            {/* 2. Doctor Visits Accordion & Items */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between py-[12px] px-[24px] bg-[#F8FAFC]/50 dark:bg-white/5">
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
                <div className="flex flex-col py-2">
                  {doctors.map((item, index) => {
                    if (item.isSystem) {
                      return (
                        <div key={index} className="grid grid-cols-12 gap-4 items-center py-3.5 px-6 border-b border-[#E2E8F0] dark:border-white/10 last:border-0">
                          <div className="col-span-5 text-[14px] font-medium text-[#1e293b] dark:text-white">{item.name}</div>
                          <div className="col-span-2 text-[14px] text-gray-500 dark:text-slate-400">{item.category}</div>
                          <div className="col-span-1 text-[14px] text-center text-[#1e293b] dark:text-white">{item.qty}</div>
                          <div className="col-span-2 text-[14px] font-medium text-center text-gray-500 dark:text-slate-400">{item.price}</div>
                          <div className="col-span-1 text-[14px] font-bold text-center text-[#1e293b] dark:text-white">{item.total}</div>
                          <div className="col-span-1 text-right">
                            <span className="inline-block px-2 py-0.5 text-[10px] font-semibold text-[#64748B] dark:text-slate-400 bg-[#F1F5F9] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[33554400px]">
                              {item.source}
                            </span>
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div key={index} className="flex items-end w-full py-3 px-6 border-b border-[#E2E8F0] dark:border-white/10 last:border-0">
                          <div className="grid grid-cols-6 gap-4 flex-1 items-end">
                            {/* Doctor Visit Name textarea */}
                            <div className="space-y-1">
                              {index === firstEditableDoctorIdx && (
                                <label className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider block">
                                  Doctor Visit Name
                                </label>
                              )}
                              <textarea
                                value={item.name}
                                onChange={(e) => updateDoctorRow(index, "name", e.target.value)}
                                placeholder="Initial Consultation"
                                rows={2}
                                className="w-full h-[46px] px-3 py-1.5 bg-white dark:bg-white/5 border border-[#E2E8F0] dark:border-white/10 rounded-[8px] text-[13px] font-medium text-[#1e293b] dark:text-white focus:outline-none resize-none overflow-y-hidden leading-[1.2] whitespace-normal break-words"
                              />
                            </div>
                            {/* Category */}
                            <div className="space-y-1">
                              {index === firstEditableDoctorIdx && (
                                <label className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider block">
                                  Category
                                </label>
                              )}
                              <textarea
                                value={item.category}
                                onChange={(e) => updateDoctorRow(index, "category", e.target.value)}
                                placeholder="Category"
                                rows={2}
                                className="w-full h-[46px] px-3 py-1.5 bg-white dark:bg-white/5 border border-[#E2E8F0] dark:border-white/10 rounded-[8px] text-[13px] font-medium text-[#1e293b] dark:text-white focus:outline-none resize-none overflow-y-hidden leading-[1.2] whitespace-normal break-words"
                              />
                            </div>
                            {/* Qty */}
                            <div className="space-y-1">
                              {index === firstEditableDoctorIdx && (
                                <label className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider block text-center">
                                  Qty
                                </label>
                              )}
                              <input
                                type="text"
                                value={item.qty}
                                onChange={(e) => updateDoctorRow(index, "qty", e.target.value)}
                                placeholder="Qty"
                                className="w-full h-[46px] px-2 text-center bg-white dark:bg-white/5 border border-[#E2E8F0] dark:border-white/10 rounded-[8px] text-[13px] font-medium text-[#1e293b] dark:text-white focus:outline-none"
                              />
                            </div>
                            {/* Price */}
                            <div className="space-y-1">
                              {index === firstEditableDoctorIdx && (
                                <label className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider block text-center">
                                  Price
                                </label>
                              )}
                              <input
                                type="text"
                                value={item.price}
                                onChange={(e) => updateDoctorRow(index, "price", e.target.value)}
                                placeholder="Price"
                                className="w-full h-[46px] px-3 text-center bg-white dark:bg-white/5 border border-[#E2E8F0] dark:border-white/10 rounded-[8px] text-[13px] font-medium text-[#1e293b] dark:text-white focus:outline-none"
                              />
                            </div>
                            {/* Total */}
                            <div className="space-y-1">
                              {index === firstEditableDoctorIdx && (
                                <label className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider block text-center">
                                  Total
                                </label>
                              )}
                              <input
                                type="text"
                                value={item.total}
                                onChange={(e) => updateDoctorRow(index, "total", e.target.value)}
                                placeholder="Total"
                                className="w-full h-[46px] px-2 text-center bg-white dark:bg-white/5 border border-[#E2E8F0] dark:border-white/10 rounded-[8px] text-[13px] font-medium text-[#1e293b] dark:text-white focus:outline-none"
                              />
                            </div>

                            {/* Source */}
                            <div className="space-y-1 flex justify-center items-center h-[46px]">
                              {index === firstEditableDoctorIdx && (
                                <label className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider block opacity-0 select-none absolute -top-5">
                                  Source
                                </label>
                              )}
                              <span className="inline-block px-2 py-0.5 text-[10px] font-semibold text-gray-500 dark:text-slate-400 bg-[#F1F5F9] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[4px]">
                                OPD
                              </span>
                            </div>
                          </div>

                          {/* Remove Action Button */}
                          <div className="w-[40px] flex justify-center items-center h-[46px] ml-4">
                            {index === firstEditableDoctorIdx && (
                              <label className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider block opacity-0 select-none absolute -top-5">
                                Remove
                              </label>
                            )}
                            <button
                              onClick={() => removeDoctorRow(index)}
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-[6px] transition-all cursor-pointer flex items-center justify-center"
                              title="Remove item"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              )}
              <div className="border-b border-[#E2E8F0] dark:border-white/10"></div>
            </div>

            {/* 3. Lab Tests Accordion & Items */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between py-[12px] px-[24px] bg-[#F8FAFC]/50 dark:bg-white/5">
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
                <div className="flex flex-col py-2">
                  {labs.map((item, index) => {
                    if (item.isSystem) {
                      return (
                        <div key={index} className="grid grid-cols-12 gap-4 items-center py-3.5 px-6 border-b border-[#E2E8F0] dark:border-white/10 last:border-0">
                          <div className="col-span-5 text-[14px] font-medium text-[#1e293b] dark:text-white">{item.name}</div>
                          <div className="col-span-2 text-[14px] text-gray-500 dark:text-slate-400">{item.category}</div>
                          <div className="col-span-1 text-[14px] text-center text-[#1e293b] dark:text-white">{item.qty}</div>
                          <div className="col-span-2 text-[14px] font-medium text-center text-gray-500 dark:text-slate-400">{item.price}</div>
                          <div className="col-span-1 text-[14px] font-bold text-center text-[#1e293b] dark:text-white">{item.total}</div>
                          <div className="col-span-1 text-right">
                            <span className="inline-block px-2 py-0.5 text-[10px] font-semibold text-[#64748B] dark:text-slate-400 bg-[#F1F5F9] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[33554400px]">
                              {item.source}
                            </span>
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div key={index} className="flex items-end w-full py-3 px-6 border-b border-[#E2E8F0] dark:border-white/10 last:border-0">
                          <div className="grid grid-cols-6 gap-4 flex-1 items-end">
                            {/* Test Name textarea */}
                            <div className="space-y-1">
                              {index === firstEditableLabIdx && (
                                <label className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider block">
                                  Test Name
                                </label>
                              )}
                              <textarea
                                value={item.name}
                                onChange={(e) => updateLabRow(index, "name", e.target.value)}
                                placeholder="Complete Blood Count"
                                rows={2}
                                className="w-full h-[46px] px-3 py-1.5 bg-white dark:bg-white/5 border border-[#E2E8F0] dark:border-white/10 rounded-[8px] text-[13px] font-medium text-[#1e293b] dark:text-white focus:outline-none resize-none overflow-y-hidden leading-[1.2] whitespace-normal break-words"
                              />
                            </div>
                            {/* Category */}
                            <div className="space-y-1">
                              {index === firstEditableLabIdx && (
                                <label className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider block">
                                  Category
                                </label>
                              )}
                              <textarea
                                value={item.category}
                                onChange={(e) => updateLabRow(index, "category", e.target.value)}
                                placeholder="Category"
                                rows={2}
                                className="w-full h-[46px] px-3 py-1.5 bg-white dark:bg-white/5 border border-[#E2E8F0] dark:border-white/10 rounded-[8px] text-[13px] font-medium text-[#1e293b] dark:text-white focus:outline-none resize-none overflow-y-hidden leading-[1.2] whitespace-normal break-words"
                              />
                            </div>
                            {/* Qty */}
                            <div className="space-y-1">
                              {index === firstEditableLabIdx && (
                                <label className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider block text-center">
                                  Qty
                                </label>
                              )}
                              <input
                                type="text"
                                value={item.qty}
                                onChange={(e) => updateLabRow(index, "qty", e.target.value)}
                                placeholder="Qty"
                                className="w-full h-[46px] px-2 text-center bg-white dark:bg-white/5 border border-[#E2E8F0] dark:border-white/10 rounded-[8px] text-[13px] font-medium text-[#1e293b] dark:text-white focus:outline-none"
                              />
                            </div>
                            {/* Price */}
                            <div className="space-y-1">
                              {index === firstEditableLabIdx && (
                                <label className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider block text-center">
                                  Price
                                </label>
                              )}
                              <input
                                type="text"
                                value={item.price}
                                onChange={(e) => updateLabRow(index, "price", e.target.value)}
                                placeholder="Price"
                                className="w-full h-[46px] px-3 text-center bg-white dark:bg-white/5 border border-[#E2E8F0] dark:border-white/10 rounded-[8px] text-[13px] font-medium text-[#1e293b] dark:text-white focus:outline-none"
                              />
                            </div>
                            {/* Total */}
                            <div className="space-y-1">
                              {index === firstEditableLabIdx && (
                                <label className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider block text-center">
                                  Total
                                </label>
                              )}
                              <input
                                type="text"
                                value={item.total}
                                onChange={(e) => updateLabRow(index, "total", e.target.value)}
                                placeholder="Total"
                                className="w-full h-[46px] px-2 text-center bg-white dark:bg-white/5 border border-[#E2E8F0] dark:border-white/10 rounded-[8px] text-[13px] font-medium text-[#1e293b] dark:text-white focus:outline-none"
                              />
                            </div>

                            {/* Source */}
                            <div className="space-y-1 flex justify-center items-center h-[46px]">
                              {index === firstEditableLabIdx && (
                                <label className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider block opacity-0 select-none absolute -top-5">
                                  Source
                                </label>
                              )}
                              <span className="inline-block px-2 py-0.5 text-[10px] font-semibold text-gray-500 dark:text-slate-400 bg-[#F1F5F9] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[4px]">
                                OPD
                              </span>
                            </div>
                          </div>

                          {/* Remove Action Button */}
                          <div className="w-[40px] flex justify-center items-center h-[46px] ml-4">
                            {index === firstEditableLabIdx && (
                              <label className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider block opacity-0 select-none absolute -top-5">
                                Remove
                              </label>
                            )}
                            <button
                              onClick={() => removeLabRow(index)}
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-[6px] transition-all cursor-pointer flex items-center justify-center"
                              title="Remove item"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              )}
              <div className="border-b border-[#E2E8F0] dark:border-white/10"></div>
            </div>

            {/* 4. Pharmacy Accordion & Items */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between py-[12px] px-[24px] bg-[#F8FAFC]/50 dark:bg-white/5">
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
                <div className="flex flex-col py-2">
                  {pharmacy.map((item, index) => {
                    if (item.isSystem) {
                      return (
                        <div key={index} className="grid grid-cols-12 gap-4 items-center py-3.5 px-6 border-b border-[#E2E8F0] dark:border-white/10 last:border-0">
                          <div className="col-span-5 text-[14px] font-medium text-[#1e293b] dark:text-white">{item.name}</div>
                          <div className="col-span-2 text-[14px] text-gray-500 dark:text-slate-400">{item.category}</div>
                          <div className="col-span-1 text-[14px] text-center text-[#1e293b] dark:text-white">{item.qty}</div>
                          <div className="col-span-2 text-[14px] font-medium text-center text-gray-500 dark:text-slate-400">{item.price}</div>
                          <div className="col-span-1 text-[14px] font-bold text-center text-[#1e293b] dark:text-white">{item.total}</div>
                          <div className="col-span-1 text-right">
                            <span className="inline-block px-2 py-0.5 text-[10px] font-semibold text-[#64748B] dark:text-slate-400 bg-[#F1F5F9] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[33554400px]">
                              {item.source}
                            </span>
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div key={index} className="flex items-end w-full py-3 px-6 border-b border-[#E2E8F0] dark:border-white/10 last:border-0">
                          <div className="grid grid-cols-6 gap-4 flex-1 items-end">
                            {/* Medicine Name textarea */}
                            <div className="space-y-1">
                              {index === firstEditablePharmacyIdx && (
                                <label className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider block">
                                  Medicine Name
                                </label>
                              )}
                              <textarea
                                value={item.name}
                                onChange={(e) => updatePharmacyRow(index, "name", e.target.value)}
                                placeholder="Paracetamol 500mg"
                                rows={2}
                                className="w-full h-[46px] px-3 py-1.5 bg-white dark:bg-white/5 border border-[#E2E8F0] dark:border-white/10 rounded-[8px] text-[13px] font-medium text-[#1e293b] dark:text-white focus:outline-none resize-none overflow-y-hidden leading-[1.2] whitespace-normal break-words"
                              />
                            </div>
                            {/* Category */}
                            <div className="space-y-1">
                              {index === firstEditablePharmacyIdx && (
                                <label className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider block">
                                  Category
                                </label>
                              )}
                              <textarea
                                value={item.category}
                                onChange={(e) => updatePharmacyRow(index, "category", e.target.value)}
                                placeholder="Category"
                                rows={2}
                                className="w-full h-[46px] px-3 py-1.5 bg-white dark:bg-white/5 border border-[#E2E8F0] dark:border-white/10 rounded-[8px] text-[13px] font-medium text-[#1e293b] dark:text-white focus:outline-none resize-none overflow-y-hidden leading-[1.2] whitespace-normal break-words"
                              />
                            </div>
                            {/* Qty */}
                            <div className="space-y-1">
                              {index === firstEditablePharmacyIdx && (
                                <label className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider block text-center">
                                  Qty
                                </label>
                              )}
                              <input
                                type="text"
                                value={item.qty}
                                onChange={(e) => updatePharmacyRow(index, "qty", e.target.value)}
                                placeholder="Qty"
                                className="w-full h-[46px] px-2 text-center bg-white dark:bg-white/5 border border-[#E2E8F0] dark:border-white/10 rounded-[8px] text-[13px] font-medium text-[#1e293b] dark:text-white focus:outline-none"
                              />
                            </div>
                            {/* Price */}
                            <div className="space-y-1">
                              {index === firstEditablePharmacyIdx && (
                                <label className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider block text-center">
                                  Price
                                </label>
                              )}
                              <input
                                type="text"
                                value={item.price}
                                onChange={(e) => updatePharmacyRow(index, "price", e.target.value)}
                                placeholder="Price"
                                className="w-full h-[46px] px-3 text-center bg-white dark:bg-white/5 border border-[#E2E8F0] dark:border-white/10 rounded-[8px] text-[13px] font-medium text-[#1e293b] dark:text-white focus:outline-none"
                              />
                            </div>
                            {/* Total */}
                            <div className="space-y-1">
                              {index === firstEditablePharmacyIdx && (
                                <label className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider block text-center">
                                  Total
                                </label>
                              )}
                              <input
                                type="text"
                                value={item.total}
                                onChange={(e) => updatePharmacyRow(index, "total", e.target.value)}
                                placeholder="Total"
                                className="w-full h-[46px] px-2 text-center bg-white dark:bg-white/5 border border-[#E2E8F0] dark:border-white/10 rounded-[8px] text-[13px] font-medium text-[#1e293b] dark:text-white focus:outline-none"
                              />
                            </div>

                            {/* Source */}
                            <div className="space-y-1 flex justify-center items-center h-[46px]">
                              {index === firstEditablePharmacyIdx && (
                                <label className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider block opacity-0 select-none absolute -top-5">
                                  Source
                                </label>
                              )}
                              <span className="inline-block px-2 py-0.5 text-[10px] font-semibold text-gray-500 dark:text-slate-400 bg-[#F1F5F9] dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[4px]">
                                OPD
                              </span>
                            </div>
                          </div>

                          {/* Remove Action Button */}
                          <div className="w-[40px] flex justify-center items-center h-[46px] ml-4">
                            {index === firstEditablePharmacyIdx && (
                              <label className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider block opacity-0 select-none absolute -top-5">
                                Remove
                              </label>
                            )}
                            <button
                              onClick={() => removePharmacyRow(index)}
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-[6px] transition-all cursor-pointer flex items-center justify-center"
                              title="Remove item"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              )}
              <div className="border-b border-[#E2E8F0] dark:border-white/10"></div>
            </div>
          </div>
        </div>

        {/* Footer totals */}
        <div className="flex items-center justify-end gap-6 py-4 px-6 bg-[#F8FAFC] dark:bg-white/5 border-t border-[#E2E8F0] dark:border-white/10 rounded-b-[8px] text-[14px]">
          <span className="text-gray-500 dark:text-gray-400 font-medium">
            Total Items: <strong className="text-[#1e293b] dark:text-white font-semibold">{totalItems}</strong>
          </span>
          <span className="text-gray-500 dark:text-gray-400 font-medium">
            Subtotal: <strong className="text-[#2E37A4] dark:text-blue-400 font-bold text-[16px]">${subtotal.toFixed(2)}</strong>
          </span>
        </div>
      </div>

      {/* Right Section - Gross Total Summary (col-span 4) */}
      <div className="lg:col-span-4 bg-card border border-border rounded-lg pt-6 pb-6 px-0 h-fit font-inter shadow-none">
        {/* Gross Total Header */}
        <div className="space-y-1 pb-4 px-4 sm:px-6">
          <span className="text-[14px] font-bold text-[#64748B] dark:text-slate-400 uppercase tracking-wider">GROSS TOTAL</span>
          <h2 className="text-[28px] font-extrabold text-[#1e293b] dark:text-white font-bold">₹{subtotal.toFixed(2)}</h2>
        </div>
        <div className="border-b border-border"></div>

        {/* Calculation Details */}
        <div className="py-4 px-4 sm:px-6">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between text-[14px]">
              <span className="text-gray-500 dark:text-slate-400 font-medium">Discounts (5%)</span>
              <span className="text-[#218F40] font-bold">-₹{discountsVal.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between text-[14px]">
              <span className="flex items-center gap-1 text-gray-500 dark:text-slate-400 font-medium">
                Insurance Covered
                <svg className="w-3.5 h-3.5 text-gray-400 cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
              </span>
              <span className="text-[#218F40] font-bold">-₹{insuranceVal.toFixed(2)}</span>
            </div>
          </div>

          <div className="border-b border-border my-3.5"></div>

          <div className="flex items-center justify-between text-[14px] font-bold text-[#1e293b] dark:text-white">
            <span>Net Payable</span>
            <span>₹{netPayableVal.toFixed(2)}</span>
          </div>
        </div>
        <div className="border-b border-border"></div>

        <div className="py-4 px-4 sm:px-6 space-y-3.5">
          <div className="flex items-center justify-between text-[14px]">
            <span className="text-gray-500 dark:text-slate-400 font-medium">Advance Paid</span>
            <span className="text-gray-500 dark:text-slate-400 font-bold">-₹{advanceVal.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between text-[14px] font-bold text-[#1e293b] dark:text-white">
            <span>Balance Due</span>
            <span className="text-[#DF8F2A] text-[18px] font-bold">₹{balanceDueVal.toFixed(2)}</span>
          </div>
        </div>
        <div className="border-b border-border"></div>

        {/* Progress Bar / Billing Health */}
        <div className="py-4 px-4 sm:px-6 space-y-3">
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
        <div className="py-4 px-4 sm:px-6 space-y-3">
          <button onClick={() => setShowCollectPayment(true)} className="w-full h-11 bg-[#2E37A4] hover:bg-[#2E37A4]/90 text-white font-semibold rounded-[6px] text-[13px] flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <path d="M2 10h20" />
            </svg>
            Collect Payment
          </button>

          <button className="w-full h-11 bg-[#F1F5F9] hover:bg-[#F1F5F9]/80 text-[#1e293b] font-semibold rounded-[6px] text-[13px] flex items-center justify-center gap-2 transition-all cursor-pointer border border-[#E2E8F0]">
            <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
            </svg>
            Generate Interim Bill
          </button>

          <button className="w-full h-11 bg-[#E2E8F0] hover:bg-[#E2E8F0]/80 text-[#64748B] font-medium rounded-[6px] text-[13px] flex items-center justify-center gap-2 transition-all cursor-pointer border border-[#CBD5E1]">
            <svg className="w-4 h-4 text-[#64748B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            Download Bill
          </button>
        </div>
      </div>

      {/* Collect Payment Modal Popup Overlay */}
      {showCollectPayment && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/35 backdrop-blur-[0.5px] p-4">
          <div className="bg-white dark:bg-[#101935] rounded-[12px] shadow-2xl flex flex-col md:flex-row max-w-[800px] w-full overflow-y-auto md:overflow-hidden border border-[#E2E8F0] dark:border-white/10 h-auto max-h-[90vh] md:max-h-[95vh]">

            {/* Left Column: Invoice Details */}
            <div className="w-full md:w-[300px] bg-[#F8FAFC] dark:bg-white/5 p-5 border-b md:border-b-0 md:border-r border-[#E2E8F0] dark:border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-[14px] font-bold text-[#1e293b] dark:text-white">
                  <svg className="w-4 h-4 text-[#2E37A4] dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="4" y="2" width="16" height="20" rx="2" />
                    <path d="M12 18h.01M8 6h8M8 10h8M8 14h4" />
                  </svg>
                  Invoice Details
                </div>

                <div className="mt-5 space-y-0.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Invoice Number</span>
                  <div className="text-[13px] font-bold text-[#1e293b] dark:text-white">INV-2023-001</div>
                </div>

                <div className="mt-3.5 space-y-0.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Patient</span>
                  <div className="text-[13px] font-bold text-[#1e293b] dark:text-white">{searchParams?.patient || "Sarah Jenkins"}</div>
                  <div className="text-[11px] text-gray-500 dark:text-slate-400">UHID: P-982342</div>
                </div>

                <div className="border-b border-[#E2E8F0] dark:border-white/10 my-4"></div>

                <div className="space-y-2.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Services</span>
                  <div className="flex justify-between text-[12px] font-medium text-[#1e293b] dark:text-white">
                    <span>Consultation</span>
                    <span>₹150.00</span>
                  </div>
                  <div className="flex justify-between text-[12px] font-medium text-[#1e293b] dark:text-white">
                    <span>Lab Tests</span>
                    <span>₹45.00</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 mt-6 pt-4 border-t border-[#E2E8F0] dark:border-white/10">
                <div className="flex justify-between text-[12px] text-gray-500 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1e293b] dark:text-white">₹195.00</span>
                </div>
                <div className="flex justify-between text-[12px] text-gray-500 dark:text-slate-400">
                  <span>Tax (5%)</span>
                  <span className="font-semibold text-[#1e293b] dark:text-white">₹9.75</span>
                </div>
                <div className="flex justify-between text-[12px] text-gray-500 dark:text-slate-400">
                  <span>Insurance</span>
                  <span className="font-semibold text-[#218F40] dark:text-green-400">-₹50.00</span>
                </div>
                <div className="border-b border-dashed border-[#E2E8F0] dark:border-white/10 my-1.5"></div>
                <div className="flex justify-between items-baseline">
                  <span className="text-[12px] font-bold text-[#1e293b] dark:text-white">Total Pending</span>
                  <span className="text-[18px] font-extrabold text-[#1e293b] dark:text-white">₹154.75</span>
                </div>
              </div>
            </div>

            {/* Right Column: Collect Payment Form */}
            <div className="flex-1 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 mb-4">
                  <h2 className="text-[16px] font-bold text-[#1e293b] dark:text-white">Collect Payment</h2>
                  <button onClick={() => setShowCollectPayment(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-all cursor-pointer">
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-[12px] mb-2">
                  <span className="text-gray-500 dark:text-slate-400 font-bold">Amount to Pay</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-400 text-[9px] font-bold uppercase tracking-wider">Partial Payment</span>
                    <button
                      onClick={() => setPartialPayment(!partialPayment)}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer ${partialPayment ? "bg-[#2E37A4]" : "bg-gray-200 dark:bg-white/10"}`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-200 ${partialPayment ? "translate-x-4" : "translate-x-0"}`} />
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    className="w-full h-11 px-4 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-[6px] text-[16px] font-bold text-[#1e293b] dark:text-white focus:border-[#2E37A4] focus:outline-none"
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                  />
                </div>
                <p className="text-[10px] font-bold text-[#DF8F2A] mt-1">Remaining balance will be ₹54.75</p>

                {/* Payment Method Grid */}
                <div className="space-y-1.5 mt-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Payment Method</span>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { id: "card", label: "Card", icon: <CreditCard className="w-4 h-4" /> },
                      { id: "cash", label: "Cash", icon: <Landmark className="w-4 h-4" /> },
                      { id: "upi", label: "UPI / QR", icon: <Smartphone className="w-4 h-4" /> },
                      { id: "net", label: "Net Banking", icon: <Building2 className="w-4 h-4" /> },
                      { id: "wallet", label: "Wallet", icon: <Wallet className="w-4 h-4" /> },
                      { id: "split", label: "Split", icon: <div className="text-[12px] font-bold tracking-widest font-mono select-none">[|]</div> }
                    ].map(m => (
                      <button
                        key={m.id}
                        onClick={() => setSelectedMethod(m.id)}
                        className={`h-11 border rounded-[6px] flex items-center justify-center gap-2 text-[12px] font-semibold transition-all cursor-pointer ${selectedMethod === m.id ? "bg-[#2E37A4] border-[#2E37A4] text-white" : "bg-white dark:bg-white/5 border-[#E2E8F0] dark:border-white/10 text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-white/5"}`}
                      >
                        {m.icon}
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4 bg-[#F5F8FC] dark:bg-white/5 border border-[#E2E8F0] dark:border-white/10 p-3 rounded-[8px] space-y-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Card Terminal</span>
                    <div className="relative">
                      <select className="w-full h-9 pl-3 pr-10 bg-white dark:bg-white/5 border border-[#E2E8F0] dark:border-white/10 rounded-[6px] text-[12px] text-[#1e293b] dark:text-white font-medium focus:outline-none appearance-none cursor-pointer">
                        <option>Terminal 1 (Front Desk)</option>
                        <option>Terminal 2 (Back Office)</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Transaction Reference (Optional)</span>
                    <input
                      type="text"
                      placeholder="e.g. Từn-12345"
                      className="w-full h-9 px-3 bg-white dark:bg-white/5 border border-[#E2E8F0] dark:border-white/10 rounded-[6px] text-[12px] text-[#1e293b] dark:text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 mt-5">
                <button onClick={() => setShowCollectPayment(false)} className="h-9 px-5 bg-white hover:bg-gray-50 dark:bg-white/5 border border-[#E2E8F0] dark:border-white/10 rounded-[6px] text-[12px] font-bold text-[#64748B] transition-colors cursor-pointer">
                  Cancel
                </button>
                <button onClick={handleConfirmPayment} className="h-9 px-6 bg-[#2E37A4] hover:bg-[#2E37A4]/90 text-white font-semibold rounded-[6px] text-[12px] shadow-sm cursor-pointer transition-colors">
                  Confirm Payment
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Initiate Discharge Modal Popup Overlay */}
      {showInitiateDischarge && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/35 backdrop-blur-[0.5px] p-4">
          <div className="bg-white dark:bg-[#101935] rounded-[12px] shadow-2xl flex flex-col max-w-[480px] w-full overflow-hidden border border-[#E2E8F0] dark:border-white/10 p-6 space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0] dark:border-white/10">
              <h2 className="text-[18px] font-bold text-[#1e293b] dark:text-white">Initiate Discharge</h2>
              <button onClick={() => setShowInitiateDischarge(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-all cursor-pointer">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Patient Bill Breakdown Summary */}
            <div className="border border-[#E2E8F0] dark:border-white/10 rounded-[8px] overflow-hidden bg-[#F8FAFC]/50 dark:bg-white/5 divide-y divide-[#E2E8F0] dark:divide-white/10">
              <div className="flex justify-between items-center py-3 px-4">
                <span className="text-[13px] text-gray-500 dark:text-slate-400 font-medium">Patient</span>
                <span className="text-[13px] font-bold text-[#1e293b] dark:text-white">{searchParams?.patient || "James Wilson"}</span>
              </div>
              <div className="flex justify-between items-center py-3 px-4">
                <span className="text-[13px] text-gray-500 dark:text-slate-400 font-medium">Total Bill</span>
                <span className="text-[13px] font-bold text-[#1e293b] dark:text-white">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-3 px-4">
                <span className="text-[13px] text-gray-500 dark:text-slate-400 font-medium">Paid Amount</span>
                <span className="text-[13px] font-semibold text-[#218F40] dark:text-green-400">₹{(subtotal - balanceDueVal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-3 px-4 bg-[#F1F5F9]/30 dark:bg-white/5">
                <span className="text-[13px] text-[#1e293b] dark:text-white font-bold">Balance Due</span>
                <span className={`text-[15px] font-extrabold ${balanceDueVal > 0 ? "text-[#2E37A4] dark:text-blue-400" : "text-[#218F40] dark:text-green-400"}`}>
                  ₹{balanceDueVal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Condition Alert Box */}
            <div className="bg-[#FFE2C2]/40 dark:bg-amber-950/20 border border-[#FFE2C2] dark:border-amber-950/30 rounded-[8px] p-4 flex gap-3 items-start">
              <svg className="w-5 h-5 text-[#DF8F2A] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" />
              </svg>
              <div>
                <h4 className="text-[13px] font-bold text-[#DF8F2A]">Action Required</h4>
                <p className="text-[12px] text-[#DF8F2A]/90 mt-0.5 leading-normal font-medium">
                  Pending dues must be cleared before discharge.
                </p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end gap-3 pt-2 border-t border-[#E2E8F0] dark:border-white/10">
              <button
                onClick={() => setShowInitiateDischarge(false)}
                className="h-10 px-4 bg-white hover:bg-gray-50 border border-gray-300 dark:border-white/10 dark:bg-white/5 text-gray-500 dark:text-slate-400 font-semibold rounded-[6px] text-[13px] transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowInitiateDischarge(false);
                  setShowCollectPayment(true);
                }}
                className="h-10 px-5 bg-[#2E37A4] hover:bg-[#2E37A4]/90 text-white font-semibold rounded-[6px] text-[13px] transition-all cursor-pointer shadow-sm"
              >
                Go to Collect Payment
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}


function InvoiceGeneratedPage({ searchParams, onClose }) {
  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 font-inter animate-in fade-in duration-200">
      {/* Payment Success Banner Alert */}
      <div className="bg-[#10B9811A] dark:bg-emerald-950/20 border border-[#10B9811A] dark:border-emerald-800/30 rounded-[8px] p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#10B981] dark:bg-emerald-500/20 flex items-center justify-center text-white shrink-0">
            <svg className="w-4 h-4 text-white dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <h4 className="text-[14px] font-bold text-[#10B981] dark:text-white">Payment Collected Successfully</h4>
            <p className="text-[12px] text-[#10B981] dark:text-slate-400 mt-0.5">
              Transaction ID: TXN-123456789 Invoice has been generated.
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-[#D3ECD9]/50 dark:hover:bg-white/10 rounded-full transition-all cursor-pointer">
          <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Grid Layout: Invoice Card + Invoice Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Left Side: Invoice details Sheet */}
        <div className="lg:col-span-3 bg-card rounded-lg border border-border p-8 shadow-none space-y-8">

          {/* Hospital Header Brand block */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#2E37A4] rounded-[10px] flex items-center justify-center text-white shrink-0 shadow-md">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M4 22V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v18" />
                  <path d="M18 14H6" />
                  <path d="M12 18H6" />
                  <path d="M12 10H6" />
                  <path d="M12 6H6" />
                  <rect x="10" y="14" width="4" height="4" />
                </svg>
              </div>
              <div>
                <h3 className="text-[20px] font-extrabold text-[#1E293B] dark:text-white leading-tight">MedERP Hospital</h3>
                <p className="text-[12px] text-gray-500 dark:text-slate-400 mt-1">123 Healthcare Ave, Medical District</p>
                <p className="text-[12px] text-gray-400 dark:text-slate-500">New York, NY 10001 | +1 (555) 123-4567</p>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <h2 className="text-[28px] font-black text-[#2E37A4] dark:text-blue-400 tracking-wider">INVOICE</h2>
              <p className="text-[12px] font-bold text-gray-500 dark:text-slate-400 mt-1">Invoice #: INV-2023-001</p>
              <p className="text-[12px] text-gray-400 dark:text-slate-500">Date: Oct 24, 2023</p>
            </div>
          </div>

          {/* Billed To / Payment Info grid block */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-6 border-y border-[#E2E8F0] dark:border-white/10">
            <div>
              <span className="text-[10px] font-extrabold text-gray-400 dark:text-slate-500 tracking-wider block">BILLED TO</span>
              <h4 className="text-[15px] font-extrabold text-[#1E293B] dark:text-white mt-1.5">{searchParams?.patient || "John Smith"}</h4>
              <p className="text-[12px] text-gray-500 dark:text-slate-400 mt-1 font-semibold">UHID: {searchParams?.uhid || "P-982342"}</p>
              <p className="text-[12px] text-gray-400 dark:text-slate-500 leading-relaxed mt-0.5">
                456 Patient Lane, Apt 4B<br />
                New York, NY 10002
              </p>
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-gray-400 dark:text-slate-500 tracking-wider block">PAYMENT INFO</span>
              <div className="mt-3 grid grid-cols-12 gap-x-2 gap-y-2.5 text-[12px]">
                <span className="col-span-4 text-gray-400 dark:text-slate-500 font-bold">Status:</span>
                <span className="col-span-8 font-black text-[#218F40] dark:text-emerald-400">PAID</span>

                <span className="col-span-4 text-gray-400 dark:text-slate-500 font-bold">Method:</span>
                <span className="col-span-8 text-gray-700 dark:text-slate-300 font-medium">Credit Card (ends in 4242)</span>

                <span className="col-span-4 text-gray-400 dark:text-slate-500 font-bold">Transaction:</span>
                <span className="col-span-8 text-gray-700 dark:text-slate-300 font-medium">TXN-123456789</span>
              </div>
            </div>
          </div>

          {/* Services Table List */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E2E8F0] dark:border-white/10">
                  <th className="pb-3 text-[14px] font-extrabold text-gray-400 dark:text-slate-500 uppercase tracking-wider">Service Description</th>
                  <th className="pb-3 text-[14px] font-extrabold text-gray-400 dark:text-slate-500 uppercase tracking-wider text-center">Qty</th>
                  <th className="pb-3 text-[14px] font-extrabold text-gray-400 dark:text-slate-500 uppercase tracking-wider text-right">Unit Price</th>
                  <th className="pb-3 text-[14px] font-extrabold text-gray-400 dark:text-slate-500 uppercase tracking-wider text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]/60 dark:divide-white/5">
                <tr>
                  <td className="py-4 pr-4">
                    <div className="text-[13px] font-bold text-[#1E293B] dark:text-white">Cardiology Consultation</div>
                    <div className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5">Dr. Jane Doe</div>
                  </td>
                  <td className="py-4 text-center text-[13px] font-semibold text-[#1E293B] dark:text-white">1</td>
                  <td className="py-4 text-right text-[13px] font-semibold text-[#1E293B] dark:text-white">₹150.00</td>
                  <td className="py-4 text-right text-[13px] font-bold text-[#1E293B] dark:text-white">₹150.00</td>
                </tr>
                <tr>
                  <td className="py-4 pr-4">
                    <div className="text-[13px] font-bold text-[#1E293B] dark:text-white">Dermatology Appointment</div>
                    <div className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5">Dr. John Smith</div>
                  </td>
                  <td className="py-4 text-center text-[13px] font-semibold text-[#1E293B] dark:text-white">2</td>
                  <td className="py-4 text-right text-[13px] font-semibold text-[#1E293B] dark:text-white">₹200.00</td>
                  <td className="py-4 text-right text-[13px] font-bold text-[#1E293B] dark:text-white">₹200.00</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Signature and Subtotals row block */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 pt-6">

            {/* Terms and Sign block */}
            <div className="flex-1 space-y-8">
              <div>
                <span className="text-[10px] font-extrabold text-gray-400 dark:text-slate-500 tracking-wider block">TERMS & CONDITIONS</span>
                <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-1.5 max-w-[340px] leading-relaxed">
                  Payment is due within 30 days. Please make checks payable to MedERP Hospital. For billing inquiries, contact billing@mederp.com.
                </p>
              </div>
              <div className="pt-25">
                <div className="w-[400px] border-t border-gray-300 dark:border-white/20 pt-2">
                  <span className="text-[11px] font-bold text-gray-400 dark:text-slate-500 block">Authorized Signature</span>
                </div>
              </div>
            </div>

            {/* Calculations Card Shaded block */}
            <div className="bg-[#F8FAFC] dark:bg-white/5 border border-[#E2E8F0] dark:border-white/10 p-5 rounded-[12px] w-full md:w-[300px] space-y-3 shadow-sm shrink-0">
              <div className="flex justify-between text-[12px] text-gray-500 dark:text-slate-400">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-800 dark:text-white">₹195.00</span>
              </div>
              <div className="flex justify-between text-[12px] text-gray-500 dark:text-slate-400">
                <span>Tax (5%) GST</span>
                <span className="font-semibold text-gray-800 dark:text-white">₹9.75</span>
              </div>
              <div className="flex justify-between text-[12px] text-gray-500 dark:text-slate-400">
                <span>Insurance Coverage</span>
                <span className="font-bold text-[#218F40] dark:text-emerald-400">-₹50.00</span>
              </div>

              <div className="border-t border-dashed border-[#E2E8F0] dark:border-white/10 my-2"></div>

              <div className="flex justify-between items-baseline">
                <span className="text-[12px] font-bold text-[#1E293B] dark:text-white">Grand Total</span>
                <span className="text-[18px] font-extrabold text-[#1E293B] dark:text-white">₹154.75</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[12px] font-bold text-gray-500 dark:text-slate-400">Amount Paid</span>
                <span className="text-[15px] font-extrabold text-[#218F40] dark:text-emerald-400">₹154.75</span>
              </div>

              <div className="border-t border-dashed border-[#E2E8F0] dark:border-white/10 my-2"></div>

              <div className="flex justify-between items-baseline">
                <span className="text-[12px] font-black text-gray-700 dark:text-slate-300">Balance Due</span>
                <span className="text-[18px] font-black text-[#1E293B] dark:text-white">₹0.00</span>
              </div>
            </div>

          </div>

        </div>

        {/* Right Side: Action Box Card */}
        <div className="bg-card rounded-lg border border-border p-5 shadow-none space-y-4 h-fit">
          <h3 className="text-[15px] font-bold text-[#1e293b] dark:text-white pb-3 border-b border-border">Invoice Actions</h3>

          <button onClick={() => window.print()} className="w-full h-10 bg-[#2E37A4] hover:bg-[#2E37A4]/90 text-white font-bold rounded-[6px] text-[13px] flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            Print Invoice
          </button>

          <button className="w-full h-10 bg-white hover:bg-gray-50 dark:bg-white/5 border border-[#E2E8F0] dark:border-white/10 text-gray-700 dark:text-white font-bold rounded-[6px] text-[13px] flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            Download PDF
          </button>

          <button className="w-full h-10 bg-white hover:bg-gray-50 dark:bg-white/5 border border-[#E2E8F0] dark:border-white/10 text-gray-700 dark:text-white font-bold rounded-[6px] text-[13px] flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            Email Invoice
          </button>

          <button className="w-full h-10 bg-[#E8F8EE] hover:bg-[#D5F3DF] border border-[#BDE7CC] text-[#218F40] dark:bg-emerald-950/20 dark:border-emerald-800/30 dark:text-emerald-400 font-bold rounded-[6px] text-[13px] flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            WhatsApp Share
          </button>

          <button onClick={onClose} className="w-full h-10 bg-white hover:bg-gray-50 dark:bg-white/5 border border-[#E2E8F0] dark:border-white/10 text-gray-700 dark:text-white font-bold rounded-[6px] text-[13px] flex items-center justify-center gap-2 cursor-pointer transition-all mt-4 shadow-sm">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Create New Bill
          </button>
        </div>

      </div>
    </div>
  );
}
