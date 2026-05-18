"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

const BILLING_DATA = [
  { uhid: "UHID-839211", patient: "Sarah Connor", room: "Ward A / 12", date: "12 Oct, 10:30 AM", amount: "₹1,250.00", advance: "₹500.00", balance: "₹500.00", status: "Active" },
  { uhid: "T-01", patient: "Sarah Connor", room: "Ward A / 12", date: "12 Oct, 10:30 AM", amount: "₹1,250.00", advance: "₹500.00", balance: "₹500.00", status: "Active" },
  { uhid: "T-02", patient: "John Doe", room: "Ward B / 11", date: "12 Oct, 11:00 AM", amount: "₹1,500.00", advance: "₹600.00", balance: "₹600.00", status: "Inactive" },
  { uhid: "T-03", patient: "Alice Smith", room: "Ward C / 10", date: "12 Oct, 11:30 AM", amount: "₹1,800.00", advance: "₹700.00", balance: "₹700.00", status: "Active" },
  { uhid: "T-04", patient: "Bob Johnson", room: "Ward D / 09", date: "12 Oct, 12:00 PM", amount: "₹1,100.00", advance: "₹400.00", balance: "₹400.00", status: "Inactive" },
  { uhid: "T-05", patient: "Charlie Brown", room: "Ward E / 08", date: "12 Oct, 12:30 PM", amount: "₹1,250.00", advance: "₹500.00", balance: "₹500.00", status: "Active" },
  { uhid: "T-06", patient: "Diana Prince", room: "Ward F / 07", date: "12 Oct, 1:00 PM", amount: "₹1,300.00", advance: "₹550.00", balance: "₹550.00", status: "Inactive" },
  { uhid: "T-07", patient: "Ethan Hunt", room: "Ward G / 06", date: "12 Oct, 1:30 PM", amount: "₹1,400.00", advance: "₹600.00", balance: "₹600.00", status: "Active" },
  { uhid: "T-08", patient: "Fiona Gallagher", room: "Ward H / 05", date: "12 Oct, 2:00 PM", amount: "₹1,600.00", advance: "₹750.00", balance: "₹750.00", status: "Inactive" },
  { uhid: "T-09", patient: "George Costanza", room: "Ward I / 04", date: "12 Oct, 2:30 PM", amount: "₹1,750.00", advance: "₹800.00", balance: "₹800.00", status: "Active" },
];

export function IPDBillingTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [wardFilter, setWardFilter] = useState("All");

  const filteredData = BILLING_DATA.filter((row) => {
    const matchesSearch = searchTerm === "" ||
      row.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.uhid.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || row.status === statusFilter;
    const matchesWard = wardFilter === "All" || row.room.includes(wardFilter);

    return matchesSearch && matchesStatus && matchesWard;
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 pl-3 pr-8 bg-white dark:bg-white/5 border border-[#E7E8EB] dark:border-white/10 rounded-[4px] text-[13px] text-[#1e293b] font-medium dark:text-gray-300 appearance-none focus:outline-none focus:border-primary cursor-pointer w-[95px]"
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div className="relative">
            <select
              value={wardFilter}
              onChange={(e) => setWardFilter(e.target.value)}
              className="h-9 pl-3 pr-8 bg-white dark:bg-white/5 border border-[#E7E8EB] dark:border-white/10 rounded-[4px] text-[13px] text-[#1e293b] font-medium dark:text-gray-300 appearance-none focus:outline-none focus:border-primary cursor-pointer w-[95px]"
            >
              <option value="All">All</option>
              {Array.from(new Set(BILLING_DATA.map(item => item.room.split(' / ')[0]))).map(ward => (
                <option key={ward} value={ward}>{ward}</option>
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
              <th className="py-3.5 px-5 text-[12px] font-bold text-[#1e293b] dark:text-slate-300">Room/Bed</th>
              <th className="py-3.5 px-5 text-[12px] font-bold text-[#1e293b] dark:text-slate-300">Admission Date</th>
              <th className="py-3.5 px-5 text-[12px] font-bold text-[#1e293b] dark:text-slate-300">Current Bill Amount</th>
              <th className="py-3.5 px-5 text-[12px] font-bold text-[#1e293b] dark:text-slate-300">Advance Paid</th>
              <th className="py-3.5 px-5 text-[12px] font-bold text-[#1e293b] dark:text-slate-300">Balance</th>
              <th className="py-3.5 px-5 text-[12px] font-bold text-[#1e293b] dark:text-slate-300">Status</th>
              <th className="py-3.5 px-5 text-[12px] font-bold text-[#1e293b] dark:text-slate-300 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E7E8EB] dark:divide-white/10">
            {filteredData.length > 0 ? (
              filteredData.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-5 text-[13px] font-medium text-gray-500 dark:text-gray-400">{row.uhid}</td>
                  <td className="py-3.5 px-5 text-[13px] font-medium text-[#1e293b] dark:text-white">{row.patient}</td>
                  <td className="py-3.5 px-5 text-[13px] font-medium text-gray-600 dark:text-gray-400">{row.room}</td>
                  <td className="py-3.5 px-5 text-[13px] font-medium text-gray-600 dark:text-gray-400">{row.date}</td>
                  <td className="py-3.5 px-5 text-[13px] font-medium text-[#1e293b] dark:text-white">{row.amount}</td>
                  <td className="py-3.5 px-5 text-[13px] font-medium text-[#1e293b] dark:text-white">{row.advance}</td>
                  <td className="py-3.5 px-5 text-[13px] font-medium text-[#1e293b] dark:text-white">{row.balance}</td>
                  <td className="py-3.5 px-5">
                    <span className={cn("px-2.5 py-1 text-[11px] font-semibold rounded-[4px] border",
                      row.status === "Active" ? "bg-[#EBF7EE] text-[#218F40] border-[#D3ECD9] dark:bg-green-500/10 dark:border-green-500/20"
                        : "bg-[#FCE8E8] text-[#DF342A] border-[#F8D0D0] dark:bg-red-500/10 dark:border-red-500/20"
                    )}>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-center">
                    <Link
                      href={`/finance/patient-billing/details?type=ipd&patient=${encodeURIComponent(row.patient)}&uhid=${encodeURIComponent(row.uhid)}&room=${encodeURIComponent(row.room)}`}
                      className="inline-flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="py-8 text-center text-[13px] text-gray-500">
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
