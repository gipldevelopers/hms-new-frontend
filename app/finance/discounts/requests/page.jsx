"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  Eye,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const rupee = "\u20B9"; // Indian Rupee symbol

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

function getAuthHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("authtoken") : "";
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function mapDiscountRequest(req) {
  const p = req.bill?.patient;
  const patientName = p
    ? `${p.firstName || ""} ${p.lastName || ""}`.trim() || p.name || "Unknown"
    : "Unknown";
  const patientInitials = patientName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "UN";

  const age = p?.age || "N/A";
  const gender = p?.gender || "N/A";
  const uhid = p ? `UHID-${p.id.substring(0, 6).toUpperCase()}` : "—";
  const patientMeta = `UHID: ${uhid.replace("UHID-", "")} • ${gender} • ${age} Yrs`;

  const statusMap = {
    PENDING: "Pending",
    APPROVED: "Approved",
    REJECTED: "Rejected",
  };
  const status = statusMap[req.status] || req.status;

  const discountTypeMap = {
    PERCENTAGE: "Percentage",
    FLAT: "Flat",
  };
  const discountType = req.discountType === "PERCENTAGE" || req.discountType === "FLAT"
    ? discountTypeMap[req.discountType]
    : req.discountType;

  const grossTotal = req.bill?.subtotal || 0;
  const proposedDiscount = req.discountAmount || 0;
  const revisedNetPayable = Math.max(0, grossTotal - proposedDiscount);

  const formattedDate = new Date(req.createdAt).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return {
    id: req.id,
    patientName,
    patientInitials,
    patientMeta,
    billNumber: req.billId,
    discountType,
    amount: `${rupee}${proposedDiscount.toFixed(2)}`,
    percentage: req.discountType === "PERCENTAGE" ? `${req.discountValue}%` : "Flat",
    requestedBy: req.requestedBy || "Dr. Attending",
    status,
    requestedAt: formattedDate,
    grossTotal: `${rupee}${grossTotal.toFixed(2)}`,
    proposedDiscount: `-${rupee}${proposedDiscount.toFixed(2)}`,
    revisedNetPayable: `${rupee}${revisedNetPayable.toFixed(2)}`,
    reason: req.reason || "No reason provided",
    documentName: "Supporting_Doc.pdf",
    documentMeta: `${formattedDate.split(",")[0]} • 500 KB`,
    raw: req
  };
}

const statusOptions = ["All", "Approved", "Pending", "Rejected"];

// Components
function StatusPill({ status }) {
  const styles = {
    Approved: "bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6]",
    Pending: "bg-[#FEF7E0] text-[#B06000] border border-[#FEEFC3]",
    Rejected: "bg-[#FCE8E6] text-[#C5221F] border border-[#FAD2CF]",
  };
  return (
    <span className={cn(
      "inline-flex items-center justify-center rounded-full px-[10px] py-[3px] text-[12px] font-semibold min-w-[76px]",
      styles[status] || "bg-slate-100 text-slate-600 border border-slate-200"
    )}>
      {status}
    </span>
  );
}

function DiscountTypePill({ value }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#F1F3F4] px-[10px] py-[3px] text-[12px] font-medium text-[#5F6368] dark:bg-white/10 dark:text-slate-300">
      {value}
    </span>
  );
}

