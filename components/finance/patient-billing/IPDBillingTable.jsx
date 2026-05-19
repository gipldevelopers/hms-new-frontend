"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Eye, Activity, MapPin, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { CustomSelect } from "@/components/ui/custom-select";

const BILLING_DATA = [
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
  const [statusFilter, setStatusFilter] = useState("");
  const [wardFilter, setWardFilter] = useState("");

  const statusOptions = [
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" }
  ];

  const wardOptions = Array.from(
    new Set(BILLING_DATA.map((item) => item.room.split(" / ")[0]))
  ).map((ward) => ({
    label: ward,
    value: ward,
  }));

  const filteredData = BILLING_DATA.filter((row) => {
    const matchesSearch = searchTerm === "" ||
      row.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.uhid.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !statusFilter || row.status === statusFilter;
    const matchesWard = !wardFilter || row.room.includes(wardFilter);

    return matchesSearch && matchesStatus && matchesWard;
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
            value={statusFilter}
            onChange={setStatusFilter}
            options={statusOptions}
            placeholder="Status"
            minWidth="110px"
            icon={Activity}
          />
          <CustomSelect
            value={wardFilter}
            onChange={setWardFilter}
            options={wardOptions}
            placeholder="Ward / Bed"
            minWidth="130px"
            icon={MapPin}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-muted/30 border-b border-border">
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
          <tbody className="divide-y divide-border">
            {filteredData.length > 0 ? (
              filteredData.map((row, idx) => (
                <tr key={idx} className="hover:bg-muted/30 transition-all">
                  <td className="py-3.5 px-5 text-[13px] font-medium text-[#1e293b]dark:text-gray-400">{row.uhid}</td>
                  <td className="py-3.5 px-5 text-[13px] font-medium text-[#1e293b] dark:text-white">{row.patient}</td>
                  <td className="py-3.5 px-5 text-[13px] font-medium text-[#1e293b]dark:text-gray-400">{row.room}</td>
                  <td className="py-3.5 px-5 text-[13px] font-medium text-[#1e293b]dark:text-gray-400">{row.date}</td>
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
