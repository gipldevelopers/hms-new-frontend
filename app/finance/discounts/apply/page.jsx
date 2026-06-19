"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  FinanceSearchField,
  FinanceSelect,
} from "@/components/finance/FinancePageChrome";
import {
  ArrowRight,
  CircleX,
  UploadCloud,
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

const discountTypeOptions = ["Hardship / Financial Aid", "Corporate", "Staff Family", "Self Pay"];
const approverOptions = [
  "Dr. Sarah Smith (Director)",
  "Dr. James Wilson (Finance Head)",
  "Dr. Emily Taylor (Medical Superintendent)",
];

export default function ApplyDiscountPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    discountType: "Hardship / Financial Aid",
    approver: "Dr. Sarah Smith (Director)",
    percentage: "10",
    reason: "Patient requested financial assistance due to sudden unemployment. Reviewed financial hardship form and supporting documents attached.",
  });

  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [billSearch, setBillSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/billing/all-payments`, { headers: getAuthHeaders() });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || `Error ${res.status}`);
      setBills(json.data);
    } catch (e) {
      console.error("fetchBills error:", e);
      setError("Failed to fetch bill records. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredBills = useMemo(() => {
    if (!billSearch) return bills;
    const q = billSearch.toLowerCase();
    return bills.filter(b => 
      (b.patient && b.patient.toLowerCase().includes(q)) ||
      (b.invoiceId && b.invoiceId.toLowerCase().includes(q)) ||
      (b.uhid && b.uhid.toLowerCase().includes(q))
    );
  }, [bills, billSearch]);

  const calculatedAmount = useMemo(() => {
    if (!selectedBill) return `${rupee}0.00`;
    const billTotal = parseFloat(selectedBill.totalAmount.replace(/[^\d.]/g, "")) || 0;
    const percentage = parseFloat(form.percentage) || 0;
    const amount = (billTotal * percentage) / 100;
    return `${rupee}${amount.toFixed(2)}`;
  }, [selectedBill, form.percentage]);

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    router.push('/finance/discounts');
  };

  const handleSubmit = async () => {
    if (!selectedBill) {
      alert("Please select a bill first.");
      return;
    }
    const pct = parseFloat(form.percentage) || 0;
    if (pct <= 0 || pct > 100) {
      alert("Please enter a valid discount percentage (between 0.1% and 100%).");
      return;
    }
    const billTotal = parseFloat(selectedBill.totalAmount.replace(/[^\d.]/g, "")) || 0;
    const discountAmount = (billTotal * pct) / 100;

    try {
      setSubmitting(true);
      setError(null);

      // Prepend category to the reason
      const reasonWithCategory = `[${form.discountType}] ${form.reason}`;

      const body = {
        billId: selectedBill.billId,
        discountType: "PERCENTAGE",
        discountValue: pct,
        discountAmount,
        reason: reasonWithCategory
      };

      const res = await fetch(`${API_BASE}/billing/discounts`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(body)
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || `Error ${res.status}`);

      router.push('/finance/discounts');
    } catch (e) {
      console.error("Submit discount error:", e);
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-[20px] p-[20px] sm:p-[24px]">
      {/* Page title */}
      <div>
        <h1 className="text-[20px] font-bold text-slate-800 dark:text-white leading-none">Apply Discount</h1>
      </div>

      {/* Search Bill or Patient */}
      <div className="flex flex-col gap-[8px] relative">
        <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Search Bill or Patient</label>
        <div className="relative">
          <FinanceSearchField
            value={billSearch}
            onChange={(val) => {
              setBillSearch(val);
              setShowDropdown(true);
            }}
            placeholder="Search bill by name, invoice ID or UHID..."
            className="w-full sm:w-full"
          />
          <CircleX 
            className="absolute right-[14px] top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 cursor-pointer" 
            onClick={() => {
              setBillSearch("");
              setSelectedBill(null);
            }}
          />
        </div>

        {showDropdown && filteredBills.length > 0 && (
          <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-[#E7E8EB] bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:border-white/10 dark:bg-[#101935] sm:text-sm top-[70px]">
            {filteredBills.map((b) => (
              <div
                key={b.billId}
                className="relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-[#F8F9FC] dark:hover:bg-white/5"
                onClick={() => {
                  setSelectedBill(b);
                  setBillSearch(`${b.invoiceId} - ${b.patient}`);
                  setShowDropdown(false);
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="block truncate font-medium text-slate-800 dark:text-white">
                    {b.invoiceId} - {b.patient} ({b.uhid})
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold">
                    Total: {b.totalAmount} • Due: {b.dueAmount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bill info card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 rounded-[5px] border border-[#E7E8EB] bg-[#F8F9FC] divide-y sm:divide-y-0 sm:divide-x divide-[#E7E8EB] dark:border-white/10 dark:bg-white/5 dark:divide-white/10">
        <div className="px-[20px] py-[16px] flex flex-col gap-[4px]">
          <span className="text-[11px] font-semibold text-slate-400 tracking-wide">PATIENT NAME</span>
          <span className="text-[15px] font-bold text-slate-800 dark:text-white">
            {selectedBill ? selectedBill.patient : "—"}
          </span>
          <span className="text-[12px] text-slate-500">
            {selectedBill ? `UHID: ${selectedBill.uhid}` : "Select a bill to start"}
          </span>
        </div>
        <div className="px-[20px] py-[16px] flex flex-col gap-[4px]">
          <span className="text-[11px] font-semibold text-slate-400 tracking-wide">BILL NUMBER</span>
          <span className="text-[15px] font-bold text-slate-800 dark:text-white">
            {selectedBill ? selectedBill.invoiceId : "—"}
          </span>
          <span className="text-[12px] text-slate-500">
            {selectedBill ? selectedBill.date : "—"}
          </span>
        </div>
        <div className="px-[20px] py-[16px] flex flex-col gap-[4px]">
          <span className="text-[11px] font-semibold text-slate-400 tracking-wide">BILL TOTAL</span>
          <span className="text-[15px] font-bold text-slate-800 dark:text-white">
            {selectedBill ? selectedBill.totalAmount : "—"}
          </span>
          <span className="text-[12px] text-slate-500">
            {selectedBill ? `Balance: ${selectedBill.dueAmount}` : "—"}
          </span>
        </div>
      </div>

      {error && (
        <div className="rounded-[5px] border border-rose-200 bg-rose-50 p-4 text-[13px] font-medium text-rose-600">
          {error}
        </div>
      )}

      {/* Discount Details section */}
      <div className="flex flex-col gap-[20px]">
        <h2 className="text-[15px] font-bold text-slate-800 dark:text-white">Discount Details</h2>

        {/* Row 1: Discount Type + Request Approval From */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px]">
          <div className="flex flex-col gap-[8px]">
            <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Discount Type</label>
            <FinanceSelect
              value={form.discountType}
              onChange={(val) => handleFieldChange("discountType", val)}
              placeholder="Select discount type"
              options={discountTypeOptions.map((o) => ({ label: o, value: o }))}
              className="w-full sm:w-full h-[44px]"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Request Approval From</label>
            <FinanceSelect
              value={form.approver}
              onChange={(val) => handleFieldChange("approver", val)}
              placeholder="Select approver"
              options={approverOptions.map((o) => ({ label: o, value: o }))}
              className="w-full sm:w-full h-[44px]"
            />
          </div>
        </div>

        {/* Row 2: Discount Value + Calculated Amount */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px]">
          <div className="flex flex-col gap-[8px]">
            <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Discount Value</label>
            <div className="flex h-[44px] overflow-hidden rounded-[5px] border border-[#E7E8EB] dark:border-white/10">
              <div className="flex items-center border-r border-[#E7E8EB] bg-[#F8F9FC] px-[14px] text-[13px] text-slate-500 font-medium shrink-0 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
                Percentage (%)
              </div>
              <input
                type="number"
                value={form.percentage}
                onChange={(e) => handleFieldChange("percentage", e.target.value)}
                className="h-full w-full bg-white px-[14px] text-[13px] text-slate-800 outline-none dark:bg-[#101935] dark:text-white"
              />
            </div>
          </div>

          <div className="flex flex-col gap-[8px]">
            <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Calculated Amount</label>
            <input
              type="text"
              value={calculatedAmount}
              readOnly
              className="h-[44px] w-full rounded-[5px] border border-[#E7E8EB] bg-[#F8F9FC] px-[14px] text-[13px] font-medium text-slate-500 outline-none dark:border-white/10 dark:bg-white/5 dark:text-slate-400"
            />
          </div>
        </div>

        {/* Reason / Remarks */}
        <div className="flex flex-col gap-[8px]">
          <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Reason / Remarks</label>
          <textarea
            value={form.reason}
            onChange={(e) => handleFieldChange("reason", e.target.value)}
            rows={4}
            className="w-full rounded-[5px] border border-[#E7E8EB] bg-white px-[14px] py-[12px] text-[13px] text-slate-800 outline-none focus:border-[#2E37A4] transition resize-none dark:border-white/10 dark:bg-[#101935] dark:text-white"
          />
        </div>

        {/* Supporting Documents */}
        <div className="flex flex-col gap-[8px]">
          <label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Supporting Documents (Optional)</label>
          <div className="flex flex-col items-center justify-center py-[40px] rounded-[5px] border border-dashed border-[#E7E8EB] bg-white text-center cursor-pointer dark:border-white/10 dark:bg-[#101935]">
            <div className="mb-[10px] flex h-10 w-10 items-center justify-center rounded-full border border-[#E7E8EB] bg-white dark:border-white/10 dark:bg-[#101935]">
              <UploadCloud className="h-5 w-5 text-[#2E37A4]" />
            </div>
            <p className="text-[13px] text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-[#2E37A4] hover:underline cursor-pointer">Click to upload</span>
              {" "}or drag and drop
            </p>
            <p className="mt-[4px] text-[12px] text-slate-400">PDF, JPG, PNG up to 10MB</p>
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex items-center justify-end gap-[12px] pt-[4px] pb-[8px]">
        <button
          type="button"
          onClick={handleCancel}
          disabled={submitting}
          className="h-[38px] px-[20px] rounded-[5px] border border-[#E7E8EB] bg-white text-[13px] font-semibold text-slate-700 hover:bg-[#F8F9FC] transition cursor-pointer dark:border-white/10 dark:bg-[#101935] dark:text-white disabled:opacity-50"
        >
          Cancel
        </button>
        <Button
          onClick={handleSubmit}
          disabled={submitting || loading || !selectedBill}
          className="h-[38px] rounded-[5px] bg-[#2E37A4] px-[20px] text-[13px] font-semibold text-white hover:bg-[#2E37A4]/90 shadow-none cursor-pointer disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Request"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
