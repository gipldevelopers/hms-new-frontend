"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown, CreditCard, X, Smartphone, Wallet, Building2, Landmark } from "lucide-react";
import { CustomSelect } from "@/components/ui/custom-select";

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
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto space-y-6 font-inter">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-[24px] font-bold text-[#1e293b] dark:text-white tracking-tight">Create New Bill</h1>
      </div>

      {/* Form Section */}
      <div className="bg-card border border-border rounded-lg p-4 sm:p-6 shadow-none">
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
              className="w-full h-10 px-3 bg-background border border-border rounded-lg text-[13px] focus:outline-none focus:border-primary transition-all text-foreground placeholder:text-muted-foreground shadow-none font-medium"
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
              className="w-full h-10 px-3 bg-background border border-border rounded-lg text-[13px] focus:outline-none focus:border-primary transition-all text-foreground placeholder:text-muted-foreground shadow-none font-medium"
            />
          </div>

          <div className="space-y-1.5 flex flex-col justify-start">
            <label className="text-[13px] font-bold text-[#1e293b] dark:text-slate-300">
              IPD/OPD
            </label>
            <CustomSelect
              value={billType}
              onChange={setBillType}
              options={[{ label: "IPD", value: "IPD" }, { label: "OPD", value: "OPD" }]}
              placeholder="Select"
              showAllOption={false}
              className="w-full min-w-full justify-between"
              minWidth={null}
              align="start"
            />
          </div>

          <div className="space-y-1.5 flex flex-col justify-start">
            <label className="text-[13px] font-bold text-[#1e293b] dark:text-slate-300">
              Consulting Doctor <span className="text-red-500">*</span>
            </label>
            <CustomSelect
              value={doctor}
              onChange={setDoctor}
              options={[{ label: "Dr. Smith", value: "Dr. Smith" }, { label: "Dr. John Doe", value: "Dr. John Doe" }]}
              placeholder="Select"
              showAllOption={false}
              className="w-full min-w-full justify-between"
              minWidth={null}
              align="start"
            />
          </div>
        </div>
      </div>

      {/* Interactive Split Layout: Charges on left, Gross Total on right */}
      <BillingChargesSection patientId={patientId} billType={billType} />
    </div>
  );
}

