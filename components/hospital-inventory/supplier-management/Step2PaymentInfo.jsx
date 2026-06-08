"use client";

import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";

export function Step2PaymentInfo({ data, onChange, onNext, onBack }) {
  const [formData, setFormData] = useState({
    bankName: data.bankName || "",
    accountNumber: data.accountNumber || "",
    ifscCode: data.ifscCode || "",
    accountType: data.accountType || "",
    branchName: data.branchName || "",
    paymentType: data.paymentType || "",
    taxCategory: data.taxCategory || "",
    panNumber: data.panNumber || ""
  });

  const handleChange = (field, val) => {
    const updated = { ...formData, [field]: val };
    setFormData(updated);
    if (onChange) onChange(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onNext) onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Bank Details Header */}
      <div>
        <h3 className="text-[14px] font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-3">
          Bank Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Bank Name */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-slate-700 dark:text-slate-350">
              Bank Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter Bank Name"
              value={formData.bankName}
              onChange={(e) => handleChange("bankName", e.target.value)}
              className="w-full h-10 px-3 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-[#2E37A4]"
              required
            />
          </div>

          {/* Account Number */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-slate-700 dark:text-slate-350">
              Account Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter Account Number"
              value={formData.accountNumber}
              onChange={(e) => handleChange("accountNumber", e.target.value)}
              className="w-full h-10 px-3 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-[#2E37A4]"
              required
            />
          </div>

          {/* IFSC Code */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-slate-700 dark:text-slate-350">
              IFSC Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter IFSC Code"
              value={formData.ifscCode}
              onChange={(e) => handleChange("ifscCode", e.target.value)}
              className="w-full h-10 px-3 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-[#2E37A4]"
              required
            />
          </div>

          {/* Account Type */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-slate-700 dark:text-slate-350">
              Account Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.accountType}
              onChange={(e) => handleChange("accountType", e.target.value)}
              className="w-full h-10 px-3 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-[#2E37A4] cursor-pointer"
              required
            >
              <option value="">Select Account Type</option>
              <option value="Savings">Savings Account</option>
              <option value="Current">Current Account</option>
            </select>
          </div>

          {/* Branch Name */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-slate-700 dark:text-slate-350">
              Branch Name <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.branchName}
              onChange={(e) => handleChange("branchName", e.target.value)}
              className="w-full h-10 px-3 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-[#2E37A4] cursor-pointer"
              required
            >
              <option value="">Select Branch</option>
              <option value="New Delhi">New Delhi Central</option>
              <option value="Mumbai">Mumbai Fort</option>
              <option value="Bengaluru">Bengaluru Whitefield</option>
              <option value="Chennai">Chennai OMR</option>
            </select>
          </div>

          {/* Payment Type */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-slate-700 dark:text-slate-350">
              Payment Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.paymentType}
              onChange={(e) => handleChange("paymentType", e.target.value)}
              className="w-full h-10 px-3 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-[#2E37A4] cursor-pointer"
              required
            >
              <option value="">Select Payment Type</option>
              <option value="NEFT">NEFT Transfer</option>
              <option value="RTGS">RTGS Transfer</option>
              <option value="IMPS">IMPS Instant</option>
              <option value="Cheque">Bank Cheque</option>
            </select>
          </div>

        </div>
      </div>

      {/* Tax & Compliance Header */}
      <div>
        <h3 className="text-[14px] font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-3">
          Tax & Compliance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Tax Category */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-slate-700 dark:text-slate-350">
              Tax Category <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.taxCategory}
              onChange={(e) => handleChange("taxCategory", e.target.value)}
              className="w-full h-10 px-3 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-[#2E37A4] cursor-pointer"
              required
            >
              <option value="">Select Category</option>
              <option value="GST Registered">GST Registered</option>
              <option value="GST Composition">GST Composition</option>
              <option value="Non-GST">Non-GST Vendor</option>
            </select>
          </div>

          {/* PAN Number */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-slate-700 dark:text-slate-350">
              PAN Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter PAN number"
              value={formData.panNumber}
              onChange={(e) => handleChange("panNumber", e.target.value)}
              className="w-full h-10 px-3 bg-white dark:bg-[#0A0F1D] border border-[#e2e8f0] dark:border-[#334155] rounded-[5px] text-[13px] font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-[#2E37A4]"
              required
            />
          </div>

        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[#e2e8f0] dark:border-[#334155] pt-4 flex justify-between items-center">
        {/* Back Button */}
        <button
          type="button"
          onClick={onBack}
          className="h-10 px-4 rounded-[5px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[12px] font-bold text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-750 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-none"
        >
          <ArrowLeft size={14} /> Back
        </button>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNext(formData)}
            className="h-10 px-5 rounded-[5px] border border-[#2E37A4] text-[12px] font-bold text-[#2E37A4] hover:bg-slate-50 transition cursor-pointer shadow-none"
          >
            Save Draft
          </button>
          <button
            type="submit"
            className="h-10 px-5 rounded-[5px] bg-[#2E37A4] hover:bg-[#232a7d] text-[12px] font-bold text-white transition cursor-pointer shadow-none"
          >
            Save & Next
          </button>
        </div>
      </div>

    </form>
  );
}
export default Step2PaymentInfo;
