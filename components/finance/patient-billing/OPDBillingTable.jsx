"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, User, CreditCard, FileX } from "lucide-react";
import { cn } from "@/lib/utils";
import { CustomSelect } from "@/components/ui/custom-select";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

function getAuthHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("authtoken") : "";
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };
}

export function OPDBillingTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [opdDoctorFilter, setOpdDoctorFilter] = useState("");
  const [opdPaymentFilter, setOpdPaymentFilter] = useState("");
  const [billingData, setBillingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE}/billing/opd-records`, {
          headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const json = await res.json();
        if (json.success) {
          setBillingData(json.data || []);
        } else {
          throw new Error(json.message || "Failed to load records");
        }
      } catch (e) {
        console.error("Error fetching OPD billing records:", e);
        setError(e.message || "Failed to load OPD billing records.");
        setBillingData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  const doctorOptions = Array.from(
    new Set(billingData.map((item) => item.doctor))
  ).map((doc) => ({
    label: doc,
    value: doc,
  }));

  const paymentOptions = Array.from(
    new Set(billingData.map((item) => item.paymentMethod))
  ).map((method) => ({
    label: method,
    value: method,
  }));

  const filteredOpdData = billingData.filter((row) => {
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
              <th className="py-3.5 px-5 text-[12px] font-bold text-[#1e293b] dark:text-slate-300">Status</th>
              <th className="py-3.5 px-5 text-[12px] font-bold text-[#1e293b] dark:text-slate-300 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan="9" className="py-12 text-center text-[13px] text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#2E37A4] border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading patient records...</span>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="9" className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
                      <FileX className="w-5 h-5 text-red-500" />
                    </div>
                    <p className="text-[13px] font-semibold text-red-500">Failed to load billing records</p>
                    <p className="text-[12px] text-gray-400 dark:text-slate-500">{error}</p>
                  </div>
                </td>
              </tr>
            ) : filteredOpdData.length > 0 ? (
              filteredOpdData.map((row, idx) => (
                <tr key={idx} className="hover:bg-muted/30 transition-all">
                  <td className="py-3.5 px-5 text-[13px] font-medium text-[#1e293b] dark:text-gray-400">{row.uhid}</td>
                  <td className="py-3.5 px-5 text-[13px] font-medium text-[#1e293b] dark:text-white">{row.patient}</td>
                  <td className="py-3.5 px-5 text-[13px] font-medium text-[#1e293b] dark:text-gray-400">{row.doctor}</td>
                  <td className="py-3.5 px-5 text-[13px] font-medium text-[#1e293b] dark:text-white">{row.opdCharge}</td>
                  <td className="py-3.5 px-5 text-[13px] font-medium text-[#1e293b] dark:text-white">{row.otherCharge}</td>
                  <td className="py-3.5 px-5 text-[13px] font-medium text-[#1e293b] dark:text-white">{row.amountReceived}</td>
                  <td className="py-3.5 px-5 text-[13px] font-medium text-[#1e293b] dark:text-gray-400">{row.paymentMethod}</td>
                  <td className="py-3.5 px-5 text-[13px] font-medium">
                    <span className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      row.status?.toUpperCase() === "PAID"
                        ? "bg-green-500/10 border border-green-500/20 text-[#218F40] dark:text-green-400"
                        : "bg-amber-500/10 border border-amber-500/20 text-[#DF8F2A]"
                    )}>
                      {row.status || "PENDING"}
                    </span>
                  </td>
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
                <td colSpan="9" className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <FileX className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <p className="text-[13px] font-semibold text-muted-foreground">No Billing Records Found</p>
                    <p className="text-[12px] text-gray-400 dark:text-slate-500">
                      {searchTerm || opdDoctorFilter || opdPaymentFilter
                        ? "No records match your current filters."
                        : "No OPD billing records exist for this branch yet."}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
