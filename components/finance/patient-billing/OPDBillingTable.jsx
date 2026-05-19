"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Eye, User, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { CustomSelect } from "@/components/ui/custom-select";

const OPD_BILLING_DATA = [
  { uhid: "T-01", patient: "Sarah Connor", doctor: "John Doe", opdCharge: "₹450", otherCharge: "₹500", amountReceived: "₹950.00", paymentMethod: "Gpay" },
  { uhid: "T-01", patient: "Sarah Connor", doctor: "John Doe", opdCharge: "₹450", otherCharge: "₹500", amountReceived: "₹950.00", paymentMethod: "Gpay" },
  { uhid: "T-01", patient: "Sarah Connor", doctor: "John Doe", opdCharge: "₹450", otherCharge: "₹500", amountReceived: "₹950.00", paymentMethod: "Gpay" },
  { uhid: "T-01", patient: "Sarah Connor", doctor: "John Doe", opdCharge: "₹450", otherCharge: "₹500", amountReceived: "₹950.00", paymentMethod: "Gpay" },
  { uhid: "T-01", patient: "Sarah Connor", doctor: "John Doe", opdCharge: "₹450", otherCharge: "₹500", amountReceived: "₹950.00", paymentMethod: "Gpay" },
  { uhid: "T-01", patient: "Sarah Connor", doctor: "John Doe", opdCharge: "₹450", otherCharge: "₹500", amountReceived: "₹950.00", paymentMethod: "Gpay" },
  { uhid: "T-01", patient: "Sarah Connor", doctor: "John Doe", opdCharge: "₹450", otherCharge: "₹500", amountReceived: "₹950.00", paymentMethod: "Gpay" },
  { uhid: "T-01", patient: "Sarah Connor", doctor: "John Doe", opdCharge: "₹450", otherCharge: "₹500", amountReceived: "₹950.00", paymentMethod: "Gpay" },
  { uhid: "T-01", patient: "Sarah Connor", doctor: "John Doe", opdCharge: "₹450", otherCharge: "₹500", amountReceived: "₹950.00", paymentMethod: "Gpay" },
  { uhid: "T-01", patient: "Sarah Connor", doctor: "John Doe", opdCharge: "₹450", otherCharge: "₹500", amountReceived: "₹950.00", paymentMethod: "Gpay" },
];

export function OPDBillingTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [opdDoctorFilter, setOpdDoctorFilter] = useState("");
  const [opdPaymentFilter, setOpdPaymentFilter] = useState("");

  const doctorOptions = Array.from(
    new Set(OPD_BILLING_DATA.map((item) => item.doctor))
  ).map((doc) => ({
    label: doc,
    value: doc,
  }));

  const paymentOptions = Array.from(
    new Set(OPD_BILLING_DATA.map((item) => item.paymentMethod))
  ).map((method) => ({
    label: method,
    value: method,
  }));

  const filteredOpdData = OPD_BILLING_DATA.filter((row) => {
    const matchesSearch = searchTerm === "" ||
      row.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.uhid.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDoctor = !opdDoctorFilter || row.doctor === opdDoctorFilter;
    const matchesPayment = !opdPaymentFilter || row.paymentMethod === opdPaymentFilter;

    return matchesSearch && matchesDoctor && matchesPayment;
  });

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden mt-6 shadow-none">
      {/* Filters & Search */}
      <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9 w-[200px] px-3 bg-background border border-border rounded-lg text-[13px] focus:outline-none focus:border-primary transition-all text-foreground placeholder:text-muted-foreground shadow-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <CustomSelect
            value={opdDoctorFilter}
            onChange={setOpdDoctorFilter}
            options={doctorOptions}
            placeholder="Doctor"
            minWidth="120px"
            icon={User}
          />
          <CustomSelect
            value={opdPaymentFilter}
            onChange={setOpdPaymentFilter}
            options={paymentOptions}
            placeholder="Method"
            minWidth="120px"
            icon={CreditCard}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-muted/30 border-b border-border">
              <th className="py-3.5 px-5 text-[12px] font-bold text-[#1e293b] dark:text-slate-300">UHID</th>
              <th className="py-3.5 px-5 text-[12px] font-bold text-[#1e293b] dark:text-slate-300 uppercase tracking-wide">PATIENT NAME</th>
              <th className="py-3.5 px-5 text-[12px] font-bold text-[#1e293b] dark:text-slate-300">Consulting Doctor</th>
              <th className="py-3.5 px-5 text-[12px] font-bold text-[#1e293b] dark:text-slate-300">OPD Charge</th>
              <th className="py-3.5 px-5 text-[12px] font-bold text-[#1e293b] dark:text-slate-300">Other Charge</th>
              <th className="py-3.5 px-5 text-[12px] font-bold text-[#1e293b] dark:text-slate-300">Amount received</th>
              <th className="py-3.5 px-5 text-[12px] font-bold text-[#1e293b] dark:text-slate-300">Payment Method</th>
              <th className="py-3.5 px-5 text-[12px] font-bold text-[#1e293b] dark:text-slate-300 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredOpdData.length > 0 ? (
              filteredOpdData.map((row, idx) => (
                <tr key={idx} className="hover:bg-muted/30 transition-all">
                  <td className="py-3.5 px-5 text-[13px] font-medium text-[#1e293b]dark:text-gray-400">{row.uhid}</td>
                  <td className="py-3.5 px-5 text-[13px] font-medium text-[#1e293b] dark:text-white">{row.patient}</td>
                  <td className="py-3.5 px-5 text-[13px] font-medium text-[#1e293b] dark:text-gray-400">{row.doctor}</td>
                  <td className="py-3.5 px-5 text-[13px] font-medium text-[#1e293b] dark:text-white">{row.opdCharge}</td>
                  <td className="py-3.5 px-5 text-[13px] font-medium text-[#1e293b] dark:text-white">{row.otherCharge}</td>
                  <td className="py-3.5 px-5 text-[13px] font-medium text-[#1e293b] dark:text-white">{row.amountReceived}</td>
                  <td className="py-3.5 px-5 text-[13px] font-medium text-[#1e293b] dark:text-gray-400">{row.paymentMethod}</td>
                  <td className="py-3.5 px-5 text-center">
                    <Link
                      href={`/finance/patient-billing/details?type=opd&patient=${encodeURIComponent(row.patient)}&uhid=${encodeURIComponent(row.uhid)}`}
                      className="inline-flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-8 text-center text-[13px] text-gray-500">
                  No invoices found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
