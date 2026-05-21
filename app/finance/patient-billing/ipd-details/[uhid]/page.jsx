"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  Bed, 
  Stethoscope, 
  ChevronDown, 
  ChevronUp,
  FileText,
  CreditCard,
  Plus,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { CollectPaymentDialog } from "@/components/finance/patient-billing/CollectPaymentDialog";
import { InitiateDischargeDialog } from "@/components/finance/patient-billing/InitiateDischargeDialog";

const rupee = "₹";

// Mock data - in real app, this would come from API
const patientData = {
  "T-01": {
    name: "James Wilson",
    age: "62",
    gender: "Male",
    uhid: "UHID-839211",
    photo: null,
    admissionDate: "12 Oct 2023",
    bedNo: "ICU-04",
    attendingDoctor: "Dr. Sarah Jenkins",
    diagnosis: "Acute Myocardial Infarction",
    insurance: {
      name: "BlueCross",
      provider: "BlueCross BlueShield",
      policyNo: "POL-98234-AX",
      status: "Approved",
      statusColor: "bg-[#E6F4EA] text-[#137333] border-[#CEEAD6]"
    },
    charges: [
      {
        category: "Room Charges",
        items: [
          { name: "General Ward (Oct 12 - Oct 14)", category: "Accommodation", qty: 2, price: 150.00, total: 300.00, source: "System" }
        ]
      },
      {
        category: "Doctor Visits",
        items: [
          { name: "Initial Consultation", category: "Consultation", qty: 1, price: 100.00, total: 100.00, source: "IPD" },
          { name: "Follow-up Visit", category: "Consultation", qty: 2, price: 75.00, total: 150.00, source: "IPD" }
        ]
      },
      {
        category: "Lab Tests",
        items: [
          { name: "Complete Blood Count (CBC)", category: "Pathology", qty: 1, price: 45.00, total: 45.00, source: "LAB" },
          { name: "Lipid Profile", category: "Pathology", qty: 1, price: 60.00, total: 60.00, source: "LAB" }
        ]
      },
      {
        category: "Pharmacy",
        items: [
          { name: "Paracetamol 500mg (30 tabs)", category: "Medicine", qty: 2, price: 5.00, total: 10.00, source: "Pharmacy" },
          { name: "Amoxicillin 250mg (Strip)", category: "Medicine", qty: 1, price: 12.00, total: 12.00, source: "Pharmacy" }
        ]
      }
    ],
    billing: {
      subtotal: 677.00,
      discount: 33.85,
      insuranceCovered: 400.63,
      netPayable: 243.15,
      advancePaid: 100.00,
      balanceDue: 143.15,
      totalItems: 7
    }
  }
};

