"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  Eye,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const rupee = "\u20B9"; // Indian Rupee symbol

// Static Data
const discountRequests = [
  {
    id: "REQ-2023-891", patientName: "Robert Fox", billNumber: "INV-44200",
    discountType: "Hardship", amount: `${rupee}4500.00`, requestedBy: "Dr. Smith",
    status: "Approved", requestedAt: "Oct 15, 2023, 10:30 AM", percentage: "10%",
    patientInitials: "RF", patientMeta: "UHID: 882910 • Male • 45 Yrs",
    grossTotal: `${rupee}45,000.00`, proposedDiscount: `-${rupee}4,500.00`,
    revisedNetPayable: `${rupee}40,500.00`,
    reason: "Patient requested financial assistance due to sudden unemployment. Reviewed financial hardship form and supporting documents attached.",
    documentName: "Unemployment_Proof.pdf", documentMeta: "Oct 15, 2023 • 1.2 MB",
  },
  {
    id: "REQ-2023-892", patientName: "Alice Johnson", billNumber: "INV-44201",
    discountType: "Staff Family", amount: `${rupee}7500.00`, requestedBy: "Dr. Brown",
    status: "Pending", requestedAt: "Oct 16, 2023, 12:15 PM", percentage: "15%",
    patientInitials: "AJ", patientMeta: "UHID: 882911 • Female • 38 Yrs",
    grossTotal: `${rupee}50,000.00`, proposedDiscount: `-${rupee}7,500.00`,
    revisedNetPayable: `${rupee}42,500.00`,
    reason: "Staff family concession requested with employment proof and dependent verification attached for approval.",
    documentName: "Staff_Family_Request.pdf", documentMeta: "Oct 16, 2023 • 860 KB",
  },
  {
    id: "REQ-2023-893", patientName: "Michael Lee", billNumber: "INV-44202",
    discountType: "Self Pay", amount: `${rupee}3200.00`, requestedBy: "Dr. Taylor",
    status: "Rejected", requestedAt: "Oct 17, 2023, 09:10 AM", percentage: "8%",
    patientInitials: "ML", patientMeta: "UHID: 882912 • Male • 29 Yrs",
    grossTotal: `${rupee}40,000.00`, proposedDiscount: `-${rupee}3,200.00`,
    revisedNetPayable: `${rupee}36,800.00`,
    reason: "Self-pay discount requested after follow-up consultation. Submitted remarks were found incomplete during review.",
    documentName: "SelfPay_Statement.pdf", documentMeta: "Oct 17, 2023 • 740 KB",
  },
  {
    id: "REQ-2023-894", patientName: "Emma Wilson", billNumber: "INV-44203",
    discountType: "Corporate", amount: `${rupee}6000.00`, requestedBy: "Dr. Davis",
    status: "Approved", requestedAt: "Oct 18, 2023, 04:45 PM", percentage: "12%",
    patientInitials: "EW", patientMeta: "UHID: 882913 • Female • 51 Yrs",
    grossTotal: `${rupee}50,000.00`, proposedDiscount: `-${rupee}6,000.00`,
    revisedNetPayable: `${rupee}44,000.00`,
    reason: "Corporate billing adjustment raised after employer benefit slab confirmation from the finance team.",
    documentName: "Corporate_Approval.pdf", documentMeta: "Oct 18, 2023 • 1.0 MB",
  },
  {
    id: "REQ-2023-895", patientName: "James Smith", billNumber: "INV-44204",
    discountType: "Hardship", amount: `${rupee}5000.00`, requestedBy: "Dr. Garcia",
    status: "Pending", requestedAt: "Oct 19, 2023, 11:00 AM", percentage: "10%",
    patientInitials: "JS", patientMeta: "UHID: 882914 • Male • 61 Yrs",
    grossTotal: `${rupee}50,000.00`, proposedDiscount: `-${rupee}5,000.00`,
    revisedNetPayable: `${rupee}45,000.00`,
    reason: "Hardship request initiated after emergency admission and family income declaration review.",
    documentName: "Income_Declaration.pdf", documentMeta: "Oct 19, 2023 • 1.4 MB",
  },
  {
    id: "REQ-2023-896", patientName: "Olivia Martinez", billNumber: "INV-44205",
    discountType: "Staff Family", amount: `${rupee}4200.00`, requestedBy: "Dr. Hernandez",
    status: "Approved", requestedAt: "Oct 20, 2023, 03:25 PM", percentage: "7%",
    patientInitials: "OM", patientMeta: "UHID: 882915 • Female • 33 Yrs",
    grossTotal: `${rupee}60,000.00`, proposedDiscount: `-${rupee}4,200.00`,
    revisedNetPayable: `${rupee}55,800.00`,
    reason: "Dependent staff-family benefit applied after HR verification and coverage confirmation.",
    documentName: "HR_Verification.pdf", documentMeta: "Oct 20, 2023 • 930 KB",
  },
  {
    id: "REQ-2023-897", patientName: "William Johnson", billNumber: "INV-44206",
    discountType: "Staff Family", amount: `${rupee}5500.00`, requestedBy: "Dr. Wilson",
    status: "Rejected", requestedAt: "Oct 21, 2023, 01:05 PM", percentage: "11%",
    patientInitials: "WJ", patientMeta: "UHID: 882916 • Male • 42 Yrs",
    grossTotal: `${rupee}50,000.00`, proposedDiscount: `-${rupee}5,500.00`,
    revisedNetPayable: `${rupee}44,500.00`,
    reason: "Requested family-discount slab exceeded policy limit and was sent back for revision.",
    documentName: "Family_Discount_Request.pdf", documentMeta: "Oct 21, 2023 • 1.1 MB",
  },
  {
    id: "REQ-2023-898", patientName: "Sophia Brown", billNumber: "INV-44207",
    discountType: "Hardship", amount: `${rupee}3000.00`, requestedBy: "Dr. Lee",
    status: "Approved", requestedAt: "Oct 22, 2023, 08:40 AM", percentage: "6%",
    patientInitials: "SB", patientMeta: "UHID: 882917 • Female • 27 Yrs",
    grossTotal: `${rupee}50,000.00`, proposedDiscount: `-${rupee}3,000.00`,
    revisedNetPayable: `${rupee}47,000.00`,
    reason: "Financial-aid request reviewed with submitted hardship note and outpatient billing summary.",
    documentName: "Hardship_Note.pdf", documentMeta: "Oct 22, 2023 • 680 KB",
  },
];

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

  const filteredRows = useMemo(() => {
    return discountRequests.filter((req) => {
      const matchesSearch = 
        req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.billNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" || req.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

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
        <DiscountTable rows={filteredRows} />
      </div>
    </div>
  );
}
