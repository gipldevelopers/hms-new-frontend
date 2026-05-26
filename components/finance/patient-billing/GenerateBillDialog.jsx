"use client";

import React, { useState } from "react";
import { X, Search, Calendar, User, CreditCard, FileText, Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const rupee = "₹";

export function GenerateBillDialog({ open, onOpenChange }) {
  const [billType, setBillType] = useState("IPD");
  const [patientSearch, setPatientSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [billItems, setBillItems] = useState([
    { id: 1, description: "", quantity: 1, rate: "", amount: "" }
  ]);

  const mockPatients = [
    { uhid: "T-01", name: "Sarah Connor", room: "Ward A / 12", admissionDate: "12 Oct, 10:30 AM" },
    { uhid: "T-02", name: "John Doe", room: "Ward B / 11", admissionDate: "12 Oct, 11:00 AM" },
    { uhid: "T-03", name: "Alice Smith", room: "Ward C / 10", admissionDate: "12 Oct, 11:30 AM" },
  ];

  const filteredPatients = mockPatients.filter(p =>
    p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
    p.uhid.toLowerCase().includes(patientSearch.toLowerCase())
  );

  const handleAddItem = () => {
    setBillItems([...billItems, { id: Date.now(), description: "", quantity: 1, rate: "", amount: "" }]);
  };

  const handleRemoveItem = (id) => {
    if (billItems.length > 1) {
      setBillItems(billItems.filter(item => item.id !== id));
    }
  };

  const handleItemChange = (id, field, value) => {
    setBillItems(billItems.map(item => {
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

  const subtotal = billItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + tax;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[900px] max-h-[90vh] p-0 gap-0 border border-[#E7E8EB] rounded-[5px] bg-white dark:border-white/10 dark:bg-[#101935] overflow-hidden">
        <DialogTitle className="sr-only">Generate Bill</DialogTitle>
        
        {/* Header */}
        <div className="flex items-center justify-between px-[20px] py-[16px] border-b border-[#E7E8EB] dark:border-white/10">
          <h2 className="text-[18px] font-bold text-slate-800 dark:text-white">Generate Bill</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-[5px] p-1.5 text-slate-400 hover:bg-[#F8F9FC] hover:text-slate-700 dark:hover:bg-white/10 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-[20px] space-y-[20px]">
          {/* Bill Type Selection */}
          <div className="space-y-[8px]">
            <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Bill Type</label>
            <div className="flex gap-[12px]">
              <button
                onClick={() => setBillType("IPD")}
                className={cn(
                  "flex-1 h-[44px] rounded-[5px] border text-[13px] font-semibold transition",
                  billType === "IPD"
                    ? "bg-[#2E37A4] text-white border-[#2E37A4]"
                    : "bg-white text-slate-700 border-[#E7E8EB] hover:border-[#2E37A4]/40 dark:bg-[#101935] dark:border-white/10 dark:text-white"
                )}
              >
                IPD Running Bills
              </button>
              <button
                onClick={() => setBillType("OPD")}
                className={cn(
                  "flex-1 h-[44px] rounded-[5px] border text-[13px] font-semibold transition",
                  billType === "OPD"
                    ? "bg-[#2E37A4] text-white border-[#2E37A4]"
                    : "bg-white text-slate-700 border-[#E7E8EB] hover:border-[#2E37A4]/40 dark:bg-[#101935] dark:border-white/10 dark:text-white"
                )}
              >
                OPD Billing
              </button>
            </div>
          </div>

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
                        <p className="text-[12px] text-slate-500">UHID: {patient.uhid} • {patient.room}</p>
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-[16px]">
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 mb-[4px]">Patient Name</p>
                  <p className="text-[13px] font-bold text-slate-800 dark:text-white">{selectedPatient.name}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 mb-[4px]">UHID</p>
                  <p className="text-[13px] font-bold text-slate-800 dark:text-white">{selectedPatient.uhid}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 mb-[4px]">Room/Bed</p>
                  <p className="text-[13px] font-bold text-slate-800 dark:text-white">{selectedPatient.room}</p>
                </div>
              </div>
            </div>
          )}

          {/* Bill Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px]">
            <div className="space-y-[8px]">
              <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Bill Date</label>
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
                defaultValue="INV-2024-001"
                className="w-full h-[44px] px-[14px] rounded-[5px] border border-[#E7E8EB] bg-[#F8F9FC] text-[13px] text-slate-500 outline-none dark:bg-white/5 dark:border-white/10 dark:text-slate-400"
                readOnly
              />
            </div>
          </div>

          {/* Bill Items */}
          <div className="space-y-[12px]">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Bill Items</label>
              <button
                onClick={handleAddItem}
                className="flex items-center gap-[6px] text-[12px] font-semibold text-[#2E37A4] hover:text-[#2E37A4]/80 transition"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Item
              </button>
            </div>

            <div className="space-y-[12px]">
              {billItems.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-[12px] items-start">
                  <div className="col-span-12 sm:col-span-5">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                      placeholder="Item description"
                      className="w-full h-[44px] px-[14px] rounded-[5px] border border-[#E7E8EB] bg-white text-[13px] text-slate-800 placeholder-slate-400 outline-none focus:border-[#2E37A4] transition dark:bg-[#101935] dark:border-white/10 dark:text-white"
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(item.id, "quantity", e.target.value)}
                      placeholder="Qty"
                      min="1"
                      className="w-full h-[44px] px-[14px] rounded-[5px] border border-[#E7E8EB] bg-white text-[13px] text-slate-800 placeholder-slate-400 outline-none focus:border-[#2E37A4] transition dark:bg-[#101935] dark:border-white/10 dark:text-white"
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) => handleItemChange(item.id, "rate", e.target.value)}
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
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={billItems.length === 1}
                      className={cn(
                        "h-[44px] w-[44px] rounded-[5px] border flex items-center justify-center transition",
                        billItems.length === 1
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
                  className="h-[44px] rounded-[5px] border border-[#E7E8EB] bg-white text-[13px] font-medium text-slate-700 hover:border-[#2E37A4]/40 hover:bg-[#F8F9FC] transition dark:bg-[#101935] dark:border-white/10 dark:text-white dark:hover:bg-white/5"
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
