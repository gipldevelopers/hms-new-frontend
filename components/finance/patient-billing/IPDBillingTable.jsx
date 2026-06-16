"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, Activity, MapPin, FileX } from "lucide-react";
import { cn } from "@/lib/utils";
import { CustomSelect } from "@/components/ui/custom-select";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

function getAuthHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("authtoken") : "";
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export function IPDBillingTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [wardFilter, setWardFilter] = useState("");
  const [billingData, setBillingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE}/billing/ipd-records`, {
          headers: getAuthHeaders(),
        });
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const json = await res.json();
        if (json.success) {
          setBillingData(json.data || []);
        } else {
          throw new Error(json.message || "Failed to load records");
        }
      } catch (e) {
        console.error("Error fetching IPD billing records:", e);
        setError(e.message || "Failed to load IPD billing records.");
        setBillingData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  // Build filter options dynamically from real data
  const statusOptions = Array.from(new Set(billingData.map((r) => r.status)))
    .filter(Boolean)
    .map((s) => ({ label: s, value: s }));

  const wardOptions = Array.from(
    new Set(
      billingData
        .map((r) => r.room?.split(" / ")[0])
        .filter(Boolean)
    )
  ).map((w) => ({ label: w, value: w }));

  const filteredData = billingData.filter((row) => {
    const matchesSearch =
      searchTerm === "" ||
      row.patient?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.uhid?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !statusFilter || row.status === statusFilter;
    const matchesWard = !wardFilter || row.room?.includes(wardFilter);

    return matchesSearch && matchesStatus && matchesWard;
  });

  const statusBadge = (status) => {
    if (status === "Active")
      return "bg-[#EBF7EE] text-[#218F40] border-[#D3ECD9] dark:bg-green-500/10 dark:border-green-500/20 dark:text-green-400";
    if (status === "Discharged")
      return "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-400";
    // Pending
    return "bg-amber-50 text-[#DF8F2A] border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20";
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden mt-6 shadow-none">
      {/* Filters & Search */}
      <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border">
        <div className="relative">
          <input
            type="text"
            placeholder="Search patient or UHID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9 w-[220px] px-3 bg-background border border-border rounded-lg text-[13px] focus:outline-none focus:border-primary transition-all text-foreground placeholder:text-muted-foreground shadow-none"
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
            placeholder="Ward"
            minWidth="130px"
            icon={MapPin}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-muted/30 border-b border-border">
              <th className="py-3.5 px-5 text-[12px] font-bold text-[#1e293b] dark:text-slate-300 uppercase tracking-wide">UHID</th>
              <th className="py-3.5 px-5 text-[12px] font-bold text-[#1e293b] dark:text-slate-300 uppercase tracking-wide">Patient Name</th>
              <th className="py-3.5 px-5 text-[12px] font-bold text-[#1e293b] dark:text-slate-300 uppercase tracking-wide">Admission Date</th>
              <th className="py-3.5 px-5 text-[12px] font-bold text-[#1e293b] dark:text-slate-300 uppercase tracking-wide">Ward / Room</th>
              <th className="py-3.5 px-5 text-[12px] font-bold text-[#1e293b] dark:text-slate-300 uppercase tracking-wide">Doctor</th>
              <th className="py-3.5 px-5 text-[12px] font-bold text-[#1e293b] dark:text-slate-300 uppercase tracking-wide">Total Bill</th>
              <th className="py-3.5 px-5 text-[12px] font-bold text-[#1e293b] dark:text-slate-300 uppercase tracking-wide">Advance Paid</th>
              <th className="py-3.5 px-5 text-[12px] font-bold text-[#1e293b] dark:text-slate-300 uppercase tracking-wide">Balance Due</th>
              <th className="py-3.5 px-5 text-[12px] font-bold text-[#1e293b] dark:text-slate-300 uppercase tracking-wide">Status</th>
              <th className="py-3.5 px-5 text-[12px] font-bold text-[#1e293b] dark:text-slate-300 uppercase tracking-wide text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan="10" className="py-12 text-center text-[13px] text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#2E37A4] border-t-transparent rounded-full animate-spin" />
                    <span>Loading IPD billing records...</span>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="10" className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
                      <FileX className="w-5 h-5 text-red-500" />
                    </div>
                    <p className="text-[13px] font-semibold text-red-500">Failed to load IPD billing records</p>
                    <p className="text-[12px] text-gray-400 dark:text-slate-500">{error}</p>
                  </div>
                </td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((row) => (
                <tr key={row.admissionId} className="hover:bg-muted/30 transition-all">
                  <td className="py-3.5 px-5 text-[13px] font-medium text-[#1e293b] dark:text-gray-400">{row.uhid}</td>
                  <td className="py-3.5 px-5 text-[13px] font-medium text-[#1e293b] dark:text-white">{row.patient}</td>
                  <td className="py-3.5 px-5 text-[13px] font-medium text-[#1e293b] dark:text-gray-400">{row.admissionDate}</td>
                  <td className="py-3.5 px-5 text-[13px] font-medium text-[#1e293b] dark:text-gray-400">{row.room}</td>
                  <td className="py-3.5 px-5 text-[13px] font-medium text-[#1e293b] dark:text-gray-400">{row.doctor}</td>
                  <td className="py-3.5 px-5 text-[13px] font-medium text-[#1e293b] dark:text-white">{row.totalBill}</td>
                  <td className="py-3.5 px-5 text-[13px] font-medium text-[#1e293b] dark:text-white">{row.advancePaid}</td>
                  <td className="py-3.5 px-5 text-[13px] font-medium text-[#1e293b] dark:text-white">{row.balanceDue}</td>
                  <td className="py-3.5 px-5">
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                        statusBadge(row.status)
                      )}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-center">
                    <Link
                      href={`/finance/patient-billing/ipd-details/${row.admissionId}?patientId=${encodeURIComponent(row.patientId)}&uhid=${encodeURIComponent(row.uhid)}`}
                      className="inline-flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                      title={`View IPD details for ${row.patient}`}
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <FileX className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <p className="text-[13px] font-semibold text-muted-foreground">No IPD Billing Records Found</p>
                    <p className="text-[12px] text-gray-400 dark:text-slate-500">
                      {searchTerm || statusFilter || wardFilter
                        ? "No records match your current filters."
                        : "No IPD admissions exist for this branch yet."}
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
