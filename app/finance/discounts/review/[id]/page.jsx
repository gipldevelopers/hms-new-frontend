"use client";

import { useRouter, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  CalendarDays,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  MessageSquareText,
  Paperclip,
  ReceiptText,
  UserRound,
  X,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const rupee = "\u20B9"; // Indian Rupee symbol

// Mock data - in real app, this would come from API
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

function DiscountTypePill({ value }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#F1F3F4] px-[10px] py-[3px] text-[12px] font-medium text-[#5F6368] dark:bg-white/10 dark:text-slate-300">
      {value}
    </span>
  );
}

export default function ReviewDiscountPage() {
  const router = useRouter();
  const params = useParams();
  const requestId = params.id;

  // Find the request by ID
  const request = discountRequests.find(req => req.id === requestId);

  if (!request) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-[20px]">
        <h1 className="text-[20px] font-bold text-slate-800 dark:text-white mb-4">Request Not Found</h1>
        <Button onClick={() => router.push('/finance/discounts')} className="bg-[#2E37A4] hover:bg-[#2E37A4]/90">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Discounts
        </Button>
      </div>
    );
  }

  const statusStyles = {
    Approved: "bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6]",
    Pending: "bg-[#FEF7E0] text-[#B06000] border border-[#FEEFC3]",
    Rejected: "bg-[#FCE8E6] text-[#C5221F] border border-[#FAD2CF]",
  };

  const isPending = request.status === "Pending";

  const handleBack = () => {
    router.push('/finance/discounts');
  };

  const handleApprove = () => {
    console.log("Approved:", request.id);
    // Handle approval logic here
    router.push('/finance/discounts');
  };

  const handleReject = () => {
    console.log("Rejected:", request.id);
    // Handle rejection logic here
    router.push('/finance/discounts');
  };

  return (
    <div className="flex flex-col gap-0 min-h-screen bg-[#F8F9FC] dark:bg-[#0A0F1D]">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between border-b border-[#E7E8EB] bg-white px-[20px] py-[16px] dark:border-white/10 dark:bg-[#101935]">
        <div className="flex items-center gap-[10px]">
          <button
            type="button"
            onClick={handleBack}
            className="rounded-[5px] p-1.5 text-slate-400 hover:bg-[#F8F9FC] hover:text-slate-700 dark:hover:bg-white/10 transition cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-[16px] font-bold text-slate-800 dark:text-white">
            Request {request.id}
          </h2>
          <span className={cn("inline-flex items-center justify-center rounded-full px-[10px] py-[3px] text-[12px] font-semibold min-w-[76px]", statusStyles[request.status])}>
            {request.status}
          </span>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="overflow-y-auto p-[20px] flex flex-col gap-[16px]">
        {/* Summary */}
        <div className="rounded-[5px] border border-[#E7E8EB] bg-white p-[16px] dark:border-white/10 dark:bg-[#101935] flex flex-col gap-[14px]">
          <div className="flex items-center gap-2 text-[13px] font-bold text-slate-800 dark:text-white">
            <FileText className="h-4 w-4 text-[#2E37A4]" />
            <span>Request Summary</span>
          </div>
          <div className="grid gap-[14px] sm:grid-cols-2 md:grid-cols-4">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-slate-500">Requested By</span>
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-[10px] font-bold text-violet-700 shrink-0">
                  {request.requestedBy.replace("Dr.", "").trim().split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <span className="text-[13px] font-medium text-slate-700 dark:text-slate-300 truncate">{request.requestedBy}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-slate-500">Date & Time</span>
              <div className="flex items-center gap-1 text-[12px] font-medium text-slate-700 dark:text-slate-300">
                <CalendarDays className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span>{request.requestedAt}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-slate-500">Discount Type</span>
              <DiscountTypePill value={request.discountType} />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-slate-500">Requested Amount</span>
              <div className="flex items-center gap-1 text-[13px] font-bold text-[#2E37A4]">
                <span>{request.amount}</span>
                <span className="text-[11px] font-medium text-slate-400">({request.percentage})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Patient & Bill */}
        <div className="rounded-[5px] border border-[#E7E8EB] bg-white p-[16px] dark:border-white/10 dark:bg-[#101935] flex flex-col gap-[14px]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-[13px] font-bold text-slate-800 dark:text-white">
              <UserRound className="h-4 w-4 text-[#2E37A4]" />
              <span>Patient & Bill Details</span>
            </div>
            <button type="button" className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#2E37A4] hover:underline">
              <span>View Full Bill</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="rounded-[5px] border border-[#E7E8EB] bg-[#F8F9FC] p-[14px] flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-[12px] font-bold text-blue-700 shrink-0">
              {request.patientInitials}
            </div>
            <div>
              <p className="text-[13px] font-bold text-slate-800 dark:text-white">{request.patientName}</p>
              <p className="text-[11px] font-medium text-slate-500">{request.patientMeta}</p>
            </div>
          </div>
          <div className="flex flex-col gap-[10px] text-[13px]">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Bill Number</span>
              <span className="font-bold text-slate-800 dark:text-white">{request.billNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Gross Total</span>
              <span className="font-bold text-slate-800 dark:text-white">{request.grossTotal}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Proposed Discount</span>
              <span className="rounded-[4px] bg-blue-50 px-2 py-0.5 font-bold text-[#2E37A4]">{request.proposedDiscount}</span>
            </div>
            <div className="border-t border-[#E7E8EB] pt-[10px] flex justify-between items-center">
              <span className="text-[13px] font-bold text-slate-800 dark:text-white">Revised Net Payable</span>
              <span className="text-[16px] font-bold text-slate-800 dark:text-white">{request.revisedNetPayable}</span>
            </div>
          </div>
        </div>

        {/* Reason & Docs */}
        <div className="rounded-[5px] border border-[#E7E8EB] bg-white p-[16px] dark:border-white/10 dark:bg-[#101935] flex flex-col gap-[14px]">
          <div className="flex items-center gap-2 text-[13px] font-bold text-slate-800 dark:text-white">
            <ReceiptText className="h-4 w-4 text-[#2E37A4]" />
            <span>Reason & Documents</span>
          </div>
          <div className="rounded-[5px] border border-[#E7E8EB] bg-[#F8F9FC] p-[14px] text-[13px] font-medium italic leading-relaxed text-slate-500">
            &quot;{request.reason}&quot;
          </div>
          <div className="flex items-center justify-between gap-4 rounded-[5px] border border-[#E7E8EB] bg-white p-[14px]">
            <div className="flex items-center gap-3">
              <div className="rounded-[5px] bg-rose-50 p-2 shrink-0">
                <Paperclip className="h-4 w-4 text-rose-500" />
              </div>
              <div>
                <p className="text-[13px] font-bold text-slate-800 dark:text-white truncate">{request.documentName}</p>
                <p className="text-[11px] font-medium text-slate-400">{request.documentMeta}</p>
              </div>
            </div>
            <button type="button" className="rounded-[5px] border border-[#E7E8EB] p-2 text-slate-500 hover:bg-[#F8F9FC] hover:text-[#2E37A4] transition cursor-pointer" aria-label="Download">
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-[#E7E8EB] bg-white px-[20px] py-[14px] dark:border-white/10 dark:bg-[#101935]">
        <Button variant="outline" className="h-[36px] rounded-[5px] border-[#E7E8EB] bg-white px-4 text-[13px] font-semibold text-slate-700 hover:bg-[#F8F9FC] shadow-none cursor-pointer">
          <MessageSquareText className="mr-2 h-4 w-4 text-slate-500" />
          Request Info
        </Button>
        <div className="flex items-center gap-3">
          <Button variant="outline" disabled={!isPending} onClick={handleReject}
            className={cn("h-[36px] rounded-[5px] px-4 text-[13px] font-semibold shadow-none cursor-pointer",
              isPending ? "border-rose-200 bg-white text-rose-500 hover:bg-rose-50" : "border-slate-200 bg-slate-100 text-slate-400"
            )}>
            <XCircle className="mr-2 h-4 w-4" />
            Reject
          </Button>
          <Button disabled={!isPending} onClick={handleApprove}
            className={cn("h-[36px] rounded-[5px] px-4 text-[13px] font-semibold shadow-none cursor-pointer",
              isPending ? "bg-[#2E37A4] text-white hover:bg-[#2E37A4]/90" : "bg-slate-200 text-slate-400"
            )}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Approve
          </Button>
        </div>
      </div>
    </div>
  );
}
