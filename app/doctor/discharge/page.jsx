"use client";

import React from "react";
import { Search, ChevronDown, Eye, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DischargeDetailModal from "@/components/doctor/discharge/DischargeDetailModal";
import ApprovedDischargeModal from "@/components/doctor/discharge/ApprovedDischargeModal";
import RequestDischargeModal from "@/components/doctor/discharge/RequestDischargeModal";

function CustomSelect({ value, onChange, options, placeholder, minWidth = "100px" }) {
  const selected = options.find((o) => o.value === value);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="h-10 px-4 bg-card border border-border rounded-lg flex items-center justify-between gap-2 text-[13px] font-medium outline-none transition-all shadow-none w-full sm:w-auto"
          style={{ minWidth: typeof window !== 'undefined' && window.innerWidth < 640 ? '100%' : minWidth }}
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

export default function DischargeRequestsPage() {
  const [search, setSearch] = React.useState("");
  const [wardFilter, setWardFilter] = React.useState("All");
  const [statusFilter, setStatusFilter] = React.useState("All");
  const [isPendingModalOpen, setIsPendingModalOpen] = React.useState(false);
  const [isApprovedModalOpen, setIsApprovedModalOpen] = React.useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = React.useState(false);
  const [selectedRequest, setSelectedRequest] = React.useState(null);

  const [requests, setRequests] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authtoken");
      const res = await fetch("/api/admissions/overview?type=all", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Failed to fetch discharge requests");
      const data = await res.json();
      
      // Filter only Pending and Completed admissions
      const filtered = (Array.isArray(data) ? data : []).filter(
        (adm) => adm.status === "Pending" || adm.status === "Completed"
      ).map((adm) => ({
        id: adm.id,
        patient: adm.patient?.name || "Unknown Patient",
        ward: `${adm.ward?.name || "General"} - ${adm.bed?.label || "Bed"}`,
        wardName: adm.ward?.name || "General",
        diagnosis: adm.reason || "N/A",
        date: adm.admissionDate ? new Date(adm.admissionDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A",
        requestedBy: adm.doctor?.name || "Staff",
        status: adm.status === "Completed" ? "Approved" : adm.status,
        rawAdmission: adm
      }));

      setRequests(filtered);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (request) => {
    try {
      const token = localStorage.getItem("authtoken");
      const res = await fetch(`/api/admissions/${request.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: "Completed" })
      });
      if (!res.ok) throw new Error("Failed to approve discharge request");
      setIsPendingModalOpen(false);
      fetchRequests();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleReject = async (request) => {
    try {
      const token = localStorage.getItem("authtoken");
      const res = await fetch(`/api/admissions/${request.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: "In Progress" })
      });
      if (!res.ok) throw new Error("Failed to reject discharge request");
      setIsPendingModalOpen(false);
      fetchRequests();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    if (request.status === "Pending") {
      setIsPendingModalOpen(true);
    } else {
      setIsApprovedModalOpen(true);
    }
  };

  // Get unique wards from requests for the ward filter dropdown
  const uniqueWards = ["All", ...new Set(requests.map((r) => r.wardName).filter(Boolean))];
  const wardOptions = uniqueWards.map((w) => ({ label: w === "All" ? "All Wards" : w, value: w }));

  const statusOptions = [
    { label: "All Status", value: "All" },
    { label: "Pending", value: "Pending" },
    { label: "Approved", value: "Approved" }
  ];

  const filteredRequests = requests.filter((r) => {
    const matchesSearch = !search || 
      r.patient.toLowerCase().includes(search.toLowerCase()) ||
      r.ward.toLowerCase().includes(search.toLowerCase()) ||
      r.diagnosis.toLowerCase().includes(search.toLowerCase()) ||
      r.requestedBy.toLowerCase().includes(search.toLowerCase());
    
    const matchesWard = wardFilter === "All" || r.wardName === wardFilter;
    const matchesStatus = statusFilter === "All" || r.status === statusFilter;

    return matchesSearch && matchesWard && matchesStatus;
  });

  return (
    <div className="p-4 md:p-5 bg-background min-h-screen flex flex-col gap-4 md:gap-5 transition-colors duration-300 font-sans pb-20">
      
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h1 className="text-[18px] md:text-[20px] font-bold text-foreground tracking-tight leading-none">
          Discharge Requests
        </h1>
        <button
          onClick={() => setIsRequestModalOpen(true)}
          className="h-10 px-4 bg-[#2E37A4] text-white text-[13px] font-bold rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-none self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Request Discharge
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-card border border-border p-3.5 rounded-lg shadow-none">
        <div className="relative w-full md:max-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-card border border-border rounded-lg text-[13px] font-medium outline-none focus:border-primary transition-all shadow-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-3">
          <CustomSelect
            value={wardFilter}
            onChange={setWardFilter}
            placeholder="Ward: All"
            options={wardOptions}
            minWidth="120px"
          />
          <CustomSelect
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="Status: All"
            options={statusOptions}
            minWidth="120px"
          />
        </div>
      </div>

      {/* Main View Area */}
      {loading ? (
        <div className="flex items-center justify-center p-8 bg-card border border-border rounded-lg">
          <p className="text-[13px] font-medium text-muted-foreground animate-pulse">Loading discharge requests...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center p-8 bg-card border border-border rounded-lg">
          <p className="text-[13px] font-medium text-destructive">Error loading requests: {error}</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="flex items-center justify-center p-8 bg-card border border-border rounded-lg">
          <p className="text-[13px] font-medium text-muted-foreground">No discharge requests found.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-card border border-border rounded-lg overflow-hidden shadow-none overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  <th className="px-6 py-5">Patient</th>
                  <th className="px-6 py-5">Ward / Bed</th>
                  <th className="px-6 py-5">Diagnosis</th>
                  <th className="px-6 py-5">Admission Date</th>
                  <th className="px-6 py-5">Requested By</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredRequests.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4 text-[13px] font-bold text-foreground">{item.patient}</td>
                    <td className="px-6 py-4 text-[13px] font-medium text-muted-foreground">{item.ward}</td>
                    <td className="px-6 py-4 text-[13px] font-medium text-muted-foreground">{item.diagnosis}</td>
                    <td className="px-6 py-4 text-[13px] font-medium text-muted-foreground">{item.date}</td>
                    <td className="px-6 py-4 text-[13px] font-medium text-muted-foreground">{item.requestedBy}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-3 py-1 rounded-lg text-[10px] font-bold tracking-wider",
                        item.status === "Pending" ? "bg-orange-50 dark:bg-orange-500/10 text-orange-600" : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600"
                      )}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <button 
                          onClick={() => handleViewRequest(item)}
                          className="h-9 w-9 bg-card border border-border rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted transition-all shadow-none outline-none group-hover:border-primary/30"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredRequests.map((item) => (
              <div key={item.id} className="bg-card border border-border p-4 rounded-lg space-y-4 shadow-none">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-[14px] font-bold text-foreground">{item.patient}</p>
                    <p className="text-[12px] font-medium text-muted-foreground">{item.ward}</p>
                  </div>
                  <span className={cn(
                    "px-2.5 py-0.5 rounded-lg text-[9px] font-bold tracking-wider uppercase",
                    item.status === "Pending" ? "bg-orange-50 dark:bg-orange-500/10 text-orange-600" : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600"
                  )}>
                    {item.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-y-4 gap-x-2 pt-3 border-t border-border">
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Diagnosis</p>
                    <p className="text-[12px] font-medium text-foreground">{item.diagnosis}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Admission</p>
                    <p className="text-[12px] font-medium text-foreground">{item.date}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Requested By</p>
                    <p className="text-[12px] font-medium text-foreground">{item.requestedBy}</p>
                  </div>
                  <div className="flex justify-end items-end">
                    <button 
                      onClick={() => handleViewRequest(item)}
                      className="h-9 w-9 bg-muted/50 rounded-lg flex items-center justify-center text-muted-foreground"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <DischargeDetailModal 
        isOpen={isPendingModalOpen} 
        onClose={() => setIsPendingModalOpen(false)} 
        data={selectedRequest}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      <ApprovedDischargeModal 
        isOpen={isApprovedModalOpen} 
        onClose={() => setIsApprovedModalOpen(false)} 
        data={selectedRequest}
      />

      <RequestDischargeModal 
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSuccess={fetchRequests}
      />

    </div>
  );
}
