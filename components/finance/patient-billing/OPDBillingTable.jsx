"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [opdDoctorFilter, setOpdDoctorFilter] = useState("All");
  const [opdPaymentFilter, setOpdPaymentFilter] = useState("All");

  const filteredOpdData = OPD_BILLING_DATA.filter((row) => {
    const matchesSearch = searchTerm === "" ||
      row.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.uhid.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDoctor = opdDoctorFilter === "All" || row.doctor === opdDoctorFilter;
    const matchesPayment = opdPaymentFilter === "All" || row.paymentMethod === opdPaymentFilter;

    return matchesSearch && matchesDoctor && matchesPayment;
  });

  return (
    <div className="bg-white dark:bg-[#101935] border border-[#E7E8EB] dark:border-white/10 rounded-[6px] overflow-hidden mt-6">
      {/* Filters & Search */}
      <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E8EB] dark:border-white/10 rounded-[6px]">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9 w-[200px] px-3 bg-white dark:bg-white/5 border border-[#E7E8EB] dark:border-white/10 rounded-[5px] text-[13px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all dark:text-white"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={opdDoctorFilter}
              onChange={(e) => setOpdDoctorFilter(e.target.value)}
              className="h-9 pl-3 pr-8 bg-white dark:bg-white/5 border border-[#E7E8EB] dark:border-white/10 rounded-[4px] text-[13px] text-[#1e293b] font-medium dark:text-gray-300 appearance-none focus:outline-none focus:border-primary cursor-pointer w-[95px]"
            >
              <option value="All">All</option>
              {Array.from(new Set(OPD_BILLING_DATA.map(item => item.doctor))).map(doc => (
                <option key={doc} value={doc}>{doc}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div className="relative">
            <select
              value={opdPaymentFilter}
              onChange={(e) => setOpdPaymentFilter(e.target.value)}
              className="h-9 pl-3 pr-8 bg-white dark:bg-white/5 border border-[#E7E8EB] dark:border-white/10 rounded-[4px] text-[13px] text-[#1e293b] font-medium dark:text-gray-300 appearance-none focus:outline-none focus:border-primary cursor-pointer w-[95px]"
            >
              <option value="All">All</option>
              {Array.from(new Set(OPD_BILLING_DATA.map(item => item.paymentMethod))).map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-[#EEF2F7] dark:bg-white/5 border-b border-[#E7E8EB] dark:border-white/10">
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
          <tbody className="divide-y divide-[#E7E8EB] dark:divide-white/10">
            {filteredOpdData.length > 0 ? (
              filteredOpdData.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-5 text-[13px] font-medium text-gray-500 dark:text-gray-400">{row.uhid}</td>
                  <td className="py-3.5 px-5 text-[13px] font-medium text-[#1e293b] dark:text-white">{row.patient}</td>
                  <td className="py-3.5 px-5 text-[13px] font-medium text-gray-600 dark:text-gray-400">{row.doctor}</td>
                  <td className="py-3.5 px-5 text-[13px] font-medium text-[#1e293b] dark:text-white">{row.opdCharge}</td>
                  <td className="py-3.5 px-5 text-[13px] font-medium text-[#1e293b] dark:text-white">{row.otherCharge}</td>
                  <td className="py-3.5 px-5 text-[13px] font-medium text-[#1e293b] dark:text-white">{row.amountReceived}</td>
                  <td className="py-3.5 px-5 text-[13px] font-medium text-gray-600 dark:text-gray-400">{row.paymentMethod}</td>
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