export default function IPDPatientBillingDetails() {
  const router = useRouter();
  const params = useParams();
  const uhid = params.uhid;
  
  const patient = patientData[uhid] || patientData["T-01"];

  const [expandedCategories, setExpandedCategories] = useState({
    "Room Charges": true,
    "Doctor Visits": true,
    "Lab Tests": true,
    "Pharmacy": true
  });
  const [showCollectPaymentDialog, setShowCollectPaymentDialog] = useState(false);
  const [showInitiateDischargeDialog, setShowInitiateDischargeDialog] = useState(false);

  // Stateful charges list
  const [charges, setCharges] = useState(patient.charges);
  const [advancePaid, setAdvancePaid] = useState(100.00);
  
  // State for inline add form
  const [activeAddFormCategory, setActiveAddFormCategory] = useState(null);
  const [newChargeName, setNewChargeName] = useState("");
  const [newChargeCategory, setNewChargeCategory] = useState("");
  const [newChargeQty, setNewChargeQty] = useState("");
  const [newChargePrice, setNewChargePrice] = useState("");
  const [newChargeTotal, setNewChargeTotal] = useState("");

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleQtyChange = (val) => {
    setNewChargeQty(val);
    const q = parseInt(val);
    const p = parseFloat(newChargePrice);
    if (!isNaN(q) && !isNaN(p)) {
      setNewChargeTotal((q * p).toFixed(2));
    } else {
      setNewChargeTotal("");
    }
  };

  const handlePriceChange = (val) => {
    setNewChargePrice(val);
    const q = parseInt(newChargeQty);
    const p = parseFloat(val);
    if (!isNaN(q) && !isNaN(p)) {
      setNewChargeTotal((q * p).toFixed(2));
    } else {
      setNewChargeTotal("");
    }
  };

  const handleToggleAddForm = (category) => {
    if (activeAddFormCategory === category) {
      setActiveAddFormCategory(null);
    } else {
      setActiveAddFormCategory(category);
      setNewChargeCategory("");
      setNewChargeName("");
      setNewChargeQty("");
      setNewChargePrice("");
      setNewChargeTotal("");
    }
  };

  const handleCancelAddForm = () => {
    setActiveAddFormCategory(null);
    setNewChargeName("");
    setNewChargeCategory("");
    setNewChargeQty("");
    setNewChargePrice("");
    setNewChargeTotal("");
  };

  const handleAddCharge = (categoryName) => {
    if (!newChargeName.trim()) {
      alert("Please enter a name / description.");
      return;
    }
    if (!newChargeCategory.trim()) {
      alert("Please enter a category.");
      return;
    }
    const parsedPrice = parseFloat(newChargePrice);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      alert("Please enter a valid price.");
      return;
    }
    const parsedQty = parseInt(newChargeQty);
    if (isNaN(parsedQty) || parsedQty <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }

    // Determine target category section dynamically based on user input
    let targetSection = categoryName; // fallback
    const userInputCat = newChargeCategory.trim().toLowerCase();
    if (userInputCat.includes("accommodation") || userInputCat.includes("room") || userInputCat.includes("ward")) {
      targetSection = "Room Charges";
    } else if (userInputCat.includes("consultation") || userInputCat.includes("doctor") || userInputCat.includes("visit")) {
      targetSection = "Doctor Visits";
    } else if (userInputCat.includes("pathology") || userInputCat.includes("lab") || userInputCat.includes("test")) {
      targetSection = "Lab Tests";
    } else if (userInputCat.includes("medicine") || userInputCat.includes("pharmacy") || userInputCat.includes("drug")) {
      targetSection = "Pharmacy";
    }

    const newItem = {
      name: newChargeName,
      category: newChargeCategory,
      qty: parsedQty,
      price: parsedPrice,
      total: parseFloat(newChargeTotal) || (parsedQty * parsedPrice),
      source: targetSection === "Room Charges" ? "System" : targetSection === "Doctor Visits" ? "IPD" : targetSection === "Lab Tests" ? "LAB" : "Pharmacy"
    };

    setCharges(prevCharges => {
      return prevCharges.map(section => {
        if (section.category === targetSection) {
          return {
            ...section,
            items: [...section.items, newItem]
          };
        }
        return section;
      });
    });

    handleCancelAddForm();
  };

  // Dynamic billing calculations
  const subtotal = charges.reduce((acc, section) => {
    return acc + section.items.reduce((secAcc, item) => secAcc + item.total, 0);
  }, 0);
  
  const totalItems = charges.reduce((acc, section) => acc + section.items.length, 0);
  const discount = subtotal * 0.05; // 5% discount
  const insuranceCovered = 400.00; // Mock Insurance amount matching screenshot
  const netPayable = Math.max(0, subtotal - discount - insuranceCovered);
  const balanceDue = netPayable - advancePaid;

  const advancePercentage = netPayable > 0 ? (advancePaid / netPayable) * 100 : 100;
  const isLowAdvance = advancePercentage < 50;

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-[#0A0F1D]">
      {/* Header */}
      <div className="bg-white dark:bg-[#101935] border-b border-[#E7E8EB] dark:border-white/10 px-[20px] py-[16px]">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-[16px]">
          <div className="flex items-center gap-[12px]">
            <button
              onClick={() => router.push('/finance/patient-billing')}
              className="flex items-center justify-center w-[36px] h-[36px] rounded-[5px] border border-[#E7E8EB] text-slate-600 hover:bg-[#F8F9FC] transition dark:border-white/10 dark:text-slate-400 dark:hover:bg-white/5"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h1 className="text-[18px] font-bold text-slate-800 dark:text-white">Patient Billing Details</h1>
              <p className="text-[12px] text-slate-500 mt-[2px]">
                Patient Billing &gt; IPD Running Bills &gt; {patient.name}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-[12px]">
            <button 
              onClick={() => setShowInitiateDischargeDialog(true)}
              className="h-[38px] px-[16px] rounded-[5px] border border-[#2E37A4] bg-white text-[13px] font-semibold text-[#2E37A4] hover:bg-[#2E37A4]/5 transition dark:bg-[#101935] flex items-center justify-center gap-[6px]"
            >
              <FileText className="h-4 w-4" />
              Initiate Discharge
            </button>
            <button 
              onClick={() => {
                setExpandedCategories(prev => ({
                  ...prev,
                  "Room Charges": true
                }));
                handleToggleAddForm("Room Charges");
              }}
              className="h-[38px] px-[16px] rounded-[5px] border border-[#2E37A4] bg-white text-[13px] font-semibold text-[#2E37A4] hover:bg-[#2E37A4]/5 transition dark:bg-[#101935] flex items-center justify-center gap-[6px]"
            >
              <Plus className="h-4 w-4" />
              Add Charge
            </button>
            <button 
              onClick={() => setShowCollectPaymentDialog(true)}
              className="h-[38px] px-[16px] rounded-[5px] bg-[#2E37A4] text-[13px] font-semibold text-white hover:bg-[#2E37A4]/90 transition flex items-center justify-center gap-[6px]"
            >
              <CreditCard className="h-4 w-4" />
              Collect Payment
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto p-[20px] space-y-[20px]">
        {/* Top Card: Patient Info & Insurance Details Combined */}
        <div className="bg-white dark:bg-[#101935] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 p-[20px]">
          <div className="flex flex-col lg:flex-row gap-[20px] justify-between">
            {/* Patient Info (Left Part) */}
            <div className="flex-1 flex flex-col sm:flex-row gap-[20px]">
              {/* Avatar */}
              <div className="w-[80px] h-[80px] rounded-full bg-gradient-to-br from-[#2E37A4] to-[#4F5BD5] flex items-center justify-center text-white text-[28px] font-bold shrink-0 overflow-hidden">
                {patient.name.split(' ').map(n => n[0]).join('')}
              </div>
              {/* Patient Details */}
              <div className="flex-1 space-y-[16px]">
                <div className="flex items-baseline gap-[12px] flex-wrap">
                  <h2 className="text-[20px] font-bold text-slate-800 dark:text-white">{patient.name}</h2>
                  <span className="text-[13px] text-slate-500 dark:text-slate-400">{patient.age} yrs • {patient.gender}</span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-[20px]">
                  <div>
                    <p className="text-[11px] font-semibold text-slate-400">Uhid</p>
                    <p className="text-[13px] font-bold text-slate-800 dark:text-white mt-[2px]">{patient.uhid}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-400">Bed No.</p>
                    <p className="text-[13px] font-bold text-slate-800 dark:text-white mt-[2px]">{patient.bedNo}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-400">Admission Date</p>
                    <p className="text-[13px] font-bold text-slate-800 dark:text-white mt-[2px]">{patient.admissionDate}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px] pt-[16px] border-t border-[#E7E8EB] dark:border-white/10">
                  <div>
                    <p className="text-[11px] font-semibold text-slate-400">Attending Doctor</p>
                    <p className="text-[13px] font-bold text-slate-800 dark:text-white mt-[2px]">{patient.attendingDoctor}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-400">Diagnosis</p>
                    <p className="text-[13px] font-bold text-slate-800 dark:text-white mt-[2px]">{patient.diagnosis}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vertical Divider (Desktop Only) */}
            <div className="hidden lg:block w-[1px] bg-[#E7E8EB] dark:bg-white/10 self-stretch mx-[10px]" />

            {/* Insurance Details (Right Part) */}
            <div className="w-full lg:w-[420px] shrink-0 flex flex-col justify-between gap-[16px]">
              <div>
                <div className="flex items-center gap-[8px] mb-[16px]">
                  <h3 className="text-[15px] font-bold text-slate-800 dark:text-white">Insurance Details</h3>
                  <span className="px-[8px] py-[2px] rounded-[4px] bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6] text-[10px] font-bold">
                    Active
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-[20px]">
                  <div>
                    <p className="text-[11px] font-semibold text-slate-400">Insurance Name</p>
                    <p className="text-[13px] font-bold text-slate-800 dark:text-white mt-[2px]">{patient.insurance.name}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-400">Provider</p>
                    <p className="text-[13px] font-bold text-slate-800 dark:text-white mt-[2px]">{patient.insurance.provider}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-[20px] pt-[16px] border-t border-[#E7E8EB] dark:border-white/10">
                <div>
                  <p className="text-[11px] font-semibold text-slate-400">Policy No.</p>
                  <p className="text-[13px] font-bold text-slate-800 dark:text-white mt-[2px]">{patient.insurance.policyNo}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-400">Status</p>
                  <p className="text-[13px] font-bold text-green-600 dark:text-green-400 mt-[2px]">Approved</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Grid: Charges (2/3) + Billing Summary (1/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[20px] items-start">
          {/* Charges Card (2/3 width) */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-[#101935] rounded-[5px] border border-[#E7E8EB] dark:border-white/10">
              <div className="px-[20px] py-[16px] border-b border-[#E7E8EB] dark:border-white/10">
                <h3 className="text-[15px] font-bold text-slate-800 dark:text-white">Charges</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="border-b border-[#E7E8EB] dark:border-white/10">
                      <th className="px-[20px] py-[12px] text-left text-[11px] font-semibold text-slate-500 dark:text-slate-400">Service Name</th>
                      <th className="px-[20px] py-[12px] text-left text-[11px] font-semibold text-slate-500 dark:text-slate-400">Category</th>
                      <th className="px-[20px] py-[12px] text-center text-[11px] font-semibold text-slate-500 dark:text-slate-400">Qty</th>
                      <th className="px-[20px] py-[12px] text-right text-[11px] font-semibold text-slate-500 dark:text-slate-400">Price</th>
                      <th className="px-[20px] py-[12px] text-right text-[11px] font-semibold text-slate-500 dark:text-slate-400">Total</th>
                      <th className="px-[20px] py-[12px] text-center text-[11px] font-semibold text-slate-500 dark:text-slate-400">Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {charges.map((section, idx) => (
                      <React.Fragment key={idx}>
                        {/* Section Header Row */}
                        <tr className="bg-[#F8F9FC] dark:bg-white/5 border-b border-[#E7E8EB] dark:border-white/10">
                          <td colSpan={6} className="px-[20px] py-[10px]">
                            <div className="flex items-center justify-between">
                              <button
                                onClick={() => toggleCategory(section.category)}
                                className="flex items-center gap-[8px] text-[13px] font-bold text-slate-800 dark:text-white hover:text-slate-600 dark:hover:text-white/80 transition"
                              >
                                {expandedCategories[section.category] ? (
                                  <ChevronUp className="h-4 w-4 text-slate-400" />
                                ) : (
                                  <ChevronDown className="h-4 w-4 text-slate-400" />
                                )}
                                <span>{section.category}</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                        
                        {/* Section Items */}
                        {expandedCategories[section.category] && section.items.map((item, itemIdx) => (
                          <tr key={itemIdx} className="border-b border-[#E7E8EB] dark:border-white/10 hover:bg-[#F8F9FC] dark:hover:bg-white/5 transition">
                            <td className="px-[20px] py-[12px] font-medium text-slate-800 dark:text-white">{item.name}</td>
                            <td className="px-[20px] py-[12px] text-slate-600 dark:text-slate-400">{item.category}</td>
                            <td className="px-[20px] py-[12px] text-center text-slate-600 dark:text-slate-400">{item.qty}</td>
                            <td className="px-[20px] py-[12px] text-right text-slate-600 dark:text-slate-400">{rupee}{item.price.toFixed(2)}</td>
                            <td className="px-[20px] py-[12px] text-right font-semibold text-slate-800 dark:text-white">{rupee}{item.total.toFixed(2)}</td>
                            <td className="px-[20px] py-[12px] text-center">
                              <span className="inline-block px-[8px] py-[2px] rounded-[4px] bg-[#F1F3F4] dark:bg-white/10 text-[11px] font-medium text-slate-600 dark:text-slate-400">
                                {item.source}
                              </span>
                            </td>
                          </tr>
                        ))}

                        {/* Inline Add Form Row */}
                        {expandedCategories[section.category] && activeAddFormCategory === section.category && (
                          <tr className="flex flex-col gap-[20px] p-[20px] md:table-row md:p-0 md:gap-0 border-b border-[#E7E8EB] dark:border-white/10 bg-white dark:bg-[#101935]">
                            {/* Service Name / Ward Name */}
                            <td className="block w-full p-0 md:table-cell md:px-[20px] md:py-[12px] md:align-top">
                              <div className="space-y-[6px]">
                                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                                  {section.category === "Room Charges" ? "Ward Name" : "Service Name"}
                                </label>
                                <input
                                  type="text"
                                  value={newChargeName}
                                  onChange={(e) => setNewChargeName(e.target.value)}
                                  placeholder=""
                                  className="w-full h-[38px] px-[12px] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 bg-white dark:bg-[#101935] text-[13px] text-slate-800 dark:text-white outline-none focus:border-[#2E37A4] transition"
                                />
                              </div>
                            </td>

                            {/* Category */}
                            <td className="block w-full p-0 md:table-cell md:px-[20px] md:py-[12px] md:align-top">
                              <div className="space-y-[6px]">
                                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                                  Category
                                </label>
                                <input
                                  type="text"
                                  value={newChargeCategory}
                                  onChange={(e) => setNewChargeCategory(e.target.value)}
                                  placeholder=""
                                  className="w-full h-[38px] px-[12px] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 bg-white dark:bg-[#101935] text-[13px] text-slate-800 dark:text-white outline-none focus:border-[#2E37A4] transition"
                                />
                              </div>
                            </td>

                            {/* Qty */}
                            <td className="block w-full p-0 md:table-cell md:px-[20px] md:py-[12px] md:align-top md:w-[90px]">
                              <div className="space-y-[6px]">
                                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block text-left md:text-center">
                                  Qty
                                </label>
                                <input
                                  type="text"
                                  value={newChargeQty}
                                  onChange={(e) => handleQtyChange(e.target.value)}
                                  placeholder=""
                                  className="w-full h-[38px] px-[8px] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 bg-white dark:bg-[#101935] text-[13px] text-left md:text-center text-slate-800 dark:text-white outline-none focus:border-[#2E37A4] transition"
                                />
                              </div>
                            </td>

                            {/* Price */}
                            <td className="block w-full p-0 md:table-cell md:px-[20px] md:py-[12px] md:align-top md:w-[120px]">
                              <div className="space-y-[6px]">
                                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block text-left md:text-right">
                                  Price
                                </label>
                                <input
                                  type="text"
                                  value={newChargePrice}
                                  onChange={(e) => handlePriceChange(e.target.value)}
                                  placeholder=""
                                  className="w-full h-[38px] px-[12px] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 bg-white dark:bg-[#101935] text-[13px] text-left md:text-right text-slate-800 dark:text-white outline-none focus:border-[#2E37A4] transition"
                                />
                              </div>
                            </td>

                            {/* Total */}
                            <td className="block w-full p-0 md:table-cell md:px-[20px] md:py-[12px] md:align-top md:w-[120px]">
                              <div className="space-y-[6px]">
                                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block text-left md:text-right">
                                  Total
                                </label>
                                <input
                                  type="text"
                                  value={newChargeTotal}
                                  readOnly
                                  className="w-full h-[38px] px-[12px] rounded-[5px] border border-[#E7E8EB]/50 dark:border-white/5 bg-[#F8F9FC] dark:bg-white/5 text-[13px] text-left md:text-right font-semibold text-slate-800 dark:text-white outline-none cursor-not-allowed"
                                />
                              </div>
                            </td>

                            {/* Actions / Source */}
                            <td className="block w-full p-0 md:table-cell md:px-[20px] md:py-[12px] md:align-top">
                              <div className="space-y-[6px]">
                                <label className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 block md:text-transparent md:select-none">
                                  Actions
                                </label>
                                <div className="flex items-center gap-[8px] justify-start md:justify-center">
                                  <button
                                    onClick={() => handleAddCharge(section.category)}
                                    className="h-[38px] px-[16px] rounded-[5px] bg-[#2E37A4] text-[13px] font-semibold text-white hover:bg-[#2E37A4]/90 transition whitespace-nowrap"
                                  >
                                    Add Ward
                                  </button>
                                  <button
                                    onClick={() => handleCancelAddForm()}
                                    className="h-[38px] px-[12px] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 bg-white dark:bg-[#101935] text-[13px] font-semibold text-slate-600 dark:text-slate-400 hover:bg-[#F8F9FC] dark:hover:bg-white/5 transition"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total Summary Row */}
              <div className="p-[20px] border-t border-[#E7E8EB] dark:border-white/10 bg-[#F8F9FC]/30 dark:bg-white/[0.01]">
                <div className="flex items-center justify-end gap-[24px]">
                  <span className="text-[12px] font-medium text-slate-500 dark:text-slate-400">Total Items: {totalItems}</span>
                  <div className="flex items-center gap-[8px]">
                    <span className="text-[12px] font-medium text-slate-500 dark:text-slate-400">Subtotal:</span>
                    <span className="text-[15px] font-bold text-slate-800 dark:text-white">{rupee}{subtotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Billing Summary Card (1/3 width) */}
          <div className="bg-white dark:bg-[#101935] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 p-[20px] space-y-[20px]">
            <div>
              <h3 className="text-[12px] font-bold text-slate-400 mb-[4px]">Gross Total</h3>
              <p className="text-[32px] font-bold text-[#2E37A4] dark:text-[#9EA8FF]">{rupee}{subtotal.toFixed(2)}</p>
            </div>
            
            <div className="space-y-[12px] pb-[20px] border-b border-[#E7E8EB] dark:border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-slate-600 dark:text-slate-400">Discounts (5%)</span>
                <span className="text-[13px] font-semibold text-green-600 dark:text-green-400">-{rupee}{discount.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-[6px]">
                  <span className="text-[13px] font-medium text-slate-600 dark:text-slate-400">Insurance Covered</span>
                  <Info className="h-3.5 w-3.5 text-slate-400 cursor-pointer hover:text-slate-600 transition" />
                </div>
                <span className="text-[13px] font-semibold text-green-600 dark:text-green-400">-{rupee}{insuranceCovered.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-[12px] py-[4px] border-b border-[#E7E8EB] dark:border-white/10 pb-[20px]">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-slate-800 dark:text-white">Net Payable</span>
                <span className="text-[15px] font-bold text-slate-800 dark:text-white">{rupee}{netPayable.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-slate-600 dark:text-slate-400">Advance Paid</span>
                <span className="text-[13px] font-semibold text-green-600 dark:text-green-400">-{rupee}{advancePaid.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-[20px] pt-[4px]">
              <div className="flex items-center justify-between">
                <span className="text-[15px] font-bold text-slate-800 dark:text-white">Balance Due</span>
                <span className="text-[20px] font-bold text-[#D97706]">{rupee}{balanceDue.toFixed(2)}</span>
              </div>
              
              {/* Billing Health box */}
              <div className={cn(
                "rounded-[5px] p-[12px] border",
                isLowAdvance 
                  ? "bg-[#FEF7E0] border-[#FEEFC3] text-[#B06000]" 
                  : "bg-[#E6F4EA] border-[#CEEAD6] text-[#137333]"
              )}>
                <div className="flex items-center justify-between mb-[4px]">
                  <p className="text-[11px] font-semibold">Billing Health</p>
                  <p className="text-[11px] font-bold">
                    {isLowAdvance ? "Low Advance" : "Healthy"}
                  </p>
                </div>
                <div className="w-full h-[6px] rounded-full overflow-hidden mb-[6px] bg-slate-100 dark:bg-white/10">
                  <div 
                    className={cn("h-full rounded-full transition-all duration-300", isLowAdvance ? "bg-[#D97706]" : "bg-[#137333]")} 
                    style={{ width: `${Math.min(100, advancePercentage)}%` }}
                  />
                </div>
                <p className="text-[11px]">
                  {isLowAdvance 
                    ? `⚠ Advance is less than 50% of the net payable amount.` 
                    : `✔ Advance is sufficient (${advancePercentage.toFixed(0)}% of net payable).`
                  }
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-[12px] pt-[8px]">
                <button
                  onClick={() => setShowCollectPaymentDialog(true)}
                  className="w-full h-[40px] rounded-[5px] bg-[#2E37A4] text-[13px] font-semibold text-white hover:bg-[#2E37A4]/90 transition flex items-center justify-center gap-[8px]"
                >
                  <CreditCard className="h-4 w-4" />
                  Collect Payment
                </button>
                <button
                  onClick={() => router.push('/finance/patient-billing/create?uhid=' + (uhid || 'T-01'))}
                  className="w-full h-[40px] rounded-[5px] bg-[#F1F3F9] dark:bg-white/10 text-[13px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-[#F1F3F9]/80 dark:hover:bg-white/15 transition flex items-center justify-center gap-[8px]"
                >
                  <FileText className="h-4 w-4" />
                  Generate Interim Bill
                </button>
                <button
                  className="w-full h-[40px] rounded-[5px] border border-[#E7E8EB] dark:border-white/10 bg-white dark:bg-[#101935] text-[13px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-[#F8F9FC] dark:hover:bg-white/5 transition flex items-center justify-center gap-[8px]"
                >
                  <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Bill
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Collect Payment Dialog */}
      <CollectPaymentDialog 
        open={showCollectPaymentDialog} 
        onOpenChange={setShowCollectPaymentDialog}
        patientData={{
          ...patient,
          billing: {
            subtotal,
            discount,
            insuranceCovered,
            netPayable,
            advancePaid,
            balanceDue,
            totalItems
          }
        }}
        onPaymentConfirm={(amount) => {
          setAdvancePaid(prev => prev + amount);
        }}
      />

      {/* Initiate Discharge Dialog */}
      <InitiateDischargeDialog
        open={showInitiateDischargeDialog}
        onOpenChange={setShowInitiateDischargeDialog}
        patientData={{
          ...patient,
          billing: {
            subtotal,
            discount,
            insuranceCovered,
            netPayable,
            advancePaid,
            balanceDue,
            totalItems
          }
        }}
        onGoToPayment={() => setShowCollectPaymentDialog(true)}
      />
    </div>
  );
}
