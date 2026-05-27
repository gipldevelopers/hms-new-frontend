"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  ChevronDown, 
  FileText,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

import Link from "next/link";

function CustomSelect({ value, onChange, options, placeholder, minWidth = "100px" }) {
  const selected = options.find((o) => o.value === value);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="h-10 px-4 bg-card border border-border rounded-lg flex items-center justify-between gap-2 text-[13px] font-medium outline-none transition-all shadow-none"
          style={{ minWidth }}
        >
          <span className="truncate text-foreground">{selected ? selected.label : placeholder}</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[120px] border border-border bg-card p-1 rounded-lg shadow-none z-50">
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-lg text-[13px] font-medium px-3 py-2 cursor-pointer transition-colors outline-none",
              value === opt.value
                ? "bg-primary/5 text-primary font-bold dark:bg-primary/10"
                : "text-foreground hover:bg-muted dark:hover:bg-muted/50"
            )}
          >
            {opt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function IPDPatientsPage() {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [wardFilter, setWardFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const fetchAdmissions = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authtoken");
        const headers = { Authorization: `Bearer ${token}` };
        
        // Fetch active admissions (excludes completed by default)
        const res = await fetch("/api/admissions/overview", { headers });
        const data = await res.json();
        if (Array.isArray(data)) {
          setAdmissions(data);
        }
      } catch (err) {
        console.error("Failed to load admissions", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmissions();
  }, []);

  // Filter admissions locally based on search query, ward, and status selection
  const filteredAdmissions = admissions.filter((adm) => {
    const pName = (adm.patient?.name || `${adm.patient?.firstName || ""} ${adm.patient?.lastName || ""}`).toLowerCase();
    const bedLabel = (adm.bed?.label || "").toLowerCase();
    const diagnosis = (adm.reason || "").toLowerCase();
    const query = search.toLowerCase();

    // Match search
    const matchesSearch = pName.includes(query) || bedLabel.includes(query) || diagnosis.includes(query);

    // Match ward filter
    const matchesWard = wardFilter === "All" || adm.ward?.name === wardFilter;

    // Match status filter
    const matchesStatus = statusFilter === "All" || adm.status === statusFilter;

    return matchesSearch && matchesWard && matchesStatus;
  });

  // Calculate unique wards and statuses for dropdown filters dynamically
  const wardOptions = [
    { label: "All Wards", value: "All" },
    ...[...new Set(admissions.map(adm => adm.ward?.name).filter(Boolean))].map(name => ({ label: name, value: name }))
  ];

  const statusOptions = [
    { label: "All Statuses", value: "All" },
    ...[...new Set(admissions.map(adm => adm.status).filter(Boolean))].map(status => ({ label: status, value: status }))
  ];

  const calculateDays = (dateStr) => {
    if (!dateStr) return 0;
    const diffTime = Math.abs(new Date() - new Date(dateStr));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="p-5 bg-background min-h-screen flex flex-col gap-5 transition-colors duration-300 font-sans pb-20">
      
      {/* ── Header Area ── */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h1 className="text-[20px] font-bold text-foreground tracking-tight leading-none">
          Admitted Patients
        </h1>
      </div>

      {/* ── Filter Toolbar ── */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-card border border-border p-3.5 rounded-lg shadow-none">
        <div className="relative flex-1 max-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-10 bg-card border border-border rounded-lg text-[13px] font-medium outline-none focus:border-primary transition-all shadow-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex items-center gap-3">
          <CustomSelect
            value={wardFilter}
            onChange={setWardFilter}
            placeholder="All Wards"
            options={wardOptions}
            minWidth="120px"
          />
          <CustomSelect
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="All Statuses"
            options={statusOptions}
            minWidth="120px"
          />
        </div>
      </div>

      {/* ── Table Container ── */}
      <div className="bg-card border border-border rounded-lg overflow-hidden shadow-none overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-card dark:bg-white/[0.02] border-b border-border text-[11px] font-bold text-muted-foreground">
              <th className="px-6 py-5">Bed No.</th>
              <th className="px-6 py-5">Patient</th>
              <th className="px-6 py-5">Admission Date</th>
              <th className="px-6 py-5">Diagnosis</th>
              <th className="px-6 py-5 text-center">Days Admitted</th>
              <th className="px-6 py-5 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-[14px] font-bold text-muted-foreground">
                  Loading admitted patients...
                </td>
              </tr>
            ) : filteredAdmissions.length > 0 ? (
              filteredAdmissions.map((adm) => {
                const pName = adm.patient?.name || `${adm.patient?.firstName || ""} ${adm.patient?.lastName || ""}`.trim() || "Unnamed Patient";
                const age = adm.patient?.age || "N/A";
                const gender = adm.patient?.gender?.charAt(0) || "U";
                const formattedDate = adm.admissionDate ? format(new Date(adm.admissionDate), "MMM dd, yyyy") : "N/A";
                const days = calculateDays(adm.admissionDate);

                return (
                  <tr key={adm.id} className="hover:bg-muted/30 dark:hover:bg-white/[0.01] transition-colors">
                    {/* Bed No */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center px-3 py-1.5 bg-muted dark:bg-white/10 text-foreground text-[12px] font-bold rounded-lg">
                        {adm.bed?.label || "N/A"}
                      </span>
                    </td>

                    {/* Patient Info (NO AVATAR) */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-[14px] font-bold text-foreground leading-tight">
                          {pName}
                        </span>
                        <span className="text-[12px] text-muted-foreground font-medium mt-1">
                          {age} yrs / {gender}
                        </span>
                      </div>
                    </td>

                    {/* Admission Date */}
                    <td className="px-6 py-4 text-[13px] font-medium text-foreground">
                      {formattedDate}
                    </td>

                    {/* Diagnosis */}
                    <td className="px-6 py-4 text-[13px] font-medium text-muted-foreground max-w-[200px] truncate">
                      {adm.reason || "N/A"}
                    </td>

                    {/* Days Admitted */}
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-primary/10 text-primary text-[12px] font-bold rounded-full">
                        {days}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <Link href={`/doctor/ipd/${adm.id}`} className="h-9 px-4 bg-primary text-primary-foreground rounded-lg text-[12px] font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-none outline-none">
                          <FileText className="w-3.5 h-3.5" />
                          View Chart
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-[14px] font-bold text-muted-foreground">
                  No admitted patients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Mobile View (Cards) ── */}
      <div className="grid grid-cols-1 gap-5 md:hidden">
        {loading ? (
          <div className="p-10 text-center text-[14px] font-bold text-muted-foreground">
            Loading admitted patients...
          </div>
        ) : filteredAdmissions.length > 0 ? (
          filteredAdmissions.map((adm) => {
            const pName = adm.patient?.name || `${adm.patient?.firstName || ""} ${adm.patient?.lastName || ""}`.trim() || "Unnamed Patient";
            const age = adm.patient?.age || "N/A";
            const gender = adm.patient?.gender?.charAt(0) || "U";
            const formattedDate = adm.admissionDate ? format(new Date(adm.admissionDate), "MMM dd, yyyy") : "N/A";
            const days = calculateDays(adm.admissionDate);

            return (
              <div key={adm.id} className="bg-card border border-border p-5 rounded-lg space-y-4 shadow-none">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-[16px] font-bold text-foreground leading-tight">{pName}</h3>
                    <p className="text-[12px] text-muted-foreground font-medium mt-1">{age} yrs / {gender}</p>
                  </div>
                  <span className="inline-flex items-center justify-center px-3 py-1.5 bg-muted dark:bg-white/10 text-foreground text-[11px] font-bold rounded-lg shrink-0">
                    {adm.bed?.label || "N/A"}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 py-3 border-t border-b border-border">
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Admission Date</p>
                    <p className="text-[13px] font-medium text-foreground">{formattedDate}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Days Admitted</p>
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-primary/10 text-primary text-[12px] font-bold rounded-full">
                      {days}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Diagnosis</p>
                    <p className="text-[13px] font-medium text-muted-foreground">{adm.reason || "N/A"}</p>
                  </div>
                </div>

                <Link href={`/doctor/ipd/${adm.id}`} className="w-full h-11 bg-primary text-primary-foreground rounded-lg text-[13px] font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-none outline-none">
                  <FileText className="w-4 h-4" />
                  View Patient Chart
                </Link>
              </div>
            );
          })
        ) : (
          <div className="p-10 bg-card border border-border text-center rounded-lg text-[14px] font-bold text-muted-foreground">
            No admitted patients found.
          </div>
        )}
      </div>
    </div>
  );
}