// Subcomponent to organize code cleanly and avoid huge file sizes
function BillingChargesSection({ patientId, billType }) {
  const [expanded, setExpanded] = useState({
    room: true,
    doctor: true,
    lab: true,
    pharmacy: true,
  });

  const [showCollectPayment, setShowCollectPayment] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [payAmount, setPayAmount] = useState("");
  const [partialPayment, setPartialPayment] = useState(false);
  const [terminal, setTerminal] = useState("Terminal 1 (Front Desk)");
  const [reference, setReference] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showInvoiceView, setShowInvoiceView] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowCollectPayment(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const [wards, setWards] = useState([
    {
      wardName: "General Ward (Oct 12 - Oct 14)",
      category: "WD-ERS-01",
      qty: "1",
      price: "₹150.00",
      total: "₹150.00",
      source: "IPD",
    },
  ]);

  const [doctors, setDoctors] = useState([
    {
      name: "Initial Consultation",
      category: "Consultation",
      qty: "1",
      price: "₹100.00",
      total: "₹100.00",
      source: "IPD",
    },
    {
      name: "Follow-up Visit",
      category: "Consultation",
      qty: "2",
      price: "₹75.00",
      total: "₹150.00",
      source: "IPD",
    },
  ]);

  const [labs, setLabs] = useState([
    {
      name: "Complete Blood Count (CBC)",
      category: "Pathology",
      qty: "1",
      price: "₹45.00",
      total: "₹45.00",
      source: "Lab",
    },
    {
      name: "Lipid Profile",
      category: "Pathology",
      qty: "1",
      price: "₹60.00",
      total: "₹60.00",
      source: "Lab",
    },
  ]);

  const [pharmacy, setPharmacy] = useState([
    {
      name: "Paracetamol 500mg (10 tabs)",
      category: "Medicine",
      qty: "2",
      price: "₹5.00",
      total: "₹10.00",
      source: "Pharmacy",
    },
    {
      name: "Amoxicillin 250mg (Strip)",
      category: "Medicine",
      qty: "1",
      price: "₹12.00",
      total: "₹12.00",
      source: "Pharmacy",
    },
  ]);

  const toggle = (sec) => setExpanded((prev) => ({ ...prev, [sec]: !prev[sec] }));

  useEffect(() => {
    if (billType) {
      const targetSource = billType === "OPD" ? "OPD" : "IPD";
      setWards((prev) => prev.map((w) => ({ ...w, source: targetSource })));
      setDoctors((prev) => prev.map((d) => ({ ...d, source: targetSource })));
    }
  }, [billType]);

  // Helper functions for parsing and totals
  const parseVal = (val) => {
    if (!val) return 0;
    const clean = String(val).replace(/[^\d.]/g, "");
    const num = parseFloat(clean);
    return isNaN(num) ? 0 : num;
  };

  const getRowTotal = (qty, price) => {
    const q = parseVal(qty);
    const p = parseVal(price);
    return q * p;
  };

  // State Mutators
  const addWard = () => {
    setWards((prev) => [
      { wardName: "", category: "", qty: "", price: "", total: "", source: billType === "OPD" ? "OPD" : "IPD" },
      ...prev,
    ]);
  };
  const removeWard = (index) => {
    setWards((prev) => prev.filter((_, i) => i !== index));
  };
  const updateWard = (index, field, value) => {
    setWards((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        const updated = { ...item, [field]: value };
        if (field === "qty" || field === "price") {
          const totalVal = getRowTotal(updated.qty, updated.price);
          updated.total = totalVal > 0 ? `$${totalVal.toFixed(2)}` : "";
        }
        return updated;
      })
    );
  };

  const addDoctor = () => {
    setDoctors((prev) => [
      { name: "", category: "", qty: "", price: "", total: "", source: billType === "OPD" ? "OPD" : "IPD" },
      ...prev,
    ]);
  };
  const removeDoctor = (index) => {
    setDoctors((prev) => prev.filter((_, i) => i !== index));
  };
  const updateDoctor = (index, field, value) => {
    setDoctors((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        const updated = { ...item, [field]: value };
        if (field === "qty" || field === "price") {
          const totalVal = getRowTotal(updated.qty, updated.price);
          updated.total = totalVal > 0 ? `$${totalVal.toFixed(2)}` : "";
        }
        return updated;
      })
    );
  };

  const addLab = () => {
    setLabs((prev) => [
      { name: "", category: "", qty: "", price: "", total: "", source: "Lab" },
      ...prev,
    ]);
  };
  const removeLab = (index) => {
    setLabs((prev) => prev.filter((_, i) => i !== index));
  };
  const updateLab = (index, field, value) => {
    setLabs((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        const updated = { ...item, [field]: value };
        if (field === "qty" || field === "price") {
          const totalVal = getRowTotal(updated.qty, updated.price);
          updated.total = totalVal > 0 ? `$${totalVal.toFixed(2)}` : "";
        }
        return updated;
      })
    );
  };

  const addPharmacy = () => {
    setPharmacy((prev) => [
      { name: "", category: "", qty: "", price: "", total: "", source: "Pharmacy" },
      ...prev,
    ]);
  };
  const removePharmacy = (index) => {
    setPharmacy((prev) => prev.filter((_, i) => i !== index));
  };
  const updatePharmacy = (index, field, value) => {
    setPharmacy((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        const updated = { ...item, [field]: value };
        if (field === "qty" || field === "price") {
          const totalVal = getRowTotal(updated.qty, updated.price);
          updated.total = totalVal > 0 ? `$${totalVal.toFixed(2)}` : "";
        }
        return updated;
      })
    );
  };

  // Calculate dynamic totals
  const calculateTotals = () => {
    let totalItems = 0;
    let subtotal = 0;

    wards.forEach((item) => {
      totalItems += parseVal(item.qty);
      subtotal += getRowTotal(item.qty, item.price);
    });
    doctors.forEach((item) => {
      totalItems += parseVal(item.qty);
      subtotal += getRowTotal(item.qty, item.price);
    });
    labs.forEach((item) => {
      totalItems += parseVal(item.qty);
      subtotal += getRowTotal(item.qty, item.price);
    });
    pharmacy.forEach((item) => {
      totalItems += parseVal(item.qty);
      subtotal += getRowTotal(item.qty, item.price);
    });

    return { totalItems, subtotal };
  };

  const { totalItems, subtotal } = calculateTotals();
  const discount = subtotal * 0.05;
  const insuranceCover = Math.min(400.00, subtotal);
  const netPayable = Math.max(0, subtotal - discount - insuranceCover);
  const advancePaid = Math.min(100.00, netPayable);
  const balanceDue = Math.max(0, netPayable - advancePaid);
  const progressPercent = netPayable === 0 ? 100 : (advancePaid / netPayable) * 100;

  const servicesListForModal = [
    ...wards.filter(w => w.wardName).map(w => ({ name: w.wardName, total: w.total || "₹0.00" })),
    ...doctors.filter(d => d.name).map(d => ({ name: d.name, total: d.total || "₹0.00" })),
    ...labs.filter(l => l.name).map(l => ({ name: l.name, total: l.total || "₹0.00" })),
    ...pharmacy.filter(p => p.name).map(p => ({ name: p.name, total: p.total || "₹0.00" }))
  ].length > 0 ? [
    ...wards.filter(w => w.wardName).map(w => ({ name: w.wardName, total: w.total || "₹0.00" })),
    ...doctors.filter(d => d.name).map(d => ({ name: d.name, total: d.total || "₹0.00" })),
    ...labs.filter(l => l.name).map(l => ({ name: l.name, total: l.total || "₹0.00" })),
    ...pharmacy.filter(p => p.name).map(p => ({ name: p.name, total: p.total || "₹0.00" }))
  ] : [
    { name: "Consultation Fee", total: "₹150.00" },
    { name: "Lab Tests (CBC)", total: "₹45.00" }
  ];

  // Synchronize modal's default payAmount when opened or when balance due updates
  useEffect(() => {
    if (showCollectPayment) {
      setPayAmount(balanceDue.toFixed(2));
    }
  }, [showCollectPayment, balanceDue]);

  const handleConfirmPayment = () => {
    setShowCollectPayment(false);
    setShowInvoiceView(true);
  };

  if (showInvoiceView) {
    const activeServices = [
      ...wards.filter(w => w.wardName).map(w => ({ name: w.wardName, total: w.total || "₹0.00" })),
      ...doctors.filter(d => d.name).map(d => ({ name: d.name, total: d.total || "₹0.00" })),
      ...labs.filter(l => l.name).map(l => ({ name: l.name, total: l.total || "₹0.00" })),
      ...pharmacy.filter(p => p.name).map(p => ({ name: p.name, total: p.total || "₹0.00" }))
    ];
    return (
      <InvoiceGeneratedPage
        patientId={patientId}
        subtotal={subtotal}
        insuranceCover={insuranceCover}
        discount={discount}
        balanceDue={balanceDue}
        activeServices={activeServices}
        onClose={() => setShowInvoiceView(false)}
        paymentMethod={selectedMethod}
        amountToPay={payAmount}
        reference={reference}
      />
    );
  }

  // Shared className for textarea elements to keep styles strictly synchronized
  const textareaClass = "w-full min-h-[58px] py-1.5 px-2 bg-background border border-border rounded-lg text-[14px] font-medium text-[#1e293b] dark:text-white focus:outline-none resize-none leading-tight overflow-hidden shadow-none";
  const textareaReadonlyClass = "w-full min-h-[58px] py-1.5 px-3 bg-muted/50 border border-border rounded-lg text-[14px] font-bold text-[#1e293b] dark:text-white focus:outline-none resize-none leading-tight select-none overflow-hidden shadow-none";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Section - Charges (col-span 8) */}
      <div className="lg:col-span-8 bg-card border border-border rounded-lg pt-6 pb-0 px-0 font-inter h-fit animate-in fade-in duration-300 shadow-none">
        {/* Title */}
        <h2 className="text-[18px] font-bold text-[#1e293b] dark:text-white mb-5 px-6">Charges</h2>

        {/* Grid Table */}
        <div className="flex flex-col w-full">
          {/* 1. Room Charges Accordion & Items */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between py-[12px] px-4 sm:px-6 bg-[#F1F5F9]/50 dark:bg-white/5">
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
                className="text-[12px] font-bold text-[#2E37A4] hover:text-[#2E37A4]/80 transition-colors cursor-pointer"
              >
                + Add Ward
              </button>
            </div>
            <div className="border-b border-[#E2E8F0] dark:border-white/10"></div>

            {expanded.room && (
              <>
                <div className="py-4 px-4 sm:px-6 space-y-4">
                  {wards.map((ward, index) => (
                    <div key={index} className="relative group bg-white dark:bg-white/5 border border-transparent hover:border-[#E2E8F0] dark:hover:border-white/10 rounded-[8px] p-4 md:p-0 md:bg-transparent md:border-0 md:rounded-none md:hover:border-transparent">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center">
                        <div className="col-span-1 md:col-span-3 space-y-1.5">
                          {index === 0 && (
                            <label className="text-[10px] font-bold text-gray-400 uppercase dark:text-slate-400 hidden md:block tracking-wider">WARD NAME</label>
                          )}
                          <textarea
                            value={ward.wardName}
                            onChange={(e) => updateWard(index, "wardName", e.target.value)}
                            placeholder="General Ward"
                            rows={2}
                            className={textareaClass}
                          />
                        </div>
                        <div className="col-span-1 md:col-span-2 space-y-1.5">
                          {index === 0 && (
                            <label className="text-[10px] font-bold text-gray-400 uppercase dark:text-slate-400 hidden md:block tracking-wider">CATEGORY</label>
                          )}
                          <textarea
                            value={ward.category}
                            onChange={(e) => updateWard(index, "category", e.target.value)}
                            placeholder="Category code"
                            rows={2}
                            className={textareaClass}
                          />
                        </div>
                        <div className="col-span-1 md:col-span-1 space-y-1.5">
                          {index === 0 && (
                            <label className="text-[10px] font-bold text-gray-400 uppercase dark:text-slate-400 hidden md:block text-center tracking-wider">QTY</label>
                          )}
                          <textarea
                            value={ward.qty}
                            onChange={(e) => updateWard(index, "qty", e.target.value)}
                            placeholder="1"
                            rows={2}
                            className={`${textareaClass} text-left md:text-center`}
                          />
                        </div>
                        <div className="col-span-1 md:col-span-2 space-y-1.5">
                          {index === 0 && (
                            <label className="text-[10px] font-bold text-gray-400 uppercase dark:text-slate-400 hidden md:block text-center tracking-wider">PRICE</label>
                          )}
                          <textarea
                            value={ward.price}
                            onChange={(e) => updateWard(index, "price", e.target.value)}
                            placeholder="₹0.00"
                            rows={2}
                            className={`${textareaClass} text-left md:text-center`}
                          />
                        </div>
                        <div className="col-span-1 md:col-span-2 space-y-1.5">
                          {index === 0 && (
                            <label className="text-[10px] font-bold text-gray-400 uppercase dark:text-slate-400 hidden md:block text-center tracking-wider">TOTAL</label>
                          )}
                          <textarea
                            value={ward.total}
                            readOnly
                            placeholder="₹0.00"
                            rows={2}
                            className={`${textareaReadonlyClass} text-left md:text-center`}
                          />
                        </div>
                        {/* Source Pill Badge */}
                        <div className="col-span-1 md:col-span-1 flex flex-col items-center justify-center">
                          {index === 0 && (
                            <label className="text-[10px] font-bold text-gray-400 uppercase dark:text-slate-400 hidden md:block mb-1.5 text-center tracking-wider">SOURCE</label>
                          )}
                          <div className="flex items-center justify-center w-full min-h-[58px]">
                            <span className="inline-flex items-center justify-center px-1.5 py-0.5 bg-[#F1F5F9] dark:bg-white/5 text-[#64748B] dark:text-slate-400 text-[9px] font-bold rounded-full uppercase tracking-wider select-none border border-gray-200 dark:border-white/10 whitespace-nowrap">
                              {ward.source || "IPD"}
                            </span>
                          </div>
                        </div>
                        {/* Small Right-Aligned Action Button */}
                        <div className="col-span-1 flex flex-col items-end justify-center">
                          {index === 0 && (
                            <label className="text-[10px] font-bold text-gray-400 uppercase dark:text-slate-400 hidden md:block mb-1.5 text-right w-full tracking-wider">&nbsp;</label>
                          )}
                          <div className="flex items-center justify-end w-full min-h-[58px]">
                            <button
                              onClick={() => removeWard(index)}
                              className="flex items-center justify-center w-6 h-6 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-full transition-colors cursor-pointer border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
                            >
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                              </svg>
                            </button>
                          </div>
                        </div>
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
            <div className="flex items-center justify-between py-[12px] px-4 sm:px-6 bg-[#F1F5F9]/50 dark:bg-white/5">
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
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addDoctor();
                }}
                className="text-[12px] font-bold text-[#2E37A4] hover:text-[#2E37A4]/80 transition-colors cursor-pointer"
              >
                + Add Visit
              </button>
            </div>
            <div className="border-b border-[#E2E8F0] dark:border-white/10"></div>

            {expanded.doctor && (
              <>
                <div className="py-4 px-4 sm:px-6 space-y-4">
                  {doctors.map((doc, index) => (
                    <div key={index} className="relative group bg-white dark:bg-white/5 border border-transparent hover:border-[#E2E8F0] dark:hover:border-white/10 rounded-[8px] p-4 md:p-0 md:bg-transparent md:border-0 md:rounded-none md:hover:border-transparent">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center">
                        <div className="col-span-1 md:col-span-3 space-y-1.5">
                          {index === 0 && (
                            <label className="text-[10px] font-bold text-gray-400 uppercase dark:text-slate-400 hidden md:block tracking-wider">DOCTOR VISIT NAME</label>
                          )}
                          <textarea
                            value={doc.name}
                            onChange={(e) => updateDoctor(index, "name", e.target.value)}
                            placeholder="Consulting Doctor"
                            rows={2}
                            className={textareaClass}
                          />
                        </div>
                        <div className="col-span-1 md:col-span-2 space-y-1.5">
                          {index === 0 && (
                            <label className="text-[10px] font-bold text-gray-400 uppercase dark:text-slate-400 hidden md:block tracking-wider">CATEGORY</label>
                          )}
                          <textarea
                            value={doc.category}
                            onChange={(e) => updateDoctor(index, "category", e.target.value)}
                            placeholder="Consultation"
                            rows={2}
                            className={textareaClass}
                          />
                        </div>
                        <div className="col-span-1 md:col-span-1 space-y-1.5">
                          {index === 0 && (
                            <label className="text-[10px] font-bold text-gray-400 uppercase dark:text-slate-400 hidden md:block text-center tracking-wider">QTY</label>
                          )}
                          <textarea
                            value={doc.qty}
                            onChange={(e) => updateDoctor(index, "qty", e.target.value)}
                            placeholder="1"
                            rows={2}
                            className={`${textareaClass} text-left md:text-center`}
                          />
                        </div>
                        <div className="col-span-1 md:col-span-2 space-y-1.5">
                          {index === 0 && (
                            <label className="text-[10px] font-bold text-gray-400 uppercase dark:text-slate-400 hidden md:block text-center tracking-wider">PRICE</label>
                          )}
                          <textarea
                            value={doc.price}
                            onChange={(e) => updateDoctor(index, "price", e.target.value)}
                            placeholder="₹0.00"
                            rows={2}
                            className={`${textareaClass} text-left md:text-center`}
                          />
                        </div>
                        <div className="col-span-1 md:col-span-2 space-y-1.5">
                          {index === 0 && (
                            <label className="text-[10px] font-bold text-gray-400 uppercase dark:text-slate-400 hidden md:block text-center tracking-wider">TOTAL</label>
                          )}
                          <textarea
                            value={doc.total}
                            readOnly
                            placeholder="₹0.00"
                            rows={2}
                            className={`${textareaReadonlyClass} text-left md:text-center`}
                          />
                        </div>
                        {/* Source Pill Badge */}
                        <div className="col-span-1 md:col-span-1 flex flex-col items-center justify-center">
                          {index === 0 && (
                            <label className="text-[10px] font-bold text-gray-400 uppercase dark:text-slate-400 hidden md:block mb-1.5 text-center tracking-wider">SOURCE</label>
                          )}
                          <div className="flex items-center justify-center w-full min-h-[58px]">
                            <span className="inline-flex items-center justify-center px-1.5 py-0.5 bg-[#F1F5F9] dark:bg-white/5 text-[#64748B] dark:text-slate-400 text-[9px] font-bold rounded-full uppercase tracking-wider select-none border border-gray-200 dark:border-white/10 whitespace-nowrap">
                              {doc.source || "IPD"}
                            </span>
                          </div>
                        </div>
                        {/* Small Right-Aligned Action Button */}
                        <div className="col-span-1 flex flex-col items-end justify-center">
                          {index === 0 && (
                            <label className="text-[10px] font-bold text-gray-400 uppercase dark:text-slate-400 hidden md:block mb-1.5 text-right w-full tracking-wider">&nbsp;</label>
                          )}
                          <div className="flex items-center justify-end w-full min-h-[58px]">
                            <button
                              onClick={() => removeDoctor(index)}
                              className="flex items-center justify-center w-6 h-6 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-full transition-colors cursor-pointer border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
                            >
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-b border-[#E2E8F0] dark:border-white/10"></div>
              </>
            )}
          </div>

          {/* 3. Lab Tests Accordion & Items */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between py-[12px] px-4 sm:px-6 bg-[#F1F5F9]/50 dark:bg-white/5">
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
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addLab();
                }}
                className="text-[12px] font-bold text-[#2E37A4] hover:text-[#2E37A4]/80 transition-colors cursor-pointer"
              >
                + Add Test
              </button>
            </div>
            <div className="border-b border-[#E2E8F0] dark:border-white/10"></div>

            {expanded.lab && (
              <>
                <div className="py-4 px-4 sm:px-6 space-y-4">
                  {labs.map((lab, index) => (
                    <div key={index} className="relative group bg-white dark:bg-white/5 border border-transparent hover:border-[#E2E8F0] dark:hover:border-white/10 rounded-[8px] p-4 md:p-0 md:bg-transparent md:border-0 md:rounded-none md:hover:border-transparent">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center">
                        <div className="col-span-1 md:col-span-3 space-y-1.5">
                          {index === 0 && (
                            <label className="text-[10px] font-bold text-gray-400 uppercase dark:text-slate-400 hidden md:block tracking-wider">TEST NAME</label>
                          )}
                          <textarea
                            value={lab.name}
                            onChange={(e) => updateLab(index, "name", e.target.value)}
                            placeholder="Complete Blood Count"
                            rows={2}
                            className={textareaClass}
                          />
                        </div>
                        <div className="col-span-1 md:col-span-2 space-y-1.5">
                          {index === 0 && (
                            <label className="text-[10px] font-bold text-gray-400 uppercase dark:text-slate-400 hidden md:block tracking-wider">CATEGORY</label>
                          )}
                          <textarea
                            value={lab.category}
                            onChange={(e) => updateLab(index, "category", e.target.value)}
                            placeholder="Pathology"
                            rows={2}
                            className={textareaClass}
                          />
                        </div>
                        <div className="col-span-1 md:col-span-1 space-y-1.5">
                          {index === 0 && (
                            <label className="text-[10px] font-bold text-gray-400 uppercase dark:text-slate-400 hidden md:block text-center tracking-wider">QTY</label>
                          )}
                          <textarea
                            value={lab.qty}
                            onChange={(e) => updateLab(index, "qty", e.target.value)}
                            placeholder="1"
                            rows={2}
                            className={`${textareaClass} text-left md:text-center`}
                          />
                        </div>
                        <div className="col-span-1 md:col-span-2 space-y-1.5">
                          {index === 0 && (
                            <label className="text-[10px] font-bold text-gray-400 uppercase dark:text-slate-400 hidden md:block text-center tracking-wider">PRICE</label>
                          )}
                          <textarea
                            value={lab.price}
                            onChange={(e) => updateLab(index, "price", e.target.value)}
                            placeholder="₹0.00"
                            rows={2}
                            className={`${textareaClass} text-left md:text-center`}
                          />
                        </div>
                        <div className="col-span-1 md:col-span-2 space-y-1.5">
                          {index === 0 && (
                            <label className="text-[10px] font-bold text-gray-400 uppercase dark:text-slate-400 hidden md:block text-center tracking-wider">TOTAL</label>
                          )}
                          <textarea
                            value={lab.total}
                            readOnly
                            placeholder="₹0.00"
                            rows={2}
                            className={`${textareaReadonlyClass} text-left md:text-center`}
                          />
                        </div>
                        {/* Source Pill Badge */}
                        <div className="col-span-1 md:col-span-1 flex flex-col items-center justify-center">
                          {index === 0 && (
                            <label className="text-[10px] font-bold text-gray-400 uppercase dark:text-slate-400 hidden md:block mb-1.5 text-center tracking-wider">SOURCE</label>
                          )}
                          <div className="flex items-center justify-center w-full min-h-[58px]">
                            <span className="inline-flex items-center justify-center px-1.5 py-0.5 bg-[#F1F5F9] dark:bg-white/5 text-[#64748B] dark:text-slate-400 text-[9px] font-bold rounded-full uppercase tracking-wider select-none border border-gray-200 dark:border-white/10 whitespace-nowrap">
                              {lab.source || "Lab"}
                            </span>
                          </div>
                        </div>
                        {/* Small Right-Aligned Action Button */}
                        <div className="col-span-1 flex flex-col items-end justify-center">
                          {index === 0 && (
                            <label className="text-[10px] font-bold text-gray-400 uppercase dark:text-slate-400 hidden md:block mb-1.5 text-right w-full tracking-wider">&nbsp;</label>
                          )}
                          <div className="flex items-center justify-end w-full min-h-[58px]">
                            <button
                              onClick={() => removeLab(index)}
                              className="flex items-center justify-center w-6 h-6 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-full transition-colors cursor-pointer border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
                            >
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-b border-[#E2E8F0] dark:border-white/10"></div>
              </>
            )}
          </div>

          {/* 4. Pharmacy Accordion & Items */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between py-[12px] px-4 sm:px-6 bg-[#F1F5F9]/50 dark:bg-white/5">
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
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addPharmacy();
                }}
                className="text-[12px] font-bold text-[#2E37A4] hover:text-[#2E37A4]/80 transition-colors cursor-pointer"
              >
                + Add Item
              </button>
            </div>
            <div className="border-b border-[#E2E8F0] dark:border-white/10"></div>

            {expanded.pharmacy && (
              <>
                <div className="py-4 px-4 sm:px-6 space-y-4">
                  {pharmacy.map((item, index) => (
                    <div key={index} className="relative group bg-white dark:bg-white/5 border border-transparent hover:border-[#E2E8F0] dark:hover:border-white/10 rounded-[8px] p-4 md:p-0 md:bg-transparent md:border-0 md:rounded-none md:hover:border-transparent">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center">
                        <div className="col-span-1 md:col-span-3 space-y-1.5">
                          {index === 0 && (
                            <label className="text-[10px] font-bold text-gray-400 uppercase dark:text-slate-400 hidden md:block tracking-wider">MEDICINE NAME</label>
                          )}
                          <textarea
                            value={item.name}
                            onChange={(e) => updatePharmacy(index, "name", e.target.value)}
                            placeholder="Paracetamol 500mg"
                            rows={2}
                            className={textareaClass}
                          />
                        </div>
                        <div className="col-span-1 md:col-span-2 space-y-1.5">
                          {index === 0 && (
                            <label className="text-[10px] font-bold text-gray-400 uppercase dark:text-slate-400 hidden md:block tracking-wider">CATEGORY</label>
                          )}
                          <textarea
                            value={item.category}
                            onChange={(e) => updatePharmacy(index, "category", e.target.value)}
                            placeholder="Medicine"
                            rows={2}
                            className={textareaClass}
                          />
                        </div>
                        <div className="col-span-1 md:col-span-1 space-y-1.5">
                          {index === 0 && (
                            <label className="text-[10px] font-bold text-gray-400 uppercase dark:text-slate-400 hidden md:block text-center tracking-wider">QTY</label>
                          )}
                          <textarea
                            value={item.qty}
                            onChange={(e) => updatePharmacy(index, "qty", e.target.value)}
                            placeholder="2"
                            rows={2}
                            className={`${textareaClass} text-left md:text-center`}
                          />
                        </div>
                        <div className="col-span-1 md:col-span-2 space-y-1.5">
                          {index === 0 && (
                            <label className="text-[10px] font-bold text-gray-400 uppercase dark:text-slate-400 hidden md:block text-center tracking-wider">PRICE</label>
                          )}
                          <textarea
                            value={item.price}
                            onChange={(e) => updatePharmacy(index, "price", e.target.value)}
                            placeholder="₹0.00"
                            rows={2}
                            className={`${textareaClass} text-left md:text-center`}
                          />
                        </div>
                        <div className="col-span-1 md:col-span-2 space-y-1.5">
                          {index === 0 && (
                            <label className="text-[10px] font-bold text-gray-400 uppercase dark:text-slate-400 hidden md:block text-center tracking-wider">TOTAL</label>
                          )}
                          <textarea
                            value={item.total}
                            readOnly
                            placeholder="₹0.00"
                            rows={2}
                            className={`${textareaReadonlyClass} text-left md:text-center`}
                          />
                        </div>
                        {/* Source Pill Badge */}
                        <div className="col-span-1 md:col-span-1 flex flex-col items-center justify-center">
                          {index === 0 && (
                            <label className="text-[10px] font-bold text-gray-400 uppercase dark:text-slate-400 hidden md:block mb-1.5 text-center tracking-wider">SOURCE</label>
                          )}
                          <div className="flex items-center justify-center w-full min-h-[58px]">
                            <span className="inline-flex items-center justify-center px-1.5 py-0.5 bg-[#F1F5F9] dark:bg-white/5 text-[#64748B] dark:text-slate-400 text-[9px] font-bold rounded-full uppercase tracking-wider select-none border border-gray-200 dark:border-white/10 whitespace-nowrap">
                              {item.source || "Pharmacy"}
                            </span>
                          </div>
                        </div>
                        {/* Small Right-Aligned Action Button */}
                        <div className="col-span-1 flex flex-col items-end justify-center">
                          {index === 0 && (
                            <label className="text-[10px] font-bold text-gray-400 uppercase dark:text-slate-400 hidden md:block mb-1.5 text-right w-full tracking-wider">&nbsp;</label>
                          )}
                          <div className="flex items-center justify-end w-full min-h-[58px]">
                            <button
                              onClick={() => removePharmacy(index)}
                              className="flex items-center justify-center w-6 h-6 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-full transition-colors cursor-pointer border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
                            >
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-b border-[#E2E8F0] dark:border-white/10"></div>
              </>
            )}
          </div>
        </div>

        {/* Footer totals */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-end gap-4 sm:gap-6 py-4 px-6 bg-[#F8FAFC] dark:bg-white/5 border-t border-[#E2E8F0] dark:border-white/10 rounded-b-[8px] text-[14px]">
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
              <span className="text-[#218F40] font-bold">-₹{discount.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between text-[14px]">
              <span className="flex items-center gap-1 text-gray-500 dark:text-slate-400 font-medium">
                Insurance Covered
                <svg className="w-3.5 h-3.5 text-gray-400 cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
              </span>
              <span className="text-[#218F40] font-bold">-₹{insuranceCover.toFixed(2)}</span>
            </div>
          </div>

          <div className="border-b border-border my-3.5"></div>

          <div className="flex items-center justify-between text-[14px] font-bold text-[#1e293b] dark:text-white">
            <span>Net Payable</span>
            <span>₹{netPayable.toFixed(2)}</span>
          </div>
        </div>
        <div className="border-b border-border"></div>

        <div className="py-4 px-4 sm:px-6 space-y-3.5">
          <div className="flex items-center justify-between text-[14px]">
            <span className="text-gray-500 dark:text-slate-400 font-medium">Advance Paid</span>
            <span className="text-gray-500 dark:text-slate-400 font-bold">-₹{advancePaid.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between text-[14px] font-bold text-[#1e293b] dark:text-white">
            <span>Balance Due</span>
            <span className="text-[#DF8F2A] text-[18px] font-bold">₹{balanceDue.toFixed(2)}</span>
          </div>
        </div>
        <div className="border-b border-border"></div>

        {/* Progress Bar / Billing Health */}
        <div className="py-4 px-4 sm:px-6 space-y-3">
          <div className="flex items-center justify-between text-[12px] font-bold">
            <span className="text-gray-400">Billing Health</span>
            <span className={netPayable === 0 || advancePaid >= netPayable * 0.5 ? "text-[#218F40]" : "text-[#DF8F2A]"}>
              {netPayable === 0 ? "Excellent" : (advancePaid < netPayable * 0.5 ? "Low Advance" : "Healthy")}
            </span>
          </div>

          {/* Progress track */}
          <div className="w-full bg-[#FFE2C2]/50 dark:bg-amber-950/40 rounded-full h-1.5 overflow-hidden">
            <div
              className={netPayable === 0 || advancePaid >= netPayable * 0.5 ? "bg-[#218F40] h-full rounded-full transition-all duration-300" : "bg-[#DF8F2A] h-full rounded-full transition-all duration-300"}
              style={{ width: `${Math.min(100, progressPercent)}%` }}
            ></div>
          </div>

          <div className="flex items-start gap-1.5 text-[11px] text-gray-500 dark:text-slate-400 leading-normal">
            <svg
              className={netPayable === 0 || advancePaid >= netPayable * 0.5 ? "w-3.5 h-3.5 text-[#218F40] shrink-0 mt-0.5" : "w-3.5 h-3.5 text-[#DF8F2A] shrink-0 mt-0.5"}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              {netPayable === 0 || advancePaid >= netPayable * 0.5 ? (
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3" />
              ) : (
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" />
              )}
            </svg>
            <span>
              {netPayable === 0
                ? "All dues cleared successfully."
                : (advancePaid < netPayable * 0.5
                  ? "Advance is less than 50% of the net payable amount."
                  : "Advance paid meets standard health margins.")}
            </span>
          </div>
        </div>
        <div className="border-b border-[#E2E8F0] dark:border-white/10"></div>

        {/* Action Buttons */}
        <div className="py-4 px-4 sm:px-6 space-y-3">
          <button
            onClick={() => setShowCollectPayment(true)}
            className="w-full h-11 bg-[#2E37A4] hover:bg-[#2E37A4]/90 text-white font-semibold rounded-[6px] text-[13px] flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <path d="M2 10h20" />
            </svg>
            Collect Payment
          </button>

          <button className="w-full h-11 bg-[#F1F5F9] hover:bg-[#F1F5F9]/80 text-[#1e293b] font-semibold rounded-[6px] text-[13px] flex items-center justify-center gap-2 transition-all cursor-pointer border border-[#E2E8F0]">
            <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
            </svg>
            Generate Interim Bill
          </button>

          <button className="w-full h-11 bg-[#E2E8F0] hover:bg-[#E2E8F0]/80 text-[#64748B] font-medium rounded-[6px] text-[13px] flex items-center justify-center gap-2 transition-all cursor-pointer border border-[#CBD5E1]">
            <svg className="w-4 h-4 text-[#64748B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            Download Bill
          </button>
        </div>
      </div>

      {/* Collect Payment Modal Popup Overlay */}
      {showCollectPayment && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/35 backdrop-blur-[0.5px] p-4">
          <div className="bg-white dark:bg-[#101935] rounded-[12px] shadow-2xl flex flex-col md:flex-row max-w-[800px] w-full overflow-y-auto md:overflow-hidden border border-[#E2E8F0] dark:border-white/10 h-auto max-h-[95vh] md:max-h-[95vh]">

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
                  <div className="text-[13px] font-bold text-[#1e293b] dark:text-white">{patientId || "Sarah Jenkins"}</div>
                  <div className="text-[11px] text-gray-500 dark:text-slate-400">UHID: P-982342</div>
                </div>

                <div className="border-b border-[#E2E8F0] dark:border-white/10 my-4"></div>

                <div className="space-y-2.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Services</span>
                  <div className="space-y-2.5 max-h-[140px] overflow-y-auto pr-1">
                    {servicesListForModal.map((srv, sIdx) => (
                      <div key={sIdx} className="flex justify-between text-[12px] font-medium text-[#1e293b] dark:text-white">
                        <span>{srv.name}</span>
                        <span>{srv.total}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 mt-6 pt-4 border-t border-[#E2E8F0] dark:border-white/10">
                <div className="flex justify-between text-[12px] text-gray-500 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1e293b] dark:text-white">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[12px] text-gray-500 dark:text-slate-400">
                  <span>Tax (5%)</span>
                  <span className="font-semibold text-[#1e293b] dark:text-white">₹{(subtotal * 0.05).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[12px] text-gray-500 dark:text-slate-400">
                  <span>Insurance</span>
                  <span className="font-semibold text-[#218F40] dark:text-green-400">-₹{insuranceCover.toFixed(2)}</span>
                </div>
                <div className="border-b border-dashed border-[#E2E8F0] dark:border-white/10 my-1.5"></div>
                <div className="flex justify-between items-baseline">
                  <span className="text-[12px] font-bold text-[#1e293b] dark:text-white">Total Pending</span>
                  <span className="text-[18px] font-extrabold text-[#1e293b] dark:text-white">₹{balanceDue.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Collect Payment Form */}
            <div className="flex-1 p-5 flex flex-col justify-between">
              {paymentSuccess ? (
                <div className="flex flex-col items-center justify-center my-auto py-8 animate-in fade-in duration-200">
                  <div className="w-[72px] h-[72px] rounded-full bg-[#10B9811A] dark:bg-emerald-500/10 flex items-center justify-center text-[#10B981] mb-4">
                    <svg className="w-10 h-10 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-[18px] font-bold text-[#1E293B] dark:text-white">Processing Payment...</h3>
                  <p className="text-[13px] text-gray-400 dark:text-slate-500 mt-1 font-medium">Please wait while transaction is authorized.</p>
                </div>
              ) : (
                <>
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
                        {/* Switch toggler */}
                        <button
                          onClick={() => setPartialPayment(!partialPayment)}
                          className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer ${partialPayment ? "bg-[#2E37A4]" : "bg-gray-200 dark:bg-white/10"}`}
                        >
                          <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-200 ${partialPayment ? "translate-x-4" : "translate-x-0"}`} />
                        </button>
                      </div>
                    </div>

                    {/* Amount input box */}
                    <div className="relative">
                      <input
                        type="text"
                        className={`w-full h-11 px-4 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/15 rounded-[6px] text-[16px] font-bold text-[#1e293b] dark:text-white focus:border-[#2E37A4] focus:outline-none ${!partialPayment ? "bg-slate-50 dark:bg-white/5 border-[#E2E8F0] cursor-not-allowed" : "border-[#2E37A4]"}`}
                        value={payAmount}
                        disabled={!partialPayment}
                        onChange={(e) => setPayAmount(e.target.value)}
                      />
                    </div>
                    {partialPayment && (
                      <p className="text-[10px] font-bold text-[#DF8F2A] mt-1">
                        Remaining balance will be ₹{(Math.max(0, balanceDue - parseFloat(payAmount || 0))).toFixed(2)}
                      </p>
                    )}

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
                            className={`flex flex-col items-center justify-center py-2.5 border rounded-[6px] gap-1 transition-all cursor-pointer ${selectedMethod === m.id
                              ? "border-2 border-[#2E37A4] bg-[#2E37A4]/5 text-[#2E37A4] font-bold dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-400"
                              : "border-[#E2E8F0] dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-[#1e293b] dark:text-slate-300"
                              }`}
                          >
                            {m.icon}
                            <span className="text-[11px] font-medium">{m.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Card Terminal & Reference inside a premium rounded container */}
                    <div className="mt-4 bg-[#F5F8FC] dark:bg-white/5 border border-[#E2E8F0] dark:border-white/10 p-3 rounded-[8px] space-y-3">
                      {selectedMethod === "card" && (
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Card Terminal</span>
                          <div className="relative">
                            <select
                              value={terminal}
                              onChange={(e) => setTerminal(e.target.value)}
                              className="w-full h-9 pl-3 pr-10 bg-white dark:bg-white/5 border border-[#E2E8F0] dark:border-white/10 rounded-[6px] text-[12px] text-[#1e293b] dark:text-white font-medium focus:outline-none appearance-none cursor-pointer"
                            >
                              <option value="Terminal 1 (Front Desk)">Terminal 1 (Front Desk)</option>
                              <option value="Terminal 2 (Back Office)">Terminal 2 (Back Office)</option>
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                          </div>
                        </div>
                      )}

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Transaction Reference (Optional)</span>
                        <input
                          type="text"
                          placeholder="e.g. TXN-12345"
                          value={reference}
                          onChange={(e) => setReference(e.target.value)}
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
                </>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

function InvoiceGeneratedPage({
  patientId,
  subtotal,
  insuranceCover,
  discount,
  balanceDue,
  activeServices,
  onClose,
  paymentMethod,
  amountToPay,
  reference
}) {
  const tax = subtotal * 0.05;
  const grandTotal = subtotal + tax - insuranceCover;
  const amtPaid = parseFloat(amountToPay || 0);
  const remainingDue = Math.max(0, grandTotal - amtPaid);

  const displayedServices = activeServices.length > 0 ? activeServices : [
    { name: "Consultation Fee", total: "₹150.00" },
    { name: "Lab Tests (CBC)", total: "₹45.00" }
  ];

  return (
    <div className="col-span-12 p-0 bg-transparent space-y-6 font-inter animate-in fade-in duration-200">
      {/* Payment Success Banner Alert */}
      <div className="bg-[#10B9811A] dark:bg-emerald-950/20 border border-[#10B9811A] dark:border-emerald-800/30 rounded-[8px] p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#10B981] dark:bg-emerald-500/20 flex items-center justify-center text-white shrink-0">
            <svg className="w-4 h-4 text-white dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <h4 className="text-[14px] font-bold text-[#10B981] dark:text-white font-inter">Payment Collected Successfully</h4>
            <p className="text-[12px] text-[#10B981] dark:text-slate-400 mt-0.5 font-medium font-inter">
              Transaction ID: {reference || "TXN-123456789"}. Invoice has been generated.
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
        <div className="lg:col-span-3 bg-card rounded-lg border border-border p-4 sm:p-8 shadow-none space-y-8">

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
              <h4 className="text-[15px] font-extrabold text-[#1E293B] dark:text-white mt-1.5">{patientId || "Sarah Jenkins"}</h4>
              <p className="text-[12px] text-gray-500 dark:text-slate-400 mt-1 font-semibold">UHID: UHID-839211</p>
              <p className="text-[12px] text-gray-400 dark:text-slate-500 leading-relaxed mt-0.5">
                456 Patient Lane, Apt 4B<br />
                New York, NY 10002
              </p>
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-gray-400 dark:text-slate-500 tracking-wider block">PAYMENT INFO</span>
              <div className="mt-3 grid grid-cols-12 gap-x-2 gap-y-2.5 text-[12px]">
                <span className="col-span-4 text-gray-400 dark:text-slate-500 font-bold">Status:</span>
                <span className="col-span-8 font-black text-[#218F40] dark:text-emerald-400">
                  {remainingDue <= 0 ? "PAID" : "PARTIAL PAID"}
                </span>

                <span className="col-span-4 text-gray-400 dark:text-slate-500 font-bold">Method:</span>
                <span className="col-span-8 text-gray-700 dark:text-slate-300 font-medium">{paymentMethod}</span>

                <span className="col-span-4 text-gray-400 dark:text-slate-500 font-bold">Transaction:</span>
                <span className="col-span-8 text-gray-700 dark:text-slate-300 font-medium">{reference || "TXN-123456789"}</span>
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
                {displayedServices.map((srv, sIdx) => (
                  <tr key={sIdx}>
                    <td className="py-4 pr-4">
                      <div className="text-[13px] font-bold text-[#1E293B] dark:text-white">{srv.name}</div>
                    </td>
                    <td className="py-4 text-center text-[13px] font-semibold text-[#1E293B] dark:text-white">1</td>
                    <td className="py-4 text-right text-[13px] font-semibold text-[#1E293B] dark:text-white">{srv.total}</td>
                    <td className="py-4 text-right text-[13px] font-bold text-[#1E293B] dark:text-white">{srv.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Signature and Subtotals row block */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 pt-6">

            {/* Terms and Sign block */}
            <div className="flex-1 space-y-8">
              <div>
                <span className="text-[10px] font-extrabold text-gray-400 dark:text-slate-500 tracking-wider block">TERMS & CONDITIONS</span>
                <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-1.5 max-w-[340px] leading-relaxed font-inter">
                  Payment is due within 30 days. Please make checks payable to MedERP Hospital. For billing inquiries, contact billing@mederp.com.
                </p>
              </div>
              <div className="pt-10">
                <div className="w-[300px] border-t border-gray-300 dark:border-white/20 pt-2">
                  <span className="text-[11px] font-bold text-gray-400 dark:text-slate-500 block">Authorized Signature</span>
                </div>
              </div>
            </div>

            {/* Calculations Card Shaded block */}
            <div className="bg-[#F8FAFC] dark:bg-white/5 border border-[#E2E8F0] dark:border-white/10 p-5 rounded-[12px] w-full md:w-[300px] space-y-3 shadow-sm shrink-0">
              <div className="flex justify-between text-[12px] text-gray-500 dark:text-slate-400">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-800 dark:text-white">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[12px] text-gray-500 dark:text-slate-400">
                <span>Tax (5%) GST</span>
                <span className="font-semibold text-gray-800 dark:text-white">₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[12px] text-gray-500 dark:text-slate-400">
                <span>Insurance Coverage</span>
                <span className="font-bold text-[#218F40] dark:text-emerald-400">-₹{insuranceCover.toFixed(2)}</span>
              </div>

              <div className="border-t border-dashed border-[#E2E8F0] dark:border-white/10 my-2"></div>

              <div className="flex justify-between items-baseline">
                <span className="text-[12px] font-bold text-[#1E293B] dark:text-white">Grand Total</span>
                <span className="text-[18px] font-extrabold text-[#1E293B] dark:text-white">₹{grandTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[12px] font-bold text-gray-500 dark:text-slate-400">Amount Paid</span>
                <span className="text-[15px] font-extrabold text-[#218F40] dark:text-emerald-400 font-inter">₹{amtPaid.toFixed(2)}</span>
              </div>

              <div className="border-t border-dashed border-[#E2E8F0] dark:border-white/10 my-2"></div>

              <div className="flex justify-between items-baseline">
                <span className="text-[12px] font-black text-gray-700 dark:text-slate-300">Balance Due</span>
                <span className="text-[18px] font-black text-[#1E293B] dark:text-white">₹{remainingDue.toFixed(2)}</span>
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

          <button onClick={onClose} className="w-full h-10 bg-white hover:bg-gray-50 dark:bg-white/5 border border-[#E2E8F0] dark:border-white/10 text-gray-700 dark:text-white font-bold rounded-[6px] text-[13px] flex items-center justify-center gap-2 cursor-pointer transition-all mt-4 shadow-sm font-semibold">
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