function SimpleDropdown({ value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o === value) || options[0];
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-[38px] min-w-[80px] items-center gap-[6px] rounded-[5px] border border-[#E7E8EB] bg-white px-[12px] text-[13px] font-medium text-slate-700 outline-none hover:border-[#2E37A4]/40 transition cursor-pointer dark:border-white/10 dark:bg-[#101935] dark:text-white"
      >
        <span>{selected}</span>
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 z-20 min-w-[110px] rounded-[5px] border border-[#E7E8EB] bg-white py-1 dark:border-white/10 dark:bg-[#101935]">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => { onChange(opt); setOpen(false); }}
                className={cn(
                  "flex w-full items-center px-[12px] py-[7px] text-left text-[13px] font-medium text-slate-700 hover:bg-[#F8F9FC] transition dark:text-white dark:hover:bg-white/5",
                  opt === value && "text-[#2E37A4] font-semibold bg-[#F8F9FC] dark:bg-white/5"
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function DiscountTable({ rows }) {
  const router = useRouter();
  
  const handleReview = (req) => {
    router.push(`/finance/discounts/review/${req.id}`);
  };
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-[#E7E8EB] bg-white dark:bg-[#101935]">
            <th className="px-[20px] py-[14px] text-left text-[12px] font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">Request ID</th>
            <th className="px-[20px] py-[14px] text-left text-[12px] font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">Patient Name</th>
            <th className="px-[20px] py-[14px] text-left text-[12px] font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">Bill Number</th>
            <th className="px-[20px] py-[14px] text-left text-[12px] font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">Discount Type</th>
            <th className="px-[20px] py-[14px] text-left text-[12px] font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">Amount</th>
            <th className="px-[20px] py-[14px] text-left text-[12px] font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">Requested by</th>
            <th className="px-[20px] py-[14px] text-left text-[12px] font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">Status</th>
            <th className="px-[20px] py-[14px] text-center text-[12px] font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-[20px] py-[40px] text-center text-[13px] font-medium text-slate-400">
                No discount requests match your search.
              </td>
            </tr>
          ) : (
            rows.map((req) => (
              <tr key={req.id} className="border-b border-[#E7E8EB] last:border-0 hover:bg-[#F8F9FC] dark:hover:bg-white/5 transition-colors">
                <td className="whitespace-nowrap px-[20px] py-[14px] text-[13px] font-bold text-slate-800 dark:text-white">{req.id}</td>
                <td className="whitespace-nowrap px-[20px] py-[14px] text-[13px] font-medium text-slate-700 dark:text-slate-300">{req.patientName}</td>
                <td className="whitespace-nowrap px-[20px] py-[14px] text-[13px] font-medium text-slate-700 dark:text-slate-300">{req.billNumber}</td>
                <td className="whitespace-nowrap px-[20px] py-[14px]"><DiscountTypePill value={req.discountType} /></td>
                <td className="whitespace-nowrap px-[20px] py-[14px] text-[13px] font-medium text-slate-700 dark:text-slate-300">{req.amount}</td>
                <td className="whitespace-nowrap px-[20px] py-[14px] text-[13px] font-medium text-slate-700 dark:text-slate-300">{req.requestedBy}</td>
                <td className="whitespace-nowrap px-[20px] py-[14px]"><StatusPill status={req.status} /></td>
                <td className="px-[20px] py-[14px]">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleReview(req)}
                      className="h-[32px] px-[14px] rounded-[5px] bg-[#2E37A4] text-white text-[12px] font-semibold hover:bg-[#2E37A4]/90 transition cursor-pointer flex items-center gap-1"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Review
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// Main Page
export default function DiscountRequestsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/billing/discounts`, { headers: getAuthHeaders() });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || `Error ${res.status}`);
      setRequests(json.data.map(mapDiscountRequest));
    } catch (e) {
      console.error("fetchRequests error:", e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredRows = useMemo(() => {
    return requests.filter((req) => {
      const matchesSearch = 
        (req.id && req.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (req.patientName && req.patientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (req.billNumber && req.billNumber.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === "All" || req.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [requests, searchTerm, statusFilter]);

  const handleBack = () => {
    router.push('/finance/discounts');
  };

  return (
    <div className="flex flex-col gap-[20px] p-[20px] sm:p-[24px]">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-[18px] font-bold text-slate-800 dark:text-white leading-none">Discount Request List</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleBack}
            className="h-[36px] rounded-[5px] border-[#2E37A4] px-[14px] text-[13px] font-semibold text-[#2E37A4] hover:bg-[#2E37A4]/5 shadow-none cursor-pointer">
            Back
          </Button>
          <Button className="h-[36px] rounded-[5px] bg-[#2E37A4] px-[14px] text-[13px] font-semibold text-white hover:bg-[#2E37A4]/90 shadow-none cursor-pointer">
            Bulk Approve
          </Button>
        </div>
      </div>

      {/* Table card */}
      <div className="rounded-[5px] border border-[#E7E8EB] bg-white dark:border-white/10 dark:bg-[#101935]">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-[20px] py-[14px] border-b border-[#E7E8EB] dark:border-white/10">
          <div className="relative w-full sm:w-[240px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              placeholder="Search..."
              className="h-[36px] w-full rounded-[5px] border border-[#E7E8EB] bg-[#F8F9FC] pl-9 pr-4 text-[13px] text-slate-800 placeholder-slate-400 outline-none hover:border-[#2E37A4]/30 focus:border-[#2E37A4] transition dark:border-white/10 dark:bg-[#0A0F1D] dark:text-white" 
            />
          </div>
          <SimpleDropdown value={statusFilter} onChange={setStatusFilter} options={statusOptions} />
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-[60px] text-[13px] text-slate-500 font-medium">
            <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-[#2E37A4] rounded-full"></span>
            Loading discount requests...
          </div>
        ) : error ? (
          <div className="py-[60px] text-center text-rose-500 font-medium text-[13px]">
            {error}
          </div>
        ) : (
          <DiscountTable rows={filteredRows} />
        )}
      </div>
    </div>
  );
}
