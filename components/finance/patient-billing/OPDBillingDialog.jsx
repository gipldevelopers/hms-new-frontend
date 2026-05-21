"use client";

import React, { useState } from "react";
import { X, Search, Calendar, User, CreditCard, FileText, Plus, Trash2, Pill, FlaskConical } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const rupee = "₹";

export function OPDBillingDialog({ open, onOpenChange }) {
  const [patientSearch, setPatientSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [consultationFee, setConsultationFee] = useState("500");
  const [medicines, setMedicines] = useState([
    { id: 1, name: "", quantity: 1, rate: "", amount: "" }
  ]);
  const [tests, setTests] = useState([
    { id: 1, name: "", rate: "", amount: "" }
  ]);
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const mockPatients = [
    { uhid: "P-001", name: "Sarah Connor", age: "45", gender: "Female", phone: "+91 98765 43210" },
    { uhid: "P-002", name: "John Doe", age: "32", gender: "Male", phone: "+91 98765 43211" },
    { uhid: "P-003", name: "Alice Smith", age: "28", gender: "Female", phone: "+91 98765 43212" },
  ];

  const filteredPatients = mockPatients.filter(p =>
    p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
    p.uhid.toLowerCase().includes(patientSearch.toLowerCase())
  );

  const handleAddMedicine = () => {
    setMedicines([...medicines, { id: Date.now(), name: "", quantity: 1, rate: "", amount: "" }]);
  };

  const handleRemoveMedicine = (id) => {
    if (medicines.length > 1) {
      setMedicines(medicines.filter(item => item.id !== id));
    }
  };

  const handleMedicineChange = (id, field, value) => {
    setMedicines(medicines.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === "quantity" || field === "rate") {
          const qty = parseFloat(updated.quantity) || 0;
          const rate = parseFloat(updated.rate) || 0;
          updated.amount = (qty * rate).toFixed(2);
        }
        return updated;
      }
      return item;
    }));
  };

  const handleAddTest = () => {
    setTests([...tests, { id: Date.now(), name: "", rate: "", amount: "" }]);
  };

  const handleRemoveTest = (id) => {
    if (tests.length > 1) {
      setTests(tests.filter(item => item.id !== id));
    }
  };

  const handleTestChange = (id, field, value) => {
    setTests(tests.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === "rate") {
          updated.amount = value;
        }
        return updated;
      }
      return item;
    }));
  };

  const consultationAmount = parseFloat(consultationFee) || 0;
  const medicinesTotal = medicines.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  const testsTotal = tests.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  const subtotal = consultationAmount + medicinesTotal + testsTotal;
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + tax;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[900px] max-h-[90vh] p-0 gap-0 border border-[#E7E8EB] rounded-[5px] bg-white dark:border-white/10 dark:bg-[#101935] overflow-hidden">
        <DialogTitle className="sr-only">OPD Billing</DialogTitle>
        
        {/* Header */}
        <div className="flex items-center justify-between px-[20px] py-[16px] border-b border-[#E7E8EB] dark:border-white/10">
          <h2 className="text-[18px] font-bold text-slate-800 dark:text-white">OPD Billing</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-[5px] p-1.5 text-slate-400 hover:bg-[#F8F9FC] hover:text-slate-700 dark:hover:bg-white/10 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-[20px] space-y-[20px]">
          {/* Patient Search */}
          <div className="space-y-[8px]">
            <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Search Patient</label>
            <div className="relative">
              <Search className="absolute left-[14px] top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                placeholder="Search by name or UHID..."
                className="w-full h-[44px] pl-[40px] pr-[14px] rounded-[5px] border border-[#E7E8EB] bg-white text-[13px] text-slate-800 placeholder-slate-400 outline-none focus:border-[#2E37A4] transition dark:bg-[#101935] dark:border-white/10 dark:text-white"
              />
            </div>
            
            {/* Patient Search Results */}
            {patientSearch && filteredPatients.length > 0 && (
              <div className="border border-[#E7E8EB] rounded-[5px] bg-white dark:border-white/10 dark:bg-[#101935] max-h-[200px] overflow-y-auto">
                {filteredPatients.map((patient) => (
                  <button
                    key={patient.uhid}
                    onClick={() => {
                      setSelectedPatient(patient);
                      setPatientSearch(patient.name);
                    }}
                    className="w-full px-[14px] py-[12px] text-left hover:bg-[#F8F9FC] dark:hover:bg-white/5 transition border-b border-[#E7E8EB] dark:border-white/10 last:border-0"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[13px] font-semibold text-slate-800 dark:text-white">{patient.name}</p>
                        <p className="text-[12px] text-slate-500">UHID: {patient.uhid} • {patient.gender} • {patient.age} Yrs</p>
                      </div>
                      <User className="h-4 w-4 text-slate-400" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected Patient Info */}
          {selectedPatient && (
            <div className="rounded-[5px] border border-[#E7E8EB] bg-[#F8F9FC] p-[16px] dark:border-white/10 dark:bg-white/5">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-[16px]">
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 mb-[4px]">Patient Name</p>
                  <p className="text-[13px] font-bold text-slate-800 dark:text-white">{selectedPatient.name}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 mb-[4px]">UHID</p>
                  <p className="text-[13px] font-bold text-slate-800 dark:text-white">{selectedPatient.uhid}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 mb-[4px]">Age / Gender</p>
                  <p className="text-[13px] font-bold text-slate-800 dark:text-white">{selectedPatient.age} / {selectedPatient.gender}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 mb-[4px]">Phone</p>
                  <p className="text-[13px] font-bold text-slate-800 dark:text-white">{selectedPatient.phone}</p>
                </div>
              </div>
            </div>
          )}

          {/* Visit Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[20px]">
            <div className="space-y-[8px]">
              <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Visit Date</label>
              <div className="relative">
                <Calendar className="absolute left-[14px] top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="date"
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="w-full h-[44px] pl-[40px] pr-[14px] rounded-[5px] border border-[#E7E8EB] bg-white text-[13px] text-slate-800 outline-none focus:border-[#2E37A4] transition dark:bg-[#101935] dark:border-white/10 dark:text-white"
                />
              </div>
            </div>
            <div className="space-y-[8px]">
              <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Bill Number</label>
              <input
                type="text"
                defaultValue="OPD-2024-001"
                className="w-full h-[44px] px-[14px] rounded-[5px] border border-[#E7E8EB] bg-[#F8F9FC] text-[13px] text-slate-500 outline-none dark:bg-white/5 dark:border-white/10 dark:text-slate-400"
                readOnly
              />
            </div>
            <div className="space-y-[8px]">
              <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Doctor Name</label>
              <input
                type="text"
                placeholder="Enter doctor name"
                className="w-full h-[44px] px-[14px] rounded-[5px] border border-[#E7E8EB] bg-white text-[13px] text-slate-800 placeholder-slate-400 outline-none focus:border-[#2E37A4] transition dark:bg-[#101935] dark:border-white/10 dark:text-white"
              />
            </div>
          </div>

          {/* Consultation Fee */}
          <div className="space-y-[8px]">
            <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Consultation Fee</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px]">
              <input
                type="number"
                value={consultationFee}
                onChange={(e) => setConsultationFee(e.target.value)}
                placeholder="Enter consultation fee"
                className="w-full h-[44px] px-[14px] rounded-[5px] border border-[#E7E8EB] bg-white text-[13px] text-slate-800 placeholder-slate-400 outline-none focus:border-[#2E37A4] transition dark:bg-[#101935] dark:border-white/10 dark:text-white"
              />
              <input
                type="text"
                value={consultationFee ? `${rupee}${parseFloat(consultationFee).toFixed(2)}` : ""}
                readOnly
                placeholder={`${rupee}0.00`}
                className="w-full h-[44px] px-[14px] rounded-[5px] border border-[#E7E8EB] bg-[#F8F9FC] text-[13px] text-slate-700 font-semibold outline-none dark:bg-white/5 dark:border-white/10 dark:text-white"
              />
            </div>
          </div>

          {/* Medicines */}
          <div className="space-y-[12px]">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-[8px]">
                <Pill className="h-4 w-4 text-[#2E37A4]" />
                Medicines
              </label>
              <button
                onClick={handleAddMedicine}
                className="flex items-center gap-[6px] text-[12px] font-semibold text-[#2E37A4] hover:text-[#2E37A4]/80 transition"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Medicine
              </button>
            </div>

            <div className="space-y-[12px]">
              {medicines.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-[12px] items-start">
                  <div className="col-span-12 sm:col-span-5">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleMedicineChange(item.id, "name", e.target.value)}
                      placeholder="Medicine name"
                      className="w-full h-[44px] px-[14px] rounded-[5px] border border-[#E7E8EB] bg-white text-[13px] text-slate-800 placeholder-slate-400 outline-none focus:border-[#2E37A4] transition dark:bg-[#101935] dark:border-white/10 dark:text-white"
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleMedicineChange(item.id, "quantity", e.target.value)}
                      placeholder="Qty"
                      min="1"
                      className="w-full h-[44px] px-[14px] rounded-[5px] border border-[#E7E8EB] bg-white text-[13px] text-slate-800 placeholder-slate-400 outline-none focus:border-[#2E37A4] transition dark:bg-[#101935] dark:border-white/10 dark:text-white"
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) => handleMedicineChange(item.id, "rate", e.target.value)}
                      placeholder="Rate"
                      className="w-full h-[44px] px-[14px] rounded-[5px] border border-[#E7E8EB] bg-white text-[13px] text-slate-800 placeholder-slate-400 outline-none focus:border-[#2E37A4] transition dark:bg-[#101935] dark:border-white/10 dark:text-white"
                    />
                  </div>
                  <div className="col-span-3 sm:col-span-2">
                    <input
                      type="text"
                      value={item.amount ? `${rupee}${item.amount}` : ""}
                      readOnly
                      placeholder={`${rupee}0.00`}
                      className="w-full h-[44px] px-[14px] rounded-[5px] border border-[#E7E8EB] bg-[#F8F9FC] text-[13px] text-slate-700 font-semibold outline-none dark:bg-white/5 dark:border-white/10 dark:text-white"
                    />
                  </div>
                  <div className="col-span-1 flex items-center justify-center">
                    <button
                      onClick={() => handleRemoveMedicine(item.id)}
                      disabled={medicines.length === 1}
                      className={cn(
                        "h-[44px] w-[44px] rounded-[5px] border flex items-center justify-center transition",
                        medicines.length === 1
                          ? "border-[#E7E8EB] text-slate-300 cursor-not-allowed dark:border-white/10"
                          : "border-[#E7E8EB] text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500 dark:border-white/10 dark:hover:bg-red-500/10"
                      )}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lab Tests */}
          <div className="space-y-[12px]">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-[8px]">
                <FlaskConical className="h-4 w-4 text-[#2E37A4]" />
                Lab Tests
              </label>
              <button
                onClick={handleAddTest}
                className="flex items-center gap-[6px] text-[12px] font-semibold text-[#2E37A4] hover:text-[#2E37A4]/80 transition"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Test
              </button>
            </div>

            <div className="space-y-[12px]">
              {tests.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-[12px] items-start">
                  <div className="col-span-12 sm:col-span-7">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleTestChange(item.id, "name", e.target.value)}
                      placeholder="Test name"
                      className="w-full h-[44px] px-[14px] rounded-[5px] border border-[#E7E8EB] bg-white text-[13px] text-slate-800 placeholder-slate-400 outline-none focus:border-[#2E37A4] transition dark:bg-[#101935] dark:border-white/10 dark:text-white"
                    />
                  </div>
                  <div className="col-span-5 sm:col-span-2">
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) => handleTestChange(item.id, "rate", e.target.value)}
                      placeholder="Rate"
                      className="w-full h-[44px] px-[14px] rounded-[5px] border border-[#E7E8EB] bg-white text-[13px] text-slate-800 placeholder-slate-400 outline-none focus:border-[#2E37A4] transition dark:bg-[#101935] dark:border-white/10 dark:text-white"
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-2">
                    <input
                      type="text"
                      value={item.amount ? `${rupee}${item.amount}` : ""}
                      readOnly
                      placeholder={`${rupee}0.00`}
                      className="w-full h-[44px] px-[14px] rounded-[5px] border border-[#E7E8EB] bg-[#F8F9FC] text-[13px] text-slate-700 font-semibold outline-none dark:bg-white/5 dark:border-white/10 dark:text-white"
                    />
                  </div>
                  <div className="col-span-1 flex items-center justify-center">
                    <button
                      onClick={() => handleRemoveTest(item.id)}
                      disabled={tests.length === 1}
                      className={cn(
                        "h-[44px] w-[44px] rounded-[5px] border flex items-center justify-center transition",
                        tests.length === 1
                          ? "border-[#E7E8EB] text-slate-300 cursor-not-allowed dark:border-white/10"
                          : "border-[#E7E8EB] text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500 dark:border-white/10 dark:hover:bg-red-500/10"
                      )}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bill Summary */}
          <div className="rounded-[5px] border border-[#E7E8EB] bg-[#F8F9FC] p-[16px] space-y-[12px] dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-slate-600 dark:text-slate-400">Consultation Fee</span>
              <span className="text-[13px] font-semibold text-slate-800 dark:text-white">{rupee}{consultationAmount.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-slate-600 dark:text-slate-400">Medicines Total</span>
              <span className="text-[13px] font-semibold text-slate-800 dark:text-white">{rupee}{medicinesTotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-slate-600 dark:text-slate-400">Lab Tests Total</span>
              <span className="text-[13px] font-semibold text-slate-800 dark:text-white">{rupee}{testsTotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between pt-[12px] border-t border-[#E7E8EB] dark:border-white/10">
              <span className="text-[13px] font-medium text-slate-600 dark:text-slate-400">Subtotal</span>
              <span className="text-[13px] font-semibold text-slate-800 dark:text-white">{rupee}{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-slate-600 dark:text-slate-400">Tax (18% GST)</span>
              <span className="text-[13px] font-semibold text-slate-800 dark:text-white">{rupee}{tax.toFixed(2)}</span>
            </div>
            <div className="pt-[12px] border-t border-[#E7E8EB] dark:border-white/10 flex items-center justify-between">
              <span className="text-[15px] font-bold text-slate-800 dark:text-white">Total Amount</span>
              <span className="text-[18px] font-bold text-[#2E37A4]">{rupee}{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-[8px]">
            <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Payment Method</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-[12px]">
              {["Cash", "Card", "UPI", "Insurance"].map((method) => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={cn(
                    "h-[44px] rounded-[5px] border text-[13px] font-medium transition",
                    paymentMethod === method
                      ? "bg-[#2E37A4] text-white border-[#2E37A4]"
                      : "bg-white text-slate-700 border-[#E7E8EB] hover:border-[#2E37A4]/40 hover:bg-[#F8F9FC] dark:bg-[#101935] dark:border-white/10 dark:text-white dark:hover:bg-white/5"
                  )}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-[8px]">
            <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Notes (Optional)</label>
            <textarea
              rows={3}
              placeholder="Add any additional notes..."
              className="w-full px-[14px] py-[12px] rounded-[5px] border border-[#E7E8EB] bg-white text-[13px] text-slate-800 placeholder-slate-400 outline-none focus:border-[#2E37A4] transition resize-none dark:bg-[#101935] dark:border-white/10 dark:text-white"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-[12px] px-[20px] py-[16px] border-t border-[#E7E8EB] bg-[#F8F9FC] dark:border-white/10 dark:bg-white/5">
          <button
            onClick={() => onOpenChange(false)}
            className="h-[38px] px-[20px] rounded-[5px] border border-[#E7E8EB] bg-white text-[13px] font-semibold text-slate-700 hover:bg-[#F8F9FC] transition dark:bg-[#101935] dark:border-white/10 dark:text-white"
          >
            Cancel
          </button>
          <button
            className="h-[38px] px-[20px] rounded-[5px] bg-[#2E37A4] text-[13px] font-semibold text-white hover:bg-[#2E37A4]/90 transition flex items-center gap-[8px]"
          >
            <FileText className="h-4 w-4" />
            Generate Bill
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
